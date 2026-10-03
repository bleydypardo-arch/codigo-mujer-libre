// Código Mujer Libre — Admin dashboard (only loads data for administrators; the database enforces it too)
(() => {
"use strict";

const S = {
  es: {
    tabs: { plans: "Planes y eventos", trips: "Futuros planes / viajes", home: "Inicio", wellness: "Bienestar", community: "Comunidad", messages: "Mensajes", users: "Usuarias", ai: "✨ Asistente IA", settings: "Imagen y mensaje" },
    loading: "Cargando…", loadFail: "No se pudo cargar. Inténtalo de nuevo.",
    newItem: "+ Nuevo", edit: "Editar", del: "Eliminar", publish: "Publicar", unpublish: "Ocultar", live: "Publicado", draft: "Borrador",
    confirmDelete: "¿Eliminar esto de forma permanente?", saved: "Guardado.", deleted: "Eliminado.", saveFail: "No se pudo guardar.",
    who: "Ver quién", hide: "Cerrar", nobody: "Nadie todavía", interestedWho: "❤️ Les interesa", goingWho: "✓ Van",
    counts: (i, g) => "❤️ " + i + " · ✓ " + g,
    empty: "Todavía no hay nada aquí.",
    fCode: "Código / categoría", fNone: "— Sin código —", fTitleEs: "Título (español)", fTitleEn: "Título (inglés)",
    fDescEs: "Descripción (español)", fDescEn: "Descripción (inglés)", fDate: "Fecha", fDateHelp: "El mes se calcula solo a partir de la fecha. Déjala vacía si aún no hay fecha.",
    fTime: "Hora (ej. 7:00 PM)", fDateText: "Fechas tentativas (ej. mayo, o 15–17 de mayo)", fLocationEvent: "Lugar", fLocationTrip: "Destino",
    fPriceEvent: "Precio aproximado", fPriceTrip: "Presupuesto aproximado", fUrl: "Enlace externo (https://…)", fDetails: "Más detalles / contacto",
    fImage: "Imagen", fImageUrl: "o pega la dirección de una imagen", uploading: "Subiendo imagen…", imageFail: "No se pudo subir la imagen (usa JPG, PNG o WebP).",
    fPublished: "Publicado (visible para las mujeres)", save: "Guardar", cancel: "Cancelar",
    needTitle: "Escribe un título (en español o en inglés).", badUrl: "El enlace debe empezar con https:// o http://",
    aiBanner: "✨ Preparado por IA a partir de resultados de búsqueda. Verifica fecha, hora, lugar, precio y enlace en la fuente antes de publicar.",
    aiReviewed: "Revisé la información y la fuente", aiNeedReview: "Marca “Revisé la información” para poder publicar.",
    polish: "✨ Mejorar y traducir con IA", polishing: "Trabajando…", polishDone: "Listo. Revisa los textos antes de guardar.",
    ph: "Escribe qué buscas…", aiIntro: "Pídele a la IA que busque opciones actuales. Tú revisas, editas y apruebas: nada se publica solo.",
    aiExamples: ["Happy hours en Orlando esta semana", "Eventos para mujeres en Orlando este mes", "Actividades sociales este fin de semana", "Actividades de bienestar", "Eventos de fe", "Experiencias interesantes", "Ideas de viaje de fin de semana"],
    aiAnyCode: "Cualquier código", aiSearch: "Buscar", aiSearching: "Buscando en internet… puede tardar hasta un minuto.",
    aiUse: "Usar esta opción", aiNone: "No encontré opciones. Prueba con otra búsqueda.", aiVerified: "Fuente verificada", aiUnverified: "Enlace sin verificar",
    aiNotReady: "El asistente de IA todavía no está activado (falta desplegar la función o la clave).", aiLimit: "Llegaste al límite diario del asistente. Inténtalo mañana.", aiFail: "El asistente no pudo responder. Inténtalo de nuevo.",
    aiNote: "Nota", aiSource: "Fuente",
    userCount: n => n + " usuarias registradas", search: "Buscar por nombre, correo o empresa…", role: { member: "Miembro", admin: "Administradora", super_admin: "Administradora principal" },
    makeAdmin: "Hacer administradora", removeAdmin: "Quitar administradora", roleSaved: "Rol actualizado.", joined: "Se unió",
    company: "Empresa", city: "Ciudad", interests: "Intereses",
    reply: "Respuesta", sendReply: "Guardar respuesta", replySaved: "Respuesta guardada.", from: "De",
    heroTitle: "Imagen principal (portada)", heroHelp: "Sube una foto. Se ajusta sola a celular y computadora.", heroDefault: "Usar la imagen original",
    quoteTitle: "Mensaje de hoy", quoteEs: "Mensaje (español)", quoteEn: "Mensaje (inglés)"
  },
  en: {
    tabs: { plans: "Plans & events", trips: "Future plans / trips", home: "Home", wellness: "Wellness", community: "Community", messages: "Messages", users: "Members", ai: "✨ AI assistant", settings: "Image & message" },
    loading: "Loading…", loadFail: "Could not load. Please try again.",
    newItem: "+ New", edit: "Edit", del: "Delete", publish: "Publish", unpublish: "Hide", live: "Published", draft: "Draft",
    confirmDelete: "Delete this permanently?", saved: "Saved.", deleted: "Deleted.", saveFail: "Could not save.",
    who: "See who", hide: "Close", nobody: "Nobody yet", interestedWho: "❤️ Interested", goingWho: "✓ Going",
    counts: (i, g) => "❤️ " + i + " · ✓ " + g,
    empty: "Nothing here yet.",
    fCode: "Código / category", fNone: "— No code —", fTitleEs: "Title (Spanish)", fTitleEn: "Title (English)",
    fDescEs: "Description (Spanish)", fDescEn: "Description (English)", fDate: "Date", fDateHelp: "The month is worked out from the date. Leave empty if there is no date yet.",
    fTime: "Time (e.g. 7:00 PM)", fDateText: "Tentative dates (e.g. May, or May 15–17)", fLocationEvent: "Location", fLocationTrip: "Destination",
    fPriceEvent: "Approximate price", fPriceTrip: "Approximate budget", fUrl: "External link (https://…)", fDetails: "More details / contact",
    fImage: "Image", fImageUrl: "or paste an image address", uploading: "Uploading image…", imageFail: "Could not upload the image (use JPG, PNG or WebP).",
    fPublished: "Published (visible to members)", save: "Save", cancel: "Cancel",
    needTitle: "Enter a title (Spanish or English).", badUrl: "The link must start with https:// or http://",
    aiBanner: "✨ Prepared by AI from search results. Check the date, time, place, price and link at the source before publishing.",
    aiReviewed: "I reviewed the information and the source", aiNeedReview: "Tick “I reviewed the information” to publish.",
    polish: "✨ Improve and translate with AI", polishing: "Working…", polishDone: "Done. Review the text before saving.",
    ph: "Describe what you're looking for…", aiIntro: "Ask the AI to search for current options. You review, edit and approve: nothing is published automatically.",
    aiExamples: ["Happy hours around Orlando this week", "Women's events around Orlando this month", "Social activities this weekend", "Wellness activities", "Faith-related events", "Interesting experiences", "Weekend trip ideas"],
    aiAnyCode: "Any code", aiSearch: "Search", aiSearching: "Searching the web… this can take up to a minute.",
    aiUse: "Use this option", aiNone: "No options found. Try a different search.", aiVerified: "Source verified", aiUnverified: "Link not verified",
    aiNotReady: "The AI assistant isn't switched on yet (the function or key still needs to be set up).", aiLimit: "You've reached the assistant's daily limit. Try again tomorrow.", aiFail: "The assistant couldn't answer. Please try again.",
    aiNote: "Note", aiSource: "Source",
    userCount: n => n + " registered members", search: "Search by name, email or company…", role: { member: "Member", admin: "Administrator", super_admin: "Primary administrator" },
    makeAdmin: "Make administrator", removeAdmin: "Remove administrator", roleSaved: "Role updated.", joined: "Joined",
    company: "Company", city: "City", interests: "Interests",
    reply: "Reply", sendReply: "Save reply", replySaved: "Reply saved.", from: "From",
    heroTitle: "Main (cover) image", heroHelp: "Upload a photo. It fits phones and computers automatically.", heroDefault: "Use the original image",
    quoteTitle: "Today's message", quoteEs: "Message (Spanish)", quoteEn: "Message (English)"
  }
};

const KINDS = {
  event:    { tab: "plans",    fields: ["code", "title", "desc", "date", "time", "location", "price", "url", "details", "image"] },
  trip:     { tab: "trips",    fields: ["code", "title", "desc", "date_text", "location", "price", "url", "details", "image"] },
  home:     { tab: "home",     fields: ["title", "desc", "image"] },
  wellness: { tab: "wellness", fields: ["title", "desc", "url", "details", "image"] }
};
const TAB_KIND = { plans: "event", trips: "trip", home: "home", wellness: "wellness" };
const TABS = ["plans", "trips", "home", "wellness", "community", "messages", "users", "ai", "settings"];
const CODES = ["Social", "Wellness", "Faith", "Adventure", "Family", "Connection", "Support", "Recharge"];

let C = null;
let tab = "plans";
let editing = null;       // { kind, row, prefill, ai }
let renderToken = 0;
const a = key => (S[C.lang()][key] !== undefined ? S[C.lang()][key] : key);
const root = () => document.getElementById("adminRoot");
const el = (...args) => C.el(...args);

document.addEventListener("cml:session", event => {
  C = window.CML;
  if (event.detail.admin) { tab = "plans"; editing = null; render(); }
  else if (root()) root().replaceChildren();
});
document.addEventListener("cml:lang", () => { if (window.CML && window.CML.isAdmin()) { C = window.CML; render(); } });

function toast(text) {
  const status = document.getElementById("appStatus");
  if (!status) return;
  status.hidden = false; status.textContent = text;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => { status.hidden = true; status.textContent = ""; }, 5000);
}
function button(text, cls, handler) {
  const b = el("button", { type: "button", class: cls || "", text });
  b.addEventListener("click", handler);
  return b;
}
function loadingNode() { return el("p", { class: "small-note", text: a("loading") }); }

// ---------- rendering ----------
function render() {
  const host = root();
  if (!host || !C || !C.isAdmin()) return;
  const token = ++renderToken;
  const tabsBar = el("div", { class: "admin-tabs", role: "tablist" }, TABS.map(key => {
    const b = el("button", { type: "button", role: "tab", class: "chip" + (tab === key ? " selected" : ""), "aria-selected": String(tab === key), text: a("tabs")[key] });
    b.addEventListener("click", () => { tab = key; editing = null; render(); });
    return b;
  }));
  const body = el("div", { id: "adminBody" }, loadingNode());
  host.replaceChildren(tabsBar, body);
  const fill = node => { if (token === renderToken) body.replaceChildren(node); };
  const fail = () => fill(el("p", { class: "form-feedback", text: a("loadFail") }));

  if (editing) return fill(formView());
  const run = async () => {
    try {
      if (TAB_KIND[tab]) fill(await listView(TAB_KIND[tab]));
      else if (tab === "community") fill(await communityView());
      else if (tab === "messages") fill(await messagesView());
      else if (tab === "users") fill(await usersView());
      else if (tab === "ai") fill(aiView());
      else if (tab === "settings") fill(await settingsView());
    } catch (e) { console.error(e); fail(); }
  };
  run();
}

// ---------- plans / trips / home / wellness ----------
async function listView(kind) {
  const q = C.db.from("plans").select("*").eq("kind", kind);
  const { data, error } = (kind === "event" || kind === "trip")
    ? await q.order("event_date", { ascending: false, nullsFirst: true })
    : await q.order("created_at", { ascending: false });
  if (error) throw error;
  const wrap = el("div");
  wrap.appendChild(el("div", { class: "admin-bar" }, button(a("newItem"), "primary", () => { editing = { kind, row: null }; render(); })));
  if (!data.length) wrap.appendChild(el("p", { class: "small-note", text: a("empty") }));

  let tally = new Map();
  if (kind === "event" || kind === "trip") {
    const r = await C.db.from("responses").select("plan_id,status");
    if (!r.error) (r.data || []).forEach(x => {
      const c = tally.get(x.plan_id) || { i: 0, g: 0 };
      if (x.status === "going") c.g++; else c.i++;
      tally.set(x.plan_id, c);
    });
  }
  data.forEach(row => wrap.appendChild(planItem(kind, row, tally.get(row.id) || { i: 0, g: 0 })));
  return wrap;
}
function planItem(kind, row, c) {
  const title = C.pick(row, "title") || "—";
  const when = row.event_date ? C.fmtDate(row.event_date) + (row.event_time ? " · " + row.event_time : "") : (row.date_text || "");
  const item = el("div", { class: "admin-item" },
    el("span", { class: "badge" + (row.published ? " live" : ""), text: row.published ? a("live") : a("draft") }),
    row.code && C.codeLabels[row.code] ? el("span", { class: "badge", text: " " + C.t(C.codeLabels[row.code]) }) : null,
    el("h3", { text: title }),
    when ? el("p", { class: "small-note", text: "📅 " + when }) : null,
    row.location ? el("p", { class: "small-note", text: "📍 " + row.location }) : null,
    (kind === "event" || kind === "trip") ? el("p", { class: "small-note", text: a("counts")(c.i, c.g) }) : null);
  const whoBox = el("div");
  const actions = el("div", { class: "actions" },
    button(a("edit"), "", () => { editing = { kind, row }; render(); }),
    button(row.published ? a("unpublish") : a("publish"), "", async () => {
      const { error } = await C.db.from("plans").update({ published: !row.published }).eq("id", row.id);
      if (error) return toast(a("saveFail"));
      await C.refreshPublic(); toast(a("saved")); render();
    }));
  if (kind === "event" || kind === "trip") {
    let open = false;
    const whoBtn = button(a("who"), "", async () => {
      open = !open;
      whoBtn.textContent = open ? a("hide") : a("who");
      if (!open) return whoBox.replaceChildren();
      whoBox.replaceChildren(loadingNode());
      const { data, error } = await C.db.from("responses")
        .select("status, profiles(first_name,last_name,email,company)").eq("plan_id", row.id);
      if (error) return whoBox.replaceChildren(el("p", { class: "form-feedback", text: a("loadFail") }));
      const line = p => (p ? (p.first_name + " " + p.last_name).trim() + " · " + p.email + (p.company ? " · " + p.company : "") : "?");
      const group = (status, label) => {
        const rows = data.filter(x => x.status === status);
        return el("div", {}, el("b", { text: label + " (" + rows.length + ")" }),
          rows.length ? el("ul", { class: "who" }, rows.map(x => el("li", { text: line(x.profiles) }))) : el("p", { class: "small-note", text: a("nobody") }));
      };
      whoBox.replaceChildren(group("interested", a("interestedWho")), group("going", a("goingWho")));
    });
    actions.appendChild(whoBtn);
  }
  actions.appendChild(button(a("del"), "danger", async () => {
    if (!window.confirm(a("confirmDelete"))) return;
    const { error } = await C.db.from("plans").delete().eq("id", row.id);
    if (error) return toast(a("saveFail"));
    await C.refreshPublic(); toast(a("deleted")); render();
  }));
  item.appendChild(actions);
  item.appendChild(whoBox);
  return item;
}

// ---------- image upload (resized in the browser, stored in Supabase Storage) ----------
async function resizeToJpeg(file, max = 1600) {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error("type");
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return await new Promise((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error("blob")), "image/jpeg", 0.85));
}
async function uploadImage(file) {
  const blob = await resizeToJpeg(file);
  const path = new Date().getFullYear() + "/" + Date.now() + "-" + Math.random().toString(36).slice(2, 8) + ".jpg";
  const { error } = await C.db.storage.from("images").upload(path, blob, { contentType: "image/jpeg", upsert: false });
  if (error) throw error;
  return C.db.storage.from("images").getPublicUrl(path).data.publicUrl;
}
function imagePicker(initial) {
  const urlInput = el("input", { type: "url", placeholder: "https://…", value: initial || "", inputmode: "url" });
  const preview = el("img", { class: "preview", alt: "" });
  const status = el("p", { class: "small-note", role: "status" });
  const fileInput = el("input", { type: "file", accept: "image/jpeg,image/png,image/webp" });
  const sync = () => {
    const safe = C.safeUrl(urlInput.value);
    if (safe) { preview.src = safe; preview.hidden = false; } else { preview.removeAttribute("src"); preview.hidden = true; }
  };
  urlInput.addEventListener("input", sync);
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    status.textContent = a("uploading");
    try { urlInput.value = await uploadImage(file); status.textContent = ""; sync(); }
    catch (e) { console.error(e); status.textContent = a("imageFail"); }
  });
  sync();
  const node = el("div", {}, fileInput, preview, status,
    el("label", {}, a("fImageUrl"), urlInput));
  return { node, get value() { return urlInput.value.trim(); }, set value(v) { urlInput.value = v; sync(); } };
}

