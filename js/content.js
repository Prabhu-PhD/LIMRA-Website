async function loadJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error('Failed to load ' + path);
    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function loadCollegeCards(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const colleges = await loadJSON('/data/colleges.json');
  if (!colleges) return;
  container.innerHTML = colleges.map(c => `
    <a href="/colleges/${c.id}.html" class="college-card fade-in" style="text-decoration:none;">
      <div class="college-card-header">
        <div class="college-icon" style="background:${c.color}">${c.shortName.slice(0,2)}</div>
        <div>
          <div class="college-card-name">${c.name}</div>
          <div class="college-card-location">${c.flag} ${c.city}, ${c.country}</div>
        </div>
      </div>
      <div class="college-card-body">
        <p class="college-card-tagline">"${c.tagline}"</p>
        <div class="college-highlights">
          ${c.highlights.slice(0,3).map(h => `<span class="highlight-tag">${h.split('—')[0].trim()}</span>`).join('')}
        </div>
      </div>
      <div class="college-card-footer">
        <span class="btn btn-sm btn-outline-navy">View Details →</span>
      </div>
    </a>
  `).join('');
  initScrollAnimations();
}

async function loadPartnerLogos(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const colleges = await loadJSON('/data/colleges.json');
  if (!colleges) return;
  container.innerHTML = colleges.map(c => `
    <a href="/colleges/${c.id}.html" class="partner-logo-card" style="text-decoration:none;">
      <div class="partner-logo-icon" style="background:${c.color}">${c.shortName.slice(0,2)}</div>
      <div class="partner-logo-name">${c.name}</div>
      <div class="partner-logo-country">${c.flag} ${c.country}</div>
    </a>
  `).join('');
}

async function loadTestimonials(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const items = await loadJSON('/data/testimonials.json');
  if (!items) return;
  container.innerHTML = items.map(t => `
    <div class="testimonial-card fade-in">
      <div class="testimonial-quote">"</div>
      <p class="testimonial-text">${t.quote}</p>
      <span class="testimonial-score">${t.score}</span>
      <div class="testimonial-author">
        <div class="testimonial-avatar">${t.name.charAt(4)}</div>
        <div>
          <div class="testimonial-name">${t.name}</div>
          <div class="testimonial-college">${t.college} · ${t.year}</div>
        </div>
      </div>
    </div>
  `).join('');
  initScrollAnimations();
}

async function loadBlogCards(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const posts = await loadJSON('/data/blog.json');
  if (!posts) return;
  const published = posts.filter(p => p.published);
  if (!published.length) {
    container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 20px;">
        <div style="font-size:3rem;margin-bottom:16px;">📝</div>
        <h3 style="color:var(--navy);margin-bottom:8px;">Blog Coming Soon</h3>
        <p style="color:var(--gray-600);">We are working on insightful articles for medical students. Check back soon!</p>
      </div>`;
    return;
  }
  container.innerHTML = published.map(p => `
    <div class="blog-card fade-in">
      <div class="blog-image">📰</div>
      <div class="blog-body">
        <div class="blog-category">${p.category}</div>
        <h3 class="blog-title">${p.title}</h3>
        <p class="blog-excerpt">${p.excerpt}</p>
        <div class="blog-meta">
          <span>${formatDate(p.date)}</span>
          <span>·</span>
          <span>${p.author}</span>
        </div>
      </div>
    </div>
  `).join('');
  initScrollAnimations();
}

async function loadGallery(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const items = await loadJSON('/data/gallery.json');
  if (!items) return;
  container.innerHTML = items.map(g => `
    <div class="gallery-item fade-in">
      <img src="${g.image}" alt="${g.title}" loading="lazy">
      <div class="gallery-overlay">
        <p class="gallery-caption">${g.caption}</p>
      </div>
    </div>
  `).join('');
  initScrollAnimations();
}

async function loadContactInfo() {
  const data = await loadJSON('/data/contact.json');
  if (!data) return;

  document.querySelectorAll('[data-contact="address"]').forEach(el => el.textContent = data.address);
  document.querySelectorAll('[data-contact="phones"]').forEach(el => {
    el.innerHTML = data.phones.map(p => `<a href="tel:${p.replace(/[^+\d]/g, '')}">${p}</a>`).join('<br>');
  });
  document.querySelectorAll('[data-contact="email"]').forEach(el => {
    el.innerHTML = `<a href="mailto:${data.email}">${data.email}</a>`;
  });
  document.querySelectorAll('[data-contact="website"]').forEach(el => {
    el.innerHTML = `<a href="https://${data.website}" target="_blank">${data.website}</a>`;
  });
  document.querySelectorAll('[data-contact="director"]').forEach(el => el.textContent = data.director);
  document.querySelectorAll('.whatsapp-fab').forEach(el => {
    el.href = `https://wa.me/${data.whatsapp}`;
  });
}

async function loadStats() {
  const data = await loadJSON('/data/stats.json');
  if (!data) return;
  document.querySelectorAll('[data-stat]').forEach(el => {
    const key = el.dataset.stat;
    if (data[key] !== undefined) {
      const suffix = data[key + 'Suffix'] || '';
      el.dataset.count = data[key];
      el.dataset.suffix = suffix;
      el.textContent = '0' + suffix;
    }
  });
  initStatCounters();
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-in:not(.visible)');
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => observer.observe(el));
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
    el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
