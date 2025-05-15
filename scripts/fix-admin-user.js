#!/usr/bin/env node

const { initializeApp } = require('firebase/app');
const { 
  getAuth, 
  signInWithEmailAndPassword
} = require('firebase/auth');
const { 
  getFirestore, 
  doc, 
  setDoc,
  serverTimestamp
} = require('firebase/firestore');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../src/ui/.env.production') });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

async function fixAdminUser() {
  try {
    console.log('=== Fix Admin User Document ===\n');

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    // First, let's make this user an admin by creating their document
    // We'll use a service account approach
    const userId = 'F9vT24kMJMaUi6y7DeIqSsapqN02';
    const userData = {
      uid: userId,
      email: 'szermer@gmail.com',
      displayName: 'Stephen',
      role: 'admin',
      chapterId: 'gdg-providence',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Creating admin user document...');
    
    // Since we might not have permissions yet, let's use the Admin SDK approach
    console.log('\nPlease run this command first to get admin access:');
    console.log('gcloud firestore import gs://gdg-community-companion.appspot.com/[backup] --async');
    console.log('\nOr use Firebase Console to manually create the user document.');
    console.log('\nUser details to create:');
    console.log(JSON.stringify(userData, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the fix
fixAdminUser();