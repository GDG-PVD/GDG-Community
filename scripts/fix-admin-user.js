/**
 * Script to fix a user's Firestore profile by ensuring it exists
 * in the 'users' collection. It can copy existing data from 'members'
 * if found, or create a new profile with provided parameters.
 * 
 * Usage: node fix-admin-user.js <email> <password> [displayName] [chapterId]
 */

const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore');

// Initialize Firebase from environment variables or config file
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

async function fixUserProfile(email, password, displayName, chapterId) {
  console.log(`Fixing profile for user: ${email}`);
  
  try {
    // Sign in the user to verify their Firebase Auth credentials
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('Firebase Authentication:');
    console.log('✅ Successfully authenticated with Firebase');
    console.log(`UID: ${user.uid}`);
    console.log(`Email: ${user.email}`);
    console.log('---');
    
    // Check for user profile in the 'users' collection
    const usersDocRef = doc(db, 'users', user.uid);
    const usersDocSnap = await getDoc(usersDocRef);
    
    // Check for user profile in the 'members' collection
    const membersDocRef = doc(db, 'members', user.uid);
    const membersDocSnap = await getDoc(membersDocRef);
    
    // Determine what data to use for the profile
    let userData = {
      email: user.email,
      displayName: displayName || user.displayName || email.split('@')[0],
      role: 'admin', // Default to admin role for this script
      chapterId: chapterId || 'default-chapter',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // If profile exists in 'members', use that data as a base
    if (membersDocSnap.exists()) {
      console.log('Found existing profile in "members" collection, using as base');
      const memberData = membersDocSnap.data();
      userData = {
        ...userData,
        ...memberData,
        updatedAt: new Date().toISOString() // Always update the timestamp
      };
    }
    
    // Create/update document in 'users' collection
    console.log('Updating profile in "users" collection...');
    await setDoc(usersDocRef, userData);
    console.log('✅ User profile created/updated in "users" collection');
    
    // Create/update document in 'members' collection for backward compatibility
    console.log('Updating profile in "members" collection for backward compatibility...');
    await setDoc(membersDocRef, userData);
    console.log('✅ User profile created/updated in "members" collection');
    
    console.log('---');
    console.log('✅ OVERALL: User profile has been fixed and exists in both collections');
    console.log('  → User should now be able to authenticate successfully');
    console.log('  → Profile details:');
    console.log(`     - Display Name: ${userData.displayName}`);
    console.log(`     - Role: ${userData.role}`);
    console.log(`     - Chapter ID: ${userData.chapterId}`);
  } catch (error) {
    console.error('❌ Operation failed:', error.message);
  } finally {
    // Sign out
    await auth.signOut();
  }
}

// Main execution
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: node fix-admin-user.js <email> <password> [displayName] [chapterId]');
  process.exit(1);
}

fixUserProfile(args[0], args[1], args[2], args[3])
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });