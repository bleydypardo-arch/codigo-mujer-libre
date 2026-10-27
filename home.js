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
  weekLabel: "Tu semana", weekGoing: "Vas", weekInterested: "Te interesa", weekNoPlans: "Aún no tienes planes confirmados",
  weekNoPlansSub: "Mira lo que viene y elige algo para ti", weekVote: "Tu voto cuenta", weekVoteCloses: d => "Tu voto cuenta · cierra " + d,
  weekBirthdays: "CUMPLEAÑOS",
  swipeHint: "Desliza para ver más", swipeNext: "Siguiente", swipePrev: "Anterior", discAll: "Ver todo", discLabel: "Nuestra Recomendación", discTitle: "Un lugar especial cada semana para disfrutar", discNewCode: "PRUEBA ALGO DISTINTO", discForYou: "PARA TI",
  discEvents: "Planes y eventos", discEventsSub: "Mira todo lo que viene", discTravelK: "VIAJES Y EXPERIENCIAS",
  discWellK: "BIENESTAR", discHappyK: "HAPPY HOUR DE LA SEMANA", discHappyT: "Happy hours", discHappySub: "Pronto: uno distinto cada semana", discDineK: "RESTAURANTE DE LA SEMANA", discDineT: "Restaurantes", discDineSub: "Pronto: uno distinto cada semana", discWellTitle: "¿Cómo te sientes hoy?", discWellSub: "Una idea sencilla para cuidarte",
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
  weekLabel: "Your week", weekGoing: "Going", weekInterested: "Interested", weekNoPlans: "No plans confirmed yet",
  weekNoPlansSub: "See what's coming up and pick something for you", weekVote: "Your vote counts", weekVoteCloses: d => "Your vote counts · closes " + d,
  weekBirthdays: "BIRTHDAYS",
  swipeHint: "Swipe to see more", swipeNext: "Next", swipePrev: "Previous", discAll: "View all", discLabel: "Our Recommendation", discTitle: "A special place every week to enjoy", discNewCode: "TRY SOMETHING DIFFERENT", discForYou: "FOR YOU",
  discEvents: "Plans & events", discEventsSub: "See everything coming up", discTravelK: "TRAVEL & EXPERIENCES",
  discWellK: "WELLNESS", discHappyK: "HAPPY HOUR OF THE WEEK", discHappyT: "Happy hours", discHappySub: "Soon: a different one every week", discDineK: "RESTAURANT OF THE WEEK", discDineT: "Restaurants", discDineSub: "Soon: a different one every week", discWellTitle: "How are you feeling today?", discWellSub: "A simple idea to take care of yourself",
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
  // nothing to show (no plans, no pending votes, no birthdays): hide the card instead of an empty-looking box
  if (!myPlans.length && !pending.length && !bdays.length) { host.hidden = true; host.replaceChildren(); return; }
  host.hidden = false;
  host.replaceChildren(
    el("div", { class: "week-head" }, el("small", { class: "rose", text: t("weekLabel") }), el("span", { class: "week-range", text: weekRange() })),
    el("div", { class: "week-rows" }, ...rows), bdBox);
}

