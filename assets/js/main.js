/**
 * =============================================================================
 *  main.js  –  Hem Bakes Shared JavaScript
 * =============================================================================
 *  This file powers the interactive features shared across all three pages:
 *    1. Mobile hamburger navigation toggle
 *    2. Homepage gallery horizontal scroll arrows
 *    3. Smooth scroll-to-anchor (for "Order Now" → enquiry form)
 *    4. Sticky header shrink on scroll
 *
 *  HOW TO USE:
 *    This file is already linked in the <body> of all three pages via:
 *      <script src="./assets/js/main.js"></script>
 *    You do NOT need to edit this file for basic functionality.
 * =============================================================================
 */

/* ── Run all code once the page has fully loaded ─────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {

  /* ──────────────────────────────────────────────────────────────────────────
     1. MOBILE HAMBURGER MENU
     Clicking the ☰ icon shows/hides the #mobile-menu dropdown.
     ────────────────────────────────────────────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = !mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden', isOpen);

      // Update the icon: ☰ (menu) when closed, ✕ (close) when open
      const icon = hamburger.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = isOpen ? 'menu' : 'close';

      // Accessibility: tell screen readers whether menu is expanded
      hamburger.setAttribute('aria-expanded', String(!isOpen));
    });

    // Close mobile menu if user clicks a link inside it
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.add('hidden');
        const icon = hamburger.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = 'menu';
      });
    });
  }

  /* ──────────────────────────────────────────────────────────────────────────
     2. HOMEPAGE ROLLING GALLERY – ARROW SCROLL CONTROLS
     The ◀ ▶ buttons on the homepage (#gallery-strip) scroll the
     horizontal photo strip left or right by 340px each click.
     ────────────────────────────────────────────────────────────────────────── */
  const galleryStrip = document.getElementById('gallery-strip');
  const prevBtn      = document.getElementById('gallery-prev');
  const nextBtn      = document.getElementById('gallery-next');
  const SCROLL_AMT   = 340; // pixels to scroll per click

  if (galleryStrip && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', function () {
      galleryStrip.scrollBy({ left: -SCROLL_AMT, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', function () {
      galleryStrip.scrollBy({ left:  SCROLL_AMT, behavior: 'smooth' });
    });
  }

  /* ──────────────────────────────────────────────────────────────────────────
     3. SMOOTH SCROLL for anchor links (e.g., clicking "Order Now" → #enquiry-form)
     ────────────────────────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ──────────────────────────────────────────────────────────────────────────
     4. STICKY HEADER SHRINK ON SCROLL
     Adds a subtle shadow to the nav bar after the user scrolls 60px,
     reinforcing depth and improving readability over content.
     ────────────────────────────────────────────────────────────────────────── */
  const nav = document.getElementById('main-nav') || document.querySelector('header');
  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 60) {
        nav.classList.add('shadow-md');
      } else {
        nav.classList.remove('shadow-md');
      }
    }, { passive: true });
  }

});
