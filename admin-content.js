// Admin → content editors added for the expansion: Your Code for Today, wellness goals, Recipe of the Month,
// Did You Know?, and the Travel "coming soon" placeholders. Everything here is CONTENT only (no layout, colors or fonts).
// Allowed for the owner, the administrator and content administrators; the database enforces it (RLS), not just this screen.
(function () {
"use strict";
const T = {
  es: {
    tDaily: "Código de hoy", tMoods: "Metas de bienestar", tRecipe: "Receta del mes", tDyk: "¿Sabías que?", tTalk: "Hablemos", tTravel: "Viajes: próximamente",
    save: "Guardar", cancel: "Cancelar", edit: "Editar", del: "Eliminar", publish: "Publicar", unpublish: "Despublicar", preview: "Vista previa", hidePreview: "Ocultar vista previa",
    published: "Publicado", draft: "Borrador", today: "Hoy", scheduled: "Programado", saved: "Guardado.", saveFail: "No se pudo guardar. Inténtalo de nuevo.", loadFail: "No se pudo cargar.",
    confirmDel: "¿Eliminar esta entrada? No se puede deshacer.", confirmReset: "¿Quitar esta personalización y volver al texto original?", up: "Subir", down: "Bajar", empty: "Todavía no hay entradas.",
    newEntry: "+ Nueva entrada", fAff: "Afirmación (frente de la tarjeta)", fBack: "Tema o título (reverso)", fVerse: "Versículo", fRef: "Referencia bíblica", fMsg: "Mensaje de hoy",
    fMsgHelp: "Opcional. Si lo dejas vacío se usa el mensaje general de «Imágenes y textos».", fDate: "Programar para una fecha (opcional)", fDateHelp: "Si eliges una fecha, esta entrada se muestra solo ese día (hora de Orlando). Sin fecha, entra en la rotación diaria.",
    fPos: "Orden", fPub: "Publicado (visible para las miembros)", bothLangs: "Completa español e inglés: cada texto debe existir en los dos idiomas.", needPublish: "Para publicar, completa afirmación, versículo y referencia en español e inglés.",
    dailyIntro: "Cada día a las 12:00 a. m. (hora de Orlando) la tarjeta cambia a la siguiente entrada publicada. Cada entrada incluye todo: afirmación, reverso, versículo, referencia y mensaje de hoy, siempre emparejados en ES/EN.",
    rotation: n => n + " publicadas en rotación", todayIs: "Hoy se muestra:",
    moodsIntro: "Edita cada meta y sus recomendaciones. Lo que dejes vacío usa el texto original (en gris). En «Recomendaciones» escribe una por línea: se alternan cada día. En «Pasos» escribe una línea por paso.",
    mLabel: "Nombre de la meta", mTitle: "Título de la respuesta", mText: "Recomendaciones (una por línea)", mSteps: "Mini reinicio: pasos (una línea por paso)", mAction: "Texto del botón", mReset: "Volver al original",
    m_energy: "Más energía", m_stress: "Menos estrés", m_sleep: "Dormir mejor", m_eat: "Comer mejor", m_move: "Mover mi cuerpo", m_peace: "Necesito paz",
    rIntro: "Una tarjeta que se voltea en el Rincón Matcha & Arte. Al frente: título y adelanto. Atrás: tu receta (imagen ya terminada y texto corto).",
    rTitle: "Título", rTeaser: "Adelanto (frente)", rText: "Texto corto (reverso)", rImage: "Imagen de la receta (reverso)", rLink: "Enlace a la receta completa (opcional)", rRemove: "Quitar receta", rPub: "Publicada (visible para las miembros)",
    imgReplace: "Subir o cambiar imagen", imgNote: "Se muestra completa, sin recortar ni deformar.",
    talkIntro: "La pregunta de la tarjeta «Hablemos» en Inicio. Cámbiala cada semana (o cada día). Si no publicas nada, se usan las preguntas de siempre, que rotan solas.", tqTitle: "Título corto (opcional)", tqBody: "Pregunta", tqPub: "Publicada (reemplaza la pregunta automática)", tqReset: "Volver a las preguntas automáticas",
    dykIntro: "Datos breves que rotan cada día en Inicio. Escribe español e inglés.", dTitle: "Título (opcional)", dBody: "Dato",
    travelIntro: "Los dos espacios «Próximamente» y el mensaje de anuncio de Viajes. Vacío = texto original. Si ya hay una experiencia publicada, el espacio libre usa el Espacio 1.",
    slotN: n => "Espacio " + n, sLabel: "Etiqueta (ej. Próximamente)", sTitle: "Destino o titular", sImage: "Imagen promocional (opcional)",
    tvTeaser: "Mensaje de anuncio (Inicio y Viajes)", cHomeExpSoon: "Titular", cHomeExpSoonP: "Texto", cStoryT: "Promesa: titular", cStoryP: "Promesa: texto"
  },
  en: {
    tDaily: "Code for Today", tMoods: "Wellness goals", tRecipe: "Recipe of the Month", tDyk: "Did You Know?", tTalk: "Let's Talk", tTravel: "Travel: coming soon",
    save: "Save", cancel: "Cancel", edit: "Edit", del: "Delete", publish: "Publish", unpublish: "Unpublish", preview: "Preview", hidePreview: "Hide preview",
    published: "Published", draft: "Draft", today: "Today", scheduled: "Scheduled", saved: "Saved.", saveFail: "Couldn't save. Please try again.", loadFail: "Couldn't load.",
    confirmDel: "Delete this entry? This can't be undone.", confirmReset: "Remove this customization and go back to the original text?", up: "Move up", down: "Move down", empty: "No entries yet.",
    newEntry: "+ New entry", fAff: "Affirmation (front of the card)", fBack: "Theme or title (back)", fVerse: "Bible verse", fRef: "Bible reference", fMsg: "Today's Message",
    fMsgHelp: "Optional. If empty, the general message from “Images & texts” is used.", fDate: "Schedule for a date (optional)", fDateHelp: "With a date, this entry shows only that day (Orlando time). Without one, it joins the daily rotation.",
    fPos: "Order", fPub: "Published (visible to members)", bothLangs: "Complete Spanish and English: every text must exist in both languages.", needPublish: "To publish, complete the affirmation, verse and reference in Spanish and English.",
    dailyIntro: "Every day at 12:00 AM (Orlando time) the card moves to the next published entry. Each entry holds everything: affirmation, back, verse, reference and Today's Message, always matched in ES/EN.",
    rotation: n => n + " published in rotation", todayIs: "Showing today:",
    moodsIntro: "Edit each goal and its recommendations. Anything left empty uses the original text (shown in grey). In “Recommendations” write one per line: they alternate daily. In “Steps” write one line per step.",
    mLabel: "Goal name", mTitle: "Answer title", mText: "Recommendations (one per line)", mSteps: "Mini reset: steps (one line per step)", mAction: "Button text", mReset: "Back to original",
    m_energy: "More energy", m_stress: "Less stress", m_sleep: "Sleep better", m_eat: "Eat better", m_move: "Move my body", m_peace: "I need peace",
    rIntro: "A flip card on the Matcha & Art Corner. Front: title and teaser. Back: your recipe (a finished image and short text).",
    rTitle: "Title", rTeaser: "Teaser (front)", rText: "Short text (back)", rImage: "Recipe image (back)", rLink: "Link to the full recipe (optional)", rRemove: "Remove recipe", rPub: "Published (visible to members)",
    imgReplace: "Upload or replace image", imgNote: "Shown whole, never cropped or stretched.",
    talkIntro: "The question on the “Let's Talk” card on Home. Change it every week (or every day). If nothing is published, the usual questions are used and rotate on their own.", tqTitle: "Short title (optional)", tqBody: "Question", tqPub: "Published (replaces the automatic question)", tqReset: "Back to the automatic questions",
    dykIntro: "Short facts that rotate daily on Home. Write Spanish and English.", dTitle: "Title (optional)", dBody: "Fact",
    travelIntro: "The two “Coming soon” spaces and the announcement message on Travel. Empty = original text. If one experience is already published, the free space uses Space 1.",
    slotN: n => "Space " + n, sLabel: "Label (e.g. Coming soon)", sTitle: "Destination or headline", sImage: "Promo image (optional)",
    tvTeaser: "Announcement message (Home and Travel)", cHomeExpSoon: "Headline", cHomeExpSoonP: "Text", cStoryT: "Promise: headline", cStoryP: "Promise: text"
  }
};
let C = null, K = null;
const tx = k => { const v = (T[C.lang()] || T.es)[k]; return v === undefined ? k : v; };
const el = (...a) => C.el(...a);
const now = () => new Date().toISOString();
const orl = () => (window.CMLDaily ? window.CMLDaily.orlandoToday() : new Date().toISOString().slice(0, 10));

// ----- small form helpers -----
const field = (label, node, help) => el("label", {}, label, node, help ? el("small", { class: "small-note", text: help }) : null);
function pair(label, key, data, opts) {
  const o = opts || {};
  const mk = lang => { const n = el(o.line ? "input" : "textarea", o.line ? { type: "text", maxlength: o.max || 600 } : { rows: o.rows || 3 }); if (o.ph) n.placeholder = o.ph(lang) || ""; n.value = data[key + "_" + lang] || ""; n.setAttribute("aria-label", label + " (" + lang.toUpperCase() + ")"); n.dataset.f = key + "_" + lang; return n; };
  const es = mk("es"), en = mk("en");
  return { es, en, node: el("div", { class: "rf-pair" }, el("b", { text: label }), el("div", { class: "ac-two" }, el("label", {}, el("small", { text: "Español" }), es), el("label", {}, el("small", { text: "English" }), en))),
    val: () => ({ [key + "_es"]: es.value.trim(), [key + "_en"]: en.value.trim() }) };
}
const half = p => { const v = p.val(); const [a, b] = Object.values(v); return !!a !== !!b; };       // only one language filled
const full = p => { const [a, b] = Object.values(p.val()); return !!a && !!b; };
const confirmed = text => window.confirm(text);
async function settingsMap() {
  const r = await C.db.from("settings").select("key,value");
  if (r.error) throw r.error;
  const m = {}; (r.data || []).forEach(x => { m[x.key] = x.value; }); return m;
}
async function putSetting(key, value) {
  const w = value === null ? await C.db.from("settings").delete().eq("key", key)
    : await C.db.from("settings").upsert({ key, value, updated_at: now() }, { onConflict: "key" });
  if (w.error) throw w.error;
  await C.refreshPublic();
}
const feedbackNode = () => el("p", { class: "form-feedback", role: "alert", hidden: true });
const say = (n, text) => { n.hidden = !text; n.textContent = text || ""; };

// ----- generic list+form for the two tables -----
function tableEditor(cfg) {
  let editing = null, open = new Set();
  const wrap = el("div", { class: "ac-wrap" });
  const arrow = (sym, label, fn) => { const b = K.button(sym, "secondary", fn); b.setAttribute("aria-label", label); return b; };
  const reload = async () => {
    const r = await C.db.from(cfg.table).select("*").order("position", { ascending: true });
    if (r.error) { wrap.replaceChildren(el("p", { class: "form-feedback", text: tx("loadFail") })); return; }
    paint(r.data || []);
  };
  const paint = rows => {
    if (editing) return paintForm(rows);
    const nodes = [el("p", { class: "small-note", text: cfg.intro() })];
    if (cfg.status) nodes.push(el("p", { class: "small-note", text: cfg.status(rows) }));
    nodes.push(el("div", { class: "admin-bar" }, K.button(tx("newEntry"), "primary", () => { editing = { row: null, pos: (rows.reduce((m, x) => Math.max(m, x.position || 0), 0) || 0) + 1 }; paint(rows); })));
    if (!rows.length) nodes.push(el("p", { class: "small-note", text: tx("empty") }));
    const list = el("div", { class: "ac-list" });
    rows.forEach((row, i) => {
      const badges = [el("span", { class: "badge" + (row.published ? " live" : ""), text: row.published ? tx("published") : tx("draft") })];
      (cfg.badges ? cfg.badges(row, rows) : []).forEach(b => badges.push(el("span", { class: "badge", text: b })));
      const item = el("div", { class: "admin-item ac-row" + (cfg.isToday && cfg.isToday(row, rows) ? " is-today" : ""), "data-id": row.id },
        el("div", {}, ...badges), el("b", { text: cfg.title(row) || "—" }), el("p", { class: "small-note", text: cfg.sub(row) }));
      if (open.has(row.id)) item.appendChild(cfg.preview(row));
      const swap = async dir => {
        const o = rows[i + dir]; if (!o) return;
        const a1 = await C.db.from(cfg.table).update({ position: o.position }).eq("id", row.id);
        const a2 = await C.db.from(cfg.table).update({ position: row.position }).eq("id", o.id);
        if (a1.error || a2.error) return K.toast(tx("saveFail"));
        await after(); reload();
      };
      item.appendChild(el("div", { class: "actions" },
        K.button(tx("edit"), "", () => { editing = { row }; paint(rows); }),
        K.button(open.has(row.id) ? tx("hidePreview") : tx("preview"), "secondary", () => { open.has(row.id) ? open.delete(row.id) : open.add(row.id); paint(rows); }),
        K.button(row.published ? tx("unpublish") : tx("publish"), "", async () => {
          if (!row.published && !cfg.canPublish(row)) return K.toast(tx("needPublish"));
          const w = await C.db.from(cfg.table).update({ published: !row.published }).eq("id", row.id);
          if (w.error) return K.toast(tx("saveFail"));
          await after(); K.toast(tx("saved")); reload();
        }),
        i > 0 ? arrow("↑", tx("up"), () => swap(-1)) : null, i < rows.length - 1 ? arrow("↓", tx("down"), () => swap(1)) : null,
        K.button(tx("del"), "danger", async () => {
          if (!confirmed(tx("confirmDel"))) return;
          const w = await C.db.from(cfg.table).delete().eq("id", row.id);
          if (w.error) return K.toast(tx("saveFail"));
          await after(); K.toast(tx("saved")); reload();
        })));
      list.appendChild(item);
    });
    nodes.push(list);
    wrap.replaceChildren(...nodes);
  };
  const after = async () => { if (cfg.afterSave) await cfg.afterSave(); };
  const paintForm = rows => {
    const d = editing.row || {};
    const parts = cfg.fields(d);
    const pos = el("input", { type: "number", min: 0, value: String(editing.row ? d.position : editing.pos) });
    const pub = el("input", { type: "checkbox" }); pub.checked = !!d.published;
    const date = cfg.hasDate ? el("input", { type: "date", value: d.publish_on || "" }) : null;
    const fb = feedbackNode();
    const save = K.button(tx("save"), "primary", async () => {
      say(fb, "");
      const payload = Object.assign({}, ...parts.filter(p => p.val).map(p => p.val()), { position: parseInt(pos.value, 10) || 0, published: pub.checked });
      if (date) payload.publish_on = date.value || null;
      if (parts.some(p => p.val && half(p))) return say(fb, tx("bothLangs"));
      if (pub.checked && !cfg.canPublish(payload)) return say(fb, tx("needPublish"));
      save.disabled = true;
      const w = editing.row ? await C.db.from(cfg.table).update(payload).eq("id", d.id) : await C.db.from(cfg.table).insert(payload);
      save.disabled = false;
      if (w.error) { console.error(w.error); return say(fb, tx("saveFail")); }
      await after(); K.toast(tx("saved")); editing = null; reload();
    });
    wrap.replaceChildren(el("div", { class: "admin-form" },
      ...parts.map(p => p.node),
      date ? field(tx("fDate"), date, tx("fDateHelp")) : null,
      field(tx("fPos"), pos),
      el("label", { class: "check" }, pub, tx("fPub")), fb,
      el("div", { class: "admin-bar" }, save, K.button(tx("cancel"), "secondary", () => { editing = null; reload(); }))));
  };
  reload();
  return wrap;
}

// ----- Your Code for Today -----
const L = (r, k) => (r[k + "_" + C.lang()] || r[k + "_" + (C.lang() === "es" ? "en" : "es")] || "");
function dailyTab() {
  const D = window.CMLDaily;
  return tableEditor({
    table: "daily_codes",
    intro: () => tx("dailyIntro"),
    status: rows => {
      const hit = D && D.pickEntry(rows, orl());
      const pool = rows.filter(r => r.published && !r.publish_on).length;
      return tx("rotation")(pool) + (hit ? " · " + tx("todayIs") + " “" + L(hit.row, "aff").slice(0, 60) + "”" : "");
    },
    isToday: (row, rows) => { const h = D && D.pickEntry(rows, orl()); return !!h && h.row.id === row.id; },
    badges: (row, rows) => [row.publish_on ? tx("scheduled") + " " + row.publish_on : null, (D && D.pickEntry(rows, orl()) || {}).row === row ? tx("today") : null].filter(Boolean),
    title: row => L(row, "aff"), sub: row => [L(row, "ref"), L(row, "back")].filter(Boolean).join(" · "),
    hasDate: true,
    canPublish: r => !!(r.aff_es && r.aff_en && r.verse_es && r.verse_en && r.ref_es && r.ref_en),
    afterSave: async () => { if (D) await D.reload(); },
    fields: d => [pair(tx("fAff"), "aff", d, { rows: 2 }), pair(tx("fBack"), "back", d, { rows: 3 }),
      pair(tx("fVerse"), "verse", d, { rows: 3 }), pair(tx("fRef"), "ref", d, { line: true, max: 80 }),
      Object.assign(pair(tx("fMsg") + " — " + tx("fMsgHelp"), "msg", d, { rows: 2 }), {})],
    preview: row => el("div", { class: "ac-pre" },
      ...["es", "en"].map(l => el("div", {}, el("small", { text: l.toUpperCase() }), el("b", { text: row["aff_" + l] || "—" }),
        el("span", { text: row["back_" + l] || "" }), el("i", { text: row["verse_" + l] ? "“" + row["verse_" + l] + "” — " + (row["ref_" + l] || "") : "" }),
        row["msg_" + l] ? el("small", { text: "✦ " + row["msg_" + l] }) : null)))
  });
}

// ----- Did You Know? -----
function dykTab() {
  return tableEditor({
    table: "did_you_know", intro: () => tx("dykIntro"),
    title: row => L(row, "title") || L(row, "body").slice(0, 70), sub: row => L(row, "body").slice(0, 120),
    canPublish: r => !!(r.body_es && r.body_en),
    afterSave: async () => { if (window.CMLFeatured) await window.CMLFeatured.loadFacts(); },
    fields: d => [pair(tx("dTitle"), "title", d, { line: true, max: 120 }), pair(tx("dBody"), "body", d, { rows: 4 })],
    preview: row => el("div", { class: "ac-pre" }, ...["es", "en"].map(l => el("div", {}, el("small", { text: "✦ " + l.toUpperCase() }), row["title_" + l] ? el("b", { text: row["title_" + l] }) : null, el("span", { text: row["body_" + l] || "" }))))
  });
}

// ----- Wellness goals (settings.wellness_moods) -----
async function moodsTab() {
  const cfg = (await settingsMap()).wellness_moods || {};
  const R = window.CMLRedesign, wrap = el("div", { class: "admin-form" }, el("p", { class: "small-note", text: tx("moodsIntro") }));
  const forms = {};
  (R ? R.MOODS : []).forEach(k => {
    const cur = cfg[k] || {};
    const ph = (field_, lang) => R.moodDefaults(k, lang)[field_];
    const rows = [pair(tx("mLabel"), "label", cur, { line: true, max: 40, ph: l => ph("label", l) }),
      pair(tx("mTitle"), "title", cur, { line: true, max: 80, ph: l => ph("title", l) }),
      pair(tx("mText"), "text", cur, { rows: 4, ph: l => ph("text", l) }),
      pair(tx("mSteps"), "steps", cur, { rows: 4, ph: l => ph("steps", l) }),
      pair(tx("mAction"), "action", cur, { line: true, max: 60, ph: l => ph("action", l) })];
    forms[k] = rows;
    const fb = feedbackNode();
    wrap.appendChild(el("details", { class: "rf-group", "data-mood": k }, el("summary", { text: tx("m_" + k) + (Object.keys(cur).length ? " ✓" : "") }),
      ...rows.map(r => r.node), fb,
      el("div", { class: "admin-bar" },
        K.button(tx("save"), "primary", async () => {
          const value = Object.assign({}, ...rows.map(r => r.val()));
          if (rows.some(half)) return say(fb, tx("bothLangs"));
          const clean = Object.fromEntries(Object.entries(value).filter(([, v]) => v));
          try { await K.setMap("wellness_moods", k, Object.keys(clean).length ? clean : null); } catch (e) { console.error(e); return say(fb, tx("saveFail")); }
          K.toast(tx("saved"));
        }),
        K.button(tx("mReset"), "secondary", async () => {
          if (!confirmed(tx("confirmReset"))) return;
          try { await K.setMap("wellness_moods", k, null); } catch { return say(fb, tx("saveFail")); }
          rows.forEach(r => { r.es.value = ""; r.en.value = ""; }); K.toast(tx("saved"));
        }))));
  });
  return wrap;
}

// ----- Recipe of the Month (settings.recipe_month) -----
async function recipeTab() {
  const cur = (await settingsMap()).recipe_month || {};
  const title = pair(tx("rTitle"), "title", cur, { line: true, max: 100 }), teaser = pair(tx("rTeaser"), "teaser", cur, { rows: 2 }), text = pair(tx("rText"), "text", cur, { rows: 5 });
  const pick = K.imagePicker(cur.image || "");
  const link = el("input", { type: "url", placeholder: "https://…", value: cur.link || "", inputmode: "url" });
  const pub = el("input", { type: "checkbox" }); pub.checked = !!cur.published;
  const fb = feedbackNode();
  const collect = () => Object.assign({}, title.val(), teaser.val(), text.val(), { image: pick.value, link: link.value.trim(), published: pub.checked });
  const prev = el("div", { class: "ac-pre", hidden: true });
  const form = el("div", { class: "admin-form" }, el("p", { class: "small-note", text: tx("rIntro") }),
    title.node, teaser.node, text.node,
    el("div", {}, el("b", { text: tx("rImage") }), el("p", { class: "small-note", text: tx("imgNote") }), pick.node),
    field(tx("rLink"), link), el("label", { class: "check" }, pub, tx("rPub")), fb, prev,
    el("div", { class: "admin-bar" },
      K.button(tx("save"), "primary", async () => {
        say(fb, ""); const v = collect();
        if ([title, teaser, text].some(half)) return say(fb, tx("bothLangs"));
        if ((v.image && !C.safeUrl(v.image)) || (v.link && !C.safeUrl(v.link))) return say(fb, K.a("badUrl"));
        if (v.published && !(v.title_es && v.title_en)) return say(fb, tx("needPublish"));
        try { await putSetting("recipe_month", v); } catch (e) { console.error(e); return say(fb, tx("saveFail")); }
        K.toast(tx("saved"));
      }),
      K.button(tx("preview"), "secondary", () => {
        const v = collect(); prev.hidden = false;
        prev.replaceChildren(...["es", "en"].map(l => el("div", {}, el("small", { text: l.toUpperCase() }), el("b", { text: v["title_" + l] || "—" }), el("span", { text: v["teaser_" + l] || "" }),
          C.safeUrl(v.image) ? el("img", { src: C.safeUrl(v.image), alt: "" }) : null, el("span", { text: v["text_" + l] || "" }))));
      }),
      K.button(tx("rRemove"), "danger", async () => {
        if (!confirmed(tx("confirmDel"))) return;
        try { await putSetting("recipe_month", null); } catch { return say(fb, tx("saveFail")); }
        K.toast(tx("saved")); K.rerender();
      })));
  return form;
}

// ----- Let's Talk weekly question (settings.talk_prompt; empty/unpublished = built-in rotation) -----
async function talkTab() {
  const cur = (await settingsMap()).talk_prompt || {};
  const title = pair(tx("tqTitle"), "title", cur, { line: true, max: 80 }), body = pair(tx("tqBody"), "body", cur, { rows: 3 });
  const pub = el("input", { type: "checkbox" }); pub.checked = !!cur.published;
  const fb = feedbackNode();
  return el("div", { class: "admin-form" }, el("p", { class: "small-note", text: tx("talkIntro") }),
    title.node, body.node, el("label", { class: "check" }, pub, tx("tqPub")), fb,
    el("div", { class: "admin-bar" },
      K.button(tx("save"), "primary", async () => {
        say(fb, ""); const v = Object.assign({}, title.val(), body.val(), { published: pub.checked });
        if (half(body)) return say(fb, tx("bothLangs"));
        if (v.published && !(v.body_es && v.body_en)) return say(fb, tx("bothLangs"));
        try { await putSetting("talk_prompt", v); } catch (e) { console.error(e); return say(fb, tx("saveFail")); }
        K.toast(tx("saved"));
      }),
      K.button(tx("tqReset"), "danger", async () => {
        if (!confirmed(tx("confirmReset"))) return;
        try { await putSetting("talk_prompt", null); } catch { return say(fb, tx("saveFail")); }
        K.toast(tx("saved")); K.rerender();
      })));
}

// ----- Travel placeholders + announcement (settings.travel_slots, settings.copy) -----
async function travelTab() {
  const cfg = await settingsMap();
  const slots = Array.isArray(cfg.travel_slots) ? cfg.travel_slots : [];
  const copy = cfg.copy || {};
  const wrap = el("div", { class: "admin-form" }, el("p", { class: "small-note", text: tx("travelIntro") }));
  const defs = lang => { const d = (window.CMLExp && window.CMLExp.defaults && window.CMLExp.defaults[lang]) || {}; return { label: d.storySoon || "", title: d.storySoonT || "" }; };
  const slotForms = [0, 1].map(i => {
    const cur = slots[i] || {};
    const label = pair(tx("sLabel"), "label", cur, { line: true, max: 40, ph: l => defs(l).label }), title = pair(tx("sTitle"), "title", cur, { line: true, max: 100, ph: l => defs(l).title });
    const pick = K.imagePicker(cur.image || "");
    wrap.appendChild(el("details", { class: "rf-group", open: !!(cur.title_es || cur.title_en || cur.image) }, el("summary", { text: tx("slotN")(i + 1) }), label.node, title.node,
      el("div", {}, el("b", { text: tx("sImage") }), el("p", { class: "small-note", text: tx("imgNote") }), pick.node)));
    return { label, title, pick };
  });
  const keys = ["homeExpSoon", "homeExpSoonP", "storyT", "storyP"];
  const copyPairs = keys.map(k => {
    const cur = { ["v_es"]: (copy[k] || {}).es || "", ["v_en"]: (copy[k] || {}).en || "" };
    const p = pair(tx("c" + k.charAt(0).toUpperCase() + k.slice(1)), "v", cur, { rows: k.endsWith("P") || k === "storyP" ? 3 : 2, ph: l => (C.copyDefault(l, k) || "") });
    return { k, p };
  });
  wrap.appendChild(el("h3", { class: "admin-sec-h", text: tx("tvTeaser") }));
  copyPairs.forEach(x => wrap.appendChild(x.p.node));
  const fb = feedbackNode(); wrap.appendChild(fb);
  wrap.appendChild(el("div", { class: "admin-bar" }, K.button(tx("save"), "primary", async () => {
    say(fb, "");
    if (slotForms.some(f => half(f.label) || half(f.title)) || copyPairs.some(x => half(x.p))) return say(fb, tx("bothLangs"));
    if (slotForms.some(f => f.pick.value && !C.safeUrl(f.pick.value))) return say(fb, K.a("badUrl"));
    try {
      const value = slotForms.map(f => Object.assign({}, f.label.val(), f.title.val(), { image: f.pick.value }));
      const empty = value.every(v => !v.label_es && !v.label_en && !v.title_es && !v.title_en && !v.image);
      const w = empty ? await C.db.from("settings").delete().eq("key", "travel_slots") : await C.db.from("settings").upsert({ key: "travel_slots", value, updated_at: now() }, { onConflict: "key" });
      if (w.error) throw w.error;
      const nextCopy = Object.assign({}, copy);
      copyPairs.forEach(x => { const v = x.p.val(); const es = v.v_es, en = v.v_en; if (es || en) nextCopy[x.k] = { es, en }; else delete nextCopy[x.k]; });
      const w2 = Object.keys(nextCopy).length ? await C.db.from("settings").upsert({ key: "copy", value: nextCopy, updated_at: now() }, { onConflict: "key" }) : await C.db.from("settings").delete().eq("key", "copy");
      if (w2.error) throw w2.error;
      await C.refreshPublic();
    } catch (e) { console.error(e); return say(fb, tx("saveFail")); }
    K.toast(tx("saved"));
  })));
  return wrap;
}

function init() {
  C = window.CML; const A = window.CMLAdmin;
  if (!C || !A || !A.registerTab) return;
  const base = A.kit();
  K = Object.assign({}, base, { setMap: async (key, id, value) => { await A.setMapEntry(key, id, value); await C.refreshPublic(); } });
  const lab = (es, en) => ({ es, en });
  A.registerTab("daily", { group: "content", label: lab(T.es.tDaily, T.en.tDaily), render: async () => dailyTab() });
  A.registerTab("moods", { group: "content", label: lab(T.es.tMoods, T.en.tMoods), render: async () => moodsTab() });
  A.registerTab("recipe", { group: "content", label: lab(T.es.tRecipe, T.en.tRecipe), render: async () => recipeTab() });
  A.registerTab("dyk", { group: "content", label: lab(T.es.tDyk, T.en.tDyk), render: async () => dykTab() });
  A.registerTab("talk", { group: "content", label: lab(T.es.tTalk, T.en.tTalk), render: async () => talkTab() });
  A.registerTab("travelx", { group: "content", label: lab(T.es.tTravel, T.en.tTravel), render: async () => travelTab() });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
