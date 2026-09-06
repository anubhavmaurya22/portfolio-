// ============================================
// Anubhav Maurya — Portfolio JavaScript
// ============================================

// --- Interactive Particle Background ---
const canvas = document.getElementById('canvas-particles');
const ctx = canvas.getContext('2d');
let particles = [];
const mouse = { x: null, y: null, radius: 150 };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.init();
  }
  init() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.3 + 0.05;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = (Math.random() * 30) + 1;
  }
  update() {
    if (mouse.x !== null) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < mouse.radius) {
        let force = (mouse.radius - distance) / mouse.radius;
        this.x -= (dx / distance) * force * this.density * 0.6;
        this.y -= (dy / distance) * force * this.density * 0.6;
      } else {
        if (this.x !== this.baseX) this.x -= (this.x - this.baseX) / 20;
        if (this.y !== this.baseY) this.y -= (this.y - this.baseY) / 20;
      }
    }
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x > canvas.width) this.x = 0;
    if (this.x < 0) this.x = canvas.width;
    if (this.y > canvas.height) this.y = 0;
    if (this.y < 0) this.y = canvas.height;
    this.baseX += this.speedX;
    this.baseY += this.speedY;
  }
  draw() {
    ctx.fillStyle = `rgba(77, 142, 255, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(Math.floor((canvas.width * canvas.height) / 18000), 120);
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

let animationId;
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  animationId = requestAnimationFrame(animateParticles);
}

// --- Scroll Reveal ---
function setupScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// --- Active Nav Link on Scroll ---
function setupActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#nav-links a:not(.btn)');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-64px 0px -40% 0px' });

  sections.forEach(section => observer.observe(section));
}

// --- Mobile Menu ---
function setupMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const icon = document.getElementById('menu-icon');
  const mobileLinks = mobileNav.querySelectorAll('a');

  toggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      mobileNav.classList.add('open');
      icon.textContent = 'close';
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  function closeMobileMenu() {
    mobileNav.classList.remove('open');
    icon.textContent = 'menu';
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      closeMobileMenu();
    }
  });
}

// --- Case Study Modals ---
function openCaseStudy(id) {
  const modal = document.getElementById(`modal-${id}`);
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Focus the close button
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) setTimeout(() => closeBtn.focus(), 100);
}

function closeCaseStudy(id) {
  const modal = document.getElementById(`modal-${id}`);
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay') && e.target.classList.contains('open')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// Close modal on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(modal => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
});

// --- 3D Tilt Effect ---
function setupTiltEffect() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.tilt-card, .glass-panel').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 25;
      const rotateY = (centerX - x) / 25;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// --- Dynamic Copyright Year ---
function setFooterYear() {
  const el = document.getElementById('footer-copy');
  if (el) {
    el.textContent = `© ${new Date().getFullYear()} Anubhav Maurya. All rights reserved.`;
  }
}

// --- Mouse Events ---
window.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; });
window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

// --- Reduced Motion Support ---
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// --- Initialize ---
document.addEventListener('DOMContentLoaded', () => {
  setFooterYear();
  setupScrollReveal();
  setupActiveNav();
  setupMobileMenu();

  if (!prefersReducedMotion.matches) {
    resizeCanvas();
    initParticles();
    animateParticles();
    setupTiltEffect();
  }
});

// Make modal functions globally available
window.openCaseStudy = openCaseStudy;
window.closeCaseStudy = closeCaseStudy;
