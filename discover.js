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
  wdOffer: "Ver oferta o reservar", wdEmptyTitle: "Pronto compartiremos experiencias de bienestar",
  wdEmptyText: "Spas, masajes, yoga, retiros y lugares para cuidarte. ¿Conoces uno especial? Recomiéndalo.",
  wdRecommend: "Recomendar un lugar",
  wuLabel: "PRÓXIMOS PLANES DE BIENESTAR",
  wcat_spa: "Spa y masajes", wcat_beauty: "Belleza y cuidado", wcat_movement: "Yoga y movimiento", wcat_mind: "Meditación y fe",
  wcat_retreat: "Retiros", wcat_food: "Alimentación sana", wcat_workshop: "Talleres",
  supLabel: "APOYO", supTitle: "Aquí estamos para ti", supIntro: "Habla en privado, pide oración o comparte una necesidad. No estás sola.",
  supLinkTitle: "¿Necesitas apoyo?", supLinkSub: "Habla en privado, pide oración o encuentra ayuda inmediata.",
  supStripTitle: "Apoyo y oración", supStripSub: "Habla en privado, pide oración o apoyo para tu familia",
  supMyMessages: "Ver mis mensajes privados →",
  famLabel: "FAMILIA", famTitle: "Planes y apoyo en familia",
  famText: "Comparte una necesidad familiar o propón planes para disfrutar en familia. La administradora lo recibe en privado.",
  famWrite: "Escribir sobre mi familia", famPlans: "Próximos planes en familia",
  maName: "Matcha y Arte", maTag: "Saborea. Crea. Conecta.", maKicker: "COLECCIÓN",
  maIntro: "Cafés de matcha, cerámica, pintura, música y pequeños encuentros creativos para disfrutar sin prisa y en buena compañía.",
  maHomeSub: "Cafés, talleres y tardes creativas con la comunidad", maNext: t => "Próximo: " + t,
  maPlans: "PRÓXIMOS ENCUENTROS", maPlansEmpty: "Pronto: catas de matcha, talleres de cerámica y tardes de pintura.",
  maPropose: "Proponer una idea", maShares: "DE LA COMUNIDAD", maSharesIntro: "Tu café favorito, algo que creaste, un taller que te encantó.",
  maShare: "Compartir algo creativo", maSharesEmpty: "Sé la primera en compartir tu café favorito o algo que creaste.",
  maPrefix: "🍵 Matcha y Arte · ", maOpen: "Ver colección"
};
const EN = {
  wdLabel: "DISCOVER WELLNESS", wdTitle: "Experiences to take care of yourself", wdAll: "All",
  wdOffer: "See offer or book", wdEmptyTitle: "Wellness experiences are coming soon",
  wdEmptyText: "Spas, massages, yoga, retreats and places to take care of yourself. Know a special one? Recommend it.",
  wdRecommend: "Recommend a place",
  wuLabel: "UPCOMING WELLNESS PLANS",
  wcat_spa: "Spa & massage", wcat_beauty: "Beauty & self-care", wcat_movement: "Yoga & movement", wcat_mind: "Meditation & faith",
  wcat_retreat: "Retreats", wcat_food: "Healthy food", wcat_workshop: "Workshops",
  supLabel: "SUPPORT", supTitle: "We're here for you", supIntro: "Talk privately, ask for prayer or share a need. You're not alone.",
  supLinkTitle: "Need support?", supLinkSub: "Talk privately, ask for prayer or find immediate help.",
  supStripTitle: "Support & prayer", supStripSub: "Talk privately, ask for prayer or support for your family",
  supMyMessages: "See my private messages →",
  famLabel: "FAMILY", famTitle: "Family plans & support",
  famText: "Share a family need or suggest plans to enjoy with your family. The administrator receives it privately.",
  famWrite: "Write about my family", famPlans: "Upcoming family plans",
  maName: "Matcha & Art", maTag: "Sip. Create. Connect.", maKicker: "COLLECTION",
  maIntro: "Matcha cafés, pottery, painting, music and small creative gatherings to enjoy slowly and in good company.",
  maHomeSub: "Cafés, workshops and creative afternoons with the community", maNext: t => "Next: " + t,
  maPlans: "UPCOMING GATHERINGS", maPlansEmpty: "Coming soon: matcha tastings, pottery workshops and painting afternoons.",
  maPropose: "Suggest an idea", maShares: "FROM THE COMMUNITY", maSharesIntro: "Your favorite café, something you made, a workshop you loved.",
  maShare: "Share something creative", maSharesEmpty: "Be the first to share your favorite café or something you made.",
  maPrefix: "🍵 Matcha & Art · ", maOpen: "See collection"
};
const t = (key, ...args) => { const v = C ? C.t(key) : ""; return typeof v === "function" ? v(...args) : (v || key); };
const el = (...a) => C.el(...a);
const WCATS = ["spa", "beauty", "movement", "mind", "retreat", "food", "workshop"];
const MATCHA_DEFAULT = "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=80";
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
  const tag = C.planTag(p.id);
  const img = C.safeUrl(p.image_url);
  const media = el("div", { class: "wd-media" + (img ? "" : " tone-Wellness") });
  if (img) {
    const i = el("img", { src: img, alt: "", loading: "lazy" });
    i.addEventListener("error", () => { i.remove(); media.classList.add("tone-Wellness"); });
    media.appendChild(i);
  } else media.appendChild(el("span", { class: "wd-ph", "aria-hidden": "true", text: "🌿" }));
  if (WCATS.includes(tag.cat)) media.appendChild(el("span", { class: "ev-badge", text: t("wcat_" + tag.cat) }));
  const meta = [p.location, p.price].filter(Boolean).join(" · ");
  const body = el("div", { class: "wd-body" },
    el("b", { class: "wd-title", text: C.pick(p, "title") || "—" }),
    meta ? el("small", { class: "meta-line", text: "📍 " + meta }) : null,
    C.pick(p, "desc") ? el("p", { class: "wd-desc", text: C.pick(p, "desc") }) : null);
  const url = C.safeUrl(p.url);
  if (url) body.appendChild(el("a", { class: "link-btn wd-cta", href: url, target: "_blank", rel: "noopener noreferrer", text: t("wdOffer") + " ↗" }));
  if (p.details) body.appendChild(el("details", { class: "more" }, el("summary", { text: C.t("moreDetails") }), el("p", { class: "saved-text", text: p.details })));
  return el("article", { class: "wd-card" }, media, body);
}
function renderWellness() {
  const host = document.getElementById("wellDiscover"), up = document.getElementById("wellUpcoming");
  if (!host || !C) return;
  if (!C.session()) { host.hidden = true; host.replaceChildren(); if (up) { up.hidden = true; up.replaceChildren(); } return; }
  const { plans } = C.homeData();
  const items = plans.filter(p => p.kind === "wellness");
  const cats = WCATS.filter(c => items.some(p => C.planTag(p.id).cat === c));
  if (wcat !== "all" && !cats.includes(wcat)) wcat = "all";
  const nodes = [el("small", { class: "rose", text: t("wdLabel") }), el("h2", { text: t("wdTitle") })];
  if (cats.length > 1) {
    const chip = (key, label) => btn(label, "chip" + (wcat === key ? " selected" : ""), () => { wcat = key; renderWellness(); });
    const row = el("div", { class: "chips wd-chips", role: "group" }, chip("all", t("wdAll")), ...cats.map(c => chip(c, t("wcat_" + c))));
    row.querySelectorAll(".chip").forEach(b => b.setAttribute("aria-pressed", String(b.classList.contains("selected"))));
    nodes.push(row);
  }
  const shown = items.filter(p => wcat === "all" || C.planTag(p.id).cat === wcat);
  if (shown.length) nodes.push(el("div", { class: "wd-list" }, ...shown.map(wellCard)));
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

// ---------- Matcha y Arte ----------
function matchaImage() { return settingUrl("matcha_image") || MATCHA_DEFAULT; }
function matchaPlans() {
  const { plans } = C.homeData();
  return plans.filter(p => C.planTag(p.id).matcha && (p.kind === "event" || p.kind === "weekend" ? upcoming(p) : true))
    .sort(C.byDate);
}
function matchaPosts() { return (C.homeData().posts || []).filter(p => MATCHA_RE.test(p.body || "")); }
function imgNode(src, cls) {
  const i = el("img", { src, alt: "", loading: "lazy", class: cls || "" });
  i.addEventListener("error", () => { if (!i.dataset.fallback && src !== MATCHA_DEFAULT) { i.dataset.fallback = "1"; i.src = MATCHA_DEFAULT; } else i.hidden = true; });
  return i;
}
function renderMatchaHome() {
  const host = document.getElementById("homeMatcha");
  if (!host || !C) return;
  if (!C.session()) { host.hidden = true; host.replaceChildren(); return; }
  const next = matchaPlans().find(p => p.kind === "event" || p.kind === "weekend");
  const card = el("button", { type: "button", class: "matcha-card", "data-go": "matcha" },
    el("span", { class: "matcha-img" }, imgNode(matchaImage())),
    el("span", { class: "matcha-txt" },
      el("small", { class: "rose", text: t("maName").toUpperCase() }),
      el("b", { text: t("maTag") }),
      el("span", { class: "matcha-sub", text: next ? t("maNext", C.pick(next, "title")) + (next.event_date ? " · " + shortWhen(next) : "") : t("maHomeSub") }),
      el("span", { class: "matcha-go", text: t("maOpen") + " →" })));
  host.hidden = false;
  host.replaceChildren(card);
}
function shareCard(post) {
  const photo = window.CMLSocial ? window.CMLSocial.photoNode(post) : null;
  const text = (post.body || "").replace(MATCHA_RE, "").replace(/^\s*(y|&)\s*(Arte|Art)\s*·?\s*/i, "").trim();
  const card = el("button", { type: "button", class: "ma-share" + (photo ? " has-photo" : "") },
    photo ? el("span", { class: "ma-share-ph" }, photo) : null,
    el("span", { class: "ma-share-txt" }, text ? el("span", { class: "ma-share-body", text }) : null, el("small", { text: "— " + (post.author_name || "") })));
  card.addEventListener("click", () => C.showPage("community"));
  return card;
}
function renderMatchaPage() {
  const hero = document.getElementById("matchaHero"), body = document.getElementById("matchaBody");
  if (!hero || !body || !C) return;
  hero.replaceChildren(
    el("div", { class: "ma-hero-img" }, imgNode(matchaImage())),
    el("div", { class: "ma-hero-txt" },
      el("small", { class: "rose", text: t("maKicker") }),
      el("h1", { text: t("maName") }),
      el("p", { class: "ma-tag", text: t("maTag") }),
      el("p", { class: "ma-intro", text: t("maIntro") })));
  if (!C.session()) { body.replaceChildren(); return; }
  const items = matchaPlans();
  const plansBox = el("div", { class: "card ma-section" }, el("small", { class: "rose", text: t("maPlans") }));
  if (items.length) {
    const evs = items.filter(p => p.kind === "event");
    const others = items.filter(p => p.kind !== "event" && p.kind !== "trip");
    if (evs.length) plansBox.appendChild(el("div", { class: "ev-grid ma-evs" }, ...evs.map(p => C.eventCard(p, true))));
    others.forEach(p => {
      const url = C.safeUrl(p.url);
      plansBox.appendChild(el("div", { class: "ma-idea" },
        el("b", { text: C.pick(p, "title") || "—" }),
        p.location || p.event_date ? el("small", { class: "meta-line", text: [p.event_date ? shortWhen(p) : "", p.location].filter(Boolean).join(" · ") }) : null,
        C.pick(p, "desc") ? el("p", { text: C.pick(p, "desc") }) : null,
        url ? el("a", { class: "link-btn", href: url, target: "_blank", rel: "noopener noreferrer", text: C.t("moreInfo") + " ↗" }) : null));
    });
    plansBox.appendChild(btn(t("maPropose"), "link-btn ma-propose", () => C.openModal("idea")));
  } else {
    plansBox.appendChild(el("p", { class: "small-note", text: t("maPlansEmpty") }));
    plansBox.appendChild(btn(t("maPropose"), "secondary", () => C.openModal("idea")));
  }
  const posts = matchaPosts().slice(0, 8);
  const share = btn("🍵 " + t("maShare"), "primary ma-share-btn", () => { if (window.CMLRedesign) window.CMLRedesign.compose(t("maPrefix")); });
  const sharesBox = el("div", { class: "card ma-section" },
    el("small", { class: "rose", text: t("maShares") }),
    el("p", { class: "small-note", text: posts.length ? t("maSharesIntro") : t("maSharesEmpty") }),
    posts.length ? el("div", { class: "ma-shares" }, ...posts.map(shareCard)) : null,
    share);
  body.replaceChildren(plansBox, sharesBox);
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
  window.CMLDiscover = { render, renderMatchaPage };
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
