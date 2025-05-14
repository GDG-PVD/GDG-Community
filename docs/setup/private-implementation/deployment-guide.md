# Deployment Guide for Private Implementation

This guide covers how to deploy your private GDG Community Companion implementation to Google Cloud Platform.

## Prerequisites

Before deployment, ensure you have:

1. Set up your private repository
2. Configured all necessary secrets
3. Created your Firebase project
4. Set up your chapter-specific content templates
5. Configured Firebase security rules

## Deployment Architecture

The deployment architecture consists of:

1. **Frontend**: React application deployed to Firebase Hosting
2. **Backend Services**: Cloud Functions for Firebase
3. **Knowledge Storage**: Pinecone for vector data, Firestore for structured data
4. **Media Storage**: Firebase Storage
5. **Authentication**: Firebase Authentication
6. **Monitoring**: Cloud Monitoring and Logging

## Environment Setup

### 1. Create a Firebase Project

If you haven't already, create a new Firebase project:

```bash
# Login to Firebase
firebase login

# Initialize Firebase in your repo
firebase init

# Select the following features:
# - Firestore
# - Functions
# - Hosting
# - Storage
# - Emulators
```

### 2. Create a `.firebaserc` File

```json
{
  "projects": {
    "default": "your-gdg-chapter-companion",
    "production": "your-gdg-chapter-companion",
    "development": "your-gdg-chapter-companion-dev"
  }
}
```

### 3. Configure Firebase

Create or update `firebase.json`:

```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "functions": {
    "predeploy": [
      "npm --prefix \"$RESOURCE_DIR\" run lint"
    ],
    "source": "src/functions"
  },
  "hosting": {
    "public": "build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "storage": {
    "rules": "storage.rules"
  },
  "emulators": {
    "auth": {
      "port": 9099
    },
    "functions": {
      "port": 5001
    },
    "firestore": {
      "port": 8080
    },
    "hosting": {
      "port": 5000
    },
    "storage": {
      "port": 9199
    },
    "ui": {
      "enabled": true
    }
  }
}
```

## Deployment Process

### 1. Build the Frontend

```bash
# Navigate to the UI directory
cd src/ui

# Install dependencies
npm install

# Build the production version
npm run build
```

### 2. Deploy Firebase Functions

```bash
# Navigate to the functions directory
cd src/functions

# Install dependencies
npm install

# Deploy to Firebase
firebase deploy --only functions
```

### 3. Deploy Firestore Rules and Indexes

```bash
# Deploy Firestore rules and indexes
firebase deploy --only firestore
```

### 4. Deploy Storage Rules

```bash
# Deploy Storage rules
firebase deploy --only storage
```

### 5. Deploy Hosting

```bash
# Deploy the frontend to Firebase Hosting
firebase deploy --only hosting
```

### 6. Complete Deployment

```bash
# Deploy everything at once (for subsequent deployments)
firebase deploy
```

## CI/CD Integration

For automated deployments, set up a GitHub Actions workflow:

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      # Build and test the UI
      - name: Install UI dependencies
        run: cd src/ui && npm ci
        
      - name: Build UI
        run: cd src/ui && npm run build
      
      # Install Functions dependencies
      - name: Install Functions dependencies
        run: cd src/functions && npm ci
      
      # Authenticate to Google Cloud
      - id: 'auth'
        uses: 'google-github-actions/auth@v1'
        with:
          credentials_json: '${{ secrets.GCP_SA_KEY }}'
      
      # Deploy to Firebase
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-gdg-chapter-companion
```

## Monitoring and Maintenance

### 1. Set Up Error Logging

Configure Firebase Crashlytics and Google Cloud Error Reporting:

```javascript
// In your frontend code
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const firebaseConfig = {
  // Your Firebase config
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Set up App Check for security
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('your-recaptcha-site-key'),
  isTokenAutoRefreshEnabled: true
});
```

### 2. Set Up Performance Monitoring

```javascript
// In your frontend code
import { getPerformance } from 'firebase/performance';

const perf = getPerformance();
```

### 3. Configure Alerting

Set up Cloud Monitoring alerts for:

1. Function errors
2. High latency
3. Unusual traffic patterns
4. API quota usage
5. Storage limits

### 4. Regular Maintenance Tasks

Implement a schedule for regular maintenance:

1. **Weekly**: Review error logs and fix issues
2. **Monthly**: Update dependencies and security patches
3. **Quarterly**: Rotate API keys and secrets
4. **Semi-Annual**: Review and optimize database queries
5. **Annual**: Comprehensive security review

## Disaster Recovery

### 1. Database Backups

Set up automated Firestore backups:

```bash
# Create a backup schedule
gcloud firestore export gs://your-backup-bucket/backups/$(date +%Y-%m-%d)

# Schedule with Cloud Scheduler
gcloud scheduler jobs create http firestore-backup \
  --schedule="0 0 * * *" \
  --uri="https://firestore.googleapis.com/v1/projects/your-project-id/databases/(default):exportDocuments" \
  --message-body='{"outputUriPrefix":"gs://your-backup-bucket/backups/$(date +%Y-%m-%d)"}' \
  --oauth-service-account-email=your-service-account@your-project.iam.gserviceaccount.com
```

### 2. Recovery Plan

Document your recovery process:

1. Identify the issue and its scope
2. Restore from the most recent backup if necessary
3. Verify data integrity after restoration
4. Test functionality before re-enabling public access
5. Document the incident and update procedures if needed

## Multi-Environment Setup

Maintain separate environments for development and production:

```bash
# Create a development environment
firebase use development

# Deploy to development
firebase deploy

# Switch to production
firebase use production

# Deploy to production
firebase deploy
```

## Handover Documentation

Create detailed handover documentation for future organizers:

1. System overview and architecture
2. Access credentials and management procedures
3. Regular maintenance tasks and schedules
4. Troubleshooting guides for common issues
5. Contact information for support
6. Historical record of major changes and decisions
