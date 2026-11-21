// Supabase Edge Function: daily-reminder
// Cada mañana avisa por correo a las mujeres que HOY tienen un "Mensaje de hoy" (o su cumpleaños): "Tienes un mensaje en Código ML".
// - Lo dispara el reloj de Supabase (pg_cron) con una clave secreta guardada en la tabla privada cron_secrets. Nadie más puede dispararlo.
// - Usa los mismos mensajes que la app (tabla settings, clave "daily_notes") y las mismas reglas de ciudad:
//   los mensajes de esferas/premios y los firmados por Karen son SOLO para Bogotá.
// - Envía por Resend (la misma clave RESEND_API_KEY del correo de aprobación). Tope de seguridad: 90 correos por corrida.
// - Envía 4 días por semana (domingo, lunes, miércoles y viernes, hora Bogotá); los cumpleaños siempre. Las mujeres en inglés reciben las 40 variantes en inglés.
// - Prueba sin enviar: body {"dry": true}. Prueba a un solo correo: body {"only": "tu@correo.com"}.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const FROM = Deno.env.get("APPROVAL_FROM") ?? "Código Mujer Libre <hola@codigomujerlibre.com>";
const REPLY_TO = Deno.env.get("APPROVAL_REPLY_TO") ?? "hola@codigomujerlibre.com";
const APP_URL = Deno.env.get("APP_URL") ?? "https://bleydypardo-arch.github.io/codigo-mujer-libre/";
const IMG_URL = Deno.env.get("APPROVAL_IMAGE_URL") ?? "https://bleydypardo-arch.github.io/codigo-mujer-libre/email/orchid-email.png";
const MAX = 90;
const SPHERE_END = "2026-12-12"; // hasta este día (Bogotá) la esfera y el Gran Premio; después, impulso de tiendas virtuales
const ORLANDO = ["orlando", "wintergarden", "clermont", "altamontesprings"]; // Orlando y alrededores: solo 2 correos por semana (lun y vie) mientras Jazz viaja
const STORE_ES = "🛍️ ¿Tienes un negocio o conoces a una emprendedora? Aquí puede tener su tienda virtual. ¡Mira cómo se ve!";
const STORE_EN = "🛍️ Do you have a business or know a woman entrepreneur? She can have her virtual store here. See how it looks!";
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
type Var = [string, string, [string, string]?]; // [asunto, texto, [rótulo, enlace] opcional]
const DEMO_TIENDAS = "https://bleydypardo-arch.github.io/codigo-mujer-libre/boutiques/centro.html?lang=es"; // demo público del centro comercial virtual (no es Admin)
const VARS: Var[] = [
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
  ["¿Sabías que puedes tener tu propia tienda virtual? 🛍️", "Si eres emprendedora, en Código Mujer Libre podemos crear tu tienda virtual.\n\nMira cómo se ve el demo y entra a descubrir cómo.", ["🛍️ VER EL DEMO DE LAS TIENDAS", DEMO_TIENDAS]],
  ["¿Sabías que tenemos los eventos de tu ciudad? 🗓️", "Todos en un solo lugar.\n\nRevisa la sección Eventos y elige el que más te guste."],
  ["¿Sabías que aquí tú eres lo importante? 💗", "Creamos este espacio para ti: para respirar, sentirte acompañada y recordar cuánto vales.\n\nEntra, hoy es tu momento."],
  ["¿Sabías que cinco minutos pueden cambiar tu día? 🌿", "Dentro de la app puedes regalarte unos minutos de calma.\n\nEntra y respira."],
  ["¿Sabías que puedes invitar a otra mujer a ir contigo? 💌", "Elige un restaurante o un evento y escríbele a otra mujer de la comunidad: ¿vamos?\n\nAsí es más bonito ir acompañada."],
  ["¿Sabías que aquí encuentras planes para ti? 🍽️", "Restaurantes, experiencias y eventos recomendados.\n\nEntra y elige tu próximo plan."],
];

