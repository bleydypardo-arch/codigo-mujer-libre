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
window.CMLScene = { apply };
})();
