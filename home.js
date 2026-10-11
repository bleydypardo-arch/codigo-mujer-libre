// Código Mujer Libre — Home that feels alive, built only from data the app already has:
//  • "Tu semana": my plans, polls waiting for my vote, birthdays (with "Felicitar").
//  • Community updates, weekend ideas (plans kind = 'weekend').
//  • "Haz algo nuevo": discovery picks from real events / trips / wellness content.
//  • "Hablemos": a weekly conversation prompt that opens the Community composer.
//  • A small, dismissible profile checklist for new members.
// No new content system and no new tables: everything is computed in the browser.
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
  wkTitle: "¿QUÉ HACEMOS ESTE FIN DE SEMANA?", wkIntro: "Ideas para este fin de semana. Toca ❤️ si te interesa.", wkOther: "MÁS IDEAS",
  weekLabel: "TU SEMANA", weekGoing: "Vas", weekInterested: "Te interesa", weekNoPlans: "Aún no tienes planes confirmados",
  weekNoPlansSub: "Mira lo que viene y elige algo para ti", weekVote: "Tu voto cuenta", weekVoteCloses: d => "Tu voto cuenta · cierra " + d,
  weekBirthdays: "CUMPLEAÑOS",
  discLabel: "HAZ ALGO NUEVO", discTitle: "Algo distinto para esta semana", discNewCode: "PRUEBA ALGO DISTINTO", discForYou: "PARA TI",
  discEvents: "Planes y eventos", discEventsSub: "Mira todo lo que viene", discTravelK: "VIAJES Y EXPERIENCIAS",
  discWellK: "BIENESTAR", discWellTitle: "¿Cómo te sientes hoy?", discWellSub: "Una idea sencilla para cuidarte",
  talkLabel: "HABLEMOS", talkCta: "Compartir mi respuesta",
  ckTitle: "Completa tu perfil", ckSub: "Así las demás te reconocen en eventos y en la comunidad.", ckOf: (a, b) => a + " de " + b,
  ckPhoto: "Foto", ckBirthday: "Cumpleaños", ckInterests: "Intereses", ckHide: "Ocultar"
};
const EN = {
  hupTitle: "LATELY IN THE COMMUNITY",
  hupGoing: (n, title, when) => "🥂 " + n + " women are going to “" + title + "” " + when + ".",
  hupInterested: (n, place) => "✈️ " + n + " women are interested in " + place + ".",
  hupPhotos: n => "📸 " + (n === 1 ? "1 new photo was" : n + " new photos were") + " added to Memories.",
  hupVote: q => "🗳 Voting closes soon: " + q,
  hupPrayer: "🙏 A new prayer request was shared.",
  whToday: "today", whTomorrow: "tomorrow", whOn: d => "on " + d,
  wkTitle: "WHAT SHOULD WE DO THIS WEEKEND?", wkIntro: "Ideas for this weekend. Tap ❤️ if you're interested.", wkOther: "MORE IDEAS",
  weekLabel: "YOUR WEEK", weekGoing: "Going", weekInterested: "Interested", weekNoPlans: "No plans confirmed yet",
  weekNoPlansSub: "See what's coming up and pick something for you", weekVote: "Your vote counts", weekVoteCloses: d => "Your vote counts · closes " + d,
  weekBirthdays: "BIRTHDAYS",
  discLabel: "TRY SOMETHING NEW", discTitle: "Something different this week", discNewCode: "TRY SOMETHING DIFFERENT", discForYou: "FOR YOU",
  discEvents: "Plans & events", discEventsSub: "See everything coming up", discTravelK: "TRAVEL & EXPERIENCES",
  discWellK: "WELLNESS", discWellTitle: "How are you feeling today?", discWellSub: "A simple idea to take care of yourself",
  talkLabel: "LET'S TALK", talkCta: "Share my answer",
  ckTitle: "Complete your profile", ckSub: "So others recognize you at events and in the community.", ckOf: (a, b) => a + " of " + b,
  ckPhoto: "Photo", ckBirthday: "Birthday", ckInterests: "Interests", ckHide: "Hide"
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
      rows.push({ text: t("hupVote", p.question), open: go(p.plan_id ? "events" : "community") }));
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
  if (extra.prayer) rows.push({ text: t("hupPrayer"), open: go("support") });
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

