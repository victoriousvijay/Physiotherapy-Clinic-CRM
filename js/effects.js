/**
 * Interactive 3D Cursor, Card Tilt, Navbar & Scroll Animations
 */

export function initInteractiveEffects() {
  init3DCursor();
  init3DCardTilt();
  initScrollReveal();
  initInteractiveNavbar();
}

/**
 * 1. INTERACTIVE NAVBAR & ACTIVE INDICATORS
 */
function initInteractiveNavbar() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname;

  // Active Link Highlight
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Check match for active page
    const isHome = (href === '/index.html' || href === '/' || href === 'index.html') && 
                   (currentPath === '/' || currentPath.endsWith('index.html') || currentPath === '');
    const isMatch = isHome || (href !== '/' && href !== 'index.html' && currentPath.endsWith(href));

    if (isMatch) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }

    // Add interactive hover effect
    link.addEventListener('mouseenter', () => {
      link.style.transform = 'translateY(-2px)';
    });
    link.addEventListener('mouseleave', () => {
      link.style.transform = 'translateY(0)';
    });
  });

  // Sticky navbar shadow and backdrop blur transition
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });
}

/**
 * 2. 3D MODERN CURSOR
 */
function init3DCursor() {
  // Only enable on pointer/mouse devices
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    return;
  }

  let dot = document.getElementById('cursor-dot');
  let ring = document.getElementById('cursor-ring');

  if (!dot) {
    dot = document.createElement('div');
    dot.id = 'cursor-dot';
    document.body.appendChild(dot);
  }

  if (!ring) {
    ring = document.createElement('div');
    ring.id = 'cursor-ring';
    document.body.appendChild(ring);
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  // Smooth lerp loop for the 3D trailing ring
  function renderCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Hover reactive elements (exclude text input fields so typing isn't obscured)
  const hoverSelector = 'a, button, .card, .accordion-header, .slider-btn, .dot, .badge, .nav-link';
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(hoverSelector);
    if (target) {
      document.body.classList.add('cursor-hover');
      if (target.classList.contains('card') || target.classList.contains('service-card')) {
        document.body.classList.add('cursor-hover-card');
      }
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest(hoverSelector);
    if (target) {
      document.body.classList.remove('cursor-hover', 'cursor-hover-card');
    }
  });
}

/**
 * 3. 3D CARD HOVER & TILT
 */
function init3DCardTilt() {
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    return;
  }

  const cards = document.querySelectorAll('.card, .service-card, .process-step-card, .credential-box, .testimonial-card, .hero-image-frame');

  cards.forEach(card => {
    // Add light sheen overlay
    let sheen = card.querySelector('.card-sheen');
    if (!sheen) {
      sheen = document.createElement('div');
      sheen.className = 'card-sheen';
      card.appendChild(sheen);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

      if (sheen) {
        sheen.style.opacity = '1';
        sheen.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 70%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      if (sheen) sheen.style.opacity = '0';
    });
  });
}

/**
 * 4. SCROLL REVEAL ANIMATIONS
 */
function initScrollReveal() {
  const elementsToReveal = document.querySelectorAll(
    '.section-header, .card, .process-step-card, .trust-item, .credential-box, .testimonial-card, .accordion-item, form, .hero-trust-indicators, .strip-item'
  );

  elementsToReveal.forEach((el, idx) => {
    if (!el.classList.contains('reveal-on-scroll')) {
      el.classList.add('reveal-on-scroll');
      if (idx % 4 === 1) el.classList.add('reveal-delay-1');
      if (idx % 4 === 2) el.classList.add('reveal-delay-2');
      if (idx % 4 === 3) el.classList.add('reveal-delay-3');
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
}

// Auto init on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initInteractiveEffects);
} else {
  initInteractiveEffects();
}
