// main.js

// ===== MENU OPENING SCRIPT =====

(() => {
  'use strict';

  const initHeaderNavigation = () => {
    const menuBtn = document.querySelector('.header-menu-btn');
    const menuContent = document.getElementById('menu-content');

    if (!menuBtn || !menuContent) return;

    const toggleMenu = () => {
      const isOpen = menuContent.classList.toggle('is-open');

      menuBtn.setAttribute('aria-expanded', isOpen);
      menuContent.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuBtn.addEventListener('click', toggleMenu);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuContent.classList.contains('is-open')) {
        toggleMenu();
        menuBtn.focus();
      }
    });

    menuContent.querySelectorAll('.nav-link, .nav-contact').forEach(link => {
      link.addEventListener('click', () => {
        if (menuContent.classList.contains('is-open')) {
          toggleMenu();
        }
      });
    });
  };

  document.addEventListener('DOMContentLoaded', initHeaderNavigation);
})();


// ===== CONTACT POPUP MODULE =====

(() => {
  'use strict';

  const initContactPopup = () => {
    const overlay = document.querySelector('.contact-popup-overlay');
    const closeBtn = document.querySelector('.contact-popup-close');
    const triggers = document.querySelectorAll('.open-contact-popup'); // ← SELECT ALL

    // Exit if any required element is missing
    if (!overlay || !closeBtn || !triggers.length) return;

    const openPopup = (e) => {
      e.preventDefault(); // ← PREVENT navigation on <a> tags
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closePopup = () => {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    // Attach click listener to EVERY trigger
    triggers.forEach(trigger => {
      trigger.addEventListener('click', openPopup);
    });

    // Close button
    closeBtn.addEventListener('click', closePopup);

    // Close when clicking on the dark overlay
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        closePopup();
      }
    });

    // Escape key closes popup
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && overlay.classList.contains('is-open')) {
        closePopup();
      }
    });
  };

  document.addEventListener('DOMContentLoaded', initContactPopup);
})();


// ===== DISABLE VIDEO DOWNLOAD (right-click) =====

document.addEventListener('DOMContentLoaded', function() {
  const video = document.querySelector('.hero-video');
  if (video) {
    video.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });
  }
});



// ===== UNIVERSAL PARALLAX EFFECT =====

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // Select all parallax images
  const parallaxImages = document.querySelectorAll('.parallax-image');

  if (!parallaxImages.length) return;

  let ticking = false;

  function updateParallax() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const scrollY = window.pageYOffset || window.scrollY;

      parallaxImages.forEach(img => {
        const container = img.closest('.parallax-container');
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const containerHeight = rect.height;
        const containerTop = rect.top + scrollY;
        const viewportHeight = window.innerHeight;

        // Progress: 0 when top enters viewport, 1 when bottom leaves
        const progress = (scrollY - containerTop + viewportHeight) / (containerHeight + viewportHeight);
        const clampedProgress = Math.max(0, Math.min(1, progress));

        // Calculate max translation based on image height
        const imgHeight = img.offsetHeight || img.clientHeight;
        const extraHeight = imgHeight - containerHeight;
        const maxTranslate = extraHeight / imgHeight * 100;

        // Apply translation
        const translateY = clampedProgress * maxTranslate;
        img.style.transform = `translateY(-${translateY}%)`;
      });

      ticking = false;
    });
  }

  // Attach events
  window.addEventListener('scroll', updateParallax);
  window.addEventListener('resize', updateParallax);

  // Initial update
  updateParallax();
});