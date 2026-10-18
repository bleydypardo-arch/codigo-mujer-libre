// Código Mujer Libre — Wellness "Lecturas" (reads): one animated card on the Wellness page that opens a reading page.
// Content = the Admin "Home" tab plans (kind "home", not Matcha), so nothing new in the database.
// A designed post (an image) is shown WHOLE, never cropped. Newest first; earlier ones stay in a library grouped by month.
// Optional English version of the image: plan tag "imgEn" (used when the app is in English).
(function () {
"use strict";
let C = null;
const ES = {
  rdK: "BIENESTAR", rdTitle: "Lecturas de Bienestar", rdNow: "Leer ahora", rdNew: "Nueva",
  rdIntro: "Ideas cortas sobre longevidad, alimentación, salud de la mujer y hábitos.",
  rdLibK: "Biblioteca", rdLibP: "Todas las lecturas anteriores, para volver a ellas cuando quieras.",
  rdEmpty: "Pronto compartiremos aquí nuestra primera lectura.", rdOpen: "Abrir lectura", rdShare: "Compartir con la comunidad",
  bkBrand: "CÓDIGO MUJER LIBRE", bkC1: "LECTURAS", bkC2: "de Bienestar", bkTag: "UN LIBRO DE VIDA", bkN: "DE 5",
  bk1T: "Bienestar Espiritual", bk1D: "Dios, fe, oración, gratitud, esperanza, reflexiones bíblicas y paz interior.", bk1X: "vive con fe",
  bk2T: "Bienestar Emocional y Mental", bk2D: "Estrés, ansiedad, emociones, autoestima y equilibrio mental.", bk2X: "respira y siente",
  bk3T: "Energía y Vitalidad", bk3D: "Descanso, sueño reparador, ejercicio, movimiento y hábitos saludables.", bk3X: "hoy, energía",
  bk4T: "Nutrición, Belleza y Longevidad", bk4D: "Alimentación, salud hormonal, cuidado de la piel y envejecimiento saludable.", bk4X: "nútrete bien",
  bk5T: "El Arte de Vivir Bien", bk5D: "Relaciones sanas, límites personales, felicidad, propósito de vida y crecimiento personal.", bk5X: "vive con propósito"
};
const EN = {
  rdK: "WELLNESS", rdTitle: "Wellness Reads", rdNow: "Read now", rdNew: "New",
  rdIntro: "Short ideas on longevity, healthy eating, women's health and habits.",
  rdLibK: "Library", rdLibP: "Every earlier read, to come back to whenever you like.",
  rdEmpty: "Soon we'll share our first read here.", rdOpen: "Open read", rdShare: "Share with the community",
  bkBrand: "CÓDIGO MUJER LIBRE", bkC1: "WELLNESS", bkC2: "Reads", bkTag: "A BOOK OF LIFE", bkN: "OF 5",
  bk1T: "Spiritual Wellness", bk1D: "God, faith, prayer, gratitude, hope, biblical reflections and inner peace.", bk1X: "live with faith",
  bk2T: "Emotional & Mental Wellness", bk2D: "Stress, anxiety, emotions, self-esteem and mental balance.", bk2X: "breathe and feel",
  bk3T: "Energy & Vitality", bk3D: "Rest, restorative sleep, exercise, movement and healthy habits.", bk3X: "energy today",
  bk4T: "Nutrition, Beauty & Longevity", bk4D: "Healthy eating, hormonal health, skin care and healthy aging.", bk4X: "nourish yourself",
  bk5T: "The Art of Living Well", bk5D: "Healthy relationships, personal boundaries, happiness, life purpose and personal growth.", bk5X: "live on purpose"
};
const t = k => (C ? C.t(k) : k);
const el = (...a) => C.el(...a);
const items = () => {
  if (!C || !C.session()) return [];
  const all = C.homeData().plans.filter(p => p.kind === "home" && !C.planTag(p.id).matcha)
    .sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));
  // Each read can be marked Spanish-only / English-only in Admin: members see the ones for their language (and "both").
  // If nothing matches her language, show everything rather than an empty page.
  const lang = C.lang() === "en" ? "en" : "es";
  const mine = all.filter(p => { const l = C.planTag(p.id).lang; return !l || l === lang; });
  return mine.length ? mine : all;
};
const imgOf = p => {
  const tg = C.planTag(p.id);
  const en = C.lang() === "en" && tg.imgEn ? C.safeUrl(tg.imgEn) : "";
  return en || C.safeUrl(p.image_url) || "";
};
const monthOf = p => {
  const d = p.created_at ? new Date(p.created_at) : null;
  if (!d || isNaN(d)) return "";
  const s = d.toLocaleDateString(C.loc(), { month: "long", year: "numeric" });
  return s.charAt(0).toUpperCase() + s.slice(1);
};

