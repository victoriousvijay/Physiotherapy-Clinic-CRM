import { submitLead } from "./firebase-service.js";
import { validatePhone, validateEmail, validateFutureDate, sanitizeString } from "./validation.js";

/**
 * Initialize Booking and Enquiry Forms
 */
export function initForms() {
  const bookingForms = document.querySelectorAll('.js-booking-form');

  // Set min date for date inputs to today
  const dateInputs = document.querySelectorAll('input[type="date"]');
  const todayStr = new Date().toISOString().split('T')[0];
  dateInputs.forEach(input => {
    input.setAttribute('min', todayStr);
  });

  // Handle URL pre-selected service
  const urlParams = new URLSearchParams(window.location.search);
  const selectedService = urlParams.get('service');
  if (selectedService) {
    const serviceSelects = document.querySelectorAll('select[name="consultationType"], select[name="requiredService"]');
    serviceSelects.forEach(select => {
      select.value = selectedService;
    });
  }

  bookingForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const errorSummary = form.querySelector('.js-form-error-summary');
      if (errorSummary) errorSummary.textContent = "";

      // Gather form fields
      const fullNameInput = form.querySelector('[name="fullName"]');
      const phoneInput = form.querySelector('[name="phone"]');
      const emailInput = form.querySelector('[name="email"]');
      const ageGroupInput = form.querySelector('[name="ageGroup"]');
      const cityInput = form.querySelector('[name="city"]');
      const typeInput = form.querySelector('[name="consultationType"]');
      const serviceInput = form.querySelector('[name="requiredService"]');
      const dateInput = form.querySelector('[name="preferredDate"]');
      const timeInput = form.querySelector('[name="preferredTime"]');
      const messageInput = form.querySelector('[name="message"]');
      const consentInput = form.querySelector('[name="consent"]');

      // Validation
      let isValid = true;
      let errors = [];

      if (!fullNameInput || !fullNameInput.value.trim()) {
        isValid = false;
        errors.push("Please enter your full name.");
        fullNameInput?.classList.add('error');
      } else {
        fullNameInput.classList.remove('error');
      }

      if (!phoneInput || !validatePhone(phoneInput.value)) {
        isValid = false;
        errors.push("Please enter a valid 10-digit mobile number.");
        phoneInput?.classList.add('error');
      } else {
        phoneInput.classList.remove('error');
      }

      if (emailInput && emailInput.value.trim() && !validateEmail(emailInput.value)) {
        isValid = false;
        errors.push("Please enter a valid email address.");
        emailInput.classList.add('error');
      } else if (emailInput) {
        emailInput.classList.remove('error');
      }

      if (dateInput && dateInput.value && !validateFutureDate(dateInput.value)) {
        isValid = false;
        errors.push("Preferred date cannot be in the past.");
        dateInput.classList.add('error');
      } else if (dateInput) {
        dateInput.classList.remove('error');
      }

      if (consentInput && !consentInput.checked) {
        isValid = false;
        errors.push("You must accept the privacy consent to submit.");
      }

      if (!isValid) {
        if (errorSummary) {
          errorSummary.textContent = errors.join(" ");
        } else {
          showToast(errors[0], "error");
        }
        return;
      }

      // Payload
      const leadData = {
        fullName: sanitizeString(fullNameInput.value.trim()),
        phone: sanitizeString(phoneInput.value.trim()),
        email: emailInput ? sanitizeString(emailInput.value.trim()) : "",
        ageGroup: ageGroupInput ? sanitizeString(ageGroupInput.value) : "",
        city: cityInput ? sanitizeString(cityInput.value.trim()) : "",
        consultationType: typeInput ? sanitizeString(typeInput.value) : "clinic",
        requiredService: serviceInput ? sanitizeString(serviceInput.value) : "General Physiotherapy",
        preferredDate: dateInput ? dateInput.value : "",
        preferredTime: timeInput ? sanitizeString(timeInput.value) : "",
        message: messageInput ? sanitizeString(messageInput.value.trim()) : "",
        consentAccepted: consentInput ? consentInput.checked : true,
        sourcePage: window.location.pathname
      };

      // Disable button & loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute('data-original-text', submitBtn.innerHTML);
        submitBtn.innerHTML = `<span>Submitting...</span>`;
      }

      try {
        const result = await submitLead(leadData);

        // Store demo backup in localStorage
        const existingLeads = JSON.parse(localStorage.getItem('demo_leads') || '[]');
        existingLeads.unshift({ ...leadData, id: result.id || 'DEMO-' + Date.now(), createdAt: new Date().toISOString() });
        localStorage.setItem('demo_leads', JSON.stringify(existingLeads));

        // Show Success Modal
        showSuccessModal(result.id || "REQ-" + Math.floor(Math.random() * 90000 + 10000));
        form.reset();

      } catch (err) {
        console.error("Submission failed, using fallback offline storage:", err);
        // Fallback local save
        const demoId = "REQ-" + Math.floor(Math.random() * 90000 + 10000);
        const existingLeads = JSON.parse(localStorage.getItem('demo_leads') || '[]');
        existingLeads.unshift({ ...leadData, id: demoId, createdAt: new Date().toISOString() });
        localStorage.setItem('demo_leads', JSON.stringify(existingLeads));

        showSuccessModal(demoId);
        form.reset();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = submitBtn.getAttribute('data-original-text') || 'Book Consultation';
        }
      }
    });
  });
}

/**
 * Show Success Confirmation Modal
 */
function showSuccessModal(refId) {
  let modal = document.getElementById('successModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'successModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" onclick="document.getElementById('successModal').classList.remove('active')">&times;</button>
        <div style="font-size: 3rem; color: var(--color-success); margin-bottom: 1rem;">✓</div>
        <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Appointment Request Received!</h3>
        <p style="color: var(--color-muted); font-size: 0.9rem; margin-bottom: 1rem;">
          Thank you for reaching out. <span class="js-doctor-name">Dr. Arti Tanwar</span>'s team will contact you shortly on WhatsApp/Phone to confirm your session timing.
        </p>
        <div style="background-color: var(--color-ivory); padding: 0.75rem; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: bold; margin-bottom: 1.5rem;">
          Reference ID: <span style="color: var(--color-forest);">${refId}</span>
        </div>
        <button class="btn btn-primary btn-full" onclick="document.getElementById('successModal').classList.remove('active')">Got it, thanks</button>
      </div>
    `;
    document.body.appendChild(modal);
  } else {
    const refSpan = modal.querySelector('span');
    if (refSpan) refSpan.textContent = refId;
  }

  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
}

/**
 * Toast Notification Helper
 */
export function showToast(message, type = "info") {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
