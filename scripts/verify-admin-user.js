/**
 * Script to verify a user's existence in both Firebase Auth and Firestore
 * and check which collections ('users' or 'members') contain their profile.
 * 
 * This helps diagnose authentication issues related to collection structure.
 * 
 * Usage: node verify-admin-user.js <email>
 */

const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

// Initialize Firebase from environment variables or config file
// This uses the same config as the main application
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function verifyUser(email, password) {
  console.log(`Verifying user: ${email}`);
  
  try {
    // Sign in the user to verify their Firebase Auth credentials
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('Firebase Authentication:');
    console.log('✅ Successfully authenticated with Firebase');
    console.log(`UID: ${user.uid}`);
    console.log(`Email: ${user.email}`);
    console.log(`Display Name: ${user.displayName || 'Not set'}`);
    console.log(`Email Verified: ${user.emailVerified}`);
    console.log('---');
    
    // Check for user profile in the 'users' collection
    const usersDocRef = doc(db, 'users', user.uid);
    const usersDocSnap = await getDoc(usersDocRef);
    
    console.log('Firestore Collections:');
    if (usersDocSnap.exists()) {
      console.log('✅ User profile found in "users" collection');
      console.log(`Role: ${usersDocSnap.data().role || 'Not set'}`);
      console.log(`Chapter ID: ${usersDocSnap.data().chapterId || 'Not set'}`);
    } else {
      console.log('❌ User profile NOT found in "users" collection');
    }
    
    // Check for user profile in the 'members' collection
    const membersDocRef = doc(db, 'members', user.uid);
    const membersDocSnap = await getDoc(membersDocRef);
    
    if (membersDocSnap.exists()) {
      console.log('✅ User profile found in "members" collection');
      console.log(`Role: ${membersDocSnap.data().role || 'Not set'}`);
      console.log(`Chapter ID: ${membersDocSnap.data().chapterId || 'Not set'}`);
    } else {
      console.log('❌ User profile NOT found in "members" collection');
    }
    
    // Overall status
    if (usersDocSnap.exists() || membersDocSnap.exists()) {
      console.log('---');
      console.log('✅ OVERALL: User should be able to authenticate with the updated AuthContext.tsx');
    } else {
      console.log('---');
      console.log('❌ OVERALL: User exists in Firebase Auth but has no profile in Firestore');
      console.log('  → Authentication will fail with "User profile not found" error');
      console.log('  → Create a profile document for this user in either "users" or "members" collection');
    }
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
  } finally {
    // Sign out
    await auth.signOut();
  }
}

// Main execution
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: node verify-admin-user.js <email> <password>');
  process.exit(1);
}

verifyUser(args[0], args[1])
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });