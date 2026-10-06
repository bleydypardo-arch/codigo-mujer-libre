// Código Mujer Libre — "Código Experiences": the campaign layer on top of the EXISTING trips (plans kind 'trip').
// Cinematic Travel stage (admin images crossfading), the "two signature experiences a year" story, premium
// campaign cards, the Home teaser and the Wellness photo cards. Same data, same RSVP, same detail page.
(function () {
"use strict";
let C = null;
const ES = {
  expBrandK: "CÓDIGO", expBrand: "Experiences",
  storyK: "NUESTRA PROMESA", storyT: "Dos veces al año dejamos la rutina para vivir algo extraordinario. Juntas.",
  storyP: "No son simples viajes: son capítulos que vas a contar durante años. Lugares que te cambian, mujeres que se vuelven familia y momentos que solo pasan cuando decides vivirlos.",
  storyI: "I", storyII: "II", storySoon: "Próximamente", storySoonT: "Se anunciará muy pronto", storyOpen: "Descubrir",
  campCta: "Descubrir la experiencia", campInterested: n => n === 1 ? "1 mujer interesada" : n + " mujeres interesadas",
  campGoing: n => n === 1 ? "1 confirmada" : n + " confirmadas",
  homeExpK: "CÓDIGO EXPERIENCES", homeExpSoon: "Nuestra próxima gran experiencia se anunciará pronto",
  homeExpSoonP: "Dos veces al año nos reunimos para vivir algo inolvidable. ¿A dónde vamos ahora?",
  homeExpAll: "Ver todas las experiencias", homeExpGo: "Descubrir la experiencia",
  typesK: "EXPLORA POR TIPO", typesNote: "Toca un tipo para ver solo esas experiencias. Toca de nuevo para ver todas.",
  wellPick: "Código Pick", wellBook: "Reservar", wellSee: "Ver experiencia", wellUntil: d => "Hasta el " + d,
  addWellness: "+ Agregar experiencia de bienestar", addExperience: "+ Crear experiencia"
};
const EN = {
  expBrandK: "CÓDIGO", expBrand: "Experiences",
  storyK: "OUR PROMISE", storyT: "Twice a year we step out of routine to live something extraordinary. Together.",
  storyP: "These aren't just trips: they're chapters you'll be telling for years. Places that change you, women who become family and moments that only happen when you decide to live them.",
  storyI: "I", storyII: "II", storySoon: "Coming soon", storySoonT: "To be announced very soon", storyOpen: "Discover",
  campCta: "Discover the experience", campInterested: n => n === 1 ? "1 woman interested" : n + " women interested",
  campGoing: n => n === 1 ? "1 confirmed" : n + " confirmed",
  homeExpK: "CÓDIGO EXPERIENCES", homeExpSoon: "Our next big experience will be announced soon",
  homeExpSoonP: "Twice a year, we come together for something unforgettable. Where should we go next?",
  homeExpAll: "See all experiences", homeExpGo: "Discover the experience",
  typesK: "EXPLORE BY TYPE", typesNote: "Tap a type to see only those experiences. Tap again to see them all.",
  wellPick: "Código Pick", wellBook: "Book", wellSee: "See experience", wellUntil: d => "Until " + d,
  addWellness: "+ Add wellness experience", addExperience: "+ Create experience"
};
const TYPE_KEY = { trip: "expTrip", retreat: "expRetreat", party: "expParty", dining: "expDining", nature: "expNature" };
const DEFAULT_TRAVEL = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80";
const t = (key, ...args) => { const v = C ? C.t(key) : ""; return typeof v === "function" ? v(...args) : (v || key); };
const el = (...a) => C.el(...a);
const reduced = () => !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
const settingUrl = key => { const v = C.setting ? C.setting(key) : null; return v && v.url ? C.safeUrl(v.url) : ""; };
const trips = () => (C.session() ? C.homeData().plans.filter(p => p.kind === "trip").sort(C.byDate) : []);
const upcomingTrips = () => { const today = C.todayStr(); return trips().filter(p => !p.event_date || p.event_date >= today); };
function featuredFirst(list) { return list.slice().sort((a, b) => (C.planTag(b.id).featured ? 1 : 0) - (C.planTag(a.id).featured ? 1 : 0)); }
function dateRange(p) {
  const x = C.richOf(p) || {};
  if (!p.event_date) return p.date_text || "";
  const f = d => new Date(d + "T12:00:00").toLocaleDateString(C.loc(), { day: "numeric", month: "short" });
  const y = new Date(p.event_date + "T12:00:00").getFullYear();
  return f(p.event_date) + (x.end_date && x.end_date !== p.event_date ? " – " + f(x.end_date) : "") + " " + y;
}
function place(p) { const x = C.richOf(p) || {}; return [p.location, x.city, x.country].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(", "); }
function shortStory(p) {
  const x = C.richOf(p);
  const sub = x ? C.richText(x, "subtitle") : "";
  const d = C.pick(p, "desc") || (x ? C.richText(x, "about") : "");
  const txt = (d || sub || "").replace(/\s+/g, " ").trim();
  return txt.length > 150 ? txt.slice(0, 147).replace(/\s\S*$/, "") + "…" : txt;
}
function availability(p) {
  const rs = C.rsvpState(p);
  if (rs.status === "soldout" || rs.full) return { cls: "st-soldout", text: t("st_soldout") };
  if (rs.closed) return { cls: "st-closed", text: t("st_closed") };
  if (rs.waitlist) return { cls: "st-waitlist", text: t("st_waitlist") };
  if (rs.left !== null && rs.left !== undefined) return { cls: "st-open", text: t("spotsLeft", rs.left) };
  if (rs.status === "open") return { cls: "st-open", text: t("st_open") };
  return null;
}
function media(p, cls) {
  const img = C.safeUrl(p.image_url) || (C.richOf(p) && (C.richOf(p).gallery || []).map(C.safeUrl).find(Boolean)) || "";
  const box = el("span", { class: cls + (img ? "" : " no-img") });
  if (img) {
    const i = el("img", { src: img, alt: "", loading: "lazy" });
    i.addEventListener("error", () => { i.remove(); box.classList.add("no-img"); });
    box.appendChild(i);
  }
  return box;
}

// ---------- premium campaign card ----------
function campaignCard(p) {
  const tag = C.planTag(p.id);
  const card = el("article", { class: "card plan trip-card camp-card" + (tag.featured ? " is-featured" : "") });
  const cover = el("button", { type: "button", class: "camp-cover", "aria-label": (C.pick(p, "title") || "—") + " · " + t("campCta") });
  cover.appendChild(media(p, "camp-media"));
  cover.appendChild(el("span", { class: "camp-veil", "aria-hidden": "true" }));
  const av = availability(p);
  cover.appendChild(el("span", { class: "camp-chips" },
    el("span", { class: "camp-type", text: t(TYPE_KEY[C.tripTypeOf(p)]) }),
    av ? el("span", { class: "camp-status " + av.cls, text: av.text }) : null));
  if (tag.featured) cover.appendChild(el("span", { class: "pick-badge camp-pick", text: "✦ " + t("featuredExp") }));
  const x = C.richOf(p);
  const sub = x ? C.richText(x, "subtitle") : "";
  cover.appendChild(el("span", { class: "camp-head" },
    dateRange(p) ? el("span", { class: "camp-date", text: dateRange(p) }) : null,
    el("span", { class: "camp-title", text: C.pick(p, "title") || "—" }),
    sub ? el("span", { class: "camp-sub", text: sub }) : null));
  const body = el("div", { class: "camp-body" });
  if (place(p)) body.appendChild(el("p", { class: "camp-where", text: "📍 " + place(p) }));
  const story = shortStory(p);
  if (story) body.appendChild(el("p", { class: "camp-desc", text: story }));
  if (p.price) body.appendChild(el("p", { class: "camp-price", text: p.price }));
  body.appendChild(C.avatarStack(p.id));
  body.appendChild(el("div", { class: "resp-row" }, C.respondButton(p, "interested"), C.respondButton(p, "going")));
  const more = el("button", { type: "button", class: "ev-more camp-cta", text: t("campCta") + " →" });
  more.addEventListener("click", () => C.openDetail(p.id, more));
  cover.addEventListener("click", () => C.openDetail(p.id, more));
  body.appendChild(more);
  card.append(cover, body);
  return card;
}

// ---------- Travel: cinematic stage + the "two a year" story ----------
let slideTimer = null;
function stageImages() {
  const pages = (C.setting && C.setting("page_images")) || {};
  const list = [settingUrl("travel_image"), C.safeUrl(pages.travel || "")];
  featuredFirst(upcomingTrips()).forEach(p => list.push(C.safeUrl(p.image_url)));
  const out = list.filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).slice(0, 5);
  return out.length ? out : [DEFAULT_TRAVEL];
}
function paintStage() {
  const head = document.querySelector(".ph-travel");
  const box = head && head.querySelector(".ph-media");
  if (!box) return;
  const imgs = stageImages();
  const key = imgs.join("|");
  if (box.dataset.key === key) return;
  box.dataset.key = key;
  box.style.backgroundImage = "";
  clearInterval(slideTimer);
  box.replaceChildren(...imgs.map((src, i) => {
    const s = el("span", { class: "tv-slide" + (i === 0 ? " on" : "") + (i % 2 ? " kb-b" : "") });
    s.style.backgroundImage = 'url("' + src.replace(/"/g, "%22") + '")';
    return s;
  }));
  head.classList.add("has-photo", "tv-stage");
  if (imgs.length > 1 && !reduced()) {
    let i = 0;
    slideTimer = setInterval(() => {
      if (!document.body.contains(box)) return clearInterval(slideTimer);
      const slides = box.querySelectorAll(".tv-slide");
      if (!slides.length) return;
      slides[i % slides.length].classList.remove("on");
      i++;
      slides[i % slides.length].classList.add("on");
    }, 6500);
  }
}
// Admin-editable "coming soon" placeholders: the 1st/2nd EMPTY space uses item 1/2 (settings key "travel_slots": two items { label_*, title_*, image }); the original wording is the default
function soonSlot(n, idx) {
  const list = C.setting && C.setting("travel_slots");
  const cfg = (Array.isArray(list) && list[idx]) || {};
  const lang = C.lang(), other = lang === "es" ? "en" : "es";
  const pk = k => String(cfg[k + "_" + lang] || cfg[k + "_" + other] || "").trim();
  const img = C.safeUrl(cfg.image);
  const kids = [];
  if (img) {
    const im = el("img", { src: img, alt: "", loading: "lazy" });
    im.addEventListener("error", () => im.remove());
    kids.push(el("span", { class: "tv-slot-media" }, im), el("span", { class: "tv-slot-veil", "aria-hidden": "true" }));
  }
  kids.push(el("span", { class: "tv-num", text: n }),
    el("span", { class: "tv-slot-txt" }, el("small", { text: pk("label") || t("storySoon") }), el("b", { text: pk("title") || t("storySoonT") })));
  return el("div", { class: "tv-slot is-soon" + (img ? " has-img" : "") }, ...kids);
}
function slot(p, n, idx) {
  if (!p) return soonSlot(n, idx || 0);
  const b = el("button", { type: "button", class: "tv-slot" });
  b.append(media(p, "tv-slot-media"), el("span", { class: "tv-slot-veil", "aria-hidden": "true" }),
    el("span", { class: "tv-num", text: n }),
    el("span", { class: "tv-slot-txt" },
      el("small", { text: [dateRange(p), place(p)].filter(Boolean).join(" · ") }),
      el("b", { text: C.pick(p, "title") || "—" }),
      el("span", { class: "tv-slot-go", text: t("storyOpen") + " →" })));
  b.addEventListener("click", () => C.openDetail(p.id, b));
  return b;
}
function paintStory() {
  const host = document.getElementById("travelHero");
  if (!host) return;
  const next = featuredFirst(upcomingTrips()).slice(0, 2).sort(C.byDate);
  host.className = "tv-story";
  host.hidden = false;
  host.replaceChildren(
    el("div", { class: "tv-story-txt" },
      el("small", { class: "tv-k", text: t("storyK") }),
      el("h2", { class: "tv-story-t", text: t("storyT") }),
      el("p", { class: "tv-story-p", text: t("storyP") })),
    C.session() ? el("div", { class: "tv-two" }, slot(next[0], t("storyI"), 0), slot(next[1], t("storyII"), next[0] ? 0 : 1)) : null);
}
function paintTravelPage() {
  if (!C) return;
  paintStage();
  paintStory();
  const k = document.querySelector("#travel .exp-types > small"), n = document.querySelector("#travel .exp-types > .small-note");
  if (k) k.textContent = t("typesK");
  if (n) n.textContent = t("typesNote");
  const manage = document.getElementById("travelManage");
  let add = document.getElementById("travelAdd");
  if (manage && !add) {
    add = el("button", { type: "button", class: "primary travel-add", id: "travelAdd" });
    add.addEventListener("click", () => window.CMLAdmin && window.CMLAdmin.openNew && window.CMLAdmin.openNew("trip"));
    manage.parentNode.insertBefore(add, manage);
  }
  if (add) { add.textContent = t("addExperience"); add.hidden = !(C.session() && C.isAdmin() && window.CMLAdmin && window.CMLAdmin.openNew); }
}

// ---------- Home: the next Código Experience ----------
function paintHome() {
  const host = document.getElementById("homeExperience");
  if (!host || !C) return;
  if (!C.session()) { host.hidden = true; host.replaceChildren(); return; }
  host.hidden = false;
  const p = featuredFirst(upcomingTrips())[0];
  const go = () => { if (window.CMLRedesign) window.CMLRedesign.paintTravel(); C.showPage("travel"); };
  // same small brand signature as the Travel page header (icon + CÓDIGO EXPERIENCES)
  const brand = el("span", { class: "hx-sig" }, el("span", { class: "hx-ic", "aria-hidden": "true" }), el("span", { class: "hx-sig-t", text: t("travelKicker") }));
  brand.firstChild.innerHTML = '<svg class="ci" viewBox="0 0 24 24" focusable="false"><path d="M21 3 3 10.5l7 2.5 2.5 7zM21 3 10 13"/></svg>';
  if (!p) {
    const b = el("button", { type: "button", class: "hx-cta", text: t("homeExpAll") + " →" });
    b.addEventListener("click", go);
    host.className = "hx-card is-soon";
    host.replaceChildren(el("span", { class: "hx-bg", "aria-hidden": "true" }), el("div", { class: "hx-txt hx-invite" }, brand,
      el("h2", { class: "hx-title", text: t("homeExpSoon") }), el("span", { class: "hx-rule", "aria-hidden": "true" }), el("p", { class: "hx-p", text: t("homeExpSoonP") }), b));
    const bg = host.querySelector(".hx-bg"); bg.style.backgroundImage = 'url("' + stageImages()[0].replace(/"/g, "%22") + '")';
    return;
  }
  const open = el("button", { type: "button", class: "hx-cta", text: t("homeExpGo") + " →" });
  open.addEventListener("click", () => C.openDetail(p.id, open));
  const all = el("button", { type: "button", class: "hx-all", text: t("homeExpAll") });
  all.addEventListener("click", go);
  const av = availability(p);
  host.className = "hx-card";
  const bg = el("span", { class: "hx-bg", "aria-hidden": "true" });
  bg.style.backgroundImage = 'url("' + (C.safeUrl(p.image_url) || stageImages()[0]).replace(/"/g, "%22") + '")';
  host.replaceChildren(bg, el("div", { class: "hx-txt" }, brand,
    el("small", { class: "hx-meta", text: [t(TYPE_KEY[C.tripTypeOf(p)]), dateRange(p), place(p)].filter(Boolean).join(" · ") }),
    el("h2", { class: "hx-title", text: C.pick(p, "title") || "—" }),
    shortStory(p) ? el("p", { class: "hx-p", text: shortStory(p) }) : null,
    av ? el("span", { class: "camp-status " + av.cls, text: av.text }) : null,
    el("div", { class: "hx-acts" }, open, all)));
}

// ---------- Wellness: admin shortcut on the page ----------
function paintWellnessAdmin() {
  const host = document.getElementById("wellDiscover");
  if (!host) return;
  let b = document.getElementById("wellAdd");
  const can = C.session() && C.isAdmin() && window.CMLAdmin && window.CMLAdmin.openNew;
  if (!b && can) {
    b = el("button", { type: "button", class: "primary well-add", id: "wellAdd" });
    b.addEventListener("click", () => window.CMLAdmin.openNew("wellness"));
    host.parentNode.insertBefore(b, host);
  }
  if (b) { b.textContent = t("addWellness"); b.hidden = !can; }
}

// ---------- reveal on scroll (soft, once) ----------
let io = null;
function reveal() {
  if (reduced() || !("IntersectionObserver" in window)) return;
  if (!io) io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".camp-card:not(.rv), .hx-card:not(.rv), .tv-story:not(.rv), .wd-card:not(.rv), .wc-card:not(.rv)").forEach(n => {
    const r = n.getBoundingClientRect();
    if (r.top < window.innerHeight) return;   // already visible: no flash
    n.classList.add("rv"); io.observe(n);
  });
}

function paintAll() { paintHome(); paintWellnessAdmin(); if (document.querySelector("#travel.active, #travel.page.active")) paintTravelPage(); requestAnimationFrame(reveal); }
function init() {
  C = window.CML;
  if (!C) return;
  C.addStrings(ES, EN);
  window.CMLExp = { defaults: { es: ES, en: EN }, campaignCard, paintTravelPage, paintHome, typeKey: k => TYPE_KEY[k] || "expTrip", stageImages };
  document.addEventListener("cml:render", paintAll);
  document.addEventListener("cml:lang", () => { paintAll(); paintTravelPage(); });
  document.addEventListener("cml:session", paintAll);
  document.addEventListener("cml:page", e => { if (e.detail && e.detail.page === "travel") paintTravelPage(); requestAnimationFrame(reveal); });
  paintAll();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
