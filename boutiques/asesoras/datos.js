/* Código ML Asesoras · contenido: speeches, objeciones, plan mensual. Edita aquí los textos. */
window.CMLD = (function () {
  const C = window.CMLV;
  const pct = Math.round(C.pago.separa * 100);
  const OBJ = [
    ["“Es caro” o “ahora no tengo”", "Se separa con el " + pct + " % y el resto se paga en " + C.pago.cuotas + " pagos antes del " + C.pago.limite + ". La mensualidad empieza cuando recibe su boutique. Si el presupuesto está justo, empieza por el Gold: después puede subir."],
    ["“¿Código ML me cobra comisión por mis ventas?”", "No. El botón de compra lleva a su propia tienda: ella cobra y ella entrega. Código ML no procesa pagos de productos."],
    ["“¿Y si no vendo?”", "No prometemos ventas. Le damos una vitrina de lujo, su puerta con su logo, visitas de una comunidad de mujeres y herramientas para compartir su boutique. Cuánto vende depende de su marca y de cómo la comparta."],
    ["“¿Cuándo recibo mi boutique?”", "Durante " + C.entrega + ", en el orden en que se separaron los cupos. Antes tiene una sesión con su diseñadora para elegir estilo, colores y música."],
    ["“¿Puedo cambiar mis productos?”", "Sí: en la inducción le enseñamos a manejar su tienda. El panel de administración se está terminando, así que no prometas fechas ni funciones exactas."],
    ["“¿Y si me arrepiento?”", "La política de reembolso de la reserva se entrega por escrito al separar el cupo. No la improvises: léela con ella."],
    ["“No tengo mis productos listos”", "No hace falta hoy. Hay tiempo hasta enero: le damos una guía sencilla para preparar logo, fotos y lista de productos con precios."],
    ["“¿Qué es una sala conectada?”", "Una boutique puede tener varias salas, como habitaciones de una tienda de lujo, unidas por puertas o flechas. Gold tiene 1, Platinum 3 y Diamond 5."]
  ];
  const PLAN = [["0:00", "Puerta", "Bienvenida. Pídele que toque la puerta dorada."], ["1:00", "Recepción", "Presenta el hotel. Muestra la boutique inaugural y el sorteo."], ["3:00", "Sala de paquetes", "Voltea cada tarjeta. Explica lo que incluye cada paquete."], ["6:00", "Salón de demos", "Pon el demo en la pantalla: el centro comercial o una boutique por dentro."], ["8:00", "Oficina de reservas", "Las seis esferas, la letra pequeña y la tableta para separar."], ["10:00", "Cierre", "Pregunta si quiere separar hoy. Anota su código de asesora."]];

  /* Reglas de oro para todo speech */
  const REGLAS = ["Nunca prometas ingresos ni ventas.", "La clienta le paga a Código ML, nunca a tu cuenta personal.", "No se paga comisión por traer otras asesoras: solo por ventas reales.", "Pide permiso antes de escribirle a alguien y respeta un “no”.", "No compartas datos de una mujer con nadie sin su permiso."];

  /* cat: Boutiques · Mujeres · Eventos · Empresas · Seguimiento */
  const SPEECH = [
    { id: "s0", cat: "Mujeres", t: "⭐ SPEECH OFICIAL · Descubre un mundo de beneficios creado para ti", cuando: "El speech principal de Código Mujer Libre. Úsalo en llamada, nota de voz o presentación.",
      txt: `¡Hola! Bienvenida a Código Mujer Libre.\nQuiero contarte algo que puede abrirte las puertas a muchísimas experiencias y oportunidades.\n¿Te imaginas pertenecer a un club donde puedas conectar con otras mujeres, disfrutar experiencias especiales, descubrir lugares increíbles, acceder a beneficios exclusivos y encontrar nuevas oportunidades para crecer?\nEso es Código Mujer Libre.\nSomos un club internacional para mujeres que quieren disfrutar más de la vida, conectar, emprender, descubrir nuevas experiencias y formar parte de una comunidad que sigue creciendo.\n\n¿Y qué beneficios puedes tener al formar parte de nuestro club?\n\n🌸 1. Tu tarjeta de miembro.\nRecibirás tu propia credencial de Código Mujer Libre, que te identificará como integrante de nuestra comunidad y te permitirá acceder a los beneficios correspondientes a tu membresía.\n\n💎 2. Descuentos y beneficios exclusivos.\nEstamos desarrollando una red de boutiques, tiendas, restaurantes, centros de bienestar y negocios aliados donde nuestras integrantes podrán disfrutar de promociones y descuentos especiales a medida que se incorporen los establecimientos participantes.\n\n🥂 3. Invitaciones a eventos y experiencias.\nPodrás recibir invitaciones a encuentros de mujeres, eventos especiales, actividades de networking, experiencias de bienestar y oportunidades para conocer nuevas amigas y emprendedoras.\n\n✈️ 4. Viajes y experiencias para disfrutar.\nDentro de nuestro ecosistema podrás descubrir viajes, retiros, excursiones y experiencias seleccionadas para mujeres que quieren vivir momentos diferentes y memorables.\n\n🛍️ 5. Boutiques y compras.\nTendrás acceso a nuestro ecosistema de boutiques virtuales, donde podrás descubrir marcas, productos y emprendimientos, así como las promociones disponibles para nuestras integrantes.\n\n🚀 6. Oportunidades para emprender.\nSi eres emprendedora, Código Mujer Libre también quiere abrirte puertas.\nPodrás conocer oportunidades para promocionar tu negocio, participar en experiencias comerciales y explorar la posibilidad de tener tu propia boutique virtual dentro del ecosistema, según las condiciones disponibles.\n\n🌷 7. Una comunidad que crece contigo.\nPorque no se trata solamente de comprar o de asistir a eventos.\nSe trata de pertenecer a una comunidad internacional donde puedas conectar con otras mujeres, compartir oportunidades y descubrir nuevas experiencias.\n\n¡Y ahora viene algo muy especial!\nEstamos formando nuestros grupos de las primeras 50 mujeres fundadoras por ciudad.\nSi formas parte de este primer grupo, tendrás la oportunidad de ingresar como Miembro Fundadora, recibir tu identificación de miembro y participar desde el comienzo en el crecimiento de nuestra comunidad.\nAdemás, podrás conocer de primera mano las nuevas experiencias, alianzas, promociones y beneficios que vayamos incorporando.\nImagínate ser parte de algo desde sus primeros pasos y verlo crecer hasta convertirse en una comunidad internacional de miles de mujeres.\n\nY lo más importante: Código Mujer Libre no es solamente un club de beneficios. Es una invitación a vivir, conectar, descubrir oportunidades y crecer.\n\nAsí que quiero hacerte una pregunta:\n¿Te gustaría formar parte de las primeras 50 mujeres fundadoras de Código Mujer Libre en tu ciudad?\n\n🌸 CÓDIGO MUJER LIBRE\nTu vida cambia cuando descubres tu propósito.\nConecta. Vive. Crece.` },
    { id: "s1", cat: "Mujeres", t: "Invitar a una mujer a Código Mujer Libre", cuando: "Primer mensaje a una amiga, conocida o clienta.",
      txt: "Hola [nombre] 🌸 Te escribo porque pensé en ti. Estoy con Código Mujer Libre, un espacio digital hecho solo para mujeres: una comunidad, un hotel virtual con boutiques de emprendedoras, eventos, beneficios y un lugar para cuidarnos. Estamos abriendo con las primeras 50 fundadoras y quiero que tú estés. ¿Te cuento en 2 minutos cómo funciona? Sin compromiso 💛" },
    { id: "s2", cat: "Mujeres", t: "Inscribirla paso a paso", cuando: "Cuando dijo que sí y está contigo en el chat.",
      txt: "Perfecto [nombre], vamos juntas, te toma 3 minutos 💛\n1) Abre este enlace: [enlace de inscripción].\n2) Escribe tu nombre, correo y ciudad.\n3) En “Código de asesora” escribe el mío: [tu código]. Así quedas conmigo para que te acompañe.\n4) Acepta el pacto de respeto de la comunidad.\n5) Entra al chat y saluda: ahí te esperan.\nCuando termines me avisas y te muestro tu primera sorpresa. ¿Empezamos?" },
    { id: "s3", cat: "Mujeres", t: "Primera bienvenida después de inscribirse", cuando: "El mismo día que se inscribe.",
      txt: "Bienvenida, [nombre] 🌷 Ya eres parte de Código Mujer Libre. Hoy te sugiero tres cosas pequeñas: 1) saluda en el chat de mujeres, 2) abre tu caja secreta del día, 3) mira qué evento viene en tu ciudad. Yo soy [tu nombre], tu asesora: escríbeme cuando quieras. Aquí no estás sola." },
    { id: "s4", cat: "Mujeres", t: "“No tengo tiempo”", cuando: "Respuesta si dice que está muy ocupada.",
      txt: "Te entiendo, [nombre]: justo por eso existe. Son 5 minutos al día y están pensados para ti: una frase, una misión pequeña y un respiro. No tienes que hacer nada más. Si quieres, te inscribo yo ahora y lo ves hoy cuando tengas un momento. ¿Va?" },
    { id: "s5", cat: "Seguimiento", t: "Seguimiento a quien dijo “lo voy a pensar”", cuando: "2 o 3 días después, una sola vez.",
      txt: "Hola [nombre] 🌸 ¿Cómo vas? Te escribo solo para saber si te quedó alguna duda sobre Código Mujer Libre. Si prefieres que no te escriba más, dímelo con confianza. Y si quieres seguir, aquí estoy para ayudarte con lo que necesites 💛" },
    { id: "s6", cat: "Seguimiento", t: "Reactivar a una mujer que dejó de entrar", cuando: "Si lleva más de 7 días sin conectarse.",
      txt: "Hola [nombre] 💛 Te extrañamos en el chat. Hoy hay una sorpresa esperándote en tu caja secreta y se viene [evento/actividad]. Entra cuando quieras, aunque sean 2 minutos. Aquí tienes tu lugar siempre." },
    { id: "s7", cat: "Boutiques", t: "Presentar la boutique virtual a una emprendedora", cuando: "Primer contacto con una dueña de marca.",
      txt: "Hola [nombre], vi tu marca [marca] y es preciosa ✨ Te cuento: en Código Mujer Libre estamos construyendo un hotel virtual de lujo donde cada emprendedora tiene su propia boutique: una vitrina inmersiva con su logo, su puerta, sus productos y su música, visitada por una comunidad de mujeres. Tú sigues vendiendo en tu tienda: el botón de compra va directo a ti. ¿Te muestro cómo se ve por dentro? Te mando un demo de 2 minutos." },
    { id: "s8", cat: "Boutiques", t: "Explicar Gold, Platinum y Diamond", cuando: "Cuando pide ver opciones.",
      txt: "Hay tres boutiques, [nombre]:\n• GOLD: tu vitrina de lujo. 1 sala, 15 productos, tu puerta con logo y música de ambiente.\n• PLATINUM: tu boutique inmersiva. 3 salas conectadas, 30 productos y una experiencia virtual para tus clientas.\n• DIAMOND: tu marca de alta gama. 5 salas, 60 productos, 2 experiencias a tu medida y un evento en vivo cada mes.\nSi estás empezando, el Gold es perfecto y luego puedes subir. ¿Qué tamaño de marca tienes hoy?" },
    { id: "s9", cat: "Boutiques", t: "Responder “es caro”", cuando: "Objeción de precio.",
      txt: "Te entiendo, [nombre]. Por eso se separa con el " + pct + " % y el resto se paga en " + C.pago.cuotas + " pagos antes del " + C.pago.limite + "; la mensualidad empieza cuando recibes tu boutique. Y si hoy el presupuesto está justo, empezamos por el Gold y subes después. ¿Cuál sería un monto cómodo para separar tu cupo?" },
    { id: "s10", cat: "Boutiques", t: "Cerrar y separar el cupo", cuando: "Cuando ya vio el demo y está interesada.",
      txt: "Qué alegría, [nombre] 🌟 Para separar tu cupo hacemos esto: eliges tu boutique, pagas el " + pct + " % de reserva por el enlace oficial de Código ML y quedas en la lista de entrega de " + C.entrega + ". Recibes la política por escrito y yo te acompaño en cada paso. ¿Cuál eliges, Gold, Platinum o Diamond?" },
    { id: "s11", cat: "Boutiques", t: "Llevar a una tienda a participar en eventos en vivo", cuando: "Con boutiques ya inscritas o por inscribir.",
      txt: "[nombre], además de tu boutique tienes algo que la mayoría no tiene: eventos en vivo. Tú escoges un producto estrella, lo presentas en vivo para la comunidad y nosotras lo promocionamos. Es una tarde con mujeres que quieren conocer tu marca. ¿Qué producto te gustaría mostrar primero?" },
    { id: "s12", cat: "Eventos", t: "Presentar un evento o actividad a la comunidad", cuando: "Invitación a un taller, plan en grupo o evento en vivo.",
      txt: "🌷 ¡Mujeres! Les cuento lo que viene: [nombre del evento], el [fecha] a las [hora] en [lugar/en línea]. Va a ser un espacio para [qué van a vivir]. Cupos limitados: [cupos]. Confirma respondiendo “VOY” y te guardo tu lugar. Puedes traer a una amiga 💛" },
    { id: "s13", cat: "Eventos", t: "Invitar a un plan en grupo (café, spa, caminata)", cuando: "Para actividades presenciales de la comunidad.",
      txt: "Hola [nombre] ☕ Organizamos un plan solo de mujeres: [plan], el [fecha] en [lugar]. Es para conocernos, reír y desconectarnos un rato. Solo tienes que decir si vas y yo te cuento los detalles. ¿Te anoto?" },
    { id: "s14", cat: "Eventos", t: "Hablar de la caja secreta y los premios (solo Colombia)", cuando: "Campaña Primeras 50 fundadoras, únicamente en Colombia.",
      txt: "Mientras llegamos a las 50 fundadoras, cada día tienes una caja secreta con una misión pequeña ✨ Hay premios para las fundadoras de Colombia: lo vas viendo en la plataforma. Participar no cuesta nada y las condiciones están publicadas. Entra hoy y abre la tuya." },
    { id: "s15", cat: "Empresas", t: "Primer mensaje a una empresa (bienestar corporativo)", cuando: "Contacto con gerente, RR. HH. o bienestar.",
      txt: "Buenas tardes [nombre]. Soy [tu nombre] de Código Mujer Libre. Ayudamos a empresas a cuidar a sus colaboradoras con una plataforma de bienestar hecha para mujeres: comunidad, pausas activas de 5 minutos, eventos y beneficios, incluida una sala de maternidad para acompañar el regreso al trabajo. ¿Podemos agendar 15 minutos esta semana para mostrarle un demo?" },
    { id: "s16", cat: "Empresas", t: "Reunión con Recursos Humanos: guion de 10 minutos", cuando: "Cuando ya tienes la cita.",
      txt: "1) Escucha primero: ¿qué necesitan hoy (clima, retención, maternidad, bienestar)? (3 min)\n2) Muestra el demo de la plataforma y la sala de maternidad. (3 min)\n3) Explica cómo se mide: participación, uso y satisfacción; sin exponer datos individuales. (2 min)\n4) Propón un piloto pequeño y pide la siguiente reunión con quien decide. (2 min)\nRecuerda: no prometas resultados médicos ni de productividad. Precios y contrato los envía Código ML." }
  ];

  /* Plan por mes. tag: fijo (ya definido) | sugerido (idea para decidir con Jazz). co = solo Colombia */
  const MESES = [
    { id: "2026-11", n: "Noviembre 2026", lema: "Abrimos la comunidad",
      items: [
        { t: "Campaña “Primeras 50 fundadoras” en Bogotá: caja secreta y misión diaria", tag: "fijo", co: true },
        { t: "Feria Emprende App UP 2026 (Santo Domingo, 17 al 21): mostrar la Sala de ventas", tag: "fijo" },
        { t: "Separar cupos de boutiques inaugurales con el 30 %", tag: "fijo" },
        { t: "Inscribir mujeres con tu código y escribirles la bienvenida", tag: "fijo" },
        { t: "Primer encuentro de bienvenida en línea para las nuevas", tag: "sugerido" }
      ] },
    { id: "2026-12", n: "Diciembre 2026", lema: "Concurso de anchetas navideñas",
      items: [
        { t: "Concurso de anchetas navideñas (Colombia): premios y condiciones publicadas", tag: "fijo", co: true },
        { t: "Cierre de la campaña de fundadoras: 14 de diciembre", tag: "fijo", co: true },
        { t: "Sorteo: 15 de diciembre", tag: "fijo", co: true },
        { t: "Último día para completar pagos de reserva: 15 de diciembre", tag: "fijo" },
        { t: "Regalo de fin de año para las fundadoras (mensaje + tarjeta digital)", tag: "sugerido" }
      ] },
    { id: "2027-01", n: "Enero 2027", lema: "Entrega y estreno",
      items: [
        { t: "Entrega de las boutiques inaugurales, en el orden de reserva", tag: "fijo" },
        { t: "Evento en vivo de inauguración de la boutiques con las dueñas", tag: "sugerido" },
        { t: "Campaña “Año nuevo, negocio nuevo”: invitar a más emprendedoras", tag: "sugerido" },
        { t: "Primer informe de visitas para cada boutique", tag: "sugerido" }
      ] },
    { id: "2027-02", n: "Febrero 2027", lema: "Amor propio y amistad",
      items: [
        { t: "Evento en vivo de tiendas con descuentos del club (amor y amistad)", tag: "sugerido" },
        { t: "Plan en grupo: tarde de spa o café para las mujeres de cada ciudad", tag: "sugerido" },
        { t: "Reunión comercial con empresas para el Día de la Mujer", tag: "sugerido" }
      ] },
    { id: "2027-03", n: "Marzo 2027", lema: "Mes de la mujer",
      items: [
        { t: "Gran evento del 8 de marzo con las boutiques y la comunidad", tag: "sugerido" },
        { t: "Alianza con una empresa para una actividad de bienestar", tag: "sugerido" },
        { t: "Balance de los primeros meses y metas del trimestre", tag: "sugerido" }
      ] }
  ];

  const EMO = ["🌸", "💛", "📞", "💬", "☕", "🎪", "💄", "🛍️", "💰", "🧾", "📅", "✨", "🌿", "🧘", "🎁", "🚀", "🤝", "📍", "✈️", "🎂", "📝", "⭐", "🔔", "💼"];
  return { OBJ, PLAN, SPEECH, REGLAS, MESES, EMO };
})();
