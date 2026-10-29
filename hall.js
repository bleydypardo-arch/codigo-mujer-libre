// Código Mujer Libre — HALL DE EXPERIENCIAS (imagen 2). Letreros = texto real HTML pegado en perspectiva sobre la foto aprobada.
// Solo se alcanza desde el botón "Explora el Hall" del lobby (prototipo ?lobby=1).
(function () {
"use strict";
let C, t;
const W = 1086, H = 1448;
function init() {
C = window.CML; if (!C) return; t = k => C.t(k);
C.addStrings({
  hlTitle: "Hall de Experiencias", hlT1: "Hall de", hlT2: "Experiencias", hlTag: "Descubre · Conecta · Disfruta",
  hlTravel: "Viajemos Juntas", hlTravelS: "Destinos que inspiran",
  hlBout: "Tienda de Bienestar", hlBoutS: "Piezas con propósito",
  hlExp: "Experiencias", hlExpS: "Planes que te conectan",
  hlGrow: "Crece y Florece", hlGrowS: "Lectura · Cursos · Charlas",
  hlMatcha: "Matcha Café", hlMatchaS: "Sabores que conectan",
  hlPod: "Entre Nosotras", hlPodS: "Podcast · Historias que inspiran",
  hlAmilu: "Mundo Amilú", hlAmiluS: "Juego virtual",
  hlTiendaHint: "Desliza para recorrer la tienda", hlSoonT: "Muy pronto", hlGrowBanner: "🚧 En construcción · Muy pronto", hlGrowSoon: "Crece y Florece está en construcción: lo estamos reconstruyendo para ti. Muy pronto.", hlBoutSoon: "La Tienda de Bienestar abre pronto: piezas con propósito, esencias y cuidado de la piel, elegidas para ti.", hlAmiluSoon: "Mundo Amilú, nuestro juego virtual, abre pronto. Te avisamos.",
  hlBack: "Volver al lobby"
}, {
  hlTitle: "Hall of Experiences", hlT1: "Hall of", hlT2: "Experiences", hlTag: "Discover · Connect · Enjoy",
  hlTravel: "Let's Travel Together", hlTravelS: "Destinations that inspire",
  hlBout: "Wellness Shop", hlBoutS: "Pieces with purpose",
  hlExp: "Experiences", hlExpS: "Plans that connect you",
  hlGrow: "Grow & Bloom", hlGrowS: "Reading · Courses · Talks",
  hlMatcha: "Matcha Café", hlMatchaS: "Flavors that connect",
  hlPod: "Between Us", hlPodS: "Podcast · Stories that inspire",
  hlAmilu: "Amilú's World", hlAmiluS: "Virtual game",
  hlTiendaHint: "Swipe to walk through the store", hlSoonT: "Coming soon", hlGrowBanner: "🚧 Under construction · Coming soon", hlGrowSoon: "Grow & Bloom is under construction: we are rebuilding it for you. Coming soon.", hlBoutSoon: "The Wellness Shop opens soon: pieces with purpose, essences and skincare, chosen for you.", hlAmiluSoon: "Amilú's World, our virtual game, opens soon. We'll let you know.",
  hlBack: "Back to the lobby"
});

const ICON = {
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  bag: '<path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2"/>',
  lotus: '<path d="M12 5c2 2.5 2 6 0 9-2-3-2-6.500 0-9zM12 14c-1-4-5-6-8-5 0 4 3 7 8 5zM12 14c1-4 5-6 8-5 0 4-3 7-8 5zM8 18c2 1.500 6 1.500 8 0"/>',
  book: '<path d="M3 5c3-1 6-1 9 1v14c-3-2-6-2-9-1zM21 5c-3-1-6-1-9 1v14c3-2 6-2 9-1z"/>',
  cup: '<path d="M5 9h12v4a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5zM17 10h2a2 2 0 0 1 0 4h-2M8 5c0 1 1 1 1 2M12 5c0 1 1 1 1 2"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/>'
};
const BADGE = {
  tree: '<span class="hl-badge tree"><img src="btn-arbol1.webp" alt=""><img class="a2" src="btn-arbol2.webp" alt=""><img class="a3" src="btn-arbol3.webp" alt=""></span>',
  matcha: '<span class="hl-badge matcha"><img src="matcha-cup.jpg" alt=""><i></i><i></i><i></i></span>',
  mic: '<span class="hl-badge mic"><svg viewBox="0 0 48 48" aria-hidden="true"><g class="w1"><path d="M8 18c-3 4-3 8 0 12M40 18c3 4 3 8 0 12"/></g><g class="w2"><path d="M3 14c-5 6-5 14 0 20M45 14c5 6 5 14 0 20"/></g><rect x="18" y="6" width="12" height="22" rx="6" class="m"/><path d="M12 24a12 12 0 0 0 24 0M24 36v7M17 43h14"/></svg></span>'
};
// cuatro esquinas de cada letrero sobre la foto (px de la imagen 1086×1448): arriba-izq, arriba-der, abajo-der, abajo-izq
const SIGNS = [
  { k: "travel", icon: "globe", img: "viajemos", q: [[42,113],[303,233],[303,308],[42,207]] },
  { k: "bout",   icon: "bag", img: "tienda",   q: [[782,241],[1042,118],[1042,212],[782,312]] },
  { k: "exp",    icon: "lotus", img: "experiencias", q: [[40,541],[298,556],[298,619],[40,598]] },
  { k: "grow",   icon: "book", badge: "tree",  q: [[782,554],[1042,544],[1042,599],[782,623]] },
  { k: "matcha", icon: "cup", badge: "matcha",   q: [[38,924],[300,898],[300,962],[38,1003]] },
  { k: "pod",    icon: "mic", badge: "mic",   q: [[782,893],[1042,933],[1042,1003],[782,960]] }
];
// zonas tocables (rectángulos sobre la foto)
const ZONES = [
  { k: "travel", r: [38,108,284,412], go: () => { if (window.CMLRedesign && window.CMLRedesign.paintTravel) window.CMLRedesign.paintTravel(); C.showPage("travel"); if (window.CMLExp && window.CMLExp.seaPlay) window.CMLExp.seaPlay(); } },
  { k: "exp",    r: [38,538,284,330], go: () => C.showEventsCat("all") },
  { k: "matcha", r: [30,890,292,300], go: () => enterBar() },
  { k: "bout",   r: [776,112,276,408], go: () => C.showPage("tienda") },
  { k: "grow",   r: [776,538,276,330], go: () => {
    let ok = false; try { ok = !!(window.CMLPremium && window.CMLPremium.can("florece")); } catch (e) {}
    if (ok && window.CMLFlorece && window.CMLFlorece.open) { const f = document.getElementById("florece"); if (f) f.dataset.soon = t("hlGrowBanner"); window.CMLFlorece.open(); }
    else soon("hlGrow", "hlGrowSoon");
  } },
  { k: "pod",    r: [776,886,276,304], go: () => { C.showPage("podhall"); } },
  { k: "amilu",  r: [640,634,108,246], go: () => soon("hlAmilu", "hlAmiluSoon") }
];

let page, root, stage, built = false;
function mk(cls, html, tag) { const n = document.createElement(tag || "div"); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }

/* homografía: rectángulo (0,0,w,h) → cuadrilátero q  →  matrix3d */
function homography(w, h, q) {
  const src = [[0,0],[w,0],[w,h],[0,h]], A = [], b = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i], [u, v] = q[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
  }
  const n = 8; for (let i = 0; i < n; i++) A[i].push(b[i]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    for (let r = 0; r < n; r++) if (r !== c) { const f = A[r][c] / A[c][c]; for (let k = c; k <= n; k++) A[r][k] -= f * A[c][k]; }
  }
  const s = A.map((r, i) => r[n] / r[i]), [a, bb, c, d, e, f, g, hh] = s;
  return "matrix3d(" + [a, d, 0, g, bb, e, 0, hh, 0, 0, 1, 0, c, f, 0, 1].join(",") + ")";
}

function fit() {
  if (!root || !stage) return;
  const w = root.clientWidth || 390, s = w / W;
  stage.style.transform = "scale(" + s + ")"; root.style.height = Math.round(H * s) + "px";
}
function shrink(el, max, min, step) {
  el.style.fontSize = max + "px"; let size = max;
  while (size > min && el.scrollWidth > el.clientWidth + 1) { size -= step; el.style.fontSize = size + "px"; }
}
function fitText() {
  if (!stage) return;
  stage.querySelectorAll(".hl-sign .tt").forEach(el => shrink(el, 52, 24, 1));
  stage.querySelectorAll(".hl-sign .ss").forEach(el => shrink(el, 27, 14, .5));
  stage.querySelectorAll(".hl-big .t2").forEach(el => shrink(el, 58, 30, 1));
  stage.querySelectorAll(".hl-door .tt").forEach(el => shrink(el, 12, 6, .25));
  stage.querySelectorAll(".hl-door .ss").forEach(el => shrink(el, 5.5, 3.5, .25));
}
function paint() {
  if (!built) return;
  SIGNS.forEach(sg => { const n = stage.querySelector('.hl-sign[data-k="' + sg.k + '"]'); n.querySelector(".tt").textContent = t("hl" + cap(sg.k)); n.querySelector(".ss").textContent = t("hl" + cap(sg.k) + "S"); });
  stage.querySelector(".hl-big .t1").textContent = t("hlT1"); stage.querySelector(".hl-big .t2").textContent = t("hlT2"); stage.querySelector(".hl-big .ss").textContent = t("hlTag");
  stage.querySelector(".hl-door .tt").textContent = t("hlAmilu"); stage.querySelector(".hl-door .ss").textContent = t("hlAmiluS");
  ZONES.forEach(z => { const b = stage.querySelector('.hl-zone[data-k="' + z.k + '"]'); b.setAttribute("aria-label", t("hl" + cap(z.k))); });
  page.querySelector(".back-btn").setAttribute("aria-label", t("hlBack"));
  fitText();
}
const NAMES = { travel: "Travel", bout: "Bout", exp: "Exp", grow: "Grow", matcha: "Matcha", pod: "Pod", amilu: "Amilu" };
function cap(k) { return NAMES[k]; }
/* Matcha Café: se abren las puertas y entran directo al bar; al salir llegan a la página de Matcha con todo el contenido */
let barBox = null;
function enterBar() {
  if (barBox) return;
  const still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  barBox = mk("hl-bar", '<iframe src="bar/index.html?auto=1" title="Matcha" allow="autoplay"></iframe><div class="hl-dl"></div><div class="hl-dr"></div>');
  document.body.appendChild(barBox); document.documentElement.classList.add("hl-bar-open");
  requestAnimationFrame(() => requestAnimationFrame(() => barBox && barBox.classList.add("open")));
  if (still) barBox.classList.add("still");
  setTimeout(() => { if (barBox) barBox.classList.add("go"); }, still ? 0 : 1300);
}
function leaveBar() {
  if (!barBox) return; barBox.remove(); barBox = null; document.documentElement.classList.remove("hl-bar-open");
  if (window.CMLDiscover && window.CMLDiscover.renderMatchaPage) window.CMLDiscover.renderMatchaPage();
  C.showPage("matcha"); window.scrollTo({ top: 0 });
}
window.addEventListener("message", e => { if (e.origin === location.origin && e.data && e.data.cmlBarExit) leaveBar(); });
function soon(titleKey, bodyKey) {
  const L = window.CMLLobby; if (!L || !L.openSheet) return;
  const n = mk("hl-soon", '<h2></h2><p></p>'); n.querySelector("h2").textContent = t("hlSoonT") + " · " + t(titleKey); n.querySelector("p").textContent = t(bodyKey);
  L.openSheet(n);
}
function build() {
  if (built) return;
  page = document.getElementById("hall"); if (!page) return;
  page.innerHTML = '<div class="page-back"><button type="button" class="back-btn" data-go="home"><svg class="ci" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 6l-6 6 6 6"/></svg></button></div>';
  root = mk("hl-root"); stage = mk("hl-stage");
  const img = new Image(); img.src = "lobby/hall.webp?v=20261029t"; img.alt = ""; img.decoding = "async"; stage.appendChild(img);
  if (window.CMLScene) window.CMLScene.apply(stage, { src: "lobby/hall.webp?v=20261029t", W, H, sea: [440, 622, 180, 76],
    boats: [[466, 644, 30, 34], [518, 662, 38, 46]], fire: [474, 792, 82, 52], sail: [[455, 690, 9, 150, 80], [585, 665, 8, -120, 100]] });
  SIGNS.forEach(sg => {
    const w = 540, h = 170;
    const n = mk("hl-sign" + (sg.badge ? " has-badge" : sg.img ? " has-ico" : ""), (sg.badge ? BADGE[sg.badge] : sg.img ? '<img class="hl-ico ' + sg.img + '" src="lobby/ic-' + sg.img + '.webp?v=20261029t" alt="">' : '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">' + ICON[sg.icon] + '</svg>') + '<div class="tx"><div class="tt"></div><div class="ss"></div></div>');
    n.dataset.k = sg.k; n.style.width = w + "px"; n.style.height = h + "px"; n.style.transform = homography(w, h, sg.q); stage.appendChild(n);
  });
  // cartel grande vino
  const big = mk("hl-big", '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">' + ICON.lotus + '</svg><div class="t1"></div><div class="t2"></div><div class="ss"></div>'); stage.appendChild(big);
  // puerta de Mundo Amilú
  const door = mk("hl-door", '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12C9 6 3 6 4 11c1 3 5 3 8 1zM12 12c3-6 9-6 8-1-1 3-5 3-8 1zM12 13c-3 2-5 5-3 7 1 1 3 0 3-3 0 3 2 4 3 3 2-2 0-5-3-7z"/></svg><div class="tt"></div><div class="ss"></div>'); stage.appendChild(door);
  // pantalla vino del podcast: micrófono + ondas (como en la imagen de ChatGPT)
  { const w = 370, h = 200, n = mk("hl-wall", '<svg viewBox="0 0 120 64" aria-hidden="true"><g class="bars">' + [14,22,32,22,38,26,16,30,20,12].map((v, i) => '<rect x="' + (6 + i * 4) + '" y="' + (32 - v / 2) + '" width="2.2" height="' + v + '" rx="1.1" style="animation-delay:' + (i * .12) + 's"/>').join("") + '</g><g class="micw"><rect x="55" y="12" width="10" height="22" rx="5"/><path d="M49 28a11 11 0 0 0 22 0M60 39v10M53 49h14" fill="none"/></g><g class="bars r">' + [12,20,30,22,36,24,14,28,18,10].map((v, i) => '<rect x="' + (74 + i * 4) + '" y="' + (32 - v / 2) + '" width="2.2" height="' + v + '" rx="1.1" style="animation-delay:' + (i * .12 + .3) + 's"/>').join("") + '</g></svg>');
    n.style.width = w + "px"; n.style.height = h + "px"; n.style.transform = homography(w, h, [[923,990],[1047,1012],[1047,1080],[923,1060]]); stage.appendChild(n); }
  ZONES.forEach(z => {
    const b = mk("hl-zone", "", "button"); b.type = "button"; b.dataset.k = z.k;
    b.style.left = z.r[0] + "px"; b.style.top = z.r[1] + "px"; b.style.width = z.r[2] + "px"; b.style.height = z.r[3] + "px";
    if (z.k === "amilu") b.classList.add("round");
    b.appendChild(mk("hl-tap", '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10l5.2 1.3A2.5 2.5 0 0 1 19 13.7V16c0 3-2 5-5 5h-2.2c-1.6 0-2.7-.7-3.6-2L4.6 14.8a1.4 1.4 0 0 1 2-2L9 14.6z"/></svg>'));
    b.addEventListener("click", z.go); stage.appendChild(b);
  });
  root.appendChild(stage); page.appendChild(root); built = true;
  fit(); if (window.ResizeObserver) new ResizeObserver(() => { fit(); }).observe(root); else addEventListener("resize", fit);
  paint();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitText);
}
function open() { build(); C.showPage("hall", false); fit(); paint(); setTimeout(() => { fit(); fitText(); }, 120); window.scrollTo({ top: 0 }); }
window.CMLHall = { open, paint, enterBar };
function paintTienda() {
  const host = document.getElementById("tienda"); if (!host || !host.classList.contains("active")) return;
  const en = C.lang() === "en";
  const h = mk("h2", "", "h2"); h.className = "tn-title"; h.textContent = t("hlBout");
  const sc = mk("div", ""); sc.className = "tn-scroll";
  const im = new Image(); im.src = "lobby/tienda-" + (en ? "en" : "es") + ".webp?v=1"; im.alt = t("hlBout"); im.className = "tn-img";
  sc.appendChild(im);
  const hint = mk("p", ""); hint.className = "tn-hint"; hint.textContent = t("hlTiendaHint");
  host.replaceChildren(h, sc, hint);
  const center = () => { sc.scrollLeft = (sc.scrollWidth - sc.clientWidth) / 2; };
  im.addEventListener("load", center); center();
}
document.addEventListener("cml:lang", () => { paint(); paintTienda(); });
document.addEventListener("cml:page", e => { if (e.detail && e.detail.page === "tienda") paintTienda(); });
document.addEventListener("cml:page", e => { if (built && page && page.classList.contains("active")) { fit(); paint(); } });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
