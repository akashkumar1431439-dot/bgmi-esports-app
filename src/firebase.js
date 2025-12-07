// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDQy0R90F570HnLS82GOAh5578crfFpNhg",
  authDomain: "bgmi-esports-app.firebaseapp.com",
  projectId: "bgmi-esports-app",
  storageBucket: "bgmi-esports-app.appspot.com", // yahi sahi bucket hai
  messagingSenderId: "899777698638",
  appId: "1:899777698638:web:56162e96db42e033181c1f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
