/* ============================================================
   home2.js — cursor-reactive hero for the Home 2 test page.

   TWO MODES (auto-detected):
   1. STATIC  — if FRAME_COUNT is 0, the hero just shows the single
                image already in the markup (assets/hero-student.png).
   2. SEQUENCE — set FRAME_COUNT to the number of exported frames and
                drop them in assets/hero-seq/ named frame-0001.jpg …
                The hero then scrubs through the frames as the cursor
                moves horizontally across the figure (and gently
                auto-drifts when the mouse is elsewhere).

   >>> TO ENABLE THE VIDEO/PNG SEQUENCE <<<
   - Export your clip as still frames (JPG or WebP, ~720–900px tall).
   - Name them frame-0001.jpg, frame-0002.jpg, … in assets/hero-seq/.
   - Set FRAME_COUNT below to how many frames you exported.
   ============================================================ */
(function () {
  var FRAME_COUNT = 0;                 // 0 = static image. e.g. set to 60 once frames are added.
  var FRAME_DIR   = "/assets/hero-seq/";
  var FRAME_PREFIX = "frame-";
  var FRAME_EXT   = ".jpg";
  var FRAME_PAD   = 4;                  // frame-0001 -> 4 digits

  var figure = document.querySelector(".hero2-figure");
  if (!figure) return;

  // ---- STATIC MODE: nothing to wire up, the <img> just shows ----
  if (!FRAME_COUNT || FRAME_COUNT < 2) return;

  // ---- SEQUENCE MODE ----
  figure.classList.add("is-sequence");
  var staticImg = figure.querySelector("img");
  if (staticImg) staticImg.style.display = "none";

  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  figure.insertBefore(canvas, figure.firstChild);

  var frames = [];
  var loaded = 0;
  var current = -1;
  var targetX = 0.5;   // 0..1 — where we want to be
  var easeX = 0.5;     // 0..1 — eased actual position

  function pad(n) { var s = "" + n; while (s.length < FRAME_PAD) s = "0" + s; return s; }

  function frameURL(i) { return FRAME_DIR + FRAME_PREFIX + pad(i + 1) + FRAME_EXT; }

  // preload every frame
  for (var i = 0; i < FRAME_COUNT; i++) {
    (function (idx) {
      var im = new Image();
      im.onload = function () {
        loaded++;
        if (loaded === 1) { sizeCanvas(); draw(0); }   // show first frame asap
      };
      im.src = frameURL(idx);
      frames[idx] = im;
    })(i);
  }

  function sizeCanvas() {
    var f = frames[0];
    if (!f || !f.naturalWidth) return;
    var rect = figure.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    // fit the frame's aspect ratio into the figure height
    var ratio = f.naturalWidth / f.naturalHeight;
    var h = rect.height, w = h * ratio;
    canvas.style.height = h + "px";
    canvas.style.width = w + "px";
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    canvas._w = w; canvas._h = h;
  }

  function draw(idx) {
    idx = Math.max(0, Math.min(FRAME_COUNT - 1, idx | 0));
    if (idx === current) return;
    var f = frames[idx];
    if (!f || !f.naturalWidth) return;
    current = idx;
    ctx.clearRect(0, 0, canvas._w, canvas._h);
    ctx.drawImage(f, 0, 0, canvas._w, canvas._h);
  }

  // cursor → target position. Use the whole hero so it feels responsive,
  // but weight it toward the figure side.
  var hero = figure.closest(".hero2") || document.body;
  hero.addEventListener("mousemove", function (e) {
    var rect = hero.getBoundingClientRect();
    targetX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  });
  hero.addEventListener("mouseleave", function () { targetX = 0.5; });

  // smooth render loop with a tiny idle auto-drift so it feels alive
  var t = 0;
  function loop() {
    t += 0.01;
    var drift = 0.5 + Math.sin(t) * 0.06;          // gentle breathing when idle
    var goal = targetX * 0.85 + drift * 0.15;
    easeX += (goal - easeX) * 0.12;                // easing
    draw(Math.round(easeX * (FRAME_COUNT - 1)));
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  window.addEventListener("resize", function () { sizeCanvas(); current = -1; draw(Math.round(easeX * (FRAME_COUNT - 1))); });
})();
