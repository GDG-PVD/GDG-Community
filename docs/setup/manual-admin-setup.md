# Manual Admin Setup

Since the automatic user creation encountered permission issues, here's how to manually set up your admin user:

## Your User Details

- **UID**: F9vT24kMJMaUi6y7DeIqSsapqN02
- **Email**: szermer@gmail.com
- **Display Name**: Stephen

## Step 1: Create User Document in Firestore

1. Go to https://console.firebase.google.com/project/gdg-community-companion/firestore
2. Navigate to the `users` collection (create it if it doesn't exist)
3. Click "Add document"
4. Set Document ID to: `F9vT24kMJMaUi6y7DeIqSsapqN02`
5. Add these fields:
   - `uid`: `F9vT24kMJMaUi6y7DeIqSsapqN02` (string)
   - `email`: `szermer@gmail.com` (string)
   - `displayName`: `Stephen` (string)
   - `role`: `admin` (string)
   - `chapterId`: `gdg-providence` (string)
   - `createdAt`: Click the timestamp button (timestamp)
   - `updatedAt`: Click the timestamp button (timestamp)
6. Click "Save"

## Step 2: Create Member Document (for compatibility)

1. Navigate to the `members` collection (create it if it doesn't exist)
2. Click "Add document"
3. Set Document ID to: `F9vT24kMJMaUi6y7DeIqSsapqN02`
4. Add the same fields as above
5. Click "Save"

## Step 3: Test Your Access

After creating the documents, test your login:

```bash
cd /Users/stephenszermer/Dev/GDG-Community
node scripts/test-auth.js
```

Enter:
- Email: szermer@gmail.com
- Password: Zaq12wsx

You should see your user details and admin role.

## Step 4: Access the App

1. Go to https://gdg-community-companion.web.app
2. Sign in with your credentials
3. You should now have full admin access

## Alternative: Use Firebase Admin SDK

If you have Firebase Admin SDK credentials:

```bash
cd /Users/stephenszermer/Dev/GDG-Community
GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json node scripts/fix-user-doc.js
```

## Next Steps

Once you have admin access:
1. Initialize Firebase data: `node scripts/init-firebase-data.js gdg-providence`
2. Create additional users as needed
3. Configure your social media integrations