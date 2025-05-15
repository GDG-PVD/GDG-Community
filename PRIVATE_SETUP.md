# Setting Up Your Private GDG Community Companion

This guide walks you through setting up your private instance of the GDG Community Companion with real Firebase credentials.

## Prerequisites

1. A Firebase project (create one at https://console.firebase.google.com/)
2. Firebase Authentication enabled with Email/Password provider
3. Firestore database created
4. Firebase Storage initialized

## Setup Steps

### 1. Configure Firebase credentials

Create or update the `.env.local` file in the `src/ui` directory with your Firebase project credentials:

```bash
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=AIzaSyBnZXlz0ffaDpjQP56NkeQ2okhV3KVqsMk
REACT_APP_FIREBASE_AUTH_DOMAIN=gdg-community-companion.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=gdg-community-companion
REACT_APP_FIREBASE_STORAGE_BUCKET=gdg-community-companion.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=512932129357
REACT_APP_FIREBASE_APP_ID=1:512932129357:web:d390c9196e480a489d0a04

# API Configuration
REACT_APP_API_BASE_URL=https://api.gdgcompanion.dev

# Feature Flags
REACT_APP_MOCK_AUTH_ENABLED=false
REACT_APP_USE_EMULATORS=false
```

### 2. Install Dependencies

Make sure all dependencies are installed:

```bash
# Install root dependencies
npm install

# Install UI dependencies
cd src/ui && npm install
```

### 3. Create an Admin User

Run the following command to create an admin user:

```bash
node scripts/create-user.js admin@example.com YourPassword "Admin User" admin gdg-providence
```

Replace:
- `admin@example.com` with your desired email
- `YourPassword` with a password (min 6 characters)
- `"Admin User"` with your display name
- `admin` with the role (must be one of: admin, editor, viewer)
- `gdg-providence` with your chapter ID (will be formatted as gdg-xxx if needed)

### 4. Initialize Firestore with Sample Data

Run the following command to initialize Firestore with sample data:

```bash
node scripts/init-firebase-data.js gdg-providence
```

Replace `gdg-providence` with your chapter ID.

### 5. Start the Application

```bash
cd src/ui && npm start
```

The application will be available at http://localhost:3000

### 6. Login to the Application

Login with the email and password you created in step 3.

## Troubleshooting

### Authentication Issues

If you encounter authentication issues:

1. Verify that Email/Password authentication is enabled in your Firebase project
2. Check that your Firebase configuration in `.env.local` is correct
3. Verify that your password meets Firebase requirements (min 6 characters)

### Firestore Issues

If you encounter Firestore issues:

1. Verify that Firestore is enabled in your Firebase project
2. Check that your Firebase Security Rules allow read/write access
3. Enable the Firestore API in the Google Cloud Console

### Additional Users

To create additional users with different roles:

```bash
# Create an editor user
node scripts/create-user.js editor@example.com password "Editor User" editor gdg-providence

# Create a viewer user
node scripts/create-user.js viewer@example.com password "Viewer User" viewer gdg-providence
```

## Security Note

- The `.env.local` file contains sensitive information and should never be committed to your public repository
- Keep your Firebase credentials secure
- Use proper Firebase Security Rules for production environments