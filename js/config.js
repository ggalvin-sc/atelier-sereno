/*
  Site configuration for Atelier Sereno.
  Set email, phone, hours, maps, and the public URL here.
*/

const SITE = {
  brand: "Atelier Sereno",
  legalName: "Atelier Sereno — Masaje a domicilio Medellín",
  phoneDisplay: "+57 300 000 0000",
  phoneTel: "+573000000000",
  email: "reservas@ateliersereno.com",
  city: "Medellín",
  region: "Antioquia",
  country: "CO",
  timezone: "America/Bogota",
  hours: {
    openHour: 12,
    openMinute: 0,
    closeHour: 2,
    closeMinute: 0,
    lastBookingHour: 1,
    lastBookingMinute: 0,
    days: "everyday"
  },
  origin: "https://ateliersereno.com",
  areas: {
    provenza: {
      name: "Provenza",
      query: "Provenza, El Poblado, Medellín, Antioquia, Colombia",
      mapsSearch: "https://www.google.com/maps/search/?api=1&query=Provenza+El+Poblado+Medellin+Colombia",
      embed: "https://maps.google.com/maps?q=Provenza,+El+Poblado,+Medell%C3%ADn,+Colombia&z=16&output=embed",
      lat: 6.2095,
      lng: -75.5675
    },
    poblado: {
      name: "El Poblado",
      query: "El Poblado, Medellín, Antioquia, Colombia",
      mapsSearch: "https://www.google.com/maps/search/?api=1&query=El+Poblado+Medellin+Colombia",
      embed: "https://maps.google.com/maps?q=El+Poblado,+Medell%C3%ADn,+Colombia&z=14&output=embed",
      lat: 6.2088,
      lng: -75.5648
    }
  }
};

function mailtoUrl(subject, body) {
  const q = new URLSearchParams();
  if (subject) q.set("subject", subject);
  if (body) q.set("body", body);
  return `mailto:${SITE.email}?${q.toString()}`;
}
