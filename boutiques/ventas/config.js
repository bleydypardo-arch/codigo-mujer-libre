/* Sala de reservas y ventas · CONFIGURACIÓN
   Todo lo que cambia de una feria a otra vive aquí: precios, WhatsApp, vendedora, fecha.
   (Más adelante estos valores se editarán desde el Admin, por país.) */
window.CMLV = {
  whatsapp: "",                        // número con código de país y sin signos, ej. "18095551234". Si está vacío, "Reservar" abre el correo.
  email: "codigomujerlibre@gmail.com",
  feria: { nombre: "", fecha: "", vendedora: "" },   // ej. { nombre: "Feria …", fecha: "sábado 7 y domingo 8 de noviembre", vendedora: "Nombre" }
  moneda: "US$",
  deposito: 0.5,                       // se separa el cupo con el 50 % del precio de feria
  entrega: "1 de enero de 2027",
  paises: ["República Dominicana", "Colombia", "España", "Otro país"],
  paquetes: [
    { id: "gold", nombre: "GOLD", lema: "Tu vitrina de lujo", normal: 399, feria: 199, mensual: 25, horas: 1,
      incluye: ["1 sala decorada a tu estilo", "15 productos con foto, precio y descripción", "Puerta con tu logo y nombre", "Botón de compra a tu tienda", "Música de ambiente", "Inducción de 1 hora"] },
    { id: "platinum", nombre: "PLATINUM", lema: "Tu boutique inmersiva", normal: 799, feria: 399, mensual: 49, horas: 2, destacado: "El más elegido",
      incluye: ["3 salas conectadas", "30 productos con foto, precio y descripción", "1 experiencia virtual: tus clientas crean su vela o jabón con su nombre", "Música que tú eliges", "Informe mensual de visitas y clics", "Destacada en tu categoría", "Inducción de 1,5 horas"] },
    { id: "diamond", nombre: "DIAMOND", lema: "Tu marca de alta gama", normal: 1499, feria: 749, mensual: 99, horas: 3,
      incluye: ["5 salas conectadas", "60 productos con foto, precio y descripción", "2 experiencias virtuales a tu medida", "Música hecha para tu marca", "Evento en vivo cada mes", "Destacada en el inicio del hotel", "Inducción de 2 horas + 30 días de acompañamiento"] }
  ],
  letraPequena: [
    "Precios en dólares estadounidenses (USD). El pago puede hacerse en moneda local a la tasa del día de pago.",
    "Oferta válida solo para inscripciones realizadas durante la feria. “Precio normal” es el precio de lista desde el 1 de enero de 2027.",
    "Para reservar se paga el 50 % del precio de feria. El 50 % restante se paga antes de la entrega.",
    "Las boutiques se entregan a partir del 1 de enero de 2027, en el orden en que se separaron los cupos.",
    "La mensualidad comienza cuando la dueña recibe su boutique y empieza a usarla, no antes. Incluye alojamiento en el hotel virtual y soporte.",
    "Las horas con la diseñadora se agendan en fechas acordadas; las horas no usadas no se acumulan ni se reembolsan.",
    "Código ML no procesa pagos de productos ni cobra comisión por ventas: las compras se realizan en la tienda de cada emprendedora.",
    "La política de reembolso de la reserva se entrega por escrito al separar el cupo. Impuestos aplicables según la ley de cada país."
  ]
};
