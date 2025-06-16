#!/bin/bash

# Quick test script for Firebase Authentication

echo "=== Quick Firebase Auth Test ==="
echo

# Create a test admin user
echo "Creating test admin user..."
cd /Users/stephenszermer/Dev/GDG-Community

# You can customize these values
EMAIL="test@gdg.com"
PASSWORD="testpass123"
DISPLAY_NAME="Test Admin"
CHAPTER="gdg-demo"

echo "Using email: $EMAIL"
echo "Using password: $PASSWORD"
echo "Display name: $DISPLAY_NAME"
echo "Chapter: $CHAPTER"
echo

# Create the user
node scripts/create-admin-user.js "$EMAIL" "$PASSWORD" "$DISPLAY_NAME" "$CHAPTER"

echo
echo "User creation completed. Now testing sign-in..."
echo

# Create a test auth script
cat > scripts/test-sign-in.js << 'EOF'
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../src/ui/.env.production') });

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const [email, password] = process.argv.slice(2);

signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    console.log('✅ Sign-in successful!');
    console.log('User ID:', userCredential.user.uid);
    console.log('Email:', userCredential.user.email);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Sign-in failed:', error.message);
    process.exit(1);
  });
EOF

# Test sign in
node scripts/test-sign-in.js "$EMAIL" "$PASSWORD"

# Clean up test script
rm scripts/test-sign-in.js

echo
echo "Test completed!"
echo
echo "You can now:"
echo "1. Access the app at https://gdg-community-companion.web.app"
echo "2. Sign in with email: $EMAIL and password: $PASSWORD"
echo "3. Create more users as needed"