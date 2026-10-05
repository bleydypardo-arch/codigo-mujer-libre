// Código Mujer Libre — approved redesign helpers (frontend only, no new backend, no paid AI).
//  • "Tu código de hoy": daily flip card picked automatically from a small bilingual library.
//    The existing admin "Mensaje de hoy" (#dailyQuote, settings.daily_quote) is shown on its back.
//  • Quick shortcuts / back buttons ([data-go]) that reuse the existing showPage().
//  • Viajes y Experiencias page: reuses existing trips (plans kind 'trip'), their polls,
//    Interested/Going and trip chat. Admins get a shortcut to the existing admin "trips" tab.
//  • Wellness "¿Cómo te sientes hoy?": prewritten responses (no AI calls).
//  • "Nuestra esencia" link for the profile page.
(function () {
"use strict";
let C = null;

const ES = {
  codeToday: "TU CÓDIGO DE HOY", codeYourMsg: "TU MENSAJE", codeTap: "Toca para descubrir tu mensaje", codeTapBack: "Toca para volver",
  codeFlipAria: "Tu código de hoy. Toca para voltear la tarjeta.",
  quickLabel: "Accesos rápidos", travelShort: "Viajes", backLabel: "Volver",
  immerseTitle: "Sumérgete a una experiencia", immerseSub: "Viajes · Retiros · Fiestas · Gastronomía · Actividades únicas para nuestra comunidad.",
  travelTitle: "Viajes y Experiencias", travelTeaser: "Vota y vive las grandes experiencias de la comunidad",
  travelTypesLabel: "TIPOS DE EXPERIENCIA",
  travelNote: "Organizamos alrededor de dos grandes experiencias oficiales al año. Cuando abramos una votación, aparecerá aquí.",
  expTrip: "Viaje grupal", expRetreat: "Retiro de bienestar", expParty: "Fiesta temática", expDining: "Experiencia gastronómica", expNature: "Aventura / Naturaleza",
  travelEmpty: "Pronto anunciaremos la próxima gran experiencia.",
  travelNote: "Organizamos alrededor de dos grandes experiencias oficiales al año. Toca un tipo para ver lo que viene.",
  travelKicker: "CÓDIGO EXPERIENCES", travelLead: "Dos experiencias inolvidables al año. Una comunidad.",
  travelIntro: "Dos veces al año salimos de la pantalla para vivir juntas algo extraordinario.",
  travelBadge: "2 experiencias insignia al año", travelBadge2: "Descubre · Conecta · Viaja · Vive", travelCta: "Ver la próxima experiencia",
  tripsLabel: "EXPERIENCIAS", tripCount: n => n === 1 ? "1 experiencia" : n + " experiencias", tripSoonShort: "Próximamente",
  travelPollKicker: "VOTEMOS JUNTAS", travelPollTitle: "¿A dónde vamos ahora?", travelPollIntro: "Elige tu favorito. Después de votar verás cómo va la comunidad.",
  tripIdeaLabel: "TU IDEA", tripIdeaTitle: "¿A dónde te gustaría ir?", tripIdeaText: "Sugiere nuestro próximo destino o experiencia. La administradora lo usará al planear la próxima experiencia oficial.",
  tripIdeaPh: "Ej.: Tulum, Bahamas, un retiro en la montaña…", tripIdeaSend: "Enviar idea", tripIdeaPrefix: "Destino sugerido",
  tripIdeaThanks: "¡Gracias! Tu idea llegó a la administradora.", tripIdeaFail: "No se pudo enviar. Inténtalo de nuevo.", travelManage: "Gestionar experiencias", nextTrip: "Próximo viaje",
  essTitle: "Nuestra esencia", essPhoto: "Foto de la fundadora", essQ: "¿Por qué nació Código Mujer Libre?",
  essP1: "Creé Código Mujer Libre porque muchas veces las mujeres pasamos la vida cuidando, resolviendo, trabajando y pensando en todos los demás, mientras nos dejamos para el final.",
  essP2: "Este es un espacio para recordarnos que nosotras también importamos. Para encontrar un poco más de equilibrio entre nuestra vida cotidiana, nuestro bienestar, nuestra vida espiritual, nuestras amistades y esos momentos que simplemente nos hacen sentir bien.",
  essP3: "No se trata de hacer más. Se trata de vivir mejor, conectar, disfrutar y también hacer espacio para nosotras.",
  essLove: "Con cariño,", essRole: "Fundadora, Código Mujer Libre", essLink: "Nuestra esencia", essLinkSub: "¿Por qué nació Código Mujer Libre?",
  moodChosen: "Elegiste", moodReset: "MINI PAUSA",
  moodQ: "¿Cómo quieres sentirte hoy?", moodEnergy: "Más energía", moodStress: "Menos estrés", moodSleep: "Dormir mejor", moodEat: "Comer mejor", moodMove: "Mover mi cuerpo", moodPeace: "Necesito paz"
};
const EN = {
  codeToday: "YOUR CODE FOR TODAY", codeYourMsg: "YOUR MESSAGE", codeTap: "Tap to discover your message", codeTapBack: "Tap to turn back",
  codeFlipAria: "Your code for today. Tap to flip the card.",
  quickLabel: "Shortcuts", travelShort: "Travel", backLabel: "Back",
  immerseTitle: "Immerse yourself in an experience", immerseSub: "Trips · Retreats · Parties · Dining · Unique activities for our community.",
  travelTitle: "Travel & Experiences", travelTeaser: "Vote on and live the community's big experiences",
  travelTypesLabel: "TYPES OF EXPERIENCE",
  travelNote: "We organize about two major official experiences a year. When a vote opens, it will appear here.",
  expTrip: "Group trip", expRetreat: "Wellness retreat", expParty: "Themed celebration", expDining: "Dining experience", expNature: "Adventure & Nature",
  travelEmpty: "We'll announce the next big experience soon.",
  travelNote: "We organize about two major official experiences a year. Tap a type to see what's coming.",
  travelKicker: "CÓDIGO EXPERIENCES", travelLead: "Two unforgettable experiences a year. One community.",
  travelIntro: "Twice a year, we step beyond the screen to live something extraordinary together.",
  travelBadge: "2 signature experiences a year", travelBadge2: "Discover · Connect · Travel · Live", travelCta: "See the next experience",
  tripsLabel: "EXPERIENCES", tripCount: n => n === 1 ? "1 experience" : n + " experiences", tripSoonShort: "Coming soon",
  travelPollKicker: "LET'S VOTE TOGETHER", travelPollTitle: "Where should we go next?", travelPollIntro: "Pick your favorite. After voting you'll see how the community is leaning.",
  tripIdeaLabel: "YOUR IDEA", tripIdeaTitle: "Where would you love to go?", tripIdeaText: "Suggest our next destination or experience. The administrator will use it when planning the next official experience.",
  tripIdeaPh: "e.g. Tulum, the Bahamas, a mountain retreat…", tripIdeaSend: "Send idea", tripIdeaPrefix: "Suggested destination",
  tripIdeaThanks: "Thank you! Your idea reached the administrator.", tripIdeaFail: "Could not send. Please try again.", travelManage: "Manage experiences", nextTrip: "Next trip",
  essTitle: "Our essence", essPhoto: "Founder photo", essQ: "Why was Código Mujer Libre born?",
  essP1: "I created Código Mujer Libre because so often we women spend our lives caring for others, solving problems, working and thinking about everyone else, while leaving ourselves for last.",
  essP2: "This is a space to remind us that we matter too. A place to find a little more balance between our everyday life, our well-being, our spiritual life, our friendships and those moments that simply make us feel good.",
  essP3: "It's not about doing more. It's about living better, connecting, enjoying, and also making room for ourselves.",
  essLove: "With love,", essRole: "Founder, Código Mujer Libre", essLink: "Our essence", essLinkSub: "Why was Código Mujer Libre born?",
  moodChosen: "You chose", moodReset: "MINI RESET",
  moodQ: "How do you want to feel today?", moodEnergy: "More energy", moodStress: "Less stress", moodSleep: "Sleep better", moodEat: "Eat better", moodMove: "Move my body", moodPeace: "I need peace"
};

// ---------- Tu código de hoy: library (Scripture from public-domain Reina-Valera 1909 / King James) ----------
const ART = {
  light: "M12 2.5v2.5M5.3 5.3l1.8 1.8M18.7 5.3l-1.8 1.8M2.5 12H5M19 12h2.5M8 16a4 4 0 1 1 8 0v2H8zM10 21h4",
  heart: "M12 20s-7.5-4.6-9.2-9.4C1.6 7.2 3.8 4 7 4c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.2 0 5.4 3.2 4.2 6.6C19.5 15.4 12 20 12 20z",
  dove: "M3 13c3 0 5-1 6.5-3C11 7.5 13 6 16 6c1.5 0 2.5.8 3 2l2.5.5L19 10c0 5-4 8-9 8-2.5 0-4.5-1-6-2.5L6 14c-1.5 0-2.5-.4-3-1zM16.5 8.5h.01M9 12.5c1.5 1 3.5 1 5-.5",
  crown: "M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5zM5 19h14",
  cross: "M12 2.5v19M6.5 8h11",
  star: "M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z",
  sprig: "M12 21V9M12 13c-3 0-5-2-5.5-5 3 0 5 2 5.5 5zM12 10c3 0 5-2 5.5-5-3 0-5 2-5.5 5zM12 17c2.5 0 4.2-1.6 4.6-4-2.5 0-4.2 1.6-4.6 4z",
  sun: "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
};
const CARDS = [
  { bg: "#FFF9F8", art: "light",
    es: { aff: "Hoy no caminas sola: Su luz va delante de ti.", refl: "Antes de que abrieras los ojos, Dios ya pensaba en ti. Empieza este día desde la calma, no desde la prisa.", verse: "Nuevas son cada mañana; grande es tu fidelidad.", ref: "Lamentaciones 3:23" },
    en: { aff: "You don't walk alone today: His light goes before you.", refl: "Before you opened your eyes, God was already thinking of you. Begin this day from calm, not from hurry.", verse: "They are new every morning: great is thy faithfulness.", ref: "Lamentations 3:23" } },
  { bg: "#FADBD8", art: "heart",
    es: { aff: "Eres amada antes de lograr nada.", refl: "Tu valor no depende de tu agenda ni de tu productividad. Fuiste creada con intención y propósito.", verse: "Te alabaré; porque formidables, maravillosas son tus obras.", ref: "Salmos 139:14" },
    en: { aff: "You are loved before you achieve anything.", refl: "Your worth doesn't depend on your schedule or your productivity. You were created with intention and purpose.", verse: "I will praise thee; for I am fearfully and wonderfully made.", ref: "Psalm 139:14" } },
  { bg: "#DDEBD9", art: "dove",
    es: { aff: "La paz de Dios cabe en tu día más lleno.", refl: "No tienes que cargarlo todo hoy. Entrega lo que pesa y quédate con lo que da vida.", verse: "Venid a mí todos los que estáis trabajados y cargados, que yo os haré descansar.", ref: "Mateo 11:28" },
    en: { aff: "God's peace fits inside your busiest day.", refl: "You don't have to carry everything today. Hand over what weighs you down and keep what gives life.", verse: "Come unto me, all ye that labour and are heavy laden, and I will give you rest.", ref: "Matthew 11:28" } },
  { bg: "#EFE6DE", art: "crown",
    es: { aff: "Te vistes de fuerza y dignidad.", refl: "La verdadera fuerza es serena. No necesita gritar para mantenerse firme.", verse: "Fortaleza y honor son su vestidura; y en el día postrero reirá.", ref: "Proverbios 31:25" },
    en: { aff: "You are clothed in strength and dignity.", refl: "True strength is quiet. It doesn't need to shout to stand firm.", verse: "Strength and honour are her clothing; and she shall rejoice in time to come.", ref: "Proverbs 31:25" } },
  { bg: "#FFF9F8", art: "cross",
    es: { aff: "Lo que Él empezó en ti, lo va a terminar.", refl: "Tu proceso no es un error. Cada etapa tiene sentido en las manos de Dios.", verse: "…el que comenzó en vosotros la buena obra, la perfeccionará.", ref: "Filipenses 1:6" },
    en: { aff: "What He began in you, He will complete.", refl: "Your process is not a mistake. Every season has meaning in God's hands.", verse: "…he which hath begun a good work in you will perform it.", ref: "Philippians 1:6" } },
  { bg: "#FADBD8", art: "star",
    es: { aff: "No temas: Dios va contigo.", refl: "El valor no es la ausencia de miedo; es dar el siguiente paso de la mano de Dios.", verse: "No temas, que yo soy contigo; no desmayes, que yo soy tu Dios.", ref: "Isaías 41:10" },
    en: { aff: "Fear not: God goes with you.", refl: "Courage isn't the absence of fear; it's taking the next step holding God's hand.", verse: "Fear thou not; for I am with thee: be not dismayed; for I am thy God.", ref: "Isaiah 41:10" } },
  { bg: "#DDEBD9", art: "sprig",
    es: { aff: "Florecer también lleva su tiempo.", refl: "Hay estaciones para sembrar y estaciones para esperar. Confía en el tiempo de Dios.", verse: "Todo lo que se quiere debajo del cielo, tiene su tiempo.", ref: "Eclesiastés 3:1" },
    en: { aff: "Blooming takes its own time.", refl: "There are seasons to plant and seasons to wait. Trust God's timing.", verse: "To every thing there is a season, and a time to every purpose under the heaven.", ref: "Ecclesiastes 3:1" } },
  { bg: "#EFE6DE", art: "sun",
    es: { aff: "Eres luz donde Dios te ha puesto.", refl: "Una palabra amable o un mensaje a tiempo pueden iluminar el día de otra mujer.", verse: "Vosotros sois la luz del mundo.", ref: "Mateo 5:14" },
    en: { aff: "You are light where God has placed you.", refl: "A kind word or a timely message can light up another woman's day.", verse: "Ye are the light of the world.", ref: "Matthew 5:14" } }
];
const dayOfYear = d => Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
function renderCode() {
  const now = new Date();
  const card = CARDS[dayOfYear(now) % CARDS.length];
  const txt = card[C.lang()] || card.es;
  const set = (id, v) => { const n = document.getElementById(id); if (n) n.textContent = v; };
  set("codeAff", txt.aff); set("codeRefl", txt.refl); set("codeVerse", "“" + txt.verse + "”"); set("codeRef", txt.ref);
  set("codeDate", now.toLocaleDateString(C.loc(), { day: "numeric", month: "short" }));
  const art = document.getElementById("codeArt"); if (art) art.setAttribute("d", ART[card.art]);
  const box = document.getElementById("codeCard"); if (box) box.style.setProperty("--code-bg", card.bg);
}
function wireFlip() {
  const btn = document.getElementById("codeFlip"), box = document.getElementById("codeCard");
  if (!btn || !box || btn.dataset.wired) return;
  btn.dataset.wired = "1";
  btn.addEventListener("click", () => {
    const on = !box.classList.contains("is-flipped");
    box.classList.toggle("is-flipped", on);
    btn.setAttribute("aria-pressed", String(on));
    if (on) burst(box);
  });
}
// a short gold/rose burst when the message is revealed (skipped with reduced motion)
function burst(box) {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const old = box.querySelector(".code-burst"); if (old) old.remove();
  const wrap = C.el("span", { class: "code-burst", "aria-hidden": "true" });
  const colors = ["#F6E7C6", "#DBC19F", "#E7A0AA", "#B85F68", "#fff"];
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2 + Math.random() * .3, d = 70 + Math.random() * 70;
    const s = C.el("i");
    s.style.setProperty("--dx", Math.round(Math.cos(a) * d) + "px");
    s.style.setProperty("--dy", Math.round(Math.sin(a) * d * .7) + "px");
    s.style.setProperty("--c", colors[i % colors.length]);
    s.style.animationDelay = (Math.random() * 120) + "ms";
    wrap.appendChild(s);
  }
  box.appendChild(wrap);
  setTimeout(() => wrap.remove(), 1400);
}

// ---------- [data-go] shortcuts and back buttons (existing showPage) ----------
function wireGo() {
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-go]");
    if (!b || !C) return;
    const page = b.getAttribute("data-go");
    if (page === "travel") paintTravel();
    C.showPage(page);
  });
  document.querySelectorAll(".immerse img").forEach(img => img.addEventListener("error", () => { img.hidden = true; }));
  const manage = document.getElementById("travelManage");
  if (manage) manage.addEventListener("click", () => {
    if (C && C.isAdmin() && window.CMLAdmin && window.CMLAdmin.openTab) window.CMLAdmin.openTab("trips");
  });
}

