/* Navigation & Scroll Animations */

export function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    let backdrop = document.querySelector('.nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'nav-backdrop';
      document.body.appendChild(backdrop);
    }

    // Add mobile menu header if not present
    let mobileHeader = navMenu.querySelector('.mobile-menu-header');
    if (!mobileHeader) {
      mobileHeader = document.createElement('div');
      mobileHeader.className = 'mobile-menu-header';
      mobileHeader.innerHTML = `
        <span style="font-family: var(--font-serif); font-weight: 700; font-size: 1.15rem; color: var(--color-ink);">Navigation</span>
        <button class="mobile-menu-close" aria-label="Close menu">&times;</button>
      `;
      navMenu.prepend(mobileHeader);
      
      const closeBtn = mobileHeader.querySelector('.mobile-menu-close');
      closeBtn.addEventListener('click', () => {
        navMenu.classList.remove('open');
        backdrop.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    const openMenu = () => {
      navMenu.classList.add('open');
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      navMenu.classList.remove('open');
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
    };

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    backdrop.addEventListener('click', closeMenu);

    // Close menu when clicking nav link
    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // Active link highlighting based on current page path
  const currentPath = window.location.pathname.toLowerCase();
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    const hrefLower = href.toLowerCase();
    const isHome = (hrefLower === '/index.html' || hrefLower === 'index.html' || hrefLower === '/') &&
                   (currentPath === '/' || currentPath.endsWith('/') || currentPath.endsWith('index.html') || currentPath === '');
    
    const isCurrentPage = !isHome && hrefLower !== '/' && hrefLower !== 'index.html' && 
                          (currentPath.endsWith(hrefLower) || currentPath.includes(hrefLower.replace('/', '').replace('.html', '')));

    if (isHome || isCurrentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));
  }
}