// White orchid (drawn by code.js with a white palette), so this section does not repeat the pink one of the home page.
function whiteOrchid() {
  const s = el("span", { class: "rv-orchid" });
  if (window.CMLOrchid) s.innerHTML = window.CMLOrchid.svg("rv-svg", true);
  return s;
}

// ---- the card on the Wellness page ----
function renderCard() {
  const host = document.getElementById("featuredBlock"), box = document.getElementById("featured");
  if (!host || !box) return;
  const list = items();
  host.hidden = !C.session();            // always shown to members, even before the first read exists
  if (!C.session()) return box.replaceChildren();
  const latest = list[0];
  const sub = latest ? (C.pick(latest, "title") || t("rdIntro")) : t("rdIntro");
  const leaf = c => el("i", { class: "bk-lf " + c });
  const page = (n, cls) => el("span", { class: "bk-pg " + cls },
    el("span", { class: "bk-face bk-paper bk-front" },
      el("small", { class: "bk-num", text: n + " " + t("bkN") }),
      el("b", { class: "bk-pt", text: t("bk" + n + "T") }),
      el("i", { class: "bk-orn", text: "✦" }),
      el("span", { class: "bk-pd", text: t("bk" + n + "D") }),
      el("i", { class: "bk-ln" }), el("i", { class: "bk-ln bk-s" }), el("i", { class: "bk-ln" })),
    el("span", { class: "bk-face bk-paper bk-paperL bk-backface" },
      el("img", { src: "well-book-" + n + ".webp", alt: "", loading: "lazy", decoding: "async" }),
      el("small", { class: "bk-cap", text: t("bk" + n + "X") })));
  const med = el("span", { class: "bk-med" }, whiteOrchid());
  const cover = el("span", { class: "bk-pg bk-cover" },
    el("span", { class: "bk-face bk-cov" },
      el("span", { class: "bk-spine" }, el("i"), el("i"), el("i"), el("i")),
      el("span", { class: "bk-cv" },
        el("small", { class: "bk-foil bk-brand", text: t("bkBrand") }), med,
        el("b", { class: "bk-foil bk-c1", text: t("bkC1") }), el("em", { class: "bk-foil bk-c2", text: t("bkC2") }),
        el("span", { class: "bk-dv" }, el("i"), el("span", { class: "bk-foil", text: "❖" }), el("i")),
        el("small", { class: "bk-foil bk-tag", text: t("bkTag") }))),
    el("span", { class: "bk-ribbon" }),
    el("span", { class: "bk-face bk-paper bk-paperL bk-backface bk-orchid-page" }, whiteOrchid()));
  const base = el("span", { class: "bk-pg bk-base" }, el("span", { class: "bk-edge" }),
    el("span", { class: "bk-face bk-paper" }, el("i", { class: "bk-photo" }), el("b", { class: "bk-pt bk-last", text: t("rdTitle") }), el("i", { class: "bk-ln" }), el("i", { class: "bk-ln bk-s" }), el("i", { class: "bk-ln" })));
  const stage = el("span", { class: "bk-stage", "aria-hidden": "true" },
    el("i", { class: "bk-aura" }), leaf("bk-l1"), leaf("bk-l2"), leaf("bk-l3"), el("i", { class: "bk-sp bk-s1" }), el("i", { class: "bk-sp bk-s2" }), el("i", { class: "bk-sp bk-s3" }),
    el("span", { class: "bk-book" }, base, page(5, "bk-p6"), page(4, "bk-p5"), page(3, "bk-p4"), page(2, "bk-p3"), page(1, "bk-p2"), cover));
  const card = el("button", { type: "button", class: "reads-card bk", "data-go": "reads", "aria-label": t("rdTitle") }, stage,
    el("span", { class: "reads-txt" },
      el("b", { text: t("rdTitle") }),
      el("span", { class: "reads-sub", text: sub }),
      el("span", { class: "reads-btn", text: t("rdNow") })));
  box.replaceChildren(card);
}

