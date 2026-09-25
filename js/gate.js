/*
  Preview lock for the shared review URL.
  Functions:
  - digest(): SHA-256 hex of a string.
  - unlock(): marks this browser tab as allowed and shows the page.
  - locked(): true when this visit has not entered the password.
  - paintGate(): draws the password screen and hides the site.
  - tryUnlock(): checks the typed password against the stored hash.
  This is a client-side gate on GitHub Pages, not a server secret.
*/

(function () {
  const STORAGE_KEY = "atelier-sereno-gate";
  const PASS_HASH = "d3aeadbcaafc890ebe45319b039afb23178da02039652a3f6d91b29cc0ecd07a";

  async function digest(value) {
    const bytes = new TextEncoder().encode(value);
    const buf = await crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  function unlock() {
    sessionStorage.setItem(STORAGE_KEY, "ok");
    document.documentElement.classList.remove("gate-locked");
    const gate = document.getElementById("site-gate");
    if (gate) gate.remove();
  }

  function locked() {
    try {
      return sessionStorage.getItem(STORAGE_KEY) !== "ok";
    } catch (err) {
      return true;
    }
  }

  function paintGate() {
    document.documentElement.classList.add("gate-locked");
    if (document.getElementById("site-gate")) return;

    const gate = document.createElement("div");
    gate.id = "site-gate";
    gate.innerHTML = [
      '<div class="gate-card">',
      '  <p class="gate-kicker">Orux Wellness</p>',
      '  <h1 class="gate-title">Vista previa</h1>',
      '  <p class="gate-lead">Escribe la contraseña para abrir el sitio.</p>',
      '  <form id="gate-form" class="gate-form" autocomplete="current-password">',
      '    <label class="visually-hidden" for="gate-pass">Contraseña</label>',
      '    <input id="gate-pass" type="password" name="password" required autofocus>',
      '    <button class="btn btn-gold" type="submit">Entrar</button>',
      '    <p id="gate-error" class="gate-error" hidden>Contraseña incorrecta.</p>',
      "  </form>",
      "</div>"
    ].join("");

    const mount = function () {
      if (!document.body) return;
      document.body.prepend(gate);
      const form = document.getElementById("gate-form");
      if (form) form.addEventListener("submit", tryUnlock);
    };

    if (document.body) mount();
    else document.addEventListener("DOMContentLoaded", mount);
  }

  async function tryUnlock(event) {
    event.preventDefault();
    const input = document.getElementById("gate-pass");
    const error = document.getElementById("gate-error");
    const typed = ((input && input.value) || "").trim().toLowerCase();
    const hash = await digest(typed);
    if (hash === PASS_HASH) {
      unlock();
      return;
    }
    if (error) error.hidden = false;
    if (input) {
      input.value = "";
      input.focus();
    }
  }

  if (!locked()) {
    document.documentElement.classList.remove("gate-locked");
    return;
  }

  paintGate();
})();
