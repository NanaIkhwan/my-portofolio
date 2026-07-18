// ===== THEME TOGGLE =====
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ===== NAV SCROLL =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');

hamburger.addEventListener('click', () => {
  navMobile.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
  });
});

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

reveals.forEach(el => revealObserver.observe(el));

// ===== PROJECT FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      const categories = card.getAttribute('data-category') || '';
      if (filter === 'all' || categories.includes(filter)) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeUp 0.4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== SMOOTH ANCHOR SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const navH = document.getElementById('nav').offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();

  formNote.style.color = 'var(--accent-warm)';
  formNote.textContent = `Terima kasih, ${name}! Pesan kamu sudah terkirim. Saya akan segera membalas 😊`;

  contactForm.reset();

  setTimeout(() => {
    formNote.textContent = '';
  }, 5000);
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinksAll.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${id}`) {
          link.style.color = 'var(--accent-warm)';
        }
      });
    }
  });
}, { passive: true });

// ===== LIGHTBOX =====
const lightbox  = document.getElementById('lightbox');
if (lightbox) {
  const lbImg     = document.getElementById('lbImg');
  const lbCounter = document.getElementById('lbCounter');
  const lbClose   = document.getElementById('lbClose');
  const lbPrev    = document.getElementById('lbPrev');
  const lbNext    = document.getElementById('lbNext');

  let currentItems = [];
  let currentIndex = 0;

  function openLightbox(items, index) {
    currentItems = items;
    currentIndex = index;
    showImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  function showImage() {
    const item = currentItems[currentIndex];
    lbImg.src = item.dataset.src || item.querySelector('img')?.src || '';
    lbImg.alt = item.dataset.alt || item.querySelector('img')?.alt || '';
    lbCounter.textContent = (currentIndex + 1) + ' / ' + currentItems.length;
    lbPrev.style.display = currentItems.length > 1 ? 'flex' : 'none';
    lbNext.style.display = currentItems.length > 1 ? 'flex' : 'none';
  }
  function navigate(dir) {
    currentIndex = (currentIndex + dir + currentItems.length) % currentItems.length;
    lbImg.style.opacity = '0';
    setTimeout(() => { showImage(); lbImg.style.opacity = '1'; }, 150);
  }

  // Bind to certificates grid specifically
  const certGrid = document.querySelector('#certificates .projects-grid');
  if (certGrid) {
    const items = Array.from(certGrid.querySelectorAll('.project-card')).filter(card => card.querySelector('img'));
    items.forEach((item, i) => {
      item.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href.endsWith('.pdf')) {
          e.preventDefault();
        }
        openLightbox(items, i);
      });
    });
  }

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', (e) => { e.stopPropagation(); navigate(-1); });
  lbNext.addEventListener('click', (e) => { e.stopPropagation(); navigate(1); });
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
}

// ===== CUSTOM CURSOR (GPU-accelerated via translate3d) =====
(function() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring || !window.matchMedia('(pointer:fine)').matches) return;

  // willChange hint so browser promotes to own compositor layer
  dot.style.willChange  = 'transform';
  ring.style.willChange = 'transform';

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let rafId;

  // Track raw mouse position — NO style write here (stays off main thread layout)
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function tick() {
    // Dot: instant snap via translate3d (sub-pixel, GPU composited)
    dot.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;

    // Ring: exponential lerp for buttery trailing feel
    ringX += (mouseX - ringX) * 0.10;
    ringY += (mouseY - ringY) * 0.10;
    ring.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0)`;

    rafId = requestAnimationFrame(tick);
  }
  tick();

  // Override CSS default transform (was translate(-50%,-50%))
  dot.style.top  = '0px';
  dot.style.left = '0px';
  ring.style.top  = '0px';
  ring.style.left = '0px';

  // Hover states
  const hoverSel = 'a, button, .project-card, .skill-card, .filter-btn';
  document.querySelectorAll(hoverSel).forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hovering');
      ring.classList.add('hovering');
    }, { passive: true });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hovering');
      ring.classList.remove('hovering');
    }, { passive: true });
  });
})();

