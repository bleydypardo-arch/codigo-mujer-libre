// Supabase Edge Function: daily-reminder
// Cada mañana avisa por correo a las mujeres que HOY tienen un "Mensaje de hoy" (o su cumpleaños): "Tienes un mensaje en Código ML".
// - Lo dispara el reloj de Supabase (pg_cron) con una clave secreta (CRON_SECRET). Nadie más puede dispararlo.
// - Usa los mismos mensajes que la app (tabla settings, clave "daily_notes") y las mismas reglas de ciudad:
//   los mensajes de esferas/premios y los firmados por Karen son SOLO para Bogotá.
// - Envía por Resend (la misma clave RESEND_API_KEY del correo de aprobación). Tope de seguridad: 90 correos por corrida.
// - Prueba sin enviar: body {"dry": true}. Prueba a un solo correo: body {"only": "tu@correo.com"}.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const FROM = Deno.env.get("APPROVAL_FROM") ?? "Código Mujer Libre <hola@codigomujerlibre.com>";
const REPLY_TO = Deno.env.get("APPROVAL_REPLY_TO") ?? "hola@codigomujerlibre.com";
const APP_URL = Deno.env.get("APP_URL") ?? "https://bleydypardo-arch.github.io/codigo-mujer-libre/";
const IMG_URL = Deno.env.get("APPROVAL_IMAGE_URL") ?? "https://bleydypardo-arch.github.io/codigo-mujer-libre/email/orchid-email.png";
const MAX = 90;
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { "Content-Type": "application/json" } });
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const ckey = (v: string) => String(v || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z]/g, "");

const T = {
  es: {
    note: { subject: "💌 Tienes un mensaje en Código ML", head: "Tienes un mensaje para hoy", p: "Hay un mensaje esperándote dentro de tu app. Entra y léelo, te va a gustar.", cta: "Abrir mi mensaje" },
    bday: { subject: "🎂 ¡Feliz cumpleaños! Tienes un regalo en Código ML", head: "¡Feliz cumpleaños!", p: "Hoy es tu día y preparamos un ramo de flores para ti. Entra a la app para abrirlo.", cta: "Abrir mi regalo" },
    foot: "Recibes este correo porque eres parte de Código Mujer Libre. Si no quieres estos avisos, responde a este correo y los quitamos.",
    hi: "Hola", bye: "Con cariño,",
  },
  en: {
    note: { subject: "💌 You have a message in Código ML", head: "You have a message for today", p: "There is a message waiting for you inside your app. Come in and read it, you will like it.", cta: "Open my message" },
    bday: { subject: "🎂 Happy birthday! You have a gift in Código ML", head: "Happy birthday!", p: "Today is your day and we prepared a bouquet for you. Open the app to see it.", cta: "Open my gift" },
    foot: "You receive this email because you are part of Código Mujer Libre. If you do not want these notices, reply to this email and we will remove you.",
    hi: "Hi", bye: "With love,",
  },
};

function render(lang: "es" | "en", kind: "note" | "bday", name: string) {
  const t = T[lang], k = t[kind], greet = name ? `${t.hi} ${esc(name)},` : `${t.hi},`;
  const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(k.subject)}</title></head>
