// Código Mujer Libre — pantalla MATCHA & CAFÉ (diseño aprobado). Solo con el lobby encendido.
// No reconstruye nada: reutiliza la tarjeta Receta del mes, la lista de cafés, proponer encuentro, encuentros y comunidad que ya existen.
(function () {
"use strict";
let C, open = "";
const ES = {
  mxKicker: "TU RINCÓN", mxTitle: "Matcha & Café", mxTag: "SABOREA · CREA · CONECTA",
  mxMeetT: "¿Dónde nos vemos?", mxMeetB: "Ver cafés de la ciudad",
  mxPlanK: "PRÓXIMOS ENCUENTROS", mxPlanT: "Vive nuevas experiencias", mxPlanD: "Catas, talleres y momentos especiales para conectar.", mxPlanB: "Ver próximos encuentros",
  mxCreK: "CREA, COMPARTE E INSPIRA", mxCreT: "Tu creatividad también tiene un lugar aquí.", mxCreD: "Comparte tu café favorito, tus creaciones, fotografías, arte o algo que te inspire.", mxCreB: "Compartir mi creación",
  mxClose: "Más que café y matcha, es un espacio para conectar y crecer.", mxHide: "Cerrar"
};
const EN = {
  mxKicker: "YOUR CORNER", mxTitle: "Matcha & Café", mxTag: "SIP · CREATE · CONNECT",
  mxMeetT: "Where do we meet?", mxMeetB: "View cafés in the city",
  mxPlanK: "UPCOMING MEETUPS", mxPlanT: "Live new experiences", mxPlanD: "Tastings, workshops and special moments to connect.", mxPlanB: "View upcoming meetups",
  mxCreK: "CREATE, SHARE AND INSPIRE", mxCreT: "Your creativity has a place here too.", mxCreD: "Share your favorite café, your creations, photos, art or anything that inspires you.", mxCreB: "Share my creation",
  mxClose: "More than coffee and matcha, it's a space to connect and grow.", mxHide: "Close"
};
const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const PIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.500-5.600-6.500-11a6.500 6.500 0 0 1 13 0c0 5.400-6.500 11-6.500 11z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="10" r="2.400" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
const CAL = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5.500" width="16" height="14" rx="2.500" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M4 10h16M8 3.500v4M16 3.500v4M9 15l2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const PPL = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="5.500" cy="10" r="2.200" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="18.500" cy="10" r="2.200" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M7 19c0-3 2.200-5 5-5s5 2 5 5M2.500 18c0-2 1.300-3.500 3-3.800M21.500 18c0-2-1.300-3.500-3-3.800" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

function mk(cls, html, tag) { const n = document.createElement(tag || "div"); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
function btn(text, onclick) { const b = mk("mx-btn", "<span></span><i>" + ARROW + "</i>", "button"); b.type = "button"; b.firstChild.textContent = text; b.addEventListener("click", onclick); return b; }

function paint(x) {
  const t = k => C.t(k), repaint = () => { if (window.CMLDiscover) window.CMLDiscover.renderMatchaPage(); };
  // cabecera: orquídea blanca + Matcha & Café
  const hero = mk("mx-hero");
  const txt = mk("mx-hero-txt"); 
  txt.append(mk("mx-k", ""), mk("mx-h1", ""), mk("mx-tag", ""), mk("mx-rule", ""));
  txt.children[0].textContent = t("mxKicker"); txt.children[1].textContent = t("mxTitle"); txt.children[2].textContent = t("mxTag");
  const tz = new Image(); tz.src = "lobby/mx-tazas.webp?v=10"; tz.alt = ""; tz.className = "mx-hero-cups";
  hero.append(txt, tz);
  x.hero.replaceChildren(hero);
  if (x.barBtn) x.barBtn.classList.add("mx-bar");
  const list = [];
  
  if (x.rc) { x.rc.classList.add("mx-keep"); list.push(x.rc); }

  const card = (key, head, node, imgSrc) => {
    const wrap = mk("mx-wrap");
    const c = mk("mx-card mxc-" + key); c.append(...head);
    const isOpen = open === key;
    const b = btn(t(key === "meet" ? "mxMeetB" : key === "plan" ? "mxPlanB" : "mxCreB"), () => { open = open === key ? "" : key; repaint(); setTimeout(() => { const n = document.querySelector(".mx-wrap.mxw-" + key); if (n && open === key) n.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60); });
    b.setAttribute("aria-expanded", String(isOpen)); c.appendChild(b);
    wrap.classList.add("mxw-" + key); wrap.appendChild(c);
    if (isOpen) { const d = mk("mx-detail"); if (key === "meet" && x.cityRow) d.appendChild(x.cityRow); d.appendChild(node); wrap.appendChild(d); }
    return wrap;
  };
  const h = (cls, text) => { const n = mk(cls); n.textContent = text; return n; };
  const ico = svg => mk("mx-ico", svg);
  const img = (src, cls) => { const i = new Image(); i.src = "lobby/" + src + "?v=4"; i.alt = ""; i.className = cls; i.loading = "lazy"; return i; };
  // ¿Dónde nos vemos?
  const meetHead = mk("mx-row"); meetHead.append(ico(PIN), h("mx-h2 big", t("mxMeetT")));
  list.push(card("meet", [meetHead, img("mx-cafe2.webp", "mx-photo")], x.meetBox));
  // Próximos encuentros
  const planHead = mk("mx-headrow"); const pt = mk("mx-ptxt"); pt.append(h("mx-k", t("mxPlanK")), h("mx-h2 big", t("mxPlanT")), h("mx-d", t("mxPlanD"))); planHead.append(pt, ico(CAL));
  list.push(card("plan", [planHead], x.plansBox));
  // Crea, comparte e inspira
  const creHead = mk("mx-headrow"); const ct = mk("mx-ptxt"); ct.append(h("mx-k", t("mxCreK")), h("mx-h2 big", t("mxCreT")), h("mx-d", t("mxCreD"))); creHead.append(ct, ico(PPL));
  list.push(card("cre", [creHead, img("mx-arte.webp", "mx-photo art")], x.sharesBox));
  // cierre
  const close = mk("mx-close"); close.append(h("mx-quote", t("mxClose")), img("mx-florero.webp", "mx-cups mx-flor")); list.push(close);
  x.body.replaceChildren(...list);
}
function init() {
  C = window.CML; if (!C) return;
  C.addStrings(ES, EN);
  window.CMLMatchaLobby = { paint };
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
