// Código Mujer Libre — event chat + Community upgrade (private photos, comments, ❤️).
// Works on top of the existing app (window.CML) and its ES/EN system. All access is enforced by
// Supabase RLS (see supabase/schema.sql, section 14); this file only draws the screens.
(function () {
"use strict";
let C = null;
const BUCKET = "community";
const MAX_PX = 1600;

const ES = {
  chatTitle: "Chat del evento", chatLocked: "Marca «Voy» para entrar al chat de este evento.",
  chatEmpty: "Todavía no hay mensajes. Pregunta algo o organiza cómo llegar.",
  chatPh: "Escribe un mensaje…", chatSend: "Enviar", chatFail: "No se pudo enviar el mensaje.",
  chatLoadFail: "No se pudo cargar el chat.", chatDelete: "Eliminar",
  addPhoto: "📷 Agregar foto (opcional)", removePhoto: "Quitar foto", photoFail: "No se pudo subir la foto.",
  photoBad: "Elige una imagen (JPG, PNG o WebP).", heart: "Me encanta",
  commentsN: "Comentarios", commentPh: "Escribe un comentario…", commentSend: "Comentar",
  commentFail: "No se pudo comentar.", commentDelete: "Eliminar", noComments: "Sé la primera en comentar."
};
const EN = {
  chatTitle: "Event chat", chatLocked: "Mark “Going” to join this event's chat.",
  chatEmpty: "No messages yet. Ask something or plan how to get there.",
  chatPh: "Write a message…", chatSend: "Send", chatFail: "The message could not be sent.",
  chatLoadFail: "The chat could not be loaded.", chatDelete: "Delete",
  addPhoto: "📷 Add a photo (optional)", removePhoto: "Remove photo", photoFail: "The photo could not be uploaded.",
  photoBad: "Please choose an image (JPG, PNG or WebP).", heart: "Love",
  commentsN: "Comments", commentPh: "Write a comment…", commentSend: "Comment",
  commentFail: "The comment could not be posted.", commentDelete: "Delete", noComments: "Be the first to comment."
};

const t = key => (C ? C.t(key) : "") || key;
const el = (...a) => C.el(...a);
const uid = () => (C.session() && C.session().user.id) || "";
const btn = (text, cls, fn) => { const b = el("button", { type: "button", class: cls || "", text }); b.addEventListener("click", fn); return b; };
function when(iso) {
  const d = new Date(iso); if (Number.isNaN(d.getTime())) return "";
  const today = new Date().toDateString() === d.toDateString();
  const time = d.toLocaleTimeString(C.loc(), { hour: "numeric", minute: "2-digit" });
  return today ? time : d.toLocaleDateString(C.loc(), { month: "short", day: "numeric" }) + " · " + time;
}

// ---------- private photos ----------
const urlCache = new Map();
async function signed(paths) {
  const need = [...new Set(paths.filter(Boolean))].filter(p => { const c = urlCache.get(p); return !c || c.exp < Date.now() + 60000; });
  if (need.length) {
    const { data } = await C.db.storage.from(BUCKET).createSignedUrls(need, 3600);
    (data || []).forEach(d => { if (d && d.signedUrl) urlCache.set(d.path, { url: d.signedUrl, exp: Date.now() + 3600 * 1000 }); });
  }
  return p => { const c = urlCache.get(p); return c ? c.url : ""; };
}
async function toJpeg(file) {
  let bmp;
  try { bmp = await createImageBitmap(file, { imageOrientation: "from-image" }); } catch { throw new Error("photo"); }
  const scale = Math.min(1, MAX_PX / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bmp.width * scale)); canvas.height = Math.max(1, Math.round(bmp.height * scale));
  const ctx = canvas.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  if (bmp.close) bmp.close();
  return new Promise((res, rej) => canvas.toBlob(b => b ? res(b) : rej(new Error("photo")), "image/jpeg", 0.82));
}
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
async function uploadPhoto(file) {
  const blob = await toJpeg(file);
  const path = uid() + "/" + uuid() + ".jpg";
  const r = await C.db.storage.from(BUCKET).upload(path, blob, { contentType: "image/jpeg", cacheControl: "3600", upsert: false });
  if (r.error) throw r.error;
  return path;
}
async function removePhoto(path) {
  if (!path) return;
  try { await C.db.storage.from(BUCKET).remove([path]); } catch { /* ignore */ }
}

// ---------- composer: optional photo for a community post ----------
let chosen = null, chosenUrl = "";
function paintChosen() {
  const prev = document.getElementById("postPhotoPrev");
  if (!prev) return;
  prev.replaceChildren();
  if (!chosen) return;
  const img = el("img", { src: chosenUrl, alt: "", class: "post-photo-thumb" });
  prev.append(img, btn("✕ " + t("removePhoto"), "link-btn", () => { clearChosen(); }));
}
function clearChosen() {
  if (chosenUrl) URL.revokeObjectURL(chosenUrl);
  chosen = null; chosenUrl = "";
  const input = document.getElementById("postPhoto"); if (input) input.value = "";
  paintChosen();
}
function takePhoto() { return chosen; }

// ---------- community: hearts, comments, photo per post ----------
const reactions = new Map();   // post_id -> [user_id]
const comments = new Map();    // post_id -> [row]
async function loadExtras(posts) {
  reactions.clear(); comments.clear();
  const ids = posts.map(p => p.id);
  if (!ids.length) return;
  const [r, c] = await Promise.all([
    C.db.from("community_reactions").select("post_id,user_id").in("post_id", ids),
    C.db.from("community_comments").select("*").in("post_id", ids).order("created_at", { ascending: true }),
    signed(posts.map(p => p.photo_path))
  ]);
  (r.data || []).forEach(x => { (reactions.get(x.post_id) || reactions.set(x.post_id, []).get(x.post_id)).push(x.user_id); });
  (c.data || []).forEach(x => { (comments.get(x.post_id) || comments.set(x.post_id, []).get(x.post_id)).push(x); });
}
function photoNode(post) {
  if (!post.photo_path) return null;
  const img = el("img", { class: "post-photo", alt: "", loading: "lazy" });
  const set = u => { if (u) img.src = u; };
  const c = urlCache.get(post.photo_path);
  if (c) set(c.url); else signed([post.photo_path]).then(get => set(get(post.photo_path)));
  return img;
}
function postFooter(post, deleteBtn) {
  const wrap = el("div", { class: "post-footer" });
  const heart = el("button", { type: "button", class: "resp post-heart" });
  const paintHeart = () => {
    const list = reactions.get(post.id) || [];
    const on = list.includes(uid());
    heart.className = "resp post-heart" + (on ? " on" : "");
    heart.setAttribute("aria-pressed", String(on)); heart.setAttribute("aria-label", t("heart"));
    heart.textContent = (on ? "❤️" : "🤍") + (list.length ? " " + list.length : "");
  };
  heart.addEventListener("click", async () => {
    const list = reactions.get(post.id) || [];
    const on = list.includes(uid());
    if (on) {
      reactions.set(post.id, list.filter(u => u !== uid())); paintHeart();
      const r = await C.db.from("community_reactions").delete().eq("post_id", post.id).eq("user_id", uid());
      if (r.error) { reactions.set(post.id, list); paintHeart(); }
    } else {
      reactions.set(post.id, list.concat(uid())); paintHeart();
      const r = await C.db.from("community_reactions").insert({ post_id: post.id });
      if (r.error && r.error.code !== "23505") { reactions.set(post.id, list); paintHeart(); }
    }
  });
  paintHeart();

  const box = el("div", { class: "post-comments" });
  box.hidden = true;
  const toggle = el("button", { type: "button", class: "resp post-comment-toggle" });
  const paintToggle = () => {
    const n = (comments.get(post.id) || []).length;
    toggle.textContent = "💬" + (n ? " " + n : "");
    toggle.setAttribute("aria-label", t("commentsN")); toggle.setAttribute("aria-expanded", String(!box.hidden));
  };
  const paintComments = () => {
    const list = comments.get(post.id) || [];
    const rows = list.map(c => {
      const row = el("div", { class: "post-comment" },
        el("p", {}, el("b", { text: (c.author_name || "—") + ": " }), c.body),
        el("small", { class: "meta-line", text: when(c.created_at) }));
      if (c.user_id === uid() || C.isAdmin()) {
        row.appendChild(btn(t("commentDelete"), "link-btn", async () => {
          const r = await C.db.from("community_comments").delete().eq("id", c.id);
          if (r.error) return C.announce("postFail");
          comments.set(post.id, (comments.get(post.id) || []).filter(x => x.id !== c.id)); paintComments(); paintToggle();
        }));
      }
      return row;
    });
    const input = el("input", { type: "text", maxlength: 500, placeholder: t("commentPh"), "aria-label": t("commentPh") });
    const send = el("button", { type: "submit", class: "primary", text: t("commentSend") });
    const form = el("form", { class: "post-comment-form" }, input, send);
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const body = input.value.trim(); if (!body) return;
      send.disabled = true;
      const r = await C.db.from("community_comments").insert({ post_id: post.id, body }).select().single();
      send.disabled = false;
      if (r.error) return C.announce("postFail");
      comments.set(post.id, (comments.get(post.id) || []).concat(r.data)); paintComments(); paintToggle();
      const again = box.querySelector("input"); if (again) again.focus();
    });
    box.replaceChildren(...(rows.length ? rows : [el("p", { class: "small-note", text: t("noComments") })]), form);
  };
  toggle.addEventListener("click", () => { box.hidden = !box.hidden; if (!box.hidden) paintComments(); paintToggle(); });
  paintToggle();
  const actions = el("div", { class: "resp-row post-actions" }, heart, toggle);
  if (deleteBtn) actions.appendChild(deleteBtn);
  wrap.append(actions, box);
  return wrap;
}

