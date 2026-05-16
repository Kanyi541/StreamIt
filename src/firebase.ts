// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCGJF5wV3w3OY6nqNQT5ckh_S1piDPVV6A",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "streamke-bcb5a.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "streamke-bcb5a",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "streamke-bcb5a.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "928701825981",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:928701825981:web:305b2d63280bb526b1c8d4",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-BG5PGB8JYB"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

export { auth, provider, analytics };
