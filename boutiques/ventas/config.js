/* Sala de reservas y ventas · CONFIGURACIÓN
   Todo lo que cambia de una feria a otra vive aquí: precios por país, WhatsApp, asesoras y sus códigos.
   Sin código de asesora la sala NO muestra precios. (Más adelante los códigos se validarán en Supabase y los precios se editarán desde el Admin.) */
window.CMLV = {
  whatsapp: "17864438100",                         // número con código de país y sin signos, ej. "18095551234". Vacío = "Reservar" abre el correo.
  email: "codigomujerlibre@gmail.com",
  feria: { nombre: "Emprende App UP 2026 · Gran Expoferia del Emprendimiento", fecha: "del 17 al 21 de noviembre de 2026", lugar: "UASD, Santo Domingo, República Dominicana", entrada: "Entrada gratis" },     // ej. { nombre: "Feria …", fecha: "sábado 7 y domingo 8 de noviembre" }
  entrega: "enero de 2027",
  pago: { separa: 0.3, cuotas: 2, limite: "15 de diciembre" },   // separa con el 30 %; el resto en 2 pagos antes del límite
  paises: ["República Dominicana", "Colombia", "España", "Otro país"],

  /* Códigos de asesora: 4 dígitos. El código define el país (y por tanto la lista de precios). CAMBIA estos códigos de ejemplo. */
  asesoras: [
    { codigo: "7316", pais: "do", nombre: "Emily · República Dominicana" },
    { codigo: "4592", pais: "co", nombre: "Asesora Colombia 1" },
    { codigo: "8037", pais: "co", nombre: "Asesora Colombia 2" },
    { codigo: "2864", pais: "es", nombre: "Asesora España" },
    { codigo: "9150", pais: "us", nombre: "Jazz · Estados Unidos" }
  ],


  /* Precios por país. normal = precio de lista desde el 1 de enero de 2027. */
  precios: {
    do: { nombre: "República Dominicana", moneda: "US$", sufijo: "", nota: "Precios en dólares (USD). Se acepta pago en pesos dominicanos a la tasa del día de pago.", equiv: { moneda: "RD$", tasa: 61 },
      p: { gold: { normal: 299, feria: 199, mensual: 25 }, platinum: { normal: 549, feria: 349, mensual: 49 }, diamond: { normal: 999, feria: 649, mensual: 99 } } },
    us: { nombre: "Estados Unidos", moneda: "US$", sufijo: "", nota: "Precios en dólares (USD).",
      p: { gold: { normal: 449, feria: 299, mensual: 29.99 }, platinum: { normal: 599, feria: 399, mensual: 39.99 }, diamond: { normal: 899, feria: 599, mensual: 49.99 } } },
    es: { nombre: "España", moneda: "", sufijo: " €", nota: "Precios en euros (EUR). IVA según la ley española.",
      p: { gold: { normal: 389, feria: 259, mensual: 26.99 }, platinum: { normal: 529, feria: 349, mensual: 34.99 }, diamond: { normal: 789, feria: 519, mensual: 43.99 } } },
    co: { nombre: "Colombia", moneda: "$", sufijo: " COP", nota: "Precios en pesos colombianos (COP).",
      p: { gold: { normal: 599000, feria: 399000, mensual: 49000 }, platinum: { normal: 999000, feria: 699000, mensual: 99000 }, diamond: { normal: 1790000, feria: 1290000, mensual: 199000 } } }
  },

  paquetes: [
    { id: "gold", nombre: "GOLD", lema: "Tu vitrina de lujo", horas: 1, trabajo: 8, salas: 1, productos: 15,
      incluye: ["1 sala decorada a tu estilo", "15 productos con foto, precio y descripción", "Puerta con tu logo y nombre", "Botón de compra a tu tienda", "Música de ambiente", "Inducción de 1 hora"] },
    { id: "platinum", nombre: "PLATINUM", lema: "Tu boutique inmersiva", horas: 2, trabajo: 16, salas: 3, productos: 30, destacado: "El más elegido",
      incluye: ["3 salas conectadas", "30 productos con foto, precio y descripción", "1 experiencia virtual: tus clientas crean su vela o jabón con su nombre", "Música que tú eliges", "Informe mensual de visitas y clics", "Destacada en tu categoría", "Inducción de 1,5 horas"] },
    { id: "diamond", nombre: "DIAMOND", lema: "Tu marca de alta gama", horas: 3, trabajo: 30, salas: 5, productos: 60,
      incluye: ["5 salas conectadas", "60 productos con foto, precio y descripción", "2 experiencias virtuales a tu medida", "Música hecha para tu marca", "Evento en vivo cada mes", "Destacada en el inicio del hotel", "Inducción de 2 horas + 30 días de acompañamiento"] }
  ],
  letraPequena: [
    "Los precios corresponden al país de la feria y se indican en la moneda de ese país.",
    "Oferta válida solo para inscripciones realizadas durante la feria. “Precio normal” es el precio de lista desde el 1 de enero de 2027.",
    "Para separar el cupo se paga el 30 % del precio de feria. El resto se paga en dos pagos, antes del 15 de diciembre. La boutique se entrega cuando el pago está completo.",
    "Las boutiques se entregan durante enero de 2027, en el orden en que se separaron los cupos.",
    "La mensualidad comienza cuando la dueña recibe su boutique y empieza a usarla, no antes. Incluye alojamiento en el hotel virtual y soporte.",
    "Las sesiones con la diseñadora se agendan en fechas acordadas; las horas no usadas no se acumulan ni se reembolsan.",
    "Código ML no procesa pagos de productos ni cobra comisión por ventas: las compras se realizan en la tienda de cada emprendedora.",
    "La política de reembolso de la reserva se entrega por escrito al separar el cupo. Impuestos aplicables según la ley de cada país."
  ]
};
