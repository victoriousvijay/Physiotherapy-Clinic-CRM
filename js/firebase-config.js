import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyAYNJHdzS3OBEZoDAhCEBS-ptY-yMP43ts",
  authDomain: "red-studio-410914.firebaseapp.com",
  projectId: "red-studio-410914",
  storageBucket: "red-studio-410914.firebasestorage.app",
  messagingSenderId: "765651650341",
  appId: "1:765651650341:web:8a3c0863f9d4d036403ccc",
  firestoreDatabaseId: "ai-studio-e38727dd-4530-4a1a-9468-7b10377112af"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const auth = getAuth(app);

// Use initializeFirestore with forced long polling for resilient connections in sandbox/iframe/proxy environments
const firestoreSettings = {
  experimentalForceLongPolling: true
};

export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)"
  ? initializeFirestore(app, firestoreSettings, firebaseConfig.firestoreDatabaseId)
  : initializeFirestore(app, firestoreSettings);

export const storage = getStorage(app);

