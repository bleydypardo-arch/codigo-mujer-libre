// In-app confirmation sheet. Replaces the browser's own confirm() pop-up, which can freeze or close the page in the installed
// app / phone browsers. Same look as the other sheets. Usage: if (!(await window.cmlConfirm("Text"))) return;
(function () {
"use strict";
window.cmlConfirm = function (text) {
  return new Promise(resolve => {
    const es = !(window.CML && window.CML.lang && window.CML.lang() === "en");
    const back = document.createElement("div");
    back.className = "lg-back"; back.setAttribute("role", "dialog"); back.setAttribute("aria-modal", "true");
    const panel = document.createElement("div"); panel.className = "lg-panel";
    const p = document.createElement("p"); p.className = "lg-p"; p.textContent = text; p.style.fontSize = "16px";
    const row = document.createElement("div"); row.className = "cml-confirm-row";
    const mk = (label, cls, val) => { const b = document.createElement("button"); b.type = "button"; b.className = cls; b.textContent = label; b.addEventListener("click", () => done(val)); return b; };
    const ok = mk(es ? "Continuar" : "Continue", "cml-yes", true), no = mk(es ? "Cancelar" : "Cancel", "cml-no", false);
    row.append(no, ok); panel.append(p, row); back.append(panel); document.body.appendChild(back);
    const onKey = e => { if (e.key === "Escape") done(false); };
    function done(v) { document.removeEventListener("keydown", onKey); back.remove(); resolve(v); }
    back.addEventListener("click", e => { if (e.target === back) done(false); });
    document.addEventListener("keydown", onKey);
    no.focus();
  });
};
})();
