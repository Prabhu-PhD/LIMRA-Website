document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initStatCounters();
  initActiveNavLink();
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

async function submitEnquiryForm(formId, msgId) {
  const form = document.getElementById(formId);
  const msg = document.getElementById(msgId);
  if (!form || !msg) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn?.textContent;
    if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }

    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      msg.className = 'form-msg ' + (res.ok ? 'success' : 'error');
      msg.textContent = res.ok ? json.message : (json.error || 'Something went wrong.');
      if (res.ok) form.reset();
    } catch {
      msg.className = 'form-msg error';
      msg.textContent = 'Network error. Please try again.';
    } finally {
      if (btn) { btn.textContent = originalText; btn.disabled = false; }
    }
  });
}
