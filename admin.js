// Código Mujer Libre — Admin dashboard (only loads data for administrators; the database enforces it too)
(() => {
"use strict";

const S = {
  es: {
    pendingBanner: n => n + (n === 1 ? " usuaria espera tu aprobación" : " usuarias esperan tu aprobación"), reviewNow: "Revisar", mkMemory: "Crear recuerdo", openMemory: "Abrir recuerdo", memCreated: "Recuerdo creado", approvedBadge: "Aprobada", pendingBadge: "Pendiente", approve: "Aprobar", reject: "Rechazar", rejectedBadge: "Rechazada", unapprove: "Quitar aprobación", adminTaken: "Ya hay una segunda administradora. Quítale el cargo primero para nombrar a otra.",  approvalSaved: "Aprobación actualizada", welcomeSend: "Enviar bienvenida", welcomeDone: "Listo",
    tabs: { plans: "Planes y eventos", trips: "Viajes y Experiencias", weekend: "Ideas de fin de semana", home: "Inicio", wellness: "Bienestar", community: "Comunidad", memories: "Recuerdos", polls: "Votaciones", messages: "Mensajes", users: "Usuarias", ai: "✨ Asistente IA", settings: "Imágenes y textos", matcha: "Rincón Matcha", trips: "Viajes y Experiencias" },
    groups: { content: "Contenido", people: "Comunidad", tools: "Ajustes y medios" },
    secImages: "Imágenes", secTexts: "Textos de la app", imgLogoTitle: "Logo de la marca", imgLogoHelp: "Aparece en el encabezado. Usa un archivo cuadrado (PNG o SVG con fondo transparente). Si lo quitas, vuelve el logo aprobado.",
    imgPagesTitle: "Fotos de entrada de cada sección (opcional)", imgPagesHelp: "Si agregas una foto, aparece detrás del título de esa sección con un velo suave para que el texto se lea bien.",
    page_events: "Planes y Eventos", page_wellness: "Bienestar", page_support: "Aquí para ti (Apoyo)", page_community: "Comunidad", page_messages: "Mensajes", page_travel: "Viajes y Experiencias",
    copyTitle: "Títulos y frases", copyHelp: "Cambia el texto en español y en inglés. Deja un campo vacío para usar el texto original (lo ves en gris).",
    copy_heroTitle: "Inicio · frase principal", copy_heroCta: "Inicio · botón", copy_eventsTitle: "Eventos · título", copy_eventsIntro: "Eventos · introducción",
    copy_yourSpace: "Bienestar · título", copy_wellnessIntro: "Bienestar · introducción", copy_supTitle: "Apoyo · título", copy_supIntro: "Apoyo · introducción",
    copy_communityTitle: "Comunidad · título", copy_communityIntro: "Comunidad · introducción", copy_travelTitle: "Viajes · título", copy_travelLead: "Viajes · frase destacada",
    copy_travelIntro: "Viajes · introducción", copy_travelBadge: "Viajes · etiqueta", copy_maTag: "Rincón Matcha · lema", copy_maIntro: "Rincón Matcha · introducción",
    copy_wcQ: "Tu código · pregunta", copy_wcSub: "Tu código · subtítulo",
    imgTravelTitle: "Imagen de Viajes y Experiencias", imgTravelHelp: "Se usa en la portada de Viajes (si el viaje no tiene foto) y en los accesos a Viajes desde Inicio y Eventos.",
    imgFounderTitle: "Foto de la fundadora", imgFounderHelp: "Aparece en «Nuestra Historia». Mejor una foto vertical o cuadrada. Sube una nueva cuando quieras cambiarla.",
    imgDefault: "Quitar y usar la predeterminada",
    imgMatchaTitle: "Imagen de Matcha y Arte", imgMatchaHelp: "Aparece en la tarjeta de Inicio y en la página de la colección.",
    fType: "Tipo de plan (filtros de Eventos)", fTypeAuto: "Automático (según el código)", fType_social: "Happy hour y social", fType_dining: "Restaurante y comida", fType_events: "Evento o plan (conciertos, mercados, festivales, exposiciones, concursos…)",
    fWcat: "Categoría de bienestar", fWcatNone: "— Sin categoría —", fMatcha: "Incluir en la colección «Matcha y Arte»",
    fUrlOffer: "Enlace de la oferta o reserva (https://…)",
    imgRemove: "Quitar imagen", fTripType: "Tipo de experiencia", fTripTypeHelp: "Define en qué tipo aparece en Viajes y Experiencias.",
    fMtype: "Tipo de contenido", mtype_spot: "Café o salón de té", mtype_place: "Lugar creativo / taller", mtype_recipe: "Receta o video", mtype_offer: "Oferta especial / colaboración",
    fFeatured: "Matcha de la semana (destacado)", fCity: "Ciudad", fCityHelp: "Permite filtrar por ciudad (Orlando, Boston, Miami…).",
    fUrlMatcha: "Enlace (receta, video, web o reserva)", fUrlBook: "Enlace de reserva o más información (https://…)",
    matchaIntro: "Contenido del Rincón Matcha & Arte: cafés, salones de té, lugares creativos, recetas y ofertas. Para eventos, márcalos con «Incluir en Matcha y Arte» en Planes y eventos.",
    tripIntro: "Cada experiencia tiene su propia página: agrega solo los detalles que apliquen (un picnic no necesita hotel).",
    wellIntro: "Experiencias de bienestar para «Descubre bienestar»: gimnasios, pilates, yoga, spas, masajes, faciales, retiros, comida sana, talleres u ofertas.",
    rfTitle: "Página de la experiencia (opcional)", rfHelp: "Completa solo lo que aplique. Las secciones vacías no se muestran.",
    rg_essentials: "Cupo, fecha límite, enlaces y notas de contacto", rg_includes: "Qué incluye (hotel, comidas, transporte…)", rg_logistics: "Viaje y logística",
    rg_attend: "Para asistir", rg_important: "Importante (requisitos, pasaporte, notas)", rg_gallery: "Galería de fotos y flyers",
    rg_about: "Sobre este plan (descripción completa, punto de encuentro, fechas)", rg_price: "Precio y pago (depósito, calendario de pagos)", rg_itinerary: "Itinerario por día",
    rg_contact: "Detalles y contacto", rg_promo: "Promoción u oferta", rg_flyer: "Flyer o fotos promocionales",
    rf_about: "Descripción completa", rf_meeting: "Punto de encuentro / salida", rf_dates: "Fechas (texto)", rf_deposit: "Depósito", rf_payment: "Pagos e instrucciones (sin pagos dentro de la app)",
    rf_meals: "Comidas", rf_passport: "Pasaporte y documentos", rf_contact_name: "Persona de contacto", rf_contact: "Datos de contacto (teléfono, correo, WhatsApp)",
    rf_promo: "Promoción / oferta", rf_instructions: "Instrucciones",
    rfCapacity: "Cupo (número de lugares)", rfRsvpBy: "Confirmar antes de", rfLinks: "Enlaces adicionales", rfLinksHelp: "Uno por línea: Etiqueta | https://…",
    rfAddPhoto: "+ Agregar foto", rfGalleryHelp: "Fotos adicionales del lugar o de experiencias anteriores.",
    rf_included: "Incluye", rf_excluded: "No incluye", rf_stay: "Alojamiento / hotel", rf_transport: "Transporte", rf_itinerary: "Itinerario (una línea por momento)",
    rf_activities: "Actividades", rf_dress: "Qué ponerse", rf_bring: "Qué llevar", rf_requirements: "Requisitos", rf_notes: "Importante", testFlag: "⚠ Parece contenido de prueba (contiene «test»): no se muestra en la app. Cámbiale el título o elimínalo.",
    loading: "Cargando…", loadFail: "No se pudo cargar. Inténtalo de nuevo.",
    newItem: "+ Nuevo", edit: "Editar", del: "Eliminar", publish: "Publicar", unpublish: "Ocultar", live: "Publicado", draft: "Borrador",
    confirmDelete: "¿Eliminar esto de forma permanente?", saved: "Guardado.", deleted: "Eliminado.", saveFail: "No se pudo guardar.",
    who: "Ver quién", hide: "Cerrar", nobody: "Nadie todavía", interestedWho: "❤️ Les interesa", goingWho: "✓ Van",
    counts: (i, g) => "❤️ " + i + " · ✓ " + g,
    empty: "Todavía no hay nada aquí.",
    fCode: "Código / categoría", fNone: "— Sin código —", fTitleEs: "Título (español)", fTitleEn: "Título (inglés)",
    fDescEs: "Descripción (español)", fDescEn: "Descripción (inglés)", fShortEs: "Descripción corta (español)", fShortEn: "Descripción corta (inglés)", fDate: "Fecha", fDateHelp: "El mes se calcula solo a partir de la fecha. Déjala vacía si aún no hay fecha.", aiToWeekend: "Agregar a ideas de fin de semana", fDateWeekend: "Fin de semana (fecha del sábado; se oculta sola al pasar)",
    fTime: "Hora (ej. 7:00 PM)", fDateText: "Fechas tentativas (ej. mayo, o 15–17 de mayo)", fLocationEvent: "Lugar", fLocationTrip: "Destino",
    fPriceEvent: "Precio aproximado", fPriceTrip: "Precio total", fUrl: "Enlace externo (https://…)", fDetails: "Más detalles / contacto",
    fImage: "Imagen", fImageUrl: "o pega la dirección de una imagen", uploading: "Subiendo imagen…", imageFail: "No se pudo subir la imagen (usa JPG, PNG o WebP).",
    fPublished: "Publicado (visible para las mujeres)", save: "Guardar", cancel: "Cancelar",
    needTitle: "Escribe un título (en español o en inglés).", badUrl: "El enlace debe empezar con https:// o http://",
    aiBanner: "✨ Preparado por IA a partir de resultados de búsqueda. Verifica fecha, hora, lugar, precio y enlace en la fuente antes de publicar.",
    aiReviewed: "Revisé la información y la fuente", aiNeedReview: "Marca “Revisé la información” para poder publicar.",
    polish: "✨ Mejorar y traducir con IA", polishing: "Trabajando…", polishDone: "Listo. Revisa los textos antes de guardar.",
    ph: "Escribe qué buscas…", aiIntro: "Pídele a la IA que busque opciones actuales. Tú revisas, editas y apruebas: nada se publica solo.",
    aiExamples: ["Happy hours en Orlando esta semana", "Eventos para mujeres en Orlando este mes", "Actividades sociales este fin de semana", "Actividades de bienestar", "Eventos de fe", "Experiencias interesantes", "Ideas de viaje de fin de semana"],
    aiAnyCode: "Cualquier código", aiSearch: "Buscar", aiSearching: "Buscando en internet… puede tardar hasta un minuto.",
    aiUse: "Usar esta opción", aiNone: "No encontré opciones. Prueba con otra búsqueda.", aiVerified: "Fuente verificada", aiUnverified: "Enlace sin verificar",
    aiNotReady: "El asistente de IA todavía no está activado (falta desplegar la función o la clave).", aiLimit: "Llegaste al límite diario del asistente. Inténtalo mañana.", aiFail: "El asistente no pudo responder. Inténtalo de nuevo.",
    aiNote: "Nota", aiSource: "Fuente",
    userCount: n => n + " usuarias registradas", search: "Buscar por nombre, correo o empresa…", role: { member: "Miembro", admin: "Administradora", content_admin: "Administradora de contenido", super_admin: "Fundadora y propietaria" },
    makeAdmin: "Hacer administradora", removeAdmin: "Quitar administradora", roleSaved: "Rol actualizado.", joined: "Se unió",
    company: "Empresa", city: "Ciudad", interests: "Intereses",
    reply: "Respuesta", sendReply: "Guardar respuesta", replySaved: "Respuesta guardada.", from: "De",
    heroTitle: "Foto de portada de Inicio", heroHelp: "Una foto horizontal de estilo de vida. El saludo («Buenos días, …») aparece encima con un velo suave; se recorta sola en celular y computadora.", heroDefault: "Usar la imagen original",
    quoteTitle: "Mensaje de hoy", quoteEs: "Mensaje (español)", quoteEn: "Mensaje (inglés)"
  },
  en: {
    pendingBanner: n => n + (n === 1 ? " member is waiting for your approval" : " members are waiting for your approval"), reviewNow: "Review", mkMemory: "Create memory", openMemory: "Open memory", memCreated: "Memory created", approvedBadge: "Approved", pendingBadge: "Pending", approve: "Approve", reject: "Reject", rejectedBadge: "Rejected", unapprove: "Remove approval", adminTaken: "There is already a second admin. Remove her role first to name someone else.",  approvalSaved: "Approval updated", welcomeSend: "Send welcome", welcomeDone: "Done",
    tabs: { plans: "Plans & events", trips: "Travel & Experiences", weekend: "Weekend ideas", home: "Home", wellness: "Wellness", community: "Community", memories: "Memories", polls: "Polls", messages: "Messages", users: "Members", ai: "✨ AI assistant", settings: "Images & texts", matcha: "Matcha Corner", trips: "Travel & Experiences" },
    groups: { content: "Content", people: "Community", tools: "Settings & media" },
    secImages: "Images", secTexts: "App texts", imgLogoTitle: "Brand logo", imgLogoHelp: "Shown in the header. Use a square file (PNG or SVG with a transparent background). Remove it to return to the approved logo.",
    imgPagesTitle: "Section entrance photos (optional)", imgPagesHelp: "When you add a photo it appears behind that section's title with a soft veil so the text stays readable.",
    page_events: "Plans & Events", page_wellness: "Wellness", page_support: "Here for you (Support)", page_community: "Community", page_messages: "Messages", page_travel: "Travel & Experiences",
    copyTitle: "Titles & phrases", copyHelp: "Change the Spanish and English text. Leave a field empty to use the original text (shown in grey).",
    copy_heroTitle: "Home · main phrase", copy_heroCta: "Home · button", copy_eventsTitle: "Events · title", copy_eventsIntro: "Events · intro",
    copy_yourSpace: "Wellness · title", copy_wellnessIntro: "Wellness · intro", copy_supTitle: "Support · title", copy_supIntro: "Support · intro",
    copy_communityTitle: "Community · title", copy_communityIntro: "Community · intro", copy_travelTitle: "Travel · title", copy_travelLead: "Travel · highlight",
    copy_travelIntro: "Travel · intro", copy_travelBadge: "Travel · badge", copy_maTag: "Matcha corner · tagline", copy_maIntro: "Matcha corner · intro",
    copy_wcQ: "Your code · question", copy_wcSub: "Your code · subtitle",
    imgTravelTitle: "Travel & Experiences image", imgTravelHelp: "Used on the Travel cover (when the trip has no photo) and on the Travel entry points on Home and Events.",
    imgFounderTitle: "Founder photo", imgFounderHelp: "Shown on “Our Story”. A portrait or square photo works best. Upload a new one anytime to change it.",
    imgDefault: "Remove and use the default",
    imgMatchaTitle: "Matcha & Art image", imgMatchaHelp: "Shown on the Home card and on the collection page.",
    fType: "Plan type (Events filters)", fTypeAuto: "Automatic (from the code)", fType_social: "Happy hour & social", fType_dining: "Restaurant & food", fType_events: "Event or thing to do (concerts, markets, festivals, exhibitions, contests…)",
    fWcat: "Wellness category", fWcatNone: "— No category —", fMatcha: "Include in the “Matcha & Art” collection",
    fUrlOffer: "Offer or booking link (https://…)",
    imgRemove: "Remove image", fTripType: "Experience type", fTripTypeHelp: "Sets which type it appears under in Travel & Experiences.",
    fMtype: "Content type", mtype_spot: "Café or tea room", mtype_place: "Creative place / workshop", mtype_recipe: "Recipe or video", mtype_offer: "Special offer / collaboration",
    fFeatured: "Matcha of the week (featured)", fCity: "City", fCityHelp: "Lets members filter by city (Orlando, Boston, Miami…).",
    fUrlMatcha: "Link (recipe, video, website or booking)", fUrlBook: "Booking or information link (https://…)",
    matchaIntro: "Content for the Matcha & Art Corner: cafés, tea rooms, creative places, recipes and offers. For events, tick “Include in Matcha & Art” in Plans & events.",
    tripIntro: "Each experience gets its own page: add only the details that apply (a picnic doesn't need a hotel).",
    wellIntro: "Wellness experiences for “Discover wellness”: gyms, Pilates, yoga, spas, massages, facials, retreats, healthy food, workshops or offers.",
    rfTitle: "Experience page (optional)", rfHelp: "Fill in only what applies. Empty sections are not shown.",
    rg_essentials: "Capacity, deadline, links and contact notes", rg_includes: "What's included (hotel, meals, transport…)", rg_logistics: "Travel & logistics",
    rg_attend: "To attend", rg_important: "Important (requirements, passport, notes)", rg_gallery: "Photo gallery & flyers",
    rg_about: "About this plan (full description, meeting point, dates)", rg_price: "Price & payment (deposit, schedule)", rg_itinerary: "Day-by-day itinerary",
    rg_contact: "Details & contact", rg_promo: "Promotion or offer", rg_flyer: "Flyer or promotional photos",
    rf_about: "Full description", rf_meeting: "Meeting / departure point", rf_dates: "Dates (text)", rf_deposit: "Deposit", rf_payment: "Payments & instructions (no payments inside the app)",
    rf_meals: "Meals", rf_passport: "Passport & documents", rf_contact_name: "Contact person", rf_contact: "Contact details (phone, email, WhatsApp)",
    rf_promo: "Promotion / offer", rf_instructions: "Instructions",
    rfCapacity: "Capacity (number of spots)", rfRsvpBy: "Confirm by", rfLinks: "Additional links", rfLinksHelp: "One per line: Label | https://…",
    rfAddPhoto: "+ Add photo", rfGalleryHelp: "Extra photos of the place or of past experiences.",
    rf_included: "Includes", rf_excluded: "Not included", rf_stay: "Accommodation / hotel", rf_transport: "Transportation", rf_itinerary: "Itinerary (one line per moment)",
    rf_activities: "Activities", rf_dress: "What to wear", rf_bring: "What to bring", rf_requirements: "Requirements", rf_notes: "Important", testFlag: "⚠ Looks like test content (contains “test”): it is not shown in the app. Rename or delete it.",
    loading: "Loading…", loadFail: "Could not load. Please try again.",
    newItem: "+ New", edit: "Edit", del: "Delete", publish: "Publish", unpublish: "Hide", live: "Published", draft: "Draft",
    confirmDelete: "Delete this permanently?", saved: "Saved.", deleted: "Deleted.", saveFail: "Could not save.",
    who: "See who", hide: "Close", nobody: "Nobody yet", interestedWho: "❤️ Interested", goingWho: "✓ Going",
    counts: (i, g) => "❤️ " + i + " · ✓ " + g,
    empty: "Nothing here yet.",
    fCode: "Código / category", fNone: "— No code —", fTitleEs: "Title (Spanish)", fTitleEn: "Title (English)",
    fDescEs: "Description (Spanish)", fDescEn: "Description (English)", fShortEs: "Short description (Spanish)", fShortEn: "Short description (English)", fDate: "Date", fDateHelp: "The month is worked out from the date. Leave empty if there is no date yet.", aiToWeekend: "Add to weekend ideas", fDateWeekend: "Weekend (Saturday's date; hides itself afterwards)",
    fTime: "Time (e.g. 7:00 PM)", fDateText: "Tentative dates (e.g. May, or May 15–17)", fLocationEvent: "Location", fLocationTrip: "Destination",
    fPriceEvent: "Approximate price", fPriceTrip: "Total price", fUrl: "External link (https://…)", fDetails: "More details / contact",
    fImage: "Image", fImageUrl: "or paste an image address", uploading: "Uploading image…", imageFail: "Could not upload the image (use JPG, PNG or WebP).",
    fPublished: "Published (visible to members)", save: "Save", cancel: "Cancel",
    needTitle: "Enter a title (Spanish or English).", badUrl: "The link must start with https:// or http://",
    aiBanner: "✨ Prepared by AI from search results. Check the date, time, place, price and link at the source before publishing.",
    aiReviewed: "I reviewed the information and the source", aiNeedReview: "Tick “I reviewed the information” to publish.",
    polish: "✨ Improve and translate with AI", polishing: "Working…", polishDone: "Done. Review the text before saving.",
    ph: "Describe what you're looking for…", aiIntro: "Ask the AI to search for current options. You review, edit and approve: nothing is published automatically.",
    aiExamples: ["Happy hours around Orlando this week", "Women's events around Orlando this month", "Social activities this weekend", "Wellness activities", "Faith-related events", "Interesting experiences", "Weekend trip ideas"],
    aiAnyCode: "Any code", aiSearch: "Search", aiSearching: "Searching the web… this can take up to a minute.",
    aiUse: "Use this option", aiNone: "No options found. Try a different search.", aiVerified: "Source verified", aiUnverified: "Link not verified",
    aiNotReady: "The AI assistant isn't switched on yet (the function or key still needs to be set up).", aiLimit: "You've reached the assistant's daily limit. Try again tomorrow.", aiFail: "The assistant couldn't answer. Please try again.",
    aiNote: "Note", aiSource: "Source",
    userCount: n => n + " registered members", search: "Search by name, email or company…", role: { member: "Member", admin: "Administrator", content_admin: "Content administrator", super_admin: "Founder & Owner" },
    makeAdmin: "Make administrator", removeAdmin: "Remove administrator", roleSaved: "Role updated.", joined: "Joined",
    company: "Company", city: "City", interests: "Interests",
    reply: "Reply", sendReply: "Save reply", replySaved: "Reply saved.", from: "From",
    heroTitle: "Home cover photo", heroHelp: "A landscape lifestyle photo. The greeting (“Good morning, …”) sits on it with a soft veil; it crops itself for phones and computers.", heroDefault: "Use the original image",
    quoteTitle: "Today's message", quoteEs: "Message (Spanish)", quoteEn: "Message (English)"
  }
};

// Creative pass: publishing studio labels (Wellness + Código Experiences)
Object.assign(S.es, {
  newWellness: "+ Agregar experiencia de bienestar", newTrip: "+ Crear experiencia Código", newEvent: "+ Nuevo plan o evento",
  studioWell: "Estudio de Bienestar: publica spas, masajes, gimnasios, pilates, yoga, faciales, uñas, cabello, retiros, comida sana, talleres, ofertas y promociones. Las miembros verán una tarjeta con foto, categoría, precio y botón de acción.",
  studioTrip: "Estudio de Código Experiences: crea la página completa de cada experiencia. Vista previa antes de publicar; las secciones vacías no se muestran.",
  fStatus: "Estado de inscripción", st_auto: "— Automático (según cupo y fecha límite) —", st_open: "Inscripciones abiertas", st_waitlist: "Lista de espera", st_soldout: "Agotado", st_closed: "Cerrado",
  fFeaturedTrip: "Experiencia destacada (aparece primero y en Inicio)", fFeaturedWell: "Código Pick (destacado, aparece primero)",
  fWcatOther: "Nombre de la categoría (si eliges «Otro»)", fDateTrip: "Fecha de inicio", fTimeTrip: "Hora de inicio",
  rg_brand: "Marca de la experiencia (subtítulo, estado, destacada)", rg_where: "Lugar (destino, ciudad, país, dirección)", rg_when: "Fechas y horarios (fin, encuentro, pago)",
  rg_capacity: "Cupo y disponibilidad", rg_prep: "Preparación (qué ponerse, qué llevar, clima, empacar)", rg_requirements: "Requisitos (pasaporte, visa, edad, formularios, documentos)",
  rg_notes: "Notas, cancelación e instrucciones", rg_wprice: "Precio, promoción y vigencia",
  rf_subtitle: "Subtítulo", rf_price_covers: "Qué cubre el precio", rf_tickets: "Entradas", rf_tours: "Tours", rf_other_inc: "Otros (incluido)",
  rf_packing: "Lista para empacar", rf_weather: "Clima", rf_visa: "Visa", rf_age: "Edad mínima / requisitos de edad", rf_waivers: "Formularios / exoneraciones",
  rf_documents: "Documentos", rf_cancellation: "Política de cancelación", rf_dates_hint: "",
  sf_city: "Ciudad", sf_country: "País", sf_address: "Dirección", sf_end_date: "Fecha de fin", sf_meeting_time: "Hora de encuentro", sf_pay_by: "Fecha límite de pago",
  sf_pay_link: "Enlace de pago externo (https://…)", sf_spots_left: "Lugares restantes (opcional: si lo dejas vacío se calcula con «Voy»)", sf_phone: "Teléfono", sf_email: "Correo", sf_website: "Sitio web (https://…)",
  sf_promo_price: "Precio promocional", sf_offer_until: "Oferta válida hasta",
  daysTitle: "Itinerario por día (estructurado)", dayAdd: "+ Agregar momento", dayRemove: "Quitar", dayDay: "Día (ej. Día 1)", dayDate: "Fecha", dayTime: "Hora",
  dayAct: "Actividad", dayDesc: "Descripción", preview: "👁 Vista previa", previewNeed: "Escribe al menos un título para la vista previa."
});
Object.assign(S.en, {
  newWellness: "+ Add wellness experience", newTrip: "+ Create Código experience", newEvent: "+ New plan or event",
  studioWell: "Wellness studio: publish spas, massages, gyms, Pilates, yoga, facials, nails, hair, retreats, healthy food, workshops, offers and promotions. Members see a photo card with category, price and an action button.",
  studioTrip: "Código Experiences studio: build each experience's full page. Preview before publishing; empty sections are not shown.",
  fStatus: "Registration status", st_auto: "— Automatic (from capacity and deadline) —", st_open: "Registration open", st_waitlist: "Waitlist", st_soldout: "Sold out", st_closed: "Closed",
  fFeaturedTrip: "Featured experience (shown first and on Home)", fFeaturedWell: "Código Pick (featured, shown first)",
  fWcatOther: "Category name (if you choose “Other”)", fDateTrip: "Start date", fTimeTrip: "Start time",
  rg_brand: "Experience branding (subtitle, status, featured)", rg_where: "Location (destination, city, country, address)", rg_when: "Dates & times (end, meeting, payment)",
  rg_capacity: "Capacity & availability", rg_prep: "Preparation (what to wear, bring, weather, packing)", rg_requirements: "Requirements (passport, visa, age, waivers, documents)",
  rg_notes: "Notes, cancellation & instructions", rg_wprice: "Price, promotion & validity",
  rf_subtitle: "Subtitle", rf_price_covers: "What the price covers", rf_tickets: "Tickets", rf_tours: "Tours", rf_other_inc: "Other (included)",
  rf_packing: "Packing list", rf_weather: "Weather", rf_visa: "Visa", rf_age: "Age requirements", rf_waivers: "Waivers / forms",
  rf_documents: "Documents", rf_cancellation: "Cancellation policy", rf_dates_hint: "",
  sf_city: "City", sf_country: "Country", sf_address: "Address", sf_end_date: "End date", sf_meeting_time: "Meeting time", sf_pay_by: "Payment deadline",
  sf_pay_link: "External payment link (https://…)", sf_spots_left: "Spots remaining (optional: leave empty to count “Going”)", sf_phone: "Phone", sf_email: "Email", sf_website: "Website (https://…)",
  sf_promo_price: "Promotional price", sf_offer_until: "Offer valid until",
  daysTitle: "Day-by-day itinerary (structured)", dayAdd: "+ Add a moment", dayRemove: "Remove", dayDay: "Day (e.g. Day 1)", dayDate: "Date", dayTime: "Time",
  dayAct: "Activity", dayDesc: "Description", preview: "👁 Preview", previewNeed: "Write at least one title to preview."
});

// Nuestra Historia editor + Miembros / Solicitudes review (approved Oct 2026)
Object.assign(S.es, {
  secStory: "Nuestra Historia", storyEdTitle: "Textos de Nuestra Historia", storyEdHelp: "Escribe en español y en inglés. Deja un campo vacío para usar el texto original (lo ves en gris). Un renglón en blanco separa párrafos.",
  sf_name: "Nombre de la fundadora", sf_role: "Cargo", sf_who: "Quién la creó", sf_why: "Por qué nació", sf_vision: "Visión", sf_mission: "Misión", storyOpen: "Ver la página →",
  f_requests: "Solicitudes", f_members: "Miembros", f_all: "Todas", noRequests: "No hay solicitudes pendientes. 🌸",
  appPhone: "Teléfono", appEmail: "Correo", appBday: "Cumpleaños", appWants: "Quiere vivir", appHeard: "Llegó por", appGuide: "Normas", appSmile: "Algo que la hace sonreír",
  appWa: "Escribir por WhatsApp", appNoWa: "Prefiere no recibir WhatsApp", appGuideOk: d => "✓ Aceptadas el " + d, appOld: "Se registró antes de la nueva solicitud: sin respuestas.",
  heard_friend: "Una amiga", heard_event: "Un evento", heard_social: "Redes sociales", heard_other: "Otro", appInvited: "invitada por",
  appView: "Ver solicitud", appHide: "Ocultar solicitud", appWait: "¿Aún no decides? Déjala en Solicitudes y vuelve cuando quieras.", ago: d => d
});
Object.assign(S.en, {
  secStory: "Our Story", storyEdTitle: "Our Story texts", storyEdHelp: "Write in Spanish and English. Leave a field empty to use the original text (shown in grey). A blank line separates paragraphs.",
  sf_name: "Founder's name", sf_role: "Role", sf_who: "Who created it", sf_why: "Why it was born", sf_vision: "Vision", sf_mission: "Mission", storyOpen: "View the page →",
  f_requests: "Requests", f_members: "Members", f_all: "All", noRequests: "No pending requests. 🌸",
  appPhone: "Phone", appEmail: "Email", appBday: "Birthday", appWants: "Wants to experience", appHeard: "Found us via", appGuide: "Guidelines", appSmile: "Something that makes her smile",
  appWa: "Message on WhatsApp", appNoWa: "Prefers no WhatsApp", appGuideOk: d => "✓ Accepted on " + d, appOld: "Joined before the new application: no answers.",
  heard_friend: "A friend", heard_event: "An event", heard_social: "Social media", heard_other: "Other", appInvited: "invited by",
  appView: "View application", appHide: "Hide application", appWait: "Not sure yet? Leave her in Requests and come back anytime.", ago: d => d
});
S.es.tabs.users = "Miembros";
Object.assign(S.es, { fFull: "Mostrar la imagen completa (sin recortar)",
  copy_storyT: "Viajes: título de la promesa", copy_storyP: "Viajes: texto de la promesa", copy_homeExpSoon: "Experiencias: titular «próximamente» (Inicio)", copy_homeExpSoonP: "Experiencias: texto «próximamente» (Inicio)" });
Object.assign(S.en, { fFull: "Show the whole image (don't crop)",
  copy_storyT: "Travel: promise headline", copy_storyP: "Travel: promise text", copy_homeExpSoon: "Experiences: “coming soon” headline (Home)", copy_homeExpSoonP: "Experiences: “coming soon” text (Home)" });
Object.assign(S.es, { makeContentAdmin: "Hacer administradora de contenido", removeContentAdmin: "Quitar administradora de contenido",
  adminLimit: "Ya existe la cuenta adicional de administración (contenido). Quítala primero para nombrar a otra.",
  confirmContentAdmin: "Esta cuenta podrá crear, editar y publicar contenido y subir imágenes. No verá miembros, solicitudes ni mensajes privados. ¿Continuar?" });
Object.assign(S.en, { makeContentAdmin: "Make content administrator", removeContentAdmin: "Remove content administrator",
  adminLimit: "The additional admin account (content) already exists. Remove it first to appoint another.",
  confirmContentAdmin: "This account will be able to create, edit and publish content and upload images. It will not see members, applications or private messages. Continue?" });

const KINDS = {
  event:    { tab: "plans",    fields: ["code", "title", "desc", "date", "time", "location", "price", "url", "details", "image"] },
  trip:     { tab: "trips",    fields: ["code", "title", "desc", "date", "time", "date_text", "location", "price", "url", "details", "image"] },
  home:     { tab: "home",     fields: ["title", "desc", "image"] },
  wellness: { tab: "wellness", fields: ["title", "desc", "date", "time", "location", "price", "url", "details", "image"] },
  weekend:  { tab: "weekend",  fields: ["code", "title", "desc", "date", "location", "url"] },
  // Rincón Matcha & Arte items are ordinary "home" plans tagged {matcha, mtype, featured, city} (no new table)
  matcha:   { tab: "matcha",   fields: ["title", "desc", "location", "url", "image"], dbKind: "home" }
};
const TAB_KIND = { plans: "event", trips: "trip", weekend: "weekend", home: "home", wellness: "wellness", matcha: "matcha" };
const TABS = ["plans", "trips", "weekend", "home", "wellness", "matcha", "community", "memories", "polls", "messages", "users", "ai", "settings"];
// Visual grouping only: every tab (and what it can do) is exactly the same as before.
const GROUPS = [
  ["content", ["plans", "weekend", "trips", "wellness", "matcha", "home", "polls"]],
  ["people", ["users", "messages", "community", "memories"]],
  ["tools", ["settings", "ai"]]
];
// Content admins get only the content tabs. Full admins keep every tab exactly as before.
const PEOPLE_TABS = ["community", "memories", "polls", "messages", "users", "ai"];
const EXTRA = {};   // tabs added by admin-content.js: key -> { group, render, label: {es,en} }
const allowedTabs = () => [...TABS, ...Object.keys(EXTRA)].filter(k => C.isAdmin() || !PEOPLE_TABS.includes(k));
function groupsFor() {
  const base = GROUPS.map(([g, keys]) => [g, g === "content" ? [...keys, ...Object.keys(EXTRA).filter(k => EXTRA[k].group === "content")] : keys]);
  return base.map(([g, keys]) => [g, keys.filter(k => allowedTabs().includes(k))]).filter(([, keys]) => keys.length);
}
const CODES = ["Social", "Wellness", "Faith", "Adventure", "Family", "Connection", "Support", "Recharge"];
const EVENT_TYPES = ["social", "dining", "events"];
const WCATS = ["spa", "massage", "facial", "skincare", "nails", "hair", "beauty", "gym", "fitness", "pilates", "yoga", "movement", "meditation", "mind", "retreat", "food", "workshop", "offer", "promo", "other"];
const WCATS_LEGACY = ["movement", "mind"];   // older combined categories: kept for existing items, not offered for new ones
const TRIP_TYPES = ["trip", "retreat", "party", "dining", "nature"];
const TRIP_TYPE_KEY = { trip: "expTrip", retreat: "expRetreat", party: "expParty", dining: "expDining", nature: "expNature" };
const MTYPES = ["spot", "place", "recipe", "offer"];
// Editor groups mirror the member detail page: Sobre este plan · Precio · Qué incluye · Itinerario · Importante · Detalles y contacto
// Studio sections mirror the member detail page. [group, bilingual keys, structured (single-language) fields]
const RICH_BY_KIND = {
  trip: [["brand", ["subtitle"], ["status"]], ["about", ["about", "meeting", "dates"]], ["where", [], ["city", "country", "address"]],
         ["when", [], ["end_date", "meeting_time", "pay_by"]], ["price", ["price_covers", "deposit", "payment"], ["pay_link"]],
         ["capacity", [], ["capacity", "spots_left", "rsvp_by"]],
         ["includes", ["included", "stay", "transport", "meals", "tickets", "tours", "other_inc", "excluded"]],
         ["itinerary", ["itinerary"], ["days"]], ["prep", ["activities", "dress", "bring", "weather", "packing"]],
         ["requirements", ["requirements", "passport", "visa", "age", "waivers", "documents"]],
         ["contact", ["contact_name", "contact"], ["phone", "email", "website"]], ["notes", ["notes", "cancellation", "instructions"]], ["essentials", []]],
  event: [["about", ["about", "meeting"]], ["includes", ["included", "excluded", "meals"]], ["attend", ["activities", "dress", "bring"]],
          ["important", ["requirements", "notes"]], ["price", ["deposit", "payment"]], ["contact", ["contact_name", "contact"], ["phone", "email", "website"]], ["essentials", []]],
  wellness: [["about", ["about"]], ["wprice", ["promo"], ["promo_price", "offer_until"]], ["where", [], ["city", "address"]], ["attend", ["instructions"]],
             ["important", ["notes"]], ["contact", ["contact_name", "contact"], ["phone", "email", "website"]], ["essentials", []]]
};
const STRUCT = { city: "text", country: "text", address: "text", end_date: "date", meeting_time: "text", pay_by: "date", pay_link: "url",
  spots_left: "number", phone: "tel", email: "email", website: "url", promo_price: "text", offer_until: "date", status: "status", capacity: "number", rsvp_by: "date" };
const looksLikeTest = (...texts) => texts.some(x => /\btest(ing)?\b/i.test(String(x || "")));
// Category / collection tags live in the existing settings table (key "plan_tags"), admin-only write.
// One entry of a small map kept in the settings table (plan_tags, poll_places). Reads fresh, merges, writes.
async function setMapEntry(key, id, value) {
  const r = await C.db.from("settings").select("key,value").eq("key", key).maybeSingle();
  if (r.error) throw r.error;
  const all = Object.assign({}, (r.data && r.data.value) || {});
  if (value === null || value === undefined || value === "" || (typeof value === "object" && !Object.keys(value).length)) delete all[id];
  else all[id] = value;
  const w = await C.db.from("settings").upsert({ key, value: all, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (w.error) throw w.error;
}
async function saveTag(planId, tag) {
  const clean = {};
  ["cat", "mtype", "city", "label"].forEach(k => { if (tag[k]) clean[k] = tag[k]; });
  if (tag.matcha) clean.matcha = true;
  if (tag.full) clean.full = true;
  if (tag.featured) clean.featured = true;
  await setMapEntry("plan_tags", planId, clean);
}

let C = null;
let tab = "plans";
let editing = null;       // { kind, row, prefill, ai }
let renderToken = 0;
const a = key => (S[C.lang()][key] !== undefined ? S[C.lang()][key] : key);
const root = () => document.getElementById("adminRoot");
const el = (...args) => C.el(...args);

document.addEventListener("cml:session", event => {
  C = window.CML;
  if (event.detail.staff) { tab = "plans"; editing = null; render(); }
  else if (root()) root().replaceChildren();
});
document.addEventListener("cml:lang", () => { if (window.CML && window.CML.isStaff()) { C = window.CML; render(); } });

function toast(text) {
  const status = document.getElementById("appStatus");
  if (!status) return;
  status.hidden = false; status.textContent = text;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => { status.hidden = true; status.textContent = ""; }, 5000);
}
function button(text, cls, handler) {
  const b = el("button", { type: "button", class: cls || "", text });
  b.addEventListener("click", handler);
  return b;
}
function loadingNode() { return el("p", { class: "small-note", text: a("loading") }); }

// ---------- birthday -> celebration (a DRAFT event the admin reviews and publishes) ----------
async function celebrate(person) {
  const now = new Date(), y = now.getFullYear();
  const mk = yr => new Date(yr, person.birth_month - 1, person.birth_day);
  let d = mk(y); if (d < new Date(y, now.getMonth(), now.getDate())) d = mk(y + 1);
  if (d.getMonth() !== person.birth_month - 1) d = new Date(d.getFullYear(), person.birth_month - 1, 28);   // Feb 29 in a common year
  const iso = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const n = person.first_name;
  const r = await C.db.from("plans").insert({
    kind: "event", code: "Social", published: false, event_date: iso,
    title_es: C.t("bdEventTitleEs")(n), title_en: C.t("bdEventTitleEn")(n)
  }).select().single();
  if (r.error) return toast(C.t("bdFail"));
  toast(C.t("bdCreated"));
  C.showPage("admin", false);
  tab = "plans"; editing = { kind: "event", row: r.data }; render();
}
// Opens one existing admin tab (used by the "Gestionar experiencias" shortcut on Viajes y Experiencias).
function openTab(key) {
  if (!C || !C.isStaff() || !allowedTabs().includes(key)) return;
  C.showPage("admin", false);
  tab = key; editing = null; render();
}
// Opens the create form directly (used by the admin-only "+ Agregar…" shortcuts on Wellness and Travel).
function openNew(kind) {
  if (!C || !C.isStaff() || !KINDS[kind]) return;
  C.showPage("admin", false);
  tab = KINDS[kind].tab; editing = { kind, row: null }; render();
}
function registerTab(key, def) {
  EXTRA[key] = def; S.es.tabs[key] = def.label.es; S.en.tabs[key] = def.label.en;
  if (C && C.isStaff && C.isStaff() && root() && root().children.length) render();
}
window.CMLAdmin = { registerTab, kit: () => ({ el, button, toast, imagePicker, rerender: render, a }), celebrate, openTab, openNew, setMapEntry: (key, id, value) => (C && C.isStaff() ? setMapEntry(key, id, value) : Promise.reject(new Error("admin"))) };

// ---------- pending approvals: badge on the Admin button + banner ----------
async function pendingCount() {
  const r = await C.db.from("profiles").select("id", { count: "exact", head: true }).eq("approved", false).eq("rejected", false).eq("role", "member");
  const n = r.error ? 0 : (r.count || 0);
  const nav = document.getElementById("navAdmin");
  if (nav) {
    let b = nav.querySelector(".nav-badge");
    if (!n) { if (b) b.remove(); }
    else { if (!b) { b = document.createElement("span"); b.className = "nav-badge"; nav.appendChild(b); } b.textContent = String(n); b.setAttribute("aria-label", String(n)); }
  }
  return n;
}

// ---------- rendering ----------
function render() {
  const host = root();
  if (!host || !C || !C.isStaff()) return;
  const token = ++renderToken;
  if (!allowedTabs().includes(tab)) tab = "plans";
  const tabsBar = el("div", { class: "admin-groups" }, groupsFor().map(([g, keys]) =>
    el("div", { class: "admin-group" },
      el("small", { class: "admin-group-label", id: "ag-" + g, text: a("groups")[g] }),
      el("div", { class: "admin-tabs", role: "tablist", "aria-labelledby": "ag-" + g }, keys.map(key => {
        const b = el("button", { type: "button", role: "tab", class: "chip" + (tab === key ? " selected" : ""), "aria-selected": String(tab === key), "data-tab": key, text: a("tabs")[key] });
        b.addEventListener("click", () => { tab = key; editing = null; render(); });
        return b;
      })))));
  const body = el("div", { id: "adminBody" }, loadingNode());
  const banner = el("div", { class: "pending-banner", role: "status", hidden: true });
  host.replaceChildren(tabsBar, banner, body);
  (C.isAdmin() ? pendingCount() : Promise.resolve(0)).then(n => {
    if (token !== renderToken) return;
    const usersChip = tabsBar.querySelector('[data-tab="users"]');
    if (usersChip && n) usersChip.appendChild(el("span", { class: "tab-badge", "aria-label": String(n), text: String(n) }));
    if (!n || tab === "users") { banner.hidden = true; return; }
    banner.hidden = false;
    banner.replaceChildren(el("span", { text: "⏳ " + a("pendingBanner")(n) }), button(a("reviewNow"), "primary", () => { tab = "users"; usersFilter = "requests"; editing = null; render(); }));
  });
  const fill = node => { if (token === renderToken) body.replaceChildren(node); };
  const fail = () => fill(el("p", { class: "form-feedback", text: a("loadFail") }));

  if (editing) return fill(formView());
  const run = async () => {
    try {
      if (TAB_KIND[tab]) fill(await listView(TAB_KIND[tab]));
      else if (tab === "community") fill(await communityView());
      else if (tab === "memories") fill(window.CMLMem ? await window.CMLMem.adminView({ empty: a("empty") }) : el("p", { class: "small-note", text: a("empty") }));
      else if (tab === "polls") fill(window.CMLPolls ? await window.CMLPolls.adminView({ empty: a("empty") }) : el("p", { class: "small-note", text: a("empty") }));
      else if (tab === "messages") fill(await messagesView());
      else if (tab === "users") fill(await usersView());
      else if (tab === "ai") fill(aiView());
      else if (tab === "settings") fill(await settingsView());
      else if (EXTRA[tab]) fill(await EXTRA[tab].render());
    } catch (e) { console.error(e); fail(); }
  };
  run();
}

// ---------- plans / trips / home / wellness ----------
async function listView(kind) {
  const q = C.db.from("plans").select("*").eq("kind", KINDS[kind].dbKind || kind);
  const { data, error } = (kind === "event" || kind === "trip" || kind === "weekend")
    ? await q.order("event_date", { ascending: false, nullsFirst: true })
    : await q.order("created_at", { ascending: false });
  if (error) throw error;
  const isCorner = r => !!(C.planTag && C.planTag(r.id).matcha);
  const rows = kind === "matcha" ? data.filter(isCorner) : kind === "home" ? data.filter(r => !isCorner(r)) : data;
  const wrap = el("div");
  if (kind === "matcha") wrap.appendChild(el("p", { class: "small-note", text: a("matchaIntro") }));
  if (kind === "trip") wrap.appendChild(el("p", { class: "small-note studio-intro", text: a("studioTrip") }));
  if (kind === "wellness") wrap.appendChild(el("p", { class: "small-note studio-intro", text: a("studioWell") }));
  const newLabel = kind === "wellness" ? a("newWellness") : kind === "trip" ? a("newTrip") : kind === "event" ? a("newEvent") : a("newItem");
  wrap.appendChild(el("div", { class: "admin-bar" }, button(newLabel, "primary studio-new", () => { editing = { kind, row: null }; render(); })));
  if (!rows.length) wrap.appendChild(el("p", { class: "small-note", text: a("empty") }));

  let tally = new Map();
  if (kind === "event" || kind === "trip" || kind === "weekend") {
    const r = await C.db.from("responses").select("plan_id,status");
    if (!r.error) (r.data || []).forEach(x => {
      const c = tally.get(x.plan_id) || { i: 0, g: 0 };
      if (x.status === "going") c.g++; else c.i++;
      tally.set(x.plan_id, c);
    });
  }
  let memIds = null;
  if (kind === "event" && window.CMLMem) { try { memIds = await window.CMLMem.planMemoryIds(); } catch { memIds = null; } }
  rows.forEach(row => wrap.appendChild(planItem(kind, row, tally.get(row.id) || { i: 0, g: 0 }, memIds)));
  return wrap;
}
function planItem(kind, row, c, memIds) {
  const title = C.pick(row, "title") || "—";
  const when = row.event_date ? C.fmtDate(row.event_date) + (row.event_time ? " · " + row.event_time : "") : (row.date_text || "");
  const item = el("div", { class: "admin-item" },
    el("span", { class: "badge" + (row.published ? " live" : ""), text: row.published ? a("live") : a("draft") }),
    row.code && C.codeLabels[row.code] ? el("span", { class: "badge", text: " " + C.t(C.codeLabels[row.code]) }) : null,
    (() => { const tg = C.planTag ? C.planTag(row.id) : {}; const bits = [];
      if (kind === "event" && EVENT_TYPES.includes(tg.cat)) bits.push(a("fType_" + tg.cat).split(" (")[0]);
      if (kind === "wellness" && WCATS.includes(tg.cat)) bits.push(tg.cat === "other" && tg.label ? tg.label : C.t("wcat_" + tg.cat));
      if ((kind === "wellness" || kind === "trip") && tg.featured) bits.push("✦ " + (kind === "trip" ? a("fFeaturedTrip").split(" (")[0] : "Código Pick"));
      if (kind === "trip") bits.push(C.t(TRIP_TYPE_KEY[TRIP_TYPES.includes(tg.cat) ? tg.cat : "trip"]));
      if (kind === "matcha") { bits.push(a("mtype_" + (MTYPES.includes(tg.mtype) ? tg.mtype : "spot"))); if (tg.featured) bits.push("★ " + a("fFeatured")); if (tg.city) bits.push("📍 " + tg.city); }
      else if (tg.matcha) bits.push("🍵 " + C.t("maName"));
      return bits.length ? el("span", { class: "badge", text: bits.join(" · ") }) : null; })(),
    el("h3", { text: title }),
    looksLikeTest(row.title_es, row.title_en) ? el("p", { class: "test-flag", text: a("testFlag") }) : null,
    when ? el("p", { class: "small-note", text: "📅 " + when }) : null,
    row.location ? el("p", { class: "small-note", text: "📍 " + row.location }) : null,
    (kind === "event" || kind === "trip" || kind === "weekend") ? el("p", { class: "small-note", text: a("counts")(c.i, c.g) }) : null);
  const whoBox = el("div");
  const actions = el("div", { class: "actions" },
    button(a("edit"), "", () => { editing = { kind, row }; render(); }),
    button(row.published ? a("unpublish") : a("publish"), "", async () => {
      const { error } = await C.db.from("plans").update({ published: !row.published }).eq("id", row.id);
      if (error) return toast(a("saveFail"));
      await C.refreshPublic(); toast(a("saved")); render();
    }));
  if (kind === "event" || kind === "trip") {
    let open = false;
    const whoBtn = button(a("who"), "", async () => {
      open = !open;
      whoBtn.textContent = open ? a("hide") : a("who");
      if (!open) return whoBox.replaceChildren();
      whoBox.replaceChildren(loadingNode());
      const { data, error } = await C.db.from("responses")
        .select("status, profiles(first_name,last_name,email,company)").eq("plan_id", row.id);
      if (error) return whoBox.replaceChildren(el("p", { class: "form-feedback", text: a("loadFail") }));
      const line = p => (p ? (p.first_name + " " + p.last_name).trim() + " · " + p.email + (p.company ? " · " + p.company : "") : "?");
      const group = (status, label) => {
        const rows = data.filter(x => x.status === status);
        return el("div", {}, el("b", { text: label + " (" + rows.length + ")" }),
          rows.length ? el("ul", { class: "who" }, rows.map(x => el("li", { text: line(x.profiles) }))) : el("p", { class: "small-note", text: a("nobody") }));
      };
      whoBox.replaceChildren(group("interested", a("interestedWho")), group("going", a("goingWho")));
    });
    actions.appendChild(whoBtn);
  }
  if ((kind === "event" || kind === "trip") && window.CMLPolls) {
    actions.appendChild(button("🗳 " + C.t("aPollsTab"), "", () => { window.CMLPolls.prefill(row.id); tab = "polls"; editing = null; render(); }));
  }
  if (kind === "event" && window.CMLMem && memIds) {
    const existing = memIds.get(row.id);
    actions.appendChild(button(existing ? a("openMemory") : a("mkMemory"), "", async () => {
      if (existing) return window.CMLMem.openMemory(existing);
      const r = await window.CMLMem.createFromPlan(row);
      if (r.error) return toast(a("saveFail"));
      toast(a("memCreated")); render();
    }));
  }
  actions.appendChild(button(a("del"), "danger", async () => {
    if (!window.confirm(a("confirmDelete"))) return;
    const { error } = await C.db.from("plans").delete().eq("id", row.id);
    if (error) return toast(a("saveFail"));
    await C.refreshPublic(); toast(a("deleted")); render();
  }));
  item.appendChild(actions);
  item.appendChild(whoBox);
  return item;
}

// ---------- image upload (resized in the browser, stored in Supabase Storage) ----------
async function resizeToJpeg(file, max = 1600) {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error("type");
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return await new Promise((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error("blob")), "image/jpeg", 0.85));
}
async function uploadImage(file) {
  const blob = await resizeToJpeg(file);
  const path = new Date().getFullYear() + "/" + Date.now() + "-" + Math.random().toString(36).slice(2, 8) + ".jpg";
  const { error } = await C.db.storage.from("images").upload(path, blob, { contentType: "image/jpeg", upsert: false });
  if (error) throw error;
  return C.db.storage.from("images").getPublicUrl(path).data.publicUrl;
}
function imagePicker(initial) {
  const urlInput = el("input", { type: "url", placeholder: "https://…", value: initial || "", inputmode: "url" });
  const preview = el("img", { class: "preview", alt: "" });
  const status = el("p", { class: "small-note", role: "status" });
  const fileInput = el("input", { type: "file", accept: "image/jpeg,image/png,image/webp" });
  const sync = () => {
    const safe = C.safeUrl(urlInput.value);
    if (safe) { preview.src = safe; preview.hidden = false; } else { preview.removeAttribute("src"); preview.hidden = true; }
  };
  urlInput.addEventListener("input", sync);
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    status.textContent = a("uploading");
    try { urlInput.value = await uploadImage(file); status.textContent = ""; sync(); }
    catch (e) { console.error(e); status.textContent = a("imageFail"); }
  });
  sync();
  const clear = button(a("imgRemove"), "link-btn img-remove", () => { urlInput.value = ""; sync(); });
  const node = el("div", {}, fileInput, preview, status,
    el("label", {}, a("fImageUrl"), urlInput), clear);
  return { node, get value() { return urlInput.value.trim(); }, set value(v) { urlInput.value = v; sync(); } };
}