// ---------- the create / edit form ----------
function formView() {
  const { kind, row, prefill, ai } = editing;
  const cfg = KINDS[kind];
  const d = Object.assign({ code: "", title_es: "", title_en: "", desc_es: "", desc_en: "", event_date: "", event_time: "",
    date_text: "", location: "", price: "", url: "", details: "", image_url: "", published: false }, prefill || {}, row || {});
  const form = el("form", { class: "admin-form", novalidate: true });
  const inputs = {};
  const add = (key, node) => { inputs[key] = node; return node; };
  const field = (label, input, help) => el("label", {}, label, input, help ? el("small", { class: "small-note", text: help }) : null);
  const text = (key, value, attrs = {}) => add(key, el("input", Object.assign({ type: "text", value: value || "" }, attrs)));
  const area = (key, value) => { const x = add(key, el("textarea")); x.value = value || ""; return x; };

  if (ai) form.appendChild(el("div", { class: "ai-banner", text: a("aiBanner") }));
  if (cfg.fields.includes("code")) {
    const sel = add("code", el("select", {}, el("option", { value: "", text: a("fNone") }),
      CODES.map(c => el("option", { value: c, text: C.t(C.codeLabels[c]) }))));
    sel.value = d.code || "";
    form.appendChild(field(a("fCode"), sel));
  }
  form.appendChild(field(a("fTitleEs"), text("title_es", d.title_es, { maxlength: 140 })));
  form.appendChild(field(a("fTitleEn"), text("title_en", d.title_en, { maxlength: 140 })));
  form.appendChild(field(a("fDescEs"), area("desc_es", d.desc_es)));
  form.appendChild(field(a("fDescEn"), area("desc_en", d.desc_en)));
  if (cfg.fields.includes("date")) form.appendChild(field(a("fDate"), add("event_date", el("input", { type: "date", value: d.event_date || "" })), a("fDateHelp")));
  if (cfg.fields.includes("time")) form.appendChild(field(a("fTime"), text("event_time", d.event_time, { maxlength: 60 })));
  if (cfg.fields.includes("date_text")) form.appendChild(field(a("fDateText"), text("date_text", d.date_text, { maxlength: 80 })));
  if (cfg.fields.includes("location")) form.appendChild(field(kind === "trip" ? a("fLocationTrip") : a("fLocationEvent"), text("location", d.location, { maxlength: 200 })));
  if (cfg.fields.includes("price")) form.appendChild(field(kind === "trip" ? a("fPriceTrip") : a("fPriceEvent"), text("price", d.price, { maxlength: 80 })));
  if (cfg.fields.includes("url")) form.appendChild(field(a("fUrl"), text("url", d.url, { type: "url", inputmode: "url", placeholder: "https://…" })));
  if (cfg.fields.includes("details")) form.appendChild(field(a("fDetails"), area("details", d.details)));
  const picker = cfg.fields.includes("image") ? imagePicker(d.image_url) : null;
  if (picker) form.appendChild(el("fieldset", {}, el("legend", { text: a("fImage") }), picker.node));

  // AI helper: improve descriptions + translate (no web search; text only)
  const polishStatus = el("p", { class: "small-note", role: "status" });
  const polishBtn = button(a("polish"), "secondary", async () => {
    polishBtn.disabled = true; polishStatus.textContent = a("polishing");
    try {
      const out = await invokeAI("polish", {
        code: inputs.code ? inputs.code.value : "", kind,
        title_es: inputs.title_es.value, title_en: inputs.title_en.value,
        desc_es: inputs.desc_es.value, desc_en: inputs.desc_en.value
      });
      ["title_es", "title_en", "desc_es", "desc_en"].forEach(k => { if (typeof out[k] === "string" && out[k].trim()) inputs[k].value = out[k].trim(); });
      if (inputs.code && CODES.includes(out.code) && !inputs.code.value) inputs.code.value = out.code;
      polishStatus.textContent = a("polishDone");
    } catch (e) { polishStatus.textContent = aiErrorText(e); }
    polishBtn.disabled = false;
  });
  form.appendChild(el("div", { class: "admin-bar" }, polishBtn, polishStatus));

  const published = add("published", el("input", { type: "checkbox" }));
  published.checked = !!d.published;
  form.appendChild(el("label", { class: "check" }, published, a("fPublished")));
  let reviewed = null;
  if (ai) {
    reviewed = el("input", { type: "checkbox" });
    form.appendChild(el("label", { class: "check" }, reviewed, a("aiReviewed")));
  }
  const feedback = el("p", { class: "form-feedback", role: "alert", hidden: true });
  form.appendChild(feedback);
  const fail = key => { feedback.hidden = false; feedback.textContent = a(key); };

  const saveBtn = el("button", { type: "submit", class: "primary", text: a("save") });
  form.appendChild(el("div", { class: "admin-bar" }, saveBtn,
    button(a("cancel"), "secondary", () => { editing = null; render(); })));

  form.addEventListener("submit", async event => {
    event.preventDefault();
    feedback.hidden = true;
    const val = k => (inputs[k] ? inputs[k].value.trim() : "");
    if (!val("title_es") && !val("title_en")) return fail("needTitle");
    const url = val("url"), image = picker ? picker.value : "";
    if ((url && !C.safeUrl(url)) || (image && !C.safeUrl(image))) return fail("badUrl");
    if (ai && published.checked && !reviewed.checked) return fail("aiNeedReview");
    const payload = {
      kind, code: cfg.fields.includes("code") && val("code") ? val("code") : null,
      title_es: val("title_es"), title_en: val("title_en"), desc_es: val("desc_es"), desc_en: val("desc_en"),
      event_date: cfg.fields.includes("date") && val("event_date") ? val("event_date") : null,
      event_time: val("event_time"), date_text: val("date_text"), location: val("location"), price: val("price"),
      url, details: val("details"), image_url: image, published: published.checked
    };
    saveBtn.disabled = true;
    const res = row ? await C.db.from("plans").update(payload).eq("id", row.id)
                    : await C.db.from("plans").insert(payload);
    saveBtn.disabled = false;
    if (res.error) { console.error(res.error); return fail("saveFail"); }
    await C.refreshPublic();
    toast(a("saved"));
    editing = null; render();
  });
  return form;
}

