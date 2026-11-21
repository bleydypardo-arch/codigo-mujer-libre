// Supabase Edge Function: daily-reminder
// Cada mañana avisa por correo a las mujeres que HOY tienen un "Mensaje de hoy" (o su cumpleaños): "Tienes un mensaje en Código ML".
// - Lo dispara el reloj de Supabase (pg_cron) con una clave secreta guardada en la tabla privada cron_secrets. Nadie más puede dispararlo.
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

// 40 correos distintos (20 de Jazz + 14 nuevos + 6 «¿Sabías que…?»). Cada día se elige uno distinto; nunca el mismo dos días seguidos.
const VARS: [string, string][] = [
  ["Hoy quiero regalarte un minuto 🌸", "Entre tantas cosas que haces por los demás, ¿cuándo fue la última vez que dedicaste un momento solo para ti?\n\nHoy tenemos unas palabras especiales esperándote."],
  ["Quizás hoy necesitabas leer esto 💗", "Hay días en los que una sola frase puede cambiar nuestra manera de mirar la vida.\n\nDescubre la reflexión que preparamos para ti."],
  ["Antes de comenzar tu día… ☀️", "No corras todavía.\n\nRegálate un minuto de calma, inspiración y fe.\n\nTu mensaje de hoy ya te está esperando."],
  ["Una palabra para tu corazón 🤍", "No sabemos cómo amaneciste hoy, pero queremos acompañarte con unas palabras que te inviten a encontrar paz."],
  ["Hoy también puedes florecer 🌷", "Cada día trae su propia oportunidad de crecer.\n\nEntra y descubre qué queremos compartir contigo esta mañana."],
  ["¿Y si hoy te sorprendes a ti misma? ✨", "A veces olvidamos lo que somos capaces de hacer.\n\nHoy queremos recordarte algo importante."],
  ["Tu pausa bonita del día 🦋", "No todo tiene que ser trabajo, pendientes y responsabilidades.\n\nTambién mereces un instante para alimentar tu interior."],
  ["Hay algo que queremos recordarte 💌", "En medio de las ocupaciones, hay cosas importantes que dejamos de escuchar.\n\nTu reflexión de hoy puede ayudarte a recordarlas."],
  ["Comienza con fe, continúa con esperanza 🙏", "Antes de enfrentar los desafíos de hoy, encuentra un pequeño espacio para fortalecer tu espíritu."],
  ["Una mujer como tú merece escuchar esto 🌸", "Tu esfuerzo, tus sueños y tu historia tienen valor.\n\nHoy preparamos una reflexión para acompañarte."],
  ["Tu corazón también necesita descansar 🤍", "A veces cuidamos de todo y olvidamos nuestro propio bienestar.\n\nHoy te invitamos a regalarte unos minutos."],
  ["Hoy queremos hablarte de tus sueños ✨", "Esos proyectos que guardas en el corazón también merecen atención.\n\nDescubre el mensaje que elegimos para este día."],
  ["No estás caminando sola 💗", "En Código Mujer Libre creemos en el poder de acompañarnos.\n\nHoy tenemos una reflexión para compartir contigo."],
  ["Una pequeña dosis de esperanza 🌻", "No necesitas tener todas las respuestas esta mañana.\n\nA veces basta con encontrar una nueva perspectiva."],
  ["¿Qué necesita hoy tu alma? 🌷", "Quizás tranquilidad, confianza, gratitud o un poco de ánimo.\n\nVen a descubrir nuestra reflexión del día."],
  ["Hoy es un buen día para creer en ti 🦋", "Tus talentos y capacidades merecen espacio para crecer.\n\nTenemos unas palabras para inspirarte."],
  ["Tu bienestar también importa 🌿", "Cuidar de ti no debería ser lo último de tu lista.\n\nDedica un momento a escuchar lo que tu interior necesita."],
  ["Hay belleza en los nuevos comienzos 🌸", "No importa cómo terminó ayer.\n\nHoy tienes una nueva oportunidad de construir algo valioso."],
  ["Un mensaje para la mujer que eres 💕", "Más allá de tus responsabilidades, hay una mujer con sueños, virtudes y una historia única.\n\nHoy queremos celebrarla."],
  ["Comienza el día con propósito ✨", "Antes de dejarte llevar por la rutina, te invitamos a encontrar un instante de fe, reflexión e inspiración."],
  ["Alguien pensó en ti hoy 💌", "Hay algo esperándote dentro de tu app.\n\nTómate un minuto para descubrirlo."],
  ["Un momento solo para ti 🌸", "Respira hondo.\n\nTu mensaje de hoy ya está listo."],
  ["Hoy te dejamos algo ✨", "Es corto y está hecho con cariño.\n\nEntra y descúbrelo."],
  ["Respira, esto es para ti 🌿", "Antes de seguir con tu día, detente un instante.\n\nTu mensaje de hoy te está esperando."],
  ["Una palabra para tu día 💛", "Léela con calma, antes de que se llene la agenda."],
  ["Tu comunidad te escribió 🦋", "Pasa a ver qué te dejamos hoy.\n\nSon unos segundos y valen la pena."],
  ["Con tu café de hoy ☕", "Acompaña tu primer sorbo con un mensaje pensado para ti."],
  ["Hoy también cuentas tú 🌼", "Tantas cosas por hacer, y hoy también cuentas tú.\n\nEntra a descubrir tu mensaje."],
  ["Para ti, sin prisa 🤍", "No hay que correr.\n\nTu mensaje te espera cuando tengas un momento."],
  ["Una sonrisa te espera 🌷", "Entra y mira lo que preparamos para esta mañana."],
  ["Un respiro de fe 🙏", "Unas palabras para fortalecer tu corazón hoy."],
  ["Quizás justo lo que necesitabas oír 💫", "A veces una sola frase es lo que le faltaba al día.\n\nEntra y descubre la de hoy."],
  ["Cada paso tuyo cuenta 🌅", "Buenos días, valiente.\n\nMira lo que hay para ti hoy."],
  ["Paz para tu mañana 🕊️", "Un mensaje corto para empezar el día con calma."],
  ["¿Sabías que puedes tener tu propia tienda virtual? 🛍️", "Si eres emprendedora, en Código Mujer Libre podemos crear tu tienda virtual.\n\nEntra y descubre cómo."],
  ["¿Sabías que tenemos los eventos de tu ciudad? 🗓️", "Todos en un solo lugar.\n\nRevisa la sección Eventos y elige el que más te guste."],
  ["¿Sabías que aquí tú eres lo importante? 💗", "Creamos este espacio para ti: para respirar, sentirte acompañada y recordar cuánto vales.\n\nEntra, hoy es tu momento."],
  ["¿Sabías que cinco minutos pueden cambiar tu día? 🌿", "Dentro de la app puedes regalarte unos minutos de calma.\n\nEntra y respira."],
  ["¿Sabías que puedes invitar a otra mujer a ir contigo? 💌", "Elige un restaurante o un evento y escríbele a otra mujer de la comunidad: ¿vamos?\n\nAsí es más bonito ir acompañada."],
  ["¿Sabías que aquí encuentras planes para ti? 🍽️", "Restaurantes, experiencias y eventos recomendados.\n\nEntra y elige tu próximo plan."],
];
const dayVar = (today: string) => { const [y, m, d] = today.split("-").map(Number); const n = Math.floor(Date.UTC(y, m - 1, d) / 86400000); return VARS[(n * 13) % VARS.length]; }; // 13 y 40 no comparten divisores: recorre las 40 y nunca repite seguido
const BOGOTA_ES = "🎁 ¿Ya atrapaste tu esfera de hoy? Recuerda que el 15 de diciembre es el Gran Premio. Cada esfera cuenta. ¡Atrápala!"; // SOLO mujeres de Bogotá

