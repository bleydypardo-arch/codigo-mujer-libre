// Código Mujer Libre — "Código Experiences": the campaign layer on top of the EXISTING trips (plans kind 'trip').
// Cinematic Travel stage (admin images crossfading), the "two signature experiences a year" story, premium
// campaign cards, the Home teaser and the Wellness photo cards. Same data, same RSVP, same detail page.
(function () {
"use strict";
let C = null;
const ES = {
  expBrandK: "CÓDIGO", expBrand: "Experiencias",
  storyK: "NUESTRA PROMESA", storyT: "Dos veces al año dejamos la rutina para vivir algo extraordinario. Juntas.",
  storyP: "No son simples viajes: son capítulos que vas a contar durante años. Lugares que te cambian, mujeres que se vuelven familia y momentos que solo pasan cuando decides vivirlos.",
  storyI: "I", storyII: "II", storySoon: "Próximamente", storySoonT: "Se anunciará muy pronto", storyOpen: "Descubrir",
  campCta: "Descubrir la experiencia", campInterested: n => n === 1 ? "1 mujer interesada" : n + " mujeres interesadas",
  campGoing: n => n === 1 ? "1 confirmada" : n + " confirmadas",
  homeExpK: "CÓDIGO EXPERIENCIAS", homeExpSoon: "Nuestra próxima gran experiencia se anunciará pronto",
  homeExpSoonP: "Dos veces al año nos reunimos para vivir algo inolvidable. ¿A dónde vamos ahora?",
  homeExpAll: "Ver todas las experiencias", homeExpMore: "También próximamente", homeExpGo: "Descubrir la experiencia",
  typesK: "EXPLORA POR TIPO", typesNote: "Toca un tipo para ver solo esas experiencias. Toca de nuevo para ver todas.",
  wellPick: "Código Pick", wellBook: "Reservar", wellSee: "Ver experiencia", wellUntil: d => "Hasta el " + d,
  addWellness: "+ Agregar experiencia de bienestar", addExperience: "+ Crear experiencia",
  dreamK: "IDEAS PARA SOÑAR", dreamT: "Lugares que soñamos vivir contigo", dreamP: "Todavía no son viajes anunciados: son los destinos que imaginamos. Toca el que te enamora y cuéntanos.",
  seaOn: "Escuchar el mar", seaOff: "Silenciar el mar",
  dreamSoon: "Muy pronto", dreamLove: "Me enamora",
  dmx: "Riviera Maya, México", dmxP: "Cenotes, selva y mar turquesa. Un atardecer frente al Caribe.",
  dtu: "Toscana, Italia", dtuP: "Colinas doradas, viñedos y una mesa larga al caer el sol.",
  dve: "Venecia, Italia", dveP: "Canales, luz de oro y una cena que no se olvida."
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
  homeExpAll: "See all experiences", homeExpMore: "Also coming up", homeExpGo: "Discover the experience",
  typesK: "EXPLORE BY TYPE", typesNote: "Tap a type to see only those experiences. Tap again to see them all.",
  wellPick: "Código Pick", wellBook: "Book", wellSee: "See experience", wellUntil: d => "Until " + d,
  addWellness: "+ Add wellness experience", addExperience: "+ Create experience",
  dreamK: "DREAMING OF…", dreamT: "Places we dream of living with you", dreamP: "These aren't announced trips yet: they're the destinations we imagine. Tap the one you love and tell us.",
  seaOn: "Listen to the sea", seaOff: "Mute the sea",
  dreamSoon: "Coming soon", dreamLove: "I love this",
  dmx: "Riviera Maya, Mexico", dmxP: "Cenotes, jungle and turquoise sea. A sunset over the Caribbean.",
  dtu: "Tuscany, Italy", dtuP: "Golden hills, vineyards and a long table as the sun goes down.",
  dve: "Venice, Italy", dveP: "Canals, golden light and a dinner you won't forget."
};
const TYPE_KEY = { trip: "expTrip", retreat: "expRetreat", party: "expParty", dining: "expDining", nature: "expNature" };
const DEFAULT_TRAVEL = "paradise-sunset.svg";
const HERO_PHOTO = "travel-experiences.jpg";
const homeImg = () => stageImages()[0];
const homeCls = img => img === HERO_PHOTO ? " is-art is-photo" : img === DEFAULT_TRAVEL ? " is-art" : "";
const t = (key, ...args) => { const v = C ? C.t(key) : ""; return typeof v === "function" ? v(...args) : (v || key); };
const el = (...a) => C.el(...a);
const reduced = () => !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
const settingUrl = key => { const v = C.setting ? C.setting(key) : null; return v && v.url ? C.safeUrl(v.url) : ""; };
const trips = () => (C.session() ? C.homeData().plans.filter(p => p.kind === "trip").sort(C.byDate) : []);
const orlando = () => !!(C.viewCity && C.viewCity() === "orlando");   // Orlando keeps its original behaviour; the new city treatment is for the other cities
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
  // The Código Experiences look (the women by the sea) always comes first, unless the admin chose another cover; each experience's own photo follows.
  const list = [settingUrl("travel_image"), C.safeUrl(pages.travel || "")].filter(Boolean);
  if (!list.length && !orlando()) list.push(HERO_PHOTO);
  featuredFirst(upcomingTrips()).forEach(p => list.push(C.safeUrl(p.image_url)));
  const out = list.filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).slice(0, 5);
  return out.length ? out : [HERO_PHOTO];
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
  head.classList.toggle("is-art", imgs[0] === DEFAULT_TRAVEL || imgs[0] === HERO_PHOTO);
  head.classList.toggle("is-photo", imgs[0] === HERO_PHOTO);
  const old = head.querySelector(".sea-btn"); if (old) old.remove();
  if (imgs[0] === HERO_PHOTO) head.appendChild(seaBtn());
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

// ---------- "Ideas para soñar": original illustrated destinations (clearly NOT announced trips) ----------
const SCENE_MX = '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="dmA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6CCBE8"/><stop offset=".55" stop-color="#FFE3BC"/><stop offset="1" stop-color="#FFB890"/></linearGradient><linearGradient id="dmB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FE0D6"/><stop offset="1" stop-color="#14A3AE"/></linearGradient></defs><rect width="400" height="300" fill="url(#dmA)"/><circle cx="130" cy="150" r="30" fill="#FFF3CF"/><rect y="150" width="400" height="150" fill="url(#dmB)"/><g class="dw"><path d="M0 190q50-8 100 0t100 0 100 0 100 0v110H0z" fill="#fff" opacity=".22"/></g><g class="dw d2"><path d="M0 225q50-10 100 0t100 0 100 0 100 0v75H0z" fill="#0F8FA0" opacity=".45"/></g><path d="M0 262q110-34 230-8 90 20 170 4v42H0z" fill="#FFF1D9"/><g fill="none" stroke="#0B5A63" stroke-linecap="round"><path d="M318 288Q312 220 332 164" stroke-width="6"/><path d="M366 292Q372 236 354 196" stroke-width="5"/></g><g fill="#0B5A63"><path d="M332 164q-40-6-62 18 30-8 62-18zM332 164q-24-26-58-22 34 2 58 22zM332 164q16-30 52-30-30 8-52 30zM332 164q36-8 56 14-30-6-56-14zM332 164q-6-24-2-44 12 22 2 44z"/><path d="M354 196q-30-2-46 16 24-6 46-16zM354 196q-14-22-42-20 28 2 42 20zM354 196q14-22 44-20-28 4-44 20zM354 196q26 0 38 18-24-8-38-18z"/></g></svg>'
const SCENE_TU = '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="dtA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD3EA"/><stop offset=".5" stop-color="#FFE2B0"/><stop offset="1" stop-color="#FFB27E"/></linearGradient></defs><rect width="400" height="300" fill="url(#dtA)"/><circle class="dsun" cx="250" cy="148" r="40" fill="#FFF1C4"/><path d="M0 170q80-34 160-8t140-6 100 10v134H0z" fill="#E8C57F"/><path d="M0 200q100-40 200-6t200-14v120H0z" fill="#D2A857"/><path d="M0 238q120-30 240-4t160-8v74H0z" fill="#9FA862"/><g fill="#2F5A3A"><ellipse cx="84" cy="206" rx="6" ry="30"/><ellipse cx="108" cy="214" rx="5" ry="24"/><ellipse cx="302" cy="196" rx="6" ry="32"/><ellipse cx="326" cy="204" rx="5" ry="25"/><ellipse cx="350" cy="200" rx="5.5" ry="28"/></g><g stroke="#C7956A" stroke-width="2" fill="none" opacity=".7"><path d="M0 256q100-14 200-8t200-6"/><path d="M0 272q100-12 200-6t200-6"/></g><g fill="#F6EBD9"><rect x="196" y="190" width="22" height="14"/><path d="M193 190l14-10 14 10z" fill="#C9724F"/></g></svg>'
const SCENE_VE = '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="dvA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ED5EA"/><stop offset=".55" stop-color="#FFDCC0"/><stop offset="1" stop-color="#FFB69A"/></linearGradient><linearGradient id="dvB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2B7A0"/><stop offset=".3" stop-color="#5BB8C2"/><stop offset="1" stop-color="#1B8296"/></linearGradient></defs><rect width="400" height="300" fill="url(#dvA)"/><circle cx="300" cy="120" r="28" fill="#FFF3CF"/><g><rect x="20" y="118" width="64" height="62" fill="#E9B79A"/><rect x="84" y="100" width="54" height="80" fill="#F4DCC2"/><path d="M84 100l27-22 27 22z" fill="#C7684B"/><rect x="138" y="124" width="70" height="56" fill="#D99A80"/><rect x="208" y="110" width="58" height="70" fill="#F1D3B6"/><rect x="266" y="128" width="70" height="52" fill="#E5A98C"/><rect x="336" y="116" width="64" height="64" fill="#F4DCC2"/></g><g fill="#7A4A44" opacity=".75"><path d="M34 140q6-12 12 0v12H34zM58 140q6-12 12 0v12H58zM98 124q6-12 12 0v14H98zM118 124q6-12 12 0v14h-12zM152 142q6-12 12 0v12h-12zM176 142q6-12 12 0v12h-12zM222 130q6-12 12 0v14h-12zM244 130q6-12 12 0v14h-12zM280 144q6-12 12 0v12h-12zM304 144q6-12 12 0v12h-12zM350 134q6-12 12 0v14h-12z"/></g><rect y="180" width="400" height="120" fill="url(#dvB)"/><g class="dw"><path d="M0 214q50-7 100 0t100 0 100 0 100 0v86H0z" fill="#fff" opacity=".2"/></g><g class="dg" fill="#FFF1D2"><rect x="150" y="196" width="60" height="3" rx="1.5"/><rect x="160" y="212" width="46" height="3" rx="1.5"/><rect x="170" y="230" width="34" height="3" rx="1.5"/></g><g class="dgon"><path d="M92 252q40 16 100-2l-6-6q-44 10-82 2z" fill="#2B2230"/><path d="M92 252l-8-14 14 12z" fill="#2B2230"/><path d="M192 250l8-16-14 12z" fill="#2B2230"/></g></svg>'
const DREAMS = [
  { k: "mx", svg: SCENE_MX }, { k: "tu", svg: SCENE_TU }, { k: "ve", svg: SCENE_VE }
];
function dreamCard(d, idx) {
  const list = C.setting && C.setting("travel_dreams");
  const cfg = (Array.isArray(list) && list[idx]) || {};
  const lang = C.lang(), other = lang === "es" ? "en" : "es";
  const pk = k => String(cfg[k + "_" + lang] || cfg[k + "_" + other] || "").trim();
  const img = C.safeUrl(cfg.image);
  const title = pk("title") || t("d" + (d.k === "mx" ? "mx" : d.k === "tu" ? "tu" : "ve"));
  const text = pk("text") || t("d" + d.k + "P");
  const media = el("span", { class: "tdr-media", "aria-hidden": "true" });
  if (img) { const im = el("img", { src: img, alt: "", loading: "lazy" }); im.addEventListener("error", () => { im.remove(); media.innerHTML = d.svg; }); media.appendChild(im); }
  else media.innerHTML = d.svg;
  const b = el("button", { type: "button", class: "tdr-card tdr-" + d.k, "aria-label": title + " · " + t("dreamLove") },
    media, el("span", { class: "tdr-veil", "aria-hidden": "true" }),
    el("span", { class: "tdr-pill", text: t("dreamSoon") }),
    el("span", { class: "tdr-txt" }, el("b", { text: title }), el("small", { text }), el("span", { class: "tdr-love", text: "♡ " + t("dreamLove") })));
  b.addEventListener("click", () => {
    const f = document.getElementById("travelSuggest"), inp = document.getElementById("tripIdea");
    if (inp) inp.value = title;
    if (f && !f.hidden) { f.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "center" }); if (inp) setTimeout(() => inp.focus({ preventScroll: true }), 350); }
  });
  return b;
}
function paintDreams() {
  const host = document.getElementById("travelDreams");
  if (!host) return;
  host.hidden = false;
  host.replaceChildren(
    el("div", { class: "tdr-head" }, el("small", { class: "tdr-k", text: t("dreamK") }), el("h2", { class: "tdr-t", text: t("dreamT") }), el("p", { class: "tdr-p", text: t("dreamP") })),
    el("div", { class: "tdr-grid" }, ...DREAMS.map(dreamCard)));
}
function paintTravelPage() {
  if (!C) return;
  paintStage();
  seaSync();
  paintStory();
  paintDreams();
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


// ---------- sound of the sea (starts only when she taps: browsers block sound that starts by itself) ----------
const SEA = { audio: null, on: false, fade: null };
const SEA_ICON = '<svg class="ci" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 10v4h3l5 4V6L7 10z"/><path class="sw1" d="M15.5 9.5a3.5 3.5 0 0 1 0 5"/><path class="sw2" d="M18 7a7 7 0 0 1 0 10"/></svg>';
function seaFade(to, done) {
  const a = SEA.audio; if (!a) return;
  clearInterval(SEA.fade);
  SEA.fade = setInterval(() => {
    const v = a.volume + (to > a.volume ? 0.05 : -0.05);
    a.volume = Math.max(0, Math.min(1, v));
    if (Math.abs(a.volume - to) < 0.051) { a.volume = to; clearInterval(SEA.fade); if (done) done(); }
  }, 60);
}
function seaSet(on) {
  if (on) {
    if (!SEA.audio) { SEA.audio = new Audio("sea-waves.mp3"); SEA.audio.loop = true; SEA.audio.preload = "auto"; }
    SEA.audio.volume = 0;
    const pr = SEA.audio.play();
    if (pr && pr.catch) pr.catch(() => { SEA.on = false; seaSync(); });
    seaFade(0.6);
  } else if (SEA.audio) seaFade(0, () => SEA.audio.pause());
  SEA.on = on; seaSync();
}
function seaSync() {
  document.querySelectorAll(".sea-btn").forEach(b => {
    b.classList.toggle("on", SEA.on);
    b.setAttribute("aria-pressed", SEA.on ? "true" : "false");
    const l = t(SEA.on ? "seaOff" : "seaOn");
    b.setAttribute("aria-label", l); b.title = l;
    const tx = b.querySelector(".sea-tx"); if (tx) tx.textContent = l;
  });
}
function seaBtn() {
  const b = el("button", { type: "button", class: "sea-btn" });
  b.innerHTML = SEA_ICON + '<span class="sea-tx"></span>';
  b.addEventListener("click", e => { e.stopPropagation(); seaSet(!SEA.on); });
  return b;
}
function seaGuard() {
  // silence when the picture is not on screen or the app goes to the background
  document.addEventListener("visibilitychange", () => { if (document.hidden && SEA.on) seaSet(false); });
  setInterval(() => {
    if (!SEA.on) return;
    const vis = Array.from(document.querySelectorAll(".sea-btn")).some(b => { const r = b.getBoundingClientRect(); return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight; });
    if (!vis) seaSet(false);
  }, 1500);
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
    host.className = "hx-card is-soon" + homeCls(homeImg());
    host.replaceChildren(el("span", { class: "hx-bg", "aria-hidden": "true" }), homeImg() === HERO_PHOTO ? seaBtn() : null, el("div", { class: "hx-txt hx-invite" }, brand,
      el("h2", { class: "hx-title", text: t("homeExpSoon") }), el("span", { class: "hx-rule", "aria-hidden": "true" }), el("p", { class: "hx-p", text: t("homeExpSoonP") }), b));
    const bg = host.querySelector(".hx-bg"); bg.style.backgroundImage = 'url("' + homeImg().replace(/"/g, "%22") + '")'; bg.style.setProperty("--img", bg.style.backgroundImage);
    return;
  }
  const open = el("button", { type: "button", class: "hx-cta", text: t("homeExpGo") + " →" });
  open.addEventListener("click", () => C.openDetail(p.id, open));
  const all = el("button", { type: "button", class: "hx-all", text: t("homeExpAll") });
  all.addEventListener("click", go);
  const av = availability(p);
  const own = "";   // same Home look in every city (the women by the sea)
  host.className = "hx-card" + (own ? "" : homeCls(homeImg()));
  const bg = el("span", { class: "hx-bg", "aria-hidden": "true" });
  bg.style.backgroundImage = 'url("' + (own || homeImg()).replace(/"/g, "%22") + '")';
  bg.style.setProperty("--img", bg.style.backgroundImage);
  host.replaceChildren(bg, (!own && homeImg() === HERO_PHOTO) ? seaBtn() : null, el("div", { class: "hx-txt" }, brand,
    el("small", { class: "hx-meta", text: [t(TYPE_KEY[C.tripTypeOf(p)]), dateRange(p), place(p)].filter(Boolean).join(" · ") }),
    el("h2", { class: "hx-title", text: C.pick(p, "title") || "—" }),
    shortStory(p) ? el("p", { class: "hx-p", text: shortStory(p) }) : null,
    av ? el("span", { class: "camp-status " + av.cls, text: av.text }) : null,
    el("div", { class: "hx-acts" }, open, all)));
}
// the other upcoming experiences of this city, right on Home (so a city with 3 shows all 3 up front)
function moreRows(first) {
  return null;
  const others = featuredFirst(upcomingTrips()).filter(x => x.id !== first.id).slice(0, 2);
  if (!others.length) return null;
  return el("div", { class: "hx-more" }, el("small", { class: "hx-more-t", text: t("homeExpMore") }),
    ...others.map(x => {
      const b = el("button", { type: "button", class: "hx-row" }, el("span", { class: "hx-row-d", text: dateRange(x) || "" }), el("b", { class: "hx-row-n", text: C.pick(x, "title") || "—" }), el("span", { class: "hx-row-go", "aria-hidden": "true", text: "›" }));
      b.addEventListener("click", () => C.openDetail(x.id, b));
      return b;
    }));
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

function paintAll() { paintHome(); seaSync(); paintWellnessAdmin(); if (document.querySelector("#travel.active, #travel.page.active")) paintTravelPage(); requestAnimationFrame(reveal); }
function init() {
  C = window.CML;
  if (!C) return;
  C.addStrings(ES, EN);
  window.CMLExp = { defaults: { es: ES, en: EN }, campaignCard, paintTravelPage, paintHome, heroPhoto: () => HERO_PHOTO, cityTrips: () => featuredFirst(upcomingTrips()), dateRange, typeKey: k => TYPE_KEY[k] || "expTrip", stageImages };
  document.addEventListener("cml:render", paintAll);
  document.addEventListener("cml:lang", () => { paintAll(); paintTravelPage(); });
  document.addEventListener("cml:session", paintAll);
  document.addEventListener("cml:page", e => { if (e.detail && e.detail.page === "travel") paintTravelPage(); requestAnimationFrame(reveal); });
  seaGuard();
  paintAll();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