// ---- viewer sheet: the whole post, scrollable ----
function openViewer(p) {
  const src = imgOf(p), title = C.pick(p, "title") || "", desc = C.pick(p, "desc") || "";
  const back = el("div", { class: "lg-back", role: "dialog", "aria-modal": "true" });
  const panel = el("div", { class: "lg-panel reads-sheet" });
  const close = el("button", { type: "button", class: "lg-x", text: C.t("closeLabel") });
  const done = () => { document.removeEventListener("keydown", onKey); back.remove(); };
  const onKey = e => { if (e.key === "Escape") done(); };
  close.addEventListener("click", done);
  back.addEventListener("click", e => { if (e.target === back) done(); });
  document.addEventListener("keydown", onKey);
  panel.append(close);
  if (src) panel.append(el("img", { class: "reads-whole", src, alt: title }));
  else panel.append(el("h2", { class: "lg-h", text: title }), el("p", { class: "lg-p reads-pre", text: desc }));
  back.append(panel); document.body.appendChild(back); close.focus();
}

// ---- the reading page ----
function renderPage() {
  const body = document.getElementById("readsBody");
  if (!body) return;
  const list = items();
  const nodes = [el("h1", { text: t("rdTitle") }), el("p", { class: "small-note", text: t("rdIntro") })];
  if (!list.length) nodes.push(el("p", { class: "reads-empty", text: t("rdEmpty") }));
  else {
    const [latest, ...older] = list, src = imgOf(latest);
    const main = el("article", { class: "reads-latest" },
      el("span", { class: "reads-chip", text: t("rdNew") }),
      src ? el("button", { type: "button", class: "reads-open", "aria-label": t("rdOpen") }, el("img", { class: "reads-whole", src, alt: C.pick(latest, "title") || "", loading: "lazy" }))
          : el("div", { class: "reads-textpost" }, el("h2", { text: C.pick(latest, "title") || "" }), el("p", { class: "reads-pre", text: C.pick(latest, "desc") || "" })));
    const open = main.querySelector(".reads-open"); if (open) open.addEventListener("click", () => openViewer(latest));
    nodes.push(main);
    if (older.length) {
      nodes.push(el("h2", { class: "reads-lib", text: t("rdLibK") }), el("p", { class: "small-note", text: t("rdLibP") }));
      const groups = new Map();
      older.forEach(p => { const m = monthOf(p); if (!groups.has(m)) groups.set(m, []); groups.get(m).push(p); });
      let first = true;
      groups.forEach((ps, m) => {
        const det = el("details", { class: "reads-month" }, el("summary", {}, el("span", { text: m || "—" }), el("small", { text: String(ps.length) })));
        if (first) det.open = true; first = false;
        ps.forEach(p => {
          const s = imgOf(p);
          const row = el("button", { type: "button", class: "reads-row" },
            el("span", { class: "reads-th" }, s ? el("img", { src: s, alt: "", loading: "lazy" }) : el("span", { text: "🌿" })),
            el("span", { class: "reads-rt" }, el("b", { text: C.pick(p, "title") || "—" })),
            el("span", { class: "wrow-go", "aria-hidden": "true", text: "›" }));
          row.addEventListener("click", () => openViewer(p));
          det.appendChild(row);
        });
        nodes.push(det);
      });
    }
  }
  body.replaceChildren(...nodes);
}

function render() { if (!C) return; renderCard(); if (document.getElementById("reads") && document.getElementById("reads").classList.contains("active")) renderPage(); }
function init() {
  C = window.CML; if (!C) return;
  C.addStrings(ES, EN);
  window.CMLReads = { render, renderCard };
  document.addEventListener("cml:render", render);
  document.addEventListener("cml:lang", render);
  document.addEventListener("cml:session", render);
  document.addEventListener("cml:page", e => { if (e.detail && e.detail.page === "reads") renderPage(); });
  render();
}
if (window.CML) init(); else document.addEventListener("DOMContentLoaded", init, { once: true });
})();
