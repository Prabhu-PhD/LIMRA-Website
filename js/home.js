/* ============================================================
   LIMRA HOMEPAGE — interactions
   Orbit · count-up · sticky nav · mobile menu · scroll reveal ·
   hero intro · enquiry form · testimonials carousel · gallery lightbox
   ============================================================ */
(function () {
  "use strict";

  /* ---------- STICKY NAV ---------- */
  var nav = document.getElementById("nav");
  function onScroll() { if (nav) nav.classList.toggle("scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- MOBILE MENU ---------- */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        if (a.parentElement.classList.contains("nav-dropdown") && window.innerWidth <= 900) return;
        menu.classList.remove("open"); toggle.classList.remove("open");
      });
    });
  }
  document.querySelectorAll(".nav-dropdown > a").forEach(function (a) {
    a.addEventListener("click", function (e) {
      if (window.innerWidth <= 900) { e.preventDefault(); a.parentElement.classList.toggle("open"); }
    });
  });

  /* ---------- COUNT-UP ---------- */
  function animateCount(el) {
    if (el.dataset.done) return; el.dataset.done = "1";
    var target = +el.dataset.count, suffix = el.dataset.suffix || "", dur = 1800, start = null;
    function tick(now) {
      if (!start) start = now;
      var p = Math.min((now - start) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(e * target).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- ORBIT VISUAL ---------- */
  var SIZE = 560, C = SIZE / 2, HUB_R = 92; // lines start at the outer ring, not the centre
  var nodes = [
    { r: 150, deg: -18, s: 64, img: 12 }, { r: 235, deg: 28, s: 54, img: 5 },
    { r: 165, deg: 84, s: 58, img: 31 }, { r: 240, deg: 132, s: 62, img: 23 },
    { r: 150, deg: 198, s: 52, img: 48 }, { r: 232, deg: 236, s: 60, img: 9 },
    { r: 172, deg: 288, s: 56, img: 60 }, { r: 240, deg: 322, s: 50, img: 40 },
    { r: 120, deg: 158, s: 46, img: 15 }
  ];
  var lines = document.getElementById("lines");
  var orbitField = document.getElementById("orbitField");
  if (lines && orbitField) {
    nodes.forEach(function (n) {
      var a = (n.deg * Math.PI) / 180;
      var x = C + n.r * Math.cos(a), y = C + n.r * Math.sin(a);
      var sx = C + HUB_R * Math.cos(a), sy = C + HUB_R * Math.sin(a); // start on the ring edge
      var ln = document.createElementNS("http://www.w3.org/2000/svg", "line");
      ln.setAttribute("x1", sx); ln.setAttribute("y1", sy);
      ln.setAttribute("x2", x); ln.setAttribute("y2", y);
      lines.appendChild(ln);
      var dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("cx", x); dot.setAttribute("cy", y); dot.setAttribute("r", 2.5);
      lines.appendChild(dot);
      var el = document.createElement("div");
      el.className = "node";
      el.style.width = n.s + "px"; el.style.height = n.s + "px";
      el.style.left = (x / SIZE) * 100 + "%"; el.style.top = (y / SIZE) * 100 + "%";
      el.innerHTML = '<div class="face"><img loading="lazy" width="160" height="160" alt="LIMRA student" src="/assets/default-avatar.svg"></div>';
      orbitField.appendChild(el);
    });
  }

  /* ---------- HERO INTRO ---------- */
  function runHero() {
    var lineEls = lines ? lines.querySelectorAll("line") : [];
    lineEls.forEach(function (l) {
      var len = Math.hypot(l.x2.baseVal.value - l.x1.baseVal.value, l.y2.baseVal.value - l.y1.baseVal.value);
      l.style.strokeDasharray = len; l.style.strokeDashoffset = len;
    });
    if (!window.gsap) {
      document.querySelectorAll(".hero-stats [data-count]").forEach(animateCount);
      lineEls.forEach(function (l) { l.style.transition = "stroke-dashoffset .8s ease"; l.style.strokeDashoffset = 0; });
      return;
    }
    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero h1", { y: 30, opacity: 0, duration: 0.8 })
      .from(".hero .lead", { y: 24, opacity: 0, duration: 0.7 }, "-=.45")
      .from(".cta-row", { y: 20, opacity: 0, duration: 0.6 }, "-=.4")
      .from(".hero-stats", { y: 20, opacity: 0, duration: 0.6, onStart: function () {
          document.querySelectorAll(".hero-stats [data-count]").forEach(animateCount);
        } }, "-=.4")
      .from("#hub", { scale: 0.5, opacity: 0, duration: 0.8, ease: "back.out(1.6)" }, "-=1.1")
      .from(".node", { scale: 0, opacity: 0, duration: 0.6, stagger: 0.07, ease: "back.out(2)" }, "-=.4")
      .to(lineEls, { strokeDashoffset: 0, duration: 0.7, stagger: 0.05 }, "-=.6")
      .from(".wordmark", { y: 60, opacity: 0, duration: 1 }, "-=1.2");
  }
  window.addEventListener("load", runHero);

  /* ---------- SCROLL REVEAL ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      entry.target.querySelectorAll("[data-count]").forEach(animateCount);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal, [data-count-section]").forEach(function (el) { io.observe(el); });

  /* ---------- ENQUIRY FORM ---------- */
  /* Submission is handled host-agnostically by /js/forms.js (Web3Forms). */

  /* ---------- TESTIMONIALS CAROUSEL ---------- */
  (function () {
    var track = document.getElementById("testiTrack");
    if (!track) return;
    var viewport = track.parentElement;
    var dotsWrap = document.getElementById("testiDots");
    var prev = document.getElementById("testiPrev");
    var next = document.getElementById("testiNext");
    var cards = Array.prototype.slice.call(track.children);
    var idx = 0, timer = null;

    function perView() { return window.innerWidth <= 700 ? 1 : (window.innerWidth <= 1080 ? 2 : 3); }
    function maxIdx() { return Math.max(0, cards.length - perView()); }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      for (var i = 0; i <= maxIdx(); i++) {
        var b = document.createElement("button");
        b.className = "carousel-dot"; b.setAttribute("aria-label", "Go to slide " + (i + 1));
        (function (i) { b.addEventListener("click", function () { go(i); restart(); }); })(i);
        dotsWrap.appendChild(b);
      }
    }
    function go(i) {
      idx = Math.max(0, Math.min(i, maxIdx()));
      var card = cards[0];
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 0) || 0;
      var step = card.getBoundingClientRect().width + gap;
      track.style.transform = "translateX(" + (-idx * step) + "px)";
      if (dotsWrap) Array.prototype.forEach.call(dotsWrap.children, function (d, di) { d.classList.toggle("active", di === idx); });
    }
    function nextSlide() { go(idx >= maxIdx() ? 0 : idx + 1); }
    function restart() { if (timer) clearInterval(timer); timer = setInterval(nextSlide, 4500); }

    if (next) next.addEventListener("click", function () { nextSlide(); restart(); });
    if (prev) prev.addEventListener("click", function () { go(idx - 1); restart(); });
    viewport.addEventListener("mouseenter", function () { if (timer) clearInterval(timer); });
    viewport.addEventListener("mouseleave", restart);
    var rt;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { buildDots(); go(idx); }, 150); });
    buildDots(); go(0); restart();
  })();

  /* ---------- GALLERY MARQUEE (clone rows for seamless loop) ---------- */
  document.querySelectorAll(".marquee-row").forEach(function (row) {
    Array.prototype.slice.call(row.children).forEach(function (child) {
      var clone = child.cloneNode(true);
      clone.setAttribute("data-clone", "1");
      clone.setAttribute("aria-hidden", "true");
      row.appendChild(clone);
    });
  });

  /* ---------- GALLERY LIGHTBOX ---------- */
  (function () {
    var items = document.querySelectorAll(".gallery-item");
    if (!items.length) return;
    var box = document.getElementById("lightbox");
    if (!box) return;
    var lbImg = box.querySelector("img");
    var lbCap = box.querySelector(".lightbox-cap");
    var originals = Array.prototype.filter.call(items, function (it) { return !it.hasAttribute("data-clone"); });
    var list = originals.map(function (it) {
      return { src: it.querySelector("img").getAttribute("src"), cap: (it.querySelector(".gallery-cap") || {}).textContent || "" };
    });
    var cur = 0;
    function show(i) {
      cur = (i + list.length) % list.length;
      lbImg.src = list[cur].src; lbCap.textContent = list[cur].cap;
      box.classList.add("open"); document.body.style.overflow = "hidden";
    }
    function hide() { box.classList.remove("open"); document.body.style.overflow = ""; }
    items.forEach(function (it) {
      it.addEventListener("click", function () {
        var src = it.querySelector("img").getAttribute("src");
        var i = 0; for (var k = 0; k < list.length; k++) { if (list[k].src === src) { i = k; break; } }
        show(i);
      });
    });
    box.querySelector(".lightbox-close").addEventListener("click", hide);
    box.querySelector(".lightbox-next").addEventListener("click", function (e) { e.stopPropagation(); show(cur + 1); });
    box.querySelector(".lightbox-prev").addEventListener("click", function (e) { e.stopPropagation(); show(cur - 1); });
    box.addEventListener("click", function (e) { if (e.target === box) hide(); });
    document.addEventListener("keydown", function (e) {
      if (!box.classList.contains("open")) return;
      if (e.key === "Escape") hide();
      else if (e.key === "ArrowRight") show(cur + 1);
      else if (e.key === "ArrowLeft") show(cur - 1);
    });
  })();

  /* ---------- FOOTER YEAR ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
