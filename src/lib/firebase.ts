// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "kumbhavis",
  appId: "1:657805833630:web:4afe6f9d3cb136fac9d28f",
  storageBucket: "kumbhavis.firebasestorage.app",
  apiKey: "AIzaSyA3oZVcj3ZuTvyZseWBW2ZruhK5yxmrqSw",
  authDomain: "kumbhavis.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "657805833630"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export default app;
