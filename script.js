(function () {
  'use strict';

  /* --- Barra de progreso de lectura --- */
  (function () {
    var bar = document.getElementById('readingProgressBar');
    if (!bar) return;
    function update() {
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      var scrollHeight = (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight;
      var pct = scrollHeight > 0 ? Math.min(100, (scrollTop / scrollHeight) * 100) : 0;
      bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* --- Registro Service Worker (PWA) --- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    });
  }

  /* --- Año actual en el footer --- */
  var anioEl = document.getElementById('anioActual');
  if (anioEl) anioEl.textContent = new Date().getFullYear();

  /* --- Menú hamburguesa --- */
  function toggleMenu() {
    document.getElementById('hamburger').classList.toggle('active');
    document.getElementById('mobileMenu').classList.toggle('open');
  }
  function closeMenu() {
    document.getElementById('hamburger').classList.remove('active');
    document.getElementById('mobileMenu').classList.remove('open');
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var menu = document.getElementById('mobileMenu');
      if (menu && menu.classList.contains('open')) closeMenu();
    }
  });

  document.addEventListener('click', function (e) {
    var menu = document.getElementById('mobileMenu');
    var hamburger = document.getElementById('hamburger');
    if (menu && menu.classList.contains('open') && !menu.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu();
    }
  });

  window.toggleMenu = toggleMenu;
  window.closeMenu = closeMenu;

  /* --- Parallax hero (fondo se mueve más lento al hacer scroll) --- */
  (function () {
    var hero = document.querySelector('.hero');
    var heroBg = document.getElementById('heroBg');
    if (!hero || !heroBg) return;
    var factor = 0.4;
    function update() {
      var rect = hero.getBoundingClientRect();
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        var offset = scrollY * factor;
        heroBg.style.transform = 'translate3d(0, ' + (-offset) + 'px, 0)';
      } else {
        heroBg.style.transform = '';
      }
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* --- Fade-in / Scrollytelling al hacer scroll --- */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.fade-in').forEach(function (el) {
    observer.observe(el);
  });

  /* --- Secciones: transición suave al entrar --- */
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('section.seccion, section.zona-servicio, section.sobre-mi').forEach(function (el) {
    sectionObserver.observe(el);
  });

  /* --- Botón volver arriba --- */
  (function () {
    var btn = document.getElementById('btnSubir');
    if (!btn) return;
    function onScroll() {
      if (window.pageYOffset > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  /* --- Hero: carrusel de fondo (4 imágenes) --- */
  (function () {
    var container = document.getElementById('heroBg');
    if (!container) return;
    var slides = container.querySelectorAll('.hero-bg-slide');
    var total = slides.length;
    var current = 0;
    var interval = 5500;
    var timer = null;

    function nextSlide() {
      slides[current].classList.remove('active');
      current = (current + 1) % total;
      slides[current].classList.add('active');
    }

    function start() {
      if (timer) clearInterval(timer);
      timer = setInterval(nextSlide, interval);
    }
    start();
  })();

  /* --- Modal Servicio (Saber más) --- */
  (function () {
    var modal = document.getElementById('modalServicio');
    var btnCerrar = document.getElementById('modalServicioCerrar');
    var imgEl = document.getElementById('modalServicioImg');
    var tituloEl = document.getElementById('modalServicioTitulo');
    var descEl = document.getElementById('modalServicioDesc');
    var waLink = document.getElementById('modalWhatsAppLink');
    if (!modal || !tituloEl || !descEl) return;

    function abrir(card) {
      var img = card.querySelector('.card-imagen img');
      var titulo = card.querySelector('.card-body h3');
      var desc = card.querySelector('.servicio-desc-extendida');
      if (img) { imgEl.src = img.src; imgEl.alt = img.alt || ''; }
      tituloEl.textContent = titulo ? titulo.textContent : '';
      descEl.textContent = desc ? desc.textContent : '';
      if (waLink && titulo) {
        var servicio = titulo.textContent.trim();
        var msg = 'Hola Eric, vi tu página ECHH y me interesa cotizar: ' + servicio + '. ¿Podrías darme información?';
        waLink.href = 'https://wa.me/56994650760?text=' + encodeURIComponent(msg);
      }
      modal.removeAttribute('hidden');
      modal.setAttribute('aria-hidden', 'false');
      if (btnCerrar) btnCerrar.focus();
    }

    function cerrar() {
      modal.setAttribute('hidden', '');
      modal.setAttribute('aria-hidden', 'true');
    }

    document.querySelectorAll('.card-saber-mas').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = this.closest('.servicio-card');
        if (card) abrir(card);
      });
    });
    if (btnCerrar) btnCerrar.addEventListener('click', cerrar);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) cerrar();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') cerrar();
    });
  })();

  /* --- Lightbox Galería (clic en imagen) --- */
  (function () {
    var lightbox = document.getElementById('lightboxGaleria');
    var imgEl = document.getElementById('lightboxImg');
    var captionEl = document.getElementById('lightboxCaption');
    var btnCerrar = document.getElementById('lightboxCerrar');
    var btnPrev = document.getElementById('lightboxPrev');
    var btnNext = document.getElementById('lightboxNext');
    var track = document.getElementById('carouselTrack');
    if (!lightbox || !imgEl || !track) return;

    var slides = track.querySelectorAll('.carousel-slide');
    var total = slides.length;
    var currentIndex = 0;

    function getSlideData(index) {
      var slide = slides[index];
      if (!slide) return { src: '', alt: '', caption: '' };
      var img = slide.querySelector('img');
      var cap = slide.querySelector('.carousel-caption');
      return {
        src: img ? img.src : '',
        alt: img ? img.alt : '',
        caption: cap ? cap.textContent.replace(/\s*—\s*Ver en grande\s*$/, '').trim() : ''
      };
    }

    function open(index) {
      currentIndex = (index + total) % total;
      var d = getSlideData(currentIndex);
      imgEl.src = d.src;
      imgEl.alt = d.alt;
      captionEl.textContent = d.caption;
      lightbox.removeAttribute('hidden');
      lightbox.setAttribute('aria-hidden', 'false');
      if (btnCerrar) btnCerrar.focus();
    }

    function close() {
      lightbox.setAttribute('hidden', '');
      lightbox.setAttribute('aria-hidden', 'true');
    }

    function prev() {
      currentIndex = (currentIndex - 1 + total) % total;
      var d = getSlideData(currentIndex);
      imgEl.src = d.src;
      imgEl.alt = d.alt;
      captionEl.textContent = d.caption;
    }

    function next() {
      currentIndex = (currentIndex + 1) % total;
      var d = getSlideData(currentIndex);
      imgEl.src = d.src;
      imgEl.alt = d.alt;
      captionEl.textContent = d.caption;
    }

    slides.forEach(function (slide, i) {
      slide.addEventListener('click', function (e) {
        if (e.target.closest('button')) return;
        open(i);
      });
    });
    if (btnCerrar) btnCerrar.addEventListener('click', close);
    if (btnPrev) btnPrev.addEventListener('click', function (e) { e.stopPropagation(); prev(); });
    if (btnNext) btnNext.addEventListener('click', function (e) { e.stopPropagation(); next(); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener('keydown', function (e) {
      if (lightbox.getAttribute('aria-hidden') === 'true') return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });
  })();

  /* --- Formulario → WhatsApp con validación --- */
  var form = document.getElementById('contactForm');
  if (!form) return;

  var nombreInput = document.getElementById('nombre');
  var telefonoInput = document.getElementById('telefono');
  var mensajeInput = document.getElementById('mensaje');
  var formStatus = document.getElementById('formStatus');

  function clearErrors() {
    [nombreInput, telefonoInput, mensajeInput].forEach(function (input) {
      if (input) {
        input.classList.remove('has-error');
        input.removeAttribute('aria-invalid');
      }
    });
    document.querySelectorAll('.form-error').forEach(function (el) {
      el.remove();
    });
    if (formStatus) {
      formStatus.classList.remove('visible');
    }
  }

  function showError(input, message) {
    input.classList.add('has-error');
    input.setAttribute('aria-invalid', 'true');
    var grupo = input.closest('.form-grupo');
    var existing = grupo.querySelector('.form-error');
    if (existing) existing.remove();
    var err = document.createElement('span');
    err.className = 'form-error';
    err.setAttribute('role', 'alert');
    err.textContent = message;
    input.parentNode.appendChild(err);
  }

  function validateTelefono(value) {
    var digits = value.replace(/\D/g, '');
    return digits.length >= 8 && digits.length <= 12;
  }

  /* --- Carrusel galería --- */
  (function initCarousel() {
    var track = document.getElementById('carouselTrack');
    var dotsContainer = document.getElementById('carouselDots');
    var counterEl = document.getElementById('carouselCounter');
    var prevBtn = document.getElementById('carouselPrev');
    var nextBtn = document.getElementById('carouselNext');
    if (!track || !dotsContainer) return;

    var slides = track.querySelectorAll('.carousel-slide');
    var total = slides.length;
    var current = 0;
    var autoplayMs = 5000;
    var autoplayTimer = null;

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = 'translateX(-' + current * 100 + '%)';
      dotsContainer.querySelectorAll('button').forEach(function (btn, i) {
        btn.classList.toggle('active', i === current);
        btn.setAttribute('aria-selected', i === current);
      });
      if (counterEl) counterEl.textContent = (current + 1) + ' de ' + total;
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(next, autoplayMs);
    }
    function stopAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
      autoplayTimer = null;
    }

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Ir a imagen ' + (i + 1));
      dot.setAttribute('aria-selected', i === 0);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function () { goTo(i); startAutoplay(); });
      dotsContainer.appendChild(dot);
    });

    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); startAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { next(); startAutoplay(); });

    track.parentElement.addEventListener('mouseenter', stopAutoplay);
    track.parentElement.addEventListener('mouseleave', startAutoplay);

    startAutoplay();
  })();

  /* --- Carrusel testimonios --- */
  (function initTestimoniosCarousel() {
    var track = document.getElementById('testimoniosTrack');
    var dotsContainer = document.getElementById('testimoniosDots');
    var counterEl = document.getElementById('testimoniosCounter');
    var prevBtn = document.getElementById('testimoniosPrev');
    var nextBtn = document.getElementById('testimoniosNext');
    if (!track || !dotsContainer) return;

    var cards = track.querySelectorAll('.testimonio-card');
    var total = cards.length;
    var currentPage = 0;

    function getCardsPerPage() {
      return window.innerWidth >= 901 ? 3 : window.innerWidth >= 641 ? 2 : 1;
    }

    function getTotalPages() {
      return Math.ceil(total / getCardsPerPage());
    }

    function goToPage(page) {
      var pages = getTotalPages();
      currentPage = Math.max(0, Math.min(page, pages - 1));
      track.style.transform = 'translateX(-' + currentPage * 100 + '%)';
      dotsContainer.querySelectorAll('button').forEach(function (btn, i) {
        btn.classList.toggle('active', i === currentPage);
        btn.setAttribute('aria-selected', i === currentPage);
      });
      if (counterEl) counterEl.textContent = (currentPage + 1) + ' de ' + pages;
    }

    function next() { goToPage(currentPage + 1); }
    function prev() { goToPage(currentPage - 1); }

    function setupDots() {
      dotsContainer.innerHTML = '';
      var pages = getTotalPages();
      for (var i = 0; i < pages; i++) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', 'Ir a página ' + (i + 1));
        dot.setAttribute('aria-selected', i === 0);
        if (i === 0) dot.classList.add('active');
        (function (idx) {
          dot.addEventListener('click', function () { goToPage(idx); });
        })(i);
        dotsContainer.appendChild(dot);
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    window.addEventListener('resize', function () {
      setupDots();
      goToPage(0);
    });

    setupDots();
    goToPage(0);
  })();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    var nombre = nombreInput ? nombreInput.value.trim() : '';
    var telefono = telefonoInput ? telefonoInput.value.trim() : '';
    var mensaje = mensajeInput ? mensajeInput.value.trim() : '';

    var hasError = false;
    if (!nombre || nombre.length < 2) {
      showError(nombreInput, 'Ingresa tu nombre (mínimo 2 caracteres).');
      hasError = true;
    }
    if (!telefono) {
      showError(telefonoInput, 'Ingresa tu teléfono.');
      hasError = true;
    } else if (!validateTelefono(telefono)) {
      showError(telefonoInput, 'Ingresa un número válido (ej: +56 9 1234 5678).');
      hasError = true;
    }
    if (!mensaje || mensaje.length < 10) {
      showError(mensajeInput, 'Describe brevemente tu consulta (mínimo 10 caracteres).');
      hasError = true;
    }

    if (hasError) {
      var firstError = form.querySelector('.form-grupo .has-error');
      if (firstError) {
        var firstInput = firstError.querySelector('input, textarea');
        if (firstInput) firstInput.focus();
      }
      return;
    }

    var textoWhats = 'Hola Eric, consulta desde tu página ECHH:\n\n' +
      '*Nombre:* ' + nombre + '\n' +
      '*Teléfono:* ' + telefono + '\n' +
      '*Mensaje:* ' + mensaje;

    var cuerpoEmail = 'Hola Eric, consulta desde tu página ECHH:\n\n' +
      'Nombre: ' + nombre + '\n' +
      'Teléfono: ' + telefono + '\n' +
      'Mensaje:\n' + mensaje;

    // Abre WhatsApp en una pestaña nueva
    window.open('https://wa.me/56994650760?text=' + encodeURIComponent(textoWhats), '_blank');

    // Abre el cliente de correo con el mensaje preparado
    window.location.href = 'mailto:contacto@echh.cl?subject=' +
      encodeURIComponent('Consulta desde sitio web ECHH') +
      '&body=' + encodeURIComponent(cuerpoEmail);

    form.reset();
    if (formStatus) {
      formStatus.textContent = '¡Listo! Se abrió WhatsApp. Envía el mensaje desde allí.';
      formStatus.classList.add('visible');
      formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  /* --- Carga diferida de Leaflet y mapa de cobertura --- */
  function cargarLeaflet(callback) {
    if (window.L && typeof callback === 'function') {
      callback();
      return;
    }

    var cssId = 'leaflet-css';
    if (!document.getElementById(cssId)) {
      var link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    var scriptId = 'leaflet-js';
    var existingScript = document.getElementById(scriptId);
    if (existingScript) {
      if (typeof callback === 'function') {
        existingScript.addEventListener('load', function () {
          callback();
        }, { once: true });
      }
      return;
    }

    var script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.defer = true;
    if (typeof callback === 'function') {
      script.addEventListener('load', function () {
        callback();
      }, { once: true });
    }
    document.body.appendChild(script);
  }

  /* --- Mapa zona de cobertura (Leaflet) + marcadores ciudades, sólo cuando se ve en pantalla --- */
  (function () {
    var mapEl = document.getElementById('mapaCobertura');
    if (!mapEl) return;

    var mapaInicializado = false;

    function initMapa() {
      if (mapaInicializado || typeof L === 'undefined') return;
      mapaInicializado = true;

      var ubicaciones = [
        { lat: -39.8142, lng: -73.2459, nombre: 'Valdivia' },
        { lat: -40.5734, lng: -73.1310, nombre: 'Osorno' },
        { lat: -41.4717, lng: -72.9369, nombre: 'Puerto Montt' },
        { lat: -41.3195, lng: -72.9854, nombre: 'Puerto Varas' },
        { lat: -42.4722, lng: -73.7731, nombre: 'Castro (Chiloé)' },
        { lat: -41.8697, lng: -73.8203, nombre: 'Ancud' },
        { lat: -40.2931, lng: -73.0820, nombre: 'La Unión' },
        { lat: -40.3356, lng: -72.9556, nombre: 'Río Bueno' },
        { lat: -39.6431, lng: -72.3339, nombre: 'Panguipulli' },
        { lat: -41.1267, lng: -73.0489, nombre: 'Frutillar' },
        { lat: -41.2611, lng: -72.9967, nombre: 'Llanquihue' },
        { lat: -40.9667, lng: -72.8833, nombre: 'Puerto Octay' },
        { lat: -40.9167, lng: -73.1667, nombre: 'Purranque' },
        { lat: -40.0667, lng: -72.8833, nombre: 'Paillaco' },
        { lat: -40.1333, lng: -72.4167, nombre: 'Futrono' },
        { lat: -41.7739, lng: -73.1322, nombre: 'Calbuco' }
      ];

      var bounds = L.latLngBounds(ubicaciones.map(function (u) { return [u.lat, u.lng]; }));

      var map = L.map('mapaCobertura', {
        scrollWheelZoom: false,
        dragging: false,
        doubleClickZoom: false,
        zoomControl: false,
        touchZoom: false,
        boxZoom: false,
        keyboard: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 9 });

      function shuffleArray(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var t = a[i];
          a[i] = a[j];
          a[j] = t;
        }
        return a;
      }

      var pinIcon = L.divIcon({
        className: 'mapa-pin',
        html: '<span class="mapa-pin-icon"></span>',
        iconSize: [28, 28],
        iconAnchor: [14, 28]
      });

      var ordenAleatorio = shuffleArray(ubicaciones);
      ordenAleatorio.forEach(function (loc, i) {
        setTimeout(function () {
          L.marker([loc.lat, loc.lng], { icon: pinIcon })
            .addTo(map)
            .bindTooltip(loc.nombre, {
              permanent: false,
              direction: 'top',
              offset: [0, -12],
              opacity: 0.95
            });
        }, 120 * i);
      });
    }

    function activarMapa() {
      cargarLeaflet(initMapa);
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            io.disconnect();
            activarMapa();
          }
        });
      }, { threshold: 0.15 });

      io.observe(mapEl);
    } else {
      activarMapa();
    }
  })();
})();
