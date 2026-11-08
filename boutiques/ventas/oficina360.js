/* Oficina 360°: gira con el dedo, pellizca para acercar, abre las puertas del balcón y sal a ver el mar (con sonido de olas). */
(function () {
  "use strict";
  const IMG = "ventas/img/";
  const en = () => !!(window.CMLI && CMLI.lang === "en");
  const T = {
    es: { open: "Abrir el balcón", out: "Salir al balcón", back: "Volver adentro", close2: "Cerrar las puertas", close: "Cerrar", title: "Mi oficina · 360°", toSofa: "Ir a los sofás", backHall: "Volver al pasillo", toHall: "Ir a las oficinas", toLobby: "Volver al lobby", rMio: "Mi oficina", rRes: "Oficina de reservas", rDemo: "Salón de demos", rPack: "Sala de paquetes", only: "Esta oficina es solo para asesoras.", toDesk: "Ir al mostrador", fwd: "Avanzar", bwd: "Retroceder", titleR: "Recepción · 360°", hint: "Arrastra para mirar alrededor · pellizca para acercar", door: "Abrir puertas", sea: "Mirar el mar", noGL: "Tu teléfono no puede mostrar el recorrido 360°." },
    en: { open: "Open the balcony", out: "Step onto the balcony", back: "Back inside", close2: "Close the doors", close: "Close", title: "My office · 360°", toSofa: "Go to the sofas", backHall: "Back to the hallway", toHall: "Go to the offices", toLobby: "Back to the lobby", rMio: "My office", rRes: "Reservations office", rDemo: "Demo lounge", rPack: "Packages room", only: "This office is for advisors only.", toDesk: "Go to the reception desk", fwd: "Move forward", bwd: "Move back", titleR: "Reception · 360°", hint: "Drag to look around · pinch to zoom", door: "Open doors", sea: "Look at the sea", noGL: "Your phone can't show the 360° tour." }
  };
  const tx = k => T[en() ? "en" : "es"][k];
  /* escenas: x,y = punto en la imagen (%) */
  /* escribe los paquetes dentro de los tres cuadros de la pared */
  function paintPk(ctx, w, h) {
    const k = w / 1774, F = [[580, 764, 262, 470, "GOLD", "#8E6E32", "Tu vitrina de lujo", "Your luxury showcase"], [795, 993, 255, 472, "PLATINUM", "#56627A", "Tu boutique inmersiva", "Your immersive boutique"], [1025, 1241, 252, 471, "DIAMOND", "#2A6F8F", "Tu marca de alta gama", "Your high-end brand"]];
    F.forEach(f => {
      const cx = (f[0] + f[1]) / 2 * k, cy = (f[2] + f[3]) / 2 * k, fw = (f[1] - f[0]) * k, text = en() ? f[7] : f[6];
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = f[5];
      ctx.font = "700 " + Math.round(34 * k) + "px 'Cormorant Garamond', Georgia, serif"; ctx.fillText(f[4], cx, cy - 22 * k);
      ctx.fillStyle = "rgba(43,24,16,.85)"; ctx.font = "italic 500 " + Math.round(20 * k) + "px 'Cormorant Garamond', Georgia, serif";
      const words = text.split(" "), lines = []; let ln = ""; words.forEach(wd => { const t = ln ? ln + " " + wd : wd; if (ctx.measureText(t).width > fw * 0.82 && ln) { lines.push(ln); ln = wd; } else ln = t; }); lines.push(ln);
      lines.forEach((l, i) => ctx.fillText(l, cx, cy + (14 + i * 22) * k));
    });
  }
  const WO = { u0: .3, u1: .67, v0: .488, v1: .512, amp: .0008 }, WL = { u0: .26, u1: .47, v0: .495, v1: .506, b0: .516, b1: .55, amp: .0009 };
  const SCENES = {
    cerrada: { k: "closed", src: IMG + "oficina360-cerrada.webp", yaw: 0, hots: [{ x: 48.5, y: 47, l: "door", a: "open" }], wave: 0, water: WO, peek: 0 },
    abierta: { k: "open", src: IMG + "oficina360-abierta.webp", yaw: 0, hots: [{ x: 48.5, y: 47, l: "sea", a: "out" }], wave: 0.06, water: WO, peek: 0 },
    balcon: { k: "out", src: IMG + "oficina360-balcon.webp", yaw: 0, hots: [{ x: 7, y: 50, l: "back", a: "in" }, { x: 92, y: 50, l: "back", a: "in" }], wave: 0.15, water: { u0: .17, u1: .83, v0: .488, v1: .512, b0: .54, b1: .565, amp: .0009 } },
    lobby: { k: "closed", src: IMG + "recepcion360.webp", yaw: -42, hots: [{ x: 36, y: 47, l: "door", a: "open" }, { x: 20, y: 72, l: "toSofa", to: "lobby2", yaw: 0 }, { x: 96, y: 60, l: "toHall", to: "pasillo", yaw: 0 }], wave: 0, water: WL, peek: -50 },
    lobbyA: { k: "open", src: IMG + "recepcion360-abierta.webp", yaw: -42, hots: [{ x: 36, y: 47, l: "sea", a: "out" }, { x: 20, y: 72, l: "toSofa", to: "lobby2", yaw: 0 }, { x: 96, y: 60, l: "toHall", to: "pasillo", yaw: 0 }], wave: 0.06, water: WL, peek: -50 },
    lobby2: { k: "pt", src: IMG + "recepcion360-sofas.webp", yaw: 0, hots: [{ x: 50, y: 56, l: "sea", a: "out" }, { x: 79, y: 70, l: "toDesk", to: "lobby", yaw: 55 }, { x: 96, y: 60, l: "toHall", to: "pasillo", yaw: 0 }], wave: 0, water: { u0: .31, u1: .69, v0: .498, v1: .512, b0: .522, b1: .54, amp: .0009 }, peek: 0 },
    pasillo: { k: "pt", src: IMG + "recepcion360-pasillo.webp", yaw: 0, peek: 0, wave: 0, hots: [{ x: 7, y: 62, l: "toLobby", to: "lobby", yaw: 60 }, { x: 32, y: 55, l: "rMio", room: "mioficina" }, { x: 68, y: 55, l: "rRes", room: "oficina" }, { x: 44, y: 52, l: "rDemo", room: "salon" }, { x: 90, y: 52, l: "rPack", to: "paq360", yaw: 0 }] },
    paq360: { k: "pt", src: IMG + "paquetes360.webp", yaw: 0, peek: 0, wave: 0, paint: paintPk, water: { u0: .09, u1: .3, v0: .495, v1: .51, b0: .525, b1: .56, amp: .0008 },
      hots: [{ x: 37.9, y: 50, l: "GOLD", room: "paquetes", raw: 1 }, { x: 50.4, y: 50, l: "PLATINUM", room: "paquetes", raw: 1 }, { x: 63.9, y: 50, l: "DIAMOND", room: "paquetes", raw: 1 }, { x: 3, y: 60, l: "backHall", to: "pasillo", yaw: 0 }] },
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
  function load(name, keepView, yawOv) {
    if (busy) return; busy = true; const S = SCENES[name], im = new Image();
    im.onload = () => {
      let src = im; if (S.paint) { const c2 = document.createElement("canvas"); c2.width = im.naturalWidth; c2.height = im.naturalHeight; const x2 = c2.getContext("2d"); x2.drawImage(im, 0, 0); try { S.paint(x2, c2.width, c2.height); src = c2; } catch (e) {} }
      const keep = keepView && P ? { yaw: P.S.yaw, pitch: P.S.pitch } : { yaw: yawOv != null ? yawOv : S.yaw, pitch: 0 };
      cv.style.opacity = 0;
      setTimeout(() => {
        P = CMLPano(cv, src, { span: 360, yaw: keep.yaw, pitch: keep.pitch, fov: base(), pitchMin: -75, pitchMax: 75, water: S.water });
        if (!P) { root.classList.add("nogl"); busy = false; return; }
        sc = name; fov = base(); setHots(); paint(); cv.style.opacity = 1; level(S.wave); loop(); busy = false; setBar();
      }, P ? 380 : 0);
    };
    im.onerror = () => { busy = false; if (SCENES[name].k === "out") { outOK[name] = false; peek(); } };
    im.src = S.src;
  }
  function zoomTo(t) { t = Math.max(34, Math.min(Math.min(base() + 14, 105), t)); const f0 = fov, t0 = performance.now(); (function f(now) { const k = Math.min(1, (now - t0) / 900), e = 1 - Math.pow(1 - k, 3); fov = f0 + (t - f0) * e; paint(); if (k < 1) requestAnimationFrame(f); })(t0); }
  function loop() { cancelAnimationFrame(raf2); const f = () => { if (!root.classList.contains("on") || !P) return; if (!document.hidden && !g) paint(); raf2 = requestAnimationFrame(f); }; raf2 = requestAnimationFrame(f); }
  let raf2 = 0;
  function goRoom(id) {
    if (window.CMLCanGo && !CMLCanGo(id)) { let t = root.querySelector(".o3-toast"); if (!t) { t = el("p", "o3-toast"); root.appendChild(t); } t.textContent = tx("only"); t.classList.add("on"); clearTimeout(goRoom.t); goRoom.t = setTimeout(() => t.classList.remove("on"), 3200); return; }
    close(); if (window.CMLGoRoom) CMLGoRoom(id);
  }
  function setHots() {
    hotsEl.innerHTML = "";
    SCENES[sc].hots.forEach(h => { const b = el("button", "o3-hot" + (h.to ? " go" : ""), (h.to ? "<i>➜</i>" : "") + "<span>" + esc(h.raw ? h.l : tx(h.l)) + "</span>"); b.type = "button"; b.dataset.x = h.x; b.dataset.y = h.y; b.addEventListener("click", () => { if (moved) return; if (h.room) { goRoom(h.room); return; } if (h.to) { waves(); load(h.to, false, h.yaw); } else act(h.a); }); hotsEl.appendChild(b); });
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function setBar() {
    bar.innerHTML = "";
    const add = (t, a, cls) => { const b = el("button", cls || "", esc(t)); b.type = "button"; b.addEventListener("click", () => act(a)); bar.appendChild(b); };
    const k = SCENES[sc].k; if (k === "pt") return;
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
    const walk = el("div", "o3-walk"); const wf = el("button", "", "▲"), wb = el("button", "", "▼"); wf.type = wb.type = "button"; wf.setAttribute("aria-label", tx("fwd")); wb.setAttribute("aria-label", tx("bwd")); wf.title = tx("fwd"); wb.title = tx("bwd");
    wf.addEventListener("click", () => zoomTo(fov * 0.62)); wb.addEventListener("click", () => zoomTo(fov * 1.6)); walk.append(wf, wb);
    root.append(cv, hotsEl, top, hint, walk, bar, el("p", "o3-nogl", ""));
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
