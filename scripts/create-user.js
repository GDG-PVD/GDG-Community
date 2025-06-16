/**
 * Script to create a user in Firebase
 * 
 * Usage:
 * node scripts/create-user.js <email> <password> <displayName> <role> <chapterId>
 * 
 * Example:
 * node scripts/create-user.js admin@example.com password123 "Admin User" admin gdg-providence
 */

const { initializeApp } = require('firebase/app');
const { 
  getAuth, 
  createUserWithEmailAndPassword,
  updateProfile
} = require('firebase/auth');
const { 
  getFirestore, 
  doc, 
  setDoc 
} = require('firebase/firestore');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../src/ui/.env.local') });

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Get arguments
const args = process.argv.slice(2);
if (args.length < 5) {
  console.error('Usage: node scripts/create-user.js <email> <password> <displayName> <role> <chapterId>');
  process.exit(1);
}

const [email, password, displayName, role, chapterId] = args;

// Validate role
if (!['admin', 'editor', 'viewer'].includes(role)) {
  console.error('Error: Role must be one of: admin, editor, viewer');
  process.exit(1);
}

async function createUser() {
  try {
    console.log('Firebase Config:');
    console.log(JSON.stringify({
      apiKey: firebaseConfig.apiKey?.substring(0, 5) + '...',
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId
    }, null, 2));
    
    if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
      throw new Error('Firebase configuration is incomplete. Check your .env.local file.');
    }
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    console.log(`Creating user with email: ${email}`);
    
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log(`User created with UID: ${user.uid}`);
    
    // Update profile with display name
    await updateProfile(user, {
      displayName: displayName
    });
    
    console.log(`Profile updated with display name: ${displayName}`);
    
    // Create member document in Firestore
    await setDoc(doc(db, 'members', user.uid), {
      email: email,
      displayName: displayName,
      role: role,
      chapterId: chapterId,
      createdAt: new Date().toISOString()
    });
    
    console.log(`Firestore document created for member with role: ${role}`);
    console.log(`User created successfully!`);
    
    // Sign out
    await auth.signOut();
    process.exit(0);
  } catch (error) {
    console.error('Error creating user:', error);
    process.exit(1);
  }
}

createUser();