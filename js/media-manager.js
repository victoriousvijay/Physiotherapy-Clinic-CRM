import { uploadMedia } from "./firebase-service.js";
import { showToast } from "./forms.js";

/**
 * Media Manager / Image Upload Helper
 */
export function initMediaManager() {
  const uploadInput = document.getElementById('mediaFileInput');
  const uploadBtn = document.getElementById('mediaUploadBtn');
  const mediaGallery = document.getElementById('mediaGalleryGrid');

  if (uploadBtn && uploadInput) {
    uploadBtn.addEventListener('click', async () => {
      const file = uploadInput.files[0];
      if (!file) {
        showToast("Please select an image file first", "error");
        return;
      }

      // File type validation
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        showToast("Invalid file format. Please upload JPG, PNG, WEBP or GIF.", "error");
        return;
      }

      // Max size 5MB
      if (file.size > 5 * 1024 * 1024) {
        showToast("File size exceeds 5MB limit.", "error");
        return;
      }

      uploadBtn.disabled = true;
      uploadBtn.textContent = "Uploading...";

      try {
        const downloadURL = await uploadMedia(file, "clinic-gallery");
        showToast("Image uploaded successfully!", "success");

        if (mediaGallery) {
          const card = document.createElement('div');
          card.className = 'card';
          card.style.padding = '0.5rem';
          card.innerHTML = `
            <img src="${downloadURL}" alt="Uploaded asset" style="width: 100%; aspect-ratio: 4/3; object-fit: cover; border-radius: var(--radius-sm);">
            <div style="font-size: 0.75rem; color: var(--color-muted); margin-top: 0.5rem; word-break: break-all;">${downloadURL}</div>
          `;
          mediaGallery.prepend(card);
        }

      } catch (err) {
        showToast("Upload failed: " + err.message, "error");
      } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = "Upload Image";
        uploadInput.value = "";
      }
    });
  }
}
