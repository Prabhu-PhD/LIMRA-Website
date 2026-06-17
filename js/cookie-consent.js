/* Cookie-consent banner — sets limra_consent=yes|no for 365 days.
   GA loads only after explicit acceptance (and only when a real GA ID is configured). */
(function () {
  var COOKIE_NAME = 'limra_consent';
  var DAYS = 365;

  function readConsent() {
    var pair = document.cookie.split(';').find(function (c) {
      return c.trim().startsWith(COOKIE_NAME + '=');
    });
    return pair ? pair.trim().split('=')[1] : null;
  }

  function writeConsent(value) {
    var exp = new Date(Date.now() + DAYS * 864e5).toUTCString();
    document.cookie = COOKIE_NAME + '=' + value + ';expires=' + exp + ';path=/;SameSite=Lax';
  }

  function loadGA() {
    var id = window._gaId;
    if (!id || id === 'G-XXXXXXXXXX' || window.__gaLoaded) return;
    window.__gaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(s);
    s.onload = function () {
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', id);
    };
  }

  function removeBanner(el) {
    el.style.transform = 'translateY(100%)';
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 380);
  }

  var consent = readConsent();

  if (consent === 'yes') { loadGA(); return; }
  if (consent === 'no') { return; }

  /* ── Build banner ── */
  var b = document.createElement('div');
  b.id = 'cookie-banner';
  b.setAttribute('role', 'dialog');
  b.setAttribute('aria-label', 'Cookie consent');
  b.setAttribute('aria-live', 'polite');

  b.innerHTML =
    '<div class="cb-inner">' +
      '<p class="cb-text">We use cookies to improve your experience and analyse site traffic. ' +
        'By clicking <strong>Accept</strong> you agree to our ' +
        '<a href="/privacy.html">Privacy Policy</a>.</p>' +
      '<div class="cb-btns">' +
        '<button id="cb-decline">Decline</button>' +
        '<button id="cb-accept">Accept</button>' +
      '</div>' +
    '</div>';

  var style = document.createElement('style');
  style.textContent = [
    '#cookie-banner{',
      'position:fixed;bottom:0;left:0;right:0;z-index:9800;',
      'background:rgba(14,13,36,.97);',
      'backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);',
      'border-top:1px solid rgba(255,255,255,.10);',
      'padding:14px 20px;',
      'transform:translateY(100%);',
      'transition:transform .35s cubic-bezier(.4,0,.2,1);',
    '}',
    '#cookie-banner .cb-inner{',
      'max-width:1100px;margin:0 auto;',
      'display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;',
    '}',
    '#cookie-banner .cb-text{',
      'margin:0;font-size:.82rem;line-height:1.55;color:rgba(255,255,255,.80);flex:1 1 240px;',
    '}',
    '#cookie-banner .cb-text a{color:#f97316;text-decoration:underline;}',
    '#cookie-banner .cb-btns{display:flex;gap:8px;flex-shrink:0;}',
    '#cb-decline{',
      'padding:7px 16px;border-radius:6px;border:1px solid rgba(255,255,255,.28);',
      'background:transparent;color:rgba(255,255,255,.75);font-size:.78rem;cursor:pointer;',
      'font-family:inherit;transition:border-color .2s;',
    '}',
    '#cb-decline:hover{border-color:rgba(255,255,255,.55);}',
    '#cb-accept{',
      'padding:7px 20px;border-radius:6px;border:none;',
      'background:#ee4038;color:#fff;font-size:.78rem;font-weight:600;cursor:pointer;',
      'font-family:inherit;transition:background .2s;',
    '}',
    '#cb-accept:hover{background:#d63027;}',
    '@media(max-width:480px){',
      '#cookie-banner .cb-btns{width:100%;justify-content:flex-end;}',
    '}'
  ].join('');

  document.head.appendChild(style);
  document.body.appendChild(b);

  requestAnimationFrame(function () {
    requestAnimationFrame(function () { b.style.transform = 'translateY(0)'; });
  });

  document.getElementById('cb-accept').addEventListener('click', function () {
    writeConsent('yes');
    removeBanner(b);
    loadGA();
  });

  document.getElementById('cb-decline').addEventListener('click', function () {
    writeConsent('no');
    removeBanner(b);
  });
})();
