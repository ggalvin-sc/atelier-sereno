/*
  Site configuration for Orux Wellness.
  Brand, WhatsApp booking, Instagram, hours, maps, and the public URL.
*/

const SITE = {
  brand: "Orux Wellness",
  legalName: "Orux Wellness — Masajes terapéuticos a domicilio Medellín",
  tagline: "Tu bienestar, nuestra prioridad",
  phoneDisplay: "+57 324 270 0150",
  phoneTel: "+573242700150",
  whatsapp: "https://wa.me/573242700150",
  instagram: "https://www.instagram.com/orux.wellness/",
  instagramHandle: "@orux.wellness",
  email: "",
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
  origin: "https://ggalvin-sc.github.io/atelier-sereno",
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

function whatsappUrl(text) {
  const q = new URLSearchParams();
  if (text) q.set("text", text);
  return `${SITE.whatsapp}?${q.toString()}`;
}
