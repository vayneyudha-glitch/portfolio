/* ============================================================
   CINEMATIC OPENING ANIMATION
   ============================================================ */
(function () {
  'use strict';

  var intro = document.getElementById('cinematic-intro');
  if (!intro) return;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- If reduced motion, skip intro entirely --- */
  if (prefersReduced) {
    intro.style.display = 'none';
    document.body.classList.remove('intro-active');
    return;
  }

  var particlesContainer = document.getElementById('intro-particles');
  var linesContainer = document.getElementById('intro-lines');
  var words = document.querySelectorAll('.intro-word');
  var charEl = document.getElementById('intro-char');
  var hudPanels = document.querySelectorAll('.hud-panel');
  var roleEl = document.getElementById('intro-role');
  var subEl = document.getElementById('intro-sub');
  var scanline = document.getElementById('intro-scanline');
  var isMobile = window.innerWidth < 768;

  /* --- Generate particles --- */
  function generateParticles() {
    var count = isMobile ? 20 : 40;
    for (var i = 0; i < count; i++) {
      var p = document.createElement('div');
      p.className = 'intro-particle';
      var size = Math.random() * 3 + 1;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.opacity = Math.random() * 0.5 + 0.2;
      // Animate toward center
      var dx = (50 - parseFloat(p.style.left)) * 0.3;
      var dy = (50 - parseFloat(p.style.top)) * 0.3;
      p.style.transition = 'transform ' + (1.5 + Math.random()) + 's ease, opacity 1s ease';
      p.dataset.dx = dx;
      p.dataset.dy = dy;
      particlesContainer.appendChild(p);
    }
  }

  /* --- Generate data lines --- */
  function generateLines() {
    var count = isMobile ? 5 : 10;
    for (var i = 0; i < count; i++) {
      var l = document.createElement('div');
      l.className = 'intro-data-line';
      l.style.top = Math.random() * 100 + '%';
      l.style.left = '-20%';
      l.style.right = '-20%';
      l.style.opacity = Math.random() * 0.3 + 0.1;
      l.style.transition = 'transform ' + (2 + Math.random() * 2) + 's ease';
      linesContainer.appendChild(l);
    }
  }

  /* --- Animate particles toward center --- */
  function moveParticles() {
    var particles = particlesContainer.querySelectorAll('.intro-particle');
    particles.forEach(function (p) {
      p.style.transform = 'translate(' + p.dataset.dx + 'vw, ' + p.dataset.dy + 'vh)';
    });
  }

  /* --- Animate scanline --- */
  function animateScanline() {
    if (!scanline) return;
    scanline.style.transition = 'none';
    scanline.style.top = '-2px';
    scanline.style.opacity = '0.6';
    requestAnimationFrame(function () {
      scanline.style.transition = 'top 2s ease, opacity 0.5s ease';
      scanline.style.top = '100%';
      setTimeout(function () { scanline.style.opacity = '0'; }, 2000);
    });
  }

  /* --- Timeline --- */
  function runTimeline() {
    // SCENE 01: Dark intro (0-0.8s) — particles already visible, start movement
    generateParticles();
    generateLines();
    animateScanline();
    setTimeout(moveParticles, 100);

    // SCENE 02: Data particles + words (0.8-1.5s)
    setTimeout(function () {
      words.forEach(function (w) {
        var delay = parseInt(w.dataset.delay) || 0;
        setTimeout(function () { w.classList.add('show'); }, delay);
      });
    }, 800);

    // SCENE 03: Character reveal (1.5-2.5s)
    setTimeout(function () {
      charEl.classList.add('show');
    }, 1500);

    // SCENE 04: HUD elements (2.0-3.0s)
    setTimeout(function () {
      hudPanels.forEach(function (panel, idx) {
        setTimeout(function () { panel.classList.add('show'); }, idx * 250);
      });
    }, 2000);

    // SCENE 05: Personal branding (3.0-4.0s)
    setTimeout(function () {
      roleEl.classList.add('show');
    }, 3000);
    setTimeout(function () {
      subEl.classList.add('show');
    }, 3300);

    // SCENE 06: Transition to hero (4.0-5.0s)
    setTimeout(function () {
      // Fade out words
      words.forEach(function (w) { w.classList.remove('show'); });
      hudPanels.forEach(function (p) { p.classList.remove('show'); });
      // Fade character
      charEl.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      charEl.style.opacity = '0.4';
      roleEl.classList.remove('show');
      subEl.classList.remove('show');
    }, 4000);

    setTimeout(function () {
      intro.classList.add('intro-done');
      document.body.classList.remove('intro-active');
      // Trigger hero animations
      triggerHeroAnimations();
      // Remove from DOM after transition
      setTimeout(function () {
        if (intro.parentNode) intro.parentNode.removeChild(intro);
      }, 800);
    }, 4600);
  }

  /* --- Trigger hero entrance animations --- */
  function triggerHeroAnimations() {
    var heroEls = document.querySelectorAll('.hero-anim');
    heroEls.forEach(function (el) {
      el.style.animationPlayState = 'running';
    });
    // Start parallax
    initParallax();
  }

  /* --- Mouse parallax (desktop only) --- */
  function initParallax() {
    if (isMobile || prefersReduced) return;
    var layers = document.querySelectorAll('.parallax-layer');
    if (!layers.length) return;

    var mouseX = 0, mouseY = 0;
    var ticking = false;

    document.addEventListener('mousemove', function (e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });

    function updateParallax() {
      layers.forEach(function (layer) {
        var depth = parseFloat(layer.dataset.depth) || 2;
        var moveX = mouseX * depth;
        var moveY = mouseY * depth;
        layer.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
      });
      ticking = false;
    }
  }

  // Start timeline on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runTimeline);
  } else {
    runTimeline();
  }
})();