// ---------- community moderation ----------
async function communityView() {
  const { data, error } = await C.db.from("community_posts").select("id,author_name,body,created_at")
    .order("created_at", { ascending: false }).limit(100);
  if (error) throw error;
  const wrap = el("div");
  if (!data.length) wrap.appendChild(el("p", { class: "small-note", text: a("empty") }));
  data.forEach(p => {
    const item = el("div", { class: "admin-item" },
      el("b", { text: p.author_name || "—" }),
      el("p", { class: "saved-text", text: p.body }),
      el("p", { class: "small-note", text: new Date(p.created_at).toLocaleString(C.loc()) }));
    item.appendChild(el("div", { class: "actions" }, button(a("del"), "danger", async () => {
      if (!window.confirm(a("confirmDelete"))) return;
      const r = await C.db.from("community_posts").delete().eq("id", p.id);
      if (r.error) return toast(a("saveFail"));
      await C.refreshPublic(); toast(a("deleted")); render();
    })));
    wrap.appendChild(item);
  });
  return wrap;
}

// ---------- private messages ----------
async function messagesView() {
  const { data, error } = await C.db.from("messages")
    .select("*, profiles(first_name,last_name,email)").order("created_at", { ascending: false }).limit(100);
  if (error) throw error;
  const wrap = el("div");
  if (!data.length) wrap.appendChild(el("p", { class: "small-note", text: a("empty") }));
  data.forEach(m => {
    const who = m.profiles ? (m.profiles.first_name + " " + m.profiles.last_name).trim() + " · " + m.profiles.email : "?";
    const reply = el("textarea"); reply.value = m.admin_reply || "";
    const item = el("div", { class: "admin-item" },
      el("span", { class: "badge", text: m.type }),
      el("p", { class: "small-note", text: a("from") + ": " + who + " · " + new Date(m.created_at).toLocaleString(C.loc()) }),
      el("p", { class: "saved-text", text: m.body }),
      el("label", {}, a("reply"), reply));
    item.appendChild(el("div", { class: "actions" }, button(a("sendReply"), "", async () => {
      const r = await C.db.from("messages").update({ admin_reply: reply.value.trim(), replied_at: new Date().toISOString() }).eq("id", m.id);
      toast(r.error ? a("saveFail") : a("replySaved"));
    })));
    wrap.appendChild(item);
  });
  return wrap;
}

