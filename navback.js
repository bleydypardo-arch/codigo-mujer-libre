// Código Mujer Libre — "atrás" dentro de la app: el botón de atrás del celular y las flechas vuelven a la pantalla anterior (nunca sacan de la app).
(function () {
"use strict";
const stack = ["home"]; let cur = "home", popping = false, skip = 0;
const C = () => window.CML;
try { history.replaceState({ cml: "base" }, "", location.href); history.pushState({ cml: "guard" }, "", location.href); } catch (e) {}
function push() { try { history.pushState({ cml: 1 }, "", location.href); } catch (e) {} }
function overlay() {
  const sp = document.querySelector(".sp-enter"); if (sp && window.CMLSpaHall) return () => window.CMLSpaHall.leaveSpa();
  const bar = document.querySelector(".hl-bar"); if (bar && window.CMLHall && window.CMLHall.leaveBar) return () => window.CMLHall.leaveBar(true);
  const sh = document.querySelector(".lb-sheet.open"); if (sh && window.CMLLobby && window.CMLLobby.closeSheet) return () => window.CMLLobby.closeSheet();
  const md = document.querySelector(".modal.open, .modal:not([hidden])"); return null;
}
document.addEventListener("cml:page", e => {
  const p = e.detail && e.detail.page; if (!p) return;
  if (popping) { cur = p; return; }
  if (p === cur) return;
  if (p === "home") { // volver a Inicio: se recorta el historial para que atrás no recorra todo otra vez
    const i = stack.lastIndexOf("home"), n = stack.length - 1 - i;
    cur = "home"; stack.length = i + 1;
    if (n > 0) { skip++; try { history.go(-n); } catch (er) { skip--; } }
    return;
  }
  stack.push(p); cur = p; push();
});
window.addEventListener("popstate", () => {
  if (skip > 0) { skip--; return; }
  const close = overlay();
  if (close) { push(); close(); return; }               // atrás con algo abierto: se cierra eso, no la pantalla
  if (stack.length > 1) { stack.pop(); const prev = stack[stack.length - 1]; popping = true; try { C().showPage(prev); } finally { popping = false; } cur = prev; }
  else { /* en Inicio: el siguiente atrás sale de la app */ }
});
// flechas "volver" dentro de la app = atrás
document.addEventListener("click", e => {
  if (!document.documentElement.classList.contains("lobby-on")) return;
  const b = e.target.closest && e.target.closest(".back-btn"); if (!b || stack.length < 2) return;
  e.preventDefault(); e.stopImmediatePropagation(); history.back();
}, true);
window.CMLNav = { stack };
})();
