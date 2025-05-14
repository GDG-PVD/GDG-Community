# GDG Community Companion - UI

This directory contains the React frontend for the GDG Community Companion.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+

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

### Running the Development Server

Start the React development server:
```bash
npm run start
```

The application will be available at http://localhost:3000

## Authentication

### Development Mode Authentication

For development convenience, the application includes a mock authentication system. When `MOCK_USER_ENABLED` is set to `true` in `src/contexts/AuthContext.tsx`, the app will:

1. Skip Firebase authentication
2. Use a mock user with admin privileges
3. Allow any username/password combination at the login screen

This makes it easy to develop and test the UI without requiring Firebase setup.

### Firebase Authentication (Production)

For production use:

1. Set up a Firebase project with Authentication and Firestore
2. Update the Firebase configuration in `.env` or `src/services/firebase.ts`
3. Set `MOCK_USER_ENABLED` to `false` in `src/contexts/AuthContext.tsx`

## Firebase Emulators

For local development with real Firebase services, you can use Firebase Emulators:

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Start the emulators:
```bash
firebase emulators:start --project demo-gdg
```
3. The app will automatically connect to local emulators when running on localhost

## Building for Production

Create a production build:
```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Testing

Run the test suite:
```bash
npm test
```

Run tests without watch mode:
```bash
npm test -- --watchAll=false
```