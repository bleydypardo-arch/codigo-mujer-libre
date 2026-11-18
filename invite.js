// Código Mujer Libre — botón "Invitar a ir" en el detalle de un lugar o evento (no cambia el detalle: solo agrega el botón al final).
(function () {
  "use strict";
  function addBtn(host) {
    const C = window.CML, CH = window.CMLChat;
    if (!C || !CH || !CH.invite || !C.session || !C.session() || !C.sheetPlan) return;
    const p = C.sheetPlan(); if (!p) return;
    if (host.querySelector(".inv-btn")) return;
    const b = document.createElement("button"); b.type = "button"; b.className = "secondary inv-btn"; b.textContent = CH.btnLabel();
    b.style.cssText = "margin-top:14px;width:100%";
    b.addEventListener("click", () => { const q = C.sheetPlan(); if (q) CH.invite(q); });
    host.appendChild(b);
  }
  function start() {
    const host = document.getElementById("sheetBody"); if (!host) return;
    new MutationObserver(() => { if (host.firstChild) addBtn(host.firstElementChild || host); }).observe(host, { childList: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
