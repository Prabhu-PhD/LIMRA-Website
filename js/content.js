const esc = (s) => typeof s === 'string' ? s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;') : s;

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
    <a href="/colleges/${esc(c.id)}.html" class="college-card fade-in" style="text-decoration:none;">
      <div class="college-card-header">
        <div class="college-icon" style="background:${esc(c.color)}">${esc(c.shortName).slice(0,2)}</div>
        <div>
          <div class="college-card-name">${esc(c.name)}</div>
          <div class="college-card-location">${esc(c.flag)} ${esc(c.city)}, ${esc(c.country)}</div>
        </div>
      </div>
      <div class="college-card-body">
        <p class="college-card-tagline">"${esc(c.tagline)}"</p>
        <div class="college-highlights">
          ${c.highlights.slice(0,3).map(h => `<span class="highlight-tag">${esc(h).split('—')[0].trim()}</span>`).join('')}
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
    <a href="/colleges/${esc(c.id)}.html" class="partner-logo-card" style="text-decoration:none;">
      <div class="partner-logo-icon" style="background:${esc(c.color)}">${esc(c.shortName).slice(0,2)}</div>
      <div class="partner-logo-name">${esc(c.name)}</div>
      <div class="partner-logo-country">${esc(c.flag)} ${esc(c.country)}</div>
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
      <p class="testimonial-text">${esc(t.quote)}</p>
      <span class="testimonial-score">${esc(t.score)}</span>
      <div class="testimonial-author">
        <div class="testimonial-avatar">${esc(t.name).charAt(0)}</div>
        <div>
          <div class="testimonial-name">${esc(t.name)}</div>
          <div class="testimonial-college">${esc(t.college)} · ${esc(t.year)}</div>
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
        <div class="blog-category">${esc(p.category)}</div>
        <h3 class="blog-title">${esc(p.title)}</h3>
        <p class="blog-excerpt">${esc(p.excerpt)}</p>
        <div class="blog-meta">
          <span>${formatDate(p.date)}</span>
          <span>·</span>
          <span>${esc(p.author)}</span>
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
      <img src="${esc(g.image)}" alt="${esc(g.title)}" loading="lazy">
      <div class="gallery-overlay">
        <p class="gallery-caption">${esc(g.caption)}</p>
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
    el.innerHTML = data.phones.map(p => `<a href="tel:${esc(p.replace(/[^+\d]/g, ''))}">${esc(p)}</a>`).join('<br>');
  });
  document.querySelectorAll('[data-contact="email"]').forEach(el => {
    el.innerHTML = `<a href="mailto:${esc(data.email)}">${esc(data.email)}</a>`;
  });
  document.querySelectorAll('[data-contact="website"]').forEach(el => {
    el.innerHTML = `<a href="https://${esc(data.website)}" target="_blank">${esc(data.website)}</a>`;
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

