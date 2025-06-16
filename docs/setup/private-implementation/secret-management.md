# Secret Management for Private Implementation

This guide provides best practices for managing secrets and API credentials in your private fork of the GDG Community Companion.

## Firebase Credentials Management

When implementing a private version of this application with real Firebase credentials:

1. **Create environment files**:
   
   Create a `.env.local` file in the `src/ui` directory with your Firebase project credentials:

   ```bash
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

2. **Update .gitignore**:
   
   Ensure the following entries are in your `.gitignore`:

   ```
   # Environment files with real credentials
   src/ui/.env.local
   src/ui/.env.development.local
   src/ui/.env.production.local
   ```

## Social Media API Credentials

For LinkedIn and Bluesky integration:

1. **OAuth Settings**:
   
   Store OAuth credentials in environment files:

   ```bash
   # LinkedIn API
   REACT_APP_LINKEDIN_CLIENT_ID=your-linkedin-client-id
   REACT_APP_LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

   # Bluesky API
   REACT_APP_BLUESKY_APP_PASSWORD=your-bluesky-app-password
   ```

2. **Service Accounts**:
   
   For Firebase service account credentials:
   
   - Store the JSON file in a secure location outside of the repository
   - Reference it using environment variables:
   
   ```bash
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account.json
   ```

## Firebase Secret Manager (Recommended for Production)

For production environments, use Firebase Secret Manager:

1. **Install the Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Secret Manager**:
   ```bash
   firebase init functions
   ```

3. **Add secrets**:
   ```bash
   firebase functions:secrets:set SECRET_NAME
   ```

4. **Access secrets in code**:
   ```javascript
   const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
   const client = new SecretManagerServiceClient();
   
   async function accessSecret() {
     const [version] = await client.accessSecretVersion({
       name: 'projects/your-project/secrets/SECRET_NAME/versions/latest',
     });
     return version.payload.data.toString();
   }
   ```

## CI/CD Considerations

When setting up CI/CD for a private implementation:

1. **GitHub Actions Secrets**:
   - Store credentials as GitHub repository secrets
   - Reference them in workflows using `${{ secrets.SECRET_NAME }}`

2. **Firebase Deployment**:
   - Use service account authentication with CI/CD
   - Store the service account JSON as a secret

## Contributing Back to the Public Repository

When contributing changes back to the public repository, ensure:

1. No credentials are included in commits
2. Templates for credential files are provided (with dummy values)
3. Documentation is updated to reflect any new required credentials
4. CI/CD configurations use environment variables with clear documentation

By following these guidelines, you can maintain a secure private implementation while still contributing to the public project.
EOF < /dev/null