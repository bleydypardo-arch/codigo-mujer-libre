// Código Mujer Libre — movimiento de las escenas (mar, barcos, fogata, orquídeas). Recortes vivos de la misma foto: nada se dibuja encima de lo aprobado.
(function () {
"use strict";
const still = () => !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
function mk(cls, html) { const n = document.createElement("div"); n.className = cls; if (html) n.innerHTML = html; return n; }
function px(n, x, y, w, h) { n.style.left = x + "px"; n.style.top = y + "px"; n.style.width = w + "px"; n.style.height = h + "px"; return n; }
function copy(cls, src, W, H, r, delay) {
  const n = px(mk("fx-copy " + cls), r[0], r[1], r[2], r[3]);
  n.style.backgroundImage = 'url("' + src + '")'; n.style.backgroundSize = W + "px " + H + "px"; n.style.backgroundPosition = (-r[0]) + "px " + (-r[1]) + "px";
  if (delay != null) n.style.animationDelay = delay + "s";
  return n;
}
const SAIL = '<svg viewBox="0 0 40 44" aria-hidden="true"><path d="M20 2v30L5 32z" fill="#fff"/><path d="M23 6v26h14z" fill="#f4efe6"/><path d="M3 35h34l-5 6H8z" fill="#fff"/></svg>';
function apply(stage, o) {
  if (!stage || still()) return;
  const g = mk("fx-layer"); g.setAttribute("aria-hidden", "true");
  if (o.sea) {
    const s = px(mk("fx-sea", '<i></i><i class="b"></i><b></b><b class="c"></b><b class="d"></b>'), o.sea[0], o.sea[1], o.sea[2], o.sea[3]); g.appendChild(s);
  }
  (o.boats || []).forEach((r, i) => g.appendChild(copy("fx-boat", o.src, o.W, o.H, r, -i * 1.7)));
  (o.sail || []).forEach((b, i) => { // barquitos nuevos que cruzan despacio
    const n = mk("fx-sail", SAIL); n.style.left = b[0] + "px"; n.style.top = b[1] + "px"; n.style.width = b[2] + "px"; n.style.setProperty("--run", b[3] + "px"); n.style.animationDuration = b[4] + "s, " + (b[4] / 5) + "s"; n.style.animationDelay = (-i * 9) + "s, 0s"; g.appendChild(n);
  });
  if (o.fire) { g.appendChild(copy("fx-fire", o.src, o.W, o.H, o.fire)); const gl = px(mk("fx-glow"), o.fire[0] - 30, o.fire[1] - 10, o.fire[2] + 60, o.fire[3] + 30); g.appendChild(gl); }
  (o.glows || []).forEach((c, i) => { const n = px(mk("fx-glow sm"), c[0] - c[2], c[1] - c[2], c[2] * 2, c[2] * 2); n.style.animationDelay = (-i * .7) + "s"; g.appendChild(n); });
  (o.sway || []).forEach((r, i) => g.appendChild(copy("fx-sway", o.src, o.W, o.H, r, -i * 1.3)));
  const first = stage.querySelector("img"); if (first && first.nextSibling) stage.insertBefore(g, first.nextSibling); else stage.appendChild(g);
}
/* relleno bajo la escena: la misma foto en espejo que se difumina hacia el fondo, para que ninguna pantalla muestre una franja vacía */
const FOOT = {"home": ["#d4a47d", "#cda07e", "#ddb290", "#dab08f", "#e0b695", "#c2997c", "#c69b7c"], "hall": ["#4b3918", "#d0966a", "#e3b99f", "#c0a6a9", "#d8a78a", "#b37d5f", "#453416"], "spa": ["#3f3011", "#745138", "#ad7d5f", "#9a6138", "#9b653f", "#c88f69", "#e0a16e"]};
/* escala: llena el alto disponible (hasta 12 % más grande que el ancho) y deja deslizar de lado lo que sobra */
function navTop() { let top = innerHeight; document.querySelectorAll("nav button").forEach(b => { const r = b.getBoundingClientRect(); if (r.height && r.top > innerHeight / 2) top = Math.min(top, r.top); }); return top; }
function fit(root, stage, W, H) {
  const w = root.clientWidth || 390, s0 = w / W;
  let sz = stage.parentNode; if (!sz || !sz.classList.contains("fx-pan")) { sz = mk("fx-pan"); stage.parentNode && stage.parentNode.insertBefore(sz, stage); sz.appendChild(stage); }
  const top = root.getBoundingClientRect().top + scrollY, avail = navTop() - top - 4;
  const s = Math.min(Math.max(s0, avail / H), s0 * 1.12);
  stage.style.transform = "scale(" + s + ")"; sz.style.width = Math.round(W * s) + "px"; sz.style.height = Math.round(H * s) + "px"; root.style.height = Math.round(H * s) + "px";
  if (root.__w !== w || root.__s !== s) { root.__w = w; root.__s = s; root.scrollLeft = Math.max(0, (W * s - w) / 2); }
  return s;
}
function fill(rootEl, name) {
  if (!rootEl || rootEl.__foot) return; const foot = mk("fx-foot"); foot.setAttribute("aria-hidden", "true"); foot.style.backgroundImage = "linear-gradient(90deg," + FOOT[name].join(",") + ")";
  rootEl.after(foot); rootEl.__foot = foot;
  const nav = () => { let top = innerHeight; document.querySelectorAll(".quick-btn").forEach(b => { const r = b.getBoundingClientRect(); if (r.height && r.top > innerHeight / 2) top = Math.min(top, r.top); }); return top; };
  const upd = () => { if (!document.body.contains(rootEl) || !rootEl.offsetParent) return; const r = rootEl.getBoundingClientRect(), bottom = r.bottom + scrollY; foot.style.height = Math.max(0, Math.round(innerHeight - (innerHeight - nav()) - bottom + 6)) + "px"; foot.style.width = r.width + "px"; foot.style.marginLeft = "0px"; foot.style.marginLeft = Math.round(r.left - foot.getBoundingClientRect().left) + "px"; };
  upd(); setTimeout(upd, 300); setTimeout(upd, 1200); addEventListener("resize", upd); if (window.ResizeObserver) new ResizeObserver(upd).observe(rootEl);
  document.addEventListener("cml:page", () => setTimeout(upd, 60)); rootEl.__upd = upd;
}
window.CMLScene = { apply, fill, fit };
})();
