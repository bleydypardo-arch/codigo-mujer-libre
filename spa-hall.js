// Código Mujer Libre — SPA & WELLNESS (imagen 3). Botón SPA brillante → entra directo al Spa Virtual (Bienvenida + nombre). WELLNESS: en construcción.
(function () {
"use strict";
let C, t;
const W = 1086, H = 1448;
let page, root, stage, built = false, box = null, spDock = null;
function mk(cls, html, tag) { const n = document.createElement(tag || "div"); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
function init() {
C = window.CML; if (!C) return; t = k => C.t(k);
C.addStrings({
  spHome: "Inicio", spHall: "Hall de Experiencias", spGo: "Spa", spGoS: "Entrar al spa virtual", spWell: "Wellness", spWellS: "En construcción", spBack: "Volver al spa", spClose: "Salir del spa",
  spWellT: "Wellness · Muy pronto", spWellBody: "La sala Wellness está en construcción. Muy pronto podrás vivir aquí la biblioteca, las charlas y todo lo que tenemos en bienestar.", spWellOld: "Ver Bienestar actual",
  spNoAcc: "El Spa Virtual es un espacio premium. Pronto te contamos cómo entrar.", spLoad: "Preparando tu spa…"
}, {
  spHome: "Home", spHall: "Experiences Hall", spGo: "Spa", spGoS: "Enter the virtual spa", spWell: "Wellness", spWellS: "Under construction", spBack: "Back to the spa", spClose: "Leave the spa",
  spWellT: "Wellness · Coming soon", spWellBody: "The Wellness room is under construction. Soon you will live here the library, the talks and everything we have in wellness.", spWellOld: "See current Wellness",
  spNoAcc: "The Virtual Spa is a premium space. We will tell you soon how to enter.", spLoad: "Preparing your spa…"
});
const FX = '<div class="sp-fx" aria-hidden="true">'
  + '<div class="sp-sea"><i></i><i class="b"></i><b></b></div>'
  + '<div class="sp-pool"><i></i><i class="b"></i><s></s><s class="b"></s></div>'
  + '<div class="sp-fall sp-f1"><i></i><b></b></div>'
  + '<div class="sp-fall sp-f2"><i></i><b></b></div>'
  + '<div class="sp-mist"></div>'
  + '</div>';
function build() {
  if (built) return;
  page = document.getElementById("spaglobal"); if (!page) return;
  page.innerHTML = '<div class="page-back"><button type="button" class="back-btn" data-go="home"><svg class="ci" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 6l-6 6 6 6"/></svg></button></div>';
  root = mk("sp-root"); stage = mk("sp-stage");
  const img = new Image(); img.src = "lobby/spa.webp?v=20261029x"; img.alt = ""; img.decoding = "async"; stage.appendChild(img);
  stage.appendChild(mk("", FX).firstChild);
  const spa = mk("sp-zone sp-spa", '<span class="sp-ring"></span><span class="sp-pill"><b></b><small></small></span>', "button"); spa.type = "button"; spa.dataset.k = "spa";
  const well = mk("sp-zone sp-well", '<span class="sp-pill soft"><b></b><small></small></span>', "button"); well.type = "button"; well.dataset.k = "well";
  spa.addEventListener("click", enterSpa); well.addEventListener("click", wellSoon);
  stage.appendChild(spa); stage.appendChild(well);
  const snd = mk("sp-snd", '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path class="w" d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.500 8.500 0 0 1 0 12"/></svg>', "button"); snd.type = "button"; snd.setAttribute("aria-pressed", "true");
  snd.addEventListener("click", () => { window.CMLSpaMute = MUS.on; musicSet(!MUS.on); }); stage.appendChild(snd);
  root.appendChild(stage); page.appendChild(root); built = true; if (window.CMLScene) { window.CMLScene.fill(root, "spa"); spDock = window.CMLScene.dock(root, [
    { cls: "ghost", label: () => t("spHome"), go: () => C.showPage("home") },
    { cls: "green", label: () => t("spHall"), go: () => { if (window.CMLHall) window.CMLHall.open(); } }]); }
  fit(); if (window.ResizeObserver) new ResizeObserver(fit).observe(root); else addEventListener("resize", fit);
  paint();
}
function fit() { if (!root || !stage) return; if (window.CMLScene) { window.CMLScene.fit(root, stage, W, H); if (root.__upd) root.__upd(); return; } const w = root.clientWidth || 390, s = w / W; stage.style.transform = "scale(" + s + ")"; root.style.height = Math.round(H * s) + "px"; }
function shrink(el, max, min) { el.style.fontSize = max + "px"; let s = max; while (s > min && el.scrollWidth > el.clientWidth + 1) { s -= 1; el.style.fontSize = s + "px"; } }
function paint() {
  if (!built) return;
  const a = stage.querySelector(".sp-spa"), b = stage.querySelector(".sp-well");
  a.querySelector("b").textContent = t("spGo"); a.querySelector("small").textContent = t("spGoS"); a.setAttribute("aria-label", t("spGo"));
  b.querySelector("b").textContent = t("spWell"); b.querySelector("small").textContent = t("spWellS"); b.setAttribute("aria-label", t("spWell") + " · " + t("spWellS"));
  stage.querySelectorAll(".sp-pill b").forEach(el => shrink(el, 56, 24));
  stage.querySelectorAll(".sp-pill small").forEach(el => shrink(el, 26, 14));
  page.querySelector(".back-btn").setAttribute("aria-label", t("hlBack") || "Volver"); if (spDock && spDock.__paint) spDock.__paint();
}

/* ---- música de spa: piano muy suave + cuenco + agua (generada, sin archivos) ---- */
const MUS = { ac: null, g: null, rv: null, on: false, timers: [], water: null, idx: 0 };
function impulse(ac, sec) { const n = Math.floor(ac.sampleRate * sec), b = ac.createBuffer(2, n, ac.sampleRate); for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.6); } return b; }
function musCtx() {
  if (!MUS.ac) {
    const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; const ac = MUS.ac = new A();
    MUS.g = ac.createGain(); MUS.g.gain.value = 0; MUS.g.connect(ac.destination);
    MUS.rv = ac.createConvolver(); MUS.rv.buffer = impulse(ac, 3.2); const wet = ac.createGain(); wet.gain.value = .5; MUS.rv.connect(wet); wet.connect(MUS.g);
    MUS.bus = ac.createGain(); MUS.bus.gain.value = 1; const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2400; MUS.bus.connect(lp); lp.connect(MUS.g); lp.connect(MUS.rv);
    // agua: ruido suave filtrado que sube y baja despacio
    const n = ac.sampleRate * 4, nb = ac.createBuffer(1, n, ac.sampleRate), d = nb.getChannelData(0); let l = 0; for (let i = 0; i < n; i++) { const w = Math.random() * 2 - 1; l = (l + .04 * w) / 1.04; d[i] = l * 9; }
    const src = ac.createBufferSource(); src.buffer = nb; src.loop = true; const bp = ac.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 700; bp.Q.value = .6;
    const wg = ac.createGain(); wg.gain.value = .10; const lfo = ac.createOscillator(), lg = ac.createGain(); lfo.frequency.value = .13; lg.gain.value = .04; lfo.connect(lg); lg.connect(wg.gain); lfo.start();
    src.connect(bp); bp.connect(wg); wg.connect(MUS.g); src.start(); MUS.water = wg;
  }
  if (MUS.ac.state === "suspended") MUS.ac.resume(); return MUS.ac;
}
const N = { C3: 130.81, G3: 196, C4: 261.63, D4: 293.66, E4: 329.63, G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99 };
function piano(f, t0, v) {
  const ac = MUS.ac, g = ac.createGain();
  g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(v, t0 + .012); g.gain.exponentialRampToValueAtTime(.0008, t0 + 4.2);
  [[1, 1], [2, .28], [3, .08], [4.01, .03]].forEach(([m, a]) => { const o = ac.createOscillator(), og = ac.createGain(); o.type = "sine"; o.frequency.value = f * m; og.gain.value = a; o.connect(og); og.connect(g); o.start(t0); o.stop(t0 + 4.3); });
  g.connect(MUS.bus);
}
function bowl(t0) {
  const ac = MUS.ac, g = ac.createGain(); g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(.05, t0 + .08); g.gain.exponentialRampToValueAtTime(.0006, t0 + 9);
  [[1, 1], [2.76, .35], [5.4, .12]].forEach(([m, a]) => { const o = ac.createOscillator(), og = ac.createGain(); o.type = "sine"; o.frequency.value = 196 * m; og.gain.value = a; o.connect(og); og.connect(g); o.start(t0); o.stop(t0 + 9.2); });
  g.connect(MUS.bus);
}
const NX = { D3: 146.83, A3: 220, B3: 246.94, "F#3": 185, D4: 293.66, "F#4": 369.99, A4: 440, B4: 493.88, "C#5": 554.37, D5: 587.33, E5: 659.25, "F#5": 739.99 };
const MEL2 = ["F#4", "A4", "B4", "A4", "F#4", "E5", "D5", "C#5", "A4", "B4", "F#4", "D4", "A4", "D5", "C#5", "B4"];
const MEL = ["E4", "G4", "A4", "D5", "C5", "G4", "E4", "D4", "G4", "A4", "E5", "D5", "C5", "A4", "G4", "E4"];
function step2() {
  if (!MUS.on || !MUS.ac || MUS.mode !== 2) return; const t0 = MUS.ac.currentTime + .05, i = MUS.idx++;
  if (i % 3 === 0) piano(i % 6 === 0 ? NX.D3 : NX["F#3"], t0, .085);
  if (i % 3 === 1) { piano(NX.A3, t0, .05); piano(NX["F#4"], t0 + .04, .04); }
  piano(NX[MEL2[i % MEL2.length]], t0 + .1, .06 + Math.random() * .02);
  MUS.timers.push(setTimeout(step2, 2300 + Math.random() * 900));
}
function step() {
  if (!MUS.on || !MUS.ac || MUS.mode === 2) return; const t0 = MUS.ac.currentTime + .05, i = MUS.idx++;
  piano(N[MEL[i % MEL.length]], t0, .05 + Math.random() * .025);
  if (i % 4 === 0) piano(i % 8 === 0 ? N.C3 : N.G3, t0, .06);            // nota grave, lenta
  if (i % 6 === 3) piano(N[MEL[(i + 3) % MEL.length]] * 1, t0 + .35, .035);
  if (i % 14 === 6) bowl(t0 + .2);
  MUS.timers.push(setTimeout(step, 1900 + Math.random() * 1500));
}
function musicSet(on) {
  if (on) { if (!window.CMLSpaMute && musCtx()) { MUS.on = true; MUS.g.gain.cancelScheduledValues(MUS.ac.currentTime); MUS.g.gain.linearRampToValueAtTime(.8, MUS.ac.currentTime + 4); if (!MUS.timers.length) step(); } }
  else if (MUS.ac) { MUS.on = false; MUS.timers.forEach(clearTimeout); MUS.timers = []; MUS.g.gain.cancelScheduledValues(MUS.ac.currentTime); MUS.g.gain.linearRampToValueAtTime(0, MUS.ac.currentTime + 1.5); }
  const b = stage && stage.querySelector(".sp-snd"); if (b) { b.classList.toggle("off", !MUS.on); b.setAttribute("aria-pressed", String(MUS.on)); }
}
/* música clásica suave para otras experiencias (Atelier): piano lento, sin agua */
window.CMLSoftMusic = {
  start() { if (!musCtx()) return; MUS.mode = 2; MUS.on = true; MUS.water.gain.value = 0; MUS.g.gain.cancelScheduledValues(MUS.ac.currentTime); MUS.g.gain.linearRampToValueAtTime(.8, MUS.ac.currentTime + 3); MUS.timers.forEach(clearTimeout); MUS.timers = []; step2(); },
  stop() { if (!MUS.ac) return; MUS.on = false; MUS.mode = 0; MUS.timers.forEach(clearTimeout); MUS.timers = []; MUS.g.gain.cancelScheduledValues(MUS.ac.currentTime); MUS.g.gain.linearRampToValueAtTime(0, MUS.ac.currentTime + 1.2); setTimeout(() => { if (MUS.water) MUS.water.gain.value = .10; }, 1400); },
  ctx() { return MUS.ac; }, bus() { return MUS.bus; }
};
function open() { build(); C.showPage("spaglobal", false); fit(); paint(); setTimeout(() => { fit(); paint(); }, 150); window.scrollTo({ top: 0 }); window.CMLSpaMute = false; musicSet(true); }
function wellSoon() {
  const L = window.CMLLobby; if (!L || !L.openSheet) return;
  const n = mk("hl-soon", '<h2></h2><p></p><button type="button" class="sp-old"></button>');
  n.querySelector("h2").textContent = t("spWellT"); n.querySelector("p").textContent = t("spWellBody");
  const ob = n.querySelector(".sp-old"); ob.textContent = t("spWellOld");
  ob.addEventListener("click", () => { const cx = document.querySelector(".lb-sheet-x"); if (cx) cx.click(); C.showPage("wellness"); });
  L.openSheet(n);
}
function prep() {
  try { const p = C.profile && C.profile(); const n = p && (p.first_name || "").trim(); if (n) localStorage.setItem("cml_spa_name", n); } catch (e) {}
  try { const sc = C.setting && C.setting("spa_content"); if (sc && typeof sc === "object") localStorage.setItem("cml_spa_content", JSON.stringify(sc)); else localStorage.removeItem("cml_spa_content"); } catch (e) {}
}
function enterSpa() {
  if (box) return;
  let ok = true; try { if (window.CMLPremium && window.CMLPremium.can) ok = !!window.CMLPremium.can("spa"); } catch (e) {}
  if (!ok) { const L = window.CMLLobby; if (L && L.openSheet) { const n = mk("hl-soon", '<h2></h2><p></p>'); n.querySelector("h2").textContent = t("spGo"); n.querySelector("p").textContent = t("spNoAcc"); L.openSheet(n); } return; }
  prep(); musicSet(false);
  box = mk("sp-enter", '<div class="sp-ld"><i></i><span></span></div><iframe title="Spa" allow="autoplay" src="spa-virtual.html?auto=1&lang=' + (C.lang() || "es") + '"></iframe>');
  box.querySelector(".sp-ld span").textContent = t("spLoad");
  const fr = box.querySelector("iframe"); fr.addEventListener("load", () => setTimeout(() => box && box.classList.add("ready"), 250));
  setTimeout(() => box && box.classList.add("ready"), 5000);
  document.body.appendChild(box); document.documentElement.classList.add("sp-open");
  requestAnimationFrame(() => requestAnimationFrame(() => box && box.classList.add("on")));
}
function leaveSpa() { if (!box) return; box.remove(); box = null; document.documentElement.classList.remove("sp-open"); if (page && page.classList.contains("active")) musicSet(true); }
// El botón "Bienestar" del menú de abajo lleva a esta escena (el contenido anterior sigue disponible desde Wellness).
document.addEventListener("click", e => {
  if (!document.documentElement.classList.contains("lobby-on")) return;
  const b = e.target.closest && e.target.closest('.quick-btn[data-go="wellness"]'); if (!b) return;
  e.preventDefault(); e.stopImmediatePropagation(); open();
}, true);
window.addEventListener("message", e => { if (e.origin === location.origin && e.data && e.data.cmlSpaExit) leaveSpa(); });
document.addEventListener("cml:lang", () => { paint(); });
document.addEventListener("cml:page", e => { if (e.detail && e.detail.page !== "spaglobal") musicSet(false); });
document.addEventListener("cml:page", e => { if (built && page && page.classList.contains("active")) { fit(); paint(); } });
window.CMLSpaHall = { open, enterSpa, leaveSpa };
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