// ---------- Viajes y Experiencias ----------
const TYPE_KEY = { trip: "expTrip", retreat: "expRetreat", party: "expParty", dining: "expDining", nature: "expNature" };
function paintTravel() {
  if (!C) return;
  const hero = document.getElementById("travelHero");
  const manage = document.getElementById("travelManage"), sug = document.getElementById("travelSuggest");
  const signedIn = !!C.session();
  const trips = signedIn ? C.homeData().plans.filter(p => p.kind === "trip").sort(C.byDate) : [];
  if (manage) manage.hidden = !(signedIn && C.isAdmin() && window.CMLAdmin && window.CMLAdmin.openTab);
  if (sug) sug.hidden = !signedIn;
  // type tiles: real filters with counts (an empty type shows a "coming soon" state, never a dead tile)
  const current = C.tripType ? C.tripType() : "all";
  document.querySelectorAll("#travelTypes .trip-type").forEach(b => {
    const k = b.getAttribute("data-type");
    const n = trips.filter(p => C.tripTypeOf(p) === k).length;
    const on = current === k;
    b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on));
    const nNode = b.querySelector(".trip-type-n");
    if (nNode) nNode.textContent = n ? C.t("tripCount")(n) : C.t("tripSoonShort");
    if (!b.dataset.wired) {
      b.dataset.wired = "1";
      b.addEventListener("click", () => {
        const next = (C.tripType() === b.getAttribute("data-type")) ? "all" : b.getAttribute("data-type");
        C.setTripType(next); paintTravel();
        const list = document.getElementById("tripsBlock");
        if (list && window.matchMedia("(max-width: 1023px)").matches) list.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  });
  // destination / experience polls (existing polls, placed on Travel by the admin)
  const pollsHost = document.getElementById("travelPolls");
  if (pollsHost) {
    const block = window.CMLPolls && window.CMLPolls.placedBlock
      ? window.CMLPolls.placedBlock("travel", C.t("travelPollKicker"), C.t("travelPollTitle"), C.t("travelPollIntro")) : null;
    pollsHost.replaceChildren(...(block ? [block] : []));
  }
  // campaign CTA → the next official experience
  const next = trips.find(p => p.event_date && p.event_date >= C.todayStr()) || trips[0];
  const cta = document.getElementById("travelCta");
  if (cta) {
    cta.hidden = !next;
    if (!cta.dataset.wired) { cta.dataset.wired = "1"; cta.addEventListener("click", () => { const n = cta._next; if (n) C.openDetail(n.id, cta); }); }
    cta._next = next || null;
  }
  // cinematic stage + "two a year" story + admin shortcuts (experiences.js)
  if (window.CMLExp) window.CMLExp.paintTravelPage();
  else if (hero) hero.hidden = true;
}
// "¿A dónde te gustaría ir?" → a private idea message to the administrator (existing messages table, type 'idea')
function wireTripIdea() {
  const form = document.getElementById("travelSuggest");
  if (!form || form.dataset.wired) return;
  form.dataset.wired = "1";
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const input = document.getElementById("tripIdea"), fb = document.getElementById("tripIdeaFb"), b = document.getElementById("tripIdeaBtn");
    const text = input.value.trim();
    if (!text || !C.session()) { input.focus(); return; }
    b.disabled = true;
    const r = await C.db.from("messages").insert({ user_id: C.session().user.id, type: "idea", body: "✈️ " + C.t("tripIdeaPrefix") + ": " + text.slice(0, 120) });
    b.disabled = false;
    fb.hidden = false;
    fb.classList.toggle("ok", !r.error);
    fb.textContent = r.error ? C.t("tripIdeaFail") : C.t("tripIdeaThanks");
    if (!r.error) input.value = "";
  });
}

