// Código Mujer Libre — Privacy Notice + Terms of Use (ES/EN), shown in a plain reading sheet.
// Text only. It describes what the app really does today; it does not invent a legal entity, address,
// phone or email: questions and requests go through the in-app "Aquí para ti" messages.
(function () {
"use strict";
const DOC = {
  privacy: {
    es: { title: "Aviso de privacidad", updated: "Actualizado: octubre de 2026", s: [
      ["Quién la ofrece", "Código Mujer Libre es una comunidad privada de mujeres. Esta aplicación es solo para sus miembros."],
      ["Qué datos guardamos", "Al pedir tu membresía: nombre, apellido, ciudad o zona, correo, teléfono (y si aceptas WhatsApp), mes y día de cumpleaños, tus intereses y tus respuestas de solicitud. Después, lo que tú decidas compartir: foto de perfil, publicaciones, fotos, comentarios, recuerdos, mensajes privados, peticiones de oración, respuestas a eventos y mensajes de chat de eventos."],
      ["Para qué los usamos", "Para revisar tu solicitud, darte acceso, organizar eventos y viajes, enviarte avisos de la comunidad y acompañarte cuando nos escribes. No vendemos tus datos ni los usamos para publicidad."],
      ["Quién puede verlos", "Tus publicaciones, fotos y comentarios los ven las miembros aprobadas. Tus mensajes privados y peticiones de oración los lee el equipo administrador. Las peticiones de oración anónimas se muestran sin tu nombre a la comunidad, pero el equipo puede saber quién las envió. Tu teléfono y correo no se muestran a otras miembros."],
      ["Servicios que usamos", "Supabase (cuentas y base de datos), GitHub Pages (alojamiento de la aplicación), Google Fonts (tipografías) y, para algunas imágenes por defecto, Unsplash. El equipo puede usar un asistente de IA para pulir textos de eventos y buscar ideas; no se le envían datos personales de las miembros."],
      ["Cuánto tiempo", "Guardamos tus datos mientras seas miembro. Si pides que los borremos, eliminamos tu cuenta y tu contenido."],
      ["Tus derechos", "Puedes pedir ver, corregir o borrar tus datos, o cerrar tu cuenta. Escríbenos desde Aquí para ti → «Necesito hablar» y lo atendemos."],
      ["Cambios", "Si este aviso cambia de forma importante, lo verás aquí con una nueva fecha."]
    ] },
    en: { title: "Privacy Notice", updated: "Updated: October 2026", s: [
      ["Who runs it", "Código Mujer Libre is a private community of women. This app is for its members only."],
      ["What we keep", "When you apply: first and last name, city or area, email, phone (and whether you accept WhatsApp), birthday month and day, your interests and your application answers. Afterwards, whatever you choose to share: profile photo, posts, photos, comments, memories, private messages, prayer requests, event replies and event chat messages."],
      ["What we use it for", "To review your application, give you access, organize events and trips, send you community notices and support you when you write to us. We do not sell your data or use it for advertising."],
      ["Who can see it", "Your posts, photos and comments are seen by approved members. Your private messages and prayer requests are read by the admin team. Anonymous prayer requests are shown to the community without your name, but the team can tell who sent them. Your phone and email are not shown to other members."],
      ["Services we use", "Supabase (accounts and database), GitHub Pages (hosting the app), Google Fonts (typefaces) and, for some default images, Unsplash. The team may use an AI assistant to polish event text and look for ideas; no member personal data is sent to it."],
      ["How long", "We keep your data while you are a member. If you ask us to delete it, we remove your account and your content."],
      ["Your rights", "You can ask to see, correct or delete your data, or close your account. Write to us from Here for you → “I need to talk” and we will take care of it."],
      ["Changes", "If this notice changes in an important way, you will see it here with a new date."]
    ] }
  },
  terms: {
    es: { title: "Términos de uso", updated: "Actualizado: octubre de 2026", s: [
      ["Una comunidad privada", "Código Mujer Libre es un espacio privado. El acceso lo aprueba el equipo y puede retirarse si no se respetan estas normas."],
      ["Nuestro código", "Respeto y cariño. Lo que se comparte aquí, se queda aquí. Sin ventas ni spam entre miembros. Aparece y participa."],
      ["Tu contenido", "Lo que publicas es tuyo. Al publicarlo, permites que las miembros de la comunidad lo vean dentro de la aplicación. No publiques contenido ofensivo, que dañe a otras personas o que no te pertenezca. Podemos ocultar o quitar contenido que incumpla estas normas."],
      ["Eventos y viajes", "Los planes, precios y detalles pueden cambiar. La información de pago y contacto de cada plan es solo para miembros aprobadas."],
      ["Apoyo, no emergencias", "Aquí para ti ofrece apoyo comunitario entre mujeres. No es un servicio de emergencia, no reemplaza ayuda profesional médica, legal o de salud mental y no se atiende las 24 horas. En peligro inmediato, usa los recursos de emergencia que aparecen en la aplicación."],
      ["Tu cuenta", "Cuida tu contraseña y no la compartas. Puedes pedir cerrar tu cuenta cuando quieras."],
      ["Cambios", "Podemos actualizar estos términos; verás aquí la fecha más reciente."]
    ] },
    en: { title: "Terms of Use", updated: "Updated: October 2026", s: [
      ["A private community", "Código Mujer Libre is a private space. Access is approved by the team and may be withdrawn if these rules are not respected."],
      ["Our code", "Respect and warmth. What is shared here, stays here. No selling or spam between members. Show up and take part."],
      ["Your content", "What you post is yours. By posting it you allow the members of the community to see it inside the app. Do not post content that is offensive, harms other people or does not belong to you. We may hide or remove content that breaks these rules."],
      ["Events and trips", "Plans, prices and details may change. Payment and contact information for each plan is for approved members only."],
      ["Support, not emergencies", "Here for you offers community support between women. It is not an emergency service, does not replace professional medical, legal or mental-health help and is not monitored 24/7. If you are in immediate danger, use the emergency resources shown in the app."],
      ["Your account", "Keep your password safe and do not share it. You can ask to close your account at any time."],
      ["Changes", "We may update these terms; the latest date will be shown here."]
    ] }
  }
};
const CLOSE = { es: "Cerrar", en: "Close" };
let overlay = null, back = null;
function lang() { return window.CML && window.CML.lang ? window.CML.lang() : (document.documentElement.lang === "en" ? "en" : "es"); }
function close() {
  if (!overlay) return;
  overlay.remove(); overlay = null; document.removeEventListener("keydown", onKey, true);
  document.body.style.overflow = overlay_prev; if (back && back.focus) back.focus();
}
let overlay_prev = "";
function onKey(e) {
  if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); }
  else if (e.key === "Tab" && overlay) { const b = overlay.querySelector(".lg-x"); e.preventDefault(); b.focus(); }
}
function open(kind) {
  const d = DOC[kind] && DOC[kind][lang()]; if (!d) return;
  if (overlay) overlay.remove();
  back = document.activeElement;
  const mk = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  overlay = mk("div", "lg-back"); overlay.setAttribute("data-legal-sheet", kind);
  const panel = mk("div", "lg-panel"); panel.setAttribute("role", "dialog"); panel.setAttribute("aria-modal", "true"); panel.setAttribute("aria-labelledby", "lgTitle");
  const x = mk("button", "lg-x", CLOSE[lang()]); x.type = "button";
  const h = mk("h2", "lg-h", d.title); h.id = "lgTitle";
  panel.append(x, h, mk("p", "lg-u", d.updated));
  d.s.forEach(([a, b]) => panel.append(mk("h3", "lg-s", a), mk("p", "lg-p", b)));
  overlay.append(panel); document.body.append(overlay);
  overlay_prev = document.body.style.overflow; document.body.style.overflow = "hidden";
  x.addEventListener("click", close);
  overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
  document.addEventListener("keydown", onKey, true);
  x.focus({ preventScroll: true });
}
document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-legal]"); if (b) { e.preventDefault(); open(b.getAttribute("data-legal")); } });
window.CMLLegal = { open, close };
})();
