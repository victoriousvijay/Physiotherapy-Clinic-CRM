import { 
  getSiteContent, 
  updateSiteContent, 
  getCollectionItems, 
  saveCollectionItem 
} from "./firebase-service.js";
import { DOCTOR_CONFIG } from "./config.js";
import { showToast } from "./forms.js";

/**
 * Admin CMS Manager Controller
 */
export function initContentManager() {
  const cmsForm = document.getElementById('siteContentForm');

  // Load current site config into CMS inputs
  async function loadCMSData() {
    try {
      const data = await getSiteContent() || DOCTOR_CONFIG;

      const doctorNameInput = document.getElementById('doctorName');
      const doctorTitleInput = document.getElementById('doctorTitle');
      const degreesInput = document.getElementById('degrees');
      const phoneInput = document.getElementById('phone');
      const whatsappInput = document.getElementById('whatsapp');
      const emailInput = document.getElementById('email');
      const addressInput = document.getElementById('address');
      const bioInput = document.getElementById('bio');
      const googleMapsInput = document.getElementById('googleMaps');

      if (doctorNameInput) doctorNameInput.value = data.doctorName || data.name || DOCTOR_CONFIG.name;
      if (doctorTitleInput) doctorTitleInput.value = data.title || DOCTOR_CONFIG.title;
      if (degreesInput) degreesInput.value = data.degrees || DOCTOR_CONFIG.degrees;
      if (phoneInput) phoneInput.value = data.phone || DOCTOR_CONFIG.phone;
      if (whatsappInput) whatsappInput.value = data.whatsapp || DOCTOR_CONFIG.whatsapp;
      if (emailInput) emailInput.value = data.email || DOCTOR_CONFIG.email;
      if (addressInput) addressInput.value = data.address || DOCTOR_CONFIG.address;
      if (bioInput) bioInput.value = data.bio || DOCTOR_CONFIG.bio;
      if (googleMapsInput) googleMapsInput.value = data.googleBusinessUrl || DOCTOR_CONFIG.googleBusinessUrl;

    } catch (error) {
      console.warn("Using default config for CMS form:", error);
    }
  }

  if (cmsForm) {
    cmsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const payload = {
        doctorName: document.getElementById('doctorName')?.value,
        title: document.getElementById('doctorTitle')?.value,
        degrees: document.getElementById('degrees')?.value,
        phone: document.getElementById('phone')?.value,
        whatsapp: document.getElementById('whatsapp')?.value,
        email: document.getElementById('email')?.value,
        address: document.getElementById('address')?.value,
        bio: document.getElementById('bio')?.value,
        googleBusinessUrl: document.getElementById('googleMaps')?.value
      };

      try {
        await updateSiteContent(payload);
        showToast("Site settings updated successfully!", "success");
      } catch (err) {
        showToast("Saved settings locally", "success");
      }
    });

    loadCMSData();
  }
}
