/* ==============================================
   CUSTOM CURSOR
=============================================== */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (cursorDot && cursorRing) {
  let ringX = 0, ringY = 0, dotX = 0, dotY = 0;

  window.addEventListener('mousemove', (e) => {
    dotX = e.clientX; dotY = e.clientY;
    cursorDot.style.left  = dotX + 'px';
    cursorDot.style.top   = dotY + 'px';
  });

  function animateRing() {
    ringX += (dotX - ringX) * 0.12;
    ringY += (dotY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .acc-btn, .skill-card, .contact-card, .edu-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
  });
}

/* ==============================================
   HERO CANVAS — Particle Network
=============================================== */
function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  let mouse = { x: -1000, y: -1000 };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.init(); }
    init() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.r  = Math.random() * 1.8 + 0.6;
      this.a  = Math.random() * 0.35 + 0.08;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Soft mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 120) {
        const force = (120 - d) / 120;
        this.x += (dx / d) * force * 2.5;
        this.y += (dy / d) * force * 2.5;
      }

      if (this.x < 0)  { this.x = 0;  this.vx *= -1; }
      if (this.x > W)  { this.x = W;  this.vx *= -1; }
      if (this.y < 0)  { this.y = 0;  this.vy *= -1; }
      if (this.y > H)  { this.y = H;  this.vy *= -1; }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(30,30,30,${this.a})`;
      ctx.fill();
    }
  }

  // Abstract rotating rings in background
  let angle = 0;
  function drawRings() {
    const cx = W / 2, cy = H / 2;
    const rings = [
      { r: Math.min(W, H) * 0.38, a: 0.025, dash: [12, 28], speed: 0.0004 },
      { r: Math.min(W, H) * 0.26, a: 0.04,  dash: [6, 22],  speed: -0.0007 },
      { r: Math.min(W, H) * 0.50, a: 0.015, dash: [20, 40],  speed: 0.0002 },
    ];
    rings.forEach((ring, i) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle * ring.speed * 1000 + i);
      ctx.strokeStyle = `rgba(30,30,30,${ring.a})`;
      ctx.lineWidth = 1;
      ctx.setLineDash(ring.dash);
      ctx.beginPath();
      ctx.arc(0, 0, ring.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawConnections() {
    const maxD = 160;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < maxD) {
          const alpha = (1 - d / maxD) * 0.1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(30,30,30,${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.setLineDash([]);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    angle += 0.01;
    drawRings();
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }

  function init() {
    resize();
    particles = [];
    const count = Math.min(70, Math.floor((W * H) / 9000));
    for (let i = 0; i < count; i++) particles.push(new Particle());
    animate();
  }

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('resize', () => { resize(); particles.forEach(p => p.init()); });

  init();
}

/* ==============================================
   HERO LETTER ANIMATION
=============================================== */
function animateHeroLetters() {
  const letters = document.querySelectorAll('.hero-name .c');
  letters.forEach((c, i) => {
    setTimeout(() => {
      c.style.transition = `transform 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.6s cubic-bezier(0.4,0,0.2,1)`;
      c.style.opacity   = '1';
      c.style.transform = 'translateY(0)';
    }, 400 + i * 55);
  });
}

/* ==============================================
   NAVBAR
=============================================== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ==============================================
   MOBILE MENU
=============================================== */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
const mobileLang  = document.getElementById('mobileLang');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
  mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

/* ==============================================
   LANGUAGE TOGGLE
=============================================== */
let lang = 'en';

function setLang(l) {
  lang = l;
  const label = l === 'en' ? 'TR' : 'EN';
  document.getElementById('langToggle').textContent = label;
  if (mobileLang) mobileLang.textContent = label;
  document.documentElement.lang = l;

  document.querySelectorAll('[data-en][data-tr]').forEach(el => {
    const txt = el.getAttribute(`data-${l}`);
    if (!txt) return;
    if (txt.includes('<br')) { el.innerHTML = txt; }
    else { el.textContent = txt; }
  });
}

document.getElementById('langToggle').addEventListener('click', () => setLang(lang === 'en' ? 'tr' : 'en'));
if (mobileLang) mobileLang.addEventListener('click', () => setLang(lang === 'en' ? 'tr' : 'en'));

/* ==============================================
   ACCORDION
=============================================== */
document.querySelectorAll('.acc-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.acc-item');
    const isActive = item.classList.contains('active');

    // Close siblings in same accordion
    const siblings = btn.closest('.accordion').querySelectorAll('.acc-item');
    siblings.forEach(s => s.classList.remove('active'));

    if (!isActive) item.classList.add('active');
  });
});

/* ==============================================
   SCROLL REVEAL
=============================================== */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ==============================================
   COUNTER ANIMATION
=============================================== */
function countUp(el, target) {
  let n = 0;
  const step = target / 60;
  const tick = () => {
    n = Math.min(n + step, target);
    el.textContent = Math.floor(n);
    if (n < target) requestAnimationFrame(tick);
    else el.textContent = target;
  };
  requestAnimationFrame(tick);
}

const statsObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(el => {
        countUp(el, parseInt(el.getAttribute('data-target'), 10));
      });
      statsObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsEl = document.querySelector('.about-stats');
if (statsEl) statsObs.observe(statsEl);

/* ==============================================
   SKILL BAR ANIMATION
=============================================== */
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        const w = bar.getAttribute('data-width');
        setTimeout(() => { bar.style.width = w + '%'; }, 200);
      });
      skillObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

const skillsGrid = document.querySelector('.skills-grid');
if (skillsGrid) skillObs.observe(skillsGrid);

/* ==============================================
   ACTIVE NAV LINK
=============================================== */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(a => {
        const active = a.getAttribute('href') === `#${id}`;
        a.style.color = active ? 'var(--dark)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObs.observe(s));

/* ==============================================
   INIT
=============================================== */
window.addEventListener('load', () => {
  initCanvas();
  animateHeroLetters();
});
