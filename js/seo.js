(function () {
  var cfg = window.LIMRA_CONFIG || {};
  var SITE = (cfg.siteUrl || 'https://www.limraedu.com').replace(/\/$/, '');

  if (cfg.gaId) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + cfg.gaId;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', cfg.gaId);
  }

  function injectLd(data) {
    var el = document.createElement('script');
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify(data);
    document.head.appendChild(el);
  }

  var ORG = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'LIMRA Overseas Education',
    'url': SITE,
    'logo': SITE + '/assets/logo.svg',
    'description': 'LIMRA Overseas Education guides students to premier medical universities in Philippines and Timor-Leste. 24+ years of expertise, 2000+ successful doctors.',
    'telephone': '+91-9444375000',
    'email': 'info@limraedu.com',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'New No.177, Royapettah High Road, SMS Centre, 1st Floor, Mylapore',
      'addressLocality': 'Chennai',
      'addressRegion': 'Tamil Nadu',
      'postalCode': '600004',
      'addressCountry': 'IN'
    },
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+91-9444375000',
      'contactType': 'customer service',
      'areaServed': 'IN',
      'availableLanguage': ['English', 'Tamil', 'Hindi']
    }
  };

  var EDU_ORG = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    'name': 'LIMRA Overseas Education',
    'url': SITE,
    'description': 'LIMRA has guided over 2000 students to medical colleges in Philippines and Timor-Leste for 24+ years. Expert FMGE coaching with 92% pass rate.',
    'foundingDate': '2000',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'New No.177, Royapettah High Road, SMS Centre, 1st Floor, Mylapore',
      'addressLocality': 'Chennai',
      'addressRegion': 'Tamil Nadu',
      'postalCode': '600004',
      'addressCountry': 'IN'
    }
  };

  var FAQ_COACHING = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'What is FMGE and why is it required?',
        'acceptedAnswer': { '@type': 'Answer', 'text': 'FMGE (Foreign Medical Graduate Examination), now called NExT, is a mandatory screening test set by the National Medical Commission (NMC) for Indian students who complete their MBBS abroad and wish to practise medicine in India.' }
      },
      {
        '@type': 'Question',
        'name': 'What is LIMRA\'s FMGE pass rate?',
        'acceptedAnswer': { '@type': 'Answer', 'text': 'LIMRA has maintained a 92% FMGE pass rate over the past decade. Our coaching programme includes 800+ hours of training and 50+ full-length mock tests.' }
      },
      {
        '@type': 'Question',
        'name': 'How long is the FMGE coaching programme?',
        'acceptedAnswer': { '@type': 'Answer', 'text': 'LIMRA\'s FMGE coaching covers 800+ hours of intensive training including theory sessions, clinical case discussions, and regular mock tests. Flexible batch timings are available for students at all stages.' }
      },
      {
        '@type': 'Question',
        'name': 'Is FMGE coaching available online?',
        'acceptedAnswer': { '@type': 'Answer', 'text': 'Yes. LIMRA offers both in-person coaching at its Chennai centre and online coaching through its dedicated learning app, so students can prepare from anywhere.' }
      },
      {
        '@type': 'Question',
        'name': 'Can I join FMGE coaching before completing MBBS abroad?',
        'acceptedAnswer': { '@type': 'Answer', 'text': 'Yes. LIMRA recommends starting FMGE preparation during the final year of MBBS to maximise your score. Early enrolment batches are specifically designed for students in their third or fourth year abroad.' }
      }
    ]
  };

  var FAQ_TOURISM = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'What is medical tourism?',
        'acceptedAnswer': { '@type': 'Answer', 'text': 'Medical tourism is travelling to another country for medical, dental, or surgical treatment — typically at lower cost and with shorter waiting times. LIMRA helps Indian patients access world-class healthcare in Asia.' }
      },
      {
        '@type': 'Question',
        'name': 'Which countries does LIMRA arrange medical tourism to?',
        'acceptedAnswer': { '@type': 'Answer', 'text': 'LIMRA coordinates medical tourism to premier hospitals in the Philippines, Singapore, Thailand, and other Southeast Asian countries that offer international-standard care at a fraction of Western prices.' }
      },
      {
        '@type': 'Question',
        'name': 'What services does LIMRA provide for medical tourists?',
        'acceptedAnswer': { '@type': 'Answer', 'text': 'LIMRA provides end-to-end support: hospital selection, appointment scheduling, visa assistance, flight and accommodation arrangements, local transport, and 24/7 on-ground assistance during your treatment.' }
      },
      {
        '@type': 'Question',
        'name': 'How much can I save on medical treatment through LIMRA?',
        'acceptedAnswer': { '@type': 'Answer', 'text': 'Medical procedures in Asia through LIMRA typically cost 40–80% less than in India or Western countries, without compromising on quality. Savings vary by procedure and destination hospital.' }
      }
    ]
  };

  document.addEventListener('DOMContentLoaded', function () {
    var page = (document.body && document.body.dataset && document.body.dataset.page) || '';

    injectLd(ORG);

    if (page === 'home' || page === 'colleges' || page === 'about') {
      injectLd(EDU_ORG);
    }
    if (page === 'coaching') {
      injectLd(FAQ_COACHING);
    }
    if (page === 'medical-tourism') {
      injectLd(FAQ_TOURISM);
    }
  });
})();
