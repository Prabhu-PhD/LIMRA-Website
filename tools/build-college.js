/* Build the new college-page sections from brochure content:
   Clinical Training (5 hospitals) · Tech-Enabled Teaching (4, select colleges) ·
   Learning Facilities (5) · Hostel Facilities (2-col) · Major Departments (8).
   Inserts them between the existing intro sections and Campus Life.
   Also appends the supporting CSS to college.css (once).
   Usage: node tools/build-college.js <slug> */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");

const I = {
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
  cube: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  flask: '<path d="M9 2v6l-5 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-9V2"/><path d="M8 2h8"/>',
  clipboard: '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>',
  pulse: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/>',
  droplet: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  wind: '<path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>',
  activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  bed: '<path d="M3 7v11"/><path d="M3 13h16a2 2 0 0 1 2 2v3"/><path d="M3 18h18"/><path d="M7 13V9.5A1.5 1.5 0 0 1 8.5 8H12"/>',
  cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>',
};
const svg = (n, w = 1.8) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${I[n] || I.pulse}</svg>`;

function head(cls, eyebrow, title, sub) {
  return `      <div class="section-head reveal">
        <span class="eyebrow ${cls}">${eyebrow}</span>
        <h2 class="section-title">${title}</h2>${sub ? `
        <p class="section-sub">${sub}</p>` : ""}
      </div>`;
}

function clinical(d) {
  const stats = d.clinStats.map((s) =>
    `        <div class="clin-hl-item"><div class="clin-hl-icon">${svg(s.icon)}</div><div><div class="clin-hl-n">${s.n}</div><div class="clin-hl-l">${s.l}</div></div></div>`).join("\n");
  const cards = d.hospitals.map((h, i) =>
    `        <div class="clin-card">
          <div class="clin-card-top"><span class="clin-num">${String(i + 1).padStart(2, "0")}</span><span class="clin-type">${h.type}</span></div>
          <h3>${h.name}</h3>
          <p>${h.note}</p>
        </div>`).join("\n");
  return `<!-- CLINICAL TRAINING -->
  <section class="section section--light">
    <div class="container">
${head("eyebrow--accent", "Clinical Training", d.clinTitle, d.clinSub)}
      <div class="clin-highlight reveal">
${stats}
      </div>
      <div class="clin-grid reveal">
${cards}
      </div>
    </div>
  </section>`;
}

function tech(d) {
  if (!d.tech) return null;
  const cards = d.tech.items.map((t) =>
    `        <div class="tech-card"><div class="tech-media">${svg(t.icon)}</div><div class="tech-body"><h4>${t.title}</h4><p>${t.text}</p></div></div>`).join("\n");
  return `<!-- TECH-ENABLED TEACHING -->
  <section class="section section--dark">
    <div class="container">
${head("eyebrow--sky", "Tech-Enabled Teaching", d.tech.title, d.tech.sub)}
      <div class="tech-grid reveal">
${cards}
      </div>
    </div>
  </section>`;
}

function learning(d) {
  const cards = d.learning.map((l) =>
    `        <div class="lf-card"><div class="lf-icon">${svg(l.icon)}</div><h4>${l.title}</h4><p>${l.text}</p></div>`).join("\n");
  return `<!-- LEARNING FACILITIES -->
  <section class="section section--light">
    <div class="container">
${head("eyebrow--accent", "Learning Facilities", "Built for Focused, Modern Learning")}
      <div class="lf-grid reveal">
${cards}
      </div>
    </div>
  </section>`;
}

function hostel(d) {
  const items = d.hostel.map((x) => `          <li>${x}</li>`).join("\n");
  return `<!-- HOSTEL FACILITIES -->
  <section class="section section--dark">
    <div class="container">
      <div class="hostel-split reveal">
        <div class="hostel-media"><img src="${d.hostelImg}" alt="${d.name} student accommodation (placeholder)" loading="lazy" /></div>
        <div class="hostel-text">
          <span class="eyebrow eyebrow--sky">Hostel Facilities</span>
          <h2 class="section-title">Safe, Comfortable Living</h2>
          <ul class="hostel-list">
${items}
          </ul>
        </div>
      </div>
    </div>
  </section>`;
}

function departments(d) {
  const cards = d.departments.map((x) =>
    `        <div class="dept-card"><div class="dept-media">${svg(x.icon)}</div><div class="dept-body"><h4>${x.title}</h4><p>${x.text}</p></div></div>`).join("\n");
  return `<!-- MAJOR DEPARTMENTS -->
  <section class="section section--light">
    <div class="container">
${head("eyebrow--accent", "Major Departments", "Hands-On Practice Across Major Departments", d.deptSub)}
      <div class="dept-grid reveal">
