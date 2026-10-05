// Código Mujer Libre — bilingual app connected to Supabase
(() => {
"use strict";
const SUPABASE_URL = "https://ltuklkfymedhqncwzpks.supabase.co";
// Google Maps JavaScript key: meant for the browser. It is protected by an HTTP-referrer restriction
// (only this site can use it) plus an API restriction, set in Google Cloud.
const MAPS_KEY = "AIzaSyD7IzJRAwF9jZLESeqeNjGepo5gx5Mrifw";
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
    weeklyCode: "¿Qué te interesa esta semana?",
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
    weeklyCode: "What are you interested in this week?",
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
  heroTitle: "La vida es mejor cuando la vivimos juntas.",
  heroBody: "Planes que valen la pena. Mujeres que vale la pena conocer. Momentos que vale la pena guardar.",
  heroCta: "Explora esta semana",
  greetMorning: n => n ? "Buenos días, " + n : "Buenos días",
  greetAfternoon: n => n ? "Buenas tardes, " + n : "Buenas tardes",
  greetEvening: n => n ? "Buenas noches, " + n : "Buenas noches",
  upcomingTitle: "Próximas experiencias", seeAll: "Ver todas",
  viewDetails: "Ver detalles", goingCount: n => n === 1 ? "1 va" : n + " van",
  firstToGo: "Sé la primera en confirmar", attendanceTitle: "Quiénes van",
  aboutEvent: "Sobre este plan", detailsOf: "Detalles del plan",
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
  heroTitle: "Life is better when we live it together.",
  heroBody: "Plans worth making. Women worth knowing. Moments worth keeping.",
  heroCta: "Explore this week",
  greetMorning: n => n ? "Good morning, " + n : "Good morning",
  greetAfternoon: n => n ? "Good afternoon, " + n : "Good afternoon",
  greetEvening: n => n ? "Good evening, " + n : "Good evening",
  upcomingTitle: "Upcoming experiences", seeAll: "See all",
  viewDetails: "View details", goingCount: n => n + " going",
  firstToGo: "Be the first to join", attendanceTitle: "Who's going",
  aboutEvent: "About this plan", detailsOf: "Plan details",
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
  pendTitle: "Bienvenida a Código Mujer Libre.",
  pendBody: "Tu membresía está pendiente de aprobación. Te avisaremos cuando tengas acceso.",
  pendCheck: "Revisar de nuevo", pendStill: "Todavía pendiente. Te avisaremos cuando tengas acceso.",
  rejTitle: "Tu solicitud no fue aprobada",
  rejBody: "Por ahora no pudimos aprobar tu membresía. Si crees que es un error, escribe a la administradora de tu grupo.",
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
  adminNav: "Admin",
  viewOnMap: "Cómo llegar",
  showMap: "Ver mapa",
  mapUnavailable: "El mapa no está disponible ahora. Usa “Cómo llegar”."
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
  pendTitle: "Welcome to Código Mujer Libre.",
  pendBody: "Your membership is waiting for approval. We'll let you know when you're in.",
  pendCheck: "Check again", pendStill: "Still waiting. We'll let you know when you're in.",
  rejTitle: "Your request wasn't approved",
  rejBody: "We couldn't approve your membership right now. If you think this is a mistake, please contact your group's administrator.",
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
  adminNav: "Admin",
  viewOnMap: "Get directions",
  showMap: "Show map",
  mapUnavailable: "The map isn't available right now. Use “Get directions”."
});