// ---------- editorial images (admin-editable through the existing settings table) ----------
const DEFAULT_TRAVEL = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80";
function settingUrl(key) {
  const v = C && C.setting ? C.setting(key) : null;
  return v && v.url ? C.safeUrl(v.url) : "";
}
function travelImage() {
  if (!C) return DEFAULT_TRAVEL;
  const fromSetting = settingUrl("travel_image");
  if (fromSetting) return fromSetting;
  const trip = C.session() ? C.homeData().plans.find(p => p.kind === "trip" && C.safeUrl(p.image_url)) : null;
  return trip ? C.safeUrl(trip.image_url) : DEFAULT_TRAVEL;
}
function paintEditorial() {
  if (!C) return;
  // section entrance photos (admin, optional); Travel always has a campaign photo
  const pages = (C.setting && C.setting("page_images")) || {};
  document.querySelectorAll(".page-head[data-page-image]").forEach(h => {
    const key = h.getAttribute("data-page-image");
    const url = C.safeUrl(pages[key] || "") || (key === "travel" ? travelImage() : "");
    const media = h.querySelector(".ph-media");
    h.classList.toggle("has-photo", !!url);
    if (media) media.style.backgroundImage = url ? 'url("' + url.replace(/"/g, "%22") + '")' : "";
  });
  // brand logo (admin, optional) → falls back to the approved logo
  const logo = settingUrl("brand_logo") || "logo-cml.svg";
  document.querySelectorAll("img.brand-mark, .auth-brand img, .approval-logo").forEach(img => { if (img.getAttribute("src") !== logo) img.setAttribute("src", logo); });
  const src = travelImage();
  document.querySelectorAll("img[data-editorial=travel]").forEach(img => { if (img.getAttribute("src") !== src) { img.hidden = false; img.setAttribute("src", src); } });
  const box = document.querySelector("#essence .ess-photo");
  if (box) {
    const url = settingUrl("founder_photo");
    if (!box._orig) box._orig = [...box.childNodes];
    const current = box.querySelector("img");
    if (url && (!current || current.getAttribute("src") !== url)) {
      const img = C.el("img", { src: url, alt: "" });
      img.addEventListener("error", () => { box.replaceChildren(...box._orig); box.classList.remove("has-photo"); });
      box.replaceChildren(img); box.classList.add("has-photo");
    } else if (!url && current) {
      box.classList.remove("has-photo");
      box.replaceChildren(...box._orig);
    }
  }
}

