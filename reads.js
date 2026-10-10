// Código Mujer Libre — Wellness "Lecturas" (reads): one animated card on the Wellness page that opens a reading page.
// Content = the Admin "Home" tab plans (kind "home", not Matcha), so nothing new in the database.
// A designed post (an image) is shown WHOLE, never cropped. Newest first; earlier ones stay in a library grouped by month.
// Optional English version of the image: plan tag "imgEn" (used when the app is in English).
(function () {
"use strict";
let C = null;
const ES = {
  rdK: "BIENESTAR", rdTitle: "Lecturas de bienestar", rdNow: "Leer ahora", rdNew: "Nueva",
  rdIntro: "Ideas cortas sobre longevidad, alimentación, salud de la mujer y hábitos.",
  rdLibK: "Biblioteca", rdLibP: "Todas las lecturas anteriores, para volver a ellas cuando quieras.",
  rdEmpty: "Pronto compartiremos aquí nuestra primera lectura.", rdOpen: "Abrir lectura", rdShare: "Compartir con la comunidad"
};
const EN = {
  rdK: "WELLNESS", rdTitle: "Wellness reads", rdNow: "Read now", rdNew: "New",
  rdIntro: "Short ideas on longevity, healthy eating, women's health and habits.",
  rdLibK: "Library", rdLibP: "Every earlier read, to come back to whenever you like.",
  rdEmpty: "Soon we'll share our first read here.", rdOpen: "Open read", rdShare: "Share with the community"
};
const t = k => (C ? C.t(k) : k);
const el = (...a) => C.el(...a);
const items = () => {
  if (!C || !C.session()) return [];
  return C.homeData().plans.filter(p => p.kind === "home" && !C.planTag(p.id).matcha)
    .sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));
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
  const vis = el("span", { class: "reads-vis", "aria-hidden": "true" },
    el("i", { class: "rv-aurora" }), el("i", { class: "rv-ring" }), el("i", { class: "rv-glow" }),
    el("i", { class: "rv-leaf rv-l1" }), el("i", { class: "rv-leaf rv-l2" }), el("i", { class: "rv-leaf rv-l3" }), el("i", { class: "rv-leaf rv-l4" }), whiteOrchid(),
    el("i", { class: "rv-sp rv-s1" }), el("i", { class: "rv-sp rv-s2" }), el("i", { class: "rv-sp rv-s3" }));
  const card = el("button", { type: "button", class: "reads-card", "data-go": "reads" }, vis,
    el("span", { class: "reads-txt" },
      el("small", { class: "rose", text: t("rdK") }),
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
