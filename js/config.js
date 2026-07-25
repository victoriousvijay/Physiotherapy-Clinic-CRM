/* Central Doctor & Practice Configuration */
export const DOCTOR_CONFIG = {
  // Verified Doctor Identity (Dr. Arti Tanwar)
  name: "Dr. Arti Tanwar", 
  title: "Senior Physiotherapist & Rehabilitation Specialist",
  degrees: "BPT, MPT (Musculoskeletal & Neuro-Rehabilitation)",
  certifications: "Registered Physiotherapist | 5.0 ★ Google Rated Specialist",
  registrationNumber: "Reg. Physiotherapist (Jaipur, Rajasthan)",
  experienceYears: 12,
  clientsSupported: 3500,

  // Practice & Clinic Details
  clinicName: "Dr. Arti Tanwar Physiotherapy Centre",
  address: "Flat no. G-1, Alkapuri township, plot no. 124-126, Nivaru Rd, Harnathapura, Jhotwara, Jaipur, Rajasthan 302012",
  phone: "+91 86962 69969",
  whatsapp: "918696269969",
  email: "care@drartitanwar.com",
  openingHours: "Mon - Sat: 9:00 AM - 7:30 PM | Sun: Emergency & Prior Appointments",
  
  // Service Areas for Home Visits & Clinic Consultations
  homeVisitAreas: ["Jhotwara", "Harnathapura", "Alkapuri Township", "Nivaru Road", "Jaipur & Nearby Areas"],
  
  // External Links
  googleBusinessUrl: "https://maps.google.com/?q=Flat+no.G-1,+Alkapuri+township,+plot+no.+124-126,+Nivaru+Rd,+Harnathapura,+Jhotwara,+Jaipur,+Rajasthan+302012",
  googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.0864319082265!2d75.7276!3d26.9634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db30000000001%3A0x1!2sAlkapuri%20township%2C%20Jhotwara%2C%20Jaipur%2C%20Rajasthan%20302012!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin",

  // Biography & Quote
  bio: "Dr. Arti Tanwar is a highly acclaimed Physiotherapist in Jaipur, Rajasthan with a 5.0-star patient satisfaction rating. With over 12 years of clinical expertise, she specializes in post-fracture rehabilitation, stroke and neurological recovery, chronic joint pain management, and personalized home physiotherapy visits across Jhotwara and Jaipur.",
  quote: "Personalized physical therapy and dedicated movement care are the foundation of true healing and lifelong mobility.",

  // Static Fallbacks for Services
  services: [
    {
      id: "home-physiotherapy",
      title: "Home Physiotherapy Visits",
      slug: "home-physiotherapy",
      summary: "One-on-one physiotherapy delivered at your home in Jhotwara, Harnathapura, and across Jaipur for acute pain, elderly care, and post-surgery recovery.",
      description: "Convenient, professional physiotherapy care at your home for patients with limited mobility or acute joint pain.",
      icon: "home",
      order: 1
    },
    {
      id: "post-fracture-rehab",
      title: "Post-Fracture Rehabilitation",
      slug: "post-fracture-rehab",
      summary: "Joint mobilization, stiffness reduction, progressive muscle strengthening, and gait re-education post cast removal.",
      description: "Structured recovery routines to restore full range of motion and strength after bone fractures.",
      icon: "bone",
      order: 2
    },
    {
      id: "neurological-physio",
      title: "Neurological Physiotherapy",
      slug: "neurological-physio",
      summary: "Specialized rehabilitation for stroke recovery, nerve compression, balance deficits, and motor coordination.",
      description: "Neuro-rehabilitation techniques focused on neural plasticity and functional independence.",
      icon: "brain",
      order: 3
    },
    {
      id: "online-consultation",
      title: "Online Consultation",
      slug: "online-consultation",
      summary: "Virtual pain triage, ergonomic posture evaluation, guided exercise routines, and digital recovery plans.",
      description: "Expert video guidance for remote patients seeking professional assessment and exercise routines.",
      icon: "laptop",
      order: 4
    }
  ],

  // Static Fallbacks for Testimonials
  testimonials: [
    {
      id: "1",
      patientName: "Rajesh Kumar",
      text: "Dr. Arti Tanwar provided exceptional home physiotherapy for my mother post-fracture. Her gentle approach and expert guidance helped my mother walk independently within weeks. Rated 5 stars!",
      rating: 5,
      source: "Google Review",
      approved: true
    },
    {
      id: "2",
      patientName: "Suman Sharma",
      text: "Best physiotherapist in Jhotwara, Jaipur! Dr. Arti's neuro-rehabilitation exercises greatly improved my father's stroke recovery and balance. Highly recommended.",
      rating: 5,
      source: "Google Review",
      approved: true
    },
    {
      id: "3",
      patientName: "Vikram Rathore",
      text: "Dr. Arti Tanwar is extremely knowledgeable and patient. Her personalized treatment plan cured my chronic lower back pain. Truly a 5-star doctor in Jaipur.",
      rating: 5,
      source: "Google Review",
      approved: true
    }
  ],

  // Static Fallbacks for FAQs
  faqs: [
    {
      id: "1",
      question: "Are home visit physiotherapy sessions available in Jhotwara and Jaipur?",
      answer: "Yes! Dr. Arti Tanwar provides personalized home physiotherapy visits in Alkapuri Township, Jhotwara, Harnathapura, Nivaru Road, and surrounding areas in Jaipur.",
      order: 1
    },
    {
      id: "2",
      question: "Where is Dr. Arti Tanwar's clinic located?",
      answer: "The clinic address is Flat no. G-1, Alkapuri Township, Plot no. 124-126, Nivaru Rd, Harnathapura, Jhotwara, Jaipur, Rajasthan 302012.",
      order: 2
    },
    {
      id: "3",
      question: "How can I book a session or contact Dr. Arti Tanwar?",
      answer: "You can call or WhatsApp directly at +91 86962 69969 (086962 69969) or book an appointment online through the website form.",
      order: 3
    },
    {
      id: "4",
      question: "What conditions does Dr. Arti Tanwar treat?",
      answer: "Dr. Arti Tanwar specializes in post-fracture recovery, neuro-rehabilitation, stroke therapy, knee & joint pain, back pain relief, muscle strengthening, and ergonomic posture guidance.",
      order: 4
    }
  ]
};
