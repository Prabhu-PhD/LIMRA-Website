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
  building: '<rect x="4" y="3" width="16" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="14"/><line x1="9" y1="11" x2="15" y2="11"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 13.5L17 22l-5-3-5 3 1.5-8.5"/>',
};

// Shared content that repeats across the LIMRA college brochures.
const STD_TECH_ITEMS = [
  { icon: "monitor", img: "tech-vr", title: "Virtual Reality Anatomy", text: "Explore the human body in immersive 3D — visualising structures impossible to see in textbooks." },
  { icon: "cube", img: "tech-plastinated", title: "Plastinated Models", text: "Real preserved anatomical specimens for detailed, hands-on structural study." },
  { icon: "user", img: "tech-simulation", title: "Simulation Mannequins", text: "Lifelike patient simulators to practise clinical procedures safely before the wards." },
  { icon: "layers", img: "tech-anatomage", title: "3D Anatomage & Cadavers", text: "Digital dissection tables alongside cadaveric study for complete anatomical understanding." },
];
const STD_LEARNING = [
  { icon: "users", title: "Team Learning Centre", text: "Collaborative spaces designed for small-group, case-based study." },
  { icon: "book", title: "Modern Knowledge Centre", text: "An extensive medical library with digital journals and resources." },
  { icon: "monitor", title: "Smart Classrooms", text: "AV-equipped rooms with e-learning access and recorded lectures." },
  { icon: "flask", title: "Fully Equipped Labs", text: "Advanced laboratories for anatomy, physiology and clinical skills." },
  { icon: "clipboard", title: "Ergonomic Exam Halls", text: "Purpose-built halls for a focused, exam-ready environment." },
];
const STD_DEPARTMENTS = [
  { icon: "heart", img: "dept-cardiology", title: "Cardiology", text: "Observe intricate cardiac procedures and master cardiovascular disease management." },
  { icon: "activity", img: "dept-neurology", title: "Neurology", text: "Diagnose and treat neurological conditions with hands-on clinical experience." },
  { icon: "shield", img: "dept-oncology", title: "Oncology", text: "Witness cancer-treatment advances and build a holistic understanding of patient care." },
  { icon: "pulse", img: "dept-orthopedics", title: "Orthopedics", text: "Engage in surgical interventions and musculoskeletal management." },
  { icon: "droplet", img: "dept-nephrology", title: "Nephrology", text: "Diagnose and manage renal disease, including dialysis and related procedures." },
  { icon: "activity", img: "dept-gastroenterology", title: "Gastroenterology", text: "Participate in endoscopic procedures and digestive-ailment management." },
  { icon: "wind", img: "dept-pulmonology", title: "Pulmonology", text: "Explore respiratory conditions and master pulmonary function testing." },
  { icon: "pulse", img: "dept-endocrinology", title: "Endocrinology", text: "Manage hormonal imbalances and diabetes with comprehensive, interpretive care." },
];
const STD_DEPT_SUB = "Hands-on clinical exposure across eight core specialties — building real diagnostic and treatment confidence.";
const STD_TECH_SUB = "Modern technology blended with medical education to create future-ready doctors.";
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
  const cards = (d.tech.items || STD_TECH_ITEMS).map((t) =>
    `        <div class="tech-card"><div class="tech-media">${t.img ? `<img src="/assets/${t.img}.webp" alt="${t.title}" loading="lazy" />` : svg(t.icon)}</div><div class="tech-body"><h4>${t.title}</h4><p>${t.text}</p></div></div>`).join("\n");
  return `<!-- TECH-ENABLED TEACHING -->
  <section class="section section--dark">
    <div class="container">
${head("eyebrow--sky", "Tech-Enabled Teaching", d.tech.title, d.tech.sub || STD_TECH_SUB)}
      <div class="tech-grid reveal">
${cards}
      </div>
    </div>
  </section>`;
}

