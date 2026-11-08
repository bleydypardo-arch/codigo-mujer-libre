// Código Mujer Libre — "Hoy en Código ML": misión diaria + caja secreta (campaña Primeras 50 fundadoras, Bogotá).
// Necesita supabase/migration_campana_fundadoras.sql. Sin esa migración, el botón simplemente no aparece.
// La campaña solo se muestra a mujeres de Bogotá del 7 de noviembre al 15 de diciembre de 2026 (hora de Bogotá).
// Para ver una vista previa antes: añade ?mision=1 al enlace de la app.
(function () {
  "use strict";
  const START = "2026-11-07", END = "2026-12-15";
  const EL = {
    fe: { e: "🙏", es: "Fe", en: "Faith", mes: "Confiar en Dios y caminar bajo su dirección.", men: "Trusting God and walking under His guidance.", v: "Hebreos 11:1", ve: "Hebrews 11:1" },
    sabiduria: { e: "💎", es: "Sabiduría", en: "Wisdom", mes: "Tomar decisiones con discernimiento y prudencia.", men: "Making decisions with discernment and prudence.", v: "Proverbios 14:1", ve: "Proverbs 14:1" },
    amor: { e: "❤️", es: "Amor", en: "Love", mes: "Amar a Dios, a la familia y al prójimo.", men: "Loving God, family and neighbor.", v: "1 Corintios 13:4-7", ve: "1 Corinthians 13:4-7" },
    fortaleza: { e: "🦋", es: "Fortaleza", en: "Strength", mes: "Enfrentar las dificultades con valentía y perseverancia.", men: "Facing difficulties with courage and perseverance.", v: "Proverbios 31:25", ve: "Proverbs 31:25" },
    proposito: { e: "✨", es: "Propósito", en: "Purpose", mes: "Reconocer los dones que Dios nos ha dado y utilizarlos para hacer el bien.", men: "Recognizing the gifts God has given us and using them to do good.", v: "Efesios 2:10", ve: "Ephesians 2:10" },
    diligencia: { e: "🌸", es: "Diligencia", en: "Diligence", mes: "Trabajar con responsabilidad, excelencia y perseverancia.", men: "Working with responsibility, excellence and perseverance.", v: "Proverbios 31:13-18", ve: "Proverbs 31:13-18" },
    gratitud: { e: "👑", es: "Gratitud", en: "Gratitude", mes: "Reconocer las bendiciones de Dios y vivir con un corazón agradecido.", men: "Recognizing God's blessings and living with a grateful heart.", v: "1 Tesalonicenses 5:18", ve: "1 Thessalonians 5:18" }
  };
  const ORDER = ["fe", "sabiduria", "amor", "fortaleza", "proposito", "diligencia", "gratitud"];
  const sph = k => "lobby/esferas/" + k + ".webp?v=4";
  const sphImg = (k, cls) => EL[k] ? "<img class='" + cls + "' data-fb='" + EL[k].e + "' src='" + sph(k) + "' alt=''>" : "<span class='" + cls + "'>🌸</span>";
  document.addEventListener("error", ev => { const i = ev.target; if (i && i.tagName === "IMG" && i.dataset && i.dataset.fb) { const sp = document.createElement("span"); sp.className = i.className + " ms-fb"; sp.textContent = i.dataset.fb; i.replaceWith(sp); } }, true);
  const ES = {
    msFab: "Misión de hoy", msTitle: "Hoy en Código ML", msSub: "Completa tu misión de hoy: unos 5 minutos que te hacen bien.",
    msBox: "Tu caja secreta", msTapBox: "Toca la caja para abrirla", msContinue: "Seguir con mi misión", msOpen: "Abrir mi caja", msGot: "Hoy te tocó", msCode: "Tu código de hoy", msRead: "Lo leí", msMsg: "Mensaje del día",
    msQ: "La pregunta de hoy", msAct: "Tu plan de hoy", msGo: "Ir ahora", msDone: "¡Día completo!", msDoneT: "Ganaste 1 boleto para los premios del 15 de diciembre.",
    msDays: "Días completos", msTickets: "Boletos", msColl: "Tu colección", msClose: "Cerrar", msErr: "No se pudo guardar. Revisa tu conexión e intenta de nuevo.",
    msRules: "Campaña Primeras 50 fundadoras · Bogotá. Inscripción hasta el 12 de diciembre; los premios se entregan el 15 de diciembre. Cada día completo es un boleto.",
    msFirst: "Abre tu caja primero", msCollDone: "¡Colección completa!"
  };
  const EN = {
    msFab: "Today's mission", msTitle: "Today in Código ML", msSub: "Complete today's mission: about 5 minutes that do you good.",
    msBox: "Your secret box", msTapBox: "Tap the box to open it", msContinue: "Continue my mission", msOpen: "Open my box", msGot: "Today you got", msCode: "Your code for today", msRead: "I read it", msMsg: "Message of the day",
    msQ: "Today's question", msAct: "Your plan for today", msGo: "Go now", msDone: "Day complete!", msDoneT: "You earned 1 ticket for the December 15 prizes.",
    msDays: "Days completed", msTickets: "Tickets", msColl: "Your collection", msClose: "Close", msErr: "Could not save. Check your connection and try again.",
    msRules: "First 50 founders campaign · Bogotá. Sign-up until December 12; prizes are given on December 15. Each completed day is one ticket.",
    msFirst: "Open your box first", msCollDone: "Collection complete!"
  };
  const QUESTIONS = [
    ["¿Playa o montaña?", "Beach or mountains?", "Playa", "Montaña", "Beach", "Mountains"],
    ["¿Emprender o trabajar en una empresa?", "Start a business or work at a company?", "Emprender", "Empresa", "Business", "Company"],
    ["¿Café o té?", "Coffee or tea?", "Café", "Té", "Coffee", "Tea"],
    ["¿Madrugar o trasnochar?", "Early bird or night owl?", "Madrugar", "Trasnochar", "Early bird", "Night owl"],
    ["¿Un plan en casa o salir con amigas?", "A night in or out with friends?", "En casa", "Salir", "Night in", "Out"],
    ["¿Viajar sola o acompañada?", "Travel alone or with company?", "Sola", "Acompañada", "Alone", "With company"],
    ["¿Música tranquila o con ritmo?", "Calm music or upbeat?", "Tranquila", "Con ritmo", "Calm", "Upbeat"],
    ["¿Dulce o salado?", "Sweet or savory?", "Dulce", "Salado", "Sweet", "Savory"],
    ["¿Un libro o una serie?", "A book or a series?", "Libro", "Serie", "Book", "Series"],
    ["¿Masaje o caminata?", "Massage or a walk?", "Masaje", "Caminata", "Massage", "Walk"],
    ["¿Cocinar o pedir domicilio?", "Cook or order in?", "Cocinar", "Domicilio", "Cook", "Order in"],
    ["¿Verano o invierno?", "Summer or winter?", "Verano", "Invierno", "Summer", "Winter"],
    ["¿Ahorrar o darte un gusto?", "Save or treat yourself?", "Ahorrar", "Un gusto", "Save", "Treat myself"],
    ["¿Sorpresa o planeado?", "Surprise or planned?", "Sorpresa", "Planeado", "Surprise", "Planned"]
  ];
  const ACTS = [
    { es: "Entra al spa y escucha una canción", en: "Go to the spa and listen to a song", go: () => window.CMLSpaHall && window.CMLSpaHall.open() },
    { es: "Escríbele a otra mujer de la comunidad", en: "Write to another woman in the community", go: () => window.CMLChat && window.CMLChat.open() },
    { es: "Mira un tour o una experiencia en Bogotá", en: "Look at a tour or experience in Bogotá", go: () => C.showEventsCat("all") },
    { es: "Pasa por el salón de matcha", en: "Stop by the matcha lounge", go: () => window.CMLHall && window.CMLHall.enterBar && window.CMLHall.enterBar() }
  ];
  let C = null, ok = true, row = null, hist = [], busy = false, ov = null, fab = null, loaded = false;
  const init = () => { C = window.CML; if (C && C.addStrings && !init.done) { init.done = true; C.addStrings(ES, EN); } return !!C; };
  const t = k => { const v = C ? C.t(k) : ""; return v || k; };
  const lang = () => (C && C.lang && C.lang() === "en") ? "en" : "es";
  const bogota = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());
  const dayNum = () => { const p = bogota().split("-").map(Number); return Math.floor(Date.UTC(p[0], p[1] - 1, p[2]) / 86400000); };
  const me = () => (C && C.session() && C.session().user.id) || "";
  const demo = () => {
    try { if (/[?&]mision=1/.test(location.search)) localStorage.setItem("cml_mision_preview", "1"); if (/[?&]mision=0/.test(location.search)) localStorage.removeItem("cml_mision_preview"); } catch (e) {}
    let on = false; try { on = localStorage.getItem("cml_mision_preview") === "1"; } catch (e) {}
    const p = C && C.profile && C.profile(); return on || /[?&]mision=1/.test(location.search) || !!(p && (p.role === "admin" || p.role === "super_admin"));
  };
  function enabled() {
    if (!init() || !C.session()) return false;
    const city = String((C.profile() && C.profile().city) || "");
    if (demo()) return true;
    const d = bogota();
    return /bogot/i.test(city) && d >= START && d <= END;
  }
  async function load() {
    if (!enabled()) return false;
    const r = await C.db.from("campaign_days").select("day,element,completed,step_code,step_question,step_activity,answer").eq("user_id", me()).order("day", { ascending: true });
    if (r.error) { ok = false; loaded = true; return false; }
    ok = true; hist = r.data || []; row = hist.find(x => x.day === bogota()) || null; loaded = true; return true;
  }
  const done = () => hist.filter(x => x.completed).length;
  const got = () => ORDER.filter(k => hist.some(x => x.element === k));
  const steps = () => (row ? [row.step_code, row.step_question, row.step_activity].filter(Boolean).length : 0) + (row ? 1 : 0);

  /* La caja ya no flota en la pantalla: vive en el lobby (lobby.js). Aquí solo avisamos su estado. */
  function state() { return { on: !!(enabled() && loaded), done: !!(row && row.completed), steps: steps() }; }
  function paintFab() { try { document.dispatchEvent(new CustomEvent("cml:mission-state", { detail: state() })); } catch (e) {} }
  const h = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function reveal() {
    const L = lang(), w = h("div", "ms-rv");
    const x = h("button", "ms-x ms-rvx", "×"); x.type = "button"; x.setAttribute("aria-label", t("msClose")); x.addEventListener("click", close);
    const stage = h("div", "ms-rvs", "<i class='ms-rvglow'></i><img class='ms-rvbox' src='lobby/caja-sorpresa.webp?v=1' alt=''>");
    const hint = h("p", "ms-rvh", esc(t("msTapBox")));
    w.append(x, h("h2", "", esc(t("msBox"))), stage, hint);
    let busyR = false;
    const go = async () => {
      if (busyR) return; busyR = true; hint.textContent = "…";
      try {
        const r = await C.db.rpc("campaign_open_box"); if (r.error) throw r.error;
        row = r.data; const i = hist.findIndex(z => z.day === row.day); if (i >= 0) hist[i] = row; else hist.push(row);
        const e = EL[row.element] || EL.fe;
        stage.innerHTML = "<i class='ms-rvglow on'></i><img class='ms-rvbox' src='lobby/caja-abierta.webp?v=1' alt=''>" + sphImg(row.element, "ms-rvsph");
        burst(stage); w.classList.add("opened");
        hint.remove();
        const info = h("div", "ms-rvi", "<small>" + esc(t("msGot")) + "</small><b>" + esc(e[L]) + "</b><p>" + esc(L === "en" ? e.men : e.mes) + "</p><em>" + esc(L === "en" ? e.ve : e.v) + "</em>");
        const go2 = h("button", "primary", esc(t("msContinue"))); go2.type = "button"; go2.addEventListener("click", paint); info.appendChild(go2);
        w.appendChild(info); paintFab();
      } catch (er) { busyR = false; const d = er && (er.message || er.details || er.code) ? " (" + String(er.message || er.details || er.code).slice(0, 90) + ")" : ""; hint.textContent = t("msErr") + d; hint.style.animation = "none"; hint.style.fontSize = "13px"; }
    };
    stage.addEventListener("click", go); hint.addEventListener("click", go);
    ov.replaceChildren(w); setTimeout(go, 700);
  }
  function open() {
    if (ov) ov.remove();
    ov = h("div", "ms-ov"); ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-label", t("msTitle"));
    ov.addEventListener("click", e => { if (e.target === ov) close(); });
    document.body.appendChild(ov); reveal(); try { localStorage.setItem("cml_ms_seen_" + me() + "_" + bogota(), "1"); } catch (e) {}
  }
  function close() { if (ov) { ov.remove(); ov = null; } paintFab(); }
  async function act(fn) { if (busy) return; busy = true; try { await fn(); } catch (e) { toast(t("msErr")); } busy = false; }
  function toast(m) { if (!ov) return; const n = h("p", "ms-err", esc(m)); ov.querySelector(".ms-box").appendChild(n); setTimeout(() => n.remove(), 3000); }
  async function openBox(btnEl) {
    const r = await C.db.rpc("campaign_open_box"); if (r.error) throw r.error;
    row = r.data; const i = hist.findIndex(x => x.day === row.day); if (i >= 0) hist[i] = row; else hist.push(row);
    burst(btnEl); setTimeout(paint, 1300);
  }
  async function step(name, answer) {
    const r = await C.db.rpc("campaign_step", { p_step: name, p_answer: answer || null }); if (r.error) throw r.error;
    row = r.data; const i = hist.findIndex(x => x.day === row.day); if (i >= 0) hist[i] = row; paint();
  }
  function burst(host) {
    if (!host) return; host.classList.add("ms-pop");
    for (let i = 0; i < 16; i++) { const s = h("i", "ms-sp", ["✨", "💗", "⭐"][i % 3]); const a = (i / 16) * 6.283, d = 60 + Math.random() * 50; s.style.setProperty("--dx", Math.cos(a) * d + "px"); s.style.setProperty("--dy", Math.sin(a) * d + "px"); host.appendChild(s); setTimeout(() => s.remove(), 1200); }
  }
  function paint() {
    if (!ov) return; const L = lang(), q = QUESTIONS[dayNum() % QUESTIONS.length], a = ACTS[dayNum() % ACTS.length];
    const box = h("div", "ms-box");
    const x = h("button", "ms-x", "×"); x.type = "button"; x.setAttribute("aria-label", t("msClose")); x.addEventListener("click", close); box.appendChild(x);
    box.appendChild(h("h2", "", esc(t("msTitle")))); box.appendChild(h("p", "ms-sub", esc(t("msSub"))));
    box.appendChild(h("div", "ms-stats", "<span><b>" + done() + "</b>" + esc(t("msDays")) + "</span><span><b>" + done() + "</b>" + esc(t("msTickets")) + "</span><span><b>" + got().length + "/7</b>" + esc(t("msColl")) + "</span>"));
    // 1. caja
    const s1 = h("section", "ms-s" + (row ? " ok" : ""));
    s1.appendChild(h("h3", "", "1 · " + esc(t("msBox"))));
    if (!row) { const b = h("button", "ms-gift", "<span>🎁</span><em>" + esc(t("msOpen")) + "</em>"); b.type = "button"; b.addEventListener("click", () => act(() => openBox(b))); s1.appendChild(b); }
    else { const e = EL[row.element] || EL.fe; s1.appendChild(h("div", "ms-open", "<img class='ms-ob' src='lobby/caja-abierta.webp?v=1' alt=''>" + sphImg(row.element, "ms-rise"))); s1.appendChild(h("div", "ms-got", "<div style='text-align:center;width:100%'><small>" + esc(t("msGot")) + "</small><b>" + esc(e[L]) + "</b><p class='ms-mean'>" + esc(L === "en" ? e.men : e.mes) + "</p><small class='ms-verse'>" + esc(L === "en" ? e.ve : e.v) + "</small></div>")); }
    box.appendChild(s1);
    // colección
    const coll = h("div", "ms-coll"); ORDER.forEach(k => { const own = got().includes(k); coll.appendChild(h("span", "ms-c" + (own ? " own" : ""), "<i>" + (own ? sphImg(k, "ms-ci") : "·") + "</i><small>" + esc(EL[k][L]) + "</small>")); }); box.appendChild(coll);
    if (got().length === ORDER.length) box.appendChild(h("p", "ms-win", "🎉 " + esc(t("msCollDone"))));
    // 2. código de hoy
    const dly = window.CMLDaily && window.CMLDaily.today && window.CMLDaily.today(), tx = dly ? dly.text(L) : null, msg = dly && dly.msg ? dly.msg(L) : "";
    const s2 = h("section", "ms-s" + (row && row.step_code ? " ok" : "") + (!row ? " lock" : ""));
    s2.appendChild(h("h3", "", "2 · " + esc(t("msCode"))));
    s2.appendChild(h("p", "ms-q", tx ? "<b>" + esc(tx.aff || "") + "</b><br>" + esc(tx.refl || "") + (tx.verse ? "<br><i>" + esc(tx.verse) + (tx.ref ? " — " + esc(tx.ref) : "") + "</i>" : "") : "✨"));
    if (msg) s2.appendChild(h("p", "ms-msg", "<small>" + esc(t("msMsg")) + "</small> " + esc(msg)));
    if (row && !row.step_code) { const b = h("button", "primary", esc(t("msRead"))); b.type = "button"; b.addEventListener("click", () => act(() => step("code"))); s2.appendChild(b); }
    if (!row) s2.appendChild(h("small", "ms-lockt", esc(t("msFirst"))));
    box.appendChild(s2);
    // 3. pregunta
    const s3 = h("section", "ms-s" + (row && row.step_question ? " ok" : "") + (!row ? " lock" : ""));
    s3.appendChild(h("h3", "", "3 · " + esc(t("msQ")))); s3.appendChild(h("p", "ms-q", esc(L === "en" ? q[1] : q[0])));
    const opts = h("div", "ms-opts"); [L === "en" ? [q[4], q[5]] : [q[2], q[3]]][0].forEach(o => { const b = h("button", "ms-opt" + (row && row.answer === o ? " sel" : ""), esc(o)); b.type = "button"; b.disabled = !row || row.step_question; b.addEventListener("click", () => act(() => step("question", o))); opts.appendChild(b); }); s3.appendChild(opts); box.appendChild(s3);
    // 4. actividad
    const s4 = h("section", "ms-s" + (row && row.step_activity ? " ok" : "") + (!row ? " lock" : ""));
    s4.appendChild(h("h3", "", "4 · " + esc(t("msAct")))); s4.appendChild(h("p", "ms-q", esc(a[L])));
    if (row && !row.step_activity) { const b = h("button", "primary", esc(t("msGo"))); b.type = "button"; b.addEventListener("click", () => act(async () => { await step("activity"); close(); try { a.go(); } catch (e) {} })); s4.appendChild(b); }
    box.appendChild(s4);
    if (row && row.completed) box.appendChild(h("div", "ms-fin", "<b>🎉 " + esc(t("msDone")) + "</b><span>" + esc(t("msDoneT")) + "</span>"));
    box.appendChild(h("p", "ms-rules", esc(t("msRules"))));
    ov.replaceChildren(box);
  }
  async function start() {
    if (!init() || !C.session() || !enabled()) { paintFab(); return; }
    await load(); paintFab();
  }
  document.addEventListener("cml:session", () => { row = null; hist = []; loaded = false; if (ov) close(); paintFab(); setTimeout(() => start().catch(() => {}), 2500); });
  document.addEventListener("cml:lang", () => { if (ov) paint(); paintFab(); });
  window.addEventListener("load", () => setTimeout(() => start().catch(() => {}), 3000));
  window.CMLMission = { open, enabled, state };
})();
