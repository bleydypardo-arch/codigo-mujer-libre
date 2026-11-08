/* Oficina 360°: gira con el dedo, pellizca para acercar, abre las puertas del balcón y sal a ver el mar (con sonido de olas). */
(function () {
  "use strict";
  const IMG = "ventas/img/";
  const en = () => !!(window.CMLI && CMLI.lang === "en");
  const T = {
    es: { open: "Abrir el balcón", out: "Salir al balcón", back: "Volver adentro", close2: "Cerrar las puertas", close: "Cerrar", title: "Mi oficina · 360°", titleR: "Recepción · 360°", hint: "Arrastra para mirar alrededor · pellizca para acercar", door: "Abrir puertas", sea: "Mirar el mar", noGL: "Tu teléfono no puede mostrar el recorrido 360°." },
    en: { open: "Open the balcony", out: "Step onto the balcony", back: "Back inside", close2: "Close the doors", close: "Close", title: "My office · 360°", titleR: "Reception · 360°", hint: "Drag to look around · pinch to zoom", door: "Open doors", sea: "Look at the sea", noGL: "Your phone can't show the 360° tour." }
  };
  const tx = k => T[en() ? "en" : "es"][k];
  /* escenas: x,y = punto en la imagen (%) */
  const WO = { u0: .3, u1: .67, v0: .488, v1: .512, amp: .0008 }, WL = { u0: .26, u1: .47, v0: .495, v1: .506, b0: .516, b1: .55, amp: .0009 };
  const SCENES = {
    cerrada: { k: "closed", src: IMG + "oficina360-cerrada.webp", yaw: 0, hots: [{ x: 48.5, y: 47, l: "door", a: "open" }], wave: 0, water: WO, peek: 0 },
    abierta: { k: "open", src: IMG + "oficina360-abierta.webp", yaw: 0, hots: [{ x: 48.5, y: 47, l: "sea", a: "out" }], wave: 0.06, water: WO, peek: 0 },
    balcon: { k: "out", src: IMG + "oficina360-balcon.webp", yaw: 0, hots: [{ x: 7, y: 50, l: "back", a: "in" }, { x: 92, y: 50, l: "back", a: "in" }], wave: 0.15, water: { u0: .17, u1: .83, v0: .488, v1: .512, b0: .54, b1: .565, amp: .0009 } },
    lobby: { k: "closed", src: IMG + "recepcion360.webp", yaw: -42, hots: [{ x: 36, y: 47, l: "door", a: "open" }], wave: 0, water: WL, peek: -50 },
    lobbyA: { k: "open", src: IMG + "recepcion360-abierta.webp", yaw: -42, hots: [{ x: 36, y: 47, l: "sea", a: "out" }], wave: 0.06, water: WL, peek: -50 },
    terraza: { k: "out", src: IMG + "recepcion360-terraza.webp", yaw: 0, hots: [{ x: 10.5, y: 52, l: "back", a: "in" }, { x: 89, y: 52, l: "back", a: "in" }], wave: 0.15, water: { u0: .14, u1: .86, v0: .482, v1: .512, b0: .53, b1: .55, amp: .0009 } }
  };
  const SET = { mioficina: { closed: "cerrada", open: "abierta", out: "balcon" }, recepcion: { closed: "lobby", open: "lobbyA", out: "terraza" } };
  let room = "mioficina", outOK = {};
  let root, cv, hotsEl, bar, P = null, sc = "cerrada", fov = 78, ptrs = new Map(), g = null, moved = false, raf = 0, busy = false, balconOK = null;
  /* ---- sonido de olas (sintetizado: ruido que sube y baja como el mar) ---- */
  let ac = null, master = null;
  function waves() {
    if (ac) return; try {
      ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.gain.value = 0; master.connect(ac.destination);
      const len = ac.sampleRate * 6, buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0); let last = 0;
      for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
      const layer = (type, freq, depth, rate, ph, gain) => {
        const s = ac.createBufferSource(); s.buffer = buf; s.loop = true; s.loopStart = ph; const f = ac.createBiquadFilter(); f.type = type; f.frequency.value = freq;
        const gn = ac.createGain(); gn.gain.value = gain; const lfo = ac.createOscillator(), ld = ac.createGain(); lfo.frequency.value = rate; ld.gain.value = depth; lfo.connect(ld); ld.connect(gn.gain);
        s.connect(f); f.connect(gn); gn.connect(master); s.start(0, ph); lfo.start();
      };
      layer("lowpass", 480, 0.5, 0.08, 0.3, 0.55); layer("lowpass", 800, 0.35, 0.11, 2.1, 0.35); layer("bandpass", 2200, 0.08, 0.1, 4.0, 0.06);
    } catch (e) { ac = null; }
  }
  const level = v => { if (ac && master) { try { master.gain.cancelScheduledValues(ac.currentTime); master.gain.linearRampToValueAtTime(v, ac.currentTime + 1.6); } catch (e) {} } };
  /* ---- visor ---- */
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  const base = () => { const a = cv.clientWidth / Math.max(1, cv.clientHeight); return a < 1 ? Math.min(100, 2 * Math.atan(Math.tan(32 * Math.PI / 180) / a) * 180 / Math.PI) : 75; };
  function paint() {
    if (!P) return; P.S.fov = Math.max(34, Math.min(Math.min(base() + 14, 105), fov)); P.draw();
    [...hotsEl.children].forEach(b => { const q = P.project(+b.dataset.x, +b.dataset.y); if (!q) { b.style.visibility = "hidden"; return; } b.style.visibility = "visible"; b.style.left = q.x + "px"; b.style.top = q.y + "px"; });
  }
  function load(name, keepView) {
    if (busy) return; busy = true; const S = SCENES[name], im = new Image();
    im.onload = () => {
      const keep = keepView && P ? { yaw: P.S.yaw, pitch: P.S.pitch } : { yaw: S.yaw, pitch: 0 };
      cv.style.opacity = 0;
      setTimeout(() => {
        P = CMLPano(cv, im, { span: 360, yaw: keep.yaw, pitch: keep.pitch, fov: base(), pitchMin: -75, pitchMax: 75, water: S.water });
        if (!P) { root.classList.add("nogl"); busy = false; return; }
        sc = name; fov = base(); setHots(); paint(); cv.style.opacity = 1; level(S.wave); loop(); busy = false; setBar();
      }, P ? 380 : 0);
    };
    im.onerror = () => { busy = false; if (SCENES[name].k === "out") { outOK[name] = false; peek(); } };
    im.src = S.src;
  }
  function loop() { cancelAnimationFrame(raf2); const f = () => { if (!root.classList.contains("on") || !P) return; if (!document.hidden && !g) paint(); raf2 = requestAnimationFrame(f); }; raf2 = requestAnimationFrame(f); }
  let raf2 = 0;
  function setHots() {
    hotsEl.innerHTML = "";
    SCENES[sc].hots.forEach(h => { const b = el("button", "o3-hot", "<span>" + esc(tx(h.l)) + "</span>"); b.type = "button"; b.dataset.x = h.x; b.dataset.y = h.y; b.addEventListener("click", () => { if (!moved) act(h.a); }); hotsEl.appendChild(b); });
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function setBar() {
    bar.innerHTML = "";
    const add = (t, a, cls) => { const b = el("button", cls || "", esc(t)); b.type = "button"; b.addEventListener("click", () => act(a)); bar.appendChild(b); };
    const k = SCENES[sc].k;
    if (k === "closed") add(tx("open"), "open", "pri");
    else if (k === "open") { add(tx("out"), "out", "pri"); add(tx("close2"), "close-door"); }
    else add(tx("back"), "in", "pri");
  }
  /* si no existe la foto del balcón todavía: la cámara se acerca al mar y suben las olas */
  function peek() {
    if (!P) return; const y0 = P.S.yaw, p0 = P.S.pitch, f0 = fov, t0 = performance.now(); level(0.15);
    (function f(t) { const k = Math.min(1, (t - t0) / 1800), e = 1 - Math.pow(1 - k, 3); let dy = ((SCENES[sc].peek - y0 + 540) % 360) - 180; P.S.yaw = y0 + dy * e; P.S.pitch = p0 + (4 - p0) * e; fov = f0 + (46 - f0) * e; paint(); if (k < 1) requestAnimationFrame(f); })(t0);
  }
  function act(a) {
    waves(); if (ac && ac.state === "suspended") ac.resume(); const S = SET[room];
    if (a === "open") load(S.open, true);
    else if (a === "close-door") load(S.closed, true);
    else if (a === "out") { if (outOK[S.out] === false) peek(); else load(S.out, false); }
    else if (a === "in") load(S.open, false);
  }
  function build() {
    root = el("div", "o3"); root.setAttribute("role", "dialog"); root.setAttribute("aria-modal", "true");
    cv = el("canvas", "o3-cv"); hotsEl = el("div", "o3-hots"); bar = el("div", "o3-bar");
    const top = el("div", "o3-top", "<b></b>"); const x = el("button", "o3-x", "×"); x.type = "button"; x.addEventListener("click", close); top.appendChild(x);
    const hint = el("div", "o3-hint"); hint.id = "o3hint";
    root.append(cv, hotsEl, top, hint, bar, el("p", "o3-nogl", ""));
    document.body.appendChild(root);
    root.addEventListener("pointerdown", e => { if (e.target.closest("button")) return; ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); moved = false; const a = [...ptrs.values()]; g = a.length > 1 ? { d0: Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y) || 1, f0: fov } : { x: e.clientX, y: e.clientY, yaw: P ? P.S.yaw : 0, pit: P ? P.S.pitch : 0, vx: 0, vy: 0 }; });
    window.addEventListener("pointermove", e => {
      if (!ptrs.has(e.pointerId) || !g || !P) return; const prev = ptrs.get(e.pointerId); ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); const a = [...ptrs.values()];
      if (a.length > 1 && g.d0) { moved = true; fov = g.f0 * g.d0 / (Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y) || 1); paint(); return; }
      if (g.x == null) return; const dx = e.clientX - g.x, dy = e.clientY - g.y; if (Math.abs(dx) + Math.abs(dy) > 5) moved = true; if (!moved) return;
      const vf = P.S.fov, hf = 2 * Math.atan(Math.tan(vf * Math.PI / 360) * cv.clientWidth / cv.clientHeight) * 180 / Math.PI;
      g.vx = (e.clientX - prev.x) * hf / cv.clientWidth; g.vy = (e.clientY - prev.y) * vf / cv.clientHeight;
      P.S.yaw = g.yaw - dx * hf / cv.clientWidth; P.S.pitch = g.pit + dy * vf / cv.clientHeight; document.getElementById("o3hint").style.opacity = 0; paint();
    });
    const up = e => { if (!ptrs.has(e.pointerId)) return; ptrs.delete(e.pointerId); const had = g; const a = [...ptrs.values()]; g = a.length === 1 ? { x: a[0].x, y: a[0].y, yaw: P.S.yaw, pit: P.S.pitch, vx: 0, vy: 0 } : null; if (had && had.vx != null && moved) inertia(had.vx, had.vy); setTimeout(() => { moved = false; }, 80); };
    window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
    root.addEventListener("wheel", e => { e.preventDefault(); fov *= e.deltaY > 0 ? 1.06 : .94; paint(); }, { passive: false });
    window.addEventListener("resize", () => { if (root.classList.contains("on") && P) { P.size(); paint(); } });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && root.classList.contains("on")) close(); });
  }
  function inertia(vx, vy) { cancelAnimationFrame(raf); const step = () => { vx *= .94; vy *= .94; if (Math.abs(vx) + Math.abs(vy) < .02 || !P || !root.classList.contains("on")) return; P.S.yaw -= vx; P.S.pitch += vy; paint(); raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step); }
  function open(r) {
    if (!root) build(); root.classList.add("on"); room = r === "recepcion" ? "recepcion" : "mioficina"; sc = SET[room].closed; root.querySelector(".o3-top b").textContent = tx(room === "recepcion" ? "titleR" : "title"); const h = document.getElementById("o3hint"); h.textContent = tx("hint"); h.style.opacity = 1; setTimeout(() => { h.style.opacity = 0; }, 7000);
    root.querySelector(".o3-nogl").textContent = tx("noGL");
    waves(); level(SCENES[sc].wave); load(sc, false);
  }
  function close() { if (root) root.classList.remove("on"); level(0); }
  window.CMLOf360 = { open, close };
})();
