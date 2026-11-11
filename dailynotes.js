// Código ML — "Mensaje de hoy" (broadcast to every woman, optional per city), birthday bouquet, and the Admin tab to load them.
// No database changes: messages live in the existing `settings` table under the key "daily_notes" (same way the Spa content does).
// Shape: { "<id>": { day: "YYYY-MM-DD", city: "" | "<cityKey>", es: "...", en: "...", plan: "<plan id, optional>", from: "<sender, optional>" } }
(function () {
"use strict";
let C = null, shownThisSession = false;
const KEY = "daily_notes", SEEN = "cml_dn_seen", BDAY = "cml_bday_seen";
const ES = {
  dnTitle: "Mensaje de hoy", dnFrom: "De Código ML, con cariño", dnThanks: "Gracias 🌸", dnSee: "Ver el plan", dnBell: n => "💌 Mensaje de hoy: " + n,
  bdTitle2: "¡Feliz cumpleaños!", bdBody: n => n + ", hoy es tu día. Este ramo es para ti, de parte de Jazz y de todas las mujeres de Código ML.", bdBell: "💐 Hoy es tu cumpleaños: abre tu ramo.",
  dnTab: "Mensajes diarios", dnIntro: "Un mensaje al día para todas las mujeres (o para una ciudad). Aparece al entrar a la app y en la campanita. Escríbelo corto, cálido y con una acción.",
  dnNewH: "Nuevo mensaje", dnDate: "Día en que se muestra", dnCity: "Para", dnAll: "Todas las ciudades", dnEs: "Mensaje en español", dnEn: "Mensaje en inglés (opcional)", dnFromLbl: "Firma (ej. Karen, líder de Bogotá)",
  dnPlan: "Recomendar un plan o lugar (opcional)", dnNoPlan: "Ninguno", dnSave: "Guardar mensaje", dnSaved: "Mensaje guardado.", dnFail: "No se pudo guardar.", dnEmpty: "Escribe el mensaje en español.",
  dnBulkH: "Cargar varios de una vez", dnBulkHelp: "Una línea por día: 2026-11-12 | mensaje en español | mensaje en inglés (opcional) | firma (opcional) | ciudad (opcional, si la dejas vacía usa la de arriba). Sirve para cargar toda la semana de Karen.", dnBulkBtn: "Cargar las líneas", dnBulkOk: n => n + " mensajes cargados.",
  dnListH: "Mensajes programados", dnNone: "Todavía no hay mensajes.", dnDel: "Quitar", dnWipe: "Borrar TODOS los mensajes y empezar limpio", dnWipeAsk: n => "¿Borrar los " + n + " mensajes programados? Después tendrás que cargarlos otra vez.", dnDelCity: "Quitar todos los de esta ciudad", dnDelCityAsk: n => "¿Quitar " + n + " mensajes de esa ciudad?", dnDelAsk: "¿Quitar este mensaje?",
  dnBdH: "Cumpleaños de los próximos 7 días", dnBdNone: "Nadie cumple años esta semana.", dnBdToday: "hoy", dnBdWa: "Felicitar por WhatsApp", dnBdDraft: n => "Hola " + n + " 🌸 Hoy es tu día y toda la comunidad Código ML se alegra contigo. ¡Feliz cumpleaños! 💐 Con cariño, Código ML"
};
const EN = {
  dnTitle: "Today's message", dnFrom: "From Código ML, with love", dnThanks: "Thank you 🌸", dnSee: "See the plan", dnBell: n => "💌 Today's message: " + n,
  bdTitle2: "Happy birthday!", bdBody: n => n + ", today is your day. This bouquet is for you, from Jazz and all the women of Código ML.", bdBell: "💐 Today is your birthday: open your bouquet.",
  dnTab: "Daily messages", dnIntro: "One message a day for every woman (or for one city). It shows when they open the app and in the bell.",
  dnNewH: "New message", dnDate: "Day it shows", dnCity: "For", dnAll: "All cities", dnEs: "Message in Spanish", dnEn: "Message in English (optional)", dnFromLbl: "Signature (e.g. Karen, Bogotá leader)",
  dnPlan: "Recommend a plan or place (optional)", dnNoPlan: "None", dnSave: "Save message", dnSaved: "Message saved.", dnFail: "Could not save.", dnEmpty: "Write the message in Spanish.",
  dnBulkH: "Load several at once", dnBulkHelp: "One line per day: 2026-11-12 | Spanish message | English message (optional).", dnBulkBtn: "Load lines", dnBulkOk: n => n + " messages loaded.",
  dnListH: "Scheduled messages", dnNone: "No messages yet.", dnDel: "Remove", dnWipe: "Delete ALL messages and start clean", dnWipeAsk: n => "Delete all " + n + " scheduled messages? You will need to load them again.", dnDelCity: "Remove all for this city", dnDelCityAsk: n => "Remove " + n + " messages for that city?", dnDelAsk: "Remove this message?",
  dnBdH: "Birthdays in the next 7 days", dnBdNone: "No birthdays this week.", dnBdToday: "today", dnBdWa: "Wish her on WhatsApp", dnBdDraft: n => "Hi " + n + " 🌸 Today is your day and the whole Código ML community celebrates with you. Happy birthday! 💐 With love, Código ML"
};
const t = (k, ...a) => { const v = C ? C.t(k) : ""; return typeof v === "function" ? v(...a) : (v || k); };
const store = (k, v) => { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || "[]"); localStorage.setItem(k, JSON.stringify(v)); } catch { return []; } };
const all = () => { const s = C.setting(KEY); return s && typeof s === "object" ? s : {}; };
const text = n => (C.lang() === "en" && n.en && n.en.trim()) ? n.en : n.es;
function today() {
  const d = C.todayStr(), v = C.viewCity(), mine = Object.keys(all()).map(id => Object.assign({ id }, all()[id]));
  // The spheres / prizes contest is Bogotá-only for now: those messages never reach any other city, whatever city they were loaded for.
  const contest = n => /esfera|sphere|ticket|premios de las/i.test((n.es || "") + " " + (n.en || ""));
  return mine.filter(n => n.day === d && n.es && (!n.city || v === "all" || C.cityKey(n.city) === v) && (!contest(n) || v === "bogota"));
}
function isBirthday() {
  const p = C.profile(), n = new Date();
  return !!(p && p.birth_month && p.birth_day && p.birth_month === n.getMonth() + 1 && p.birth_day === n.getDate());
}
function bouquet() {
  const NS = "http://www.w3.org/2000/svg", s = document.createElementNS(NS, "svg");
  s.setAttribute("viewBox", "0 0 300 300"); s.setAttribute("class", "dn-bouquet"); s.setAttribute("role", "img"); s.setAttribute("aria-hidden", "true");
  const add = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); Object.keys(attrs).forEach(k => e.setAttribute(k, attrs[k])); (parent || s).appendChild(e); return e; };
  [[-38, 120], [-22, 128], [0, 132], [22, 128], [38, 120]].forEach(([a, h]) => add("path", { d: "M150 270 C150 220 " + (150 + a * 1.4) + " 190 " + (150 + a * 2.2) + " " + (270 - h * 1.1), stroke: "#5E7A55", "stroke-width": 4, fill: "none", "stroke-linecap": "round" }));
  [[-50, 190, "#7C9A6E"], [50, 190, "#7C9A6E"], [-72, 175, "#6E8D63"], [72, 175, "#6E8D63"]].forEach(([a, y, c]) => add("ellipse", { cx: 150 + a, cy: y, rx: 14, ry: 34, fill: c, transform: "rotate(" + (a < 0 ? -40 : 40) + " " + (150 + a) + " " + y + ")" }));
  const flower = (cx, cy, r, petal, heart) => {
    const g = add("g", { class: "dn-fl" });
    for (let i = 0; i < 5; i++) add("ellipse", { cx, cy: cy - r * 0.9, rx: r * 0.55, ry: r * 0.95, fill: petal, opacity: 0.96, transform: "rotate(" + i * 72 + " " + cx + " " + cy + ")" }, g);
    add("circle", { cx, cy, r: r * 0.3, fill: heart }, g); add("circle", { cx, cy, r: r * 0.13, fill: "#FFF3D6" }, g);
  };
  flower(86, 128, 30, "#F4B6C8", "#C2185B"); flower(214, 128, 30, "#F4B6C8", "#C2185B"); flower(150, 100, 36, "#FFFFFF", "#D4A017");
  flower(112, 168, 28, "#E58FB0", "#8E1B5B"); flower(188, 168, 28, "#E58FB0", "#8E1B5B"); flower(150, 154, 30, "#F9D5DF", "#C5A46A");
  flower(60, 176, 18, "#FFD9E2", "#C2185B"); flower(240, 176, 18, "#FFD9E2", "#C2185B");
  add("path", { d: "M104 250 L150 214 L196 250 L180 276 L120 276 Z", fill: "#800F32" });
  add("path", { d: "M150 214 L120 276 M150 214 L180 276", stroke: "#C5A46A", "stroke-width": 2, fill: "none" });
  add("path", { d: "M132 252 q18 -22 36 0 q-18 12 -36 0 z", fill: "#C5A46A" });
  return s;
}
function modal(kids, onClose) {
  const el = C.el, back = el("div", { class: "dn-back", role: "dialog", "aria-modal": "true" }), card = el("div", { class: "dn-card" }, ...kids);
  const close = () => { back.remove(); document.removeEventListener("keydown", esc); if (onClose) onClose(); };
  const esc = e => { if (e.key === "Escape") close(); };
  back.addEventListener("click", e => { if (e.target === back) close(); });
  document.addEventListener("keydown", esc);
  back.appendChild(card); document.body.appendChild(back);
  const btn = card.querySelector("button"); if (btn) btn.focus();
  return close;
}
function showBirthday(next) {
  const el = C.el, name = (C.profile().first_name || "").trim();
  const ok = el("button", { type: "button", class: "primary dn-ok", text: t("dnThanks") });
  const close = modal([el("div", { class: "dn-conf", "aria-hidden": "true" }, "✦ ✧ ✦ ✧ ✦"), bouquet(), el("h2", { class: "dn-h", text: t("bdTitle2") }), el("p", { class: "dn-p", text: t("bdBody", name || "") }), el("small", { class: "dn-from", text: t("dnFrom") }), ok], next);
  ok.addEventListener("click", close);
  store(BDAY, [C.todayStr()]);
}
function showNote(n, next) { showNotes([n], next); }
function showNotes(list, next) {
  const el = C.el, ok = el("button", { type: "button", class: "primary dn-ok", text: t("dnThanks") });
  const kids = [el("div", { class: "dn-ic", "aria-hidden": "true" }, "💌"), el("h2", { class: "dn-h", text: t("dnTitle") })];
  const planBtns = [];
  list.forEach((n, i) => {
    const box = el("div", { class: "dn-msg" }, el("p", { class: "dn-p", text: text(n) }));
    if (n.plan && C.homeData().plans.some(p => p.id === n.plan)) { const b = el("button", { type: "button", class: "secondary dn-see", text: t("dnSee") }); planBtns.push([b, n.plan]); box.appendChild(b); }
    box.appendChild(el("small", { class: "dn-from", text: n.from || t("dnFrom") }));
    kids.push(box);
  });
  kids.push(ok);
  const close = modal(kids, next);
  ok.addEventListener("click", close);
  planBtns.forEach(([b, id]) => b.addEventListener("click", () => { close(); try { C.openDetail(id); } catch { /* plan gone */ } }));
  const seen = store(SEEN); list.forEach(n => seen.push(n.id)); store(SEEN, seen.slice(-120));
}
function runEntrance() {
  if (shownThisSession || !C.session() || !C.profile()) return;
  shownThisSession = true;
  const seen = store(SEEN), queue = [];
  if (isBirthday() && !store(BDAY).includes(C.todayStr())) queue.push(next => showBirthday(next));
  const fresh = today().filter(n => !seen.includes(n.id)).slice(0, 3);
  if (fresh.length) queue.push(next => showNotes(fresh, next));
  const go = () => { const f = queue.shift(); if (f) f(go); };
  go();
}

