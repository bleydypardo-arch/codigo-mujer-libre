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
  podListen: "Escuchar el podcast", podTopicsLine: "Amor · Salud · Dinero · Bienestar · Belleza · Propósito · Emprendimiento · Vida", podPlay: "Reproducir", podCal: "Agregar al calendario", podShare: "Compartir", podAll: "Todos", podMore: "Ver más episodios", podNone: "No hay episodios de este tema todavía.",
  podLibK: "PODCAST", podLibT: "Entre Nosotras", podOpenYt: "Abrir en YouTube", podClose: "Cerrar", podShareMsg: n => "Escucha «" + n + "» en Entre Nosotras, el podcast de Código Mujer Libre:",
  podAt: "a las", podCount: n => n === 1 ? "1 episodio" : n + " episodios",
  tp_entrepreneurship: "Emprendimiento", tp_spirituality: "Espiritualidad", tp_emotional: "Emocional", tp_wellness: "Bienestar", tp_health: "Salud", tp_identity: "Identidad", tp_beauty: "Belleza", tp_money: "Dinero", tp_organization: "Organización", tp_love: "Amor y relaciones"
};
const EN = {
  podName: "Between Us", podTag: "Two voices. Two perspectives. Conversations that matter.",
  podK: "PODCAST", podNew: "NEW EPISODE", podNext: "NEXT PREMIERE", podSoonT: "Coming soon: our first episode", podSoonP: "Love, health, money, wellness, beauty, purpose and entrepreneurship. Conversations that matter.",
  podListen: "Listen to the podcast", podTopicsLine: "Love · Health · Money · Wellness · Beauty · Purpose · Entrepreneurship · Life", podPlay: "Play", podCal: "Add to calendar", podShare: "Share", podAll: "All", podMore: "Show more episodes", podNone: "No episodes on this topic yet.",
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
// Vintage broadcast microphone (gold grille, chrome yoke, stand) with sound waves that radiate outward
function micNode(cls) {
  const NS = "http://www.w3.org/2000/svg", w = document.createElementNS(NS, "svg");
  w.setAttribute("viewBox", "-16 0 112 100"); w.setAttribute("class", "pod-mic-svg " + (cls || "")); w.setAttribute("aria-hidden", "true"); w.setAttribute("focusable", "false");
  let ribs = ""; for (let y = 16; y <= 54; y += 5) ribs += '<path d="M21 ' + y + 'H59"/>';
  w.innerHTML = '<defs><linearGradient id="pmG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FBEBC0"/><stop offset=".5" stop-color="#D9A650"/><stop offset="1" stop-color="#8E5C25"/></linearGradient><linearGradient id="pmC" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A8A92"/><stop offset=".45" stop-color="#F4F4F6"/><stop offset="1" stop-color="#7C7C86"/></linearGradient><radialGradient id="pmH" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#F3C874" stop-opacity=".7"/><stop offset="1" stop-color="#F3C874" stop-opacity="0"/></radialGradient><clipPath id="pmK"><rect x="20" y="8" width="40" height="52" rx="20"/></clipPath></defs>'
    + '<circle class="mic-glow" cx="40" cy="34" r="40" fill="url(#pmH)"/>'
    + '<g class="mic-waves" fill="none" stroke="#C48A36" stroke-linecap="round" stroke-width="2.8"><path class="wv wl1" d="M13 24C8 32 8 42 13 50"/><path class="wv wl2" d="M6 17C-2 29 -2 45 6 57"/><path class="wv wl3" d="M-1 10C-12 26 -12 48 -1 64"/><path class="wv wr1" d="M67 24C72 32 72 42 67 50"/><path class="wv wr2" d="M74 17C82 29 82 45 74 57"/><path class="wv wr3" d="M81 10C92 26 92 48 81 64"/></g>'
    + '<g class="mic-body"><rect x="37.5" y="72" width="5" height="20" rx="2" fill="url(#pmC)"/><ellipse cx="40" cy="93" rx="19" ry="4.5" fill="url(#pmG)" stroke="#6B4217" stroke-width="1"/>'
    + '<path d="M17 42C17 70 63 70 63 42" fill="none" stroke="url(#pmC)" stroke-width="4.4" stroke-linecap="round"/><circle cx="17" cy="42" r="3.4" fill="url(#pmG)" stroke="#6B4217" stroke-width=".8"/><circle cx="63" cy="42" r="3.4" fill="url(#pmG)" stroke="#6B4217" stroke-width=".8"/>'
    + '<rect x="20" y="8" width="40" height="52" rx="20" fill="url(#pmG)" stroke="#6B4217" stroke-width="1.4"/><g clip-path="url(#pmK)"><g stroke="#4B2A0E" stroke-opacity=".62" stroke-width="1.7">' + ribs + '</g><path d="M40 8V60" stroke="#4B2A0E" stroke-opacity=".55" stroke-width="2"/><rect x="20" y="31" width="40" height="5" fill="#F7E3AC" fill-opacity=".9"/><path d="M26 12C22 24 22 40 26 54" stroke="#fff" stroke-opacity=".6" stroke-width="3" fill="none" stroke-linecap="round"/></g>'
    + '<rect x="35" y="58" width="10" height="16" rx="3" fill="url(#pmC)" stroke="#5E5E68" stroke-width=".8"/></g>';
  return w;
}
function embedNode(id, label) {
  const wrap = el("div", { class: "pod-media episode" });
  wrap.appendChild(el("iframe", { src: "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0&playsinline=1", title: label, allow: "autoplay; encrypted-media; picture-in-picture; fullscreen", allowfullscreen: "", referrerpolicy: "strict-origin-when-cross-origin" }));
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

// ---------- Home strip ----------
let homeOpen = false;
function renderHome() {
  const host = document.getElementById("homePodcast");
  if (!host || !C) return;
  if (!C.session()) { host.hidden = true; host.replaceChildren(); return; }
  const f = featured(episodes());
  host.hidden = false;
  host.classList.toggle("is-open", !!(f && homeOpen));
  const kicker = !f ? t("podK") : f.upcoming ? t("podNext") : t("podNew");
  const sub = !f ? t("podSoonT") : titleOf(f.ep);
  const row = el(f ? "button" : "div", { class: "pod-strip", type: f ? "button" : null, "aria-expanded": f ? String(homeOpen) : null },
    el("span", { class: "pod-mic" }, micNode()),
    el("span", { class: "pod-strip-txt" }, el("small", { class: "pod-k", text: kicker }), el("b", { class: "pod-name", text: t("podName") }), el("span", { class: "pod-strip-sub", text: sub })),
    f ? el("span", { class: "pod-go", "aria-hidden": "true" }, homeOpen ? "–" : "▶") : null);
  if (!f) { host.replaceChildren(row); return; }
  const e = f.ep, id = ytId(e.url), tid = ytId(e.teaser);
  const listen = el("button", { type: "button", class: "pod-listen", text: "▶  " + t("podListen") });
  listen.addEventListener("click", () => { listen.replaceWith(embedNode(id, titleOf(e))); });
  const acts = el("div", { class: "pod-acts" });
  if (f.upcoming) acts.appendChild(el("a", { class: "pod-btn-gold", href: icsUrl(e), download: "entre-nosotras.ics", text: "📅 " + t("podCal") }));
  acts.appendChild(el("a", { class: "pod-btn-ghost", href: shareLink(e), target: "_blank", rel: "noopener noreferrer", text: t("podShare") }));
  const body = el("div", { class: "pod-body" }, el("p", { class: "pod-tag", text: t("podTag") }), tid ? playerNode(tid, titleOf(e), "teaser") : null, el("p", { class: "pod-topics", text: t("podTopicsLine") }),
    el("h3", { class: "pod-title", text: titleOf(e) }), el("p", { class: "pod-when", text: topicLabel(TOPICS.includes(e.topic) ? e.topic : "wellness") + " · " + whenText(e) }),
    C.pick(e, "desc") ? el("p", { class: "pod-sub", text: C.pick(e, "desc") }) : null, listen, acts);
  body.hidden = !homeOpen;
  row.addEventListener("click", () => { homeOpen = !homeOpen; host.classList.toggle("is-open", homeOpen); body.hidden = !homeOpen; row.setAttribute("aria-expanded", String(homeOpen)); row.querySelector(".pod-go").textContent = homeOpen ? "–" : "▶"; });
  host.replaceChildren(row, body);
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
  const kids = [el("div", { class: "pod-lib-head" }, el("span", { class: "pod-mic" }, micNode("small")), el("div", {}, el("small", { class: "pod-k", text: t("podLibK") }), el("h2", { class: "pod-name", text: t("podLibT") }), el("p", { class: "pod-tag", text: t("podTag") })))];
  if (!all.length) kids.push(el("p", { class: "pod-sub", text: t("podSoonP") }), el("span", { class: "pod-chip soon", text: C.t("rcSoonTag") }));
  else {
    kids.push(chips, el("p", { class: "pod-count", text: t("podCount")(list.length) }), cards.length ? el("div", { class: "pod-grid" }, ...cards) : el("p", { class: "pod-sub", text: t("podNone") }));
    if (list.length > shown) { const m = el("button", { type: "button", class: "secondary pod-more", text: t("podMore") }); m.addEventListener("click", () => { shown += 8; renderLibrary(); }); kids.push(m); }
  }
  host.replaceChildren(...kids);
}
function render(ev) {
  const lang = ev && ev.type === "cml:lang";
  if (!lang && document.querySelector("#homePodcast iframe, #wellPodcast iframe")) return;   // never interrupt a playing episode
  renderHome(); renderLibrary();
}

function init() {
  C = window.CML; if (!C) return;
  C.addStrings(ES, EN);
  window.CMLPodcast = { TOPICS, topicLabel, ytId, render };
  ["cml:session", "cml:lang", "cml:render"].forEach(ev => document.addEventListener(ev, render));
  render();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
