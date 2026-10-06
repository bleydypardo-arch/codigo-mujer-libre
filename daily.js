// Your Code for Today — admin-managed daily entries (table daily_codes), rotating at 12:00 AM Orlando time.
// The app keeps working without this: if the table is empty or missing, the built-in cards in redesign.js are used.
(function () {
"use strict";
let C = null, entries = [], loaded = false, lastDay = "";
const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" });
// "today" as YYYY-MM-DD in Orlando / Florida, whatever the device's own time zone is
const orlandoToday = (now) => fmt.format(now || new Date());
const dayNumber = ymd => { const [y, m, d] = ymd.split("-").map(Number); return Math.floor(Date.UTC(y, m - 1, d) / 86400000); };
const both = (r, k) => ({ es: String(r[k + "_es"] || "").trim(), en: String(r[k + "_en"] || "").trim() });
const L = (r, k, lang) => { const v = both(r, k); return (v[lang] || v[lang === "es" ? "en" : "es"] || ""); };

// Pure picker (also used by the admin preview): a card scheduled for exactly this date wins; otherwise rotate the unscheduled pool.
function pickEntry(list, ymd) {
  const live = list.filter(r => r.published && (r.aff_es || r.aff_en));
  const sched = live.filter(r => r.publish_on === ymd).sort((a, b) => a.position - b.position);
  if (sched.length) return { row: sched[0], index: 0, scheduled: true };
  const pool = live.filter(r => !r.publish_on).sort((a, b) => (a.position - b.position) || String(a.created_at).localeCompare(String(b.created_at)));
  if (!pool.length) return null;
  const index = dayNumber(ymd) % pool.length;
  return { row: pool[index], index, scheduled: false };
}
function today() {
  const hit = pickEntry(entries, orlandoToday());
  if (!hit) return null;
  const r = hit.row;
  return {
    index: hit.index, scheduled: hit.scheduled, id: r.id,
    text: lang => ({ aff: L(r, "aff", lang), refl: L(r, "back", lang), verse: L(r, "verse", lang), ref: L(r, "ref", lang) }),
    msg: lang => L(r, "msg", lang)
  };
}
const message = lang => { const h = today(); return h ? h.msg(lang) : ""; };

async function reload() {
  C = window.CML; if (!C || !C.session()) { entries = []; return; }
  try {
    const r = await C.db.from("daily_codes").select("*").eq("published", true).order("position", { ascending: true });
    entries = r.error ? [] : (r.data || []);
  } catch { entries = []; }
  loaded = true; repaint();
}
function repaint() {
  lastDay = orlandoToday();
  if (window.CMLRedesign && window.CMLRedesign.renderCode) window.CMLRedesign.renderCode();
}
function tick() { if (loaded && orlandoToday() !== lastDay) repaint(); }

function init() {
  C = window.CML; if (!C) return;
  window.CMLDaily = { today, message, reload, pickEntry, orlandoToday, dayNumber };
  document.addEventListener("cml:session", () => { entries = []; loaded = false; reload(); });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) tick(); });
  setInterval(tick, 30000);
  if (C.session()) reload();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