const DEMO_TIENDAS_EN = "https://bleydypardo-arch.github.io/codigo-mujer-libre/boutiques/centro.html?lang=en";
// Las mismas 40 en inglés (mismo orden) para las mujeres que se registraron en inglés.
const VARS_EN: Var[] = [
  ["Today, I want to give you a minute 🌸", "Between everything you do for everyone else, when was the last time you took a moment just for yourself?\n\nWe have something special waiting for you today."],
  ["Maybe this is exactly what you needed to read today 💗", "Some days, a single sentence can change the way we see life.\n\nDiscover the reflection we have prepared for you."],
  ["Before you begin your day… ☀️", "Don't rush just yet.\n\nGive yourself a minute of peace, inspiration, and faith.\n\nToday's message is waiting for you."],
  ["A little something for your heart 🤍", "We don't know how you woke up this morning, but we would love to share a few words to help you find a moment of peace."],
  ["Today is another chance to bloom 🌷", "Every day brings a new opportunity to grow.\n\nCome discover what we have prepared to share with you this morning."],
  ["What if today you surprise yourself? ✨", "Sometimes we forget just how much we are capable of.\n\nToday, we want to remind you of something important."],
  ["Your little moment of peace today 🦋", "Life doesn't have to be all work, responsibilities, and endless to-do lists.\n\nYou deserve a moment to nourish your soul, too."],
  ["There's something we want you to remember 💌", "In the middle of our busy lives, we sometimes forget to listen to the things that matter most.\n\nToday's reflection may help you remember."],
  ["Begin with faith. Keep going with hope. 🙏", "Before facing today's challenges, take a moment to strengthen your spirit."],
  ["A woman like you deserves to hear this 🌸", "Your efforts, your dreams, and your story matter.\n\nToday, we have prepared a reflection just for you."],
  ["Your heart deserves a little rest, too 🤍", "Sometimes we take care of everything and everyone, forgetting our own well-being.\n\nToday, we invite you to take a few moments for yourself."],
  ["Today, we want to talk about your dreams ✨", "Those dreams and projects you carry in your heart deserve your attention, too.\n\nDiscover the message we have chosen for today."],
  ["You are not walking alone 💗", "At Código Mujer Libre, we believe in the power of women supporting one another.\n\nToday, we have a special reflection to share with you."],
  ["A little dose of hope 🌻", "You don't need to have all the answers this morning.\n\nSometimes, all you need is a fresh perspective."],
  ["What does your soul need today? 🌷", "Maybe a little peace, confidence, gratitude, or encouragement.\n\nCome discover today's reflection."],
  ["Today is a good day to believe in yourself 🦋", "Your talents and abilities deserve room to grow.\n\nWe have a few words to inspire you today."],
  ["Your well-being matters, too 🌿", "Taking care of yourself should never be the last thing on your list.\n\nTake a moment to listen to what your heart and mind need."],
  ["There is beauty in new beginnings 🌸", "It doesn't matter how yesterday ended.\n\nToday brings another opportunity to build something meaningful."],
  ["A message for the woman you are 💕", "Beyond all your responsibilities, there is a woman with dreams, values, virtues, and a story uniquely her own.\n\nToday, we celebrate you."],
  ["Begin your day with purpose ✨", "Before getting caught up in your daily routine, take a moment for faith, reflection, and inspiration."],
  ["Someone thought of you today 💌", "There is something waiting for you inside your app.\n\nTake a minute to discover it."],
  ["A moment just for you 🌸", "Take a deep breath.\n\nYour message for today is ready."],
  ["We left you something today ✨", "It's short and made with love.\n\nCome in and discover it."],
  ["Breathe, this is for you 🌿", "Before you go on with your day, pause for a moment.\n\nYour message for today is waiting for you."],
  ["A word for your day 💛", "Read it slowly, before your schedule fills up."],
  ["Your community wrote to you 🦋", "Come see what we left for you today.\n\nIt takes a few seconds and it's worth it."],
  ["With your coffee today ☕", "Enjoy your first sip with a message made for you."],
  ["Today you count too 🌼", "So many things to do, and today you count too.\n\nCome in and discover your message."],
  ["For you, no rush 🤍", "There's no need to hurry.\n\nYour message is waiting whenever you have a moment."],
  ["A smile is waiting for you 🌷", "Come in and see what we prepared for this morning."],
  ["A breath of faith 🙏", "A few words to strengthen your heart today."],
  ["Maybe just what you needed to hear 💫", "Sometimes a single sentence is what your day was missing.\n\nCome in and discover today's."],
  ["Every step you take counts 🌅", "Good morning, brave one.\n\nSee what's here for you today."],
  ["Peace for your morning 🕊️", "A short message to start the day with calm."],
  ["Did you know you can have your own virtual store? 🛍️", "If you're an entrepreneur, at Código Mujer Libre we can create your virtual store.\n\nSee what the demo looks like and come discover how.", ["🛍️ SEE THE STORES DEMO", DEMO_TIENDAS_EN]],
  ["Did you know we have your city's events? 🗓️", "All in one place.\n\nCheck the Events section and pick the one you like most."],
  ["Did you know that here, you are what matters? 💗", "We created this space for you: to breathe, feel accompanied and remember how much you are worth.\n\nCome in, today is your moment."],
  ["Did you know five minutes can change your day? 🌿", "Inside the app you can give yourself a few minutes of calm.\n\nCome in and breathe."],
  ["Did you know you can invite another woman to go with you? 💌", "Pick a restaurant or an event and write to another woman in the community: shall we go?\n\nIt's nicer to go with company."],
  ["Did you know you can find plans for you here? 🍽️", "Restaurants, experiences and events we recommend.\n\nCome in and pick your next plan."],
];
const dayIdx = (today: string) => { const [y, m, d] = today.split("-").map(Number); const n = Math.floor(Date.UTC(y, m - 1, d) / 86400000); return (n * 13) % VARS.length; }; // 13 y 40 no comparten divisores: recorre las 40 y nunca repite seguido
const BOGOTA_EN = "🎁 Have you caught today's sphere yet? Remember the Grand Prize is on December 15. Every sphere counts. Catch it!"; // ONLY women in Bogotá
const BOGOTA_ES = "🎁 ¿Ya atrapaste tu esfera de hoy? Recuerda que el 15 de diciembre es el Gran Premio. Cada esfera cuenta. ¡Atrápala!"; // SOLO mujeres de Bogotá

