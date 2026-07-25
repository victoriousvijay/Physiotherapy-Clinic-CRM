import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  limit 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase-config.js";

// --- LEAD SUBMISSION & MANAGEMENT ---

/**
 * Submit a new patient lead / appointment request
 */
export async function submitLead(leadData) {
  const localId = "lead_" + Date.now();
  const payload = {
    fullName: leadData.fullName || "",
    phone: leadData.phone || "",
    whatsapp: leadData.whatsapp || leadData.phone || "",
    email: leadData.email || "",
    ageGroup: leadData.ageGroup || "",
    city: leadData.city || leadData.locality || "",
    consultationType: leadData.consultationType || "clinic",
    service: leadData.service || leadData.requiredService || "General Physiotherapy",
    preferredDate: leadData.preferredDate || "",
    preferredTime: leadData.preferredTime || "",
    message: leadData.message || "",
    sourcePage: leadData.sourcePage || window.location.pathname,
    consentAccepted: Boolean(leadData.consentAccepted),
    status: "new",
    priority: "normal",
    notesCount: 0,
    followUpAt: null,
    assignedTo: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Cache lead locally
  try {
    const cachedLeads = JSON.parse(localStorage.getItem("physio_leads_cache") || "[]");
    cachedLeads.unshift({ id: localId, ...payload });
    localStorage.setItem("physio_leads_cache", JSON.stringify(cachedLeads));
  } catch (e) {
    console.warn("Local storage write notice:", e);
  }

  try {
    const docRef = await addDoc(collection(db, "leads"), {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.warn("Firestore offline or connection issue, returning local submission ID:", error);
    return { success: true, id: localId };
  }
}

/**
 * Fetch list of leads for Admin CRM with optional filters
 */
export async function getLeads(filters = {}) {
  let leads = [];
  try {
    let q = query(collection(db, "leads"), orderBy("createdAt", "desc"));

    if (filters.status && filters.status !== "all") {
      q = query(collection(db, "leads"), where("status", "==", filters.status), orderBy("createdAt", "desc"));
    }

    const snapshot = await getDocs(q);
    snapshot.forEach((docSnap) => {
      leads.push({ id: docSnap.id, ...docSnap.data() });
    });
    if (leads.length > 0) {
      localStorage.setItem("physio_leads_cache", JSON.stringify(leads));
    }
  } catch (error) {
    console.warn("Error fetching leads from Firestore, reading cached leads:", error);
    try {
      leads = JSON.parse(localStorage.getItem("physio_leads_cache") || "[]");
    } catch (e) {
      leads = [];
    }
  }

  // Client-side filtering for priority / consultationType if needed
  let filtered = leads;
  if (filters.priority && filters.priority !== "all") {
    filtered = filtered.filter(l => l.priority === filters.priority);
  }
  if (filters.type && filters.type !== "all") {
    filtered = filtered.filter(l => l.consultationType === filters.type);
  }
  if (filters.search) {
    const term = filters.search.toLowerCase();
    filtered = filtered.filter(l => 
      (l.fullName && l.fullName.toLowerCase().includes(term)) ||
      (l.phone && l.phone.includes(term)) ||
      (l.email && l.email.toLowerCase().includes(term)) ||
      (l.city && l.city.toLowerCase().includes(term))
    );
  }

  return filtered;
}

/**
 * Fetch a single lead by ID along with its notes
 */
export async function getLeadById(leadId) {
  try {
    const docRef = doc(db, "leads", leadId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;

    const leadData = { id: docSnap.id, ...docSnap.data() };

    // Fetch notes subcollection
    const notesQuery = query(collection(db, "leads", leadId, "notes"), orderBy("createdAt", "desc"));
    const notesSnap = await getDocs(notesQuery);
    const notes = [];
    notesSnap.forEach(n => notes.push({ id: n.id, ...n.data() }));

    leadData.notesList = notes;
    return leadData;
  } catch (error) {
    console.error("Error fetching lead detail:", error);
    throw error;
  }
}

/**
 * Update lead status
 */
export async function updateLeadStatus(leadId, newStatus) {
  try {
    const leadRef = doc(db, "leads", leadId);
    await updateDoc(leadRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating lead status:", error);
    throw error;
  }
}

/**
 * Update lead priority
 */
export async function updateLeadPriority(leadId, newPriority) {
  try {
    const leadRef = doc(db, "leads", leadId);
    await updateDoc(leadRef, {
      priority: newPriority,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating lead priority:", error);
    throw error;
  }
}

/**
 * Add a note to a lead
 */
export async function addLeadNote(leadId, noteText, authorName = "Admin") {
  try {
    const notesRef = collection(db, "leads", leadId, "notes");
    await addDoc(notesRef, {
      text: noteText,
      authorName: authorName,
      createdAt: serverTimestamp()
    });

    // Update lead's updatedAt
    const leadRef = doc(db, "leads", leadId);
    await updateDoc(leadRef, {
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error adding note:", error);
    throw error;
  }
}

/**
 * Schedule a follow up date for a lead
 */
export async function scheduleFollowUp(leadId, followUpDate) {
  try {
    const leadRef = doc(db, "leads", leadId);
    await updateDoc(leadRef, {
      followUpAt: followUpDate,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error scheduling follow-up:", error);
    throw error;
  }
}

// --- SITE CONTENT MANAGEMENT (CMS) ---

export async function getSiteContent() {
  try {
    const docRef = doc(db, "siteConfig", "main");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.warn("Using default site content config due to Firestore fetch state:", error);
    return null;
  }
}

export async function updateSiteContent(contentData) {
  try {
    const docRef = doc(db, "siteConfig", "main");
    await setDoc(docRef, {
      ...contentData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating site content:", error);
    throw error;
  }
}

// --- SERVICES, TESTIMONIALS, FAQS, ARTICLES ---

export async function getCollectionItems(collectionName) {
  try {
    const q = query(collection(db, collectionName));
    const snapshot = await getDocs(q);
    const items = [];
    snapshot.forEach(docSnap => items.push({ id: docSnap.id, ...docSnap.data() }));
    return items;
  } catch (error) {
    console.warn(`Could not load collection ${collectionName} from Firestore, using fallbacks:`, error);
    return [];
  }
}

export async function saveCollectionItem(collectionName, itemId, itemData) {
  try {
    if (itemId) {
      const docRef = doc(db, collectionName, itemId);
      await setDoc(docRef, { ...itemData, updatedAt: serverTimestamp() }, { merge: true });
      return itemId;
    } else {
      const docRef = await addDoc(collection(db, collectionName), {
        ...itemData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    }
  } catch (error) {
    console.error(`Error saving item to ${collectionName}:`, error);
    throw error;
  }
}

// --- FIREBASE STORAGE UPLOAD ---

export async function uploadMedia(file, folder = "general") {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const storageRef = ref(storage, `${folder}/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file to Firebase Storage:", error);
    throw error;
  }
}

// --- AUDIT ACTIVITY LOGS ---

export async function logActivity(action, leadId = null, details = "", performedBy = "Admin") {
  try {
    await addDoc(collection(db, "activityLogs"), {
      action,
      leadId,
      details,
      performedBy,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    console.warn("Non-blocking error logging activity:", err);
  }
}