// ---------- rich experience details editor ----------
function parseRich(details) {
  const raw = String(details || "");
  if (raw.startsWith("CML:")) { try { return JSON.parse(raw.slice(4)) || {}; } catch { return {}; } }
  return { text: raw };
}
function richFields(kind, details) {
  const x = parseRich(details);
  const isNew = !String(details || "").trim();
  const inputs = {}, struct = {};
  const pair = key => {
    const es = el("textarea", { rows: 3, "aria-label": a("rf_" + key) + " (ES)" }); es.value = (x.es && x.es[key]) || "";
    const en = el("textarea", { rows: 3, "aria-label": a("rf_" + key) + " (EN)" }); en.value = (x.en && x.en[key]) || "";
    if (key === "subtitle") { es.rows = 1; en.rows = 1; }
    inputs[key] = { es, en };
    return el("div", { class: "rf-pair" }, el("b", { text: a("rf_" + key) }),
      el("div", { class: "two-col" }, el("label", {}, el("small", { text: "Español" }), es), el("label", {}, el("small", { text: "English" }), en)));
  };
  const sfLabel = k => (k === "capacity" ? a("rfCapacity") : k === "rsvp_by" ? a("rfRsvpBy") : k === "status" ? a("fStatus") : a("sf_" + k));
  const structField = k => {
    const type = STRUCT[k];
    let inp;
    if (type === "status") {
      inp = el("select", {}, el("option", { value: "", text: a("st_auto") }), ["open", "waitlist", "soldout", "closed"].map(v => el("option", { value: v, text: a("st_" + v) })));
      inp.value = x.status || "";
    } else {
      inp = el("input", { type: type === "number" ? "number" : type, value: x[k] === undefined || x[k] === null ? "" : String(x[k]) });
      if (type === "number") { inp.min = "0"; inp.max = "5000"; }
      if (type === "url") { inp.placeholder = "https://…"; inp.inputMode = "url"; }
      if (type === "text") inp.maxLength = 160;
    }
    inp.setAttribute("data-sf", k);
    struct[k] = inp;
    return el("label", {}, sfLabel(k), inp);
  };
  // structured itinerary rows
  const days = el("div", { class: "rf-days" });
  const dayRows = [];
  const addDay = r => {
    r = r || {};
    const f = (type, v, ph) => { const i = el("input", { type, value: v || "" }); if (ph) i.placeholder = ph; return i; };
    const io = { day: f("text", r.day, a("dayDay")), date: f("date", r.date), time: f("text", r.time, "9:00"),
      act_es: f("text", r.es && r.es.act), act_en: f("text", r.en && r.en.act),
      desc_es: el("textarea", { rows: 2 }), desc_en: el("textarea", { rows: 2 }) };
    io.desc_es.value = (r.es && r.es.desc) || ""; io.desc_en.value = (r.en && r.en.desc) || "";
    const row = el("div", { class: "rf-day" },
      el("div", { class: "rf-day-top" }, el("label", {}, a("dayDay"), io.day), el("label", {}, a("dayDate"), io.date), el("label", {}, a("dayTime"), io.time)),
      el("div", { class: "two-col" },
        el("label", {}, el("small", { text: a("dayAct") + " · Español" }), io.act_es), el("label", {}, el("small", { text: a("dayAct") + " · English" }), io.act_en)),
      el("div", { class: "two-col" },
        el("label", {}, el("small", { text: a("dayDesc") + " · Español" }), io.desc_es), el("label", {}, el("small", { text: a("dayDesc") + " · English" }), io.desc_en)));
    const entry = { io, row };
    row.appendChild(button(a("dayRemove"), "link-btn rf-day-remove", () => { row.remove(); dayRows.splice(dayRows.indexOf(entry), 1); }));
    dayRows.push(entry); days.appendChild(row);
  };
  (Array.isArray(x.days) ? x.days : []).forEach(addDay);
  const text = el("textarea", { rows: 3 }); text.value = x.text || "";
  const links = el("textarea", { rows: 2, placeholder: "Itinerario completo | https://…" });
  links.value = (Array.isArray(x.links) ? x.links : []).map(l => (l.label ? l.label + " | " : "") + l.url).join("\n");
  const gal = el("div", { class: "rf-gallery" });
  const pickers = [];
  const addPicker = url => {
    const pk = imagePicker(url || "");
    const row = el("div", { class: "rf-gal-item" }, pk.node);
    pickers.push({ pk, row });
    gal.appendChild(row);
  };
  (Array.isArray(x.gallery) ? x.gallery : []).forEach(addPicker);
  const addBtn = button(a("rfAddPhoto"), "secondary", () => addPicker(""));
  const has = keys => keys.some(k => (x.es && x.es[k]) || (x.en && x.en[k]));
  const used = new Set();
  RICH_BY_KIND[kind].forEach(([, , st]) => (st || []).forEach(k => used.add(k)));
  const groups = RICH_BY_KIND[kind].map(([g, keys, st]) => {
    st = st || [];
    const det = el("details", { class: "rf-group rf-" + g }, el("summary", { text: a("rg_" + g) }));
    if (g === "essentials") {
      const cap = used.has("capacity") ? null : structField("capacity"), by = used.has("rsvp_by") ? null : structField("rsvp_by");
      if (cap || by) det.append(el("div", { class: "two-col" }, cap ? cap : null, by ? by : null));
      det.append(el("label", {}, a("rfLinks"), links, el("small", { class: "small-note", text: a("rfLinksHelp") })),
        el("label", {}, a("fDetails"), text));
      det.open = !!((!used.has("capacity") && (x.capacity || x.rsvp_by)) || (x.links && x.links.length) || x.text);
      return det;
    }
    keys.forEach(k => det.appendChild(pair(k)));
    const flat = st.filter(k => k !== "days");
    if (flat.length) det.appendChild(el("div", { class: "rf-struct" }, ...flat.map(structField)));
    if (st.includes("days")) det.append(el("b", { class: "rf-days-h", text: a("daysTitle") }), days, button(a("dayAdd"), "secondary rf-day-add", () => addDay()));
    det.open = has(keys) || st.some(k => k !== "days" && x[k] !== undefined && x[k] !== "") || (st.includes("days") && dayRows.length > 0)
      || g === "about" || g === "brand" || (kind === "trip" && ["where", "when", "price", "includes", "itinerary"].includes(g)) || (kind === "wellness" && g === "wprice")
      || (isNew && (kind === "trip" || kind === "wellness"));   // a new studio item opens every section
    return det;
  });
  const galGroup = el("details", { class: "rf-group rf-gallery-g" }, el("summary", { text: a(kind === "wellness" ? "rg_flyer" : "rg_gallery") }), el("p", { class: "small-note", text: a("rfGalleryHelp") }), gal, addBtn);
  galGroup.open = pickers.length > 0;
  const node = el("fieldset", { class: "rich-editor" }, el("legend", { text: a("rfTitle") }), el("p", { class: "small-note", text: a("rfHelp") }), ...groups, galGroup);
  const bad = () => ["pay_link", "website"].filter(k => struct[k] && struct[k].value.trim() && !C.safeUrl(struct[k].value.trim()));
  const value = () => {
    const out = { v: 1, es: {}, en: {} };
    Object.entries(inputs).forEach(([k, io]) => { if (io.es.value.trim()) out.es[k] = io.es.value.trim(); if (io.en.value.trim()) out.en[k] = io.en.value.trim(); });
    Object.entries(struct).forEach(([k, inp]) => {
      const v = inp.value.trim();
      if (!v) return;
      if (k === "capacity") { if (Number(v) > 0) out.capacity = Math.round(Number(v)); return; }
      if (k === "spots_left") { if (Number(v) >= 0) out.spots_left = Math.round(Number(v)); return; }
      if ((k === "pay_link" || k === "website") && !C.safeUrl(v)) return;
      out[k] = v.slice(0, 300);
    });
    const D = dayRows.map(({ io }) => {
      const r = {};
      ["day", "date", "time"].forEach(k => { if (io[k].value.trim()) r[k] = io[k].value.trim(); });
      ["es", "en"].forEach(l => { const o = {}; if (io["act_" + l].value.trim()) o.act = io["act_" + l].value.trim(); if (io["desc_" + l].value.trim()) o.desc = io["desc_" + l].value.trim(); if (Object.keys(o).length) r[l] = o; });
      return r;
    }).filter(r => Object.keys(r).length);
    if (D.length) out.days = D;
    const L = links.value.split("\n").map(l => l.trim()).filter(Boolean).map(l => { const i = l.lastIndexOf("|"); return i >= 0 ? { label: l.slice(0, i).trim(), url: l.slice(i + 1).trim() } : { label: "", url: l }; }).filter(l => C.safeUrl(l.url));
    if (L.length) out.links = L;
    const G = pickers.map(p => p.pk.value).filter(u => C.safeUrl(u));
    if (G.length) out.gallery = G;
    if (text.value.trim()) out.text = text.value.trim();
    const rich = Object.keys(out).some(k => !["v", "es", "en", "text"].includes(k)) || Object.keys(out.es).length || Object.keys(out.en).length;
    return rich ? "CML:" + JSON.stringify(out) : (out.text || "");   // plain text stays plain text
  };
  return { node, value, bad };
}