// ---------- Admin tab ----------
const ID = () => "n" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
async function build() {
  const A = window.CMLAdmin, K = A.kit(), el = C.el;
  const wrap = el("div", { class: "dn-admin" }, el("p", { class: "small-note", text: t("dnIntro") }));
  const sec = (title, help) => { const s = el("section", { class: "card sa-sec" }, el("h3", { text: title }), help ? el("p", { class: "small-note", text: help }) : null); wrap.appendChild(s); return s; };
  const lbl = (label, node) => el("label", { class: "sa-lbl" }, label, node);
  // new message
  const ns = sec(t("dnNewH"));
  const day = el("input", { type: "date", value: C.todayStr() });
  const city = el("select", {}, el("option", { value: "", text: t("dnAll") }), ...C.cities().map(c => el("option", { value: C.cityKey(c.name), text: c.name })));
  const es = el("textarea", { rows: 3, class: "ta", maxlength: 400, placeholder: t("dnEs") }), en = el("textarea", { rows: 2, class: "ta", maxlength: 400, placeholder: t("dnEn") });
  const from = el("input", { type: "text", maxlength: 60, placeholder: t("dnFromLbl"), "aria-label": t("dnFromLbl") });
  const plan = el("select", {}, el("option", { value: "", text: t("dnNoPlan") }), ...C.homeData().plans.filter(p => p.kind !== "trip").slice(0, 120).map(p => el("option", { value: p.id, text: C.pick(p, "title") || "—" })));
  plan.addEventListener("change", () => { const p = C.homeData().plans.find(x => x.id === plan.value); if (p && !es.value.trim()) es.value = "✨ " + (C.pick(p, "title") || ""); });
  const save = el("button", { type: "button", class: "primary", text: t("dnSave") });
  ns.append(lbl(t("dnDate"), day), lbl(t("dnCity"), city), es, en, from, lbl(t("dnPlan"), plan), save);
  save.addEventListener("click", async () => {
    if (!es.value.trim()) return K.toast(t("dnEmpty"));
    save.disabled = true;
    try {
      await A.setMapEntry(KEY, ID(), { day: day.value, city: city.value, es: es.value.trim(), en: en.value.trim(), plan: plan.value || "", from: from.value.trim() });
      es.value = ""; en.value = ""; plan.value = ""; K.toast(t("dnSaved")); if (C.refreshPublic) await C.refreshPublic(); paintList();
    } catch { K.toast(t("dnFail")); }
    save.disabled = false;
  });
  // bulk
  const bs = sec(t("dnBulkH"), t("dnBulkHelp"));
  const bcity = el("select", { "aria-label": t("dnCity") }, el("option", { value: "", text: t("dnAll") }), ...C.cities().map(c => el("option", { value: C.cityKey(c.name), text: c.name })));
  const bulk = el("textarea", { rows: 6, class: "ta", "aria-label": t("dnBulkH") }), bb = el("button", { type: "button", class: "secondary", text: t("dnBulkBtn") });
  bs.append(lbl(t("dnCity"), bcity), bulk, bb);
  bb.addEventListener("click", async () => {
    const rows = bulk.value.split(/\n+/).map(l => l.split("|").map(s => s.trim())).filter(r => /^\d{4}-\d{2}-\d{2}$/.test(r[0]) && r[1]);
    if (!rows.length) return K.toast(t("dnEmpty"));
    bb.disabled = true;
    try {
      for (const r of rows) await A.setMapEntry(KEY, ID(), { day: r[0], city: r[4] ? C.cityKey(r[4]) : bcity.value, es: r[1], en: r[2] || "", plan: "", from: r[3] || "" });
      bulk.value = ""; K.toast(t("dnBulkOk", rows.length)); if (C.refreshPublic) await C.refreshPublic(); paintList();
    } catch { K.toast(t("dnFail")); }
    bb.disabled = false;
  });
  // list
  const ls = sec(t("dnListH")), list = el("div", { class: "sa-list" });
  const dcity = el("select", { "aria-label": t("dnDelCity") }, ...C.cities().map(c => el("option", { value: C.cityKey(c.name), text: c.name })));
  const dall = el("button", { type: "button", class: "danger", text: t("dnDelCity") });
  dall.addEventListener("click", async () => {
    const ids = Object.keys(all()).filter(id => all()[id].city && C.cityKey(all()[id].city) === dcity.value);
    if (!ids.length) return K.toast(t("dnNone"));
    if (!await window.cmlConfirm(t("dnDelCityAsk", ids.length))) return;
    dall.disabled = true;
    try { for (const id of ids) await A.setMapEntry(KEY, id, null); if (C.refreshPublic) await C.refreshPublic(); paintList(); } catch { K.toast(t("dnFail")); }
    dall.disabled = false;
  });
  const wipe = el("button", { type: "button", class: "danger", text: t("dnWipe") });
  wipe.addEventListener("click", async () => {
    const ids = Object.keys(all());
    if (!ids.length) return K.toast(t("dnNone"));
    if (!await window.cmlConfirm(t("dnWipeAsk", ids.length))) return;
    wipe.disabled = true;
    try { await A.setMapEntry(KEY, "__wipe__", null); const r = await C.db.from("settings").upsert({ key: KEY, value: {}, updated_at: new Date().toISOString() }, { onConflict: "key" }); if (r.error) throw r.error; if (C.refreshPublic) await C.refreshPublic(); paintList(); } catch { K.toast(t("dnFail")); }
    wipe.disabled = false;
  });
  ls.append(el("div", { class: "sa-row" }, dcity, dall), el("div", { class: "sa-row" }, wipe), list);
  function paintList() {
    const items = Object.keys(all()).map(id => Object.assign({ id }, all()[id])).filter(n => n.day >= C.todayStr()).sort((a, b) => (a.day < b.day ? -1 : 1));
    list.replaceChildren(...(items.length ? items.map(n => {
      const d = el("button", { type: "button", class: "danger sa-del", text: t("dnDel") });
      d.addEventListener("click", async () => { if (!await window.cmlConfirm(t("dnDelAsk"))) return; try { await A.setMapEntry(KEY, n.id, null); if (C.refreshPublic) await C.refreshPublic(); paintList(); } catch { K.toast(t("dnFail")); } });
      return el("div", { class: "sa-row" }, el("b", { text: n.day + (n.city ? " · " + (C.cityName(C.cityKey(n.city)) || n.city) : "") }), el("span", { text: n.es }), d);
    }) : [el("p", { class: "small-note", text: t("dnNone") })]));
  }
  paintList();
  // birthdays
  const bd = sec(t("dnBdH")), bl = el("div", { class: "sa-list" }); bd.appendChild(bl);
  C.db.from("profiles").select("first_name,phone,whatsapp,birth_month,birth_day,pref_lang").not("birth_month", "is", null).then(r => {
    const now = new Date(), t0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const rows = (r.data || []).map(p => {
      let d = new Date(now.getFullYear(), p.birth_month - 1, p.birth_day); if (d.getTime() < t0) d = new Date(now.getFullYear() + 1, p.birth_month - 1, p.birth_day);
      return Object.assign({ days: Math.round((d.getTime() - t0) / 86400000), d }, p);
    }).filter(p => p.days <= 7).sort((a, b) => a.days - b.days);
    bl.replaceChildren(...(rows.length ? rows.map(p => {
      const num = String(p.whatsapp || p.phone || "").replace(/\D/g, "");
      const a = el("a", { class: "secondary dn-wa", target: "_blank", rel: "noopener", text: t("dnBdWa"), href: num ? "https://wa.me/" + num + "?text=" + encodeURIComponent((p.pref_lang === "en" ? EN : ES).dnBdDraft(p.first_name || "")) : "#" });
      return el("div", { class: "sa-row" }, el("b", { text: (p.first_name || "—") + " · " + (p.days === 0 ? t("dnBdToday") : p.d.toLocaleDateString(C.loc(), { month: "short", day: "numeric" })) }), num ? a : el("small", { text: "—" }));
    }) : [el("p", { class: "small-note", text: t("dnBdNone") })]));
  }).catch(() => {});
  return wrap;
}

function init() {
  C = window.CML; if (!C) return;
  C.addStrings(ES, EN);
  window.CMLDailyNotes = {
    today, isBirthday, text,
    show: id => { const n = today().find(x => x.id === id); if (n) showNote(n); },
    birthday: () => { if (isBirthday()) showBirthday(); }
  };
  if (window.CMLAdmin && window.CMLAdmin.registerTab) window.CMLAdmin.registerTab("notes", { group: "content", label: { es: ES.dnTab, en: EN.dnTab }, render: async () => build() });
  document.addEventListener("cml:session", e => {
    shownThisSession = false;
    if (!C.session() || (e.detail && e.detail.pending)) return;
    setTimeout(runEntrance, 2500);
  });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
