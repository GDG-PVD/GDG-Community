# Firebase CLI Setup for GDG Community Companion

This guide will help you properly set up the Firebase CLI for use with your private GDG Community Companion fork.

## Prerequisites

- [Node.js](https://nodejs.org/) installed (version 14 or later)
- [Firebase CLI](https://firebase.google.com/docs/cli) installed
- A Firebase project created in the [Firebase Console](https://console.firebase.google.com/)

## Step 1: Install the Firebase CLI

If you haven't already installed the Firebase CLI, do so with npm:

```bash
npm install -g firebase-tools
```

## Step 2: Log in to Firebase

Authenticate the Firebase CLI with your Google account:

```bash
firebase login
```

This will open a browser window where you can sign in with the Google account that has access to your Firebase project.

## Step 3: Check Authentication Status

Verify that you're logged in with the correct account:

```bash
firebase login:list
```

This should show the email address associated with your Google account.

## Step 4: Link Your Project

Initialize Firebase in your project directory:

```bash
firebase init
```

During the initialization process:
1. Select the Firebase features you want to use (Firestore, Hosting, Storage, Emulators)
2. Select your Firebase project from the list or create a new one
3. Accept the default file locations or customize as needed
4. Set up the Firebase emulators you want to use

## Step 5: Verify Project Configuration

Check if your project is correctly linked:

```bash
firebase projects:list
```

Your Firebase project should appear in the list.

## Using Firebase Emulators

For local development, you can use Firebase emulators:

```bash
firebase emulators:start
```

This will start the following emulators:
- Authentication: http://localhost:9099
- Firestore: http://localhost:8080
- Functions: http://localhost:5001
- Storage: http://localhost:9199
- Hosting: http://localhost:5050
- Emulator UI: http://localhost:4040

## Deploying Your Application

When ready to deploy:

1. Build your application:
   ```bash
   cd src/ui && npm run build
   ```

2. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

To deploy only specific features:
```bash
firebase deploy --only hosting
firebase deploy --only firestore
firebase deploy --only storage
firebase deploy --only functions
```

## Managing Multiple Firebase Projects

If you need to work with multiple Firebase projects:

```bash
# Add an alias for each project
firebase use --add

# Switch between projects
firebase use default
firebase use production
```

## Security Rules

Edit your security rules:
- Firestore: `firestore.rules`
- Storage: `storage.rules`

After editing, deploy the rules:
```bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

## Troubleshooting

If you encounter authentication issues:
```bash
firebase logout
firebase login
```

For permission errors when deploying:
1. Check that your Google account has the necessary permissions in the Firebase project
2. Ensure you're logged in with the correct account
3. Verify that the Blaze (pay-as-you-go) plan is activated if using certain features