// ---------- the create / edit form ----------
function formView() {
  const { kind, row, prefill, ai } = editing;
  const cfg = KINDS[kind];
  const d = Object.assign({ code: "", title_es: "", title_en: "", desc_es: "", desc_en: "", event_date: "", event_time: "",
    date_text: "", location: "", price: "", url: "", details: "", image_url: "", published: false }, prefill || {}, row || {});
  const form = el("form", { class: "admin-form", novalidate: true });
  const inputs = {};
  const add = (key, node) => { inputs[key] = node; return node; };
  const field = (label, input, help) => el("label", {}, label, input, help ? el("small", { class: "small-note", text: help }) : null);
  const text = (key, value, attrs = {}) => add(key, el("input", Object.assign({ type: "text", value: value || "" }, attrs)));
  const area = (key, value) => { const x = add(key, el("textarea")); x.value = value || ""; return x; };

  if (ai) form.appendChild(el("div", { class: "ai-banner", text: a("aiBanner") }));
  if (cfg.fields.includes("code")) {
    const sel = add("code", el("select", {}, el("option", { value: "", text: a("fNone") }),
      CODES.map(c => el("option", { value: c, text: C.t(C.codeLabels[c]) }))));
    sel.value = d.code || "";
    form.appendChild(field(a("fCode"), sel));
  }
  const oldTag = (row && C.planTag) ? C.planTag(row.id) : {};
  let typeSel = null, matchaBox = null;
  if (kind === "event" || kind === "weekend") {
    typeSel = el("select", {}, el("option", { value: "", text: a("fTypeAuto") }), EVENT_TYPES.map(k => el("option", { value: k, text: a("fType_" + k) })));
    typeSel.value = EVENT_TYPES.includes(oldTag.cat) ? oldTag.cat : "";
    if (kind === "event") form.appendChild(field(a("fType"), typeSel));
    else typeSel = null;
  }
  let labelIn = null, featBox = null;
  if (kind === "wellness") {
    const offered = WCATS.filter(k => !WCATS_LEGACY.includes(k) || oldTag.cat === k);
    typeSel = el("select", {}, el("option", { value: "", text: a("fWcatNone") }), offered.map(k => el("option", { value: k, text: C.t("wcat_" + k) })));
    typeSel.value = WCATS.includes(oldTag.cat) ? oldTag.cat : "";
    labelIn = el("input", { type: "text", maxlength: 40, value: oldTag.label || "", placeholder: "Reiki, sauna, coaching…" });
    const labelField = field(a("fWcatOther"), labelIn);
    const syncOther = () => { labelField.hidden = typeSel.value !== "other"; };
    typeSel.addEventListener("change", syncOther); syncOther();
    form.appendChild(field(a("fWcat"), typeSel));
    form.appendChild(labelField);
  }
  if (kind === "trip") {
    typeSel = el("select", {}, TRIP_TYPES.map(k => el("option", { value: k, text: C.t(TRIP_TYPE_KEY[k]) })));
    typeSel.value = TRIP_TYPES.includes(oldTag.cat) ? oldTag.cat : "trip";
    form.appendChild(field(a("fTripType"), typeSel, a("fTripTypeHelp")));
  }
  let mtypeSel = null, featuredBox = null, cityIn = null;
  if (kind === "matcha") {
    mtypeSel = el("select", {}, MTYPES.map(k => el("option", { value: k, text: a("mtype_" + k) })));
    mtypeSel.value = MTYPES.includes(oldTag.mtype) ? oldTag.mtype : "spot";
    form.appendChild(field(a("fMtype"), mtypeSel));
    featuredBox = el("input", { type: "checkbox" }); featuredBox.checked = !!oldTag.featured;
    form.appendChild(el("label", { class: "check" }, featuredBox, a("fFeatured")));
    cityIn = el("input", { type: "text", maxlength: 40, value: oldTag.city || "", placeholder: "Orlando, Boston…" });
  }
  if (kind === "trip" || kind === "wellness") {
    featBox = el("input", { type: "checkbox" }); featBox.checked = !!oldTag.featured;
    form.appendChild(el("label", { class: "check studio-feature" }, featBox, a(kind === "trip" ? "fFeaturedTrip" : "fFeaturedWell")));
  }
  let fullBox = null;
  if (kind === "event" || kind === "wellness") {
    fullBox = el("input", { type: "checkbox" }); fullBox.checked = !!oldTag.full;
    form.appendChild(el("label", { class: "check" }, fullBox, a("fFull")));
  }
  if (kind === "event" || kind === "weekend" || kind === "wellness") {
    matchaBox = el("input", { type: "checkbox" }); matchaBox.checked = !!oldTag.matcha;
    form.appendChild(el("label", { class: "check" }, matchaBox, a("fMatcha")));
  }
  // Spanish and English side by side, so it's always clear which text matches which
  form.appendChild(el("div", { class: "lang-pairs" },
    el("div", { class: "lang-col" }, el("b", { class: "lang-h", text: "ESPAÑOL" }),
      field(a("fTitleEs"), text("title_es", d.title_es, { maxlength: 140 })), field(a(kind === "trip" || kind === "event" || kind === "wellness" ? "fShortEs" : "fDescEs"), area("desc_es", d.desc_es))),
    el("div", { class: "lang-col" }, el("b", { class: "lang-h", text: "ENGLISH" }),
      field(a("fTitleEn"), text("title_en", d.title_en, { maxlength: 140 })), field(a(kind === "trip" || kind === "event" || kind === "wellness" ? "fShortEn" : "fDescEn"), area("desc_en", d.desc_en)))));
  if (cfg.fields.includes("date")) form.appendChild(field(kind === "weekend" ? a("fDateWeekend") : kind === "trip" ? a("fDateTrip") : a("fDate"), add("event_date", el("input", { type: "date", value: d.event_date || "" })), kind === "weekend" ? null : a("fDateHelp")));
  if (cfg.fields.includes("time")) form.appendChild(field(kind === "trip" ? a("fTimeTrip") : a("fTime"), text("event_time", d.event_time, { maxlength: 60 })));
  if (cfg.fields.includes("date_text")) form.appendChild(field(a("fDateText"), text("date_text", d.date_text, { maxlength: 80 })));
  if (cfg.fields.includes("location")) form.appendChild(field(kind === "trip" ? a("fLocationTrip") : a("fLocationEvent"), text("location", d.location, { maxlength: 200 })));
  if (cfg.fields.includes("price")) form.appendChild(field(kind === "trip" ? a("fPriceTrip") : a("fPriceEvent"), text("price", d.price, { maxlength: 80 })));
  if (cityIn) form.appendChild(field(a("fCity"), cityIn, a("fCityHelp")));
  const urlLabel = kind === "wellness" ? a("fUrlOffer") : kind === "matcha" ? a("fUrlMatcha") : (kind === "trip" || kind === "event") ? a("fUrlBook") : a("fUrl");
  if (cfg.fields.includes("url")) form.appendChild(field(urlLabel, text("url", d.url, { type: "url", inputmode: "url", placeholder: "https://…" })));
  // Rich experience details (events + experiences). Saved inside the existing "details" text, so nothing changes
  // in the database; an item with only plain text keeps plain text exactly as before.
  let richEditor = null;
  if (kind === "event" || kind === "trip" || kind === "wellness") richEditor = richFields(kind, d.details);
  if (richEditor) form.appendChild(richEditor.node);
  else if (cfg.fields.includes("details")) form.appendChild(field(a("fDetails"), area("details", d.details)));
  const picker = cfg.fields.includes("image") ? imagePicker(d.image_url) : null;
  if (picker) form.appendChild(el("fieldset", {}, el("legend", { text: a("fImage") }), picker.node));

  // AI helper: improve descriptions + translate (no web search; text only)
  const polishStatus = el("p", { class: "small-note", role: "status" });
  const polishBtn = button(a("polish"), "secondary", async () => {
    polishBtn.disabled = true; polishStatus.textContent = a("polishing");
    try {
      const out = await invokeAI("polish", {
        code: inputs.code ? inputs.code.value : "", kind,
        title_es: inputs.title_es.value, title_en: inputs.title_en.value,
        desc_es: inputs.desc_es.value, desc_en: inputs.desc_en.value
      });
      ["title_es", "title_en", "desc_es", "desc_en"].forEach(k => { if (typeof out[k] === "string" && out[k].trim()) inputs[k].value = out[k].trim(); });
      if (inputs.code && CODES.includes(out.code) && !inputs.code.value) inputs.code.value = out.code;
      polishStatus.textContent = a("polishDone");
    } catch (e) { polishStatus.textContent = aiErrorText(e); }
    polishBtn.disabled = false;
  });
  form.appendChild(el("div", { class: "admin-bar" }, polishBtn, polishStatus));

  const published = add("published", el("input", { type: "checkbox" }));
  published.checked = !!d.published;
  form.appendChild(el("label", { class: "check" }, published, a("fPublished")));
  let reviewed = null;
  if (ai) {
    reviewed = el("input", { type: "checkbox" });
    form.appendChild(el("label", { class: "check" }, reviewed, a("aiReviewed")));
  }
  const feedback = el("p", { class: "form-feedback", role: "alert", hidden: true });
  form.appendChild(feedback);
  const fail = key => { feedback.hidden = false; feedback.textContent = a(key); };

  const saveBtn = el("button", { type: "submit", class: "primary", text: a("save") });
  const val0 = k => (inputs[k] ? inputs[k].value.trim() : "");
  const buildPayload = () => ({
    kind: cfg.dbKind || kind, code: cfg.fields.includes("code") && val0("code") ? val0("code") : null,
    title_es: val0("title_es"), title_en: val0("title_en"), desc_es: val0("desc_es"), desc_en: val0("desc_en"),
    event_date: cfg.fields.includes("date") && val0("event_date") ? val0("event_date") : null,
    event_time: val0("event_time"), date_text: val0("date_text"), location: val0("location"), price: val0("price"),
    url: val0("url"), details: richEditor ? richEditor.value() : val0("details"), image_url: picker ? picker.value : "", published: published.checked
  });
  const buildTag = () => kind === "matcha"
    ? Object.assign({ matcha: true, mtype: mtypeSel.value, featured: featuredBox.checked, city: cityIn.value.trim() }, oldTag.full ? { full: true } : {})
    : { cat: typeSel ? (kind === "trip" && typeSel.value === "trip" ? "" : typeSel.value) : "", matcha: !!(matchaBox && matchaBox.checked),
        featured: !!(featBox && featBox.checked), full: !!(fullBox && fullBox.checked), label: labelIn && typeSel && typeSel.value === "other" ? labelIn.value.trim() : "" };
  const previewBtn = (kind === "event" || kind === "trip" || kind === "wellness") && C.openPreview
    ? button(a("preview"), "secondary studio-preview", () => {
        feedback.hidden = true;
        if (!val0("title_es") && !val0("title_en")) return fail("previewNeed");
        const tg = buildTag(); if (kind === "trip" && !tg.cat) tg.cat = "trip";
        C.openPreview(buildPayload(), tg);
      }) : null;
  form.appendChild(el("div", { class: "admin-bar" }, saveBtn, previewBtn,
    button(a("cancel"), "secondary", () => { editing = null; render(); })));

  form.addEventListener("submit", async event => {
    event.preventDefault();
    feedback.hidden = true;
    const val = k => (inputs[k] ? inputs[k].value.trim() : "");
    if (!val("title_es") && !val("title_en")) return fail("needTitle");
    const url = val("url"), image = picker ? picker.value : "";
    if ((url && !C.safeUrl(url)) || (image && !C.safeUrl(image)) || (richEditor && richEditor.bad && richEditor.bad().length)) return fail("badUrl");
    if (ai && published.checked && !reviewed.checked) return fail("aiNeedReview");
    const payload = buildPayload();
    saveBtn.disabled = true;
    const res = row ? await C.db.from("plans").update(payload).eq("id", row.id)
                    : await C.db.from("plans").insert(payload).select("id").single();
    if (res.error) { saveBtn.disabled = false; console.error(res.error); return fail("saveFail"); }
    const id = row ? row.id : (res.data && res.data.id);
    const tag = buildTag();
    const same = JSON.stringify(Object.assign({}, oldTag)) === JSON.stringify(Object.fromEntries(Object.entries(tag).filter(([, v]) => v)));
    if (id && !same) {
      try { await saveTag(id, tag); } catch (e) { console.error(e); saveBtn.disabled = false; return fail("saveFail"); }
    }
    saveBtn.disabled = false;
    await C.refreshPublic();
    toast(a("saved"));
    editing = null; render();
  });
  return form;
}

