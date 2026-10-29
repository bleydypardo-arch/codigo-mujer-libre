/* Atelier de Esencias v2: la cámara recorre la foto; se eligen tarros reales, se mezcla en una probeta, se etiqueta, se empaca */
(() => {
const C = () => window.CML, L = () => (C() && C().lang() === "en") ? 1 : 0;
const AR = 1672 / 941, IW = 1672, IH = 941;
const GEO = [
  { img: "lobby/esencias.webp?v=20261029a", cam: { ov: [.5, .66, .36], R: [.915, .36, .27], L: [.1, .36, .3], T: [.5, .74, .5] }, z: { z1: [0.6, 9.6, 19.6, 49], z2: [77, 9.6, 22, 55], z3: [21.8, 7.5, 7.8, 45], z4: [28, 50, 44.6, 44], z5: [66, 13, 8, 47] }, orc: [41.5, 38.8, 10.6, 18.6, 46.5, 47.7], win: [56, 22, 8.4, 27], l1: [31, 28], l2: [51.8, 30.5] },
  { img: "lobby/esencias-en.webp?v=20261029a", cam: { ov: [.5, .66, .36], R: [.945, .36, .24], L: [.1, .38, .3], T: [.5, .76, .5] }, z: { z1: [0, 4, 23.6, 49], z2: [75.4, 3, 24.6, 57], z3: [24, 8, 7, 35], z4: [26.3, 60.5, 50.8, 35], z5: [67.6, 8, 7, 35] }, orc: [40.7, 42.5, 14.05, 19.1, 47.3, 52.6], win: [61.6, 14, 6, 40], l1: [30.8, 30], l2: [54.3, 30.6] }];
const ING = {
  rosa: { c: "#E58FA6", t: ["Rosa", "Rose"], d: ["dulce y aterciopelada", "sweet and velvety"], g: 0 }, lavanda: { c: "#A58BCB", t: ["Lavanda", "Lavender"], d: ["calmante, como un campo al atardecer", "calming, like a field at dusk"], g: 0 },
  jazmin: { c: "#F3E7B8", t: ["Jazmín", "Jasmine"], d: ["cálido, sensual y luminoso", "warm, sensual and radiant"], g: 0 }, orquidea: { c: "#D96FB0", t: ["Orquídea", "Orchid"], d: ["exótica, suave y cremosa", "exotic, soft and creamy"], g: 0 },
  peonia: { c: "#F4B6C2", t: ["Peonía", "Peony"], d: ["fresca, delicada y rosada", "fresh, delicate and rosy"], g: 0 }, manzanilla: { c: "#F2D36B", t: ["Manzanilla", "Chamomile"], d: ["tierna, con aroma a miel", "gentle, with a honeyed scent"], g: 0 },
  romero: { c: "#6E9A63", t: ["Romero", "Rosemary"], d: ["verde, limpio y despierto", "green, clean and awakening"], g: 1 }, menta: { c: "#74C7A5", t: ["Menta", "Mint"], d: ["fresca, helada y alegre", "cool, crisp and cheerful"], g: 1 },
  eucalipto: { c: "#8DB7A8", t: ["Eucalipto", "Eucalyptus"], d: ["aire de bosque tras la lluvia", "forest air after rain"], g: 1 }, albahaca: { c: "#5E8C4A", t: ["Albahaca", "Basil"], d: ["verde, jugosa y viva", "green, juicy and alive"], g: 1 },
  naranja: { c: "#F0A24B", t: ["Naranja", "Orange"], d: ["dulce, soleada y vibrante", "sweet, sunny and vibrant"], g: 1 }, limon: { c: "#F4DD6A", t: ["Limón", "Lemon"], d: ["chispeante y limpio", "sparkling and clean"], g: 1 },
  sandalo: { c: "#C9A073", t: ["Sándalo", "Sandalwood"], d: ["cremoso, profundo y envolvente", "creamy, deep and enveloping"], g: 2 }, vainilla: { c: "#E7C58F", t: ["Vainilla", "Vanilla"], d: ["abrazo cálido y dulce", "a warm, sweet embrace"], g: 2 },
  calendula: { c: "#F0A020", t: ["Caléndula", "Calendula"], d: ["radiante, solar y cálida", "radiant, sunny and warm"], g: 0 }, hibisco: { c: "#9E1F40", t: ["Hibisco", "Hibiscus"], d: ["vibrante, frutal y sensual", "vibrant, fruity and sensual"], g: 0 },
  azul: { c: "#5B6FC0", t: ["Flor azul", "Blue flower"], d: ["misteriosa y serena", "mysterious and serene"], g: 0 }, salvia: { c: "#8DA58A", t: ["Salvia", "Sage"], d: ["limpia, sabia y balsámica", "clean, wise and balsamic"], g: 1 },
  hierbalimon: { c: "#B8C76B", t: ["Hierba limón", "Lemongrass"], d: ["cítrica, verde y alegre", "citrusy, green and joyful"], g: 1 }, cardamomo: { c: "#8C8B4A", t: ["Cardamomo", "Cardamom"], d: ["especiado, fresco y elegante", "spiced, fresh and elegant"], g: 2 },
  pimienta: { c: "#D44B5A", t: ["Pimienta rosa", "Pink pepper"], d: ["chispeante y delicada", "sparkling and delicate"], g: 2 }, jengibre: { c: "#D9B77E", t: ["Jengibre", "Ginger"], d: ["cálido y energizante", "warm and energizing"], g: 2 },
  anis: { c: "#6B3A22", t: ["Anís estrellado", "Star anise"], d: ["dulce, oscuro y misterioso", "sweet, dark and mysterious"], g: 2 },
  canela: { c: "#B5693B", t: ["Canela", "Cinnamon"], d: ["cálida y especiada, como hogar", "warm and spiced, like home"], g: 2 }, incienso: { c: "#D8CBB0", t: ["Incienso", "Frankincense"], d: ["sereno, ahumado y sagrado", "serene, smoky and sacred"], g: 2 } };
const SC = {
  ing: { img: "lobby/at-ingredientes.webp?v=1", cams: [[.2, .55, .34], [.5, .55, .34], [.8, .55, .34]], items: [
    [160, 760, 320, 210, "rosa"], [440, 700, 360, 200, "lavanda"], [665, 640, 330, 170, "manzanilla"], [870, 615, 320, 150, "calendula"], [1060, 570, 330, 140, "hibisco"], [1190, 520, 300, 150, "menta"], [1360, 515, 270, 130, "romero"], [1500, 500, 250, 140, "salvia"],
    [60, 320, 120, 230, "rosa"], [225, 290, 170, 240, "lavanda"], [398, 300, 160, 230, "manzanilla"], [545, 280, 140, 230, "hibisco"], [672, 265, 120, 220, "salvia"], [800, 270, 120, 220, "eucalipto"], [895, 235, 100, 190, "limon"],
    [500, 495, 330, 110, "naranja"], [200, 575, 300, 120, "limon"], [130, 430, 250, 190, "albahaca"], [380, 420, 190, 160, "menta"], [730, 480, 200, 70, "azul"], [570, 400, 140, 120, "cardamomo"], [692, 395, 110, 110, "pimienta"],
    [890, 345, 100, 110, "vainilla"], [1040, 375, 120, 100, "jengibre"], [940, 460, 180, 90, "hierbalimon"], [1250, 405, 200, 80, "anis"], [1385, 255, 110, 120, "jazmin"], [1130, 290, 100, 140, "peonia"], [1215, 290, 90, 140, "naranja"], [1300, 270, 80, 110, "canela"]] },
  bot: { img: "lobby/at-frascos.webp?v=1", cams: [[.22, .55, .36], [.5, .55, .36], [.78, .55, .36]], items: [
    [65, 500, 120, 210, 1, 1], [230, 420, 150, 230, 1, 0], [395, 380, 150, 200, 1, 1], [530, 400, 110, 170, 0, 0], [640, 420, 110, 260, 2, 0], [735, 380, 110, 150, 0, 2], [245, 660, 160, 160, 0, 1], [365, 480, 150, 190, 2, 2],
    [130, 600, 160, 200, 1, 2], [500, 570, 140, 200, 1, 0], [770, 560, 110, 220, 2, 0], [1250, 520, 150, 300, 2, 0], [1210, 580, 110, 200, 2, 2], [1450, 560, 130, 230, 0, 0]] } };
const INT = [{ k: "calma", t: ["Calma", "Calm"] }, { k: "amor", t: ["Amor propio", "Self-love"] }, { k: "energia", t: ["Energía", "Energy"] }, { k: "sueno", t: ["Dormir en paz", "Restful sleep"] }];
const CAPS = ["#C9A169", "#E8A8B8", "#F1EAE0"];
const LABS = [["#FBF4E6", "#C9A169", "#5a2a1a"], ["#F8D9E1", "#B7456B", "#6E0C2B"], ["#2a1a22", "#D9B872", "#F6E7C6"]];
const BOX = ["#F4EBDD", "#F2B8C6", "#2F6B52", "#1E1620"], RIB = ["#D9B872", "#E8789A", "#EBDDC4"];
const SP = [[8, 30], [14, 34], [20, 28], [11, 48], [24, 46], [5, 62], [17, 60], [26, 58], [84, 30], [90, 34], [95, 28], [87, 46], [93, 50], [82, 62], [91, 64], [52, 62], [58, 66], [64, 62], [47, 68], [70, 66], [40, 18], [66, 18]];
const S = {
  es: { title: "Atelier de Esencias", close: "Cerrar", z1: "Perfumería", z2: "Aromaterapia", z3: "Frascos", z4: "Mesa de mezcla", z5: "Utensilios",
    d1: "Perfumería: elige tu frasco y crea tu propio perfume.", d2: "Aromaterapia: toca los tarros para elegir tus flores y hierbas.", d3: "Cada frasco es tuyo. Lo elegirás al terminar la mezcla.", d5: "Morteros, cucharas y goteros de oro para tu mezcla.",
    intro: "Toca Aromaterapia o Perfumería para empezar a crear", introB: "Empezar", pickB: "Desliza y toca el frasco que más te guste", pickedB: "Buen gusto. Ahora tus ingredientes", pickJ: "Desliza y toca los ingredientes: hasta 4", mix: "Mezclar", more: "Elige al menos 2", mixing: "Mezclando tus notas…", mix2: "Cada flor, una nota de ti",
    bt: "Dale forma a tu creación", nm: "Escribe su nombre", cap: "Tapa", labw: "Etiqueta", int: "Intención", pk: "Empacar", pkT: "Empácala", pk1: "Caja", pk2: "Lazo", dedic: "Mensaje en la tarjeta (opcional)", dedicDef: "Para ti, con amor", packNext: "Empacar mi esencia", packing: "Empacando con cariño…", packing2: "Tu creación, lista para llevar",
    ready: "Tu esencia está lista", readyP: "Tu perfume está listo", order: "Llévatela · Pedir mi esencia", ordered: "¡Listo! Recibimos tu pedido. Te contactaremos para entregártela.", again: "Crear otra", back: "Atrás", def: "Mi esencia", defP: "Mi perfume", notes: ["Salida", "Corazón", "Fondo"], brand: "CÓDIGO MUJER LIBRE", box: ["Marfil", "Rosa", "Esmeralda", "Noche"], rib: ["Oro", "Rosa", "Champán"], labs: ["Clásica", "Rosa", "Noche"], snd: "Música" },
  en: { title: "Essence Atelier", close: "Close", z1: "Perfumery", z2: "Aromatherapy", z3: "Bottles", z4: "Blending table", z5: "Tools",
    d1: "Perfumery: pick your bottle and create your own perfume.", d2: "Aromatherapy: tap the jars to choose your flowers and herbs.", d3: "Every bottle is yours. You will pick it after blending.", d5: "Golden mortars, spoons and droppers for your blend.",
    intro: "Tap Aromatherapy or Perfumery to start creating", introB: "Start", pickB: "Swipe and tap the bottle you love", pickedB: "Lovely taste. Now your ingredients", pickJ: "Swipe and tap the ingredients: up to 4", mix: "Blend", more: "Choose at least 2", mixing: "Blending your notes…", mix2: "Every flower, a note of you",
    bt: "Shape your creation", nm: "Write its name", cap: "Cap", labw: "Label", int: "Intention", pk: "Pack it", pkT: "Pack it", pk1: "Box", pk2: "Ribbon", dedic: "Card message (optional)", dedicDef: "For you, with love", packNext: "Pack my essence", packing: "Packing with love…", packing2: "Your creation, ready to take home",
    ready: "Your essence is ready", readyP: "Your perfume is ready", order: "Take it home · Order my essence", ordered: "Done! We received your order. We will contact you to deliver it.", again: "Create another", back: "Back", def: "My essence", defP: "My perfume", notes: ["Top", "Heart", "Base"], brand: "CÓDIGO MUJER LIBRE", box: ["Ivory", "Rose", "Emerald", "Midnight"], rib: ["Gold", "Rose", "Champagne"], labs: ["Classic", "Rose", "Night"], snd: "Music" } };
const s = k => S[L() ? "en" : "es"][k];
const mk = (cls, html, tag) => { const n = document.createElement(tag || "div"); n.className = cls; if (html != null) n.innerHTML = html; return n; };
const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const mixc = a => { if (!a.length) return "#F3DFC8"; let r = 0, g = 0, b = 0; a.forEach(c => { const n = parseInt(c.slice(1), 16); r += n >> 16; g += (n >> 8) & 255; b += n & 255; }); const m = a.length; return "rgb(" + Math.round(r / m) + "," + Math.round(g / m) + "," + Math.round(b / m) + ")"; };

/* ---- sonidos: música de piano (compartida con el Spa) + toques de cristal muy suaves ---- */
let MUTE = false, AX = null;
function ax() { try { const m = window.CMLSoftMusic; const c = m && m.ctx(); if (c) return c; if (!AX) { const A = window.AudioContext || window.webkitAudioContext; if (A) AX = new A(); } return AX; } catch (e) { return null; } }
function tone(f, d, v, when) { const x = ax(); if (!x || MUTE) return; try { const t0 = x.currentTime + (when || 0), o = x.createOscillator(), g = x.createGain(); o.type = "sine"; o.frequency.value = f; g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(v, t0 + .02); g.gain.exponentialRampToValueAtTime(.0001, t0 + d); o.connect(g); g.connect(x.destination); o.start(t0); o.stop(t0 + d + .05); } catch (e) {} }
const tink = () => { const f = [880, 988, 1175, 1319][Math.floor(Math.random() * 4)]; tone(f, 1.6, .02); tone(f * 2, .9, .006); };
function musicOn() { const m = window.CMLSoftMusic; if (m && !MUTE) m.start(); }
function musicOff() { const m = window.CMLSoftMusic; if (m) m.stop(); }

/* ---- frasco de vidrio realista ---- */
let uid = 0;
const SHAPES = [
  "M44 60h32v10c20 8 30 26 30 52 0 28-14 42-46 42S14 150 14 122c0-26 10-44 30-52z",
  "M40 60h40v12c8 4 12 10 12 22v62c0 8-6 14-16 14H44c-10 0-16-6-16-14V94c0-12 4-18 12-22z",
  "M46 60h28l22 26-8 68c-1 9-8 14-28 14s-27-5-28-14l-8-68z"];
function labelSvg(lab) { if (!lab) return ""; const c = LABS[lab.st] || LABS[0], n = String(lab.name || ""), fs = n.length > 16 ? 6.4 : n.length > 11 ? 7.6 : 9.2; return '<g><rect x="33" y="104" width="54" height="40" rx="2.5" fill="' + c[0] + '" stroke="' + c[1] + '" stroke-width=".9"/><rect x="35.5" y="106.5" width="49" height="35" rx="1.5" fill="none" stroke="' + c[1] + '" stroke-width=".4"/><text x="60" y="116" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-size="3.4" letter-spacing=".6" fill="' + c[1] + '">' + esc(lab.brand || "") + '</text><text x="60" y="129" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-style="italic" font-weight="700" font-size="' + fs + '" fill="' + c[2] + '">' + esc(n) + '</text><path d="M48 135h24" stroke="' + c[1] + '" stroke-width=".5"/></g>'; }
function bottle(style, cap, cols, level, lab, still) {
  const id = "b" + (++uid), path = SHAPES[style] || SHAPES[0], c1 = cols[0] || "#F3DFC8", c2 = cols[1] || c1, c3 = cols[2] || c2;
  let pet = ""; if (!still) cols.forEach((c, ci) => { for (let n = 0; n < 6; n++) pet += '<ellipse class="p" cx="' + (30 + ((n * 23 + ci * 13) % 60)) + '" cy="' + (100 + ((n * 17 + ci * 7) % 50)) + '" rx="3.6" ry="6.4" fill="' + c + '" fill-opacity=".85" style="animation-delay:' + (-(n * .7 + ci * .5)) + 's"/>'; });
  return '<svg viewBox="0 0 120 176" class="es-bt"><defs><linearGradient id="g' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c1 + '"/><stop offset=".55" stop-color="' + c2 + '"/><stop offset="1" stop-color="' + c3 + '"/></linearGradient><linearGradient id="m' + id + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F6E7C6"/><stop offset=".35" stop-color="' + cap + '"/><stop offset="1" stop-color="#6b4a25"/></linearGradient><linearGradient id="s' + id + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset=".25" stop-color="#fff" stop-opacity="0"/><stop offset=".75" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient><clipPath id="c' + id + '"><path d="' + path + '"/></clipPath></defs>'
    + '<ellipse cx="60" cy="170" rx="46" ry="5" fill="rgba(0,0,0,.35)"/>'
    + '<rect x="45" y="10" width="30" height="26" rx="6" fill="url(#m' + id + ')" stroke="rgba(0,0,0,.25)"/><path d="M50 14v20M55 14v20M60 14v20M65 14v20M70 14v20" stroke="rgba(0,0,0,.14)" stroke-width="1"/><rect x="50" y="34" width="20" height="28" fill="#f4ede2" fill-opacity=".8" stroke="#C9A169" stroke-opacity=".7"/>'
    + '<g clip-path="url(#c' + id + ')"><rect x="0" y="0" width="120" height="176" fill="#fff" fill-opacity=".22"/><g class="es-liq" style="transform:translateY(' + (level == null ? 0 : level) + 'px)"><path class="es-wave" d="M-60 84q15-6 30 0t30 0 30 0 30 0 30 0 30 0v120h-180z" fill="url(#g' + id + ')"/><ellipse cx="60" cy="86" rx="46" ry="3.5" fill="#fff" fill-opacity=".35"/><g>' + pet + '</g></g><rect x="0" y="0" width="120" height="176" fill="url(#s' + id + ')"/></g>'
    + labelSvg(lab)
    + '<path d="' + path + '" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.6"/><path d="' + path + '" fill="none" stroke="#C9A169" stroke-opacity=".55" stroke-width="1"/><path d="M24 100q-4 16 0 34" stroke="#fff" stroke-opacity=".75" stroke-width="3.2" stroke-linecap="round" fill="none"/><path d="M98 96q3 12 1 24" stroke="#fff" stroke-opacity=".45" stroke-width="2" stroke-linecap="round" fill="none"/><ellipse cx="60" cy="161" rx="30" ry="3" fill="#fff" fill-opacity=".25"/></svg>';
}
function beaker(level) { const id = "k" + (++uid); return '<svg viewBox="0 0 140 200" class="es-bk"><defs><clipPath id="' + id + '"><path d="M30 34h80l-6 118c-.6 10-8 16-18 16H54c-10 0-17.4-6-18-16z"/></clipPath><linearGradient id="gl' + id + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".2" stop-color="#fff" stop-opacity=".05"/><stop offset=".8" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity=".45"/></linearGradient></defs><ellipse cx="70" cy="186" rx="48" ry="6" fill="rgba(0,0,0,.4)"/><g clip-path="url(#' + id + ')"><rect x="0" y="0" width="140" height="200" fill="rgba(255,255,255,.08)"/><g class="es-liq2" style="transform:translateY(' + level + 'px)"><path class="es-wave2" d="M-60 90q15-7 30 0t30 0 30 0 30 0 30 0 30 0 30 0v140h-210z" style="fill:var(--lq,#E58FA6)"/><ellipse cx="70" cy="92" rx="42" ry="3.5" fill="#fff" fill-opacity=".35"/></g><rect x="0" y="0" width="140" height="200" fill="url(#gl' + id + ')"/></g><path d="M30 34h80l-6 118c-.6 10-8 16-18 16H54c-10 0-17.4-6-18-16z" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2"/><path d="M26 32h88" stroke="#fff" stroke-opacity=".8" stroke-width="3" stroke-linecap="round"/><path d="M112 36l12 -6" stroke="#fff" stroke-opacity=".7" stroke-width="3" stroke-linecap="round"/><path d="M40 60h12M40 82h12M40 104h12M40 126h12" stroke="#fff" stroke-opacity=".55" stroke-width="1.2"/><path d="M42 44q-3 50 2 100" stroke="#fff" stroke-opacity=".7" stroke-width="3" stroke-linecap="round" fill="none"/></svg>'; }
function boxSvg(b, r, name, msg) { const c = BOX[b], d = RIB[r]; return '<svg viewBox="0 0 200 200" class="bx"><ellipse cx="100" cy="184" rx="78" ry="8" fill="rgba(0,0,0,.28)"/><rect class="bx-body" x="30" y="96" width="140" height="82" rx="7" fill="' + c + '" stroke="rgba(0,0,0,.18)"/><rect x="30" y="96" width="140" height="10" fill="rgba(0,0,0,.08)"/><rect class="bx-rib" x="92" y="96" width="16" height="82" fill="' + d + '"/><g class="bx-lidg"><rect x="24" y="70" width="152" height="32" rx="7" fill="' + c + '" stroke="rgba(0,0,0,.2)"/><rect x="24" y="70" width="152" height="8" rx="4" fill="rgba(255,255,255,.35)"/><rect x="92" y="70" width="16" height="32" fill="' + d + '"/></g><g class="bx-bow"><path d="M100 68C78 38 52 50 72 66c10 8 22 4 28 2z" fill="' + d + '" stroke="rgba(0,0,0,.2)"/><path d="M100 68C122 38 148 50 128 66c-10 8-22 4-28 2z" fill="' + d + '" stroke="rgba(0,0,0,.2)"/><circle cx="100" cy="68" r="7" fill="' + d + '" stroke="rgba(0,0,0,.25)"/></g><g class="bx-tag"><path d="M104 74q22 14 30 30" stroke="' + d + '" fill="none" stroke-width="1.6"/><g transform="rotate(-10 140 118)"><rect x="116" y="104" width="50" height="32" rx="3" fill="#FFF8EF" stroke="' + d + '"/><circle cx="121" cy="109" r="1.8" fill="' + d + '"/><text x="141" y="118" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-style="italic" font-weight="700" font-size="7" fill="#6E0C2B">' + esc(String(name).slice(0, 16)) + '</text><text x="141" y="128" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-size="5" fill="#8a6a34">' + esc(String(msg || "").slice(0, 24)) + '</text></g></g></svg>'; }

function open() {
  if (document.querySelector(".es-ov")) return;
  const G = GEO[L()], st = { sel: [], bs: 0, cap: 0, intent: "calma", mode: "aroma", lab: 0, box: 0, rib: 0, msg: "", name: "" };
  const ov = mk("es-ov"); ov.setAttribute("role", "dialog");
  const bg = mk("es-bg"); bg.style.backgroundImage = "url(" + G.img + ")"; ov.appendChild(bg);
  const cam = mk("es-cam"), stg = mk("es-st"); stg.style.backgroundImage = "url(" + G.img + ")"; cam.appendChild(stg); ov.appendChild(cam);
  stg.appendChild(mk("es-sheen"));
  const orc = mk("es-orc"); orc.style.cssText = "background-image:url(" + G.img + ");left:" + G.orc[0] + "%;top:" + G.orc[1] + "%;width:" + G.orc[2] + "%;height:" + G.orc[3] + "%;background-size:" + (10000 / G.orc[2]) + "% " + (10000 / G.orc[3]) + "%;background-position:" + G.orc[4] + "% " + G.orc[5] + "%"; stg.appendChild(orc);
  const win = mk("es-win"); win.style.cssText = "left:" + G.win[0] + "%;top:" + G.win[1] + "%;width:" + G.win[2] + "%;height:" + G.win[3] + "%"; stg.appendChild(win);
  [["l1", G.l1], ["l2", G.l2]].forEach(l => { const e = mk("es-lamp " + l[0]); e.style.cssText = "left:" + l[1][0] + "%;top:" + l[1][1] + "%"; stg.appendChild(e); });
  SP.forEach((p, i) => { const sp = mk("es-sp"); sp.style.cssText = "left:" + p[0] + "%;top:" + p[1] + "%;animation-delay:" + (-(i * .37)).toFixed(2) + "s;--z:" + (.6 + (i % 4) * .25); stg.appendChild(sp); });
  [[27, 58], [36, 62], [47, 60], [58, 62], [67, 58], [82, 56]].forEach((p, i) => { const w = mk("es-wisp"); w.style.cssText = "left:" + p[0] + "%;top:" + p[1] + "%;animation-delay:" + (-(i * 1.7)).toFixed(1) + "s"; stg.appendChild(w); });
  for (let i = 0; i < 22; i++) { const d = mk("es-du"); d.style.cssText = "left:" + ((i * 37) % 100) + "%;animation-duration:" + (9 + (i % 6) * 2) + "s;animation-delay:" + (-(i * 1.3)).toFixed(1) + "s;--s:" + (2 + (i % 3)) + "px"; stg.appendChild(d); }
  const top = mk("es-top", '<b>' + s("title") + '</b><span class="es-tr"><button type="button" class="es-snd" aria-label="' + s("snd") + '">♪</button><button type="button" class="es-x" aria-label="' + s("close") + '">×</button></span>');
  const note = mk("es-note"); const gl = mk("es-gl"); ov.append(top, note, gl);
  let VW = 0, VH = 0, W0 = 0, curCam = G.cam.ov;
  const place = c => { curCam = c; const z = VW / (c[2] * W0), SW = W0 * z, SH = VH * z; let tx = VW / 2 - c[0] * SW, ty = VH * .4 - c[1] * SH; tx = SW > VW ? Math.min(0, Math.max(VW - SW, tx)) : (VW - SW) / 2; ty = SH > VH ? Math.min(0, Math.max(VH - SH, ty)) : (VH - SH) / 2 - 24; stg.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + z + ")"; };
  const size = () => { VW = ov.clientWidth; VH = ov.clientHeight; W0 = VH * AR; stg.style.width = W0 + "px"; stg.style.height = VH + "px"; place(curCam); };
  const go = (name, instant) => { if (instant) stg.classList.add("nt"); place(G.cam[name]); if (instant) { void stg.offsetWidth; stg.classList.remove("nt"); } };
  /* hotspots: zonas, tarros, frascos */
  const hs = (x, y, w, h, cls) => { const b = mk("es-hs " + (cls || ""), "", "button"); b.type = "button"; b.style.cssText = "left:" + (x / IW * 100) + "%;top:" + (y / IH * 100) + "%;width:" + (w / IW * 100) + "%;height:" + (h / IH * 100) + "%"; stg.appendChild(b); return b; };
  const crop = (x, y, w, h) => "background-image:url(" + G.img + ");background-size:" + (IW / w * 100) + "% " + (IH / h * 100) + "%;background-position:" + ((x - w / 2) / (IW - w) * 100) + "% " + ((y - h / 2) / (IH - h) * 100) + "%";
  const showNote = t => { note.textContent = t; note.classList.remove("on"); void note.offsetWidth; note.classList.add("on"); };
  const zoneEls = [];
  Object.keys(G.z).forEach(k => { const z = G.z[k], b = mk("es-zone " + k, k === "z4" ? '<span class="es-pill">' + s(k) + '</span>' : '<span class="es-dotp"></span>', "button"); b.type = "button"; b.style.cssText = "left:" + z[0] + "%;top:" + z[1] + "%;width:" + z[2] + "%;height:" + z[3] + "%"; b.addEventListener("click", () => zone(k)); stg.appendChild(b); zoneEls.push(b); });
  const setVis = zones => zoneEls.forEach(e => e.hidden = !zones);
  let items = [], camIdx = 1, curScene = "at", dragMoved = false;
  const cropOf = (img, x, y, w, h) => "background-image:url(" + img + ");background-size:" + (IW / w * 100) + "% " + (IH / h * 100) + "%;background-position:" + ((x - w / 2) / (IW - w) * 100) + "% " + ((y - h / 2) / (IH - h) * 100) + "%";
  const ingItem = k => SC.ing.items.find(x => x[4] === k);
  const fade = mk("es-fade"); ov.appendChild(fade);
  const nvL = mk("es-nv l", "‹", "button"), nvR = mk("es-nv r", "›", "button"); nvL.type = nvR.type = "button"; nvL.hidden = nvR.hidden = true; ov.append(nvL, nvR);
  const nav = d => { const sc = SC[curScene]; if (!sc) return; camIdx = Math.max(0, Math.min(sc.cams.length - 1, camIdx + d)); place(sc.cams[camIdx]); };
  nvL.addEventListener("click", () => nav(-1)); nvR.addEventListener("click", () => nav(1));
  function scene(name, idx) {
    const apply = () => {
      curScene = name; stg.classList.remove("sc-at", "sc-ing", "sc-bot"); stg.classList.add("sc-" + name);
      items.forEach(e => e.remove()); items = []; const sc = SC[name]; const img = name === "at" ? G.img : sc.img; stg.style.backgroundImage = "url(" + img + ")"; bg.style.backgroundImage = "url(" + img + ")";
      nvL.hidden = nvR.hidden = name === "at"; setVis(name === "at");
      if (name === "ing") sc.items.forEach(it => { const b = hs(it[0] - it[2] / 2, it[1] - it[3] / 2, it[2], it[3], "es-jar"); b.dataset.k = it[4]; b.addEventListener("click", () => pickIng(it)); items.push(b); });
      if (name === "bot") sc.items.forEach((it, i) => { const b = hs(it[0] - it[2] / 2, it[1] - it[3] / 2, it[2], it[3], "es-bot"); b.addEventListener("click", () => pickBottle(it, i)); items.push(b); });
      if (name !== "at") { camIdx = idx == null ? 1 : idx; stg.classList.add("nt"); place(sc.cams[camIdx]); void stg.offsetWidth; stg.classList.remove("nt"); }
    };
    if (curScene === name) { if (name !== "at") { camIdx = idx == null ? camIdx : idx; place(SC[name].cams[camIdx]); } return; }
    fade.classList.add("on"); setTimeout(() => { apply(); setTimeout(() => fade.classList.remove("on"), 60); }, 480);
  }
  /* arrastrar para recorrer la mesa */
  { let d0 = null; cam.addEventListener("pointerdown", e => { if (curScene === "at") return; d0 = { x: e.clientX, fx: curCam[0] }; dragMoved = false; });
    cam.addEventListener("pointermove", e => { if (!d0) return; const dx = e.clientX - d0.x; if (Math.abs(dx) > 8) { dragMoved = true; stg.classList.add("nt"); const z = VW / (curCam[2] * W0); place([Math.max(.15, Math.min(.85, d0.fx - dx / (W0 * z))), curCam[1], curCam[2]]); } });
    const up = () => { if (d0) { d0 = null; stg.classList.remove("nt"); } }; cam.addEventListener("pointerup", up); cam.addEventListener("pointercancel", up); cam.addEventListener("click", e => { if (dragMoved) { e.stopPropagation(); e.preventDefault(); dragMoved = false; } }, true); }
  const glass = (...kids) => { gl.replaceChildren(...kids); gl.classList.remove("in"); void gl.offsetWidth; gl.classList.add("in"); };
  const btn = (txt, cls, fn) => { const b = mk("es-b " + (cls || ""), txt, "button"); b.type = "button"; b.addEventListener("click", fn); return b; };
  const chime = () => [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, 2.4, .03, i * .22));
  const spark = () => { const n = 16; for (let i = 0; i < n; i++) { const b = mk("es-burst"); const a = (i / n) * Math.PI * 2, d = 90 + (i % 3) * 40; b.style.cssText = "--dx:" + Math.cos(a) * d + "px;--dy:" + Math.sin(a) * d + "px;background:" + (i % 2 ? "#F6E7C6" : "#E58FA6"); ov.appendChild(b); setTimeout(() => b.remove(), 1600); } };
  const nameOf = () => (st.name || "").trim() || s(st.mode === "perfume" ? "defP" : "def");
  const cols = () => st.sel.map(k => ING[k].c);
  const labOf = () => ({ st: st.lab, name: nameOf(), brand: s("brand") });

  /* ---- pasos ---- */
  let panT = null; const stopPan = () => { if (panT) { clearInterval(panT); panT = null; } };
  function intro() {
    st.step = 0; stopPan(); stg.classList.remove("dim"); scene("at"); setVis(curScene === "at"); const xs = [.3, .5, .7, .5]; let i = 0; const mv = () => { place([xs[i % 4], .66, .36]); i++; }; mv(); panT = setInterval(mv, 6500);
    const r = mk("es-chips"); r.append(btn(s("z2"), "", () => zone("z2")), btn(s("z1"), "ghost", () => zone("z1")));
    glass(mk("es-t", s("title")), mk("es-p", s("intro")), r);
  }
  function zone(k) {
    stopPan(); tink(); const d = { z1: "d1", z2: "d2", z3: "d3", z5: "d5" }[k]; if (d) showNote(s(d));
    if (k === "z1") { st.mode = "perfume"; st.sel = []; stepBottles(); } else if (k === "z3") { stepBottles(); } else if (k === "z2" || k === "z4") { st.mode = "aroma"; if (k === "z2") st.sel = []; stepJars(); }
  }
  function stepBottles() { st.step = 1; scene("bot", 1); glass(mk("es-t", s("z1")), mk("es-p", s("pickB"))); }
  function stepJars() {
    st.step = 2; scene("ing", curScene === "ing" ? camIdx : 1); setTimeout(() => items.forEach(e => e.classList.toggle("on", st.sel.includes(e.dataset.k))), curScene === "ing" ? 0 : 700);
    const row = mk("es-chips"); st.sel.forEach(k => { const j = ingItem(k); const c = mk("es-chip", '<i style="' + cropOf(SC.ing.img, j[0], j[1], Math.min(j[2], 200), Math.min(j[3], 200)) + '"></i><span>' + ING[k].t[L()] + '</span>'); row.appendChild(c); });
    const last = st.sel[st.sel.length - 1];
    const go2 = btn(st.sel.length < 2 ? s("more") : s("mix") + " · " + st.sel.length, "", mixing); go2.disabled = st.sel.length < 2;
    glass(mk("es-p", last ? ING[last].t[L()] + " · " + ING[last].d[L()] : s("pickJ")), row, go2);
  }
  function pickIng(it) {
    const k = it[4]; tink(); const i = st.sel.indexOf(k);
    if (i >= 0) st.sel.splice(i, 1); else { if (st.sel.length >= 4) st.sel.shift(); st.sel.push(k); }
    const f = mk("es-fly", "", "i"); f.style.cssText = cropOf(SC.ing.img, it[0], it[1], Math.min(it[2], 200), Math.min(it[3], 200)) + ";left:" + (it[0] / IW * 100) + "%;top:" + (it[1] / IH * 100) + "%;width:" + (Math.min(it[2], 200) / IW * 100) + "%;height:" + (Math.min(it[3], 200) / IH * 100) + "%"; stg.appendChild(f); setTimeout(() => f.remove(), 1300);
    items.forEach(e => e.classList.toggle("on", st.sel.includes(e.dataset.k)));
    stepJars();
  }
  function pickBottle(it, i) {
    st.bs = it[4]; st.cap = it[5]; st.bi = it; tink(); items.forEach((e, n) => e.classList.toggle("on", n === i)); showNote(s("pickedB"));
    setTimeout(() => { if (st.sel.length >= 2) stepForm(); else stepJars(); }, 900);
  }
  function mixing() {
    musicOn(); const cs = cols(); setVis(false); nvL.hidden = nvR.hidden = true;
    const m = mk("es-fg es-mixv", '<div class="es-mt">' + s("mixing") + '</div><div class="es-mf">' + beaker(120) + '</div><div class="es-ms">' + s("mix2") + '</div>');
    m.style.setProperty("--lq", mixc(cs)); const f = m.querySelector(".es-mf");
    st.sel.forEach((k, ci) => { const j = ingItem(k); for (let n = 0; n < 8; n++) { const p = mk("es-fall"); p.style.cssText = cropOf(SC.ing.img, j[0], j[1], Math.min(j[2], 120), Math.min(j[3], 140)) + ";left:" + (36 + ((n * 13 + ci * 9) % 28)) + "%;animation-delay:" + (ci * .9 + n * .26).toFixed(2) + "s"; f.appendChild(p); } });
    for (let n = 0; n < 5; n++) { const w = mk("es-steam"); w.style.cssText = "left:" + (38 + n * 6) + "%;animation-delay:" + (n * .7) + "s"; f.appendChild(w); }
    glass(mk("es-p", s("mix2"))); ov.appendChild(m); const liq = m.querySelector(".es-liq2");
    for (let n = 0; n < 12; n++) tone(500 + Math.random() * 600, .35, .008, n * .38);
    requestAnimationFrame(() => { liq.style.transition = "transform 4.8s ease-in-out"; liq.style.transform = "translateY(-8px)"; });
    setTimeout(() => { m.classList.add("out"); setTimeout(() => m.remove(), 800); stepForm(); }, 5400);
  }
  function stepForm() {
    st.step = 3; const cs = cols();
    const fg = ov.querySelector(".es-fgb") || mk("es-fg es-fgb"); if (!fg.parentNode) ov.insertBefore(fg, top);
    const paint = () => { fg.innerHTML = '<div class="es-ped">' + bottle(st.bs, CAPS[st.cap], cs, -34, labOf()) + '</div>'; };
    const row = (items, cur, mkb, on) => { const r = mk("es-chips"); items.forEach((it, i) => { const b = mkb(it, i); b.type = "button"; if (i === cur) b.classList.add("on"); b.addEventListener("click", () => { tink(); on(i); stepForm(); }); r.appendChild(b); }); return r; };
    const bs = row([0, 1, 2], st.bs, (_, i) => mk("es-mini" + (0 ? "" : ""), bottle(i, CAPS[0], cs, -34, null, true), "button"), i => { st.bs = i; });
    const cp = row(CAPS, st.cap, c => { const b = mk("es-cp", "", "button"); b.style.background = c; return b; }, i => { st.cap = i; });
    const lb = row(s("labs"), st.lab, t => mk("es-pl", t, "button"), i => { st.lab = i; });
    const it = row(INT, INT.findIndex(i => i.k === st.intent), i => mk("es-pl", i.t[L()], "button"), i => { st.intent = INT[i].k; });
    const inp = mk("es-in", "", "input"); inp.maxLength = 22; inp.placeholder = s("nm"); inp.value = st.name || ""; inp.addEventListener("input", () => { st.name = inp.value; const bt = fg.querySelector(".es-bt"); if (bt) { const n = fg.querySelector(".es-ped"); n.innerHTML = bottle(st.bs, CAPS[st.cap], cs, -34, labOf()); } });
    setVis(false); stg.classList.add("dim"); paint();
    const r1 = mk("es-chips es-r1"); bs.childNodes.forEach(n => r1.appendChild(n.cloneNode(true))); 
    glass(inp, bs, cp, lb, it, btn(s("pk"), "", stepPack));
  }
  function stepPack() {
    st.step = 5; const name = nameOf(), fg = ov.querySelector(".es-fgb"); const cs = cols();
    const paint = () => { fg.innerHTML = '<div class="es-ped pk">' + boxSvg(st.box, st.rib, name, st.msg || s("dedicDef")) + '</div>'; fg.querySelector(".bx").classList.add("done"); };
    const row = (items, cur, mkb, on) => { const r = mk("es-chips"); items.forEach((it, i) => { const b = mkb(it, i); b.type = "button"; if (i === cur) b.classList.add("on"); b.addEventListener("click", () => { tink(); on(i); stepPack(); }); r.appendChild(b); }); return r; };
    const bx = row(s("box"), st.box, (t, i) => mk("es-pl", '<i class="es-sw" style="background:' + BOX[i] + '"></i>' + t, "button"), i => { st.box = i; });
    const rb = row(s("rib"), st.rib, (t, i) => mk("es-pl", '<i class="es-sw" style="background:' + RIB[i] + '"></i>' + t, "button"), i => { st.rib = i; });
    const inp = mk("es-in", "", "input"); inp.maxLength = 26; inp.placeholder = s("dedic"); inp.value = st.msg || ""; inp.addEventListener("input", () => { st.msg = inp.value; paint(); });
    paint(); glass(mk("es-t", s("pkT")), bx, rb, inp, btn(s("packNext"), "", packing), btn("← " + s("back"), "ghost", stepForm));
  }
  function packing() {
    const name = nameOf(), msg = st.msg || s("dedicDef"), fg = ov.querySelector(".es-fgb"); if (fg) fg.remove();
    const m = mk("es-fg es-mixv", '<div class="es-mt">' + s("packing") + '</div><div class="pk-stage"><div class="pk-bottle">' + bottle(st.bs, CAPS[st.cap], cols(), -34, labOf(), true) + '</div>' + boxSvg(st.box, st.rib, name, msg) + '</div><div class="es-ms">' + s("packing2") + '</div>');
    ov.appendChild(m); glass(mk("es-p", s("packing"))); const bx = m.querySelector(".bx"); tone(392, 1.4, .02);
    setTimeout(() => bx.classList.add("s2"), 1500); setTimeout(() => { tone(329.6, 1, .025); bx.classList.add("s3"); }, 2900); setTimeout(() => { tone(523.25, 1.2, .025); bx.classList.add("s4"); }, 4100);
    setTimeout(() => { tone(659.25, 1.5, .03); bx.classList.add("s5"); spark(); }, 5100);
    setTimeout(() => { m.classList.add("out"); setTimeout(() => m.remove(), 700); reveal(); }, 6900);
  }
  function reveal() {
    st.step = 4; const name = nameOf(), msg = st.msg || s("dedicDef");
    const r = mk("es-fg es-rev", '<div class="es-rays"></div><div class="es-rt">' + s(st.mode === "perfume" ? "readyP" : "ready") + '</div><div class="es-rb">' + boxSvg(st.box, st.rib, name, msg) + '</div><div class="es-rn"></div><div class="es-rs"></div>');
    r.querySelector(".bx").classList.add("done"); r.querySelector(".es-rn").textContent = name;
    r.querySelector(".es-rs").textContent = [1, 0, 2].map((g, i) => { const n = st.sel.filter(k => ING[k].g === g).map(k => ING[k].t[L()]); return n.length ? S[L() ? "en" : "es"].notes[i] + ": " + n.join(", ") : ""; }).filter(Boolean).join("  ·  ") + " — " + INT.find(i => i.k === st.intent).t[L()];
    const ok = mk("es-ok"); const ord = btn(s("order"), "", () => {
      tone(1046.5, 1.6, .03); const rec = { n: name, ing: st.sel, intent: st.intent, bs: st.bs, cap: st.cap, lab: st.lab, box: st.box, rib: st.rib, msg, mode: st.mode, at: Date.now() };
      try { const a = JSON.parse(localStorage.getItem("cml_essences") || "[]"); a.push(rec); localStorage.setItem("cml_essences", JSON.stringify(a.slice(-20))); } catch (e) {}
      try { const ref = (st.mode + ":" + st.sel.join("+") + ":" + st.intent).slice(0, 80), q = JSON.parse(localStorage.getItem("cml_pending_interest") || "[]"); q.push({ k: "essences_waitlist", r: ref }); localStorage.setItem("cml_pending_interest", JSON.stringify(q.slice(-20))); const c = C(); if (c && c.db) c.db.from("interest_log").insert({ kind: "essences_waitlist", ref }).then(() => {}, () => {}); } catch (e) {}
      ok.textContent = s("ordered"); ord.disabled = true; spark();
    });
    ov.appendChild(r); glass(ord, ok, btn(s("again"), "ghost", () => { r.remove(); const f = ov.querySelector(".es-fgb"); if (f) f.remove(); stg.classList.remove("dim"); st.sel = []; st.name = ""; st.msg = ""; intro(); })); spark(); chime();
  }
  const sb = top.querySelector(".es-snd"); sb.addEventListener("click", () => { MUTE = !MUTE; sb.classList.toggle("off", MUTE); if (MUTE) musicOff(); else musicOn(); });
  const close = () => { stopPan(); musicOff(); ov.remove(); }; top.querySelector(".es-x").addEventListener("click", close);
  document.body.appendChild(ov); size(); go("ov", true); musicOn(); intro(); setTimeout(size, 150); addEventListener("resize", size);
}
function button() { const b = mk("el-open", '<span class="el-oi">✿</span><span><b>' + s("title") + '</b><small>' + (L() ? "Create your own perfume or essence" : "Crea tu propio perfume o esencia") + '</small></span>', "button"); b.type = "button"; b.addEventListener("click", open); return b; }
window.CMLEssenceLab = { open, button, close: () => { musicOff(); const o = document.querySelector(".es-ov"); if (o) o.remove(); } };
})();
