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
   HERO CANVAS — Enhanced Background
=============================================== */
function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], triangles = [], floatingDots = [];
  let mouse = { x: -1000, y: -1000 };
  let tick = 0;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  /* --- Particles --- */
  class Particle {
    constructor() { this.init(); }
    init() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.55;
      this.vy = (Math.random() - 0.5) * 0.55;
      this.r  = Math.random() * 2.2 + 0.5;
      this.a  = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 130) {
        const f = (130 - d) / 130;
        this.x += (dx / d) * f * 3;
        this.y += (dy / d) * f * 3;
      }
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
      this.x = Math.max(0, Math.min(W, this.x));
      this.y = Math.max(0, Math.min(H, this.y));
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(20,20,20,${this.a})`;
      ctx.fill();
    }
  }

  /* --- Floating Triangles --- */
  class Triangle {
    constructor() { this.init(); }
    init() {
      this.x    = Math.random() * W;
      this.y    = Math.random() * H;
      this.size = Math.random() * 22 + 7;
      this.vx   = (Math.random() - 0.5) * 0.25;
      this.vy   = (Math.random() - 0.5) * 0.25;
      this.rot  = Math.random() * Math.PI * 2;
      this.rs   = (Math.random() - 0.5) * 0.008;
      this.a    = Math.random() * 0.07 + 0.025;
    }
    update() {
      this.x   += this.vx;
      this.y   += this.vy;
      this.rot += this.rs;
      if (this.x < -60) this.x = W + 60;
      if (this.x > W + 60) this.x = -60;
      if (this.y < -60) this.y = H + 60;
      if (this.y > H + 60) this.y = -60;
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.strokeStyle = `rgba(20,20,20,${this.a})`;
      ctx.lineWidth = 0.8;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.lineTo(this.size * 0.866, this.size * 0.5);
      ctx.lineTo(-this.size * 0.866, this.size * 0.5);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  }

  /* --- Floating Squares --- */
  class Square {
    constructor() { this.init(); }
    init() {
      this.x    = Math.random() * W;
      this.y    = Math.random() * H;
      this.size = Math.random() * 16 + 5;
      this.vx   = (Math.random() - 0.5) * 0.2;
      this.vy   = (Math.random() - 0.5) * 0.2;
      this.rot  = Math.random() * Math.PI * 2;
      this.rs   = (Math.random() - 0.5) * 0.006;
      this.a    = Math.random() * 0.055 + 0.015;
    }
    update() {
      this.x   += this.vx;
      this.y   += this.vy;
      this.rot += this.rs;
      if (this.x < -60) this.x = W + 60;
      if (this.x > W + 60) this.x = -60;
      if (this.y < -60) this.y = H + 60;
      if (this.y > H + 60) this.y = -60;
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.strokeStyle = `rgba(20,20,20,${this.a})`;
      ctx.lineWidth = 0.7;
      ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
      ctx.restore();
    }
  }

  /* --- Rings --- */
  const RINGS = [
    { rFac: 0.42, a: 0.035, dash: [14, 30], spd:  0.00035 },
    { rFac: 0.28, a: 0.055, dash: [5,  18], spd: -0.0007  },
    { rFac: 0.56, a: 0.020, dash: [22, 45], spd:  0.00020 },
    { rFac: 0.68, a: 0.012, dash: [8,  35], spd: -0.00015 },
    { rFac: 0.16, a: 0.04,  dash: [3,  12], spd:  0.0009  },
    { rFac: 0.80, a: 0.008, dash: [30, 60], spd:  0.0001  },
  ];

  function drawRings() {
    const cx = W / 2, cy = H / 2;
    RINGS.forEach((ring, i) => {
      const r = Math.min(W, H) * ring.rFac;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(tick * ring.spd * 60 + i);
      ctx.strokeStyle = `rgba(20,20,20,${ring.a})`;
      ctx.lineWidth = 1;
      ctx.setLineDash(ring.dash);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });
  }

  /* --- Cross / Grid marks (subtle) --- */
  function drawGrid() {
    const spacing = 90;
    const cols = Math.ceil(W / spacing) + 1;
    const rows = Math.ceil(H / spacing) + 1;
    const offsetX = (tick * 0.12) % spacing;
    const offsetY = (tick * 0.08) % spacing;
    ctx.strokeStyle = 'rgba(20,20,20,0.04)';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([]);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * spacing - offsetX;
        const y = j * spacing - offsetY;
        const sz = 4;
        ctx.beginPath();
        ctx.moveTo(x - sz, y); ctx.lineTo(x + sz, y);
        ctx.moveTo(x, y - sz); ctx.lineTo(x, y + sz);
        ctx.stroke();
      }
    }
  }

  /* --- Connections --- */
  function drawConnections() {
    const maxD = 170;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < maxD) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(20,20,20,${(1 - d / maxD) * 0.12})`;
          ctx.lineWidth = 0.7;
          ctx.setLineDash([]);
          ctx.stroke();
        }
      }
    }
  }

  /* --- Wave lines at bottom --- */
  function drawWaves() {
    for (let w = 0; w < 3; w++) {
      ctx.beginPath();
      ctx.setLineDash([]);
      const amp   = 18 + w * 10;
      const freq  = 0.006 - w * 0.001;
      const phase = tick * (0.015 - w * 0.004) + w * 1.2;
      const yBase = H * (0.78 + w * 0.07);
      ctx.strokeStyle = `rgba(20,20,20,${0.035 - w * 0.008})`;
      ctx.lineWidth = 1;
      ctx.moveTo(0, yBase + Math.sin(phase) * amp);
      for (let x = 0; x < W; x += 4) {
        ctx.lineTo(x, yBase + Math.sin(x * freq + phase) * amp);
      }
      ctx.stroke();
    }
  }

  /* --- Animate --- */
  function animate() {
    ctx.clearRect(0, 0, W, H);
    tick++;
    drawGrid();
    drawWaves();
    drawRings();
    triangles.forEach(t => { t.update(); t.draw(); });
    floatingDots.forEach(s => { s.update(); s.draw(); });
    particles.forEach(p  => { p.update();  p.draw();  });
    drawConnections();
    requestAnimationFrame(animate);
  }

  function init() {
    resize();
    particles    = [];
    triangles    = [];
    floatingDots = [];
    const pCount = Math.min(110, Math.floor((W * H) / 7000));
    const tCount = Math.min(18,  Math.floor((W * H) / 45000));
    const sCount = Math.min(12,  Math.floor((W * H) / 60000));
    for (let i = 0; i < pCount; i++) particles.push(new Particle());
    for (let i = 0; i < tCount; i++) triangles.push(new Triangle());
    for (let i = 0; i < sCount; i++) floatingDots.push(new Square());
    animate();
  }

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('resize', () => {
    resize();
    particles.forEach(p => p.init());
    triangles.forEach(t => t.init());
    floatingDots.forEach(s => s.init());
  });

  init();
}