${cards}
      </div>
    </div>
  </section>`;
}

const DATA = {
  dmsf: {
    name: "DMSF",
    clinTitle: "Real Hospital Exposure That Makes You a Doctor",
    clinSub: "DMSF students train across five affiliated hospitals with 4,500+ beds — gaining early patient interaction and advanced medical-technology training from the first years.",
    hospitals: [
      { name: "DMS Foundation Hospital", type: "Primary Teaching Hospital", note: "The Foundation's own teaching hospital — core rotations across all major departments with hands-on patient care." },
      { name: "Davao Medical Center", type: "Government Referral Hospital", note: "A major government referral hospital offering exposure to a high volume and diversity of cases." },
      { name: "Brokenshire Hospital", type: "Private Teaching Hospital", note: "A trusted private teaching hospital with rotations across key clinical specialties." },
      { name: "Southern Philippines Medical Center", type: "Tertiary Referral Centre", note: "One of Mindanao's largest hospitals — advanced procedures and complex case exposure." },
      { name: "San Pedro Hospital", type: "Affiliated Teaching Hospital", note: "A long-established hospital rounding out training across community and specialty care." },
    ],
    clinStats: [{ n: "4500+", l: "Bed-capacity exposure", icon: "bed" }, { n: "Early", l: "Patient interaction", icon: "users" }, { n: "Advanced", l: "Medical-technology training", icon: "cpu" }],
    tech: {
      title: "Innovative Education for Exceptional Healthcare",
      sub: "DMSF integrates modern technology with medical education to create future-ready doctors.",
      items: [
        { icon: "monitor", title: "Virtual Reality Anatomy", text: "Explore the human body in immersive 3D — visualising structures impossible to see in textbooks." },
        { icon: "cube", title: "Plastinated Models", text: "Real preserved anatomical specimens for detailed, hands-on structural study." },
        { icon: "user", title: "Simulation Mannequins", text: "Lifelike patient simulators to practise clinical procedures safely before the wards." },
        { icon: "layers", title: "3D Anatomage & Cadavers", text: "Digital dissection tables alongside cadaveric study for complete anatomical understanding." },
      ],
    },
    learning: [
      { icon: "users", title: "Team Learning Centre", text: "Collaborative spaces designed for small-group, case-based study." },
      { icon: "book", title: "Modern Knowledge Centre", text: "An extensive medical library with digital journals and resources." },
      { icon: "monitor", title: "Smart Classrooms", text: "AV-equipped rooms with e-learning access and recorded lectures." },
      { icon: "flask", title: "Fully Equipped Labs", text: "Advanced laboratories for anatomy, physiology and clinical skills." },
      { icon: "clipboard", title: "Ergonomic Exam Halls", text: "Purpose-built halls for a focused, exam-ready environment." },
    ],
    hostel: ["Separate hostels for boys &amp; girls", "Safe &amp; secure environment", "South &amp; North Indian food available"],
    hostelImg: "/assets/students-library.webp",
    deptSub: "Hands-on clinical exposure across eight core specialties — building real diagnostic and treatment confidence.",
    departments: [
      { icon: "heart", title: "Cardiology", text: "Observe intricate cardiac procedures and master cardiovascular disease management." },
      { icon: "activity", title: "Neurology", text: "Diagnose and treat neurological conditions with hands-on clinical experience." },
      { icon: "shield", title: "Oncology", text: "Witness cancer-treatment advances and build a holistic understanding of patient care." },
      { icon: "pulse", title: "Orthopedics", text: "Engage in surgical interventions and musculoskeletal management." },
      { icon: "droplet", title: "Nephrology", text: "Diagnose and manage renal disease, including dialysis and related procedures." },
      { icon: "activity", title: "Gastroenterology", text: "Participate in endoscopic procedures and digestive-ailment management." },
      { icon: "wind", title: "Pulmonology", text: "Explore respiratory conditions and master pulmonary function testing." },
      { icon: "pulse", title: "Endocrinology", text: "Manage hormonal imbalances and diabetes with comprehensive, interpretive care." },
    ],
  },
};

const slug = process.argv[2];
const d = DATA[slug];
if (!d) { console.error("No data for slug: " + slug); process.exit(1); }

const file = path.join(root, "colleges", slug + ".html");
let h = fs.readFileSync(file, "utf8");

const sections = [clinical(d), tech(d), learning(d), hostel(d), departments(d)].filter(Boolean);
const block = sections.join("\n\n  ") + "\n\n  ";

const clinIdx = h.indexOf('eyebrow--accent">Clinical Training');
const campusIdx = h.indexOf('eyebrow--sky">Campus Life');
if (clinIdx < 0 || campusIdx < 0) throw new Error("anchors not found");
const clinSecStart = h.lastIndexOf("<section", clinIdx);
const campusSecStart = h.lastIndexOf("<section", campusIdx);
h = h.slice(0, clinSecStart) + block + h.slice(campusSecStart);
fs.writeFileSync(file, h);
console.log(slug + ": inserted " + sections.length + " sections (tech=" + !!d.tech + ")");
