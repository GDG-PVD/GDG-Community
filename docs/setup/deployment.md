# Deployment Guide

This guide explains how to deploy the GDG Community Companion to your own environment.

## Deployment Options

The GDG Community Companion supports several deployment options:

1. **Google Cloud**: Recommended production deployment
2. **Firebase Hosting + Cloud Functions**: Simpler deployment for smaller chapters
3. **Local Development**: For testing and development

## Prerequisites

Before deploying, ensure you have:

- Google Cloud account with billing enabled
- Firebase project (can be linked to your Google Cloud project)
- Python 3.11+ and Node.js 18+ installed (for local development)
- Google Cloud SDK installed and configured
- Firebase CLI installed (`npm install -g firebase-tools`)

## Google Cloud Deployment

### Step 1: Set Up Google Cloud Project

```bash
# Create new project (if needed)
gcloud projects create gdg-community-YOUR_CHAPTER_ID --name="GDG Community Companion"

# Set current project
gcloud config set project gdg-community-YOUR_CHAPTER_ID

# Enable required APIs
gcloud services enable \
  secretmanager.googleapis.com \
  cloudfunctions.googleapis.com \
  cloudscheduler.googleapis.com \
  aiplatform.googleapis.com \
  artifactregistry.googleapis.com \
  firestore.googleapis.com \
  cloudbuild.googleapis.com
```

### Step 2: Set Up Environment Variables and Secrets

```bash
# Create secrets for API keys and credentials
echo -n "YOUR_LINKEDIN_CLIENT_ID" | \
  gcloud secrets create linkedin-client-id --data-file=-

echo -n "YOUR_LINKEDIN_CLIENT_SECRET" | \
  gcloud secrets create linkedin-client-secret --data-file=-

echo -n "YOUR_BLUESKY_APP_PASSWORD" | \
  gcloud secrets create bluesky-app-password --data-file=-

echo -n "YOUR_PINECONE_API_KEY" | \
  gcloud secrets create pinecone-api-key --data-file=-
```

### Step 3: Configure Pinecone Vector Database

1. Create a Pinecone account at [https://www.pinecone.io/](https://www.pinecone.io/)
2. Create a new Pinecone project
3. Create three indexes for the knowledge layers:
   - `gdg-semantic-YOUR_CHAPTER_ID`
   - `gdg-kinetic-YOUR_CHAPTER_ID`
   - `gdg-dynamic-YOUR_CHAPTER_ID`
4. Configure each index with 1536 dimensions (for compatibility with Google's embedding models)

### Step 4: Deploy Cloud Functions

```bash
# Deploy all Cloud Functions
cd src/functions
gcloud functions deploy content-service \
  --runtime python311 \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point=handle_request \
  --memory=1024MB \
  --source=./content/

gcloud functions deploy knowledge-service \
  --runtime python311 \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point=handle_request \
  --memory=1024MB \
  --source=./knowledge/
```

### Step 5: Deploy Frontend UI

```bash
# Build the UI
cd src/ui
npm install
npm run build

# Deploy to Firebase Hosting
firebase use gdg-community-YOUR_CHAPTER_ID
firebase deploy --only hosting
```

### Step 6: Set Up Scheduled Jobs

```bash
# Create a Cloud Scheduler job for content generation
gcloud scheduler jobs create http content-generation-daily \
  --schedule="0 9 * * *" \
  --uri="https://REGION-gdg-community-YOUR_CHAPTER_ID.cloudfunctions.net/content-service" \
  --http-method=POST \
  --message-body='{"action": "generate_scheduled_content"}'
```

## Firebase Deployment (Simplified)

For smaller chapters, a Firebase-only deployment can be simpler:

### Step 1: Set Up Firebase Project

```bash
# Log in to Firebase
firebase login

# Initialize Firebase in your project
firebase init
# Select: Functions, Firestore, Hosting, Storage, Emulators
```

### Step 2: Configure Firebase Environment

```bash
# Set environment variables
firebase functions:config:set \
  linkedin.client_id="YOUR_LINKEDIN_CLIENT_ID" \
  linkedin.client_secret="YOUR_LINKEDIN_CLIENT_SECRET" \
  bluesky.app_password="YOUR_BLUESKY_APP_PASSWORD" \
  pinecone.api_key="YOUR_PINECONE_API_KEY"
```

### Step 3: Deploy to Firebase

```bash
# Build the UI
cd src/ui
npm install
npm run build

# Deploy everything to Firebase
firebase deploy
```

## Local Development Setup

For local development and testing:

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/GDG-Community.git
cd GDG-Community

# Install Python dependencies
uv env venv
uv pip install -r requirements.txt

# Install UI dependencies
cd src/ui
npm install

# Set up environment variables
export GOOGLE_CLOUD_PROJECT="gdg-community-YOUR_CHAPTER_ID"
export PINECONE_API_KEY="YOUR_PINECONE_API_KEY"

# Run Firebase emulators
firebase emulators:start

# In a separate terminal, run the UI development server
cd src/ui
npm run start
```

## Configuration Settings

Key configuration files:

- `src/knowledge/vector_store.py`: Configure Pinecone connection settings
- `src/agents/content_agent.py`: Adjust content generation parameters
- `src/integrations/oauth_service.py`: Configure social media platform settings

## Verifying Your Deployment

After deployment:

1. Visit your Firebase Hosting URL (typically `https://gdg-community-YOUR_CHAPTER_ID.firebaseapp.com`)
2. Log in with a Google account
3. Navigate to the Settings page to verify all services are connected
4. Try creating a test post to verify social media integrations

## Deployment Monitoring

Monitor your deployment with:

```bash
# View Cloud Function logs
gcloud functions logs read content-service

# View Firebase logs
firebase functions:log
```

## Troubleshooting

- **Authentication Issues**: Check Secret Manager and environment variables
- **Missing Dependencies**: Verify `requirements.txt` and `package.json` installations
- **Permission Errors**: Check IAM permissions and service account settings
- **API Limits**: Monitor quota usage in Google Cloud Console

For more detailed deployment options, see the [Advanced Deployment Guide](./advanced-deployment.md).