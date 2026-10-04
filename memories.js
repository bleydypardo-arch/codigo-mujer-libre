// Código Mujer Libre — Memories / Recuerdos
// Event albums: photos, short videos, posts, comments, hearts. Private to approved members.
// All permissions are enforced by the database (row-level security + a private storage bucket);
// the checks in this file only decide which buttons to show.
(() => {
"use strict";

const LIMITS = { photoPx: 1600, thumbPx: 480, maxPhotos: 10, maxVideoMB: 25, maxVideoSec: 20 };
const BUCKET = "memories";

const ES = {
  memUpcoming: "Próximos", memMemories: "Recuerdos", memSwitchLabel: "Próximos o Recuerdos",
  memTitle: "RECUERDOS", memHeading: "Nuestra historia juntas",
  memIntro: "Lo que hemos vivido juntas, evento por evento.",
  memPending: "Tu solicitud ya le llegó a la administradora y está pendiente de aprobación. Cuando la apruebe, podrás ver y compartir los recuerdos del grupo.",
  memEmpty: "Todavía no hay recuerdos. Cuando un evento termine, la administradora lo convertirá en recuerdo.",
  memAll: "Todos", memBack: "← Volver", memNoMedia: "Todavía sin fotos",
  memPhoto: "foto", memPhotos: "fotos", memVideo: "video", memVideos: "videos", memPost1: "publicación", memPosts: "publicaciones",
  memAddMemory: "Agregar recuerdo", memAddPhotos: "Agregar fotos o video", memCaptionPh: "Escribe algo sobre este día… (opcional)",
  memPost: "Publicar", memUploading: "Subiendo {n} de {total}…", memSaving: "Publicando…",
  memPostFail: "No se pudo publicar. Revisa tu conexión e inténtalo de nuevo.",
  memNeedContent: "Escribe algo o agrega una foto o un video.",
  memTooMany: "Máximo {n} fotos por publicación.", memOneVideo: "Solo un video por publicación.",
  memVideoLong: "Ese video dura más de {n} segundos. Elige uno más corto.",
  memVideoBig: "Ese video pesa más de {n} MB. Elige uno más corto.",
  memBadType: "Ese archivo no es compatible. Usa fotos (JPG, PNG, WebP, HEIC) o un video corto (MP4 o MOV).",
  memPhotoFail: "No se pudo leer una de las fotos. Prueba con JPG o PNG.",
  memLimitsNote: "Hasta {p} fotos y 1 video de {s} segundos por publicación.",
  memOnlyGoing: "Solo quienes marcaron “Voy” pueden publicar en este recuerdo. Aún puedes comentar y dar ❤️.",
  memClosed: "Este recuerdo está cerrado: ya no se pueden agregar publicaciones ni comentarios.",
  memComment: "Comentar", memCommentPh: "Escribe un comentario…", memNoPosts: "Todavía no hay publicaciones. ¡Sé la primera!",
  memDelete: "Eliminar", memEdit: "Editar", memHide: "Ocultar", memUnhide: "Mostrar", memHiddenBadge: "Oculto",
  memConfirmDelete: "¿Eliminar esto de forma permanente?",
  memConfirmDeleteMemory: "¿Eliminar este recuerdo con TODAS sus fotos, videos y comentarios? No se puede deshacer.",
  memEmojis: "Emojis", memLike: "Me encanta", memGallery: "Todas las fotos y videos", memClose: "Cerrar", memPrev: "Anterior", memNext: "Siguiente",
  memCover: "Usar como portada", memCoverSet: "Portada actualizada.", memPostedWhen: "publicó", memCommentFail: "No se pudo comentar.",
  memHomeLabel: "ÚLTIMO RECUERDO", memHomeCta: "Ver recuerdos", memEventDate: "Fecha del evento",
  memCreate: "Crear recuerdo", memOpen: "Abrir recuerdo", memCreated: "Recuerdo creado.", memHasOne: "Ya tiene recuerdo",
  memAdminTitle: "Recuerdos", memAdminIntro: "Crea un recuerdo desde un evento (pestaña Planes y eventos → Crear recuerdo).",
  memStorage: "Almacenamiento usado (aprox.)", memStorageOf: "de 1 GB incluido en el plan gratuito",
  memPostingLabel: "¿Quién puede publicar?", memPostGoing: "Solo quienes van", memPostMembers: "Todas las miembras aprobadas", memPostClosed: "Cerrado",
  memSaved: "Guardado.", memSaveFail: "No se pudo guardar.", memDeleted: "Eliminado.",
  memFTitleEs: "Título (español)", memFTitleEn: "Título (inglés)", memFDescEs: "Descripción (español)", memFDescEn: "Descripción (inglés)",
  memFLocation: "Lugar", memFCode: "Código", memFDate: "Fecha original del evento", memSave: "Guardar", memCancel: "Cancelar",
  memApprove: "Aprobar", memRevoke: "Quitar aprobación", memApproved: "Aprobada", memPendingBadge: "Pendiente de aprobar",
  memPendingCount: "{n} pendientes de aprobar", memApprovedSaved: "Aprobación actualizada.", memNone: "— Sin código —"
};
const EN = {
  memUpcoming: "Upcoming", memMemories: "Memories", memSwitchLabel: "Upcoming or Memories",
  memTitle: "MEMORIES", memHeading: "Our story together",
  memIntro: "What we've lived together, event by event.",
  memPending: "Your request has reached the administrator and is waiting for approval. Once approved, you'll be able to see and share the group's memories.",
  memEmpty: "No memories yet. When an event is over, the administrator will turn it into a memory.",
  memAll: "All", memBack: "← Back", memNoMedia: "No photos yet",
  memPhoto: "photo", memPhotos: "photos", memVideo: "video", memVideos: "videos", memPost1: "post", memPosts: "posts",
  memAddMemory: "Add memory", memAddPhotos: "Add photos or video", memCaptionPh: "Write something about this day… (optional)",
  memPost: "Post", memUploading: "Uploading {n} of {total}…", memSaving: "Posting…",
  memPostFail: "Could not post. Check your connection and try again.",
  memNeedContent: "Write something or add a photo or video.",
  memTooMany: "Up to {n} photos per post.", memOneVideo: "Only one video per post.",
  memVideoLong: "That video is longer than {n} seconds. Please choose a shorter one.",
  memVideoBig: "That video is larger than {n} MB. Please choose a shorter one.",
  memBadType: "That file isn't supported. Use photos (JPG, PNG, WebP, HEIC) or a short video (MP4 or MOV).",
  memPhotoFail: "One of the photos couldn't be read. Try a JPG or PNG.",
  memLimitsNote: "Up to {p} photos and 1 video of {s} seconds per post.",
  memOnlyGoing: "Only members who marked “Going” can post in this memory. You can still comment and tap ❤️.",
  memClosed: "This memory is closed: new posts and comments can no longer be added.",
  memComment: "Comment", memCommentPh: "Write a comment…", memNoPosts: "No posts yet. Be the first!",
  memDelete: "Delete", memEdit: "Edit", memHide: "Hide", memUnhide: "Unhide", memHiddenBadge: "Hidden",
  memConfirmDelete: "Delete this permanently?",
  memConfirmDeleteMemory: "Delete this memory with ALL its photos, videos and comments? This cannot be undone.",
  memEmojis: "Emojis", memLike: "Love", memGallery: "All photos and videos", memClose: "Close", memPrev: "Previous", memNext: "Next",
  memCover: "Use as cover", memCoverSet: "Cover updated.", memPostedWhen: "posted", memCommentFail: "Could not comment.",
  memHomeLabel: "LATEST MEMORY", memHomeCta: "See memories", memEventDate: "Event date",
  memCreate: "Create memory", memOpen: "Open memory", memCreated: "Memory created.", memHasOne: "Already has a memory",
  memAdminTitle: "Memories", memAdminIntro: "Create a memory from an event (Plans & events tab → Create memory).",
  memStorage: "Storage used (approx.)", memStorageOf: "of the 1 GB included in the free plan",
  memPostingLabel: "Who can post?", memPostGoing: "Only those going", memPostMembers: "All approved members", memPostClosed: "Closed",
  memSaved: "Saved.", memSaveFail: "Could not save.", memDeleted: "Deleted.",
  memFTitleEs: "Title (Spanish)", memFTitleEn: "Title (English)", memFDescEs: "Description (Spanish)", memFDescEn: "Description (English)",
  memFLocation: "Location", memFCode: "Código", memFDate: "Original event date", memSave: "Save", memCancel: "Cancel",
  memApprove: "Approve", memRevoke: "Remove approval", memApproved: "Approved", memPendingBadge: "Waiting for approval",
  memPendingCount: "{n} waiting for approval", memApprovedSaved: "Approval updated.", memNone: "— No code —"
};

let C = null;
let list = [];                 // memories visible to this user
let stats = new Map();         // memory_id -> {photos, videos, posts}
let covers = new Map();        // memory_id -> signed thumbnail URL
let filt = { year: "all", month: "all", code: "all" };
let memMode = false;
let openId = null;
let token = 0;
const urlCache = new Map();    // storage path -> { url, exp }

const t = (key, vars) => {
  let s = C.t(key);
  if (vars) Object.entries(vars).forEach(([k, v]) => { s = s.split("{" + k + "}").join(String(v)); });
  return s;
};
const el = (...args) => C.el(...args);
const host = () => document.getElementById("memoriesView");
const approved = () => !!C && (C.isAdmin() || !!(C.profile() && C.profile().approved));
const uid = () => (C.session() && C.session().user.id) || "";
const btn = (text, cls, handler) => { const b = el("button", { type: "button", class: cls || "", text }); b.addEventListener("click", handler); return b; };
const note = (text, cls) => el("p", { class: cls || "small-note", text });
const plural = (n, one, many) => n + " " + (n === 1 ? t(one) : t(many));

// ---------- dates ----------
function parts(m) {
  const d = m.event_date || String(m.created_at || "").slice(0, 10);
  const [y, mo, da] = d.split("-").map(Number);
  return { y, mo, da, key: y + "-" + String(mo).padStart(2, "0") };
}
function longDate(m) {
  const p = parts(m);
  return new Date(p.y, p.mo - 1, p.da).toLocaleDateString(C.loc(), { year: "numeric", month: "long", day: "numeric" });
}
function stamp(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(C.loc(), { year: "numeric", month: "long", day: "numeric" }) + " • " +
    d.toLocaleTimeString(C.loc(), { hour: "numeric", minute: "2-digit" });
}
const title = m => C.pick(m, "title") || "—";
const codeText = c => (c && C.codeLabels[c]) ? C.t(C.codeLabels[c]) : "";

// ---------- private files: short-lived signed links ----------
async function signed(paths) {
  const need = [...new Set(paths.filter(Boolean))].filter(p => { const c = urlCache.get(p); return !c || c.exp < Date.now() + 60000; });
  if (need.length) {
    const { data } = await C.db.storage.from(BUCKET).createSignedUrls(need, 3600);
    (data || []).forEach(d => { if (d && d.signedUrl) urlCache.set(d.path, { url: d.signedUrl, exp: Date.now() + 3600 * 1000 }); });
  }
  return p => { const c = urlCache.get(p); return c ? c.url : ""; };
}
async function removeFiles(paths) {
  const list = [...new Set(paths.filter(Boolean))];
  for (let i = 0; i < list.length; i += 100) await C.db.storage.from(BUCKET).remove(list.slice(i, i + 100));
}

// ---------- loading ----------
async function refreshApproval() {
  if (!C.session() || C.isAdmin()) return;
  const p = C.profile();
  if (p && p.approved) return;
  const { data } = await C.db.from("profiles").select("approved").eq("id", uid()).maybeSingle();
  if (data && data.approved && p) p.approved = true;
}
async function loadList() {
  const [m, s, med] = await Promise.all([
    C.db.from("memories").select("*").order("event_date", { ascending: false, nullsFirst: false }).order("created_at", { ascending: false }),
    C.db.rpc("memory_stats"),
    C.db.from("memory_media").select("id,memory_id,path,thumb_path,created_at").eq("kind", "photo").eq("hidden", false)
      .order("created_at", { ascending: false }).limit(400)
  ]);
  if (m.error) throw m.error;
  list = m.data || [];
  stats = new Map((s.data || []).map(r => [r.memory_id, { photos: Number(r.photos), videos: Number(r.videos), posts: Number(r.posts) }]));
  const media = med.data || [];
  const first = new Map();
  media.forEach(r => { if (!first.has(r.memory_id)) first.set(r.memory_id, r); });
  const paths = new Map();
  list.forEach(mm => {
    const c = (mm.cover_media_id && media.find(x => x.id === mm.cover_media_id)) || first.get(mm.id);
    if (c) paths.set(mm.id, c.thumb_path || c.path);
  });
  const get = await signed([...paths.values()]);
  covers = new Map([...paths].map(([id, p]) => [id, get(p)]));
}

// ---------- timeline ----------
function setMode(on) {
  memMode = on;
  const ev = document.getElementById("events");
  if (ev) ev.classList.toggle("mem-mode", on);
  const up = document.getElementById("segUpcoming"), me = document.getElementById("segMemories");
  if (up && me) {
    up.classList.toggle("active", !on); up.setAttribute("aria-pressed", String(!on));
    me.classList.toggle("active", on); me.setAttribute("aria-pressed", String(on));
  }
  const v = host();
  if (v) v.hidden = !on;
  if (on) { if (openId) openAlbum(openId); else showList(); }
}
async function showList() {
  const tk = ++token; openId = null;
  const v = host(); if (!v || !C.session()) return;
  v.replaceChildren(note(t("loading")));
  try { await refreshApproval(); } catch { /* ignore */ }
  if (!approved()) return v.replaceChildren(el("div", { class: "card" }, el("p", { text: t("memPending") })));
  try { await loadList(); } catch { if (tk === token) v.replaceChildren(note(t("loadError"), "form-feedback")); return; }
  if (tk === token) paintList();
}
function statsLine(id) {
  const s = stats.get(id) || { photos: 0, videos: 0 };
  const bits = [];
  if (s.photos) bits.push(plural(s.photos, "memPhoto", "memPhotos"));
  if (s.videos) bits.push(plural(s.videos, "memVideo", "memVideos"));
  return bits.length ? bits.join(" • ") : t("memNoMedia");
}
function paintList() {
  const v = host(); if (!v) return;
  const years = [...new Set(list.map(m => parts(m).y))].sort((a, b) => b - a);
  if (filt.year !== "all" && !years.includes(Number(filt.year))) filt.year = "all";
  const inYear = list.filter(m => filt.year === "all" || parts(m).y === Number(filt.year));
  const months = [...new Set(inYear.map(m => parts(m).key))].sort().reverse();
  if (filt.month !== "all" && !months.includes(filt.month)) filt.month = "all";
  const codes = [...new Set(list.map(m => m.code).filter(Boolean))];
  if (filt.code !== "all" && !codes.includes(filt.code)) filt.code = "all";

  const chip = (label, selected, handler) => {
    const b = el("button", { type: "button", class: "chip" + (selected ? " selected" : ""), "aria-pressed": String(selected), text: label });
    b.addEventListener("click", handler); return b;
  };
  const rows = [];
  if (years.length > 1) rows.push(el("div", { class: "chips" }, chip(t("memAll"), filt.year === "all", () => { filt.year = "all"; filt.month = "all"; paintList(); }),
    years.map(y => chip(String(y), filt.year === String(y), () => { filt.year = String(y); filt.month = "all"; paintList(); }))));
  if (filt.year !== "all" && months.length > 1) rows.push(el("div", { class: "chips" }, chip(t("memAll"), filt.month === "all", () => { filt.month = "all"; paintList(); }),
    months.map(k => chip(C.monthLabel(k).replace(/\s*\d{4}$/, ""), filt.month === k, () => { filt.month = k; paintList(); }))));
  if (codes.length > 1) rows.push(el("div", { class: "chips" }, chip(t("memAll"), filt.code === "all", () => { filt.code = "all"; paintList(); }),
    codes.map(c => chip(codeText(c), filt.code === c, () => { filt.code = c; paintList(); }))));

  const shown = inYear.filter(m => (filt.month === "all" || parts(m).key === filt.month) && (filt.code === "all" || m.code === filt.code));
  const body = el("div", { class: "mem-timeline" });
  if (!list.length) body.appendChild(note(t("memEmpty")));
  let lastY = null, lastK = null;
  shown.forEach(m => {
    const p = parts(m);
    if (p.y !== lastY) { body.appendChild(el("h3", { class: "mem-year", text: String(p.y) })); lastY = p.y; lastK = null; }
    if (p.key !== lastK) { body.appendChild(el("h4", { class: "mem-month", text: C.monthLabel(p.key).replace(/\s*\d{4}$/, "") })); lastK = p.key; }
    const cover = covers.get(m.id);
    const card = el("button", { type: "button", class: "mem-card" },
      cover ? el("img", { src: cover, alt: "", loading: "lazy" }) : el("span", { class: "mem-ph", text: (codeText(m.code).split(" ")[0]) || "📷", "aria-hidden": "true" }),
      el("span", { class: "mem-card-body" },
        m.code ? el("small", { class: "rose", text: codeText(m.code) }) : null,
        el("b", { text: title(m) }),
        el("span", { class: "meta-line", text: longDate(m) }),
        el("span", { class: "meta-line", text: statsLine(m.id) }),
        m.hidden ? el("span", { class: "badge", text: t("memHiddenBadge") }) : null));
    card.addEventListener("click", () => openAlbum(m.id));
    body.appendChild(card);
  });
  v.replaceChildren(el("small", { class: "rose", text: t("memTitle") }), el("h2", { text: t("memHeading") }), note(t("memIntro")), ...rows, body);
}

// ---------- home card ----------
function renderHome() {
  const card = document.getElementById("homeMemory");
  if (!card) return;
  const m = list[0];
  if (!C || !C.session() || !approved() || !m) { card.hidden = true; card.replaceChildren(); return; }
  card.hidden = false;
  const go = el("button", { type: "button", class: "mem-home-btn" },
    el("span", {},
      el("small", { class: "rose", text: t("memHomeLabel") }),
      el("b", { text: (codeText(m.code).split(" ")[0] ? codeText(m.code).split(" ")[0] + " " : "") + title(m) }),
      el("span", { class: "meta-line", text: longDate(m) + " · " + statsLine(m.id) }),
      el("span", { class: "link-btn", text: t("memHomeCta") + " →" })));
  go.addEventListener("click", () => { C.showPage("events", false); openId = m.id; setMode(true); });
  card.replaceChildren(go);
}

// ---------- album ----------
let A = null;   // current album data
async function openAlbum(id) {
  const tk = ++token; openId = id;
  const v = host(); if (!v) return;
  v.replaceChildren(note(t("loading")));
  try {
    const mm = await C.db.from("memories").select("*").eq("id", id).maybeSingle();
    if (mm.error || !mm.data) throw new Error("memory");
    const m = mm.data;
    const [posts, media, comments, going] = await Promise.all([
      C.db.from("memory_posts").select("*").eq("memory_id", id).order("created_at", { ascending: false }),
      C.db.from("memory_media").select("*").eq("memory_id", id).order("created_at", { ascending: true }),
      C.db.from("memory_comments").select("*").eq("memory_id", id).order("created_at", { ascending: true }),
      m.plan_id ? C.db.from("responses").select("status").eq("plan_id", m.plan_id).eq("user_id", uid()).maybeSingle() : Promise.resolve({ data: null })
    ]);
    if (posts.error || media.error || comments.error) throw new Error("load");
    const ids = (posts.data || []).map(p => p.id);
    const re = ids.length ? await C.db.from("memory_reactions").select("post_id,user_id,emoji").in("post_id", ids) : { data: [] };
    const goingYes = !!(going.data && going.data.status === "going");
    A = {
      m, posts: posts.data || [], media: media.data || [], comments: comments.data || [], reactions: re.data || [],
      canPost: C.isAdmin() || (!m.hidden && (m.posting === "members" || (m.posting === "going" && goingYes))),
      canInteract: C.isAdmin() || (!m.hidden && m.posting !== "closed"),
      closed: m.posting === "closed", going: goingYes
    };
    const get = await signed(A.media.flatMap(x => [x.thumb_path, x.kind === "photo" && !x.thumb_path ? x.path : ""]));
    A.url = get;
    if (tk !== token) return;
    paintAlbum();
  } catch (e) {
    console.error(e);
    if (tk === token) v.replaceChildren(btn(t("memBack"), "link-btn", showList), note(t("loadError"), "form-feedback"));
  }
}
function repaintAlbum() { return openAlbum(A.m.id); }

function paintAlbum() {
  const v = host(); const m = A.m;
  const head = el("div", { class: "mem-head card" },
    m.code ? el("small", { class: "rose", text: codeText(m.code) }) : null,
    el("h2", { text: title(m) }),
    el("p", { class: "meta-line", text: "📅 " + longDate(m) }),
    m.location ? el("p", { class: "meta-line", text: "📍 " + m.location }) : null,
    C.pick(m, "desc") ? el("p", { class: "saved-text", text: C.pick(m, "desc") }) : null,
    el("p", { class: "meta-line", text: statsLine(m.id) }),
    m.hidden ? el("span", { class: "badge", text: t("memHiddenBadge") }) : null);
  if (C.isAdmin()) head.appendChild(adminBar());

  const feed = el("div", { class: "mem-feed" });
  paintFeed(feed);

  const gallery = galleryNode();
  v.replaceChildren(btn(t("memBack"), "link-btn", showList), head, composerNode(), gallery, feed);
}

function adminBar() {
  const m = A.m;
  const select = el("select", { "aria-label": t("memPostingLabel") },
    el("option", { value: "going", text: t("memPostGoing") }), el("option", { value: "members", text: t("memPostMembers") }), el("option", { value: "closed", text: t("memPostClosed") }));
  select.value = m.posting;
  select.addEventListener("change", async () => {
    const r = await C.db.from("memories").update({ posting: select.value }).eq("id", m.id);
    if (r.error) return C.announce("memSaveFail");
    C.announce("memSaved"); repaintAlbum();
  });
  const editBox = el("div");
  const bar = el("div", { class: "mem-admin" },
    el("label", {}, t("memPostingLabel"), select),
    el("div", { class: "actions" },
      btn(t("memEdit"), "", () => { editBox.firstChild ? editBox.replaceChildren() : editBox.replaceChildren(editForm()); }),
      btn(m.hidden ? t("memUnhide") : t("memHide"), "", async () => {
        const r = await C.db.from("memories").update({ hidden: !m.hidden }).eq("id", m.id);
        if (r.error) return C.announce("memSaveFail");
        C.announce("memSaved"); repaintAlbum();
      }),
      btn(t("memDelete"), "danger", async () => {
        if (!window.confirm(t("memConfirmDeleteMemory"))) return;
        await deleteMemory(m.id); C.announce("memDeleted"); showList();
      })),
    editBox);
  return bar;
}
function editForm() {
  const m = A.m;
  const inp = (type, value, attrs = {}) => el("input", Object.assign({ type, value: value || "" }, attrs));
  const f = {
    title_es: inp("text", m.title_es, { maxlength: 140 }), title_en: inp("text", m.title_en, { maxlength: 140 }),
    desc_es: el("textarea"), desc_en: el("textarea"), location: inp("text", m.location, { maxlength: 200 }),
    event_date: inp("date", m.event_date || ""),
    code: el("select", {}, el("option", { value: "", text: t("memNone") }), Object.keys(C.codeLabels).map(c => el("option", { value: c, text: codeText(c) })))
  };
  f.desc_es.value = m.desc_es || ""; f.desc_en.value = m.desc_en || ""; f.code.value = m.code || "";
  const L = (key, node) => el("label", {}, t(key), node);
  const form = el("form", { class: "admin-form", novalidate: true },
    L("memFCode", f.code), L("memFTitleEs", f.title_es), L("memFTitleEn", f.title_en), L("memFDescEs", f.desc_es), L("memFDescEn", f.desc_en),
    L("memFLocation", f.location), L("memFDate", f.event_date),
    el("div", { class: "actions" }, el("button", { type: "submit", class: "primary", text: t("memSave") })));
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const row = { title_es: f.title_es.value.trim(), title_en: f.title_en.value.trim(), desc_es: f.desc_es.value.trim(), desc_en: f.desc_en.value.trim(),
      location: f.location.value.trim(), event_date: f.event_date.value || null, code: f.code.value || null };
    const r = await C.db.from("memories").update(row).eq("id", m.id);
    if (r.error) return C.announce("memSaveFail");
    C.announce("memSaved"); repaintAlbum();
  });
  return form;
}
async function deleteMemory(id) {
  const { data } = await C.db.from("memory_media").select("path,thumb_path").eq("memory_id", id);
  const r = await C.db.from("memories").delete().eq("id", id);
  if (r.error) throw r.error;
  await removeFiles((data || []).flatMap(x => [x.path, x.thumb_path])).catch(() => {});
}

