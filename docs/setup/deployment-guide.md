# Production Deployment Guide

This guide walks through deploying the GDG Community Companion to production using Firebase.

## Prerequisites

1. **Firebase Project**
   - Create a project in [Firebase Console](https://console.firebase.google.com)
   - Upgrade to Blaze plan (required for Cloud Functions)
   - Note your project ID

2. **Development Environment**
   - Node.js 18+ installed
   - Firebase CLI: `npm install -g firebase-tools`
   - Git repository cloned locally

3. **External Services**
   - Pinecone account with API key
   - LinkedIn Developer App (optional)
   - Domain name (optional)

## Step 1: Firebase Setup

1. **Initialize Firebase**
   ```bash
   firebase login
   firebase init
   ```
   Select:
   - Hosting
   - Functions (JavaScript)
   - Firestore
   - Storage
   - Emulators (optional)

2. **Configure Project**
   ```bash
   firebase use your-project-id
   ```

## Step 2: Environment Configuration

1. **Create Production Environment Files**
   ```bash
   cd src/ui
   cp .env.example .env.production
   ```

2. **Configure Firebase**
   ```env
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

3. **Configure External Services**
   ```env
   PINECONE_API_KEY=your-pinecone-key
   PINECONE_ENVIRONMENT=your-pinecone-env
   PINECONE_INDEX_NAME=gdg-community
   ```

4. **Set Feature Flags**
   ```env
   REACT_APP_MOCK_AUTH_ENABLED=false
   REACT_APP_USE_EMULATORS=false
   ```

## Step 3: Build and Deploy

1. **Build Frontend**
   ```bash
   cd src/ui
   npm install --legacy-peer-deps
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   cd ../..  # Back to project root
   firebase deploy
   ```

   Or deploy services individually:
   ```bash
   firebase deploy --only hosting
   firebase deploy --only functions
   firebase deploy --only firestore:rules
   firebase deploy --only storage:rules
   ```

## Step 4: Post-Deployment Setup

1. **Enable Authentication**
   - Go to Firebase Console > Authentication
   - Enable Email/Password auth
   - Add your domain to authorized domains

2. **Create Admin User**
   ```bash
   node scripts/create-admin-user.js admin@example.com password "Admin Name" your-chapter-id
   ```

3. **Initialize Data**
   ```bash
   node scripts/init-firebase-data.js your-chapter-id
   ```

4. **Verify Deployment**
   - Visit https://your-project.web.app
   - Sign in with admin credentials
   - Check all features are working

## Step 5: Configure Custom Domain (Optional)

1. In Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow verification steps
4. Update DNS records
5. Wait for SSL provisioning

## Troubleshooting

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install --legacy-peer-deps`
- Check Node version: `node --version` (should be 18+)

### Deployment Errors
- Verify Firebase CLI is up to date: `npm update -g firebase-tools`
- Check you're logged in: `firebase login`
- Ensure Blaze plan is active for Functions

### Authentication Issues
- Verify environment variables are set correctly
- Check Firebase Console for auth configuration
- Ensure security rules are deployed

### Function Deployment Failed
- Check function logs in Firebase Console
- Verify Node.js runtime version in firebase.json
- Ensure all dependencies are in package.json

## Security Checklist

- [ ] Production environment files are not committed to git
- [ ] Firebase security rules are properly configured
- [ ] API keys are stored in environment variables
- [ ] Admin users have been created with strong passwords
- [ ] Custom domain uses HTTPS
- [ ] Mock authentication is disabled
- [ ] Sensitive data is not logged

## Monitoring

1. **Firebase Console**
   - Monitor usage and costs
   - Check function invocations
   - Review error logs

2. **Performance**
   - Enable Firebase Performance Monitoring
   - Set up alerting for errors
   - Monitor database usage

3. **Security**
   - Review authentication logs
   - Monitor failed login attempts
   - Check security rules effectiveness

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Review and rotate API keys
- Monitor Firebase usage and costs
- Backup Firestore data
- Review security rules

### Scaling Considerations
- Enable Cloud CDN for global performance
- Implement caching strategies
- Optimize function cold starts
- Consider regional deployments

## Rollback Procedure

If issues occur after deployment:

1. **Immediate Rollback**
   ```bash
   firebase hosting:rollback
   ```

2. **Function Rollback**
   - Use Firebase Console to revert to previous version
   - Or redeploy previous code version

3. **Database Rollback**
   - Restore from Firestore backup
   - Use point-in-time recovery if enabled

Remember to test thoroughly in a staging environment before deploying to production!