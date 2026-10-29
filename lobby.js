// Código Mujer Libre — LOBBY (nuevo Home). Prototipo detrás de un interruptor: ?lobby=1 lo enciende, ?lobby=0 lo apaga.
// No cambia ningún dato ni componente existente: reutiliza la tarjeta Tu Código Hoy, Hablemos, ¿Sabías que? y Tu código esta semana.
(function () {
"use strict";
const FLAG = "cmlLobby";
try {
  const q = new URLSearchParams(location.search).get("lobby");
  if (q === "1") localStorage.setItem(FLAG, "1"); else if (q === "0") localStorage.removeItem(FLAG);
  if (localStorage.getItem(FLAG) === "1") document.documentElement.classList.add("lobby-on");
} catch (e) { if (/[?&]lobby=1/.test(location.search)) document.documentElement.classList.add("lobby-on"); }

const ES = {
  lbExploreK: "Explora el", lbExploreT: "Hall de Experiencias", lbCode: "Tu Código Hoy", lbCodeWeek: "Escoge tu código de la semana", lbCodeWeekAria: "Tu código esta semana",
  lbEvents: "Eventos Especiales", lbRecs: "Nuestra Recomendación", lbTalk: "Hablemos", lbDyk: "¿Sabías que?", lbSeeAll: "Ver todo", lbClose: "Cerrar",
  lbBub1: "Toca la placa y ve tu mensaje de hoy", lbBub2: "Aquí tienes un lugar para ti", lbSoonT: "Pronto, un nuevo plan", lbSoonD: "Estamos preparando algo especial para ti.",
  lbHappy: "Happy Hour", lbDine: "Restaurante", lbWell: "Bienestar", lbEvent: "Evento", lbSocialK: "Social", lbWellPromo: "Bienestar", lbWellPromoS: "y promociones", lbSocial: "Social", lbSocialS: "planes con amigas", lbTours: "Tours y experiencias", lbToursS: "tu ciudad", lbRest: "Restaurante", lbHappyH: "Happy Hour", lbWeekS: "de la semana", lbCodeSub: "Mensaje para hoy"
};
const EN = {
  lbExploreK: "Explore the", lbExploreT: "Experiences Hall", lbCode: "Your Code Today", lbCodeWeek: "Choose your code of the week", lbCodeWeekAria: "Your code this week",
  lbEvents: "Special Events", lbRecs: "Our Recommendation", lbTalk: "Let's talk", lbDyk: "Did you know?", lbSeeAll: "See all", lbClose: "Close",
  lbBub1: "Tap the plaque for today's message", lbBub2: "A place picked just for you", lbSoonT: "Soon, a new plan", lbSoonD: "We're preparing something special for you.",
  lbHappy: "Happy Hour", lbDine: "Restaurant", lbWell: "Wellness", lbEvent: "Event", lbSocialK: "Social", lbWellPromo: "Wellness", lbWellPromoS: "& promotions", lbSocial: "Social", lbSocialS: "plans with friends", lbTours: "Tours & experiences", lbToursS: "your city", lbRest: "Restaurant", lbHappyH: "Happy Hour", lbWeekS: "of the week", lbCodeSub: "Message for today"
};

let C, stage, root, built = false, timers = [];
const W = 1100, H = 1430;
const t = (k, ...a) => { const v = C ? C.t(k) : ""; return typeof v === "function" ? v(...a) : (v || k); };
const mk = (cls, html, tag = "div") => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
const place = (n, x, y, w, h) => { n.style.left = x + "px"; n.style.top = y + "px"; if (w != null) n.style.width = w + "px"; if (h) n.style.height = h + "px"; return n; };
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------- escala ---------- */
function fit() {
  if (!root || !stage) return;
  const w = root.clientWidth || 390, s = w / W;
  stage.style.transform = "scale(" + s + ")";
  root.style.setProperty("--s", s); stage.style.setProperty("--inv", (1 / s).toFixed(4));
  root.style.height = Math.round(H * s) + "px";
}

/* ---------- hoja para componentes existentes ---------- */
let sheet, sheetIn, sheetNode, sheetHome, sheetPrev;
function openSheet(id) {
  const custom = typeof id !== "string";
  const node = custom ? id : document.getElementById(id);
  if (!node) return false;
  if (!custom && id !== "codeCard" && !node.childElementCount) { return false; }
  if (!sheet) {
    sheet = mk("lb-sheet"); sheet.setAttribute("role", "dialog"); sheet.setAttribute("aria-modal", "true");
    sheetIn = mk("lb-sheet-in"); const x = mk("lb-sheet-x", "✕", "button"); x.type = "button"; x.setAttribute("aria-label", t("lbClose")); x.addEventListener("click", closeSheet);
    sheetIn.appendChild(x); sheet.appendChild(sheetIn);
    sheet.addEventListener("click", e => { if (e.target === sheet) closeSheet(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && sheet.classList.contains("open")) closeSheet(); });
    document.body.appendChild(sheet);
  }
  closeSheet();
  sheetHome = custom ? null : { parent: node.parentNode, next: node.nextSibling }; sheetNode = node; sheetPrev = document.activeElement;
  sheetIn.appendChild(node); sheet.classList.add("open");
  const x = sheetIn.querySelector(".lb-sheet-x"); if (x) x.focus();
  return true;
}
function closeSheet() {
  if (sheetNode) { if (sheetHome) sheetHome.parent.insertBefore(sheetNode, sheetHome.next); else sheetNode.remove(); sheetNode = null; sheetHome = null; }
  if (sheet) sheet.classList.remove("open");
  if (sheetPrev && sheetPrev.focus) { try { sheetPrev.focus(); } catch (e) {} sheetPrev = null; }
}

/* ---------- saludo ---------- */
function helloText() {
  const h = new Date().getHours(), p = C.profile && C.profile(), first = p && p.first_name ? p.first_name : "";
  return t(h >= 5 && h < 12 ? "greetMorning" : h >= 12 && h < 19 ? "greetAfternoon" : "greetEvening", first);
}
function paintHello() {
  const g = stage.querySelector(".lb-greet"); if (!g) return;
  g.replaceChildren(); [...helloText()].forEach((ch, i) => { const s = document.createElement("i"); s.textContent = ch; s.style.animationDelay = (0.25 + i * 0.055).toFixed(2) + "s"; g.appendChild(s); });
  const clone = g.cloneNode(true); g.parentNode.replaceChild(clone, g);   // reinicia la animación
}

/* ---------- pantallas: tres categorías, con miniatura que rota ---------- */
const ROWS = {
  events: { title: "lbEvents", rows: [
    { k: "lbWellPromo", s: "lbWellPromoS", ic: "🌿", pick: p => C.eventCategory(p) === "wellness", go: () => C.showEventsCat("wellness") },
    { k: "lbSocial", s: "lbSocialS", ic: "🥂", pick: p => C.eventCategory(p) === "social", go: () => C.showEventsCat("social") },
    { k: "lbTours", s: "lbToursS", ic: "🧭", pick: p => !!(C.sideTrip && C.sideTrip(p)), go: () => { if (window.CMLRedesign && window.CMLRedesign.paintTravel) window.CMLRedesign.paintTravel(); C.showPage("travel"); } }
  ] },
  recs: { title: "lbRecs", rows: [
    { k: "lbRest", s: "lbWeekS", ic: "🍽️", pick: p => C.eventCategory(p) === "dining", go: () => C.showEventsCat("dining") },
    { k: "lbHappyH", s: "lbWeekS", ic: "🍹", pick: p => C.eventCategory(p) === "social", go: () => C.showEventsCat("social") },
    { k: "lbWellPromo", s: "lbWeekS", ic: "🌿", pick: p => C.eventCategory(p) === "wellness", go: () => C.showEventsCat("wellness") }
  ] }
};
function photosFor(row) {
  if (!C.session()) return [];
  const { plans } = C.homeData(), today = C.todayStr(), out = [];
  plans.filter(p => (p.kind === "event" || p.kind === "wellness" || (C.sideTrip && C.sideTrip(p))) && (!p.event_date || p.event_date >= today) && row.pick(p)).forEach(p => {
    const tag = C.planTag ? C.planTag(p.id) : {}, u = C.safeUrl((tag && tag.homeImg) || p.image_url || ""); if (u && !out.includes(u)) out.push(u);
  });
  return out.slice(0, 5);
}
function thumb(row) {
  const th = mk("lb-th"), imgs = photosFor(row);
  if (!imgs.length) { th.textContent = row.ic; return th; }
  imgs.forEach((u, i) => { const d = mk("ph" + (i ? "" : " on")); d.style.backgroundImage = 'url("' + String(u).replace(/["\\()\s]/g, encodeURIComponent) + '")'; th.appendChild(d); });
  th.__n = imgs.length; th.__i = 0; return th;
}
function rotateThumbs(scope) {
  scope.querySelectorAll(".lb-th").forEach(th => {
    if (!th.__n || th.__n < 2) return;
    const l = th.querySelectorAll(".ph"); l[th.__i].classList.remove("on"); th.__i = (th.__i + 1) % th.__n; l[th.__i].classList.add("on");
  });
}
function rowEl(row, big) {
  const b = mk(big ? "lb-brow" : "lb-row", null, big ? "button" : "div"); if (big) b.type = "button";
  const lab = mk("lb-lab"); lab.append(mk("lb-cat", esc(t(row.k))), mk("lb-sub", esc(t(row.s))));
  b.append(thumb(row), lab, mk("lb-go", "›"));
  if (big) b.addEventListener("click", () => { closeSheet(); row.go(); });
  return b;
}
function paintPanel(pn) {
  const def = ROWS[pn.dataset.kind];
  pn.querySelector(".lb-pt").textContent = t(def.title);
  const rows = pn.querySelector(".lb-rows"); rows.replaceChildren(...def.rows.map(r => rowEl(r, false)));
  pn.setAttribute("aria-label", t(def.title));
}
function openBig(kind) {
  const def = ROWS[kind], box = mk("lb-big"); box.appendChild(mk("", "<h2>" + esc(t(def.title)) + "</h2>", "div"));
  def.rows.forEach(r => box.appendChild(rowEl(r, true)));
  openSheet(box);
}

/* ---------- construcción ---------- */
const MEDAL = '<span class="code-medal-wrap" aria-hidden="true"><svg class="code-medal" viewBox="0 0 120 120" aria-hidden="true" focusable="false"><defs><linearGradient id="lbGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6E7C6"/><stop offset=".35" stop-color="#DBC19F"/><stop offset=".6" stop-color="#9C7B4E"/><stop offset=".85" stop-color="#EAD4AA"/><stop offset="1" stop-color="#B8955F"/></linearGradient><radialGradient id="lbRose" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#E7A0AA"/><stop offset=".55" stop-color="#B85F68"/><stop offset="1" stop-color="#8A3A47"/></radialGradient><radialGradient id="lbWine" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#A44B5A"/><stop offset=".6" stop-color="#6E2433"/><stop offset="1" stop-color="#43141F"/></radialGradient><radialGradient id="lbAmber" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#F0D9AE"/><stop offset=".55" stop-color="#C9A169"/><stop offset="1" stop-color="#8E6A3B"/></radialGradient><linearGradient id="lbShine" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><clipPath id="lbClip"><circle cx="60" cy="60" r="42"/></clipPath></defs><g class="md-ring"><circle cx="60" cy="60" r="56" fill="none" stroke="url(#lbGold)" stroke-width="1.4" stroke-dasharray="1.5 5.5" stroke-linecap="round"/><circle cx="60" cy="4" r="2.4" fill="#F6E7C6"/><circle cx="60" cy="116" r="1.6" fill="#DBC19F"/></g><circle class="md-halo" cx="60" cy="60" r="50" fill="none" stroke="#F6E7C6" stroke-opacity=".5" stroke-width="1"/><circle cx="60" cy="60" r="47" fill="url(#lbGold)"/><g clip-path="url(#lbClip)"><circle cx="60" cy="60" r="42" fill="url(#lbRose)"/><circle class="md-wine" cx="60" cy="60" r="42" fill="url(#lbWine)"/><circle class="md-amber" cx="60" cy="60" r="42" fill="url(#lbAmber)"/><g transform="rotate(24 60 60)"><rect class="md-shine" x="-40" y="-10" width="26" height="140" fill="url(#lbShine)"/></g></g><circle cx="60" cy="60" r="42" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".8"/><path class="md-c" d="M80.5 41 A28 28 0 1 0 80.5 79" fill="none" stroke="url(#lbGold)" stroke-width="5" stroke-linecap="round"/><g class="md-qr" fill="#F6E7C6"><rect x="83" y="49" width="4" height="4" rx=".8"/><rect x="89" y="49" width="4" height="4" rx=".8" opacity=".6"/><rect x="83" y="55" width="4" height="4" rx=".8" opacity=".6"/><rect x="89" y="55" width="4" height="4" rx=".8"/><rect x="83" y="61" width="4" height="4" rx=".8"/><rect x="86" y="67" width="4" height="4" rx=".8" opacity=".6"/></g><g class="md-sym" transform="translate(47 47) scale(1.08)"><path class="lb-art" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"/></g></svg></span>';
const SPARK = '<svg viewBox="0 0 24 24" fill="#7a2e45"><path d="M12 2l2 7 7 3-7 3-2 7-2-7-7-3 7-3z"/></svg>';
function build() {
  const host = document.getElementById("home"); if (!host || built) return;
  root = mk(""); root.id = "lobby"; root.setAttribute("role", "region"); root.setAttribute("aria-label", "Lobby");
  stage = mk("lb-stage");
  const img = new Image(); img.src = "lobby/home.webp?v=20261028b"; img.alt = ""; img.decoding = "async"; stage.appendChild(img);

  // saludo y marca
  const hello = place(mk("lb-abs lb-hello", '<div><div class="lb-greet"></div></div><div class="lb-brand"><img src="lobby/logo-club.webp?v=20261028i" alt="Club Código Mujer Libre — Conecta · Vive · Crece"></div>'), 250, 40);
  stage.appendChild(hello);

  // pantallas (tocar = se abre ampliada con las tres categorías)
  [["events", 22], ["recs", 800]].forEach(([kind, x]) => {
    const pn = place(mk("lb-pn", "", "button"), x, 494, 278, 312); pn.type = "button"; pn.dataset.kind = kind;
    pn.append(mk("lb-pt"), mk("lb-rows")); pn.addEventListener("click", () => openBig(kind)); stage.appendChild(pn);
  });

  // placa Tu Código Hoy: medalla original con la C que gira + la misma tarjeta de siempre
  const plq = place(mk("lb-abs lb-plq", MEDAL + '<span class="tx"><b></b><small></small></span><span class="lb-go">›</span>', "button"), 368, 692, 368, 84); plq.type = "button";
  plq.addEventListener("click", () => openSheet("codeCard")); stage.appendChild(plq);

  // caja de cristal: Tu código esta semana
  const box = place(mk("lb-abs lb-box", "", "button"), 372, 566, 90, 90); box.type = "button";
  for (let i = 0; i < 5; i++) { const s = mk("", null, "i"); s.style.left = (14 + i * 15) + "px"; s.style.top = (46 + (i % 2) * 14) + "px"; s.style.animationDelay = (i * 0.9) + "s"; box.appendChild(s); }
  box.addEventListener("click", () => { if (!openSheet("homeCodeWeek")) openSheet("codeCard"); }); stage.appendChild(box);
  box.appendChild(mk("lb-tap", '<svg viewBox="0 0 24 24"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10l5.2 1.3A2.5 2.5 0 0 1 19 13.7V16c0 3-2 5-5 5h-2.2c-1.6 0-2.7-.7-3.6-2L4.6 14.8a1.4 1.4 0 0 1 2-2L9 14.6z"/></svg>'));

  // sobre (Hablemos)
  const env = place(mk("lb-abs lb-pc", '<div class="lb-env"><svg viewBox="0 0 100 70"><rect x="6" y="14" width="88" height="52" rx="5" fill="#fbe3e8" stroke="#e8a9ba" stroke-width="2"/><path d="M6 18l44 30 44-30" fill="#f7cdd7" stroke="#e8a9ba" stroke-width="2"/><g class="lb-heart"><path d="M50 52c-9-6-12-10-12-14a6 6 0 0 1 12-1 6 6 0 0 1 12 1c0 4-3 8-12 14z" fill="#d6455f" transform="translate(0 -6)"/></g></svg></div><span></span>', "button"), 262, 1028, 126); env.type = "button";
  env.addEventListener("click", () => { if (!openSheet("homeTalk")) C.showPage("support"); }); stage.appendChild(env);
  // mariposa (¿Sabías que?)
  const fly = place(mk("lb-abs lb-pc", '<div class="lb-fly"><svg viewBox="0 0 100 80"><g class="lb-wl"><path d="M50 40C38 8 8 6 10 28c1 14 18 20 40 12z" fill="#f2a9b8" stroke="#d27a90" stroke-width="1.5"/><path d="M50 44C36 64 14 70 20 52c3-8 18-12 30-8z" fill="#f7c7a8" stroke="#d27a90" stroke-width="1.5"/></g><g class="lb-wr"><path d="M50 40C62 8 92 6 90 28c-1 14-18 20-40 12z" fill="#f2a9b8" stroke="#d27a90" stroke-width="1.5"/><path d="M50 44C64 64 86 70 80 52c-3-8-18-12-30-8z" fill="#f7c7a8" stroke="#d27a90" stroke-width="1.5"/></g><rect x="48" y="30" width="4" height="30" rx="2" fill="#7a2e45"/></svg></div><span></span>', "button"), 700, 1014, 134); fly.type = "button";
  fly.addEventListener("click", () => { if (!openSheet("homeDyk")) C.showPage("home"); }); stage.appendChild(fly);

  // Explora el Hall
  const ex = place(mk("lb-abs lb-ex", '<svg viewBox="0 0 40 40" style="width:calc(var(--inv)*20px);height:auto;flex:none;fill:currentColor"><g><ellipse cx="20" cy="9" rx="5" ry="8"/><ellipse cx="10" cy="19" rx="7" ry="4.5" transform="rotate(-25 10 19)"/><ellipse cx="30" cy="19" rx="7" ry="4.5" transform="rotate(25 30 19)"/><ellipse cx="20" cy="28" rx="6" ry="5"/></g></svg><span class="tx"><small></small><b></b></span><span class="lb-go">›</span>', "button"), 245, 1290, 610, 116); ex.type = "button";
  ex.addEventListener("click", () => { document.dispatchEvent(new CustomEvent("cml:hall")); if (window.CMLHall && window.CMLHall.open) window.CMLHall.open(); else seeAll("events"); }); stage.appendChild(ex);

  root.appendChild(stage); host.insertBefore(root, host.firstChild); built = true;
  fit(); fitAll(); if (window.ResizeObserver) new ResizeObserver(fit).observe(root); else addEventListener("resize", fit);
}
/* mismo tamaño en cada grupo (títulos, categorías...): se reduce de a poco hasta que nada se salga de su caja */
function fitGroup(sel, v, base, min) {
  const els = [...stage.querySelectorAll(sel)]; if (!els.length) return;
  let size = base; stage.style.setProperty(v, size);
  const over = () => els.some(e => e.scrollWidth > e.clientWidth + 1);
  while (size > min && over()) { size = Math.round((size - 0.25) * 100) / 100; stage.style.setProperty(v, size); }
}
function fitAll() {
  if (!built) return;
  fitGroup(".lb-pt", "--fs-pt", 11, 6); fitGroup(".lb-cat", "--fs-cat", 7.5, 4.5); fitGroup(".lb-plq b", "--fs-code", 11, 6); fitGroup(".lb-ex b", "--fs-hall", 14, 7); fitGroup(".lb-sub", "--fs-sub", 4.8, 3.6); fitGroup(".lb-plq small", "--fs-csub", 4.8, 3.6); fitGroup(".lb-pc span", "--fs-pc", 8.5, 4.5);
}
function labels() {
  if (!built) return;
  const q = (s, v, a) => { const n = stage.querySelector(s); if (n) n.textContent = v; if (n && a) n.parentNode.setAttribute && 0; };
  stage.querySelector(".lb-plq b").textContent = t("lbCode"); stage.querySelector(".lb-plq small").textContent = t("lbCodeSub");
  stage.querySelector(".lb-box").setAttribute("aria-label", t("lbCodeWeekAria"));
  stage.querySelector(".lb-plq").setAttribute("aria-label", t("lbCode"));
  const pcs = stage.querySelectorAll(".lb-pc"); pcs[0].querySelector("span").textContent = t("lbTalk"); pcs[0].setAttribute("aria-label", t("lbTalk")); pcs[1].querySelector("span").textContent = t("lbDyk"); pcs[1].setAttribute("aria-label", t("lbDyk"));
  const ex = stage.querySelector(".lb-ex"); ex.querySelector("small").textContent = t("lbExploreK"); ex.querySelector("b").textContent = t("lbExploreT"); ex.setAttribute("aria-label", t("lbExploreK") + " " + t("lbExploreT"));
}
function paint() {
  if (!built) return; labels(); paintHello();
  stage.querySelectorAll(".lb-pn").forEach(paintPanel); syncArt(); fitAll(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);
}
function syncArt() { const src = document.getElementById("codeArt"), d = src && src.getAttribute("d"); stage.querySelectorAll(".lb-art").forEach(n => { if (d) n.setAttribute("d", d); }); }
function start() {
  timers.forEach(clearInterval); timers = [];
  timers.push(setInterval(() => { if (!document.hidden) { rotateThumbs(stage); if (sheetNode) rotateThumbs(sheetNode); }; }, 5500));
}
function init() {
  C = window.CML; if (!C) return;
  C.addStrings(ES, EN);
  if (!document.documentElement.classList.contains("lobby-on")) return;
  build(); paint(); start();
  document.addEventListener("cml:session", () => setTimeout(paint, 60));
  document.addEventListener("cml:lang", () => setTimeout(paint, 60));
  document.addEventListener("cml:page", e => { if (built) syncArt(); if (e.detail && e.detail.page === "home") { fit(); paintHello(); } else closeSheet(); });
  window.CMLLobby = { paint };
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
