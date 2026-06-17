/* Sticky mobile CTA bar — Call / WhatsApp / Enquire
   Slides up after 200px scroll on phones (≤768px).
   Injects its own CSS and DOM; suppresses the WhatsApp FAB
   on mobile to avoid duplication. */
(function () {
  function init() {
    if (window.innerWidth > 768) return;

    var bar = null;
    var shown = false;

    function buildBar() {
      var style = document.createElement('style');
      style.textContent =
        '#mobile-cta{position:fixed;bottom:0;left:0;right:0;z-index:9500;display:flex;' +
          'background:rgba(14,13,36,.97);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);' +
          'border-top:1px solid rgba(255,255,255,.12);' +
          'transform:translateY(100%);transition:transform .35s cubic-bezier(.4,0,.2,1);' +
          'padding-bottom:env(safe-area-inset-bottom,0);}' +
        '.mcta-btn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;' +
          'gap:3px;padding:11px 6px;text-decoration:none;border:none;background:none;cursor:pointer;' +
          'color:rgba(255,255,255,.80);font-size:.63rem;font-weight:600;font-family:inherit;' +
          'letter-spacing:.06em;text-transform:uppercase;transition:background .18s;}' +
        '.mcta-btn:active{background:rgba(255,255,255,.08);}' +
        '.mcta-call{color:#4ade80;}' +
        '.mcta-whatsapp{color:#25d366;}' +
        '.mcta-enquire{background:#ee4038;color:#fff!important;}' +
        '.mcta-enquire:active{background:#c93228;}' +
        '@media(max-width:768px){.whatsapp-fab{display:none!important;}}';

      document.head.appendChild(style);

      var b = document.createElement('div');
      b.id = 'mobile-cta';
      b.setAttribute('role', 'toolbar');
      b.setAttribute('aria-label', 'Quick contact options');
      b.innerHTML =
        '<a href="tel:+919444375000" class="mcta-btn mcta-call" aria-label="Call LIMRA">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
          '<span>Call</span>' +
        '</a>' +
        '<a href="https://wa.me/919445783333" target="_blank" rel="noopener" class="mcta-btn mcta-whatsapp" aria-label="WhatsApp LIMRA">' +
          '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' +
          '<span>WhatsApp</span>' +
        '</a>' +
        '<a href="/contact.html" class="mcta-btn mcta-enquire" aria-label="Enquire now">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
          '<span>Enquire</span>' +
        '</a>';

      document.body.appendChild(b);
      return b;
    }

    function onScroll() {
      if (shown) return;
      if (window.scrollY > 200) {
        if (!bar) bar = buildBar();
        shown = true;
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { bar.style.transform = 'translateY(0)'; });
        });
        window.removeEventListener('scroll', onScroll);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