function render(lang: "es" | "en", kind: "note" | "bday", name: string, v?: Var, bogota = false, store = false) {
  const t = T[lang];
  const k = (kind === "note" && v) ? { subject: v[0], head: v[0], p: v[1], cta: lang === "es" ? "🌸 DESCUBRIR MI MENSAJE DE HOY" : "🌸 DISCOVER TODAY'S MESSAGE" } : t[kind];
  const BOG = store ? (lang === "es" ? STORE_ES : STORE_EN) : (lang === "es" ? BOGOTA_ES : BOGOTA_EN);
  const paras = k.p.split("\n\n").map((x: string) => `<p style="margin:0 0 12px;font-size:16.5px;line-height:1.6;">${esc(x)}</p>`).join("");
  const bog = ((bogota || store) && kind === "note") ? `<tr><td style="padding:6px 32px 0;"><div style="background:#FFF1EE;border-radius:14px;padding:14px 16px;font-family:Georgia,'Times New Roman',serif;font-size:15.5px;line-height:1.55;color:#7E3A44;">${esc(BOG)}</div></td></tr>` : "";
  const ex = (kind === "note" && v && v[2]) ? v[2] : ((store && kind === "note") ? (lang === "es" ? ["🛍️ VER EL DEMO DE LAS TIENDAS", DEMO_TIENDAS] : ["🛍️ SEE THE STORES DEMO", DEMO_TIENDAS_EN]) as [string, string] : null);
  const extra = ex ? `<tr><td align="center" style="padding:6px 32px 8px;"><a href="${esc(ex[1])}" style="display:inline-block;border:2px solid #B85F68;color:#B85F68;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;text-decoration:none;padding:12px 28px;border-radius:999px;">${esc(ex[0])}</a></td></tr>` : "";
  const greet = name ? `${t.hi} ${esc(name)},` : `${t.hi},`;
  const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(k.subject)}</title></head>
