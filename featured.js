// Member-side extras, all admin-managed from Admin only:
//   * Recipe of the Month — a flip/reveal card on the Matcha & Art Corner (settings key "recipe_month")
//   * Did You Know? / ¿Sabías que? — one small educational fact on Home, rotating daily (table did_you_know)
// Both stay completely hidden until the admin publishes something, so nothing changes before then.
(function () {
"use strict";
let C = null, facts = [], factOffset = 0, flipped = false;
const ES = { rcK: "RECETA DEL MES", rcTap: "Toca para descubrir la receta", rcBack: "Toca para volver", rcOpen: "Ver receta completa",
  dykK: "¿SABÍAS QUE?", dykNext: "Otro dato", dykAria: "Dato curioso" };
const EN = { rcK: "RECIPE OF THE MONTH", rcTap: "Tap to reveal the recipe", rcBack: "Tap to go back", rcOpen: "View the full recipe",
  dykK: "DID YOU KNOW?", dykNext: "Another one", dykAria: "Did you know" };
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
function recipeNode() {
  const r = recipe();
  if (!r) return null;
  const img = C.safeUrl(r.image);
  const link = C.safeUrl(r.link);
  const card = el("section", { class: "rc-card" + (flipped ? " is-flipped" : ""), "aria-label": C.t("rcK") });
  const flip = el("button", { type: "button", class: "rc-flip", "aria-pressed": String(flipped) });
  const front = el("span", { class: "rc-face rc-front" },
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
  const list = C.session() ? live() : [];
  if (!list.length) { host.hidden = true; host.replaceChildren(); return; }
  const day = window.CMLDaily ? window.CMLDaily.dayNumber(window.CMLDaily.orlandoToday()) : Math.floor(Date.now() / 86400000);
  const f = list[(day + factOffset) % list.length];
  const next = el("button", { type: "button", class: "dyk-next", text: C.t("dykNext") });
  next.addEventListener("click", () => { factOffset++; paintDyk(); });
  next.hidden = list.length < 2;
  host.hidden = false;
  host.setAttribute("role", "region"); host.setAttribute("aria-label", C.t("dykAria"));
  host.replaceChildren(
    el("small", { class: "dyk-k" }, el("span", { class: "dyk-spark", "aria-hidden": "true", text: "✦" }), C.t("dykK")),
    pickLang(f, "title") ? el("b", { class: "dyk-t", text: pickLang(f, "title") }) : null,
    el("p", { class: "dyk-b", text: pickLang(f, "body") }),
    next);
  host.classList.remove("dyk-in"); void host.offsetWidth; if (!reduced()) host.classList.add("dyk-in");
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
  document.addEventListener("cml:session", () => { flipped = false; factOffset = 0; loadFacts(); });
  document.addEventListener("cml:lang", paintDyk);
  document.addEventListener("cml:render", paintDyk);
  if (C.session()) loadFacts();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
