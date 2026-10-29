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
function open() { build(); C.showPage("spaglobal", false); fit(); paint(); setTimeout(() => { fit(); paint(); }, 150); window.scrollTo({ top: 0 }); }
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
  prep();
  box = mk("sp-enter", '<div class="sp-ld"><i></i><span></span></div><iframe title="Spa" allow="autoplay" src="spa-virtual.html?auto=1&lang=' + (C.lang() || "es") + '"></iframe>');
  box.querySelector(".sp-ld span").textContent = t("spLoad");
  const fr = box.querySelector("iframe"); fr.addEventListener("load", () => setTimeout(() => box && box.classList.add("ready"), 250));
  setTimeout(() => box && box.classList.add("ready"), 5000);
  document.body.appendChild(box); document.documentElement.classList.add("sp-open");
  requestAnimationFrame(() => requestAnimationFrame(() => box && box.classList.add("on")));
}
function leaveSpa() { if (!box) return; box.remove(); box = null; document.documentElement.classList.remove("sp-open"); }
// El botón "Bienestar" del menú de abajo lleva a esta escena (el contenido anterior sigue disponible desde Wellness).
document.addEventListener("click", e => {
  if (!document.documentElement.classList.contains("lobby-on")) return;
  const b = e.target.closest && e.target.closest('.quick-btn[data-go="wellness"]'); if (!b) return;
  e.preventDefault(); e.stopImmediatePropagation(); open();
}, true);
window.addEventListener("message", e => { if (e.origin === location.origin && e.data && e.data.cmlSpaExit) leaveSpa(); });
document.addEventListener("cml:lang", () => { paint(); });
document.addEventListener("cml:page", e => { if (built && page && page.classList.contains("active")) { fit(); paint(); } });
window.CMLSpaHall = { open, enterSpa, leaveSpa };
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
