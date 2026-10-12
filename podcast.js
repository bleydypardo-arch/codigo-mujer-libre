// Código Mujer Libre — Podcast "Entre Nosotras"
// Episodes live on YouTube (free). The app stores only the LINK (settings.podcast, edited in Admin → Podcast).
//   * Home: one hero card (the cover photo, a big "Listen" button and the current episode). The button opens a window with the player, calendar, WhatsApp share and more episodes.
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
  podSoonK: "MUY PRONTO", podLatest: "ÚLTIMO EPISODIO", podMeet: "Conocer el podcast", podMoreEps: "Más episodios", podSeeAll: "Ver todos los episodios",
  podSoonP2: "Amor, salud, dinero, bienestar, belleza, espiritualidad y emprendimiento: cada semana un tema distinto, en una conversación entre dos voces.", podWeekly: "Un episodio nuevo cada semana. Aquí lo escuchas y no te pierdes ninguno.",
  podNote: "Contenido informativo y de inspiración; no sustituye el consejo de un profesional de la salud, legal o financiero. Imagen ilustrativa.",
  podAt: "a las", podCount: n => n === 1 ? "1 episodio" : n + " episodios",
  tp_entrepreneurship: "Emprendimiento", tp_spirituality: "Espiritualidad", tp_emotional: "Emocional", tp_wellness: "Bienestar", tp_health: "Salud", tp_identity: "Identidad", tp_beauty: "Belleza", tp_money: "Dinero", tp_organization: "Organización", tp_love: "Amor y relaciones"
};
const EN = {
  podName: "Between Us", podTag: "Two voices. Two perspectives. Conversations that matter.",
  podK: "PODCAST", podNew: "NEW EPISODE", podNext: "NEXT PREMIERE", podSoonT: "Coming soon: our first episode", podSoonP: "Love, health, money, wellness, beauty, purpose and entrepreneurship. Conversations that matter.",
  podListen: "Listen to the podcast", podTopicsLine: "Love · Health · Money · Wellness · Beauty · Purpose · Entrepreneurship · Life", podPlay: "Play", podCal: "Add to calendar", podShare: "Share", podAll: "All", podMore: "Show more episodes", podNone: "No episodes on this topic yet.",
  podLibK: "PODCAST", podLibT: "Between Us", podOpenYt: "Open on YouTube", podClose: "Close", podShareMsg: n => "Listen to “" + n + "” on Between Us, the Código Mujer Libre podcast:",
  podSoonK: "COMING SOON", podLatest: "LATEST EPISODE", podMeet: "Meet the podcast", podMoreEps: "More episodes", podSeeAll: "See all episodes",
  podSoonP2: "Love, health, money, wellness, beauty, spirituality and entrepreneurship: a different topic every week, as a conversation between two voices.", podWeekly: "A new episode every week. Listen here and never miss one.",
  podNote: "Informational and inspirational content; it does not replace advice from a health, legal or financial professional. Illustrative image.",
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

// ---------- Home hero card + listening window ----------
// The card is the photo (Spanish or English cover), a big button and the current episode's title.
// Outside the window of the photo, leaves drift down (limited by a mask to the glass only); the red sound bars above the title move.
const COVER = {
  es: { img: "podcast-es.jpg", mask: "podcast-window-es.png", alt: "Entre Nosotras: dos mujeres conversando frente a micrófonos dorados",
    eq: { l: 47.14, t: 9.08, w: 5.99, h: 7.52, vb: [92, 77], x: [3, 18, 32, 46.5, 60.5, 75, 89], hs: [19, 35, 56, 77, 55, 35, 19], bw: 6.5 } },
  en: { img: "podcast-en.jpg", mask: "podcast-window-en.png", alt: "Between Us: two women talking in front of golden microphones",
    eq: { l: 47.07, t: 9.28, w: 5.92, h: 7.23, vb: [91, 74], x: [3, 18, 32, 46, 60, 74, 88], hs: [18, 36, 56, 74, 55, 35, 18], bw: 6 } }
};
const SVGNS = "http://www.w3.org/2000/svg";
function eqNode(c) {
  const [W, H] = c.vb, mid = H / 2;
  let bars = "";
  c.x.forEach((x, i) => {
    const h = c.hs[i];
    bars += '<rect class="eqb" style="--d:' + (0.85 + (i % 4) * 0.18).toFixed(2) + 's;--o:' + (-(i * 0.27)).toFixed(2) + 's" x="' + (x - c.bw / 2) + '" y="' + (mid - h / 2) + '" width="' + c.bw + '" height="' + h + '" rx="' + (c.bw / 2) + '"/>';
  });
  const s = document.createElementNS(SVGNS, "svg");
  s.setAttribute("class", "ph-eq"); s.setAttribute("viewBox", "0 0 " + W + " " + H); s.setAttribute("preserveAspectRatio", "none");
  s.setAttribute("aria-hidden", "true"); s.setAttribute("focusable", "false");
  s.style.cssText = "left:" + c.l + "%;top:" + c.t + "%;width:" + c.w + "%;height:" + c.h + "%";
  s.innerHTML = '<defs><linearGradient id="phEqG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8184A"/><stop offset="1" stop-color="#DA4A7C"/></linearGradient></defs><g fill="url(#phEqG)">' + bars + "</g>";
  return s;
}
function leavesNode(c) {
  const wrap = el("div", { class: "ph-leaves", "aria-hidden": "true" });
  wrap.style.setProperty("--m", "url(" + c.mask + ")");
  const cols = ["#7FA84A", "#A3C259", "#5F8F3B", "#E2C45C", "#8DB653", "#C9B04A"];
  const N = 22;
  for (let i = 0; i < N; i++) {
    const lf = el("span", { class: "lf" });
    lf.style.cssText = "--x:" + (17 + ((i * 37) % 32)) + "%;--s:" + (2.4 + (i % 4) * 0.6).toFixed(1) + ";--d:" + (7 + (i % 5) * 1.4).toFixed(1) + "s;--o:" + (-(i * 0.85)).toFixed(2) + "s;--dx:" + (((i % 2) ? 1 : -1) * (4 + (i % 3) * 5)) + "px;--c:" + cols[i % cols.length];
    const inner = el("span", { class: "lf-i" });
    inner.innerHTML = '<svg viewBox="0 0 24 24" focusable="false"><path d="M12 1C19.5 6 21.5 14 12 23 2.5 14 4.5 6 12 1Z" fill="currentColor"/><path d="M12 4.5V20" stroke="rgba(255,255,255,.4)" stroke-width="1" fill="none" stroke-linecap="round"/></svg>';
    lf.appendChild(inner); wrap.appendChild(lf);
  }
  return wrap;
}
const recent = e => { const d = (new Date(today() + "T12:00") - new Date(e.date + "T12:00")) / 86400000; return d <= 10; };
let homeSig = "", homeIO = null, homeRO = null;
function renderHome() {
  const host = document.getElementById("homePodcast");
  if (!host || !C) return;
  if (!C.session()) { host.hidden = true; host.replaceChildren(); homeSig = ""; return; }
  const f = featured(episodes());
  const lang = C.lang() === "en" ? "en" : "es";
  const sig = lang + "|" + (f ? f.ep.id + "|" + f.upcoming + "|" + titleOf(f.ep) : "none");
  if (sig === homeSig && host.firstChild) return;   // nothing changed: keep the animation running, no flicker
  const c = COVER[lang];
  host.hidden = false;
  host.className = "ph-card";
  const img = el("img", { class: "ph-img", src: c.img, alt: c.alt, width: "1280", height: "853", decoding: "async" });
  const stage = el("div", { class: "ph-stage" }, img, leavesNode(c), eqNode(c.eq));
  const kick = !f ? t("podSoonK") : f.upcoming ? t("podNext") + " · " + new Date(f.ep.date + "T12:00").toLocaleDateString(C.loc(), { day: "numeric", month: "short" }).replace(".", "") : (recent(f.ep) ? t("podNew") : t("podLatest"));
  const head = !f ? t("podSoonT") : titleOf(f.ep);
  const btn = el("button", { type: "button", class: "ph-btn" },
    el("span", { class: "ph-btn-ico", "aria-hidden": "true" }, f ? "▶" : "✦"),
    el("span", { class: "ph-btn-txt", text: f ? t("podListen") : t("podMeet") }));
  const foot = el("div", { class: "ph-foot" },
    el("small", { class: "ph-k", text: kick }),
    el("b", { class: "ph-t", text: head }), btn);
  host.replaceChildren(stage, foot);
  homeSig = sig;
  const open = () => openWindow(btn, f ? f.ep.id : null);
  btn.addEventListener("click", open);
  stage.addEventListener("click", open);
  // keep the fall distance in step with the photo's height, and pause everything while off-screen (saves battery)
  const setH = () => stage.style.setProperty("--H", Math.round(stage.clientHeight * 0.5) + "px");
  setH();
  if (homeRO) homeRO.disconnect();
  if ("ResizeObserver" in window) { homeRO = new ResizeObserver(setH); homeRO.observe(stage); }
  if (homeIO) homeIO.disconnect();
  if ("IntersectionObserver" in window) { homeIO = new IntersectionObserver(es => host.classList.toggle("ph-paused", !es[0].isIntersecting), { threshold: 0.05 }); homeIO.observe(host); }
}

// ---------- the window that opens on "Listen" ----------
let win = null;
function winEpisodeView(sel, all, f) {
  const e = sel, id = ytId(e.url), upcoming = e.date >= today();
  const nodes = [];
  nodes.push(el("div", { class: "pw-meta" }, el("span", { class: "pod-chip", text: topicLabel(TOPICS.includes(e.topic) ? e.topic : "wellness") }),
    upcoming ? el("span", { class: "pod-chip gold", text: t("podNext") }) : null,
    el("small", { class: "pw-when", text: whenText(e) })));
  nodes.push(el("h3", { class: "pw-ep-t", id: "pwEpT", text: titleOf(e) }));
  nodes.push(playerNode(id, titleOf(e), "pw-player"));
  if (C.pick(e, "desc")) nodes.push(el("p", { class: "pw-desc", text: C.pick(e, "desc") }));
  const acts = el("div", { class: "pod-acts pw-acts" });
  if (upcoming) acts.appendChild(el("a", { class: "pod-btn-gold", href: icsUrl(e), download: "entre-nosotras.ics", text: "📅 " + t("podCal") }));
  acts.appendChild(el("a", { class: "pod-btn-ghost", href: shareLink(e), target: "_blank", rel: "noopener noreferrer", text: t("podShare") }));
  acts.appendChild(el("a", { class: "pod-btn-ghost", href: watchUrl(id), target: "_blank", rel: "noopener noreferrer", text: t("podOpenYt") + " ↗" }));
  nodes.push(acts);
  const others = all.filter(x => x.id !== e.id).slice(0, 4);
  if (others.length) {
    nodes.push(el("h4", { class: "pw-more-h", text: t("podMoreEps") }));
    const list = el("div", { class: "pw-list" });
    others.forEach(o => {
      const row = el("button", { type: "button", class: "pw-row" },
        el("img", { src: thumb(ytId(o.url)), alt: "", loading: "lazy" }),
        el("span", { class: "pw-row-t" }, el("small", { text: topicLabel(TOPICS.includes(o.topic) ? o.topic : "wellness") }), el("b", { text: titleOf(o) })));
      row.addEventListener("click", () => { win.epId = o.id; paintWindow(); const b = win.sheet.querySelector(".pw-scroll"); if (b) b.scrollTop = 0; });
      list.appendChild(row);
    });
    nodes.push(list);
  }
  if (all.length > 1) {
    const allBtn = el("button", { type: "button", class: "secondary pw-all", text: t("podSeeAll") });
    allBtn.addEventListener("click", () => { closeWindow(); if (C.showPage) C.showPage("wellness"); });
    nodes.push(allBtn);
  }
  return nodes;
}
function winSoonView() {
  const chips = el("div", { class: "pw-topics" }, ...["love", "health", "money", "wellness", "beauty", "spirituality", "entrepreneurship", "emotional"].map(k => el("span", { class: "pod-chip", text: topicLabel(k) })));
  return [el("div", { class: "pw-soon" }, el("span", { class: "pod-mic big" }, micNode()),
    el("h3", { class: "pw-ep-t", id: "pwEpT", text: t("podSoonT") }),
    el("p", { class: "pw-desc", text: t("podSoonP2") }), chips, el("p", { class: "pw-desc pw-weekly", text: t("podWeekly") }))];
}
function paintWindow() {
  if (!win) return;
  const all = episodes();
  const sel = all.find(x => x.id === win.epId) || (featured(all) || {}).ep || null;
  if (sel) win.epId = sel.id;
  const body = el("div", { class: "pw-body" }, ...(sel ? winEpisodeView(sel, all) : winSoonView()),
    el("p", { class: "pw-note", text: t("podNote") }));
  win.scroll.replaceChildren(body);
  win.sheet.setAttribute("aria-labelledby", "pwEpT");
}
function openWindow(opener, epId) {
  if (win) closeWindow();
  const overlay = el("div", { class: "pw-overlay" });
  const sheet = el("div", { class: "pw-sheet", role: "dialog", "aria-modal": "true" });
  const x = el("button", { type: "button", class: "pw-x", "aria-label": t("podClose"), text: "×" });
  const head = el("div", { class: "pw-head" }, el("span", { class: "pod-mic" }, micNode("small")),
    el("div", {}, el("small", { class: "pod-k", text: t("podK") }), el("b", { class: "pw-name", text: t("podName") }), el("p", { class: "pod-tag", text: t("podTag") })));
  const scroll = el("div", { class: "pw-scroll" });
  sheet.append(el("span", { class: "pw-grab", "aria-hidden": "true" }), x, head, scroll);
  overlay.appendChild(sheet);
  document.body.appendChild(overlay);
  document.documentElement.classList.add("pw-lock");
  win = { overlay, sheet, scroll, opener, epId };
  paintWindow();
  const close = () => closeWindow();
  x.addEventListener("click", close);
  overlay.addEventListener("click", ev => { if (ev.target === overlay) close(); });
  win.key = ev => {
    if (ev.key === "Escape") { close(); return; }
    if (ev.key !== "Tab") return;
    const f = [...sheet.querySelectorAll("button, a[href], iframe")].filter(n => !n.disabled && n.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
  };
  document.addEventListener("keydown", win.key);
  requestAnimationFrame(() => overlay.classList.add("open"));
  x.focus({ preventScroll: true });
}
function closeWindow() {
  if (!win) return;
  const w = win; win = null;
  document.removeEventListener("keydown", w.key);
  w.overlay.remove();
  document.documentElement.classList.remove("pw-lock");
  if (w.opener && w.opener.isConnected) w.opener.focus({ preventScroll: true });
}

// ---------- Wellness library ----------
function renderLibrary() {
  const host = document.getElementById("wellPodcast");
  if (!host || !C) return;
  if (!C.session()) { host.hidden = true; host.replaceChildren(); return; }
  const all = episodes();
  if (!all.length) { host.hidden = true; host.replaceChildren(); return; }   // nothing to show until there are episodes
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
  if (!lang && document.querySelector("#wellPodcast iframe, .pw-overlay iframe")) return;   // never interrupt a playing episode
  renderHome(); renderLibrary();
  if (lang && win) paintWindow();
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
