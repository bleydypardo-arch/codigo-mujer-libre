// Premium access — decides who sees the two exclusive buttons on Home (Crece & Florece, Spa Virtual).
// Each person is switched on or off by hand in Admin → "Acceso Premium" (settings key "premium_access":
// { userId: { florece: true, spa: true } }). When the membership opens, this is the one place to change.
// Nothing here touches any other part of the app; if it fails, the buttons simply stay hidden.
(function () {
"use strict";
let C = null;
const KEY = "premium_access";
const MODS = ["florece", "spa"];
const ES = {
  pxFlorece: "Crece & Florece", pxFloreceSub: "Tu camino de crecimiento", pxSpa: "Spa Virtual", pxSpaSub: "Un lugar solo para ti", pxPremium: "Premium",
  pxTab: "Acceso Premium", pxIntro: "Prende o apaga, persona por persona, quién ve los botones Crece & Florece y Spa Virtual en su inicio. Los cambios se ven al volver a abrir la app.",
  pxSearch: "Buscar por nombre", pxOn: "Prendido", pxOff: "Apagado", pxSaved: "Guardado.", pxFail: "No se pudo guardar. Inténtalo de nuevo.", pxEmpty: "No hay mujeres para mostrar.",
  pxAllTitle: "Para todas las miembras", pxAllHint: "Prendido: todas las aprobadas ven el botón. Apágalo cuando empiece la membresía; las personas con interruptor propio no cambian.", pxFounders: "Guardar a las miembras de hoy como fundadoras", pxFoundersAsk: "Esto prende los dos botones, para siempre, a todas las miembras aprobadas de hoy. Luego puedes apagar «Para todas» y ellas lo conservan. ¿Continuar?", pxFoundersDone: "Fundadoras guardadas."
};
const EN = {
  pxFlorece: "Crece & Florece", pxFloreceSub: "Your growth path", pxSpa: "Virtual Spa", pxSpaSub: "A place just for you", pxPremium: "Premium",
  pxTab: "Premium access", pxIntro: "Switch on or off, person by person, who sees the Crece & Florece and Virtual Spa buttons on their Home. Changes show when the app is reopened.",
  pxSearch: "Search by name", pxOn: "On", pxOff: "Off", pxSaved: "Saved.", pxFail: "Could not save. Please try again.", pxEmpty: "No women to show.",
  pxAllTitle: "For all members", pxAllHint: "On: every approved member sees the button. Turn it off when membership starts; people with their own switch do not change.", pxFounders: "Save today's members as founders", pxFoundersAsk: "This switches both buttons on, for good, for every approved member today. You can then turn off \"For all\" and they keep access. Continue?", pxFoundersDone: "Founders saved."
};
const t = k => { const v = C ? C.t(k) : ""; return v || k; };
const map = () => { const d = C && C.setting(KEY); return d && typeof d === "object" ? d : {}; };
const allOn = mod => { const a = C && C.setting("premium_all"); return a && typeof a === "object" ? a[mod] !== false : true; };
function can(mod) {
  try {
    const s = C && C.session && C.session(); if (!s || !s.user) return false;
    const mine = map()[s.user.id];
    if (mine && mod in mine) return !!mine[mod];     // an explicit On/Off always wins
    return !!(C.isStaff && C.isStaff());              // no choice saved: Jazz and Amilú see them by default
  } catch { return false; }
}
const DEFS = {
  florece: { cls: "px-florece", title: "pxFlorece", sub: "pxFloreceSub", host: "floreceEntry", go: () => { if (window.CMLFlorece) window.CMLFlorece.open("cover"); } },
  spa: { cls: "px-spa", title: "pxSpa", sub: "pxSpaSub", host: "spaEntry", go: () => { window.open("spa-virtual.html", "_blank", "noopener"); } }
};
function pill(mod) {
  const d = DEFS[mod];
  const b = C.el("button", { type: "button", class: "px-pill " + d.cls, "aria-label": t(d.title) + " · " + t("pxPremium") },
    C.el("span", { class: "px-tx" }, C.el("b", { text: t(d.title) }), C.el("small", { text: t(d.sub) })),
    C.el("span", { class: "px-p", "aria-hidden": "true", text: "P" }));
  b.addEventListener("click", d.go);
  return b;
}
function render() {
  MODS.forEach(mod => {
    const host = document.getElementById(DEFS[mod].host); if (!host) return;
    if (!can(mod)) { host.hidden = true; host.replaceChildren(); return; }
    host.replaceChildren(pill(mod)); host.hidden = false;
  });
}
// ---------- Admin tab ----------
async function members() {
  let rows = [];
  const r = await C.db.from("profiles").select("id,first_name,last_name,email,approved,role").order("first_name");
  if (!r.error && Array.isArray(r.data)) rows = r.data.filter(x => x.approved || x.role !== "member").map(x => ({ id: x.id, name: ((x.first_name || "") + " " + (x.last_name || "")).trim() || x.email || "?", sub: x.email || "" }));
  else {
    const q = await C.db.rpc("community_members");
    if (q.error) throw q.error;
    rows = (q.data || []).map(x => ({ id: x.id, name: x.first_name || "?", sub: x.city || "" }));
  }
  return rows;
}
async function adminTab() {
  const K = window.CMLAdmin.kit(), el = C.el;
  const wrap = el("div", { class: "px-admin" }, el("p", { class: "small-note", text: t("pxIntro") }));
  let rows; try { rows = await members(); } catch { return el("p", { class: "small-note", text: t("pxFail") }); }
  const allBox = el("div", { class: "px-all" }, el("b", { text: t("pxAllTitle") }), el("small", { text: t("pxAllHint") }));
  const allRow = el("div", { class: "px-sws" });
  const gsw = mod => {
    const on = allOn(mod);
    const b = el("button", { type: "button", class: "px-sw" + (on ? " on" : ""), role: "switch", "aria-checked": on ? "true" : "false" },
      el("span", { class: "px-sw-k" }), el("span", { class: "px-sw-l", text: t(DEFS[mod].title) }), el("span", { class: "px-sw-s", text: on ? t("pxOn") : t("pxOff") }));
    b.addEventListener("click", async () => {
      b.disabled = true;
      try { await window.CMLAdmin.setMapEntry("premium_all", mod, !on); K.toast(t("pxSaved")); if (C.refreshPublic) await C.refreshPublic(); } catch { K.toast(t("pxFail")); }
      paintAll(); paint();
    });
    return b;
  };
  const paintAll = () => allRow.replaceChildren(gsw("florece"), gsw("spa"));
  paintAll();
  const fb = el("button", { type: "button", class: "secondary px-founders", text: t("pxFounders") });
  fb.addEventListener("click", async () => {
    if (!await window.cmlConfirm(t("pxFoundersAsk"))) return;
    fb.disabled = true;
    try {
      const r = await C.db.from("settings").select("key,value").eq("key", KEY).maybeSingle(); if (r.error) throw r.error;
      const all = Object.assign({}, (r.data && r.data.value) || {});
      rows.forEach(u => { all[u.id] = Object.assign({}, all[u.id] || {}, { florece: true, spa: true }); });
      const w = await C.db.from("settings").upsert({ key: KEY, value: all, updated_at: new Date().toISOString() }, { onConflict: "key" }); if (w.error) throw w.error;
      K.toast(t("pxFoundersDone")); if (C.refreshPublic) await C.refreshPublic();
    } catch { K.toast(t("pxFail")); }
    fb.disabled = false; paint();
  });
  allBox.append(allRow, fb); wrap.appendChild(allBox);
  const search = el("input", { type: "search", placeholder: t("pxSearch"), "aria-label": t("pxSearch") });
  const list = el("div", { class: "px-list" });
  const dflt = (u, mod) => allOn(mod) || !!u.staff;
  const eff = (u, mod) => { const m = map()[u.id]; return m && mod in m ? !!m[mod] : dflt(u, mod); };
  const sw = (u, mod) => {
    const on = eff(u, mod);
    const b = el("button", { type: "button", class: "px-sw" + (on ? " on" : ""), role: "switch", "aria-checked": on ? "true" : "false", "aria-label": t(DEFS[mod].title) },
      el("span", { class: "px-sw-k" }), el("span", { class: "px-sw-l", text: t(DEFS[mod].title) }), el("span", { class: "px-sw-s", text: on ? t("pxOn") : t("pxOff") }));
    b.addEventListener("click", async () => {
      const cur = Object.assign({}, map()[u.id] || {}); cur[mod] = !on; if (cur[mod] === dflt(u, mod)) delete cur[mod];   // back to the default: no entry needed
      b.disabled = true;
      try {
        await window.CMLAdmin.setMapEntry(KEY, u.id, Object.keys(cur).length ? cur : null);
        K.toast(t("pxSaved"));
        if (C.refreshPublic) await C.refreshPublic();
      } catch { K.toast(t("pxFail")); }
      paint();
    });
    return b;
  };
  function paint() {
    const q = search.value.trim().toLowerCase();
    const have = id => { const u = rows.find(r => r.id === id); return u && (eff(u, "florece") || eff(u, "spa")); };
    const shown = rows.filter(u => !q || (u.name + " " + u.sub).toLowerCase().includes(q)).sort((a, b) => (have(b.id) ? 1 : 0) - (have(a.id) ? 1 : 0));
    list.replaceChildren(...(shown.length ? shown.map(u => el("div", { class: "px-row" + (have(u.id) ? " has" : "") },
      el("div", { class: "px-who" }, el("b", { text: u.name }), u.sub ? el("small", { text: u.sub }) : null),
      el("div", { class: "px-sws" }, sw(u, "florece"), sw(u, "spa")))) : [el("p", { class: "small-note", text: t("pxEmpty") })]));
  }
  search.addEventListener("input", paint); paint();
  wrap.append(search, list);
  return wrap;
}
function init() {
  C = window.CML; if (!C) return;
  try {
    C.addStrings(ES, EN);
    ["cml:render", "cml:session", "cml:lang"].forEach(ev => document.addEventListener(ev, () => { try { render(); } catch (e) { console.error(e); } }));
    if (window.CMLAdmin && window.CMLAdmin.registerTab) window.CMLAdmin.registerTab("premium", { group: "content", label: { es: ES.pxTab, en: EN.pxTab }, render: async () => adminTab() });
    window.CMLPremium = { can, render };
    render();
  } catch (e) { console.error(e); }
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
