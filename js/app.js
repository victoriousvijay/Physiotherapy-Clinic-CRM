import { DOCTOR_CONFIG } from "./config.js";
import { getSiteContent } from "./firebase-service.js";
import { initNavigation } from "./navigation.js";
import { initForms } from "./forms.js";
import { initInteractiveEffects } from "./effects.js";

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Effects, Navigation & Forms
  initInteractiveEffects();
  initNavigation();
  initForms();

  // Dynamic copyright year
  const yearSpans = document.querySelectorAll('.js-copyright-year');
  const currentYear = new Date().getFullYear();
  yearSpans.forEach(s => s.textContent = currentYear);

  // Load site config or fallback
  let content = DOCTOR_CONFIG;
  try {
    const firestoreContent = await getSiteContent();
    if (firestoreContent) {
      content = { ...DOCTOR_CONFIG, ...firestoreContent };
    }
  } catch (err) {
    console.warn("Using default site content:", err);
  }

  // Bind dynamic fields across public pages
  bindDoctorDetails(content);
  initAccordions();
  initTestimonialSlider(content.testimonials || DOCTOR_CONFIG.testimonials);
  initServiceCardModals();
});

/**
 * Mobile Service Card Modal Popup
 */
function initServiceCardModals() {
  const serviceCards = document.querySelectorAll('.service-card');
  if (serviceCards.length === 0) return;

  // Create modal markup in DOM if it doesn't exist
  let modalOverlay = document.getElementById('service-modal-overlay');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'service-modal-overlay';
    modalOverlay.className = 'service-modal-overlay';
    modalOverlay.innerHTML = `
      <div class="service-modal-content">
        <button class="service-modal-close" aria-label="Close modal">&times;</button>
        <div class="service-modal-img-wrapper">
          <img src="" alt="" id="service-modal-img" class="service-modal-img">
        </div>
        <div class="service-modal-body">
          <h3 id="service-modal-title" class="service-modal-title"></h3>
          <p id="service-modal-desc" class="service-modal-desc"></p>
          <a href="#" id="service-modal-btn" class="btn btn-primary btn-full">View Full Details &rarr;</a>
        </div>
      </div>
    `;
    document.body.appendChild(modalOverlay);

    const closeBtn = modalOverlay.querySelector('.service-modal-close');
    closeBtn.addEventListener('click', () => modalOverlay.classList.remove('open'));
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('open');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') modalOverlay.classList.remove('open');
    });
  }

  serviceCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Only active on mobile screen <= 768px
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const img = card.querySelector('img');
        const title = card.querySelector('.card-title');
        const desc = card.querySelector('.card-desc');
        const link = card.querySelector('a');

        const modalImg = document.getElementById('service-modal-img');
        const modalTitle = document.getElementById('service-modal-title');
        const modalDesc = document.getElementById('service-modal-desc');
        const modalBtn = document.getElementById('service-modal-btn');

        if (modalImg && img) {
          modalImg.src = img.src;
          modalImg.alt = img.alt || '';
        }
        if (modalTitle && title) {
          modalTitle.textContent = title.textContent;
        }
        if (modalDesc && desc) {
          modalDesc.textContent = desc.textContent;
        }
        if (modalBtn && link) {
          modalBtn.href = link.href;
          modalBtn.textContent = 'Explore ' + (title ? title.textContent : 'Service') + ' →';
        }

        modalOverlay.classList.add('open');
      }
    });
  });
}

/**
 * Replace text placeholders with actual doctor info
 */
function bindDoctorDetails(data) {
  document.querySelectorAll('.js-doctor-name').forEach(el => el.textContent = data.doctorName || data.name || DOCTOR_CONFIG.name);
  document.querySelectorAll('.js-doctor-title').forEach(el => el.textContent = data.title || DOCTOR_CONFIG.title);
  document.querySelectorAll('.js-doctor-degrees').forEach(el => el.textContent = data.degrees || DOCTOR_CONFIG.degrees);
  document.querySelectorAll('.js-clinic-phone').forEach(el => {
    el.textContent = data.phone || DOCTOR_CONFIG.phone;
    if (el.tagName === 'A') el.href = `tel:${data.phone || DOCTOR_CONFIG.phone}`;
  });
  document.querySelectorAll('.js-clinic-whatsapp').forEach(el => {
    const wa = (data.whatsapp || DOCTOR_CONFIG.whatsapp).replace(/[^0-9]/g, '');
    if (el.tagName === 'A') el.href = `https://wa.me/${wa}?text=${encodeURIComponent("Hello Dr. Arti Tanwar, I would like to book a physiotherapy session. Please share the available timings.")}`;
  });
  document.querySelectorAll('.js-clinic-address').forEach(el => el.textContent = data.address || DOCTOR_CONFIG.address);
  document.querySelectorAll('.js-doctor-bio').forEach(el => el.textContent = data.bio || DOCTOR_CONFIG.bio);
}

/**
 * FAQ Accordions
 */
function initAccordions() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      accordionItems.forEach(i => i.classList.remove('active'));
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}

/**
 * Testimonials Slider
 */
function initTestimonialSlider(testimonials) {
  const container = document.querySelector('.js-testimonial-slider');
  if (!container || !testimonials || testimonials.length === 0) return;

  let currentIndex = 0;

  function renderSlide(index) {
    const t = testimonials[index];
    container.innerHTML = `
      <div class="testimonial-card">
        <div class="testimonial-quote">"${t.text}"</div>
        <div class="testimonial-author">${t.patientName}</div>
        <div class="testimonial-meta">${t.source || 'Verified Patient'}</div>
      </div>
      <div class="slider-controls">
        <button class="slider-btn js-prev-slide" aria-label="Previous testimonial">&larr;</button>
        <div class="slider-dots">
          ${testimonials.map((_, i) => `<button class="dot ${i === index ? 'active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>`).join('')}
        </div>
        <button class="slider-btn js-next-slide" aria-label="Next testimonial">&rarr;</button>
      </div>
    `;

    // Bind slider buttons
    container.querySelector('.js-prev-slide')?.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
      renderSlide(currentIndex);
    });

    container.querySelector('.js-next-slide')?.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % testimonials.length;
      renderSlide(currentIndex);
    });

    container.querySelectorAll('.dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-index') || '0', 10);
        currentIndex = idx;
        renderSlide(currentIndex);
      });
    });
  }

  renderSlide(currentIndex);
}