// ---------- community moderation ----------
async function communityView() {
  const { data, error } = await C.db.from("community_posts").select("id,author_name,body,created_at")
    .order("created_at", { ascending: false }).limit(100);
  if (error) throw error;
  const wrap = el("div");
  if (!data.length) wrap.appendChild(el("p", { class: "small-note", text: a("empty") }));
  data.forEach(p => {
    const item = el("div", { class: "admin-item" },
      el("b", { text: p.author_name || "—" }),
      el("p", { class: "saved-text", text: p.body }),
      el("p", { class: "small-note", text: new Date(p.created_at).toLocaleString(C.loc()) }));
    item.appendChild(el("div", { class: "actions" }, button(a("del"), "danger", async () => {
      if (!window.confirm(a("confirmDelete"))) return;
      const r = await C.db.from("community_posts").delete().eq("id", p.id);
      if (r.error) return toast(a("saveFail"));
      await C.refreshPublic(); toast(a("deleted")); render();
    })));
    wrap.appendChild(item);
  });
  return wrap;
}

// ---------- private messages ----------
async function messagesView() {
  const { data, error } = await C.db.from("messages")
    .select("*, profiles(first_name,last_name,email)").order("created_at", { ascending: false }).limit(100);
  if (error) throw error;
  const wrap = el("div");
  if (!data.length) wrap.appendChild(el("p", { class: "small-note", text: a("empty") }));
  data.forEach(m => {
    const who = m.profiles ? (m.profiles.first_name + " " + m.profiles.last_name).trim() + " · " + m.profiles.email : "?";
    const reply = el("textarea"); reply.value = m.admin_reply || "";
    const item = el("div", { class: "admin-item" },
      el("span", { class: "badge", text: m.type }),
      el("p", { class: "small-note", text: a("from") + ": " + who + " · " + new Date(m.created_at).toLocaleString(C.loc()) }),
      el("p", { class: "saved-text", text: m.body }),
      el("label", {}, a("reply"), reply));
    item.appendChild(el("div", { class: "actions" }, button(a("sendReply"), "", async () => {
      const r = await C.db.from("messages").update({ admin_reply: reply.value.trim(), replied_at: new Date().toISOString() }).eq("id", m.id);
      toast(r.error ? a("saveFail") : a("replySaved"));
    })));
    wrap.appendChild(item);
  });
  return wrap;
}

