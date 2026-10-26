// Código Mujer Libre — welcome after approval: safe-space promise, data authorization and profile photo.
// - Shown once to every approved member (existing members too). The acceptance is saved in profiles.application.consent
//   (version, date, language), so no database change is needed.
// - A member can enter without a photo, but a photo is asked for here, by a small reminder, and before connecting or chatting.
// - Admin tab "Sin foto": who is missing a photo, with a message ready to copy.
(function () {
"use strict";
const VERSION = 1;
const ES = {
  wlTitle: n => "Bienvenida, " + n + " 🌸", wlSub: "Ya eres parte de Código Mujer Libre. Antes de entrar, tres cosas rápidas.",
  wlBenH: "Club de Fundadoras", wlBenP: "Las primeras 50 mujeres de cada ciudad son Fundadoras. Para siempre tienes acceso a todo el app, incluidos el Spa, el Rincón Matcha y Crece & Florece.", wlBen1: "Recibirás una tarjeta de Fundadora cuando completemos las 50 de tu ciudad.", wlBen2: "Con ella, descuentos en salones de belleza, cafés y restaurantes aliados, happy hours y encuentros con mujeres, y en nuestros primeros encuentros y conferencias.", wlBen3: "Entra a diario: cada día tienes un espacio para ti, para conectar con la mujer que eres.",
  wlSafeH: "Aquí estás segura", wl1: "Solo entran mujeres, aprobadas una por una.", wl2: "Tu teléfono y tu correo no los ve nadie de la comunidad. Tu WhatsApp solo se comparte si tú decides.",
  wl3: "Tu foto y tu perfil solo los ven integrantes aprobadas.", wl4: "Puedes reportar o bloquear a quien te incomode. Lo tratamos con discreción.", wl5: "Para un primer encuentro, elige un lugar público y avisa a alguien de confianza.",
  wlPhotoH: "Pon tu foto", wlPhotoP: "Con tu foto, las demás mujeres pueden reconocerte y conectar contigo. Para saludar o escribir a otras, la necesitas.",
  wlPhotoBtn: "Elegir mi foto", wlPhotoChange: "Cambiar mi foto", wlPhotoBusy: "Subiendo…", wlPhotoBad: "Esa imagen no se pudo usar. Prueba con otra foto.", wlPhotoOk: "¡Qué linda! Tu foto está lista.",
  wlDataH: "Tus datos", wlPreviewNote: "Vista previa: así la ve cada mujer la primera vez que entra. No se guarda nada.", wlPreviewClose: "Cerrar vista previa", wlZoom: "Toca para verla grande", wlFounderRole: "Fundadora de Código Mujer Libre",
  wlData: "Autorizo a Código Mujer Libre a recolectar, almacenar, usar y tratar mis datos personales (nombre, ciudad, correo, teléfono, cumpleaños, foto y lo que yo decida compartir) para gestionar mi membresía, mostrar mi perfil a otras integrantes aprobadas, organizar eventos y enviarme avisos de la comunidad. Declaro que mis datos son veraces y que se me informó que tengo derecho a conocerlos, actualizarlos, rectificarlos, pedir que se borren y revocar esta autorización, conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013 de Colombia (hoy Decreto 1074 de 2015) y a la ley que aplique donde vivo. Compartir datos sensibles (peticiones de oración, fe o salud) siempre es voluntario.",
  wlTerms: "He leído y acepto las normas de la comunidad y los términos de uso.", wlRead: "Aviso de privacidad completo", wlReadTerms: "Términos de uso",
  wlEnter: "Entrar a la comunidad", wlNeed: "Marca las dos casillas para entrar.", wlFail: "No se pudo guardar. Revisa tu conexión e intenta de nuevo.", wlOut: "Salir",
  wlAskH: "Para conectar, pon tu foto", wlAskP: "Así las demás te reconocen y se sienten seguras de saludarte. Solo la ven las integrantes aprobadas.", wlLater: "Ahora no",
  wlBar: "📷 Pon tu foto para conectar",
  wsTab: "Sin foto", wsIntro: "Integrantes aprobadas que aún no tienen foto. Copia el mensaje y envíaselo por WhatsApp.", wsNone: "Todas las integrantes tienen foto. 🌸", wsCopy: "Copiar mensaje", wsCopied: "Copiado", wsWa: "Abrir WhatsApp", wsCount: n => n + (n === 1 ? " integrante sin foto" : " integrantes sin foto"),
  wsMsg: n => "Hola " + n + " 🌸 Te escribe Código Mujer Libre. Para que las demás mujeres puedan reconocerte y conectar contigo, ¿puedes poner tu foto de perfil? Entra a la app → Perfil → Elegir foto. Solo la ven integrantes aprobadas. ¡Gracias!"
};
const EN = {
  wlTitle: n => "Welcome, " + n + " 🌸", wlSub: "You are now part of Código Mujer Libre. Before you come in, three quick things.",
  wlBenH: "Founders Club", wlBenP: "The first 50 women in each city are Founders. For life you have access to the whole app, including the Spa, the Matcha Corner and Grow & Bloom.", wlBen1: "You will receive a Founder card once we complete the 50 in your city.", wlBen2: "With it, discounts at beauty salons, partner cafés and restaurants, happy hours and meetups with women, and at our first gatherings and conferences.", wlBen3: "Come in every day: each day there is a space for you, to connect with the woman you are.",
  wlSafeH: "You are safe here", wl1: "Only women come in, approved one by one.", wl2: "Nobody in the community sees your phone or email. Your WhatsApp is only shared if you decide.",
  wl3: "Only approved members see your photo and profile.", wl4: "You can report or block anyone who makes you uncomfortable. We handle it discreetly.", wl5: "For a first meeting, choose a public place and tell someone you trust.",
  wlPhotoH: "Add your photo", wlPhotoP: "With your photo, other women can recognize you and connect with you. To say hello or write to others, you need it.",
  wlPhotoBtn: "Choose my photo", wlPhotoChange: "Change my photo", wlPhotoBusy: "Uploading…", wlPhotoBad: "That image could not be used. Try another photo.", wlPhotoOk: "Lovely! Your photo is ready.",
  wlDataH: "Your data", wlPreviewNote: "Preview: this is how each woman sees it the first time she enters. Nothing is saved.", wlPreviewClose: "Close preview", wlZoom: "Tap to enlarge", wlFounderRole: "Founder of Código Mujer Libre",
  wlData: "I authorize Código Mujer Libre to collect, store, use and process my personal data (name, city, email, phone, birthday, photo and whatever I choose to share) to manage my membership, show my profile to other approved members, organize events and send me community notices. I declare that my data is truthful and that I was informed of my right to know, update, correct and ask for deletion of my data and to revoke this authorization, under Colombian Law 1581 of 2012 and Decree 1377 of 2013 (now Decree 1074 of 2015) and the law that applies where I live. Sharing sensitive data (prayer requests, faith or health) is always voluntary.",
  wlTerms: "I have read and accept the community guidelines and the terms of use.", wlRead: "Full privacy notice", wlReadTerms: "Terms of use",
  wlEnter: "Enter the community", wlNeed: "Tick both boxes to come in.", wlFail: "Could not save. Check your connection and try again.", wlOut: "Log out",
  wlAskH: "To connect, add your photo", wlAskP: "That way other women recognize you and feel safe saying hello. Only approved members see it.", wlLater: "Not now",
  wlBar: "📷 Add your photo to connect",
  wsTab: "No photo", wsIntro: "Approved members who do not have a photo yet. Copy the message and send it by WhatsApp.", wsNone: "Every member has a photo. 🌸", wsCopy: "Copy message", wsCopied: "Copied", wsWa: "Open WhatsApp", wsCount: n => n + (n === 1 ? " member without a photo" : " members without a photo"),
  wsMsg: n => "Hi " + n + " 🌸 This is Código Mujer Libre. So other women can recognize you and connect with you, could you add your profile photo? Open the app → Profile → Choose photo. Only approved members see it. Thank you!"
};
const FOUNDER_DEFAULT = {
  name: "Jazz",
  es: "Hola, soy Jazz, la fundadora. Qué alegría que estés aquí 🌸 Esto lo creamos para que las mujeres se conozcan, se apoyen y vivan cosas bonitas juntas. Para que podamos reconocernos y conectar, pon tu foto: es lo que más ayuda a que esto se sienta como una comunidad de verdad. Solo la ven las integrantes aprobadas. Bienvenida a casa.",
  en: "Hi, I'm Jazz, the founder. I'm so glad you're here 🌸 We created this so women can meet, support each other and live beautiful things together. So we can recognize each other and connect, add your photo: it is what most helps this feel like a real community. Only approved members see it. Welcome home."
};
function founder() {
  const s = (C && C.setting && C.setting("founder_welcome")) || {};
  return { name: (s.name || FOUNDER_DEFAULT.name), text: (s[C.lang()] || s.es || FOUNDER_DEFAULT[C.lang()] || FOUNDER_DEFAULT.es) };
}
const cardSrc = () => (C.lang() === "en" ? "founder-card-en.jpg" : "founder-card.jpg");
function zoomCard() {
  const close = el("button", { type: "button", class: "wl-zclose", "aria-label": "×", text: "×" });
  const img = el("img", { src: cardSrc(), alt: founder().text, class: "wl-zimg" });
  const box = el("div", { class: "wl-zoom", role: "dialog", "aria-modal": "true" }, img, close);
  const done = () => box.remove();
  close.addEventListener("click", done);
  box.addEventListener("click", e => { if (e.target === box) done(); });
  document.body.appendChild(box); close.focus();
  const toText = () => { box.scrollLeft = Math.max(0, Math.round(img.offsetWidth * 0.488) - 4); box.scrollTop = 0; };
  toText(); img.addEventListener("load", toText);
}
function textCard() {
  const f = founder();
  const ph = el("span", { class: "avatar avatar-lg wl-fph", text: (f.name || "J").trim().charAt(0).toUpperCase() });
  const img = el("img", { src: "founder.jpg", alt: "", class: "wl-fimg" });
  img.addEventListener("load", () => { ph.replaceChildren(img); });
  return el("section", { class: "wl-card wl-founder" }, ph,
    el("div", { class: "wl-ftxt" }, el("p", { class: "wl-fmsg", text: f.text }), el("b", { class: "wl-fname", text: "— " + f.name }), el("small", { text: t("wlFounderRole") })));
}
// The designed welcome card (image) in the member's language; if the image cannot load: the same message as text.
function founderCard() {
  const wrap = el("div", { class: "wl-poster" });
  const img = el("img", { src: cardSrc(), alt: founder().text, class: "wl-pimg" });
  const btn = el("button", { type: "button", class: "wl-pbtn", "aria-label": t("wlZoom") }, img, el("span", { class: "wl-phint", text: t("wlZoom") }));
  btn.addEventListener("click", zoomCard);
  img.addEventListener("error", () => wrap.replaceChildren(textCard()));
  wrap.appendChild(btn);
  return wrap;
}
let C = null, gate = null, sheet = null, bar = null;
const t = (k, ...a) => { const v = C ? C.t(k) : ""; return typeof v === "function" ? v(...a) : (v || k); };
const el = (...a) => C.el(...a);
function init() { C = window.CML; if (C && C.addStrings && !init.done) { init.done = true; C.addStrings(ES, EN); } return !!C; }
const prof = () => (C && C.profile && C.profile()) || null;
const isMember = () => { const p = prof(); return !!(p && p.role === "member" && p.approved); };
const hasPhoto = () => { const p = prof(); return !!(p && p.avatar_path); };
const consented = () => { const p = prof(); const c = p && p.application && p.application.consent; return !!(c && c.v >= VERSION); };
const lockScroll = on => { try { document.body.style.overflow = on ? "hidden" : ""; } catch {} };

// ---- photo picker used by the gate and the "ask" sheet ----
function photoBlock(onDone) {
  const box = el("div", { class: "wl-photo" });
  const msg = el("p", { class: "wl-photomsg", role: "status" });
  const paint = () => {
    const file = el("input", { type: "file", accept: "image/jpeg,image/png,image/webp", hidden: "" });
    const btn = el("button", { type: "button", class: "wl-btn wl-btn-soft", text: hasPhoto() ? t("wlPhotoChange") : t("wlPhotoBtn") });
    btn.addEventListener("click", () => file.click());
    file.addEventListener("change", async () => {
      const f = file.files && file.files[0]; if (!f) return;
      btn.disabled = true; btn.textContent = t("wlPhotoBusy"); msg.textContent = "";
      try { await window.CMLProfile.uploadMyPhoto(f); paint(); msg.textContent = t("wlPhotoOk"); if (onDone) onDone(); }
      catch { paint(); msg.textContent = t("wlPhotoBad"); }
    });
    const av = window.CMLProfile ? window.CMLProfile.avatarNode(prof() && prof().avatar_path, prof() && prof().first_name, "avatar-lg") : el("span", { class: "avatar avatar-lg", text: "🌸" });
    box.replaceChildren(av, el("div", { class: "wl-photoact" }, btn, msg), file);
  };
  paint();
  return box;
}

// ---- the welcome gate (once per member) ----
function showGate(preview) {
  if (gate || !init()) return;
  if (!preview && (!isMember() || consented())) return;
  const name = (prof().first_name || "").trim();
  const c1 = el("input", { type: "checkbox", id: "wlC1" }), c2 = el("input", { type: "checkbox", id: "wlC2" });
  const go = el("button", { type: "button", class: "wl-btn wl-btn-main", text: preview ? t("wlPreviewClose") : t("wlEnter"), disabled: preview ? null : "" });
  if (preview) go.disabled = false;
  const fb = el("p", { class: "wl-fb", role: "alert", hidden: "" });
  const sync = () => { if (!preview) go.disabled = !(c1.checked && c2.checked); fb.hidden = true; };
  c1.addEventListener("change", sync); c2.addEventListener("change", sync);
  const link = (kind, key) => { const b = el("button", { type: "button", class: "wl-link", text: t(key) }); b.setAttribute("data-legal", kind); return b; };
  const li = k => el("li", { text: t(k) });
  const panel = el("div", { class: "wl-panel", role: "dialog", "aria-modal": "true", "aria-labelledby": "wlH" },
    preview ? el("p", { class: "wl-prev", text: t("wlPreviewNote") }) : "",
    el("h2", { id: "wlH", class: "wl-h", text: t("wlTitle", name || "") }),
    founderCard(),
    el("p", { class: "wl-sub", text: t("wlSub") }),
    el("section", { class: "wl-card wl-ben" }, el("h3", { text: t("wlBenH") }), el("p", { text: t("wlBenP") }), el("ul", {}, li("wlBen1"), li("wlBen2"), li("wlBen3"))),
    el("section", { class: "wl-card wl-safe" }, el("h3", { text: t("wlSafeH") }), el("ul", {}, li("wl1"), li("wl2"), li("wl3"), li("wl4"), li("wl5"))),
    el("section", { class: "wl-card" }, el("h3", { text: t("wlPhotoH") }), el("p", { text: t("wlPhotoP") }), photoBlock()),
    el("section", { class: "wl-card" }, el("h3", { text: t("wlDataH") }),
      el("label", { class: "wl-check" }, c1, el("span", { text: t("wlData") })),
      el("div", { class: "wl-links" }, link("privacy", "wlRead"), link("terms", "wlReadTerms")),
      el("label", { class: "wl-check" }, c2, el("span", { text: t("wlTerms") }))),
    fb, go,
    (() => { if (preview) return ""; const out = el("button", { type: "button", class: "wl-link wl-out", text: t("wlOut") }); out.addEventListener("click", () => C.signOut()); return out; })());
  gate = el("div", { class: "wl-back" }, panel);
  document.body.appendChild(gate); lockScroll(true);
  go.addEventListener("click", async () => {
    if (preview) { gate.remove(); gate = null; lockScroll(false); return; }
    if (!(c1.checked && c2.checked)) { fb.textContent = t("wlNeed"); fb.hidden = false; return; }
    go.disabled = true;
    const p = prof();
    const app = Object.assign({}, p.application || {}, { consent: { v: VERSION, at: new Date().toISOString(), data: true, terms: true, lang: C.lang() } });
    const r = await C.db.from("profiles").update({ application: app }).eq("id", p.id);
    if (r.error) { go.disabled = false; fb.textContent = t("wlFail"); fb.hidden = false; return; }
    p.application = app;
    gate.remove(); gate = null; lockScroll(false);
    paintBar();
  });
}

// ---- "ask for a photo" sheet, used before saying hello / writing ----
function ensurePhoto() {
  if (!init() || hasPhoto() || !isMember()) return Promise.resolve(true);
  return new Promise(resolve => {
    if (sheet) sheet.remove();
    const done = ok => { if (sheet) { sheet.remove(); sheet = null; } lockScroll(false); paintBar(); resolve(ok); };
    const later = el("button", { type: "button", class: "wl-link", text: t("wlLater") });
    later.addEventListener("click", () => done(false));
    const panel = el("div", { class: "wl-panel wl-small", role: "dialog", "aria-modal": "true" },
      el("h2", { class: "wl-h", text: t("wlAskH") }), el("p", { class: "wl-sub", text: t("wlAskP") }),
      photoBlock(() => setTimeout(() => done(true), 700)), later);
    sheet = el("div", { class: "wl-back" }, panel);
    sheet.addEventListener("click", e => { if (e.target === sheet) done(false); });
    document.body.appendChild(sheet); lockScroll(true);
  });
}

// ---- small reminder pill for members without a photo ----
function paintBar() {
  if (!init()) return;
  let skip = false; try { skip = sessionStorage.getItem("cml_nophoto_bar") === "1"; } catch {}
  const want = isMember() && consented() && !hasPhoto() && !skip && !gate;
  if (!want) { if (bar) { bar.remove(); bar = null; } return; }
  if (bar) return;
  const go = el("button", { type: "button", class: "wl-barbtn", text: t("wlBar") });
  go.addEventListener("click", () => ensurePhoto());
  const x = el("button", { type: "button", class: "wl-barx", "aria-label": t("wlLater"), text: "×" });
  x.addEventListener("click", () => { try { sessionStorage.setItem("cml_nophoto_bar", "1"); } catch {} paintBar(); });
  bar = el("div", { class: "wl-bar" }, go, x);
  document.body.appendChild(bar);
}

// ---- admin tab: members without a photo ----
async function noPhotoTab() {
  const box = el("div", { class: "admin-form" }, el("p", { class: "small-note", text: t("wsIntro") }));
  const r = await C.db.from("profiles").select("id,first_name,last_name,city,phone,whatsapp,avatar_path,approved,role").eq("approved", true).eq("role", "member").is("avatar_path", null).order("first_name");
  const rows = r.data || [];
  box.appendChild(el("p", { class: "small-note", text: rows.length ? t("wsCount", rows.length) : t("wsNone") }));
  rows.forEach(m => {
    const msg = t("wsMsg", (m.first_name || "").trim());
    const copy = el("button", { type: "button", class: "secondary", text: t("wsCopy") });
    copy.addEventListener("click", async () => { try { await navigator.clipboard.writeText(msg); copy.textContent = t("wsCopied"); setTimeout(() => { copy.textContent = t("wsCopy"); }, 1800); } catch {} });
    const digits = String(m.phone || "").replace(/\D/g, "");
    const kids = [copy];
    if (digits.length >= 11) kids.push(el("a", { class: "secondary", href: "https://wa.me/" + digits + "?text=" + encodeURIComponent(msg), target: "_blank", rel: "noopener", text: t("wsWa") }));
    box.appendChild(el("div", { class: "wl-adminrow" },
      el("div", {}, el("b", { text: ((m.first_name || "") + " " + (m.last_name || "")).trim() }), el("small", { text: [m.city, m.phone].filter(Boolean).join(" · ") })),
      el("div", { class: "wl-adminact" }, ...kids)));
  });
  return box;
}
function registerAdmin() {
  const A = window.CMLAdmin; if (!A || !A.registerTab || registerAdmin.done) return; registerAdmin.done = true;
  A.registerTab("nophoto", { group: "people", label: { es: ES.wsTab, en: EN.wsTab }, render: async () => { init(); return noPhotoTab(); } });
}

document.addEventListener("cml:session", e => {
  if (!init()) return;
  registerAdmin();
  const d = (e && e.detail) || {};
  if (!C.session() || d.pending || d.staff || d.admin || d.super) { if (gate) { gate.remove(); gate = null; lockScroll(false); } paintBar(); return; }
  showGate(); paintBar();
});
window.CMLWelcome = { ensurePhoto, hasPhoto, founderDefault: FOUNDER_DEFAULT, preview: () => { init(); showGate(true); } };
})();