// ---- UX polish: honest empty states, action feedback, code filter, community ----
Object.assign(translations.es, {
  chooseCode: "Toca un código para ver solo esos planes.",
  codeShowing: (c, n) => "Mostrando " + c + " · " + (n === 1 ? "1 plan" : n + " planes"),
  evEmptyTitle: "Pronto publicaremos nuevos planes",
  evEmptyText: "Mientras tanto, cuéntanos qué te gustaría hacer: tus ideas inspiran los próximos eventos.",
  evEmptyCta: "Proponer una idea", evNoMatch: "No hay planes con ese filtro.", evShowAll: "Ver todos los planes",
  respGoing: n => n ? "¡Listo! Vas a «" + n + "». Te esperamos." : "¡Listo! Te esperamos.",
  respInterested: n => n ? "Guardado: te interesa «" + n + "»." : "Guardado en tus intereses.",
  respRemoved: "Quitaste tu respuesta.",
  suggestToCommunity: "Proponerlo en la comunidad", suggestDraft: n => "¿Alguien se anima esta semana? 💛 «" + n + "»",
  membersCount: n => n === 1 ? "1 mujer en la comunidad" : n + " mujeres en la comunidad", membersAll: "Ver todas", membersLess: "Ver menos",
  noPosts: "Todavía no hay publicaciones", noPostsText: "Comparte un momento, una idea o una pregunta. Toda la comunidad podrá verla.", noPostsCta: "Escribir la primera",
  justNow: "Ahora mismo", minsAgo: n => "Hace " + n + " min",
  noMessages: "Tu buzón privado", noMessagesText: "Aquí verás los mensajes que le envíes a la administradora y sus respuestas. Solo ella puede leerlos.",
  msgAnswered: "Respondido",
  catsLabel: "¿Qué te apetece?", cat_social: "Happy hours y social", cat_dining: "Restaurantes y comida", cat_events: "Eventos y planes",
  catDesc_social: "Brindis, terrazas, noches", catDesc_dining: "Brunch, cenas, cafés", catDesc_events: "Conciertos, mercados, festivales, exposiciones",
  catCount: n => n === 1 ? "1 plan" : n + " planes",
  catEmpty_social: "Pronto habrá nuevos happy hours", catEmpty_dining: "Pronto recomendaremos restaurantes", catEmpty_events: "Pronto habrá nuevos eventos",
  catEmptyText: "¿Conoces un lugar o un plan que valga la pena? Recomiéndalo y lo compartimos con la comunidad.", catSuggest: "Recomendar un lugar o plan",
  grp_about: "Sobre este plan", grp_price: "Precio y pago", grp_included: "Qué incluye", grp_itinerary: "Itinerario", grp_attend: "Para asistir",
  grp_important: "Importante", grp_contact: "Detalles y contacto", rich_price: "Precio", rich_about: "Descripción", rich_meeting: "Punto de encuentro / salida",
  rich_dates: "Fechas", rich_deposit: "Depósito", rich_payment: "Pagos e instrucciones", rich_promo: "Promoción", rich_meals: "Comidas",
  rich_instructions: "Instrucciones", rich_passport: "Pasaporte y documentos", rich_contact_name: "Persona de contacto", rich_contact: "Contacto",
  wellOffer: "Ver oferta o reservar",
  rich_included: "Incluye", rich_excluded: "No incluye", rich_stay: "Alojamiento", rich_transport: "Transporte",
  rich_itinerary: "Itinerario", rich_activities: "Actividades", rich_dress: "Qué ponerse", rich_bring: "Qué llevar",
  rich_requirements: "Requisitos", rich_notes: "Importante", rich_links: "Enlaces", openPhoto: "Ver foto",
  bookInfo: "Reservar o más información",
  factSpots: (c, l) => c + " lugares · " + (l === 1 ? "queda 1" : "quedan " + l), factFull: "Cupo completo · márcate «Me interesa» por si se libera un lugar",
  factBy: d => "Confirma antes del " + d, factClosed: "Confirmaciones cerradas",
  codeFiltering: c => "Tu código: " + c, codeClear: "Quitar filtro de código",
  catEmpty_social: "Nada planeado todavía ✨", catEmpty_dining: "Nada planeado todavía ✨", catEmpty_events: "Nada planeado todavía ✨",
  catEmptyText: "¿Conoces un buen lugar o un plan que valga la pena? Recomiéndalo y lo compartimos con la comunidad.",
  tripsSoon: "La próxima gran experiencia se anunciará pronto", tripsSoonType: "Próximamente ✨",
  tripsSoonText: "Estamos preparando experiencias de este tipo. Cuéntanos a dónde te gustaría ir.",
  tripSuggestCta: "Sugerir un destino", tripOpen: "Ver la experiencia",
  meetLabel: "¿MATCHA?", meetIn: "Me apunto", meetInOn: "✓ Me apunto", meetCount: n => n === 1 ? "1 se apunta" : n + " se apuntan",
  wellnessLabel: "BIENESTAR", yourSpace: "Cuídate a tu manera", wellnessIntro: "Elige cómo quieres sentirte hoy y descubre experiencias para cuidarte."
});
Object.assign(translations.en, {
  chooseCode: "Tap a code to see only those plans.",
  codeShowing: (c, n) => "Showing " + c + " · " + (n === 1 ? "1 plan" : n + " plans"),
  evEmptyTitle: "New plans are coming soon",
  evEmptyText: "In the meantime, tell us what you'd love to do: your ideas inspire the next events.",
  evEmptyCta: "Suggest an idea", evNoMatch: "No plans match this filter.", evShowAll: "See all plans",
  respGoing: n => n ? "You're in! You're going to “" + n + "”." : "You're in! See you there.",
  respInterested: n => n ? "Saved: you're interested in “" + n + "”." : "Saved to your interests.",
  respRemoved: "Your response was removed.",
  suggestToCommunity: "Suggest it to the community", suggestDraft: n => "Anyone up for this this week? 💛 “" + n + "”",
  membersCount: n => n === 1 ? "1 woman in the community" : n + " women in the community", membersAll: "See all", membersLess: "See less",
  noPosts: "No posts yet", noPostsText: "Share a moment, an idea or a question. The whole community will see it.", noPostsCta: "Write the first one",
  justNow: "Just now", minsAgo: n => n + " min ago",
  noMessages: "Your private inbox", noMessagesText: "Here you'll see the messages you send to the administrator and her replies. Only she can read them.",
  msgAnswered: "Answered",
  catsLabel: "What are you in the mood for?", cat_social: "Happy hours & social", cat_dining: "Restaurants & food", cat_events: "Events & things to do",
  catDesc_social: "Drinks, rooftops, nights out", catDesc_dining: "Brunch, dinners, cafés", catDesc_events: "Concerts, markets, festivals, exhibitions",
  catCount: n => n === 1 ? "1 plan" : n + " plans",
  catEmpty_social: "New happy hours are coming soon", catEmpty_dining: "Restaurant picks are coming soon", catEmpty_events: "New events are coming soon",
  catEmptyText: "Know a place or plan worth sharing? Recommend it and we'll share it with the community.", catSuggest: "Recommend a place or plan",
  grp_about: "About this plan", grp_price: "Price & payment", grp_included: "What's included", grp_itinerary: "Itinerary", grp_attend: "To attend",
  grp_important: "Important", grp_contact: "Details & contact", rich_price: "Price", rich_about: "Description", rich_meeting: "Meeting / departure point",
  rich_dates: "Dates", rich_deposit: "Deposit", rich_payment: "Payments & instructions", rich_promo: "Promotion", rich_meals: "Meals",
  rich_instructions: "Instructions", rich_passport: "Passport & documents", rich_contact_name: "Contact person", rich_contact: "Contact",
  wellOffer: "See offer or book",
  rich_included: "Includes", rich_excluded: "Not included", rich_stay: "Accommodation", rich_transport: "Transportation",
  rich_itinerary: "Itinerary", rich_activities: "Activities", rich_dress: "What to wear", rich_bring: "What to bring",
  rich_requirements: "Requirements", rich_notes: "Important", rich_links: "Links", openPhoto: "View photo",
  bookInfo: "Book or more information",
  factSpots: (c, l) => c + " spots · " + l + " left", factFull: "Fully booked · tap “Interested” in case a spot opens up",
  factBy: d => "Confirm by " + d, factClosed: "RSVPs closed",
  codeFiltering: c => "Your code: " + c, codeClear: "Remove code filter",
  catEmpty_social: "Nothing planned yet ✨", catEmpty_dining: "Nothing planned yet ✨", catEmpty_events: "Nothing planned yet ✨",
  catEmptyText: "Know a great place or a plan worth sharing? Recommend it and we'll share it with the community.",
  tripsSoon: "The next big experience will be announced soon", tripsSoonType: "Coming soon ✨",
  tripsSoonText: "We're preparing experiences like this. Tell us where you'd love to go.",
  tripSuggestCta: "Suggest a destination", tripOpen: "See the experience",
  meetLabel: "MATCHA?", meetIn: "I'm in", meetInOn: "✓ I'm in", meetCount: n => n === 1 ? "1 is in" : n + " are in",
  wellnessLabel: "WELLNESS", yourSpace: "Care for yourself, your way", wellnessIntro: "Choose how you want to feel today and discover experiences to take care of yourself."
});


// (Sample cards were removed: empty sections now show an honest empty state instead of placeholder plans.)
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
let statusArgs = [];
let errorKey = "";
let statusTimer = 0;

let session = null;
let profile = null;
let plans = [];                 // published plans visible to members
const counts = new Map();       // plan_id -> {interested, going}
const mine = new Map();         // plan_id -> 'interested' | 'going'
const attendees = new Map();    // plan_id -> [{user_id, first_name, avatar_path}] (going, approved members)
let sheetPlanId = null, sheetTrigger = null;
let settings = {};              // key -> jsonb value
let posts = [];
let myMessages = [];
let monthSel = "all";
let pendingFocus = "";

