# GDG Community Companion - UI

This directory contains the React frontend for the GDG Community Companion.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+
- Firebase CLI (optional for emulators): `npm install -g firebase-tools`

### Installation

1. Install dependencies:
```bash
npm install
```

If you encounter dependency conflicts, use one of these alternative installation methods:
```bash
# Option 1: Use legacy peer dependencies
npm install --legacy-peer-deps

# Option 2: Force installation
npm install --force
```

2. Configure Firebase:
   - Copy `.env.example` to `.env` if you haven't already
   - For development, the default mock settings work without a real Firebase project
   - For production, update the Firebase configuration in `.env` with your project details

### Running the Development Server

Start the React development server:
```bash
npm run start
```

The application will be available at http://localhost:3000

## Firebase Integration

The app is fully integrated with Firebase services:

### Key Firebase Features Used
- **Authentication**: User login/signup and profile management
- **Firestore**: NoSQL database for storing application data
- **Storage**: File storage for user uploads and media
- **Functions**: Serverless backend functions
- **Analytics**: Usage tracking and analytics (when enabled)

### Development Mode Options

For development convenience, the application has two modes:

1. **Mock Mode** - No real Firebase project needed
   - Set `REACT_APP_MOCK_AUTH_ENABLED=true` in `.env`
   - Mock user with admin privileges will be used
   - Any username/password combination will work
   - Useful for UI development without Firebase setup

2. **Emulator Mode** - Uses local Firebase emulators
   - Set `REACT_APP_USE_EMULATORS=true` in `.env` 
   - Run Firebase emulators: `firebase emulators:start`
   - Provides realistic Firebase behavior locally
   - Good for testing Firebase interactions

### Production Mode
For production use:

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable needed services (Authentication, Firestore, Storage)
3. Update `.env` with your Firebase project configuration
4. Set `REACT_APP_MOCK_AUTH_ENABLED=false` in `.env`
5. Set `REACT_APP_USE_EMULATORS=false` in `.env` (or remove these vars)

## Firebase Services Architecture

- **FirebaseContext**: Central provider for Firebase services
- **AuthContext**: User authentication state management
- **FirestoreService**: Generic data service for Firestore collections
- **StorageService**: File upload and management utilities

## Building for Production

Create a production build:
```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Deployment to Firebase Hosting

Deploy to Firebase Hosting:
```bash
# Build the project
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

## Testing

Run the test suite:
```bash
npm test
```

Run tests without watch mode:
```bash
npm test -- --watchAll=false
```