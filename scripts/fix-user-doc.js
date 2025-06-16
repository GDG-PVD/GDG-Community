#!/usr/bin/env node

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length < 4) {
  console.error('Usage: node fix-user-doc.js <uid> <email> <displayName> <chapterId> [role]');
  console.error('Example: node fix-user-doc.js "user123" "user@example.com" "John Doe" "gdg-example" "admin"');
  process.exit(1);
}

const [uid, email, displayName, chapterId, role = 'viewer'] = args;

// Validate role
const validRoles = ['admin', 'editor', 'viewer'];
if (!validRoles.includes(role)) {
  console.error(`Invalid role: ${role}. Must be one of: ${validRoles.join(', ')}`);
  process.exit(1);
}

// Initialize Admin SDK (will use default credentials)
initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID || 'XXX'
});

const db = getFirestore();

async function createUserDocument() {
  const userData = {
    uid,
    email,
    displayName,
    role,
    chapterId,
    createdAt: new Date().toISOString()
  };

  console.log('Creating user document with:');
  console.log(JSON.stringify(userData, null, 2));

  try {
    // Create in both collections for compatibility
    await db.collection('users').doc(userData.uid).set(userData);
    await db.collection('members').doc(userData.uid).set(userData);
    console.log('✅ User document created successfully!');
    console.log(`User is now a ${role} and can access appropriate features.`);
  } catch (error) {
    console.error('Error creating user document:', error);
    process.exit(1);
  }
}

createUserDocument();