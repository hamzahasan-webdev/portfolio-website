/* ──────────────────────────────────────────────────────────────────
   Process page — Lenis-aware step tracking
   Uses Lenis scroll event + getBoundingClientRect for continuous,
   smooth active-step detection on every scroll tick.
   ────────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  const steps = Array.from(document.querySelectorAll('.process-step'));
  const dotBtns = Array.from(document.querySelectorAll('.step-dot'));
  const fillEl = document.getElementById('timeline-fill');
  const fillMobEl = document.getElementById('timeline-fill-mobile');

  if (!steps.length) return;

  let active = 0;

  // ── Activate a step ──────────────────────────────────────────────
  function setActive(index) {
    const next = Math.max(0, Math.min(steps.length - 1, index));
    if (next === active && document.querySelector('.step-card.active')) return; // no change

    active = next;

    // Timeline fill %
    const pct = steps.length > 1 ? (active / (steps.length - 1)) * 100 : 0;
    if (fillEl) fillEl.style.height = pct + '%';
    if (fillMobEl) fillMobEl.style.height = pct + '%';

    // Cards & bullets
    steps.forEach((step, i) => {
      const isActive = i === active;

      step.querySelectorAll('.step-card').forEach(card => {
        card.classList.toggle('active', isActive);
      });
      const bullet = step.querySelector('.step-bullet');
      if (bullet) bullet.classList.toggle('active', isActive);

      const bulletMob = step.querySelector('.step-bullet-mobile');
      if (bulletMob) bulletMob.classList.toggle('active', isActive);
    });

    // Dots
    dotBtns.forEach((dot, i) => {
      dot.classList.toggle('active', i === active);
    });
  }

  // ── Find which step is closest to viewport center ─────────────────
  function findActiveStep() {
    const vpCenter = window.innerHeight * 0.5;
    let bestDist = Infinity;
    let bestIndex = active;

    steps.forEach((step, i) => {
      const rect = step.getBoundingClientRect();
      const stepCenter = rect.top + rect.height * 0.5;
      const dist = Math.abs(stepCenter - vpCenter);
      if (dist < bestDist) {
        bestDist = dist;
        bestIndex = i;
      }
    });

    setActive(bestIndex);
  }

  // ── Attach to Lenis — fires on every scroll tick ──────────────────
  // Lenis may not be ready immediately (main.js initialises it after
  // DOMContentLoaded + CDN load). Poll until it exists, then subscribe.
  let listenAttached = false;

  function tryAttachLenis() {
    if (window.__lenis && !listenAttached) {
      listenAttached = true;
      window.__lenis.on('scroll', findActiveStep);
      findActiveStep(); // set initial state
    } else if (!listenAttached) {
      setTimeout(tryAttachLenis, 80);
    }
  }

  // Also listen to native scroll as a fallback (same-tab file:// usage)
  window.addEventListener('scroll', findActiveStep, { passive: true });

  tryAttachLenis();
  // Run once immediately in case page is already scrolled
  findActiveStep();

  // ── Dot clicks: scroll to that step smoothly via Lenis ───────────
  dotBtns.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const step = steps[i];
      if (!step) return;

      const rect = step.getBoundingClientRect();
      const targetY = window.scrollY + rect.top - window.innerHeight * 0.5 + rect.height * 0.5;

      if (window.__lenis) {
        window.__lenis.scrollTo(Math.max(0, targetY), {
          duration: 1.4,
          easing: t => 1 - Math.pow(1 - t, 3),
        });
      } else {
        window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
      }
    });
  });
});
