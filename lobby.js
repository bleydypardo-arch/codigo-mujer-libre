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
  lbExploreK: "Explora el", lbExploreT: "Hall de Experiencias", lbCode: "Tu Código Hoy", lbCodeWeek: "Tu código", lbCodeWeekAria: "Tu código esta semana",
  lbEvents: "Eventos Especiales", lbRecs: "Nuestra Recomendación", lbTalk: "Hablemos", lbDyk: "¿Sabías que?", lbSeeAll: "Ver todo", lbClose: "Cerrar",
  lbBub1: "Toca la placa y descubre tu mensaje de hoy", lbBub2: "Aquí tienes un lugar para ti", lbSoonT: "Pronto, un nuevo plan", lbSoonD: "Estamos preparando algo especial para ti.",
  lbHappy: "Happy Hour", lbDine: "Restaurante", lbWell: "Bienestar", lbEvent: "Evento", lbSocialK: "Social"
};
const EN = {
  lbExploreK: "Explore the", lbExploreT: "Experiences Hall", lbCode: "Your Code Today", lbCodeWeek: "Your code", lbCodeWeekAria: "Your code this week",
  lbEvents: "Special Events", lbRecs: "Our Recommendation", lbTalk: "Let's talk", lbDyk: "Did you know?", lbSeeAll: "See all", lbClose: "Close",
  lbBub1: "Tap the plaque to discover today's message", lbBub2: "A place picked just for you", lbSoonT: "Soon, a new plan", lbSoonD: "We're preparing something special for you.",
  lbHappy: "Happy Hour", lbDine: "Restaurant", lbWell: "Wellness", lbEvent: "Event", lbSocialK: "Social"
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
  const node = document.getElementById(id);
  if (!node) return false;
  if (id !== "codeCard" && !node.childElementCount) { return false; }
  if (!sheet) {
    sheet = mk("lb-sheet"); sheet.setAttribute("role", "dialog"); sheet.setAttribute("aria-modal", "true");
    sheetIn = mk("lb-sheet-in"); const x = mk("lb-sheet-x", "✕", "button"); x.type = "button"; x.setAttribute("aria-label", t("lbClose")); x.addEventListener("click", closeSheet);
    sheetIn.appendChild(x); sheet.appendChild(sheetIn);
    sheet.addEventListener("click", e => { if (e.target === sheet) closeSheet(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && sheet.classList.contains("open")) closeSheet(); });
    document.body.appendChild(sheet);
  }
  closeSheet();
  sheetHome = { parent: node.parentNode, next: node.nextSibling }; sheetNode = node; sheetPrev = document.activeElement;
  sheetIn.appendChild(node); sheet.classList.add("open");
  const x = sheetIn.querySelector(".lb-sheet-x"); if (x) x.focus();
  return true;
}
function closeSheet() {
  if (sheetNode && sheetHome) { sheetHome.parent.insertBefore(sheetNode, sheetHome.next); sheetNode = null; }
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

/* ---------- pantallas rotativas ---------- */
const CAT = { social: ["lbSocialK", "🥂"], dining: ["lbDine", "🍽️"], wellness: ["lbWell", "🌿"], events: ["lbEvent", "✨"] };
function planTiles(kind) {
  if (!C.session()) return [];
  const { plans } = C.homeData(), today = C.todayStr();
  const live = plans.filter(p => (p.kind === "event" || p.kind === "wellness" || (C.sideTrip && C.sideTrip(p))) && (!p.event_date || p.event_date >= today));
  let list;
  if (kind === "events") list = live.filter(p => p.kind === "event").sort((a, b) => String(a.event_date || "9").localeCompare(String(b.event_date || "9")));
  else { // Recomendación: un lugar de cada tipo (restaurante, happy hour, bienestar)
    list = ["dining", "social", "wellness"].map(c => live.filter(p => C.eventCategory(p) === c).sort((a, b) => String(a.id).localeCompare(String(b.id)))[0]).filter(Boolean);
  }
  return list.slice(0, 6).map(p => {
    const cat = C.eventCategory(p) || "events", ct = CAT[cat] || CAT.events, tag = C.planTag ? C.planTag(p.id) : {};
    return { id: p.id, img: C.safeUrl((tag && tag.homeImg) || p.image_url || ""), k: t(ct[0]), ic: ct[1], title: C.pick(p, "title") || "—", sub: [p.event_date ? C.fmtDate(p.event_date) : "", p.location].filter(Boolean).join(" · ") };
  });
}
function paintPanel(pn, kind) {
  const rot = pn.querySelector(".lb-rot"), dots = pn.querySelector(".lb-dots");
  let tiles = planTiles(kind);
  const soon = !tiles.length;
  if (soon) tiles = [{ soon: true, ic: kind === "events" ? "✨" : "🌿", k: t(kind === "events" ? "lbEvent" : "lbWell"), title: t("lbSoonT"), sub: t("lbSoonD") }];
  rot.replaceChildren(); dots.replaceChildren();
  tiles.forEach((it, i) => {
    const b = mk("lb-tile" + (i ? "" : " on"), null, "button"); b.type = "button";
    const ph = mk("lb-ph"); if (it.img) ph.style.backgroundImage = 'url("' + String(it.img).replace(/["\\()\s]/g, encodeURIComponent) + '")'; else ph.textContent = it.ic;
    b.append(ph, mk("lb-k", esc(it.k)), mk("lb-tt", esc(it.title)), mk("lb-ts", esc(it.sub)));
    b.addEventListener("click", () => { if (it.id && C.openDetail) C.openDetail(it.id); else seeAll(kind); });
    rot.appendChild(b); dots.appendChild(mk("", null, "i")).className = i ? "" : "on";
  });
  pn.__i = 0; pn.__n = tiles.length;
}
function rotate(pn) {
  if (pn.__n < 2) return;
  const tl = pn.querySelectorAll(".lb-tile"), dt = pn.querySelectorAll(".lb-dots i");
  tl[pn.__i].classList.remove("on"); dt[pn.__i].classList.remove("on");
  pn.__i = (pn.__i + 1) % pn.__n; tl[pn.__i].classList.add("on"); dt[pn.__i].classList.add("on");
}
function seeAll(kind) { if (C.showEventsCode) C.showEventsCode(""); else C.showPage("events"); }

/* ---------- construcción ---------- */
const SPARK = '<svg viewBox="0 0 24 24" fill="#7a2e45"><path d="M12 2l2 7 7 3-7 3-2 7-2-7-7-3 7-3z"/></svg>';
function build() {
  const host = document.getElementById("home"); if (!host || built) return;
  root = mk(""); root.id = "lobby"; root.setAttribute("role", "region"); root.setAttribute("aria-label", "Lobby");
  stage = mk("lb-stage");
  const img = new Image(); img.src = "lobby/home.webp?v=20261028b"; img.alt = ""; img.decoding = "async"; stage.appendChild(img);

  // saludo y marca
  const hello = place(mk("lb-abs lb-hello", '<div><div class="lb-greet"></div></div><div class="lb-brand"><div class="k">Club</div><div class="n">Código Mujer Libre</div><div class="t">CONECTA · VIVE · CRECE</div></div>'), 250, 40);
  stage.appendChild(hello);

  // pantallas
  [["events", 22], ["recs", 800]].forEach(([kind, x]) => {
    const pn = place(mk("lb-pn", ""), x, 494, 278, 312);
    const title = mk("lb-pt", esc(t(kind === "events" ? "lbEvents" : "lbRecs")), "button"); title.type = "button"; title.addEventListener("click", () => seeAll(kind));
    const rot = mk("lb-rot"), foot = mk("lb-foot"); foot.appendChild(mk("lb-dots"));
    const go = mk("lb-go", "›", "button"); go.type = "button"; go.setAttribute("aria-label", t("lbSeeAll")); go.addEventListener("click", () => seeAll(kind)); foot.appendChild(go);
    pn.append(title, rot, foot); pn.dataset.kind = kind; stage.appendChild(pn);
  });

  // placa Tu Código Hoy (abre la tarjeta que da vueltas, la misma de siempre)
  const plq = place(mk("lb-abs lb-plq", '<span class="med">' + SPARK + '</span><b></b><span class="lb-go">›</span>', "button"), 372, 676, 360, 96); plq.type = "button";
  plq.addEventListener("click", () => openSheet("codeCard")); stage.appendChild(plq);

  // burbuja
  const bub = place(mk("lb-abs lb-bub", ""), 380, 420, 320); stage.appendChild(bub);

  // caja de cristal: Tu código esta semana
  const box = place(mk("lb-abs lb-box", "", "button"), 372, 566, 90, 90); box.type = "button";
  for (let i = 0; i < 5; i++) { const s = mk("", null, "i"); s.style.left = (14 + i * 15) + "px"; s.style.top = (46 + (i % 2) * 14) + "px"; s.style.animationDelay = (i * 0.9) + "s"; box.appendChild(s); }
  box.addEventListener("click", () => { if (!openSheet("homeCodeWeek")) openSheet("codeCard"); }); stage.appendChild(box);
  const boxl = place(mk("lb-abs lb-boxl pop", "✦ <span></span>", "button"), 366, 544, 100, 20); boxl.type = "button";
  boxl.addEventListener("click", () => box.click()); stage.appendChild(boxl);

  // sobre (Hablemos)
  const env = place(mk("lb-abs lb-pc", '<div class="lb-env"><svg viewBox="0 0 100 70"><rect x="6" y="14" width="88" height="52" rx="5" fill="#fbe3e8" stroke="#e8a9ba" stroke-width="2"/><path d="M6 18l44 30 44-30" fill="#f7cdd7" stroke="#e8a9ba" stroke-width="2"/><g class="lb-heart"><path d="M50 52c-9-6-12-10-12-14a6 6 0 0 1 12-1 6 6 0 0 1 12 1c0 4-3 8-12 14z" fill="#d6455f" transform="translate(0 -6)"/></g></svg></div><span></span>', "button"), 262, 1028, 126); env.type = "button";
  env.addEventListener("click", () => { if (!openSheet("homeTalk")) C.showPage("support"); }); stage.appendChild(env);
  // mariposa (¿Sabías que?)
  const fly = place(mk("lb-abs lb-pc", '<div class="lb-fly"><svg viewBox="0 0 100 80"><g class="lb-wl"><path d="M50 40C38 8 8 6 10 28c1 14 18 20 40 12z" fill="#f2a9b8" stroke="#d27a90" stroke-width="1.5"/><path d="M50 44C36 64 14 70 20 52c3-8 18-12 30-8z" fill="#f7c7a8" stroke="#d27a90" stroke-width="1.5"/></g><g class="lb-wr"><path d="M50 40C62 8 92 6 90 28c-1 14-18 20-40 12z" fill="#f2a9b8" stroke="#d27a90" stroke-width="1.5"/><path d="M50 44C64 64 86 70 80 52c-3-8-18-12-30-8z" fill="#f7c7a8" stroke="#d27a90" stroke-width="1.5"/></g><rect x="48" y="30" width="4" height="30" rx="2" fill="#7a2e45"/></svg></div><span></span>', "button"), 700, 1014, 134); fly.type = "button";
  fly.addEventListener("click", () => { if (!openSheet("homeDyk")) C.showPage("home"); }); stage.appendChild(fly);

  // Explora el Hall
  const ex = place(mk("lb-abs lb-ex", '<svg viewBox="0 0 40 40" style="width:calc(var(--inv)*20px);height:auto;flex:none"><g fill="#f0d9a6"><ellipse cx="20" cy="9" rx="5" ry="8"/><ellipse cx="10" cy="19" rx="7" ry="4.5" transform="rotate(-25 10 19)"/><ellipse cx="30" cy="19" rx="7" ry="4.5" transform="rotate(25 30 19)"/><ellipse cx="20" cy="28" rx="6" ry="5"/></g></svg><span class="tx"><small></small><b></b></span><span class="lb-go">›</span>', "button"), 262, 1296, 576, 112); ex.type = "button";
  ex.addEventListener("click", () => { document.dispatchEvent(new CustomEvent("cml:hall")); if (window.CMLHall && window.CMLHall.open) window.CMLHall.open(); else seeAll("events"); }); stage.appendChild(ex);

  root.appendChild(stage); host.insertBefore(root, host.firstChild); built = true;
  fit(); if (window.ResizeObserver) new ResizeObserver(fit).observe(root); else addEventListener("resize", fit);
}
function labels() {
  if (!built) return;
  const q = (s, v, a) => { const n = stage.querySelector(s); if (n) n.textContent = v; if (n && a) n.parentNode.setAttribute && 0; };
  stage.querySelector(".lb-plq b").textContent = t("lbCode");
  stage.querySelector(".lb-boxl span").textContent = t("lbCodeWeek"); stage.querySelector(".lb-box").setAttribute("aria-label", t("lbCodeWeekAria")); stage.querySelector(".lb-boxl").setAttribute("aria-label", t("lbCodeWeekAria"));
  stage.querySelector(".lb-plq").setAttribute("aria-label", t("lbCode"));
  const pcs = stage.querySelectorAll(".lb-pc"); pcs[0].querySelector("span").textContent = t("lbTalk"); pcs[0].setAttribute("aria-label", t("lbTalk")); pcs[1].querySelector("span").textContent = t("lbDyk"); pcs[1].setAttribute("aria-label", t("lbDyk"));
  const ex = stage.querySelector(".lb-ex"); ex.querySelector("small").textContent = t("lbExploreK"); ex.querySelector("b").textContent = t("lbExploreT"); ex.setAttribute("aria-label", t("lbExploreK") + " " + t("lbExploreT"));
  stage.querySelectorAll(".lb-pn").forEach(pn => { pn.querySelector(".lb-pt").textContent = t(pn.dataset.kind === "events" ? "lbEvents" : "lbRecs"); pn.querySelector(".lb-go").setAttribute("aria-label", t("lbSeeAll")); });
  stage.querySelector(".lb-bub").textContent = t("lbBub1");
}
function paint() {
  if (!built) return; labels(); paintHello();
  stage.querySelectorAll(".lb-pn").forEach(pn => paintPanel(pn, pn.dataset.kind));
}
function start() {
  timers.forEach(clearInterval); timers = [];
  timers.push(setInterval(() => { if (!document.hidden) stage.querySelectorAll(".lb-pn").forEach(rotate); }, 5500));
  let n = 0; timers.push(setInterval(() => { n++; const b = stage.querySelector(".lb-bub"); if (b) b.textContent = t(n % 2 ? "lbBub2" : "lbBub1"); }, 12000));
}
function init() {
  C = window.CML; if (!C) return;
  C.addStrings(ES, EN);
  if (!document.documentElement.classList.contains("lobby-on")) return;
  build(); paint(); start();
  document.addEventListener("cml:session", () => setTimeout(paint, 60));
  document.addEventListener("cml:lang", () => setTimeout(paint, 60));
  document.addEventListener("cml:page", e => { if (e.detail && e.detail.page === "home") { fit(); paintHello(); } else closeSheet(); });
  window.CMLLobby = { paint };
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