<body style="margin:0;padding:0;background:#F6ECE9;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6ECE9;"><tr><td align="center" style="padding:28px 14px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FFFDFC;border-radius:22px;overflow:hidden;border:1px solid #EDE0DC;">
<tr><td align="center" style="background:#FFF1EE;padding:28px 24px 8px;"><img src="${esc(IMG_URL)}" width="110" height="110" alt="Código Mujer Libre" style="display:block;border:0;width:110px;height:110px;"></td></tr>
<tr><td align="center" style="background:#FFF1EE;padding:4px 28px 24px;"><div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.25;color:#7E3A44;">${esc(k.head)}</div></td></tr>
<tr><td style="padding:26px 32px 6px;font-family:Georgia,'Times New Roman',serif;color:#272525;"><p style="margin:0 0 12px;font-size:18px;">${greet}</p><p style="margin:0;font-size:16.5px;line-height:1.6;">${esc(k.p)}</p></td></tr>
<tr><td align="center" style="padding:20px 32px 8px;"><a href="${esc(APP_URL)}" style="display:inline-block;background:#B85F68;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;text-decoration:none;padding:14px 32px;border-radius:999px;">${esc(k.cta)}</a></td></tr>
<tr><td style="padding:18px 32px 26px;font-family:Georgia,'Times New Roman',serif;color:#272525;"><p style="margin:0;font-size:16px;">${esc(t.bye)}<br><span style="color:#B85F68;font-size:18px;">Código Mujer Libre</span></p></td></tr>
</table><div style="max-width:520px;padding:14px 20px 0;font-family:Arial,Helvetica,sans-serif;font-size:11.5px;line-height:1.5;color:#8a8282;">${esc(t.foot)}</div></td></tr></table></body></html>`;
  return { subject: k.subject, html, text: `${greet}\n\n${k.p}\n\n${k.cta}: ${APP_URL}\n\n${t.bye}\nCódigo Mujer Libre` };
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  const secret = Deno.env.get("CRON_SECRET");
  if (!secret || req.headers.get("x-cron-secret") !== secret) return json({ error: "unauthorized" }, 401);
  const url = Deno.env.get("SUPABASE_URL"), service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"), resendKey = Deno.env.get("RESEND_API_KEY");
  if (!url || !service || !resendKey) return json({ error: "not_configured" }, 503);
  let body: { dry?: boolean; only?: string } = {};
  try { body = await req.json(); } catch { /* empty */ }

  const db = createClient(url, service);
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date()); // YYYY-MM-DD
  const [, mm, dd] = today.split("-").map(Number);
  const { data: s } = await db.from("settings").select("value").eq("key", "daily_notes").maybeSingle();
  const notes = Object.values((s?.value ?? {}) as Record<string, { day: string; city?: string; es?: string; en?: string; from?: string }>).filter((n) => n.day === today && n.es);
  const bogotaOnly = (n: { es?: string; en?: string; from?: string }) => /esfera|sphere|ticket|premios de las/i.test((n.es ?? "") + " " + (n.en ?? "")) || /karen/i.test(n.from ?? "");

  const { data: ppl } = await db.from("profiles").select("id,email,first_name,city,role,approved,rejected,birth_month,birth_day,application,notif_prefs").eq("approved", true);
  let sent = 0, skipped = 0, failed = 0; const would: string[] = [];
  for (const p of ppl ?? []) {
    if (p.rejected || !p.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p.email)) { skipped++; continue; }
    if (p.notif_prefs?.email === false) { skipped++; continue; }
    if (body.only && p.email.toLowerCase() !== body.only.toLowerCase()) continue;
    const city = ckey(p.city ?? "");
    const mine = notes.filter((n) => (!n.city || ckey(n.city) === city) && (!bogotaOnly(n) || city === "bogota"));
    const bday = p.birth_month === mm && p.birth_day === dd;
    if (!bday && !mine.length && !body.only) { skipped++; continue; }
    if (sent >= MAX) break;
    const lang = p.application?.lang === "en" ? "en" : "es";
    const mail = render(lang, bday ? "bday" : "note", p.first_name ?? "");
    if (body.dry) { would.push(`${p.first_name ?? ""} <${p.email}> ${bday ? "cumpleaños" : "mensaje"}`); sent++; continue; }
    const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [p.email], reply_to: REPLY_TO, subject: mail.subject, html: mail.html, text: mail.text }) });
    if (r.ok) sent++; else { failed++; console.error("resend", r.status, (await r.text()).slice(0, 200)); }
  }
  return json({ ok: true, today, dry: !!body.dry, sent, skipped, failed, would });
});
