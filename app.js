// Código Mujer Libre — app.js

let currentLanguage = localStorage.getItem("codigoMujerLibreLanguage") || "es";

const translations = {
  es: {
    community: "TU COMUNIDAD",
    heroTitle: "Más conexión. Más vida. Más tú.",
    heroBody: "Un espacio fresco para conectar, salir, crecer y sentirte acompañada.",
    today: "MENSAJE DE HOY",
    home: "Inicio",
    events: "Eventos",
    communityNav: "Comunidad",
    messages: "Mensajes",
    wellness: "Bienestar"
  },

  en: {
    community: "YOUR COMMUNITY",
    heroTitle: "More connection. More life. More you.",
    heroBody: "A fresh space to connect, go out, grow and feel supported.",
    today: "TODAY'S MESSAGE",
    home: "Home",
    events: "Events",
    communityNav: "Community",
    messages: "Messages",
    wellness: "Wellness"
  }
};


// ==============================
// IDIOMA
// ==============================

function setLanguage(lang) {
  currentLanguage = lang;
  document.documentElement.lang = lang;

  const t = translations[lang];

  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.getAttribute("data-i18n");

    if (t[key]) {
      element.textContent = t[key];
    }
  });

  const languageButton = document.getElementById("langBtn");

  if (languageButton) {
    languageButton.textContent = lang === "es" ? "EN" : "ES";
  }

  localStorage.setItem("codigoMujerLibreLanguage", lang);
}


function toggleLanguage() {
  setLanguage(currentLanguage === "es" ? "en" : "es");
}


// ==============================
// NAVEGACIÓN
// ==============================

function showPage(pageName) {

  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const targetPage = document.getElementById(pageName);

  if (targetPage) {
    targetPage.classList.add("active");
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
}


// ==============================
// INICIO DE LA APP
// ==============================

document.addEventListener("DOMContentLoaded", () => {

  // Cargar idioma
  setLanguage(currentLanguage);


  // Botón ES / EN
  const languageButton = document.getElementById("langBtn");

  if (languageButton) {
    languageButton.addEventListener("click", toggleLanguage);
  }


  // Botones de navegación inferior
  document.querySelectorAll("nav button[data-page]").forEach(button => {

    button.addEventListener("click", () => {

      const page = button.getAttribute("data-page");

      showPage(page);

    });

  });


  // ==============================
  // MODAL
  // ==============================

  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");
  const modalSave = document.getElementById("modalSave");
  const modalText = document.getElementById("modalText");
  const modalTitle = document.getElementById("modalTitle");


  function openModal(title = "") {
    if (!modal) return;

    if (modalTitle) {
      modalTitle.textContent = title;
    }

    modal.style.display = "flex";
  }


  function hideModal() {
    if (!modal) return;

    modal.style.display = "none";
  }


  if (closeModal) {
    closeModal.addEventListener("click", hideModal);
  }


  if (modal) {
    modal.addEventListener("click", event => {

      if (event.target === modal) {
        hideModal();
      }

    });
  }


  // ==============================
  // MENSAJE DEL DÍA
  // ==============================

  const editQuote = document.getElementById("editQuote");
  const dailyQuote = document.getElementById("dailyQuote");

  if (editQuote) {

    editQuote.addEventListener("click", () => {

      if (modalText && dailyQuote) {
        modalText.value = dailyQuote.textContent.trim();
      }

      openModal(
        currentLanguage === "es"
          ? "Mensaje de hoy"
          : "Today's message"
      );

    });

  }


  if (modalSave) {

    modalSave.addEventListener("click", () => {

      if (modalText && dailyQuote) {

        const newText = modalText.value.trim();

        if (newText) {
          dailyQuote.textContent = newText;

          localStorage.setItem(
            "codigoMujerLibreDailyQuote",
            newText
          );
        }
      }

      hideModal();

    });

  }


  // Recuperar mensaje guardado
  const savedQuote = localStorage.getItem(
    "codigoMujerLibreDailyQuote"
  );

  if (savedQuote && dailyQuote) {
    dailyQuote.textContent = savedQuote;
  }


  // ==============================
  // WELLNESS / SUPPORT
  // ==============================

  document.querySelectorAll(".support").forEach(button => {

    button.addEventListener("click", () => {

      const type = button.getAttribute("data-type");

      const titlesES = {
        talk: "Hablemos",
        prayer: "Oración",
        idea: "Ideas",
        family: "Familia"
      };

      const titlesEN = {
        talk: "Let's talk",
        prayer: "Prayer",
        idea: "Ideas",
        family: "Family"
      };

      const titles =
        currentLanguage === "es"
          ? titlesES
          : titlesEN;

      if (modalText) {
        modalText.value = "";
      }

      openModal(titles[type] || "");

    });

  });


  // ==============================
  // FORMULARIOS
  // ==============================

  document.querySelectorAll("form").forEach(form => {

    form.addEventListener("submit", event => {

      event.preventDefault();

      const data = Object.fromEntries(
        new FormData(form).entries()
      );

      let submissions = [];

      try {
        submissions =
          JSON.parse(
            localStorage.getItem(
              "codigoMujerLibreForms"
            )
          ) || [];
      } catch (error) {
        submissions = [];
      }

      submissions.push({
        ...data,
        submittedAt: new Date().toISOString()
      });

      localStorage.setItem(
        "codigoMujerLibreForms",
        JSON.stringify(submissions)
      );

      alert(
        currentLanguage === "es"
          ? "¡Gracias! Tu información fue guardada."
          : "Thank you! Your information was saved."
      );

      form.reset();

    });

  });


  // Asegurar que Inicio aparezca al cargar
  const activePage = document.querySelector(".page.active");

  if (!activePage) {
    showPage("home");
  }

});
