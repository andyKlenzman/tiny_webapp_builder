import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

import {
  getAuth,
  setPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAELTafHqYnojlVcL0EA5emCzKkMCjwvDw",
  authDomain: "tracking-4a051.firebaseapp.com",
  projectId: "tracking-4a051",
  storageBucket: "tracking-4a051.firebasestorage.app",
  messagingSenderId: "1018977032973",
  appId: "1:1018977032973:web:a5a59c1f97066625962e44",
  measurementId: "G-30X8DJDM2J",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

// connectFirestoreEmulator(db, "127.0.0.1", 8080);

export { db, auth };
