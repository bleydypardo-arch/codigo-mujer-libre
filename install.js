// Código Mujer Libre — "Save the app to your phone" (home-screen icon).
// Additive only: nothing existing is changed. It
//   1) registers a do-nothing service worker so phones can install the site as an app,
//   2) offers a short ES/EN how-to guide (iPhone / Android) in the same reading sheet used by Privacy/Terms,
//   3) adds one quiet card at the bottom of "Mi perfil" that opens the guide,
//   4) shows the guide offer ONCE, on a phone, after a woman signs in (never again once she sees it).
(function () {
"use strict";
const DOC = {
  es: {
    title: "Guarda la app en tu celular",
    intro: "Así entras con un toque, como a cualquier otra app, sin buscar el enlace.",
    card: "Guardar la app en tu celular", cardSub: "Entra con un toque desde tu pantalla de inicio",
    ios: { h: "iPhone o iPad", steps: [
      "Abre esta página en Safari.",
      "Toca el botón Compartir (el cuadrado con una flecha hacia arriba), abajo en la pantalla.",
      "Baja y toca «Agregar a pantalla de inicio».",
      "Toca «Agregar». Listo: verás el ícono con la orquídea."] },
    android: { h: "Android", steps: [
      "Abre esta página en Chrome.",
      "Toca los tres puntos (⋮) arriba a la derecha.",
      "Toca «Instalar app» o «Agregar a la pantalla principal».",
      "Confirma. Listo: verás el ícono con la orquídea."] },
    inapp: "Parece que abriste este enlace dentro de otra app (Instagram, Facebook, correo…). Desde ahí no se puede guardar. Toca los tres puntos o el ícono de compartir y elige «Abrir en el navegador» (Safari o Chrome). Luego sigue estos pasos.",
    tip: "Cuando la tengas guardada, ábrela desde el ícono. Seguirás con tu cuenta, no tienes que escribir nada de nuevo.",
    install: "Instalar ahora", later: "Ahora no", how: "Cómo hacerlo", close: "Cerrar",
    prompt: "Guarda la app en tu pantalla de inicio y entra con un toque, sin buscar el enlace."
  },
  en: {
    title: "Save the app on your phone",
    intro: "This way you get in with one tap, like any other app, without looking for the link.",
    card: "Save the app on your phone", cardSub: "Open it with one tap from your home screen",
    ios: { h: "iPhone or iPad", steps: [
      "Open this page in Safari.",
      "Tap the Share button (the square with an arrow pointing up) at the bottom of the screen.",
      "Scroll down and tap “Add to Home Screen”.",
      "Tap “Add”. Done: you will see the orchid icon."] },
    android: { h: "Android", steps: [
      "Open this page in Chrome.",
      "Tap the three dots (⋮) at the top right.",
      "Tap “Install app” or “Add to Home screen”.",
      "Confirm. Done: you will see the orchid icon."] },
    inapp: "It looks like you opened this link inside another app (Instagram, Facebook, email…). It can't be saved from there. Tap the three dots or the share icon and choose “Open in browser” (Safari or Chrome). Then follow these steps.",
    tip: "Once it is saved, open it from the icon. You stay signed in, there is nothing to type again.",
    install: "Install now", later: "Not now", how: "How to do it", close: "Close",
    prompt: "Save the app on your home screen and get in with one tap, without looking for the link."
  }
};
const KEY = "cml_install_offer_seen";
const ua = navigator.userAgent || "";
const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isAndroid = /Android/i.test(ua);
const isPhone = isIOS || isAndroid;
const inApp = /FBAN|FBAV|FB_IAB|Instagram|Line\/|Snapchat|TikTok|Pinterest|MicroMessenger|GSA\/|; wv\)/i.test(ua);
const standalone = () => { try { return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true; } catch (e) { return false; } };
let C = null, deferred = null, overlay = null, back = null;
const lang = () => (C && C.lang ? C.lang() : (document.documentElement.lang === "en" ? "en" : "es"));
const mk = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };

// ---- 1) service worker (does nothing but make the site installable) ----
if ("serviceWorker" in navigator && location.protocol === "https:") {
  window.addEventListener("load", () => { navigator.serviceWorker.register("sw.js").catch(() => {}); }, { once: true });
}
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferred = e; });
window.addEventListener("appinstalled", () => { deferred = null; close(); });

