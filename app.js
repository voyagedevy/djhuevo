(function () {
  const store = window.DJHUEVO_STORE || { products: [], rooms: [], shopify: {} };
  const productById = Object.fromEntries(store.products.map(function (product) {
    return [product.id, product];
  }));

  function productCard(product, extraClass) {
    return [
      '<button class="' + extraClass + '" type="button" data-open-shop data-product-id="' + product.id + '">',
      '  <img src="' + product.image + '" alt="' + product.alt + '" />',
      '  <span>' + product.category + '</span>',
      '  <b>' + product.name + '</b>',
      '  <small>' + product.variant + ' / ' + product.price + '</small>',
      '</button>'
    ].join('');
  }

  function hotspotMarkup(hotspot) {
    const product = productById[hotspot.productId];
    if (!product) return '';

    return [
      '<button class="scene-hotspot ' + hotspot.className + (hotspot.featured ? ' is-featured' : '') + '" type="button" data-open-shop data-product-id="' + product.id + '">',
      '  <span class="hotspot-dot"></span>',
      '  <span class="hotspot-card">',
      '    <img src="' + product.image + '" alt="' + product.alt + '" />',
      '    <b>' + (hotspot.label || product.name) + '</b>',
      '    <small>' + (hotspot.meta || product.variant + ' / ' + product.price) + '</small>',
      '  </span>',
      '</button>'
    ].join('');
  }

  function streamingRailMarkup(extraClass) {
    const links = store.streamingLinks || [];
    if (!links.length) return '';

    return [
      '<div class="streaming-rail ' + (extraClass || '') + '">',
      links.map(function (link) {
        return [
          '<a class="stream-link stream-tone-' + link.tone + '" href="' + link.href + '" target="_blank" rel="noopener">',
          '  <span></span>',
          '  <b>' + link.name + '</b>',
          '</a>'
        ].join('');
      }).join(''),
      '</div>'
    ].join('');
  }

  function bookingTeaseMarkup(extraClass) {
    const booking = store.booking || {};

    return [
      '<a class="booking-tease ' + (extraClass || '') + '" href="' + (booking.href || 'booking.html') + '">',
      '  <span>Bookings</span>',
      '  <b>' + (booking.title || 'Book DJ Huevo') + '</b>',
      '  <small>' + (booking.rate || '$100/hr minimum') + '</small>',
      '</a>'
    ].join('');
  }

  function renderRoomsPage() {
    const map = document.getElementById('property-map');
    const list = document.getElementById('map-room-list');
    const roomViews = document.getElementById('room-views');
    const musicPanel = document.getElementById('map-music-panel');
    const bookingPanel = document.getElementById('map-booking-panel');

    if (!map || !list || !roomViews) return;

    if (musicPanel) {
      musicPanel.innerHTML = [
        '<p>Now Playing</p>',
        '<b>Tu Padre</b>',
        '<small>DJ Huevo signal live</small>',
        streamingRailMarkup('streaming-rail-compact')
      ].join('');
    }

    if (bookingPanel && store.booking) {
      bookingPanel.href = store.booking.href;
      bookingPanel.innerHTML = [
        '<span>Bookings</span>',
        '<b>' + store.booking.title + '</b>',
        '<small>' + store.booking.rate + '</small>'
      ].join('');
    }

    map.innerHTML = store.rooms.map(function (room) {
      return [
        '<button class="map-room ' + room.mapClass + '" type="button" data-enter-room="' + room.id + '">',
        '  <span>' + room.title + '</span>',
        '  <small>' + room.subtitle + '</small>',
        '</button>'
      ].join('');
    }).join('') + '<div class="map-drive" aria-hidden="true"></div>';

    list.innerHTML = store.rooms.map(function (room) {
      return '<button type="button" data-enter-room="' + room.id + '">Enter ' + room.title + '</button>';
    }).join('');

    roomViews.innerHTML = store.rooms.map(function (room) {
      const extras = [];

      if (room.album) {
        extras.push([
          '<div class="album-object">',
          '  <img src="images/album-cover.jpg" alt="Vamonos de Aqui album cover" />',
          '  <div><p>Album Drop</p><strong>June 2, 2026</strong></div>',
          '</div>'
        ].join(''));
      }

      if (room.listen) {
        extras.push('<button class="listen-hotspot" type="button" data-play-preview><span></span>Tu Padre</button>');
      }

      if (room.services) {
        extras.push([
          '<aside class="room-service-panel" aria-label="Streaming service links">',
          '  <p>Listen everywhere</p>',
          streamingRailMarkup('streaming-rail-stacked'),
          '</aside>'
        ].join(''));
      }

      if (room.booking) {
        extras.push(bookingTeaseMarkup('room-booking-tease'));
      }

      return [
        '<section class="house-view store-room ' + room.viewClass + '" id="' + room.id + '" data-view="' + room.id + '" aria-label="' + room.title + ' shopping room">',
        '  <div class="room-bg ' + room.bgClass + '" aria-hidden="true"></div>',
        '  <a class="room-walk room-walk-prev" href="#' + room.prev + '"><span aria-hidden="true">&larr;</span> Enter ' + room.prev + '</a>',
        '  <a class="room-walk room-walk-next" href="#' + room.next + '">Enter ' + room.next + ' <span aria-hidden="true">&rarr;</span></a>',
        '  <div class="room-label"><p>' + room.number + '</p><h2>' + room.title + '</h2></div>',
        extras.join(''),
        room.hotspots.map(hotspotMarkup).join(''),
        '</section>'
      ].join('');
    }).join('');
  }

  function renderArchivePage() {
    const productsNode = document.getElementById('archive-products');

    if (productsNode) {
      productsNode.innerHTML = store.products.map(function (product) {
        return productCard(product, 'archive-product-card');
      }).join('');
    }
  }

  function renderSharedPanels() {
    document.querySelectorAll('#archive-streaming, #booking-streaming').forEach(function (node) {
      node.innerHTML = streamingRailMarkup(node.id === 'booking-streaming' ? 'streaming-rail-bright' : '');
    });
  }

  function syncCartCount() {
    const count = window.localStorage.getItem('djhuevo-cart-count') || '0';
    document.querySelectorAll('[data-cart-count]').forEach(function (node) {
      node.textContent = count;
    });
  }

  function setupIntro() {
    const intro = document.getElementById('huevo-intro');
    if (!intro) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const introDuration = reduceMotion ? 400 : 2600;
    let isClosed = false;

    function closeIntro() {
      if (isClosed) return;
      isClosed = true;
      intro.classList.add('is-done');
      document.body.classList.remove('intro-active');
      window.setTimeout(function () {
        intro.hidden = true;
      }, 700);
    }

    intro.addEventListener('click', closeIntro);
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === 'Escape' || event.key === ' ') closeIntro();
    });

    window.setTimeout(closeIntro, introDuration);
  }

  function setupViewRouting() {
    const views = Array.from(document.querySelectorAll('[data-view]'));
    const validViews = views.map(function (view) { return view.id; });

    if (!views.length) return;

    function setActiveView(id) {
      const nextId = validViews.includes(id) ? id : 'map';

      views.forEach(function (view) {
        const isActive = view.id === nextId;
        view.classList.toggle('is-active', isActive);
        view.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      });
    }

    function goToView(id) {
      window.location.hash = id === 'map' ? '#map' : '#' + id;
      setActiveView(id);
    }

    document.querySelectorAll('[data-enter-room]').forEach(function (control) {
      control.addEventListener('click', function () {
        goToView(control.dataset.enterRoom);
      });
    });

    window.addEventListener('hashchange', function () {
      setActiveView(window.location.hash.replace('#', '') || 'map');
    });

    setActiveView(window.location.hash.replace('#', '') || 'map');
  }

  function setupDrawer() {
    const drawer = document.getElementById('shop-drawer');
    const overlay = document.getElementById('drawer-overlay');
    const closeBtn = document.getElementById('drawer-close');
    const triggers = Array.from(document.querySelectorAll('[data-open-shop]'));

    if (!drawer || !overlay || !closeBtn || !triggers.length) return;

    function openDrawer() {
      overlay.hidden = false;
      drawer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('drawer-open');

      window.requestAnimationFrame(function () {
        overlay.classList.add('is-open');
        drawer.classList.add('is-open');
      });
    }

    function closeDrawer() {
      overlay.classList.remove('is-open');
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('drawer-open');

      window.setTimeout(function () {
        if (!drawer.classList.contains('is-open')) overlay.hidden = true;
      }, 280);
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', openDrawer);
    });

    overlay.addEventListener('click', closeDrawer);
    closeBtn.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
    });
  }

  function setupAudio() {
    const audio = document.getElementById('bg-audio');
    const triggers = Array.from(document.querySelectorAll('[data-play-preview]'));
    const trackEl = document.getElementById('player-track');
    const fillEl  = document.getElementById('progress-fill');

    const playlist = [
      { title: 'Tu Padre',          src: 'audio/tu-padre.m4a' },
      { title: 'Tu Padre 2',        src: 'audio/Tu Padre 2.m4a' },
      { title: 'Mueve Ese Culo',    src: 'audio/Mueve Ese Culo.m4a' },
      { title: 'Dejemos La Atrás',  src: 'audio/Dejemos La Atras.m4a' },
      { title: 'Fuck the Club',     src: 'audio/Fuck the Club.m4a' },
      { title: 'INCENTIVO',         src: 'audio/INCENTIVO.m4a' },
      { title: 'Kim K V2',          src: 'audio/Kim K V2.m4a' },
    ];

    let currentIndex = 0;

    function loadTrack(i) {
      audio.src = playlist[i].src;
      audio.load();
      if (trackEl) trackEl.textContent = playlist[i].title + ' — DJ Huevo';
    }

    if (!audio) return;
    loadTrack(0);

    audio.addEventListener('ended', function () {
      currentIndex = (currentIndex + 1) % playlist.length;
      loadTrack(currentIndex);
      audio.play().catch(function () {});
    });

    audio.addEventListener('timeupdate', function () {
      if (!audio.duration || !fillEl) return;
      fillEl.style.width = ((audio.currentTime / audio.duration) * 100) + '%';
    });

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        if (audio.paused) {
          audio.play().catch(function () {});
          trigger.classList.add('is-playing');
        } else {
          audio.pause();
          trigger.classList.remove('is-playing');
        }
      });
    });
  }

  function setupBooking() {
    const form = document.getElementById('booking-form');
    const success = document.getElementById('form-success');

    if (!form) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = Object.fromEntries(new FormData(form));
      const subject = encodeURIComponent('Booking Request - DJ Huevo');
      const body = encodeURIComponent([
        'Name: ' + (data.name || ''),
        'Email: ' + (data.email || ''),
        'Date: ' + (data['event-date'] || ''),
        'Event Type: ' + (data['event-type'] || ''),
        'Venue: ' + (data.venue || ''),
        'Budget: ' + (data.budget || ''),
        '',
        'Notes:',
        data.notes || 'None'
      ].join('\n'));

      window.location.href = 'mailto:' + (store.booking && store.booking.email ? store.booking.email : 'booking@djhuevo.com') + '?subject=' + subject + '&body=' + body;

      if (success) success.hidden = false;
      form.reset();
    });
  }

  function setupShopify() {
    const node = document.getElementById(store.shopify.componentId);

    if (!node) return;

    function initShopify() {
      if (!window.ShopifyBuy || !window.ShopifyBuy.UI) return;

      const client = window.ShopifyBuy.buildClient({
        domain: store.shopify.domain,
        storefrontAccessToken: store.shopify.token
      });

      window.ShopifyBuy.UI.onReady(client).then(function (ui) {
        ui.createComponent('collection', {
          id: store.shopify.collectionId,
          node: node,
          moneyFormat: '%24%7B%7Bamount%7D%7D',
          options: {
            product: {
              styles: {
                product: {
                  '@media (min-width: 601px)': {
                    'max-width': 'calc(25% - 20px)',
                    'margin-left': '20px',
                    'margin-bottom': '50px',
                    width: 'calc(25% - 20px)'
                  },
                  img: {
                    height: 'calc(100% - 15px)',
                    position: 'absolute',
                    left: '0',
                    right: '0',
                    top: '0'
                  },
                  imgWrapper: {
                    'padding-top': 'calc(75% + 15px)',
                    position: 'relative',
                    height: '0'
                  }
                },
                button: {
                  'font-family': 'Oswald, sans-serif',
                  'font-weight': '700',
                  'text-transform': 'uppercase',
                  ':hover': {
                    'background-color': '#39FF14',
                    color: '#080808'
                  },
                  'background-color': '#9B30FF',
                  ':focus': {
                    'background-color': '#9B30FF'
                  },
                  'border-radius': '999px'
                }
              },
              text: {
                button: 'Add to cart'
              }
            },
            productSet: {
              styles: {
                products: {
                  '@media (min-width: 601px)': {
                    'margin-left': '-20px'
                  }
                }
              }
            },
            modalProduct: {
              contents: {
                img: false,
                imgWithCarousel: true,
                button: false,
                buttonWithQuantity: true
              },
              styles: {
                product: {
                  '@media (min-width: 601px)': {
                    'max-width': '100%',
                    'margin-left': '0px',
                    'margin-bottom': '0px'
                  }
                },
                button: {
                  'font-family': 'Oswald, sans-serif',
                  'font-weight': '700',
                  'text-transform': 'uppercase',
                  'background-color': '#9B30FF',
                  'border-radius': '999px'
                }
              },
              text: {
                button: 'Add to cart'
              }
            },
            option: {},
            cart: {
              text: {
                total: 'Subtotal',
                button: 'Checkout'
              }
            },
            toggle: {}
          }
        });
      });
    }

    if (window.ShopifyBuy && window.ShopifyBuy.UI) {
      initShopify();
    } else {
      window.addEventListener('load', initShopify);
    }
  }

  renderRoomsPage();
  renderArchivePage();
  renderSharedPanels();
  syncCartCount();
  setupIntro();
  setupViewRouting();
  setupDrawer();
  setupAudio();
  setupBooking();
  setupShopify();
})();
