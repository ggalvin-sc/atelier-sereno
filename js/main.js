/*
  Shared front-end for every Atelier Sereno page.
  Functions:
  - detectDevice(): adds is-mobile / is-desktop on <html>.
  - getLang() / setLang(): URL, storage, then browser language.
  - t(key): current dictionary string.
  - applyTranslations(): fills [data-i18n] and page SEO from data-page.
  - updateSeo(): title, meta, Open Graph, hreflang for this file path.
  - updateJsonLd(): MassageTherapist schema (home and contact).
  - updateContactHrefs(): email and tel links from SITE.
  - updateHoursStatus(): open/closed pill in America/Bogota.
  - bindLanguageSwitch(): language <select>, keeps ?lang= on this page.
  - bindLangAwareLinks(): appends current lang to internal .js-lang links.
  - markActiveNav(): aria-current on the matching nav item.
  - bindBookingForm(): opens mailto with the form text (no server).
  - initMaps(): Provenza and El Poblado embeds.
  - initYear(): footer year.
  - boot(): runs the above on DOMContentLoaded.
*/

(function () {
  const STORAGE_KEY = "atelier-sereno-lang";
  const supported = ["es", "en", "fr"];

  function detectDevice() {
    const mobile = window.matchMedia("(max-width: 991.98px)").matches
      || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    document.documentElement.classList.toggle("is-mobile", mobile);
    document.documentElement.classList.toggle("is-desktop", !mobile);
    return mobile;
  }

  function browserLang() {
    const raw = (navigator.language || "es").slice(0, 2).toLowerCase();
    return supported.includes(raw) ? raw : "es";
  }

  function getLang() {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = (params.get("lang") || "").toLowerCase();
    if (supported.includes(fromUrl)) return fromUrl;
    const stored = (localStorage.getItem(STORAGE_KEY) || "").toLowerCase();
    if (supported.includes(stored)) return stored;
    return browserLang();
  }

  function setLang(lang) {
    if (!supported.includes(lang)) lang = "es";
    localStorage.setItem(STORAGE_KEY, lang);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState({}, "", url);
    applyTranslations(lang);
  }

  function t(key, lang) {
    const current = lang || document.documentElement.getAttribute("data-lang") || "es";
    const pack = TRANSLATIONS[current] || TRANSLATIONS.es;
    return pack[key] != null ? pack[key] : (TRANSLATIONS.es[key] || key);
  }

  function pageName() {
    return document.documentElement.getAttribute("data-page") || "home";
  }

  function applyTranslations(lang) {
    const pack = TRANSLATIONS[lang] || TRANSLATIONS.es;
    document.documentElement.lang = pack.htmlLang;
    document.documentElement.setAttribute("data-lang", lang);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (pack[key] != null) el.textContent = pack[key];
    });

    const langSelect = document.getElementById("lang-select");
    if (langSelect && langSelect.value !== lang) langSelect.value = lang;

    const areaSelect = document.getElementById("area");
    if (areaSelect) {
      const previous = areaSelect.value;
      const provenza = areaSelect.querySelector('[value="provenza"]');
      const poblado = areaSelect.querySelector('[value="poblado"]');
      if (provenza) provenza.textContent = pack.formAreaProvenza;
      if (poblado) poblado.textContent = pack.formAreaPoblado;
      areaSelect.value = previous;
    }

    updateSeo(lang, pack);
    updateJsonLd(pack);
    updateContactHrefs();
    updateHoursStatus(pack);
    bindLangAwareLinks(lang);
    markActiveNav();
  }

  function pageUrl(lang) {
    const origin = SITE.origin.replace(/\/$/, "");
    let path = window.location.pathname;
    if (path.endsWith("/")) path += "index.html";
    return `${origin}${path}?lang=${lang}`;
  }

  function updateSeo(lang, pack) {
    const page = pageName();
    const title = pack[`${page}MetaTitle`] || pack.homeMetaTitle;
    const description = pack[`${page}MetaDescription`] || pack.homeMetaDescription;
    const ogTitle = pack[`${page}OgTitle`] || pack.homeOgTitle;
    const ogDescription = pack[`${page}OgDescription`] || pack.homeOgDescription;

    document.title = title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", description);
    const ogTitleEl = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogTitleEl) ogTitleEl.setAttribute("content", ogTitle);
    if (ogDesc) ogDesc.setAttribute("content", ogDescription);
    const locales = { es: "es_CO", en: "en_US", fr: "fr_FR" };
    if (ogLocale) ogLocale.setAttribute("content", locales[lang] || "es_CO");

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", pageUrl(lang));

    document.querySelectorAll("link[data-hreflang]").forEach((link) => {
      const code = link.getAttribute("data-hreflang");
      link.setAttribute("href", pageUrl(code === "x-default" ? "es" : code));
    });
  }

  function updateJsonLd(pack) {
    const node = document.getElementById("jsonld");
    if (!node) return;
    const provenza = SITE.areas.provenza;
    const poblado = SITE.areas.poblado;
    const data = {
      "@context": "https://schema.org",
      "@type": "MassageTherapist",
      name: SITE.brand,
      image: `${SITE.origin}/images/luxury-bath.jpg`,
      url: pageUrl(document.documentElement.getAttribute("data-lang") || "es"),
      telephone: SITE.phoneTel,
      email: SITE.email,
      priceRange: "$$",
      currenciesAccepted: "COP",
      paymentAccepted: "Cash, Bank Transfer",
      knowsLanguage: ["es", "en", "fr"],
      description: pack.homeMetaDescription,
      areaServed: [
        {
          "@type": "Place",
          name: "Provenza, El Poblado, Medellín",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Medellín",
            addressRegion: "Antioquia",
            addressCountry: "CO",
            streetAddress: "Provenza, El Poblado"
          },
          geo: { "@type": "GeoCoordinates", latitude: provenza.lat, longitude: provenza.lng }
        },
        {
          "@type": "Place",
          name: "El Poblado, Medellín",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Medellín",
            addressRegion: "Antioquia",
            addressCountry: "CO",
            streetAddress: "El Poblado"
          },
          geo: { "@type": "GeoCoordinates", latitude: poblado.lat, longitude: poblado.lng }
        }
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: SITE.city,
        addressRegion: SITE.region,
        addressCountry: SITE.country
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "12:00",
          closes: "23:59"
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "00:00",
          closes: "02:00"
        }
      ]
    };
    node.textContent = JSON.stringify(data);
  }

  function updateContactHrefs() {
    document.querySelectorAll(".js-email").forEach((el) => {
      el.setAttribute("href", `mailto:${SITE.email}`);
      if (el.id === "email-display") el.textContent = SITE.email;
    });
    document.querySelectorAll(".js-phone").forEach((el) => {
      el.setAttribute("href", `tel:${SITE.phoneTel}`);
      if (el.id === "phone-display") el.textContent = SITE.phoneDisplay;
    });
  }

  function bogotaParts() {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: SITE.timezone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    }).formatToParts(new Date());
    const hour = Number(parts.find((p) => p.type === "hour").value);
    const minute = Number(parts.find((p) => p.type === "minute").value);
    return hour * 60 + minute;
  }

  function isOpenNow() {
    const now = bogotaParts();
    const open = SITE.hours.openHour * 60 + SITE.hours.openMinute;
    const close = SITE.hours.closeHour * 60 + SITE.hours.closeMinute;
    if (close < open) return now >= open || now < close;
    return now >= open && now < close;
  }

  function updateHoursStatus(pack) {
    const pill = document.getElementById("hours-status");
    if (!pill) return;
    const open = isOpenNow();
    pill.classList.toggle("is-open", open);
    const label = pill.querySelector("[data-status-label]");
    if (label) label.textContent = open ? pack.openNow : pack.closedNow;
  }

  function bindLanguageSwitch() {
    const langSelect = document.getElementById("lang-select");
    if (!langSelect) return;
    langSelect.addEventListener("change", () => {
      setLang(langSelect.value);
      const nav = document.getElementById("mainNav");
      if (nav && nav.classList.contains("show") && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(nav).hide();
      }
    });
  }

  function bindLangAwareLinks(lang) {
    document.querySelectorAll("a.js-lang").forEach((link) => {
      const raw = link.getAttribute("data-href") || link.getAttribute("href");
      if (!raw || raw.startsWith("mailto:") || raw.startsWith("tel:") || raw.startsWith("http")) return;
      const url = new URL(raw, window.location.href);
      url.searchParams.set("lang", lang);
      link.setAttribute("href", `${url.pathname}${url.search}${url.hash}`);
    });
  }

  function markActiveNav() {
    const here = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("[data-nav]").forEach((link) => {
      const target = link.getAttribute("data-nav");
      const active = here === target || (here === "" && target === "index.html");
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function bindBookingForm() {
    const form = document.getElementById("booking-form");
    if (!form) return;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = (document.getElementById("name").value || "").trim();
      const area = document.getElementById("area").value;
      const when = (document.getElementById("when").value || "").trim();
      const notes = (document.getElementById("notes").value || "").trim();
      if (!name || !area || !when) {
        window.alert(t("required"));
        return;
      }
      const areaLabel = area === "provenza" ? t("formAreaProvenza") : t("formAreaPoblado");
      const body = [
        `${t("formName")}: ${name}`,
        `${t("formArea")}: ${areaLabel}`,
        `${t("formWhen")}: ${when}`,
        notes ? `${t("formNotes")}: ${notes}` : ""
      ]
        .filter(Boolean)
        .join("\n");
      window.location.href = mailtoUrl(t("formSubject"), body);
    });
  }

  function initMaps() {
    const provenzaFrame = document.getElementById("map-provenza");
    const pobladoFrame = document.getElementById("map-poblado");
    const provenzaLink = document.getElementById("link-provenza");
    const pobladoLink = document.getElementById("link-poblado");
    if (provenzaFrame) provenzaFrame.src = SITE.areas.provenza.embed;
    if (pobladoFrame) pobladoFrame.src = SITE.areas.poblado.embed;
    if (provenzaLink) provenzaLink.href = SITE.areas.provenza.mapsSearch;
    if (pobladoLink) pobladoLink.href = SITE.areas.poblado.mapsSearch;
  }

  function initYear() {
    const year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function boot() {
    detectDevice();
    window.addEventListener("resize", detectDevice);
    bindLanguageSwitch();
    bindBookingForm();
    initMaps();
    initYear();
    applyTranslations(getLang());
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