// ---------- shared bits ----------
const shortDate = d => parse(d).toLocaleDateString(C.loc(), { weekday: "short", day: "numeric", month: "short" });
const P = () => window.CMLProfile;
function go2(page) { return () => { if (page === "travel" && window.CMLRedesign) window.CMLRedesign.paintTravel(); C.showPage(page); }; }
function row(cls, icon, title, sub, onClick, extraNode) {
  const b = el("button", { type: "button", class: "wrow " + (cls || "") },
    icon,
    el("span", { class: "wrow-txt" }, el("b", { text: title }), sub ? el("small", { text: sub }) : null),
    el("span", { class: "wrow-go", "aria-hidden": "true", text: "›" }));
  b.addEventListener("click", onClick);
  return extraNode ? el("div", { class: "wrow-wrap" }, b, extraNode) : b;
}
const ic = (text, cls) => el("span", { class: "wrow-ic " + (cls || ""), "aria-hidden": "true", text });
function scrollToNode(node) { if (node) requestAnimationFrame(() => node.scrollIntoView({ behavior: "smooth", block: "center" })); }

// ---------- profile checklist (new members; dismissible; remembered on this device only) ----------
const ckKey = () => "cmlChecklistHidden:" + ((C.session() && C.session().user.id) || "");
function ckHidden() { try { return localStorage.getItem(ckKey()) === "1"; } catch { return false; } }
function renderChecklist() {
  const host = document.getElementById("homeChecklist");
  if (!host) return;
  const me = C.session() ? C.profile() : null;
  const items = me ? [
    ["ckPhoto", !!me.avatar_path], ["ckBirthday", !!me.birth_month], ["ckInterests", (me.interests || []).length > 0]
  ] : [];
  const done = items.filter(i => i[1]).length;
  if (!me || done === items.length || ckHidden()) { host.hidden = true; host.replaceChildren(); return; }
  const openProfile = () => { const b = document.getElementById("profileBtn"); if (b) b.click(); };
  const hide = el("button", { type: "button", class: "ck-hide", "aria-label": t("ckHide"), text: "×" });
  hide.addEventListener("click", () => { try { localStorage.setItem(ckKey(), "1"); } catch { /* session only */ } host.hidden = true; });
  const pills = items.map(([k, ok]) => {
    const b = el("button", { type: "button", class: "ck-pill" + (ok ? " ok" : "") }, (ok ? "✓ " : "+ ") + t(k));
    b.addEventListener("click", openProfile);
    return b;
  });
  host.hidden = false;
  host.replaceChildren(
    el("div", { class: "ck-top" },
      el("span", { class: "ck-txt" }, el("b", { text: t("ckTitle") }), el("small", { text: t("ckSub") })),
      el("span", { class: "ck-count", text: t("ckOf", done, items.length) }), hide),
    el("div", { class: "ck-bar", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": String(items.length), "aria-valuenow": String(done) },
      el("span", { style: "width:" + Math.round(done / items.length * 100) + "%" })),
    el("div", { class: "ck-pills" }, ...pills));
}

// ---------- Tu semana ----------
function weekRange() {
  const a = day0(), b = new Date(a.getTime() + 6 * DAY);
  const f = d => d.toLocaleDateString(C.loc(), { day: "numeric", month: "short" });
  return f(a) + " – " + f(b);
}
function openPoll(p) {
  const { plans } = C.homeData();
  const plan = p.plan_id ? plans.find(x => x.id === p.plan_id) : null;
  if (plan && plan.kind === "trip") { go2("travel")(); if (C.openDetail) C.openDetail(plan.id); return; }
  if (plan && plan.kind === "event" && C.openDetail) { C.openDetail(plan.id); return; }
  C.showPage("community"); scrollToNode(document.getElementById("generalPolls"));
}
function renderWeek() {
  const host = document.getElementById("homeWeek");
  if (!host) return;
  if (!C.session()) { host.hidden = true; host.replaceChildren(); return; }
  const { plans, mine } = C.homeData();
  const today = day0().getTime(), until = today + 14 * DAY;
  const myPlans = plans.filter(p => p.kind === "event" && p.event_date && mine.has(p.id) &&
      parse(p.event_date).getTime() >= today && parse(p.event_date).getTime() <= until)
    .sort((a, b) => (a.event_date < b.event_date ? -1 : 1)).slice(0, 3);
  const rows = myPlans.map(p => {
    const going = mine.get(p.id) === "going";
    const r = row("", ic(going ? "✓" : "♥", going ? "on" : ""), C.pick(p, "title") || "—",
      (going ? t("weekGoing") : t("weekInterested")) + " · " + shortDate(p.event_date) + (p.event_time ? " · " + p.event_time : ""),
      () => C.openDetail(p.id, r));
    return r;
  });
  if (!myPlans.length) rows.push(row("soft", ic("📅"), t("weekNoPlans"), t("weekNoPlansSub"), go2("events")));
  const pending = window.CMLPolls && window.CMLPolls.pending ? window.CMLPolls.pending().slice(0, 2) : [];
  pending.forEach(p => rows.push(row("", ic("🗳"), p.question,
    p.closes_at ? t("weekVoteCloses", new Date(p.closes_at).toLocaleDateString(C.loc(), { month: "short", day: "numeric" })) : t("weekVote"),
    () => openPoll(p))));

  const bdays = P() && P().birthdays ? P().birthdays() : [];
  const bdBox = el("div", { id: "homeBirthdays", class: "week-bd" });
  bdBox.hidden = !bdays.length;
  if (bdays.length) {
    bdBox.appendChild(el("small", { class: "week-sub", text: t("weekBirthdays") }));
    bdays.forEach(x => {
      const acts = el("span", { class: "bd-acts" });
      if (!x.mine && window.CMLRedesign) {
        const b = el("button", { type: "button", class: "resp bd-hug", text: "🎉 " + C.t("bdCongrats") });
        b.addEventListener("click", () => window.CMLRedesign.compose(t("bdDraft", x.first_name)));
        acts.appendChild(b);
      }
      if (x.celebrate) {
        const c = el("button", { type: "button", class: "link-btn", text: C.t("bdCelebrate") });
        c.addEventListener("click", x.celebrate);
        acts.appendChild(c);
      }
      bdBox.appendChild(el("div", { class: "bd-row" }, P().avatarNode(x.avatar_path, x.first_name, "avatar-sm"),
        el("span", { class: "bd-text", text: x.text }), acts));
    });
  }
  host.hidden = false;
  host.replaceChildren(
    el("div", { class: "week-head" }, el("small", { class: "rose", text: t("weekLabel") }), el("span", { class: "week-range", text: weekRange() })),
    el("div", { class: "week-rows" }, ...rows), bdBox);
}

// ---------- Haz algo nuevo (discovery from real content) ----------
function thumb(src, code, whole) {
  const box = el("span", { class: "disc-th" + (whole && src ? " is-whole" : "") + (src ? "" : " tone-" + (C.codeLabels[code] ? code : "none")), "aria-hidden": "true" });
  if (src) {
    const img = el("img", { src, alt: "", loading: "lazy" });
    if (whole) box.style.setProperty("--th-bg", 'url("' + String(src).replace(/["\\()\s]/g, encodeURIComponent) + '")');
    img.addEventListener("error", () => { img.remove(); box.classList.add("tone-none"); box.textContent = emojiOf(code); });
    box.appendChild(img);
  } else box.textContent = emojiOf(code);
  return box;
}
function disc(th, kicker, title, sub, onClick) {
  const b = el("button", { type: "button", class: "disc-row" }, th,
    el("span", { class: "disc-txt" }, el("small", { text: kicker }), el("b", { text: title }), sub ? el("span", { text: sub }) : null),
    el("span", { class: "wrow-go", "aria-hidden": "true", text: "›" }));
  b.addEventListener("click", onClick);
  return b;
}
function renderDiscover() {
  const host = document.getElementById("homeDiscover");
  if (!host) return;
  if (!C.session()) { host.hidden = true; host.replaceChildren(); return; }
  const { plans, mine } = C.homeData();
  const today = day0().getTime();
  const tried = new Set(plans.filter(p => mine.has(p.id) && p.code).map(p => p.code));
  const rows = [];
  const ev = C.discoverPick();
  if (ev) {
    const evTag = C.planTag(ev.id), homeImg = C.safeUrl(evTag.homeImg || "");
    rows.push(disc(thumb(homeImg || C.safeUrl(ev.image_url), ev.code, !!homeImg || !!evTag.full), ev.code && !tried.has(ev.code) ? t("discNewCode") : t("discForYou"),
      C.pick(ev, "title") || "—", ev.event_date ? shortDate(ev.event_date) + (ev.location ? " · " + ev.location : "") : (ev.location || ""),
      () => C.openDetail(ev.id)));
  } else rows.push(disc(thumb("", "Social"), t("discForYou"), t("discEvents"), t("discEventsSub"), go2("events")));
  const trip = plans.find(p => p.kind === "trip");
  const travelImg = window.CMLRedesign ? window.CMLRedesign.travelImage() : "";
  rows.push(disc(thumb(travelImg, "Adventure"), t("discTravelK"),
    trip ? (C.pick(trip, "title") || C.t("travelTitle")) : C.t("travelTitle"),
    trip ? [trip.location, trip.date_text].filter(Boolean).join(" · ") : C.t("travelTeaser"), go2("travel")));
  const well = plans.find(p => p.kind === "wellness");
  rows.push(disc(thumb(well ? C.safeUrl(well.image_url) : "", "Wellness"), t("discWellK"),
    well ? (C.pick(well, "title") || t("discWellTitle")) : t("discWellTitle"), well ? (C.pick(well, "desc") || t("discWellSub")) : t("discWellSub"), go2("wellness")));
  host.hidden = false;
  host.replaceChildren(el("small", { class: "rose", text: t("discLabel") }), el("h2", { text: t("discTitle") }), el("div", { class: "disc-list" }, ...rows));
}

// ---------- Hablemos: a weekly conversation prompt → Community composer ----------
const TALK = [
  { es: ["Volver a hacer amigas de adulta", "¿Qué te ha ayudado a hacer nuevas amigas de adulta?"], en: ["Making friends again as an adult", "What has helped you make new friends as an adult?"] },
  { es: ["Un ritual para recargar", "¿Qué pequeño ritual te ayuda a recargar energía durante la semana?"], en: ["A ritual to recharge", "What small ritual helps you recharge during the week?"] },
  { es: ["Un lugar para recomendar", "¿Qué lugar cerca de ti recomendarías para un café sin prisa?"], en: ["A place to recommend", "What place near you would you recommend for an unhurried coffee?"] },
  { es: ["Gratitud", "¿Por qué estás agradecida esta semana?"], en: ["Gratitude", "What are you grateful for this week?"] },
  { es: ["Algo que aprendiste", "¿Qué aprendiste este año que te gustaría compartir con otras mujeres?"], en: ["Something you learned", "What did you learn this year that you'd like to share with other women?"] }
];
// The weekly question: the admin's "Let's Talk" entry (settings.talk_prompt) when published, otherwise the built-in rotation above.
function talkItem() {
  const lang = C.lang(), other = lang === "es" ? "en" : "es";
  const s = C.setting && C.setting("talk_prompt");
  if (s && typeof s === "object" && s.published) {
    const q = String(s["body_" + lang] || s["body_" + other] || "").trim();
    if (q) return [String(s["title_" + lang] || s["title_" + other] || "").trim(), q];
  }
  const week = Math.floor((day0().getTime() - new Date(2026, 0, 5).getTime()) / (7 * DAY));
  return TALK[((week % TALK.length) + TALK.length) % TALK.length][lang] || TALK[0].es;
}
let talkFlipped = false;
function renderTalk() {
  const host = document.getElementById("homeTalk");
  if (!host) return;
  if (!C.session()) { host.hidden = true; host.replaceChildren(); return; }
  const item = talkItem();
  const cta = el("button", { type: "button", class: "secondary talk-cta", text: "💬 " + t("talkCta") });
  cta.addEventListener("click", () => { if (window.CMLRedesign) window.CMLRedesign.compose(t("talkLabel").charAt(0) + t("talkLabel").slice(1).toLowerCase() + " · " + item[1] + "\n"); });
  const F = window.CMLFlip;
  host.hidden = false;
  host.classList.add("fc-host");
  const back = [el("small", { class: "fc-k rose", text: t("talkLabel") }), item[0] ? el("b", { class: "fc-title", text: item[0] }) : null, el("p", { class: "fc-q", text: item[1] }), cta];
  if (!F) { host.replaceChildren(...back); return; }
  const art = el("span", { class: "fc-art", "aria-hidden": "true" }); art.innerHTML = F.envelopeSVG();
  host.replaceChildren(F.build({ cls: "fc-talk", label: t("talkLabel"), front: [art, el("span", { class: "fc-title", text: C.t("fcTalkFront") }), el("span", { class: "fc-hint", text: C.t("fcTalkHint") })],
    back, flipped: talkFlipped, backLabel: C.t("fcBack"), onToggle: on => { talkFlipped = on; } }));
}

function render(fromFetch) {
  if (!C || !C.homeData) return;
  renderChecklist(); renderWeek(); renderUpdates(); renderWeekend(); renderDiscover(); renderTalk();
  if (!fromFetch && C.session() && Date.now() - extra.at > 60000) fetchExtra();
}

function init() {
  C = window.CML;
  if (!C) return;
  C.addStrings(ES, EN);
  document.addEventListener("cml:session", e => {
    extra = { at: 0, photos: 0, prayer: false };
    if (!C.session() || (e.detail && e.detail.pending)) { render(true); return; }
    render();
  });
  document.addEventListener("cml:lang", () => render(true));
  const home = document.querySelector("nav button[data-page=home]");
  if (home) home.addEventListener("click", () => render());
  window.CMLHome = { render };
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