// ---------- members ----------
async function usersView() {
  const { data, error } = await C.db.from("profiles").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  const me = C.session().user.id;
  const wrap = el("div");
  const list = el("div");
  const search = el("input", { type: "search", placeholder: a("search"), "aria-label": a("search") });
  wrap.appendChild(el("div", { class: "admin-bar" }, el("b", { text: a("userCount")(data.length) })));
  wrap.appendChild(search);
  wrap.appendChild(list);
  const paint = () => {
    const q = search.value.trim().toLowerCase();
    list.replaceChildren(...data.filter(u => !q || [u.first_name, u.last_name, u.email, u.company, u.city].join(" ").toLowerCase().includes(q)).map(u => {
      const labels = (u.interests || []).map(c => C.codeLabels[c] ? C.t(C.codeLabels[c]) : c).join(" · ");
      const item = el("div", { class: "admin-item" },
        el("span", { class: "badge" + (u.role !== "member" ? " live" : ""), text: a("role")[u.role] || u.role }),
        el("h3", { text: (u.first_name + " " + u.last_name).trim() || "—" }),
        el("p", { class: "small-note", text: u.email }),
        u.company ? el("p", { class: "small-note", text: a("company") + ": " + u.company }) : null,
        u.city ? el("p", { class: "small-note", text: a("city") + ": " + u.city }) : null,
        labels ? el("p", { class: "small-note", text: a("interests") + ": " + labels }) : null,
        el("p", { class: "small-note", text: a("joined") + ": " + new Date(u.created_at).toLocaleDateString(C.loc()) }));
      if (C.isSuper() && u.id !== me && u.role !== "super_admin") {
        const makeAdmin = u.role !== "admin";
        item.appendChild(el("div", { class: "actions" }, button(makeAdmin ? a("makeAdmin") : a("removeAdmin"), makeAdmin ? "" : "danger", async () => {
          const r = await C.db.from("profiles").update({ role: makeAdmin ? "admin" : "member" }).eq("id", u.id);
          if (r.error) return toast(a("saveFail"));
          toast(a("roleSaved")); render();
        })));
      }
      return item;
    }));
  };
  search.addEventListener("input", paint);
  paint();
  return wrap;
}

