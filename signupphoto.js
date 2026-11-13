/* Foto de perfil al unirse (se insiste, pero se puede inscribir sin ella) + botón "Pon tu foto" mientras espera aprobación. */
(function () {
"use strict";
let C = null;
const KEY = "cml_signup_photo";
const ES = {
  spTitle: "📸 Pon tu foto · Queremos que seas parte de la comunidad", spSub: "Con tu foto las demás mujeres te reconocen.", spBtn: "Tomarme mi foto", stSelfie: "Tomarme un selfie", stUp: "Subir una foto", stUse: "Usar esta foto", stOrig: "Usar mi foto original (sin fondo)", stBg: "Poner el fondo de Código ML", stPrep: "Preparando tu foto… 🌸", stBgWait: "Poniendo el fondo de Código ML… (la primera vez tarda unos segundos)", stReady: "¡Lista! Elige tu estilo 👇", stNoBg: "No pudimos poner el fondo. Te dejamos tu foto original.", stClose: "Cerrar", fNat: "Natural", fLuz: "Luz", fSoft: "Piel suave", fRose: "Rosa", spChange: "Cambiar mi foto", spNeed: "Falta tu foto 📸 ", spBad: "No pudimos leer esa foto. Prueba con otra.",
  spPendTitle: "📸 Pon tu foto", spPendSub: "Queremos que seas parte de la comunidad. Súbela ahora y las demás mujeres te conocerán apenas entres.", spPendBtn: "Pon tu foto", spThanks: "¡Gracias! Tu foto ya está lista 🌸", spFail: "No se pudo subir la foto. Inténtalo otra vez en unos minutos."
};
const EN = {
  spTitle: "📸 Add your photo · We want you to be part of the community", spSub: "With your photo the other women will recognize you.", spBtn: "Take my photo", stSelfie: "Take a selfie", stUp: "Upload a photo", stUse: "Use this photo", stOrig: "Use my original photo (no background)", stBg: "Add the Código ML background", stPrep: "Preparing your photo… 🌸", stBgWait: "Adding the Código ML background… (the first time takes a few seconds)", stReady: "Ready! Pick your style 👇", stNoBg: "We couldn't add the background. Here is your original photo.", stClose: "Close", fNat: "Natural", fLuz: "Bright", fSoft: "Soft skin", fRose: "Rosy", spChange: "Change my photo", spNeed: "Your photo is missing 📸 ", spBad: "We couldn't read that photo. Try another one.",
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


/* ---------- Estudio de foto: selfie / subir, fondo de marca, filtros ---------- */
const FT = { natural: ["fNat", "none", 0], luz: ["fLuz", "brightness(1.12) contrast(1.05) saturate(1.08)", 0], suave: ["fSoft", "brightness(1.08) contrast(.96) saturate(1.05)", 1.6], rosa: ["fRose", "brightness(1.08) saturate(1.15) sepia(.18) hue-rotate(-12deg)", 1] };
let segmenter = null;
async function getSeg() {
  if (segmenter) return segmenter;
  const V = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";
  const m = await import(V + "/vision_bundle.mjs"), fs = await m.FilesetResolver.forVisionTasks(V + "/wasm");
  segmenter = await m.ImageSegmenter.createFromOptions(fs, { baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite" }, runningMode: "IMAGE", outputConfidenceMasks: true, outputCategoryMask: false });
  return segmenter;
}
function drawBrandBg(c, S) {
  const g = c.createRadialGradient(S * .5, S * .38, S * .05, S * .5, S * .5, S * .78); g.addColorStop(0, "#fff4ef"); g.addColorStop(.55, "#efb3c6"); g.addColorStop(1, "#b0576f"); c.fillStyle = g; c.fillRect(0, 0, S, S);
  [[.12,.15,70,"#ffe9b8",.55],[.82,.12,55,"#ffffff",.5],[.9,.42,80,"#f7c96b",.45],[.07,.5,60,"#ffffff",.45],[.2,.82,85,"#f7c96b",.5],[.78,.85,70,"#ffffff",.5],[.5,.06,45,"#f7c96b",.5],[.95,.8,40,"#ffe9b8",.5],[.4,.93,50,"#ffffff",.4],[.62,.2,35,"#ffffff",.4]].forEach(([x, y, r, col, a]) => { c.beginPath(); c.arc(x * S, y * S, r, 0, 7); c.fillStyle = col; c.globalAlpha = a; c.fill(); c.lineWidth = 3; c.strokeStyle = "#fff"; c.globalAlpha = a * .6; c.stroke(); });
  c.globalAlpha = 1;
  [[.1,.3,-.6],[.9,.62,.7],[.15,.68,.5],[.85,.25,-.4]].forEach(([x, y, r]) => { c.save(); c.translate(x * S, y * S); c.rotate(r); c.fillStyle = "rgba(255,255,255,.55)"; c.beginPath(); c.ellipse(0, 0, 70, 32, 0, 0, 7); c.fill(); c.fillStyle = "rgba(214,92,140,.45)"; c.beginPath(); c.ellipse(22, 0, 34, 15, 0, 0, 7); c.fill(); c.restore(); });
}
function openStudio(onDone) {
  const S = 600; let person = null, mask = null, useBg = true, filt = "natural";
  const mk = (tag, cls, txt) => { const n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; };
  const back = mk("div", "sp-modal"), card = mk("div", "sp-card");
  back.setAttribute("role", "dialog"); back.setAttribute("aria-modal", "true");
  const x = mk("button", "sp-x", "×"); x.type = "button"; x.setAttribute("aria-label", tx("stClose"));
  const title = mk("b", "sp-mt", tx("spTitle")), sub = mk("small", "", tx("spSub"));
  const bSelfie = mk("button", "primary sp-wide", tx("stSelfie")), bUp = mk("button", "sp-wide sp-alt", tx("stUp"));
  bSelfie.type = bUp.type = "button";
  const fSelfie = mk("input"), fUp = mk("input"); fSelfie.type = fUp.type = "file"; fSelfie.accept = fUp.accept = "image/*"; fSelfie.setAttribute("capture", "user"); fSelfie.hidden = fUp.hidden = true;
  const st = mk("div", "sp-st"); st.setAttribute("role", "status");
  const cv = mk("canvas", "sp-out"); cv.width = cv.height = S; cv.hidden = true; const ctx = cv.getContext("2d");
  const chips = mk("div", "sp-chips"); chips.hidden = true;
  Object.keys(FT).forEach(k => { const b = mk("button", "sp-chip" + (k === filt ? " on" : ""), tx(FT[k][0])); b.type = "button"; b.onclick = () => { filt = k; [...chips.children].forEach(c => c.classList.toggle("on", c === b)); draw(); }; chips.appendChild(b); });
  const bOrig = mk("button", "sp-wide sp-alt"), bUse = mk("button", "primary sp-wide", tx("stUse")); bOrig.type = bUse.type = "button"; bOrig.hidden = bUse.hidden = true;
  card.append(x, title, sub, bSelfie, bUp, fSelfie, fUp, st, cv, chips, bOrig, bUse); back.appendChild(card); document.body.appendChild(back);
  const close = () => { back.remove(); document.removeEventListener("keydown", esc); }; const esc = e => { if (e.key === "Escape") close(); };
  document.addEventListener("keydown", esc); x.onclick = close; back.addEventListener("click", e => { if (e.target === back) close(); });
  function layer() {
    const c = document.createElement("canvas"); c.width = c.height = S; const q = c.getContext("2d"), f = FT[filt], ok = "filter" in q;
    if (ok) q.filter = f[1]; q.drawImage(person, 0, 0, S, S);
    if (ok && f[2]) { q.filter = "blur(" + f[2] + "px) " + (f[1] === "none" ? "" : f[1]); q.globalAlpha = .35; q.drawImage(person, 0, 0, S, S); q.globalAlpha = 1; }
    q.filter = "none"; return c;
  }
  function draw() {
    if (!person) return; ctx.clearRect(0, 0, S, S); const pl = layer();
    if (useBg && mask) { drawBrandBg(ctx, S); const t = document.createElement("canvas"); t.width = t.height = S; const tq = t.getContext("2d"); tq.drawImage(pl, 0, 0); tq.globalCompositeOperation = "destination-in"; tq.drawImage(mask, 0, 0, S, S); ctx.drawImage(t, 0, 0); }
    else ctx.drawImage(pl, 0, 0);
    cv.hidden = chips.hidden = bUse.hidden = false; bOrig.hidden = !mask; bOrig.textContent = tx(useBg && mask ? "stOrig" : "stBg");
  }
  async function handle(file) {
    if (!file) return;
    try {
      st.textContent = tx("stPrep");
      const bmp = await createImageBitmap(file, { imageOrientation: "from-image" }), c = document.createElement("canvas"); c.width = c.height = S; const q = c.getContext("2d"), s = Math.min(bmp.width, bmp.height);
      q.fillStyle = "#fff"; q.fillRect(0, 0, S, S); q.drawImage(bmp, (bmp.width - s) / 2, (bmp.height - s) * 0.12, s, s, 0, 0, S, S); person = c; mask = null; useBg = false; draw();
      try {
        st.textContent = tx("stBgWait"); const r = (await getSeg()).segment(c), cm = r.confidenceMasks[0], w = cm.width, h = cm.height, arr = cm.getAsFloat32Array();
        const mc = document.createElement("canvas"); mc.width = w; mc.height = h; const mq = mc.getContext("2d"), id = mq.createImageData(w, h);
        for (let i = 0; i < arr.length; i++) { const v = Math.max(0, Math.min(1, (arr[i] - .35) / .4)); id.data[i * 4 + 3] = Math.round(v * 255); id.data[i * 4] = id.data[i * 4 + 1] = id.data[i * 4 + 2] = 255; }
        mq.putImageData(id, 0, 0); const m2 = document.createElement("canvas"); m2.width = m2.height = S; const m2q = m2.getContext("2d"); if ("filter" in m2q) m2q.filter = "blur(1.5px)"; m2q.drawImage(mc, 0, 0, S, S); mask = m2; useBg = true; st.textContent = tx("stReady");
      } catch (e) { st.textContent = tx("stNoBg"); }
      draw();
    } catch (e) { st.textContent = tx("spBad"); }
  }
  bSelfie.onclick = () => fSelfie.click(); bUp.onclick = () => fUp.click(); fSelfie.onchange = () => handle(fSelfie.files[0]); fUp.onchange = () => handle(fUp.files[0]);
  bOrig.onclick = () => { if (mask) { useBg = !useBg; draw(); } };
  bUse.onclick = () => {
    const o = document.createElement("canvas"); o.width = o.height = 400; o.getContext("2d").drawImage(cv, 0, 0, 400, 400);
    const d = o.toDataURL("image/jpeg", 0.85); close(); onDone(d);
  };
  bSelfie.focus({ preventScroll: true });
}

function paintSignup() {
  const card = document.querySelector("#joinStep1 .join-card");
  if (!card || $("spBox")) return;
  const box = document.createElement("div"); box.id = "spBox"; box.className = "sp-box";
  box.innerHTML = '<div class="sp-prev" id="spPrev" aria-hidden="true">📷</div><div class="sp-txt"><b data-i18n="spTitle"></b><small data-i18n="spSub"></small>' +
    '<button type="button" class="primary sp-btn" id="spBtn" data-i18n="spBtn"></button><span class="sp-err" id="spErr" role="alert" hidden></span></div>';
  card.insertBefore(box, card.firstChild);
  const btn = $("spBtn");
  btn.addEventListener("click", () => openStudio(d => {
    stash = d; const p = $("spPrev"); p.textContent = ""; p.style.backgroundImage = "url(" + d + ")"; p.classList.add("has");
    btn.setAttribute("data-i18n", "spChange"); btn.textContent = tx("spChange"); $("spErr").hidden = true;
  }));
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
    box.innerHTML = '<div class="sp-txt"><b data-i18n="spPendTitle"></b><small data-i18n="spPendSub"></small><button type="button" class="primary sp-btn" id="spPBtn" data-i18n="spPendBtn"></button><span class="sp-err" id="spPMsg" role="status" hidden></span></div>';
    txt.parentNode.insertBefore(box, txt.nextSibling);
    $("spPBtn").addEventListener("click", () => openStudio(async d => {
      const m = $("spPMsg"); $("spPBtn").disabled = true;
      try { await window.CMLProfile.uploadMyPhoto(await dataUrlToFile(d)); const tb = box.querySelector(".sp-txt"); tb.innerHTML = ""; const ok = document.createElement("b"); ok.textContent = tx("spThanks"); tb.appendChild(ok); }
      catch (e) { m.textContent = tx("spFail"); m.hidden = false; $("spPBtn").disabled = false; }
    }));
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
