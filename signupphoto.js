/* Foto de perfil al unirse (se insiste, pero se puede inscribir sin ella) + botón "Pon tu foto" mientras espera aprobación. */
(function () {
"use strict";
let C = null;
const KEY = "cml_signup_photo";
const ES = {
  spTitle: "📸 Pon tu foto · Queremos que seas parte de la comunidad", spSub: "Con tu foto las demás mujeres te reconocen.", spBtn: "Elegir mi foto", spChange: "Cambiar mi foto", spNeed: "Falta tu foto 📸 ", spBad: "No pudimos leer esa foto. Prueba con otra.",
  spPendTitle: "📸 Pon tu foto", spPendSub: "Queremos que seas parte de la comunidad. Súbela ahora y las demás mujeres te conocerán apenas entres.", spPendBtn: "Pon tu foto", spThanks: "¡Gracias! Tu foto ya está lista 🌸", spFail: "No se pudo subir la foto. Inténtalo otra vez en unos minutos."
};
const EN = {
  spTitle: "📸 Add your photo · We want you to be part of the community", spSub: "With your photo the other women will recognize you.", spBtn: "Choose my photo", spChange: "Change my photo", spNeed: "Your photo is missing 📸 ", spBad: "We couldn't read that photo. Try another one.",
  spPendTitle: "📸 Add your photo", spPendSub: "We want you to be part of the community. Add it now and the other women will know you as soon as you get in.", spPendBtn: "Add your photo", spThanks: "Thank you! Your photo is ready 🌸", spFail: "The photo could not be uploaded. Please try again in a few minutes."
};
const $ = id => document.getElementById(id);
let stash = "";   // dataURL of the chosen photo (400x400 jpeg)

function toSquareDataUrl(file) {
  return new Promise((res, rej) => {
    if (!file || !/^image\//.test(file.type)) return rej(new Error("photo"));
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => {
      try {
        const size = 400, side = Math.min(img.width, img.height), c = document.createElement("canvas"); c.width = c.height = size;
        const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, size, size);
        x.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
        URL.revokeObjectURL(url); res(c.toDataURL("image/jpeg", 0.82));
      } catch (e) { rej(e); }
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error("photo")); };
    img.src = url;
  });
}
const dataUrlToFile = async d => { const b = await (await fetch(d)).blob(); return new File([b], "foto.jpg", { type: "image/jpeg" }); };
const tx = k => { const l = (C && C.lang && C.lang()) === "en" ? EN : ES; return l[k] || k; };

function paintSignup() {
  const card = document.querySelector("#joinStep1 .join-card");
  if (!card || $("spBox")) return;
  const box = document.createElement("div"); box.id = "spBox"; box.className = "sp-box";
  box.innerHTML = '<div class="sp-prev" id="spPrev" aria-hidden="true">📷</div><div class="sp-txt"><b data-i18n="spTitle"></b><small data-i18n="spSub"></small>' +
    '<button type="button" class="primary sp-btn" id="spBtn" data-i18n="spBtn"></button><input type="file" id="spFile" accept="image/jpeg,image/png,image/webp" hidden><span class="sp-err" id="spErr" role="alert" hidden></span></div>';
  card.insertBefore(box, card.firstChild);
  const file = $("spFile"), btn = $("spBtn");
  btn.addEventListener("click", () => file.click());
  file.addEventListener("change", async () => {
    const f = file.files && file.files[0]; if (!f) return;
    try {
      stash = await toSquareDataUrl(f);
      const p = $("spPrev"); p.textContent = ""; p.style.backgroundImage = "url(" + stash + ")"; p.classList.add("has");
      btn.setAttribute("data-i18n", "spChange"); btn.textContent = tx("spChange"); $("spErr").hidden = true;
    } catch (e) { stash = ""; const er = $("spErr"); er.textContent = tx("spBad"); er.hidden = false; }
  });
  box.querySelectorAll("[data-i18n]").forEach(n => { n.textContent = tx(n.getAttribute("data-i18n")); });
  const form = $("signupForm");
  form.addEventListener("submit", ev => {
    if (!stash) return;   // puede inscribirse sin foto: se la seguiremos pidiendo
    try { localStorage.setItem(KEY, stash); } catch (e) { /* too big or blocked: pending screen will ask again */ }
  }, true);
}

async function uploadStash() {
  if (!C || !C.session() || !C.profile()) return;
  let d = ""; try { d = localStorage.getItem(KEY) || ""; } catch (e) {}
  if (!d || C.profile().avatar_path) { try { localStorage.removeItem(KEY); } catch (e) {} return; }
  try { await window.CMLProfile.uploadMyPhoto(await dataUrlToFile(d)); try { localStorage.removeItem(KEY); } catch (e) {} paintPending(); } catch (e) { /* will retry next time (needs the Supabase photo permission) */ }
}

function paintPending() {
  const gate = $("approvalGate"), txt = $("approvalText"); if (!gate || !txt) return;
  let box = $("spPend");
  const me = C && C.profile && C.profile();
  const need = !!me && !me.avatar_path && !me.rejected;
  if (!box) {
    box = document.createElement("div"); box.id = "spPend"; box.className = "sp-box sp-pend";
    box.innerHTML = '<div class="sp-txt"><b data-i18n="spPendTitle"></b><small data-i18n="spPendSub"></small><button type="button" class="primary sp-btn" id="spPBtn" data-i18n="spPendBtn"></button><input type="file" id="spPFile" accept="image/jpeg,image/png,image/webp" hidden><span class="sp-err" id="spPMsg" role="status" hidden></span></div>';
    txt.parentNode.insertBefore(box, txt.nextSibling);
    $("spPBtn").addEventListener("click", () => $("spPFile").click());
    $("spPFile").addEventListener("change", async () => {
      const f = $("spPFile").files && $("spPFile").files[0]; if (!f) return;
      const m = $("spPMsg"); $("spPBtn").disabled = true;
      try { await window.CMLProfile.uploadMyPhoto(f); box.querySelector(".sp-txt").innerHTML = ""; const ok = document.createElement("b"); ok.textContent = tx("spThanks"); box.querySelector(".sp-txt").appendChild(ok); }
      catch (e) { m.textContent = tx("spFail"); m.hidden = false; $("spPBtn").disabled = false; }
    });
  }
  box.hidden = !need;
  if (need) box.querySelectorAll("[data-i18n]").forEach(n => { n.textContent = tx(n.getAttribute("data-i18n")); });
}

function init() {
  C = window.CML; if (!C) return;
  C.addStrings(ES, EN);
  paintSignup();
  document.addEventListener("cml:lang", () => { document.querySelectorAll("#spBox [data-i18n], #spPend [data-i18n]").forEach(n => { n.textContent = tx(n.getAttribute("data-i18n")); }); });
  document.addEventListener("cml:session", e => {
    if (!C.session()) return;
    uploadStash();
    if (e.detail && e.detail.pending) setTimeout(paintPending, 300);
  });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(init, 0), { once: true }); else setTimeout(init, 0);
})();