/* ==============================================
   HERO LETTER ANIMATION (entrance)
=============================================== */
function animateHeroLetters() {
  const letters = document.querySelectorAll('.hero-name .c');
  letters.forEach((c, i) => {
    setTimeout(() => {
      c.style.transition = `transform 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.6s cubic-bezier(0.4,0,0.2,1)`;
      c.style.opacity    = '1';
      c.style.transform  = 'translateY(0)';
    }, 400 + i * 55);
  });

  // After entrance, attach hover effects
  setTimeout(() => bindLetterEffects(), 400 + letters.length * 55 + 700);
}

/* ==============================================
   LETTER HOVER EFFECTS
=============================================== */
function createLeaves(el) {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top  + rect.height / 2;
  const colors = ['#27ae60', '#2ecc71', '#1e8449', '#a9dfbf', '#196f3d'];
  for (let i = 0; i < 8; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'leaf-particle';
    const tx = (Math.random() - 0.5) * 100;
    const ty = -(Math.random() * 100 + 60);
    const rot = Math.random() * 720 - 360;
    leaf.style.cssText = `left:${cx}px; top:${cy}px; --tx:${tx}px; --ty:${ty}px; --rot:${rot}deg; animation-delay:${Math.random() * 0.25}s; background:${colors[Math.floor(Math.random()*colors.length)]};`;
    document.body.appendChild(leaf);
    setTimeout(() => leaf.remove(), 1600);
  }
}

function createBurst(el) {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top  + rect.height / 2;
  for (let i = 0; i < 12; i++) {
    const dot = document.createElement('div');
    dot.className = 'burst-particle';
    const angle = (i / 12) * Math.PI * 2;
    const dist  = Math.random() * 55 + 25;
    const bx = Math.cos(angle) * dist;
    const by = Math.sin(angle) * dist;
    dot.style.cssText = `left:${cx}px; top:${cy}px; --bx:${bx}px; --by:${by}px; animation-delay:${Math.random()*0.08}s;`;
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 900);
  }
  // ripple rings
  for (let i = 0; i < 3; i++) {
    const ring = document.createElement('div');
    ring.className = 'ripple-ring';
    ring.style.cssText = `left:${cx}px; top:${cy}px; animation-delay:${i * 0.15}s;`;
    document.body.appendChild(ring);
    setTimeout(() => ring.remove(), 1100);
  }
}

function bindLetterEffects() {
  document.querySelectorAll('.hero-name .c[data-effect]').forEach(c => {
    c.addEventListener('mouseenter', () => {
      if (c.classList.contains('fx')) return;
      const effect = c.getAttribute('data-effect');

      if (effect === 'leaf')    createLeaves(c);
      if (effect === 'explode') createBurst(c);

      c.classList.add('fx');
      c.addEventListener('animationend', () => c.classList.remove('fx'), { once: true });
    });
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
