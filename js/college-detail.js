async function renderCollegePage() {
  const id = window.COLLEGE_ID;
  if (!id) return;

  const colleges = await loadJSON('/data/colleges.json');
  if (!colleges) return;

  const college = colleges.find(c => c.id === id);
  if (!college) {
    const nameEl = document.getElementById('collegeName');
    if (nameEl) nameEl.textContent = 'College not found';
    const bcEl = document.getElementById('collegeBreadcrumbName');
    if (bcEl) bcEl.textContent = 'Not found';
    return;
  }

  const collegeTitle = `${college.name} — MBBS in ${college.country} | LIMRA`;
  const collegeDesc = `${college.name}, ${college.city}, ${college.country} — ${college.tagline} Authorized admissions through LIMRA, Chennai.`;
  const collegeUrl = `https://www.limraedu.com/colleges/${id}.html`;

  document.title = collegeTitle;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', collegeDesc);
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', collegeUrl);
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', collegeTitle);
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', collegeDesc);
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', collegeUrl);
  const twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.setAttribute('content', collegeTitle);
  const twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) twDesc.setAttribute('content', collegeDesc);

  const breadcrumb = document.getElementById('collegeBreadcrumbName');
  if (breadcrumb) breadcrumb.textContent = college.name;
  document.getElementById('collegeName').textContent = college.name;
  document.getElementById('collegeTagline').textContent = `${college.flag} ${college.city}, ${college.country}`;
  document.getElementById('collegeSubtitle').textContent = college.tagline;

  const icon = document.getElementById('collegeIcon');
  if (icon) { icon.textContent = college.shortName.slice(0, 2); icon.style.background = college.color; }

  const desc = document.getElementById('collegeDesc');
  if (desc) desc.textContent = college.description;

  const prog = document.getElementById('collegeProgram');
  if (prog) prog.textContent = college.program;

  const highlights = document.getElementById('collegeHighlights');
  if (highlights) {
    highlights.innerHTML = college.highlights.map(h => `
      <div class="highlight-item">
        <span style="color:var(--red);font-size:1.1rem;flex-shrink:0;">✓</span>
        <span class="highlight-item-text">${h}</span>
      </div>
    `).join('');
  }

  const hospitals = document.getElementById('collegeHospitals');
  if (hospitals) {
    hospitals.innerHTML = college.hospitals.map(h => `<div class="hospital-item">${h}</div>`).join('');
  }

  const facilities = document.getElementById('collegeFacilities');
  if (facilities) {
    facilities.innerHTML = college.facilities.map(f => `
      <div style="display:flex;gap:10px;align-items:center;font-size:0.875rem;color:var(--dark);padding:8px 12px;background:var(--gray-50);border-radius:6px;">
        <span style="color:var(--navy);font-size:0.9rem;">✦</span> ${f}
      </div>
    `).join('');
  }

  const img = document.getElementById('collegeImg');
  if (img) { img.src = college.image; img.alt = college.name; }
}

document.addEventListener('DOMContentLoaded', renderCollegePage);