// ---------- members ----------
// ---------- Miembros: requests (with the application answers), members, everyone ----------
let usersFilter = "";
const isRequest = u => u.role === "member" && !u.approved && !u.rejected;
// Welcome message the admin sends from her own WhatsApp after approving (opens a pre-filled chat; she presses send).
const WELCOME = {
  es: (n, url) => "Hola " + n + " 💛🌸 ¡Ya fuiste aprobada en Código Mujer Libre! Bienvenida a la comunidad.\n\nEntra aquí con el correo y la contraseña que creaste al registrarte:\n" + url + "\n\nGuarda este enlace o añádelo a la pantalla de inicio de tu teléfono para entrar rápido. Si tienes cualquier duda, escríbeme por aquí.\n— Código Mujer Libre",
  en: (n, url) => "Hi " + n + " 💛🌸 You've been approved for Código Mujer Libre! Welcome to the community.\n\nLog in here with the email and password you created when you signed up:\n" + url + "\n\nSave this link or add it to your phone's home screen to get in quickly. If you have any questions, message me here.\n— Código Mujer Libre"
};
// WhatsApp needs the country code. A "+" number is used as typed; a 10-digit number is assumed to be US (+1).
function waDigits(phone) {
  const raw = String(phone || "").trim(), d = raw.replace(/\D/g, "");
  if (raw.startsWith("+")) return d;
  return d.length === 10 ? "1" + d : d;
}
function welcomeLink(u) {
  const d = waDigits(u.phone);
  if (u.whatsapp !== true || d.length < 7) return null;
  const lang = u.application && u.application.lang === "en" ? "en" : "es";
  const url = window.location.origin + window.location.pathname;
  const text = WELCOME[lang]((u.first_name || "").trim() || (lang === "en" ? "there" : ""), url);
  return el("a", { class: "primary welcome-wa", href: "https://wa.me/" + d + "?text=" + encodeURIComponent(text), target: "_blank", rel: "noopener noreferrer", text: "💬 " + a("welcomeSend") });
}
function applicationNode(u) {
  const app = u.application && typeof u.application === "object" ? u.application : {};
  const rows = [];
  const row = (label, ...val) => rows.push(el("dt", { text: label }), el("dd", {}, ...val));
  if (u.phone) {
    const digits = String(u.phone).replace(/\D/g, "");
    row(a("appPhone"), el("span", { text: u.phone }),
      u.whatsapp === true && digits.length >= 7 ? el("a", { class: "app-wa", href: "https://wa.me/" + digits, target: "_blank", rel: "noopener noreferrer", text: "💬 " + a("appWa") })
        : u.whatsapp === false ? el("small", { class: "app-nowa", text: a("appNoWa") }) : null);
  }
  if (u.email) row(a("appEmail"), el("a", { href: "mailto:" + u.email, text: u.email }));
  if (u.birth_month && u.birth_day) row(a("appBday"), el("span", { text: new Date(2000, u.birth_month - 1, u.birth_day).toLocaleDateString(C.loc(), { month: "long", day: "numeric" }) }));
  const wants = (u.interests || []).map(c => C.codeLabels[c] ? C.t(C.codeLabels[c]) : c).join(" · ");
  if (wants) row(a("appWants"), el("span", { text: wants }));
  if (app.heard) row(a("appHeard"), el("span", { text: a("heard_" + app.heard) + (app.invited_by ? " — " + a("appInvited") + " " : "") }), app.invited_by ? el("b", { text: app.invited_by }) : null);
  else if (app.invited_by) row(a("appHeard"), el("b", { text: app.invited_by }));
  if (app.guidelines) row(a("appGuide"), el("span", { text: a("appGuideOk")(app.guidelines_at ? new Date(app.guidelines_at).toLocaleDateString(C.loc(), { day: "numeric", month: "short", year: "numeric" }) : "") }));
  const box = el("div", { class: "app-answers" });
  if (rows.length) box.appendChild(el("dl", { class: "app-dl" }, ...rows));
  if (app.smile) box.append(el("p", { class: "app-qh", text: a("appSmile") }), el("blockquote", { class: "app-quote", text: "“" + app.smile + "”" }));
  const hasAnswers = !!(u.phone || app.heard || app.smile || app.guidelines);
  if (!hasAnswers && isRequest(u)) box.appendChild(el("p", { class: "small-note", text: a("appOld") }));
  return { box, hasAnswers };
}
async function usersView() {
  const { data, error } = await C.db.from("profiles").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  const me = C.session().user.id;
  const requests = data.filter(isRequest);
  if (!["requests", "members", "all"].includes(usersFilter)) usersFilter = requests.length ? "requests" : "members";
  const wrap = el("div", { class: "members-admin" });
  const list = el("div");
  const search = el("input", { type: "search", placeholder: a("search"), "aria-label": a("search") });
  const chip = (key, label, n) => {
    const b = el("button", { type: "button", class: "chip member-filter" + (usersFilter === key ? " selected" : ""), "aria-pressed": String(usersFilter === key), "data-filter": key },
      label, n ? el("span", { class: "tab-badge", text: String(n) }) : null);
    b.addEventListener("click", () => { usersFilter = key; wrap.querySelectorAll(".member-filter").forEach(x => { const on = x.dataset.filter === key; x.classList.toggle("selected", on); x.setAttribute("aria-pressed", String(on)); }); paint(); });
    return b;
  };
  wrap.appendChild(el("div", { class: "admin-bar" }, el("b", { text: a("userCount")(data.length) })));
  wrap.appendChild(el("div", { class: "chips member-filters", role: "group" }, chip("requests", a("f_requests"), requests.length), chip("members", a("f_members")), chip("all", a("f_all"))));
  wrap.appendChild(search);
  wrap.appendChild(list);
  const paint = () => {
    const q = search.value.trim().toLowerCase();
    const shown = data.filter(u => usersFilter === "requests" ? isRequest(u) : usersFilter === "members" ? (u.approved || u.role !== "member") : true)
      .filter(u => !q || [u.first_name, u.last_name, u.email, u.company, u.city, u.phone].join(" ").toLowerCase().includes(q));
    if (!shown.length) { list.replaceChildren(el("p", { class: "small-note empty-requests", text: usersFilter === "requests" ? a("noRequests") : a("empty") })); return; }
    list.replaceChildren(...shown.map(u => {
      const name = [u.first_name, u.last_name].filter(Boolean).join(" ").trim() || "—";
      const req = isRequest(u);
      const meta = [u.city, new Date(u.created_at).toLocaleDateString(C.loc(), { day: "numeric", month: "short", year: "numeric" })].filter(Boolean).join(" · ");
      const item = el("div", { class: "admin-item member-card" + (req ? " is-request" : "") },
        el("div", { class: "mc-head" },
          el("span", { class: "mc-av", "aria-hidden": "true", text: (u.first_name || "?").trim().charAt(0).toUpperCase() }),
          el("span", { class: "mc-id" }, el("h3", { text: name }), el("small", { text: meta })),
          el("span", { class: "mc-badges" },
            el("span", { class: "badge" + (u.role !== "member" ? " live" : ""), text: a("role")[u.role] || u.role }),
            u.role === "member" ? el("span", { class: "badge" + (u.approved ? " live" : "") + (req ? " pending" : ""), text: " " + (u.approved ? a("approvedBadge") : (u.rejected ? a("rejectedBadge") : a("pendingBadge"))) }) : null)));
      const { box, hasAnswers } = applicationNode(u);
      if (req) item.appendChild(box);
      else if (hasAnswers) {
        box.hidden = true;
        const tg = button(a("appView"), "link-btn app-toggle", () => { box.hidden = !box.hidden; tg.textContent = box.hidden ? a("appView") : a("appHide"); });
        item.append(tg, box);
      } else {
        if (u.company) item.appendChild(el("p", { class: "small-note", text: a("company") + ": " + u.company }));
        const labels = (u.interests || []).map(c => C.codeLabels[c] ? C.t(C.codeLabels[c]) : c).join(" · ");
        if (labels) item.appendChild(el("p", { class: "small-note", text: a("interests") + ": " + labels }));
        item.appendChild(el("p", { class: "small-note", text: u.email }));
      }
      if (u.role === "member") {
        const setApproval = async ok => {
          const r = ok ? await C.db.rpc("approve_member", { target: u.id, ok: true }) : await C.db.rpc("reject_member", { target: u.id });
          if (r.error) return toast(a("saveFail"));
          toast(a("approvalSaved")); pendingCount();
          const w = ok ? welcomeLink(u) : null;
          if (w) {   // keep her card in view so the welcome can be sent right now
            u.approved = true; u.rejected = false; item.classList.remove("is-request");
            const wait = item.querySelector(".mc-wait"); if (wait) wait.remove();
            const bd = item.querySelector(".mc-badges .badge.pending"); if (bd) { bd.classList.remove("pending"); bd.classList.add("live"); bd.textContent = " " + a("approvedBadge"); }
            acts.replaceChildren(w, button(a("welcomeDone"), "", () => render()));
            return;
          }
          render();
        };
        const acts = el("div", { class: "actions" + (req ? " mc-decide" : "") });
        if (!u.approved) acts.appendChild(button((req ? "✓ " : "") + a("approve"), req ? "primary mc-approve" : "", () => setApproval(true)));
        if (u.approved) acts.appendChild(button(a("unapprove"), "danger", async () => {
          const r = await C.db.rpc("approve_member", { target: u.id, ok: false });
          if (r.error) return toast(a("saveFail"));
          toast(a("approvalSaved")); pendingCount(); render();
        }));
        else if (!u.rejected) acts.appendChild(button(a("reject"), "danger", () => setApproval(false)));
        if (u.approved) { const w = welcomeLink(u); if (w) acts.insertBefore(w, acts.firstChild); }
        item.appendChild(acts);
        if (req) item.appendChild(el("p", { class: "mc-wait", text: a("appWait") }));
      }
      if (u.birth_month && (u.approved || u.role !== "member")) {
        item.appendChild(el("div", { class: "actions" }, button(C.t("bdCelebrate"), "", () => celebrate(u))));
      }
      if (C.isSuper() && u.id !== me && u.role !== "super_admin") {
        const acts = el("div", { class: "actions" });
        if (u.role === "admin") {   // legacy role: can only be removed; new admins are Content Admins
          const makeAdmin = false;
          acts.appendChild(button(makeAdmin ? a("makeAdmin") : a("removeAdmin"), makeAdmin ? "" : "danger", async () => {
            if (makeAdmin && data.some(x => x.role === "admin")) return toast(a("adminTaken"));
            const r = await C.db.from("profiles").update({ role: makeAdmin ? "admin" : "member" }).eq("id", u.id);
            if (r.error) return toast(r.error.code === "23505" ? a("adminTaken") : a("saveFail"));
            toast(a("roleSaved")); render();
          }));
        }
        if (u.role === "member" || u.role === "content_admin") {
          const makeContent = u.role === "member";
          const seatTaken = makeContent && data.some(x => x.role === "admin" || x.role === "content_admin");
          if (seatTaken && u.approved) acts.appendChild(el("small", { class: "ac-note", text: a("adminLimit") }));
          else if (!makeContent || u.approved) acts.appendChild(button(makeContent ? a("makeContentAdmin") : a("removeContentAdmin"), makeContent ? "" : "danger", async () => {
            if (makeContent && data.filter(x => x.role === "admin" || x.role === "content_admin").length >= 1) return toast(a("adminLimit"));
            if (makeContent && !window.confirm(a("confirmContentAdmin"))) return;
            const r = await C.db.from("profiles").update({ role: makeContent ? "content_admin" : "member" }).eq("id", u.id);
            if (r.error) return toast(a("saveFail"));
            toast(a("roleSaved")); render();
          }));
        }
        item.appendChild(acts);
      }
      return item;
    }));
  };
  search.addEventListener("input", paint);
  paint();
  return wrap;
}

