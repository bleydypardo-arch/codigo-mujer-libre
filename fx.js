// Código Mujer Libre — small moments of delight (all optional, all short, none block anything):
//  • greeting shine on the Home hello (once per session)
//  • petal burst when a ♥ / "Voy" / "Me apunto" is switched on
//  • "Algo distinto" swipe row: the card in front gets a soft glow, the others step back
// The weekly-code bloom lives in code.js + fx.css. Everything is skipped for people who ask for reduced motion.
(function () {
"use strict";
const calm = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---- greeting ----
function greet(node) {
  if (!node || calm()) return;
  try { if (sessionStorage.getItem("cmlGreetFx")) return; sessionStorage.setItem("cmlGreetFx", "1"); } catch { /* shows once per page load instead */ }
  node.classList.add("greet-shine");
  node.addEventListener("animationend", () => node.classList.remove("greet-shine"), { once: true });
}

// ---- petal burst ----
const COLORS = ["#E7B8B5", "#FADBD8", "#DBC19F", "#B85F68", "#DDEBD9"];
function burst(x, y) {
  if (calm() || !document.body.animate) return;
  const wrap = document.createElement("div");
  wrap.className = "fx-burst"; wrap.setAttribute("aria-hidden", "true");
  wrap.style.left = x + "px"; wrap.style.top = y + "px";
  document.body.appendChild(wrap);
  for (let i = 0; i < 9; i++) {
    const p = document.createElement("i"); p.className = "fx-petal";
    p.style.background = COLORS[i % COLORS.length];
    wrap.appendChild(p);
    const a = (Math.PI * 2 * i) / 9 + Math.random() * .5, d = 26 + Math.random() * 30;
    p.animate([
      { transform: "translate(-50%,-50%) scale(.4) rotate(0deg)", opacity: 1 },
      { transform: "translate(calc(-50% + " + Math.cos(a) * d + "px), calc(-50% + " + (Math.sin(a) * d - 14) + "px)) scale(1) rotate(" + (80 + Math.random() * 160) + "deg)", opacity: 1, offset: .6 },
      { transform: "translate(calc(-50% + " + Math.cos(a) * d * 1.25 + "px), calc(-50% + " + (Math.sin(a) * d + 8) + "px)) scale(.7) rotate(240deg)", opacity: 0 }
    ], { duration: 760 + Math.random() * 200, easing: "cubic-bezier(.2,.7,.3,1)", fill: "forwards" });
  }
  setTimeout(() => wrap.remove(), 1100);
}
document.addEventListener("click", e => {
  const b = e.target.closest && e.target.closest("button.resp");
  if (!b || b.classList.contains("on") || b.classList.contains("post-comment-toggle")) return;
  const r = b.getBoundingClientRect();
  burst(e.clientX || r.left + r.width / 2, e.clientY || r.top + r.height / 2);
}, true);

// ---- "Algo distinto" swipe row ----
function wireRow() {
  const list = document.querySelector("#homeDiscover .disc-list");
  if (!list || list.dataset.fx) return;
  list.dataset.fx = "1";
  const rows = () => Array.from(list.querySelectorAll(".disc-row"));
  let queued = false;
  const mark = () => {
    queued = false;
    const rs = rows();
    if (rs.length < 2) return rs.forEach(r => r.classList.add("is-active"));
    const x = list.scrollLeft; let best = rs[0], bd = Infinity;
    rs.forEach(r => { const d = Math.abs(r.offsetLeft - list.offsetLeft - x); if (d < bd) { bd = d; best = r; } });
    rs.forEach(r => r.classList.toggle("is-active", r === best));
  };
  list.addEventListener("scroll", () => { if (!queued) { queued = true; requestAnimationFrame(mark); } }, { passive: true });
  mark();
}
function init() {
  window.CMLFx = { greet, burst };
  const host = document.getElementById("homeDiscover");
  if (host && window.MutationObserver) new MutationObserver(wireRow).observe(host, { childList: true });
  wireRow();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
