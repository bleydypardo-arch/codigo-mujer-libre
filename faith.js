// Código Mujer Libre — Prayer & Support wall + safety note on the Wellness page.
// Who can see what (including "anonymous to members, visible to admins") is enforced by Supabase
// (schema.sql, section 17). This file only draws the screens.
(function () {
"use strict";
let C = null;

const ES = {
  safeTitle: "Antes de empezar",
  safeBody: "Código Mujer Libre, su asistente de IA y la comunidad ofrecen apoyo entre mujeres. No son un servicio de emergencia ni de salud mental profesional.",
  safe911: "Si hay peligro inmediato, llama al", safe988a: "Si piensas en hacerte daño o estás en una crisis emocional, llama o envía un mensaje de texto al",
  safe988b: "(Línea 988 de Suicidio y Crisis, 24 horas; para español, oprime 2).", safeDv: "Si sufres violencia doméstica, llama al", safeDvb: "(o escribe START al 88788).",
  wallTitle: "Muro de oración y apoyo", wallIntro: "Un espacio privado para pedir y ofrecer oración y ánimo. Solo lo ven las mujeres aprobadas de la comunidad.",
  wallPh: "Escribe tu petición de oración o apoyo…", wallName: "Compartir con mi nombre", wallAnon: "Compartir de forma anónima con las demás",
  wallAnonHelp: "Anónima: las demás no verán tu nombre. Las administradoras sí pueden identificar la cuenta, por seguridad.",
  wallPost: "Compartir", wallPostFail: "No se pudo compartir.", wallEmpty: "Todavía no hay peticiones. Sé la primera en compartir.",
  wallPray: "🙏 Orando por ti", wallPraying: "🙏 Orando por ti · ", wallDelete: "Eliminar", wallConfirm: "¿Eliminar esta petición?",
  wallAnonAuthor: "Anónima", wallYouAnon: "Tú · anónima", wallYou: "Tú", wallAdminSees: "Cuenta (solo administradoras): ",
  wallLoadFail: "No se pudo cargar el muro.", wallNotEmergency: "Si es urgente, no esperes respuestas aquí: usa los números de arriba.",
  wallPrivateNote: "Para hablar en privado con la administradora, usa «Necesito hablar» arriba.",
  safeNow: "¿Necesitas ayuda ahora?", safe911Lbl: "Emergencias", safe988Lbl: "Crisis · llamada o texto, 24 h",
  safeMore: "Más información y recursos", wallEyebrow: "ORACIÓN",
  wallIPray: "🙏 Oraré por ti", wallPrayingOn: "✓ Estoy orando contigo",
  wallCount: n => n === 1 ? "1 mujer está orando" : n + " mujeres están orando", wallThanks: "Gracias por orar. Ella no está sola."
};
const EN = {
  safeTitle: "Before you begin",
  safeBody: "Código Mujer Libre, its AI assistant and the community offer support between women. They are not an emergency service or a professional mental-health service.",
  safe911: "If someone is in immediate danger, call", safe988a: "If you are thinking about harming yourself or are in emotional crisis, call or text",
  safe988b: "(the 988 Suicide & Crisis Lifeline, 24/7; for Spanish, press 2).", safeDv: "If you are experiencing domestic violence, call", safeDvb: "(or text START to 88788).",
  wallTitle: "Prayer & support wall", wallIntro: "A private space to ask for and offer prayer and encouragement. Only approved members of the community can see it.",
  wallPh: "Write your prayer or support request…", wallName: "Share with my name", wallAnon: "Share anonymously with members",
  wallAnonHelp: "Anonymous: other members won't see your name. Admins can still identify the account, for safety.",
  wallPost: "Share", wallPostFail: "Could not share.", wallEmpty: "No requests yet. Be the first to share.",
  wallPray: "🙏 Praying for you", wallPraying: "🙏 Praying for you · ", wallDelete: "Delete", wallConfirm: "Delete this request?",
  wallAnonAuthor: "Anonymous", wallYouAnon: "You · anonymous", wallYou: "You", wallAdminSees: "Account (admins only): ",
  wallLoadFail: "The wall could not be loaded.", wallNotEmergency: "If it's urgent, don't wait for replies here: use the numbers above.",
  wallPrivateNote: "To talk privately with the admin, use “I need to talk” above.",
  safeNow: "Need help right now?", safe911Lbl: "Emergencies", safe988Lbl: "Crisis · call or text, 24/7",
  safeMore: "More information and resources", wallEyebrow: "PRAYER",
  wallIPray: "🙏 I'll pray for you", wallPrayingOn: "✓ Praying with you",
  wallCount: n => n === 1 ? "1 woman is praying" : n + " women are praying", wallThanks: "Thank you for praying. She is not alone."
};
const t = (key, ...args) => { const v = C ? C.t(key) : ""; return typeof v === "function" ? v(...args) : (v || key); };
const el = (...a) => C.el(...a);
const tel = (num, text) => el("a", { href: "tel:" + num, class: "safe-link", text });

// ---------- safety card (always visible on Wellness) ----------
// 911 and 988 are always on screen as large tap-to-call buttons; the longer explanation folds away.
function renderSafety() {
  const host = document.getElementById("safetyCard");
  if (!host || !C) return;
  const big = (num, label, sub) => el("a", { href: "tel:" + num, class: "safe-call" }, el("b", { text: label }), el("small", { text: sub }));
  host.replaceChildren(
    el("b", { class: "safe-title", text: "🛟 " + t("safeNow") }),
    el("div", { class: "safe-calls" }, big("911", "911", t("safe911Lbl")), big("988", "988", t("safe988Lbl"))),
    el("details", { class: "safe-more" },
      el("summary", { text: t("safeMore") }),
      el("p", { text: t("safeBody") }),
      el("p", {}, t("safe911") + " ", tel("911", "911"), "."),
      el("p", {}, t("safe988a") + " ", tel("988", "988"), " " + t("safe988b")),
      el("p", {}, t("safeDv") + " ", tel("18007997233", "1-800-799-7233"), " " + t("safeDvb"))));
}

// ---------- the wall ----------
let rows = [], loaded = false, anon = true;
let draft = "";
const when = iso => {
  const d = new Date(iso); if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(C.loc(), { month: "short", day: "numeric" }) + " · " + d.toLocaleTimeString(C.loc(), { hour: "numeric", minute: "2-digit" });
};
async function load() {
  const host = document.getElementById("prayerWall");
  if (!host || !C || !C.session()) return;
  const r = await C.db.rpc("prayer_wall", { max_rows: 50 });
  if (r.error) { rows = []; loaded = false; paint(true); return; }
  rows = r.data || []; loaded = true; paint();
}
function paint(failed) {
  const host = document.getElementById("prayerWall");
  if (!host || !C) return;
  if (!C.session()) { host.replaceChildren(); return; }
  const ta = el("textarea", { id: "prayerText", maxlength: 1000, rows: 3, placeholder: t("wallPh"), "aria-label": t("wallPh") });
  ta.value = draft;
  ta.addEventListener("input", () => { draft = ta.value; });
  const mk = (val, label) => {
    const i = el("input", { type: "radio", name: "prayerShare", value: val });
    i.checked = (val === "anon") === anon;
    i.addEventListener("change", () => { anon = val === "anon"; });
    return el("label", { class: "choice" }, i, " " + label);
  };
  const fb = el("p", { class: "form-feedback", role: "alert", hidden: true });
  const post = el("button", { type: "submit", class: "primary", text: t("wallPost") });
  const form = el("form", { class: "prayer-form" }, ta,
    el("div", { class: "choice-grid", role: "radiogroup" }, mk("name", t("wallName")), mk("anon", t("wallAnon"))),
    el("small", { class: "meta", text: t("wallAnonHelp") }), fb, post);
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const body = ta.value.trim(); if (!body) return;
    post.disabled = true; fb.hidden = true;
    const r = await C.db.from("prayer_requests").insert({ body, anonymous: anon });
    post.disabled = false;
    if (r.error) { fb.textContent = t("wallPostFail"); fb.hidden = false; return; }
    draft = ""; await load();
  });
  const items = rows.map(x => {
    const author = x.anonymous ? (x.mine ? t("wallYouAnon") : t("wallAnonAuthor")) : (x.mine ? t("wallYou") + " · " + x.author_name : x.author_name);
    const pray = el("button", { type: "button", class: "resp pray" + (x.i_pray ? " on" : ""), "aria-pressed": String(!!x.i_pray) },
      x.i_pray ? t("wallPrayingOn") : t("wallIPray"));
    const nPray = Number(x.praying) || 0;
    pray.addEventListener("click", async () => {
      const was = x.i_pray;
      x.i_pray = !was; x.praying = Math.max(0, Number(x.praying) + (was ? -1 : 1)); paint();
      if (!was) C.announce("wallThanks");
      const r = was
        ? await C.db.from("prayer_responses").delete().eq("request_id", x.id).eq("user_id", C.session().user.id)
        : await C.db.from("prayer_responses").insert({ request_id: x.id });
      if (r.error && r.error.code !== "23505") await load();
    });
    const card = el("div", { class: "prayer-item" },
      el("p", { class: "prayer-body", text: x.body }),
      el("small", { class: "meta-line", text: author + " · " + when(x.created_at) }),
      x.real_name ? el("small", { class: "prayer-admin", text: "👁 " + t("wallAdminSees") + x.real_name }) : null);
    const acts = el("div", { class: "resp-row" }, pray, nPray ? el("small", { class: "pray-count", text: t("wallCount", nPray) }) : null);
    if (x.mine || C.isAdmin()) {
      const del = el("button", { type: "button", class: "link-btn", text: t("wallDelete") });
      del.addEventListener("click", async () => {
        if (!window.confirm(t("wallConfirm"))) return;
        const r = await C.db.from("prayer_requests").delete().eq("id", x.id);
        if (!r.error) { rows = rows.filter(y => y.id !== x.id); paint(); }
      });
      acts.appendChild(del);
    }
    card.appendChild(acts);
    return card;
  });
  host.replaceChildren(
    el("small", { class: "rose", text: t("wallEyebrow") }),
    el("h2", { text: t("wallTitle") }),
    el("p", { class: "small-note", text: t("wallIntro") }),
    form,
    el("small", { class: "meta", text: t("wallNotEmergency") }),
    ...(failed ? [el("p", { class: "form-feedback", text: t("wallLoadFail") })] : []),
    ...(items.length ? items : (loaded && !failed ? [el("p", { class: "small-note", text: t("wallEmpty") })] : [])),
    el("small", { class: "meta", text: t("wallPrivateNote") }));
}

function init() {
  C = window.CML;
  if (!C) return;
  C.addStrings(ES, EN);
  renderSafety();
  document.addEventListener("cml:session", e => {
    rows = []; loaded = false; draft = "";
    if (!C.session() || (e.detail && e.detail.pending)) { paint(); return; }
    load();
  });
  document.addEventListener("cml:lang", () => { renderSafety(); if (C.session()) paint(); });
  const nav = document.querySelector("nav button[data-page=wellness]");
  if (nav) nav.addEventListener("click", () => { if (C.session()) load(); });
  window.CMLFaith = { load, latest: () => rows[0] || null };
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
