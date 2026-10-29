/* Atelier de Esencias: experiencia a partir de la foto del atelier (Tienda de Bienestar) */
(() => {
const C = () => window.CML, L = () => (C() && C().lang() === "en") ? 1 : 0;
const AR = 1672 / 941;
const GEO = [{ img: "lobby/esencias.webp?v=20261029a", orc: [41.5, 38.8, 10.6, 18.6, 46.5, 47.7], win: [56, 22, 8.4, 27], l1: [31, 28], l2: [51.8, 30.5], z: { z1: [0.6, 9.6, 19.6, 49], z2: [77, 9.6, 22, 55], z3: [21.8, 7.5, 7.8, 45], z4: [28, 50, 44.6, 44], z5: [66, 13, 8, 47] } },
  { img: "lobby/esencias-en.webp?v=20261029a", orc: [40.7, 42.5, 14.05, 19.1, 47.3, 52.6], win: [61.6, 14, 6, 40], l1: [30.8, 30], l2: [54.3, 30.6], z: { z1: [0, 4, 23.6, 49], z2: [75.4, 3, 24.6, 57], z3: [24, 8, 7, 35], z4: [26.3, 60.5, 50.8, 35], z5: [67.6, 8, 7, 35] } }];
const ING = [
  { k: "rosa", d: ["dulce y aterciopelada", "sweet and velvety"], c: "#E58FA6", g: 0, t: ["Rosa", "Rose"] }, { k: "lavanda", d: ["calmante, como un campo al atardecer", "calming, like a field at dusk"], c: "#A58BCB", g: 0, t: ["Lavanda", "Lavender"] }, { k: "jazmin", d: ["cálido, sensual y luminoso", "warm, sensual and radiant"], c: "#F3E7B8", g: 0, t: ["Jazmín", "Jasmine"] },
  { k: "orquidea", d: ["exótica, suave y cremosa", "exotic, soft and creamy"], c: "#D96FB0", g: 0, t: ["Orquídea", "Orchid"] }, { k: "peonia", d: ["fresca, delicada y rosada", "fresh, delicate and rosy"], c: "#F4B6C2", g: 0, t: ["Peonía", "Peony"] }, { k: "manzanilla", d: ["tierna, con aroma a miel", "gentle, with a honeyed scent"], c: "#F2D36B", g: 0, t: ["Manzanilla", "Chamomile"] },
  { k: "romero", d: ["verde, limpio y despierto", "green, clean and awakening"], c: "#6E9A63", g: 1, t: ["Romero", "Rosemary"] }, { k: "menta", d: ["fresca, helada y alegre", "cool, crisp and cheerful"], c: "#74C7A5", g: 1, t: ["Menta", "Mint"] }, { k: "eucalipto", d: ["aire de bosque tras la lluvia", "forest air after rain"], c: "#8DB7A8", g: 1, t: ["Eucalipto", "Eucalyptus"] },
  { k: "naranja", d: ["dulce, soleada y vibrante", "sweet, sunny and vibrant"], c: "#F0A24B", g: 1, t: ["Naranja", "Orange"] }, { k: "limon", d: ["chispeante y limpio", "sparkling and clean"], c: "#F4DD6A", g: 1, t: ["Limón", "Lemon"] },
  { k: "sandalo", d: ["cremoso, profundo y envolvente", "creamy, deep and enveloping"], c: "#C9A073", g: 2, t: ["Sándalo", "Sandalwood"] }, { k: "vainilla", d: ["abrazo cálido y dulce", "a warm, sweet embrace"], c: "#E7C58F", g: 2, t: ["Vainilla", "Vanilla"] }, { k: "canela", d: ["cálida y especiada, como hogar", "warm and spiced, like home"], c: "#B5693B", g: 2, t: ["Canela", "Cinnamon"] }, { k: "incienso", d: ["sereno, ahumado y sagrado", "serene, smoky and sacred"], c: "#D8CBB0", g: 2, t: ["Incienso", "Frankincense"] }];
const INT = [{ k: "calma", t: ["Calma", "Calm"] }, { k: "amor", t: ["Amor propio", "Self-love"] }, { k: "energia", t: ["Energía", "Energy"] }, { k: "sueno", t: ["Dormir en paz", "Restful sleep"] }];
const CAPS = ["#C9A169", "#E8A8B8", "#F1EAE0"];
const SP = [[8, 30], [14, 34], [20, 28], [11, 48], [24, 46], [5, 62], [17, 60], [26, 58], [10, 72], [22, 74], [84, 30], [90, 34], [95, 28], [87, 46], [93, 50], [82, 62], [91, 64], [97, 60], [86, 72], [94, 74], [52, 62], [58, 66], [64, 62], [47, 68], [70, 66], [40, 18], [66, 18]];
const S = {
  es: { title: "Atelier de Esencias", sub: "Un espacio solo tuyo para crear una esencia única, con flores, hierbas y maderas.", start: "Crear mi esencia", hint: "Desliza la escena y toca Perfumería, Aromaterapia o la Mesa de mezcla", close: "Cerrar", z1: "Perfumería", z2: "Aromaterapia", z3: "Frascos", z4: "Mesa de mezcla", z5: "Utensilios",
    d1: "Crea tu propio perfume: florales, maderas y resinas.", d2: "Crea tus esencias con flores, hierbas y frutas.", d3: "Clásicos, modernos, vintage y exclusivos. Elegirás el tuyo.", d5: "Morteros, cucharas y goteros de oro para tu mezcla.",
    pick: "Elige hasta 4 notas", pickP: "Compón tu perfume · hasta 4 notas", readyP: "Tu perfume está listo", defP: "Mi perfume", g: ["Flores", "Hierbas y frutas", "Maderas y resinas"], mix: "Mezclar mis notas", mixing: "Mezclando tus notas…", mix2: "Cada flor, una nota de ti",
    bt: "Elige tu frasco", nm: "Ponle nombre a tu creación", int: "Tu intención", cap: "Tapa", next: "Revelar mi esencia", ready: "Tu esencia está lista", save: "Guardar mi esencia", saved: "Guardada en tu colección. Pronto podrás pedirla hecha para ti.", again: "Crear otra", lab: "Etiqueta", pk: "Empácala", pk1: "Caja", pk2: "Lazo", dedic: "Mensaje en la tarjeta (opcional)", dedicDef: "Para ti, con amor", packNext: "Empacar mi esencia", packing: "Empacando con cariño…", packing2: "Tu creación, lista para llevar", order: "Llévatela · Pedir mi esencia", ordered: "¡Listo! Recibimos tu pedido. Te contactaremos para entregártela.", box: ["Marfil", "Rosa", "Esmeralda", "Noche"], rib: ["Oro", "Rosa", "Champán"], labs: ["Clásica", "Rosa", "Noche"], brand: "CÓDIGO MUJER LIBRE", def: "Mi esencia", notes: "Notas", back: "Atrás" },
  en: { title: "Essence Atelier", sub: "A space just for you to create a one-of-a-kind essence from flowers, herbs and woods.", start: "Create my essence", hint: "Swipe the scene and tap Perfumery, Aromatherapy or the Blending table", close: "Close", z1: "Perfumery", z2: "Aromatherapy", z3: "Bottles", z4: "Blending table", z5: "Tools",
    d1: "Create your own perfume: florals, woods and resins.", d2: "Create your essences with flowers, herbs and fruits.", d3: "Classic, modern, vintage and exclusive. You will pick yours.", d5: "Golden mortars, spoons and droppers for your blend.",
    pick: "Choose up to 4 notes", pickP: "Compose your perfume · up to 4 notes", readyP: "Your perfume is ready", defP: "My perfume", g: ["Flowers", "Herbs & fruits", "Woods & resins"], mix: "Blend my notes", mixing: "Blending your notes…", mix2: "Every flower, a note of you",
    bt: "Choose your bottle", nm: "Name your creation", int: "Your intention", cap: "Cap", next: "Reveal my essence", ready: "Your essence is ready", save: "Save my essence", saved: "Saved to your collection. Soon you will be able to order it made for you.", again: "Create another", lab: "Label", pk: "Pack it", pk1: "Box", pk2: "Ribbon", dedic: "Card message (optional)", dedicDef: "For you, with love", packNext: "Pack my essence", packing: "Packing with love…", packing2: "Your creation, ready to take home", order: "Take it home · Order my essence", ordered: "Done! We received your order. We will contact you to deliver it.", box: ["Ivory", "Rose", "Emerald", "Midnight"], rib: ["Gold", "Rose", "Champagne"], labs: ["Classic", "Rose", "Night"], brand: "CÓDIGO MUJER LIBRE", def: "My essence", notes: "Notes", back: "Back" } };
const s = k => S[L() ? "en" : "es"][k];
const mk = (cls, html, tag) => { const n = document.createElement(tag || "div"); n.className = cls; if (html != null) n.innerHTML = html; return n; };
const ing = k => ING.find(i => i.k === k);
const mix = a => { if (!a.length) return "#F3DFC8"; let r = 0, g = 0, b = 0; a.forEach(c => { const n = parseInt(c.slice(1), 16); r += n >> 16; g += (n >> 8) & 255; b += n & 255; }); const m = a.length; return "rgb(" + Math.round(r / m) + "," + Math.round(g / m) + "," + Math.round(b / m) + ")"; };

let AX = null, MUTE = false, PAD = null;
function ax() { if (AX) return AX; try { const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; AX = new A(); const m = AX.createGain(); m.gain.value = MUTE ? 0 : 1; m.connect(AX.destination); AX.__m = m; } catch (e) { AX = null; } return AX; }
function tone(f, d, v, type, when) { const x = ax(); if (!x || MUTE) return; try { const t0 = x.currentTime + (when || 0), o = x.createOscillator(), g = x.createGain(); o.type = type || "sine"; o.frequency.value = f; g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(v, t0 + .02); g.gain.exponentialRampToValueAtTime(.0001, t0 + d); o.connect(g).connect(x.__m); o.start(t0); o.stop(t0 + d + .05); } catch (e) {} }
const tink = () => { const f = [880, 988, 1175, 1319][Math.floor(Math.random() * 4)]; tone(f, 1.4, .011); tone(f * 2, .8, .003); };
function splash(n) { const x = ax(); if (!x || MUTE) return; for (let i = 0; i < n; i++) tone(300 + Math.random() * 500, .25, .01, "sine", i * (4.4 / n)); }
function padOn() { const x = ax(); if (!x || PAD) return; try { const g = x.createGain(); g.gain.value = 0; g.gain.linearRampToValueAtTime(.014, x.currentTime + 6); g.connect(x.__m); const os = [174.6, 261.6, 329.6, 392].map((f, i) => { const o = x.createOscillator(); o.type = "sine"; o.frequency.value = f; const l = x.createOscillator(), lg = x.createGain(); l.frequency.value = .07 + i * .03; lg.gain.value = 1.2; l.connect(lg).connect(o.frequency); const og = x.createGain(); og.gain.value = i === 0 ? 1 : .55; o.connect(og).connect(g); o.start(); l.start(); return [o, l]; }); PAD = { g, os }; } catch (e) {} }
function padOff() { if (!PAD) return; try { const x = AX; PAD.g.gain.cancelScheduledValues(x.currentTime); PAD.g.gain.setValueAtTime(PAD.g.gain.value, x.currentTime); PAD.g.gain.linearRampToValueAtTime(0, x.currentTime + .6); const p = PAD; setTimeout(() => { p.os.forEach(a => { try { a[0].stop(); a[1].stop(); } catch (e) {} }); }, 700); } catch (e) {} PAD = null; }
const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function labelSvg(lab) { if (!lab) return ""; const c = LABS[lab.st] || LABS[0], n = String(lab.name || ""), fs = n.length > 16 ? 6.2 : n.length > 11 ? 7.4 : 9; return '<g><rect x="34" y="100" width="52" height="38" rx="2.5" fill="' + c[0] + '" stroke="' + c[1] + '" stroke-width=".9"/><rect x="36.5" y="102.5" width="47" height="33" rx="1.5" fill="none" stroke="' + c[1] + '" stroke-width=".4"/><text x="60" y="113" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-size="3.4" letter-spacing=".5" fill="' + c[1] + '">' + esc(lab.brand || "") + '</text><text x="60" y="124.5" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-style="italic" font-weight="700" font-size="' + fs + '" fill="' + c[2] + '">' + esc(n) + '</text><path d="M48 130h24" stroke="' + c[1] + '" stroke-width=".5"/></g>'; }
const BOX = ["#F4EBDD", "#F2B8C6", "#2F6B52", "#1E1620"], RIB = ["#D9B872", "#E8789A", "#EBDDC4"];
function boxSvg(b, r, name, msg) { const c = BOX[b], d = RIB[r]; return '<svg viewBox="0 0 200 200" class="bx"><ellipse cx="100" cy="184" rx="78" ry="8" fill="rgba(0,0,0,.28)"/><rect class="bx-body" x="30" y="96" width="140" height="82" rx="7" fill="' + c + '" stroke="rgba(0,0,0,.18)"/><rect x="30" y="96" width="140" height="10" fill="rgba(0,0,0,.08)"/><rect class="bx-rib" x="92" y="96" width="16" height="82" fill="' + d + '"/><g class="bx-lidg"><rect x="24" y="70" width="152" height="32" rx="7" fill="' + c + '" stroke="rgba(0,0,0,.2)"/><rect x="24" y="70" width="152" height="8" rx="4" fill="rgba(255,255,255,.35)"/><rect x="92" y="70" width="16" height="32" fill="' + d + '"/></g><g class="bx-bow"><path d="M100 68C78 38 52 50 72 66c10 8 22 4 28 2z" fill="' + d + '" stroke="rgba(0,0,0,.2)"/><path d="M100 68C122 38 148 50 128 66c-10 8-22 4-28 2z" fill="' + d + '" stroke="rgba(0,0,0,.2)"/><circle cx="100" cy="68" r="7" fill="' + d + '" stroke="rgba(0,0,0,.25)"/></g><g class="bx-tag"><path d="M104 74q22 14 30 30" stroke="' + d + '" fill="none" stroke-width="1.6"/><g transform="rotate(-10 140 118)"><rect x="118" y="104" width="46" height="30" rx="3" fill="#FFF8EF" stroke="' + d + '"/><circle cx="123" cy="109" r="1.8" fill="' + d + '"/><text x="141" y="118" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-style="italic" font-weight="700" font-size="6.4" fill="#6E0C2B">' + esc(String(name).slice(0, 16)) + '</text><text x="141" y="127" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-size="4.6" fill="#8a6a34">' + esc(String(msg || "").slice(0, 26)) + '</text></g></g></svg>'; }
let uid = 0;
const LABS = [["#FBF4E6", "#C9A169", "#5a2a1a"], ["#F8D9E1", "#B7456B", "#6E0C2B"], ["#2a1a22", "#D9B872", "#F6E7C6"]];
function bottle(style, cap, cols, level, lab) {
  const id = "b" + (++uid), c1 = cols[0] || "#F3DFC8", c2 = cols[1] || c1, c3 = cols[2] || c2;
  const path = style === 1 ? "M40 56h40v14c6 4 8 10 8 20v62c0 6-6 10-14 10H46c-8 0-14-4-14-10V90c0-10 2-16 8-20z" : style === 2 ? "M44 58h32l16 22-6 70c-1 8-8 12-26 12S35 158 34 150l-6-70z" : "M42 58h36v10c18 8 28 24 28 50 0 26-12 40-46 40S14 144 14 118c0-26 10-42 28-50z";
  let pet = ""; cols.forEach((c, ci) => { for (let n = 0; n < 6; n++) pet += '<ellipse class="p" cx="' + (30 + ((n * 23 + ci * 13) % 60)) + '" cy="' + (96 + ((n * 17 + ci * 7) % 50)) + '" rx="4.5" ry="7.5" fill="' + c + '" style="animation-delay:' + (-(n * .7 + ci * .5)) + 's"/>'; });
  return '<svg viewBox="0 0 120 176" class="es-bt"><defs><linearGradient id="g' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c1 + '"/><stop offset=".55" stop-color="' + c2 + '"/><stop offset="1" stop-color="' + c3 + '"/></linearGradient><clipPath id="c' + id + '"><path d="' + path + '"/></clipPath></defs><rect x="46" y="12" width="28" height="24" rx="6" fill="' + cap + '" stroke="rgba(0,0,0,.12)"/><rect x="51" y="34" width="18" height="26" fill="#f7f0e7" stroke="#C9A169"/><g clip-path="url(#c' + id + ')"><rect x="0" y="0" width="120" height="176" fill="#fff" fill-opacity=".55"/><g class="es-liq" style="transform:translateY(' + (level == null ? 0 : level) + 'px)"><path class="es-wave" d="M-60 78q15-8 30 0t30 0 30 0 30 0 30 0 30 0v120h-180z" fill="url(#g' + id + ')"/><g>' + pet + '</g></g><path d="' + path + '" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="5" transform="translate(-3 0)"/></g><path d="' + path + '" fill="none" stroke="#C9A169" stroke-width="2.4"/>'+ labelSvg(lab) +'<path d="M30 100v40" stroke="#fff" stroke-opacity=".7" stroke-width="3" stroke-linecap="round"/></svg>';
}
function open() {
  if (document.querySelector(".es-ov")) return;
  const st = { sel: [], bs: 0, cap: 0, intent: "calma", g: 0, mode: "aroma", lab: 0, box: 0, rib: 0, msg: "" }, G = GEO[L()], IMG = G.img;
  const ov = mk("es-ov"); ov.setAttribute("role", "dialog");
  const top = mk("es-top", '<b>' + s("title") + '</b><span class="es-tr"><button type="button" class="es-snd" aria-label="Sonido">♪</button><button type="button" class="es-x" aria-label="' + s("close") + '">×</button></span>');
  const view = mk("es-view"), pan = mk("es-pan"), stg = mk("es-st"); stg.style.backgroundImage = "url(" + IMG + ")";
  stg.appendChild(mk("es-sheen"));
  const orc = mk("es-orc"); orc.style.cssText = "background-image:url(" + IMG + ");left:" + G.orc[0] + "%;top:" + G.orc[1] + "%;width:" + G.orc[2] + "%;height:" + G.orc[3] + "%;background-size:" + (10000 / G.orc[2]) + "% " + (10000 / G.orc[3]) + "%;background-position:" + G.orc[4] + "% " + G.orc[5] + "%"; stg.appendChild(orc);
  const win = mk("es-win"); win.style.cssText = "left:" + G.win[0] + "%;top:" + G.win[1] + "%;width:" + G.win[2] + "%;height:" + G.win[3] + "%"; stg.appendChild(win);
  [["l1", G.l1], ["l2", G.l2]].forEach(l => { const e = mk("es-lamp " + l[0]); e.style.cssText = "left:" + l[1][0] + "%;top:" + l[1][1] + "%"; stg.appendChild(e); });
  SP.forEach((p, i) => { const sp = mk("es-sp"); sp.style.cssText = "left:" + p[0] + "%;top:" + p[1] + "%;animation-delay:" + (-(i * .37)).toFixed(2) + "s;--z:" + (.6 + (i % 4) * .25); stg.appendChild(sp); });
  [[27, 58], [36, 62], [47, 60], [58, 62], [67, 58], [18, 70], [82, 56]].forEach((p, i) => { const w = mk("es-wisp"); w.style.cssText = "left:" + p[0] + "%;top:" + p[1] + "%;animation-delay:" + (-(i * 1.7)).toFixed(1) + "s"; stg.appendChild(w); });
  for (let i = 0; i < 22; i++) { const d = mk("es-du"); d.style.cssText = "left:" + ((i * 37) % 100) + "%;animation-duration:" + (9 + (i % 6) * 2) + "s;animation-delay:" + (-(i * 1.3)).toFixed(1) + "s;--s:" + (2 + (i % 3)) + "px"; stg.appendChild(d); }
  const Z = G.z, ZN = [["z1", ...Z.z1, "d1", "perfume"], ["z2", ...Z.z2, "d2", "aroma"], ["z3", ...Z.z3, "d3"], ["z4", ...Z.z4, "", "table"], ["z5", ...Z.z5, "d5"]];
  const panel = mk("es-panel"); const note = mk("es-note");
  ZN.forEach(z => { const b = mk("es-zone " + z[0], '<span class="es-pill">' + s(z[0]) + '</span>', "button"); b.type = "button"; b.style.cssText = "left:" + z[1] + "%;top:" + z[2] + "%;width:" + z[3] + "%;height:" + z[4] + "%"; b.addEventListener("click", () => { zoneTap(z); }); stg.appendChild(b); });
  pan.appendChild(stg); view.appendChild(pan); ov.append(top, view, panel);
  const fit = () => { const h = view.clientHeight; stg.style.width = Math.round(h * AR) + "px"; };
  const center = () => { pan.scrollLeft = (stg.scrollWidth - pan.clientWidth) / 2; };
  const zoneTap = z => { if (z[6] === "perfume" || z[6] === "aroma") { st.mode = z[6]; st.g = z[6] === "perfume" ? 0 : 1; st.sel = []; } if (z[5]) { note.textContent = s(z[5]); note.classList.remove("on"); void note.offsetWidth; note.classList.add("on"); } if (z[6]) stepSel(); };
  const spark = () => { const n = 14; for (let i = 0; i < n; i++) { const b = mk("es-burst"); const a = (i / n) * Math.PI * 2, d = 80 + (i % 3) * 40; b.style.cssText = "--dx:" + Math.cos(a) * d + "px;--dy:" + Math.sin(a) * d + "px;background:" + (i % 2 ? "#F6E7C6" : "#E58FA6"); ov.appendChild(b); setTimeout(() => b.remove(), 1600); } };
  const chime = () => { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, 2.2, .025, "sine", i * .22)); };
  function step0() { st.step = 0; panel.replaceChildren(mk("es-h", s("title")), mk("es-p", s("sub")), note, (() => { const b = mk("es-cta", s("start"), "button"); b.type = "button"; b.addEventListener("click", step1); return b; })(), mk("es-hint", s("hint"))); }
  function step1() { st.g = st.mode === "perfume" ? 0 : st.g; stepSel(); }
  function stepSel() {
    st.step = 1;
    const tabs = mk("es-tabs"); s("g").forEach((g, i) => { const b = mk("es-tab" + (i === st.g ? " on" : ""), g, "button"); b.type = "button"; b.addEventListener("click", () => { st.g = i; stepSel(); }); tabs.appendChild(b); });
    const grid = mk("es-grid"); ING.filter(i => i.g === st.g).forEach(i => { const b = mk("es-ing" + (st.sel.includes(i.k) ? " on" : ""), '<i style="background:radial-gradient(circle at 35% 30%,#fff,' + i.c + ' 55%,' + i.c + ')"></i><span>' + i.t[L()] + '</span>', "button"); b.type = "button"; b.addEventListener("click", () => { tink(); const x = st.sel.indexOf(i.k); if (x >= 0) st.sel.splice(x, 1); else { if (st.sel.length >= 4) st.sel.shift(); st.sel.push(i.k); } stepSel(); }); grid.appendChild(b); });
    const sc = mk("es-scent"); const last = st.sel[st.sel.length - 1]; if (last) { const li = ing(last); sc.innerHTML = "<i></i><i></i><i></i><span>" + li.t[L()] + " · " + li.d[L()] + "</span>"; sc.style.setProperty("--c", li.c); }
    const row = mk("es-sel"); st.sel.forEach(k => row.appendChild(mk("es-dot", "", "i"))); row.querySelectorAll("i").forEach((d, n) => { d.style.background = ing(st.sel[n]).c; });
    const go = mk("es-cta", s("mix"), "button"); go.type = "button"; go.disabled = st.sel.length < 2; go.addEventListener("click", mixing);
    panel.replaceChildren(mk("es-h", s(st.mode === "perfume" ? "pickP" : "pick") + " · " + st.sel.length + "/4"), tabs, sc, grid, row, go); panel.scrollTop = 0;
  }
  function mixing() {
    const cols = st.sel.map(k => ing(k).c), m = mk("es-mixv", '<div class="es-mt">' + s("mixing") + '</div><div class="es-mf">' + bottle(0, CAPS[0], cols, 78) + '</div><div class="es-ms">' + s("mix2") + '</div>');
    const f = m.querySelector(".es-mf"); cols.forEach((c, ci) => { for (let n = 0; n < 9; n++) { const p = mk("es-fall"); p.style.cssText = "left:" + (38 + ((n * 11 + ci * 7) % 26)) + "%;background:" + c + ";animation-delay:" + (ci * .9 + n * .22).toFixed(2) + "s"; f.appendChild(p); } });
    ov.appendChild(m); splash(14); const liq = m.querySelector(".es-liq"); requestAnimationFrame(() => { liq.style.transition = "transform 4.6s ease-in-out"; liq.style.transform = "translateY(-34px)"; });
    setTimeout(() => { m.classList.add("out"); setTimeout(() => m.remove(), 700); step3(); }, 4900);
  }
  const nameOf = () => (st.name || "").trim() || s(st.mode === "perfume" ? "defP" : "def");
  const cols = () => st.sel.map(k => ing(k).c);
  const labOf = () => ({ st: st.lab, name: nameOf(), brand: s("brand") });
  function step3() {
    st.step = 3; const cs = cols();
    const prev = mk("es-prev"); const paintPrev = () => { prev.innerHTML = bottle(st.bs, CAPS[st.cap], cs, -34, labOf()); };
    const row = (items, cur, mkb, on) => { const r = mk("es-row"); items.forEach((it, i) => { const b = mkb(it, i); b.type = "button"; if (i === cur) b.classList.add("on"); b.addEventListener("click", () => { on(i); step3(); }); r.appendChild(b); }); return r; };
    const bs = row([0, 1, 2], st.bs, (_, i) => mk("es-bs", bottle(i, CAPS[0], cs, -34), "button"), i => { st.bs = i; });
    const cp = row(CAPS, st.cap, c => { const b = mk("es-cp", "", "button"); b.style.background = c; return b; }, i => { st.cap = i; });
    const lb = row(s("labs"), st.lab, t => { const b = mk("es-tab", t, "button"); return b; }, i => { st.lab = i; });
    const it = row(INT, INT.findIndex(i => i.k === st.intent), i => mk("es-tab", i.t[L()], "button"), i => { st.intent = INT[i].k; });
    const inp = mk("es-in", "", "input"); inp.maxLength = 24; inp.placeholder = s("nm"); inp.value = st.name || ""; inp.addEventListener("input", () => { st.name = inp.value; paintPrev(); });
    const go = mk("es-cta", s("pk"), "button"); go.type = "button"; go.addEventListener("click", stepPack);
    paintPrev(); panel.replaceChildren(mk("es-h", s("nm")), inp, prev, mk("es-lb", s("bt")), bs, mk("es-lb", s("cap")), cp, mk("es-lb", s("lab")), lb, mk("es-lb", s("int")), it, go); panel.scrollTop = 0;
  }
  function stepPack() {
    st.step = 5; const name = nameOf();
    const prev = mk("es-prev es-boxprev"); const paint = () => { prev.innerHTML = boxSvg(st.box, st.rib, name, st.msg || s("dedicDef")); prev.querySelector(".bx").classList.add("done"); };
    const row = (items, cur, mkb, on) => { const r = mk("es-row"); items.forEach((it, i) => { const b = mkb(it, i); b.type = "button"; if (i === cur) b.classList.add("on"); b.addEventListener("click", () => { on(i); stepPack(); }); r.appendChild(b); }); return r; };
    const bx = row(s("box"), st.box, (t, i) => { const b = mk("es-tab", '<i class="es-sw" style="background:' + BOX[i] + '"></i>' + t, "button"); return b; }, i => { st.box = i; });
    const rb = row(s("rib"), st.rib, (t, i) => { const b = mk("es-tab", '<i class="es-sw" style="background:' + RIB[i] + '"></i>' + t, "button"); return b; }, i => { st.rib = i; });
    const inp = mk("es-in", "", "input"); inp.maxLength = 26; inp.placeholder = s("dedic"); inp.value = st.msg || ""; inp.addEventListener("input", () => { st.msg = inp.value; paint(); });
    const go = mk("es-cta", s("packNext"), "button"); go.type = "button"; go.addEventListener("click", packing);
    const back = mk("es-ghost", "← " + s("back"), "button"); back.type = "button"; back.addEventListener("click", step3);
    paint(); panel.replaceChildren(mk("es-h", s("pk")), prev, mk("es-lb", s("pk1")), bx, mk("es-lb", s("pk2")), rb, inp, go, back); panel.scrollTop = 0;
  }
  function packing() {
    const name = nameOf(), msg = st.msg || s("dedicDef");
    const m = mk("es-mixv es-packv", '<div class="es-mt">' + s("packing") + '</div><div class="pk-stage"><div class="pk-bottle">' + bottle(st.bs, CAPS[st.cap], cols(), -34, labOf()) + '</div>' + boxSvg(st.box, st.rib, name, msg) + '</div><div class="es-ms">' + s("packing2") + '</div>');
    ov.appendChild(m); const bx = m.querySelector(".bx"); tone(392, 1.2, .015);
    setTimeout(() => bx.classList.add("s2"), 1500); setTimeout(() => { tone(329.6, .8, .02); bx.classList.add("s3"); }, 2900); setTimeout(() => { tone(523.25, 1, .02); bx.classList.add("s4"); }, 4100);
    setTimeout(() => { tone(659.25, 1.2, .02); bx.classList.add("s5"); spark(); }, 5100);
    setTimeout(() => { m.classList.add("out"); setTimeout(() => m.remove(), 700); reveal(); }, 6900);
  }
  function reveal() {
    st.step = 4; const name = nameOf(), msg = st.msg || s("dedicDef");
    const r = mk("es-rev", '<div class="es-rays"></div><div class="es-rt">' + s(st.mode === "perfume" ? "readyP" : "ready") + '</div><div class="es-rb">' + boxSvg(st.box, st.rib, name, msg) + '</div><div class="es-rn"></div><div class="es-rs"></div>');
    r.querySelector(".bx").classList.add("done"); r.querySelector(".es-rn").textContent = name;
    const lv = [[1, "Salida", "Top"], [0, "Corazón", "Heart"], [2, "Fondo", "Base"]].map(x => { const n = st.sel.filter(k => ing(k).g === x[0]).map(k => ing(k).t[L()]); return n.length ? x[L() ? 2 : 1] + ": " + n.join(", ") : ""; }).filter(Boolean).join("  ·  ");
    r.querySelector(".es-rs").textContent = lv + " — " + INT.find(i => i.k === st.intent).t[L()];
    const sv = mk("es-cta", s("order"), "button"), ok = mk("es-ok"), ag = mk("es-ghost", s("again"), "button"); sv.type = ag.type = "button";
    sv.addEventListener("click", () => {
      tone(1046.5, 1.4, .02);
      const rec = { n: name, ing: st.sel, intent: st.intent, bs: st.bs, cap: st.cap, lab: st.lab, box: st.box, rib: st.rib, msg, mode: st.mode, at: Date.now() };
      try { const a = JSON.parse(localStorage.getItem("cml_essences") || "[]"); a.push(rec); localStorage.setItem("cml_essences", JSON.stringify(a.slice(-20))); } catch (e) {}
      try { const ref = (st.mode + ":" + st.sel.join("+") + ":" + st.intent).slice(0, 80), q = JSON.parse(localStorage.getItem("cml_pending_interest") || "[]"); q.push({ k: "essences_waitlist", r: ref }); localStorage.setItem("cml_pending_interest", JSON.stringify(q.slice(-20))); const c = C(); if (c && c.db) c.db.from("interest_log").insert({ kind: "essences_waitlist", ref }).then(() => {}, () => {}); } catch (e) {}
      ok.textContent = s("ordered"); sv.disabled = true; spark();
    });
    ag.addEventListener("click", () => { r.remove(); st.sel = []; st.name = ""; st.msg = ""; step0(); });
    r.append(sv, ok, ag); ov.appendChild(r); spark(); chime();
  }
  const sb = top.querySelector(".es-snd"); sb.addEventListener("click", () => { MUTE = !MUTE; sb.classList.toggle("off", MUTE); if (AX && AX.__m) AX.__m.gain.value = MUTE ? 0 : 1; });
  const close = () => { padOff(); ov.remove(); }; top.querySelector(".es-x").addEventListener("click", close);
  document.body.appendChild(ov); ax(); if (AX && AX.state === "suspended") AX.resume(); padOn(); fit(); center(); step0(); setTimeout(() => { fit(); center(); }, 120); addEventListener("resize", () => { fit(); center(); });
}
function button() { const b = mk("el-open", '<span class="el-oi">✿</span><span><b>' + s("title") + '</b><small>' + s("sub") + '</small></span>', "button"); b.type = "button"; b.addEventListener("click", open); return b; }
window.CMLEssenceLab = { open, button, close: () => { padOff(); const o = document.querySelector(".es-ov"); if (o) o.remove(); } };
})();
