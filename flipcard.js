// Código Mujer Libre — shared "tap to reveal" flip card + the two signature illustrations (butterfly, envelope).
// Presentation only: it wraps content that already exists (Did You Know? facts, the weekly Let's Talk question).
// Used by featured.js (Did You Know?) and home.js (Let's Talk). No data, no backend.
(function () {
"use strict";

// ---------- Butterfly (delicate, jewel-toned; the wings flutter very gently via CSS) ----------
// One right-hand wing pair is drawn once and mirrored with <use>, so both sides always match.
function butterflySVG() {
  return '<svg class="bf" viewBox="0 0 200 168" aria-hidden="true" focusable="false">' +
    '<defs>' +
    '<linearGradient id="bfUp" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#F6C9D6"/><stop offset=".38" stop-color="#E58DB0"/><stop offset=".72" stop-color="#B8569A"/><stop offset="1" stop-color="#7C3E8F"/></linearGradient>' +
    '<linearGradient id="bfLo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F9DDB8"/><stop offset=".45" stop-color="#EBA3A0"/><stop offset="1" stop-color="#C46A96"/></linearGradient>' +
    '<radialGradient id="bfGlow" cx=".3" cy=".75" r=".8"><stop offset="0" stop-color="#FFF4E0" stop-opacity=".95"/><stop offset="1" stop-color="#FFF4E0" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="bfGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3E2BE"/><stop offset=".55" stop-color="#C9A56B"/><stop offset="1" stop-color="#8F6B3A"/></linearGradient>' +
    '<g id="bfWingUp">' +
      '<path d="M100 84 C108 46 146 14 182 20 C198 40 192 72 168 86 C146 98 118 96 100 88 Z" fill="url(#bfUp)"/>' +
      '<path d="M104 84 C116 54 146 30 174 30 C182 50 170 72 150 82 C134 90 116 90 104 86 Z" fill="url(#bfGlow)"/>' +
      '<path d="M100 86 C130 70 156 48 180 24 M100 88 C134 80 164 70 190 56 M100 87 C120 66 136 42 148 22" fill="none" stroke="url(#bfGold)" stroke-width=".9" stroke-linecap="round" opacity=".8"/>' +
      '<path d="M182 20 C198 40 192 72 168 86" fill="none" stroke="url(#bfGold)" stroke-width="1.6" stroke-linecap="round"/>' +
      '<circle cx="168" cy="42" r="3.4" fill="#FFF3DC" opacity=".92"/><circle cx="176" cy="58" r="2.4" fill="#FFF3DC" opacity=".8"/><circle cx="160" cy="30" r="1.8" fill="#FFF3DC" opacity=".75"/>' +
    '</g>' +
    '<g id="bfWingLo">' +
      '<path d="M102 94 C128 86 160 96 166 120 C170 142 146 156 124 144 C108 134 102 114 100 98 Z" fill="url(#bfLo)"/>' +
      '<path d="M106 98 C124 94 148 102 152 120 C150 134 134 140 122 132 C112 124 106 112 106 100 Z" fill="url(#bfGlow)" opacity=".8"/>' +
      '<path d="M102 98 C124 104 142 114 158 130 M103 97 C130 96 150 104 164 116" fill="none" stroke="url(#bfGold)" stroke-width=".8" stroke-linecap="round" opacity=".75"/>' +
      '<path d="M166 120 C170 142 146 156 124 144" fill="none" stroke="url(#bfGold)" stroke-width="1.4" stroke-linecap="round"/>' +
      '<circle cx="150" cy="136" r="2.6" fill="#FFF3DC" opacity=".85"/><circle cx="160" cy="124" r="1.8" fill="#FFF3DC" opacity=".8"/>' +
    '</g>' +
    '</defs>' +
    '<g class="bf-body-float">' +
      '<g class="bf-pair bf-lo"><use href="#bfWingLo"/><use href="#bfWingLo" transform="translate(200 0) scale(-1 1)"/></g>' +
      '<g class="bf-pair bf-up"><use href="#bfWingUp"/><use href="#bfWingUp" transform="translate(200 0) scale(-1 1)"/></g>' +
      '<path d="M100 66 C97 80 97 100 100 124 C103 100 103 80 100 66 Z" fill="url(#bfGold)"/>' +
      '<circle cx="100" cy="64" r="3.4" fill="url(#bfGold)"/>' +
      '<path d="M99 62 C94 50 86 42 76 38 M101 62 C106 50 114 42 124 38" fill="none" stroke="url(#bfGold)" stroke-width="1.1" stroke-linecap="round"/>' +
      '<circle cx="76" cy="38" r="1.7" fill="#C9A56B"/><circle cx="124" cy="38" r="1.7" fill="#C9A56B"/>' +
    '</g></svg>';
}

// ---------- Envelope (rose-gold, with a gold wax seal and a letter peeking out) ----------
function envelopeSVG() {
  return '<svg class="en" viewBox="0 0 200 150" aria-hidden="true" focusable="false">' +
    '<defs>' +
    '<linearGradient id="enBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF6F1"/><stop offset=".55" stop-color="#F8DDD9"/><stop offset="1" stop-color="#EBB9BC"/></linearGradient>' +
    '<linearGradient id="enFlap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4CFCF"/><stop offset="1" stop-color="#FFF1EA"/></linearGradient>' +
    '<linearGradient id="enGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3E2BE"/><stop offset=".5" stop-color="#C9A56B"/><stop offset="1" stop-color="#8F6B3A"/></linearGradient>' +
    '<radialGradient id="enSeal" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#C9475F"/><stop offset=".6" stop-color="#9C2C45"/><stop offset="1" stop-color="#6B1B2E"/></radialGradient>' +
    '</defs>' +
    '<g class="en-float">' +
      '<ellipse cx="100" cy="140" rx="64" ry="5" fill="#B85F68" opacity=".14"/>' +
      '<g class="en-letter"><rect x="46" y="22" width="108" height="76" rx="6" fill="#FFFDF8" stroke="#E9D6B8" stroke-width="1"/>' +
        '<path d="M62 40h76M62 52h76M62 64h48" stroke="#DBC19F" stroke-width="1.4" stroke-linecap="round" opacity=".8"/></g>' +
      '<rect x="22" y="48" width="156" height="86" rx="10" fill="url(#enBody)" stroke="url(#enGold)" stroke-width="1.4"/>' +
      '<path d="M24 128 L92 86 M176 128 L108 86" stroke="#E2B5B7" stroke-width="1.2" stroke-linecap="round" fill="none"/>' +
      '<path d="M22 56 C22 52 25 50 29 52 L100 100 L171 52 C175 50 178 52 178 56 L100 112 Z" fill="url(#enFlap)" stroke="url(#enGold)" stroke-width="1.3" stroke-linejoin="round"/>' +
      '<g class="en-seal"><circle cx="100" cy="104" r="13" fill="url(#enGold)"/><circle cx="100" cy="104" r="10.4" fill="url(#enSeal)"/>' +
      '<path d="M100 110 C93 105 91 100 94 97.5 C96.5 95.5 99 97 100 99 C101 97 103.5 95.5 106 97.5 C109 100 107 105 100 110 Z" fill="#F6E7C6"/></g>' +
    '</g></svg>';
}

// ---------- the flip card ----------
// build({ cls, label, front: [nodes], back: [nodes], flipped, onToggle, backLabel })
// front is ONE button (tap to open); the back is a normal region that can hold buttons of its own.
function build(o) {
  const C = window.CML;
  const el = C.el;
  const reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  void reduced;
  const card = el("div", { class: "fc " + (o.cls || "") + (o.flipped ? " is-flipped" : ""), role: "group", "aria-label": o.label || "" });
  const front = el("button", { type: "button", class: "fc-face fc-front", "aria-expanded": String(!!o.flipped) }, ...(o.front || []));
  const ret = el("button", { type: "button", class: "fc-return", text: o.backLabel || "" });
  const back = el("div", { class: "fc-face fc-back" }, ...(o.back || []), ret);
  const inner = el("div", { class: "fc-inner" }, front, back);
  card.appendChild(inner);
  const sync = on => {
    card.classList.toggle("is-flipped", on);
    front.setAttribute("aria-expanded", String(on));
    front.setAttribute("aria-hidden", String(on)); back.setAttribute("aria-hidden", String(!on));
    if ("inert" in front) { front.inert = on; back.inert = !on; }
    front.tabIndex = on ? -1 : 0;
  };
  const toggle = on => { sync(on); if (o.onToggle) o.onToggle(on); if (on) ret.focus({ preventScroll: true }); else front.focus({ preventScroll: true }); };
  front.addEventListener("click", () => toggle(true));
  ret.addEventListener("click", () => toggle(false));
  sync(!!o.flipped);
  return card;
}

const ES = { fcDykFront: "¿Sabías que?", fcDykHint: "Toca para descubrir.", fcTalkFront: "Hablemos", fcTalkHint: "Toca para abrir.", fcBack: "Toca para volver" };
const EN = { fcDykFront: "Did you know?", fcDykHint: "Tap to discover.", fcTalkFront: "Let's talk", fcTalkHint: "Tap to open.", fcBack: "Tap to go back" };
function init() { if (window.CML && window.CML.addStrings) window.CML.addStrings(ES, EN); }
window.CMLFlip = { build, butterflySVG, envelopeSVG };
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
