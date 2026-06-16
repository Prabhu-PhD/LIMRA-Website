document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initStatCounters();
  initActiveNavLink();
  initClickTracking();
});

function initNavbar() {
  const navbar = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');

  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      menu.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        toggle.classList.remove('open');
        menu.classList.remove('open');
      }
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        menu.classList.remove('open');
      });
    });
  }
}

function initActiveNavLink() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const normalized = href.replace(/\/index\.html$/, '/');
    const currentNorm = path.replace(/\/index\.html$/, '/') || '/';
    if (currentNorm === '/' && (href === '/' || href === '/index.html')) {
      link.classList.add('active');
    } else if (href !== '/' && href !== '/index.html' && path.startsWith(href.replace('.html', ''))) {
      link.classList.add('active');
    }
  });
}

function initScrollAnimations() {
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    const fadeObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(el => fadeObs.observe(el));
  }

  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealEls.forEach(el => revealObs.observe(el));
  }
}

function initStatCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function initClickTracking() {
  document.querySelectorAll('a[href^="tel:"], a[href^="https://wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'contact_click', {
          'event_category': 'engagement',
          'event_label': link.getAttribute('href')
        });
      }
    });
  });
}
