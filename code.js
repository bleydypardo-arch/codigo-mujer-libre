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
  wcYour: "Tu código esta semana", wcChange: "Cambiar", wcBrand: "Cada mujer tiene su código. Cambia cuando tú cambias.",
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
  wcYour: "Your code this week", wcChange: "Change", wcBrand: "Every woman has her code. It changes when you do.",
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
function svg(code, cls) {
  const s = el("span", { class: cls, "aria-hidden": "true" });
  s.innerHTML = '<svg class="ci" viewBox="0 0 24 24" focusable="false"><path d="' + ICON[code] + '"/></svg>';
  return s;
}
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
      b.addEventListener("click", () => { setCode(code); render(); const r = host.querySelector(".wc-chosen"); if (r) r.focus({ preventScroll: true }); });
      return b;
    }));
    host.className = "card wc-card";
    host.replaceChildren(
      el("div", { class: "wc-head" }, el("small", { class: "rose", text: t("wcLabel") }), el("h2", { text: t("wcQ") }), el("p", { class: "small-note", text: t("wcSub") })),
      grid);
    return;
  }
  const change = el("button", { type: "button", class: "link-btn wc-change", text: t("wcChange") });
  change.addEventListener("click", () => { setCode(""); render(); const f = host.querySelector(".wc-pick"); if (f) f.focus({ preventScroll: true }); });
  host.className = "card wc-card is-chosen wc-" + chosen.toLowerCase();
  host.replaceChildren(
    el("div", { class: "wc-result" },
      svg(chosen, "wc-mark"),
      el("div", { class: "wc-txt" },
        el("small", { class: "rose", text: t("wcYour") }),
        el("b", { class: "wc-chosen", tabindex: "-1", text: t("wcName_" + chosen) }),
        el("p", { class: "wc-msg", text: t("wcMsg_" + chosen) })),
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
  window.CMLCode = { render, get: getCode };
  document.addEventListener("cml:render", render);
  document.addEventListener("cml:lang", render);
  document.addEventListener("cml:session", () => { memo = ""; render(); });
  render();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
