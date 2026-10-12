// Código Mujer Libre — Podcast "Entre Nosotras"
// Episodes live on YouTube (free). The app stores only the LINK (settings.podcast, edited in Admin → Podcast).
//   * Home: one featured card (next premiere or latest episode) with the 15-second teaser, "Listen", calendar and WhatsApp share.
//   * Wellness: the whole library, filtered by topic.
// Players load only after a tap (fast, light on data) and only from YouTube's privacy-friendly domain.
(function () {
"use strict";
let C = null, topic = "all", shown = 8, playing = {};
const TOPICS = ["entrepreneurship", "spirituality", "emotional", "wellness", "health", "identity", "beauty", "money", "organization", "love"];
const ES = {
  podName: "Entre Nosotras", podTag: "Dos voces. Dos miradas. Conversaciones que importan.",
  podK: "PODCAST", podNew: "NUEVO EPISODIO", podNext: "PRÓXIMO ESTRENO", podSoonT: "Muy pronto: nuestro primer episodio", podSoonP: "Amor, salud, dinero, bienestar, belleza, propósito y emprendimiento. Conversaciones que importan.",
  podListen: "Escuchar", podPlay: "Reproducir", podCal: "Agregar al calendario", podShare: "Compartir", podAll: "Todos", podMore: "Ver más episodios", podNone: "No hay episodios de este tema todavía.",
  podLibK: "PODCAST", podLibT: "Entre Nosotras", podOpenYt: "Abrir en YouTube", podClose: "Cerrar", podShareMsg: n => "Escucha «" + n + "» en Entre Nosotras, el podcast de Código Mujer Libre:",
  podAt: "a las", podCount: n => n === 1 ? "1 episodio" : n + " episodios",
  tp_entrepreneurship: "Emprendimiento", tp_spirituality: "Espiritualidad", tp_emotional: "Emocional", tp_wellness: "Bienestar", tp_health: "Salud", tp_identity: "Identidad", tp_beauty: "Belleza", tp_money: "Dinero", tp_organization: "Organización", tp_love: "Amor y relaciones"
};
const EN = {
  podName: "Between Us", podTag: "Two voices. Two perspectives. Conversations that matter.",
  podK: "PODCAST", podNew: "NEW EPISODE", podNext: "NEXT PREMIERE", podSoonT: "Coming soon: our first episode", podSoonP: "Love, health, money, wellness, beauty, purpose and entrepreneurship. Conversations that matter.",
  podListen: "Listen", podPlay: "Play", podCal: "Add to calendar", podShare: "Share", podAll: "All", podMore: "Show more episodes", podNone: "No episodes on this topic yet.",
  podLibK: "PODCAST", podLibT: "Between Us", podOpenYt: "Open on YouTube", podClose: "Close", podShareMsg: n => "Listen to “" + n + "” on Between Us, the Código Mujer Libre podcast:",
  podAt: "at", podCount: n => n === 1 ? "1 episode" : n + " episodes",
  tp_entrepreneurship: "Entrepreneurship", tp_spirituality: "Spirituality", tp_emotional: "Emotional", tp_wellness: "Wellness", tp_health: "Health", tp_identity: "Identity", tp_beauty: "Beauty", tp_money: "Money", tp_organization: "Organization", tp_love: "Love & relationships"
};
const el = (...a) => C.el(...a);
const t = k => C.t(k);
const topicLabel = k => C.t("tp_" + k);

// Only YouTube links are accepted; we keep just the 11-character video id.
function ytId(url) {
  try {
    const u = new URL(String(url || "").trim());
    const h = u.hostname.replace(/^www\.|^m\./, "");
    let id = "";
    if (h === "youtu.be") id = u.pathname.slice(1).split("/")[0];
    else if (h === "youtube.com" || h === "youtube-nocookie.com") {
      if (u.pathname === "/watch") id = u.searchParams.get("v") || "";
      else { const m = /^\/(?:shorts|embed|live|v)\/([^/?#]+)/.exec(u.pathname); id = m ? m[1] : ""; }
    }
    return /^[\w-]{11}$/.test(id) ? id : "";
  } catch { return ""; }
}
const thumb = id => "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
const watchUrl = id => "https://www.youtube.com/watch?v=" + id;

function episodes() {
  const cfg = C && C.session() ? C.setting("podcast") : null;
  const list = cfg && Array.isArray(cfg.episodes) ? cfg.episodes : [];
  return list.filter(e => e && e.published && e.date && ytId(e.url)).sort((a, b) => (b.date + (b.time || "")).localeCompare(a.date + (a.time || "")));
}
const today = () => (window.CMLDaily ? window.CMLDaily.orlandoToday() : new Date().toISOString().slice(0, 10));
const titleOf = e => C.pick(e, "title") || "—";
function whenText(e) {
  const d = new Date(e.date + "T" + (e.time || "12:00"));
  const day = d.toLocaleDateString(C.loc(), { weekday: "long", day: "numeric", month: "long" });
  return e.time ? day + " " + t("podAt") + " " + d.toLocaleTimeString(C.loc(), { hour: "numeric", minute: "2-digit" }) : day;
}
// the featured episode: the nearest upcoming premiere, otherwise the latest one
function featured(list) {
  const td = today();
  const up = list.filter(e => e.date >= td).sort((a, b) => (a.date + (a.time || "")).localeCompare(b.date + (b.time || "")));
  if (up.length) return { ep: up[0], upcoming: true };
  return list.length ? { ep: list[0], upcoming: false } : null;
}

// a thumbnail with a play button that turns into the player after a tap
function playerNode(id, label, cls) {
  const wrap = el("div", { class: "pod-media " + (cls || "") });
  const b = el("button", { type: "button", class: "pod-play", "aria-label": t("podPlay") + ": " + label }, el("img", { src: thumb(id), alt: "", loading: "lazy" }), el("span", { class: "pod-btn", "aria-hidden": "true" }, "▶"));
  b.addEventListener("click", () => {
    const f = el("iframe", { src: "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0&playsinline=1", title: label, allow: "autoplay; encrypted-media; picture-in-picture; fullscreen", allowfullscreen: "", referrerpolicy: "strict-origin-when-cross-origin", loading: "lazy" });
    wrap.replaceChildren(f);
  });
  wrap.appendChild(b);
  return wrap;
}
function icsUrl(e) {
  const d = e.date.replace(/-/g, ""), tm = (e.time || "19:00").replace(":", "") + "00";
  const end = new Date(new Date(e.date + "T" + (e.time || "19:00")).getTime() + 15 * 60000);
  const pad = n => String(n).padStart(2, "0");
  const endS = end.getFullYear() + pad(end.getMonth() + 1) + pad(end.getDate()) + "T" + pad(end.getHours()) + pad(end.getMinutes()) + "00";
  const safe = s => String(s).replace(/[\r\n,;]/g, " ");
  const txt = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Codigo Mujer Libre//Podcast//EN", "BEGIN:VEVENT", "UID:" + e.id + "@codigomujerlibre", "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z",
    "DTSTART:" + d + "T" + tm, "DTEND:" + endS, "SUMMARY:" + safe(t("podName") + " · " + titleOf(e)), "URL:" + watchUrl(ytId(e.url)), "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  return "data:text/calendar;charset=utf-8," + encodeURIComponent(txt);
}
function shareLink(e) {
  const msg = t("podShareMsg")(titleOf(e)) + " " + watchUrl(ytId(e.url));
  return "https://wa.me/?text=" + encodeURIComponent(msg);
}

// ---------- Home card ----------
function renderHome() {
  const host = document.getElementById("homePodcast");
  if (!host || !C) return;
  if (!C.session()) { host.hidden = true; host.replaceChildren(); return; }
  const f = featured(episodes());
  host.hidden = false;
  if (!f) {
    host.replaceChildren(el("div", { class: "pod-head" }, el("span", { class: "pod-mic", "aria-hidden": "true" }, "🎙"), el("div", {}, el("small", { class: "pod-k", text: t("podK") }), el("h2", { class: "pod-name", text: t("podName") }))),
      el("p", { class: "pod-tag", text: t("podTag") }), el("p", { class: "pod-sub", text: t("podSoonP") }), el("span", { class: "pod-chip soon", text: C.t("rcSoonTag") }));
    return;
  }
  const e = f.ep, id = ytId(e.url), tid = ytId(e.teaser);
  const acts = el("div", { class: "pod-acts" });
  if (f.upcoming) acts.appendChild(el("a", { class: "pod-btn-gold", href: icsUrl(e), download: "entre-nosotras.ics", text: "📅 " + t("podCal") }));
  acts.appendChild(el("a", { class: "pod-btn-ghost", href: shareLink(e), target: "_blank", rel: "noopener noreferrer", text: t("podShare") }));
  host.replaceChildren(
    el("div", { class: "pod-head" }, el("span", { class: "pod-mic", "aria-hidden": "true" }, "🎙"), el("div", {}, el("small", { class: "pod-k", text: f.upcoming ? t("podNext") : t("podNew") }), el("h2", { class: "pod-name", text: t("podName") }))),
    tid ? playerNode(tid, titleOf(e), "teaser") : null,
    el("span", { class: "pod-chip", text: topicLabel(TOPICS.includes(e.topic) ? e.topic : "wellness") }),
    el("h3", { class: "pod-title", text: titleOf(e) }),
    el("p", { class: "pod-when", text: whenText(e) }),
    C.pick(e, "desc") ? el("p", { class: "pod-sub", text: C.pick(e, "desc") }) : null,
    f.upcoming ? null : playerNode(id, titleOf(e), "episode"),
    f.upcoming && !tid ? playerNode(id, titleOf(e), "episode") : null,
    acts);
}

// ---------- Wellness library ----------
function renderLibrary() {
  const host = document.getElementById("wellPodcast");
  if (!host || !C) return;
  if (!C.session()) { host.hidden = true; host.replaceChildren(); return; }
  const all = episodes();
  host.hidden = false;
  const used = TOPICS.filter(k => all.some(e => e.topic === k));
  const chips = el("div", { class: "chips pod-chips", role: "group", "aria-label": t("podLibT") },
    ...["all", ...used].map(k => { const b = el("button", { type: "button", class: "chip" + (topic === k ? " selected" : ""), text: k === "all" ? t("podAll") : topicLabel(k) }); b.setAttribute("aria-pressed", String(topic === k)); b.addEventListener("click", () => { topic = k; shown = 8; renderLibrary(); }); return b; }));
  const list = all.filter(e => topic === "all" || e.topic === topic);
  const cards = list.slice(0, shown).map(e => {
    const id = ytId(e.url);
    return el("article", { class: "pod-ep" }, playerNode(id, titleOf(e), "episode"),
      el("div", { class: "pod-ep-body" }, el("span", { class: "pod-chip", text: topicLabel(TOPICS.includes(e.topic) ? e.topic : "wellness") }), el("b", { class: "pod-ep-t", text: titleOf(e) }), el("small", { class: "pod-when", text: whenText(e) }),
        C.pick(e, "desc") ? el("p", { class: "pod-sub", text: C.pick(e, "desc") }) : null,
        el("div", { class: "pod-acts" }, el("a", { class: "pod-btn-ghost", href: shareLink(e), target: "_blank", rel: "noopener noreferrer", text: t("podShare") }), el("a", { class: "pod-btn-ghost", href: watchUrl(id), target: "_blank", rel: "noopener noreferrer", text: t("podOpenYt") + " ↗" }))));
  });
  const kids = [el("div", { class: "pod-lib-head" }, el("span", { class: "pod-mic", "aria-hidden": "true" }, "🎙"), el("div", {}, el("small", { class: "pod-k", text: t("podLibK") }), el("h2", { class: "pod-name", text: t("podLibT") }), el("p", { class: "pod-tag", text: t("podTag") })))];
  if (!all.length) kids.push(el("p", { class: "pod-sub", text: t("podSoonP") }), el("span", { class: "pod-chip soon", text: C.t("rcSoonTag") }));
  else {
    kids.push(chips, el("p", { class: "pod-count", text: t("podCount")(list.length) }), cards.length ? el("div", { class: "pod-grid" }, ...cards) : el("p", { class: "pod-sub", text: t("podNone") }));
    if (list.length > shown) { const m = el("button", { type: "button", class: "secondary pod-more", text: t("podMore") }); m.addEventListener("click", () => { shown += 8; renderLibrary(); }); kids.push(m); }
  }
  host.replaceChildren(...kids);
}
function render() { renderHome(); renderLibrary(); }

function init() {
  C = window.CML; if (!C) return;
  C.addStrings(ES, EN);
  window.CMLPodcast = { TOPICS, topicLabel, ytId, render };
  ["cml:session", "cml:lang", "cml:render"].forEach(ev => document.addEventListener(ev, render));
  render();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
