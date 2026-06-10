/* =============================================
   PVSK Portfolio — Main Script
============================================= */

/* ---- Page Loader ---- */
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => loader.classList.add('loaded'), 600);
  }
});

/* ---- Navbar ---- */
const navbar   = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu  = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveLink();
  toggleBackTop();
}, { passive: true });

navToggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  navToggle.classList.toggle('active', open);
  navToggle.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});

navMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

/* ---- Smooth Scroll ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- Back to Top ---- */
const backTop = document.getElementById('back-top');
function toggleBackTop() {
  if (!backTop) return;
  backTop.hidden = window.scrollY < 400;
}
backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---- Typed Text ---- */
const typedEl = document.getElementById('typed-text');
const typedPhrases = [
  'scalable backend systems',
  'full-stack products',
  'mobile apps at scale',
  'clean REST APIs',
  'things that ship',
];
let phraseIdx = 0, charIdx = 0, deleting = false;

function type() {
  if (!typedEl) return;
  const phrase = typedPhrases[phraseIdx];
  if (!deleting) {
    typedEl.textContent = phrase.slice(0, ++charIdx);
    if (charIdx === phrase.length) {
      deleting = true;
      setTimeout(type, 2000);
      return;
    }
  } else {
    typedEl.textContent = phrase.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % typedPhrases.length;
    }
  }
  setTimeout(type, deleting ? 45 : 95);
}
setTimeout(type, 1200);

/* ---- Counter Animation ---- */
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.querySelector('span')?.outerHTML || '';
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.innerHTML = Math.floor(current) + suffix;
    if (current >= target) clearInterval(timer);
  }, 16);
}

/* ---- Skill Bar Animation ---- */
function animateSkillBars(parent) {
  parent.querySelectorAll('.sbar-fill').forEach(bar => {
    const w = bar.dataset.w;
    bar.style.width = w + '%';
    bar.classList.add('animated');
  });
}

/* ---- Intersection Observer: Scroll Reveals ---- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);

        /* trigger counters inside hero stats */
        entry.target.querySelectorAll('.hstat-num[data-count]').forEach(animateCounter);

        /* trigger skill bars if inside bento card */
        if (entry.target.classList.contains('bcard')) {
          animateSkillBars(entry.target);
        }
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll(
  '.reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale'
).forEach(el => revealObserver.observe(el));

/* Also observe the stats bar separately for counters */
const statsBar = document.querySelector('.hero-stats-bar');
if (statsBar) {
  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.hstat-num[data-count]').forEach(animateCounter);
        statsObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  statsObs.observe(statsBar);
}

/* ---- Particle System — deferred until idle so it never blocks paint ---- */
function createParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  const colors = [
    'rgba(99,102,241,0.5)',
    'rgba(139,92,246,0.4)',
    'rgba(6,182,212,0.3)',
    'rgba(167,139,250,0.4)',
  ];
  const count = window.innerWidth < 768 ? 8 : 16;
  const frag = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    dot.className = 'particle';
    const size = Math.random() * 4 + 2;
    dot.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;background:${colors[i%colors.length]};animation-duration:${Math.random()*12+8}s;animation-delay:${Math.random()*10}s;`;
    frag.appendChild(dot);
  }
  container.appendChild(frag);
}

if ('requestIdleCallback' in window) {
  requestIdleCallback(createParticles, { timeout: 2000 });
} else {
  setTimeout(createParticles, 500);
}

/* ---- Contact Form ---- */
const contactForm = document.getElementById('contact-form');
const formStatus  = document.getElementById('form-status');

contactForm?.addEventListener('submit', e => {
  e.preventDefault();
  const name    = document.getElementById('c-name')?.value.trim();
  const email   = document.getElementById('c-email')?.value.trim();
  const message = document.getElementById('c-message')?.value.trim();

  if (!name || !email || !message) {
    showStatus('Please fill in all required fields.', 'error');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showStatus('Please enter a valid email address.', 'error');
    return;
  }

  /* Simulate send — replace with real backend / EmailJS */
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Sending...';

  setTimeout(() => {
    showStatus('Message sent! I\'ll get back to you soon.', 'success');
    contactForm.reset();
    btn.disabled = false;
    btn.innerHTML = 'Send Message <i class="fas fa-paper-plane" aria-hidden="true"></i>';
  }, 1200);
});

function showStatus(msg, type) {
  if (!formStatus) return;
  formStatus.textContent = msg;
  formStatus.className = `cform-status ${type}`;
  setTimeout(() => {
    formStatus.className = 'cform-status';
  }, 5000);
}

/* ---- Navbar active on load ---- */
updateActiveLink();

/* ---- Log ---- */
console.log('%cPVSK Portfolio Loaded ✓', 'color:#6366f1;font-weight:900;font-size:16px;');
