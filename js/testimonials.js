/* ──────────────────────────────────────────────────────────────────
   Testimonials page — auto-advancing carousel
   ────────────────────────────────────────────────────────────────── */

const testimonials = [
  { id: 1, name: 'Ayesha Tariq', business: 'Bloom Hair & Beauty Studio', role: 'Owner', rating: 5, review: 'Working with Hamza was one of the best decisions I made for my salon. He delivered a stunning website that perfectly captures the aesthetic of my brand. Bookings went up noticeably in the first month alone.' },
  { id: 2, name: 'Bilal Rehan', business: 'Grand Seasons Hotel', role: 'General Manager', rating: 5, review: 'We needed a website that matched the premium experience we offer guests, and Hamza delivered exactly that. The design is elegant, the booking section is smooth, and the site loads incredibly fast.' },
  { id: 3, name: 'Fatima Zuberi', business: 'Spice Route Restaurant', role: 'Co-Founder', rating: 5, review: 'I showed Hamza my vision for a modern restaurant website and he executed it flawlessly. The menu layout, gallery, and overall feel are exactly what I wanted. Customers keep complimenting it.' },
  { id: 4, name: 'Dr. Usman Khalid', business: 'ClearSmile Dental Clinic', role: 'Lead Dentist', rating: 5, review: 'Our old website was outdated and losing us potential patients. Hamza rebuilt it from scratch — clean, professional, and easy to navigate. New patient inquiries through the website have improved significantly.' },
  { id: 5, name: 'Omar Siddiqui', business: 'Skyline Properties', role: 'Director', rating: 5, review: 'Hamza built our property listings website with a great eye for detail. The search and filter features work smoothly, the design looks premium, and it works beautifully on mobile. Highly professional throughout.' },
  { id: 6, name: 'Noman Hussain', business: 'IronEdge Gym', role: 'Owner', rating: 5, review: 'The website Hamza built for my gym is bold, energetic, and exactly on-brand. The membership plans section converts well and the site loads fast on mobile, which is where most of our visitors come from.' },
  { id: 7, name: 'Sarah Javed', business: 'Zen Wellness Spa', role: 'Founder', rating: 5, review: 'From the first call to final delivery, Hamza was professional, communicative, and genuinely invested in getting it right. The website has a calming, luxurious feel that perfectly reflects our brand.' },
  { id: 8, name: 'Hassan Mirza', business: 'TechNest Solutions', role: 'CEO', rating: 5, review: 'We needed a sharp, credible web presence fast. Hamza delivered a polished website ahead of schedule. His attention to performance and design details shows he truly cares about the quality of his work.' },
  { id: 9, name: 'Rabia Farooq', business: 'Little Stars Academy', role: 'Principal', rating: 5, review: 'Hamza created a warm, welcoming website for our school that parents absolutely love. The gallery, admissions section, and contact form all work perfectly. He was patient with every revision and always responsive.' },
  { id: 10, name: 'Kamran Ashraf', business: 'Urban Threads Clothing', role: 'Brand Manager', rating: 5, review: 'Our e-commerce store looks fantastic and is easy for customers to navigate. Hamza made sure the product pages, cart, and checkout were all smooth. Sales through the site improved after launch.' },
  { id: 11, name: 'Zara Qureshi', business: 'Aroma Kitchen & Café', role: 'Owner', rating: 5, review: 'I had a very specific vision for how I wanted my café\'s website to look, and Hamza brought it to life better than I imagined. The food photography layout is gorgeous and the site feels very premium.' },
  { id: 12, name: 'Imran Butt', business: 'SwiftCargo Logistics', role: 'Operations Head', rating: 5, review: 'Hamza redesigned our company website and the result was a clean, professional platform that accurately represents our brand. The service detail pages and contact system work great. Highly recommended.' },
];

let current = 0;
let paused = false;
let direction = 1;
let timer = null;

document.addEventListener('DOMContentLoaded', () => {
  buildSlides();
  buildDots();
  goTo(0);
  startTimer();
  bindControls();
});

function buildSlides() {
  const window_ = document.getElementById('testimonial-window');
  if (!window_) return;
  window_.innerHTML = '';
  testimonials.forEach((t, i) => {
    const slide = document.createElement('div');
    slide.className = 'testimonial-slide' + (i === 0 ? ' active' : '');
    slide.dataset.index = i;
    slide.innerHTML = `
      <div class="testimonial-card">
        <div class="quote-icon">&ldquo;</div>
        <div class="stars">${'★'.repeat(t.rating)}</div>
        <p class="testimonial-text">"${t.review}"</p>
        <div class="testimonial-author">
          <h4>${t.name}</h4>
          <p>${t.role} — ${t.business}</p>
        </div>
      </div>
    `;
    window_.appendChild(slide);
  });
}

function buildDots() {
  const container = document.getElementById('carousel-dots');
  if (!container) return;
  container.innerHTML = '';
  testimonials.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => {
      direction = i > current ? 1 : -1;
      goTo(i);
    });
    container.appendChild(dot);
  });
}

function goTo(index) {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  const counter = document.getElementById('carousel-counter');

  // Exit current
  slides[current].classList.remove('active');
  slides[current].classList.add(direction > 0 ? 'exit-left' : 'exit-right');

  setTimeout(() => { slides[current].classList.remove('exit-left', 'exit-right'); }, 400);

  current = ((index % testimonials.length) + testimonials.length) % testimonials.length;

  // Enter new
  slides[current].style.transform = direction > 0 ? 'translateX(80px)' : 'translateX(-80px)';
  slides[current].classList.add('active');
  requestAnimationFrame(() => {
    slides[current].style.transform = '';
  });

  // Dots
  dots.forEach((d, i) => d.classList.toggle('active', i === current));

  // Counter
  if (counter) counter.textContent = `${current + 1} / ${testimonials.length}`;

  resetTimer();
}

function startTimer() {
  timer = setInterval(() => {
    if (!paused) { direction = 1; goTo(current + 1); }
  }, 6000);
}

function resetTimer() {
  clearInterval(timer);
  if (!paused) startTimer();
}

function bindControls() {
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const wrap = document.querySelector('.testimonial-carousel');

  if (prevBtn) prevBtn.addEventListener('click', () => { direction = -1; goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', () => { direction = 1; goTo(current + 1); });

  if (wrap) {
    wrap.addEventListener('mouseenter', () => { paused = true; });
    wrap.addEventListener('mouseleave', () => { paused = false; });
  }
}