// ---------- hero image + message of the day ----------
async function settingsView() {
  const { data, error } = await C.db.from("settings").select("key,value");
  if (error) throw error;
  const cfg = {};
  data.forEach(r => { cfg[r.key] = r.value; });
  const wrap = el("div");

  wrap.appendChild(el("h3", { class: "admin-sec-h", id: "adminStory", text: a("secStory") }));
  wrap.appendChild(imageSetting(cfg, "founder_photo", a("imgFounderTitle"), a("imgFounderHelp")));
  wrap.appendChild(storyEditor(cfg));
  wrap.appendChild(el("h3", { class: "admin-sec-h", text: a("secImages") }));
  wrap.appendChild(imageSetting(cfg, "hero_photo", a("heroTitle"), a("heroHelp")));
  wrap.appendChild(imageSetting(cfg, "travel_image", a("imgTravelTitle"), a("imgTravelHelp")));
  wrap.appendChild(imageSetting(cfg, "matcha_image", a("imgMatchaTitle"), a("imgMatchaHelp")));
  wrap.appendChild(pageImagesSetting(cfg));
  wrap.appendChild(imageSetting(cfg, "brand_logo", a("imgLogoTitle"), a("imgLogoHelp")));
  wrap.appendChild(el("h3", { class: "admin-sec-h", text: a("secTexts") }));
  wrap.appendChild(copyEditor(cfg));

  const q = cfg.daily_quote || {};
  const qEs = el("textarea"); qEs.value = q.es || "";
  const qEn = el("textarea"); qEn.value = q.en || "";
  wrap.appendChild(el("div", { class: "admin-form" },
    el("h3", { text: a("quoteTitle") }),
    el("label", {}, a("quoteEs"), qEs), el("label", {}, a("quoteEn"), qEn),
    el("div", { class: "admin-bar" }, button(a("save"), "primary", async () => {
      const r = await C.db.from("settings").upsert({ key: "daily_quote", value: { es: qEs.value.trim(), en: qEn.value.trim() }, updated_at: new Date().toISOString() }, { onConflict: "key" });
      if (r.error) return toast(a("saveFail"));
      await C.refreshPublic(); toast(a("saved"));
    }))));
  return wrap;
}

