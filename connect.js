// Community: member cards, profile sheet and "Saludar" (greet → accept → connected).
// Works without the database update: if the connections table is missing, cards still show and the greet button is hidden.
(function () {
  "use strict";
  const ES = {
    cnShareBtn: n => "Compartir mi WhatsApp con " + n, cnShareAsk: "Es opcional. Solo verán el número si las dos eligen compartirlo.",
    cnShareWait: n => "Compartiste tu WhatsApp. Esperando a que " + n + " también lo comparta.", cnShareTheir: n => n + " ya compartió su WhatsApp contigo. Si tú también quieres, compártelo.",
    cnWa: n => "Escribir a " + n + " por WhatsApp", cnShareStop: "Dejar de compartir", cnShareFail: "No se pudo. Intenta de nuevo.",
    cnSafe: "Antes de verse: lugar público y avisa a alguien de confianza.",
    cnHello: "Saludar", cnSent: "Saludo enviado", cnConnected: "Conectadas", cnYou: "Eres tú",
    cnDreamLabel: "Su sueño", cnDoesLabel: "Se dedica a", cnInterests: "Le interesa", cnClose: "Cerrar",
    cnNoInfo: "Aún no ha contado su sueño.", cnFail: "No se pudo enviar. Intenta de nuevo.",
    cnIncomingTitle: "Quieren conocerte", cnAccept: "Aceptar", cnLater: "Ahora no",
    cnWants: n => n + " quiere conocerte.", cnNowConnected: n => "Ahora estás conectada con " + n + ".",
    cnSentNote: n => "Le avisamos a " + n + ". Si acepta, quedan conectadas.",
    cnOpen: n => "Ver perfil de " + n,
    ntGreet: n => "👋 " + n + " quiere conocerte."
  };
  const EN = {
    cnShareBtn: n => "Share my WhatsApp with " + n, cnShareAsk: "It's optional. You only see each other's number if you both choose to share.",
    cnShareWait: n => "You shared your WhatsApp. Waiting for " + n + " to share hers too.", cnShareTheir: n => n + " shared her WhatsApp with you. Share yours too if you'd like.",
    cnWa: n => "Message " + n + " on WhatsApp", cnShareStop: "Stop sharing", cnShareFail: "Could not do that. Please try again.",
    cnSafe: "Before meeting: public place, and tell someone you trust.",
    cnHello: "Say hi", cnSent: "Greeting sent", cnConnected: "Connected", cnYou: "This is you",
    cnDreamLabel: "Her dream", cnDoesLabel: "What she does", cnInterests: "Interested in", cnClose: "Close",
    cnNoInfo: "She hasn't shared her dream yet.", cnFail: "Could not send. Please try again.",
    cnIncomingTitle: "They want to meet you", cnAccept: "Accept", cnLater: "Not now",
    cnWants: n => n + " wants to meet you.", cnNowConnected: n => "You are now connected with " + n + ".",
    cnSentNote: n => "We let " + n + " know. If she accepts, you're connected.",
    cnOpen: n => "View " + n + "'s profile",
    ntGreet: n => "👋 " + n + " wants to meet you."
  };
  let C = null, enabled = true, links = new Map(), byId = new Map(), loaded = false;
  const t = (k, ...a) => { const v = C ? C.t(k) : ""; return typeof v === "function" ? v(...a) : (v || k); };
  const el = (...a) => C.el(...a);
  const me = () => (C && C.session() && C.session().user.id) || "";
  const changed = () => document.dispatchEvent(new Event("cml:connections"));

  function init() { C = window.CML; if (C && C.addStrings && !init.done) { init.done = true; C.addStrings(ES, EN); } return !!C; }

  async function load(members) {
    if (!init() || !C.session()) return;
    byId = new Map((members || []).filter(m => m.id).map(m => [m.id, m]));
    try {
      const r = await C.db.from("connections").select("id,from_user,to_user,status,created_at,from_share,to_share");
      if (r.error) { enabled = false; links = new Map(); return; }
      enabled = true; links = new Map();
      (r.data || []).forEach(x => links.set(x.from_user === me() ? x.to_user : x.from_user, x));
    } catch { enabled = false; }
    loaded = true;
  }
  const stateOf = id => {
    if (id === me()) return "me";
    const l = links.get(id);
    if (!l) return "none";
    if (l.status === "accepted") return "connected";
    if (l.status === "declined") return l.from_user === me() ? "sent" : "none";
    return l.from_user === me() ? "sent" : "incoming";
  };
  async function needPhoto() { if (window.CMLWelcome && !(await window.CMLWelcome.ensurePhoto())) throw new Error("nophoto"); }
  async function greet(m) {
    await needPhoto();
    const r = await C.db.from("connections").insert({ from_user: me(), to_user: m.id }).select("id,from_user,to_user,status,created_at,from_share,to_share").single();
    if (r.error) throw r.error;
    links.set(m.id, r.data); changed();
  }
  async function answer(m, status) {
    if (status === "accepted") await needPhoto();
    const l = links.get(m.id); if (!l) return;
    const r = await C.db.from("connections").update({ status }).eq("id", l.id);
    if (r.error) throw r.error;
    l.status = status; changed();
  }

  const mine = l => (l.from_user === me() ? l.from_share : l.to_share);
  const theirs = l => (l.from_user === me() ? l.to_share : l.from_share);
  async function setShare(m, on) {
    const r = await C.db.rpc("share_whatsapp", { p_other: m.id, p_share: on });
    if (r.error) throw r.error;
    const l = links.get(m.id);
    if (l) { if (l.from_user === me()) l.from_share = on; else l.to_share = on; }
    changed();
  }
  function waLink(phone) {
    let d = String(phone || "").replace(/\D/g, "");
    if (d.length === 10) d = (d[0] === "3" ? "57" : "1") + d;   // 10 digits: Colombian mobile (3xx) or US
    return d.length >= 11 ? "https://wa.me/" + d : "";
  }
  function shareNode(m) {
    const l = links.get(m.id);
    if (!l || l.status !== "accepted") return null;
    const box = el("div", { class: "cn-share" });
    const msg = el("p", { class: "cn-note", role: "status" });
    const ask = async on => { try { await setShare(m, on); } catch { msg.textContent = t("cnShareFail"); } };
    if (mine(l) && theirs(l)) {
      box.appendChild(el("p", { class: "cn-note", text: t("cnSafe") }));
      C.db.rpc("connection_phone", { p_other: m.id }).then(r => {
        const phone = r.data; if (!phone) return;
        const href = waLink(phone);
        const wrap = el("div", { class: "cn-act" });
        if (href) wrap.appendChild(el("a", { class: "primary cn-wa", href, target: "_blank", rel: "noopener noreferrer", text: "💬 " + t("cnWa", m.first_name) }));
        wrap.appendChild(el("span", { class: "cn-phone", text: phone }));
        box.insertBefore(wrap, box.firstChild);
      }).catch(() => {});
    } else if (mine(l)) {
      box.appendChild(el("p", { class: "cn-note", text: t("cnShareWait", m.first_name) }));
    } else {
      if (theirs(l)) box.appendChild(el("p", { class: "cn-note", text: t("cnShareTheir", m.first_name) }));
      const b = el("button", { type: "button", class: "primary", text: "💬 " + t("cnShareBtn", m.first_name) });
      b.addEventListener("click", () => { b.disabled = true; ask(true); });
      box.append(el("div", { class: "cn-act" }, b), el("p", { class: "cn-note", text: t("cnShareAsk") }));
    }
    if (mine(l)) {
      const stop = el("button", { type: "button", class: "link-btn", text: t("cnShareStop") });
      stop.addEventListener("click", () => { stop.disabled = true; ask(false); });
      box.appendChild(stop);
    }
    box.appendChild(msg);
    return box;
  }

  function clip(s, n) { s = String(s || "").trim(); return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s; }
  function avatar(m, cls) {
    return window.CMLProfile ? window.CMLProfile.avatarNode(m.avatar_path || null, m.first_name, cls) : el("span", { class: "avatar " + cls, text: (m.first_name || "?").charAt(0).toUpperCase() });
  }
  function badge(m) {
    const s = stateOf(m.id);
    if (s === "connected") return el("span", { class: "cn-badge ok", text: "✓ " + t("cnConnected") });
    if (s === "sent") return el("span", { class: "cn-badge", text: t("cnSent") });
    return null;
  }

  function card(m) {
    init();
    const tier = C.hostTier ? C.hostTier(m.id) : "";
    const b = el("button", { type: "button", class: "mcard" + (tier ? " has-tier tier-" + tier : ""), "aria-label": t("cnOpen", m.first_name) },
      avatar(m, "avatar-card"),
      el("b", { class: "mcard-name", text: m.first_name }),
      C.hostBadge ? C.hostBadge(m.id) : null,
      m.city ? el("small", { class: "mcard-city", text: m.city }) : null,
      window.CMLJobs && window.CMLJobs.label(m.occupation) ? el("small", { class: "mcard-job", text: window.CMLJobs.label(m.occupation) }) : null,
      m.dream ? el("em", { class: "mcard-dream", text: "“" + clip(m.dream, 70) + "”" }) : null,
      badge(m));
    b.addEventListener("click", () => openSheet(m));
    return b;
  }

  function openSheet(m) {
    init();
    closeSheet();
    const prev = document.activeElement;
    const close = el("button", { type: "button", class: "cn-x", "aria-label": t("cnClose"), text: "×" });
    const note = el("p", { class: "cn-note", role: "status" });
    const act = el("div", { class: "cn-act" });
    const paintAct = () => {
      act.replaceChildren(); note.textContent = "";
      const s = stateOf(m.id);
      if (s === "me") return act.appendChild(el("span", { class: "cn-badge", text: t("cnYou") }));
      if (s === "connected") {
        act.appendChild(el("span", { class: "cn-badge ok", text: "✓ " + t("cnConnected") }));
        if (window.CMLChat) { const wr = el("button", { type: "button", class: "primary cn-chat", text: "💬 " + C.t("chWrite") + " " + m.first_name }); wr.addEventListener("click", () => { closeSheet(); window.CMLChat.openWith(m.id); }); act.appendChild(wr); }
        const sh = shareNode(m); if (sh) act.appendChild(sh); return;
      }
      if (s === "sent") { act.appendChild(el("span", { class: "cn-badge", text: t("cnSent") })); note.textContent = t("cnSentNote", m.first_name); return; }
      if (!enabled) return;
      if (s === "incoming") {
        const ok = el("button", { type: "button", class: "primary", text: t("cnAccept") });
        const no = el("button", { type: "button", class: "secondary", text: t("cnLater") });
        ok.addEventListener("click", async () => { try { await answer(m, "accepted"); note.textContent = t("cnNowConnected", m.first_name); paintAct(); note.textContent = t("cnNowConnected", m.first_name); } catch (e) { note.textContent = e && e.message === "nophoto" ? "" : t("cnFail"); } });
        no.addEventListener("click", async () => { try { await answer(m, "declined"); closeSheet(); } catch { note.textContent = t("cnFail"); } });
        return act.append(ok, no);
      }
      const hi = el("button", { type: "button", class: "primary cn-hi", text: "👋 " + t("cnHello") });
      hi.addEventListener("click", async () => {
        hi.disabled = true;
        try { await greet(m); paintAct(); } catch (e) { hi.disabled = false; note.textContent = e && e.message === "nophoto" ? "" : t("cnFail"); }
      });
      act.appendChild(hi);
    };
    const chips = (m.interests || []).map(c => C.codeLabels[c] ? t(C.codeLabels[c]) : c);
    const row = (label, val) => val ? el("div", { class: "cn-row" }, el("small", { text: label }), el("p", { text: val })) : null;
    const body = el("div", { class: "cn-body" },
      avatar(m, "avatar-lg"),
      el("h3", { text: m.first_name }),
      C.hostBadge ? C.hostBadge(m.id, "big") : null,
      m.city ? el("p", { class: "cn-city", text: m.city }) : null,
      row(t("cnDoesLabel"), window.CMLJobs ? window.CMLJobs.label(m.occupation) : ""),
      m.dream ? el("blockquote", { class: "cn-dream" }, el("small", { text: t("cnDreamLabel") }), el("p", { text: m.dream })) : el("p", { class: "meta", text: t("cnNoInfo") }),
      row(t("cnInterests"), chips.join(" · ")),
      act, note, window.CMLCommunity ? window.CMLCommunity.memberLinks(m) : null);
    const sheet = el("div", { class: "cn-sheet", role: "dialog", "aria-modal": "true", "aria-label": m.first_name }, close, body);
    const wrap = el("div", { class: "cn-wrap", id: "cnWrap" }, sheet);
    wrap.addEventListener("click", e => { if (e.target === wrap) closeSheet(prev); });
    close.addEventListener("click", () => closeSheet(prev));
    wrap.addEventListener("keydown", e => { if (e.key === "Escape") closeSheet(prev); });
    document.body.appendChild(wrap); paintAct(); close.focus();
    document.addEventListener("cml:connections", paintAct);
    wrap._off = () => document.removeEventListener("cml:connections", paintAct);
  }
  function closeSheet(focus) {
    const w = document.getElementById("cnWrap");
    if (w) { if (w._off) w._off(); w.remove(); if (focus && focus.focus) focus.focus(); }
  }

  // Block at the top of Community: greetings waiting for an answer.
  function incoming() {
    if (!init()) return null;
    if (!enabled || !loaded) return null;
    const rows = [...links.entries()].filter(([id, l]) => l.status === "pending" && l.to_user === me() && byId.has(id)).map(([id]) => byId.get(id));
    if (!rows.length) return null;
    const box = el("div", { class: "card cn-incoming" }, el("b", { text: "👋 " + t("cnIncomingTitle") }));
    rows.forEach(m => {
      const ok = el("button", { type: "button", class: "primary", text: t("cnAccept") });
      const no = el("button", { type: "button", class: "secondary", text: t("cnLater") });
      const row = el("div", { class: "cn-in-row" }, avatar(m, "avatar-sm"),
        el("span", { class: "cn-in-txt" }, el("b", { text: m.first_name }), m.dream ? el("small", { text: clip(m.dream, 60) }) : (m.city ? el("small", { text: m.city }) : null)),
        el("span", { class: "cn-in-btns" }, ok, no));
      ok.addEventListener("click", async () => { ok.disabled = true; try { await answer(m, "accepted"); } catch { ok.disabled = false; } });
      no.addEventListener("click", async () => { no.disabled = true; try { await answer(m, "declined"); } catch { no.disabled = false; } });
      box.appendChild(row);
    });
    return box;
  }
  function pending() {
    if (!enabled || !loaded) return [];
    return [...links.entries()].filter(([id, l]) => l.status === "pending" && l.to_user === me() && byId.has(id))
      .map(([id, l]) => ({ at: new Date(l.created_at).getTime(), name: byId.get(id).first_name }));
  }

  const connectedList = () => [...links.entries()].filter(([id, l]) => l.status === "accepted" && byId.has(id)).map(([id]) => byId.get(id));
  window.CMLConnect = { member: id => byId.get(id) || null, connected: connectedList, nameOf: id => (byId.get(id) || {}).first_name || "", load, card, incoming, pending, openSheet };
})();