function render(lang: "es" | "en", kind: "note" | "bday", name: string, v?: [string, string], bogota = false) {
  const t = T[lang];
  const k = (kind === "note" && lang === "es" && v) ? { subject: v[0], head: v[0], p: v[1], cta: "🌸 DESCUBRIR MI MENSAJE DE HOY" } : t[kind];
  const paras = k.p.split("\n\n").map((x: string) => `<p style="margin:0 0 12px;font-size:16.5px;line-height:1.6;">${esc(x)}</p>`).join("");
  const bog = (bogota && lang === "es" && kind === "note") ? `<tr><td style="padding:6px 32px 0;"><div style="background:#FFF1EE;border-radius:14px;padding:14px 16px;font-family:Georgia,'Times New Roman',serif;font-size:15.5px;line-height:1.55;color:#7E3A44;">${esc(BOGOTA_ES)}</div></td></tr>` : "";
  const greet = name ? `${t.hi} ${esc(name)},` : `${t.hi},`;
  const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(k.subject)}</title></head>
<body style="margin:0;padding:0;background:#F6ECE9;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6ECE9;"><tr><td align="center" style="padding:28px 14px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FFFDFC;border-radius:22px;overflow:hidden;border:1px solid #EDE0DC;">
<tr><td align="center" style="background:#FFF1EE;padding:28px 24px 8px;"><img src="${esc(IMG_URL)}" width="110" height="110" alt="Código Mujer Libre" style="display:block;border:0;width:110px;height:110px;"></td></tr>
<tr><td align="center" style="background:#FFF1EE;padding:4px 28px 24px;"><div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.25;color:#7E3A44;">${esc(k.head)}</div></td></tr>
<tr><td style="padding:26px 32px 6px;font-family:Georgia,'Times New Roman',serif;color:#272525;"><p style="margin:0 0 12px;font-size:18px;">${greet}</p>${paras}</td></tr>${bog}
<tr><td align="center" style="padding:20px 32px 8px;"><a href="${esc(APP_URL)}" style="display:inline-block;background:#B85F68;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;text-decoration:none;padding:14px 32px;border-radius:999px;">${esc(k.cta)}</a></td></tr>
<tr><td style="padding:18px 32px 26px;font-family:Georgia,'Times New Roman',serif;color:#272525;"><p style="margin:0;font-size:16px;">${esc(t.bye)}<br><span style="color:#B85F68;font-size:18px;">Código ML</span></p></td></tr>
</table><div style="max-width:520px;padding:14px 20px 0;font-family:Arial,Helvetica,sans-serif;font-size:11.5px;line-height:1.5;color:#8a8282;">${esc(t.foot)}</div></td></tr></table></body></html>`;
  return { subject: k.subject, html, text: `${greet}\n\n${k.p}${bog ? "\n\n" + BOGOTA_ES : ""}\n\n${k.cta}: ${APP_URL}\n\n${t.bye}\nCódigo ML` };
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  const url = Deno.env.get("SUPABASE_URL"), service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"), resendKey = Deno.env.get("RESEND_API_KEY");
  if (!url || !service || !resendKey) return json({ error: "not_configured" }, 503);
  const db = createClient(url, service);
  // La clave del reloj vive en una tabla privada (cron_secrets) que ninguna usuaria puede leer.
  const { data: sec } = await db.from("cron_secrets").select("value").eq("name", "daily_reminder").maybeSingle();
  const given = req.headers.get("x-cron-secret");
  if (!sec?.value || !given || given !== sec.value) return json({ error: "unauthorized" }, 401);
  let body: { dry?: boolean; only?: string } = {};
  try { body = await req.json(); } catch { /* empty */ }

  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date()); // YYYY-MM-DD
  const [, mm, dd] = today.split("-").map(Number);

  const { data: ppl } = await db.from("profiles").select("id,email,first_name,city,role,approved,rejected,birth_month,birth_day,application,notif_prefs").eq("approved", true);
  let sent = 0, skipped = 0, failed = 0; const would: string[] = [];
  for (const p of ppl ?? []) {
    if (p.rejected || !p.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p.email)) { skipped++; continue; }
    if (p.notif_prefs?.email === false) { skipped++; continue; }
    if (body.only && p.email.toLowerCase() !== body.only.toLowerCase()) continue;
    const city = ckey(p.city ?? "");
    const bday = p.birth_month === mm && p.birth_day === dd;
    if (sent >= MAX) break;
    const lang = p.application?.lang === "en" ? "en" : "es";
    const mail = render(lang, bday ? "bday" : "note", p.first_name ?? "", dayVar(today), city === "bogota");
    if (body.dry) { would.push(`${p.first_name ?? ""} <${p.email}> ${bday ? "cumpleaños" : "mensaje"}${city === "bogota" ? " +esfera" : ""}`); sent++; continue; }
    const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [p.email], reply_to: REPLY_TO, subject: mail.subject, html: mail.html, text: mail.text }) });
    if (r.ok) sent++; else { failed++; console.error("resend", r.status, (await r.text()).slice(0, 200)); }
  }
  return json({ ok: true, today, dry: !!body.dry, sent, skipped, failed, would });
});
