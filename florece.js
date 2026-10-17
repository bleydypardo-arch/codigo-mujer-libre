// Crece & Florece — a separate module (Bogotá only). It owns its own screen (#florece), its own styles (florece.css)
// and its own data (settings key "florece"). Nothing else in the app reads or changes that data.
// If anything in here fails, the rest of the app keeps working (every entry point is wrapped).
(function () {
"use strict";
let C = null, view = "cover";
const KEY = "florece";
const CITY_DEFAULTS = ["Emergencias y Ayuda para Mujeres", "Transporte Seguro", "Salud y Clínicas", "Trámites y Documentos", "Mi Mapa de Bogotá"];
const CITY_ICONS = [
  "M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z",
  "M5 16V11l2-5h10l2 5v5zM5 16v3M19 16v3M7 13h.01M17 13h.01",
  "M12 5v14M5 12h14",
  "M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5",
  "M12 21s-6-5.2-6-10a6 6 0 0 1 12 0c0 4.8-6 10-6 10zM12 8.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"];
const TINTS = ["tint-rose", "tint-lilac", "tint-peach", "tint-sage"];

const ES = {
  flName: "Crece & Florece", flTagline: "Recursos de tu ciudad, conexiones reales y oportunidades de crecimiento.", flEnter: "Entrar", flHomeAria: "Ir al inicio", flBackAria: "Volver",
  flEntrySub: "Recursos y premios de tu ciudad", flRoomsHint: "Elige a dónde quieres ir.",
  flGana: "Gana", flGanaSub: "Código sorpresa y premios.", flCrece: "Crece", flCreceSub: "Becas, cursos y empleo para mujeres.",
  flEmprende: "Emprende", flEmprendeSub: "Emprendedora del mes y recursos.", flCiudad: "Tu Ciudad", flCiudadSub: "Emergencias, salud, transporte y mapa.",
  flGanaTitle: "Código Sorpresa", flGanaSoon: "Muy pronto: tu anfitriona revelará una palabra y la primera que la escriba gana un premio.", flGanaNote: "Una sola ganadora por código. No cuesta nada participar.",
  flOppTitle: "Oportunidades para Mujeres", flOppSub: "Gratis o del Distrito, con enlace oficial.", flOppEmpty: "Pronto publicaremos aquí oportunidades verificadas por el equipo del Club.", flOppNote: "Cada oportunidad la revisa el equipo del Club antes de publicarse.",
  flEmpTitle: "Emprendedora del Mes", flResTitle: "Recursos para Emprender", flResEmpty: "Pronto verás aquí enlaces útiles para emprender.", flEmpEmpty: "Pronto conocerás a la próxima emprendedora del mes.", flEmpLink: "Conoce su emprendimiento", flEmpNote: "El Club no participa en ventas ni pagos.",
  flCityTitle: "Tu Ciudad", flCitySub: "Bogotá, con enlaces que el equipo verifica.", flSoon: "Próximamente", flOpen: "Abrir",
  flAdminTab: "Crece & Florece", flAdminIntro: "Todo lo de este módulo (solo se ve en Bogotá). Pega los enlaces y sube las fotos. Lo que no marques como publicado no aparece.",
  flA_opp: "Oportunidades (sala Crece)", flA_res: "Recursos para emprender (sala Emprende)", flA_emp: "Emprendedora del mes", flA_city: "Tu Ciudad: los 5 botones",
  flA_add: "+ Agregar", flA_title: "Título", flA_sub: "Quién lo ofrece y fecha (opcional)", flA_url: "Enlace (pega aquí la dirección de la página)", flA_img: "Foto (opcional)", flA_pub: "Publicado",
  flA_del: "Quitar", flA_save: "Guardar todo", flA_saved: "Guardado.", flA_fail: "No se pudo guardar. Inténtalo de nuevo.", flA_confirm: "¿Quitar este elemento?",
  flA_name: "Nombre", flA_biz: "Su emprendimiento", flA_story: "Su historia (2 o 3 líneas)", flA_img1: "Foto 1", flA_img2: "Foto 2", flA_consent: "Ella me autorizó publicar su nombre y fotos", flA_link: "Enlace a su Instagram o página",
  flA_cityHelp: "Si pones un enlace, el botón lo abre. Sin enlace dice «Próximamente».", flA_badUrl: "Revisa el enlace: debe empezar con https://"
};
const EN = {
  flName: "Crece & Florece", flTagline: "Resources from your city, real connections and growth opportunities.", flEnter: "Enter", flHomeAria: "Go to Home", flBackAria: "Back",
  flEntrySub: "Resources and prizes in your city", flRoomsHint: "Choose where you want to go.",
  flGana: "Win", flGanaSub: "Surprise code and prizes.", flCrece: "Grow", flCreceSub: "Grants, courses and jobs for women.",
  flEmprende: "Build", flEmprendeSub: "Entrepreneur of the month and resources.", flCiudad: "Your City", flCiudadSub: "Emergencies, health, transport and map.",
  flGanaTitle: "Surprise Code", flGanaSoon: "Coming soon: your host will reveal a word and the first to type it wins a prize.", flGanaNote: "One winner per code. It costs nothing to take part.",
  flOppTitle: "Opportunities for Women", flOppSub: "Free or city-run, with an official link.", flOppEmpty: "Verified opportunities will appear here soon.", flOppNote: "The Club team reviews each opportunity before it is published.",
  flEmpTitle: "Entrepreneur of the Month", flResTitle: "Resources to Start a Business", flResEmpty: "Useful links for entrepreneurs will appear here soon.", flEmpEmpty: "You'll soon meet the next entrepreneur of the month.", flEmpLink: "Discover her business", flEmpNote: "The Club does not take part in sales or payments.",
  flCityTitle: "Your City", flCitySub: "Bogotá, with links the team verifies.", flSoon: "Coming soon", flOpen: "Open"
};
const t = k => { const v = C ? C.t(k) : ""; return v || k; };
const el = (...a) => C.el(...a);
const data = () => { const d = C.setting(KEY); return d && typeof d === "object" ? d : {}; };
const list = k => (Array.isArray(data()[k]) ? data()[k] : []).filter(x => x && x.on !== false && x.title);
const link = u => C.safeUrl(u);
const icon = (path, cls) => { const n = document.createElementNS("http://www.w3.org/2000/svg", "svg"); n.setAttribute("viewBox", "0 0 24 24"); n.setAttribute("class", cls || "fl-ic"); n.setAttribute("aria-hidden", "true");
  const p = document.createElementNS("http://www.w3.org/2000/svg", "path"); p.setAttribute("d", path); n.appendChild(p); return n; };
const HOME = "M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z", BACK = "M15 6l-6 6 6 6", CHEV = "M9 6l6 6-6 6";
const active = () => { try { return !!(window.CMLPremium && window.CMLPremium.can("florece")); } catch { return false; } };

// ---------- the entry card on Home (Bogotá only) ----------
function renderEntry() {
  return;   // the Home button is now drawn by premium.js (gold pill, per-person access)
  // eslint-disable-next-line no-unreachable
  const host = document.getElementById("floreceEntry"); if (!host) return;
  if (!active()) { host.hidden = true; host.replaceChildren(); return; }
  const b = el("button", { type: "button", class: "fl-entry", "aria-label": t("flName") },
    el("span", { class: "fl-entry-ic", "aria-hidden": "true" }, icon("M12 3c1.5 3 4.5 4 4.5 7.5a4.5 4.5 0 0 1-9 0C7.5 7 10.5 6 12 3zM12 21v-7", "fl-ic")),
    el("span", { class: "fl-entry-tx" }, el("b", { text: t("flName") }), el("small", { text: t("flEntrySub") })),
    icon(CHEV, "fl-chev"));
  b.addEventListener("click", () => open("cover"));
  host.replaceChildren(b); host.hidden = false;
}

// ---------- screens ----------
function bar(backTo) {
  const back = backTo ? el("button", { type: "button", class: "fl-round", "aria-label": t("flBackAria") }, icon(BACK)) : el("span", { class: "fl-round-gap" });
  if (backTo) back.addEventListener("click", () => go(backTo));
  const home = el("button", { type: "button", class: "fl-round", "aria-label": t("flHomeAria") }, icon(HOME));
  home.addEventListener("click", () => C.showPage("home"));
  return el("div", { class: "fl-bar" }, back, home);
}
const head = (title, sub) => el("div", { class: "fl-head" }, el("h1", { text: title }), sub ? el("p", { text: sub }) : null);
function row(item, tint) {
  const u = link(item.url), img = link(item.img);
  const thumb = el("span", { class: "fl-thumb " + tint }, img ? el("img", { src: img, alt: "", loading: "lazy" }) : null);
  const inner = [thumb, el("span", { class: "fl-row-tx" }, el("b", { text: item.title }), item.sub ? el("small", { text: item.sub }) : null), icon(CHEV, "fl-chev")];
  return u ? el("a", { class: "fl-row", href: u, target: "_blank", rel: "noopener noreferrer" }, ...inner) : el("div", { class: "fl-row" }, ...inner);
}
function cover() {
  const go1 = el("button", { type: "button", class: "fl-cta", text: t("flEnter") });
  go1.addEventListener("click", () => go("rooms"));
  const home = el("button", { type: "button", class: "fl-round fl-round-float", "aria-label": t("flHomeAria") }, icon(HOME));
  home.addEventListener("click", () => C.showPage("home"));
  return el("div", { class: "fl-screen fl-cover" },
    el("div", { class: "fl-hero", "aria-hidden": "true" }, orchid()),
    home,
    el("div", { class: "fl-cover-tx" }, el("h1", {}, "Crece", el("br"), "& Florece"), el("p", { text: t("flTagline") }), go1, el("small", { text: t("flName") + " · Bogotá" })));
}
function orchid() {
  const ns = "http://www.w3.org/2000/svg", s = document.createElementNS(ns, "svg"); s.setAttribute("viewBox", "0 0 120 120");
  s.innerHTML = '<g fill="#F7DCE5"><ellipse cx="60" cy="26" rx="14" ry="26"/><ellipse cx="36" cy="80" rx="12" ry="28" transform="rotate(28 36 80)"/><ellipse cx="84" cy="80" rx="12" ry="28" transform="rotate(-28 84 80)"/></g><g fill="#EBA9BE"><ellipse cx="29" cy="48" rx="26" ry="17" transform="rotate(-18 29 48)"/><ellipse cx="91" cy="48" rx="26" ry="17" transform="rotate(18 91 48)"/></g><path d="M60 54c-11 2-16 11-12 22 4 8 20 8 24 0 4-11-1-20-12-22z" fill="#B8607A"/><circle cx="60" cy="52" r="6" fill="#F8E7EC"/>';
  return s;
}
function rooms() {
  const defs = [["gana", "flGana", "flGanaSub", "tint-peach", "M20 12v8H4v-8M2 8h20v4H2zM12 8v12M12 8c-2-4-6-4-6-1.5S10 8 12 8zM12 8c2-4 6-4 6-1.5S14 8 12 8z"],
    ["crece", "flCrece", "flCreceSub", "tint-sage", "M12 20V8M12 8c0-3 2-5 6-5 0 4-2 6-6 5zM12 13c0-2.5-1.8-4-5-4 0 3.5 1.8 5 5 4z"],
    ["emprende", "flEmprende", "flEmprendeSub", "tint-lilac", "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"],
    ["ciudad", "flCiudad", "flCiudadSub", "tint-rose", CITY_ICONS[4]]];
  return el("div", { class: "fl-screen" }, bar("cover"), head(t("flName"), t("flRoomsHint")),
    el("div", { class: "fl-stack" }, ...defs.map(([id, a, b, tint, path]) => {
      const x = el("button", { type: "button", class: "fl-room" }, el("span", { class: "fl-room-ic " + tint }, icon(path)),
        el("span", { class: "fl-room-tx" }, el("b", { text: t(a) }), el("small", { text: t(b) })), icon(CHEV, "fl-chev"));
      x.addEventListener("click", () => go(id)); return x;
    })));
}
function gana() {
  return el("div", { class: "fl-screen" }, bar("rooms"), head(t("flGanaTitle")),
    el("div", { class: "fl-stack" },
      el("div", { class: "fl-gift", "aria-hidden": "true" }, icon("M20 12v8H4v-8M2 8h20v4H2zM12 8v12M12 8c-2-4-6-4-6-1.5S10 8 12 8zM12 8c2-4 6-4 6-1.5S14 8 12 8z", "fl-gift-ic")),
      el("div", { class: "fl-card fl-center" }, el("p", { text: t("flGanaSoon") })),
      el("p", { class: "fl-note", text: t("flGanaNote") })));
}
function crece() {
  const items = list("opp");
  return el("div", { class: "fl-screen" }, bar("rooms"), head(t("flOppTitle"), t("flOppSub")),
    el("div", { class: "fl-stack" }, ...(items.length ? items.map((x, i) => row(x, TINTS[i % TINTS.length])) : [el("div", { class: "fl-card fl-center" }, el("p", { text: t("flOppEmpty") }))]),
      el("p", { class: "fl-note", text: t("flOppNote") })));
}
function emprende() {
  const e = data().emp || {}, shown = e.on !== false && e.name && e.consent;
  const res = list("res");
  const emp = shown ? el("div", { class: "fl-card fl-emp" },
    el("div", { class: "fl-emp-photos" }, ...[e.img1, e.img2].map(u => { const s = link(u); return el("span", { class: "fl-emp-ph" }, s ? el("img", { src: s, alt: e.name, loading: "lazy" }) : null); })),
    el("h2", { text: e.name }), e.biz ? el("p", { class: "fl-emp-biz", text: e.biz }) : null, e.story ? el("p", { class: "fl-emp-story", text: e.story }) : null,
    link(e.url) ? el("a", { class: "fl-cta fl-cta-sm", href: link(e.url), target: "_blank", rel: "noopener noreferrer", text: t("flEmpLink") }) : null)
    : el("div", { class: "fl-card fl-center" }, el("p", { text: t("flEmpEmpty") }));
  return el("div", { class: "fl-screen" }, bar("rooms"), head(t("flEmpTitle")),
    el("div", { class: "fl-stack" }, emp, el("h2", { class: "fl-sub", text: t("flResTitle") }),
      ...(res.length ? res.map((x, i) => row(x, TINTS[(i + 1) % TINTS.length])) : [el("div", { class: "fl-card fl-center" }, el("p", { text: t("flResEmpty") }))]),
      el("p", { class: "fl-note", text: t("flEmpNote") })));
}
function ciudad() {
  const saved = Array.isArray(data().city) ? data().city : [];
  return el("div", { class: "fl-screen" }, bar("rooms"), head(t("flCityTitle"), t("flCitySub")),
    el("div", { class: "fl-stack" }, ...CITY_DEFAULTS.map((name, i) => {
      const s = saved[i] || {}, u = link(s.url), title = s.title || name, tint = TINTS[i % TINTS.length];
      const inner = [el("span", { class: "fl-thumb fl-thumb-ic " + tint }, icon(CITY_ICONS[i])), el("span", { class: "fl-row-tx" }, el("b", { text: title }), u ? null : el("small", { text: t("flSoon") })), icon(CHEV, "fl-chev")];
      return u ? el("a", { class: "fl-row", href: u, target: "_blank", rel: "noopener noreferrer" }, ...inner) : el("div", { class: "fl-row fl-row-soon" }, ...inner);
    })));
}
const SCREENS = { cover, rooms, gana, crece, emprende, ciudad };

function paint() {
  const host = document.getElementById("florece"); if (!host || !C) return;
  try { host.replaceChildren((SCREENS[view] || cover)()); } catch (e) { console.error(e); host.replaceChildren(); }
  window.scrollTo({ top: 0, behavior: "auto" });
}
function go(v) { view = v; paint(); }
function open(v) { if (!active()) return; view = v || "cover"; C.showPage("florece", false); paint(); }

// ---------- Admin tab ----------
function adminTab() {
  const A = window.CMLAdmin, K = A.kit(), cur = JSON.parse(JSON.stringify(data()));
  const wrap = el("div", { class: "admin-form" }, el("p", { class: "small-note", text: t("flAdminIntro") }));
  const fb = el("p", { class: "form-feedback", role: "alert", hidden: true });
  const say = m => { fb.hidden = !m; fb.textContent = m || ""; };
  const inp = (label, val, o) => { const n = el(o && o.area ? "textarea" : "input", o && o.area ? { rows: 3 } : { type: o && o.url ? "url" : "text", maxlength: (o && o.max) || 160 }); n.value = val || ""; if (o && o.url) n.placeholder = "https://…"; return { n, node: el("label", {}, label, n) }; };
  const collectors = {};
  const itemList = (key, title, withImg) => {
    const box = el("div", {}), items = (cur[key] || []).slice(); const rows = [];
    const draw = () => {
      rows.length = 0; box.replaceChildren();
      items.forEach((it, i) => {
        const ti = inp(t("flA_title"), it.title), su = inp(t("flA_sub"), it.sub), ur = inp(t("flA_url"), it.url, { url: true, max: 500 });
        const pk = withImg ? K.imagePicker(it.img || "") : null;
        const on = el("input", { type: "checkbox" }); on.checked = it.on !== false;
        const rm = K.button(t("flA_del"), "secondary", async () => { if (!await window.cmlConfirm(t("flA_confirm"))) return; items.splice(i, 1); sync(); draw(); });
        rows.push({ ti, su, ur, pk, on });
        box.appendChild(el("details", { class: "rf-group", open: it.title ? null : "open" }, el("summary", { text: it.title || "—" }), ti.node, su.node, ur.node,
          pk ? el("div", {}, el("b", { text: t("flA_img") }), pk.node) : null, el("label", { class: "check" }, on, t("flA_pub")), rm));
      });
    };
    const sync = () => { rows.forEach((r, i) => { if (!items[i]) return; items[i] = { id: items[i].id || String(Date.now() + i), title: r.ti.n.value.trim(), sub: r.su.n.value.trim(), url: r.ur.n.value.trim(), img: r.pk ? r.pk.value : "", on: r.on.checked }; }); };
    collectors[key] = () => { sync(); return items.filter(x => x.title || x.url); };
    draw();
    wrap.appendChild(el("h3", { text: title })); wrap.appendChild(box);
    wrap.appendChild(K.button(t("flA_add"), "secondary", () => { sync(); items.push({ id: String(Date.now()), title: "", on: true }); draw(); }));
  };
  itemList("opp", t("flA_opp"), true);
  itemList("res", t("flA_res"), false);
  // emprendedora
  const e = cur.emp || {};
  const en = inp(t("flA_name"), e.name), eb = inp(t("flA_biz"), e.biz), es = inp(t("flA_story"), e.story, { area: true, max: 600 }), eu = inp(t("flA_link"), e.url, { url: true, max: 500 });
  const p1 = K.imagePicker(e.img1 || ""), p2 = K.imagePicker(e.img2 || "");
  const econ = el("input", { type: "checkbox" }); econ.checked = !!e.consent;
  const eon = el("input", { type: "checkbox" }); eon.checked = e.on !== false && !!e.name;
  wrap.append(el("h3", { text: t("flA_emp") }), en.node, eb.node, es.node, eu.node, el("b", { text: t("flA_img1") }), p1.node, el("b", { text: t("flA_img2") }), p2.node,
    el("label", { class: "check" }, econ, t("flA_consent")), el("label", { class: "check" }, eon, t("flA_pub")));
  // city buttons
  const saved = Array.isArray(cur.city) ? cur.city : [];
  const cityRows = CITY_DEFAULTS.map((name, i) => { const u = inp(name, (saved[i] || {}).url, { url: true, max: 500 }); return u; });
  wrap.append(el("h3", { text: t("flA_city") }), el("p", { class: "small-note", text: t("flA_cityHelp") }), ...cityRows.map(r => r.node));
  const save = K.button(t("flA_save"), "primary", async () => {
    say("");
    const urls = [...[...collectors.opp(), ...collectors.res()].map(x => x.url), eu.n.value.trim(), ...cityRows.map(r => r.n.value.trim())].filter(Boolean);
    if (urls.some(u => !link(u))) return say(t("flA_badUrl"));
    const value = { opp: collectors.opp(), res: collectors.res(),
      emp: { name: en.n.value.trim(), biz: eb.n.value.trim(), story: es.n.value.trim(), url: eu.n.value.trim(), img1: p1.value, img2: p2.value, consent: econ.checked, on: eon.checked },
      city: CITY_DEFAULTS.map((name, i) => ({ title: name, url: cityRows[i].n.value.trim() })) };
    try {
      const w = await C.db.from("settings").upsert({ key: KEY, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
      if (w.error) throw w.error;
      await C.refreshPublic(); K.toast(t("flA_saved"));
    } catch (err) { console.error(err); say(t("flA_fail")); }
  });
  wrap.append(fb, el("div", { class: "admin-bar" }, save));
  return wrap;
}

function init() {
  C = window.CML; if (!C) return;
  try {
    C.addStrings(ES, EN);
    const afterEntry = () => { try { renderEntry(); } catch (e) { console.error(e); } };
    document.addEventListener("cml:render", afterEntry);
    document.addEventListener("cml:session", afterEntry);
    document.addEventListener("cml:lang", () => { afterEntry(); if (document.getElementById("florece") && document.getElementById("florece").classList.contains("active")) paint(); });
    document.addEventListener("cml:page", e => { document.body.classList.toggle("fl-on", !!e.detail && e.detail.page === "florece"); });
    if (window.CMLAdmin && window.CMLAdmin.registerTab) window.CMLAdmin.registerTab("florece", { group: "content", label: { es: ES.flAdminTab, en: ES.flAdminTab }, render: async () => adminTab() });
    afterEntry();
    window.CMLFlorece = { open, paint };
  } catch (e) { console.error(e); }
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