// Editorial images kept in the existing settings table (same admin-only write rule as the hero image).
function imageSetting(cfg, key, title, help) {
  const pick = imagePicker((cfg[key] && cfg[key].url) || "");
  return el("div", { class: "admin-form" },
    el("h3", { text: title }), el("p", { class: "small-note", text: help }), pick.node,
    el("div", { class: "admin-bar" },
      button(a("save"), "primary", async () => {
        if (!pick.value || !C.safeUrl(pick.value)) return toast(a("badUrl"));
        const r = await C.db.from("settings").upsert({ key, value: { url: pick.value }, updated_at: new Date().toISOString() }, { onConflict: "key" });
        if (r.error) return toast(a("saveFail"));
        await C.refreshPublic(); toast(a("saved"));
      }),
      button(a("imgDefault"), "secondary", async () => {
        const r = await C.db.from("settings").delete().eq("key", key);
        if (r.error) return toast(a("saveFail"));
        pick.value = ""; await C.refreshPublic(); toast(a("saved"));
      })));
}

// Section entrance photos (optional). Map in settings key "page_images" { page: url }.
const PAGES_WITH_IMAGE = ["events", "wellness", "support", "community", "messages", "travel"];
function pageImagesSetting(cfg) {
  const map = cfg.page_images || {};
  const box = el("div", { class: "admin-form" }, el("h3", { text: a("imgPagesTitle") }), el("p", { class: "small-note", text: a("imgPagesHelp") }));
  PAGES_WITH_IMAGE.forEach(page => {
    const pk = imagePicker(map[page] || "");
    box.appendChild(el("details", { class: "rf-group" }, el("summary", { text: a("page_" + page) + (map[page] ? " ✓" : "") }), pk.node,
      el("div", { class: "admin-bar" },
        button(a("save"), "primary", async () => {
          if (pk.value && !C.safeUrl(pk.value)) return toast(a("badUrl"));
          try { await setMapEntry("page_images", page, pk.value || null); } catch { return toast(a("saveFail")); }
          await C.refreshPublic(); toast(a("saved"));
        }))));
  });
  return box;
}
// Editable texts: a safe, fixed list of content texts, Spanish and English side by side.
function copyEditor(cfg) {
  const copy = cfg.copy || {};
  const rows = (C.COPY_KEYS || []).map(key => {
    const es = el("textarea", { rows: 2, placeholder: C.copyDefault("es", key) || "" }); es.value = (copy[key] && copy[key].es) || "";
    const en = el("textarea", { rows: 2, placeholder: C.copyDefault("en", key) || "" }); en.value = (copy[key] && copy[key].en) || "";
    return { key, es, en, node: el("div", { class: "rf-pair copy-row" }, el("b", { text: a("copy_" + key) }),
      el("div", { class: "two-col" }, el("label", {}, el("small", { text: "Español" }), es), el("label", {}, el("small", { text: "English" }), en))) };
  });
  return el("div", { class: "admin-form" }, el("h3", { text: a("copyTitle") }), el("p", { class: "small-note", text: a("copyHelp") }),
    ...rows.map(r => r.node),
    el("div", { class: "admin-bar" }, button(a("save"), "primary", async () => {
      const value = {};
      rows.forEach(r => { const es = r.es.value.trim(), en = r.en.value.trim(); if (es || en) value[r.key] = { es, en }; });
      const w = Object.keys(value).length
        ? await C.db.from("settings").upsert({ key: "copy", value, updated_at: new Date().toISOString() }, { onConflict: "key" })
        : await C.db.from("settings").delete().eq("key", "copy");
      if (w.error) return toast(a("saveFail"));
      await C.refreshPublic(); toast(a("saved"));
    })));
}

