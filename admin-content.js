// Admin → content editors added for the expansion: Your Code for Today, wellness goals, Recipe of the Month,
// Did You Know?, and the Travel "coming soon" placeholders. Everything here is CONTENT only (no layout, colors or fonts).
// Allowed for the owner, the administrator and content administrators; the database enforces it (RLS), not just this screen.
(function () {
"use strict";
const T = {
  es: {
    tDaily: "Código de hoy", tMoods: "Metas de bienestar", tRecipe: "Receta del mes", tDyk: "¿Sabías que?", tTalk: "Hablemos", tTravel: "Viajes: próximamente", tPod: "Podcast", tCodeMsgs: "Frases de los códigos", tHelp: "Líneas de ayuda",
    save: "Guardar", cancel: "Cancelar", edit: "Editar", del: "Eliminar", publish: "Publicar", unpublish: "Despublicar", preview: "Vista previa", hidePreview: "Ocultar vista previa",
    published: "Publicado", draft: "Borrador", today: "Hoy", scheduled: "Programado", saved: "Guardado.", saveFail: "No se pudo guardar. Inténtalo de nuevo.", loadFail: "No se pudo cargar.",
    confirmDel: "¿Eliminar esta entrada? No se puede deshacer.", confirmReset: "¿Quitar esta personalización y volver al texto original?", up: "Subir", down: "Bajar", empty: "Todavía no hay entradas.",
    newEntry: "+ Nueva entrada", fAff: "Afirmación (frente de la tarjeta)", fBack: "Tema o título (reverso)", fVerse: "Versículo", fRef: "Referencia bíblica", fMsg: "Mensaje de hoy",
    fMsgHelp: "Opcional. Si lo dejas vacío se usa el mensaje general de «Imágenes y textos».", fDate: "Programar para una fecha (opcional)", fDateHelp: "Si eliges una fecha, esta entrada se muestra solo ese día (hora de Orlando). Sin fecha, entra en la rotación diaria.",
    fPos: "Orden", fPub: "Publicado (visible para las miembros)", bothLangs: "Completa español e inglés: cada texto debe existir en los dos idiomas.", needPublish: "Para publicar, completa afirmación, versículo y referencia en español e inglés.",
    dailyIntro: "Cada día a las 12:00 a. m. (hora de Orlando) la tarjeta cambia a la siguiente entrada publicada. Cada entrada incluye todo: afirmación, reverso, versículo, referencia y mensaje de hoy, siempre emparejados en ES/EN.",
    rotation: n => n + " publicadas en rotación", todayIs: "Hoy se muestra:",
    moodsIntro: "Edita cada meta y sus recomendaciones. Lo que dejes vacío usa el texto original (en gris). En «Recomendaciones» escribe una por línea: se alternan cada día. En «Pasos» escribe una línea por paso.",
    mLabel: "Nombre de la meta", mTitle: "Título de la respuesta", mText: "Recomendaciones (una por línea)", mSteps: "Mini reinicio: pasos (una línea por paso)", mAction: "Texto del botón", mGo: "¿A dónde lleva el botón?", go_: "Lo original de esta meta", go_events: "Descubre (happy hours, restaurantes y wellness)", go_agenda: "Eventos y promociones (de pago)", go_spas: "Los spas y planes de bienestar (esta página)", go_reads: "Las lecturas de bienestar (esta página)", go_podcast: "El podcast de bienestar (esta página)", go_support: "Apoyo", go_home: "Inicio (Código de hoy)", go_travel: "Código Experiencias", mReset: "Volver al original",
    m_energy: "Más energía", m_stress: "Menos estrés", m_sleep: "Dormir mejor", m_eat: "Comer mejor", m_move: "Mover mi cuerpo", m_peace: "Necesito paz",
    rIntro: "Una tarjeta que se voltea en el Rincón Matcha & Arte. Al frente: título y adelanto. Atrás: tu receta (imagen ya terminada y texto corto).",
    rTitle: "Título", rTeaser: "Adelanto (frente)", rText: "Texto corto (reverso)", rImage: "Imagen de la receta (reverso)", rLink: "Enlace a la receta completa (opcional)", rRemove: "Quitar receta", rPub: "Publicada (visible para las miembros)",
    imgReplace: "Subir o cambiar imagen", imgNote: "Se muestra completa, sin recortar ni deformar.",
    talkIntro: "La pregunta de la tarjeta «Hablemos» en Inicio. Cámbiala cada semana (o cada día). Si no publicas nada, se usan las preguntas de siempre, que rotan solas.", tqTitle: "Título corto (opcional)", tqBody: "Pregunta", tqPub: "Publicada (reemplaza la pregunta automática)", tqReset: "Volver a las preguntas automáticas",
    dykIntro: "Datos breves que rotan cada día en Inicio. Escribe español e inglés.", dTitle: "Título (opcional)", dBody: "Dato",
    travelIntro: "Los dos espacios «Próximamente» y el mensaje de anuncio de Viajes. Vacío = texto original. Si ya hay una experiencia publicada, el espacio libre usa el Espacio 1.",
    slotN: n => "Espacio " + n, sLabel: "Etiqueta (ej. Próximamente)", sTitle: "Destino o titular", sImage: "Imagen promocional (opcional)",
    cmIntro: "Cada código tiene su frase de la semana. Escribe las tuyas en español e inglés y elige el mes. Si agregas varias para el mismo mes, rotan una por semana. Si un mes no tiene frase, se usa la de «Todos los meses»; si tampoco hay, se queda la frase original.",
    cmNow: "Frase original:", cmAdd: "+ Agregar frase", cmAllMonths: "Todos los meses", cmMonth: "Mes", cmRemove: "Quitar", cmCount: n => n ? n + (n === 1 ? " frase" : " frases") : "frase original",
    cmEs: "Español", cmEn: "English", cmReset: "Volver a las frases originales",
    podIntro: "Podcast «Entre Nosotras». Cada episodio vive en YouTube: pega aquí el enlace. Las integrantes lo ven en Inicio (el próximo o el más reciente) y en Bienestar (todos, con filtro por tema).", podNew: "+ Nuevo episodio", podTitle: "Título del episodio", podDesc: "Descripción corta (opcional)", podTopic: "Tema", podDate: "Fecha y día de estreno", podTime: "Hora (opcional)", podUrl: "Enlace de YouTube del episodio", podTeaser: "Enlace del adelanto de 15 segundos (opcional)", podPub: "Publicado (visible para las integrantes)", podRemove: "Quitar episodio", podBadUrl: "El enlace debe ser de YouTube.", podNeed: "Para publicar, completa el título en español e inglés, la fecha y el enlace de YouTube.", podEmpty: "Todavía no hay episodios. Toca «Nuevo episodio».", podEp: n => "Episodio " + n,
    helpIntro: "Los botones grandes de ayuda al final de la página de Apoyo. Cada ciudad tiene los suyos. Escribe el número y el nombre en español e inglés (hasta 4). Si dejas una ciudad vacía, se usan los números oficiales que ya vienen cargados (en gris). Verifica siempre cada número antes de guardarlo.",
    tCityList: "Mis ciudades", cityIntro: "Estas son las ciudades de la app: aparecen en el registro, en el botón de ciudad y al etiquetar contenido. Agrega la ciudad nueva, elige su país y guarda. Las líneas de ayuda de cada ciudad se editan en \"Líneas de ayuda\".", cityName: "Ciudad", cityCountry: "País", cityCO: "Colombia", cityUS: "Estados Unidos", cityOther: "Otro país", cityAdd: "+ Agregar ciudad", cityRemove: "Quitar", cityNone: "Deja al menos una ciudad.", cityDefault: "Volver a la lista original", cityPh: "Ej.: Cali",
    tFounder: "Mi bienvenida", founderIntro: "Este mensaje lo ve cada mujer, con tu foto, la primera vez que entra a la app. Cámbialo cuando quieras.", founderName: "Tu nombre", founderEs: "Mensaje en español", founderEn: "Mensaje en inglés", founderReset: "Volver al mensaje original",
    tTalkLib: "Hablemos: frases (lista)", talkLibIntro: "Pega aquí todas las frases de Hablemos, una por línea, así: Título ES | Pregunta ES | Title EN | Question EN. Rotan solas, una nueva cada 2 días. Si en inglés dejas vacío, se muestra el español. La pestaña \"Hablemos\" sigue sirviendo para fijar una pregunta especial por encima de la lista.", talkLibCount: n => n + " frases guardadas", talkLibBad: n => "Línea " + n + ": faltan el título o la pregunta en español.", talkLibClear: "Borrar la lista",
    tImport: "Importar lista", impIntro: "Pega una lista de lugares, uno por línea: Nombre | Dirección | Enlace | Descripción en español | Description in English. Solo el nombre es obligatorio. Se crean como borradores y los publicas con un botón.", impCity: "Ciudad", impAllCities: "Todas las ciudades", impType: "Tipo", impHappy: "Happy hour", impDine: "Restaurante", impSpa: "Spa o bienestar", impPublishNow: "Publicar de una vez (sin revisar)", impPaste: "Pega aquí la lista", impPreview: "Ver cómo quedará", impCreate: n => "Crear " + n + " lugares", impRows: n => n + " lugares listos", impNone: "No encontré ningún lugar en la lista.", impBadUrl: n => "Línea " + n + ": el enlace no es válido (debe empezar con https://).", impDone: n => "Listo: " + n + " lugares creados.", impPublishAll: "Publicar todos los que acabo de crear", impPublished: "Publicados.", impTooMany: "Máximo 100 por vez.",
    helpCity: "Ciudad", helpNum: "Número", helpLbl: "Nombre del botón", helpReset: "Volver a los números originales", helpLine: n => "Botón " + n, helpBad: "Revisa el número: solo dígitos, +, espacios o guiones.",
    tvTeaser: "Mensaje de anuncio (Inicio y Viajes)", cHomeExpSoon: "Titular", cHomeExpSoonP: "Texto", cStoryT: "Promesa: titular", cStoryP: "Promesa: texto"
  },
  en: {
    tDaily: "Code for Today", tMoods: "Wellness goals", tRecipe: "Recipe of the Month", tDyk: "Did You Know?", tTalk: "Let's Talk", tTravel: "Travel: coming soon", tPod: "Podcast", tCodeMsgs: "Code phrases", tHelp: "Help lines",
    save: "Save", cancel: "Cancel", edit: "Edit", del: "Delete", publish: "Publish", unpublish: "Unpublish", preview: "Preview", hidePreview: "Hide preview",
    published: "Published", draft: "Draft", today: "Today", scheduled: "Scheduled", saved: "Saved.", saveFail: "Couldn't save. Please try again.", loadFail: "Couldn't load.",
    confirmDel: "Delete this entry? This can't be undone.", confirmReset: "Remove this customization and go back to the original text?", up: "Move up", down: "Move down", empty: "No entries yet.",
    newEntry: "+ New entry", fAff: "Affirmation (front of the card)", fBack: "Theme or title (back)", fVerse: "Bible verse", fRef: "Bible reference", fMsg: "Today's Message",
    fMsgHelp: "Optional. If empty, the general message from “Images & texts” is used.", fDate: "Schedule for a date (optional)", fDateHelp: "With a date, this entry shows only that day (Orlando time). Without one, it joins the daily rotation.",
    fPos: "Order", fPub: "Published (visible to members)", bothLangs: "Complete Spanish and English: every text must exist in both languages.", needPublish: "To publish, complete the affirmation, verse and reference in Spanish and English.",
    dailyIntro: "Every day at 12:00 AM (Orlando time) the card moves to the next published entry. Each entry holds everything: affirmation, back, verse, reference and Today's Message, always matched in ES/EN.",
    rotation: n => n + " published in rotation", todayIs: "Showing today:",
    moodsIntro: "Edit each goal and its recommendations. Anything left empty uses the original text (shown in grey). In “Recommendations” write one per line: they alternate daily. In “Steps” write one line per step.",
    mLabel: "Goal name", mTitle: "Answer title", mText: "Recommendations (one per line)", mSteps: "Mini reset: steps (one line per step)", mAction: "Button text", mGo: "Where does the button go?", go_: "This goal's original", go_events: "Discover (happy hours, restaurants & wellness)", go_agenda: "Events & deals (paid)", go_spas: "Spas & wellness plans (this page)", go_reads: "Wellness reads (this page)", go_podcast: "Wellness podcast (this page)", go_support: "Support", go_home: "Home (Code for today)", go_travel: "Código Experiences", mReset: "Back to original",
    m_energy: "More energy", m_stress: "Less stress", m_sleep: "Sleep better", m_eat: "Eat better", m_move: "Move my body", m_peace: "I need peace",
    rIntro: "A flip card on the Matcha & Art Corner. Front: title and teaser. Back: your recipe (a finished image and short text).",
    rTitle: "Title", rTeaser: "Teaser (front)", rText: "Short text (back)", rImage: "Recipe image (back)", rLink: "Link to the full recipe (optional)", rRemove: "Remove recipe", rPub: "Published (visible to members)",
    imgReplace: "Upload or replace image", imgNote: "Shown whole, never cropped or stretched.",
    talkIntro: "The question on the “Let's Talk” card on Home. Change it every week (or every day). If nothing is published, the usual questions are used and rotate on their own.", tqTitle: "Short title (optional)", tqBody: "Question", tqPub: "Published (replaces the automatic question)", tqReset: "Back to the automatic questions",
    dykIntro: "Short facts that rotate daily on Home. Write Spanish and English.", dTitle: "Title (optional)", dBody: "Fact",
    travelIntro: "The two “Coming soon” spaces and the announcement message on Travel. Empty = original text. If one experience is already published, the free space uses Space 1.",
    slotN: n => "Space " + n, sLabel: "Label (e.g. Coming soon)", sTitle: "Destination or headline", sImage: "Promo image (optional)",
    cmIntro: "Each code has its phrase of the week. Write yours in Spanish and English and pick the month. If you add several for the same month they rotate, one per week. If a month has none, the “Every month” ones are used; if there are none either, the original phrase stays.",
    cmNow: "Original phrase:", cmAdd: "+ Add phrase", cmAllMonths: "Every month", cmMonth: "Month", cmRemove: "Remove", cmCount: n => n ? n + (n === 1 ? " phrase" : " phrases") : "original phrase",
    cmEs: "Español", cmEn: "English", cmReset: "Back to the original phrases",
    podIntro: "“Entre Nosotras” podcast. Every episode lives on YouTube: paste its link here. Members see it on Home (the next or latest one) and in Wellness (all of them, filtered by topic).", podNew: "+ New episode", podTitle: "Episode title", podDesc: "Short description (optional)", podTopic: "Topic", podDate: "Release date", podTime: "Time (optional)", podUrl: "YouTube link of the episode", podTeaser: "Link to the 15-second teaser (optional)", podPub: "Published (visible to members)", podRemove: "Remove episode", podBadUrl: "The link must be a YouTube link.", podNeed: "To publish, complete the title in Spanish and English, the date and the YouTube link.", podEmpty: "No episodes yet. Tap “New episode”.", podEp: n => "Episode " + n,
    helpIntro: "The big help buttons at the bottom of the Support page. Each city has its own. Type the number and the name in Spanish and English (up to 4). If a city is left empty, the built-in official numbers are used (shown in grey). Always verify each number before saving.",
    tCityList: "My cities", cityIntro: "These are the app's cities: they appear at sign-up, in the city button and when tagging content. Add the new city, choose its country and save. Each city's help lines are edited in \"Help lines\".", cityName: "City", cityCountry: "Country", cityCO: "Colombia", cityUS: "United States", cityOther: "Other country", cityAdd: "+ Add city", cityRemove: "Remove", cityNone: "Keep at least one city.", cityDefault: "Back to the original list", cityPh: "E.g.: Cali",
    tFounder: "My welcome", founderIntro: "Every woman sees this message, with your photo, the first time she enters the app. Change it whenever you like.", founderName: "Your name", founderEs: "Message in Spanish", founderEn: "Message in English", founderReset: "Back to the original message",
    tTalkLib: "Let's Talk: phrases (list)", talkLibIntro: "Paste all the Let's Talk phrases here, one per line: Title ES | Question ES | Title EN | Question EN. They rotate on their own, a new one every 2 days. If English is left empty, Spanish is shown. The \"Let's Talk\" tab can still pin one special question above the list.", talkLibCount: n => n + " phrases saved", talkLibBad: n => "Line " + n + ": the Spanish title or question is missing.", talkLibClear: "Clear the list",
    tImport: "Import list", impIntro: "Paste a list of places, one per line: Name | Address | Link | Description in Spanish | Description in English. Only the name is required. They are created as drafts and you publish them with one button.", impCity: "City", impAllCities: "All cities", impType: "Type", impHappy: "Happy hour", impDine: "Restaurant", impSpa: "Spa or wellness", impPublishNow: "Publish right away (no review)", impPaste: "Paste the list here", impPreview: "See how it will look", impCreate: n => "Create " + n + " places", impRows: n => n + " places ready", impNone: "I found no places in the list.", impBadUrl: n => "Line " + n + ": the link is not valid (it must start with https://).", impDone: n => "Done: " + n + " places created.", impPublishAll: "Publish all the ones I just created", impPublished: "Published.", impTooMany: "Maximum 100 at a time.",
    helpCity: "City", helpNum: "Number", helpLbl: "Button name", helpReset: "Back to the original numbers", helpLine: n => "Button " + n, helpBad: "Check the number: only digits, +, spaces or dashes.",
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
const confirmed = text => window.cmlConfirm(text);
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
          if (!await confirmed(tx("confirmDel"))) return;
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
    const goSel = el("select", {}, ...["", "spas", "reads", "podcast", "support", "home"].map(v => el("option", { value: v, text: tx("go_" + v) })));
    goSel.value = cur.go || "";
    rows.push({ node: el("label", { class: "field" }, el("span", { text: tx("mGo") }), goSel), val: () => (goSel.value ? { go: goSel.value } : {}), single: true, es: { value: "" }, en: { value: "" } });
    const fb = feedbackNode();
    wrap.appendChild(el("details", { class: "rf-group", "data-mood": k }, el("summary", { text: tx("m_" + k) + (Object.keys(cur).length ? " ✓" : "") }),
      ...rows.map(r => r.node), fb,
      el("div", { class: "admin-bar" },
        K.button(tx("save"), "primary", async () => {
          const value = Object.assign({}, ...rows.map(r => r.val()));
          if (rows.some(r => !r.single && half(r))) return say(fb, tx("bothLangs"));
          const clean = Object.fromEntries(Object.entries(value).filter(([, v]) => v));
          try { await K.setMap("wellness_moods", k, Object.keys(clean).length ? clean : null); } catch (e) { console.error(e); return say(fb, tx("saveFail")); }
          K.toast(tx("saved"));
        }),
        K.button(tx("mReset"), "secondary", async () => {
          if (!await confirmed(tx("confirmReset"))) return;
          try { await K.setMap("wellness_moods", k, null); } catch { return say(fb, tx("saveFail")); }
          rows.forEach(r => { r.es.value = ""; r.en.value = ""; }); goSel.value = ""; K.toast(tx("saved"));
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
        if (!await confirmed(tx("confirmDel"))) return;
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
        if (!await confirmed(tx("confirmReset"))) return;
        try { await putSetting("talk_prompt", null); } catch { return say(fb, tx("saveFail")); }
        K.toast(tx("saved")); K.rerender();
      })));
}

// ----- Podcast "Entre Nosotras" (settings.podcast = { episodes: [...] }) -----
async function podcastTab() {
  const cfg = (await settingsMap()).podcast || {};
  let eps = Array.isArray(cfg.episodes) ? cfg.episodes.slice() : [];
  const TOPICS = (window.CMLPodcast && window.CMLPodcast.TOPICS) || [];
  const topicName = k => (window.CMLPodcast ? window.CMLPodcast.topicLabel(k) : k);
  const wrap = el("div", { class: "admin-form" }, el("p", { class: "small-note", text: tx("podIntro") }));
  const list = el("div", { class: "pod-admin-list" });
  const fb = feedbackNode();
  const forms = [];
  const addForm = (cur, open) => {
    const id = cur.id || ("e" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5));
    const title = pair(tx("podTitle"), "title", cur, { line: true, max: 100 }), desc = pair(tx("podDesc"), "desc", cur, { rows: 2 });
    const topic = el("select", {}, ...TOPICS.map(k => el("option", { value: k, text: topicName(k) }))); topic.value = TOPICS.includes(cur.topic) ? cur.topic : (TOPICS[0] || "");
    const date = el("input", { type: "date", value: cur.date || "" }), time = el("input", { type: "time", value: cur.time || "" });
    const url = el("input", { type: "url", placeholder: "https://youtu.be/…", value: cur.url || "" }), teaser = el("input", { type: "url", placeholder: "https://youtube.com/shorts/…", value: cur.teaser || "" });
    const pub = el("input", { type: "checkbox" }); pub.checked = !!cur.published;
    const sum = el("summary", { text: (cur.title_es || cur.title_en || tx("podEp")(forms.length + 1)) + (cur.published ? "" : " · " + tx("draft")) });
    const box = el("details", { class: "rf-group", open: !!open }, sum, title.node, desc.node,
      el("div", { class: "ac-two" }, field(tx("podTopic"), topic), field(tx("podDate"), date)), el("div", { class: "ac-two" }, field(tx("podTime"), time), el("span", {})),
      field(tx("podUrl"), url), field(tx("podTeaser"), teaser), el("label", { class: "check" }, pub, tx("podPub")),
      K.button(tx("podRemove"), "danger", async () => { if (!await confirmed(tx("confirmDel"))) return; const i = forms.findIndex(f => f.id === id); if (i >= 0) forms.splice(i, 1); box.remove(); }));
    forms.push({ id, box, title, desc, topic, date, time, url, teaser, pub });
    list.appendChild(box);
  };
  eps.sort((a, b) => String(b.date || "").localeCompare(String(a.date || ""))).forEach(e => addForm(e, false));
  if (!eps.length) list.appendChild(el("p", { class: "small-note", id: "podEmptyNote", text: tx("podEmpty") }));
  wrap.append(list, K.button(tx("podNew"), "secondary", () => { const n = document.getElementById("podEmptyNote"); if (n) n.remove(); addForm({}, true); forms[forms.length - 1].box.scrollIntoView({ block: "center" }); }), fb,
    el("div", { class: "admin-bar" }, K.button(tx("save"), "primary", async () => {
      say(fb, "");
      const out = [];
      for (const f of forms) {
        const t = f.title.val(), d = f.desc.val();
        if (half(f.title) || half(f.desc)) return say(fb, tx("bothLangs"));
        const u = f.url.value.trim(), tz = f.teaser.value.trim();
        const okYt = v => !v || (window.CMLPodcast && window.CMLPodcast.ytId(v));
        if (!okYt(u) || !okYt(tz)) return say(fb, tx("podBadUrl"));
        if (f.pub.checked && !(t.title_es && t.title_en && f.date.value && u)) return say(fb, tx("podNeed"));
        if (!t.title_es && !t.title_en && !u) continue;
        out.push(Object.assign({ id: f.id, topic: f.topic.value, date: f.date.value, time: f.time.value, url: u, teaser: tz, published: f.pub.checked }, t, d));
      }
      try { await putSetting("podcast", out.length ? { episodes: out } : null); } catch (e) { console.error(e); return say(fb, tx("saveFail")); }
      K.toast(tx("saved"));
    })));
  return wrap;
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

// ----- Weekly code phrases (settings.code_msgs = { Code: [ { m: 0..12, es, en } ] }) -----
const CM_CODES = ["Social", "Wellness", "Connection", "Adventure", "Faith", "Family", "Recharge", "Support"];
async function codeMsgsTab() {
  const cfg = await settingsMap();
  const saved = cfg.code_msgs && typeof cfg.code_msgs === "object" ? cfg.code_msgs : {};
  const months = Array.from({ length: 12 }, (_, i) => { const n = new Date(2026, i, 1).toLocaleDateString(C.lang() === "en" ? "en-US" : "es-US", { month: "long" }); return n.charAt(0).toUpperCase() + n.slice(1); });
  const wrap = el("div", { class: "admin-form" }, el("p", { class: "small-note", text: tx("cmIntro") }));
  const blocks = CM_CODES.map(code => {
    const rows = [];
    const list = el("div", { class: "cm-list" });
    const counter = el("small", { class: "small-note" });
    const upd = () => { counter.textContent = tx("cmCount")(rows.length); };
    const addRow = (cur) => {
      const m = el("select", {}, el("option", { value: "0", text: tx("cmAllMonths") }), months.map((n, i) => el("option", { value: String(i + 1), text: n })));
      m.value = String((cur && cur.m) || 0);
      const es = el("textarea", { rows: 2, maxlength: 220 }); es.value = (cur && cur.es) || "";
      const en = el("textarea", { rows: 2, maxlength: 220 }); en.value = (cur && cur.en) || "";
      const box = el("div", { class: "rf-pair cm-row" }, el("label", {}, tx("cmMonth"), m),
        el("div", { class: "ac-two" }, el("label", {}, el("small", { text: tx("cmEs") }), es), el("label", {}, el("small", { text: tx("cmEn") }), en)));
      const row = { m, es, en, box };
      box.appendChild(K.button(tx("cmRemove"), "link-btn", () => { rows.splice(rows.indexOf(row), 1); box.remove(); upd(); }));
      rows.push(row); list.appendChild(box); upd();
    };
    (Array.isArray(saved[code]) ? saved[code] : []).forEach(addRow);
    const name = C.t("wcName_" + code);
    const det = el("details", { class: "rf-group", open: rows.length > 0 }, el("summary", { text: name }), counter,
      el("p", { class: "small-note", text: tx("cmNow") + " " + C.t("wcMsg_" + code) }), list,
      el("div", { class: "admin-bar" }, K.button(tx("cmAdd"), "secondary", () => addRow(null))));
    wrap.appendChild(det);
    return { code, rows };
  });
  const fb = feedbackNode(); wrap.appendChild(fb);
  wrap.appendChild(el("div", { class: "admin-bar" },
    K.button(tx("save"), "primary", async () => {
      say(fb, "");
      const out = {};
      for (const b of blocks) {
        const items = [];
        for (const r of b.rows) {
          const es = r.es.value.trim(), en = r.en.value.trim();
          if (!es && !en) continue;
          if (!es || !en) return say(fb, tx("bothLangs"));
          items.push({ m: parseInt(r.m.value, 10) || 0, es, en });
        }
        if (items.length) out[b.code] = items;
      }
      try { await putSetting("code_msgs", Object.keys(out).length ? out : null); } catch (e) { console.error(e); return say(fb, tx("saveFail")); }
      K.toast(tx("saved"));
    })));
  return wrap;
}

// ----- Help lines (settings.help_lines, per city) -----
async function helpTab() {
  const H = window.CMLHelp;
  const all = (await settingsMap()).help_lines || {};
  const cities = C.cities().map(c => [C.cityKey(c.name), c.name]);
  const sel = el("select", {}, ...cities.map(([k, n]) => el("option", { value: k, text: n })));
  const v = C.viewCity(); sel.value = cities.some(c => c[0] === v) ? v : "orlando";
  const box = el("div", {}), fb = feedbackNode();
  const wrap = el("div", { class: "admin-form" }, el("p", { class: "small-note", text: tx("helpIntro") }), field(tx("helpCity"), sel), box, fb);
  const draw = () => {
    say(fb, "");
    const city = sel.value, cur = Array.isArray(all[city]) ? all[city] : [], def = H ? H.defaults(city) : [];
    const rows = [0, 1, 2, 3].map(i => {
      const c = cur[i] || {}, d = def[i] || {};
      const num = el("input", { type: "text", inputmode: "tel", maxlength: 24, placeholder: d.num || "" }); num.value = c.num || "";
      const es = el("input", { type: "text", maxlength: 70, placeholder: d.es || "" }); es.value = c.es || "";
      const en = el("input", { type: "text", maxlength: 70, placeholder: d.en || "" }); en.value = c.en || "";
      return { num, es, en, node: el("div", { class: "rf-pair" }, el("b", { text: tx("helpLine")(i + 1) }),
        el("label", {}, el("small", { text: tx("helpNum") }), num),
        el("div", { class: "ac-two" }, el("label", {}, el("small", { text: "Español" }), es), el("label", {}, el("small", { text: "English" }), en))) };
    });
    const store = async list => {
      const next = Object.assign({}, all); if (list.length) next[city] = list; else delete next[city];
      await putSetting("help_lines", Object.keys(next).length ? next : null);
      Object.keys(all).forEach(k => delete all[k]); Object.assign(all, next);
      if (window.CMLFaith && window.CMLFaith.renderSafety) window.CMLFaith.renderSafety();
    };
    box.replaceChildren(...rows.map(r => r.node), el("div", { class: "admin-bar" },
      K.button(tx("save"), "primary", async () => {
        const list = [];
        for (const r of rows) {
          const num = r.num.value.trim(); if (!num && !r.es.value.trim() && !r.en.value.trim()) continue;
          if (!H || !H.cleanNum(num) || /[^0-9+*#\s().-]/.test(num)) return say(fb, tx("helpBad"));
          const es = r.es.value.trim(), en = r.en.value.trim();
          if (!es && !en) return say(fb, tx("bothLangs"));
          list.push({ num, es: es || en, en: en || es });
        }
        try { await store(list); } catch (e) { console.error(e); return say(fb, tx("saveFail")); }
        K.toast(tx("saved"));
      }),
      K.button(tx("helpReset"), "secondary", async () => {
        if (!await confirmed(tx("confirmReset"))) return;
        try { await store([]); } catch { return say(fb, tx("saveFail")); }
        draw(); K.toast(tx("saved"));
      })));
  };
  sel.addEventListener("change", draw); draw();
  return wrap;
}

// ----- Let's Talk phrase library (settings.talk_library = [{es:[title,q], en:[title,q]}]; a new one every 2 days) -----
async function talkLibTab() {
  const cur = (await settingsMap()).talk_library;
  const list = Array.isArray(cur) ? cur : [];
  const area = el("textarea", { rows: 14, placeholder: "Gratitud | ¿Por qué estás agradecida hoy? | Gratitude | What are you grateful for today?" });
  area.value = list.map(x => [(x.es && x.es[0]) || "", (x.es && x.es[1]) || "", (x.en && x.en[0]) || "", (x.en && x.en[1]) || ""].join(" | ")).join("\n");
  const count = el("p", { class: "small-note", text: tx("talkLibCount")(list.length) }), fb = feedbackNode();
  const parse = () => {
    const out = []; const lines = area.value.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i].trim(); if (!raw) continue;
      const p = raw.split("|").map(x => x.trim());
      if (!p[0] || !p[1]) { say(fb, tx("talkLibBad")(i + 1)); return null; }
      out.push({ es: [p[0].slice(0, 80), p[1].slice(0, 300)], en: [(p[2] || "").slice(0, 80), (p[3] || "").slice(0, 300)] });
    }
    return out.slice(0, 200);
  };
  return el("div", { class: "admin-form" }, el("p", { class: "small-note", text: tx("talkLibIntro") }), area, count, fb,
    el("div", { class: "admin-bar" },
      K.button(tx("save"), "primary", async () => {
        say(fb, ""); const v = parse(); if (!v) return;
        try { await putSetting("talk_library", v.length ? v : null); } catch (e) { console.error(e); return say(fb, tx("saveFail")); }
        count.textContent = tx("talkLibCount")(v.length); K.toast(tx("saved"));
      }),
      K.button(tx("talkLibClear"), "danger", async () => {
        if (!await confirmed(tx("confirmReset"))) return;
        try { await putSetting("talk_library", null); } catch { return say(fb, tx("saveFail")); }
        area.value = ""; count.textContent = tx("talkLibCount")(0); K.toast(tx("saved"));
      })));
}

async function founderTab() {
  const cur = (await settingsMap()).founder_welcome || {};
  const D = (window.CMLWelcome && window.CMLWelcome.founderDefault) || { name: "", es: "", en: "" };
  const name = el("input", { type: "text", maxlength: 60 }), es = el("textarea", { rows: 7 }), en = el("textarea", { rows: 7 });
  const fill = v => { name.value = v.name || D.name; es.value = v.es || D.es; en.value = v.en || D.en; };
  fill(cur);
  const fb = feedbackNode();
  return el("div", { class: "admin-form" }, el("p", { class: "small-note", text: tx("founderIntro") }),
    el("label", {}, tx("founderName"), name), el("label", {}, tx("founderEs"), es), el("label", {}, tx("founderEn"), en), fb,
    el("div", { class: "admin-bar" },
      K.button(tx("save"), "primary", async () => {
        say(fb, "");
        try { await putSetting("founder_welcome", { name: name.value.trim().slice(0, 60), es: es.value.trim().slice(0, 900), en: en.value.trim().slice(0, 900) }); } catch (e) { console.error(e); return say(fb, tx("saveFail")); }
        K.toast(tx("saved"));
      }),
      K.button(tx("founderReset"), "danger", async () => {
        if (!await confirmed(tx("confirmReset"))) return;
        try { await putSetting("founder_welcome", null); } catch { return say(fb, tx("saveFail")); }
        fill({}); K.toast(tx("saved"));
      })));
}

// ----- Import a list of places (restaurants, happy hours, spas) as drafts in one go -----
let lastImport = null;
async function importTab() {
  const citySel = el("select", {}, el("option", { value: "", text: tx("impAllCities") }), ...C.cities().map(c => el("option", { value: c.name, text: c.name })));
  const cv = C.cityName ? C.cityName(C.viewCity()) : ""; if (cv) citySel.value = cv;
  const typeSel = el("select", {}, el("option", { value: "dining", text: tx("impDine") }), el("option", { value: "social", text: tx("impHappy") }), el("option", { value: "wellness", text: tx("impSpa") }));
  const area = el("textarea", { rows: 10, placeholder: "Nombre | Dirección | https://enlace | Descripción en español | Description in English" });
  const now = el("input", { type: "checkbox" });
  const out = el("div", {}), fb = feedbackNode();
  let made = [];
  // The app re-draws Admin after saving, so the result (and the publish button) is rebuilt from lastImport.
  const paintDone = () => {
    if (!lastImport) return;
    const kids = [el("p", { class: "small-note", text: tx("impDone")(lastImport.ids.length) })];
    if (!lastImport.published) kids.push(K.button(tx("impPublishAll"), "primary", async e2 => {
      e2.currentTarget.disabled = true;
      try { const u = await C.db.from("plans").update({ published: true }).in("id", lastImport.ids); if (u.error) throw u.error; lastImport = null; await C.refreshPublic(); } catch (e) { console.error(e); e2.currentTarget.disabled = false; return say(fb, tx("saveFail")); }
      K.toast(tx("impPublished")); out.replaceChildren(el("p", { class: "small-note", text: tx("impPublished") }));
    }));
    out.replaceChildren(...kids);
  };
  const parse = () => {
    const rows = []; const lines = area.value.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i].trim(); if (!raw) continue;
      const p = raw.split("|").map(x => x.trim());
      if (!p[0]) continue;
      if (p[2] && !C.safeUrl(p[2])) { say(fb, tx("impBadUrl")(i + 1)); return null; }
      rows.push({ name: p[0].slice(0, 120), address: (p[1] || "").slice(0, 200), url: p[2] ? C.safeUrl(p[2]) : "", des: (p[3] || "").slice(0, 600), den: (p[4] || "").slice(0, 600) });
    }
    return rows;
  };
  const create = async rows => {
    const type = typeSel.value, city = citySel.value, publish = now.checked;
    const payloads = rows.map(r => ({
      kind: type === "wellness" ? "wellness" : "event", code: type === "wellness" ? "Wellness" : "Social", published: publish,
      title_es: r.name, title_en: r.name, desc_es: r.des || r.den, desc_en: r.den || r.des,
      location: r.address, url: r.url, event_date: null, event_time: "", date_text: "", price: "", details: "", image_url: ""
    }));
    const ins = await C.db.from("plans").insert(payloads).select("id");
    if (ins.error) throw ins.error;
    const ids = (ins.data || []).map(x => x.id);
    const cur = await C.db.from("settings").select("key,value").eq("key", "plan_tags").maybeSingle();
    if (cur.error) throw cur.error;
    const all = Object.assign({}, (cur.data && cur.data.value) || {});
    ids.forEach(id => { const tg = {}; if (type !== "wellness") tg.cat = type; else tg.cat = "spa"; if (city) tg.show = city; all[id] = tg; });
    const w = await C.db.from("settings").upsert({ key: "plan_tags", value: all, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (w.error) throw w.error;
    lastImport = { ids, published: publish };   // set BEFORE refreshing: the refresh re-draws this tab
    await C.refreshPublic();
    return ids;
  };
  const showPreview = () => {
    say(fb, ""); const rows = parse(); if (!rows) return;
    if (!rows.length) { out.replaceChildren(); return say(fb, tx("impNone")); }
    if (rows.length > 100) return say(fb, tx("impTooMany"));
    const list = el("ul", { class: "small-note" }, ...rows.slice(0, 100).map(r => el("li", { text: r.name + (r.address ? " · " + r.address : "") })));
    out.replaceChildren(el("p", { class: "small-note", text: tx("impRows")(rows.length) }), list,
      K.button(tx("impCreate")(rows.length), "primary", async ev => {
        const b = ev.currentTarget; b.disabled = true;
        try { made = await create(rows); } catch (e) { console.error(e); b.disabled = false; return say(fb, tx("saveFail")); }
        area.value = ""; K.toast(tx("impDone")(made.length));
        paintDone();
      }));
  };
  paintDone();
  return el("div", { class: "admin-form" }, el("p", { class: "small-note", text: tx("impIntro") }),
    field(tx("impCity"), citySel), field(tx("impType"), typeSel), area,
    el("label", { class: "check" }, now, tx("impPublishNow")), fb,
    el("div", { class: "admin-bar" }, K.button(tx("impPreview"), "secondary", showPreview)), out);
}

// ----- City list (settings.cities = [{name, country}]) -----
async function cityListTab() {
  const saved = (await settingsMap()).cities;
  let list = (Array.isArray(saved) && saved.length ? saved : C.cities()).map(c => ({ name: c.name, country: c.country || "" }));
  const box = el("div", {}), fb = feedbackNode();
  const draw = () => {
    say(fb, "");
    const rows = list.map((c, i) => {
      const name = el("input", { type: "text", maxlength: 40, placeholder: tx("cityPh"), value: c.name });
      name.addEventListener("input", () => { c.name = name.value; });
      const country = el("select", {}, el("option", { value: "CO", text: tx("cityCO") }), el("option", { value: "US", text: tx("cityUS") }), el("option", { value: "", text: tx("cityOther") }));
      country.value = c.country === "CO" || c.country === "US" ? c.country : "";
      country.addEventListener("change", () => { c.country = country.value; });
      const rm = K.button(tx("cityRemove"), "secondary", () => { list.splice(i, 1); draw(); });
      return el("div", { class: "rf-pair" }, el("label", {}, el("small", { text: tx("cityName") }), name), el("label", {}, el("small", { text: tx("cityCountry") }), country), rm);
    });
    box.replaceChildren(...rows, el("div", { class: "admin-bar" },
      K.button(tx("cityAdd"), "secondary", () => { if (list.length < 40) { list.push({ name: "", country: "CO" }); draw(); } }),
      K.button(tx("save"), "primary", async () => {
        const clean = [], seen = new Set();
        list.forEach(c => { const n = String(c.name || "").trim().slice(0, 40), k = C.cityKey(n); if (k && !seen.has(k)) { seen.add(k); clean.push({ name: n, country: c.country || "" }); } });
        if (!clean.length) return say(fb, tx("cityNone"));
        try { await putSetting("cities", clean); } catch (e) { console.error(e); return say(fb, tx("saveFail")); }
        list = clean.map(c => Object.assign({}, c)); draw(); K.toast(tx("saved"));
      }),
      K.button(tx("cityDefault"), "secondary", async () => {
        if (!await confirmed(tx("confirmReset"))) return;
        try { await putSetting("cities", null); } catch { return say(fb, tx("saveFail")); }
        list = C.cities().map(c => Object.assign({}, c)); draw(); K.toast(tx("saved"));
      })), fb);
  };
  draw();
  return el("div", { class: "admin-form" }, el("p", { class: "small-note", text: tx("cityIntro") }), box);
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
  A.registerTab("codemsgs", { group: "content", label: lab(T.es.tCodeMsgs, T.en.tCodeMsgs), render: async () => codeMsgsTab() });
  A.registerTab("podcast", { group: "content", label: lab(T.es.tPod, T.en.tPod), render: async () => podcastTab() });
  A.registerTab("founder", { group: "people", label: lab(T.es.tFounder, T.en.tFounder), render: async () => founderTab() });
  A.registerTab("talkLib", { group: "content", label: lab(T.es.tTalkLib, T.en.tTalkLib), render: async () => talkLibTab() });
  A.registerTab("import", { group: "content", label: lab(T.es.tImport, T.en.tImport), render: async () => importTab() });
  A.registerTab("cityList", { group: "content", label: lab(T.es.tCityList, T.en.tCityList), render: async () => cityListTab() });
  A.registerTab("help", { group: "content", label: lab(T.es.tHelp, T.en.tHelp), render: async () => helpTab() });
  A.registerTab("travelx", { group: "content", label: lab(T.es.tTravel, T.en.tTravel), render: async () => travelTab() });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
