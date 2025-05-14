# Secret Management Guide

This guide explains how to properly manage secrets and credentials in your private GDG Community Companion implementation.

## Secret Management Strategy

The GDG Community Companion deals with several types of sensitive information:

1. **API Keys**: For social media platforms, Pinecone, etc.
2. **OAuth Credentials**: Client IDs and secrets for authentication
3. **Service Account Keys**: For Google Cloud services
4. **Database Credentials**: For PostgreSQL or other databases

These should never be stored directly in your code repository. Instead, we use a combination of:

1. **Google Cloud Secret Manager**: For production credentials
2. **Environment Variables**: For local development
3. **Firebase Remote Config**: For non-sensitive configuration

## Setting Up Google Cloud Secret Manager

### 1. Enable the Secret Manager API

```bash
gcloud services enable secretmanager.googleapis.com
```

### 2. Create Secrets for Each Credential

```bash
# Create secrets for social media platforms
gcloud secrets create twitter-api-key --replication-policy="automatic"
gcloud secrets create twitter-api-secret --replication-policy="automatic"
gcloud secrets create twitter-access-token --replication-policy="automatic"
gcloud secrets create twitter-access-secret --replication-policy="automatic"

gcloud secrets create linkedin-client-id --replication-policy="automatic"
gcloud secrets create linkedin-client-secret --replication-policy="automatic"

# Create secrets for vector database
gcloud secrets create pinecone-api-key --replication-policy="automatic"
gcloud secrets create pinecone-environment --replication-policy="automatic"

# Create secrets for databases
gcloud secrets create postgres-username --replication-policy="automatic"
gcloud secrets create postgres-password --replication-policy="automatic"
gcloud secrets create postgres-database --replication-policy="automatic"
gcloud secrets create postgres-host --replication-policy="automatic"
```

### 3. Add Secret Values

```bash
# Add values to secrets (interactive)
echo "your-twitter-api-key" | gcloud secrets versions add twitter-api-key --data-file=-

# Or from a file
gcloud secrets versions add twitter-api-secret --data-file=/path/to/secret.txt
```

### 4. Grant Access to Service Accounts

```bash
# Grant access to the Cloud Functions service account
gcloud secrets add-iam-policy-binding twitter-api-key \
    --member=serviceAccount:${PROJECT_ID}@appspot.gserviceaccount.com \
    --role=roles/secretmanager.secretAccessor
```

## Accessing Secrets in Code

### In Cloud Functions

```python
from google.cloud import secretmanager

def access_secret(project_id, secret_id, version_id="latest"):
    """Access the secret value from Secret Manager."""
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{project_id}/secrets/{secret_id}/versions/{version_id}"
    response = client.access_secret_version(name=name)
    return response.payload.data.decode("UTF-8")

def example_function(request):
    """Example Cloud Function that uses secrets."""
    # Get the project ID
    project_id = os.environ.get("GOOGLE_CLOUD_PROJECT")
    
    # Access secrets
    twitter_api_key = access_secret(project_id, "twitter-api-key")
    twitter_api_secret = access_secret(project_id, "twitter-api-secret")
    
    # Use the secrets for API calls
    # ...
```

### In Local Development

For local development, use environment variables loaded from a `.env` file:

```bash
# .env file (NEVER commit this to Git)
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=your-pinecone-environment
```

Load environment variables in your code:

```python
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Access environment variables
twitter_api_key = os.environ.get("TWITTER_API_KEY")
twitter_api_secret = os.environ.get("TWITTER_API_SECRET")
```

## Secret Rotation Policy

Implement a regular schedule for rotating credentials:

1. **API Keys**: Rotate every 90 days
2. **OAuth Credentials**: Rotate every 180 days
3. **Service Account Keys**: Rotate every 365 days

Document your rotation process:

```
# Secret Rotation Checklist

1. Generate new credentials in the respective service
2. Update the secret in Google Cloud Secret Manager
3. Monitor for any issues during the transition period
4. Revoke old credentials after confirming everything works
5. Update the rotation schedule for the next cycle
```

## Secure CI/CD with Secrets

When using CI/CD pipelines (like GitHub Actions), securely integrate with Secret Manager:

1. Create a dedicated service account for CI/CD with limited permissions
2. Store the service account key as a GitHub Secret
3. Use the service account to access secrets during deployment

Example GitHub Action configuration:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - id: 'auth'
        uses: 'google-github-actions/auth@v1'
        with:
          credentials_json: '${{ secrets.GCP_SA_KEY }}'
      
      - name: 'Set up Cloud SDK'
        uses: 'google-github-actions/setup-gcloud@v1'
      
      - name: 'Deploy to Firebase'
        run: |
          gcloud secrets versions access latest --secret=firebase-token | firebase deploy --token="$FIREBASE_TOKEN"
        env:
          FIREBASE_TOKEN: ${{ steps.auth.outputs.access_token }}
```

## Security Audit

Perform regular security audits:

1. Review who has access to secrets
2. Check for any secrets accidentally committed to Git
3. Verify that all secrets are properly rotated
4. Ensure proper IAM permissions for Secret Manager

Tools like `git-secrets` can help prevent accidental commits of sensitive data:

```bash
# Install git-secrets
brew install git-secrets  # macOS
# Or clone from https://github.com/awslabs/git-secrets

# Configure git-secrets for your repo
git secrets --install
git secrets --register-aws

# Add custom patterns for your project
git secrets --add 'API_KEY\s*=\s*.+'
git secrets --add 'SECRET\s*=\s*.+'
```

## Emergency Response Plan

In case of a credential leak:

1. Immediately revoke the exposed credentials
2. Generate new credentials and update secrets
3. Review access logs for unauthorized usage
4. Document the incident and remediation steps
5. Implement additional safeguards as needed
