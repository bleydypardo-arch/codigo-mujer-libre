// Spa Virtual — Admin tab. Lets Jazz and Amilu change the Spa's promises, background music, own sounds and
// YouTube videos without touching code. Saved in settings key "spa_content"; premium.js hands it to the Spa page.
(function () {
"use strict";
let C = null;
const KEY = "spa_content";
const ES = {
  saTab: "Spa Virtual", saIntro: "Aquí cambias lo que las mujeres encuentran dentro del Spa. Lo que guardes aparece la próxima vez que abran el Spa.",
  saPromH: "Promesas", saPromHelp: "Pega tu lista: una promesa por línea, con la referencia después de una barra. Ejemplo: Quédate quieta y confía | Salmo 46:10. Luego puedes ajustar cada una abajo.",
  saPromPaste: "Pegar lista aquí", saPromAdd: "Agregar las líneas de arriba", saPromNew: "+ Una promesa",
  saPromEs: "Promesa (español)", saPromEn: "Promesa (inglés, opcional)", saPromRef: "Referencia (opcional)", saPromTag: "Tema",
  saTagPaz: "Paz", saTagFuerza: "Fuerza", saTagEsperanza: "Esperanza", saTagProteccion: "Protección", saDel: "Quitar", saDelAsk: "¿Quitar este elemento?",
  saMode: "Qué hacer con las promesas de ejemplo", saModeReplace: "Usar solo las mías", saModeAdd: "Agregar las mías a las de ejemplo",
  saMusH: "Música de las promesas", saMusHelp: "Si no pones nada, suena la música suave que viene en el Spa. Pon aquí la tuya (adoración u otra) si tienes permiso para usarla.",
  saAudio: "Enlace a un archivo de audio (https://…/musica.mp3)", saVideo: "Video de YouTube para las promesas (se ve dentro del Spa)",
  saSndH: "Tus sonidos", saSndHelp: "Cada sonido es un enlace a un archivo de audio (.mp3) que suena en bucle. Aparece en Sonidos, junto a los que ya trae el Spa.",
  saSndEs: "Nombre (español)", saSndEn: "Nombre (inglés, opcional)", saUrl: "Enlace https://…", saSndNew: "+ Un sonido",
  saVidH: "Videos de YouTube por sección", saVidHelp: "Se abren en YouTube con su imagen y audio. Pega el enlace y escribe un título corto.",
  saVidTitle: "Título corto", saVidNew: "+ Un video", saSec: ["Reflexiones", "Música para bajar la ansiedad", "Para dormir", "Para leer y trabajar"],
  saSave: "Guardar todo", saSaved: "Guardado.", saFail: "No se pudo guardar. Inténtalo de nuevo.", saBadUrl: "Revisa los enlaces: deben empezar con https://", saAdded: "Promesas agregadas. Revísalas y toca «Guardar todo»."
};
const t = k => { const v = C ? C.t(k) : ""; return v || k; };
const okUrl = u => !u || /^https:\/\/[^\s]+$/.test(String(u).trim());
const TAGS = ["paz", "fuerza", "esperanza", "proteccion"];
async function build() {
  const A = window.CMLAdmin, K = A.kit(), el = C.el, cur = JSON.parse(JSON.stringify(C.setting(KEY) && typeof C.setting(KEY) === "object" ? C.setting(KEY) : {}));
  cur.promises = Array.isArray(cur.promises) ? cur.promises : []; cur.sounds = Array.isArray(cur.sounds) ? cur.sounds : [];
  cur.videos = cur.videos && typeof cur.videos === "object" ? cur.videos : {};
  const wrap = el("div", { class: "sa" }, el("p", { class: "small-note", text: t("saIntro") }));
  const input = (val, ph, on, extra) => { const i = el("input", Object.assign({ type: "text", value: val || "", placeholder: ph, "aria-label": ph }, extra || {})); i.addEventListener("input", () => on(i.value)); return i; };
  const sect = (title, help) => { const s = el("section", { class: "card sa-sec" }, el("h3", { text: title }), help ? el("p", { class: "small-note", text: help }) : null); wrap.appendChild(s); return s; };
  const rowBox = (fields, onDel) => { const b = el("div", { class: "sa-row" }, ...fields); const d = el("button", { type: "button", class: "danger sa-del", text: t("saDel") }); d.addEventListener("click", async () => { if (!await window.cmlConfirm(t("saDelAsk"))) return; onDel(); }); b.appendChild(d); return b; };
  // --- promises
  const ps = sect(t("saPromH"), t("saPromHelp"));
  const mode = el("select", { "aria-label": t("saMode") }, el("option", { value: "replace", text: t("saModeReplace") }), el("option", { value: "add", text: t("saModeAdd") }));
  mode.value = cur.promMode === "add" ? "add" : "replace"; mode.addEventListener("change", () => { cur.promMode = mode.value; });
  cur.promMode = mode.value;
  const paste = el("textarea", { rows: 5, placeholder: t("saPromPaste"), "aria-label": t("saPromPaste"), class: "ta" });
  const addBtn = el("button", { type: "button", class: "secondary", text: t("saPromAdd") });
  const plist = el("div", { class: "sa-list" });
  const paintP = () => plist.replaceChildren(...cur.promises.map((p, i) => {
    const tag = el("select", { "aria-label": t("saPromTag") }, ...TAGS.map(g => el("option", { value: g, text: t({ paz: "saTagPaz", fuerza: "saTagFuerza", esperanza: "saTagEsperanza", proteccion: "saTagProteccion" }[g]) })));
    tag.value = TAGS.includes(p.tag) ? p.tag : "paz"; tag.addEventListener("change", () => { p.tag = tag.value; });
    return rowBox([input(p.es, t("saPromEs"), v => { p.es = v; }), input(p.en, t("saPromEn"), v => { p.en = v; }), input(p.refEs, t("saPromRef"), v => { p.refEs = v; p.refEn = v; }), tag], () => { cur.promises.splice(i, 1); paintP(); });
  }));
  addBtn.addEventListener("click", () => {
    const lines = paste.value.split(/\n+/).map(s => s.trim()).filter(Boolean);
    lines.forEach(l => { const [a, ...r] = l.split("|"); cur.promises.push({ tag: "paz", es: a.trim(), en: "", refEs: r.join("|").trim(), refEn: r.join("|").trim() }); });
    if (lines.length) { paste.value = ""; paintP(); K.toast(t("saAdded")); }
  });
  const newP = el("button", { type: "button", class: "secondary", text: t("saPromNew") }); newP.addEventListener("click", () => { cur.promises.push({ tag: "paz", es: "", en: "", refEs: "", refEn: "" }); paintP(); });
  ps.append(el("label", { class: "sa-lbl" }, t("saMode"), mode), paste, addBtn, plist, newP); paintP();
  // --- music
  const ms = sect(t("saMusH"), t("saMusHelp"));
  ms.append(input(cur.promAudio, t("saAudio"), v => { cur.promAudio = v.trim(); }), input(cur.promVideo, t("saVideo"), v => { cur.promVideo = v.trim(); }));
  // --- sounds
  const ss = sect(t("saSndH"), t("saSndHelp")); const slist = el("div", { class: "sa-list" });
  const paintS = () => slist.replaceChildren(...cur.sounds.map((s, i) => rowBox([input(s.es, t("saSndEs"), v => { s.es = v; }), input(s.en, t("saSndEn"), v => { s.en = v; }), input(s.url, t("saUrl"), v => { s.url = v.trim(); })], () => { cur.sounds.splice(i, 1); paintS(); })));
  const newS = el("button", { type: "button", class: "secondary", text: t("saSndNew") }); newS.addEventListener("click", () => { cur.sounds.push({ es: "", en: "", url: "" }); paintS(); });
  ss.append(slist, newS); paintS();
  // --- videos
  const vs = sect(t("saVidH"), t("saVidHelp"));
  ES.saSec.forEach((name, si) => {
    cur.videos[si] = Array.isArray(cur.videos[si]) ? cur.videos[si] : [];
    const box = el("div", { class: "sa-sub" }, el("b", { text: name })), list = el("div", { class: "sa-list" });
    const paint = () => list.replaceChildren(...cur.videos[si].map((v, i) => rowBox([input(v.title, t("saVidTitle"), x => { v.title = x; }), input(v.url, t("saUrl"), x => { v.url = x.trim(); })], () => { cur.videos[si].splice(i, 1); paint(); })));
    const nb = el("button", { type: "button", class: "secondary", text: t("saVidNew") }); nb.addEventListener("click", () => { cur.videos[si].push({ title: "", url: "" }); paint(); });
    box.append(list, nb); vs.appendChild(box); paint();
  });
  // --- save
  const save = el("button", { type: "button", class: "primary", text: t("saSave") });
  save.addEventListener("click", async () => {
    const urls = [cur.promAudio, cur.promVideo].concat(cur.sounds.map(s => s.url), [0, 1, 2, 3].flatMap(i => cur.videos[i].map(v => v.url)));
    if (!urls.every(okUrl)) return K.toast(t("saBadUrl"));
    save.disabled = true;
    try {
      const clean = {
        promises: cur.promises.filter(p => p.es && p.es.trim()), promMode: cur.promMode, promAudio: cur.promAudio || "", promVideo: cur.promVideo || "",
        sounds: cur.sounds.filter(s => s.url && s.url.trim()), videos: {}
      };
      [0, 1, 2, 3].forEach(i => { const l = cur.videos[i].filter(v => v.url && v.url.trim()); if (l.length) clean.videos[i] = l; });
      for (const k of Object.keys(clean)) await A.setMapEntry(KEY, k, clean[k]);
      K.toast(t("saSaved")); if (C.refreshPublic) await C.refreshPublic();
    } catch { K.toast(t("saFail")); }
    save.disabled = false;
  });
  wrap.appendChild(el("div", { class: "admin-bar" }, save));
  return wrap;
}
function init() {
  C = window.CML; if (!C) return;
  try {
    C.addStrings(ES, ES);
    if (window.CMLAdmin && window.CMLAdmin.registerTab) window.CMLAdmin.registerTab("spa", { group: "content", label: { es: ES.saTab, en: ES.saTab }, render: async () => build() });
  } catch (e) { console.error(e); }
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
