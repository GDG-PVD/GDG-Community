#!/bin/bash

# Script to set up a private production repository
# Usage: ./setup-private-repo.sh [your-github-username] [private-repo-name]

GITHUB_USER=${1:-"your-github-username"}
PRIVATE_REPO=${2:-"XXX-private"}
PUBLIC_TEMPLATE="https://github.com/your-org/XXX"

echo "=== Setting up private production repository ==="
echo "GitHub User: $GITHUB_USER"
echo "Private Repo: $PRIVATE_REPO"
echo

# Step 1: Clone the public template
echo "Step 1: Cloning public template..."
git clone $PUBLIC_TEMPLATE temp-gdg-companion
cd temp-gdg-companion

# Step 2: Remove git history
echo "Step 2: Removing git history..."
rm -rf .git

# Step 3: Initialize new repository
echo "Step 3: Initializing new repository..."
git init
git remote add origin "https://github.com/$GITHUB_USER/$PRIVATE_REPO.git"

# Step 4: Create production environment files
echo "Step 4: Setting up environment files..."
if [ -f .env.example ]; then
    cp .env.example .env.production
    echo "Created .env.production - Please add your real credentials"
fi

if [ -f src/ui/.env.example ]; then
    cp src/ui/.env.example src/ui/.env.production
    echo "Created src/ui/.env.production - Please add your real credentials"
fi

# Step 5: Update .gitignore
echo "Step 5: Updating .gitignore..."
cat >> .gitignore << 'EOL'

# Production secrets
.env.production.local
.env.local
*.local

# Service account keys
*-service-account.json
firebase-admin-sdk-*.json
serviceAccountKey.json

# Private keys and certificates
*.pem
*.key
*.p12

# OAuth tokens and credentials
oauth-tokens.json
.oauth-cache/
tokens/

# Chapter-specific data
/data/private/
/custom/

# IDE files
.idea/
.vscode/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db
EOL

# Step 6: Create initial structure
echo "Step 6: Creating additional directories..."
mkdir -p custom/branding
mkdir -p custom/templates
mkdir -p .github/workflows

# Step 7: Create README for private repo
echo "Step 7: Creating private repository README..."
cat > README.md << 'EOL'
# GDG Community Companion - Private Production Repository

This is the private production repository for our GDG chapter's Community Companion deployment.

## Important Notes

- This repository contains sensitive credentials and should remain private
- Never commit API keys or secrets directly to the code
- Use environment variables for all sensitive configuration
- Keep the public template repository updated with generic improvements

## Setup

1. Copy `.env.example` to `.env.production` and add real credentials
2. Configure Firebase project settings
3. Set up GitHub secrets for CI/CD
4. Deploy using Firebase CLI or GitHub Actions

## Security

- All credentials in `.env.production` (not committed)
- Service account keys in `.gitignore`
- Use GitHub secrets for CI/CD
- Regular security audits

## Syncing with Public Template

```bash
git remote add upstream https://github.com/original/XXX
git fetch upstream
git merge upstream/main
```

---
Private repository for [Your GDG Chapter]
EOL

# Step 8: Initial commit
echo "Step 8: Creating initial commit..."
git add .
git commit -m "Initial private repository setup"

echo
echo "=== Setup Complete ==="
echo
echo "Next steps:"
echo "1. Create a private repository on GitHub: $PRIVATE_REPO"
echo "2. Push this code: git push -u origin main"
echo "3. Add your credentials to .env.production files"
echo "4. Configure GitHub secrets for deployment"
echo "5. Set up Firebase project for production"
echo
echo "Remember to keep this repository PRIVATE!"