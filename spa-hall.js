// Código Mujer Libre — SPA & WELLNESS (imagen 3). Botón SPA brillante → entra directo al Spa Virtual (Bienvenida + nombre). WELLNESS: en construcción.
(function () {
"use strict";
let C, t;
const W = 1086, H = 1448;
let page, root, stage, built = false, box = null;
function mk(cls, html, tag) { const n = document.createElement(tag || "div"); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
function init() {
C = window.CML; if (!C) return; t = k => C.t(k);
C.addStrings({
  spGo: "Spa", spGoS: "Entrar al spa virtual", spWell: "Wellness", spWellS: "En construcción", spBack: "Volver al spa", spClose: "Salir del spa",
  spWellT: "Wellness · Muy pronto", spWellBody: "La sala Wellness está en construcción. Muy pronto podrás vivir aquí la biblioteca, las charlas y todo lo que tenemos en bienestar.", spWellOld: "Ver Bienestar actual",
  spNoAcc: "El Spa Virtual es un espacio premium. Pronto te contamos cómo entrar.", spLoad: "Preparando tu spa…"
}, {
  spGo: "Spa", spGoS: "Enter the virtual spa", spWell: "Wellness", spWellS: "Under construction", spBack: "Back to the spa", spClose: "Leave the spa",
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
  root.appendChild(stage); page.appendChild(root); built = true;
  fit(); if (window.ResizeObserver) new ResizeObserver(fit).observe(root); else addEventListener("resize", fit);
  paint();
}
function fit() { if (!root || !stage) return; const w = root.clientWidth || 390, s = w / W; stage.style.transform = "scale(" + s + ")"; root.style.height = Math.round(H * s) + "px"; }
function shrink(el, max, min) { el.style.fontSize = max + "px"; let s = max; while (s > min && el.scrollWidth > el.clientWidth + 1) { s -= 1; el.style.fontSize = s + "px"; } }
function paint() {
  if (!built) return;
  const a = stage.querySelector(".sp-spa"), b = stage.querySelector(".sp-well");
  a.querySelector("b").textContent = t("spGo"); a.querySelector("small").textContent = t("spGoS"); a.setAttribute("aria-label", t("spGo"));
  b.querySelector("b").textContent = t("spWell"); b.querySelector("small").textContent = t("spWellS"); b.setAttribute("aria-label", t("spWell") + " · " + t("spWellS"));
  stage.querySelectorAll(".sp-pill b").forEach(el => shrink(el, 56, 24));
  stage.querySelectorAll(".sp-pill small").forEach(el => shrink(el, 26, 14));
  page.querySelector(".back-btn").setAttribute("aria-label", t("hlBack") || "Volver");
}

/* ---- música suave de spa (generada, sin archivos): acordes lentos + brillo de campanas. Se oye al entrar a Wellness. ---- */
const MUS = { ac: null, g: null, on: false, timers: [], user: null };
function musCtx() { if (!MUS.ac) { const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; MUS.ac = new A(); MUS.g = MUS.ac.createGain(); MUS.g.gain.value = 0; const lp = MUS.ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1400; const dl = MUS.ac.createDelay(1.5); dl.delayTime.value = .55; const fb = MUS.ac.createGain(); fb.gain.value = .38; dl.connect(fb); fb.connect(dl); MUS.g.connect(lp); lp.connect(MUS.ac.destination); lp.connect(dl); dl.connect(MUS.ac.destination); } if (MUS.ac.state === "suspended") MUS.ac.resume(); return MUS.ac; }
const CH = [[196, 246.94, 293.66, 392], [174.61, 220, 261.63, 349.23], [164.81, 207.65, 246.94, 329.63], [196, 261.63, 293.66, 392]];
function pad(f, t0, dur) { const ac = MUS.ac; [-4, 4].forEach(d => { const o = ac.createOscillator(), g = ac.createGain(); o.type = "sine"; o.frequency.value = f; o.detune.value = d; g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(.05, t0 + dur * .4); g.gain.linearRampToValueAtTime(0, t0 + dur); o.connect(g); g.connect(MUS.g); o.start(t0); o.stop(t0 + dur + .1); }); }
function bell(f, t0) { const ac = MUS.ac, o = ac.createOscillator(), g = ac.createGain(); o.type = "triangle"; o.frequency.value = f; g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(.05, t0 + .02); g.gain.exponentialRampToValueAtTime(.0008, t0 + 3.2); o.connect(g); g.connect(MUS.g); o.start(t0); o.stop(t0 + 3.4); }
let chIdx = 0;
function bar() { if (!MUS.on || !MUS.ac) return; const t0 = MUS.ac.currentTime + .05, c = CH[chIdx++ % CH.length]; c.forEach((f, i) => pad(f, t0 + i * .25, 9)); [0, 2.6, 4.4, 6.5].forEach((d, i) => bell(c[(i * 2 + 1) % 4] * 2, t0 + d + Math.random() * .3)); MUS.timers.push(setTimeout(bar, 7600)); }
function musicSet(on) {
  if (on) { if (!window.CMLSpaMute && musCtx()) { MUS.on = true; MUS.g.gain.cancelScheduledValues(MUS.ac.currentTime); MUS.g.gain.linearRampToValueAtTime(.9, MUS.ac.currentTime + 3); if (!MUS.timers.length) bar(); } }
  else if (MUS.ac) { MUS.on = false; MUS.timers.forEach(clearTimeout); MUS.timers = []; MUS.g.gain.cancelScheduledValues(MUS.ac.currentTime); MUS.g.gain.linearRampToValueAtTime(0, MUS.ac.currentTime + 1.2); }
  const b = stage && stage.querySelector(".sp-snd"); if (b) { b.classList.toggle("off", !MUS.on); b.setAttribute("aria-pressed", String(MUS.on)); }
}
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