function close() {
  if (!overlay) return;
  overlay.remove(); overlay = null; document.removeEventListener("keydown", onKey, true);
  document.body.style.overflow = prevOverflow; if (back && back.focus) try { back.focus(); } catch (e) {}
}
let prevOverflow = "";
function onKey(e) { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); } }
function shell(title) {
  if (overlay) overlay.remove();
  back = document.activeElement;
  overlay = mk("div", "lg-back"); overlay.setAttribute("data-install-sheet", "1");
  const panel = mk("div", "lg-panel"); panel.setAttribute("role", "dialog"); panel.setAttribute("aria-modal", "true"); panel.setAttribute("aria-labelledby", "instTitle");
  const h = mk("h2", "lg-h", title); h.id = "instTitle";
  overlay.append(panel); document.body.append(overlay);
  prevOverflow = document.body.style.overflow; document.body.style.overflow = "hidden";
  overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
  document.addEventListener("keydown", onKey, true);
  return { panel, h };
}
function steps(sec) {
  const frag = document.createDocumentFragment();
  frag.append(mk("h3", "lg-s", sec.h));
  const ol = mk("ol", "lg-p"); ol.style.paddingLeft = "20px"; ol.style.margin = "6px 0 0";
  sec.steps.forEach(s => { const li = mk("li", "", s); li.style.marginBottom = "6px"; ol.append(li); });
  frag.append(ol); return frag;
}
// ---- 2) the full guide ----
function openGuide() {
  const d = DOC[lang()];
  const { panel, h } = shell(d.title);
  const x = mk("button", "lg-x", d.close); x.type = "button"; x.addEventListener("click", close);
  panel.append(x, h, mk("p", "lg-p", d.intro));
  if (inApp) { const w = mk("p", "lg-p", d.inapp); w.style.background = "#F7F0E8"; w.style.borderRadius = "12px"; w.style.padding = "10px 12px"; panel.append(w); }
  if (isAndroid && deferred) {
    const b = mk("button", "primary wide", d.install); b.type = "button"; b.style.margin = "10px 0 4px";
    b.addEventListener("click", async () => { try { deferred.prompt(); await deferred.userChoice; } catch (e) {} deferred = null; close(); });
    panel.append(b);
  }
  if (isIOS) panel.append(steps(d.ios));
  else if (isAndroid) panel.append(steps(d.android));
  else { panel.append(steps(d.ios), steps(d.android)); }
  panel.append(mk("p", "lg-p", d.tip));
  x.focus({ preventScroll: true });
}
// ---- 4) one-time offer after sign-in, on a phone only ----
function offerOnce() {
  if (!isPhone || standalone()) return;
  try { if (localStorage.getItem(KEY)) return; localStorage.setItem(KEY, "1"); } catch (e) { return; }
  setTimeout(() => {
    if (document.querySelector("[data-install-sheet]") || document.querySelector("[data-legal-sheet]")) return;
    const d = DOC[lang()];
    const { panel, h } = shell(d.title);
    panel.append(h, mk("p", "lg-p", d.prompt));
    const go = mk("button", "primary wide", d.how); go.type = "button"; go.style.margin = "12px 0 6px";
    go.addEventListener("click", openGuide);
    const no = mk("button", "link-btn", d.later); no.type = "button"; no.style.display = "block"; no.style.margin = "4px auto 0";
    no.addEventListener("click", close);
    panel.append(go, no); go.focus({ preventScroll: true });
  }, 2500);
}
// ---- 3) quiet card for "Mi perfil" (same look as the existing profile link card) ----
function profileCard() {
  const d = DOC[lang()];
  const b = mk("button", "card ess-link"); b.type = "button";
  const ic = mk("span", "ess-link-ic", "☆"); ic.setAttribute("aria-hidden", "true");
  const txt = mk("span", "ess-link-txt"); txt.append(mk("b", "", d.card), mk("small", "", d.cardSub));
  const go = mk("span", "ess-link-go", "›"); go.setAttribute("aria-hidden", "true");
  b.append(ic, txt, go); b.addEventListener("click", openGuide);
  return b;
}
function init() {
  C = window.CML; if (!C) return;
  document.addEventListener("cml:session", e => {
    if (!C.session() || (e.detail && e.detail.pending)) return;
    offerOnce();
  });
}
window.CMLInstall = { open: openGuide, profileCard: () => (standalone() ? null : profileCard()) };
if (window.CML) init(); else document.addEventListener("DOMContentLoaded", init, { once: true });
})();
