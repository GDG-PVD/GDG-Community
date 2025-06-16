# GDG Community Companion Private Fork

This document outlines the workflow for developing with the private fork of GDG Community Companion.

## Setup Instructions

1. Create a private GitHub repository
2. Add it as a new remote to your local repository:
   ```bash
   git remote add private git@github.com:yourusername/private-gdg-community.git
   ```
3. Push the code to your private repository:
   ```bash
   git push -u private main
   ```

## Credential Management

### Firebase Configuration

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
2. Enable required services (Authentication, Firestore, Storage, Functions)
3. Create a `.env.local` file in the `src/ui` directory with your Firebase credentials:

```
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Feature Flags
REACT_APP_MOCK_AUTH_ENABLED=false
REACT_APP_USE_EMULATORS=false
```

4. Add `.env.local` to your `.gitignore` file

### API Keys for Social Media

1. Store all API keys and secrets in `.env.local` files
2. For service accounts, store JSON files in a location listed in `.gitignore-private`
3. Consider using Firebase Secret Manager for production secrets

## Development Workflow

1. Develop and test features in your private fork with real credentials
2. When ready to contribute back to the public repo:
   - Ensure all credential files are excluded (check `.gitignore`)
   - Create a PR to the public repository
   - Verify no secrets are included in the PR

## Porting Changes Back to Public Repository

When contributing changes back to the public repository:

1. Create a new branch based on the public repo's main branch:
   ```bash
   git fetch origin
   git checkout -b feature-branch origin/main
   ```

2. Cherry-pick or manually apply your changes, ensuring no credentials are included:
   ```bash
   git cherry-pick <commit-hash> 
   ```

3. Test that the code works correctly with mock services
4. Push to the public repository and create a PR:
   ```bash
   git push -u origin feature-branch
   ```

5. In the PR description, clearly document any new environment variables that need to be configured (without values)

## Security Checklist

Before pushing to public:
- [ ] Remove all API keys and credentials
- [ ] Ensure `.env.local` is not committed
- [ ] Check that Firebase config has dummy values
- [ ] Verify service account files are not included
- [ ] Confirm no hardcoded secrets in the code