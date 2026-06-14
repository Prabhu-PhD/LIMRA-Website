/* ============================================================
   home2.js — cursor-reactive hero frame sequence (Home 2 test).

   The hero video was exported to still frames in /assets/hero-seq/
   (frame-0001.jpg …). As the cursor moves horizontally across the
   hero, we swap which preloaded frame is shown, so the scene scrubs
   back and forth. When the mouse is idle it gently auto-drifts.

   To re-export with a different frame count, just change FRAME_COUNT
   (and re-run the ffmpeg extraction with the same naming).
   ============================================================ */
(function () {
  var FRAME_COUNT = 71;                 // number of frames in /assets/hero-seq/
  var DIR = "/assets/hero-seq/";
  var PREFIX = "frame-", EXT = ".jpg", PAD = 4;

  var img  = document.getElementById("heroSeqImg");
  var hero = document.querySelector(".hero2");
  if (!img || !hero || FRAME_COUNT < 2) return;

  function pad(n){ var s = "" + n; while (s.length < PAD) s = "0" + s; return s; }
  function url(i){ return DIR + PREFIX + pad(i + 1) + EXT; }

  // preload every frame so swapping src is instant (no flicker)
  var frames = [];
  for (var i = 0; i < FRAME_COUNT; i++) {
    var im = new Image();
    im.src = url(i);
    frames[i] = im;
  }

  hero.classList.add("is-sequence");

  var current = -1, targetX = 0.5, easeX = 0.5;

  function show(idx) {
    idx = Math.max(0, Math.min(FRAME_COUNT - 1, idx | 0));
    if (idx === current) return;
    var f = frames[idx];
    if (!f || !f.complete) return;      // skip until that frame is ready
    current = idx;
    img.src = f.src;
  }

  // map cursor X across the hero to a target position (0..1)
  function fromClientX(x) {
    var r = hero.getBoundingClientRect();
    targetX = Math.max(0, Math.min(1, (x - r.left) / r.width));
  }
  hero.addEventListener("mousemove", function (e) { fromClientX(e.clientX); });
  hero.addEventListener("mouseleave", function () { targetX = 0.5; });
  // touch: let a finger drag scrub it on mobile
  hero.addEventListener("touchmove", function (e) {
    if (e.touches && e.touches[0]) fromClientX(e.touches[0].clientX);
  }, { passive: true });

  // smooth render loop + subtle idle drift so it feels alive
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
})();
