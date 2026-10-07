// Member-side extras, all admin-managed from Admin only:
//   * Recipe of the Month — a flip/reveal card on the Matcha & Art Corner (settings key "recipe_month")
//   * Did You Know? / ¿Sabías que? — one small educational fact on Home, rotating daily (table did_you_know)
// Until the admin publishes something, each shows an elegant "coming soon" state in the same design (never a blank gap).
(function () {
"use strict";
let C = null, facts = [], factOffset = 0, flipped = false, dykFlipped = false;
const ES = { rcK: "RECETA DEL MES", rcTap: "Toca para descubrir la receta", rcBack: "Toca para volver", rcOpen: "Ver receta completa",
  dykK: "¿SABÍAS QUE?", dykNext: "Otro dato", dykAria: "Dato curioso",
  rcSoonT: "Muy pronto: nuestra primera receta", rcSoonP: "Cada mes compartiremos aquí una receta de matcha para disfrutar con calma.", rcSoonTag: "Muy pronto",
  dykSoon: "Muy pronto compartiremos aquí un dato curioso para ti.",
  wellReadsK: "PARA LEER", wellReadsT: "Lecturas de bienestar", wellReadsP: "Ideas cortas sobre longevidad, alimentación, salud de la mujer y hábitos." };
const EN = { rcK: "RECIPE OF THE MONTH", rcTap: "Tap to reveal the recipe", rcBack: "Tap to go back", rcOpen: "View the full recipe",
  dykK: "DID YOU KNOW?", dykNext: "Another one", dykAria: "Did you know",
  rcSoonT: "Coming soon: our first recipe", rcSoonP: "Every month we'll share a matcha recipe here to enjoy slowly.", rcSoonTag: "Coming soon",
  dykSoon: "Soon we'll share a fun fact here for you.",
  wellReadsK: "TO READ", wellReadsT: "Wellness reads", wellReadsP: "Short ideas on longevity, healthy eating, women's health and habits." };
const el = (...a) => C.el(...a);
const reduced = () => !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
const pickLang = (o, k) => { const lang = C.lang(), other = lang === "es" ? "en" : "es"; return String(o[k + "_" + lang] || o[k + "_" + other] || "").trim(); };

// ---------- Recipe of the Month ----------
function recipe() {
  const r = C && C.session() ? C.setting("recipe_month") : null;
  if (!r || typeof r !== "object" || !r.published) return null;
  if (!pickLang(r, "title") && !r.image) return null;
  return r;
}
function medalNode() {
  const medal = el("span", { class: "rc-medal", "aria-hidden": "true" });
  // Static, decorative gold seal (a single leaf line inside two fine rings); no user content goes in here.
  medal.innerHTML = '<svg viewBox="0 0 64 64" focusable="false"><defs><linearGradient id="rcGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3E2BE"/><stop offset=".5" stop-color="#C9A56B"/><stop offset="1" stop-color="#8F6B3A"/></linearGradient></defs><circle cx="32" cy="32" r="29" fill="none" stroke="url(#rcGold)" stroke-width="2.4"/><circle cx="32" cy="32" r="24" fill="none" stroke="url(#rcGold)" stroke-width=".8" stroke-dasharray="1.2 3"/><path d="M32 46 C32 34 36 26 44 21 C45 31 40 41 32 46 Z M32 46 C31 40 28 36 23 33" fill="none" stroke="url(#rcGold)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  return medal;
}
function recipeSoonNode() {
  const card = el("section", { class: "rc-card is-soon", "aria-label": C.t("rcK") });
  card.appendChild(el("div", { class: "rc-face rc-front" }, medalNode(),
    el("small", { class: "rc-k", text: C.t("rcK") }),
    el("b", { class: "rc-title", text: C.t("rcSoonT") }),
    el("span", { class: "rc-teaser", text: C.t("rcSoonP") }),
    el("span", { class: "rc-cta", text: C.t("rcSoonTag") })));
  return card;
}
function recipeNode() {
  const r = recipe();
  if (!r) return C && C.session() ? recipeSoonNode() : null;
  const img = C.safeUrl(r.image);
  const link = C.safeUrl(r.link);
  const card = el("section", { class: "rc-card" + (flipped ? " is-flipped" : ""), "aria-label": C.t("rcK") });
  const flip = el("button", { type: "button", class: "rc-flip", "aria-pressed": String(flipped) });
  const medal = medalNode();
  const front = el("span", { class: "rc-face rc-front" },
    medal,
    el("small", { class: "rc-k", text: C.t("rcK") }),
    el("b", { class: "rc-title", text: pickLang(r, "title") }),
    pickLang(r, "teaser") ? el("span", { class: "rc-teaser", text: pickLang(r, "teaser") }) : null,
    el("span", { class: "rc-cta", text: C.t("rcTap") }));
  const back = el("span", { class: "rc-face rc-back" },
    img ? el("img", { class: "rc-img", src: img, alt: pickLang(r, "title"), loading: "lazy" }) : null,
    pickLang(r, "text") ? el("span", { class: "rc-text", text: pickLang(r, "text") }) : null,
    el("span", { class: "rc-cta", text: C.t("rcBack") }));
  flip.append(el("span", { class: "rc-inner" }, front, back));
  flip.addEventListener("click", () => {
    flipped = !flipped;
    card.classList.toggle("is-flipped", flipped);
    flip.setAttribute("aria-pressed", String(flipped));
    front.setAttribute("aria-hidden", String(flipped)); back.setAttribute("aria-hidden", String(!flipped));
  });
  front.setAttribute("aria-hidden", String(flipped)); back.setAttribute("aria-hidden", String(!flipped));
  card.appendChild(flip);
  if (link) card.appendChild(el("a", { class: "rc-link", href: link, target: "_blank", rel: "noopener noreferrer", text: C.t("rcOpen") + " ↗" }));
  return card;
}

// ---------- Did You Know? ----------
const live = () => facts.filter(f => f.published && (f.body_es || f.body_en)).sort((a, b) => (a.position - b.position) || String(a.created_at).localeCompare(String(b.created_at)));
function paintDyk() {
  const host = document.getElementById("homeDyk");
  if (!host || !C) return;
  if (!C.session()) { host.hidden = true; host.replaceChildren(); return; }
  const list = live();
  const F = window.CMLFlip;
  host.hidden = false;
  host.classList.add("fc-host");
  host.classList.toggle("is-soon", !list.length);
  host.setAttribute("role", "region"); host.setAttribute("aria-label", C.t("dykAria"));
  const day = window.CMLDaily ? window.CMLDaily.dayNumber(window.CMLDaily.orlandoToday()) : Math.floor(Date.now() / 86400000);
  const f = list.length ? list[(day + factOffset) % list.length] : null;
  const next = el("button", { type: "button", class: "fc-act dyk-next", text: C.t("dykNext") });
  next.addEventListener("click", () => { factOffset++; paintDyk(); });
  next.hidden = list.length < 2;
  const back = [
    el("small", { class: "fc-k dyk-k" }, el("span", { class: "dyk-spark", "aria-hidden": "true", text: "✦" }), C.t("dykK")),
    f && pickLang(f, "title") ? el("b", { class: "fc-title dyk-t", text: pickLang(f, "title") }) : null,
    el("p", { class: "fc-body dyk-b", text: f ? pickLang(f, "body") : C.t("dykSoon") }),
    next];
  if (!F) {   // safety net: plain card if the flip component is missing
    host.replaceChildren(...back); return;
  }
  const front = [
    (() => { const s = el("span", { class: "fc-art", "aria-hidden": "true" }); s.innerHTML = F.butterflySVG(); return s; })(),
    el("span", { class: "fc-title", text: C.t("fcDykFront") }),
    el("span", { class: "fc-hint", text: C.t("fcDykHint") })];
  host.replaceChildren(F.build({ cls: "fc-dyk", label: C.t("dykAria"), front, back, flipped: dykFlipped, backLabel: C.t("fcBack"), onToggle: on => { dykFlipped = on; } }));
}
async function loadFacts() {
  if (!C || !C.session()) { facts = []; paintDyk(); return; }
  try {
    const r = await C.db.from("did_you_know").select("*").eq("published", true).order("position", { ascending: true });
    facts = r.error ? [] : (r.data || []);
  } catch { facts = []; }
  paintDyk();
}

function init() {
  C = window.CML; if (!C) return;
  C.addStrings(ES, EN);
  window.CMLFeatured = { recipeNode, paintDyk, loadFacts };
  document.addEventListener("cml:session", () => { flipped = false; dykFlipped = false; factOffset = 0; loadFacts(); });
  document.addEventListener("cml:lang", paintDyk);
  document.addEventListener("cml:render", paintDyk);
  if (C.session()) loadFacts();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