const byId = id => document.getElementById(id);
const t = key => translations[currentLanguage][key] || "";
const tf = (key, ...args) => { const v = translations[currentLanguage][key]; return typeof v === "function" ? v(...args) : (v || ""); };
const loc = () => (currentLanguage === "es" ? "es-US" : "en-US");
const isAdmin = () => !!profile && (profile.role === "admin" || profile.role === "super_admin");
const isPending = () => !!profile && profile.role === "member" && !profile.approved;
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
    status.textContent = statusKey ? tf(statusKey, ...statusArgs) : "";
  }
  const feedback = byId("modalFeedback");
  if (feedback) {
    feedback.hidden = !errorKey;
    feedback.textContent = errorKey ? t(errorKey) : "";
  }
}
function announce(key, ...args) {
  statusKey = key;
  statusArgs = args;
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
  ["langBtn", "authLang", "pendLang"].forEach(id => {
    const button = byId(id);
    if (button) {
      button.textContent = currentLanguage === "es" ? "EN" : "ES";
      button.setAttribute("aria-label", t("switchLanguage"));
    }
  });
  renderAll();
  document.dispatchEvent(new CustomEvent("cml:lang"));
}

// ---- Admin-editable texts (settings key "copy" = { key: { es, en } }) for a SAFE list of content texts only.
// Defaults stay in the code; an empty field means "use the default". Never touches structure or security.
const COPY_KEYS = ["heroTitle", "heroCta", "eventsTitle", "eventsIntro", "yourSpace", "wellnessIntro", "supTitle", "supIntro",
  "communityTitle", "communityIntro", "travelTitle", "travelLead", "travelIntro", "travelBadge", "maTag", "maIntro", "wcQ", "wcSub"];
const copyDefaults = { es: {}, en: {} };
function applyCopy() {
  const copy = settings.copy && typeof settings.copy === "object" ? settings.copy : {};
  ["es", "en"].forEach(lang => COPY_KEYS.forEach(key => {
    if (!(key in copyDefaults[lang]) && translations[lang][key] !== undefined) copyDefaults[lang][key] = translations[lang][key];
    const v = copy[key] && typeof copy[key][lang] === "string" ? copy[key][lang].trim() : "";
    if (v) translations[lang][key] = v;
    else if (key in copyDefaults[lang]) translations[lang][key] = copyDefaults[lang][key];
  }));
}
function renderAll() {
  renderHero();
  renderQuote();
  renderFeatured();
  renderEvents();
  renderUpcoming();
  paintSheet(true);
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
  homeRefresh();
  document.dispatchEvent(new CustomEvent("cml:render"));
}
function homeRefresh() { if (window.CMLHome) window.CMLHome.render(); }

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
  document.dispatchEvent(new CustomEvent("cml:page", { detail: { page: pageId } }));
}