// ---------- event chat ----------
const openChats = new Set();
function chatBlock(plan, status) {
  if (!C || !C.session()) return null;
  const can = C.isAdmin() || status === "going";
  if (!can) return el("p", { class: "small-note chat-locked", text: "💬 " + t("chatLocked") });

  const details = el("details", { class: "event-chat" }, el("summary", { text: "💬 " + t("chatTitle") }));
  const list = el("div", { class: "chat-list", role: "log", "aria-live": "polite" });
  const input = el("input", { type: "text", maxlength: 500, placeholder: t("chatPh"), "aria-label": t("chatPh") });
  const send = el("button", { type: "submit", class: "primary", text: t("chatSend") });
  const feedback = el("p", { class: "form-feedback", role: "alert", hidden: true });
  const form = el("form", { class: "chat-form" }, input, send);
  let rows = [], timer = 0, loaded = false;

  const paint = (stick) => {
    list.replaceChildren(...(rows.length ? rows.map(m => {
      const mine = m.user_id === uid();
      const bubble = el("div", { class: "chat-msg" + (mine ? " mine" : "") },
        el("b", { text: m.author_name || "—" }), el("span", { class: "chat-time", text: when(m.created_at) }),
        el("p", { text: m.body }));
      if (mine || C.isAdmin()) {
        bubble.appendChild(btn(t("chatDelete"), "link-btn chat-del", async () => {
          const r = await C.db.from("event_messages").delete().eq("id", m.id);
          if (r.error) return;
          rows = rows.filter(x => x.id !== m.id); paint(false);
        }));
      }
      return bubble;
    }) : [el("p", { class: "small-note", text: t("chatEmpty") })]));
    if (stick) list.scrollTop = list.scrollHeight;
  };
  async function load(stick) {
    const r = await C.db.from("event_messages").select("*").eq("plan_id", plan.id).order("created_at", { ascending: true }).limit(200);
    if (r.error) { feedback.textContent = t("chatLoadFail"); feedback.hidden = false; return; }
    feedback.hidden = true;
    const changed = !loaded || r.data.length !== rows.length || (r.data.at(-1) || {}).id !== (rows.at(-1) || {}).id;
    rows = r.data; loaded = true;
    if (changed) paint(stick);
  }
  details.addEventListener("toggle", () => {
    if (details.open) {
      openChats.add(plan.id); load(true);
      clearInterval(timer); timer = setInterval(() => { if (!document.hidden && details.isConnected) load(false); else if (!details.isConnected) clearInterval(timer); }, 15000);
    } else { openChats.delete(plan.id); clearInterval(timer); }
  });
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const body = input.value.trim(); if (!body) return;
    send.disabled = true; feedback.hidden = true;
    const r = await C.db.from("event_messages").insert({ plan_id: plan.id, body }).select().single();
    send.disabled = false;
    if (r.error) { feedback.textContent = t("chatFail"); feedback.hidden = false; return; }
    rows = rows.concat(r.data); input.value = ""; paint(true); input.focus();
  });
  details.append(list, feedback, form);
  if (openChats.has(plan.id)) { details.open = true; }
  return details;
}

// ---------- start-up ----------
function init() {
  C = window.CML;
  if (!C) return;
  C.addStrings(ES, EN);
  const input = document.getElementById("postPhoto");
  if (input) input.addEventListener("change", () => {
    const f = input.files && input.files[0];
    if (!f) return;
    if (!/^image\//.test(f.type)) { C.announce("photoBad"); input.value = ""; return; }
    if (chosenUrl) URL.revokeObjectURL(chosenUrl);
    chosen = f; chosenUrl = URL.createObjectURL(f); paintChosen();
  });
  document.addEventListener("cml:session", () => {
    // only wipe on sign-out: the app loads posts BEFORE it announces a new session
    if (!C.session()) { openChats.clear(); urlCache.clear(); reactions.clear(); comments.clear(); clearChosen(); }
  });
  window.CMLSocial = { chatBlock, loadExtras, photoNode, postFooter, uploadPhoto, removePhoto, takePhoto, clearChosen };
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
