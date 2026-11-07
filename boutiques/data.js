/* Código ML · Boutiques — DATOS DE DEMOSTRACIÓN (todo ficticio).
   Cada boutique real será una ficha como estas: la plantilla (app.js) es la misma para todas. */
window.CMLB = {
  hotelUrl: "https://bleydypardo-arch.github.io/codigo-mujer-libre/",
  email: "codigomujerlibre@gmail.com",
  price: { intro: null, monthly: null, introMonths: 0 },   // ya no se muestran precios en el demo: los precios viven en la Sala de ventas
  cities: [
    { name: "Orlando", country: "Estados Unidos", slots: 2 },
    { name: "Bogotá", country: "Colombia", slots: 2 },
    { name: "Barranquilla", country: "Colombia", slots: 2 },
    { name: "Granada-Costa", country: "España", slots: 2 }
  ],
  spaces: [
    { id: "spa", n: "Spa & Wellness", d: "Rituales de calma y cuidado", ic: "leaf" },
    { id: "hall", n: "Hall de Experiencias", d: "Todo el hotel en un solo lugar", ic: "sun" },
    { id: "matcha", n: "Matcha Café", d: "Recetas y momentos de pausa", ic: "tea" },
    { id: "atelier", n: "Atelier de Esencias", d: "Crea tu propia esencia", ic: "bottle" },
    { id: "viajes", n: "Viajes", d: "Escapadas para mujeres", ic: "plane" },
    { id: "podcast", n: "Entre Nosotras", d: "Conversaciones que acompañan", ic: "mic" }
  ],
  boutiques: [
    {
      slug: "maria-bienestar", name: "María Bienestar", owner: "María", city: "Bogotá", country: "Colombia",
      cat: "Bienestar", kind: "Productos físicos", cta: "Comprar", cur: "COP", font: "Cormorant Garamond", motif: "leaf",
      pal: { bg: "#F4F1E8", ink: "#2C3A2E", accent: "#B79A55", soft: "#DDE5D6", deep: "#4F6A55" },
      tagline: "Autocuidado natural, hecho con calma.",
      about: "Cosmética natural y rituales de autocuidado hechos en pequeños lotes en Bogotá. Cada producto nace de plantas colombianas y de una idea simple: cuidarte no debería sentirse como una tarea.",
      stats: ["52 mil seguidoras", "Envíos a toda Colombia", "Lotes artesanales"],
      items: [
        { n: "Crema de caléndula", d: "Hidratación suave para piel sensible. 60 g.", p: 68000, ic: "jar", tag: "Más amada" },
        { n: "Aceite corporal de rosa mosqueta", d: "Textura sedosa, absorción rápida. 100 ml.", p: 85000, ic: "bottle" },
        { n: "Sales de baño de lavanda", d: "Para cerrar el día con calma. 300 g.", p: 54000, ic: "jar" },
        { n: "Infusión calmante", d: "Manzanilla, toronjil y flor de azahar.", p: 38000, ic: "tea" },
        { n: "Vela de cera de soya", d: "Aroma a cedro y vainilla. 45 h.", p: 72000, ic: "candle" },
        { n: "Kit ritual de autocuidado", d: "Crema, sales e infusión en caja regalo.", p: 148000, ic: "box", tag: "Regalo" }
      ]
    },
    {
      slug: "laura-voz", name: "Laura Voz", owner: "Laura", city: "Orlando", country: "Estados Unidos",
      cat: "Conferencias y cursos", kind: "Servicios y formación", cta: "Inscribirme", cur: "USD", font: "Playfair Display", motif: "lines",
      pal: { bg: "#EFEDEA", ink: "#23232B", accent: "#B8955A", soft: "#D9D5CE", deep: "#2F3142" },
      tagline: "Habla, lidera, ocupa tu lugar.",
      about: "Coach y conferencista para mujeres que quieren comunicar con presencia. Más de 10 años acompañando a líderes, emprendedoras y equipos en Estados Unidos y Latinoamérica.",
      stats: ["Conferencista internacional", "Programas en español e inglés", "Cupos limitados"],
      items: [
        { n: "Conferencia «Mujer sin permiso»", d: "Charla de 60 minutos para tu evento o empresa.", p: 1200, ic: "mic", tag: "Para eventos" },
        { n: "Masterclass en vivo", d: "Dos horas para hablar con claridad y seguridad.", p: 45, ic: "laptop" },
        { n: "Curso «Voz de líder» · 6 semanas", d: "Programa digital con ejercicios y comunidad.", p: 249, ic: "book", tag: "Digital" },
        { n: "Mentoría 1 a 1", d: "Sesión privada de 50 minutos por video.", p: 120, ic: "heart" },
        { n: "Taller presencial en Orlando", d: "Una tarde, grupo reducido, café incluido.", p: 85, ic: "ticket" }
      ]
    },
    {
      slug: "carolina-experiencias", name: "Carolina Experiencias", owner: "Carolina", city: "Granada-Costa", country: "España",
      cat: "Viajes y retiros", kind: "Experiencias y paquetes", cta: "Reservar", cur: "EUR", font: "Marcellus", motif: "waves",
      pal: { bg: "#F1EBE0", ink: "#17363A", accent: "#C3924F", soft: "#D8E0DB", deep: "#1F4A4F" },
      tagline: "Escapadas pensadas solo para ti.",
      about: "Retiros, viajes y encuentros para mujeres en la Costa Tropical y el sur de España. Grupos pequeños, alojamientos con encanto y tiempo para ti.",
      stats: ["Grupos de máximo 10", "Alojamiento incluido", "Guía en español"],
      items: [
        { n: "Retiro Costa Tropical · 4 días", d: "Yoga, mar, spa y cenas junto al Mediterráneo.", p: 690, ic: "sun", tag: "Próxima salida" },
        { n: "Escapada a la Alpujarra", d: "Fin de semana de senderos, pueblos blancos y calma.", p: 320, ic: "leaf" },
        { n: "Cena de maridaje", d: "Cinco pases con vinos locales. Mesa para mujeres.", p: 75, ic: "wine" },
        { n: "Taller de cerámica y té", d: "Crea tu pieza y llévatela a casa.", p: 55, ic: "vase" },
        { n: "Viaje a Marruecos · 7 días", d: "Marrakech, desierto y hammam. Salida en primavera.", p: 1480, ic: "plane", tag: "Cupos limitados" }
      ]
    },
    {
      slug: "valeria-nutricion", name: "Valeria Nutrición", owner: "Valeria", city: "Bogotá", country: "Colombia",
      cat: "Nutrición", kind: "Productos físicos", cta: "Comprar", cur: "COP", font: "Jost", motif: "rings",
      pal: { bg: "#FBF4EC", ink: "#3B2A24", accent: "#C9704F", soft: "#F2DCCB", deep: "#8C4A36" },
      tagline: "Come rico, siéntete fuerte.",
      about: "Nutricionista dietista. Selecciona suplementos y alimentos funcionales que ella misma usa con sus pacientes, sin promesas milagrosas y con información clara.",
      stats: ["Nutricionista certificada", "Ingredientes claros", "Despacho en 48 h"],
      items: [
        { n: "Proteína vegetal · vainilla", d: "Guisante y arroz. 25 g de proteína por porción.", p: 135000, ic: "tub", tag: "Favorita" },
        { n: "Colágeno hidrolizado", d: "Sabor neutro, se disuelve en frío. 300 g.", p: 118000, ic: "tub" },
        { n: "Barras de avena y cacao", d: "Caja de 12, sin azúcar añadida.", p: 64000, ic: "bar" },
        { n: "Mix de semillas y nueces", d: "Para el desayuno o la media tarde. 400 g.", p: 42000, ic: "jar" },
        { n: "Plan de alimentación · 4 semanas", d: "Guía digital con menús y lista de compras.", p: 89000, ic: "book", tag: "Digital" }
      ]
    },
    {
      slug: "camila-atelier", name: "Camila Atelier", owner: "Camila", city: "Orlando", country: "Estados Unidos",
      cat: "Moda y accesorios", kind: "Productos físicos", cta: "Comprar", cur: "USD", font: "Italiana", motif: "arch",
      pal: { bg: "#F7ECEA", ink: "#2B2024", accent: "#B88A5E", soft: "#EBD0CC", deep: "#6A2F43" },
      tagline: "Piezas atemporales, hechas con intención.",
      about: "Diseñadora de moda en Orlando. Colecciones pequeñas, cortes sencillos y accesorios que combinan con todo. Producción limitada y sin prisa.",
      stats: ["Colección cápsula", "Hecho a mano", "Envío en EE. UU."],
      items: [
        { n: "Vestido de lino «Aurora»", d: "Corte midi, color marfil. Tallas XS a XL.", p: 148, ic: "dress", tag: "Nuevo" },
        { n: "Blusa de seda «Perla»", d: "Cuello suave, caída ligera.", p: 96, ic: "dress" },
        { n: "Bolso de cuero «Mía»", d: "Hecho a mano. Interior de gamuza.", p: 189, ic: "bag", tag: "Edición limitada" },
        { n: "Aretes dorados", d: "Baño de oro de 18 k, hipoalergénicos.", p: 42, ic: "ring" },
        { n: "Pañuelo de seda", d: "Estampado exclusivo, 70 × 70 cm.", p: 58, ic: "leaf" }
      ]
    },
    {
      slug: "daniela-beauty", name: "Daniela Beauty", owner: "Daniela", city: "Barranquilla", country: "Colombia",
      cat: "Belleza y cabello", kind: "Productos y servicio a domicilio", cta: "Reservar", cur: "COP", font: "DM Serif Display", motif: "petal",
      pal: { bg: "#FAEEEB", ink: "#3A2328", accent: "#C79A6B", soft: "#F0CFC8", deep: "#9C4458" },
      tagline: "Tu belleza, en tu casa.",
      about: "Estilista profesional con servicio a domicilio en Barranquilla y línea propia de cosméticos y accesorios para el cabello. Llega a tu casa con todo lo necesario.",
      stats: ["Servicio a domicilio", "Productos profesionales", "Agenda por cita"],
      items: [
        { n: "Peinado de evento a domicilio", d: "Prueba incluida. Agenda con 5 días de anticipación.", p: 180000, ic: "scissors", tag: "Servicio" },
        { n: "Corte y tratamiento hidratante", d: "Sesión de 90 minutos en tu casa.", p: 140000, ic: "scissors", tag: "Servicio" },
        { n: "Labial «Rosa Barranquilla»", d: "Acabado satinado, larga duración.", p: 59000, ic: "lipstick" },
        { n: "Set de brochas esenciales", d: "Cinco brochas con estuche de viaje.", p: 96000, ic: "brush" },
        { n: "Scrunchies de seda", d: "Paquete de tres, no maltratan el cabello.", p: 36000, ic: "ring" }
      ]
    }
  ]
};
