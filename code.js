// Código Mujer Libre — "¿Cuál es tu código esta semana?" (the brand idea, small and elegant).
// Not a test and not a label: just what she wants more of this week. The choice is kept on this device for
// the current week only, and each code points to content that already exists (events, wellness, travel,
// the Matcha corner, community, support). No new pages, no new tables.
(function () {
"use strict";
let C = null;
const CODES = ["Social", "Wellness", "Connection", "Adventure", "Faith", "Family", "Recharge", "Support"];
const ICON = {
  Social: "M8 3h8l-1 7a3 3 0 0 1-6 0zM12 13v6M8.5 21h7",
  Wellness: "M5 19c0-8 5-13 14-14-1 9-6 14-14 14zM5 19l7-7",
  Connection: "M9 12a4 4 0 1 1 0-.01M15 12a4 4 0 1 1 0-.01",
  Adventure: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM15.5 8.5l-2 5-5 2 2-5z",
  Faith: "M12 3v18M7 8.5h10",
  Family: "M8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM16.5 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM2.5 20c.5-3.5 2.8-5.5 5.5-5.5s5 2 5.5 5.5M13 15.2c1-.8 2.2-1.2 3.5-1.2 2.4 0 4.3 1.7 4.8 4.5",
  Recharge: "M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z",
  Support: "M12 20s-7-4.3-7-9.5A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.5C19 15.7 12 20 12 20z"
};
const ES = {
  wcLabel: "TU CÓDIGO", wcQ: "¿Cuál es tu código esta semana?", wcSub: "Elige lo que quieres vivir más estos días y te mostramos por dónde empezar.",
  wcYour: "Tu código esta semana", wcChange: "Cambiar mi código", wcPickHint: "Toca uno. Puedes cambiarlo cuando quieras.", wcBrand: "Cada mujer tiene su código. Cambia cuando tú cambias.",
  wcName_Social: "Social", wcName_Wellness: "Bienestar", wcName_Connection: "Conexión", wcName_Adventure: "Aventura",
  wcName_Faith: "Fe", wcName_Family: "Familia", wcName_Recharge: "Recargar", wcName_Support: "Apoyo",
  wcMsg_Social: "Esta semana es para salir, reír y compartir con otras mujeres.",
  wcMsg_Wellness: "Esta semana, tu prioridad eres tú: cuerpo, mente y descanso.",
  wcMsg_Connection: "Conversaciones reales y amistades que crecen sin prisa.",
  wcMsg_Adventure: "Algo nuevo, un lugar distinto, una historia por contar.",
  wcMsg_Faith: "Calma, gratitud y fe para caminar cada día.",
  wcMsg_Family: "Tiempo de calidad con quienes más quieres.",
  wcMsg_Recharge: "Bajar el ritmo también es avanzar. Haz espacio para ti.",
  wcMsg_Support: "No tienes que cargarlo todo sola. Aquí estamos.",
  wcGo_plans: (c, n) => "Planes de " + c + " · " + n, wcGo_events: "Ver planes y eventos", wcGo_matcha: "Rincón Matcha & Arte", wcGo_community: "Comunidad",
  wcGo_wellness: "Bienestar", wcGo_travel: "Viajes y Experiencias", wcGo_prayer: "Muro de oración", wcGo_support: "Aquí para ti",
  wcGo_talk: "Hablar en privado", wcGo_daily: "Tu código de hoy", wcGo_decide: "Decidamos juntas"
};
const EN = {
  wcLabel: "YOUR CODE", wcQ: "What's your code this week?", wcSub: "Choose what you want more of these days and we'll show you where to start.",
  wcYour: "Your code this week", wcChange: "Change my code", wcPickHint: "Tap one. You can change it anytime.", wcBrand: "Every woman has her code. It changes when you do.",
  wcName_Social: "Social", wcName_Wellness: "Wellness", wcName_Connection: "Connection", wcName_Adventure: "Adventure",
  wcName_Faith: "Faith", wcName_Family: "Family", wcName_Recharge: "Recharge", wcName_Support: "Support",
  wcMsg_Social: "This week is for going out, laughing and sharing with other women.",
  wcMsg_Wellness: "This week, you are the priority: body, mind and rest.",
  wcMsg_Connection: "Real conversations and friendships that grow without hurry.",
  wcMsg_Adventure: "Something new, a different place, a story to tell.",
  wcMsg_Faith: "Calm, gratitude and faith to walk through each day.",
  wcMsg_Family: "Quality time with the people you love most.",
  wcMsg_Recharge: "Slowing down is also moving forward. Make room for yourself.",
  wcMsg_Support: "You don't have to carry it all alone. We're here.",
  wcGo_plans: (c, n) => c + " plans · " + n, wcGo_events: "See plans & events", wcGo_matcha: "Matcha & Art Corner", wcGo_community: "Community",
  wcGo_wellness: "Wellness", wcGo_travel: "Travel & Experiences", wcGo_prayer: "Prayer wall", wcGo_support: "Here for you",
  wcGo_talk: "Talk privately", wcGo_daily: "Your code for today", wcGo_decide: "Let's decide together"
};
// Signature orchid (phalaenopsis-inspired), drawn inline so it can float, sway and shift color. Unique gradient ids per copy.
let __oid = 0;
function orchidSVG(cls, white) {
  const p = "or" + (++__oid) + "_";
  const mx = d => d.replace(/(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g, (m, x, y) => (200 - parseFloat(x)) + " " + y);
  const petalL = "M99 96 C90 70 70 42 42 40 C14 40 4 70 12 96 C20 122 52 128 76 118 C88 112 96 104 99 100Z";
  const sepalTop = "M100 92 C80 76 74 42 100 16 C126 42 120 76 100 92Z";
  const sepalL = "M99 104 C80 116 56 140 52 170 C60 178 74 174 84 162 C96 146 102 124 102 108Z";
  const lobeL = "M96 108 C84 100 72 106 74 118 C76 126 86 126 94 118Z";
  const lip = "M100 106 C90 108 82 118 86 130 C89 139 95 146 100 152 C105 146 111 139 114 130 C118 118 110 108 100 106Z";
  const veins = side => {
    const v = ["M98 98 C80 84 56 70 34 66", "M98 98 C78 96 52 96 26 92", "M98 100 C80 106 58 112 38 114", "M98 96 C84 78 66 58 50 50"];
    return v.map(d => '<path d="' + (side ? mx(d) : d) + '"/>').join("");
  };
  const svgStr = '<svg class="' + (cls || "orchid") + '" viewBox="0 0 200 200" aria-hidden="true" focusable="false">' +
  '<defs>' +
  '<radialGradient id="' + p + 'pt" cx="100" cy="98" r="96" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFF8EF"/><stop offset=".22" stop-color="#FCE1E8"/><stop offset=".55" stop-color="#F4A9C2"/><stop offset=".85" stop-color="#E06A98"/><stop offset="1" stop-color="#C94C82"/></radialGradient>' +
  '<radialGradient id="' + p + 'sp" cx="100" cy="98" r="90" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFF4EC"/><stop offset=".35" stop-color="#F8C9D7"/><stop offset=".8" stop-color="#E585A8"/><stop offset="1" stop-color="#CF5A8C"/></radialGradient>' +
  '<linearGradient id="' + p + 'lp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D23C78"/><stop offset=".6" stop-color="#A8205A"/><stop offset="1" stop-color="#7E1744"/></linearGradient>' +
  '<radialGradient id="' + p + 'th" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#FFE7A8"/><stop offset=".6" stop-color="#E8B85C"/><stop offset="1" stop-color="#C9923E"/></radialGradient>' +
  '<radialGradient id="' + p + 'gl" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE9EF" stop-opacity=".9"/><stop offset="1" stop-color="#FFE9EF" stop-opacity="0"/></radialGradient>' +
  '</defs>' +
  '<circle class="or-glow" cx="100" cy="100" r="96" fill="url(#' + p + 'gl)"/>' +
  '<g class="or-bloom">' +
  '<g fill="url(#' + p + 'sp)" stroke="#fff" stroke-opacity=".55" stroke-width=".8">' +
  '<path d="' + sepalTop + '"/><path d="' + sepalL + '"/><path d="' + mx(sepalL) + '"/></g>' +
  '<g fill="url(#' + p + 'pt)" stroke="#fff" stroke-opacity=".6" stroke-width=".8"><path d="' + petalL + '"/><path d="' + mx(petalL) + '"/></g>' +
  '<g fill="none" stroke="#B83A72" stroke-opacity=".22" stroke-width=".7" stroke-linecap="round">' + veins(false) + veins(true) +
  '<path d="M100 88 L100 30"/><path d="M100 108 L62 166"/><path d="M100 108 L138 166"/></g>' +
  '<g fill="url(#' + p + 'lp)"><path d="' + lobeL + '"/><path d="' + mx(lobeL) + '"/><path d="' + lip + '"/></g>' +
  '<path d="M95 150 C90 156 86 158 82 157 M105 150 C110 156 114 158 118 157" fill="none" stroke="#A8205A" stroke-width="1.6" stroke-linecap="round"/>' +
  '<ellipse cx="100" cy="117" rx="7.5" ry="9" fill="url(#' + p + 'th)"/>' +
  '<g fill="#B0264F" opacity=".75"><circle cx="97" cy="114" r="1"/><circle cx="103" cy="114" r="1"/><circle cx="100" cy="120" r="1"/><circle cx="96" cy="121" r=".8"/><circle cx="104" cy="121" r=".8"/></g>' +
  '<ellipse cx="100" cy="101" rx="5.5" ry="7.5" fill="#FFF5E6" stroke="#E8C98F" stroke-width=".8"/>' +
  '<ellipse cx="100" cy="97" rx="2.6" ry="2.2" fill="#F0CF86"/>' +
  '</g>' +
  '<g class="or-spark" fill="#E9CF9E"><path d="M168 40l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/><path d="M34 160l1.4 4 4 1.4-4 1.4-1.4 4-1.4-4-4-1.4 4-1.4z"/></g>' +
  '</svg>';
  if (!white) return svgStr;
  // White phalaenopsis: same shapes, white petals and sepals (the lip keeps its soft magenta), for the Wellness card.
  return svgStr
    .replace(/<stop offset="0" stop-color="#FFF8EF"\/><stop offset="\.22" stop-color="#FCE1E8"\/><stop offset="\.55" stop-color="#F4A9C2"\/><stop offset="\.85" stop-color="#E06A98"\/><stop offset="1" stop-color="#C94C82"\/>/, '<stop offset="0" stop-color="#FFFFFF"/><stop offset=".22" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#FAF6F8"/><stop offset=".85" stop-color="#F0E7EC"/><stop offset="1" stop-color="#E5D9E0"/>')
    .replace(/<stop offset="0" stop-color="#FFF4EC"\/><stop offset="\.35" stop-color="#F8C9D7"\/><stop offset="\.8" stop-color="#E585A8"\/><stop offset="1" stop-color="#CF5A8C"\/>/, '<stop offset="0" stop-color="#FFFFFF"/><stop offset=".35" stop-color="#FDFBFC"/><stop offset=".8" stop-color="#F2EAEF"/><stop offset="1" stop-color="#E6DBE1"/>')
    .replace('stroke="#B83A72" stroke-opacity=".22"', 'stroke="#9A7A8C" stroke-opacity=".22"');
}
window.CMLOrchid = { svg: orchidSVG };
function orchid(cls) { const s = el("span", { class: "wc-orchid " + (cls || ""), "aria-hidden": "true" }); s.innerHTML = orchidSVG("orchid"); return s; }

const t = (key, ...args) => { const v = C ? C.t(key) : ""; return typeof v === "function" ? v(...args) : (v || key); };
const el = (...a) => C.el(...a);

// ISO-like week number so the choice resets every Monday
function weekKey() {
  const d = new Date(); d.setHours(0, 0, 0, 0);
  const day = (d.getDay() + 6) % 7; d.setDate(d.getDate() - day);
  return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}
const storeKey = () => "cmlWeekCode:" + ((C.session() && C.session().user.id) || "") + ":" + weekKey();
function getCode() { try { const v = localStorage.getItem(storeKey()); return CODES.includes(v) ? v : ""; } catch { return memo; } }
let memo = "";
function setCode(v) { memo = v; try { if (v) localStorage.setItem(storeKey(), v); else localStorage.removeItem(storeKey()); } catch { /* session only */ } }
// Weekly phrase for a code. Admin library (settings "code_msgs"): phrases for this month, else "every month" ones, rotating one per week;
// no library entry = the original phrase above.
function msgFor(code) {
  const lib = C && C.setting ? C.setting("code_msgs") : null;
  const list = lib && Array.isArray(lib[code]) ? lib[code] : [];
  const month = new Date().getMonth() + 1;
  let pool = list.filter(x => x && x.m === month);
  if (!pool.length) pool = list.filter(x => x && (!x.m || x.m === 0));
  if (pool.length) {
    const week = Math.floor((new Date().setHours(0, 0, 0, 0) - new Date(2026, 0, 5).getTime()) / (7 * 86400000));
    const p = pool[((week % pool.length) + pool.length) % pool.length];
    const lang = C.lang() === "en" ? "en" : "es";
    const text = (p[lang] || p[lang === "en" ? "es" : "en"] || "").trim();
    if (text) return text;
  }
  return t("wcMsg_" + code);
}

// A soft bloom of the code's colour when it is chosen (fx.css). Removed after it plays; never blocks anything.
const BLOOM = { Social: "#FADBD8", Wellness: "#DDEBD9", Connection: "#E7B8B5", Adventure: "#DBC19F", Faith: "#EFE6DE", Family: "#FADBD8", Recharge: "#DDEBD9", Support: "#F3C9C6" };
function bloom(code) {
  const res = document.querySelector(".wc-result");
  if (!res || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
  res.style.setProperty("--bloom", BLOOM[code] || "#FADBD8");
  res.classList.add("wc-bloom");
  setTimeout(() => res.classList.remove("wc-bloom"), 1300);
}
function svg(code, cls) {
  const s = el("span", { class: cls, "aria-hidden": "true" });
  s.innerHTML = '<svg class="ci" viewBox="0 0 24 24" focusable="false"><path d="' + ICON[code] + '"/></svg>';
  return s;
}
function svgPath(d, cls) { const s = el("span", { class: cls, "aria-hidden": "true" }); s.innerHTML = '<svg class="ci" viewBox="0 0 24 24" focusable="false"><path d="' + d + '"/></svg>'; return s; }
function upcomingWith(code) {
  const today = C.todayStr();
  return C.homeData().plans.filter(p => p.kind === "event" && p.code === code && (!p.event_date || p.event_date >= today)).length;
}
function go(page, after) { return () => { if (page === "travel" && window.CMLRedesign) window.CMLRedesign.paintTravel(); C.showPage(page); if (after) after(); }; }
function actions(code) {
  const name = t("wcName_" + code);
  const plans = n => n ? [[t("wcGo_plans", name, n), () => C.showEventsCode(code)]] : [];
  const n = upcomingWith(code);
  const scrollTo = id => () => requestAnimationFrame(() => { const x = document.getElementById(id); if (x && !x.hidden) x.scrollIntoView({ behavior: "smooth", block: "center" }); });
  const map = {
    Social: [...plans(n), [t("wcGo_matcha"), go("matcha")], [t("wcGo_community"), go("community")]],
    Wellness: [[t("wcGo_wellness"), go("wellness")], ...plans(n)],
    Connection: [[t("wcGo_community"), go("community")], [t("wcGo_matcha"), go("matcha")], ...plans(n)],
    Adventure: [[t("wcGo_travel"), go("travel")], ...plans(n)],
    Faith: [[t("wcGo_prayer"), go("support", scrollTo("prayerWall"))], ...plans(n), [t("wcGo_daily"), () => { const c = document.getElementById("codeCard"); if (c) c.scrollIntoView({ behavior: "smooth", block: "center" }); }]],
    Family: [...plans(n), [t("wcGo_support"), go("support", scrollTo("supFamily"))]],
    Recharge: [[t("wcGo_wellness"), go("wellness")], ...plans(n)],
    Support: [[t("wcGo_support"), go("support")], [t("wcGo_talk"), () => C.openModal("talk")]]
  };
  const list = map[code] || [];
  if (!list.length) list.push([t("wcGo_events"), go("events")]);
  return list.slice(0, 3);
}
function render() {
  const host = document.getElementById("homeCodeWeek");
  if (!host || !C) return;
  if (!C.session()) { host.hidden = true; host.replaceChildren(); return; }
  host.hidden = false;
  const chosen = getCode();
  if (!chosen) {
    const grid = el("div", { class: "wc-grid", role: "group", "aria-label": t("wcQ") }, ...CODES.map(code => {
      const b = el("button", { type: "button", class: "wc-pick wc-" + code.toLowerCase(), "data-wcode": code }, svg(code, "wc-ic"), el("span", { text: t("wcName_" + code) }));
      b.addEventListener("click", () => { setCode(code); render(); const r = host.querySelector(".wc-chosen"); if (r) r.focus({ preventScroll: true }); bloom(code); });
      return b;
    }));
    host.className = "card wc-card";
    host.replaceChildren(
      el("div", { class: "wc-top" },
        el("div", { class: "wc-head" }, el("small", { class: "rose", text: t("wcLabel") }), el("h2", { text: t("wcQ") }), el("p", { class: "small-note", text: t("wcSub") })),
        orchid("is-float")),
      grid,
      el("p", { class: "wc-hint", text: t("wcPickHint") }));
    return;
  }
  // the orchid IS the change control: a living flower + a clear pill label
  const change = el("button", { type: "button", class: "wc-change", "aria-label": t("wcChange") },
    orchid("is-live"),
    el("span", { class: "wc-change-pill" },
      svgPath("M20 11a8 8 0 0 0-14.5-4.5M4 3.5V7h3.5M4 13a8 8 0 0 0 14.5 4.5M20 20.5V17h-3.5", "wc-change-ic"),
      el("span", { text: t("wcChange") })));
  change.addEventListener("click", () => { setCode(""); render(); const f = host.querySelector(".wc-pick"); if (f) f.focus({ preventScroll: true }); });
  host.className = "card wc-card is-chosen wc-" + chosen.toLowerCase();
  host.replaceChildren(
    el("div", { class: "wc-result" },
      svg(chosen, "wc-mark"),
      el("div", { class: "wc-txt" },
        el("small", { class: "rose", text: t("wcYour") }),
        el("b", { class: "wc-chosen", tabindex: "-1", text: t("wcName_" + chosen) }),
        el("p", { class: "wc-msg", text: msgFor(chosen) })),
      change),
    el("div", { class: "wc-acts" }, ...actions(chosen).map(([label, fn]) => {
      const b = el("button", { type: "button", class: "wc-act", text: label + " →" });
      b.addEventListener("click", fn);
      return b;
    })),
    el("p", { class: "wc-brand", text: t("wcBrand") }));
}
function init() {
  C = window.CML;
  if (!C) return;
  C.addStrings(ES, EN);
  window.CMLCode = { render, get: getCode, orchidSVG };
  document.addEventListener("cml:render", render);
  document.addEventListener("cml:lang", render);
  document.addEventListener("cml:session", () => { memo = ""; render(); });
  render();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
