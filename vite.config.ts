import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        about: path.resolve(__dirname, 'about.html'),
        services: path.resolve(__dirname, 'services.html'),
        consultation: path.resolve(__dirname, 'consultation.html'),
        home_visits: path.resolve(__dirname, 'home-visits.html'),
        rehabilitation: path.resolve(__dirname, 'rehabilitation.html'),
        neurological: path.resolve(__dirname, 'neurological-physiotherapy.html'),
        muscle_strengthening: path.resolve(__dirname, 'muscle-strengthening.html'),
        exercise_tips: path.resolve(__dirname, 'exercise-tips.html'),
        wellness_tips: path.resolve(__dirname, 'wellness-tips.html'),
        articles: path.resolve(__dirname, 'articles.html'),
        contact: path.resolve(__dirname, 'contact.html'),
        privacy: path.resolve(__dirname, 'privacy-policy.html'),
        terms: path.resolve(__dirname, 'terms.html'),
        disclaimer: path.resolve(__dirname, 'medical-disclaimer.html'),
        // Admin pages
        admin_login: path.resolve(__dirname, 'admin/login.html'),
        admin_dashboard: path.resolve(__dirname, 'admin/index.html'),
        admin_leads: path.resolve(__dirname, 'admin/leads.html'),
        admin_lead_details: path.resolve(__dirname, 'admin/lead-details.html'),
        admin_appointments: path.resolve(__dirname, 'admin/appointments.html'),
        admin_content: path.resolve(__dirname, 'admin/content.html'),
        admin_services: path.resolve(__dirname, 'admin/services.html'),
        admin_testimonials: path.resolve(__dirname, 'admin/testimonials.html'),
        admin_faqs: path.resolve(__dirname, 'admin/faqs.html'),
        admin_articles: path.resolve(__dirname, 'admin/articles.html'),
        admin_media: path.resolve(__dirname, 'admin/media.html'),
        admin_settings: path.resolve(__dirname, 'admin/settings.html'),
        admin_profile: path.resolve(__dirname, 'admin/profile.html'),
      },
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
});
