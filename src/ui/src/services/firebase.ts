import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

// Firebase configuration - for emulator use, these values don't need to be real
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Connect to emulators in development environment
if (window.location.hostname === 'localhost') {
  // Auth emulator
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  
  // Firestore emulator
  connectFirestoreEmulator(db, 'localhost', 8080);
  
  console.log('Using Firebase Emulators');
}

export default app;