// ---------- gallery (all media) + lightbox ----------
function mediaTile(x, onOpen) {
  const src = x.thumb_path ? A.url(x.thumb_path) : (x.kind === "photo" ? A.url(x.path) : "");
  const tile = el("button", { type: "button", class: "mem-tile", "aria-label": x.kind === "video" ? t("memVideo") : t("memPhoto") },
    src ? el("img", { src, alt: x.caption || "", loading: "lazy" }) : el("span", { class: "mem-ph", text: "🎬", "aria-hidden": "true" }),
    x.kind === "video" ? el("span", { class: "mem-play", text: "▶", "aria-hidden": "true" }) : null,
    x.hidden ? el("span", { class: "badge", text: t("memHiddenBadge") }) : null);
  tile.addEventListener("click", onOpen);
  return tile;
}
function galleryNode() {
  const items = A.media;
  if (!items.length) return el("div");
  const box = el("details", { class: "more mem-gallery" }, el("summary", { text: "🖼️ " + t("memGallery") + " (" + items.length + ")" }),
    el("div", { class: "mem-grid" }, items.map((x, i) => mediaTile(x, () => lightbox(items, i)))));
  return box;
}
let lb = null;
async function lightbox(items, index) {
  closeLightbox();
  let i = index;
  const img = el("img", { alt: "" });
  const vid = el("video", { controls: true, playsinline: true, preload: "metadata" });
  const caption = el("p", { class: "lb-cap" });
  const tools = el("div", { class: "lb-tools" });
  const stage = el("div", { class: "lb-stage" }, img, vid);
  const close = btn("✕", "lb-close", closeLightbox); close.setAttribute("aria-label", t("memClose"));
  const prev = btn("‹", "lb-nav lb-prev", () => go(-1)); prev.setAttribute("aria-label", t("memPrev"));
  const next = btn("›", "lb-nav lb-next", () => go(1)); next.setAttribute("aria-label", t("memNext"));
  const root = el("div", { class: "lightbox", role: "dialog", "aria-modal": "true" }, close, prev, stage, next, caption, tools);
  const onKey = e => { if (e.key === "Escape") closeLightbox(); else if (e.key === "ArrowLeft") go(-1); else if (e.key === "ArrowRight") go(1); };
  document.addEventListener("keydown", onKey);
  lb = { root, onKey, vid };
  root.addEventListener("click", e => { if (e.target === root || e.target === stage) closeLightbox(); });
  document.body.appendChild(root);
  document.body.classList.add("lb-open");
  async function show() {
    const x = items[i];
    prev.hidden = next.hidden = items.length < 2;
    img.hidden = vid.hidden = true; vid.pause();
    caption.textContent = x.caption || "";
    const get = await signed([x.path]);
    if (!lb || lb.root !== root) return;
    if (x.kind === "video") { vid.src = get(x.path); vid.hidden = false; }
    else { img.src = get(x.path); img.hidden = false; }
    tools.replaceChildren();
    if (C.isAdmin() && x.kind === "photo") {
      tools.appendChild(btn(t("memCover"), "", async () => {
        const r = await C.db.from("memories").update({ cover_media_id: x.id }).eq("id", A.m.id);
        C.announce(r.error ? "memSaveFail" : "memCoverSet");
      }));
    }
    if (C.isAdmin() || x.user_id === uid()) {
      tools.appendChild(btn(t("memDelete"), "danger", async () => {
        if (!window.confirm(t("memConfirmDelete"))) return;
        const r = await C.db.from("memory_media").delete().eq("id", x.id);
        if (r.error) return C.announce("memSaveFail");
        await removeFiles([x.path, x.thumb_path]).catch(() => {});
        closeLightbox(); repaintAlbum();
      }));
    }
  }
  function go(d) { i = (i + d + items.length) % items.length; show(); }
  show();
}
function closeLightbox() {
  if (!lb) return;
  document.removeEventListener("keydown", lb.onKey);
  try { lb.vid.pause(); } catch { /* ignore */ }
  lb.root.remove(); lb = null;
  document.body.classList.remove("lb-open");
}

