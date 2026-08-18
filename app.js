// Código Mujer Libre — app.js

let currentLanguage = localStorage.getItem("language") || "es";

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


// ==============================
// IDIOMA
// ==============================

function setLanguage(language) {
  currentLanguage = language;
  localStorage.setItem("language", language);

  const dictionary = translations[language];

  document.documentElement.lang = language;

  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.getAttribute("data-i18n");

    if (dictionary[key] !== undefined) {
      element.textContent = dictionary[key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
    const key = element.getAttribute("data-i18n-placeholder");

    if (dictionary[key] !== undefined) {
      element.placeholder = dictionary[key];
    }
  });

  const languageButton = document.getElementById("langBtn");

  if (languageButton) {
    languageButton.textContent = language === "es" ? "EN" : "ES";
  }
}


function toggleLanguage() {
  setLanguage(currentLanguage === "es" ? "en" : "es");
}


// ==============================
// NAVEGACIÓN
// ==============================

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const selectedPage = document.getElementById(pageId);

  if (selectedPage) {
    selectedPage.classList.add("active");
  }

  document.querySelectorAll("nav button[data-page]").forEach(button => {
    button.classList.toggle(
      "active",
      button.getAttribute("data-page") === pageId
    );
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// ==============================
// MODAL
// ==============================

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const modalSave = document.getElementById("modalSave");
const closeModalButton = document.getElementById("closeModal");

let currentModalType = "";


function openModal(title, type = "") {
  currentModalType = type;

  if (modalTitle) {
    modalTitle.textContent = title || "";
  }

  if (modalText) {
    modalText.value = "";
  }

  if (modal) {
    modal.classList.add("open");
    modal.style.display = "flex";
  }
}


function closeModal() {
  if (modal) {
    modal.classList.remove("open");
    modal.style.display = "none";
  }
}


// ==============================
// MENSAJE DEL DÍA
// ==============================

function loadDailyQuote() {
  const dailyQuote = document.getElementById("dailyQuote");

  if (!dailyQuote) return;

  const savedQuote = localStorage.getItem("dailyQuote");

  if (savedQuote) {
    dailyQuote.textContent = savedQuote;
  } else {
    dailyQuote.textContent =
      translations[currentLanguage].dailyQuote;
  }
}


// ==============================
// COMUNIDAD
// ==============================

function loadPosts() {
  const postsContainer = document.getElementById("posts");

  if (!postsContainer) return;

  const posts = JSON.parse(
    localStorage.getItem("communityPosts") || "[]"
  );

  postsContainer.innerHTML = "";

  posts.forEach(postText => {
    const card = document.createElement("div");
    card.className = "card";

    const paragraph = document.createElement("p");
    paragraph.textContent = postText;

    card.appendChild(paragraph);
    postsContainer.appendChild(card);
  });
}


function addPost() {
  const postText = document.getElementById("postText");

  if (!postText) return;

  const text = postText.value.trim();

  if (!text) return;

  const posts = JSON.parse(
    localStorage.getItem("communityPosts") || "[]"
  );

  posts.unshift(text);

  localStorage.setItem(
    "communityPosts",
    JSON.stringify(posts)
  );

  postText.value = "";

  loadPosts();
}


// ==============================
// EVENTOS
// ==============================

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


// ==============================
// INICIO
// ==============================

document.addEventListener("DOMContentLoaded", () => {

  setLanguage(currentLanguage);

  loadDailyQuote();
  loadPosts();
  loadEvents();
  loadFeatured();


  // Botón ES / EN

  const languageButton =
    document.getElementById("langBtn");

  if (languageButton) {
    languageButton.addEventListener("click", () => {
      toggleLanguage();

      loadEvents();
      loadFeatured();

      const savedQuote =
        localStorage.getItem("dailyQuote");

      if (!savedQuote) {
        loadDailyQuote();
      }
    });
  }


  // Navegación inferior

  document
    .querySelectorAll("nav button[data-page]")
    .forEach(button => {

      button.addEventListener("click", () => {
        const page =
          button.getAttribute("data-page");

        showPage(page);
      });

    });


  // Publicar en comunidad

  const postButton =
    document.getElementById("postBtn");

  if (postButton) {
    postButton.addEventListener(
      "click",
      addPost
    );
  }


  // Editar mensaje del día

  const editQuote =
    document.getElementById("editQuote");

  if (editQuote) {
    editQuote.addEventListener("click", () => {

      const dailyQuote =
        document.getElementById("dailyQuote");

      if (modalText && dailyQuote) {
        modalText.value =
          dailyQuote.textContent.trim();
      }

      currentModalType = "dailyQuote";

      if (modalTitle) {
        modalTitle.textContent =
          currentLanguage === "es"
            ? "Mensaje de hoy"
            : "Today's message";
      }

      if (modal) {
        modal.classList.add("open");
        modal.style.display = "flex";
      }

    });
  }


  // Botón nuevo mensaje

  const newMessage =
    document.getElementById("newMessage");

  if (newMessage) {
    newMessage.addEventListener("click", () => {

      openModal(
        currentLanguage === "es"
          ? "Nuevo mensaje"
          : "New message",
        "message"
      );

    });
  }


  // Botones de apoyo

  document
    .querySelectorAll(".support[data-type]")
    .forEach(button => {

      button.addEventListener("click", () => {

        const type =
          button.getAttribute("data-type");

        const titlesES = {
          talk: "Necesito hablar",
          prayer: "Oración",
          idea: "Tengo una sugerencia",
          family: "Familia"
        };

        const titlesEN = {
          talk: "I need to talk",
          prayer: "Prayer",
          idea: "I have a suggestion",
          family: "Family"
        };

        const titles =
          currentLanguage === "es"
            ? titlesES
            : titlesEN;

        openModal(
          titles[type] || "",
          type
        );

      });

    });


  // Cerrar modal

  if (closeModalButton) {
    closeModalButton.addEventListener(
      "click",
      closeModal
    );
  }


  if (modal) {
    modal.addEventListener("click", event => {

      if (event.target === modal) {
        closeModal();
      }

    });
  }


  // Guardar modal

  if (modalSave) {
    modalSave.addEventListener("click", () => {

      const text =
        modalText
          ? modalText.value.trim()
          : "";

      if (currentModalType === "dailyQuote") {

        if (text) {
          localStorage.setItem(
            "dailyQuote",
            text
          );

          const dailyQuote =
            document.getElementById(
              "dailyQuote"
            );

          if (dailyQuote) {
            dailyQuote.textContent = text;
          }
        }

      } else if (text) {

        const messages =
          JSON.parse(
            localStorage.getItem(
              "privateMessages"
            ) || "[]"
          );

        messages.unshift({
          type: currentModalType,
          text: text,
          date: new Date().toISOString()
        });

        localStorage.setItem(
          "privateMessages",
          JSON.stringify(messages)
        );
      }

      closeModal();

    });
  }

});