// ---------- hero image + message of the day ----------
async function settingsView() {
  const { data, error } = await C.db.from("settings").select("key,value");
  if (error) throw error;
  const cfg = {};
  data.forEach(r => { cfg[r.key] = r.value; });
  const wrap = el("div");

  const hero = imagePicker((cfg.hero_image && cfg.hero_image.url) || "");
  const heroForm = el("div", { class: "admin-form" },
    el("h3", { text: a("heroTitle") }), el("p", { class: "small-note", text: a("heroHelp") }), hero.node,
    el("div", { class: "admin-bar" },
      button(a("save"), "primary", async () => {
        if (hero.value && !C.safeUrl(hero.value)) return toast(a("badUrl"));
        if (!hero.value) return toast(a("saveFail"));
        const r = await C.db.from("settings").upsert({ key: "hero_image", value: { url: hero.value }, updated_at: new Date().toISOString() }, { onConflict: "key" });
        if (r.error) return toast(a("saveFail"));
        await C.refreshPublic(); toast(a("saved"));
      }),
      button(a("heroDefault"), "secondary", async () => {
        const r = await C.db.from("settings").delete().eq("key", "hero_image");
        if (r.error) return toast(a("saveFail"));
        hero.value = ""; await C.refreshPublic(); toast(a("saved"));
      })));
  wrap.appendChild(heroForm);

  const q = cfg.daily_quote || {};
  const qEs = el("textarea"); qEs.value = q.es || "";
  const qEn = el("textarea"); qEn.value = q.en || "";
  wrap.appendChild(el("div", { class: "admin-form" },
    el("h3", { text: a("quoteTitle") }),
    el("label", {}, a("quoteEs"), qEs), el("label", {}, a("quoteEn"), qEn),
    el("div", { class: "admin-bar" }, button(a("save"), "primary", async () => {
      const r = await C.db.from("settings").upsert({ key: "daily_quote", value: { es: qEs.value.trim(), en: qEn.value.trim() }, updated_at: new Date().toISOString() }, { onConflict: "key" });
      if (r.error) return toast(a("saveFail"));
      await C.refreshPublic(); toast(a("saved"));
    }))));
  return wrap;
}

