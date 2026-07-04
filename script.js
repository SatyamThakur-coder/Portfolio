/* ═══════════════════════════════════════════
   KUMAR SATYAM — PORTFOLIO JAVASCRIPT
═══════════════════════════════════════════ */

'use strict';

/* ── LOADER ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1200);
});

/* ── CUSTOM CURSOR ── */
const dot     = document.getElementById('cursor-dot');
const outline = document.getElementById('cursor-outline');

let mouseX = 0, mouseY = 0;
let outX   = 0, outY   = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

function animateOutline() {
  outX += (mouseX - outX) * 0.12;
  outY += (mouseY - outY) * 0.12;
  outline.style.left = outX + 'px';
  outline.style.top  = outY + 'px';
  requestAnimationFrame(animateOutline);
}
animateOutline();

/* ── PARTICLE CANVAS ── */
const canvas = document.getElementById('particles-canvas');
const ctx    = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const PARTICLE_COUNT = 80;
const COLORS = ['rgba(168,85,247,', 'rgba(59,130,246,', 'rgba(20,184,166,'];

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x    = Math.random() * canvas.width;
    this.y    = Math.random() * canvas.height;
    this.vx   = (Math.random() - 0.5) * 0.5;
    this.vy   = (Math.random() - 0.5) * 0.5;
    this.r    = Math.random() * 1.8 + 0.5;
    this.col  = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.alpha= Math.random() * 0.5 + 0.1;
    this.life = 0;
    this.maxLife = Math.random() * 300 + 200;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    if (this.life > this.maxLife || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.col + this.alpha + ')';
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(168,85,247,${0.08 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ── NAVBAR SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');

  updateActiveNav();

  const backTop = document.getElementById('back-to-top');
  if (window.scrollY > 400) backTop.classList.add('visible');
  else backTop.classList.remove('visible');
});

/* ── ACTIVE NAV LINK ── */
function updateActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  const scrollPos = window.scrollY + 120;

  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const height = sec.offsetHeight;
    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}

/* ── HAMBURGER MENU ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── TYPED TEXT ── */
const typedEl = document.getElementById('typed-text');
const words   = [
  'Software Developer',
  'Full Stack Developer',
  'AI/ML Engineer',
  'Python Developer',
  'React Developer',
  'Problem Solver'
];
let wordIdx = 0, charIdx = 0, isDeleting = false;

function typeEffect() {
  const current = words[wordIdx];
  typedEl.textContent = isDeleting
    ? current.substring(0, charIdx - 1)
    : current.substring(0, charIdx + 1);

  charIdx = isDeleting ? charIdx - 1 : charIdx + 1;

  let speed = isDeleting ? 60 : 100;

  if (!isDeleting && charIdx === current.length) {
    speed = 1800;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    wordIdx = (wordIdx + 1) % words.length;
    speed = 400;
  }
  setTimeout(typeEffect, speed);
}
typeEffect();

/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── SKILL BARS ── */
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll('.skill-bar-fill');
      fills.forEach(fill => {
        const target = fill.getAttribute('data-width');
        fill.style.width = target + '%';
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(el => barObserver.observe(el));

/* ── BACK TO TOP ── */
document.getElementById('back-to-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── SMOOTH SCROLL FOR NAV LINKS ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── CONTACT FORM ── */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  const success = document.getElementById('form-success');
  const form = document.getElementById('contact-form');

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
    btn.style.background = 'linear-gradient(135deg,#14b8a6,#0d9488)';
    success.classList.remove('hidden');

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.style.background = '';
      btn.disabled = false;
      success.classList.add('hidden');
      form.reset();
    }, 3500);
  }, 1500);
}

/* ── CARD TILT EFFECT ── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect  = card.getBoundingClientRect();
    const x     = e.clientX - rect.left;
    const y     = e.clientY - rect.top;
    const cx    = rect.width  / 2;
    const cy    = rect.height / 2;
    const rotX  = ((y - cy) / cy) * -8;
    const rotY  = ((x - cx) / cx) *  8;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── COUNTING ANIMATION FOR STATS ── */
function animateCount(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target + (el.dataset.suffix || '');
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + (el.dataset.suffix || '');
    }
  }, 16);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(num => {
        const val = parseFloat(num.textContent);
        if (!isNaN(val)) animateCount(num, val);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ── GLOWING CURSOR INTERACTION ON CANVAS ── */
let canvasMouseX = -1000, canvasMouseY = -1000;
document.addEventListener('mousemove', e => {
  canvasMouseX = e.clientX;
  canvasMouseY = e.clientY;
});

/* ── NAVBAR HIDE ON SCROLL DOWN (mobile) ── */
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const curr = window.scrollY;
  if (window.innerWidth <= 768) {
    if (curr > lastScroll && curr > 100) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
  }
  lastScroll = curr;
});

/* ── ADD GLOW HOVER TO INTEREST ITEMS ── */
document.querySelectorAll('.interest-item').forEach((item, i) => {
  const colors = ['#a855f7','#3b82f6','#14b8a6','#ec4899','#f59e0b','#10b981'];
  item.addEventListener('mouseenter', () => {
    item.querySelector('.interest-icon').style.background = `${colors[i % colors.length]}30`;
    item.querySelector('.interest-icon').style.color = colors[i % colors.length];
    item.querySelector('.interest-icon').style.borderColor = colors[i % colors.length];
  });
  item.addEventListener('mouseleave', () => {
    item.querySelector('.interest-icon').style.background = '';
    item.querySelector('.interest-icon').style.color = '';
    item.querySelector('.interest-icon').style.borderColor = '';
  });
});

console.log('%c👨‍💻 Kumar Satyam Portfolio', 'color:#a855f7;font-size:18px;font-weight:bold;');
console.log('%cBuilt with HTML, CSS & JavaScript', 'color:#3b82f6;font-size:13px;');
