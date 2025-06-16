#!/usr/bin/env node

const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
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

async function testLogin() {
  try {
    console.log('Testing login with provided credentials...\n');
    
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    
    const email = 'szermer@gmail.com';
    const password = 'Zaq12wsx';
    
    console.log('Attempting to sign in...');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    console.log('✅ Login successful!');
    console.log('User ID:', userCredential.user.uid);
    console.log('Email:', userCredential.user.email);
    
    await auth.signOut();
    console.log('\nSigned out successfully.');
    
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    console.error('Error code:', error.code);
    
    if (error.code === 'auth/wrong-password') {
      console.log('\nThe password might have been changed. Try creating a new user.');
    } else if (error.code === 'auth/user-not-found') {
      console.log('\nUser not found. The account might have been deleted.');
    }
  }
}

testLogin();