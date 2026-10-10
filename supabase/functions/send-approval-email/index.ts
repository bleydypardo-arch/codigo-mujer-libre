// Supabase Edge Function: send-approval-email
// Sends the "you are approved" email (ES/EN, with the orchid) to ONE approved member, through Resend.
//
// SECURITY
//  - The Resend key lives ONLY in a Supabase secret named RESEND_API_KEY (never in the website code).
//  - Every call must carry a logged-in user's token AND that user must be admin/super_admin in `profiles`.
//  - It only ever emails a profile that is a "member" and is currently approved, at the address saved in that profile.
//  - By default each woman gets this email once (approval_emailed_at). The admin can resend on purpose (force: true).
//  - Nothing here changes approval, roles or any other member data.
//
// Body: { "user_id": "<uuid>", "force": false }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const FROM = Deno.env.get("APPROVAL_FROM") ?? "Código Mujer Libre <hola@codigomujerlibre.com>";
const REPLY_TO = Deno.env.get("APPROVAL_REPLY_TO") ?? "hola@codigomujerlibre.com";
const APP_URL = Deno.env.get("APP_URL") ?? "https://bleydypardo-arch.github.io/codigo-mujer-libre/";
const IMG_URL = Deno.env.get("APPROVAL_IMAGE_URL") ?? "https://bleydypardo-arch.github.io/codigo-mujer-libre/email/orchid-email.png";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type Lang = "es" | "en";
const T: Record<Lang, Record<string, string>> = {
  es: {
    subject: "Ya eres parte de Código Mujer Libre 🌸",
    pre: "Tu solicitud fue aprobada. Entra cuando quieras.",
    alt: "Orquídea de Código Mujer Libre",
    head: "Bienvenida a Código Mujer Libre",
    hi: "Hola",
    p1: "Tu solicitud fue aprobada. Ya eres parte de una comunidad hecha para ti, para conectar, vivir y crecer entre mujeres.",
    p2: "Entra con el correo y la contraseña que creaste al registrarte.",
    cta: "Entrar a la comunidad",
    tipH: "Para volver con un toque",
    tip: "Guarda la app en la pantalla de inicio de tu teléfono y entra como a cualquier otra app. Te mostramos cómo dentro de la comunidad.",
    fall: "¿El botón no abre? Copia este enlace en tu navegador:",
    q: "¿Dudas? Responde este correo, te leemos con cariño.",
    bye: "Con cariño,",
    foot: "Recibes este correo porque te registraste en Código Mujer Libre.",
  },
  en: {
    subject: "You are now part of Código Mujer Libre 🌸",
    pre: "Your application was approved. Come in whenever you like.",
    alt: "Código Mujer Libre orchid",
    head: "Welcome to Código Mujer Libre",
    hi: "Hi",
    p1: "Your application was approved. You are now part of a community made for you, to connect, live and grow among women.",
    p2: "Log in with the email and password you created when you signed up.",
    cta: "Enter the community",
    tipH: "To come back with one tap",
    tip: "Save the app to your phone’s home screen and open it like any other app. We show you how inside the community.",
    fall: "Button not working? Copy this link into your browser:",
    q: "Questions? Just reply to this email, we read every message with care.",
    bye: "With love,",
    foot: "You are receiving this email because you signed up for Código Mujer Libre.",
  },
};

function render(lang: Lang, firstName: string): { subject: string; html: string; text: string } {
  const t = T[lang];
  const name = firstName.trim() ? esc(firstName.trim()) : (lang === "en" ? "there" : "");
  const greet = name ? `${t.hi} ${name},` : `${t.hi},`;
  const url = esc(APP_URL);
  const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(t.subject)}</title></head>
