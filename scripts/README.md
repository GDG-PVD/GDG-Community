# Scripts Directory

This directory contains utility scripts for development and administration of the GDG Community Companion.

## Security Notice

**IMPORTANT**: These scripts require sensitive credentials. Never hardcode credentials in the scripts. Always use environment variables or command-line arguments.

## Available Scripts

### test-login-now.js
Tests Firebase authentication with the production configuration.

**Usage:**
```bash
# Set environment variables first
export TEST_EMAIL="your-test-email@example.com"
export TEST_PASSWORD="your-test-password"

# Run the script
node scripts/test-login-now.js
```

### test-web-auth.js
Tests authentication using the web app Firebase configuration.

**Usage:**
```bash
# Ensure you have a .env.local file in src/ui/ with Firebase config
# Set test credentials
export TEST_EMAIL="your-test-email@example.com"
export TEST_PASSWORD="your-test-password"

# Run the script
node scripts/test-web-auth.js
```

### fix-user-doc.js
Creates or updates a user document in Firestore. Useful for setting up admin users.

**Usage:**
```bash
# Command line arguments: <uid> <email> <displayName> <chapterId> [role]
node scripts/fix-user-doc.js "user123" "user@example.com" "John Doe" "gdg-example" "admin"
```

**Parameters:**
- `uid`: The Firebase Auth user ID
- `email`: User's email address
- `displayName`: User's display name
- `chapterId`: ID of the GDG chapter
- `role` (optional): One of "admin", "editor", or "viewer" (defaults to "viewer")

## Environment Setup

1. Create a `.env` file in the scripts directory (don't commit this!):
```env
# Test credentials
TEST_EMAIL=test@example.com
TEST_PASSWORD=your-secure-password

# Firebase project (if different from default)
FIREBASE_PROJECT_ID=your-project-id
```

2. Add `.env` to your `.gitignore` if not already present

## Security Best Practices

1. **Never commit credentials** - Always use environment variables
2. **Use strong passwords** - Even for test accounts
3. **Rotate credentials regularly** - Change test passwords periodically
4. **Limit access** - Only give admin role to trusted users
5. **Audit usage** - Review who has run these scripts

## Production Use

For production environments:
1. Use Firebase Admin SDK with proper service account credentials
2. Run scripts from a secure, controlled environment
3. Log all administrative actions
4. Use multi-factor authentication for admin accounts