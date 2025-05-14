# Private Implementation Guide

This guide explains how to create a secure private implementation of the GDG Community Companion for your specific chapter.

## Architecture Overview

The GDG Community Companion is designed with a clear separation between:

1. **Public Template**: Core functionality, architecture, and example configurations
2. **Private Implementation**: Chapter-specific content, configurations, and credentials

This separation allows chapters to benefit from shared development while keeping sensitive information secure.

## Setup Process

### 1. Create a Private Repository

First, create a private repository for your chapter's implementation:

```bash
# Create a new private repository on GitHub through the web interface
# Then clone it locally
git clone https://github.com/your-org/your-private-repo.git
cd your-private-repo
```

### 2. Import the Public Template

Pull in the public template code while maintaining separation:

#### Option A: Fork and Make Private (Simpler)

```bash
# On GitHub: Fork the GDG-PVD/GDG-Community repository
# Then change the fork visibility to Private in repository settings
# Clone your private fork locally
git clone https://github.com/your-org/your-private-fork.git
```

#### Option B: Separate Repositories (Advanced)

```bash
# Add the public repo as a remote
git remote add public https://github.com/GDG-PVD/GDG-Community.git
git fetch public

# Create a branch from the public template
git checkout -b template public/main

# Merge into your main branch selectively or create a new branch
git checkout -b implementation
git merge template --allow-unrelated-histories
```

### 3. Configure Secret Management

#### Set Up Google Cloud Secret Manager

1. Create a Google Cloud project (or use an existing one)
2. Enable the Secret Manager API
3. Create secrets for all sensitive credentials:

```bash
# Example using gcloud CLI
gcloud secrets create twitter-api-key --data-file=./twitter-api-key.txt
gcloud secrets create linkedin-client-id --data-file=./linkedin-client-id.txt
gcloud secrets create pinecone-api-key --data-file=./pinecone-api-key.txt
```

4. Grant access only to required service accounts:

```bash
gcloud secrets add-iam-policy-binding twitter-api-key \
    --member=serviceAccount:your-service-account@your-project.iam.gserviceaccount.com \
    --role=roles/secretmanager.secretAccessor
```

#### Set Up Environment Variables

Create a `.env` file (never commit this to Git):

```bash
cp src/.env.example .env
```

Edit the `.env` file with your actual values or references to Secret Manager.

Add `.env` to your `.gitignore` file:

```bash
echo ".env" >> .gitignore
```

### 4. Configure Firebase

1. Create a new Firebase project
2. Initialize Firebase in your repo:

```bash
firebase login
firebase use --add
# Select your Firebase project
```

3. Create a `.firebaserc` file:

```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

### 5. Chapter-Specific Configuration

Create a chapter configuration file:

```bash
mkdir -p config
touch config/chapter.json
```

Edit `config/chapter.json`:

```json
{
  "chapterId": "gdg-yourchapter",
  "name": "GDG Your Chapter",
  "location": "Your City, Country",
  "timezone": "Your/Timezone",
  "socialAccounts": {
    "twitter": "@GDGYourChapter",
    "linkedin": "gdg-your-chapter",
    "facebook": "GDGYourChapter"
  },
  "brand": {
    "primaryColor": "#4285F4",
    "secondaryColor": "#34A853",
    "fontFamily": "Google Sans, sans-serif",
    "voice": {
      "tone": "Friendly, approachable, technically precise",
      "style": "Brief paragraphs, use emojis sparingly, include calls-to-action"
    }
  },
  "templates": {
    "basePath": "./content/templates"
  }
}
```

## Security Best Practices

### API Key Management

1. **Never commit API keys to Git**
2. **Use Secret Manager** for all production credentials
3. **Limit access** to the private repository to trusted organizers only
4. **Implement key rotation** policies (rotate keys quarterly)
5. **Use minimum permissions** for all API integrations

### Firebase Security

1. Configure strict Firebase Security Rules
2. Use Firebase App Check to prevent unauthorized API access
3. Implement proper authentication and authorization

### Environment Isolation

1. Use separate Firebase projects for development and production
2. Create different API keys for testing and production
3. Implement staging environments for content review before publishing

## Keeping Up With the Public Template

To incorporate updates from the public template:

```bash
# If using the remote approach
git fetch public
git checkout implementation
git merge public/main

# Resolve any conflicts and commit
```

## Backup and Continuity

1. **Regular backups**: Export key data monthly
2. **Documentation**: Keep private notes on credentials and setup
3. **Access sharing**: Ensure at least two organizers have admin access
4. **Succession plan**: Document the process for transferring ownership
