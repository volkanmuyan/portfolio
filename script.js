// ===========================
// LANGUAGE TOGGLE
// ===========================
let currentLang = 'en';

const langToggle = document.getElementById('langToggle');

function setLanguage(lang) {
  currentLang = lang;
  langToggle.textContent = lang === 'en' ? 'TR' : 'EN';

  document.documentElement.lang = lang;

  document.querySelectorAll('[data-en][data-tr]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) {
      // Handle innerHTML (for <br> tags)
      if (text.includes('<br')) {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    }
  });
}

langToggle.addEventListener('click', () => {
  setLanguage(currentLang === 'en' ? 'tr' : 'en');
});

// ===========================
// NAVBAR SCROLL
// ===========================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===========================
// REVEAL ON SCROLL
// ===========================
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// ===========================
// COUNTER ANIMATION
// ===========================
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);

  const tick = () => {
    start += step;
    if (start >= target) {
      el.textContent = target;
      return;
    }
    el.textContent = Math.floor(start);
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const nums = entry.target.querySelectorAll('.stat-num');
        nums.forEach(num => {
          const target = parseInt(num.getAttribute('data-target'), 10);
          animateCounter(num, target);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

const statsSection = document.querySelector('.about-stats');
if (statsSection) statsObserver.observe(statsSection);

// ===========================
// SMOOTH ACTIVE NAV LINK
// ===========================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}`
            ? 'var(--white)'
            : '';
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));

// ===========================
// ORB PARALLAX (subtle)
// ===========================
const orbs = document.querySelectorAll('.orb');

window.addEventListener('mousemove', (e) => {
  const { innerWidth, innerHeight } = window;
  const x = (e.clientX / innerWidth - 0.5) * 2;
  const y = (e.clientY / innerHeight - 0.5) * 2;

  orbs.forEach((orb, i) => {
    const factor = (i + 1) * 10;
    orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
});

// ===========================
// HERO ENTRANCE
// ===========================
window.addEventListener('load', () => {
  document.querySelectorAll('#hero .reveal').forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 200 + i * 150);
  });
});
