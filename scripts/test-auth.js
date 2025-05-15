#!/usr/bin/env node

const { initializeApp } = require('firebase/app');
const { 
  getAuth, 
  signInWithEmailAndPassword,
  onAuthStateChanged
} = require('firebase/auth');
const { 
  getFirestore, 
  doc, 
  getDoc 
} = require('firebase/firestore');
const dotenv = require('dotenv');
const path = require('path');
const readline = require('readline');
const { promisify } = require('util');

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = promisify(rl.question).bind(rl);

async function testAuth() {
  try {
    console.log('=== Test Firebase Authentication ===\n');

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    // Get credentials
    const email = await question('Email: ');
    const password = await question('Password: ');

    console.log('\nSigning in...');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('\n✅ Authentication successful!');
    console.log(`User ID: ${user.uid}`);
    console.log(`Email: ${user.email}`);
    console.log(`Display Name: ${user.displayName || '(not set)'}`);

    // Try to fetch user document
    console.log('\nFetching user profile from Firestore...');
    
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('User Profile:', userData);
      } else {
        console.log('No user document found in Firestore.');
      }
    } catch (firestoreError) {
      console.log('Could not fetch Firestore data:', firestoreError.message);
    }

    // Sign out
    await auth.signOut();
    console.log('\nSigned out successfully.');

  } catch (error) {
    console.error('\n❌ Authentication failed:', error.message);
    
    if (error.code === 'auth/user-not-found') {
      console.log('No user found with this email address.');
    } else if (error.code === 'auth/wrong-password') {
      console.log('Incorrect password.');
    } else if (error.code === 'auth/invalid-email') {
      console.log('Invalid email format.');
    }
  } finally {
    rl.close();
  }
}

// Run the test
testAuth();