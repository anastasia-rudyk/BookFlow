import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAMmL_Ox1gDt5mC_om8G44hCH8Rwq2SmVA",
  authDomain: "reading-dairy.firebaseapp.com",
  projectId: "reading-dairy",
  storageBucket: "reading-dairy.firebasestorage.app",
  messagingSenderId: "392334952892",
  appId: "1:392334952892:web:4c273b1ee58f8ffb68c3b9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
};