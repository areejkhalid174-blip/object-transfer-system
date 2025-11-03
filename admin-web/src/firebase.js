import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAH5Z-QJgzJX_F9V3wk5hRwJan5oz_XwbQ",
  authDomain: "objecttransfersystem.firebaseapp.com",
  projectId: "objecttransfersystem",
  storageBucket: "objecttransfersystem.firebasestorage.app",
  messagingSenderId: "669666525575",
  appId: "1:669666525575:web:9f78a43420630ea2415322",
  measurementId: "G-7ML6Z5P1PC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
