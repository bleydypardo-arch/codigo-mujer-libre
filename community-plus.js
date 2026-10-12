// Community extras: post categories, "Reportar", "Bloquear", and the safety note for meetups.
// Categories are stored as a tiny prefix in the post text ([[crece]]) so no database change is needed.
(function () {
  "use strict";
  const CATS = ["crece", "conectemos", "ayuda", "celebremos", "inspiracion"];
  const ES = {
    ccAll: "Todo", ccPickLabel: "¿De qué trata? (opcional)",
    cc_crece: "Crece y Emprende", cc_conectemos: "Conectemos", cc_ayuda: "Necesito / Puedo ayudar", cc_celebremos: "Celebremos", cc_inspiracion: "Inspiración",
    ccFilterAria: "Filtrar publicaciones", ccNone: "Aún no hay publicaciones en esta categoría. ¡Escribe la primera!",
    rpReport: "Reportar", rpBlock: "Bloquear", rpTitle: "¿Qué pasó?", rpWhy_respect: "Falta de respeto", rpWhy_spam: "Spam o ventas", rpWhy_unsafe: "Me siento insegura", rpWhy_fake: "Parece un perfil falso", rpWhy_other: "Otra razón",
    rpThanks: "Gracias. Nuestro equipo lo revisará con cuidado.", rpFail: "No se pudo enviar. Intenta de nuevo.", rpCancel: "Cancelar",
    blTitle: n => "¿Bloquear a " + n + "?", blText: "No verás sus publicaciones ni su perfil. Ella no recibe aviso. Puedes desbloquearla en Mi perfil.", blYes: "Sí, bloquear", blDone: "Listo. Ya no verás a esta persona.",
    blMine: "Personas bloqueadas", blNone: "No has bloqueado a nadie.", blUndo: "Desbloquear", blUnknown: "Integrante",
    safeTitle: "Consejos para encontrarnos con tranquilidad", safe1: "Reúnete en un lugar público (café, restaurante, evento).", safe2: "Avisa a alguien de confianza adónde vas y a qué hora.", safe3: "Llega y vuelve por tu cuenta. Tu seguridad va primero.", safe4: "Si algo no se siente bien, vete. Y cuéntanos con «Reportar»."
  };
  const EN = {
    ccAll: "All", ccPickLabel: "What is it about? (optional)",
    cc_crece: "Grow & Create", cc_conectemos: "Let's connect", cc_ayuda: "I need / I can help", cc_celebremos: "Let's celebrate", cc_inspiracion: "Inspiration",
    ccFilterAria: "Filter posts", ccNone: "No posts in this category yet. Write the first one!",
    rpReport: "Report", rpBlock: "Block", rpTitle: "What happened?", rpWhy_respect: "Disrespect", rpWhy_spam: "Spam or selling", rpWhy_unsafe: "I feel unsafe", rpWhy_fake: "Looks like a fake profile", rpWhy_other: "Another reason",
    rpThanks: "Thank you. Our team will review it carefully.", rpFail: "Could not send. Please try again.", rpCancel: "Cancel",
    blTitle: n => "Block " + n + "?", blText: "You won't see her posts or profile. She isn't notified. You can unblock her in My profile.", blYes: "Yes, block", blDone: "Done. You won't see this person anymore.",
    blMine: "Blocked people", blNone: "You haven't blocked anyone.", blUndo: "Unblock", blUnknown: "Member",
    safeTitle: "Tips for meeting up with peace of mind", safe1: "Meet in a public place (café, restaurant, event).", safe2: "Tell someone you trust where you're going and when.", safe3: "Arrive and leave on your own. Your safety comes first.", safe4: "If something feels off, leave. And tell us with “Report”."
  };
  let C = null, blocked = new Set(), blocksOk = true, curCat = "all";
  const t = (k, ...a) => { const v = C ? C.t(k) : ""; return typeof v === "function" ? v(...a) : (v || k); };
  const el = (...a) => C.el(...a);
  const me = () => (C && C.session() && C.session().user.id) || "";
  const init = () => { C = window.CML; if (C && C.addStrings && !init.done) { init.done = true; C.addStrings(ES, EN); } return !!C; };
  const rerender = () => document.dispatchEvent(new Event("cml:community"));

  async function loadBlocks() {
    if (!init() || !C.session()) return;
    try {
      const r = await C.db.from("blocks").select("blocked");
      if (r.error) { blocksOk = false; return; }
      blocksOk = true; blocked = new Set((r.data || []).map(x => x.blocked));
    } catch { blocksOk = false; }
  }
  const isBlocked = id => !!id && blocked.has(id);

  // ---- categories ----
  function parse(post) {
    const m = /^\[\[(\w+)\]\]\s*/.exec(post.body || "");
    if (m && CATS.includes(m[1])) { post.cat = m[1]; post.body = post.body.slice(m[0].length); }
    return post;
  }
  function encode(cat, text) { return (CATS.includes(cat) ? "[[" + cat + "]] " : "") + text; }
  let composerCat = "";
  const getComposerCat = () => composerCat;
  const clearComposerCat = () => { composerCat = ""; };
  function pills(selected, onPick, withAll) {
    const row = el("div", { class: "chips cc-pills", role: "group" });
    const mk = (key, label) => {
      const on = selected() === key;
      const b = el("button", { type: "button", class: "chip" + (on ? " selected" : ""), "aria-pressed": String(on), text: label });
      b.addEventListener("click", () => { onPick(key === selected() && !withAll ? "" : key); });
      row.appendChild(b);
    };
    if (withAll) mk("all", t("ccAll"));
    CATS.forEach(c => mk(c, t("cc_" + c)));
    return row;
  }
  function composerNode() {
    init();
    const host = el("div", { class: "cc-composer" }, el("small", { class: "cc-label", text: t("ccPickLabel") }));
    const paint = () => { const old = host.querySelector(".cc-pills"); const n = pills(() => composerCat, k => { composerCat = k; paint(); }, false); if (old) old.replaceWith(n); else host.appendChild(n); };
    paint(); return host;
  }
  function filterNode() {
    init();
    const host = el("div", { class: "cc-filter", "aria-label": t("ccFilterAria") });
    const paint = () => { host.replaceChildren(pills(() => curCat, k => { curCat = k; rerender(); }, true)); };
    paint(); return host;
  }
  const catOk = post => curCat === "all" || post.cat === curCat;
  const catBadge = post => post.cat ? (init(), el)("span", { class: "cc-badge", text: t("cc_" + post.cat) }) : null;
  const curCategory = () => curCat;

  // ---- report / block ----
  function modal(children, label) {
    closeModal();
    const x = el("button", { type: "button", class: "cn-x", "aria-label": "×", text: "×" });
    const sheet = el("div", { class: "cn-sheet", role: "dialog", "aria-modal": "true", "aria-label": label }, x, el("div", { class: "cn-body" }, ...children));
    const wrap = el("div", { class: "cn-wrap", id: "rpWrap" }, sheet);
    wrap.addEventListener("click", e => { if (e.target === wrap) closeModal(); });
    wrap.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
    x.addEventListener("click", closeModal);
    document.body.appendChild(wrap); x.focus(); return wrap;
  }
  const closeModal = () => { const w = document.getElementById("rpWrap"); if (w) w.remove(); };
  function openReport(info) { // info: {kind, targetId, targetUser, excerpt}
    if (!init()) return;
    const note = el("p", { class: "cn-note", role: "status" });
    const list = el("div", { class: "rp-list" });
    ["respect", "spam", "unsafe", "fake", "other"].forEach(k => {
      const b = el("button", { type: "button", class: "secondary rp-opt", text: t("rpWhy_" + k) });
      b.addEventListener("click", async () => {
        list.querySelectorAll("button").forEach(x => { x.disabled = true; });
        try {
          const r = await C.db.from("reports").insert({ reporter: me(), kind: info.kind, target_id: info.targetId || null, target_user: info.targetUser || null, reason: k, excerpt: String(info.excerpt || "").slice(0, 300) });
          if (r.error) throw r.error;
          list.replaceChildren(); note.textContent = t("rpThanks");
        } catch { list.querySelectorAll("button").forEach(x => { x.disabled = false; }); note.textContent = t("rpFail"); }
      });
      list.appendChild(b);
    });
    modal([el("h3", { text: t("rpTitle") }), list, note], t("rpReport"));
  }
  function openBlock(userId, name) {
    if (!init() || !userId) return;
    const note = el("p", { class: "cn-note", role: "status" });
    const yes = el("button", { type: "button", class: "primary", text: t("blYes") });
    const no = el("button", { type: "button", class: "secondary", text: t("rpCancel") });
    no.addEventListener("click", closeModal);
    yes.addEventListener("click", async () => {
      yes.disabled = true;
      try {
        const r = await C.db.from("blocks").insert({ blocker: me(), blocked: userId });
        if (r.error && r.error.code !== "23505") throw r.error;
        blocked.add(userId); note.textContent = t("blDone"); yes.hidden = true; no.hidden = true;
        const w = document.getElementById("cnWrap"); if (w) w.remove();
        rerender(); setTimeout(closeModal, 1200);
      } catch { yes.disabled = false; note.textContent = t("rpFail"); }
    });
    modal([el("h3", { text: t("blTitle", name || t("blUnknown")) }), el("p", { text: t("blText") }), el("div", { class: "cn-act" }, yes, no), note], t("rpBlock"));
  }
  async function unblock(id) {
    const r = await C.db.from("blocks").delete().eq("blocker", me()).eq("blocked", id);
    if (!r.error) { blocked.delete(id); rerender(); }
    return !r.error;
  }
  // small "Reportar · Bloquear" links under a post
  function postMenu(post) {
    if (!init() || !post || post.user_id === me()) return null;
    const rep = el("button", { type: "button", class: "link-btn rp-link", text: t("rpReport") });
    rep.addEventListener("click", () => openReport({ kind: "post", targetId: post.id, targetUser: post.user_id, excerpt: post.body }));
    const blk = el("button", { type: "button", class: "link-btn rp-link", text: t("rpBlock") });
    blk.addEventListener("click", () => openBlock(post.user_id, post.author_name));
    return el("div", { class: "rp-menu" }, rep, blk);
  }
  function memberLinks(m) {
    if (!init() || !m || !m.id || m.id === me()) return null;
    const rep = el("button", { type: "button", class: "link-btn rp-link", text: t("rpReport") });
    rep.addEventListener("click", () => openReport({ kind: "member", targetUser: m.id, excerpt: m.first_name }));
    const blk = el("button", { type: "button", class: "link-btn rp-link", text: t("rpBlock") });
    blk.addEventListener("click", () => openBlock(m.id, m.first_name));
    return el("div", { class: "rp-menu" }, rep, blk);
  }
  // "Blocked people" list for Mi perfil
  function profileCard(nameOf) {
    if (!init() || !blocksOk || !blocked.size) return null;
    const card = el("div", { class: "card rp-blocked" }, el("h2", { text: t("blMine") }));
    [...blocked].forEach(id => {
      const b = el("button", { type: "button", class: "link-btn", text: t("blUndo") });
      b.addEventListener("click", async () => { b.disabled = true; if (await unblock(id)) card.remove(); else b.disabled = false; });
      card.appendChild(el("div", { class: "rp-row" }, el("span", { text: (nameOf && nameOf(id)) || t("blUnknown") }), b));
    });
    return card;
  }
  // safety box shown with meetups
  function safetyNode() {
    if (!init()) return null;
    return el("details", { class: "safe-box" }, el("summary", { text: "🛡 " + t("safeTitle") }),
      el("ul", {}, ...["safe1", "safe2", "safe3", "safe4"].map(k => el("li", { text: t(k) }))));
  }

  // ---- admin tab "Reportes" (owner/admin only; the database also blocks everyone else) ----
  const AT = {
    es: { tab: "Reportes", intro: "Lo que las integrantes reportan. Revísalo con calma; no hace falta responder de inmediato.", none: "No hay reportes pendientes. Todo tranquilo.", done: "Marcar como revisado", doneOk: "Marcado como revisado.", fail: "No se pudo. Intenta de nuevo.", about: "Sobre", by: "Reportó", post: "Publicación", member: "Perfil", showDone: "Ver también los revisados", reasons: { respect: "Falta de respeto", spam: "Spam o ventas", unsafe: "Se siente insegura", fake: "Perfil falso", other: "Otra razón" } },
    en: { tab: "Reports", intro: "What members report. Review it calmly; there is no need to reply right away.", none: "No pending reports. All calm.", done: "Mark as reviewed", doneOk: "Marked as reviewed.", fail: "Could not do that. Please try again.", about: "About", by: "Reported by", post: "Post", member: "Profile", showDone: "Also show reviewed", reasons: { respect: "Disrespect", spam: "Spam or selling", unsafe: "Feels unsafe", fake: "Fake profile", other: "Another reason" } }
  };
  async function reportsTab(Cm, K, all) {
    const L = AT[Cm.lang() === "en" ? "en" : "es"];
    const wrap = K.el("div", { class: "admin-section" }, K.el("p", { class: "small-note", text: L.intro }));
    let q = Cm.db.from("reports").select("id,reporter,kind,target_id,target_user,reason,excerpt,status,created_at").order("created_at", { ascending: false }).limit(100);
    if (!all) q = q.eq("status", "open");
    const r = await q;
    if (r.error) { wrap.appendChild(K.el("p", { class: "form-feedback", text: L.fail })); return wrap; }
    const rows = r.data || [];
    const ids = [...new Set(rows.flatMap(x => [x.reporter, x.target_user]).filter(Boolean))];
    const names = new Map();
    if (ids.length) {
      const pr = await Cm.db.from("profiles").select("id,first_name,last_name").in("id", ids);
      (pr.data || []).forEach(p => names.set(p.id, ((p.first_name || "") + " " + (p.last_name || "")).trim()));
    }
    const nm = id => names.get(id) || "—";
    if (!rows.length) wrap.appendChild(K.el("p", { text: L.none }));
    rows.forEach(x => {
      const card = K.el("div", { class: "card" },
        K.el("b", { text: (L.reasons[x.reason] || x.reason) + " · " + (x.kind === "post" ? L.post : L.member) }),
        K.el("p", { class: "meta", text: new Date(x.created_at).toLocaleString(Cm.loc()) }),
        K.el("p", { text: L.about + ": " + nm(x.target_user) }),
        x.excerpt ? K.el("blockquote", { class: "saved-text", text: x.excerpt }) : null,
        K.el("p", { class: "meta", text: L.by + ": " + nm(x.reporter) }));
      if (x.status === "open") {
        card.appendChild(K.button(L.done, "primary", async () => {
          const u = await Cm.db.from("reports").update({ status: "done" }).eq("id", x.id);
          if (u.error) { K.toast(L.fail); return; }
          K.toast(L.doneOk); card.remove();
        }));
      }
      wrap.appendChild(card);
    });
    return wrap;
  }
  function initAdmin() {
    const Cm = window.CML, A = window.CMLAdmin;
    if (!Cm || !A || !A.registerTab) return;
    const K = A.kit();
    A.registerTab("reports", { group: "people", label: { es: AT.es.tab, en: AT.en.tab }, render: async () => reportsTab(Cm, K, false) });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initAdmin, { once: true }); else initAdmin();

  window.CMLCommunity = { parse, encode, composerNode, filterNode, getComposerCat, clearComposerCat, catOk, catBadge, curCategory,
    loadBlocks, isBlocked, postMenu, memberLinks, profileCard, safetyNode, openReport, openBlock, unblock };
})();
