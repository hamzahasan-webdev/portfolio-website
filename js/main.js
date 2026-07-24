/* ──────────────────────────────────────────────────────────────────
   HAMZA WEB SOLUTIONS — main.js
   Lenis smooth scroll + shared UI behavior
   ────────────────────────────────────────────────────────────────── */

// ── 1. Theme (dark / light) ─────────────────────────────────────
const html = document.documentElement;
let theme = localStorage.getItem('hws-theme') || 'dark';

function applyTheme(t) {
  theme = t;
  if (t === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
  localStorage.setItem('hws-theme', t);
  updateLogos();
}

function updateLogos() {
  const isDark = html.classList.contains('dark');
  // logo-light.png is the white version → use on dark bg
  // logo-dark.png is the navy version  → use on light bg
  const src = isDark ? 'assets/logo/logo-light.png' : 'assets/logo/logo-dark.png';
  document.querySelectorAll('.site-logo').forEach(img => { img.src = src; });
}

applyTheme(theme);

document.addEventListener('DOMContentLoaded', () => {
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      applyTheme(theme === 'dark' ? 'light' : 'dark');
      const icon = themeBtn.querySelector('i');
      if (icon) {
        icon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
      }
    });
    const icon = themeBtn.querySelector('i');
    if (icon) {
      icon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }
  }

  updateLogos();
  initNavbar();
  initMobileMenu();
  initLoadingScreen();
  initLenis();
  initRevealAnimations();
  initCounters();
  markActiveNav();
});

// ── 2. Loading Screen ───────────────────────────────────────────
function initLoadingScreen() {
  const screen = document.getElementById('loading-screen');
  if (!screen) return;
  setTimeout(() => {
    screen.classList.add('fade-out');
    setTimeout(() => { screen.style.display = 'none'; }, 800);
  }, 2400);
}

// ── 3. Navbar scroll behavior ───────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  function onScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── 4. Mobile menu ──────────────────────────────────────────────
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;
  const icon = toggle.querySelector('i');
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    if (icon) icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      if (icon) icon.className = 'fa-solid fa-bars';
    });
  });
}

// ── 5. Mark active nav link ─────────────────────────────────────
function markActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href') || '';
    const hrefPage = href.split('/').pop() || 'index.html';
    if (hrefPage === path || (path === '' && hrefPage === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/// ── Premium Lenis Smooth Scroll ───────────────────────────────
let lenisInstance = null;

function initLenis() {
  // Respect accessibility settings
  // Disabled during development
  // if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  //   console.log("Reduced motion enabled - Lenis disabled.");
  //   return;
  // }

  // Wait until Lenis is available
  if (typeof Lenis === "undefined") {
    window.addEventListener("load", initLenis, { once: true });
    return;
  }

  console.log("Initializing Premium Lenis...");

  lenisInstance = new Lenis({
    // Feel
    duration: 1.65,

    // Smooth luxury easing
    easing: (t) => 1 - Math.pow(1 - t, 3.5),

    orientation: "vertical",
    gestureOrientation: "vertical",

    // Desktop
    smoothWheel: true,
    wheelMultiplier: 0.95,

    // Mobile
    smoothTouch: false,
    touchMultiplier: 1.4,

    infinite: false,

    autoResize: true,

    syncTouch: false
  });

  // Make available globally
  window.__lenis = lenisInstance;

  // Animation loop
  function raf(time) {
    lenisInstance.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Update scroll value for other scripts
  lenisInstance.on("scroll", ({ scroll }) => {
    window.__lenisScroll = scroll;
  });

  console.log("Premium Lenis Ready ✓");
}
// ── 7. Scroll Reveal (IntersectionObserver) ─────────────────────
function initRevealAnimations() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });

  revealEls.forEach(el => observer.observe(el));
}

// ── 8. Counter Animation ─────────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const dur = parseFloat(el.dataset.dur || 2) * 1000;
      let start = 0;
      const step = end / (dur / (1000 / 60));
      const timer = setInterval(() => {
        start += step;
        if (start >= end) {
          el.textContent = end + suffix;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(start) + suffix;
        }
      }, 1000 / 60);
      observer.unobserve(el);
    });
  }, { threshold: .5 });

  counters.forEach(el => observer.observe(el));
}
