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
   LETTER HOVER EFFECTS — helpers
=============================================== */

function getCenter(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

/* Trigger a CSS-keyframe animation via .fx class */
function triggerFx(c, duration = 1100) {
  if (c._fxActive) return;
  c._fxActive = true;
  c.classList.add('fx');
  setTimeout(() => {
    c.classList.remove('fx');
    c._fxActive = false;
  }, duration);
}

/* Leaves ─────────────────────────────────────────────── */
function createLeaves(el) {
  const { x: cx, y: cy } = getCenter(el);
  const palette = ['#27ae60','#2ecc71','#1e8449','#52be80','#82e0aa','#196f3d'];
  const sizes   = [8, 10, 13, 7, 11];
  for (let i = 0; i < 10; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'leaf-particle';
    const tx  = (Math.random() - 0.5) * 130;
    const ty  = -(Math.random() * 120 + 50);
    const rot = Math.random() * 900 - 450;
    const sz  = sizes[Math.floor(Math.random() * sizes.length)];
    const col = palette[Math.floor(Math.random() * palette.length)];
    const dur = (Math.random() * 0.5 + 1.1).toFixed(2);
    leaf.style.cssText =
      `left:${cx}px; top:${cy}px; width:${sz}px; height:${sz}px;` +
      `--tx:${tx}px; --ty:${ty}px; --rot:${rot}deg; --dur:${dur}s;` +
      `background:${col}; animation-delay:${(Math.random()*0.3).toFixed(2)}s;`;
    document.body.appendChild(leaf);
    setTimeout(() => leaf.remove(), (parseFloat(dur) + 0.4) * 1000);
  }
}

/* Burst + Ripple ─────────────────────────────────────── */
function createBurst(el) {
  const { x: cx, y: cy } = getCenter(el);
  // radial dots
  for (let i = 0; i < 14; i++) {
    const dot = document.createElement('div');
    dot.className = 'burst-particle';
    const angle = (i / 14) * Math.PI * 2 + Math.random() * 0.3;
    const dist  = Math.random() * 60 + 28;
    dot.style.cssText =
      `left:${cx}px; top:${cy}px;` +
      `--bx:${(Math.cos(angle)*dist).toFixed(1)}px;` +
      `--by:${(Math.sin(angle)*dist).toFixed(1)}px;` +
      `animation-delay:${(Math.random()*0.07).toFixed(2)}s;` +
      `width:${Math.round(Math.random()*3+3)}px; height:${Math.round(Math.random()*3+3)}px;`;
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 950);
  }
  // expanding rings
  for (let i = 0; i < 4; i++) {
    const ring = document.createElement('div');
    ring.className = 'ripple-ring';
    ring.style.cssText = `left:${cx}px; top:${cy}px; animation-delay:${(i*0.14).toFixed(2)}s;`;
    document.body.appendChild(ring);
    setTimeout(() => ring.remove(), 1200);
  }
}

/* Font-change fade (V — serif) ───────────────────────── */
function doFontChange(c, fontFamily, style, scale) {
  if (c._fxActive) return;
  c._fxActive = true;
  const FONTS = { V: "Georgia,'Times New Roman',serif", u: '"Brush Script MT",cursive' };
  const fam   = fontFamily || FONTS[c.textContent] || 'monospace';
  const sty   = style || 'italic';

  c.classList.add('fx-out');
  setTimeout(() => {
    c.style.fontFamily = fam;
    c.style.fontStyle  = sty;
    if (scale) c.style.fontSize = scale;
    c.classList.remove('fx-out');
    c.classList.add('fx-in');

    setTimeout(() => {
      c.classList.add('fx-out');
      c.classList.remove('fx-in');
      setTimeout(() => {
        c.style.fontFamily = '';
        c.style.fontStyle  = '';
        c.style.fontSize   = '';
        c.classList.remove('fx-out');
        c.classList.add('fx-in');
        setTimeout(() => {
          c.classList.remove('fx-in');
          c._fxActive = false;
        }, 220);
      }, 140);
    }, 750);
  }, 145);
}

