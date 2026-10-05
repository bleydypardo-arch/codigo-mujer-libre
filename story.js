// Código Mujer Libre — "Nuestra Historia / Our Story": who created it, why, the vision and the mission,
// with the founder photo. Text is edited by the owner in Admin (settings key "story" { key: {es, en} });
// the photo uses the existing "founder_photo" setting. No new tables. Also shown read-only to applicants
// on the waiting screen ("Mientras tanto: conoce Nuestra Historia").
(function () {
"use strict";
let C = null;
const KEYS = ["name", "role", "who", "why", "vision", "mission"];
const ES = {
  navStory: "Historia", storyKicker: "NUESTRA HISTORIA", storyTitle: "Nuestra Historia", storyIntro: "Cómo y por qué nació Código Mujer Libre.",
  storyH_who: "Quién la creó", storyH_why: "Por qué nació", storyH_vision: "Nuestra visión", storyH_mission: "Nuestra misión",
  storyLove: "Con cariño,", storyPhoto: "Foto de la fundadora", storyClose: "Cerrar",
  essTitle: "Nuestra Historia", essLink: "Nuestra Historia", essLinkSub: "Cómo y por qué nació Código Mujer Libre"
};
const EN = {
  navStory: "Our Story", storyKicker: "OUR STORY", storyTitle: "Our Story", storyIntro: "How and why Código Mujer Libre was born.",
  storyH_who: "Who created it", storyH_why: "Why it was born", storyH_vision: "Our vision", storyH_mission: "Our mission",
  storyLove: "With love,", storyPhoto: "Founder photo", storyClose: "Close",
  essTitle: "Our Story", essLink: "Our Story", essLinkSub: "How and why Código Mujer Libre was born"
};
// Starting text = the founder's existing "Nuestra esencia" words; the owner edits everything in Admin.
const DEF = {
  es: {
    name: "Jazz", role: "Fundadora · Código Mujer Libre",
    who: "Soy Jazz, fundadora de Código Mujer Libre.",
    why: "Creé Código Mujer Libre porque muchas veces las mujeres pasamos la vida cuidando, resolviendo, trabajando y pensando en todos los demás, mientras nos dejamos para el final.",
    vision: "Este es un espacio para recordarnos que nosotras también importamos. Para encontrar un poco más de equilibrio entre nuestra vida cotidiana, nuestro bienestar, nuestra vida espiritual, nuestras amistades y esos momentos que simplemente nos hacen sentir bien.",
    mission: "No se trata de hacer más. Se trata de vivir mejor, conectar, disfrutar y también hacer espacio para nosotras."
  },
  en: {
    name: "Jazz", role: "Founder · Código Mujer Libre",
    who: "I'm Jazz, the founder of Código Mujer Libre.",
    why: "I created Código Mujer Libre because so often we women spend our lives caring for others, solving problems, working and thinking about everyone else, while leaving ourselves for last.",
    vision: "This is a space to remind us that we matter too. A place to find a little more balance between our everyday life, our well-being, our spiritual life, our friendships and those moments that simply make us feel good.",
    mission: "It's not about doing more. It's about living better, connecting, enjoying, and also making room for ourselves."
  }
};
const ICON = { who: "✿", why: "♡", vision: "◆", mission: "➶" };
const t = key => (C ? C.t(key) : key);
const el = (...a) => C.el(...a);
const textOf = (story, key, lang) => {
  const v = story && story[key] && typeof story[key][lang] === "string" ? story[key][lang].trim() : "";
  return v || DEF[lang][key];
};
function photoBox(url) {
  const ring = el("span", { class: "story-ring" });
  const box = el("span", { class: "story-photo", role: "img", "aria-label": t("storyPhoto") });
  const placeholder = () => { box.replaceChildren(); box.innerHTML = '<svg class="ci" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c.8-4 4-6 8-6s7.2 2 8 6"/></svg>'; box.classList.remove("has-photo"); };
  if (url) {
    const img = el("img", { src: url, alt: "" });
    img.addEventListener("error", placeholder);
    box.appendChild(img); box.classList.add("has-photo");
  } else placeholder();
  ring.appendChild(box);
  return ring;
}
// The page content (used by the Nuestra Historia page and the applicant's read-only view)
function storyNode(story, photoUrl) {
  const lang = C.lang();
  const T = key => textOf(story, key, lang);
  const frag = document.createDocumentFragment();
  frag.appendChild(el("header", { class: "page-head ph-story" },
    el("div", { class: "ph-text" },
      el("span", { class: "ph-kicker" }, el("span", { class: "ph-ic", "aria-hidden": "true", text: "✦" }), el("span", { text: t("storyKicker") })),
      el("h1", { text: t("storyTitle") }),
      el("p", { class: "ph-intro", text: t("storyIntro") }))));
  frag.appendChild(el("div", { class: "story-founder" }, photoBox(photoUrl),
    el("b", { class: "story-name", text: T("name") }), el("small", { class: "story-role", text: T("role") })));
  ["who", "why", "vision", "mission"].forEach(k => {
    frag.appendChild(el("section", { class: "story-sec story-" + k + (k === "vision" || k === "mission" ? " is-deep" : "") },
      el("h2", {}, el("span", { class: "story-ic", "aria-hidden": "true", text: ICON[k] }), el("span", { text: t("storyH_" + k) })),
      ...T(k).split(/\n{2,}/).map(par => el("p", { text: par }))));
  });
  frag.appendChild(el("p", { class: "story-sign" }, el("span", { text: t("storyLove") + " " + T("name") }), el("small", { text: T("role") })));
  return frag;
}
function photoSetting() {
  const v = C.setting ? C.setting("founder_photo") : null;
  return v && v.url ? C.safeUrl(v.url) : "";
}
function render() {
  const root = document.getElementById("storyRoot");
  if (!root || !C) return;
  root.replaceChildren(storyNode((C.setting && C.setting("story")) || {}, photoSetting()));
}
// Applicants (not approved yet) can read the story on the waiting screen. Only public settings are read.
async function openForApplicant() {
  const box = document.getElementById("pendStoryBox");
  if (!box || !C) return;
  if (!box.hidden) { box.hidden = true; return; }
  let story = {}, photo = "";
  try {
    const r = await C.db.from("settings").select("key,value").in("key", ["story", "founder_photo"]);
    (r.data || []).forEach(row => { if (row.key === "story") story = row.value || {}; if (row.key === "founder_photo" && row.value && row.value.url) photo = C.safeUrl(row.value.url); });
  } catch { /* defaults */ }
  const close = el("button", { type: "button", class: "link-btn join-story-link", text: t("storyClose") });
  close.addEventListener("click", () => { box.hidden = true; document.getElementById("pendStory").focus(); });
  box.replaceChildren(el("div", { class: "story-root story-in-gate" }, storyNode(story, photo)), close);
  box.hidden = false;
  box.scrollIntoView({ behavior: "smooth", block: "start" });
}
function init() {
  C = window.CML;
  if (!C) return;
  C.addStrings(ES, EN);
  window.CMLStory = { render, defaults: DEF, KEYS, storyNode };
  document.addEventListener("cml:render", render);
  document.addEventListener("cml:lang", () => { render(); const b = document.getElementById("pendStoryBox"); if (b && !b.hidden) { b.hidden = true; openForApplicant(); } });
  document.addEventListener("cml:session", render);
  document.addEventListener("cml:page", e => { if (e.detail && e.detail.page === "essence") render(); });
  const link = document.getElementById("pendStory");
  if (link) link.addEventListener("click", openForApplicant);
  render();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