// ==============================
// Home
// ==============================
function renderHero() {
  const greet = byId("heroGreet");
  if (greet) {
    const h = new Date().getHours();
    const first = profile && profile.first_name ? profile.first_name : "";
    greet.textContent = tf(h >= 5 && h < 12 ? "greetMorning" : h >= 12 && h < 19 ? "greetAfternoon" : "greetEvening", first);
  }
  const img = byId("heroImg");
  if (!img) return;
  if (!img.dataset.wired) {
    img.dataset.wired = "1";
    img.addEventListener("error", () => { img.hidden = true; });
    img.addEventListener("load", () => { img.hidden = false; });
  }
  // The redesigned editorial hero has its own admin-managed photo ("hero_photo"). The older "hero_image"
  // setting (used by the previous design) is left untouched in the database but no longer shown here.
  const custom = settings.hero_photo && safeUrl(settings.hero_photo.url);
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
// ---- Plan tags: category / collection chosen by the admin, kept in the existing settings table
// (key "plan_tags" → { planId: { cat, matcha } }). Untagged events fall back to their code.
const isTestContent = (...texts) => texts.some(x => /\btest(ing)?\b/i.test(String(x || "")));
function planTag(id) { const all = settings.plan_tags; return (all && typeof all === "object" && all[id]) || {}; }
const EVENT_CATS = ["social", "dining", "events"];
function eventCategory(p) {
  const cat = planTag(p.id).cat;
  if (EVENT_CATS.includes(cat)) return cat;
  return p.code === "Social" || p.code === "Connection" ? "social" : "events";
}
const upcomingEvents = () => { const today = todayStr(); return plans.filter(p => p.kind === "event" && (!p.event_date || p.event_date >= today)); };
let catSel = "all";
let codeSel = "";          // set from "¿Cuál es tu código esta semana?" on Home
const CAT_ICON = {
  social: "M8 3h8l-1 7a3 3 0 0 1-6 0zM12 13v6M8.5 21h7",
  dining: "M7 3v8a2 2 0 0 0 2 2v8M7 3v5M11 3v5M17 3c-1.7 1-3 3-3 6v4h3v8",
  events: "M12 3l2.4 5.2 5.6.6-4.2 3.8 1.2 5.6L12 15.4 6.9 18.2l1.2-5.6L4 8.8l5.6-.6z"
};
function renderWeeklyCode() {            // (name kept: renderAll calls it) → Events discovery categories
  const box = byId("evCats");
  if (!box) return;
  const evs = session ? upcomingEvents() : [];
  box.hidden = !session;
  if (!EVENT_CATS.includes(catSel)) catSel = "all";
  box.replaceChildren(...EVENT_CATS.map(cat => {
    const n = evs.filter(p => eventCategory(p) === cat).length;
    const on = catSel === cat;
    const b = el("button", { type: "button", class: "ev-cat" + (on ? " on" : ""), "aria-pressed": String(on), "data-cat": cat },
      el("span", { class: "ev-cat-ic", "aria-hidden": "true" }),
      el("span", { class: "ev-cat-txt" }, el("b", { text: t("cat_" + cat) }), el("small", { text: t("catDesc_" + cat) })),
      el("span", { class: "ev-cat-n" + (n ? "" : " zero"), "aria-label": tf("catCount", n), text: String(n) }));
    b.querySelector(".ev-cat-ic").innerHTML = '<svg class="ci" viewBox="0 0 24 24" focusable="false"><path d="' + CAT_ICON[cat] + '"/></svg>';
    b.addEventListener("click", () => { catSel = on ? "all" : cat; renderEvents(); });
    return b;
  }));
}
// Home "Esta semana": real Home ideas published by the admin. Hidden (no sample cards) when there are none.
function renderFeatured() {
  const container = byId("featured");
  if (!container) return;
  const block = byId("featuredBlock");
  const items = session ? plans.filter(p => p.kind === "home" && !planTag(p.id).matcha) : [];   // matcha items live in the Corner
  if (block) block.hidden = !items.length;
  container.replaceChildren(...items.map(p => {
    const card = planCard(p);
    const title = pick(p, "title");
    if (window.CMLRedesign && title) {
      const share = el("button", { type: "button", class: "link-btn suggest-btn", text: t("suggestToCommunity") + " →" });
      share.addEventListener("click", () => window.CMLRedesign.compose(tf("suggestDraft", title)));
      card.appendChild(share);
    }
    return card;
  }));
}
function emptyState(icon, title, text, action) {
  return el("div", { class: "empty-state" },
    el("span", { class: "empty-ic", "aria-hidden": "true", text: icon }),
    el("b", { text: title }),
    text ? el("p", { text }) : null,
    action || null);
}

// ==============================
// Plans (events, trips, wellness cards)
// ==============================
function respondButton(plan, status, attr = "data-resp") {
  const c = counts.get(plan.id) || { interested: 0, going: 0 };
  const active = mine.get(plan.id) === status;
  const icon = status === "interested" ? "❤️" : "✓";
  const label = t(status);
  const button = el("button", {
    type: "button",
    class: "resp" + (active ? " on" : ""),
    "aria-pressed": String(active),
    [attr]: plan.id + ":" + status
  }, icon + " " + label + " · " + (c[status] || 0));
  if (status === "going" && !active) {
    const rs = rsvpState(plan);
    if (rs.closed || rs.full) { button.disabled = true; button.title = t(rs.closed ? "factClosed" : "factFull"); }
  }
  button.addEventListener("click", () => respond(plan.id, status));
  return button;
}
// ---- Maps: directions link (no key needed) + lazy embedded map (loads only when opened) ----
let mapsPromise = null;
function loadMaps() {
  if (window.google && window.google.maps) return Promise.resolve();
  if (!mapsPromise) mapsPromise = new Promise((resolve, reject) => {
    window.__cmlMapsReady = resolve;
    const s = document.createElement("script");
    s.src = "https://maps.googleapis.com/maps/api/js?key=" + encodeURIComponent(MAPS_KEY) + "&callback=__cmlMapsReady&loading=async";
    s.async = true; s.onerror = () => { mapsPromise = null; reject(new Error("maps")); };
    document.head.appendChild(s);
  });
  return mapsPromise;
}
function mapBlock(card, location) {
  const q = encodeURIComponent(location);
  card.appendChild(el("a", {
    class: "link-btn", href: "https://www.google.com/maps/search/?api=1&query=" + q,
    target: "_blank", rel: "noopener noreferrer", text: "📍 " + t("viewOnMap") + " ↗"
  }));
  const canvas = el("div", { class: "map-canvas" });
  const box = el("details", { class: "more map-box" }, el("summary", { text: "🗺️ " + t("showMap") }), canvas);
  let started = false;
  box.addEventListener("toggle", async () => {
    if (!box.open || started) return;
    started = true;
    try {
      await loadMaps();
      const { Geocoder } = await google.maps.importLibrary("geocoding");
      const { Map, Marker } = await google.maps.importLibrary("maps").then(m => ({ Map: m.Map, Marker: google.maps.Marker || m.Marker }));
      const results = await new Promise((res, rej) => new Geocoder().geocode({ address: location }, (r, status) => status === "OK" && r && r[0] ? res(r) : rej(new Error(status))));
      const pos = results[0].geometry.location;
      const map = new Map(canvas, { center: pos, zoom: 15, disableDefaultUI: true, zoomControl: true, gestureHandling: "cooperative" });
      new Marker({ map, position: pos });
    } catch (e) {
      canvas.replaceChildren(el("p", { class: "small-note", text: t("mapUnavailable") }));
      canvas.classList.add("map-failed");
    }
  });
  card.appendChild(box);
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
  if (p.location) mapBlock(card, p.location);
  if (p.details && !richOf(p)) {
    card.appendChild(el("details", { class: "more" },
      el("summary", { text: t("moreDetails") }),
      el("p", { class: "saved-text", text: p.details })));
  }
  if (p.kind === "event" || p.kind === "trip") {
    card.appendChild(el("div", { class: "resp-row" },
      respondButton(p, "interested"), respondButton(p, "going")));
  }
  if ((p.kind === "event" || p.kind === "trip") && window.CMLPolls) {
    const polls = window.CMLPolls.planBlock(p);
    if (polls) card.appendChild(polls);
  }
  if ((p.kind === "event" || p.kind === "trip") && window.CMLSocial) {
    const chat = window.CMLSocial.chatBlock(p, mine.get(p.id));
    if (chat) card.appendChild(chat);
  }
  return card;
}

// ---- Premium event card + detail sheet ----
const toneOf = code => "tone-" + (codeLabels[code] ? code : "none");
const emojiOfCode = code => { const m = codeLabels[code] ? /^\S+/.exec(t(codeLabels[code])) : null; return m ? m[0] : "✨"; };
function shortWhen(p) {
  if (p.event_date) {
    const d = dateFromStr(p.event_date).toLocaleDateString(loc(), { weekday: "short", month: "short", day: "numeric" });
    return d + (p.event_time ? " · " + p.event_time : "");
  }
  return p.date_text || (t("dateTbd") + (p.event_time ? " · " + p.event_time : ""));
}
function avatarStack(planId, max = 4) {
  const c = counts.get(planId) || { interested: 0, going: 0 };
  const who = attendees.get(planId) || [];
  const row = el("div", { class: "ev-people" });
  const shown = who.slice(0, max);
  if (shown.length && window.CMLProfile) {
    row.appendChild(el("span", { class: "avatar-stack", "aria-hidden": "true" },
      ...shown.map(a => window.CMLProfile.avatarNode(a.avatar_path, a.first_name, "avatar-sm"))));
  }
  const extra = Math.max(0, c.going - shown.length);
  row.appendChild(el("span", { class: "ev-going", text: (extra && shown.length ? "+" + extra + " · " : "") + (c.going ? tf("goingCount", c.going) : t("firstToGo")) }));
  return row;
}
function eventMedia(p, cls) {
  const image = safeUrl(p.image_url);
  const box = el("div", { class: "ev-media " + cls + (image ? "" : " ev-ph " + toneOf(p.code)) });
  if (image) {
    const img = el("img", { src: image, alt: pick(p, "title") || "", loading: "lazy" });
    img.addEventListener("error", () => { img.remove(); box.classList.add("ev-ph", toneOf(p.code)); box.prepend(el("span", { class: "ev-ph-emoji", "aria-hidden": "true", text: emojiOfCode(p.code) })); });
    box.appendChild(img);
  } else box.appendChild(el("span", { class: "ev-ph-emoji", "aria-hidden": "true", text: emojiOfCode(p.code) }));
  if (p.code && codeLabels[p.code]) box.appendChild(el("span", { class: "ev-badge", text: t(codeLabels[p.code]) }));
  return box;
}
function eventCard(p, mini) {
  const card = el("article", { class: "ev-card" + (mini ? " ev-mini" : " card plan") });
  const media = eventMedia(p, "ev-cover");
  media.addEventListener("click", () => openDetail(p.id, card.querySelector(".ev-more")));
  card.appendChild(media);
  const body = el("div", { class: "ev-body" });
  const title = pick(p, "title");
  body.appendChild(el("h2", { class: "ev-title", text: title || "—" }));
  body.appendChild(el("p", { class: "ev-when", text: "📅 " + shortWhen(p) }));
  if (p.location) body.appendChild(el("p", { class: "ev-where", text: "📍 " + p.location }));
  body.appendChild(avatarStack(p.id));
  const attr = mini ? "data-resp-home" : "data-resp";
  body.appendChild(el("div", { class: "resp-row" }, respondButton(p, "interested", attr), respondButton(p, "going", attr)));
  const more = el("button", { type: "button", class: "ev-more", text: t("viewDetails") + " →" });
  more.addEventListener("click", () => openDetail(p.id, more));
  body.appendChild(more);
  card.appendChild(body);
  return card;
}
// ---- Rich experience details. Stored INSIDE the plan's existing "details" text (so they keep the plans
// table's member-only security) as "CML:" + JSON. Plain-text details from before keep working as they were.
// Detail page groups (same information architecture for events, experiences and wellness offers).
const RICH_GROUPS = [
  ["about", "✦", ["about", "meeting", "dates"]],
  ["price", "◇", ["deposit", "payment", "promo"]],
  ["included", "✓", ["included", "excluded", "stay", "meals", "transport"]],
  ["itinerary", "🗓", ["itinerary"]],
  ["attend", "👜", ["activities", "dress", "bring", "instructions"]],
  ["important", "!", ["requirements", "passport", "notes"]],
  ["contact", "✉", ["contact_name", "contact"]]
];
function richOf(p) {
  const raw = String((p && p.details) || "");
  if (!raw.startsWith("CML:")) return null;
  try { const x = JSON.parse(raw.slice(4)); return x && typeof x === "object" ? x : null; } catch { return null; }
}
function richText(x, key) {
  const own = x[currentLanguage] && x[currentLanguage][key], other = x[currentLanguage === "es" ? "en" : "es"] && x[currentLanguage === "es" ? "en" : "es"][key];
  return String((own && own.trim()) ? own : (other || "")).trim();
}
// RSVP rules shown to members (capacity / deadline). Soft rules in the app: they guide, the admin decides.
function rsvpState(p) {
  const x = richOf(p) || {};
  const going = (counts.get(p.id) || {}).going || 0;
  const cap = Number(x.capacity) > 0 ? Number(x.capacity) : 0;
  const closed = !!(x.rsvp_by && x.rsvp_by < todayStr());
  return { cap, going, left: cap ? Math.max(0, cap - going) : null, full: cap > 0 && going >= cap, closed, by: x.rsvp_by || "" };
}
let lightbox = null;
function openImage(src) {
  if (lightbox) lightbox.remove();
  const close = el("button", { type: "button", class: "lb-close", "aria-label": t("closeLabel"), text: "×" });
  lightbox = el("div", { class: "cml-lightbox", role: "dialog", "aria-modal": "true" }, el("img", { src, alt: "" }), close);
  const done = () => { if (lightbox) { lightbox.remove(); lightbox = null; } };
  lightbox.addEventListener("click", e => { if (e.target === lightbox || e.target === close) done(); });
  document.addEventListener("keydown", function esc(e) { if (e.key === "Escape") { done(); document.removeEventListener("keydown", esc); } });
  document.body.appendChild(lightbox); close.focus();
}
function richLines(text, key) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  return lines.length > 1
    ? el(key === "itinerary" ? "ol" : "ul", { class: "rich-list" + (key === "itinerary" ? " timeline" : "") }, ...lines.map(l => el("li", { text: l.replace(/^[-•·]\s*/, "") })))
    : el("p", { class: "saved-text", text });
}
// Builds the detail sections. Only filled-in parts appear, so a picnic never looks like a trip form.
function richSections(p, x) {
  const out = [];
  const desc = pick(p, "desc");
  RICH_GROUPS.forEach(([g, icon, keys]) => {
    const parts = keys.map(k => [k, x ? richText(x, k) : ""]).filter(([, v]) => v);
    const extra = [];
    if (g === "about" && desc) extra.push(el("p", { class: "saved-text", text: desc }));
    if (g === "price" && p.price && (parts.length || p.kind === "trip")) extra.push(el("p", { class: "rich-price", text: t("rich_price") + ": " + p.price }));
    if (g === "contact" && x) {
      if (x.text) extra.push(el("p", { class: "saved-text", text: x.text }));
      const links = (Array.isArray(x.links) ? x.links : []).filter(l => l && safeUrl(l.url));
      if (links.length) extra.push(el("div", { class: "rich-links" }, ...links.map(l => el("a", { class: "link-btn", href: safeUrl(l.url), target: "_blank", rel: "noopener noreferrer", text: (l.label || safeUrl(l.url).replace(/^https?:\/\//, "").slice(0, 40)) + " ↗" }))));
    }
    if (g === "contact" && !x && p.details) extra.push(el("p", { class: "saved-text", text: p.details }));
    if (!parts.length && !extra.length) return;
    const showLabels = parts.length > 1 || (g !== "about" && extra.length && parts.length) || ["meeting", "dates", "deposit", "payment", "promo", "excluded", "stay", "meals", "transport", "passport", "contact_name"].includes(parts[0] && parts[0][0]);
    const sec = el("section", { class: "rich-sec rich-" + g + (g === "important" ? " rich-notes" : "") },
      el("h3", { class: "sheet-h" }, el("span", { class: "rich-ic", "aria-hidden": "true", text: icon }), t("grp_" + g)), ...extra);
    parts.forEach(([k, v]) => {
      if (showLabels) sec.appendChild(el("b", { class: "rich-sub", text: t("rich_" + k) }));
      sec.appendChild(richLines(v, k));
    });
    out.push(sec);
  });
  return out;
}
function galleryNode(x) {
  const gallery = (x && Array.isArray(x.gallery) ? x.gallery : []).map(safeUrl).filter(Boolean).slice(0, 12);
  if (!gallery.length) return null;
  return el("div", { class: "rich-gallery" }, ...gallery.map(src => {
    const b = el("button", { type: "button", class: "rich-ph", "aria-label": t("openPhoto") }, el("img", { src, alt: "", loading: "lazy" }));
    b.addEventListener("click", () => openImage(src));
    return b;
  }));
}
function detailNode(p) {
  const box = el("div", { class: "sheet-content" });
  box.appendChild(eventMedia(p, "sheet-hero"));
  const body = el("div", { class: "sheet-main" });
  if (p.kind === "wellness") {
    const c = planTag(p.id).cat;
    if (c) body.appendChild(el("small", { class: "rose sheet-k", text: t("wcat_" + c) }));
  }
  body.appendChild(el("h2", { id: "sheetTitle", class: "sheet-title", text: pick(p, "title") || "—" }));
  const meta = [];
  if (p.event_date || p.date_text || p.kind === "event") meta.push("📅 " + (p.event_date ? fmtDate(p.event_date) + (p.event_time ? " · " + p.event_time : "") : shortWhen(p)));
  if (p.location) meta.push("📍 " + p.location);
  if (p.price) meta.push("💲 " + p.price);
  meta.forEach(l => body.appendChild(el("p", { class: "meta-line", text: l })));
  const rich = richOf(p);
  const rs = rsvpState(p);
  const facts = [];
  if (rs.cap) facts.push(rs.full ? t("factFull") : tf("factSpots", rs.cap, rs.left));
  if (rs.by) facts.push(rs.closed ? t("factClosed") : tf("factBy", dateFromStr(rs.by).toLocaleDateString(loc(), { day: "numeric", month: "short" })));
  if (facts.length) body.appendChild(el("div", { class: "rich-facts" }, ...facts.map(f => el("span", { class: "rich-fact", text: f }))));
  if (p.kind === "event" || p.kind === "trip") {
    body.appendChild(el("h3", { class: "sheet-h", text: t("attendanceTitle") }));
    body.appendChild(avatarStack(p.id, 8));
    body.appendChild(el("div", { class: "resp-row" }, respondButton(p, "interested"), respondButton(p, "going")));
  }
  const gal = galleryNode(rich);
  const secs = richSections(p, rich);
  if (secs.length && secs[0].classList.contains("rich-about")) body.appendChild(secs.shift());
  if (gal) body.appendChild(gal);
  secs.forEach(sc => body.appendChild(sc));
  const url = safeUrl(p.url);
  if (url) body.appendChild(el("a", { class: "primary rich-book", href: url, target: "_blank", rel: "noopener noreferrer", text: t(p.kind === "wellness" ? "wellOffer" : rich ? "bookInfo" : "moreInfo") + " ↗" }));
  if (p.location) mapBlock(body, p.location);
  if (window.CMLPolls) { const polls = window.CMLPolls.planBlock(p); if (polls) body.appendChild(polls); }
  if (window.CMLSocial && (p.kind === "event" || p.kind === "trip")) { const chat = window.CMLSocial.chatBlock(p, mine.get(p.id)); if (chat) body.appendChild(chat); }
  box.appendChild(body);
  return box;
}
function paintSheet(keepScroll) {
  const sheet = byId("eventSheet"), host = byId("sheetBody");
  if (!sheet || !host || !sheetPlanId) return;
  const p = plans.find(x => x.id === sheetPlanId);
  if (!p) return closeDetail();
  const panel = sheet.querySelector(".sheet-panel");
  const top = keepScroll ? panel.scrollTop : 0;
  host.replaceChildren(detailNode(p));
  panel.scrollTop = top;
}
function openDetail(planId, trigger) {
  const sheet = byId("eventSheet");
  if (!sheet || !plans.some(p => p.id === planId)) return;
  sheetPlanId = planId; sheetTrigger = trigger || document.activeElement;
  sheet.hidden = false;
  document.body.classList.add("sheet-open");
  paintSheet(false);
  const close = byId("sheetClose");
  requestAnimationFrame(() => { sheet.classList.add("show"); if (close) close.focus({ preventScroll: true }); });
}
function closeDetail() {
  const sheet = byId("eventSheet");
  if (!sheet || sheet.hidden) return;
  sheet.classList.remove("show"); sheet.hidden = true;
  document.body.classList.remove("sheet-open");
  byId("sheetBody")?.replaceChildren();
  const back = sheetTrigger; sheetPlanId = null; sheetTrigger = null;
  if (back && back.isConnected) back.focus({ preventScroll: true });
}
function wireSheet() {
  const sheet = byId("eventSheet");
  if (!sheet) return;
  sheet.addEventListener("click", e => { if (e.target.closest("[data-close]") || e.target.closest("#sheetClose")) closeDetail(); });
  document.addEventListener("keydown", e => {
    if (sheet.hidden) return;
    if (e.key === "Escape") { if (document.querySelector(".lightbox")) return; e.preventDefault(); closeDetail(); return; }
    if (e.key !== "Tab") return;
    const items = [...sheet.querySelectorAll('button, a[href], input, select, textarea, summary, [tabindex="0"]')].filter(n => !n.disabled && n.offsetParent !== null);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && (document.activeElement === first || !sheet.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (document.activeElement === last || !sheet.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
  });
}
function renderUpcoming() {
  const host = byId("homeUpcoming");
  if (!host) return;
  const today = todayStr();
  const next = session ? plans.filter(p => p.kind === "event" && p.event_date && p.event_date >= today).sort(byDate).slice(0, 3) : [];
  host.hidden = !next.length;
  if (!next.length) return host.replaceChildren();
  const all = el("button", { type: "button", class: "see-all", text: t("seeAll") + " →" });
  all.addEventListener("click", () => showPage("events"));
  host.replaceChildren(
    el("div", { class: "section-head" }, el("h2", { text: t("upcomingTitle") }), all),
    el("div", { class: "ev-grid" }, ...next.map(p => eventCard(p, true))));
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
  renderWeeklyCode();
  if (!events.length) {
    if (filter) filter.hidden = true;
    if (!session) return list.replaceChildren();
    const idea = el("button", { type: "button", class: "secondary", text: t("evEmptyCta") });
    idea.addEventListener("click", () => openModal("idea"));
    return list.replaceChildren(emptyState("📅", t("evEmptyTitle"), t("evEmptyText"), idea));
  }
  const cat = catSel;
  const chipHost = byId("evCodeChip");
  if (chipHost) {
    chipHost.hidden = !codeSel;
    chipHost.replaceChildren();
    if (codeSel) {
      const x = el("button", { type: "button", class: "code-chip-x", "aria-label": t("codeClear"), text: "×" });
      x.addEventListener("click", () => { codeSel = ""; renderEvents(); });
      chipHost.append(el("span", { text: tf("codeFiltering", t(codeLabels[codeSel])) }), x);
    }
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
    (!codeSel || p.code === codeSel) && (cat === "all" || eventCategory(p) === cat) && (monthSel === "all" ||
    (monthSel === "tbd" ? !p.event_date : p.event_date && monthKey(p.event_date) === monthSel)));
  if (!shown.length) {
    const all = el("button", { type: "button", class: "secondary", text: t("evShowAll") });
    all.addEventListener("click", () => { monthSel = "all"; catSel = "all"; codeSel = ""; renderEvents(); });
    const idea = el("button", { type: "button", class: "link-btn", text: t("catSuggest") });
    idea.addEventListener("click", () => openModal("idea"));
    const empty = cat !== "all" && monthSel === "all" && !codeSel
      ? emptyState("✨", t("catEmpty_" + cat), t("catEmptyText"), el("div", { class: "empty-acts" }, idea, all))
      : emptyState("🔎", t("evNoMatch"), "", all);
    list.replaceChildren(empty);
  } else list.replaceChildren(...shown.map(p => eventCard(p)));
  restoreFocus();
}
// Travel & Experiences: type chosen by the admin (plan_tags), default "trip" (group trip).
const TRIP_TYPES = ["trip", "retreat", "party", "dining", "nature"];
let tripType = "all";
const tripTypeOf = p => (TRIP_TYPES.includes(planTag(p.id).cat) ? planTag(p.id).cat : "trip");
function renderTrips() {
  const block = byId("tripsBlock"), list = byId("tripsList");
  if (!block || !list) return;
  const trips = plans.filter(p => p.kind === "trip").sort(byDate);
  block.hidden = !session;
  const shown = trips.filter(p => tripType === "all" || tripTypeOf(p) === tripType);
  if (!shown.length) {
    const sug = el("button", { type: "button", class: "secondary", text: t("tripSuggestCta") });
    sug.addEventListener("click", () => { const f = byId("tripIdea"); if (f) { f.scrollIntoView({ behavior: "smooth", block: "center" }); f.focus({ preventScroll: true }); } });
    list.replaceChildren(emptyState("✈️", t(tripType === "all" ? "tripsSoon" : "tripsSoonType"), t("tripsSoonText"), sug));
  } else list.replaceChildren(...shown.map(p => {
    // compact experience card; the full experience page (details, polls, trip chat) opens in the detail sheet
    const card = eventCard(p);
    card.classList.add("trip-card");
    const more = card.querySelector(".ev-more");
    if (more) more.textContent = t("tripOpen") + " →";
    return card;
  }));
  restoreFocus();
}
function renderWellnessCards() { if (window.CMLDiscover) window.CMLDiscover.render(); }
function restoreFocus() {
  if (!pendingFocus) return;
  const all = [...document.querySelectorAll('[data-resp="' + pendingFocus + '"]')];
  const target = all.find(n => n.offsetParent !== null) || all[0];
  pendingFocus = "";
  if (target) target.focus({ preventScroll: true });
}

async function refreshCounts() {
  const { data, error } = await db.rpc("plan_counts");
  if (error) throw error;
  counts.clear();
  (data || []).forEach(r => counts.set(r.plan_id, { interested: Number(r.interested), going: Number(r.going) }));
  try {
    const a = await db.rpc("plan_attendees", { max_each: 8 });
    if (!a.error) {
      attendees.clear();
      (a.data || []).forEach(r => { (attendees.get(r.plan_id) || attendees.set(r.plan_id, []).get(r.plan_id)).push(r); });
      if (window.CMLProfile) await window.CMLProfile.signed((a.data || []).map(r => r.avatar_path));
    }
  } catch { /* avatars are optional */ }
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
  renderEvents(); renderTrips(); renderFeatured(); renderWellnessCards(); renderUpcoming(); paintSheet(true); homeRefresh();
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
    const plan = plans.find(p => p.id === planId);
    const name = plan ? (pick(plan, "title") || "") : "";
    if (current === status) announce("respRemoved");
    else announce(status === "going" ? "respGoing" : "respInterested", name);
  } catch {
    announce("respondFail");
    try { await loadResponses(); await refreshCounts(); } catch { /* keep optimistic state */ }
  }
  renderEvents(); renderTrips(); renderFeatured(); renderWellnessCards(); renderUpcoming(); paintSheet(true); homeRefresh();
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
  // Compact on phones: one scrollable row of members; "See all" opens the full list with interests.
  const shown = members.slice(0, 30);
  const expanded = container.dataset.expanded === "1";
  container.classList.toggle("expanded", expanded);
  const head = el("div", { class: "members-head" }, el("b", { text: tf("membersCount", members.length) }));
  if (members.length > 4) {
    const toggle = el("button", { type: "button", class: "see-all", "aria-expanded": String(expanded), text: t(expanded ? "membersLess" : "membersAll") });
    toggle.addEventListener("click", () => { container.dataset.expanded = expanded ? "" : "1"; renderMembers(); });
    head.appendChild(toggle);
  }
  const strip = el("div", { class: "members-strip" });
  shown.forEach(m => {
    const interests = (m.interests || []).map(code => codeLabels[code] ? t(codeLabels[code]) : code).join(" · ");
    strip.appendChild(el("div", { class: "member" },
      el("span", { "aria-hidden": "true", text: (m.first_name || "?").charAt(0).toUpperCase() }),
      el("div", {}, el("b", { text: m.first_name }), interests ? el("small", { text: interests }) : null)));
  });
  container.append(head, strip);
}
function appendParagraph(container, text, className = "") {
  container.appendChild(el("p", { class: className, text }));
}
function renderPosts() {
  const container = byId("posts");
  if (!container) return;
  container.replaceChildren();
  if (!posts.length) {
    if (!session) return;
    const write = el("button", { type: "button", class: "secondary", text: t("noPostsCta") });
    write.addEventListener("click", () => byId("postText")?.focus());
    return container.appendChild(emptyState("💬", t("noPosts"), t("noPostsText"), write));
  }
  const S = window.CMLSocial;
  const P = window.CMLProfile;
  posts.forEach(post => {
    const date = new Date(post.created_at);
    const okDate = !Number.isNaN(date.getTime());
    const name = post.author_name || "";
    const card = el("div", { class: "card post-card" },
      el("div", { class: "post-head" },
        P ? P.avatarNode(postAvatars.get(post.user_id) || null, name || "?", "avatar-post") : null,
        el("span", { class: "post-who" },
          el("b", { text: name }),
          okDate ? el("time", { class: "meta", datetime: date.toISOString(), text: postWhen(date) }) : null)));
    const meet = window.CMLDiscover && window.CMLDiscover.meetupNode ? window.CMLDiscover.meetupNode(post) : null;
    if (meet) card.appendChild(meet);
    else if (post.body) card.appendChild(el("p", { class: "saved-text", text: post.body }));
    const photo = S && S.photoNode(post);
    if (photo) card.appendChild(photo);
    let del = null;
    if (session && (post.user_id === session.user.id || isAdmin())) {
      del = el("button", { type: "button", class: "link-danger", text: t("postDelete") });
      del.addEventListener("click", () => deletePost(post));
    }
    if (S) card.appendChild(S.postFooter(post, del));
    else if (del) card.appendChild(del);
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
    .select("id,user_id,author_name,body,photo_path,created_at").order("created_at", { ascending: false }).limit(50);
  if (error) throw error;
  // obvious developer test posts ("TEST …" in capitals at the very start) are hidden from the feed; nothing is deleted
  posts = (data || []).filter(x => !/^\s*TEST\b/.test(x.body || "") && !/^\s*test\s*$/i.test(x.body || ""));
  if (window.CMLSocial) { try { await window.CMLSocial.loadExtras(posts); } catch { /* extras are optional */ } }
  await loadPostAvatars();
}
// Author photos for posts: existing member_avatars() RPC (first name + photo path of approved members only).
const postAvatars = new Map();
async function loadPostAvatars() {
  const ids = [...new Set(posts.map(p => p.user_id).filter(Boolean))].filter(id => !postAvatars.has(id));
  if (!ids.length) return;
  try {
    const r = await db.rpc("member_avatars", { ids });
    if (r.error) return;
    (r.data || []).forEach(x => postAvatars.set(x.id, x.avatar_path || null));
    if (window.CMLProfile) await window.CMLProfile.signed((r.data || []).map(x => x.avatar_path));
  } catch { /* initials are shown instead */ }
}
function postWhen(d) {
  const mins = Math.round((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return t("justNow");
  if (mins < 60) return tf("minsAgo", mins);
  if (new Date().toDateString() === d.toDateString()) return d.toLocaleTimeString(loc(), { hour: "numeric", minute: "2-digit" });
  return d.toLocaleDateString(loc(), { month: "short", day: "numeric" }) + " · " + d.toLocaleTimeString(loc(), { hour: "numeric", minute: "2-digit" });
}
async function addPost() {
  const field = byId("postText");
  if (!field || !session) return;
  const text = field.value.trim();
  const S = window.CMLSocial;
  const file = S ? S.takePhoto() : null;
  if (!text && !file) {
    announce("requiredPost");
    field.focus();
    return;
  }
  const button = byId("postBtn");
  button.disabled = true;
  let photoPath = "";
  try {
    if (file) photoPath = await S.uploadPhoto(file);
    const { error } = await db.from("community_posts").insert({
      user_id: session.user.id, author_name: profile ? profile.first_name : "", body: text.slice(0, 1000), photo_path: photoPath
    });
    if (error) { if (photoPath) await S.removePhoto(photoPath); throw error; }
  } catch {
    button.disabled = false;
    return announce(file ? "photoFail" : "postFail");
  }
  button.disabled = false;
  field.value = "";
  if (S) S.clearChosen();
  try { await loadPosts(); } catch { /* ignore */ }
  renderPosts();
  announce("postSaved");
}
async function deletePost(post) {
  const { error } = await db.from("community_posts").delete().eq("id", post.id);
  if (error) return announce("postFail");
  if (post.photo_path && window.CMLSocial) await window.CMLSocial.removePhoto(post.photo_path);
  posts = posts.filter(p => p.id !== post.id);
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
  if (!myMessages.length) return session ? container.appendChild(emptyState("✉️", t("noMessages"), t("noMessagesText"))) : undefined;
  myMessages.forEach(message => {
    const card = el("div", { class: "card" },
      el("h2", { text: t(modalTitles[message.type] || "newMessageTitle") }),
      el("p", { class: "meta", text: t(message.admin_reply ? "msgAnswered" : "draftLabel") }),
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
function showApproval() {
  byId("authGate").hidden = true;
  byId("appShell").hidden = true;
  byId("approvalGate").hidden = false;
  const rej = !!profile && !!profile.rejected;
  byId("approvalTitle").textContent = t(rej ? "rejTitle" : "pendTitle");
  byId("approvalText").textContent = t(rej ? "rejBody" : "pendBody");
  byId("approvalTitle").dataset.i18n = rej ? "rejTitle" : "pendTitle";
  byId("approvalText").dataset.i18n = rej ? "rejBody" : "pendBody";
  byId("pendCheck").hidden = rej;
}
async function recheckApproval() {
  if (!session || !profile || !isPending() || profile.rejected) return;
  const fresh = await fetchProfile();
  if (!fresh || !session) return;
  if (fresh.approved || fresh.role !== "member") return applySession(session);
  profile = fresh;
  if (fresh.rejected) return showApproval();
  const fb = byId("approvalFeedback");
  fb.textContent = t("pendStill"); fb.hidden = false;
  clearTimeout(recheckApproval.t); recheckApproval.t = setTimeout(() => { fb.hidden = true; }, 6000);
}
function showGate(ready) {
  byId("approvalGate").hidden = true;
  byId("authGate").hidden = false;
  byId("appShell").hidden = true;
  byId("authLoading").hidden = !!ready;
  byId("authForms").hidden = !ready;
}
function showApp() {
  byId("approvalGate").hidden = true;
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
    profile = null; plans = []; counts.clear(); mine.clear(); attendees.clear(); posts = []; myMessages = []; members = []; postAvatars.clear();
    closeModal(); closeDetail();
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
  if (isPending()) {
    // Not approved yet (or not approved at all): nothing private is loaded or shown.
    plans = []; counts.clear(); mine.clear(); posts = []; myMessages = []; members = [];
    showApproval();
    document.dispatchEvent(new CustomEvent("cml:session", { detail: { admin: false, super: false, pending: true } }));
    return;
  }
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
    // Records whose title contains the word "test" are development leftovers: they stay in the database
    // (the admin panel still lists them, flagged, to edit or delete) but are not shown in the app.
    plans = (pl.data || []).filter(p => !isTestContent(p.title_es, p.title_en));
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
  if (window.CMLPolls) { try { await window.CMLPolls.reload(); } catch { /* polls are optional */ } }
  if (!session || session.user.id !== uid) return;
  applyCopy();
  setLanguage(currentLanguage, false);   // re-applies texts (incl. admin-edited ones) and re-renders everything
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
  byId("pendLogout")?.addEventListener("click", () => { db.auth.signOut(); });
  byId("pendLang")?.addEventListener("click", toggleLanguage);
  byId("pendCheck")?.addEventListener("click", recheckApproval);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) recheckApproval(); });
  byId("tabLogin")?.addEventListener("click", () => setAuthTab("login"));
  byId("tabSignup")?.addEventListener("click", () => setAuthTab("signup"));
  byId("loginForm")?.addEventListener("submit", handleLogin);
  byId("signupForm")?.addEventListener("submit", handleSignup);
  document.querySelectorAll("nav button[data-page]").forEach(button =>
    button.addEventListener("click", () => showPage(button.getAttribute("data-page"))));
  byId("postBtn")?.addEventListener("click", addPost);
  byId("heroCta")?.addEventListener("click", () => showPage("events"));
  wireSheet();
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
    refreshPublic: async () => { if (session) await loadAll(); },
    showPage, signOut: () => db.auth.signOut(), setLanguage,
    homeData: () => ({ plans, counts, mine, posts, settings }), respond, openDetail,
    setting: key => settings[key], isTestContent, COPY_KEYS, copyDefault: (lang, key) => (key in copyDefaults[lang] ? copyDefaults[lang][key] : translations[lang][key]), TRIP_TYPES, tripTypeOf, setTripType: v => { tripType = v; renderTrips(); }, tripType: () => tripType, richOf, openImage, showEventsCode: code => { codeSel = codeLabels[code] ? code : ""; catSel = "all"; monthSel = "all"; showPage("events"); renderEvents(); }, planTag, eventCategory, eventCard, openModal, byDate,
    addStrings: (es, en) => {           // lets add-on modules (Memories) use the same ES/EN system
      Object.assign(translations.es, es); Object.assign(translations.en, en);
      setLanguage(currentLanguage, false);
    }
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