// ---------- write in Community with a prepared first line (the member still decides to publish) ----------
function compose(text) {
  if (!C) return;
  C.showPage("community", false);
  const field = document.getElementById("postText");
  if (!field) return;
  const start = field.value.trim();
  field.value = start ? start + "\n" + text : text;
  requestAnimationFrame(() => {
    field.scrollIntoView({ behavior: "smooth", block: "center" });
    field.focus({ preventScroll: true });
    field.setSelectionRange(field.value.length, field.value.length);
  });
}

// ---------- Wellness: need/mood → prewritten response ----------
const TIPS = {
  energy: { es: ["Una caminata corta al sol y un vaso de agua pueden cambiar tu tarde. Mira también los planes de esta semana en Eventos.", "Elige una sola cosa que te ilusione hoy y dale espacio. La energía también se contagia: escribe a una amiga."],
            en: ["A short walk in the sun and a glass of water can change your afternoon. Check this week's plans in Events, too.", "Pick one thing you're looking forward to today and give it room. Energy is contagious: text a friend."] },
  stress: { es: ["Respira: inhala 4, sostén 4, exhala 6, cinco veces. Si quieres hablarlo, ve a Apoyo y toca «Necesito hablar».", "Escribe en una lista lo que te preocupa y elige solo lo próximo. Lo demás puede esperar."],
            en: ["Breathe: in for 4, hold for 4, out for 6, five times. If you'd like to talk, go to Support and tap “I need to talk”.", "Write down what's on your mind and choose only the next step. The rest can wait."] },
  sleep:  { es: ["Esta noche, deja el teléfono 30 minutos antes de dormir y termina el día dando gracias por tres cosas.", "Una luz tenue, una bebida caliente sin cafeína y una oración breve preparan tu descanso."],
            en: ["Tonight, put your phone away 30 minutes before bed and end the day thanking God for three things.", "Dim light, a warm caffeine-free drink and a short prayer help you get ready to rest."] },
  eat:    { es: ["Agrega un color más a tu plato hoy y toma agua con cada comida. Pequeños pasos cuentan.", "Comer acompañada también nutre: invita a alguien a compartir un café o un almuerzo."],
            en: ["Add one more color to your plate today and drink water with each meal. Small steps count.", "Eating with others nourishes too: invite someone to share a coffee or lunch."] },
  move:   { es: ["Quince minutos de caminata cuentan. Si prefieres compañía, busca un plan de bienestar en Eventos.", "Estira cuello, hombros y espalda dos minutos. Tu cuerpo te lo agradecerá."],
            en: ["Fifteen minutes of walking counts. If you'd like company, look for a wellness plan in Events.", "Stretch your neck, shoulders and back for two minutes. Your body will thank you."] },
  peace:  { es: ["Haz una pausa: voltea tu Código de hoy en Inicio, o comparte una petición en el muro de oración (en Apoyo).", "Busca un lugar tranquilo, cierra los ojos un minuto y entrega a Dios lo que te pesa."],
            en: ["Take a pause: flip Your Code for Today on Home, or share a request on the prayer wall (in Support).", "Find a quiet spot, close your eyes for a minute and hand over to God what weighs on you."] }
};
// Richer response card: what she chose, a short suggestion, a 3-step mini reset and one useful next step.
const RESET = {
  energy: { es: { t: "Despierta tu energía", steps: ["Toma un vaso de agua", "Sal 10 minutos a la luz del día", "Escríbele a una amiga para un plan"], a: "Ver planes de esta semana" },
            en: { t: "Wake up your energy", steps: ["Drink a glass of water", "Step outside for 10 minutes of daylight", "Text a friend about a plan"], a: "See this week's plans" }, go: "events", art: "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" },
  stress: { es: { t: "Un minuto para soltar", steps: ["Inhala 4 segundos", "Sostén 4 segundos", "Exhala 6 segundos · repite 5 veces"], a: "Hablar con alguien" },
            en: { t: "A minute to let go", steps: ["Breathe in for 4 seconds", "Hold for 4 seconds", "Breathe out for 6 · repeat 5 times"], a: "Talk to someone" }, go: "support", art: "M5 19c0-8 5-13 14-14-1 9-6 14-14 14zM5 19l7-7" },
  sleep:  { es: { t: "Prepárate para descansar", steps: ["Deja el teléfono 30 minutos antes", "Luz tenue y una bebida caliente", "Agradece tres cosas de hoy"], a: "Leer tu código de hoy" },
            en: { t: "Get ready to rest", steps: ["Put your phone away 30 minutes before", "Dim light and a warm drink", "Give thanks for three things today"], a: "Read your code for today" }, go: "home", art: "M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" },
  eat:    { es: { t: "Nútrete con cariño", steps: ["Agrega un color más a tu plato", "Agua con cada comida", "Come sin pantallas, sin prisa"], a: "Descubrir bienestar" },
            en: { t: "Nourish yourself kindly", steps: ["Add one more color to your plate", "Water with every meal", "Eat slowly, away from screens"], a: "Discover wellness" }, go: "discover", art: "M12 7c-1-1.5-3-2-4.5-1.2C5 7 4.5 10.5 6 14c1.2 2.8 3 5 4.5 5 .8 0 1-.5 1.5-.5s.7.5 1.5.5c1.5 0 3.3-2.2 4.5-5 1.5-3.5 1-7-1.5-8.2C15 5 13 5.5 12 7zM12 7c0-2 1-3.5 2.5-4" },
  move:   { es: { t: "Mueve tu cuerpo hoy", steps: ["Estira cuello y hombros 2 minutos", "Camina 15 minutos", "Elige un plan activo con la comunidad"], a: "Ver planes de bienestar" },
            en: { t: "Move your body today", steps: ["Stretch neck and shoulders for 2 minutes", "Walk for 15 minutes", "Pick an active plan with the community"], a: "See wellness plans" }, go: "discover", art: "M6 7v10M3.5 9v6M18 7v10M20.5 9v6M6 12h12" },
  peace:  { es: { t: "Haz espacio para la paz", steps: ["Busca un lugar tranquilo", "Cierra los ojos un minuto", "Entrega a Dios lo que te pesa"], a: "Pedir oración" },
            en: { t: "Make room for peace", steps: ["Find a quiet spot", "Close your eyes for a minute", "Hand over to God what weighs on you"], a: "Ask for prayer" }, go: "support", art: "M12 20c-4 0-8-2-9-6 3 0 5.5 1 7 3M12 20c4 0 8-2 9-6-3 0-5.5 1-7 3M12 20c-2.5-2-3.5-5-3.5-8 0-2.5 1.5-5 3.5-7 2 2 3.5 4.5 3.5 7 0 3-1 6-3.5 8z" }
};
const MOOD_LABEL = { energy: "moodEnergy", stress: "moodStress", sleep: "moodSleep", eat: "moodEat", move: "moodMove", peace: "moodPeace" };
let mood = null;
function moodAction(k) {
  const go = RESET[k].go;
  if (go === "discover") {
    const target = document.getElementById(k === "move" && !document.getElementById("wellUpcoming").hidden ? "wellUpcoming" : "wellDiscover");
    if (target && !target.hidden) target.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  C.showPage(go);
}
function paintMood() {
  const tip = document.getElementById("moodTip");
  document.querySelectorAll(".mood[data-mood]").forEach(b => {
    const on = b.getAttribute("data-mood") === mood;
    b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on));
  });
  if (!tip || !C) return;
  if (!mood || !TIPS[mood]) { tip.hidden = true; tip.replaceChildren(); return; }
  const lang = C.lang();
  const list = TIPS[mood][lang] || TIPS[mood].es;
  const r = RESET[mood][lang] || RESET[mood].es;
  const close = C.el("button", { type: "button", class: "mood-close", "aria-label": C.t("closeLabel"), text: "×" });
  close.addEventListener("click", () => { mood = null; paintMood(); });
  const act = C.el("button", { type: "button", class: "secondary mood-act", text: r.a + " →" });
  const k = mood;
  act.addEventListener("click", () => moodAction(k));
  const art = C.el("span", { class: "mood-art", "aria-hidden": "true" });
  art.innerHTML = '<svg class="ci" viewBox="0 0 24 24" focusable="false"><path d="' + RESET[mood].art + '"/></svg>';
  tip.replaceChildren(
    C.el("div", { class: "mood-tip-top" }, art,
      C.el("span", { class: "mood-chosen" }, C.el("small", { text: C.t("moodChosen") }), C.el("b", { text: C.t(MOOD_LABEL[mood]) })), close),
    C.el("h3", { class: "mood-title", text: r.t }),
    C.el("p", { class: "mood-text", text: list[dayOfYear(new Date()) % list.length] }),
    C.el("small", { class: "mood-reset-k", text: C.t("moodReset") }),
    C.el("ol", { class: "mood-steps" }, ...r.steps.map(x => C.el("li", { text: x }))),
    act);
  tip.hidden = false;
}
function wireMoods() {
  document.querySelectorAll(".mood[data-mood]").forEach(b => b.addEventListener("click", () => {
    const k = b.getAttribute("data-mood");
    mood = mood === k ? null : k;
    paintMood();
    const tip = document.getElementById("moodTip");
    if (mood && tip) requestAnimationFrame(() => tip.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  }));
}

// ---------- Nuestra esencia: link node for the profile page ----------
function essenceLink() {
  const b = C.el("button", { type: "button", class: "card ess-link", "data-go": "essence" },
    C.el("span", { class: "ess-link-ic", "aria-hidden": "true", text: "♡" }),
    C.el("span", { class: "ess-link-txt" }, C.el("b", { text: C.t("essLink") }), C.el("small", { text: C.t("essLinkSub") })),
    C.el("span", { class: "ess-link-go", "aria-hidden": "true", text: "›" }));
  return b;
}

function init() {
  C = window.CML;
  if (!C) return;
  window.CMLRedesign = { essenceLink, paintTravel, compose, travelImage };
  wireTripIdea();
  C.addStrings(ES, EN);
  wireFlip(); wireGo(); wireMoods();
  renderCode(); paintMood();
  document.addEventListener("cml:lang", () => { renderCode(); paintMood(); paintTravel(); });
  document.addEventListener("cml:session", () => { mood = null; paintMood(); renderCode(); paintTravel(); paintEditorial(); });
  document.addEventListener("cml:render", () => { paintEditorial(); paintTravel(); });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
