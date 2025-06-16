#!/usr/bin/env node

// Test authentication directly with the web app configuration
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

// Load environment variables
require('dotenv').config({ path: require('path').resolve(__dirname, '../src/ui/.env.local') });

// Use Firebase config from environment
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Validate config
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error('Missing Firebase configuration. Please check your .env file.');
  process.exit(1);
}

async function testAuth() {
  try {
    console.log('Testing authentication with web app config...\n');
    
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    
    const email = process.env.TEST_EMAIL;
    const password = process.env.TEST_PASSWORD;
    
    if (!email || !password) {
      throw new Error('TEST_EMAIL and TEST_PASSWORD environment variables are required');
    }
    
    console.log('Attempting to sign in with:');
    console.log('Email:', email);
    console.log('Password: [hidden]');
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    console.log('\n✅ Authentication successful!');
    console.log('User ID:', userCredential.user.uid);
    console.log('Email:', userCredential.user.email);
    console.log('Email Verified:', userCredential.user.emailVerified);
    
  } catch (error) {
    console.error('\n❌ Authentication failed:', error.message);
    console.error('Error code:', error.code);
    
    if (error.code === 'auth/user-not-found') {
      console.log('\nThe user does not exist.');
    } else if (error.code === 'auth/wrong-password') {
      console.log('\nThe password is incorrect.');
    } else if (error.code === 'auth/invalid-email') {
      console.log('\nThe email format is invalid.');
    } else if (error.code === 'auth/invalid-credential') {
      console.log('\nThe credentials are invalid. This might mean:');
      console.log('- The password was changed');
      console.log('- The account was deleted');
      console.log('- The authentication method is disabled');
    }
  }
}

testAuth();