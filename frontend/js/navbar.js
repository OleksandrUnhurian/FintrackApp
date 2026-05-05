/* ──────────────────────────────────────────
   navbar.js — Navbar behaviour
   Reusable: just include on any page
────────────────────────────────────────── */

(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('is-open');
      mobileMenu.classList.toggle('is-open');
    });

    // Close mobile menu when a link/button inside is clicked
    mobileMenu.querySelectorAll('button, a').forEach(function (el) {
      el.addEventListener('click', function () {
        hamburger.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
      });
    });
  }
})();