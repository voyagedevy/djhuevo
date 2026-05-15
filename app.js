/* ================================================
   DJ HUEVO — app.js
   Analytics · Audio · Countdown · Forms · Shopify
   ================================================ */
(function () {

  /* ---- UTM ---- */
  function getUTM() {
    var p = new URLSearchParams(window.location.search);
    return {
      utm_source:   p.get('utm_source')   || '',
      utm_medium:   p.get('utm_medium')   || '',
      utm_campaign: p.get('utm_campaign') || '',
      utm_term:     p.get('utm_term')     || '',
      utm_content:  p.get('utm_content')  || ''
    };
  }

  function injectUTM() {
    var utm = getUTM();
    var map = {
      'f-utm-source':   utm.utm_source,
      'f-utm-medium':   utm.utm_medium,
      'f-utm-campaign': utm.utm_campaign,
      'f-utm-term':     utm.utm_term,
      'f-utm-content':  utm.utm_content,
      'ef-utm-source':  utm.utm_source,
      'ef-utm-medium':  utm.utm_medium,
      'ef-utm-campaign':utm.utm_campaign
    };
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = map[id];
    });
  }

  /* ---- ANALYTICS ---- */
  function track(event, params) {
    var payload = Object.assign({}, params || {}, getUTM());
    if (typeof gtag === 'function') {
      gtag('event', event, payload);
    }
    if (typeof dataLayer !== 'undefined') {
      dataLayer.push(Object.assign({ event: event }, payload));
    }
  }

  /* ---- NAV ---- */
  function initNav() {
    var nav    = document.getElementById('nav');
    var toggle = document.getElementById('nav-toggle');
    var links  = document.getElementById('nav-links');

    if (nav) {
      window.addEventListener('scroll', function () {
        nav.classList.toggle('scrolled', window.scrollY > 40);
      }, { passive: true });
    }

    if (toggle && links) {
      toggle.addEventListener('click', function () {
        var open = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
      });
      links.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          links.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  /* ---- CTA TRACKING ---- */
  function initTracking() {
    document.querySelectorAll('[data-track]').forEach(function (el) {
      el.addEventListener('click', function () {
        track(el.dataset.track, {
          label: el.textContent.trim().substring(0, 60),
          href:  el.href || ''
        });
      });
    });
  }

  /* ---- COUNTDOWN ---- */
  function initCountdown() {
    var target  = new Date('2026-06-02T00:00:00');
    var elDays  = document.getElementById('cd-days');
    var elHours = document.getElementById('cd-hours');
    var elMins  = document.getElementById('cd-mins');
    var elSecs  = document.getElementById('cd-secs');
    var label   = document.getElementById('countdown-label');

    if (!elDays) return;

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
      var now  = new Date();
      var diff = target - now;

      if (diff <= 0) {
        elDays.textContent  = '00';
        elHours.textContent = '00';
        elMins.textContent  = '00';
        elSecs.textContent  = '00';
        if (label) label.textContent = 'After Party Privado — Out Now';
        return;
      }

      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000)  / 60000);
      var s = Math.floor((diff % 60000)    / 1000);

      elDays.textContent  = pad(d);
      elHours.textContent = pad(h);
      elMins.textContent  = pad(m);
      elSecs.textContent  = pad(s);
    }

    tick();
    setInterval(tick, 1000);
  }

  /* ---- AUDIO PLAYER ---- */
  var PLAYLIST = [
    { title: 'Tu Padre',         src: 'audio/tu-padre.m4a' },
    { title: 'Tu Padre 2',       src: 'audio/Tu Padre 2.m4a' },
    { title: 'Mueve Ese Culo',   src: 'audio/Mueve Ese Culo.m4a' },
    { title: 'Dejemos La Atrás', src: 'audio/Dejemos La Atras.m4a' },
    { title: 'Fuck the Club',    src: 'audio/Fuck the Club.m4a' },
    { title: 'INCENTIVO',        src: 'audio/INCENTIVO.m4a' },
    { title: 'Kim K V2',         src: 'audio/Kim K V2.m4a' }
  ];

  function initAudio() {
    var audio    = document.getElementById('audio-el');
    var btn      = document.getElementById('audio-toggle');
    var icon     = document.getElementById('audio-icon');
    var status   = document.getElementById('audio-status');
    var progress = document.getElementById('audio-progress');
    var trackName= document.getElementById('audio-track-name');
    var player   = document.getElementById('audio-player');

    if (!audio || !btn) return;

    var idx = 0;

    function loadTrack(i) {
      audio.src = PLAYLIST[i].src;
      audio.load();
      if (trackName) trackName.textContent = PLAYLIST[i].title;
    }

    loadTrack(0);

    audio.addEventListener('error', function () {
      if (player) player.style.display = 'none';
    });

    audio.addEventListener('timeupdate', function () {
      if (!audio.duration || !progress) return;
      progress.style.width = ((audio.currentTime / audio.duration) * 100) + '%';
    });

    audio.addEventListener('ended', function () {
      idx = (idx + 1) % PLAYLIST.length;
      loadTrack(idx);
      audio.play().catch(function () {});
    });

    btn.addEventListener('click', function () {
      if (audio.paused) {
        audio.play().then(function () {
          icon.textContent  = '❚❚';
          if (status) status.textContent = 'Now playing';
          track('audioPlay', { track_name: PLAYLIST[idx].title });
        }).catch(function () {
          if (status) status.textContent = 'Tap to play';
        });
      } else {
        audio.pause();
        icon.textContent  = '▶';
        if (status) status.textContent = 'Paused';
        track('audioPause', { track_name: PLAYLIST[idx].title });
      }
    });
  }

  /* ---- SCROLL DEPTH ---- */
  function initScrollDepth() {
    var fired = {};
    window.addEventListener('scroll', function () {
      var pct = ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100;
      [25, 50, 75, 100].forEach(function (d) {
        if (!fired[d] && pct >= d) {
          fired[d] = true;
          track('scrollDepth' + d, { depth: d });
        }
      });
    }, { passive: true });
  }

  /* ---- BOOKING FORM ---- */
  function initBookingForm() {
    var form    = document.getElementById('booking-form');
    if (!form) return;

    var started = false;
    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      el.addEventListener('focus', function () {
        if (!started) { started = true; track('bookingStart'); }
      }, { once: false });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name    = (document.getElementById('f-name')    || {}).value || '';
      var email   = (document.getElementById('f-email')   || {}).value || '';
      var date    = (document.getElementById('f-date')    || {}).value || '';
      var venue   = (document.getElementById('f-venue')   || {}).value || '';
      var type    = (document.getElementById('f-type')    || {}).value || '';
      var budget  = (document.getElementById('f-budget')  || {}).value || '';
      var message = (document.getElementById('f-message') || {}).value || '';
      var utm     = getUTM();

      /* validate required */
      var valid = true;
      ['f-name','f-email','f-date','f-type','f-budget'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el && !el.value.trim()) {
          el.classList.add('error');
          el.addEventListener('input', function () { el.classList.remove('error'); }, { once: true });
          valid = false;
        }
      });
      if (!valid) return;

      track('bookingSubmit', { event_type: type, budget: budget });

      var subject = encodeURIComponent('Booking Inquiry — ' + name + ' | ' + date);
      var body    = encodeURIComponent([
        'Name: '        + name,
        'Email: '       + email,
        'Date: '        + date,
        'Venue: '       + venue,
        'Event Type: '  + type,
        'Budget: '      + budget,
        '',
        'Message:',
        message,
        '',
        '---',
        'Source: ' + utm.utm_source + ' / ' + utm.utm_medium + ' / ' + utm.utm_campaign
      ].join('\n'));

      window.location.href = 'mailto:devinjones1606@gmail.com?subject=' + subject + '&body=' + body;

      form.innerHTML = [
        '<div class="form-success">',
        '  <p class="form-success-title">Inquiry Sent</p>',
        '  <p class="form-success-sub">We\'ll be in touch within 24 hours.</p>',
        '</div>'
      ].join('');
    });
  }

  /* ---- EMAIL FORM ---- */
  function initEmailForm() {
    var form = document.getElementById('email-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = document.getElementById('ef-email');
      if (!input || !input.value.includes('@')) return;

      track('emailSignup', { source: 'email-section', email: input.value });

      form.innerHTML = [
        '<div class="form-success">',
        '  <p class="form-success-title">You\'re in.</p>',
        '  <p class="form-success-sub">First to know when the album drops and merch goes live.</p>',
        '</div>'
      ].join('');
    });
  }

  /* ---- SHOPIFY BUY BUTTON ---- */
  function initShopify() {
    var node = document.getElementById('collection-component-1778036588622');
    if (!node) return;

    function mount() {
      if (!window.ShopifyBuy || !window.ShopifyBuy.UI) return;

      var client = window.ShopifyBuy.buildClient({
        domain:                 '0rdbbc-mm.myshopify.com',
        storefrontAccessToken:  'b0f8c60c5ada07279964f2404b433521'
      });

      window.ShopifyBuy.UI.onReady(client).then(function (ui) {
        ui.createComponent('collection', {
          id:           '530465980635',
          node:         node,
          moneyFormat:  '%24%7B%7Bamount%7D%7D',
          options: {
            product: {
              styles: {
                product: {
                  '@media (min-width: 601px)': {
                    'max-width':    'calc(33.33% - 20px)',
                    'margin-left':  '20px',
                    'margin-bottom':'30px',
                    width:          'calc(33.33% - 20px)'
                  }
                },
                button: {
                  'font-family':    'Inter, sans-serif',
                  'font-weight':    '700',
                  'background-color': '#2ECC71',
                  color:            '#000000',
                  ':hover': { 'background-color': '#27ae60', color: '#000' },
                  ':focus': { 'background-color': '#27ae60' },
                  'border-radius':  '8px',
                  'font-size':      '13px',
                  'padding':        '12px 20px'
                },
                title:  { color: '#ffffff' },
                price:  { color: '#2ECC71' },
                compareAt: { color: '#888888' }
              },
              text: { button: 'Add to Cart' }
            },
            productSet: {
              styles: {
                products: {
                  '@media (min-width: 601px)': { 'margin-left': '-20px' }
                }
              }
            },
            modalProduct: {
              contents: { imgWithCarousel: true, buttonWithQuantity: true, img: false, button: false },
              styles: {
                button: {
                  'font-family':      'Inter, sans-serif',
                  'font-weight':      '700',
                  'background-color': '#2ECC71',
                  color:              '#000000',
                  'border-radius':    '8px'
                }
              },
              text: { button: 'Add to Cart' }
            },
            cart: {
              styles: {
                button: {
                  'font-family':      'Inter, sans-serif',
                  'font-weight':      '700',
                  'background-color': '#2ECC71',
                  color:              '#000000',
                  'border-radius':    '8px'
                }
              },
              text: { total: 'Subtotal', button: 'Checkout' }
            },
            toggle: {
              styles: {
                toggle: { 'background-color': '#2ECC71' },
                count:  { color: '#000000' },
                iconPath: { fill: '#000000' }
              }
            }
          }
        });
      });
    }

    /* wire "Shop" CTA to open Shopify drawer if it exists */
    var shopCta = document.getElementById('shop-cta');
    if (shopCta) {
      shopCta.addEventListener('click', function () {
        track('ctaMerchClick', { source: 'shop-cta' });
        node.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }

    if (window.ShopifyBuy && window.ShopifyBuy.UI) {
      mount();
    } else {
      window.addEventListener('load', mount);
    }
  }

  /* ---- CURSOR ---- */
  function initCursor() {
    var dot = document.getElementById('cursor-dot');
    var orb = document.getElementById('cursor-orb');
    if (!dot || !orb) return;

    /* skip on touch-only devices */
    if (!window.matchMedia('(hover: hover)').matches) return;

    var mouseX = 0, mouseY = 0;
    var orbX   = 0, orbY   = 0;
    var raf;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      /* dot follows instantly */
      dot.style.transform = 'translate(' + (mouseX - 3) + 'px,' + (mouseY - 3) + 'px)';
      spawnSpore(mouseX, mouseY);
    });

    /* orb follows with spring lag */
    function animateOrb() {
      orbX += (mouseX - orbX) * 0.1;
      orbY += (mouseY - orbY) * 0.1;
      orb.style.transform = 'translate(' + (orbX - 18) + 'px,' + (orbY - 18) + 'px)';
      raf = requestAnimationFrame(animateOrb);
    }
    raf = requestAnimationFrame(animateOrb);

    /* hover state on interactive elements */
    var interactives = 'a, button, [data-track], input, select, textarea, .merch-card, .platform-btn';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(interactives)) {
        dot.classList.add('hovering');
        orb.classList.add('hovering');
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(interactives)) {
        dot.classList.remove('hovering');
        orb.classList.remove('hovering');
      }
    });

    document.addEventListener('mousedown', function () {
      dot.classList.add('clicking');
      orb.classList.add('clicking');
    });
    document.addEventListener('mouseup', function () {
      dot.classList.remove('clicking');
      orb.classList.remove('clicking');
    });

    /* hide/show when leaving window */
    document.addEventListener('mouseleave', function () {
      dot.style.opacity = '0';
      orb.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
      dot.style.opacity = '1';
      orb.style.opacity = '1';
    });
  }

  /* ---- SPORE TRAIL ---- */
  var sporeThrottle = 0;
  function spawnSpore(x, y) {
    var now = Date.now();
    if (now - sporeThrottle < 40) return; /* ~25 spores/sec max */
    sporeThrottle = now;

    var s = document.createElement('div');
    s.className = 'cursor-spore';
    var size = 3 + Math.random() * 5;
    s.style.cssText = [
      'width:'  + size + 'px',
      'height:' + size + 'px',
      'left:'   + (x - size / 2) + 'px',
      'top:'    + (y - size / 2) + 'px',
      'opacity:' + (0.5 + Math.random() * 0.4)
    ].join(';');
    document.body.appendChild(s);

    /* animate: drift upward + sideways, fade out */
    var driftX = (Math.random() - 0.5) * 28;
    var driftY = -(18 + Math.random() * 24);
    var dur    = 600 + Math.random() * 400;
    var start  = null;

    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var ease = 1 - Math.pow(1 - p, 2);
      s.style.transform = 'translate(' + (driftX * ease) + 'px,' + (driftY * ease) + 'px)';
      s.style.opacity   = String((1 - p) * 0.7);
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        s.parentNode && s.parentNode.removeChild(s);
      }
    }
    requestAnimationFrame(step);
  }

  /* ---- INIT ---- */
  document.addEventListener('DOMContentLoaded', function () {
    injectUTM();
    initCursor();
    initNav();
    initTracking();
    initCountdown();
    initAudio();
    initScrollDepth();
    initBookingForm();
    initEmailForm();
    initShopify();
    track('pageview', { page: 'djhuevo-home' });
  });

})();
