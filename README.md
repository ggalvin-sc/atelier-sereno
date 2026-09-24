# Atelier Sereno

Professional mobile-massage site for Provenza and El Poblado, Medellín.
The site language is chosen in a selector (Español, English, Français). Reservations go by email.

## Pages

- `index.html` — home
- `benefits.html` — health benefits (not a menu of massage types)
- `areas.html` — Provenza and El Poblado maps
- `contact.html` — hours and email form
- `faq.html` — questions

## Before you publish

1. Open `js/config.js`.
2. Set `email`, `phoneDisplay`, and `phoneTel`.
3. Set `origin` to the live domain.
4. Update `sitemap.xml` and `robots.txt` if the domain is not `ateliersereno.com`.

## Google Maps / Business Profile

Create a **service-area** Google Business Profile (not a storefront):

- Name: Atelier Sereno
- Category: Massage therapist
- Service areas: Provenza, El Poblado, Medellín
- Hours: daily 12:00–02:00
- Email / phone: the values in `js/config.js`
- Website: this site

## Preview locally

```powershell
python -m http.server 5173
```

Then open http://127.0.0.1:5173/

## Stack

Bootstrap 5 from CDN. Custom language switcher. Free still-life photos from Unsplash and Pexels; none show people. Credits are in `images/CREDITS.txt`.
