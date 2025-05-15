# Create First Admin User

Now that Firebase Authentication is enabled, follow these steps to create your first admin user:

## Option 1: Non-Interactive Script

Use the existing create-admin-user.js script with command-line arguments:

```bash
cd /Users/stephenszermer/Dev/GDG-Community
node scripts/create-admin-user.js <email> <password> "<display name>" <chapter-id>
```

Example:
```bash
node scripts/create-admin-user.js admin@gdg.com mypassword123 "Admin User" gdg-providence
```

## Option 2: Interactive Script

Use the interactive script which prompts for input:

```bash
cd /Users/stephenszermer/Dev/GDG-Community
node scripts/create-admin-user-interactive.js
```

It will prompt you for:
1. Email address
2. Password (min 6 characters)
3. Display name
4. Chapter ID (e.g., gdg-providence)
5. Whether to grant admin privileges (type 'yes')

## Option 3: Quick Test Admin

For quick testing, create a demo admin:

```bash
cd /Users/stephenszermer/Dev/GDG-Community

# Create a test admin user
node scripts/create-admin-user.js test@gdg.com testpass123 "Test Admin" gdg-demo
```

## After Creating Admin User

1. Test the authentication:
   ```bash
   node scripts/test-auth.js
   ```
   - Enter the email and password you just created
   - Verify it shows the user details

2. Initialize Firebase data:
   ```bash
   node scripts/init-firebase-data.js gdg-demo
   ```
   - This creates sample chapters, events, and templates

3. Access the app:
   - Open https://gdg-community-companion.web.app
   - Sign in with your admin credentials
   - You should now have full access to all features

## Troubleshooting

### "User already exists" error
- The email is already registered
- Try a different email or delete the user from Firebase Console

### "Permission denied" errors
- Make sure authentication is enabled in Firebase Console
- Check that security rules are deployed:
  ```bash
  firebase deploy --only firestore:rules
  ```

### Script fails with missing dependencies
- Install required packages:
  ```bash
  cd src/ui
  npm install --legacy-peer-deps
  ```

## Security Best Practices

1. Use strong passwords (min 12 characters recommended)
2. Limit admin users to trusted individuals
3. Regularly review user access in Firebase Console
4. Enable 2FA in Firebase Console for admin accounts