// ---------- feed: posts, hearts, comments ----------
function paintFeed(feed) {
  feed.replaceChildren();
  if (!A.posts.length) { feed.appendChild(note(t("memNoPosts"))); return; }
  A.posts.forEach(p => feed.appendChild(postNode(p)));
}
function postNode(p) {
  const media = A.media.filter(x => x.post_id === p.id);
  const mine = p.user_id === uid();
  const card = el("article", { class: "card mem-post" },
    el("div", { class: "mem-post-head" }, el("b", { text: p.author_name || "—" }), el("span", { class: "meta-line", text: t("memPostedWhen") + " · " + stamp(p.created_at) }),
      p.hidden ? el("span", { class: "badge", text: t("memHiddenBadge") }) : null));
  if (p.body) card.appendChild(el("p", { class: "saved-text", text: p.body }));
  if (media.length) card.appendChild(el("div", { class: "mem-grid" }, media.map((x, i) => mediaTile(x, () => lightbox(media, i)))));

  // Emoji reactions: each member can add any of the emojis once per post (the database also enforces it)
  const react = el("div", { class: "resp-row mem-react", role: "group", "aria-label": t("memLike") });
  const paintReact = () => {
    react.replaceChildren(...EMOJIS.map(em => {
      const rows = A.reactions.filter(r => r.post_id === p.id && (r.emoji || "❤️") === em);
      const on = rows.some(r => r.user_id === uid());
      const b = el("button", { type: "button", class: "resp mem-heart" + (on ? " on" : ""), "aria-pressed": String(on), text: em + (rows.length ? " " + rows.length : "") });
      b.disabled = !A.canInteract;
      b.addEventListener("click", async () => {
        if (!A.canInteract) return;
        if (on) {
          A.reactions = A.reactions.filter(r => !(r.post_id === p.id && r.user_id === uid() && (r.emoji || "❤️") === em)); paintReact();
          const r = await C.db.from("memory_reactions").delete().eq("post_id", p.id).eq("user_id", uid()).eq("emoji", em);
          if (r.error) { A.reactions.push({ post_id: p.id, user_id: uid(), emoji: em }); paintReact(); }
        } else {
          A.reactions.push({ post_id: p.id, user_id: uid(), emoji: em }); paintReact();
          const r = await C.db.from("memory_reactions").insert({ post_id: p.id, emoji: em });
          if (r.error && r.error.code !== "23505") { A.reactions = A.reactions.filter(x => !(x.post_id === p.id && x.user_id === uid() && x.emoji === em)); paintReact(); }
        }
      });
      return b;
    }));
  };
  paintReact();
  card.appendChild(react);

  const actions = el("div", { class: "actions" });
  if (mine || C.isAdmin()) actions.appendChild(btn(t("memDelete"), "danger", async () => {
    if (!window.confirm(t("memConfirmDelete"))) return;
    const files = media.flatMap(x => [x.path, x.thumb_path]);
    const r = await C.db.from("memory_posts").delete().eq("id", p.id);
    if (r.error) return C.announce("memSaveFail");
    await removeFiles(files).catch(() => {});
    repaintAlbum();
  }));
  if (C.isAdmin()) actions.appendChild(btn(p.hidden ? t("memUnhide") : t("memHide"), "", async () => {
    const r = await C.db.from("memory_posts").update({ hidden: !p.hidden }).eq("id", p.id);
    if (r.error) return C.announce("memSaveFail");
    repaintAlbum();
  }));
  card.appendChild(actions);

  // comments
  const box = el("div", { class: "mem-comments" });
  const paintComments = () => {
    box.replaceChildren(...A.comments.filter(c => c.post_id === p.id).map(c => {
      const own = c.user_id === uid();
      const row = el("div", { class: "mem-comment" },
        el("p", {}, el("b", { text: (c.author_name || "—") + ": " }), c.body),
        el("small", { class: "meta-line", text: stamp(c.created_at) }));
      if (c.hidden) row.appendChild(el("span", { class: "badge", text: t("memHiddenBadge") }));
      if (own || C.isAdmin()) row.appendChild(btn(t("memDelete"), "link-btn", async () => {
        const r = await C.db.from("memory_comments").delete().eq("id", c.id);
        if (r.error) return C.announce("memSaveFail");
        A.comments = A.comments.filter(x => x.id !== c.id); paintComments();
      }));
      if (C.isAdmin()) row.appendChild(btn(c.hidden ? t("memUnhide") : t("memHide"), "link-btn", async () => {
        const r = await C.db.from("memory_comments").update({ hidden: !c.hidden }).eq("id", c.id);
        if (r.error) return C.announce("memSaveFail");
        c.hidden = !c.hidden; paintComments();
      }));
      return row;
    }));
  };
  paintComments();
  card.appendChild(box);
  if (A.canInteract) {
    const input = el("input", { type: "text", maxlength: 500, placeholder: t("memCommentPh"), "aria-label": t("memCommentPh") });
    const send = el("button", { type: "submit", class: "primary", text: t("memComment") });
    const bar = emojiBar(input); bar.hidden = true;
    const face = btn("😊", "mem-face", () => { bar.hidden = !bar.hidden; face.setAttribute("aria-expanded", String(!bar.hidden)); });
    face.setAttribute("aria-label", t("memEmojis")); face.setAttribute("aria-expanded", "false");
    const form = el("form", { class: "mem-comment-form" }, face, input, send);
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const body = input.value.trim();
      if (!body) return;
      send.disabled = true;
      const r = await C.db.from("memory_comments").insert({ post_id: p.id, memory_id: A.m.id, body }).select().single();
      send.disabled = false;
      if (r.error) return C.announce("memCommentFail");
      A.comments.push(r.data); input.value = ""; paintComments();
    });
    card.appendChild(form); card.appendChild(bar);
  }
  return card;
}