function learning(d) {
  const cards = (d.learning || STD_LEARNING).map((l) =>
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
  const cards = (d.departments || STD_DEPARTMENTS).map((x) =>
    `        <div class="dept-card"><div class="dept-media">${x.img ? `<img src="/assets/${x.img}.webp" alt="${x.title} department" loading="lazy" />` : svg(x.icon)}</div><div class="dept-body"><h4>${x.title}</h4><p>${x.text}</p></div></div>`).join("\n");
  return `<!-- MAJOR DEPARTMENTS -->
  <section class="section section--light">
    <div class="container">
${head("eyebrow--accent", "Major Departments", "Hands-On Practice Across Major Departments", d.deptSub || STD_DEPT_SUB)}
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
    tech: { title: "Innovative Education for Exceptional Healthcare", sub: "DMSF integrates modern technology with medical education to create future-ready doctors." },
    hostel: ["Separate hostels for boys &amp; girls", "Safe &amp; secure environment", "South &amp; North Indian food available"],
    hostelImg: "/assets/students-library.webp",
  },

  brokenshire: {
    name: "Brokenshire",
    clinTitle: "Real Clinical Exposure Across Five Hospitals",
    clinSub: "Brokenshire students train across five accredited hospitals with a combined 4,500+ beds — immense, hands-on clinical practice that shapes confident doctors.",
    hospitals: [
      { name: "Brokenshire Hospital", type: "Primary Teaching Hospital", note: "Brokenshire's own multispecialty hospital — core rotations across all major departments with hands-on patient care." },
      { name: "Davao Doctors Hospital", type: "Private Teaching Hospital", note: "A leading private medical facility in Davao with broad clinical exposure." },
      { name: "DMS Foundation Hospital", type: "Affiliated Teaching Hospital", note: "A respected teaching hospital offering rotations across core specialties." },
      { name: "Southern Philippines Medical Centre", type: "Tertiary Referral Centre", note: "One of Mindanao's largest hospitals — advanced procedures and complex cases." },
      { name: "San Pedro Hospital", type: "Affiliated Teaching Hospital", note: "A long-established hospital rounding out community and specialty training." },
    ],
    clinStats: [
      { n: "4500+", l: "Combined bed strength", icon: "bed" },
      { n: "5", l: "Multispecialty hospitals", icon: "building" },
      { n: "Since 1954", l: "Clinical heritage", icon: "award" },
    ],
    tech: { title: "Innovative Education for Exceptional Healthcare", sub: "Brokenshire blends modern technology with traditional anatomy learning to create future-ready doctors." },
    hostel: ["Separate hostels for boys &amp; girls", "Safe &amp; secure environment", "Comfortable, supportive student living"],
    hostelImg: "/assets/campus-brokenshire.webp",
  },

  gcm: {
    name: "Gullas (GCM)",
    clinTitle: "Where Theory Meets Practice — 8 Hospitals, One Strong Future",
    clinSub: "GCM offers strong clinical exposure through eight reputed hospitals — hands-on training and real-time patient care that build skills and confidence for medical careers.",
    hospitals: [
      { name: "Vicente Sotto Memorial Medical Center", type: "Tertiary Government Hospital", note: "One of Cebu's largest referral hospitals — high case volume and advanced procedures." },
      { name: "The Hospital at Maayo (GCGMH)", type: "Primary Teaching Hospital", note: "Gullas's own modern teaching hospital for core, hands-on rotations." },
      { name: "Mandaue Medical Center", type: "Affiliated Hospital", note: "Broad clinical exposure across the major departments." },
      { name: "Cebu City Medical Center", type: "Government Hospital", note: "Community and specialty rotations in a busy city hospital." },
      { name: "Eversley Childs Sanitarium &amp; General Hospital", type: "Specialty Hospital", note: "Specialised care exposure that rounds out clinical training." },
    ],
    clinStats: [
      { n: "8", l: "Affiliated hospitals", icon: "building" },
      { n: "Real-time", l: "Patient care", icon: "users" },
      { n: "Hands-on", l: "Clinical training", icon: "pulse" },
    ],
    tech: {
      title: "More Than a Campus — A Complete Learning Experience",
      sub: "GCM blends advanced technology with theater-style teaching to make learning immersive.",
      items: [
        { icon: "layers", img: "gcm-anatomage", title: "Anatomage Tables", text: "Life-sized digital dissection tables for precise, interactive anatomical study." },
        { icon: "monitor", img: "gcm-smarttv", title: "Smart-TV Laboratories", text: "Four advanced labs, each with six 100-inch Smart TVs for immersive learning." },
        { icon: "cpu", img: "gcm-classroom", title: "Interactive Classrooms", text: "26 air-conditioned classrooms with theater seating and multi-screen interactive technology." },
        { icon: "book", img: "gcm-library", title: "Digital Library & Resources", text: "A well-equipped library with reading room, digital resources and a book bank." },
      ],
    },
    learning: [
      { icon: "users", title: "400-Seat Auditorium", text: "A state-of-the-art auditorium with seating capacity for 400." },
      { icon: "clipboard", title: "Computerized Exam Halls", text: "Two fully computerized examination halls for up to 700 students." },
      { icon: "user", title: "Lounges & Discussion Rooms", text: "Indoor lounges, group discussion spaces and recreational areas." },
      { icon: "book", title: "Mentorship & Counselling", text: "Dedicated mentorship and counselling rooms for student support." },
      { icon: "flask", title: "Library & Cafeterias", text: "Extensive library plus indoor and outdoor cafeterias for staff and students." },
    ],
    hostel: ["Safe &amp; well-equipped hostel facilities", "Premium, comfortable accommodation", "Strong focus on student safety"],
    hostelImg: "/assets/campus-2.webp",
  },

  lyceum: {
    name: "Lyceum (LNU)",
    clinTitle: "Confidence Begins With Clinical Exposure",
    clinSub: "Early hospital exposure and hands-on clinical training from the very start of the journey — building real-world medical understanding and decision-making confidence.",
    hospitals: [
      { name: "Dagupan Doctors Villaflor Memorial Hospital", type: "Clinical Rotations", note: "Core clinical rotations with hands-on patient interaction from the early years." },
      { name: "Pangasinan Medical Center", type: "Specialty Exposure", note: "Specialty department exposure across a busy regional hospital." },
      { name: "Rural Health Units &amp; Barangay Clinics", type: "Community Health", note: "Community health training in rural and primary-care settings." },
    ],
    clinStats: [
      { n: "Early", l: "Hospital exposure", icon: "pulse" },
      { n: "Hands-on", l: "Patient interaction", icon: "users" },
      { n: "Community", l: "&amp; specialty rotations", icon: "shield" },
    ],
    learning: [
      { icon: "user", title: "Simulation Labs", text: "Dedicated simulation labs to practise clinical skills before the wards." },
      { icon: "monitor", title: "Digital Classrooms", text: "Modern, technology-enabled classrooms for interactive learning." },
      { icon: "book", title: "E-Learning Support", text: "E-learning resources and digital materials for study anytime, anywhere." },
      { icon: "flask", title: "Advanced Laboratories", text: "Well-equipped science and clinical-skills laboratories." },
      { icon: "clipboard", title: "Student-Focused Campus", text: "A modern campus built around student comfort and success." },
    ],
    hostel: ["On-campus hostel facilities", "Indian food available", "Safe, student-friendly environment"],
    hostelImg: "/assets/campus-1.webp",
  },

  ucts: {
    name: "UCTS",
    clinTitle: "Real-World Clinical Training",
    clinSub: "Real-time clinical exposure through hospital partnerships, with early patient interaction and supportive Indian faculty throughout.",
    hospitals: [
      { name: "Hospital Partnerships", type: "Clinical Exposure", note: "Real-time clinical exposure through UCT's network of hospital partnerships." },
      { name: "Early Clinical Training", type: "Hands-On Learning", note: "Patient interaction and hands-on training from the early stages of the program." },
      { name: "Simulation Centers", type: "Skills Training", note: "Practise clinical procedures in modern simulation centers before the wards." },
      { name: "Mentored Rotations", type: "Faculty Support", note: "Supportive Indian faculty and mentoring through every clinical rotation." },
    ],
    clinStats: [
      { n: "Real-time", l: "Hospital exposure", icon: "pulse" },
      { n: "English", l: "Medium instruction", icon: "book" },
      { n: "Indian", l: "Faculty &amp; mentors", icon: "users" },
    ],
    learning: [
      { icon: "flask", title: "Advanced Laboratories", text: "Well-equipped labs for the medical sciences and clinical skills." },
      { icon: "user", title: "Simulation Centers", text: "Modern simulation centers to practise clinical procedures safely." },
      { icon: "book", title: "Full-Fledged Library", text: "A comprehensive medical library with digital resources." },
      { icon: "clipboard", title: "Research Facilities", text: "Hands-on student research encouraged across the program." },
      { icon: "monitor", title: "Digital Learning", text: "Technology-enabled, English-medium classrooms for international students." },
    ],
    hostel: ["Comfortable student accommodation", "Safe &amp; secure environment", "Friendly, diverse student community"],
    hostelImg: "/assets/graduation-3.webp",
  },

  "university-of-peace": {
    name: "University of PEACE",
    clinTitle: "Hands-On Training That Builds Confidence",
    clinSub: "A 12-month rotational internship at UNPAZ's affiliated Guido Valadares National Hospital — hands-on rotations across emergency, critical care, wards, theatres, and rural health.",
    hospitals: [
      { name: "Guido Valadares National Hospital", type: "Primary Teaching Hospital", note: "UNPAZ's affiliated national hospital in Dili — a 12-month rotational internship across departments." },
      { name: "Emergency &amp; Critical Care", type: "Clinical Rotation", note: "Rotations through emergency and critical care units." },
      { name: "Wards &amp; Operation Theatres", type: "Clinical Rotation", note: "Ward postings and operation-theatre exposure with direct patient care." },
      { name: "HDU &amp; ICU Settings", type: "Clinical Rotation", note: "Exposure to high-dependency and intensive care settings." },
      { name: "Rural Health Centers", type: "Community Health", note: "Community and rural health rotations for well-rounded training." },
    ],
    clinStats: [
      { n: "12-month", l: "Rotational internship", icon: "pulse" },
      { n: "Hands-on", l: "Patient care", icon: "users" },
      { n: "All depts", l: "Clinical rotations", icon: "shield" },
    ],
    learning: [
      { icon: "monitor", title: "Immersive Learning Space", text: "The ILS offers immersive technologies for anatomical structures and clinical scenarios." },
      { icon: "user", title: "Simulated Patients", text: "Practise clinical scenarios with simulated patients in a safe, intuitive setting." },
      { icon: "flask", title: "Modern Laboratories", text: "Well-equipped laboratories for the medical sciences." },
      { icon: "book", title: "Digital Library &amp; Resources", text: "Comprehensive learning resources and digital materials." },
      { icon: "clipboard", title: "Practical Skill Labs", text: "Hands-on skill development alongside clinical training." },
    ],
    hostel: ["Comfortable student accommodation", "Safe &amp; secure environment", "Indian food available"],
    hostelImg: "/assets/graduation-2.webp",
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
