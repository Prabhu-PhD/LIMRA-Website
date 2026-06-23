/* ============================================================
   home2.js — scroll-driven hero frame sequence (Home 2).

   The hero is wrapped in a tall .hero2-pin spacer (400vh).
   The hero itself is position:sticky so it stays in the viewport
   while the user scrolls through the pin. Scroll progress through
   the pin (0→1) is mapped directly to frame index (0→70), turning
   the page scroll into a video-scrub effect.

   Once the user scrolls past the pin the hero un-sticks and the
   rest of the page scrolls normally — no scroll lock, no preventDefault.

   PERFORMANCE: first frame shows instantly from the HTML src.
   The other 70 frames are deferred to idle time after page load,
   and skipped on data-saver / 2G connections.
   ============================================================ */
(function () {
  var FRAME_COUNT = 71;
  var DIR = "/assets/hero-seq/";
  var PREFIX = "frame-", EXT = ".webp", PAD = 4;

  var img = document.getElementById("heroSeqImg");
  var pin = document.getElementById("hero2Pin");
  if (!img || !pin || FRAME_COUNT < 2) return;

  var conn     = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
  var saveData = conn && conn.saveData;
  var slowNet  = conn && /(^|-)2g$/.test(conn.effectiveType || "");
  if (saveData || slowNet) return; // data-saver / 2G → keep static first frame

  function pad(n) { var s = "" + n; while (s.length < PAD) s = "0" + s; return s; }
  function url(i) { return DIR + PREFIX + pad(i + 1) + EXT; }

  var frames = [], current = -1;
  var targetIdx = 0, dirty = false;

  function preload() {
    for (var i = 0; i < FRAME_COUNT; i++) {
      var im = new Image();
      try { im.fetchPriority = "low"; } catch (e) {}
      im.decoding = "async";
      im.src = url(i);
      frames[i] = im;
    }
    startInteraction();
  }

  function show(idx) {
    idx = Math.max(0, Math.min(FRAME_COUNT - 1, idx | 0));
    if (idx === current) return;
    var f = frames[idx];
    if (!f || !f.complete) return; // frame not ready yet — wait
    current = idx;
    img.src = f.src;
  }

  function fromScroll() {
    var rect   = pin.getBoundingClientRect();
    var pinH   = pin.offsetHeight;
    var vh     = window.innerHeight;
    var travel = pinH - vh;
    if (travel <= 0) return;
    var scrolled = -rect.top; // how far we've scrolled into the pin
    var progress = Math.max(0, Math.min(1, scrolled / travel));
    targetIdx = Math.round(progress * (FRAME_COUNT - 1));
    dirty = true;
  }

  function startInteraction() {
    var hero = document.querySelector(".hero2");
    if (hero) hero.classList.add("is-scroll");

    window.addEventListener("scroll", fromScroll, { passive: true });
    fromScroll(); // set correct frame for current scroll position on load

    function loop() {
      if (dirty) {
        show(targetIdx);
        dirty = false;
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  function whenIdle(fn) {
    if ("requestIdleCallback" in window) requestIdleCallback(fn, { timeout: 3000 });
    else setTimeout(fn, 800);
  }
  if (document.readyState === "complete") whenIdle(preload);
  else window.addEventListener("load", function () { whenIdle(preload); });
})();