// ---------- composer: choose photos/video → optional caption → Post ----------
function composerNode() {
  if (!A.canPost) {
    return el("div", { class: "note" }, A.closed ? t("memClosed") : t("memOnlyGoing"));
  }
  let staged = [];     // { file, kind, preview, duration }
  const text = el("textarea", { maxlength: 1000, placeholder: t("memCaptionPh"), "aria-label": t("memCaptionPh") });
  const file = el("input", { type: "file", accept: "image/*,video/mp4,video/quicktime,video/webm", multiple: true, class: "mem-file" });
  const capBar = emojiBar(text); capBar.hidden = true;
  const capFace = btn("😊 " + t("memEmojis"), "mem-face-wide", () => { capBar.hidden = !capBar.hidden; });
  const label = el("label", { class: "mem-addfiles" }, "📷 " + t("memAddPhotos"), file);
  const previews = el("div", { class: "mem-previews" });
  const status = el("p", { class: "small-note", role: "status" });
  const feedback = el("p", { class: "form-feedback", role: "alert" });
  const post = el("button", { type: "submit", class: "primary", text: t("memPost") });
  const form = el("form", { class: "card mem-composer", novalidate: true },
    el("b", { text: t("memAddMemory") }), text, capFace, capBar, label, previews,
    note(t("memLimitsNote", { p: LIMITS.maxPhotos, s: LIMITS.maxVideoSec })), feedback, status, post);

  const paintPreviews = () => {
    previews.replaceChildren(...staged.map((s, i) => {
      const item = el("div", { class: "mem-prev" },
        s.kind === "photo" ? el("img", { src: s.preview, alt: "" }) : el("span", { class: "mem-ph", text: "🎬" }));
      const x = btn("✕", "mem-prev-x", () => { URL.revokeObjectURL(s.preview); staged.splice(i, 1); paintPreviews(); });
      x.setAttribute("aria-label", t("memDelete"));
      item.appendChild(x);
      return item;
    }));
  };
  file.addEventListener("change", async () => {
    feedback.textContent = "";
    for (const f of [...file.files]) {
      try {
        if (f.type && f.type.startsWith("image/")) {
          if (staged.filter(s => s.kind === "photo").length >= LIMITS.maxPhotos) { feedback.textContent = t("memTooMany", { n: LIMITS.maxPhotos }); continue; }
          staged.push({ file: f, kind: "photo", preview: URL.createObjectURL(f) });
        } else if (/^video\/(mp4|quicktime|webm)$/.test(f.type)) {
          if (staged.some(s => s.kind === "video")) { feedback.textContent = t("memOneVideo"); continue; }
          if (f.size > LIMITS.maxVideoMB * 1024 * 1024) { feedback.textContent = t("memVideoBig", { n: LIMITS.maxVideoMB }); continue; }
          const duration = await videoDuration(f);
          if (duration > LIMITS.maxVideoSec + 0.5) { feedback.textContent = t("memVideoLong", { n: LIMITS.maxVideoSec }); continue; }
          staged.push({ file: f, kind: "video", preview: "", duration: Math.round(duration) });
        } else feedback.textContent = t("memBadType");
      } catch { feedback.textContent = t("memBadType"); }
    }
    file.value = ""; paintPreviews();
  });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    feedback.textContent = "";
    const body = text.value.trim();
    if (!body && !staged.length) { feedback.textContent = t("memNeedContent"); return; }
    post.disabled = true; file.disabled = true;
    status.textContent = t("memSaving");
    const uploaded = [];
    let postId = null;
    try {
      const ins = await C.db.from("memory_posts").insert({ memory_id: A.m.id, body }).select("id").single();
      if (ins.error) throw ins.error;
      postId = ins.data.id;
      for (let n = 0; n < staged.length; n++) {
        const s = staged[n];
        status.textContent = t("memUploading", { n: n + 1, total: staged.length });
        const base = A.m.id + "/" + uid() + "/" + uuid();
        let row;
        if (s.kind === "photo") {
          const img = await processPhoto(s.file);
          await upload(base + ".jpg", img.full, "image/jpeg", uploaded);
          await upload(base + "-t.jpg", img.thumb, "image/jpeg", uploaded);
          row = { kind: "photo", path: base + ".jpg", thumb_path: base + "-t.jpg", size_bytes: img.full.size, width: img.w, height: img.h };
        } else {
          const ext = s.file.type === "video/quicktime" ? "mov" : s.file.type === "video/webm" ? "webm" : "mp4";
          await upload(base + "." + ext, s.file, s.file.type, uploaded);
          const thumb = await videoThumb(s.file).catch(() => null);
          let thumbPath = "";
          if (thumb) { await upload(base + "-t.jpg", thumb, "image/jpeg", uploaded); thumbPath = base + "-t.jpg"; }
          row = { kind: "video", path: base + "." + ext, thumb_path: thumbPath, size_bytes: s.file.size, duration_s: s.duration };
        }
        const m = await C.db.from("memory_media").insert(Object.assign({ memory_id: A.m.id, post_id: postId }, row));
        if (m.error) throw m.error;
      }
      staged.forEach(s => s.preview && URL.revokeObjectURL(s.preview));
      await repaintAlbum();
    } catch (err) {
      console.error(err);
      // all-or-nothing: remove what was uploaded and the half-made post
      if (uploaded.length) await removeFiles(uploaded).catch(() => {});
      if (postId) await C.db.from("memory_posts").delete().eq("id", postId);
      feedback.textContent = err && err.message === "photo" ? t("memPhotoFail") : t("memPostFail");
      status.textContent = "";
      post.disabled = false; file.disabled = false;
    }
  });
  return form;
}
const EMOJIS = ["❤️", "😂", "😍", "👏", "🔥", "🥂"];
const PICKER = ["❤️", "😍", "😂", "🥰", "👏", "🔥", "🥂", "🎉", "✨", "🙏", "💃", "🌸", "😊", "🤗", "💖", "🍷"];
// small row of emoji buttons that inserts at the cursor of an input/textarea
function emojiBar(field) {
  const bar = el("div", { class: "mem-emojis", role: "group", "aria-label": t("memEmojis") });
  PICKER.forEach(em => {
    const b = el("button", { type: "button", class: "mem-emoji", text: em, "aria-label": em });
    b.addEventListener("mousedown", e => e.preventDefault());
    b.addEventListener("click", () => {
      const max = Number(field.getAttribute("maxlength")) || 1e9;
      if (field.value.length + em.length > max) return;
      const st = field.selectionStart == null ? field.value.length : field.selectionStart, en = field.selectionEnd == null ? st : field.selectionEnd;
      field.value = field.value.slice(0, st) + em + field.value.slice(en);
      field.focus(); try { field.setSelectionRange(st + em.length, st + em.length); } catch { /* ignore */ }
    });
    bar.appendChild(b);
  });
  return bar;
}
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
async function upload(path, blob, type, uploaded) {
  const r = await C.db.storage.from(BUCKET).upload(path, blob, { contentType: type, cacheControl: "3600", upsert: false });
  if (r.error) throw r.error;
  uploaded.push(path);
}
async function toJpeg(bitmap, max, quality, source) {
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(source || bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise((res, rej) => canvas.toBlob(b => b ? res(b) : rej(new Error("blob")), "image/jpeg", quality));
  return { blob, w: canvas.width, h: canvas.height };
}
async function processPhoto(file) {
  let bitmap;
  try { bitmap = await createImageBitmap(file, { imageOrientation: "from-image" }); }
  catch { throw new Error("photo"); }
  const full = await toJpeg(bitmap, LIMITS.photoPx, 0.82);
  const thumb = await toJpeg(bitmap, LIMITS.thumbPx, 0.7);
  if (bitmap.close) bitmap.close();
  return { full: full.blob, thumb: thumb.blob, w: full.w, h: full.h };
}
function videoDuration(file) {
  return new Promise((resolve, reject) => {
    const v = document.createElement("video"); const url = URL.createObjectURL(file);
    v.preload = "metadata"; v.muted = true;
    v.onloadedmetadata = () => { const d = v.duration; URL.revokeObjectURL(url); isFinite(d) ? resolve(d) : reject(new Error("dur")); };
    v.onerror = () => { URL.revokeObjectURL(url); reject(new Error("video")); };
    v.src = url;
  });
}
function videoThumb(file) {
  return new Promise((resolve, reject) => {
    const v = document.createElement("video"); const url = URL.createObjectURL(file);
    v.muted = true; v.playsInline = true; v.preload = "auto";
    const done = (fn, val) => { URL.revokeObjectURL(url); fn(val); };
    v.onloadeddata = () => { v.currentTime = Math.min(0.5, (v.duration || 1) / 2); };
    v.onseeked = async () => {
      try {
        if (!v.videoWidth) throw new Error("video");
        v.width = v.videoWidth; v.height = v.videoHeight;
        const r = await toJpeg({ width: v.videoWidth, height: v.videoHeight }, LIMITS.thumbPx, 0.7, v);
        done(resolve, r.blob);
      } catch (e) { done(reject, e); }
    };
    v.onerror = () => done(reject, new Error("video"));
    setTimeout(() => done(reject, new Error("timeout")), 8000);
    v.src = url;
  });
}

// ---------- admin helpers used by admin.js ----------
async function planMemoryIds() {
  const { data } = await C.db.from("memories").select("id,plan_id");
  return new Map((data || []).filter(r => r.plan_id).map(r => [r.plan_id, r.id]));
}
async function createFromPlan(plan) {
  const row = {
    plan_id: plan.id, code: plan.code || null, title_es: plan.title_es, title_en: plan.title_en,
    desc_es: plan.desc_es, desc_en: plan.desc_en, event_date: plan.event_date || null,
    location: plan.location || "", image_url: plan.image_url || ""
  };
  const r = await C.db.from("memories").insert(row).select("id").single();
  return r;
}
async function adminView(helpers) {
  const [m, med, pend] = await Promise.all([
    C.db.from("memories").select("*").order("event_date", { ascending: false, nullsFirst: false }),
    C.db.from("memory_media").select("size_bytes"),
    C.db.from("profiles").select("id", { count: "exact", head: true }).eq("approved", false).eq("rejected", false).eq("role", "member")
  ]);
  if (m.error) throw m.error;
  const bytes = (med.data || []).reduce((s, x) => s + (x.size_bytes || 0), 0);
  const mb = bytes / 1048576;
  const wrap = el("div");
  wrap.appendChild(note(t("memAdminIntro")));
  wrap.appendChild(el("div", { class: "admin-item" },
    el("b", { text: t("memStorage") + ": " + (mb < 10 ? mb.toFixed(1) : Math.round(mb)) + " MB" }),
    el("p", { class: "small-note", text: "≈ " + (mb / 1024 * 100).toFixed(1) + "% " + t("memStorageOf") }),
    pend.count ? el("p", { class: "small-note", text: "⏳ " + t("memPendingCount", { n: pend.count }) }) : null));
  if (!(m.data || []).length) wrap.appendChild(note(helpers.empty));
  (m.data || []).forEach(mm => wrap.appendChild(el("div", { class: "admin-item" },
    mm.hidden ? el("span", { class: "badge", text: t("memHiddenBadge") }) : null,
    mm.code ? el("span", { class: "badge", text: " " + codeText(mm.code) }) : null,
    el("h3", { text: title(mm) }),
    el("p", { class: "small-note", text: "📅 " + longDate(mm) + (mm.location ? " · 📍 " + mm.location : "") }),
    el("div", { class: "actions" }, btn(t("memOpen"), "", () => openMemory(mm.id))))));
  return wrap;
}
function openMemory(id) { C.showPage("events", false); openId = id; setMode(true); }

// ---------- start-up ----------
function init() {
  C = window.CML;
  if (!C) return;
  C.addStrings(ES, EN);
  const up = document.getElementById("segUpcoming"), me = document.getElementById("segMemories");
  if (up) up.addEventListener("click", () => { closeLightbox(); setMode(false); });
  if (me) me.addEventListener("click", () => { openId = null; setMode(true); });
  window.CMLMem = { planMemoryIds, createFromPlan, adminView, openMemory, approved };
  document.addEventListener("cml:session", async () => {
    list = []; stats = new Map(); covers = new Map(); openId = null; A = null; closeLightbox();
    if (!C.session()) { setMode(false); renderHome(); return; }
    try { await refreshApproval(); if (approved()) await loadList(); } catch { /* shown when opened */ }
    renderHome();
    if (memMode) { openId ? openAlbum(openId) : showList(); }
  });
  document.addEventListener("cml:lang", () => {
    renderHome();
    if (!C.session()) return;
    if (memMode) { if (openId && A) paintAlbum(); else if (approved() && list.length) paintList(); else if (!approved()) showList(); }
  });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
else init();
})();
