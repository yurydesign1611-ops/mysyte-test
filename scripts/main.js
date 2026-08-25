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


// ===== PARALLAX EFFECT FOR HOME PRODUCTION BLOCK =====

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // Select all parallax images
  const parallaxImages = document.querySelectorAll('.home-production-image img');

  if (!parallaxImages.length) return;

  // Throttle function to limit how often scroll events fire
  let ticking = false;

  function updateParallax() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const scrollY = window.pageYOffset || window.scrollY;

      parallaxImages.forEach(img => {
        const container = img.closest('.home-production-image');
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const containerHeight = rect.height;
        const containerTop = rect.top + scrollY;

        // Calculate how much of the container is visible in the viewport
        const viewportHeight = window.innerHeight;

        // Calculate the progress of the container through the viewport
        // 0 = top of container enters viewport, 1 = bottom of container leaves viewport
        const progress = (scrollY - containerTop + viewportHeight) / (containerHeight + viewportHeight);

        // Clamp progress between 0 and 1
        const clampedProgress = Math.max(0, Math.min(1, progress));

        // Image height is larger than container (133.33% desktop, 112.5% mobile)
        // Calculate the max translation amount (as percentage of image height)
        const imgHeight = img.offsetHeight || img.clientHeight;
        const containerHeightPx = containerHeight;
        const extraHeight = imgHeight - containerHeightPx;
        const maxTranslate = extraHeight / imgHeight * 100;

        // Apply translation: image moves UP as progress increases
        const translateY = clampedProgress * maxTranslate;

        img.style.transform = `translateY(-${translateY}%)`;
      });

      ticking = false;
    });
  }

  // Attach scroll and resize events
  window.addEventListener('scroll', updateParallax);
  window.addEventListener('resize', updateParallax);

  // Initial update
  updateParallax();
});

const speed = parseFloat(img.dataset.speed) || 0.25;  // default 0.25
const translateY = clampedProgress * maxTranslate * speed;