/* Atelier de Esencias: experiencia a partir de la foto del atelier (Tienda de Bienestar) */
(() => {
const C = () => window.CML, L = () => (C() && C().lang() === "en") ? 1 : 0;
const AR = 1672 / 941;
const GEO = [{ img: "lobby/esencias.webp?v=20261029a", orc: [41.5, 38.8, 10.6, 18.6, 46.5, 47.7], win: [56, 22, 8.4, 27], l1: [31, 28], l2: [51.8, 30.5], z: { z1: [0.6, 9.6, 19.6, 49], z2: [77, 9.6, 22, 55], z3: [21.8, 7.5, 7.8, 45], z4: [28, 50, 44.6, 44], z5: [66, 13, 8, 47] } },
  { img: "lobby/esencias-en.webp?v=20261029a", orc: [40.7, 42.5, 14.05, 19.1, 47.3, 52.6], win: [61.6, 14, 6, 40], l1: [30.8, 30], l2: [54.3, 30.6], z: { z1: [0, 4, 23.6, 49], z2: [75.4, 3, 24.6, 57], z3: [24, 8, 7, 35], z4: [26.3, 60.5, 50.8, 35], z5: [67.6, 8, 7, 35] } }];
const ING = [
  { k: "rosa", c: "#E58FA6", g: 0, t: ["Rosa", "Rose"] }, { k: "lavanda", c: "#A58BCB", g: 0, t: ["Lavanda", "Lavender"] }, { k: "jazmin", c: "#F3E7B8", g: 0, t: ["Jazmín", "Jasmine"] },
  { k: "orquidea", c: "#D96FB0", g: 0, t: ["Orquídea", "Orchid"] }, { k: "peonia", c: "#F4B6C2", g: 0, t: ["Peonía", "Peony"] }, { k: "manzanilla", c: "#F2D36B", g: 0, t: ["Manzanilla", "Chamomile"] },
  { k: "romero", c: "#6E9A63", g: 1, t: ["Romero", "Rosemary"] }, { k: "menta", c: "#74C7A5", g: 1, t: ["Menta", "Mint"] }, { k: "eucalipto", c: "#8DB7A8", g: 1, t: ["Eucalipto", "Eucalyptus"] },
  { k: "naranja", c: "#F0A24B", g: 1, t: ["Naranja", "Orange"] }, { k: "limon", c: "#F4DD6A", g: 1, t: ["Limón", "Lemon"] },
  { k: "sandalo", c: "#C9A073", g: 2, t: ["Sándalo", "Sandalwood"] }, { k: "vainilla", c: "#E7C58F", g: 2, t: ["Vainilla", "Vanilla"] }, { k: "canela", c: "#B5693B", g: 2, t: ["Canela", "Cinnamon"] }, { k: "incienso", c: "#D8CBB0", g: 2, t: ["Incienso", "Frankincense"] }];
const INT = [{ k: "calma", t: ["Calma", "Calm"] }, { k: "amor", t: ["Amor propio", "Self-love"] }, { k: "energia", t: ["Energía", "Energy"] }, { k: "sueno", t: ["Dormir en paz", "Restful sleep"] }];
const CAPS = ["#C9A169", "#E8A8B8", "#F1EAE0"];
const SP = [[8, 30], [14, 34], [20, 28], [11, 48], [24, 46], [5, 62], [17, 60], [26, 58], [10, 72], [22, 74], [84, 30], [90, 34], [95, 28], [87, 46], [93, 50], [82, 62], [91, 64], [97, 60], [86, 72], [94, 74], [52, 62], [58, 66], [64, 62], [47, 68], [70, 66], [40, 18], [66, 18]];
const S = {
  es: { title: "Atelier de Esencias", sub: "Un espacio solo tuyo para crear una esencia única, con flores, hierbas y maderas.", start: "Crear mi esencia", hint: "Desliza la escena y toca Perfumería, Aromaterapia o la Mesa de mezcla", close: "Cerrar", z1: "Perfumería", z2: "Aromaterapia", z3: "Frascos", z4: "Mesa de mezcla", z5: "Utensilios",
    d1: "Crea tu propio perfume: florales, maderas y resinas.", d2: "Crea tus esencias con flores, hierbas y frutas.", d3: "Clásicos, modernos, vintage y exclusivos. Elegirás el tuyo.", d5: "Morteros, cucharas y goteros de oro para tu mezcla.",
    pick: "Elige hasta 4 notas", pickP: "Compón tu perfume · hasta 4 notas", readyP: "Tu perfume está listo", defP: "Mi perfume", g: ["Flores", "Hierbas y frutas", "Maderas y resinas"], mix: "Mezclar mis notas", mixing: "Mezclando tus notas…", mix2: "Cada flor, una nota de ti",
    bt: "Elige tu frasco", nm: "Ponle nombre a tu creación", int: "Tu intención", cap: "Tapa", next: "Revelar mi esencia", ready: "Tu esencia está lista", save: "Guardar mi esencia", saved: "Guardada en tu colección. Pronto podrás pedirla hecha para ti.", again: "Crear otra", def: "Mi esencia", notes: "Notas", back: "Atrás" },
  en: { title: "Essence Atelier", sub: "A space just for you to create a one-of-a-kind essence from flowers, herbs and woods.", start: "Create my essence", hint: "Swipe the scene and tap Perfumery, Aromatherapy or the Blending table", close: "Close", z1: "Perfumery", z2: "Aromatherapy", z3: "Bottles", z4: "Blending table", z5: "Tools",
    d1: "Create your own perfume: florals, woods and resins.", d2: "Create your essences with flowers, herbs and fruits.", d3: "Classic, modern, vintage and exclusive. You will pick yours.", d5: "Golden mortars, spoons and droppers for your blend.",
    pick: "Choose up to 4 notes", pickP: "Compose your perfume · up to 4 notes", readyP: "Your perfume is ready", defP: "My perfume", g: ["Flowers", "Herbs & fruits", "Woods & resins"], mix: "Blend my notes", mixing: "Blending your notes…", mix2: "Every flower, a note of you",
    bt: "Choose your bottle", nm: "Name your creation", int: "Your intention", cap: "Cap", next: "Reveal my essence", ready: "Your essence is ready", save: "Save my essence", saved: "Saved to your collection. Soon you will be able to order it made for you.", again: "Create another", def: "My essence", notes: "Notes", back: "Back" } };
const s = k => S[L() ? "en" : "es"][k];
const mk = (cls, html, tag) => { const n = document.createElement(tag || "div"); n.className = cls; if (html != null) n.innerHTML = html; return n; };
const ing = k => ING.find(i => i.k === k);
const mix = a => { if (!a.length) return "#F3DFC8"; let r = 0, g = 0, b = 0; a.forEach(c => { const n = parseInt(c.slice(1), 16); r += n >> 16; g += (n >> 8) & 255; b += n & 255; }); const m = a.length; return "rgb(" + Math.round(r / m) + "," + Math.round(g / m) + "," + Math.round(b / m) + ")"; };
let uid = 0;
function bottle(style, cap, cols, level) {
  const id = "b" + (++uid), c1 = cols[0] || "#F3DFC8", c2 = cols[1] || c1, c3 = cols[2] || c2;
  const path = style === 1 ? "M40 56h40v14c6 4 8 10 8 20v62c0 6-6 10-14 10H46c-8 0-14-4-14-10V90c0-10 2-16 8-20z" : style === 2 ? "M44 58h32l16 22-6 70c-1 8-8 12-26 12S35 158 34 150l-6-70z" : "M42 58h36v10c18 8 28 24 28 50 0 26-12 40-46 40S14 144 14 118c0-26 10-42 28-50z";
  let pet = ""; cols.forEach((c, ci) => { for (let n = 0; n < 6; n++) pet += '<ellipse class="p" cx="' + (30 + ((n * 23 + ci * 13) % 60)) + '" cy="' + (96 + ((n * 17 + ci * 7) % 50)) + '" rx="4.5" ry="7.5" fill="' + c + '" style="animation-delay:' + (-(n * .7 + ci * .5)) + 's"/>'; });
  return '<svg viewBox="0 0 120 176" class="es-bt"><defs><linearGradient id="g' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c1 + '"/><stop offset=".55" stop-color="' + c2 + '"/><stop offset="1" stop-color="' + c3 + '"/></linearGradient><clipPath id="c' + id + '"><path d="' + path + '"/></clipPath></defs><rect x="46" y="12" width="28" height="24" rx="6" fill="' + cap + '" stroke="rgba(0,0,0,.12)"/><rect x="51" y="34" width="18" height="26" fill="#f7f0e7" stroke="#C9A169"/><g clip-path="url(#c' + id + ')"><rect x="0" y="0" width="120" height="176" fill="#fff" fill-opacity=".55"/><g class="es-liq" style="transform:translateY(' + (level == null ? 0 : level) + 'px)"><path class="es-wave" d="M-60 78q15-8 30 0t30 0 30 0 30 0 30 0 30 0v120h-180z" fill="url(#g' + id + ')"/><g>' + pet + '</g></g><path d="' + path + '" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="5" transform="translate(-3 0)"/></g><path d="' + path + '" fill="none" stroke="#C9A169" stroke-width="2.4"/><path d="M30 100v40" stroke="#fff" stroke-opacity=".7" stroke-width="3" stroke-linecap="round"/></svg>';
}
function open() {
  if (document.querySelector(".es-ov")) return;
  const st = { sel: [], bs: 0, cap: 0, intent: "calma", g: 0, mode: "aroma" }, G = GEO[L()], IMG = G.img;
  const ov = mk("es-ov"); ov.setAttribute("role", "dialog");
  const top = mk("es-top", '<b>' + s("title") + '</b><button type="button" class="es-x" aria-label="' + s("close") + '">×</button>');
  const view = mk("es-view"), pan = mk("es-pan"), stg = mk("es-st"); stg.style.backgroundImage = "url(" + IMG + ")";
  stg.appendChild(mk("es-sheen"));
  const orc = mk("es-orc"); orc.style.cssText = "background-image:url(" + IMG + ");left:" + G.orc[0] + "%;top:" + G.orc[1] + "%;width:" + G.orc[2] + "%;height:" + G.orc[3] + "%;background-size:" + (10000 / G.orc[2]) + "% " + (10000 / G.orc[3]) + "%;background-position:" + G.orc[4] + "% " + G.orc[5] + "%"; stg.appendChild(orc);
  const win = mk("es-win"); win.style.cssText = "left:" + G.win[0] + "%;top:" + G.win[1] + "%;width:" + G.win[2] + "%;height:" + G.win[3] + "%"; stg.appendChild(win);
  [["l1", G.l1], ["l2", G.l2]].forEach(l => { const e = mk("es-lamp " + l[0]); e.style.cssText = "left:" + l[1][0] + "%;top:" + l[1][1] + "%"; stg.appendChild(e); });
  SP.forEach((p, i) => { const sp = mk("es-sp"); sp.style.cssText = "left:" + p[0] + "%;top:" + p[1] + "%;animation-delay:" + (-(i * .37)).toFixed(2) + "s;--z:" + (.6 + (i % 4) * .25); stg.appendChild(sp); });
  for (let i = 0; i < 22; i++) { const d = mk("es-du"); d.style.cssText = "left:" + ((i * 37) % 100) + "%;animation-duration:" + (9 + (i % 6) * 2) + "s;animation-delay:" + (-(i * 1.3)).toFixed(1) + "s;--s:" + (2 + (i % 3)) + "px"; stg.appendChild(d); }
  const Z = G.z, ZN = [["z1", ...Z.z1, "d1", "perfume"], ["z2", ...Z.z2, "d2", "aroma"], ["z3", ...Z.z3, "d3"], ["z4", ...Z.z4, "", "table"], ["z5", ...Z.z5, "d5"]];
  const panel = mk("es-panel"); const note = mk("es-note");
  ZN.forEach(z => { const b = mk("es-zone " + z[0], '<span class="es-pill">' + s(z[0]) + '</span>', "button"); b.type = "button"; b.style.cssText = "left:" + z[1] + "%;top:" + z[2] + "%;width:" + z[3] + "%;height:" + z[4] + "%"; b.addEventListener("click", () => { zoneTap(z); }); stg.appendChild(b); });
  pan.appendChild(stg); view.appendChild(pan); ov.append(top, view, panel);
  const fit = () => { const h = view.clientHeight; stg.style.width = Math.round(h * AR) + "px"; };
  const center = () => { pan.scrollLeft = (stg.scrollWidth - pan.clientWidth) / 2; };
  const zoneTap = z => { if (z[6] === "perfume" || z[6] === "aroma") { st.mode = z[6]; st.g = z[6] === "perfume" ? 0 : 1; st.sel = []; } if (z[5]) { note.textContent = s(z[5]); note.classList.remove("on"); void note.offsetWidth; note.classList.add("on"); } if (z[6]) stepSel(); };
  const spark = () => { const n = 14; for (let i = 0; i < n; i++) { const b = mk("es-burst"); const a = (i / n) * Math.PI * 2, d = 80 + (i % 3) * 40; b.style.cssText = "--dx:" + Math.cos(a) * d + "px;--dy:" + Math.sin(a) * d + "px;background:" + (i % 2 ? "#F6E7C6" : "#E58FA6"); ov.appendChild(b); setTimeout(() => b.remove(), 1600); } };
  const chime = () => { try { const A = window.AudioContext || window.webkitAudioContext; if (!A) return; const x = new A(); [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => { const o = x.createOscillator(), g = x.createGain(); o.type = "sine"; o.frequency.value = f; g.gain.setValueAtTime(0, x.currentTime + i * .18); g.gain.linearRampToValueAtTime(.07, x.currentTime + i * .18 + .05); g.gain.exponentialRampToValueAtTime(.0001, x.currentTime + i * .18 + 1.6); o.connect(g).connect(x.destination); o.start(x.currentTime + i * .18); o.stop(x.currentTime + i * .18 + 1.7); }); setTimeout(() => x.close(), 3000); } catch (e) {} };
  function step0() { st.step = 0; panel.replaceChildren(mk("es-h", s("title")), mk("es-p", s("sub")), note, (() => { const b = mk("es-cta", s("start"), "button"); b.type = "button"; b.addEventListener("click", step1); return b; })(), mk("es-hint", s("hint"))); }
  function step1() { st.g = st.mode === "perfume" ? 0 : st.g; stepSel(); }
  function stepSel() {
    st.step = 1;
    const tabs = mk("es-tabs"); s("g").forEach((g, i) => { const b = mk("es-tab" + (i === st.g ? " on" : ""), g, "button"); b.type = "button"; b.addEventListener("click", () => { st.g = i; stepSel(); }); tabs.appendChild(b); });
    const grid = mk("es-grid"); ING.filter(i => i.g === st.g).forEach(i => { const b = mk("es-ing" + (st.sel.includes(i.k) ? " on" : ""), '<i style="background:radial-gradient(circle at 35% 30%,#fff,' + i.c + ' 55%,' + i.c + ')"></i><span>' + i.t[L()] + '</span>', "button"); b.type = "button"; b.addEventListener("click", () => { const x = st.sel.indexOf(i.k); if (x >= 0) st.sel.splice(x, 1); else { if (st.sel.length >= 4) st.sel.shift(); st.sel.push(i.k); } stepSel(); }); grid.appendChild(b); });
    const row = mk("es-sel"); st.sel.forEach(k => row.appendChild(mk("es-dot", "", "i"))); row.querySelectorAll("i").forEach((d, n) => { d.style.background = ing(st.sel[n]).c; });
    const go = mk("es-cta", s("mix"), "button"); go.type = "button"; go.disabled = st.sel.length < 2; go.addEventListener("click", mixing);
    panel.replaceChildren(mk("es-h", s(st.mode === "perfume" ? "pickP" : "pick") + " · " + st.sel.length + "/4"), tabs, grid, row, go); panel.scrollTop = 0;
  }
  function mixing() {
    const cols = st.sel.map(k => ing(k).c), m = mk("es-mixv", '<div class="es-mt">' + s("mixing") + '</div><div class="es-mf">' + bottle(0, CAPS[0], cols, 78) + '</div><div class="es-ms">' + s("mix2") + '</div>');
    const f = m.querySelector(".es-mf"); cols.forEach((c, ci) => { for (let n = 0; n < 9; n++) { const p = mk("es-fall"); p.style.cssText = "left:" + (38 + ((n * 11 + ci * 7) % 26)) + "%;background:" + c + ";animation-delay:" + (ci * .9 + n * .22).toFixed(2) + "s"; f.appendChild(p); } });
    ov.appendChild(m); const liq = m.querySelector(".es-liq"); requestAnimationFrame(() => { liq.style.transition = "transform 4.6s ease-in-out"; liq.style.transform = "translateY(-34px)"; });
    setTimeout(() => { m.classList.add("out"); setTimeout(() => m.remove(), 700); step3(); }, 4900);
  }
  function step3() {
    st.step = 3; const cols = st.sel.map(k => ing(k).c);
    const prev = mk("es-prev"); const paintPrev = () => { prev.innerHTML = bottle(st.bs, CAPS[st.cap], cols, -34); };
    const bs = mk("es-row"); [0, 1, 2].forEach(i => { const b = mk("es-bs" + (i === st.bs ? " on" : ""), bottle(i, CAPS[0], cols, -34), "button"); b.type = "button"; b.addEventListener("click", () => { st.bs = i; step3(); }); bs.appendChild(b); });
    const cp = mk("es-row"); CAPS.forEach((c, i) => { const b = mk("es-cp" + (i === st.cap ? " on" : ""), "", "button"); b.type = "button"; b.style.background = c; b.addEventListener("click", () => { st.cap = i; step3(); }); cp.appendChild(b); });
    const it = mk("es-row"); INT.forEach(i => { const b = mk("es-tab" + (i.k === st.intent ? " on" : ""), i.t[L()], "button"); b.type = "button"; b.addEventListener("click", () => { st.intent = i.k; step3(); }); it.appendChild(b); });
    const inp = mk("es-in", "", "input"); inp.maxLength = 28; inp.placeholder = s("nm"); inp.value = st.name || ""; inp.addEventListener("input", () => { st.name = inp.value; });
    const go = mk("es-cta", s("next"), "button"); go.type = "button"; go.addEventListener("click", reveal);
    paintPrev(); panel.replaceChildren(mk("es-h", s("bt")), prev, bs, mk("es-lb", s("cap")), cp, mk("es-lb", s("int")), it, inp, go); panel.scrollTop = 0;
  }
  function reveal() {
    st.step = 4; const cols = st.sel.map(k => ing(k).c), name = (st.name || "").trim() || s(st.mode === "perfume" ? "defP" : "def");
    const r = mk("es-rev", '<div class="es-rays"></div><div class="es-rt">' + s(st.mode === "perfume" ? "readyP" : "ready") + '</div><div class="es-rb">' + bottle(st.bs, CAPS[st.cap], cols, -34) + '</div><div class="es-rn"></div><div class="es-rs"></div>');
    r.querySelector(".es-rn").textContent = name; r.querySelector(".es-rs").textContent = s("notes") + ": " + st.sel.map(k => ing(k).t[L()]).join(" · ") + " — " + INT.find(i => i.k === st.intent).t[L()];
    const sv = mk("es-cta", s("save"), "button"), ok = mk("es-ok"), ag = mk("es-ghost", s("again"), "button"); sv.type = ag.type = "button";
    sv.addEventListener("click", () => { try { const a = JSON.parse(localStorage.getItem("cml_essences") || "[]"); a.push({ n: name, ing: st.sel, intent: st.intent, bs: st.bs, cap: st.cap, at: Date.now() }); localStorage.setItem("cml_essences", JSON.stringify(a.slice(-20))); } catch (e) {} ok.textContent = s("saved"); sv.disabled = true; spark(); });
    ag.addEventListener("click", () => { r.remove(); st.sel = []; st.name = ""; step0(); });
    r.append(sv, ok, ag); ov.appendChild(r); spark(); chime();
  }
  const close = () => ov.remove(); top.querySelector(".es-x").addEventListener("click", close);
  document.body.appendChild(ov); fit(); center(); step0(); setTimeout(() => { fit(); center(); }, 120); addEventListener("resize", () => { fit(); center(); });
}
function button() { const b = mk("el-open", '<span class="el-oi">✿</span><span><b>' + s("title") + '</b><small>' + s("sub") + '</small></span>', "button"); b.type = "button"; b.addEventListener("click", open); return b; }
window.CMLEssenceLab = { open, button, close: () => { const o = document.querySelector(".es-ov"); if (o) o.remove(); } };
})();