// Nuestra Historia texts: settings key "story" { name|role|who|why|vision|mission: { es, en } } (only this editor writes it)
function storyEditor(cfg) {
  const story = cfg.story || {};
  const def = (window.CMLStory && window.CMLStory.defaults) || { es: {}, en: {} };
  const keys = (window.CMLStory && window.CMLStory.KEYS) || ["name", "role", "who", "why", "vision", "mission"];
  const rows = keys.map(key => {
    const long = !["name", "role"].includes(key);
    const es = el("textarea", { rows: long ? 4 : 1, placeholder: def.es[key] || "", "aria-label": a("sf_" + key) + " (ES)", "data-story": key + "-es" }); es.value = (story[key] && story[key].es) || "";
    const en = el("textarea", { rows: long ? 4 : 1, placeholder: def.en[key] || "", "aria-label": a("sf_" + key) + " (EN)", "data-story": key + "-en" }); en.value = (story[key] && story[key].en) || "";
    return { key, es, en, node: el("div", { class: "rf-pair copy-row" }, el("b", { text: a("sf_" + key) }),
      el("div", { class: "two-col" }, el("label", {}, el("small", { text: "Español" }), es), el("label", {}, el("small", { text: "English" }), en))) };
  });
  return el("div", { class: "admin-form story-editor" }, el("h3", { text: a("storyEdTitle") }), el("p", { class: "small-note", text: a("storyEdHelp") }),
    ...rows.map(r => r.node),
    el("div", { class: "admin-bar" },
      button(a("save"), "primary", async () => {
        const value = {};
        rows.forEach(r => { const es = r.es.value.trim(), en = r.en.value.trim(); if (es || en) value[r.key] = { es, en }; });
        const w = Object.keys(value).length
          ? await C.db.from("settings").upsert({ key: "story", value, updated_at: new Date().toISOString() }, { onConflict: "key" })
          : await C.db.from("settings").delete().eq("key", "story");
        if (w.error) return toast(a("saveFail"));
        await C.refreshPublic(); toast(a("saved"));
      }),
      button(a("storyOpen"), "secondary", () => C.showPage("essence"))));
}

// ---------- AI assistant (calls the secure Edge Function; no secret key in the browser) ----------
async function invokeAI(action, payload) {
  const { data, error } = await C.db.functions.invoke("ai-assist", { body: Object.assign({ action, lang: C.lang() }, payload) });
  if (error) {
    let status = error.context && error.context.status;
    let detail = "";
    try { detail = (await error.context.json()).error || ""; } catch { /* ignore */ }
    const err = new Error(detail || error.message); err.status = status; throw err;
  }
  if (data && data.error) { const err = new Error(data.error); err.status = data.status; throw err; }
  return data;
}
function aiErrorText(e) {
  if (e && (e.status === 404 || e.status === 503 || /not.?configured/i.test(e.message || ""))) return a("aiNotReady");
  if (e && e.status === 429) return a("aiLimit");
  return a("aiFail");
}
function aiView() {
  const wrap = el("div");
  wrap.appendChild(el("p", { text: a("aiIntro") }));
  const query = el("textarea", { placeholder: a("ph"), "aria-label": a("ph") });
  const code = el("select", { "aria-label": a("fCode") }, el("option", { value: "", text: a("aiAnyCode") }),
    CODES.map(c => el("option", { value: c, text: C.t(C.codeLabels[c]) })));
  const results = el("div");
  const examples = el("div", { class: "chips" }, a("aiExamples").map(text => {
    const b = el("button", { type: "button", class: "chip", text });
    b.addEventListener("click", () => { query.value = text; });
    return b;
  }));
  const go = button(a("aiSearch"), "primary", async () => {
    const text = query.value.trim();
    if (!text) return query.focus();
    go.disabled = true;
    results.replaceChildren(el("p", { class: "small-note", role: "status", text: a("aiSearching") }));
    try {
      const out = await invokeAI("discover", { query: text, code: code.value });
      renderResults(results, out);
    } catch (e) {
      console.error(e);
      results.replaceChildren(el("p", { class: "form-feedback", role: "alert", text: aiErrorText(e) }));
    }
    go.disabled = false;
  });
  wrap.append(examples, el("div", { class: "admin-form" }, query, code, el("div", { class: "admin-bar" }, go)), results);
  return wrap;
}
function renderResults(box, out) {
  const list = (out && Array.isArray(out.results)) ? out.results : [];
  box.replaceChildren();
  if (!list.length) return box.appendChild(el("p", { class: "small-note", text: a("aiNone") }));
  list.forEach(r => {
    const kind = r.kind === "trip" ? "trip" : "event";
    const date = /^\d{4}-\d{2}-\d{2}$/.test(r.date || "") ? r.date : "";
    const safe = C.safeUrl(r.url);
    const item = el("div", { class: "admin-item" },
      r.code && C.codeLabels[r.code] ? el("span", { class: "badge", text: C.t(C.codeLabels[r.code]) }) : null,
      el("h3", { text: (C.lang() === "es" ? r.title_es || r.title_en : r.title_en || r.title_es) || "—" }),
      date || r.time ? el("p", { class: "small-note", text: "📅 " + (date ? C.fmtDate(date) : "") + (r.time ? " · " + r.time : "") }) : null,
      r.location ? el("p", { class: "small-note", text: "📍 " + r.location }) : null,
      r.price ? el("p", { class: "small-note", text: "💲 " + r.price }) : null,
      el("p", { class: "saved-text", text: (C.lang() === "es" ? r.desc_es || r.desc_en : r.desc_en || r.desc_es) || "" }),
      safe ? el("p", { class: "small-note" }, a("aiSource") + ": ",
        el("a", { href: safe, target: "_blank", rel: "noopener noreferrer", text: safe.replace(/^https?:\/\//, "").slice(0, 60) }),
        " · ", r.url_verified ? a("aiVerified") : a("aiUnverified")) : null);
    const useAs = k => {
      editing = {
        kind: k, ai: true, row: null,
        prefill: {
          code: CODES.includes(r.code) ? r.code : "", title_es: r.title_es || "", title_en: r.title_en || "",
          desc_es: r.desc_es || "", desc_en: r.desc_en || "", event_date: date, event_time: r.time || "",
          date_text: k === "trip" ? (r.date_text || "") : "", location: r.location || "", price: r.price || "",
          url: safe, image_url: C.safeUrl(r.image_url) || "", published: false
        }
      };
      tab = k === "trip" ? "trips" : k === "weekend" ? "weekend" : "plans";
      render();
    };
    item.appendChild(el("div", { class: "actions" }, button(a("aiUse"), "", () => useAs(kind)), button("✨ " + a("aiToWeekend"), "", () => useAs("weekend"))));
    box.appendChild(item);
  });
  if (out.note) box.appendChild(el("p", { class: "small-note", text: a("aiNote") + ": " + out.note }));
}
})();
