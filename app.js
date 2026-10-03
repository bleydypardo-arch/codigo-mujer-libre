// Código Mujer Libre — bilingual app connected to Supabase
(() => {
"use strict";
const SUPABASE_URL = "https://ltuklkfymedhqncwzpks.supabase.co";
const SUPABASE_KEY = "sb_publishable_cmiZ-mhW1wBf6hQuscVp7g_P7Wg4bPh"; // publishable key: safe in the browser
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const translations = {
  es: {
    tagline: "Conecta · Vive · Crece",
    communityLabel: "TU COMUNIDAD",
    heroTitle: "Más conexión. Más vida. Más tú.",
    heroBody: "Un espacio fresco para conectar, salir, crecer y sentirte acompañada.",
    today: "MENSAJE DE HOY",
    dailyQuote: "Haz espacio para lo que también te hace sentir viva.",
    weeklyCode: "¿Cuál es tu código esta semana?",
    social: "🥂 Social",
    wellnessChip: "🌿 Bienestar",
    faith: "🙏 Fe",
    adventure: "✈️ Aventura",
    family: "👨‍👩‍👧 Familia",
    connection: "🤝 Conexión",
    support: "🕊️ Apoyo",
    recharge: "😌 Recargar",
    thisWeek: "Esta semana",
    letsTalk: "HABLEMOS",
    articleTitle: "Volver a hacer amigas de adulta",
    articleBody: "Conversaciones, ideas y recomendaciones para crear conexiones reales.",
    discover: "DESCUBRE",
    eventsTitle: "Planes & Eventos",
    eventsIntro: "Descubre actividades para conectar, compartir y disfrutar juntas.",
    communitySection: "COMUNIDAD",
    communityTitle: "Nuestra comunidad",
    communityIntro: "Conoce mujeres, comparte intereses y crea conexiones reales.",
    anaInterests: "Brunch · Bienestar · Viajes",
    mariaInterests: "Familia · Café · Fe",
    shareSomething: "Comparte algo",
    postPlaceholder: "¿Qué quieres compartir?",
    post: "Publicar",
    messagesLabel: "MENSAJES",
    messagesTitle: "Mensajes",
    messagesIntro: "Escríbenos de forma privada cuando quieras hablar, preguntar o compartir algo.",
    messageAdmin: "Mensaje privado a la administradora",
    wellnessLabel: "BIENESTAR & APOYO",
    yourSpace: "Tu espacio",
    wellnessIntro: "Un lugar para sentirte acompañada, escuchada y conectada.",
    needTalk: "Necesito hablar",
    privateAdmin: "Mensaje privado a la administradora",
    prayer: "Oración",
    prayerSub: "Pide acompañamiento",
    suggestion: "Tengo una sugerencia",
    suggestionSub: "Eventos, temas o ideas",
    familyTitle: "Familia",
    familySub: "Planes y actividades familiares",
    supportNote: "Este espacio ofrece apoyo comunitario y no reemplaza servicios profesionales o de emergencia.",
    home: "Inicio",
    events: "Eventos",
    communityNav: "Comunidad",
    messages: "Mensajes",
    wellness: "Bienestar",
    save: "Guardar"
  },

  en: {
    tagline: "Connect · Live · Grow",
    communityLabel: "YOUR COMMUNITY",
    heroTitle: "More connection. More life. More you.",
    heroBody: "A fresh space to connect, go out, grow and feel supported.",
    today: "TODAY'S MESSAGE",
    dailyQuote: "Make room for what also makes you feel alive.",
    weeklyCode: "What's your code this week?",
    social: "🥂 Social",
    wellnessChip: "🌿 Wellness",
    faith: "🙏 Faith",
    adventure: "✈️ Adventure",
    family: "👨‍👩‍👧 Family",
    connection: "🤝 Connection",
    support: "🕊️ Support",
    recharge: "😌 Recharge",
    thisWeek: "This week",
    letsTalk: "LET'S TALK",
    articleTitle: "Making friends again as an adult",
    articleBody: "Conversations, ideas and recommendations for creating real connections.",
    discover: "DISCOVER",
    eventsTitle: "Plans & Events",
    eventsIntro: "Discover activities where we can connect, share and enjoy time together.",
    communitySection: "COMMUNITY",
    communityTitle: "Our community",
    communityIntro: "Meet women, share interests and build real connections.",
    anaInterests: "Brunch · Wellness · Travel",
    mariaInterests: "Family · Coffee · Faith",
    shareSomething: "Share something",
    postPlaceholder: "What would you like to share?",
    post: "Post",
    messagesLabel: "MESSAGES",
    messagesTitle: "Messages",
    messagesIntro: "Write to us privately whenever you want to talk, ask a question or share something.",
    messageAdmin: "Private message to the administrator",
    wellnessLabel: "WELLNESS & SUPPORT",
    yourSpace: "Your space",
    wellnessIntro: "A place where you can feel supported, heard and connected.",
    needTalk: "I need to talk",
    privateAdmin: "Private message to the administrator",
    prayer: "Prayer",
    prayerSub: "Ask for support",
    suggestion: "I have a suggestion",
    suggestionSub: "Events, topics or ideas",
    familyTitle: "Family",
    familySub: "Family plans and activities",
    supportNote: "This space offers community support and does not replace professional or emergency services.",
    home: "Home",
    events: "Events",
    communityNav: "Community",
    messages: "Messages",
    wellness: "Wellness",
    save: "Save"
  }
};


Object.assign(translations.es, {
  "heroAlt": "Mujeres compartiendo",
  "editQuoteLabel": "Editar mensaje de hoy",
  "closeLabel": "Cerrar",
  "navigationLabel": "Navegación principal",
  "switchLanguage": "Switch to English",
  "postLabel": "Tu publicación",
  "postPlaceholder": "¿Qué quieres compartir con la comunidad?",
  "communityLocalNote": "Las publicaciones se guardan en este dispositivo; todavía no se comparten con otras personas.",
  "messagesIntro": "Escribe y revisa tus borradores. Se guardan en este dispositivo y todavía no se envían a la administradora.",
  "messageAdmin": "Escribir un mensaje",
  "privateAdmin": "Guarda un mensaje personal",
  "storageWarning": "Tu navegador no permite guardar los cambios. Permanecerán disponibles solo mientras esta página siga abierta.",
  "noPosts": "Todavía no has publicado nada en este dispositivo.",
  "noMessages": "Todavía no tienes borradores guardados.",
  "chooseCode": "Toca un código para elegirlo.",
  "selectedCode": "Tu código: ",
  "newMessageTitle": "Nuevo mensaje",
  "quoteTitle": "Mensaje de hoy",
  "quoteField": "Texto del mensaje de hoy",
  "messageField": "Tu mensaje",
  "quotePlaceholder": "Escribe tu mensaje del día.",
  "messagePlaceholder": "Escribe lo que quieras compartir.",
  "draftNote": "Se guardará como borrador en este dispositivo. No se enviará a nadie.",
  "quoteNote": "Tu mensaje personalizado se conserva al cambiar de idioma.",
  "saveDraft": "Guardar borrador",
  "saveQuote": "Guardar mensaje",
  "requiredText": "Escribe un texto antes de guardar.",
  "requiredPost": "Escribe tu publicación antes de publicarla.",
  "quoteSaved": "Mensaje de hoy guardado.",
  "quoteTemporary": "Mensaje actualizado para esta sesión; el navegador no permitió guardarlo.",
  "postSaved": "Publicación guardada en este dispositivo.",
  "postTemporary": "Publicación visible en esta sesión; el navegador no permitió guardarla.",
  "draftSaved": "Borrador guardado en Mensajes. No se ha enviado.",
  "draftTemporary": "Borrador disponible en esta sesión. No se ha enviado ni guardado de forma permanente.",
  "draftLabel": "Borrador · No enviado"
});
Object.assign(translations.en, {
  "heroAlt": "Women spending time together",
  "editQuoteLabel": "Edit today's message",
  "closeLabel": "Close",
  "navigationLabel": "Main navigation",
  "switchLanguage": "Cambiar a español",
  "postLabel": "Your post",
  "postPlaceholder": "What would you like to share with the community?",
  "communityLocalNote": "Posts are saved on this device; they are not yet shared with other people.",
  "messagesIntro": "Write and review your drafts. They are saved on this device and are not yet sent to the administrator.",
  "messageAdmin": "Write a message",
  "privateAdmin": "Save a personal note",
  "storageWarning": "Your browser cannot save changes. They will remain available only while this page stays open.",
  "noPosts": "You have not posted anything on this device yet.",
  "noMessages": "You do not have any saved drafts yet.",
  "chooseCode": "Tap a code to choose it.",
  "selectedCode": "Your code: ",
  "newMessageTitle": "New message",
  "quoteTitle": "Today's message",
  "quoteField": "Today's message text",
  "messageField": "Your message",
  "quotePlaceholder": "Write your message of the day.",
  "messagePlaceholder": "Write what you would like to share.",
  "draftNote": "This will be saved as a draft on this device. It will not be sent to anyone.",
  "quoteNote": "Your custom message is preserved when you switch languages.",
  "saveDraft": "Save draft",
  "saveQuote": "Save message",
  "requiredText": "Enter some text before saving.",
  "requiredPost": "Write your post before posting it.",
  "quoteSaved": "Today's message saved.",
  "quoteTemporary": "Message updated for this session; your browser could not save it.",
  "postSaved": "Post saved on this device.",
  "postTemporary": "Post visible for this session; your browser could not save it.",
  "draftSaved": "Draft saved in Messages. It has not been sent.",
  "draftTemporary": "Draft available for this session. It has not been sent or saved permanently.",
  "draftLabel": "Draft · Not sent"
});

// ---- New strings: accounts, shared content, admin entry points ----
Object.assign(translations.es, {
  loading: "Cargando…",
  authLabel: "BIENVENIDA",
  authTitle: "Tu comunidad para conectar, salir y crecer.",
  loginTab: "Entrar",
  signupTab: "Crear cuenta",
  email: "Correo electrónico",
  password: "Contraseña",
  passwordHint: "Mínimo 8 caracteres.",
  firstName: "Nombre",
  lastName: "Apellido",
  company: "Empresa u organización (opcional)",
  city: "Ciudad o zona (opcional)",
  interestsLegend: "¿Qué te interesa?",
  interestsHelp: "Elige las que quieras. Corresponden a nuestros códigos.",
  loginBtn: "Entrar",
  signupBtn: "Crear mi cuenta",
  logout: "Salir",
  authWorking: "Un momento…",
  authCheckEmail: "Cuenta creada. Revisa tu correo para confirmarla y luego entra.",
  authBadLogin: "Correo o contraseña incorrectos.",
  authNotConfirmed: "Confirma tu correo antes de entrar. Revisa tu bandeja de entrada.",
  authExists: "Ese correo ya tiene una cuenta. Entra con tu contraseña.",
  authShortPassword: "La contraseña debe tener al menos 8 caracteres.",
  authMissing: "Completa tu nombre, apellido, correo y contraseña.",
  authError: "No se pudo completar. Inténtalo de nuevo.",
  loadError: "No se pudo cargar el contenido. Revisa tu conexión e inténtalo de nuevo.",
  monthFilterLabel: "Filtrar por mes",
  allMonths: "Todos",
  tbdMonth: "Fecha por confirmar",
  tripsLabel: "FUTUROS PLANES",
  tripsTitle: "Viajes e ideas",
  tripsIntro: "Ideas para más adelante. Dinos si te interesan.",
  interested: "Me interesa",
  going: "Voy",
  moreInfo: "Más información",
  moreDetails: "Detalles y contacto",
  dateTbd: "Fecha por confirmar",
  membersEmpty: "Pronto verás aquí a otras mujeres de la comunidad.",
  noPosts: "Todavía no hay publicaciones. ¡Sé la primera!",
  postDelete: "Eliminar",
  postSaved: "Publicación compartida con la comunidad.",
  postFail: "No se pudo publicar. Inténtalo de nuevo.",
  postDeleted: "Publicación eliminada.",
  communityLocalNote: "Las publicaciones las ve toda la comunidad.",
  messagesIntro: "Escríbele en privado a la administradora cuando quieras hablar, preguntar o compartir algo. Solo ella puede leerlo.",
  messageAdmin: "Escribir un mensaje",
  privateAdmin: "Mensaje privado a la administradora",
  noMessages: "Todavía no has enviado mensajes.",
  draftNote: "Este mensaje es privado: solo lo verá la administradora.",
  saveDraft: "Enviar",
  draftLabel: "Enviado",
  draftSaved: "Mensaje enviado a la administradora.",
  draftTemporary: "No se pudo enviar el mensaje. Inténtalo de nuevo.",
  replyLabel: "Respuesta de la administradora",
  quoteSaved: "Mensaje de hoy guardado.",
  quoteTemporary: "No se pudo guardar el mensaje de hoy.",
  quoteNote: "Todas las mujeres verán este mensaje.",
  respondFail: "No se pudo guardar tu respuesta. Inténtalo de nuevo.",
  adminLabel: "ADMINISTRACIÓN",
  adminTitle: "Panel de administración",
  adminNav: "Admin"
});
Object.assign(translations.en, {
  loading: "Loading…",
  authLabel: "WELCOME",
  authTitle: "Your community to connect, go out and grow.",
  loginTab: "Log in",
  signupTab: "Create account",
  email: "Email",
  password: "Password",
  passwordHint: "At least 8 characters.",
  firstName: "First name",
  lastName: "Last name",
  company: "Company or organization (optional)",
  city: "City or area (optional)",
  interestsLegend: "What are you interested in?",
  interestsHelp: "Pick any you like. They match our codes.",
  loginBtn: "Log in",
  signupBtn: "Create my account",
  logout: "Log out",
  authWorking: "One moment…",
  authCheckEmail: "Account created. Check your email to confirm it, then log in.",
  authBadLogin: "Incorrect email or password.",
  authNotConfirmed: "Please confirm your email before logging in. Check your inbox.",
  authExists: "That email already has an account. Log in with your password.",
  authShortPassword: "Your password must be at least 8 characters.",
  authMissing: "Please enter your first name, last name, email and password.",
  authError: "Something went wrong. Please try again.",
  loadError: "Could not load the content. Check your connection and try again.",
  monthFilterLabel: "Filter by month",
  allMonths: "All",
  tbdMonth: "Date to be confirmed",
  tripsLabel: "FUTURE PLANS",
  tripsTitle: "Trips and ideas",
  tripsIntro: "Ideas for later. Tell us if you're interested.",
  interested: "Interested",
  going: "Going",
  moreInfo: "More information",
  moreDetails: "Details and contact",
  dateTbd: "Date to be confirmed",
  membersEmpty: "Soon you'll see other women from the community here.",
  noPosts: "No posts yet. Be the first!",
  postDelete: "Delete",
  postSaved: "Post shared with the community.",
  postFail: "Could not post. Please try again.",
  postDeleted: "Post deleted.",
  communityLocalNote: "Everyone in the community can see posts.",
  messagesIntro: "Write privately to the administrator whenever you want to talk, ask something or share something. Only she can read it.",
  messageAdmin: "Write a message",
  privateAdmin: "Private message to the administrator",
  noMessages: "You haven't sent any messages yet.",
  draftNote: "This message is private: only the administrator will see it.",
  saveDraft: "Send",
  draftLabel: "Sent",
  draftSaved: "Message sent to the administrator.",
  draftTemporary: "Could not send the message. Please try again.",
  replyLabel: "Reply from the administrator",
  quoteSaved: "Today's message saved.",
  quoteTemporary: "Could not save today's message.",
  quoteNote: "All members will see this message.",
  respondFail: "Could not save your response. Please try again.",
  adminLabel: "ADMINISTRATION",
  adminTitle: "Admin dashboard",
  adminNav: "Admin"
});


// ==============================
// Sample cards (shown only until the administrator publishes real content)
// ==============================
const SAMPLE_EVENTS = {
  es: [
    { title: "Café & Conexión", text: "Un encuentro relajado para conversar y conocer nuevas amigas." },
    { title: "Caminata de bienestar", text: "Sal, muévete y comparte una mañana al aire libre." },
    { title: "Noche entre amigas", text: "Una noche sencilla para conversar, reír y conectar." }
  ],
  en: [
    { title: "Coffee & Connection", text: "A relaxed meetup to talk and meet new friends." },
    { title: "Wellness Walk", text: "Get outside, move and share a morning together." },
    { title: "Girls' Night", text: "A simple evening to talk, laugh and connect." }
  ]
};
const SAMPLE_FEATURED = {
  es: [
    { title: "Un café sin prisa", text: "Invita a alguien con quien quieras reconectar." },
    { title: "Haz algo nuevo", text: "Prueba un lugar, actividad o plan diferente esta semana." }
  ],
  en: [
    { title: "Coffee without rushing", text: "Invite someone you'd like to reconnect with." },
    { title: "Try something new", text: "Try a different place, activity or plan this week." }
  ]
};
const DEFAULT_HERO = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=88";

// ==============================
// Local storage (language + weekly code only)
// ==============================
const sessionStorageCopy = new Map();
let storageUnavailable = false;
function readStored(key) {
  if (sessionStorageCopy.has(key)) return sessionStorageCopy.get(key);
  try {
    const value = window.localStorage.getItem(key);
    if (value !== null) sessionStorageCopy.set(key, value);
    return value;
  } catch {
    storageUnavailable = true;
    return null;
  }
}
function writeStored(key, value) {
  const text = String(value);
  sessionStorageCopy.set(key, text);
  try {
    window.localStorage.setItem(key, text);
    return true;
  } catch {
    storageUnavailable = true;
    renderStorageNotice();
    return false;
  }
}

// ==============================
// State and helpers
// ==============================
let currentLanguage = readStored("language") === "en" ? "en" : "es";
let currentModalType = "";
let returnFocus = null;
let previousOverflow = "";
let statusKey = "";
let errorKey = "";
let statusTimer = 0;

let session = null;
let profile = null;
let plans = [];                 // published plans visible to members
const counts = new Map();       // plan_id -> {interested, going}
const mine = new Map();         // plan_id -> 'interested' | 'going'
let settings = {};              // key -> jsonb value
let posts = [];
let myMessages = [];
let monthSel = "all";
let pendingFocus = "";

const byId = id => document.getElementById(id);
const t = key => translations[currentLanguage][key] || "";
const loc = () => (currentLanguage === "es" ? "es-US" : "en-US");
const isAdmin = () => !!profile && (profile.role === "admin" || profile.role === "super_admin");
const isSuper = () => !!profile && profile.role === "super_admin";

const codeLabels = {
  Social: "social", Wellness: "wellnessChip", Faith: "faith", Adventure: "adventure",
  Family: "family", Connection: "connection", Support: "support", Recharge: "recharge"
};
const modalTitles = {
  dailyQuote: "quoteTitle", message: "newMessageTitle", talk: "needTalk",
  prayer: "prayer", idea: "suggestion", family: "familyTitle"
};

function el(tag, props = {}, ...kids) {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (v === undefined || v === null || v === false) return;
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else node.setAttribute(k, v === true ? "" : v);
  });
  kids.flat().forEach(kid => {
    if (kid === undefined || kid === null || kid === false) return;
    node.appendChild(typeof kid === "string" ? document.createTextNode(kid) : kid);
  });
  return node;
}
function pick(row, base) {
  const own = row[base + "_" + currentLanguage];
  const other = row[base + "_" + (currentLanguage === "es" ? "en" : "es")];
  return (own && own.trim()) ? own : (other || "");
}
function safeUrl(value) {
  try {
    const u = new URL(String(value || ""));
    return (u.protocol === "https:" || u.protocol === "http:") ? u.href : "";
  } catch { return ""; }
}
const pad = n => String(n).padStart(2, "0");
function todayStr() {
  const n = new Date();
  return n.getFullYear() + "-" + pad(n.getMonth() + 1) + "-" + pad(n.getDate());
}
function dateFromStr(d) {
  const [y, m, day] = String(d).split("-").map(Number);
  return new Date(y, m - 1, day);
}
function monthKey(d) { return String(d).slice(0, 7); }
function monthLabel(key) {
  const [y, m] = key.split("-").map(Number);
  const text = new Date(y, m - 1, 1).toLocaleDateString(loc(), { month: "long", year: "numeric" });
  return text.charAt(0).toUpperCase() + text.slice(1);
}
function fmtDate(d) {
  return dateFromStr(d).toLocaleDateString(loc(), { weekday: "long", day: "numeric", month: "long" });
}

