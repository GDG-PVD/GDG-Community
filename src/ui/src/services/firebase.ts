import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, Auth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator, FirebaseStorage } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator, Functions } from 'firebase/functions';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';

// Firebase configuration
// For production, these values should come from environment variables
// You'll need to replace these with your Firebase project details
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Debug Firebase configuration
console.log('Firebase Config (sanitized):', {
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  apiKeyProvided: !!firebaseConfig.apiKey
});

// Initialize Firebase app
export const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized successfully');

// Initialize Firebase services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

// Initialize Storage and Functions with error handling
export let storage: FirebaseStorage;
export let functions: Functions;

try {
  storage = getStorage(app);
  functions = getFunctions(app);
  console.log('All Firebase services initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Storage or Functions:', error);
  // Create fallback objects
  // @ts-ignore - This is a fallback for when Firebase Storage is not available
  storage = { ref: () => ({ getDownloadURL: () => Promise.resolve('') }) } as FirebaseStorage;
  // @ts-ignore - This is a fallback for when Firebase Functions is not available
  functions = { httpsCallable: () => () => Promise.resolve({ data: {} }) } as Functions;
  console.warn('Using fallback objects for Firebase Storage and Functions');
}

// Initialize Analytics conditionally (it's not supported in all environments)
let analytics: Analytics | null = null;
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});
export { analytics };

// Use emulators for local development when REACT_APP_USE_EMULATORS is true
if (process.env.REACT_APP_USE_EMULATORS === 'true') {
  // Auth emulator
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  
  // Firestore emulator
  connectFirestoreEmulator(db, 'localhost', 8080);
  
  // Storage emulator
  connectStorageEmulator(storage, 'localhost', 9199);
  
  // Functions emulator
  connectFunctionsEmulator(functions, 'localhost', 5001);
  
  console.log('Using Firebase Emulators for local development');
}

export default app;