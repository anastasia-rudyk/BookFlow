import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  doc, 
  updateDoc 
} from "firebase/firestore";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";

// Твої точні ключі з script.js
const firebaseConfig = {
    apiKey: "AIzaSyAMmL_Ox1gDt5mC_om8G44hCH8Rwq2SmVA",
    authDomain: "reading-dairy.firebaseapp.com",
    projectId: "reading-dairy",
    storageBucket: "reading-dairy.firebasestorage.app",
    messagingSenderId: "392334952892",
    appId: "1:392334952892:web:4c273b1ee58f8ffb68c3b9",
    measurementId: "G-4XHBQKB4F8"
};

// Ініціалізація
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { 
  db, 
  auth, 
  googleProvider,
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  doc, 
  updateDoc,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
};