function renderStorageNotice() {
  const notice = byId("storageNotice");
  if (notice) {
    notice.hidden = !storageUnavailable;
    notice.textContent = storageUnavailable ? t("storageWarning") : "";
  }
}
function renderStatus() {
  const status = byId("appStatus");
  if (status) {
    status.hidden = !statusKey;
    status.textContent = statusKey ? t(statusKey) : "";
  }
  const feedback = byId("modalFeedback");
  if (feedback) {
    feedback.hidden = !errorKey;
    feedback.textContent = errorKey ? t(errorKey) : "";
  }
}
function announce(key) {
  statusKey = key;
  renderStatus();
  clearTimeout(statusTimer);
  if (key) statusTimer = setTimeout(() => { statusKey = ""; renderStatus(); }, 6000);
}

// ==============================
// Language
// ==============================
function setLanguage(language, persist = true) {
  currentLanguage = language === "en" ? "en" : "es";
  if (persist) writeStored("language", currentLanguage);
  document.documentElement.lang = currentLanguage;
  const attributes = [
    ["data-i18n", null], ["data-i18n-placeholder", "placeholder"],
    ["data-i18n-aria", "aria-label"], ["data-i18n-alt", "alt"]
  ];
  attributes.forEach(([source, target]) => {
    document.querySelectorAll("[" + source + "]").forEach(element => {
      const key = element.getAttribute(source);
      const value = translations[currentLanguage][key];
      if (value === undefined) return;
      if (target) element.setAttribute(target, value);
      else element.textContent = value;
    });
  });
  ["langBtn", "authLang"].forEach(id => {
    const button = byId(id);
    if (button) {
      button.textContent = currentLanguage === "es" ? "EN" : "ES";
      button.setAttribute("aria-label", t("switchLanguage"));
    }
  });
  renderAll();
  document.dispatchEvent(new CustomEvent("cml:lang"));
}

