# Environment Setup Guide

This guide walks you through setting up the GDG Community Companion environment configuration for development and production.

## Overview

The application requires environment variables for:
- Firebase (authentication, database, storage)
- Google Cloud Platform (AI services, Cloud Functions)
- Pinecone (vector database for memory)
- Social media APIs (LinkedIn, Bluesky)
- Feature flags and security settings

## Quick Start

1. **Copy environment templates:**
   ```bash
   # Frontend configuration
   cp src/ui/.env.example src/ui/.env.local
   
   # Backend configuration
   cp src/.env.example src/.env
   ```

2. **Configure Firebase:**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication, Firestore, Storage, and Functions
   - Copy configuration values to your environment files

3. **Set up AI services:**
   - Create Pinecone account and index
   - Configure Google Cloud project for ADK
   - Add API keys to environment files

## Frontend Configuration (src/ui/.env.local)

### Firebase Settings
Get these from Firebase Console > Project Settings > Your Apps:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyABC123...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
```

### API Configuration
```env
REACT_APP_API_BASE_URL=https://us-central1-your-project.cloudfunctions.net
REACT_APP_GOOGLE_CLOUD_PROJECT=your-project-id
```

### AI Features
```env
REACT_APP_PINECONE_ENVIRONMENT=us-west1-gcp
REACT_APP_VECTOR_STORE_ENABLED=true
REACT_APP_ADK_PROJECT_ID=your-project-id
REACT_APP_AI_FEATURES_ENABLED=true
```

### Social Media
```env
REACT_APP_LINKEDIN_CLIENT_ID=your-linkedin-client-id
REACT_APP_BLUESKY_ENABLED=true
```

### Chapter Configuration
```env
REACT_APP_DEFAULT_CHAPTER_ID=gdg-your-city
REACT_APP_CHAPTER_NAME=GDG Your City
```

### Development Settings
```env
REACT_APP_MOCK_AUTH_ENABLED=false
REACT_APP_USE_EMULATORS=false
REACT_APP_DEBUG_MODE=false
```

## Backend Configuration (src/.env)

### Google Cloud Setup
```env
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
```

### Firebase Admin SDK
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
```

### Pinecone Vector Database
```env
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=us-west1-gcp
PINECONE_INDEX_NAME=gdg-memory-index
```

### Social Media APIs
```env
# LinkedIn
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_REDIRECT_URI=https://your-domain.com/auth/linkedin/callback

# Bluesky
BLUESKY_IDENTIFIER=your-handle.bsky.social
BLUESKY_PASSWORD=your-app-password
```

## Service Setup Instructions

### 1. Firebase Setup

1. **Create Firebase Project:**
   - Go to https://console.firebase.google.com
   - Click "Create a project"
   - Follow the setup wizard

2. **Enable Services:**
   - Authentication: Enable Google and Email/Password providers
   - Firestore: Create database in production mode
   - Storage: Set up with default settings
   - Functions: Upgrade to Blaze plan for Cloud Functions

3. **Get Configuration:**
   - Project Settings > Your Apps > Add Web App
   - Copy the config object values to your environment file

4. **Service Account (for backend):**
   - Project Settings > Service Accounts
   - Generate new private key
   - Save JSON file securely and reference in GOOGLE_APPLICATION_CREDENTIALS

### 2. Pinecone Setup

1. **Create Account:**
   - Sign up at https://www.pinecone.io
   - Create a new project

2. **Create Index:**
   - Name: `gdg-memory-index`
   - Dimensions: `1536` (for OpenAI embeddings)
   - Metric: `cosine`
   - Pod Type: `p1.x1` (starter)

3. **Get API Key:**
   - API Keys section in Pinecone console
   - Copy API key and environment to your .env file

### 3. Google Cloud ADK Setup

1. **Enable APIs:**
   - Google Cloud Console > APIs & Services
   - Enable: Agent Development Kit API, Vertex AI API

2. **Service Account:**
   - IAM & Admin > Service Accounts
   - Create service account with ADK permissions
   - Download JSON key file

3. **Configuration:**
   - Set ADK_PROJECT_ID to your Google Cloud project
   - Set ADK_LOCATION to your preferred region (us-central1)

### 4. LinkedIn API Setup

1. **Create LinkedIn App:**
   - Go to https://www.linkedin.com/developers/
   - Create a new app for your organization

2. **Configure OAuth:**
   - Add redirect URI: `https://your-domain.com/auth/linkedin/callback`
   - Request permissions: `r_liteprofile`, `w_member_social`

3. **Get Credentials:**
   - Copy Client ID and Client Secret to environment files

### 5. Bluesky Setup

1. **Create Account:**
   - Sign up at https://bsky.app
   - Choose your handle

2. **Generate App Password:**
   - Settings > Privacy and Security > App Passwords
   - Create new app password for API access

3. **Configuration:**
   - Use your handle as BLUESKY_IDENTIFIER
   - Use app password as BLUESKY_PASSWORD

## Security Best Practices

### Environment Files
- Never commit `.env` files to version control
- Use different configurations for development/production
- Regularly rotate API keys and secrets

### Firebase Security
- Configure Firestore security rules
- Set up proper authentication flows
- Use Firebase Storage rules for file access

### API Key Management
- Use Google Secret Manager for production
- Apply domain restrictions to Firebase API keys
- Monitor API usage and set quotas

## Feature Flags

Control which features are enabled:

```env
# AI Features
REACT_APP_ENABLE_CONTENT_GENERATION=true
REACT_APP_ENABLE_MEMORY_DASHBOARD=true
REACT_APP_ENABLE_KNOWLEDGE_BASE=true

# Social Media
REACT_APP_ENABLE_SOCIAL_POSTING=true

# Development
REACT_APP_DEBUG_MODE=false
REACT_APP_MOCK_AUTH_ENABLED=false
```

## Testing Configuration

For development and testing:

```env
# Use Firebase emulators
REACT_APP_USE_EMULATORS=true

# Enable mock authentication
REACT_APP_MOCK_AUTH_ENABLED=true

# Enable debug features
REACT_APP_DEBUG_MODE=true
```

## Deployment Checklist

Before deploying to production:

- [ ] All API keys configured and valid
- [ ] Firebase security rules deployed
- [ ] Domain restrictions applied to API keys
- [ ] Feature flags set appropriately
- [ ] Mock auth disabled
- [ ] Debug mode disabled
- [ ] CORS origins configured correctly
- [ ] Rate limiting configured

## Troubleshooting

### Common Issues

1. **Firebase API Key Issues:**
   - Check domain restrictions in Firebase Console
   - Verify API key has correct permissions

2. **Pinecone Connection Errors:**
   - Verify API key and environment
   - Check index name and dimensions

3. **Social Media API Errors:**
   - Verify OAuth redirect URIs
   - Check API permissions and scopes

4. **CORS Issues:**
   - Add your domain to CORS_ORIGINS
   - Check Firebase Functions CORS configuration

### Debug Steps

1. Check browser console for client-side errors
2. Review Firebase Functions logs
3. Verify environment variables are loaded
4. Test API connections individually

## Support

For additional help:
- Check the troubleshooting docs
- Review Firebase documentation
- Contact the development team