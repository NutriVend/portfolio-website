// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATENARIfBZ57HAhtJGKGIYjeXQs6jOktE",
  authDomain: "portfolio-website-6affe.firebaseapp.com",
  projectId: "portfolio-website-6affe",
  storageBucket: "portfolio-website-6affe.firebasestorage.app",
  messagingSenderId: "620730873657",
  appId: "1:620730873657:web:d0c835b9c0cbd083dd1ae8",
  measurementId: "G-WBKC2V99XS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);