<body style="margin:0;padding:0;background:#F6ECE9;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#F6ECE9;">${esc(t.pre)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6ECE9;"><tr><td align="center" style="padding:28px 14px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFDFC;border-radius:22px;overflow:hidden;border:1px solid #EDE0DC;">
<tr><td align="center" style="background:#FADBD8;background-image:linear-gradient(180deg,#FBE3E0 0%,#FFF1EE 100%);padding:34px 24px 12px;">
<img src="${esc(IMG_URL)}" width="150" height="150" alt="${esc(t.alt)}" style="display:block;border:0;width:150px;height:150px;"></td></tr>
<tr><td align="center" style="background:#FFF1EE;padding:4px 32px 30px;border-bottom:1px solid #F3DDD8;">
<div style="font-family:Georgia,'Times New Roman',serif;font-size:27px;line-height:1.25;color:#7E3A44;font-weight:normal;">${esc(t.head)}</div>
<div style="width:46px;height:2px;background:#DBC19F;margin:16px auto 0;"></div></td></tr>
<tr><td style="padding:30px 36px 6px;font-family:Georgia,'Times New Roman',serif;color:#272525;">
<p style="margin:0 0 14px;font-size:18px;line-height:1.5;">${greet}</p>
<p style="margin:0 0 14px;font-size:16.5px;line-height:1.65;">${esc(t.p1)}</p>
<p style="margin:0 0 4px;font-size:16.5px;line-height:1.65;">${esc(t.p2)}</p></td></tr>
<tr><td align="center" style="padding:20px 36px 8px;">
<a href="${url}" style="display:inline-block;background:#B85F68;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;text-decoration:none;padding:15px 34px;border-radius:999px;">${esc(t.cta)}</a></td></tr>
<tr><td style="padding:22px 36px 6px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F0E8;border-radius:14px;"><tr><td style="padding:16px 20px;font-family:Arial,Helvetica,sans-serif;">
<div style="font-size:14px;font-weight:bold;color:#9C7B4E;margin-bottom:4px;">${esc(t.tipH)}</div>
<div style="font-size:14px;line-height:1.55;color:#4a4545;">${esc(t.tip)}</div></td></tr></table></td></tr>
<tr><td style="padding:18px 36px 0;font-family:Arial,Helvetica,sans-serif;font-size:12.5px;line-height:1.5;color:#7a7373;">${esc(t.fall)}<br><a href="${url}" style="color:#9E4D56;word-break:break-all;">${url}</a></td></tr>
<tr><td style="padding:26px 36px 32px;font-family:Georgia,'Times New Roman',serif;color:#272525;">
<p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:#4a4545;">${esc(t.q)}</p>
<p style="margin:0;font-size:16px;line-height:1.5;">${esc(t.bye)}<br><span style="color:#B85F68;font-size:18px;">Código Mujer Libre</span></p></td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;"><tr><td align="center" style="padding:16px 20px 0;font-family:Arial,Helvetica,sans-serif;font-size:11.5px;line-height:1.5;color:#8c8282;">${esc(t.foot)}</td></tr></table>
</td></tr></table></body></html>`;
  const text = [greet, "", t.p1, t.p2, "", `${t.cta}: ${APP_URL}`, "", t.q, "", t.bye, "Código Mujer Libre"].join("\n");
  return { subject: t.subject, html, text };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const url = Deno.env.get("SUPABASE_URL");
  const anon = Deno.env.get("SUPABASE_ANON_KEY");
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!url || !anon || !service) return json({ error: "not_configured" }, 503);
  if (!resendKey) return json({ error: "not_configured" }, 503);

  // 1) Who is calling? Must be a logged-in admin.
  const auth = req.headers.get("Authorization") ?? "";
  const asCaller = createClient(url, anon, { global: { headers: { Authorization: auth } } });
  const { data: u } = await asCaller.auth.getUser();
  if (!u?.user) return json({ error: "unauthorized" }, 401);
  const admin = createClient(url, service);
  const { data: me } = await admin.from("profiles").select("role").eq("id", u.user.id).maybeSingle();
  if (!me || !["admin", "super_admin"].includes(me.role)) return json({ error: "forbidden" }, 403);

  // 2) Which member? Must be an approved ordinary member.
  let body: { user_id?: string; force?: boolean } = {};
  try { body = await req.json(); } catch { /* empty */ }
  const id = typeof body.user_id === "string" ? body.user_id : "";
  if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ error: "bad_request" }, 400);
  const { data: p } = await admin.from("profiles")
    .select("id,email,first_name,role,approved,rejected,application,approval_emailed_at").eq("id", id).maybeSingle();
  if (!p || p.role !== "member" || !p.approved || p.rejected) return json({ error: "not_approved_member" }, 409);
  if (!p.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p.email)) return json({ error: "no_email" }, 422);
  if (p.approval_emailed_at && body.force !== true) return json({ ok: true, already_sent: true });

  // 3) Send through Resend.
  const lang: Lang = p.application?.lang === "en" ? "en" : "es";
  const mail = render(lang, p.first_name ?? "");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [p.email], reply_to: REPLY_TO, subject: mail.subject, html: mail.html, text: mail.text }),
  });
  if (!res.ok) {
    console.error("resend error", res.status, (await res.text()).slice(0, 300));
    return json({ error: "send_failed" }, 502);
  }
  await admin.from("profiles").update({ approval_emailed_at: new Date().toISOString() }).eq("id", p.id);
  return json({ ok: true });
});
