/* ──────────────────────────────────────────────────────────────────
   Portfolio page — filter + modal
   ────────────────────────────────────────────────────────────────── */

const projects = [
  {
    id: '1',
    title: 'Kambo Hair Salon',
    category: 'Beauty',
    image: 'assets/images/portfolio_salon.jpg',
    description: 'Premium salon website showcasing services and an elegant customer booking experience.',
    tech: ['React', 'TailwindCSS', 'Framer Motion'],
    details: {
      overview: 'Kambo Hair Salon needed a digital presence that matched their premium in-store experience.',
      challenge: 'The previous site was slow, outdated, and made booking difficult for clients.',
      solution: 'Developed a completely bespoke, highly performant React SPA with smooth animations that guide the user towards booking.',
      results: 'Increased online bookings by 45% in the first two months post-launch.',
    },
  },
  {
    id: '2',
    title: 'Aura Hospitality',
    category: 'Hospitality',
    image: 'assets/images/portfolio_hotel.jpg',
    description: 'Luxury hospitality website designed to immerse visitors in premium resort experiences.',
    tech: ['Next.js', 'TypeScript', 'GSAP'],
    details: {
      overview: 'Aura Hospitality manages boutique luxury resorts and needed a unified brand platform.',
      challenge: 'Showcasing high-resolution imagery and video without compromising on load times.',
      solution: 'Implemented aggressive image optimization and lazy loading techniques with a clean, minimalist UI.',
      results: 'Achieved a 98/100 Lighthouse performance score while delivering a rich media experience.',
    },
  },
  {
    id: '3',
    title: 'YachtAid Global',
    category: 'Luxury',
    image: 'assets/images/portfolio_yacht.jpg',
    description: 'High-end marine service website focused on luxury branding and global outreach.',
    tech: ['WordPress', 'Custom Theme', 'PHP'],
    details: {
      overview: 'A specialized agency providing elite services for superyacht owners globally.',
      challenge: 'Creating a highly secure, private client portal integrated into a marketing site.',
      solution: 'Built a custom WordPress theme from scratch with robust custom post types and restricted areas.',
      results: 'Streamlined their client onboarding process and elevated their digital brand authority.',
    },
  },
  {
    id: '4',
    title: 'Lumina Dining',
    category: 'Food',
    image: 'assets/images/portfolio_restaurant.jpg',
    description: 'Modern restaurant website showcasing menu offerings and ambient dining experience.',
    tech: ['React', 'TailwindCSS', 'Supabase'],
    details: {
      overview: 'A new fine-dining establishment needing to generate buzz before opening.',
      challenge: 'Translating the physical atmosphere of the restaurant into a digital format.',
      solution: 'Used dark modes, elegant typography, and subtle scroll effects to mimic the restaurant\'s lighting.',
      results: 'Fully booked reservations for the first 3 weeks based entirely on the website experience.',
    },
  },
  {
    id: '5',
    title: 'Smile Advanced Dental',
    category: 'Healthcare',
    image: 'assets/images/portfolio_dental.jpg',
    description: 'Professional healthcare site building patient trust with clean, accessible design.',
    tech: ['HTML5', 'SCSS', 'Vanilla JS'],
    details: {
      overview: 'A modern dental clinic upgrading their patient acquisition funnel.',
      challenge: 'Making complex dental procedures easy to understand and unintimidating.',
      solution: 'Created a bright, welcoming interface with clear visual hierarchies and easy-to-read content blocks.',
      results: 'Reduced bounce rate by 30% and increased time-on-page by 2 minutes.',
    },
  },
  {
    id: '6',
    title: 'Vertex Real Estate',
    category: 'Property',
    image: 'assets/images/portfolio_realestate.jpg',
    description: 'Modern property website showcasing high-end listings with virtual tour integrations.',
    tech: ['Next.js', 'Prisma', 'Mapbox'],
    details: {
      overview: 'A boutique real estate agency specializing in luxury modern homes.',
      challenge: 'Integrating complex map data and multiple high-res image galleries per listing.',
      solution: 'Built a robust Next.js application with efficient data fetching and mapping integrations.',
      results: 'Agents reported clients spending significantly more time browsing properties before calling.',
    },
  },
  {
    id: '7',
    title: 'IronCore Fitness',
    category: 'Fitness',
    image: 'assets/images/portfolio_gym.jpg',
    description: 'Powerful fitness website showcasing training programs and digital memberships.',
    tech: ['React', 'Stripe API', 'Node.js'],
    details: {
      overview: 'A high-end gym looking to sell digital training programs.',
      challenge: 'Building a seamless checkout flow for digital subscriptions.',
      solution: 'Integrated Stripe for frictionless payments within a highly motivational, visually bold UI.',
      results: 'Successfully launched their digital tier, acquiring 500+ subscribers in month one.',
    },
  },
];

let activeFilter = 'All';
let selectedProject = null;

document.addEventListener('DOMContentLoaded', () => {
  renderPortfolio();
  initFilters();
  initModal();
});

function renderPortfolio() {
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  filtered.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'portfolio-card reveal';
    card.style.transitionDelay = (i * 0.06) + 's';
    card.dataset.id = p.id;
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}" loading="lazy" />
      <div class="portfolio-card-overlay"></div>
      <div class="portfolio-card-info">
        <span class="cat-badge">${p.category}</span>
        <h3>${p.title}</h3>
        <p class="card-desc">${p.description}</p>
        <div class="tech-tags">
          ${p.tech.slice(0, 2).map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
      </div>
    `;
    card.addEventListener('click', () => openModal(p));
    grid.appendChild(card);
  });

  // Re-trigger reveal observer for new cards
  requestAnimationFrame(() => {
    const revealEls = grid.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
      });
    }, { threshold: .1 });
    revealEls.forEach(el => obs.observe(el));
  });
}

function initFilters() {
  const btns = document.querySelectorAll('.filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderPortfolio();
    });
  });
}

function openModal(project) {
  selectedProject = project;
  const modal = document.getElementById('project-modal');
  document.getElementById('modal-img').src = project.image;
  document.getElementById('modal-img').alt = project.title;
  document.getElementById('modal-cat').textContent = project.category;
  document.getElementById('modal-title').textContent = project.title;
  document.getElementById('modal-overview').textContent = project.details.overview;
  document.getElementById('modal-challenge').textContent = project.details.challenge;
  document.getElementById('modal-solution').textContent = project.details.solution;
  document.getElementById('modal-results').textContent = project.details.results;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (window.__lenis) window.__lenis.stop();
}

function closeModal() {
  const modal = document.getElementById('project-modal');
  modal.classList.remove('open');
  document.body.style.overflow = '';
  if (window.__lenis) window.__lenis.start();
}

function initModal() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close');
  const backdrop = document.getElementById('modal-backdrop');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}
