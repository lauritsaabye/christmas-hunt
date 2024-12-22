// Import the functions you need from the SDKs you need
// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBFCZ_BeFiwvLS9OsWkq46fMJpRYqSPau0',
  authDomain: 'christmas-hunt-1.firebaseapp.com',
  projectId: 'christmas-hunt-1',
  storageBucket: 'christmas-hunt-1.firebasestorage.app',
  messagingSenderId: '569217301087',
  appId: '1:569217301087:web:59dba355bde8d3aab8f9ea',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Get a reference to Firestore

export { db }; // Export the Firestore instance
