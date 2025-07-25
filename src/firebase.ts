// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCGJF5wV3w3OY6nqNQT5ckh_S1piDPVV6A",
  authDomain: "streamke-bcb5a.firebaseapp.com",
  projectId: "streamke-bcb5a",
  storageBucket: "streamke-bcb5a.firebasestorage.app",
  messagingSenderId: "928701825981",
  appId: "1:928701825981:web:305b2d63280bb526b1c8d4",
  measurementId: "G-BG5PGB8JYB"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
