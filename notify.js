// Código Mujer Libre — useful (not noisy) in-app reminders behind a 🔔 bell, with on/off choices.
// Everything is worked out from data the app already reads; nothing about a member's activity is
// stored except her own on/off choices and "last looked" time (profiles.notif_prefs / notif_seen_at).
(function () {
"use strict";
let C = null;

const ES = {
  ntBell: "Avisos", ntTitle: "Avisos", ntEmpty: "Estás al día. No hay avisos por ahora.", ntSettings: "Elegir qué avisos recibir", ntClose: "Cerrar",
  ntEvents: "Recordatorio de mis eventos", ntBirthdays: "Cumpleaños", ntPolls: "Votaciones que cierran pronto", ntComments: "Comentarios en mis publicaciones",
  ntNewEvents: "Eventos nuevos de mis intereses", ntMemories: "Fotos nuevas en Recuerdos", ntSaved: "Guardado.", ntFail: "No se pudo guardar.",
  ntToday: "hoy", ntTomorrow: "mañana",
  ntEvent: (title, when, time) => "📅 «" + title + "» es " + when + (time ? " a las " + time : "") + ".",
  ntBirthdayToday: n => "🎂 Hoy es el cumpleaños de " + n + ".", ntBirthdayTomorrow: n => "🎂 Mañana es el cumpleaños de " + n + ".",
  ntPoll: q => "🗳 La votación cierra pronto: " + q,
  ntComment: (n, who) => "💬 " + (n === 1 ? who + " comentó" : n + " personas comentaron") + " en tu publicación.",
  ntNewEvent: title => "✨ Nuevo evento para ti: «" + title + "».",
  ntPhotos: n => "📸 " + (n === 1 ? "Hay 1 foto nueva" : "Hay " + n + " fotos nuevas") + " en Recuerdos."
};
const EN = {
  ntBell: "Notifications", ntTitle: "Notifications", ntEmpty: "You're all caught up. Nothing new right now.", ntSettings: "Choose which notifications to get", ntClose: "Close",
  ntEvents: "Reminders for my events", ntBirthdays: "Birthdays", ntPolls: "Polls closing soon", ntComments: "Comments on my posts",
  ntNewEvents: "New events matching my interests", ntMemories: "New photos in Memories", ntSaved: "Saved.", ntFail: "Could not save.",
  ntToday: "today", ntTomorrow: "tomorrow",
  ntEvent: (title, when, time) => "📅 “" + title + "” is " + when + (time ? " at " + time : "") + ".",
  ntBirthdayToday: n => "🎂 It's " + n + "'s birthday today.", ntBirthdayTomorrow: n => "🎂 " + n + "'s birthday is tomorrow.",
  ntPoll: q => "🗳 Voting closes soon: " + q,
  ntComment: (n, who) => "💬 " + (n === 1 ? who + " commented" : n + " people commented") + " on your post.",
  ntNewEvent: title => "✨ New event for you: “" + title + "”.",
  ntPhotos: n => "📸 " + (n === 1 ? "There is 1 new photo" : "There are " + n + " new photos") + " in Memories."
};
const KEYS = ["events", "birthdays", "polls", "comments", "newEvents", "memories"];
const LABEL = { events: "ntEvents", birthdays: "ntBirthdays", polls: "ntPolls", comments: "ntComments", newEvents: "ntNewEvents", memories: "ntMemories" };
const t = (key, ...args) => { const v = C ? C.t(key) : ""; return typeof v === "function" ? v(...args) : (v || key); };
const el = (...a) => C.el(...a);
const DAY = 86400000;
const day0 = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const parseDay = s => { const [y, m, d] = String(s).split("-").map(Number); return new Date(y, m - 1, d); };

// "6:30 PM" -> minutes after midnight (null when it can't be read)
function minutesOf(txt) {
  const m = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i.exec(txt || "");
  if (!m) return null;
  let h = Number(m[1]); const min = Number(m[2] || 0), ap = (m[3] || "").toLowerCase();
  if (ap === "pm" && h < 12) h += 12; if (ap === "am" && h === 12) h = 0;
  return h > 23 ? null : h * 60 + min;
}
const on = key => { const p = (C.profile() && C.profile().notif_prefs) || {}; return p[key] !== false; };
const seenAt = () => { const s = C.profile() && C.profile().notif_seen_at; return s ? new Date(s).getTime() : 0; };

let items = [], timer = 0, loading = false, settingsOpen = false;

async function collect() {
  const me = C.profile(), uid = C.session().user.id;
  const { plans, mine, posts } = C.homeData();
  const out = [], now = Date.now();
  const today = day0();

  if (on("events")) {
    plans.filter(p => p.kind === "event" && p.event_date && mine.get(p.id) === "going").forEach(p => {
      const diff = Math.round((parseDay(p.event_date) - today) / DAY);
      if (diff < 0 || diff > 1) return;
      const mins = minutesOf(p.event_time);
      const start = parseDay(p.event_date).getTime() + (mins == null ? 0 : mins * 60000);
      if (mins != null && start < now) return;           // already started
      out.push({ at: Math.max(start - DAY, 0), text: t("ntEvent", C.pick(p, "title"), diff === 0 ? t("ntToday") : t("ntTomorrow"), p.event_time), page: "events", pri: 1 });
    });
  }
  if (on("polls") && window.CMLPolls) {
    window.CMLPolls.unvoted(24).forEach(p => out.push({ at: new Date(p.closes_at).getTime() - DAY, text: t("ntPoll", p.question), page: p.plan_id ? "events" : "community", pri: 2 }));
  }
  if (on("newEvents")) {
    const mineCodes = me.interests || [];
    plans.filter(p => p.kind === "event" && p.code && mineCodes.includes(p.code) && !mine.get(p.id) && (!p.event_date || p.event_date >= C.todayStr())
      && p.created_at && now - new Date(p.created_at).getTime() < 7 * DAY)
      .slice(0, 3).forEach(p => out.push({ at: new Date(p.created_at).getTime(), text: t("ntNewEvent", C.pick(p, "title")), page: "events", pri: 4 }));
  }
  const queries = [];
  if (on("birthdays")) queries.push(C.db.rpc("upcoming_birthdays", { within_days: 1 }).then(r => {
    (r.data || []).filter(b => b.user_id !== uid).forEach(b => out.push({ at: today.getTime(), text: t(Number(b.days_until) === 0 ? "ntBirthdayToday" : "ntBirthdayTomorrow", b.first_name), page: "home", pri: 1 }));
  }));
  if (on("comments")) {
    const mineIds = new Set(posts.filter(p => p.user_id === uid).map(p => p.id));
    if (mineIds.size) queries.push(C.db.from("community_comments").select("post_id,user_id,author_name,created_at").gte("created_at", new Date(now - 7 * DAY).toISOString()).order("created_at", { ascending: false }).limit(60).then(r => {
      const rows = (r.data || []).filter(c => mineIds.has(c.post_id) && c.user_id !== uid);
      const byPost = new Map(); rows.forEach(c => { (byPost.get(c.post_id) || byPost.set(c.post_id, []).get(c.post_id)).push(c); });
      byPost.forEach(list => out.push({ at: new Date(list[0].created_at).getTime(), text: t("ntComment", new Set(list.map(c => c.user_id)).size, list[0].author_name || "—"), page: "community", pri: 3 }));
    }));
  }
  if (on("memories")) queries.push(C.db.from("memory_media").select("created_at").eq("kind", "photo").gte("created_at", new Date(now - 7 * DAY).toISOString()).order("created_at", { ascending: false }).limit(100).then(r => {
    const rows = r.data || [];
    if (rows.length) out.push({ at: new Date(rows[0].created_at).getTime(), text: t("ntPhotos", rows.length), page: "events", memories: true, pri: 5 });
  }));
  await Promise.all(queries.map(q => q.catch(() => {})));
  out.sort((a, b) => a.pri - b.pri || b.at - a.at);
  return out;
}

function paintBadge() {
  const badge = document.getElementById("bellBadge"), bell = document.getElementById("bellBtn");
  if (!badge) return;
  const seen = seenAt();
  const n = items.filter(i => i.at > seen).length;
  badge.hidden = !n; badge.textContent = n > 9 ? "9+" : String(n);
  if (bell) bell.setAttribute("aria-label", t("ntBell") + (n ? " (" + n + ")" : ""));
}
async function refresh() {
  if (!C || !C.session() || !C.profile() || loading) return;
  loading = true;
  try { items = await collect(); } catch { /* keep the old list */ }
  loading = false;
  paintBadge();
  if (!document.getElementById("notifPanel").hidden) paintPanel();
}

function paintPanel() {
  const host = document.getElementById("notifPanel");
  const seen = seenAt();
  const settings = el("details", { class: "notif-settings" }, el("summary", { text: "⚙ " + t("ntSettings") }));
  settings.open = settingsOpen;
  settings.addEventListener("toggle", () => { settingsOpen = settings.open; });
  const fb = el("small", { class: "meta", role: "status" });
  KEYS.forEach(k => {
    const box = el("input", { type: "checkbox" }); box.checked = on(k);
    box.addEventListener("change", async () => {
      const prefs = Object.assign({}, C.profile().notif_prefs || {}, { [k]: box.checked });
      const r = await C.db.from("profiles").update({ notif_prefs: prefs }).eq("id", C.session().user.id);
      if (r.error) { box.checked = !box.checked; fb.textContent = t("ntFail"); return; }
      C.profile().notif_prefs = prefs; fb.textContent = t("ntSaved"); refresh();
    });
    settings.appendChild(el("label", { class: "check" }, box, " " + t(LABEL[k])));
  });
  settings.appendChild(fb);
  const close = el("button", { type: "button", class: "link-btn", text: t("ntClose") });
  close.addEventListener("click", closePanel);
  const rows = items.map(i => {
    const b = el("button", { type: "button", class: "notif-item" + (i.at > seen ? " new" : ""), text: i.text });
    b.addEventListener("click", () => { closePanel(); C.showPage(i.page); if (i.memories) { const m = document.getElementById("segMemories"); if (m) m.click(); } });
    return b;
  });
  host.replaceChildren(el("div", { class: "notif-head" }, el("b", { text: "🔔 " + t("ntTitle") }), close),
    ...(rows.length ? rows : [el("p", { class: "small-note", text: t("ntEmpty") })]), settings);
}
async function openPanel() {
  const host = document.getElementById("notifPanel"), bell = document.getElementById("bellBtn");
  if (!host.hidden) return closePanel();
  await refresh();
  const stamp = new Date().toISOString();
  paintPanel(); host.hidden = false; bell.setAttribute("aria-expanded", "true");
  // mark as looked-at (keeps the "new" highlight for this viewing, clears the badge)
  C.db.from("profiles").update({ notif_seen_at: stamp }).eq("id", C.session().user.id).then(r => {
    if (!r.error && C.profile()) { C.profile().notif_seen_at = stamp; setTimeout(paintBadge, 0); }
  });
}
function closePanel() {
  const host = document.getElementById("notifPanel"), bell = document.getElementById("bellBtn");
  host.hidden = true; if (bell) bell.setAttribute("aria-expanded", "false");
}

function init() {
  C = window.CML;
  if (!C) return;
  C.addStrings(ES, EN);
  const bell = document.getElementById("bellBtn");
  if (bell) bell.addEventListener("click", openPanel);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closePanel(); });
  document.addEventListener("click", e => {
    const host = document.getElementById("notifPanel");
    if (host && !host.hidden && !host.contains(e.target) && !(bell && bell.contains(e.target))) closePanel();
  });
  document.addEventListener("cml:session", e => {
    items = []; closePanel(); clearInterval(timer); paintBadge();
    if (!C.session() || (e.detail && e.detail.pending)) return;
    setTimeout(refresh, 400);
    timer = setInterval(() => { if (!document.hidden) refresh(); }, 300000);
  });
  document.addEventListener("cml:lang", () => { paintBadge(); if (!document.getElementById("notifPanel").hidden) paintPanel(); });
  window.CMLNotify = { refresh };
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