<body style="margin:0;padding:0;background:#F6ECE9;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6ECE9;"><tr><td align="center" style="padding:28px 14px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FFFDFC;border-radius:22px;overflow:hidden;border:1px solid #EDE0DC;">
<tr><td align="center" style="background:#FFF1EE;padding:28px 24px 8px;"><img src="${esc(IMG_URL)}" width="110" height="110" alt="Código Mujer Libre" style="display:block;border:0;width:110px;height:110px;"></td></tr>
<tr><td align="center" style="background:#FFF1EE;padding:4px 28px 24px;"><div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.25;color:#7E3A44;">${esc(k.head)}</div></td></tr>
<tr><td style="padding:26px 32px 6px;font-family:Georgia,'Times New Roman',serif;color:#272525;"><p style="margin:0 0 12px;font-size:18px;">${greet}</p>${paras}</td></tr>${bog}
<tr><td align="center" style="padding:20px 32px 8px;"><a href="${esc(APP_URL)}" style="display:inline-block;background:#B85F68;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;text-decoration:none;padding:14px 32px;border-radius:999px;">${esc(k.cta)}</a></td></tr>${extra}
<tr><td style="padding:18px 32px 26px;font-family:Georgia,'Times New Roman',serif;color:#272525;"><p style="margin:0;font-size:16px;">${esc(t.bye)}<br><span style="color:#B85F68;font-size:18px;">Código ML</span></p></td></tr>
</table><div style="max-width:520px;padding:14px 20px 0;font-family:Arial,Helvetica,sans-serif;font-size:11.5px;line-height:1.5;color:#8a8282;">${esc(t.foot)}</div></td></tr></table></body></html>`;
  return { subject: k.subject, html, text: `${greet}\n\n${k.p}${bog ? "\n\n" + BOG : ""}\n\n${k.cta}: ${APP_URL}${ex ? "\n\n" + ex[0] + ": " + ex[1] : ""}\n\n${t.bye}\nCódigo ML` };
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
  const [yy, mm, dd] = today.split("-").map(Number);
  const dow = new Date(Date.UTC(yy, mm - 1, dd)).getUTCDay(); // día de la semana en Bogotá: 0 domingo, 1 lunes, 3 miércoles, 5 viernes
  const sendDay4 = [0, 1, 3, 5].includes(dow), sendDay2 = [1, 5].includes(dow); // 4 correos por semana: lunes, miércoles, viernes y domingo. Los cumpleaños salen siempre.

  const { data: ppl } = await db.from("profiles").select("id,email,first_name,city,role,approved,rejected,birth_month,birth_day,application,notif_prefs").eq("approved", true);
  const sphereOn = today <= SPHERE_END;
  const promoDay = [1, 5].includes(dow); // Bogotá: solo lunes y viernes llevan el recuadro de promoción (esfera/concurso, luego tiendas); domingo y miércoles van con el mensaje normal
  let sent = 0, skipped = 0, failed = 0; const would: string[] = [];
  for (const p of ppl ?? []) {
    if (p.rejected || !p.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p.email)) { skipped++; continue; }
    if (p.notif_prefs?.email === false) { skipped++; continue; }
    if (body.only && p.email.toLowerCase() !== body.only.toLowerCase()) continue;
    const city = ckey(p.city ?? "");
    const bday = p.birth_month === mm && p.birth_day === dd;
    const sendDay = (ORLANDO.includes(city) || /32837/.test(String(p.city ?? ""))) ? sendDay2 : sendDay4;
    if (!bday && !sendDay && !body.only) { skipped++; continue; }
    if (sent >= MAX) break;
    const lang = p.application?.lang === "en" ? "en" : "es";
    const mail = render(lang, bday ? "bday" : "note", p.first_name ?? "", (lang === "en" ? VARS_EN : VARS)[dayIdx(today)], city === "bogota" && promoDay && sphereOn, city === "bogota" && promoDay && !sphereOn);
    if (body.dry) { would.push(`${p.first_name ?? ""} <${p.email}> ${bday ? "cumpleaños" : "mensaje"}${city === "bogota" && promoDay ? (sphereOn ? " +esfera" : " +tiendas") : ""}`); sent++; continue; }
    const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [p.email], reply_to: REPLY_TO, subject: mail.subject, html: mail.html, text: mail.text,
        headers: { "List-Unsubscribe": `<mailto:${REPLY_TO}?subject=${encodeURIComponent("Cancelar avisos / Unsubscribe")}>` } }) });
    if (r.ok) sent++; else { failed++; console.error("resend", r.status, (await r.text()).slice(0, 200)); }
  }
  return json({ ok: true, today, sendDay4, sendDay2, promoDay, sphereOn, dry: !!body.dry, sent, skipped, failed, would });
});