function renderAll() {
  renderHero();
  renderQuote();
  renderFeatured();
  renderEvents();
  renderTrips();
  renderWellnessCards();
  renderMembers();
  renderPosts();
  renderMessages();
  renderWeeklyCode();
  renderInterestChoices();
  renderModalText();
  renderStatus();
  renderStorageNotice();
}

// ==============================
// Navigation
// ==============================
function showPage(pageId, focusHeading = true) {
  const selectedPage = byId(pageId);
  if (!selectedPage || !selectedPage.classList.contains("page")) return;
  if (pageId === "admin" && !isAdmin()) return;
  document.querySelectorAll(".page").forEach(page => {
    const active = page === selectedPage;
    page.classList.toggle("active", active);
    page.hidden = !active;
  });
  document.querySelectorAll("nav button[data-page]").forEach(button => {
    const active = button.getAttribute("data-page") === pageId;
    button.classList.toggle("active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  if (focusHeading) {
    const heading = selectedPage.querySelector("h1");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  }
  window.scrollTo({ top: 0, behavior: "auto" });
}

// ==============================
// Home
// ==============================
function renderHero() {
  const img = byId("heroImg");
  if (!img) return;
  const custom = settings.hero_image && safeUrl(settings.hero_image.url);
  const wanted = custom || DEFAULT_HERO;
  if (img.getAttribute("src") !== wanted) img.setAttribute("src", wanted);
}
function renderQuote() {
  const quote = byId("dailyQuote");
  if (!quote) return;
  const stored = settings.daily_quote || {};
  const own = (stored[currentLanguage] || "").trim();
  const other = (stored[currentLanguage === "es" ? "en" : "es"] || "").trim();
  quote.textContent = own || other || t("dailyQuote");
  const edit = byId("editQuote");
  if (edit) edit.hidden = !isAdmin();
}
function renderWeeklyCode() {
  const selected = readStored("weeklyCode");
  document.querySelectorAll(".chip[data-code]").forEach(button => {
    const active = button.getAttribute("data-code") === selected;
    button.classList.toggle("selected", active);
    button.setAttribute("aria-pressed", String(active));
  });
  const status = byId("weeklyCodeStatus");
  if (status) status.textContent = codeLabels[selected]
    ? t("selectedCode") + t(codeLabels[selected]) : t("chooseCode");
}
function sampleCards(container, items) {
  container.replaceChildren();
  items.forEach(item => {
    container.appendChild(el("div", { class: "card" },
      el("h2", { text: item.title }), el("p", { text: item.text })));
  });
}
function renderFeatured() {
  const container = byId("featured");
  if (!container) return;
  const items = plans.filter(p => p.kind === "home");
  if (!items.length) return sampleCards(container, SAMPLE_FEATURED[currentLanguage]);
  container.replaceChildren(...items.map(p => planCard(p)));
}

// ==============================
// Plans (events, trips, wellness cards)
// ==============================
function respondButton(plan, status) {
  const c = counts.get(plan.id) || { interested: 0, going: 0 };
  const active = mine.get(plan.id) === status;
  const icon = status === "interested" ? "❤️" : "✓";
  const label = t(status);
  const button = el("button", {
    type: "button",
    class: "resp" + (active ? " on" : ""),
    "aria-pressed": String(active),
    "data-resp": plan.id + ":" + status
  }, icon + " " + label + " · " + (c[status] || 0));
  button.addEventListener("click", () => respond(plan.id, status));
  return button;
}
function planCard(p) {
  const card = el("article", { class: "card plan" });
  const image = safeUrl(p.image_url);
  if (image) card.appendChild(el("img", { class: "plan-img", src: image, alt: "", loading: "lazy" }));
  if (p.code && codeLabels[p.code]) card.appendChild(el("small", { class: "rose", text: t(codeLabels[p.code]) }));
  const title = pick(p, "title");
  if (title) card.appendChild(el("h2", { text: title }));

  const meta = [];
  if (p.event_date) meta.push("📅 " + fmtDate(p.event_date) + (p.event_time ? " · " + p.event_time : ""));
  else if (p.date_text) meta.push("📅 " + p.date_text);
  else if (p.kind === "event") meta.push("📅 " + t("dateTbd") + (p.event_time ? " · " + p.event_time : ""));
  if (p.location) meta.push("📍 " + p.location);
  if (p.price) meta.push("💲 " + p.price);
  meta.forEach(line => card.appendChild(el("p", { class: "meta-line", text: line })));

  const description = pick(p, "desc");
  if (description) card.appendChild(el("p", { class: "saved-text", text: description }));

  const url = safeUrl(p.url);
  if (url) {
    card.appendChild(el("a", {
      class: "link-btn", href: url, target: "_blank", rel: "noopener noreferrer", text: t("moreInfo") + " ↗"
    }));
  }
  if (p.details) {
    card.appendChild(el("details", { class: "more" },
      el("summary", { text: t("moreDetails") }),
      el("p", { class: "saved-text", text: p.details })));
  }
  if (p.kind === "event" || p.kind === "trip") {
    card.appendChild(el("div", { class: "resp-row" },
      respondButton(p, "interested"), respondButton(p, "going")));
  }
  return card;
}
function byDate(a, b) {
  if (a.event_date && b.event_date) return a.event_date < b.event_date ? -1 : a.event_date > b.event_date ? 1 : 0;
  if (a.event_date) return -1;
  if (b.event_date) return 1;
  return 0;
}
function renderEvents() {
  const list = byId("eventsList");
  const filter = byId("monthFilter");
  if (!list) return;
  const today = todayStr();
  const events = plans
    .filter(p => p.kind === "event" && (!p.event_date || p.event_date >= today))
    .sort(byDate);
  if (!events.length) {
    if (filter) filter.hidden = true;
    return sampleCards(list, SAMPLE_EVENTS[currentLanguage]);
  }
  const months = [...new Set(events.filter(p => p.event_date).map(p => monthKey(p.event_date)))].sort();
  const hasTbd = events.some(p => !p.event_date);
  const options = ["all", ...months, ...(hasTbd ? ["tbd"] : [])];
  if (!options.includes(monthSel)) monthSel = "all";
  if (filter) {
    filter.hidden = options.length <= 2;
    filter.replaceChildren(...options.map(key => {
      const label = key === "all" ? t("allMonths") : key === "tbd" ? t("tbdMonth") : monthLabel(key);
      const b = el("button", {
        type: "button", class: "chip" + (monthSel === key ? " selected" : ""),
        "aria-pressed": String(monthSel === key), text: label
      });
      b.addEventListener("click", () => { monthSel = key; renderEvents(); });
      return b;
    }));
  }
  const shown = events.filter(p =>
    monthSel === "all" ||
    (monthSel === "tbd" ? !p.event_date : p.event_date && monthKey(p.event_date) === monthSel));
  list.replaceChildren(...shown.map(planCard));
  restoreFocus();
}
function renderTrips() {
  const block = byId("tripsBlock"), list = byId("tripsList");
  if (!block || !list) return;
  const trips = plans.filter(p => p.kind === "trip").sort(byDate);
  block.hidden = !trips.length;
  list.replaceChildren(...trips.map(planCard));
  restoreFocus();
}
function renderWellnessCards() {
  const list = byId("wellnessCards");
  if (!list) return;
  list.replaceChildren(...plans.filter(p => p.kind === "wellness").map(planCard));
}
function restoreFocus() {
  if (!pendingFocus) return;
  const target = document.querySelector('[data-resp="' + pendingFocus + '"]');
  pendingFocus = "";
  if (target) target.focus({ preventScroll: true });
}

async function refreshCounts() {
  const { data, error } = await db.rpc("plan_counts");
  if (error) throw error;
  counts.clear();
  (data || []).forEach(r => counts.set(r.plan_id, { interested: Number(r.interested), going: Number(r.going) }));
}
async function respond(planId, status) {
  if (!session) return;
  const current = mine.get(planId);
  pendingFocus = planId + ":" + status;
  // Optimistic update so the buttons react instantly
  const c = { ...(counts.get(planId) || { interested: 0, going: 0 }) };
  if (current) c[current] = Math.max(0, c[current] - 1);
  if (current === status) mine.delete(planId);
  else { mine.set(planId, status); c[status] += 1; }
  counts.set(planId, c);
  renderEvents(); renderTrips(); renderFeatured(); renderWellnessCards();
  try {
    let result;
    if (current === status) {
      result = await db.from("responses").delete().eq("plan_id", planId).eq("user_id", session.user.id);
    } else {
      result = await db.from("responses").upsert(
        { plan_id: planId, user_id: session.user.id, status }, { onConflict: "plan_id,user_id" });
    }
    if (result.error) throw result.error;
    await refreshCounts();
  } catch {
    announce("respondFail");
    try { await loadResponses(); await refreshCounts(); } catch { /* keep optimistic state */ }
  }
  renderEvents(); renderTrips(); renderFeatured(); renderWellnessCards();
}
async function loadResponses() {
  const { data, error } = await db.from("responses").select("plan_id,status").eq("user_id", session.user.id);
  if (error) throw error;
  mine.clear();
  (data || []).forEach(r => mine.set(r.plan_id, r.status));
}

// ==============================
// Community
// ==============================
let members = [];
function renderMembers() {
  const container = byId("membersList");
  if (!container) return;
  container.replaceChildren();
  if (!members.length) return appendParagraph(container, t("membersEmpty"), "meta");
  members.slice(0, 30).forEach(m => {
    const interests = (m.interests || []).map(code => codeLabels[code] ? t(codeLabels[code]) : code).join(" · ");
    container.appendChild(el("div", { class: "member" },
      el("span", { text: (m.first_name || "?").charAt(0).toUpperCase() }),
      el("div", {}, el("b", { text: m.first_name }), el("small", { text: interests }))));
  });
}
function appendParagraph(container, text, className = "") {
  container.appendChild(el("p", { class: className, text }));
}
function renderPosts() {
  const container = byId("posts");
  if (!container) return;
  container.replaceChildren();
  if (!posts.length) return appendParagraph(container, t("noPosts"), "meta");
  posts.forEach(post => {
    const card = el("div", { class: "card" },
      el("b", { text: post.author_name || "" }),
      el("p", { class: "saved-text", text: post.body }));
    const date = new Date(post.created_at);
    if (!Number.isNaN(date.getTime())) {
      card.appendChild(el("time", { class: "meta", datetime: date.toISOString(), text: date.toLocaleString(loc()) }));
    }
    if (session && (post.user_id === session.user.id || isAdmin())) {
      const del = el("button", { type: "button", class: "link-danger", text: t("postDelete") });
      del.addEventListener("click", () => deletePost(post.id));
      card.appendChild(del);
    }
    container.appendChild(card);
  });
}
async function loadMembers() {
  const { data, error } = await db.rpc("community_members");
  if (error) throw error;
  members = data || [];
}
async function loadPosts() {
  const { data, error } = await db.from("community_posts")
    .select("id,user_id,author_name,body,created_at").order("created_at", { ascending: false }).limit(50);
  if (error) throw error;
  posts = data || [];
}
async function addPost() {
  const field = byId("postText");
  if (!field || !session) return;
  const text = field.value.trim();
  if (!text) {
    announce("requiredPost");
    field.focus();
    return;
  }
  const { error } = await db.from("community_posts").insert({
    user_id: session.user.id, author_name: profile ? profile.first_name : "", body: text.slice(0, 1000)
  });
  if (error) return announce("postFail");
  field.value = "";
  try { await loadPosts(); } catch { /* ignore */ }
  renderPosts();
  announce("postSaved");
}
async function deletePost(id) {
  const { error } = await db.from("community_posts").delete().eq("id", id);
  if (error) return announce("postFail");
  posts = posts.filter(p => p.id !== id);
  renderPosts();
  announce("postDeleted");
}

// ==============================
// Messages (private, to the administrator)
// ==============================
async function loadMessages() {
  const { data, error } = await db.from("messages").select("*")
    .eq("user_id", session.user.id).order("created_at", { ascending: false });
  if (error) throw error;
  myMessages = data || [];
}
function renderMessages() {
  const container = byId("messagesList");
  if (!container) return;
  container.replaceChildren();
  if (!myMessages.length) return appendParagraph(container, t("noMessages"), "meta");
  myMessages.forEach(message => {
    const card = el("div", { class: "card" },
      el("h2", { text: t(modalTitles[message.type] || "newMessageTitle") }),
      el("p", { class: "meta", text: t("draftLabel") }),
      el("p", { class: "saved-text", text: message.body }));
    const date = new Date(message.created_at);
    if (!Number.isNaN(date.getTime())) {
      card.appendChild(el("time", { class: "meta", datetime: date.toISOString(), text: date.toLocaleString(loc()) }));
    }
    if (message.admin_reply) {
      card.appendChild(el("div", { class: "reply" },
        el("small", { class: "rose", text: t("replyLabel") }),
        el("p", { class: "saved-text", text: message.admin_reply })));
    }
    container.appendChild(card);
  });
}

// ==============================
// Modal (message of the day / private messages)
// ==============================
function renderModalText() {
  if (!currentModalType) return;
  const quoteMode = currentModalType === "dailyQuote";
  byId("modalTitle").textContent = t(modalTitles[currentModalType] || "newMessageTitle");
  byId("modalNote").textContent = t(quoteMode ? "quoteNote" : "draftNote");
  byId("modalTextLabel").textContent = t(quoteMode ? "quoteField" : "messageField");
  byId("modalText").placeholder = t(quoteMode ? "quotePlaceholder" : "messagePlaceholder");
  byId("modalSave").textContent = t(quoteMode ? "saveQuote" : "saveDraft");
}
function openModal(type) {
  const modal = byId("modal");
  if (!modal || !modalTitles[type]) return;
  if (type === "dailyQuote" && !isAdmin()) return;
  currentModalType = type;
  returnFocus = document.activeElement;
  previousOverflow = document.body.style.overflow;
  errorKey = "";
  renderModalText();
  renderStatus();
  byId("modalText").value = type === "dailyQuote" ? byId("dailyQuote").textContent.trim() : "";
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  byId("modalText").focus();
}
function closeModal() {
  const modal = byId("modal");
  if (!modal || !modal.classList.contains("open")) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = previousOverflow;
  currentModalType = "";
  errorKey = "";
  renderStatus();
  if (returnFocus && returnFocus.isConnected) returnFocus.focus();
}
async function saveModal() {
  const field = byId("modalText");
  if (!field || !currentModalType || !session) return;
  const text = field.value.trim();
  if (!text) {
    errorKey = "requiredText";
    renderStatus();
    field.focus();
    return;
  }
  const saveButton = byId("modalSave");
  saveButton.disabled = true;
  try {
    if (currentModalType === "dailyQuote") {
      const value = { ...(settings.daily_quote || {}), [currentLanguage]: text };
      const { error } = await db.from("settings").upsert(
        { key: "daily_quote", value, updated_at: new Date().toISOString() }, { onConflict: "key" });
      if (error) throw error;
      settings.daily_quote = value;
      renderQuote();
      closeModal();
      announce("quoteSaved");
    } else {
      const { error } = await db.from("messages").insert({
        user_id: session.user.id, type: currentModalType, body: text.slice(0, 4000)
      });
      if (error) throw error;
      await loadMessages();
      renderMessages();
      closeModal();
      showPage("messages");
      announce("draftSaved");
    }
  } catch {
    announce(currentModalType === "dailyQuote" ? "quoteTemporary" : "draftTemporary");
  } finally {
    saveButton.disabled = false;
  }
}

// ==============================
// Accounts: sign up, log in, log out
// ==============================
function showFeedback(id, key) {
  const node = byId(id);
  if (!node) return;
  node.hidden = !key;
  node.textContent = key ? t(key) : "";
  node.dataset.key = key || "";
}
function setAuthTab(which) {
  const login = which === "login";
  byId("loginForm").hidden = !login;
  byId("signupForm").hidden = login;
  byId("tabLogin").classList.toggle("active", login);
  byId("tabSignup").classList.toggle("active", !login);
  byId("tabLogin").setAttribute("aria-selected", String(login));
  byId("tabSignup").setAttribute("aria-selected", String(!login));
  showFeedback("loginFeedback", ""); showFeedback("signupFeedback", "");
}
function renderInterestChoices() {
  const box = byId("suInterests");
  if (!box) return;
  const checked = new Set([...box.querySelectorAll("input:checked")].map(i => i.value));
  box.replaceChildren(...Object.keys(codeLabels).map(code => {
    const input = el("input", { type: "checkbox", value: code });
    input.checked = checked.has(code);
    return el("label", { class: "choice" }, input, " " + t(codeLabels[code]));
  }));
}
function showGate(ready) {
  byId("authGate").hidden = false;
  byId("appShell").hidden = true;
  byId("authLoading").hidden = !!ready;
  byId("authForms").hidden = !ready;
}
function showApp() {
  byId("authGate").hidden = true;
  byId("appShell").hidden = false;
}
async function fetchProfile() {
  for (let attempt = 0; attempt < 3; attempt++) {
    const { data, error } = await db.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
    if (!error && data) return data;
    await new Promise(r => setTimeout(r, 600));
  }
  return null;
}
async function applySession(s) {
  session = s;
  if (!s) {
    profile = null; plans = []; counts.clear(); mine.clear(); posts = []; myMessages = []; members = [];
    closeModal();
    document.dispatchEvent(new CustomEvent("cml:session", { detail: { admin: false, super: false } }));
    showPage("home", false);
    byId("navAdmin").hidden = true;
    renderAll();
    showGate(true);
    return;
  }
  showGate(false);
  profile = await fetchProfile();
  if (!session) return;
  if (!profile) {
    showGate(true);
    showFeedback("loginFeedback", "authError");
    await db.auth.signOut();
    return;
  }
  byId("navAdmin").hidden = !isAdmin();
  showApp();
  showPage("home", false);
  await loadAll();
  document.dispatchEvent(new CustomEvent("cml:session", { detail: { admin: isAdmin(), super: isSuper() } }));
}
async function loadAll() {
  const uid = session.user.id;
  try {
    const [pl, st] = await Promise.all([
      db.from("plans").select("*").eq("published", true)
        .order("event_date", { ascending: true, nullsFirst: false }),
      db.from("settings").select("key,value")
    ]);
    if (pl.error) throw pl.error;
    if (st.error) throw st.error;
    plans = pl.data || [];
    settings = {};
    (st.data || []).forEach(r => { settings[r.key] = r.value; });
    await Promise.all([loadResponses(), refreshCounts()]);
  } catch {
    announce("loadError");
  }
  await Promise.all([
    loadMembers().catch(() => {}),
    loadPosts().catch(() => {}),
    loadMessages().catch(() => {})
  ]);
  if (!session || session.user.id !== uid) return;
  renderAll();
}

async function handleLogin(event) {
  event.preventDefault();
  showFeedback("loginFeedback", "");
  const email = byId("loginEmail").value.trim();
  const password = byId("loginPassword").value;
  if (!email || !password) return showFeedback("loginFeedback", "authMissing");
  const button = byId("loginBtn");
  button.disabled = true;
  try {
    const { data, error } = await db.auth.signInWithPassword({ email, password });
    if (error) {
      const msg = String(error.message || "").toLowerCase();
      return showFeedback("loginFeedback", msg.includes("confirm") ? "authNotConfirmed" : "authBadLogin");
    }
    byId("loginPassword").value = "";
    if (!session && data.session) applySession(data.session);
  } catch {
    showFeedback("loginFeedback", "authError");
  } finally {
    button.disabled = false;
  }
}
async function handleSignup(event) {
  event.preventDefault();
  showFeedback("signupFeedback", "");
  const first = byId("suFirst").value.trim();
  const last = byId("suLast").value.trim();
  const email = byId("suEmail").value.trim();
  const password = byId("suPassword").value;
  if (!first || !last || !email) return showFeedback("signupFeedback", "authMissing");
  if (password.length < 8) return showFeedback("signupFeedback", "authShortPassword");
  const interests = [...byId("suInterests").querySelectorAll("input:checked")].map(i => i.value);
  const button = byId("signupBtn");
  button.disabled = true;
  try {
    const { data, error } = await db.auth.signUp({
      email, password,
      options: {
        data: {
          first_name: first, last_name: last,
          company: byId("suCompany").value.trim(), city: byId("suCity").value.trim(), interests
        },
        emailRedirectTo: window.location.origin + window.location.pathname
      }
    });
    if (error) {
      const msg = String(error.message || "").toLowerCase();
      return showFeedback("signupFeedback", msg.includes("already") ? "authExists" : msg.includes("password") ? "authShortPassword" : "authError");
    }
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      return showFeedback("signupFeedback", "authExists");
    }
    byId("suPassword").value = "";
    if (data.session) {
      if (!session) applySession(data.session);
    } else {
      setAuthTab("login");
      byId("loginEmail").value = email;
      showFeedback("loginFeedback", "authCheckEmail");
      byId("loginFeedback").classList.add("ok");
    }
  } catch {
    showFeedback("signupFeedback", "authError");
  } finally {
    button.disabled = false;
  }
}

// ==============================
// Start-up
// ==============================
function initialize() {
  const toggleLanguage = () => setLanguage(currentLanguage === "es" ? "en" : "es");
  byId("langBtn")?.addEventListener("click", toggleLanguage);
  byId("authLang")?.addEventListener("click", toggleLanguage);
  byId("logoutBtn")?.addEventListener("click", () => { db.auth.signOut(); });
  byId("tabLogin")?.addEventListener("click", () => setAuthTab("login"));
  byId("tabSignup")?.addEventListener("click", () => setAuthTab("signup"));
  byId("loginForm")?.addEventListener("submit", handleLogin);
  byId("signupForm")?.addEventListener("submit", handleSignup);
  document.querySelectorAll("nav button[data-page]").forEach(button =>
    button.addEventListener("click", () => showPage(button.getAttribute("data-page"))));
  document.querySelectorAll(".chip[data-code]").forEach(button =>
    button.addEventListener("click", () => {
      const code = button.getAttribute("data-code");
      writeStored("weeklyCode", readStored("weeklyCode") === code ? "" : code);
      renderWeeklyCode();
    }));
  byId("postBtn")?.addEventListener("click", addPost);
  byId("editQuote")?.addEventListener("click", () => openModal("dailyQuote"));
  byId("newMessage")?.addEventListener("click", () => openModal("message"));
  document.querySelectorAll(".support[data-type]").forEach(button =>
    button.addEventListener("click", () => openModal(button.getAttribute("data-type"))));
  byId("closeModal")?.addEventListener("click", closeModal);
  byId("modalSave")?.addEventListener("click", saveModal);
  byId("modalText")?.addEventListener("input", () => {
    if (errorKey) { errorKey = ""; renderStatus(); }
  });
  byId("modal")?.addEventListener("click", event => {
    if (event.target === byId("modal")) closeModal();
  });
  document.addEventListener("keydown", event => {
    const modal = byId("modal");
    if (!modal?.classList.contains("open")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
    } else if (event.key === "Tab") {
      const controls = Array.from(modal.querySelectorAll("button, textarea"));
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
  });

  // Expose a small, read-only toolkit for admin.js
  window.CML = {
    db, el, pick, safeUrl, fmtDate, monthLabel, todayStr, codeLabels,
    t, lang: () => currentLanguage, loc,
    session: () => session, profile: () => profile,
    isAdmin, isSuper, announce,
    refreshPublic: async () => { if (session) await loadAll(); }
  };

  setLanguage(currentLanguage, false);
  showPage("home", false);
  showGate(false);

  db.auth.onAuthStateChange((event, s) => {
    // Never call Supabase inside this callback directly; defer to avoid auth deadlocks.
    setTimeout(() => {
      if (event === "SIGNED_OUT") { if (session) applySession(null); }
      else if (event === "SIGNED_IN" && s && (!session || session.user.id !== s.user.id)) applySession(s);
    }, 0);
  });
  db.auth.getSession().then(({ data }) => {
    if (data && data.session) applySession(data.session);
    else applySession(null);
  }).catch(() => applySession(null));
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize, { once: true });
} else {
  initialize();
}

})();
