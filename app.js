// Código Mujer Libre — ES / EN

let currentLanguage = "es";

const translations = {
  es: {
    community: "TU COMUNIDAD",
    heroTitle: "Más conexión. Más vida. Más tú.",
    heroText: "Un espacio fresco para conectar, salir, crecer y sentirte acompañada.",
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
    heroText: "A fresh space to connect, go out, grow and feel supported.",
    today: "TODAY'S MESSAGE",
    home: "Home",
    events: "Events",
    communityNav: "Community",
    messages: "Messages",
    wellness: "Wellness"
  }
};

function setLanguage(lang) {
  currentLanguage = lang;
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-es]").forEach(element => {
    const text = element.getAttribute(`data-${lang}`);
    if (text) element.textContent = text;
  });

  const languageButton =
    document.querySelector("#languageToggle") ||
    document.querySelector(".language-toggle") ||
    document.querySelector("[data-language-toggle]");

  if (languageButton) {
    languageButton.textContent = lang === "es" ? "EN" : "ES";
  }

  localStorage.setItem("codigoMujerLibreLanguage", lang);
}

function toggleLanguage() {
  setLanguage(currentLanguage === "es" ? "en" : "es");
}

document.addEventListener("DOMContentLoaded", () => {

  const savedLanguage =
    localStorage.getItem("codigoMujerLibreLanguage") || "es";

  setLanguage(savedLanguage);

  const languageButton =
    document.querySelector("#languageToggle") ||
    document.querySelector(".language-toggle") ||
    document.querySelector("[data-language-toggle]");

  if (languageButton) {
    languageButton.addEventListener("click", toggleLanguage);
  }

  // Navegación interactiva
  document.querySelectorAll("[data-section]").forEach(button => {
    button.addEventListener("click", () => {
      const section = button.getAttribute("data-section");

      document.querySelectorAll(".app-section").forEach(item => {
        item.style.display = "none";
      });

      const target = document.getElementById(section);

      if (target) {
        target.style.display = "block";
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });

  // Formularios
  document.querySelectorAll("form").forEach(form => {
    form.addEventListener("submit", event => {
      event.preventDefault();

      const data = Object.fromEntries(new FormData(form).entries());

      const submissions =
        JSON.parse(localStorage.getItem("codigoMujerLibreForms") || "[]");

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

});
