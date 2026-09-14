// Código Mujer Libre — bilingual controls and local drafts
(() => {
"use strict";

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
function loadEvents() {
  const eventsList = document.getElementById("eventsList");

  if (!eventsList) return;

  const events =
    currentLanguage === "es"
      ? [
          {
            title: "Café & Conexión",
            text: "Un encuentro relajado para conversar y conocer nuevas amigas."
          },
          {
            title: "Caminata de bienestar",
            text: "Sal, muévete y comparte una mañana al aire libre."
          },
          {
            title: "Noche entre amigas",
            text: "Una noche sencilla para conversar, reír y conectar."
          }
        ]
      : [
          {
            title: "Coffee & Connection",
            text: "A relaxed meetup to talk and meet new friends."
          },
          {
            title: "Wellness Walk",
            text: "Get outside, move and share a morning together."
          },
          {
            title: "Girls' Night",
            text: "A simple evening to talk, laugh and connect."
          }
        ];

  eventsList.innerHTML = "";

  events.forEach(event => {
    const card = document.createElement("div");
    card.className = "card";

    const title = document.createElement("h2");
    title.textContent = event.title;

    const text = document.createElement("p");
    text.textContent = event.text;

    card.appendChild(title);
    card.appendChild(text);

    eventsList.appendChild(card);
  });
}


// ==============================
// CONTENIDO DESTACADO
// ==============================

function loadFeatured() {
  const featured = document.getElementById("featured");

  if (!featured) return;

  const items =
    currentLanguage === "es"
      ? [
          {
            title: "Un café sin prisa",
            text: "Invita a alguien con quien quieras reconectar."
          },
          {
            title: "Haz algo nuevo",
            text: "Prueba un lugar, actividad o plan diferente esta semana."
          }
        ]
      : [
          {
            title: "Coffee without rushing",
            text: "Invite someone you'd like to reconnect with."
          },
          {
            title: "Try something new",
            text: "Try a different place, activity or plan this week."
          }
        ];

  featured.innerHTML = "";

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    const title = document.createElement("h2");
    title.textContent = item.title;

    const text = document.createElement("p");
    text.textContent = item.text;

    card.appendChild(title);
    card.appendChild(text);

    featured.appendChild(card);
  });
}



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
function readList(key) {
  try {
    const value = JSON.parse(readStored(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}
let currentLanguage = readStored("language") === "en" ? "en" : "es";
let currentModalType = "";
let returnFocus = null;
let previousOverflow = "";
let statusKey = "";
let errorKey = "";
const byId = id => document.getElementById(id);
const t = key => translations[currentLanguage][key] || "";
const codeLabels = {
  Social: "social", Wellness: "wellnessChip", Faith: "faith", Adventure: "adventure",
  Family: "family", Connection: "connection", Support: "support", Recharge: "recharge"
};
const modalTitles = {
  dailyQuote: "quoteTitle", message: "newMessageTitle", talk: "needTalk",
  prayer: "prayer", idea: "suggestion", family: "familyTitle"
};
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
}
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
  const languageButton = byId("langBtn");
  if (languageButton) {
    languageButton.textContent = currentLanguage === "es" ? "EN" : "ES";
    languageButton.setAttribute("aria-label", t("switchLanguage"));
  }
  loadDailyQuote();
  loadEvents();
  loadFeatured();
  loadPosts();
  loadMessages();
  renderWeeklyCode();
  renderModalText();
  renderStatus();
  renderStorageNotice();
}
function showPage(pageId, focusHeading = true) {
  const selectedPage = byId(pageId);
  if (!selectedPage || !selectedPage.classList.contains("page")) return;
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
function loadDailyQuote() {
  const quote = byId("dailyQuote");
  if (quote) quote.textContent = readStored("dailyQuote") || t("dailyQuote");
}
function appendParagraph(container, text, className = "") {
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  if (className) paragraph.className = className;
  container.appendChild(paragraph);
}
function loadPosts() {
  const container = byId("posts");
  if (!container) return;
  const posts = readList("communityPosts").filter(value => typeof value === "string");
  container.replaceChildren();
  if (!posts.length) appendParagraph(container, t("noPosts"), "meta");
  posts.forEach(text => {
    const card = document.createElement("div");
    card.className = "card";
    appendParagraph(card, text);
    container.appendChild(card);
  });
}
function addPost() {
  const field = byId("postText");
  if (!field) return;
  const text = field.value.trim();
  if (!text) {
    announce("requiredPost");
    field.focus();
    return;
  }
  const posts = readList("communityPosts").filter(value => typeof value === "string");
  posts.unshift(text);
  const saved = writeStored("communityPosts", JSON.stringify(posts));
  field.value = "";
  loadPosts();
  announce(saved ? "postSaved" : "postTemporary");
}
function loadMessages() {
  const container = byId("messagesList");
  if (!container) return;
  const messages = readList("privateMessages").filter(value =>
    value && typeof value === "object" && typeof value.text === "string");
  container.replaceChildren();
  if (!messages.length) appendParagraph(container, t("noMessages"), "meta");
  messages.forEach(message => {
    const card = document.createElement("div");
    card.className = "card";
    const title = document.createElement("h2");
    title.textContent = t(modalTitles[message.type] || "newMessageTitle");
    card.appendChild(title);
    appendParagraph(card, t("draftLabel"), "meta");
    appendParagraph(card, message.text, "saved-text");
    const date = new Date(message.date);
    if (!Number.isNaN(date.getTime())) {
      const time = document.createElement("time");
      time.className = "meta";
      time.dateTime = date.toISOString();
      time.textContent = date.toLocaleString(currentLanguage === "es" ? "es-US" : "en-US");
      card.appendChild(time);
    }
    container.appendChild(card);
  });
}
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
function saveModal() {
  const field = byId("modalText");
  if (!field || !currentModalType) return;
  const text = field.value.trim();
  if (!text) {
    errorKey = "requiredText";
    renderStatus();
    field.focus();
    return;
  }
  if (currentModalType === "dailyQuote") {
    const saved = writeStored("dailyQuote", text);
    loadDailyQuote();
    closeModal();
    announce(saved ? "quoteSaved" : "quoteTemporary");
  } else {
    const messages = readList("privateMessages").filter(value =>
      value && typeof value === "object" && typeof value.text === "string");
    messages.unshift({ type: currentModalType, text, date: new Date().toISOString() });
    const saved = writeStored("privateMessages", JSON.stringify(messages));
    loadMessages();
    closeModal();
    showPage("messages");
    announce(saved ? "draftSaved" : "draftTemporary");
  }
}
function initialize() {
  byId("langBtn")?.addEventListener("click", () =>
    setLanguage(currentLanguage === "es" ? "en" : "es"));
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
  setLanguage(currentLanguage, false);
  showPage("home", false);
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize, { once: true });
} else {
  initialize();
}

})();