(function () {
  'use strict';

  /* ===== Generate Floating Feathers (Japanese aesthetic) ===== */
  function createFeathers() {
    var container = document.getElementById('feathers-container');
    if (!container) return;

    // Feather SVG templates — black leaves/feathers
    var featherTemplates = [
      // Long curved feather
      '<svg viewBox="0 0 40 80" fill="currentColor"><path d="M20 5 Q22 20 19 40 Q17 55 21 75 Q23 55 25 40 Q27 20 20 5 Z" opacity="0.85"/></svg>',
      // Slim leaf
      '<svg viewBox="0 0 30 70" fill="currentColor"><path d="M15 5 Q8 25 12 50 Q15 65 15 65 Q15 65 18 50 Q22 25 15 5 Z" opacity="0.8"/></svg>',
      // Pointed feather
      '<svg viewBox="0 0 24 50" fill="currentColor"><path d="M12 2 Q5 15 10 35 Q12 45 12 48 Q12 45 14 35 Q19 15 12 2 Z" opacity="0.85"/></svg>',
      // Small drop leaf
      '<svg viewBox="0 0 20 30" fill="currentColor"><path d="M10 3 Q3 12 7 22 Q10 27 10 27 Q10 27 13 22 Q17 12 10 3 Z" opacity="0.75"/></svg>',
      // Thin quill feather
      '<svg viewBox="0 0 20 60" fill="currentColor"><path d="M10 2 L9 30 Q10 45 10 58 Q10 45 11 30 L10 2 Z" opacity="0.7"/></svg>',
    ];

    var count = window.innerWidth < 640 ? 10 : 18;

    for (var i = 0; i < count; i++) {
      var feather = document.createElement('div');
      feather.className = 'feather';

      // Random size
      var size = Math.random() * 30 + 30; // 30px - 60px
      feather.style.width = size + 'px';
      feather.style.height = (size * 2) + 'px';
      feather.style.left = Math.random() * 100 + '%';

      // Alternate animations for variety
      var isSlow = Math.random() > 0.5;
      var animClass = isSlow ? 'animate-float-feather-slow' : 'animate-float-feather';
      feather.className += ' ' + animClass;

      feather.style.animationDuration = (Math.random() * 10 + 15) + 's';
      feather.style.animationDelay = (Math.random() * 10) + 's';

      feather.style.color = '#0a1929';
      feather.style.opacity = '0';
      feather.style.transform = 'rotate(' + (Math.random() * 60 - 30) + 'deg)';

      feather.innerHTML = featherTemplates[Math.floor(Math.random() * featherTemplates.length)];
      container.appendChild(feather);
    }
  }

  /* ===== Mobile Menu Toggle ===== */
  function initMobileMenu() {
    var toggle = document.getElementById('menu-toggle');
    var menu = document.getElementById('mobile-menu');
    var bar1 = document.getElementById('bar1');
    var bar2 = document.getElementById('bar2');
    var bar3 = document.getElementById('bar3');
    if (!toggle || !menu) return;

    var isOpen = false;

    function updateBars() {
      if (isOpen) {
        bar1.style.transform = 'translateY(8px) rotate(45deg)';
        bar2.style.opacity = '0';
        bar3.style.transform = 'translateY(-8px) rotate(-45deg)';
      } else {
        bar1.style.transform = '';
        bar2.style.opacity = '1';
        bar3.style.transform = '';
      }
    }

    toggle.addEventListener('click', function () {
      isOpen = !isOpen;
      menu.classList.toggle('hidden', !isOpen);
      requestAnimationFrame(updateBars);
    });

    var links = menu.querySelectorAll('a.mobile-link');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        isOpen = false;
        menu.classList.add('hidden');
        updateBars();
      });
    });
  }

  /* ===== Reveal on Scroll ===== */
  function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if (!('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    reveals.forEach(function (el) { observer.observe(el); });
  }

  /* ===== WhatsApp Form ===== */
  function initWhatsAppForm() {
    var form = document.getElementById('wa-form');
    if (!form) return;

    var WHATSAPP_NUMBER = '6283817226565';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameInput = form.querySelector('#wa-name');
      var messageInput = form.querySelector('#wa-message');
      var name = nameInput ? nameInput.value.trim() : '';
      var message = messageInput ? messageInput.value.trim() : '';
      if (!name || !message) return;

      var text = 'Halo Yudha, saya ' + name + '.\n\n' + message;
      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
      window.open(url, '_blank');
    });
  }

  /* ===== Back to Top ===== */
  function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        btn.classList.remove('opacity-0', 'invisible');
        btn.classList.add('opacity-100', 'visible');
      } else {
        btn.classList.add('opacity-0', 'invisible');
        btn.classList.remove('opacity-100', 'visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===== Smooth Scroll ===== */
  function initSmoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var offset = 70;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ===== Init ===== */
  function init() {
    createFeathers();
    initMobileMenu();
    initReveal();
    initWhatsAppForm();
    initBackToTop();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();