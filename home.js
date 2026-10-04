// Código Mujer Libre — Home that feels alive: community updates built from data the app already has
// (events, trips, polls, Memories, prayer wall) + "What should we do this weekend?" ideas.
// No new content system: updates are computed, weekend ideas are ordinary plans (kind = 'weekend').
(function () {
"use strict";
let C = null;

const ES = {
  hupTitle: "ÚLTIMAMENTE EN LA COMUNIDAD",
  hupGoing: (n, title, when) => "🥂 " + n + " mujeres van a «" + title + "» " + when + ".",
  hupInterested: (n, place) => "✈️ " + n + " mujeres están interesadas en " + place + ".",
  hupPhotos: n => "📸 " + (n === 1 ? "Se agregó 1 foto nueva" : "Se agregaron " + n + " fotos nuevas") + " a Recuerdos.",
  hupVote: q => "🗳 Pronto cierra la votación: " + q,
  hupPrayer: "🙏 Se compartió una nueva petición de oración.",
  whToday: "hoy", whTomorrow: "mañana", whOn: d => "el " + d,
  wkTitle: "✨ ¿QUÉ HACEMOS ESTE FIN DE SEMANA?", wkIntro: "Ideas para este fin de semana. Toca ❤️ si te interesa.", wkOther: "✨ MÁS IDEAS"
};
const EN = {
  hupTitle: "LATELY IN THE COMMUNITY",
  hupGoing: (n, title, when) => "🥂 " + n + " women are going to “" + title + "” " + when + ".",
  hupInterested: (n, place) => "✈️ " + n + " women are interested in " + place + ".",
  hupPhotos: n => "📸 " + (n === 1 ? "1 new photo was" : n + " new photos were") + " added to Memories.",
  hupVote: q => "🗳 Voting closes soon: " + q,
  hupPrayer: "🙏 A new prayer request was shared.",
  whToday: "today", whTomorrow: "tomorrow", whOn: d => "on " + d,
  wkTitle: "✨ WHAT SHOULD WE DO THIS WEEKEND?", wkIntro: "Ideas for this weekend. Tap ❤️ if you're interested.", wkOther: "✨ MORE IDEAS"
};
const t = (key, ...args) => { const v = C ? C.t(key) : ""; return typeof v === "function" ? v(...args) : (v || key); };
const el = (...a) => C.el(...a);
const ORDER = ["Social", "Wellness", "Family", "Recharge", "Faith", "Adventure", "Connection", "Support"];
const DAY = 86400000;

let extra = { at: 0, photos: 0, prayer: false };
let fetching = false;
const day0 = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const parse = s => { const [y, m, d] = String(s).split("-").map(Number); return new Date(y, m - 1, d); };
const emojiOf = code => { const l = code && C.codeLabels[code] ? C.t(C.codeLabels[code]) : ""; const m = /^\S+/.exec(l); return m ? m[0] : "📅"; };
function whenText(dateStr) {
  const diff = Math.round((parse(dateStr) - day0()) / DAY);
  if (diff === 0) return t("whToday");
  if (diff === 1) return t("whTomorrow");
  return t("whOn", parse(dateStr).toLocaleDateString(C.loc(), { weekday: "long" }));
}
const go = (page, after) => () => { C.showPage(page); if (after) after(); };

async function fetchExtra() {
  if (fetching || !C.session()) return;
  fetching = true;
  try {
    const since = new Date(Date.now() - 7 * DAY).toISOString();
    const [m, w] = await Promise.all([
      C.db.from("memory_media").select("id", { count: "exact", head: true }).eq("kind", "photo").gte("created_at", since),
      C.db.rpc("prayer_wall", { max_rows: 1 })
    ]);
    const last = !w.error && w.data && w.data[0];
    extra = {
      at: Date.now(), photos: m.error ? 0 : (m.count || 0),
      prayer: !!(last && !last.mine && Date.now() - new Date(last.created_at).getTime() < 3 * DAY)
    };
  } catch { extra.at = Date.now(); }
  fetching = false;
  render(true);
}

function updates() {
  const { plans, counts } = C.homeData();
  const today = day0(), rows = [];
  if (window.CMLPolls) {
    window.CMLPolls.closingSoon(48).slice(0, 1).forEach(p =>
      rows.push({ text: t("hupVote", p.question), open: go("events") }));
  }
  plans.filter(p => p.kind === "event" && p.event_date).forEach(p => {
    const diff = Math.round((parse(p.event_date) - today) / DAY);
    const n = (counts.get(p.id) || {}).going || 0;
    if (diff >= 0 && diff <= 7 && n >= 2) rows.push({ order: diff, text: t("hupGoing", n, C.pick(p, "title"), whenText(p.event_date)), open: go("events") });
  });
  rows.sort((a, b) => (a.order ?? -1) - (b.order ?? -1));
  plans.filter(p => p.kind === "trip").forEach(p => {
    const n = (counts.get(p.id) || {}).interested || 0;
    if (n >= 2) rows.push({ text: t("hupInterested", n, p.location || C.pick(p, "title")), open: go("events") });
  });
  if (extra.photos > 0) rows.push({ text: t("hupPhotos", extra.photos), open: go("events", () => { const b = document.getElementById("segMemories"); if (b) b.click(); }) });
  if (extra.prayer) rows.push({ text: t("hupPrayer"), open: go("wellness") });
  return rows.slice(0, 5);
}

function renderUpdates() {
  const host = document.getElementById("homeUpdates");
  if (!host) return;
  const rows = C.session() ? updates() : [];
  host.hidden = !rows.length;
  if (!rows.length) return host.replaceChildren();
  host.replaceChildren(el("small", { class: "rose", text: t("hupTitle") }),
    ...rows.map(r => { const b = el("button", { type: "button", class: "upd-row", text: r.text }); b.addEventListener("click", r.open); return b; }));
}

function renderWeekend() {
  const host = document.getElementById("homeWeekend");
  if (!host) return;
  const { plans, counts, mine } = C.homeData();
  const cutoff = day0().getTime() - DAY;
  const ideas = C.session() ? plans.filter(p => p.kind === "weekend" && (!p.event_date || parse(p.event_date).getTime() >= cutoff)) : [];
  host.hidden = !ideas.length;
  if (!ideas.length) return host.replaceChildren();
  const groups = new Map();
  ideas.forEach(p => { const k = ORDER.includes(p.code) ? p.code : "_"; (groups.get(k) || groups.set(k, []).get(k)).push(p); });
  const keys = [...ORDER, "_"].filter(k => groups.has(k));
  const nodes = [el("small", { class: "rose", text: t("wkTitle") }), el("p", { class: "small-note", text: t("wkIntro") })];
  keys.forEach(k => {
    nodes.push(el("small", { class: "wk-cat", text: k === "_" ? t("wkOther") : C.t(C.codeLabels[k]).toUpperCase() }));
    groups.get(k).forEach(p => {
      const on = mine.get(p.id) === "interested";
      const n = (counts.get(p.id) || {}).interested || 0;
      const b = el("button", { type: "button", class: "resp wk-btn" + (on ? " on" : ""), "aria-pressed": String(on), "data-wk": p.id, text: "❤️ " + C.t("interested") + " · " + n });
      b.addEventListener("click", () => C.respond(p.id, "interested"));
      const link = C.safeUrl(p.url);
      nodes.push(el("div", { class: "wk-item" },
        el("div", { class: "wk-text" }, el("b", { text: C.pick(p, "title") || "—" }),
          p.location ? el("small", { class: "meta-line", text: "📍 " + p.location }) : null,
          C.pick(p, "desc") ? el("small", { class: "meta-line", text: C.pick(p, "desc") }) : null,
          link ? el("a", { class: "link-btn", href: link, target: "_blank", rel: "noopener noreferrer", text: C.t("moreInfo") + " ↗" }) : null),
        b));
    });
  });
  host.replaceChildren(...nodes);
}

function render(fromFetch) {
  if (!C || !C.homeData) return;
  renderUpdates(); renderWeekend();
  if (!fromFetch && C.session() && Date.now() - extra.at > 60000) fetchExtra();
}

function init() {
  C = window.CML;
  if (!C) return;
  C.addStrings(ES, EN);
  document.addEventListener("cml:session", e => {
    extra = { at: 0, photos: 0, prayer: false };
    if (!C.session() || (e.detail && e.detail.pending)) { renderUpdates(); renderWeekend(); return; }
    render();
  });
  document.addEventListener("cml:lang", () => render(true));
  const home = document.querySelector("nav button[data-page=home]");
  if (home) home.addEventListener("click", () => render());
  window.CMLHome = { render };
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
