// Código Mujer Libre — private chat between two connected women (text only, no extra cost).
// Needs supabase/migration_chat.sql. Without it the chat entry simply does not appear.
// Messages are read when the conversation opens and refreshed every few seconds while it is open (no realtime service needed).
(function () {
  "use strict";
  const ES = {
    chTitle: "Mis conversaciones", chEntry: "Mis conversaciones", chEntrySub: "Escríbete con las mujeres con las que ya estás conectada.",
    chBack: "Volver", chEmpty: "Aún no tienes conversaciones. Cuando una mujer acepte tu saludo, podrán escribirse aquí.",
    chStart: "Empezar una conversación", chWrite: "Escribir", chPlaceholder: "Escribe un mensaje…", chSend: "Enviar",
    chNoMsgs: n => "Escríbele a " + n + ". Sé amable: aquí nos cuidamos.", chFail: "No se pudo enviar. Revisa tu conexión e intenta de nuevo.",
    chSafe: "Por tu seguridad: no compartas tu dirección, contraseñas ni dinero. Si algo te incomoda, repórtalo o bloquea.",
    chNew: n => n + " nuevo" + (n === 1 ? "" : "s"), chYou: "Tú: ", chLoadFail: "No se pudieron cargar los mensajes.", chUnsend: "Borrar", chToday: "Hoy"
  };
  const EN = {
    chTitle: "My conversations", chEntry: "My conversations", chEntrySub: "Write to the women you are already connected with.",
    chBack: "Back", chEmpty: "You have no conversations yet. When a woman accepts your hello, you can write to each other here.",
    chStart: "Start a conversation", chWrite: "Write", chPlaceholder: "Write a message…", chSend: "Send",
    chNoMsgs: n => "Write to " + n + ". Be kind: here we take care of each other.", chFail: "Could not send. Check your connection and try again.",
    chSafe: "For your safety: don't share your address, passwords or money. If something makes you uncomfortable, report or block.",
    chNew: n => n + " new", chYou: "You: ", chLoadFail: "Could not load the messages.", chUnsend: "Delete", chToday: "Today"
  };
  let C = null, ok = true, all = [], partner = "", timer = null, unread = 0, busy = false;
  const t = (k, ...a) => { const v = C ? C.t(k) : ""; return typeof v === "function" ? v(...a) : (v || k); };
  const el = (...a) => C.el(...a);
  const me = () => (C && C.session() && C.session().user.id) || "";
  const CN = () => window.CMLConnect;
  const blocked = id => !!(window.CMLCommunity && window.CMLCommunity.isBlocked(id));

  function init() { C = window.CML; if (C && C.addStrings && !init.done) { init.done = true; C.addStrings(ES, EN); } return !!C; }
  const active = () => { const p = document.getElementById("chat"); return !!p && p.classList.contains("active"); };
  const person = id => (CN() && CN().member ? CN().member(id) : null) || { id, first_name: (CN() && CN().nameOf && CN().nameOf(id)) || "…" };
  const clip = (s, n) => { s = String(s || "").replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s; };
  const avatar = (m, cls) => window.CMLProfile ? window.CMLProfile.avatarNode(m.avatar_path || null, m.first_name, cls) : el("span", { class: "avatar " + cls, text: (m.first_name || "?").charAt(0).toUpperCase() });
  const hhmm = d => new Date(d).toLocaleTimeString(C.loc ? C.loc() : undefined, { hour: "numeric", minute: "2-digit" });
  const dayKey = d => { const x = new Date(d); return x.getFullYear() + "-" + x.getMonth() + "-" + x.getDate(); };
  const dayLabel = d => dayKey(d) === dayKey(Date.now()) ? t("chToday") : new Date(d).toLocaleDateString(C.loc ? C.loc() : undefined, { weekday: "short", day: "numeric", month: "short" });

  async function fetchAll() {
    if (!init() || !C.session()) return false;
    const r = await C.db.from("chat_messages").select("id,sender,recipient,body,created_at,read_at").order("created_at", { ascending: false }).limit(400);
    if (r.error) { ok = false; return false; }
    ok = true; all = (r.data || []).slice().reverse();
    const n = all.filter(x => x.recipient === me() && !x.read_at && !blocked(x.sender)).length;
    const changed = n !== unread; unread = n;
    if (changed) document.dispatchEvent(new Event("cml:community"));
    return true;
  }
  const withMe = id => all.filter(x => (x.sender === id && x.recipient === me()) || (x.recipient === id && x.sender === me()));

  // The small card at the top of Community
  function entry() {
    if (!init() || !C.session() || !ok) return null;
    const b = el("button", { type: "button", class: "card ch-entry" },
      el("span", { class: "ch-ic", "aria-hidden": "true", text: "💬" }),
      el("span", { class: "ch-txt" }, el("b", { text: t("chEntry") }), el("small", { text: t("chEntrySub") })),
      unread ? el("span", { class: "ch-badge", text: String(unread) }) : null);
    b.addEventListener("click", openInbox);
    return b;
  }

  async function openInbox() {
    partner = ""; stop();
    C.showPage("chat", false);
    paintInbox();
    if (await fetchAll()) paintInbox(); else paintFail();
  }
  const body = () => document.getElementById("chatBody");
  function backBtn(fn) { const b = el("button", { type: "button", class: "link-btn ch-back", text: "‹ " + t("chBack") }); b.addEventListener("click", fn); return b; }
  function paintFail() { const h = body(); if (h) h.replaceChildren(backBtn(() => C.showPage("community", false)), el("p", { class: "meta", text: t("chLoadFail") })); }

  function paintInbox() {
    const host = body(); if (!host) return;
    const byPartner = new Map();
    all.forEach(x => { const id = x.sender === me() ? x.recipient : x.sender; if (!blocked(id)) byPartner.set(id, x); });
    const rows = [...byPartner.entries()].sort((a, b) => new Date(b[1].created_at) - new Date(a[1].created_at));
    const list = el("div", { class: "ch-list" });
    rows.forEach(([id, last]) => {
      const m = person(id), n = all.filter(x => x.sender === id && x.recipient === me() && !x.read_at).length;
      const b = el("button", { type: "button", class: "ch-row" }, avatar(m, "avatar-sm"),
        el("span", { class: "ch-rtxt" }, el("b", { text: m.first_name }), el("small", { text: (last.sender === me() ? t("chYou") : "") + clip(last.body, 60) })),
        n ? el("span", { class: "ch-badge", text: String(n) }) : null);
      b.addEventListener("click", () => openThread(id));
      list.appendChild(b);
    });
    const connected = CN() && CN().connected ? CN().connected().filter(m => !byPartner.has(m.id) && !blocked(m.id)) : [];
    const more = connected.length ? el("div", { class: "ch-more" }, el("h2", { text: t("chStart") }),
      ...connected.map(m => { const b = el("button", { type: "button", class: "ch-row" }, avatar(m, "avatar-sm"), el("span", { class: "ch-rtxt" }, el("b", { text: m.first_name }), el("small", { text: m.city || "" })), el("span", { class: "ch-go", text: t("chWrite") })); b.addEventListener("click", () => openThread(m.id)); return b; })) : null;
    host.replaceChildren(backBtn(() => C.showPage("community", false)), el("h1", { class: "ch-h1", text: t("chTitle") }),
      rows.length || connected.length ? list : el("p", { class: "meta", text: t("chEmpty") }), more);
  }

  async function openThread(id) {
    if (!init()) return;
    if (window.CMLWelcome && !(await window.CMLWelcome.ensurePhoto())) return;
    partner = id; C.showPage("chat", false);
    if (!all.length) await fetchAll();
    paintThread(true); markRead(); start();
  }
  async function markRead() {
    const ids = all.filter(x => x.sender === partner && x.recipient === me() && !x.read_at).map(x => x.id);
    if (!ids.length) return;
    const r = await C.db.from("chat_messages").update({ read_at: new Date().toISOString() }).in("id", ids);
    if (!r.error) { all.forEach(x => { if (ids.includes(x.id)) x.read_at = new Date().toISOString(); }); const n = all.filter(x => x.recipient === me() && !x.read_at && !blocked(x.sender)).length; if (n !== unread) { unread = n; document.dispatchEvent(new Event("cml:community")); } }
  }
  let draft = "";
  function paintThread(scroll) {
    const host = body(); if (!host || !partner) return;
    const m = person(partner), list = withMe(partner);
    const old = host.querySelector(".ch-msgs"), keep = old ? old.scrollTop : 0, atEnd = !old || old.scrollHeight - old.scrollTop - old.clientHeight < 60;
    const msgs = el("div", { class: "ch-msgs", role: "log", "aria-live": "polite" });
    if (!list.length) msgs.appendChild(el("p", { class: "meta ch-hint", text: t("chNoMsgs", m.first_name) }));
    let lastDay = "";
    list.forEach(x => {
      const k = dayKey(x.created_at); if (k !== lastDay) { lastDay = k; msgs.appendChild(el("div", { class: "ch-day", text: dayLabel(x.created_at) })); }
      const mine = x.sender === me();
      msgs.appendChild(el("div", { class: "ch-b " + (mine ? "mine" : "theirs") }, el("span", { text: x.body }), el("small", { text: hhmm(x.created_at) })));
    });
    const ta = el("textarea", { class: "ch-input", rows: 2, maxlength: 1000, placeholder: t("chPlaceholder"), "aria-label": t("chPlaceholder") });
    ta.value = draft; ta.addEventListener("input", () => { draft = ta.value; });
    const send = el("button", { type: "button", class: "primary ch-send", text: t("chSend") });
    const fb = el("p", { class: "form-feedback", role: "alert", hidden: true });
    send.addEventListener("click", async () => {
      const text = ta.value.trim(); if (!text || busy) return;
      busy = true; send.disabled = true; fb.hidden = true;
      const r = await C.db.from("chat_messages").insert({ sender: me(), recipient: partner, body: text.slice(0, 1000) }).select("id,sender,recipient,body,created_at,read_at").single();
      busy = false; send.disabled = false;
      if (r.error) { fb.textContent = t("chFail"); fb.hidden = false; return; }
      all.push(Object.assign({ created_at: new Date().toISOString() }, r.data)); draft = ""; paintThread(true);
    });
    const head = el("div", { class: "ch-head" }, backBtn(() => { stop(); partner = ""; paintInbox(); }), avatar(m, "avatar-sm"), el("b", { class: "ch-name", text: m.first_name }));
    host.replaceChildren(head, el("p", { class: "ch-safe", text: "🛡 " + t("chSafe") }), msgs, el("div", { class: "ch-compose" }, ta, send), fb, window.CMLCommunity ? window.CMLCommunity.memberLinks(m) : null);
    if (scroll || atEnd) msgs.scrollTop = msgs.scrollHeight; else msgs.scrollTop = keep;
  }

  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function start() {
    stop();
    timer = setInterval(async () => {
      if (!partner || !active() || document.visibilityState === "hidden") return;
      const before = withMe(partner).length;
      if (await fetchAll() && withMe(partner).length !== before) { paintThread(false); markRead(); }
    }, 8000);
  }
  document.addEventListener("cml:page", e => { if (e.detail && e.detail.page !== "chat") stop(); if (e.detail && e.detail.page === "community" && init() && C.session()) fetchAll().catch(() => {}); });
  document.addEventListener("cml:lang", () => { if (active()) (partner ? paintThread(false) : paintInbox()); });
  document.addEventListener("cml:session", () => { all = []; unread = 0; partner = ""; stop(); if (init() && C.session()) setTimeout(() => fetchAll().catch(() => {}), 1500); });

  window.CMLChat = { entry, open: openInbox, openWith: openThread, unread: () => unread };
})();