/* Gradient sweep (y) ─────────────────────────────────── */
function doGradient(c) {
  if (c._fxActive) return;
  c._fxActive = true;
  c.classList.add('fx-grad');
  setTimeout(() => {
    c.classList.remove('fx-grad');
    // force style reset
    c.style.background           = '';
    c.style.webkitBackgroundClip = '';
    c.style.backgroundClip       = '';
    c.style.webkitTextFillColor  = '';
    c.style.color                = '';
    c._fxActive = false;
  }, 1050);
}

/* Bind all letter hover interactions ─────────────────── */
function bindLetterEffects() {
  document.querySelectorAll('.hero-name .c[data-effect]').forEach(c => {
    c.addEventListener('mouseenter', () => {
      const effect = c.getAttribute('data-effect');

      switch (effect) {
        case 'fontchange': doFontChange(c); break;
        case 'cursive':    doFontChange(c, '"Brush Script MT","Segoe Script",cursive', 'italic', '0.88em'); break;
        case 'gradient':   doGradient(c); break;
        case 'leaf':       createLeaves(c); triggerFx(c, 750);  break;
        case 'explode':    createBurst(c);  triggerFx(c, 700);  break;
        case 'pixel':      triggerFx(c, 950);  break;
        case 'lean':       triggerFx(c, 900);  break;
        case 'flip3d':     triggerFx(c, 850);  break;
        case 'neon':       triggerFx(c, 1050); break;
        case 'tilt3d':     triggerFx(c, 950);  break;
        case 'stretch':    triggerFx(c, 900);  break;
        default:           triggerFx(c, 800);
      }
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
   DARK MODE
=============================================== */
(function () {
  const saved = localStorage.getItem('theme') || 'light';
  if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
})();

const darkToggle = document.getElementById('darkToggle');
if (darkToggle) {
  darkToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

/* ==============================================
   CHATBOT
=============================================== */
const KB = {
  en: {
    greeting: "Hi! 👋 I'm Volkan's virtual assistant. How can I help you?",
    chips: ["Who is Volkan?", "Current role", "Skills & AI tools", "Education", "Contact", "Download CV"],
    responses: {
      who:       "Volkan Muyan is a Digital Strategy & Social Performance Lead and Media & Communications Expert with 8+ years of experience across NGOs and international companies in Sweden and Turkey.",
      role:      "Volkan currently leads digital communication and social performance strategies at **Presult** (Jan 2026–Present, Ankara · Hybrid) for top energy firms including Uludag Energy, Astor Energy, ELDER, and TWEA/TUREB. He is also Co-founder & Creative Director at Pave Media EF.",
      skills:    "Key skills: Digital Strategy · Social Performance Management · Sustainability Communication · ESG · Creative Direction · Stakeholder Management.\n\nAI tools: Claude Code · Vibe Coding · Cursor AI · Kling AI · Midjourney · ChatGPT.\n\nTools: Adobe CC · Figma · GA4 · HubSpot · Marketo · Meta/TikTok/Google Ads.",
      education: "🎓 M.Sc. Media & Communication Studies — Lund University (2020–2022) | GPA 3.80/4.00 | Swedish Institute Scholar\n🎓 B.Sc. Radio, Television & Film — Ankara University (2015–2019) | GPA 3.81/4.00 | 1st in Department",
      contact:   "📧 v.muyan@gmail.com\n📱 +90 540 300 6557 (Turkey)\n📱 +46 70 954 345 (Sweden)\n📍 Ankara, Turkey",
      cv:        "You can download Volkan's CV directly from the Contact section of this page — available in English and Turkish. Click the Download CV buttons! ↓",
      award:     "🏆 Swedish Institute Scholarship — Full scholarship (≈ €60,000)\n🏆 El-Com Education Bursary (≈ €10,000)\n🏅 1st in Department of Radio, Television & Cinema\n🏅 3rd in Faculty of Communication",
      default:   "I can help with info about Volkan's experience, skills, education, contact details, or CV download. What would you like to know?"
    }
  },
  tr: {
    greeting: "Merhaba! 👋 Ben Volkan'ın sanal asistanıyım. Size nasıl yardımcı olabilirim?",
    chips: ["Volkan kimdir?", "Mevcut pozisyon", "Yetenekler & AI", "Eğitim", "İletişim", "CV İndir"],
    responses: {
      who:       "Volkan Muyan, İsveç ve Türkiye'deki STK'lar ve uluslararası şirketlerde 8+ yıl deneyime sahip bir Dijital Strateji & Sosyal Performans Lideri ve Medya & İletişim Uzmanıdır.",
      role:      "Volkan şu an **Presult**'ta (Oca 2026–Günümüz, Ankara · Hibrit) Dijital Strateji & Sosyal Performans Lideri olarak Uludag Energy, Astor Energy, ELDER ve TWEA/TUREB gibi önde gelen enerji firmalarına strateji liderliği yapmaktadır. Aynı zamanda Pave Media EF'in Kurucu Ortağı ve Kreatif Direktörüdür.",
      skills:    "Temel yetenekler: Dijital Strateji · Sosyal Performans Yönetimi · Sürdürülebilirlik İletişimi · ESG · Kreatif Yönetim · Paydaş Yönetimi.\n\nYapay zeka araçları: Claude Code · Vibe Coding · Cursor AI · Kling AI · Midjourney · ChatGPT.\n\nAraçlar: Adobe CC · Figma · GA4 · HubSpot · Marketo · Meta/TikTok/Google Ads.",
      education: "🎓 Y.L. Medya & İletişim — Lund Üniversitesi (2020–2022) | GPA 3.80/4.00 | İsveç Enstitüsü Bursiyer\n🎓 Radyo, TV & Sinema — Ankara Üniversitesi (2015–2019) | GPA 3.81/4.00 | Bölüm Birincisi",
      contact:   "📧 v.muyan@gmail.com\n📱 +90 540 300 6557 (Türkiye)\n📱 +46 70 954 345 (İsveç)\n📍 Ankara, Türkiye",
      cv:        "Volkan'ın CV'sini bu sayfanın İletişim bölümünden doğrudan indirebilirsiniz — İngilizce ve Türkçe olarak mevcut. CV İndir butonlarına tıklayın! ↓",
      award:     "🏆 İsveç Enstitüsü Bursu — Tam burs (≈ €60.000)\n🏆 El-Com Eğitim Bursu (≈ €10.000)\n🏅 Radyo, TV & Sinema Bölüm Birincisi\n🏅 İletişim Fakültesi Üçüncüsü",
      default:   "Volkan'ın deneyimi, yetenekleri, eğitimi, iletişim bilgileri veya CV indirme konusunda yardımcı olabilirim. Ne öğrenmek istersiniz?"
    }
  }
};

let chatLang = 'en';

function classify(text) {
  const t = text.toLowerCase();
  if (/who|kim|hakkında|about/.test(t))                      return 'who';
  if (/role|pozis|current|work|presult|çalış/.test(t))       return 'role';
  if (/skill|yetenek|tool|araç|ai|yapay|claude|kling/.test(t)) return 'skills';
  if (/educat|eğitim|university|üniversite|lund|ankara/.test(t)) return 'education';
  if (/contact|iletişim|mail|phone|tel|email/.test(t))       return 'contact';
  if (/cv|resume|download|indir/.test(t))                    return 'cv';
  if (/award|ödül|scholarship|burs/.test(t))                 return 'award';
  return 'default';
}

function appendMsg(text, type, container) {
  const div = document.createElement('div');
  div.className = `msg msg-${type}`;
  div.textContent = text;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

function showTyping(container) {
  const div = appendMsg('…', 'bot msg-typing', container);
  return div;
}

function setChips(chips, container, send) {
  container.innerHTML = '';
  chips.forEach(label => {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.textContent = label;
    btn.addEventListener('click', () => send(label));
    container.appendChild(btn);
  });
}

function initChatbot() {
  const wrap    = document.getElementById('chatbotWrap');
  const fab     = document.getElementById('chatbotFab');
  const msgs    = document.getElementById('chatMessages');
  const chips   = document.getElementById('chatChips');
  const input   = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');
  const langBtn = document.getElementById('chatLangBtn');
  const badge   = document.getElementById('fabBadge');

  if (!wrap) return;

  let opened = false;

  function sendMessage(text) {
    if (!text.trim()) return;
    appendMsg(text, 'user', msgs);
    input.value = '';

    const typing = showTyping(msgs);
    setTimeout(() => {
      typing.remove();
      const key = classify(text);
      const reply = KB[chatLang].responses[key];
      appendMsg(reply, 'bot', msgs);
    }, 620);
  }

  function openChat() {
    wrap.classList.add('open');
    badge.classList.add('hidden');
    opened = true;
    if (msgs.children.length === 0) {
      setTimeout(() => {
        appendMsg(KB[chatLang].greeting, 'bot', msgs);
        setChips(KB[chatLang].chips, chips, sendMessage);
      }, 300);
    }
    setTimeout(() => input.focus(), 350);
  }

  fab.addEventListener('click', () => {
    if (wrap.classList.contains('open')) {
      wrap.classList.remove('open');
    } else {
      openChat();
    }
  });

  sendBtn.addEventListener('click', () => sendMessage(input.value));
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(input.value); });

  langBtn.addEventListener('click', () => {
    chatLang = chatLang === 'en' ? 'tr' : 'en';
    langBtn.textContent = chatLang === 'en' ? 'TR' : 'EN';
    input.placeholder = chatLang === 'en' ? 'Ask me anything…' : 'Bir şey sorun…';
    // Reset conversation in new lang
    msgs.innerHTML = '';
    chips.innerHTML = '';
    appendMsg(KB[chatLang].greeting, 'bot', msgs);
    setChips(KB[chatLang].chips, chips, sendMessage);
  });

  // Auto-open greeting badge after 3s
  setTimeout(() => {
    if (!opened) badge.classList.remove('hidden');
  }, 3000);
}

/* ==============================================
   PAINT CANVAS — color trail on hero letters
=============================================== */
function initPaintCanvas() {
  const hero   = document.getElementById('hero');
  const canvas = document.getElementById('paintCanvas');
  if (!canvas || !hero) return;

  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
    // Fill black so screen blend mode renders nothing until painted
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
  }
  resize();
  window.addEventListener('resize', resize);

  let hue = Math.random() * 360;
  let px = 0, py = 0;

  // Slow fade loop — fills with near-black each frame
  function fadeLoop() {
    ctx.fillStyle = 'rgba(0,0,0,0.022)';
    ctx.fillRect(0, 0, W, H);
    requestAnimationFrame(fadeLoop);
  }
  fadeLoop();

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dist = Math.hypot(x - px, y - py);

    if (dist > 1.5) {
      hue = (hue + 5) % 360;
      const r  = 36 + Math.random() * 24;
      const h2 = (hue + 40 + Math.random() * 30) % 360;

      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0,   `hsla(${hue}, 100%, 62%, 0.95)`);
      grad.addColorStop(0.4, `hsla(${h2},  95%, 55%, 0.65)`);
      grad.addColorStop(1,   `hsla(${hue}, 90%, 40%, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      // Extra smaller splash for richness
      if (Math.random() > 0.55) {
        const r2   = 14 + Math.random() * 12;
        const offx = (Math.random() - 0.5) * 30;
        const offy = (Math.random() - 0.5) * 30;
        const g2   = ctx.createRadialGradient(x + offx, y + offy, 0, x + offx, y + offy, r2);
        g2.addColorStop(0,   `hsla(${(hue+90)%360}, 100%, 70%, 0.8)`);
        g2.addColorStop(1,   `hsla(${(hue+90)%360}, 90%,  50%, 0)`);
        ctx.fillStyle = g2;
        ctx.beginPath();
        ctx.arc(x + offx, y + offy, r2, 0, Math.PI * 2);
        ctx.fill();
      }

      px = x; py = y;
    }
  });

  // Clear paint on mouse leave
  hero.addEventListener('mouseleave', () => {
    px = 0; py = 0;
  });
}

/* ==============================================
   INIT
=============================================== */
window.addEventListener('load', () => {
  initCanvas();
  initPaintCanvas();
  animateHeroLetters();
  initChatbot();
});
