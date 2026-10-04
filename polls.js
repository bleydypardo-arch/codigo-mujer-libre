// Código Mujer Libre — reusable polls (events, trips, or free-standing) + admin "Polls" tab.
// All rules (who may see/vote, one choice only, deadlines) are enforced by Supabase RLS and a
// trigger (supabase/schema.sql, section 15). This file only draws the screens.
(function () {
"use strict";
let C = null;

const ES = {
  pollsTitle: "Votaciones", pollsIntro: "Vota y mira cómo va el grupo.",
  pollOne: "Elige una opción", pollMany: "Puedes elegir varias", pollVotes: n => n + (n === 1 ? " voto" : " votos"),
  pollVoted: n => n + (n === 1 ? " persona votó" : " personas votaron"), pollClosed: "Cerrada",
  pollCloses: d => "Cierra " + d, pollFail: "No se pudo guardar tu voto.", pollNoVotes: "Sé la primera en votar.",
  pollLabel: "Votación",
  aPollsTab: "Votaciones", aPollIntro: "Crea una votación para el grupo (por ejemplo: «¿Viernes o sábado?»). Puedes unirla a un evento o a un viaje.",
  aPollNew: "+ Nueva votación", aPollQuestion: "Pregunta", aPollOptions: "Opciones (una por línea, mínimo 2)",
  aPollMulti: "Se pueden elegir varias opciones", aPollCloses: "Cierra el (opcional)", aPollAttach: "Unir a", aPollNone: "— Votación general —",
  aPollSave: "Crear votación", aPollCancel: "Cancelar", aPollNeedQ: "Escribe la pregunta.", aPollNeedOpts: "Escribe al menos 2 opciones distintas (máximo 10).",
  aPollSaved: "Votación creada.", aPollFail: "No se pudo guardar.", aPollClose: "Cerrar votación", aPollReopen: "Reabrir",
  aPollDelete: "Eliminar", aPollConfirm: "¿Eliminar esta votación y sus votos?", aPollEmpty: "Todavía no hay votaciones.",
  aPollGeneral: "General", aPollOpen: "Abierta"
};
const EN = {
  pollsTitle: "Polls", pollsIntro: "Vote and see how the group is leaning.",
  pollOne: "Pick one", pollMany: "Pick as many as you like", pollVotes: n => n + (n === 1 ? " vote" : " votes"),
  pollVoted: n => n + (n === 1 ? " person voted" : " people voted"), pollClosed: "Closed",
  pollCloses: d => "Closes " + d, pollFail: "Your vote could not be saved.", pollNoVotes: "Be the first to vote.",
  pollLabel: "Poll",
  aPollsTab: "Polls", aPollIntro: "Create a poll for the group (for example “Friday or Saturday?”). You can attach it to an event or a trip.",
  aPollNew: "+ New poll", aPollQuestion: "Question", aPollOptions: "Options (one per line, at least 2)",
  aPollMulti: "Members can pick more than one option", aPollCloses: "Closes on (optional)", aPollAttach: "Attach to", aPollNone: "— General poll —",
  aPollSave: "Create poll", aPollCancel: "Cancel", aPollNeedQ: "Write the question.", aPollNeedOpts: "Write at least 2 different options (maximum 10).",
  aPollSaved: "Poll created.", aPollFail: "Could not save.", aPollClose: "Close poll", aPollReopen: "Reopen",
  aPollDelete: "Delete", aPollConfirm: "Delete this poll and its votes?", aPollEmpty: "No polls yet.",
  aPollGeneral: "General", aPollOpen: "Open"
};

const t = (key, arg) => { const v = C ? C.t(key) : ""; return typeof v === "function" ? v(arg) : (v || key); };
const el = (...a) => C.el(...a);
const uid = () => (C.session() && C.session().user.id) || "";
const btn = (text, cls, fn) => { const b = el("button", { type: "button", class: cls || "", text }); b.addEventListener("click", fn); return b; };

// ---------- data (one small load, shared by every poll on screen) ----------
let polls = [], opts = new Map(), tally = new Map(), voters = new Map(), mine = new Set();
let loaded = false;
const live = new Set();     // { host, build } containers currently on screen

async function reload() {
  if (!C || !C.session()) { clear(); return; }
  const [p, o, r, v] = await Promise.all([
    C.db.from("polls").select("*").order("created_at", { ascending: false }),
    C.db.from("poll_options").select("*").order("position", { ascending: true }),
    C.db.rpc("poll_results"),
    C.db.from("poll_votes").select("poll_id,option_id").eq("user_id", uid())
  ]);
  if (p.error || o.error) { clear(); return; }
  polls = p.data || [];
  opts = new Map();
  (o.data || []).forEach(x => { (opts.get(x.poll_id) || opts.set(x.poll_id, []).get(x.poll_id)).push(x); });
  readResults(r);
  mine = new Set(((v && v.data) || []).map(x => x.poll_id + ":" + x.option_id));
  loaded = true;
  paintGeneral(); repaint();
}
function readResults(r) {
  tally = new Map(); voters = new Map();
  ((r && r.data) || []).forEach(x => { tally.set(x.option_id, Number(x.votes)); voters.set(x.poll_id, Number(x.voters)); });
}
function clear() { polls = []; opts = new Map(); tally = new Map(); voters = new Map(); mine = new Set(); loaded = false; paintGeneral(); }
async function refreshResults() {
  const r = await C.db.rpc("poll_results");
  if (!r.error) readResults(r);
}

// ---------- member side ----------
const isOpen = p => !p.closed && !(p.closes_at && new Date(p.closes_at).getTime() <= Date.now());
function closesText(p) {
  const d = new Date(p.closes_at);
  return t("pollCloses", d.toLocaleDateString(C.loc(), { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString(C.loc(), { hour: "numeric", minute: "2-digit" }));
}
async function vote(p, o) {
  if (!isOpen(p)) return;
  const key = p.id + ":" + o.id;
  const had = mine.has(key);
  const others = (opts.get(p.id) || []).filter(x => x.id !== o.id && mine.has(p.id + ":" + x.id));
  const bump = (id, d) => tally.set(id, Math.max(0, (tally.get(id) || 0) + d));
  const before = { mine: new Set(mine), tally: new Map(tally), voters: new Map(voters) };
  try {
    if (had) {                                           // tap again = take my vote back
      mine.delete(key); bump(o.id, -1); repaint();
      const r = await C.db.from("poll_votes").delete().eq("poll_id", p.id).eq("option_id", o.id).eq("user_id", uid());
      if (r.error) throw r.error;
    } else {
      if (!p.multi) {                                    // one choice: move my vote
        for (const x of others) {
          mine.delete(p.id + ":" + x.id); bump(x.id, -1);
          const d = await C.db.from("poll_votes").delete().eq("poll_id", p.id).eq("option_id", x.id).eq("user_id", uid());
          if (d.error) throw d.error;
        }
      }
      mine.add(key); bump(o.id, 1); repaint();
      const r = await C.db.from("poll_votes").insert({ poll_id: p.id, option_id: o.id });
      if (r.error && r.error.code !== "23505") throw r.error;
    }
    await refreshResults(); repaint();
  } catch {
    mine = before.mine; tally = before.tally; voters = before.voters; repaint();
    await refreshResults().catch(() => {}); repaint();
    C.announce("pollFail");
  }
}
function pollNode(p) {
  const open = isOpen(p);
  const list = opts.get(p.id) || [];
  const total = list.reduce((s, o) => s + (tally.get(o.id) || 0), 0);
  const n = voters.get(p.id) || 0;
  const head = el("div", { class: "poll-head" },
    el("b", { class: "poll-q", text: "🗳 " + p.question }),
    el("small", { class: "meta-line", text: (open ? (p.multi ? t("pollMany") : t("pollOne")) : t("pollClosed")) + (open && p.closes_at ? " · " + closesText(p) : "") }));
  const rows = list.map(o => {
    const v = tally.get(o.id) || 0;
    const pct = n ? Math.round((v / n) * 100) : 0;
    const on = mine.has(p.id + ":" + o.id);
    const b = el("button", {
      type: "button", class: "poll-opt" + (on ? " on" : ""), "aria-pressed": String(on),
      disabled: open ? null : "", "data-poll-opt": o.id
    },
      el("span", { class: "poll-bar", style: "width:" + pct + "%" }),
      el("span", { class: "poll-label", text: (on ? "✓ " : "") + o.label }),
      el("span", { class: "poll-count", text: v + " · " + pct + "%" }));
    if (!open) b.disabled = true;
    b.addEventListener("click", () => vote(p, o));
    return b;
  });
  return el("div", { class: "poll", role: "group", "aria-label": t("pollLabel") + ": " + p.question },
    head, ...rows,
    el("small", { class: "meta-line", text: total ? t("pollVoted", n) : t("pollNoVotes") }));
}
function repaint() {
  live.forEach(item => {
    if (!item.host.isConnected) { live.delete(item); return; }
    item.host.replaceChildren(...item.build());
  });
}
// Polls attached to one event/trip (returns null when it has none)
function planBlock(plan) {
  if (!C || !C.session() || !loaded) return null;
  const build = () => polls.filter(p => p.plan_id === plan.id).map(pollNode);
  if (!build().length) return null;
  const host = el("div", { class: "polls" });
  host.replaceChildren(...build());
  live.add({ host, build });
  return host;
}
// Free-standing polls section on the Events page
function paintGeneral() {
  const host = document.getElementById("generalPolls");
  if (!host) return;
  const general = C && C.session() && loaded ? polls.filter(p => !p.plan_id) : [];
  host.hidden = !general.length;
  for (const item of [...live]) if (item.host === host) live.delete(item);
  if (!general.length) { host.replaceChildren(); return; }
  const build = () => [
    el("small", { class: "rose", text: t("pollsTitle").toUpperCase() }),
    el("p", { class: "small-note", text: t("pollsIntro") }),
    ...polls.filter(p => !p.plan_id).map(pollNode)
  ];
  host.replaceChildren(...build());
  live.add({ host, build });
}

// ---------- admin ----------
let prefillPlan = "";
function localToIso(v) { if (!v) return null; const d = new Date(v); return Number.isNaN(d.getTime()) ? null : d.toISOString(); }

async function adminView(helpers) {
  const [pl, p, o, r] = await Promise.all([
    C.db.from("plans").select("id,kind,title_es,title_en").in("kind", ["event", "trip"]).order("created_at", { ascending: false }),
    C.db.from("polls").select("*").order("created_at", { ascending: false }),
    C.db.from("poll_options").select("*").order("position", { ascending: true }),
    C.db.rpc("poll_results")
  ]);
  if (p.error || o.error) throw (p.error || o.error);
  const plans = pl.data || [];
  const planName = id => { const x = plans.find(y => y.id === id); return x ? (C.pick(x, "title") || "—") : ""; };
  const ops = new Map(); (o.data || []).forEach(x => { (ops.get(x.poll_id) || ops.set(x.poll_id, []).get(x.poll_id)).push(x); });
  const votes = new Map(); const nv = new Map();
  ((r && r.data) || []).forEach(x => { votes.set(x.option_id, Number(x.votes)); nv.set(x.poll_id, Number(x.voters)); });

  const wrap = el("div");
  wrap.appendChild(el("p", { class: "small-note", text: t("aPollIntro") }));
  const formHost = el("div");
  const toast = text => { const s = document.getElementById("appStatus"); if (s) { s.hidden = false; s.textContent = text; setTimeout(() => { s.hidden = true; }, 4000); } };

  function openForm() {
    const q = el("input", { type: "text", maxlength: 200, required: "", id: "pollQ" });
    const ta = el("textarea", { id: "pollOpts", rows: 4, maxlength: 1200, placeholder: "Friday\nSaturday" });
    const multi = el("input", { type: "checkbox", id: "pollMulti" });
    const closes = el("input", { type: "datetime-local", id: "pollCloses" });
    const sel = el("select", { id: "pollPlan" }, el("option", { value: "", text: t("aPollNone") }),
      ...plans.map(x => el("option", { value: x.id, text: (x.kind === "trip" ? "✈️ " : "📅 ") + (C.pick(x, "title") || "—") })));
    if (prefillPlan && plans.some(x => x.id === prefillPlan)) sel.value = prefillPlan;
    prefillPlan = "";
    const fb = el("p", { class: "form-feedback", role: "alert", hidden: true });
    const save = el("button", { type: "submit", class: "primary", text: t("aPollSave") });
    const form = el("form", { class: "admin-form" },
      el("label", {}, t("aPollQuestion"), q),
      el("label", {}, t("aPollOptions"), ta),
      el("label", { class: "check" }, multi, " " + t("aPollMulti")),
      el("label", {}, t("aPollCloses"), closes),
      el("label", {}, t("aPollAttach"), sel),
      fb,
      el("div", { class: "actions" }, save, btn(t("aPollCancel"), "", () => formHost.replaceChildren())));
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const question = q.value.trim();
      const labels = [...new Set(ta.value.split("\n").map(s => s.trim()).filter(Boolean))];
      fb.hidden = false;
      if (!question) { fb.textContent = t("aPollNeedQ"); return; }
      if (labels.length < 2 || labels.length > 10 || labels.some(l => l.length > 100)) { fb.textContent = t("aPollNeedOpts"); return; }
      fb.hidden = true; save.disabled = true;
      const ins = await C.db.from("polls").insert({ question, multi: multi.checked, closes_at: localToIso(closes.value), plan_id: sel.value || null }).select().single();
      if (ins.error) { save.disabled = false; fb.textContent = t("aPollFail"); fb.hidden = false; return; }
      const so = await C.db.from("poll_options").insert(labels.map((label, i) => ({ poll_id: ins.data.id, label, position: i })));
      if (so.error) {
        await C.db.from("polls").delete().eq("id", ins.data.id);
        save.disabled = false; fb.textContent = t("aPollFail"); fb.hidden = false; return;
      }
      toast(t("aPollSaved"));
      await C.refreshPublic();
      document.dispatchEvent(new CustomEvent("cml:lang"));
    });
    formHost.replaceChildren(form);
    q.focus();
  }
  wrap.appendChild(el("div", { class: "admin-bar" }, btn(t("aPollNew"), "primary", openForm)));
  wrap.appendChild(formHost);
  if (prefillPlan) openForm();

  if (!(p.data || []).length) wrap.appendChild(el("p", { class: "small-note", text: t("aPollEmpty") }));
  (p.data || []).forEach(poll => {
    const open = isOpen(poll);
    const list = ops.get(poll.id) || [];
    const n = nv.get(poll.id) || 0;
    const item = el("div", { class: "admin-item" },
      el("span", { class: "badge" + (open ? " live" : ""), text: open ? t("aPollOpen") : t("pollClosed") }),
      el("span", { class: "badge", text: " " + (poll.plan_id ? planName(poll.plan_id) || "—" : t("aPollGeneral")) }),
      el("h3", { text: poll.question }),
      ...list.map(x => el("p", { class: "small-note", text: x.label + " — " + (votes.get(x.id) || 0) })),
      el("p", { class: "small-note", text: t("pollVoted", n) }));
    item.appendChild(el("div", { class: "actions" },
      btn(poll.closed ? t("aPollReopen") : t("aPollClose"), "", async () => {
        const r2 = await C.db.from("polls").update({ closed: !poll.closed }).eq("id", poll.id);
        if (r2.error) return toast(t("aPollFail"));
        await C.refreshPublic(); document.dispatchEvent(new CustomEvent("cml:lang"));
      }),
      btn(t("aPollDelete"), "danger", async () => {
        if (!window.confirm(t("aPollConfirm"))) return;
        const r2 = await C.db.from("polls").delete().eq("id", poll.id);
        if (r2.error) return toast(t("aPollFail"));
        await C.refreshPublic(); document.dispatchEvent(new CustomEvent("cml:lang"));
      })));
    wrap.appendChild(item);
  });
  return wrap;
}

// ---------- start-up ----------
function init() {
  C = window.CML;
  if (!C) return;
  C.addStrings(ES, EN);
  document.addEventListener("cml:session", () => { if (!C.session()) clear(); });
  document.addEventListener("cml:lang", () => { paintGeneral(); repaint(); });
  window.CMLPolls = {
    reload, planBlock, adminView, paintGeneral,
    unvoted: (hours) => polls.filter(p => isOpen(p) && p.closes_at && new Date(p.closes_at).getTime() - Date.now() <= (hours || 24) * 3600000 && !(opts.get(p.id) || []).some(o => mine.has(p.id + ":" + o.id))),
    closingSoon: (hours) => polls.filter(p => isOpen(p) && p.closes_at && new Date(p.closes_at).getTime() - Date.now() <= (hours || 48) * 3600000),
    prefill: id => { prefillPlan = id || ""; }
  };
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
