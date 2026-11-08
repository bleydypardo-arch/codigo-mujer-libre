/* Español / English · toda la plataforma es bilingüe. El idioma se guarda y la página se recarga al cambiarlo. */
(function () {
  var KEY = "cml_lang", lang = "es";
  try { lang = localStorage.getItem(KEY) || ""; } catch (e) {}
  if (lang !== "es" && lang !== "en") lang = /^en/i.test(navigator.language || "") ? "en" : "es";
  window.CMLI = { lang: lang, set: function (l) { try { localStorage.setItem(KEY, l); } catch (e) {} location.reload(); } };
  document.documentElement.lang = lang;
  var EN = {
    /* — Sala: barra y navegación — */
    "Sala de reservas y ventas": "Reservations & sales room", "Instalar app": "Install app", "Asesora": "Advisor", "Sonido": "Sound",
    "Reservar mi cupo": "Reserve my spot", "Anterior": "Previous", "Siguiente": "Next", "Siguiente sala": "Next room", "Última sala": "Last room",
    "Mirar a la izquierda": "Look left", "Mirar a la derecha": "Look right", "Recorrido": "Tour", "Salas": "Rooms",
    "Desliza para mirar alrededor · toca los puntos dorados": "Swipe to look around · tap the gold dots",
    "Desliza para mirar alrededor.": "Swipe to look around.",
    "Entrada": "Entrance", "Recepción": "Reception", "Sala de paquetes": "Packages room", "Salón de demos": "Demo lounge", "Oficina de reservas": "Reservations office",
    "← Recepción": "← Reception", "Sala de paquetes →": "Packages room →", "Salón de demos →": "Demo lounge →",
    "Toca la puerta para entrar": "Tap the door to enter", "Toca para entrar": "Tap to enter", "Toca la pantalla para empezar": "Tap the screen to start",
    "Toca la pantalla para ver el demo": "Tap the screen to watch the demo",
    "Toca un paquete para voltear la tarjeta": "Tap a package to flip the card",
    "Toca para ver qué incluye ⟲": "Tap to see what's included ⟲",
    "Toca las esferas para conocer cada pilar · la tableta separa tu cupo": "Tap the spheres to explore each pillar · the tablet reserves your spot",
    "Toca los tableros, los estantes y el escritorio · toca el mar": "Tap the boards, shelves and desk · tap the sea",
    "Comparar los tres": "Compare all three", "Separar mi cupo": "Reserve my spot", "Ver paquete": "View package", "Ver los paquetes": "See the packages",
    "Conoce el hotel": "Discover the hotel", "por dentro": "from the inside", "Ver demo · ES / EN": "Watch demo · ES / EN", "Ver el demo de Código Mujer Libre": "Watch the Código Mujer Libre demo",
    "Bienvenida": "Welcome", "Bienvenida.": "Welcome.",
    /* — Sala: demo y paquetes — */
    "Código ML · Demo": "Código ML · Demo", "Centro comercial": "Shopping center", "Una boutique": "A boutique", "Los paquetes": "The packages",
    "↺ Inicio del demo": "↺ Back to start", "← Volver a la sala": "← Back to the room", "Volver a la sala": "Back to the room", "Cerrar demo": "Close demo",
    "Elige qué quieres ver": "Choose what to watch", "Una boutique por dentro": "A boutique from the inside", "Cómo funcionan los paquetes": "How the packages work",
    "Recorre tres boutiques de ejemplo, como si estuvieras ahí.": "Tour three sample boutiques as if you were there.",
    "Entra a “Luz de Casa” y toca los productos.": "Step into “Luz de Casa” and tap the products.",
    "Gold, Platinum y Diamond en seis pasos.": "Gold, Platinum and Diamond in six steps.",
    "Tu boutique dentro de un hotel de lujo": "Your boutique inside a luxury hotel",
    "Una puerta con tu logo, un local con tu estilo y tus productos a la vista. Tus clientas entran, recorren y compran en tu tienda.": "A door with your logo, a space with your style and your products on display. Your customers walk in, look around and buy in your store.",
    "Tus clientas entran como a una tienda de lujo": "Your customers walk in as if into a luxury store",
    "Cada producto se ve con detalle, con su descripción y su precio. El botón de compra lleva a tu propia tienda: tú cobras y tú entregas.": "Every product is shown in detail, with its description and price. The buy button leads to your own store: you charge and you deliver.",
    "Tres paquetes": "Three packages", "Elige el que va contigo": "Choose the one that suits you", "Tu vitrina de lujo": "Your luxury showcase", "Tu boutique inmersiva": "Your immersive boutique", "Tu marca de alta gama": "Your high-end brand",
    "Experiencias": "Experiences", "Un momento que tus clientas recuerdan": "A moment your customers remember",
    "Una clienta entra a tu boutique de velas, elige la fragancia, el color y escribe su nombre en la etiqueta. Ve su vela “armarse” en pantalla y la compra en tu tienda.": "A customer walks into your candle boutique, picks the fragrance and color, and writes her name on the label. She watches her candle “come together” on screen and buys it in your store.",
    "Así de simple": "It's that simple", "Cómo creamos tu boutique": "How we create your boutique",
    "Separas tu cupo con el 30 %.": "You reserve your spot with 30%.", "Nos envías logo, fotos y productos.": "You send us your logo, photos and products.",
    "Sesión con tu diseñadora.": "Session with your designer.", "Construimos y te mostramos.": "We build it and show you.", "Inducción y a vender.": "Onboarding, and you're ready to sell.",
    "Es tu momento": "This is your moment", "Separa tu cupo hoy": "Reserve your spot today",
    "Precio de feria solo durante la feria. Habla con nuestra representante o toca el botón.": "Fair price only during the fair. Talk to our representative or tap the button.",
    "Pregunta el precio": "Ask for the price", "Precio de feria": "Fair price", "Oferta de feria": "Fair offer", "Normal": "Regular",
    "Qué incluye": "What's included", "Letra pequeña": "Fine print", "Separa tu cupo": "Reserve your spot",
    "Tu boutique en el hotel de Código ML": "Your boutique in the Código ML hotel",
    "Vive la experiencia de tener tu propia boutique": "Live the experience of having your own boutique",
    "Un hotel virtual hecho para mujeres": "A virtual hotel made for women",
    "Código ML reúne bienestar, comunidad, experiencias y boutiques de mujeres emprendedoras en un mismo lugar. Cada marca tiene su propia puerta, su propio local y sus visitas.": "Código ML brings together wellness, community, experiences and boutiques by women entrepreneurs in one place. Every brand has its own door, its own space and its own visitors.",
    "En esta sala puedes conocer los paquetes, ver cómo se siente una boutique y separar tu cupo.": "In this room you can explore the packages, see what a boutique feels like and reserve your spot.",
    "Participa en el sorteo de una de las 5 boutiques inaugurales del hotel virtual de Código ML.": "Enter the draw for one of the 5 inaugural boutiques of the Código ML virtual hotel.",
    "Participar en el sorteo": "Enter the draw", "Quiero más información": "I want more information", "Pregúntalo a tu asesora": "Ask your advisor",
    "Al final del día": "At the end of the day", "Entrada de asesoras": "Advisor entrance", "Código de asesora": "Advisor code", "Escribe tu código": "Enter your code",
    "Entrar a mi sala": "Enter my room", "Cerrar sesión de asesora": "Log out of advisor session", "Sala de asesoras": "Advisor room",
    "Ponla en tu celular como una app": "Put it on your phone as an app",
    "Tu acceso está desactivado. Escríbele a Jazz.": "Your access is deactivated. Message Jazz.",
    "Tu código venció. Pídele a Jazz el nuevo.": "Your code has expired. Ask Jazz for a new one.",
    "Tu código venció. Pídele a Jazz el código nuevo.": "Your code has expired. Ask Jazz for a new one.",
    "Tu acceso está en pausa. Escríbele a Jazz.": "Your access is paused. Message Jazz.",
    "Tu acceso ya no está activo. Escríbele a Jazz.": "Your access is no longer active. Message Jazz.",
    "Sesión de asesora cerrada. Ya no se muestran precios.": "Advisor session closed. Prices are no longer shown.",
    "Sí": "Yes", "No": "No", "País": "Country", "Cerrar": "Close", "Enviar mi solicitud": "Send my request", "Enviar por WhatsApp": "Send via WhatsApp",
    "Abrir WhatsApp": "Open WhatsApp", "Abrir mi correo": "Open my email",
    "Nombre de tu emprendimiento": "Your business name", "¿Qué vendes?": "What do you sell?", "¿Tienes logo?": "Do you have a logo?", "¿Ya tienes ventas?": "Do you already have sales?",
    "¿Cuánto tiempo llevas?": "How long have you been at it?", "¿Qué colores usa tu marca?": "What colors does your brand use?", "¿Qué estilo tiene tu marca?": "What is your brand's style?",
    "¿Cuántos productos tiene tu línea?": "How many products are in your line?", "¿Dónde vendes tus productos en línea?": "Where do you sell your products online?",
    "Menos de 6 meses": "Less than 6 months", "6 a 12 meses": "6 to 12 months", "1 a 3 años": "1 to 3 years", "Más de 3 años": "More than 3 years",
    "Sí, con frecuencia": "Yes, often", "A veces": "Sometimes", "Aún no": "Not yet", "Aún no vendo en línea": "I don't sell online yet", "Aún no sé, quiero asesoría": "Not sure yet, I'd like guidance",
    "Elegante y de lujo": "Elegant and luxurious", "Natural y orgánico": "Natural and organic", "Romántico y femenino": "Romantic and feminine",
    "Mi propia tienda en línea (Shopify, WooCommerce u otra)": "My own online store (Shopify, WooCommerce or other)", "Una página o landing page": "A web page or landing page",
    "Link de tu tienda o página (el más importante)": "Link to your store or page (the most important)",
    "Lo necesitamos para que el botón de compra de tu boutique lleve a tu tienda.": "We need it so your boutique's buy button leads to your store.",
    "Acepto que Código ML me contacte sobre el sorteo y que mis datos de contacto se usen solo para eso.": "I agree that Código ML may contact me about the draw and that my contact details are used only for that.",
    "Formulario en blanco para imprimir": "Blank printable form", "Todavía no hay participantes.": "There are no participants yet.", "Todavía no hay registros.": "There are no records yet.",
    "Participar no garantiza ventas ni una cantidad de dinero: Código ML no asegura resultados económicos a las tiendas. Las condiciones completas del sorteo se entregan por escrito.": "Entering does not guarantee sales or any amount of money: Código ML does not promise financial results to stores. The full draw conditions are provided in writing.",
    "Tus ventas son tuyas: el botón de compra lleva a tu propia tienda, donde cobras tú. Código ML no cobra comisión por tus ventas.": "Your sales are yours: the buy button leads to your own store, where you collect payment. Código ML takes no commission on your sales.",
    "Solo durante la feria. El precio normal rige desde el 1 de enero de 2027.": "Only during the fair. The regular price applies from January 1, 2027.",
    "La boutique se entrega cuando el pago está completo.": "The boutique is delivered once payment is complete.",
    "La mensualidad empieza cuando la dueña recibe su boutique.": "The monthly fee starts when the owner receives her boutique.",
    "Salas de tu boutique": "Your boutique's rooms", "Puerta con tu logo y nombre": "Door with your logo and name",
    "Tu boutique diseñada para tu marca, con 15 productos con foto, precio y descripción.": "Your boutique designed for your brand, with 15 products with photo, price and description.",
    "Una pequeña experiencia virtual dentro de tu tienda.": "A small virtual experience inside your store.",
    "Inducción para manejar tu tienda": "Onboarding to manage your store", "Te enseñamos a manejar tu boutique.": "We teach you how to run your boutique.",
    "Informe mensual de visitas y clics": "Monthly report of visits and clicks",
    "1 hora de asesoría guiada con la diseñadora de tu tienda, para crear todo tu diseño.": "1 hour of guided advice with your store's designer to create your whole design.",
    "1 hora de asesoría para atraer público y hacer crecer tu tienda.": "1 hour of advice to attract an audience and grow your store.",
    "6 meses de alojamiento en el hotel virtual sin mensualidad.": "6 months of hosting in the virtual hotel with no monthly fee.",
    "Horas de diseño y producción de tu boutique": "Design and production hours for your boutique",
    "Charla de capacitación": "Training talk", "Asesoría": "Advice",
    "Cómo llevar a tus seguidoras a tu boutique desde Instagram, TikTok y WhatsApp.": "How to bring your followers to your boutique from Instagram, TikTok and WhatsApp.",
    "Cómo presentar tus productos para que se vean de alta gama.": "How to present your products so they look high-end.",
    "Cómo aprovechar las campañas del centro comercial, como Día de la Madre o Black Friday.": "How to make the most of the shopping center campaigns, like Mother's Day or Black Friday.",
    "Una charla práctica para emprendedoras que quieren que su marca se vea de lujo y llegue a más mujeres.": "A practical talk for entrepreneurs who want their brand to look luxurious and reach more women.",
    "Mi oficina": "My office", "Esta oficina es solo para asesoras.": "This office is for advisors only.",
    "Aquí tienes tus metas, tu plan semanal, tu lista de mujeres y tu biblioteca. Toca los tableros de la pared y los libros del estante.": "Here are your goals, weekly plan, list of women and library. Tap the boards on the wall and the books on the shelf.",
    "Mis herramientas": "My tools", "Mi agenda": "My agenda",
    /* — App de asesoras — */
    "Código Mujer Libre": "Código Mujer Libre", "Asesoras": "Advisors", "Toca la flor": "Tap the flower", "Escribe tu código de asesora": "Enter your advisor code",
    "📲 Instalar app": "📲 Install app", "Instalar": "Install", "Inicio": "Home", "Agenda": "Agenda", "Dinero": "Money", "Sala": "Room",
    "Entrar a la sala": "Enter the room", "Entrar a mi oficina": "Enter my office", "Entrada de clientes": "Client entrance", "Bienvenida al área comercial": "Welcome to the Commercial Area",
    "Administración": "Administration", "⚙️ Administración": "⚙️ Administration", "💱 Dólar y monedas": "💱 Dollar & currencies", "Mi cuenta": "My account", "Instalar en mi celular": "Install on my phone",
    "Documentos importantes": "Important documents", "Documentos": "Documents", "Cartas, propuestas e informes · envío a Jazz": "Letters, proposals and reports · send to Jazz",
    "Crea cartas, propuestas e informes y envíalos a Jazz con un toque.": "Create letters, proposals and reports and send them to Jazz with one tap.",
    "Crear un documento": "Create a document", "Aquí aparecerán los documentos que crees.": "The documents you create will appear here.",
    "Cartas, propuestas e informes": "Letters, proposals and reports",
    "Mi agenda": "My agenda", "Agenda de eventos": "Events agenda", "Eventos en vivo de tiendas": "Live store events", "Eventos y marketing por mes": "Events and marketing by month",
    "Centro de control": "Control center", "Frase del día": "Quote of the day", "Mi frase de hoy": "My quote for today", "Tu frase de hoy": "Your quote for today",
    "Speeches": "Speeches", "Objeciones": "Objections", "Empresas": "Companies", "Entrenamiento": "Training", "Marketing por mes": "Marketing by month", "En vivo tiendas": "Live stores",
    "Proveedores": "Suppliers", "Premios": "Prizes", "Presupuesto": "Budget", "Ventas y comisión": "Sales & commission", "Ventas y comisiones": "Sales & commissions", "Mi oficina": "My office", "Incentivos": "Incentives",
    "Metas de hoy": "Today's goals", "Plan semanal": "Weekly plan", "Mi saldo": "My balance", "Mis horas": "My hours", "Mis mujeres": "My women", "Reporte para Jazz": "Report for Jazz",
    "Reglas y archivos": "Rules & files", "Liderazgo": "Leadership", "Expansión de negocio": "Business growth", "Finanzas y operación": "Finance & operations", "Gestión personal": "Personal management",
    "Proveedores y alianzas": "Suppliers & partners", "Nuevo proveedor o aliado": "New supplier or partner", "Nueva empresa": "New company", "Área comercial · Empresas": "Commercial area · Companies",
    "Lugares, catering, fotógrafas, spas, marcas aliadas.": "Venues, catering, photographers, spas, partner brands.",
    "Bienestar corporativo. Va aparte de las boutiques: otro público, otro ritmo.": "Corporate wellness. Separate from the boutiques: a different audience, a different pace.",
    "Lugar": "Venue", "Catering": "Catering", "Fotografía y video": "Photo & video", "Decoración": "Decor", "Spa o bienestar": "Spa or wellness", "Marca aliada": "Partner brand", "Publicidad": "Advertising", "Otro": "Other",
    "Por contactar": "To contact", "Cotizando": "Quoting", "Aliado": "Partner", "Descartado": "Discarded",
    "Nombre": "Name", "Tipo": "Type", "Persona y teléfono": "Contact person and phone", "Qué ofrece": "What they offer", "Precio o cotización": "Price or quote", "Estado": "Status", "Notas": "Notes",
    "Teléfono": "Phone", "Reunión": "Meeting", "Reunión o café": "Meeting or coffee", "Cotización": "Quote",
    "Agregar": "Add", "Guardar": "Save", "Cancelar": "Cancel", "Editar": "Edit", "Borrar": "Delete", "Quitar": "Remove", "Buscar": "Search", "Copiar": "Copy", "Listo": "Done", "Cerrar sesión": "Log out",
    "Sí, borrar": "Yes, delete", "¿Borrar este registro?": "Delete this record?", "¿Borrar este documento?": "Delete this document?",
    "Sí, bloquear": "Yes, block", "Sí, activar": "Yes, activate", "Bloquear": "Block", "Activar": "Activate", "Ver código": "Show code", "Renovar 30 días": "Renew 30 days", "Renovar": "Renew",
    "Nueva persona": "New person", "Personas, códigos, vencimientos y bloqueos.": "People, codes, expirations and blocks.",
    "País (para precios)": "Country (for prices)", "Rol": "Role", "Asesora": "Advisor", "Líder de ciudad": "City leader", "Administradora": "Administrator", "administradora": "administrator", "líder": "leader", "asesora": "advisor",
    "Código (6 números)": "Code (6 digits)", "Sirve desde": "Valid from", "Sirve hasta (vacío = sin vencimiento)": "Valid until (empty = no expiry)", "Ciudad": "City", "Generar": "Generate",
    "España": "Spain", "República Dominicana": "Dominican Republic", "Colombia": "Colombia", "Estados Unidos": "United States",
    "Bogotá, Santo Domingo…": "Bogotá, Santo Domingo…", "Buscar un speech…": "Search a speech…",
    "Ver todo como país": "View everything as country", "Cambia los precios y la moneda que ves en la app y en la Sala. Tu código entra a todos los países.": "Change the prices and currency you see in the app and the Room. Your code works in every country.",
    "Convertidor de moneda": "Currency converter", "Cuánto vale el dólar hoy en pesos. Se actualiza solo cuando hay internet.": "How much a dollar is worth today in pesos. Updates automatically when online.",
    "Dólar (US$)": "Dollar (US$)", "Tabla rápida · desde dólares": "Quick table · from dollars",
    "Guarda todos tus datos en un archivo": "Save all your data in a file", "Carga el archivo que descargaste": "Load the file you downloaded",
    "Tus datos viven solo en este teléfono. Descarga un respaldo de vez en cuando, sobre todo si cambias de celular.": "Your data lives only on this phone. Download a backup from time to time, especially if you change phones.",
    "Ese respaldo es de otro código.": "That backup belongs to another code.",
    "Ponla en tu celular": "Put it on your phone", "Queda como una app con su icono": "It becomes an app with its own icon",
    "Instalar en el computador": "Install on the computer", "Instalar página como aplicación": "Install page as app", "Agregar a pantalla de inicio": "Add to Home Screen",
    "Si ves “Instalar” arriba, también puedes tocarlo.": "If you see “Install” at the top, you can tap it too.",
    "Ese código no existe. Revísalo o pídele el tuyo a Jazz.": "That code doesn't exist. Check it or ask Jazz for yours.",
    "Ese código ya lo tiene otra persona. Usa otro.": "Someone else already has that code. Use another.",
    "El código debe tener 6 números.": "The code must have 6 digits.", "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.": "Too many attempts. Wait a few minutes and try again.",
    "No hay internet. Conéctate para entrar.": "No internet. Connect to sign in.", "Por seguridad, vuelve a entrar con tu código.": "For security, sign in again with your code.",
    "Para volver a entrar necesitas tu código": "You need your code to sign in again",
    "No se pudo guardar. Revisa tu internet.": "Could not save. Check your internet.", "No se pudo. Revisa tu internet.": "Could not do it. Check your internet.",
    "No pude guardar en este teléfono. Revisa el espacio o el modo privado.": "Could not save on this phone. Check storage or private mode.",
    "No pude cargar la lista. Revisa tu internet e inténtalo otra vez.": "Could not load the list. Check your internet and try again.",
    "Esta sección es solo para Jazz.": "This section is for Jazz only.", "Solo para la fundadora.": "For the founder only.",
    "Copiado. Pégalo en WhatsApp.": "Copied. Paste it into WhatsApp.", "Mantén pulsado el texto para copiarlo.": "Press and hold the text to copy it.",
    "Si el correo no abre, usa “Copiar” y pégalo en tu email.": "If the email doesn't open, use “Copy” and paste it into your email.",
    "Cálculo estimado según las reglas vigentes. El valor oficial lo confirma Código ML.": "Estimate based on current rules. The official amount is confirmed by Código ML.",
    "Los premios y concursos aplican solo en Colombia. Para otros países, no los menciones.": "Prizes and contests apply only in Colombia. For other countries, do not mention them.",
    "Se arma solo con lo que anotaste este mes.": "It builds itself from what you recorded this month.", "Todo tu trabajo en una sola mirada.": "All your work at a glance.",
    "Anota cuándo trabajas. Tú decides tus horarios.": "Record when you work. You decide your own hours.", "Mis horas de trabajo": "My work hours",
    "Escribe tus citas, llamadas y pendientes. Cada una con su emoji.": "Write your appointments, calls and to-dos. Each with its own emoji.",
    "Cada evento con lugar, tareas, responsables, invitadas, proveedores y resultados.": "Each event with venue, tasks, owners, guests, suppliers and results.",
    "Coordina cada transmisión con la boutique y anota los resultados.": "Coordinate each broadcast with the boutique and record the results.",
    "No tienes nada anotado para hoy.": "You have nothing scheduled for today.", "Nada anotado para este día. Toca “Agregar”.": "Nothing scheduled for this day. Tap “Add”.",
    "No hay speeches con esa búsqueda.": "No speeches match that search.", "Lo que viene": "Coming up", "Próximo evento": "Next event", "próximos": "upcoming", "por hacer": "to do", "por pagar": "to pay", "Pendiente de pago": "Payment pending",
    "comisión estimada": "estimated commission", "Ventas reportadas por la tienda": "Sales reported by the store",
    "15 % del valor de la boutique": "15% of the boutique's value", "10 % de cada mensualidad, durante 12 meses": "10% of each monthly fee, for 12 months", "US$5 fijos por cada negocio inscrito": "US$5 flat for each business enrolled",
    "Reglas de oro": "Golden rules", "Reglas de oro de todo speech": "Golden rules for every speech", "Antes de enviar": "Before sending", "Cambia lo que está entre [corchetes] antes de enviar.": "Change what's in [brackets] before sending.",
    "Texto (puedes cambiarlo con tu estilo)": "Text (you can adapt it to your style)", "Texto de invitación": "Invitation text",
    "Qué falta para que sea real": "What's missing to make it real", "Qué salió bien y qué mejorar": "What went well and what to improve",
    "Los códigos viven en la base de datos, no en los archivos de la app. Al bloquear a alguien, deja de entrar en todos sus dispositivos.": "Codes live in the database, not in the app files. When you block someone, they can no longer sign in on any device.",
    "Personas con acceso": "People with access",
    "Venta consultiva": "Consultative selling", "Todos": "All", "Mujeres": "Women", "Seguimiento": "Follow-up", "Hoy no tienes pendientes anotados.": "You have nothing scheduled today.", "Hoy no tienes pendientes": "You have nothing scheduled today", "Hola": "Hello", "Eventos": "Events", "Bienvenida al Área Comercial": "Welcome to the Commercial Area", "Mi cuenta": "My account", "Toca la flor para abrirla": "Tap the flower to open it"
  };
  var X = window.CMLI_EXTRA || {}; for (var k in X) if (EN[k] == null) EN[k] = X[k];
  window.CMLI.en = EN;
  function bind() { var bs = document.querySelectorAll("[data-lang]"); for (var i = 0; i < bs.length; i++) { (function (b) { b.textContent = lang === "es" ? "EN" : "ES"; b.setAttribute("aria-label", lang === "es" ? "Switch to English" : "Cambiar a español"); b.setAttribute("title", lang === "es" ? "English" : "Español"); b.onclick = function (e) { e.stopPropagation(); window.CMLI.set(lang === "es" ? "en" : "es"); }; })(bs[i]); } }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind); else bind();
  if (lang !== "en") { window.CMLI.t = function (s) { return s; }; return; }
  var keys = Object.keys(EN).filter(function (k) { return k.length >= 8; }).sort(function (a, b) { return b.length - a.length; });
  function tr(s) {
    if (!s || !/[A-Za-zÁ-ú]/.test(s)) return s;
    var t = s.trim(); if (EN[t] != null) return s.replace(t, EN[t]);
    var out = s;
    for (var i = 0; i < keys.length; i++) { if (out.indexOf(keys[i]) > -1) out = out.split(keys[i]).join(EN[keys[i]]); }
    return out;
  }
  window.CMLI.t = tr;
  var ATTR = ["aria-label", "title", "placeholder", "alt"];
  function walk(n) {
    if (n.nodeType === 3) { var v = tr(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; return; }
    if (n.nodeType !== 1 || /^(SCRIPT|STYLE)$/.test(n.nodeName)) return;
    for (var a = 0; a < ATTR.length; a++) { var av = n.getAttribute(ATTR[a]); if (av) { var nv = tr(av); if (nv !== av) n.setAttribute(ATTR[a], nv); } }
    for (var c = n.firstChild; c; c = c.nextSibling) walk(c);
  }
  var busy = false;
  function run(nodes) { if (busy) return; busy = true; try { nodes.forEach(walk); } catch (e) {} busy = false; }
  function start() {
    run([document.body]);
    new MutationObserver(function (ms) { var ns = []; ms.forEach(function (m) { if (m.type === "characterData") ns.push(m.target); else m.addedNodes.forEach(function (x) { ns.push(x); }); }); run(ns); })
      .observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})();
