import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Verify environment variables are loaded
const verifyConfig = () => {
  const required = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_STORAGE_BUCKET'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
};

try {
  verifyConfig();
} catch (error) {
  console.error('Firebase config verification failed:', error);
  throw error;
}

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Debug log to check if environment variables are loaded
console.log('Firebase config loaded:', {
  apiKeyLength: firebaseConfig.apiKey?.length,
  projectId: firebaseConfig.projectId
});

console.log('API Key length:', process.env.REACT_APP_FIREBASE_API_KEY?.length);
console.log('Project ID:', process.env.REACT_APP_FIREBASE_PROJECT_ID);

let app;
let auth;
let db;
let storage;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  console.log('Firebase services initialized successfully');
} catch (error) {
  console.error("Error initializing Firebase:", error);
  console.error("Firebase config:", firebaseConfig);
}

export { app, auth, db, storage };