// ---------- AI assistant (calls the secure Edge Function; no secret key in the browser) ----------
async function invokeAI(action, payload) {
  const { data, error } = await C.db.functions.invoke("ai-assist", { body: Object.assign({ action, lang: C.lang() }, payload) });
  if (error) {
    let status = error.context && error.context.status;
    let detail = "";
    try { detail = (await error.context.json()).error || ""; } catch { /* ignore */ }
    const err = new Error(detail || error.message); err.status = status; throw err;
  }
  if (data && data.error) { const err = new Error(data.error); err.status = data.status; throw err; }
  return data;
}
function aiErrorText(e) {
  if (e && (e.status === 404 || e.status === 503 || /not.?configured/i.test(e.message || ""))) return a("aiNotReady");
  if (e && e.status === 429) return a("aiLimit");
  return a("aiFail");
}
function aiView() {
  const wrap = el("div");
  wrap.appendChild(el("p", { text: a("aiIntro") }));
  const query = el("textarea", { placeholder: a("ph"), "aria-label": a("ph") });
  const code = el("select", { "aria-label": a("fCode") }, el("option", { value: "", text: a("aiAnyCode") }),
    CODES.map(c => el("option", { value: c, text: C.t(C.codeLabels[c]) })));
  const results = el("div");
  const examples = el("div", { class: "chips" }, a("aiExamples").map(text => {
    const b = el("button", { type: "button", class: "chip", text });
    b.addEventListener("click", () => { query.value = text; });
    return b;
  }));
  const go = button(a("aiSearch"), "primary", async () => {
    const text = query.value.trim();
    if (!text) return query.focus();
    go.disabled = true;
    results.replaceChildren(el("p", { class: "small-note", role: "status", text: a("aiSearching") }));
    try {
      const out = await invokeAI("discover", { query: text, code: code.value });
      renderResults(results, out);
    } catch (e) {
      console.error(e);
      results.replaceChildren(el("p", { class: "form-feedback", role: "alert", text: aiErrorText(e) }));
    }
    go.disabled = false;
  });
  wrap.append(examples, el("div", { class: "admin-form" }, query, code, el("div", { class: "admin-bar" }, go)), results);
  return wrap;
}
function renderResults(box, out) {
  const list = (out && Array.isArray(out.results)) ? out.results : [];
  box.replaceChildren();
  if (!list.length) return box.appendChild(el("p", { class: "small-note", text: a("aiNone") }));
  list.forEach(r => {
    const kind = r.kind === "trip" ? "trip" : "event";
    const date = /^\d{4}-\d{2}-\d{2}$/.test(r.date || "") ? r.date : "";
    const safe = C.safeUrl(r.url);
    const item = el("div", { class: "admin-item" },
      r.code && C.codeLabels[r.code] ? el("span", { class: "badge", text: C.t(C.codeLabels[r.code]) }) : null,
      el("h3", { text: (C.lang() === "es" ? r.title_es || r.title_en : r.title_en || r.title_es) || "—" }),
      date || r.time ? el("p", { class: "small-note", text: "📅 " + (date ? C.fmtDate(date) : "") + (r.time ? " · " + r.time : "") }) : null,
      r.location ? el("p", { class: "small-note", text: "📍 " + r.location }) : null,
      r.price ? el("p", { class: "small-note", text: "💲 " + r.price }) : null,
      el("p", { class: "saved-text", text: (C.lang() === "es" ? r.desc_es || r.desc_en : r.desc_en || r.desc_es) || "" }),
      safe ? el("p", { class: "small-note" }, a("aiSource") + ": ",
        el("a", { href: safe, target: "_blank", rel: "noopener noreferrer", text: safe.replace(/^https?:\/\//, "").slice(0, 60) }),
        " · ", r.url_verified ? a("aiVerified") : a("aiUnverified")) : null);
    item.appendChild(el("div", { class: "actions" }, button(a("aiUse"), "", () => {
      editing = {
        kind, ai: true, row: null,
        prefill: {
          code: CODES.includes(r.code) ? r.code : "", title_es: r.title_es || "", title_en: r.title_en || "",
          desc_es: r.desc_es || "", desc_en: r.desc_en || "", event_date: date, event_time: r.time || "",
          date_text: kind === "trip" ? (r.date_text || "") : "", location: r.location || "", price: r.price || "",
          url: safe, image_url: C.safeUrl(r.image_url) || "", published: false
        }
      };
      tab = kind === "trip" ? "trips" : "plans";
      render();
    })));
    box.appendChild(item);
  });
  if (out.note) box.appendChild(el("p", { class: "small-note", text: a("aiNote") + ": " + out.note }));
}
})();