// ---------- Haz algo nuevo (discovery from real content) ----------
function thumb(src, code, whole, fb) {
  const box = el("span", { class: "disc-th" + (whole && src ? " is-whole" : "") + (src ? "" : " tone-" + (C.codeLabels[code] ? code : "none")), "aria-hidden": "true" });
  if (src) {
    const img = el("img", { src, alt: "", loading: "lazy", referrerpolicy: "no-referrer" });
    if (whole) box.style.setProperty("--th-bg", 'url("' + String(src).replace(/["\\()\s]/g, encodeURIComponent) + '")');
    img.addEventListener("error", () => {
      // Restaurant sites often block other sites from showing their photos: retry once through a free image relay.
      if (!img.dataset.relay && /^https?:/i.test(src) && !(fb && img.getAttribute("src") === fb)) { img.dataset.relay = "1"; const rl = "https://wsrv.nl/?url=" + encodeURIComponent(String(src).replace(/^https?:\/\//i, "")) + "&w=800&output=jpg"; if (whole) box.style.setProperty("--th-bg", 'url("' + rl + '")'); img.src = rl; return; }
      if (fb && img.getAttribute("src") !== fb) { box.classList.remove("is-whole"); box.style.removeProperty("--th-bg"); img.src = fb; return; } img.remove(); box.classList.add("tone-none"); box.textContent = emojiOf(code); });
    box.appendChild(img);
  } else box.textContent = emojiOf(code);
  return box;
}
function disc(th, kicker, title, sub, onClick, plan) {
  const b = el("button", { type: "button", class: "disc-row" }, th,
    el("span", { class: "disc-txt" }, el("small", { text: kicker }), el("b", { text: title }), sub ? el("span", { text: sub }) : null),
    el("span", { class: "wrow-go", "aria-hidden": "true", text: "›" }));
  b.addEventListener("click", onClick);
  if (!plan || !C.respondButton) return b;
  // same "Me interesa / Voy" buttons as Eventos Especiales
  return el("div", { class: "disc-card" }, b, el("div", { class: "resp-row" }, C.respondButton(plan, "interested", "data-resp-home"), C.respondButton(plan, "going", "data-resp-home")));
}
function renderDiscover() {
  const host = document.getElementById("homeDiscover");
  if (!host) return;
  if (!C.session()) { host.hidden = true; host.replaceChildren(); return; }
  const { plans, mine } = C.homeData();
  const today = day0().getTime();
  const tried = new Set(plans.filter(p => mine.has(p.id) && p.code).map(p => p.code));
  const rows = [];
  // Twice a day (morning and afternoon) a different happy hour, restaurant and wellness idea (rotating through what the admin has already loaded; same rule in every city)
  const wk = Math.floor((day0().getTime() - new Date(2026, 0, 5).getTime()) / DAY) * 2 + (new Date().getHours() >= 12 ? 1 : 0);
  const weekly = list => { const L = list.slice().sort((x, y) => String(x.id).localeCompare(String(y.id))); return L.length ? L[((wk % L.length) + L.length) % L.length] : null; };
  const live = plans.filter(p => (p.kind === "event" || p.kind === "wellness" || (C.sideTrip && C.sideTrip(p))) && (!p.event_date || p.event_date >= C.todayStr()));
  const slots = [
    { p: weekly(live.filter(p => C.eventCategory(p) === "social")), k: t("discHappyK"), code: "Social", fb: [t("discHappyT"), t("discHappySub"), "events"] },
    { p: weekly(live.filter(p => C.eventCategory(p) === "dining")), k: t("discDineK"), code: "Social", fb: [t("discDineT"), t("discDineSub"), "events"] },
    { p: weekly(live.filter(p => C.eventCategory(p) === "wellness")), k: t("discWellK"), code: "Wellness", fb: [t("discWellTitle"), t("discWellSub"), "events"] }
  ];
  slots.forEach(s => {
    if (s.p) {
      const tag = C.planTag(s.p.id), hi = C.safeUrl(tag.homeImg || "");
      rows.push(disc(thumb(hi || C.safeUrl(s.p.image_url), s.code, true), s.k, C.pick(s.p, "title") || "—",
        [s.p.event_date ? shortDate(s.p.event_date) : "", s.p.location].filter(Boolean).join(" · ") || C.pick(s.p, "desc") || "", () => C.openDetail(s.p.id), s.p));
    } else rows.push(disc(thumb("", s.code), s.k, s.fb[0], s.fb[1], go2(s.fb[2])));
  });
  host.hidden = false;
  const all = el("button", { type: "button", class: "see-all", text: t("discAll") + " →" });
  all.addEventListener("click", () => { if (C.showEventsCode) C.showEventsCode(""); else C.showPage("events"); });   // Descubre: the complete list of happy hours, restaurants and wellness
  host.replaceChildren(window.cmlSecHead("star", "gold", t("discLabel"), t("discTitle"), all), el("div", { class: "disc-list" }, ...rows), window.cmlSwipeHint ? window.cmlSwipeHint(".disc-list") : null);
}

// Soft rain of hearts only inside the Let's Talk card when the envelope opens (decorative, skipped for reduced motion)
function fallingHearts() {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const back = document.querySelector(".fc-talk .fc-back"); if (!back) return;
  const old = back.querySelector(".hearts-rain"); if (old) old.remove();
  const box = document.createElement("div"); box.className = "hearts-rain"; box.setAttribute("aria-hidden", "true");
  const H = (back.offsetHeight || 260) + 40;
  const cols = ["#B85F68", "#E58F9F", "#F2B5C0", "#DBC19F", "#D98694"];
  for (let i = 0; i < 18; i++) {
    const h = document.createElement("span"); h.className = "heart-fall"; h.textContent = "♥";
    const dur = 3.2 + Math.random() * 2.4;
    h.style.cssText = "left:" + (4 + Math.random() * 92).toFixed(1) + "%;font-size:" + (11 + Math.random() * 14).toFixed(0) + "px;color:" + cols[i % cols.length] + ";animation-duration:" + dur.toFixed(2) + "s;animation-delay:" + (Math.random() * 1.8).toFixed(2) + "s;--dy:" + H + "px;--dx:" + ((Math.random() - .5) * 50).toFixed(0) + "px;--rot:" + ((Math.random() - .5) * 50).toFixed(0) + "deg";
    box.appendChild(h);
  }
  back.insertBefore(box, back.firstChild);
  setTimeout(() => box.remove(), 6200);
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
// 70 approved Hablemos phrases (Jazz, Oct 2026). Used when no list has been pasted in Admin.
const TALK70 = [{"es":["Amor propio","¿Qué significa para ti amarte de verdad?"],"en":["Self-love","What does truly loving yourself mean to you?"]},{"es":["Lo que mereces en el amor","¿Qué cosa ya no estás dispuesta a aceptar en el amor?"],"en":["What you deserve in love","What are you no longer willing to accept in love?"]},{"es":["Una historia de amor","¿Qué te enseñó tu amor más importante, haya terminado o no?"],"en":["A love story","What did your most important love teach you, whether or not it ended?"]},{"es":["Amar sin perderte","¿Cómo se ama a alguien sin perder quién eres?"],"en":["Love without losing yourself","How do you love someone without losing who you are?"]},{"es":["Corazón roto","¿Qué te ayudó a sanar cuando te rompieron el corazón?"],"en":["A broken heart","What helped you heal when your heart was broken?"]},{"es":["Volver a confiar","¿Qué es lo que más te cuesta para volver a confiar?"],"en":["Trusting again","What is hardest for you when it comes to trusting again?"]},{"es":["Estar sola y estar bien","¿Qué descubriste de ti cuando estuviste sola?"],"en":["Being alone and being well","What did you discover about yourself when you were on your own?"]},{"es":["Lo que buscas en pareja","¿Qué es lo más importante para ti en una relación?"],"en":["What you look for","What matters most to you in a relationship?"]},{"es":["Tu intuición","¿Qué señal de tu intuición te gustaría haber escuchado antes?"],"en":["Your intuition","What sign from your intuition do you wish you had listened to sooner?"]},{"es":["Un gesto de cariño","¿Qué gesto de amor te ha tocado más el corazón?"],"en":["A gesture of love","What gesture of love has touched your heart the most?"]},{"es":["Tu relación con el dinero","¿Qué te enseñaron de niña sobre el dinero?"],"en":["Your relationship with money","What were you taught about money as a girl?"]},{"es":["Independencia","¿Qué significa para ti ser independiente económicamente?"],"en":["Independence","What does being financially independent mean to you?"]},{"es":["Ahorrar con propósito","¿Para qué estás ahorrando, o para qué te gustaría empezar a ahorrar?"],"en":["Saving with purpose","What are you saving for, or what would you like to start saving for?"]},{"es":["Pedir lo que vales","¿Te cuesta cobrar o pedir lo que vales? ¿Por qué?"],"en":["Asking for what you are worth","Is it hard for you to charge or ask for what you are worth? Why?"]},{"es":["Dinero sin vergüenza","¿Qué te ayudó a hablar de dinero sin sentir vergüenza?"],"en":["Money without shame","What helped you talk about money without feeling shame?"]},{"es":["Un gusto sin culpa","¿En qué gastas con alegría y sin culpa?"],"en":["A guilt-free treat","What do you spend on with joy and without guilt?"]},{"es":["Dinero y pareja","¿Cómo manejas, o manejarías, el dinero con tu pareja?"],"en":["Money and partners","How do you handle, or would you handle, money with a partner?"]},{"es":["Tu primer ingreso","¿Recuerdas tu primer ingreso propio? ¿Qué sentiste?"],"en":["Your first income","Do you remember your first income of your own? How did it feel?"]},{"es":["Un viaje que te cambió","¿Qué viaje cambió tu forma de ver la vida?"],"en":["A trip that changed you","What trip changed how you see life?"]},{"es":["Viajar sola","¿Viajarías sola? ¿Qué te daría miedo y qué te emocionaría?"],"en":["Traveling alone","Would you travel alone? What would scare you and what would excite you?"]},{"es":["Destino soñado","¿A qué lugar del mundo sueñas con llegar?"],"en":["Dream destination","Which place in the world do you dream of reaching?"]},{"es":["Extrañar tu tierra","¿Qué extrañas de tu tierra cuando estás lejos?"],"en":["Missing home","What do you miss about your homeland when you are far away?"]},{"es":["Viaje con amigas","¿Cómo sería el viaje perfecto con tus amigas?"],"en":["A trip with friends","What would the perfect trip with your friends look like?"]},{"es":["Empezar en un lugar nuevo","¿Qué fue lo más difícil y lo más bonito de empezar en un lugar nuevo?"],"en":["Starting in a new place","What was the hardest and the most beautiful part of starting in a new place?"]},{"es":["Un sueño guardado","¿Qué sueño tienes guardado que todavía no te has permitido empezar?"],"en":["A saved dream","What dream have you kept aside that you have not yet allowed yourself to start?"]},{"es":["Sin miedo","¿Qué harías si no tuvieras miedo?"],"en":["Without fear","What would you do if you were not afraid?"]},{"es":["Tu meta del año","¿Qué meta te ilusiona más para lo que queda del año?"],"en":["Your goal this year","What goal excites you most for the rest of the year?"]},{"es":["Emprender","Si pudieras empezar un negocio hoy, ¿qué sería?"],"en":["Starting a business","If you could start a business today, what would it be?"]},{"es":["Dentro de cinco años","¿Cómo te imaginas dentro de cinco años?"],"en":["Five years from now","How do you picture yourself five years from now?"]},{"es":["Un paso pequeño","¿Qué paso pequeño puedes dar esta semana hacia tu sueño?"],"en":["A small step","What small step can you take this week toward your dream?"]},{"es":["Nunca es tarde","¿Qué te gustaría empezar aunque sientas que ya es tarde?"],"en":["It is never too late","What would you like to start even if you feel it is already too late?"]},{"es":["Lo que te frena","¿Qué te frena más: el miedo, el tiempo o la opinión de otros?"],"en":["What holds you back","What holds you back most: fear, time or other people's opinions?"]},{"es":["Gratitud","¿Por qué estás agradecida hoy?"],"en":["Gratitude","What are you grateful for today?"]},{"es":["Lo que dice tu corazón","Si tu corazón hablara hoy, ¿qué diría?"],"en":["What your heart says","If your heart could speak today, what would it say?"]},{"es":["Cuando todo pesa","¿Qué haces cuando sientes que todo es demasiado?"],"en":["When everything feels heavy","What do you do when everything feels like too much?"]},{"es":["Soltar","¿Qué estás lista para soltar?"],"en":["Letting go","What are you ready to let go of?"]},{"es":["Perdonar","¿Qué te ha enseñado el perdón, a otros o a ti misma?"],"en":["Forgiving","What has forgiveness taught you, with others or with yourself?"]},{"es":["Cuando te sientes sola","¿Qué te ayuda cuando te sientes sola?"],"en":["When you feel alone","What helps you when you feel alone?"]},{"es":["Calmar la mente","¿Qué te calma cuando tu mente no para?"],"en":["Calming your mind","What calms you when your mind will not stop?"]},{"es":["Tu fortaleza","¿Qué momento difícil superaste del que hoy te sientes orgullosa?"],"en":["Your strength","What difficult moment did you overcome that you are proud of today?"]},{"es":["Llorar sin pena","¿Te permites llorar? ¿Qué te hace bien después?"],"en":["Crying without shame","Do you allow yourself to cry? What does you good afterwards?"]},{"es":["Lo que te llena el alma","¿Qué te llena el alma de alegría?"],"en":["What fills your soul","What fills your soul with joy?"]},{"es":["Lo que callas","¿Qué te gustaría decir en voz alta y todavía no has dicho?"],"en":["What you keep quiet","What would you like to say out loud that you have not said yet?"]},{"es":["Lo que te da paz","¿Qué te da paz de verdad, no solo distracción?"],"en":["What gives you peace","What gives you real peace, not just distraction?"]},{"es":["Descansar sin culpa","¿Qué te cuesta más: descansar o pedir ayuda? ¿Por qué?"],"en":["Resting without guilt","What is harder for you: resting or asking for help? Why?"]},{"es":["Tu cuerpo con cariño","¿Cómo cuidas tu cuerpo con cariño y no con exigencia?"],"en":["Your body with kindness","How do you care for your body with kindness and not demands?"]},{"es":["Dormir en paz","¿Qué te ayuda a dormir tranquila?"],"en":["Sleeping in peace","What helps you sleep peacefully?"]},{"es":["Tu cuerpo con los años","¿Qué has aprendido a aceptar de tu cuerpo con los años?"],"en":["Your body over the years","What have you learned to accept about your body over the years?"]},{"es":["Moverte feliz","¿Qué movimiento disfrutas: caminar, bailar, yoga, otra cosa?"],"en":["Moving happily","What movement do you enjoy: walking, dancing, yoga, something else?"]},{"es":["Tu día de spa","¿Cómo sería tu día perfecto de cuidado personal?"],"en":["Your spa day","What would your perfect day of self-care look like?"]},{"es":["Amigas de verdad","¿Qué hace verdadera a una amistad entre mujeres?"],"en":["True friends","What makes a friendship between women true?"]},{"es":["Mujeres que se apoyan","¿Cómo podemos apoyarnos más entre nosotras?"],"en":["Women supporting women","How can we support each other more?"]},{"es":["Una mujer que admiras","¿Qué mujer te inspira y qué aprendiste de ella?"],"en":["A woman you admire","Which woman inspires you, and what have you learned from her?"]},{"es":["Pedir ayuda","¿Cuándo pedir ayuda te cambió algo?"],"en":["Asking for help","When did asking for help change something for you?"]},{"es":["Amigas de adulta","¿Qué te ha ayudado a hacer nuevas amigas de adulta?"],"en":["Adult friendships","What has helped you make new friends as an adult?"]},{"es":["Celebrar a otra","¿A qué mujer de tu vida quisieras celebrar hoy y por qué?"],"en":["Celebrating another woman","Which woman in your life would you like to celebrate today, and why?"]},{"es":["Mamá e hija","¿Qué aprendiste de tu mamá que quieres conservar y qué quieres hacer distinto?"],"en":["Mother and daughter","What did you learn from your mom that you want to keep, and what do you want to do differently?"]},{"es":["Maternidad","¿Qué te ha enseñado la maternidad, o qué sueñas de ella?"],"en":["Motherhood","What has motherhood taught you, or what do you dream of for it?"]},{"es":["Equilibrio","¿Cómo equilibras trabajo, familia y tiempo para ti?"],"en":["Balance","How do you balance work, family and time for yourself?"]},{"es":["Una tradición","¿Qué tradición de tu país o de tu familia quieres compartir?"],"en":["A tradition","What tradition from your country or family would you like to share?"]},{"es":["Mujeres de tu familia","¿Qué te enseñó una mujer de tu familia sin darse cuenta?"],"en":["Women in your family","What did a woman in your family teach you without realizing it?"]},{"es":["Poner límites","¿Cuándo fue la última vez que dijiste que no sin sentirte mal?"],"en":["Setting boundaries","When was the last time you said no without feeling bad?"]},{"es":["Tu fe","¿Cómo te ha acompañado tu fe en un momento difícil?"],"en":["Your faith","How has your faith accompanied you in a difficult moment?"]},{"es":["Una oración","¿Por qué te gustaría que oremos juntas hoy?"],"en":["A prayer","What would you like us to pray for together today?"]},{"es":["Una promesa que te sostiene","¿Qué frase o versículo te sostiene en los días difíciles?"],"en":["A promise that holds you","What phrase or verse holds you up on difficult days?"]},{"es":["Esperanza","¿Qué te hace creer que lo mejor está por venir?"],"en":["Hope","What makes you believe the best is yet to come?"]},{"es":["Hablarte bonito","¿Qué le dirías hoy a la niña que fuiste?"],"en":["Speaking kindly to yourself","What would you say today to the girl you once were?"]},{"es":["Compararte menos","¿Cómo haces para compararte menos con otras?"],"en":["Comparing less","How do you manage to compare yourself less with others?"]},{"es":["Sentirte hermosa","¿Qué te hace sentir hermosa, por dentro y por fuera?"],"en":["Feeling beautiful","What makes you feel beautiful, inside and out?"]},{"es":["Tu voz","¿Cuándo sentiste que por fin usaste tu voz?"],"en":["Your voice","When did you feel you finally used your voice?"]}];
function talkItem() {
  const lang = C.lang(), other = lang === "es" ? "en" : "es";
  const s = C.setting && C.setting("talk_prompt");
  if (s && typeof s === "object" && s.published) {
    const q = String(s["body_" + lang] || s["body_" + other] || "").trim();
    if (q) return [String(s["title_" + lang] || s["title_" + other] || "").trim(), q];
  }
  // Library pasted in Admin (settings.talk_library): a new phrase every 2 days. Without it, the 70 built-in phrases rotate the same way.
  const lib = C.setting && C.setting("talk_library");
  const own = Array.isArray(lib) ? lib.filter(x => x && x.es && x.es[1]) : [];
  const items = own.length ? own : TALK70;
  if (items.length) {
    const n = Math.floor((day0().getTime() - new Date(2026, 0, 5).getTime()) / (2 * DAY));
    const it = items[((n % items.length) + items.length) % items.length];
    const pick = it[lang] && it[lang][1] ? it[lang] : it.es;
    return [pick[0] || "", pick[1]];
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
    back, flipped: talkFlipped, backLabel: C.t("fcBack"), onToggle: on => { talkFlipped = on; if (on) fallingHearts(); } }));
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
