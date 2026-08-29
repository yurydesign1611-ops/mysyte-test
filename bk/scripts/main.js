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



// ===== SMOOTH PARALLAX WITH LERP =====

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  const parallaxImages = document.querySelectorAll('.parallax-image, .split-parallax img, .big-feature-parallax img');
  if (!parallaxImages.length) return;

  // Store current and target positions for each image
  const imageStates = [];

  parallaxImages.forEach(img => {
    const container = img.closest('.parallax-container, .split-parallax, .big-feature-parallax, .image-hero-parallax');
    if (!container) return;

    imageStates.push({
      img: img,
      container: container,
      currentY: 0,
      targetY: 0
    });
  });

  const smoothing = 0.066; // Lower = smoother but slower to catch up

  function updateTargets() {
    const scrollY = window.pageYOffset || window.scrollY;
    const viewportHeight = window.innerHeight;

    imageStates.forEach(state => {
      const rect = state.container.getBoundingClientRect();
      const containerHeight = rect.height;
      const containerTop = rect.top + scrollY;

      const progress = (scrollY - containerTop + viewportHeight) / (containerHeight + viewportHeight);
      const clampedProgress = Math.max(0, Math.min(1, progress));

      const imgHeight = state.img.offsetHeight || state.img.clientHeight;
      const extraHeight = imgHeight - containerHeight;
      const maxTranslate = extraHeight / imgHeight * 100;

      state.targetY = clampedProgress * maxTranslate;
    });
  }

  function animate() {
    let needsUpdate = false;

    imageStates.forEach(state => {
      // Smoothly interpolate currentY toward targetY
      state.currentY += (state.targetY - state.currentY) * smoothing;

      // Only update if the difference is significant
      if (Math.abs(state.currentY - state.targetY) > 0.01) {
        needsUpdate = true;
        state.img.style.transform = `translate3d(0, -${state.currentY}%, 0)`;
      }
    });

    requestAnimationFrame(animate);
  }

  // Update targets on scroll and resize
  window.addEventListener('scroll', updateTargets, { passive: true });
  window.addEventListener('resize', updateTargets, { passive: true });

  // Initial calculation
  updateTargets();

  // Start the animation loop
  animate();
});