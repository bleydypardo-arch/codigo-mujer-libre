// Código Mujer Libre — small member profile (photo, name, optional birthday, language, interests)
// + tasteful birthday reminders on Home. The database never stores a birth YEAR, so age cannot be shown.
// Photo access and all rules are enforced by Supabase (schema.sql, section 16).
(function () {
"use strict";
let C = null;
const BUCKET = "avatars";

const ES = {
  profBtn: "Mi perfil", profTitle: "Mi perfil", profIntro: "Solo compartimos con las demás tu nombre, tu foto y el día y mes de tu cumpleaños (si lo agregas). Nunca tu edad.",
  profPhoto: "Foto de perfil", profChange: "Cambiar foto", profRemove: "Quitar foto", profPhotoFail: "No se pudo subir la foto.", profPhotoBad: "Elige una imagen (JPG, PNG o WebP).",
  profFirst: "Nombre", profLast: "Apellido", profBirthday: "Cumpleaños (opcional)", profMonth: "Mes", profDay: "Día", profBirthHelp: "Solo mes y día. Nunca guardamos el año.",
  profClearBirth: "Quitar cumpleaños", profLang: "Idioma preferido", profInterests: "Mis intereses", profSave: "Guardar", profSaved: "Perfil guardado.", profFail: "No se pudo guardar.",
  profNeedName: "Escribe tu nombre.", profBadDay: "Ese día no existe en ese mes.",
  bdToday: n => "🎂 ¡Hoy es el cumpleaños de " + n + "!", bdTomorrow: n => "🎂 El cumpleaños de " + n + " es mañana.",
  bdDay: (n, d) => "🎂 El cumpleaños de " + n + " es el " + d + ".", bdWeek: n => "🎉 El cumpleaños de " + n + " es la próxima semana.",
  bdCelebrate: "Crear celebración", bdTitle: "Cumpleaños", bdEventTitleEs: n => "🎂 Cumpleaños de " + n, bdEventTitleEn: n => "🎂 " + n + "'s birthday",
  bdCreated: "Celebración creada como borrador. Revísala y publícala.", bdFail: "No se pudo crear la celebración.", bdAdminLine: "🎂 Cumpleaños",
  bdCongrats: "Felicitar", bdDraft: n => "🎂 ¡Feliz cumpleaños, " + n + "! "
};
const EN = {
  profBtn: "My profile", profTitle: "My profile", profIntro: "Other members only see your first name, your photo and your birthday's day and month (if you add it). Never your age.",
  profPhoto: "Profile photo", profChange: "Change photo", profRemove: "Remove photo", profPhotoFail: "The photo could not be uploaded.", profPhotoBad: "Please choose an image (JPG, PNG or WebP).",
  profFirst: "First name", profLast: "Last name", profBirthday: "Birthday (optional)", profMonth: "Month", profDay: "Day", profBirthHelp: "Month and day only. We never store the year.",
  profClearBirth: "Remove birthday", profLang: "Preferred language", profInterests: "My interests", profSave: "Save", profSaved: "Profile saved.", profFail: "Could not save.",
  profNeedName: "Enter your first name.", profBadDay: "That day doesn't exist in that month.",
  bdToday: n => "🎂 It's " + n + "'s birthday today!", bdTomorrow: n => "🎂 " + n + "'s birthday is tomorrow.",
  bdDay: (n, d) => "🎂 " + n + "'s birthday is " + d + ".", bdWeek: n => "🎉 " + n + "'s birthday is next week.",
  bdCelebrate: "Create celebration", bdTitle: "Birthdays", bdEventTitleEs: n => "🎂 Cumpleaños de " + n, bdEventTitleEn: n => "🎂 " + n + "'s birthday",
  bdCreated: "Celebration created as a draft. Review it and publish.", bdFail: "Could not create the celebration.", bdAdminLine: "🎂 Birthday",
  bdCongrats: "Congratulate", bdDraft: n => "🎂 Happy birthday, " + n + "! "
};
const t = (key, ...args) => { const v = C ? C.t(key) : ""; return typeof v === "function" ? v(...args) : (v || key); };
const el = (...a) => C.el(...a);
const uid = () => (C.session() && C.session().user.id) || "";
const MAXDAY = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// ---------- private photos ----------
const urls = new Map();
async function signed(paths) {
  const need = [...new Set(paths.filter(Boolean))].filter(p => { const c = urls.get(p); return !c || c.exp < Date.now() + 60000; });
  if (need.length) {
    const { data } = await C.db.storage.from(BUCKET).createSignedUrls(need, 3600);
    (data || []).forEach(d => { if (d && d.signedUrl) urls.set(d.path, { url: d.signedUrl, exp: Date.now() + 3600000 }); });
  }
  return p => { const c = urls.get(p); return c ? c.url : ""; };
}
async function toSquareJpeg(file) {
  let bmp;
  try { bmp = await createImageBitmap(file, { imageOrientation: "from-image" }); } catch { throw new Error("photo"); }
  const side = Math.min(bmp.width, bmp.height), size = Math.min(512, side);
  const canvas = document.createElement("canvas"); canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, size, size);
  ctx.drawImage(bmp, (bmp.width - side) / 2, (bmp.height - side) / 2, side, side, 0, 0, size, size);
  if (bmp.close) bmp.close();
  return new Promise((res, rej) => canvas.toBlob(b => b ? res(b) : rej(new Error("photo")), "image/jpeg", 0.85));
}
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
function avatarNode(path, name, cls) {
  const box = el("span", { class: "avatar " + (cls || ""), "aria-hidden": "true", text: (name || "?").trim().charAt(0).toUpperCase() });
  if (path) {
    const set = u => { if (u && box.isConnected !== undefined) { box.textContent = ""; box.appendChild(el("img", { src: u, alt: "" })); } };
    const c = urls.get(path);
    if (c) set(c.url); else signed([path]).then(get => set(get(path)));
  }
  return box;
}

// ---------- profile page ----------
const page = () => document.getElementById("profile");
function monthName(i) { return new Date(2000, i, 1).toLocaleDateString(C.loc(), { month: "long" }); }
function renderProfile() {
  const host = page();
  if (!host || !C || !C.session() || !C.profile()) return;
  const me = C.profile();
  const first = el("input", { type: "text", id: "profFirst", maxlength: 60, autocomplete: "given-name", value: me.first_name || "" });
  const last = el("input", { type: "text", id: "profLast", maxlength: 60, autocomplete: "family-name", value: me.last_name || "" });
  const month = el("select", { id: "profMonth", "aria-label": t("profMonth") }, el("option", { value: "", text: t("profMonth") }),
    ...Array.from({ length: 12 }, (_, i) => el("option", { value: String(i + 1), text: monthName(i) })));
  const day = el("select", { id: "profDay", "aria-label": t("profDay") }, el("option", { value: "", text: t("profDay") }),
    ...Array.from({ length: 31 }, (_, i) => el("option", { value: String(i + 1), text: String(i + 1) })));
  month.value = me.birth_month ? String(me.birth_month) : ""; day.value = me.birth_day ? String(me.birth_day) : "";
  const lang = el("select", { id: "profLang" }, el("option", { value: "es", text: "Español" }), el("option", { value: "en", text: "English" }));
  lang.value = me.pref_lang || C.lang();
  const boxes = Object.keys(C.codeLabels).map(code => {
    const input = el("input", { type: "checkbox", value: code }); input.checked = (me.interests || []).includes(code);
    return el("label", { class: "choice" }, input, " " + C.t(C.codeLabels[code]));
  });
  const fb = el("p", { class: "form-feedback", role: "alert", hidden: true });
  const say = (msg, good) => { fb.textContent = msg; fb.hidden = !msg; fb.classList.toggle("ok", !!good); };

  const photo = el("div", { class: "prof-photo" });
  const paintPhoto = () => {
    const file = el("input", { type: "file", accept: "image/jpeg,image/png,image/webp", id: "profPhoto", hidden: "" });
    const change = el("button", { type: "button", class: "secondary", text: t("profChange") });
    change.addEventListener("click", () => file.click());
    file.addEventListener("change", async () => {
      const f = file.files && file.files[0]; if (!f) return;
      if (!/^image\//.test(f.type)) { say(t("profPhotoBad")); return; }
      change.disabled = true; say("");
      try {
        const blob = await toSquareJpeg(f);
        const path = uid() + "/" + uuid() + ".jpg";
        const up = await C.db.storage.from(BUCKET).upload(path, blob, { contentType: "image/jpeg", cacheControl: "3600", upsert: false });
        if (up.error) throw up.error;
        const old = me.avatar_path;
        const r = await C.db.from("profiles").update({ avatar_path: path }).eq("id", uid());
        if (r.error) { await C.db.storage.from(BUCKET).remove([path]); throw r.error; }
        me.avatar_path = path;
        if (old) C.db.storage.from(BUCKET).remove([old]).catch(() => {});
      } catch { say(t("profPhotoFail")); }
      paintPhoto(); renderBirthdays();
    });
    const kids = [avatarNode(me.avatar_path, me.first_name, "avatar-lg"), el("div", { class: "prof-photo-actions" }, change)];
    if (me.avatar_path) {
      const rm = el("button", { type: "button", class: "link-btn", text: t("profRemove") });
      rm.addEventListener("click", async () => {
        const old = me.avatar_path;
        const r = await C.db.from("profiles").update({ avatar_path: null }).eq("id", uid());
        if (r.error) return say(t("profFail"));
        me.avatar_path = null; C.db.storage.from(BUCKET).remove([old]).catch(() => {});
        paintPhoto(); renderBirthdays();
      });
      kids[1].appendChild(rm);
    }
    photo.replaceChildren(...kids, file);
  };
  paintPhoto();

  const clear = el("button", { type: "button", class: "link-btn", text: t("profClearBirth") });
  clear.addEventListener("click", () => { month.value = ""; day.value = ""; });
  const save = el("button", { type: "submit", class: "primary wide", text: t("profSave") });
  const form = el("form", { class: "card prof-form", novalidate: "" },
    el("label", { class: "prof-label" }, t("profPhoto")), photo,
    el("div", { class: "two-col" }, el("label", {}, el("span", { text: t("profFirst") }), first), el("label", {}, el("span", { text: t("profLast") }), last)),
    el("fieldset", {}, el("legend", { text: t("profBirthday") }), el("div", { class: "two-col md" }, month, day),
      el("small", { class: "meta", text: t("profBirthHelp") }), el("div", {}, clear)),
    el("label", {}, el("span", { text: t("profLang") }), lang),
    el("fieldset", {}, el("legend", { text: t("profInterests") }), el("div", { class: "choice-grid" }, boxes)),
    fb, save);
  form.addEventListener("submit", async e => {
    e.preventDefault(); say("");
    const fn = first.value.trim(); if (!fn) return say(t("profNeedName"));
    const m = month.value ? Number(month.value) : null, d = day.value ? Number(day.value) : null;
    if ((m && !d) || (!m && d)) return say(t("profBadDay"));
    if (m && d > MAXDAY[m - 1]) return say(t("profBadDay"));
    const patch = {
      first_name: fn, last_name: last.value.trim(), display_name: (fn + " " + last.value.trim()).trim(),
      birth_month: m, birth_day: d, pref_lang: lang.value,
      interests: boxes.map(l => l.querySelector("input")).filter(i => i.checked).map(i => i.value)
    };
    save.disabled = true;
    const r = await C.db.from("profiles").update(patch).eq("id", uid());
    save.disabled = false;
    if (r.error) return say(t("profFail"));
    Object.assign(me, patch);
    if (lang.value !== C.lang()) C.setLanguage(lang.value); else renderProfile();
    const f2 = host.querySelector(".prof-form .form-feedback");
    if (f2) { f2.textContent = t("profSaved"); f2.hidden = false; f2.classList.add("ok"); }
    renderBirthdays();
  });
  host.replaceChildren(
    el("h1", { text: t("profTitle") }),
    el("p", { class: "small-note", text: t("profIntro") }),
    form,
    ...(window.CMLRedesign ? [window.CMLRedesign.essenceLink()] : []));
}

// ---------- birthdays (shown inside "Tu semana" on Home, drawn by home.js) ----------
// Only first name, photo and day/month come back from the database — never a year or an age.
const parseDay = s => { const [y, m, d] = String(s).split("-").map(Number); return new Date(y, m - 1, d); };
let bdRows = [];
function bdLine(x) {
  const n = x.first_name, d = Number(x.days_until);
  if (d === 0) return t("bdToday", n);
  if (d === 1) return t("bdTomorrow", n);
  if (d <= 6) return t("bdDay", n, parseDay(x.next_on).toLocaleDateString(C.loc(), { weekday: "long" }));
  return t("bdWeek", n);
}
const homeRender = () => { if (window.CMLHome) window.CMLHome.render(true); };
async function renderBirthdays() {
  if (!C || !C.session() || !C.profile() || (C.profile().approved === false && !C.isAdmin())) { bdRows = []; homeRender(); return; }
  const r = await C.db.rpc("upcoming_birthdays", { within_days: 13 });
  bdRows = r.error ? [] : (r.data || []);
  if (bdRows.length) await signed(bdRows.map(x => x.avatar_path));
  homeRender();
}
function birthdays() {
  if (!C || !C.session()) return [];
  const myId = uid();
  return bdRows.map(x => ({
    first_name: x.first_name, avatar_path: x.avatar_path, days_until: Number(x.days_until), text: bdLine(x),
    mine: !!myId && x.user_id === myId,
    celebrate: C.isAdmin() && window.CMLAdmin ? () => window.CMLAdmin.celebrate({ first_name: x.first_name, birth_month: x.birth_month, birth_day: x.birth_day }) : null
  }));
}

// ---------- start-up ----------
function init() {
  C = window.CML;
  if (!C) return;
  C.addStrings(ES, EN);
  const btn = document.getElementById("profileBtn");
  if (btn) btn.addEventListener("click", () => { renderProfile(); C.showPage("profile"); });
  document.addEventListener("cml:session", e => {
    if (!C.session() || (e.detail && e.detail.pending)) { urls.clear(); bdRows = []; return; }
    const me = C.profile();
    if (me && me.pref_lang && me.pref_lang !== C.lang()) C.setLanguage(me.pref_lang);
    renderBirthdays();
  });
  document.addEventListener("cml:lang", () => {
    if (!C.session()) return;
    const p = page(); if (p && p.classList.contains("active")) renderProfile();
    homeRender();
  });
  window.CMLProfile = { renderBirthdays, birthdays, avatarNode, signed };
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
