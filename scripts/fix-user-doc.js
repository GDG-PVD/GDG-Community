const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Admin SDK (will use default credentials)
initializeApp({
  projectId: 'gdg-community-companion'
});

const db = getFirestore();

async function createUserDocument() {
  const userData = {
    uid: 'F9vT24kMJMaUi6y7DeIqSsapqN02',
    email: 'szermer@gmail.com',
    displayName: 'Stephen',
    role: 'admin',
    chapterId: 'gdg-providence',
    createdAt: new Date().toISOString()
  };

  try {
    // Create in both collections for compatibility
    await db.collection('users').doc(userData.uid).set(userData);
    await db.collection('members').doc(userData.uid).set(userData);
    console.log('✅ User document created successfully!');
    console.log('User is now an admin and can access all features.');
  } catch (error) {
    console.error('Error creating user document:', error);
  }
}

createUserDocument();