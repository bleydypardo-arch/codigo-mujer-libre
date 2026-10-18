// Código Mujer Libre — discovery surfaces built on the EXISTING data (no new tables, no new backend):
//  • Wellness discovery: plans kind 'wellness' (admin "Bienestar" tab) + upcoming wellness events.
//  • Matcha y Arte: a curated collection = plans the admin marks for it (settings.plan_tags) +
//    Community posts that members share with the "🍵 Matcha y Arte" tag. Home editorial card + page.
//  • Support page: family block (family events + private family message) and loading the prayer wall.
(function () {
"use strict";
let C = null;

const ES = {
  wdLabel: "DESCUBRE BIENESTAR", wdTitle: "Experiencias para cuidarte", wdAll: "Todo",
  wdOffer: "Ver oferta o reservar", wdMore: "Ver detalles", wdEmptyTitle: "Pronto compartiremos experiencias de bienestar",
  wdEmptyText: "Spas, masajes, yoga, retiros y lugares para cuidarte. ¿Conoces uno especial? Recomiéndalo.",
  wdRecommend: "Recomendar un lugar",
  wuLabel: "PRÓXIMOS PLANES DE BIENESTAR",
  wcat_spa: "Spa y relajación", wcat_beauty: "Belleza y cuidado", wcat_movement: "Yoga y movimiento", wcat_mind: "Meditación y fe",
  wcat_retreat: "Retiros", wcat_food: "Alimentación sana", wcat_workshop: "Talleres",
  wcat_fitness: "Fitness", wcat_offer: "Ofertas especiales",
  wcat_massage: "Masajes", wcat_facial: "Faciales", wcat_skincare: "Cuidado de la piel", wcat_nails: "Uñas", wcat_hair: "Cabello",
  wcat_gym: "Gimnasios", wcat_pilates: "Pilates", wcat_yoga: "Yoga", wcat_meditation: "Meditación", wcat_promo: "Promociones", wcat_other: "Otro",
  supLabel: "APOYO", supTitle: "Aquí estamos para ti", supIntro: "Habla en privado, pide oración o comparte una necesidad. No estás sola.",
  supLinkTitle: "¿Necesitas apoyo?", supLinkSub: "Habla en privado, pide oración o encuentra ayuda inmediata.",
  memTestFlag: "⚠ Parece contenido de prueba (contiene «test»): no se muestra en la app. Ábrelo para cambiarle el título o eliminarlo.",
  hereForYou: "Aquí para ti", supStripTitle: "Apoyo y oración", supStripSub: "Habla en privado, pide oración o apoyo para tu familia",
  supMyMessages: "Ver mis mensajes privados →",
  famLabel: "FAMILIA", famTitle: "Planes y apoyo en familia",
  famText: "Comparte una necesidad familiar o propón planes para disfrutar en familia. La administradora lo recibe en privado.",
  famWrite: "Escribir sobre mi familia", famPlans: "Próximos planes en familia",
  maName: "Rincón Matcha & Arte", maTag: "Saborea. Crea. Conecta.", maKicker: "TU RINCÓN",
  maIntro: "Cafés de matcha, cerámica, pintura, música y pequeños encuentros creativos para disfrutar sin prisa y en buena compañía.",
  maHomeSub: "Cafés, talleres y tardes creativas con la comunidad", maNext: t => "Próximo: " + t,
  maPlans: "PRÓXIMOS ENCUENTROS", maPlansEmpty: "Pronto: catas de matcha, talleres de cerámica y tardes de pintura.",
  maPropose: "Proponer una idea", maShares: "DE LA COMUNIDAD", maSharesIntro: "Tu café favorito, algo que creaste, un taller que te encantó.",
  maShare: "Compartir algo creativo", maSharesEmpty: "Sé la primera en compartir tu café favorito o algo que creaste.",
  maPrefix: "🍵 Matcha & Arte · ", maOpen: "Entrar al rincón",
  maIntro2: "", maPast: "ya pasó", maBy: n => "Propuesto por " + n, maNextMeet: (p, w) => "¿Matcha? " + p + " · " + w,
  maWeek: "MATCHA DE LA SEMANA", mtype_spot: "CAFÉ O SALÓN DE TÉ", mtype_place: "LUGAR CREATIVO", mtype_recipe: "RECETA", mtype_offer: "OFERTA ESPECIAL",
  maRecipeOpen: "Ver receta o video", maLinkOpen: "Ver más", maMeetHere: "Proponer encuentro aquí",
  maMeetK: "¿DÓNDE NOS VEMOS?", maMeetTitle: "Encuentros para tomar matcha", maMeetIntro: "Únete a un plan o propón el tuyo: un café, una tarde creativa, una conversación.",
  maMeetEmpty: "Todavía no hay encuentros. Propón uno: lugar, ciudad, día y hora. Las demás podrán decir «Me apunto».",
  maMeetPropose: "Proponer un Encuentro", maPlace: "Lugar", maPlacePh: "Café, salón de té o taller", maCity: "Ciudad", maCityPh: "Orlando, Bogotá…",
  maDate: "Día", maTime: "Hora", maNote: "Nota (opcional)", maNotePh: "Ej.: ¡traigan su cuaderno de dibujo!",
  maMeetSend: "Publicar encuentro", maMeetNeed: "Escribe el lugar y el día.", maMeetFail: "No se pudo publicar. Inténtalo de nuevo.", maMeetDone: "¡Listo! Tu encuentro ya aparece en el rincón y en Comunidad.",
  maPollK: "DECIDAMOS JUNTAS", maPollTitle: "¿Dónde nos vemos?", maAllCities: "Todas las ciudades", maSearchPh: "Buscar un lugar o ciudad…", maPickK: "Lugares", maPickCount: "lugares", maPickHint: "Toca un lugar para ver más. Desliza para ver todos.", maSeePlaces: "Ver los lugares", maNoMatch: "No encontramos lugares con esa búsqueda.",
  maSpotsK: "LUGARES FAVORITOS", maSpotsTitle: "Cafés y rincones creativos", maRecipesK: "RECETAS E IDEAS", maRecipesTitle: "Para preparar en casa",
  maCreateTitle: "Crea algo"
};
const EN = {
  wdLabel: "DISCOVER WELLNESS", wdTitle: "Experiences to take care of yourself", wdAll: "All",
  wdOffer: "See offer or book", wdMore: "See details", wdEmptyTitle: "Wellness experiences are coming soon",
  wdEmptyText: "Spas, massages, yoga, retreats and places to take care of yourself. Know a special one? Recommend it.",
  wdRecommend: "Recommend a place",
  wuLabel: "UPCOMING WELLNESS PLANS",
  wcat_spa: "Spa & relaxation", wcat_beauty: "Beauty & self-care", wcat_movement: "Yoga & movement", wcat_mind: "Meditation & faith",
  wcat_retreat: "Retreats", wcat_food: "Healthy food", wcat_workshop: "Workshops",
  wcat_fitness: "Fitness", wcat_offer: "Special offers",
  wcat_massage: "Massages", wcat_facial: "Facials", wcat_skincare: "Skincare", wcat_nails: "Nails", wcat_hair: "Hair",
  wcat_gym: "Gyms", wcat_pilates: "Pilates", wcat_yoga: "Yoga", wcat_meditation: "Meditation", wcat_promo: "Promotions", wcat_other: "Other",
  supLabel: "SUPPORT", supTitle: "We're here for you", supIntro: "Talk privately, ask for prayer or share a need. You're not alone.",
  supLinkTitle: "Need support?", supLinkSub: "Talk privately, ask for prayer or find immediate help.",
  memTestFlag: "⚠ Looks like test content (contains “test”): it is not shown in the app. Open it to rename or delete it.",
  hereForYou: "Here for you", supStripTitle: "Support & prayer", supStripSub: "Talk privately, ask for prayer or support for your family",
  supMyMessages: "See my private messages →",
  famLabel: "FAMILY", famTitle: "Family plans & support",
  famText: "Share a family need or suggest plans to enjoy with your family. The administrator receives it privately.",
  famWrite: "Write about my family", famPlans: "Upcoming family plans",
  maName: "Matcha & Art Corner", maTag: "Sip. Create. Connect.", maKicker: "YOUR CORNER",
  maIntro: "Matcha cafés, pottery, painting, music and small creative gatherings to enjoy slowly and in good company.",
  maHomeSub: "Cafés, workshops and creative afternoons with the community", maNext: t => "Next: " + t,
  maPlans: "UPCOMING GATHERINGS", maPlansEmpty: "Coming soon: matcha tastings, pottery workshops and painting afternoons.",
  maPropose: "Suggest an idea", maShares: "FROM THE COMMUNITY", maSharesIntro: "Your favorite café, something you made, a workshop you loved.",
  maShare: "Share something creative", maSharesEmpty: "Be the first to share your favorite café or something you made.",
  maPrefix: "🍵 Matcha & Art · ", maOpen: "Step into the corner",
  maIntro2: "", maPast: "past", maBy: n => "Proposed by " + n, maNextMeet: (p, w) => "Matcha? " + p + " · " + w,
  maWeek: "MATCHA OF THE WEEK", mtype_spot: "CAFÉ OR TEA ROOM", mtype_place: "CREATIVE PLACE", mtype_recipe: "RECIPE", mtype_offer: "SPECIAL OFFER",
  maRecipeOpen: "See recipe or video", maLinkOpen: "Learn more", maMeetHere: "Propose a meetup here",
  maMeetK: "WHERE SHOULD WE MEET?", maMeetTitle: "Meetups for matcha", maMeetIntro: "Join a plan or propose your own: a coffee, a creative afternoon, a conversation.",
  maMeetEmpty: "No meetups yet. Propose one: place, city, day and time. Others can say “I'm in”.",
  maMeetPropose: "Propose a Meetup", maPlace: "Place", maPlacePh: "Café, tea room or studio", maCity: "City", maCityPh: "Orlando, Bogotá…",
  maDate: "Day", maTime: "Time", maNote: "Note (optional)", maNotePh: "e.g. bring your sketchbook!",
  maMeetSend: "Post meetup", maMeetNeed: "Write the place and the day.", maMeetFail: "Could not post. Please try again.", maMeetDone: "Done! Your meetup now shows in the corner and in Community.",
  maPollK: "LET'S DECIDE TOGETHER", maPollTitle: "Where should we meet?", maAllCities: "All cities", maSearchPh: "Search a place or city…", maPickK: "Places", maPickCount: "places", maPickHint: "Tap a place for details. Scroll to see them all.", maSeePlaces: "See the places", maNoMatch: "No places match that search.",
  maSpotsK: "FAVORITE PLACES", maSpotsTitle: "Cafés and creative corners", maRecipesK: "RECIPES & IDEAS", maRecipesTitle: "To make at home",
  maCreateTitle: "Create something"
};
const t = (key, ...args) => { const v = C ? C.t(key) : ""; return typeof v === "function" ? v(...args) : (v || key); };
const el = (...a) => C.el(...a);
const WCATS = ["spa", "massage", "facial", "skincare", "nails", "hair", "beauty", "gym", "fitness", "pilates", "yoga", "movement", "meditation", "mind", "retreat", "food", "workshop", "offer", "promo", "other"];
const catLabel = tag => (tag.cat === "other" && tag.label ? tag.label : t("wcat_" + tag.cat));
const MATCHA_DEFAULT = "matcha-cup.jpg";
const MATCHA_RE = /^\s*🍵\s*Matcha/i;
const DAY = 86400000;
const todayStr = () => C.todayStr();
const upcoming = p => !p.event_date || p.event_date >= todayStr();
const shortWhen = p => p.event_date
  ? new Date(p.event_date + "T12:00:00").toLocaleDateString(C.loc(), { weekday: "short", day: "numeric", month: "short" }) + (p.event_time ? " · " + p.event_time : "")
  : (p.date_text || "");
const settingUrl = key => { const v = C.setting ? C.setting(key) : null; return v && v.url ? C.safeUrl(v.url) : ""; };
const btn = (text, cls, fn) => { const b = el("button", { type: "button", class: cls, text }); b.addEventListener("click", fn); return b; };
function emptyBox(icon, title, text, action) {
  return el("div", { class: "empty-state" }, el("span", { class: "empty-ic", "aria-hidden": "true", text: icon }),
    el("b", { text: title }), text ? el("p", { text }) : null, action || null);
}

// ---------- Wellness discovery ----------
let wcat = "all";
function wellCard(p) {
  // photo card: category · Código Pick · title · where · short description · price / promo · clear action
  const tag = C.planTag(p.id);
  const x = (C.richOf && C.richOf(p)) || {};
  const img = C.safeUrl(p.image_url) || (Array.isArray(x.gallery) ? x.gallery.map(C.safeUrl).find(Boolean) : "") || "";
  const card = el("article", { class: "wd-card wd-photo" + (tag.featured ? " is-pick" : "") });
  const more = btn(t("wellSee") + " →", "link-btn wd-more", () => C.openDetail(p.id, more));
  const media = el("button", { type: "button", class: "wd-media" + (img ? "" : " tone-Wellness") + (img && tag.full ? " is-full" : ""), "aria-label": (C.pick(p, "title") || "—") + " · " + t("wellSee") });
  if (img) {
    const i = el("img", { src: img, alt: "", loading: "lazy", referrerpolicy: "no-referrer" });
    i.addEventListener("error", () => {
      // Many sites block other sites from showing their photos: retry once through a free image relay before giving up.
      if (!i.dataset.relay && /^https?:/i.test(img)) { i.dataset.relay = "1"; i.src = "https://wsrv.nl/?url=" + encodeURIComponent(img.replace(/^https?:\/\//i, "")) + "&w=800&output=jpg"; return; }
      i.remove(); media.classList.add("tone-Wellness");
    });
    media.appendChild(i);
  } else media.appendChild(el("span", { class: "wd-ph", "aria-hidden": "true", text: "🌿" }));
  media.appendChild(el("span", { class: "wd-veil", "aria-hidden": "true" }));
  if (WCATS.includes(tag.cat)) media.appendChild(el("span", { class: "ev-badge wd-cat", text: catLabel(tag) }));
  if (tag.featured) media.appendChild(el("span", { class: "pick-badge wd-pick", text: "✦ " + t("wellPick") }));
  media.addEventListener("click", () => C.openDetail(p.id, more));
  const promo = C.richText ? C.richText(x, "promo") : "";
  const where = [p.location, x.city].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(", ");
  const body = el("div", { class: "wd-body" });
  if (promo) body.appendChild(el("span", { class: "wd-promo", text: "✦ " + promo.split("\n")[0].slice(0, 80) }));
  body.appendChild(el("b", { class: "wd-title", text: C.pick(p, "title") || "—" }));
  if (where) body.appendChild(el("small", { class: "meta-line wd-where", text: "📍 " + where }));
  if (p.event_date) body.appendChild(el("small", { class: "meta-line", text: "📅 " + C.fmtDate(p.event_date) + (p.event_time ? " · " + p.event_time : "") }));
  if (C.pick(p, "desc")) body.appendChild(el("p", { class: "wd-desc", text: C.pick(p, "desc") }));
  if (p.price || x.promo_price) body.appendChild(el("p", { class: "wd-price" },
    p.price && x.promo_price ? el("s", { text: p.price }) : null,
    el("b", { text: x.promo_price || p.price }),
    x.offer_until ? el("small", { text: t("wellUntil", C.fmtDate(x.offer_until)) }) : null));
  const acts = el("div", { class: "wd-acts" }, more);
  if (p.location && !p.event_date) acts.appendChild(el("a", { class: "link-btn wd-map", href: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent((C.pick(p, "title") || "") + " " + p.location), target: "_blank", rel: "noopener noreferrer", text: C.t("viewOnMap") + " ↗" }));
  const url = C.safeUrl(p.url);
  if (url) acts.appendChild(el("a", { class: "primary wd-cta", href: url, target: "_blank", rel: "noopener noreferrer", text: t("wellBook") + " ↗" }));
  body.appendChild(acts);
  card.append(media, body);
  return card;
}
function renderWellness() {
  const host = document.getElementById("wellDiscover"), up = document.getElementById("wellUpcoming");
  if (!host || !C) return;
  if (!C.session()) { host.hidden = true; host.replaceChildren(); if (up) { up.hidden = true; up.replaceChildren(); } return; }
  const { plans } = C.homeData();
  const items = plans.filter(p => p.kind === "wellness" || (p.kind === "event" && C.eventCategory && C.eventCategory(p) === "wellness" && (!p.event_date || p.event_date >= C.todayStr())));   // spas / beauty posted as plans land here too
  const cats = WCATS.filter(c => items.some(p => C.planTag(p.id).cat === c));
  if (wcat !== "all" && !cats.includes(wcat)) wcat = "all";
  const nodes = [el("small", { class: "rose", text: t("wdLabel") }), el("h2", { text: t("wdTitle") })];
  if (cats.length > 1) {
    const chip = (key, label) => btn(label, "chip" + (wcat === key ? " selected" : ""), () => { wcat = key; renderWellness(); });
    const row = el("div", { class: "chips wd-chips", role: "group" }, chip("all", t("wdAll")), ...cats.map(c => chip(c, t("wcat_" + c))));
    row.querySelectorAll(".chip").forEach(b => b.setAttribute("aria-pressed", String(b.classList.contains("selected"))));
    nodes.push(row);
  }
  const shown = items.filter(p => wcat === "all" || C.planTag(p.id).cat === wcat)
    .sort((a, b) => (C.planTag(b.id).featured ? 1 : 0) - (C.planTag(a.id).featured ? 1 : 0));
  if (shown.length) nodes.push(el("div", { class: "wd-list" }, ...shown.map(wellCard)),
    btn(t("wdRecommend"), "link-btn wd-recommend", () => C.openModal("idea")));   // always reachable, not only when the list is empty
  else nodes.push(emptyBox("🌿", t("wdEmptyTitle"), t("wdEmptyText"), btn(t("wdRecommend"), "secondary", () => C.openModal("idea"))));
  host.hidden = false;
  host.replaceChildren(...nodes);
  if (up) {
    const evs = plans.filter(p => p.kind === "event" && upcoming(p) && (p.code === "Wellness" || p.code === "Recharge")).sort(C.byDate).slice(0, 4);
    up.hidden = !evs.length;
    up.replaceChildren(...(evs.length ? [el("small", { class: "rose", text: t("wuLabel") }), el("div", { class: "ev-grid" }, ...evs.map(p => C.eventCard(p, true)))] : []));
  }
}

// ---------- Support: family block ----------
function renderFamily() {
  const host = document.getElementById("supFamily");
  if (!host || !C) return;
  // Family plans only (the "Familia" tile above already opens the private family message).
  const evs = C.session() ? C.homeData().plans.filter(p => p.kind === "event" && upcoming(p) && p.code === "Family").sort(C.byDate).slice(0, 3) : [];
  host.hidden = !evs.length;
  if (!evs.length) { host.replaceChildren(); return; }
  const nodes = [el("small", { class: "rose", text: t("famLabel") }), el("h2", { text: t("famPlans") })];
  evs.forEach(p => {
    const r = btn("", "wrow", () => C.openDetail(p.id, r));
    r.replaceChildren(el("span", { class: "wrow-ic", "aria-hidden": "true", text: "👨‍👩‍👧" }),
      el("span", { class: "wrow-txt" }, el("b", { text: C.pick(p, "title") || "—" }), el("small", { text: shortWhen(p) })),
      el("span", { class: "wrow-go", "aria-hidden": "true", text: "›" }));
    nodes.push(r);
  });
  host.replaceChildren(...nodes);
}

// ---------- Rincón Matcha & Arte ----------
// Content = existing plans (admin): corner items are kind 'home' plans tagged {matcha, mtype, featured, city};
// events / weekend ideas / wellness can also be tagged. Meetups = Community posts in a small structured format,
// "Me apunto" = the existing ♥ reaction. Shares = Community posts tagged "🍵 Matcha & Arte".
const MEET_RE = /^🍵📍\s*(.+?)\s·\s(.*?)\s·\s(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2}))?\s*(?:\n([\s\S]*))?$/u;
const MTYPES = ["spot", "place", "recipe", "offer"];
let maCity = "all";
let maQ = "";
function matchaImage() { return settingUrl("matcha_image") || MATCHA_DEFAULT; }
const cityFrom = loc => { const parts = String(loc || "").split(",").map(x => x.trim()).filter(Boolean); return parts.length > 1 ? parts[parts.length - 2 >= 0 && /^[A-Z]{2}$/.test(parts[parts.length - 1]) ? parts.length - 2 : parts.length - 1] : (parts[0] || ""); };
function cityOf(p) { const tg = C.planTag(p.id); return (tg.city || cityFrom(p.location) || "").trim(); }
const inCity = c => maCity === "all" || !c || c.toLowerCase() === maCity.toLowerCase();
function cornerItems() { return C.homeData().plans.filter(p => p.kind === "home" && C.planTag(p.id).matcha); }
function matchaPlans() {
  return C.homeData().plans.filter(p => C.planTag(p.id).matcha && p.kind !== "home" && (p.kind === "event" || p.kind === "weekend" ? upcoming(p) : true)).sort(C.byDate);
}
function matchaPosts() { return (C.homeData().posts || []).filter(p => MATCHA_RE.test(p.body || "")); }
function parseMeetup(post) {
  const m = MEET_RE.exec(String(post.body || ""));
  if (!m) return null;
  return { place: m[1].trim(), city: (m[2] || "").trim(), date: m[3], time: m[4] || "", note: (m[5] || "").trim() };
}
function meetWhen(x) {
  const d = new Date(x.date + "T" + (x.time || "12:00"));
  const day = d.toLocaleDateString(C.loc(), { weekday: "long", day: "numeric", month: "short" });
  return x.time ? day + " · " + d.toLocaleTimeString(C.loc(), { hour: "numeric", minute: "2-digit" }) : day;
}
function meetups() {
  const today = todayStr();
  return (C.homeData().posts || []).map(p => ({ post: p, m: parseMeetup(p) })).filter(x => x.m && x.m.date >= today)
    .sort((a, b) => (a.m.date + a.m.time).localeCompare(b.m.date + b.m.time));
}
// Meetup card (used on the Corner and in the Community feed)
function meetupNode(post) {
  const m = parseMeetup(post);
  if (!m || !C) return null;
  const S = window.CMLSocial;
  const past = m.date < todayStr();
  const btnIn = el("button", { type: "button", class: "resp meet-in" });
  const count = el("small", { class: "meet-count" });
  const paint = () => {
    const info = S ? S.reactionInfo(post.id) : { n: 0, mine: false };
    btnIn.className = "resp meet-in" + (info.mine ? " on" : "");
    btnIn.textContent = info.mine ? C.t("meetInOn") : C.t("meetIn");
    btnIn.setAttribute("aria-pressed", String(info.mine));
    count.textContent = info.n ? C.t("meetCount")(info.n) : "";
  };
  btnIn.addEventListener("click", async () => { if (!S) return; btnIn.disabled = true; await S.toggleReaction(post.id); btnIn.disabled = false; paint(); renderMatchaHome(); if (document.getElementById("matcha")?.classList.contains("active")) renderMatchaPage(); });
  if (past) btnIn.disabled = true;
  paint();
  return el("div", { class: "meet" + (past ? " past" : "") },
    el("small", { class: "meet-k", text: "🍵 " + C.t("meetLabel") + (past ? " · " + t("maPast") : "") }),
    el("b", { class: "meet-place", text: m.place }),
    el("span", { class: "meet-when", text: [m.city, meetWhen(m)].filter(Boolean).join(" · ") }),
    m.note ? el("p", { class: "meet-note", text: m.note }) : null,
    el("div", { class: "meet-acts" }, btnIn, count, post.author_name ? el("small", { class: "meet-by", text: t("maBy", post.author_name) }) : null));
}
function imgNode(src, cls) {
  const i = el("img", { src, alt: "", loading: "lazy", class: cls || "" });
  i.addEventListener("error", () => { if (!i.dataset.fallback && src !== MATCHA_DEFAULT) { i.dataset.fallback = "1"; i.src = MATCHA_DEFAULT; } else i.hidden = true; });
  return i;
}
function renderMatchaHome() {
  const host = document.getElementById("homeMatcha");
  if (!host || !C) return;
  if (!C.session()) { host.hidden = true; host.replaceChildren(); return; }
  const meet = meetups()[0];
  const next = matchaPlans().find(p => p.kind === "event" || p.kind === "weekend");
  const sub = meet ? t("maNextMeet", meet.m.place, meetWhen(meet.m)) : next ? t("maNext", C.pick(next, "title")) + (next.event_date ? " · " + shortWhen(next) : "") : t("maHomeSub");
  const card = el("button", { type: "button", class: "matcha-card", "data-go": "matcha" },
    el("span", { class: "matcha-img" + (settingUrl("matcha_image") ? " is-custom" : "") }, imgNode(matchaImage()), el("span", { class: "ma-foam", "aria-hidden": "true" })),
    el("span", { class: "matcha-txt" },
      el("small", { class: "rose", text: t("maName").toUpperCase() }),
      el("b", { text: t("maTag") }),
      el("span", { class: "matcha-sub", text: sub }),
      el("span", { class: "matcha-go", text: t("maOpen") + " →" })));
  host.hidden = false;
  host.replaceChildren(card);
}
function shareCard(post) {
  const photo = window.CMLSocial ? window.CMLSocial.photoNode(post) : null;
  const text = (post.body || "").replace(MATCHA_RE, "").replace(/^\s*(y|&)\s*(Arte|Art)(\s*(Corner))?\s*·?\s*/i, "").trim();
  const card = el("button", { type: "button", class: "ma-share" + (photo ? " has-photo" : "") },
    photo ? el("span", { class: "ma-share-ph" }, photo) : null,
    el("span", { class: "ma-share-txt" }, text ? el("span", { class: "ma-share-body", text }) : null, el("small", { text: "— " + (post.author_name || "") })));
  card.addEventListener("click", () => C.showPage("community"));
  return card;
}
function itemCard(p, big) {
  const tg = C.planTag(p.id);
  const img = C.safeUrl(p.image_url);
  const city = cityOf(p);
  const url = C.safeUrl(p.url);
  const kicker = big ? t("maWeek") : t("mtype_" + (MTYPES.includes(tg.mtype) ? tg.mtype : "spot"));
  const nodes = [
    el("small", { class: "ma-item-k" + (tg.mtype === "offer" ? " offer" : ""), text: kicker }),
    el("b", { class: "ma-item-t", text: C.pick(p, "title") || "—" }),
    city || p.location ? el("span", { class: "ma-item-city", text: "📍 " + (p.location || city) }) : null,
    C.pick(p, "desc") ? el("p", { class: "ma-item-d", text: C.pick(p, "desc") }) : null
  ];
  const acts = el("div", { class: "ma-item-acts" });
  if (url) acts.appendChild(el("a", { class: "link-btn", href: url, target: "_blank", rel: "noopener noreferrer", text: t(tg.mtype === "recipe" ? "maRecipeOpen" : "maLinkOpen") + " ↗" }));
  if (p.location && tg.mtype !== "recipe") acts.appendChild(el("a", { class: "link-btn", href: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(p.location), target: "_blank", rel: "noopener noreferrer", text: C.t("viewOnMap") + " ↗" }));
  if (tg.mtype !== "recipe") {
    const meet = btn(t("maMeetHere"), "link-btn ma-meet-here", () => openMeetForm(C.pick(p, "title"), city));
    acts.appendChild(meet);
  }
  if (acts.childNodes.length) nodes.push(acts);
  return el("article", { class: "ma-item" + (big ? " big" : "") + (img ? "" : " no-img"), "data-q": [C.pick(p, "title"), p.location, city, C.pick(p, "desc")].join(" ").toLowerCase() },
    img ? el("div", { class: "ma-item-img" }, imgNode(img)) : null,
    el("div", { class: "ma-item-body" }, ...nodes));
}
// "¿Dónde nos vemos?" — propose a meetup: becomes a Community post (members already may post; no new tables)
let meetDraft = null;
function openMeetForm(place, city) {
  meetDraft = { place: place || "", city: city || (maCity !== "all" ? maCity : "") };
  renderMatchaPage();
  requestAnimationFrame(() => { const f = document.getElementById("meetPlace"); if (f) { f.scrollIntoView({ behavior: "smooth", block: "center" }); f.focus({ preventScroll: true }); } });
}
function meetForm() {
  const d = meetDraft || {};
  const inp = (id, type, val, ph, extra) => el("input", Object.assign({ id, type, value: val || "", placeholder: ph || "" }, extra || {}));
  // Light suggestions from places/cities the community already uses; any other text is still accepted.
  const known = C.homeData().plans.filter(p => C.planTag(p.id).matcha || p.kind === "event");
  const citySet = [...new Set([...C.cities().map(c => c.name), ...known.map(cityOf), ...(C.homeData().posts || []).map(parseMeetup).filter(Boolean).map(m => m.city)].filter(Boolean))].slice(0, 30);
  const place = inp("meetPlace", "text", d.place, t("maPlacePh"), { maxlength: 80, autocomplete: "off" });
  // City is a simple picker (no typing, no autocomplete popup: that made the phone keyboard glitch)
  const cityList = [...citySet]; if (d.city && !cityList.some(c => c.toLowerCase() === d.city.toLowerCase())) cityList.push(d.city);
  const cityPick = (d.city && cityList.find(c => c.toLowerCase() === d.city.toLowerCase())) || "Orlando";
  const city = el("select", { id: "meetCity" }, ...cityList.map(c => el("option", { value: c, text: c })));
  city.value = cityPick;
  const date = inp("meetDate", "date", d.date || todayStr(), "", { min: todayStr() });
  const time = inp("meetTime", "time", d.time || "16:30", "");
  const note = inp("meetNote", "text", d.note, t("maNotePh"), { maxlength: 140 });
  const fb = el("p", { class: "form-feedback", role: "alert", hidden: true });
  const send = el("button", { type: "submit", class: "primary", text: t("maMeetSend") });
  const cancel = btn(C.t("closeLabel"), "link-btn", () => { meetDraft = null; renderMatchaPage(); });
  const form = el("form", { class: "meet-form" },
    el("label", {}, el("span", { text: t("maPlace") }), place),
    el("div", { class: "two-col" }, el("label", {}, el("span", { text: t("maCity") }), city), el("label", {}, el("span", { text: t("maDate") }), date)),
    el("div", { class: "two-col" }, el("label", {}, el("span", { text: t("maTime") }), time), el("label", {}, el("span", { text: t("maNote") }), note)),
    fb, el("div", { class: "meet-form-acts" }, send, cancel));
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const P = place.value.trim(), Y = city.value.trim();
    if (!P || !date.value) { fb.textContent = t("maMeetNeed"); fb.hidden = false; return; }
    const body = "🍵📍 " + P.replace(/·/g, "-") + " · " + Y.replace(/·/g, "-") + " · " + date.value + (time.value ? " " + time.value : "") + (note.value.trim() ? "\n" + note.value.trim() : "");
    send.disabled = true;
    const r = await C.db.from("community_posts").insert({ user_id: C.session().user.id, author_name: C.profile() ? C.profile().first_name : "", body, photo_path: "" });
    send.disabled = false;
    if (r.error) { fb.textContent = t("maMeetFail"); fb.hidden = false; return; }
    meetDraft = null;
    if (!inCity(Y)) maCity = "all";   // make sure she sees the meetup she just proposed
    await C.refreshPublic();
    C.announce("maMeetDone");
  });
  return form;
}
function section(kicker, title, ...kids) {
  return el("section", { class: "card ma-section" }, el("small", { class: "rose", text: kicker }), title ? el("h2", { text: title }) : null, ...kids.filter(Boolean));
}
// Search filters the cards already on screen (no re-render, so the phone keyboard is never interrupted)
function applySearch() {
  const q = maQ.trim().toLowerCase(), root = document.getElementById("matchaBody");
  if (!root) return;
  let any = false;
  root.querySelectorAll("#maSpots .pick-row").forEach(c => { const ok = !q || (c.dataset.q || "").includes(q); c.hidden = !ok; if (ok) any = true; });
  const cnt = document.getElementById("maCount"); if (cnt) cnt.textContent = root.querySelectorAll("#maSpots .pick-row:not([hidden])").length + " " + t("maPickCount");
  const none = document.getElementById("maNone"); if (none) none.hidden = !(q && !any);
}
// Compact, expandable row for one place (the long list lives inside the Meetup card, scrollable)
function pickRow(p) {
  const tg = C.planTag(p.id), city = cityOf(p), img = C.safeUrl(p.image_url), url = C.safeUrl(p.url);
  const title = C.pick(p, "title") || "—", desc = C.pick(p, "desc");
  const acts = el("div", { class: "pick-acts" });
  acts.appendChild(btn(t("maMeetHere"), "pick-here", () => openMeetForm(title, city)));
  if (p.location) acts.appendChild(el("a", { class: "link-btn", href: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(p.location), target: "_blank", rel: "noopener noreferrer", text: C.t("viewOnMap") + " ↗" }));
  if (url) acts.appendChild(el("a", { class: "link-btn", href: url, target: "_blank", rel: "noopener noreferrer", text: t("maLinkOpen") + " ↗" }));
  const d = el("details", { class: "pick-row", "data-q": [title, p.location, city, desc].join(" ").toLowerCase() },
    el("summary", {}, el("span", { class: "pick-name", text: title }), el("span", { class: "pick-city", text: city || "" })),
    el("div", { class: "pick-body" }, img ? el("div", { class: "pick-img" }, imgNode(img)) : null, p.location ? el("span", { class: "ma-item-city", text: "📍 " + p.location }) : null, desc ? el("p", { class: "ma-item-d", text: desc }) : null, acts));
  return d;
}
function pickBox(spots) {
  if (!spots.length) return null;
  const inp = el("input", { type: "search", class: "ma-search", placeholder: "🔎 " + t("maSearchPh"), "aria-label": t("maSearchPh"), value: maQ, autocomplete: "off", autocapitalize: "off", maxlength: "60", enterkeyhint: "search" });
  inp.addEventListener("input", () => { maQ = inp.value; applySearch(); });
  inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); inp.blur(); } });
  const list = el("div", { class: "pick-list", id: "maSpots", tabindex: "0", role: "region", "aria-label": t("maPickK") }, ...spots.map(pickRow), el("p", { class: "small-note", id: "maNone", hidden: true, text: t("maNoMatch") }));
  return el("div", { class: "pick-box" },
    el("div", { class: "pick-head" }, el("b", { text: t("maPickK") }), el("span", { id: "maCount", class: "pick-count", text: spots.length + " " + t("maPickCount") })),
    inp, list, el("p", { class: "pick-hint", text: t("maPickHint") }));
}
// Luxe call-to-action: iced matcha latte icon, champagne-gold to blush gradient, soft shimmer
function luxBtn(text, fn) {
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 40 40"); svg.setAttribute("class", "lux-ico"); svg.setAttribute("aria-hidden", "true");
  // iced matcha latte: glass, creamy milk, matcha layer, ice, straw, sparkles
  svg.innerHTML = '<defs><linearGradient id="lxm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9cc78a"/><stop offset="1" stop-color="#5f9a55"/></linearGradient><clipPath id="lxc"><path d="M10 12h20l-2.6 22.5a2 2 0 0 1-2 1.7H14.6a2 2 0 0 1-2-1.7z"/></clipPath></defs>'
    + '<path class="straw" d="M23 3.5l-3.2 14" stroke="#C98A93" stroke-width="2.6" stroke-linecap="round" fill="none"/><path d="M23.4 3.8l-.9 3.8" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".7"/>'
    + '<g clip-path="url(#lxc)"><rect x="8" y="12" width="24" height="26" fill="#FFF8F0"/><rect x="8" y="12" width="24" height="9" fill="url(#lxm)"/><path class="wave" d="M8 21c4 2.6 7-2.4 12 0s8-2.4 12 0V27H8z" fill="url(#lxm)" opacity=".85"/><rect x="8" y="27" width="24" height="11" fill="#FBEAD8" opacity=".9"/><rect class="ice i1" x="13" y="14" width="6.5" height="6.5" rx="1.6" fill="#fff" opacity=".55" transform="rotate(-14 16 17)"/><rect class="ice i2" x="21" y="16" width="6" height="6" rx="1.6" fill="#fff" opacity=".5" transform="rotate(12 24 19)"/></g>'
    + '<path d="M10 12h20l-2.6 22.5a2 2 0 0 1-2 1.7H14.6a2 2 0 0 1-2-1.7z" fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/><path d="M12.6 15l1.6 17" stroke="#fff" stroke-width="1.3" stroke-linecap="round" opacity=".65"/>'
    + '<path class="sp s1" d="M34 8l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1z" fill="#fff"/><path class="sp s2" d="M5.5 22l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" fill="#fff"/>';
  const b = el("button", { type: "button", class: "ma-meet-btn lux" }, svg, el("span", { class: "lux-txt", text }), el("span", { class: "lux-shine", "aria-hidden": "true" }));
  b.addEventListener("click", fn);
  return b;
}
function searchRow(count) {
  if (!count) return null;
  const inp = el("input", { type: "search", class: "ma-search", placeholder: "🔎 " + t("maSearchPh"), "aria-label": t("maSearchPh"), value: maQ, autocomplete: "off", autocapitalize: "off", maxlength: "60", enterkeyhint: "search" });
  inp.addEventListener("input", () => { maQ = inp.value; applySearch(); });
  inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); inp.blur(); } });
  return el("div", { class: "ma-searchrow" }, inp);
}
function renderMatchaPage() {
  const hero = document.getElementById("matchaHero"), body = document.getElementById("matchaBody");
  if (!hero || !body || !C) return;
  const items = C.session() ? cornerItems() : [];
  const meets = C.session() ? meetups() : [];
  const cities = [...new Set([...items.map(cityOf), ...meets.map(x => x.m.city)].filter(Boolean).map(c => c.trim()))];
  if (maCity !== "all" && !cities.some(c => c.toLowerCase() === maCity.toLowerCase())) maCity = "all";
  const cityRow = cities.length > 1 ? el("div", { class: "chips ma-cities", role: "group", "aria-label": t("maCity") },
    ...["all", ...cities].map(c => { const b = btn(c === "all" ? t("maAllCities") : c, "chip" + (maCity === c ? " selected" : ""), () => { maCity = c; renderMatchaPage(); }); b.setAttribute("aria-pressed", String(maCity === c)); return b; })) : null;
  hero.replaceChildren(
    el("div", { class: "ma-hero-img" + (settingUrl("matcha_image") ? " is-custom" : "") }, imgNode(matchaImage()), el("span", { class: "ma-foam", "aria-hidden": "true" })),
    el("div", { class: "ma-hero-txt" },
      el("small", { class: "rose", text: t("maKicker") }),
      el("h1", { text: t("maName") }),
      el("p", { class: "ma-tag", text: t("maTag") }),
      el("p", { class: "ma-intro", text: t("maIntro") }),
      cityRow));
  if (!C.session()) { body.replaceChildren(); return; }
  const shown = items.filter(p => inCity(cityOf(p)));
  const featured = shown.find(p => C.planTag(p.id).featured);
  const spots = shown.filter(p => p !== featured && C.planTag(p.id).mtype !== "recipe");
  const recipes = shown.filter(p => p !== featured && C.planTag(p.id).mtype === "recipe");
  const evs = matchaPlans().filter(p => inCity(cityFrom(p.location)));
  const meetsShown = meets.filter(x => inCity(x.m.city)).slice(0, 6);

  const colA = [], colB = [];
  if (featured) colA.push(el("section", { class: "ma-feature" }, itemCard(featured, true)));
  // ¿Dónde nos vemos?
  const meetBox = section(t("maMeetK"), t("maMeetTitle"),
    el("p", { class: "small-note", text: meets.length ? t("maMeetIntro") : t("maMeetEmpty") }),
    pickBox(spots),
    meetsShown.length ? el("div", { class: "meet-list" }, ...meetsShown.map(x => meetupNode(x.post))) : null,
    meetDraft ? meetForm() : luxBtn(t("maMeetPropose"), () => openMeetForm("", "")),
    window.CMLCommunity ? window.CMLCommunity.safetyNode() : null,
    window.CMLPolls && window.CMLPolls.placedBlock ? window.CMLPolls.placedBlock("matcha", t("maPollK"), t("maPollTitle"), "") : null);
  // upcoming gatherings (tagged events / weekend ideas / wellness)
  const plansBox = section(t("maPlans"), null);
  if (evs.length) {
    const events = evs.filter(p => p.kind === "event");
    const others = evs.filter(p => p.kind !== "event" && p.kind !== "trip");
    if (events.length) plansBox.appendChild(el("div", { class: "ev-grid ma-evs" }, ...events.map(p => C.eventCard(p, true))));
    others.forEach(p => plansBox.appendChild(itemCard(p)));
  } else plansBox.appendChild(el("p", { class: "small-note", text: t("maPlansEmpty") }));
  plansBox.appendChild(btn(t("maPropose"), "link-btn ma-propose", () => C.openModal("idea")));
  colB.push(plansBox);
  if (recipes.length) colB.push(section(t("maRecipesK"), t("maRecipesTitle"), el("div", { class: "ma-items recipes" }, ...recipes.map(p => itemCard(p)))));
  const posts = matchaPosts().slice(0, 8);
  const sharesBox = (section(t("maShares"), t("maCreateTitle"),
    el("p", { class: "small-note", text: posts.length ? t("maSharesIntro") : t("maSharesEmpty") }),
    posts.length ? el("div", { class: "ma-shares" }, ...posts.map(shareCard)) : null,
    btn("🍵 " + t("maShare"), "secondary ma-share-btn", () => { if (window.CMLRedesign) window.CMLRedesign.compose(t("maPrefix")); })));
  const rc = window.CMLFeatured && window.CMLFeatured.recipeNode();   // Recipe of the Month (only when published in Admin)
  if (rc) colA.unshift(rc);
  meetBox.classList.add("ma-meetbox"); sharesBox.classList.add("ma-sharesbox");
  const left = el("div", { class: "ma-col ma-left" }, ...colA), right = el("div", { class: "ma-col ma-right" }, ...colB);
  body.replaceChildren(left, right, meetBox, sharesBox);
  applySearch();
}

function render() {
  if (!C) return;
  renderWellness(); renderFamily(); renderMatchaHome();
  if (document.getElementById("matcha")?.classList.contains("active")) renderMatchaPage();
}

function init() {
  C = window.CML;
  if (!C) return;
  C.addStrings(ES, EN);
  window.CMLDiscover = { render, renderMatchaPage, meetupNode };
  document.addEventListener("cml:render", render);
  document.addEventListener("cml:lang", render);
  document.addEventListener("cml:session", () => { wcat = "all"; render(); });
  document.addEventListener("cml:page", e => {
    const page = e.detail && e.detail.page;
    if (page === "matcha") renderMatchaPage();
    if (page === "support" && window.CMLFaith && C.session()) window.CMLFaith.load();
  });
  render();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
