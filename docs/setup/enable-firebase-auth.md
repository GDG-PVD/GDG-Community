# Enable Firebase Authentication

This guide walks you through enabling Firebase Authentication for the GDG Community Companion.

## Step 1: Enable Authentication in Firebase Console

1. Go to https://console.firebase.google.com/project/gdg-community-companion/authentication
2. Click "Get Started" if this is your first time
3. Navigate to the "Sign-in method" tab
4. Enable "Email/Password" authentication:
   - Click on "Email/Password"
   - Toggle "Enable" to on
   - Keep "Email link (passwordless sign-in)" disabled for now
   - Click "Save"

## Step 2: Configure Authentication Settings

1. In the Authentication section, go to "Settings" tab
2. Under "Authorized domains", ensure your domains are listed:
   - `gdg-community-companion.web.app`
   - `gdg-community-companion.firebaseapp.com`
   - `localhost` (already included by default)

## Step 3: Create Admin User

Once authentication is enabled, run the admin user creation script:

```bash
cd /Users/stephenszermer/Dev/GDG-Community
node scripts/create-admin-user.js
```

This will prompt you for:
- Email address
- Password
- Confirm if you want admin privileges

## Step 4: Initialize Firebase Data

After creating your admin user, initialize the required collections:

```bash
node scripts/init-firebase-data.js
```

This creates the necessary Firestore collections and initial data.

## Step 5: Test Authentication

1. Access your app at https://gdg-community-companion.web.app
2. Click "Sign In" 
3. Enter your admin credentials
4. Verify you can access all features

## Step 6: Additional Users

To add more users:
1. Use Firebase Console (Authentication > Users > Add User)
2. Or use the create-admin-user.js script
3. For non-admin users, create them in the console and don't run the admin script

## Security Notes

- Passwords must be at least 6 characters
- Users need to be manually granted roles in Firestore
- Admin users have full access to all features
- Regular users have read access and limited write access

## Troubleshooting

### User can't sign in
- Check if authentication is enabled in Firebase Console
- Verify the user exists in Authentication > Users
- Check browser console for errors

### Permission denied errors
- Verify user has appropriate role in Firestore
- Check Firestore rules are deployed correctly
- Ensure user is properly authenticated

### Admin privileges not working
- Check the `users` collection in Firestore
- Verify the user document has `role: 'admin'`
- Run the admin creation script again if needed