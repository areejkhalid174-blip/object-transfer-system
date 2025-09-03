// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';



const firebaseConfig = {
     apiKey: "AIzaSyBKaNOBwezKzm11MtwRu42vlzilLrTlV5c",
  authDomain: "object-transfer-system-ae078.firebaseapp.com",
  projectId: "object-transfer-system-ae078",
  storageBucket: "object-transfer-system-ae078.firebasestorage.app",
  messagingSenderId: "1062925432344",
  appId: "1:1062925432344:web:3a999d921d7edea3b4f56d",
  measurementId: "G-VXHGKV9827"
  };

// Initialize Firebase
try {
  var  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}
// const app = initializeApp(firebaseConfig);

// Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
