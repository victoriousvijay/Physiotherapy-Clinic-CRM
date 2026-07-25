/**
 * Input Sanitization & Validation Helpers
 */

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate Indian Mobile Number (10 digits starting with 6,7,8,9 or +91 prefix)
 */
export function validatePhone(phone) {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  // Matches 10 digits starting with 6-9, or 12 digits starting with 91 followed by 6-9
  const phoneRegex = /^(?:91)?[6-9]\d{9}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Validate Email address
 */
export function validateEmail(email) {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate preferred date (cannot be in the past)
 */
export function validateFutureDate(dateString) {
  if (!dateString) return false;
  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
}

/**
 * Format date nicely for display
 */
export function formatDate(dateVal) {
  if (!dateVal) return "N/A";
  let dateObj;
  if (typeof dateVal === 'string') {
    dateObj = new Date(dateVal);
  } else if (dateVal.toDate && typeof dateVal.toDate === 'function') {
    dateObj = dateVal.toDate();
  } else if (dateVal.seconds) {
    dateObj = new Date(dateVal.seconds * 1000);
  } else {
    dateObj = new Date(dateVal);
  }

  if (isNaN(dateObj.getTime())) return "N/A";

  return dateObj.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

/**
 * Format date + time for display
 */
export function formatDateTime(dateVal) {
  if (!dateVal) return "N/A";
  let dateObj;
  if (dateVal.toDate && typeof dateVal.toDate === 'function') {
    dateObj = dateVal.toDate();
  } else if (dateVal.seconds) {
    dateObj = new Date(dateVal.seconds * 1000);
  } else {
    dateObj = new Date(dateVal);
  }

  if (isNaN(dateObj.getTime())) return "N/A";

  return dateObj.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
