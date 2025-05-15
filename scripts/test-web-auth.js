#!/usr/bin/env node

// Test authentication directly with the web app configuration
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

// Use the exact same config as the web app
const firebaseConfig = {
  apiKey: "AIzaSyBnZXlz0ffaDpjQP56NkeQ2okhV3KVqsMk",
  authDomain: "gdg-community-companion.firebaseapp.com",
  projectId: "gdg-community-companion",
  storageBucket: "gdg-community-companion.firebasestorage.app",
  messagingSenderId: "512932129357",
  appId: "1:512932129357:web:d390c9196e480a489d0a04"
};

async function testAuth() {
  try {
    console.log('Testing authentication with web app config...\n');
    
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    
    const email = 'szermer@gmail.com';
    const password = 'Zaq12wsx';
    
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