// ===== 3D TILT on PROJECT CARDS (RAF-throttled, GPU composited) =====
(function() {
  const cards = Array.from(document.querySelectorAll('.project-card'))
    .filter(c => !c.closest('#certificates'));

  cards.forEach(card => {
    let targetTX = 0, targetTY = 0;
    let currentTX = 0, currentTY = 0;
    let isHovered = false;
    let raf;

    card.style.willChange = 'transform';
    card.style.transformStyle = 'preserve-3d';

    function lerpTilt() {
      currentTX += (targetTX - currentTX) * 0.10;
      currentTY += (targetTY - currentTY) * 0.10;

      const magnitude = Math.sqrt(currentTX * currentTX + currentTY * currentTY);
      const shadow = `0px ${magnitude * 3}px ${20 + magnitude * 4}px rgba(26,24,20,0.13)`;
      card.style.transform = `perspective(900px) rotateX(${currentTX}deg) rotateY(${currentTY}deg) translateZ(4px)`;
      card.style.boxShadow = shadow;

      if (isHovered || Math.abs(currentTX) > 0.05 || Math.abs(currentTY) > 0.05) {
        raf = requestAnimationFrame(lerpTilt);
      } else {
        card.style.transform = '';
        card.style.boxShadow = '';
        card.style.willChange = 'auto';
      }
    }

    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      targetTY =  x * 9;
      targetTX = -y * 9;
    }, { passive: true });

    card.addEventListener('mouseenter', () => {
      isHovered = true;
      card.style.willChange = 'transform';
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(lerpTilt);
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      targetTX = 0;
      targetTY = 0;
    });
  });
})();

// ===== MAGNETIC BUTTON GLOW (smooth CSS var update) =====
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const r  = btn.getBoundingClientRect();
    btn.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%');
    btn.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%');
  }, { passive: true });
});

// ===== PARALLAX HERO SHAPES (RAF-lerped, smooth) =====
(function() {
  const shapes = document.querySelectorAll('.hero-shape');
  if (!shapes.length) return;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  shapes.forEach(s => { s.style.willChange = 'transform'; });

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    targetX = (e.clientX - cx) / cx;
    targetY = (e.clientY - cy) / cy;
  }, { passive: true });

  function tick() {
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;
    shapes.forEach((shape, i) => {
      const f = (i + 1) * 10;
      shape.style.transform = `translate3d(${currentX * f}px, ${currentY * f}px, 0)`;
    });
    requestAnimationFrame(tick);
  }
  tick();
})();

// ===== STAGGER REVEAL DELAYS (increased gap for elegance) =====
document.querySelectorAll('.projects-grid, .skills-grid').forEach(grid => {
  grid.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.10) + 's';
  });
});

// ===== ANIMATED STAT COUNTERS (smooth ease-out cubic) =====
(function() {
  const stats = document.querySelectorAll('.stat-num');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const text   = el.textContent.trim();
      const num    = parseFloat(text.replace(/[^0-9.]/g, ''));
      const suffix = text.replace(/[0-9.]/g, '');
      if (isNaN(num)) return;

      let startTs = null;
      const duration = 1400;
      function step(ts) {
        if (!startTs) startTs = ts;
        const p    = Math.min((ts - startTs) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 4); // ease-out quartic
        el.textContent = Math.round(num * ease) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = text;
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  stats.forEach(el => obs.observe(el));
})();

// ===== HERO PARTICLE CANVAS =====
(function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  // Respect reduced-motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let W, H, particles, animId;

  const COUNT      = 55;   // number of dots
  const MAX_DIST   = 140;  // max distance to draw a line between dots
  const SPEED      = 0.28; // base speed
  const DOT_R      = 1.5;  // dot radius

  function getColor() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    return dark ? 'rgba(212,137,74,' : 'rgba(150,80,25,';
  }

  function resize() {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;
  }

  function createParticles() {
    particles = Array.from({ length: COUNT }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      r:  DOT_R * (0.6 + Math.random() * 0.8),
      o:  0.2 + Math.random() * 0.5,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const col = getColor();

    // Update positions + bounce
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    }

    // Draw lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.18;
          ctx.beginPath();
          ctx.strokeStyle = col + alpha + ')';
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw dots
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = col + p.o + ')';
      ctx.fill();
    }

    animId = requestAnimationFrame(draw);
  }

  function init() {
    resize();
    createParticles();
    cancelAnimationFrame(animId);
    draw();
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  }, { passive: true });

  // Pause when tab is hidden to save resources
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else draw();
  });

  // Sync with theme toggle
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    // re-draw with new color on next frame (already handled in draw())
  });

  init();
})();
