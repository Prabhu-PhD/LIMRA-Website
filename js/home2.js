/* ============================================================
   home2.js — cursor-reactive hero frame sequence (Home 2 test).

   The hero video was exported to still frames in /assets/hero-seq/
   (frame-0001.jpg …). As the cursor moves horizontally across the
   hero, we swap which preloaded frame is shown, so the scene scrubs
   back and forth. When the mouse is idle it gently auto-drifts.

   PERFORMANCE: the single first frame (in the HTML) shows instantly.
   The full 71-frame preload is opt-in and only happens when it's
   actually useful + cheap:
     • desktop only (fine pointer / hover) — phones keep the static frame
     • deferred to idle time after the page has finished loading
     • skipped when the browser's Data Saver is on
   So mobile users download ZERO extra frames, and desktop frames load
   in the background without competing with the real page content.

   To re-export with a different frame count, change FRAME_COUNT
   (and re-run the ffmpeg extraction with the same naming).
   ============================================================ */
(function () {
  var FRAME_COUNT = 71;                 // number of frames in /assets/hero-seq/
  var DIR = "/assets/hero-seq/";
  var PREFIX = "frame-", EXT = ".jpg", PAD = 4;

  var img  = document.getElementById("heroSeqImg");
  var hero = document.querySelector(".hero2");
  if (!img || !hero || FRAME_COUNT < 2) return;

  // ---- decide whether the scrub is worth loading ----
  var hasHover  = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var conn      = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
  var saveData  = conn && conn.saveData;
  var slowNet   = conn && /(^|-)2g$/.test(conn.effectiveType || "");   // 2g / slow-2g
  if (!hasHover || saveData || slowNet) return;   // mobile / data-saver / very slow → keep static frame

  function pad(n){ var s = "" + n; while (s.length < PAD) s = "0" + s; return s; }
  function url(i){ return DIR + PREFIX + pad(i + 1) + EXT; }

  var frames = [], current = -1, targetX = 0.5, easeX = 0.5, started = false;

  // ---- preload every frame so swapping src is instant (no flicker) ----
  function preload() {
    for (var i = 0; i < FRAME_COUNT; i++) {
      var im = new Image();
      try { im.fetchPriority = "low"; } catch (e) {}   // don't fight critical assets
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
    if (!f || !f.complete) return;      // skip until that frame is ready
    current = idx;
    img.src = f.src;
  }

  function fromClientX(x) {
    var r = hero.getBoundingClientRect();
    targetX = Math.max(0, Math.min(1, (x - r.left) / r.width));
  }

  function startInteraction() {
    if (started) return;
    started = true;
    hero.classList.add("is-sequence");
    hero.addEventListener("mousemove", function (e) { fromClientX(e.clientX); });
    hero.addEventListener("mouseleave", function () { targetX = 0.5; });

    var t = 0;
    function loop() {
      t += 0.01;
      var drift = 0.5 + Math.sin(t) * 0.05;          // gentle breathing when idle
      var goal = targetX * 0.86 + drift * 0.14;
      easeX += (goal - easeX) * 0.12;                // easing toward the goal
      show(Math.round(easeX * (FRAME_COUNT - 1)));
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  // ---- kick off preloading only once the page is done + the browser is idle ----
  function whenIdle(fn) {
    if ("requestIdleCallback" in window) requestIdleCallback(fn, { timeout: 3000 });
    else setTimeout(fn, 800);
  }
  if (document.readyState === "complete") whenIdle(preload);
  else window.addEventListener("load", function () { whenIdle(preload); });
})();
