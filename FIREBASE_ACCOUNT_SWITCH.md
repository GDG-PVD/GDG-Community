# Switching Firebase Accounts for GDG Community Companion

This guide will help you switch from your current Firebase account to szermer@gmail.com for managing the GDG Community Companion project.

## Step 1: Logout from the Current Account

```bash
firebase logout
```

## Step 2: Login with szermer@gmail.com

Login with the szermer@gmail.com account:

```bash
firebase login
```

This will open a browser window where you should sign in with szermer@gmail.com.

If you're in an environment without browser access, use:

```bash
firebase login --no-localhost
```

This will provide a URL that you can open in any browser to complete the authentication.

## Step 3: Verify the Active Account

Check which account you're currently logged in with:

```bash
firebase login:list
```

This should show szermer@gmail.com as the active account.

## Step 4: List Available Projects

List the Firebase projects available to this account:

```bash
firebase projects:list
```

## Step 5: Update Project Configuration

If the project name is different from what's in .firebaserc, update the file:

```bash
# Open .firebaserc in your editor or run:
echo '{
  "projects": {
    "default": "YOUR-PROJECT-ID"
  },
  "targets": {},
  "etags": {}
}' > .firebaserc
```

Replace "YOUR-PROJECT-ID" with the actual project ID from step 4.

## Step 6: Test the Connection

Verify that the project is correctly connected:

```bash
firebase use
```

This should show that you're using the correct project.

## Step 7: Update Firebase Configuration in .env.local

Make sure the Firebase configuration in src/ui/.env.local matches the project owned by szermer@gmail.com.

To get the configuration:
1. Go to the Firebase Console (console.firebase.google.com)
2. Select your project
3. Click on the web app (⚙️ icon)
4. Copy the configuration from the Firebase SDK snippet

Update src/ui/.env.local with these values:

```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

## Step 8: Deploy Firebase Security Rules

Deploy the Firestore and Storage security rules to your project:

```bash
firebase deploy --only firestore:rules,storage:rules
```

## Step 9: Test the Application

Run the application with the updated Firebase configuration:

```bash
cd src/ui && npm start
```

## Troubleshooting

### Permission Issues

If you encounter permission issues:
1. Ensure szermer@gmail.com has Owner or Editor role in the Firebase project
2. Check that the project billing plan supports the features you're using

### Configuration Mismatch

If the application fails to connect to Firebase:
1. Verify that the configuration in .env.local matches the project
2. Check that Authentication, Firestore, and Storage services are enabled in the Firebase Console

### Multiple Projects

If you need to manage multiple projects:

```bash
# Add an alias for each project
firebase use --add

# Switch between projects
firebase use default
firebase use production
```