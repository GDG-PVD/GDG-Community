#!/usr/bin/env node

const readline = require('readline');
const { promisify } = require('util');
const { initializeApp } = require('firebase/app');
const { 
  getAuth, 
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword
} = require('firebase/auth');
const { 
  getFirestore, 
  doc, 
  setDoc 
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = promisify(rl.question).bind(rl);

async function createAdminUser() {
  try {
    console.log('=== Create Admin User for GDG Community Companion ===\n');

    // Check configuration
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      console.error('Firebase configuration is missing. Please check your environment files.');
      console.error('Looking for .env.production in src/ui directory');
      process.exit(1);
    }

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    // Get user details
    const email = await question('Email address: ');
    const password = await question('Password (min 6 characters): ');
    const displayName = await question('Display name: ');
    const chapterId = await question('Chapter ID (e.g., gdg-providence): ');
    const isAdmin = await question('Grant admin privileges? (yes/no): ');

    console.log('\nCreating user...');

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log(`User created with UID: ${user.uid}`);

    // Update profile
    await updateProfile(user, {
      displayName: displayName
    });

    // Create user document in Firestore
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      role: isAdmin.toLowerCase() === 'yes' ? 'admin' : 'member',
      chapterId: chapterId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store in both collections for compatibility
    await setDoc(doc(db, 'users', user.uid), userData);
    await setDoc(doc(db, 'members', user.uid), userData);

    console.log('\n✅ User created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Role: ${userData.role}`);
    console.log(`Chapter: ${chapterId}`);
    console.log(`UID: ${user.uid}`);

    if (userData.role === 'admin') {
      console.log('\nThis user has admin privileges and can access all features.');
    }

    // Sign out
    await auth.signOut();

  } catch (error) {
    console.error('\n❌ Error creating user:', error.message);
    
    if (error.code === 'auth/email-already-exists') {
      console.log('\nThis email is already registered.');
    } else if (error.code === 'auth/invalid-email') {
      console.log('\nPlease provide a valid email address.');
    } else if (error.code === 'auth/weak-password') {
      console.log('\nPassword must be at least 6 characters long.');
    }
  } finally {
    rl.close();
  }
}

// Run the script
createAdminUser();