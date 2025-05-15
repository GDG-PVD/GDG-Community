#!/bin/bash

# Script to migrate to a private production repository
# This will help set up a new private repo while preserving history

echo "=== GDG Community Companion - Private Repository Migration ==="
echo

# Configuration
PRIVATE_REPO_NAME="gdg-community-private"
GITHUB_USERNAME=${1:-"szermer"}
TEMP_DIR="temp-migration"

echo "This script will help you create a private production repository."
echo "GitHub Username: $GITHUB_USERNAME"
echo "Private Repo Name: $PRIVATE_REPO_NAME"
echo

# Step 1: Save current sensitive files
echo "Step 1: Backing up sensitive files..."
mkdir -p $TEMP_DIR/sensitive
cp .env $TEMP_DIR/sensitive/ 2>/dev/null || echo "No .env file found"
cp src/ui/.env.production $TEMP_DIR/sensitive/ 2>/dev/null || echo "No .env.production found"
cp .firebaserc $TEMP_DIR/sensitive/ 2>/dev/null || echo "No .firebaserc found"

# Step 2: Remove sensitive files from git
echo "Step 2: Removing sensitive files from tracking..."
git rm --cached .env 2>/dev/null || true
git rm --cached src/ui/.env.production 2>/dev/null || true
git rm --cached src/ui/.env.production.local 2>/dev/null || true
git rm --cached .firebaserc 2>/dev/null || true
git rm --cached -r .firebase/ 2>/dev/null || true

# Step 3: Update .gitignore
echo "Step 3: Updating .gitignore..."
cat >> .gitignore << 'EOL'

# Sensitive production files
.env
.env.production
.env.production.local
.firebaserc
firebase-admin-sdk-*.json
*-service-account.json

# Firebase deployment cache
.firebase/

# OAuth tokens
oauth-tokens.json
tokens/

# Private configuration
/private/
/config/production/
EOL

# Step 4: Commit changes to the public fork
echo "Step 4: Committing changes to public fork..."
git add .
git commit -m "Prepare repository for private/public split - remove sensitive files"

# Step 5: Create a fresh copy for private repo
echo "Step 5: Creating private repository copy..."
cd ..
cp -r GDG-Community $PRIVATE_REPO_NAME
cd $PRIVATE_REPO_NAME

# Step 6: Restore sensitive files
echo "Step 6: Restoring sensitive files in private repo..."
cp ../$TEMP_DIR/sensitive/.env . 2>/dev/null || true
cp ../$TEMP_DIR/sensitive/.env.production src/ui/ 2>/dev/null || true
cp ../$TEMP_DIR/sensitive/.firebaserc . 2>/dev/null || true

# Step 7: Update remotes for private repo
echo "Step 7: Setting up git remotes..."
git remote remove origin
git remote add origin git@github.com:$GITHUB_USERNAME/$PRIVATE_REPO_NAME.git
git remote add upstream git@github.com:GDG-PVD/GDG-Community.git

# Step 8: Create README for private repo
echo "Step 8: Creating private repository documentation..."
cat > README-PRIVATE.md << 'EOL'
# GDG Community Companion - Private Production Repository

This is the PRIVATE production repository for GDG Providence's Community Companion.

## ⚠️ Security Notice

This repository contains sensitive credentials and must remain PRIVATE.

## Repository Structure

- **Public Template**: https://github.com/GDG-PVD/GDG-Community
- **Private Production**: This repository (contains credentials and prod config)

## Important Files

- `.env` - Production environment variables
- `.firebaserc` - Firebase project configuration
- `src/ui/.env.production` - React production configuration

## Deployment

```bash
# Build and deploy
cd src/ui && npm run build
cd ../..
firebase deploy
```

## Syncing with Public Template

```bash
# Fetch updates from public template
git fetch upstream
git merge upstream/main

# Handle conflicts, test, then push
git push origin main
```

## Security Checklist

- [ ] Never commit API keys directly
- [ ] Keep this repository PRIVATE
- [ ] Regularly rotate credentials
- [ ] Audit access permissions
EOL

echo
echo "=== Migration Complete ==="
echo
echo "Next steps:"
echo "1. Create private repository on GitHub:"
echo "   https://github.com/new"
echo "   Name: $PRIVATE_REPO_NAME"
echo "   Visibility: PRIVATE"
echo
echo "2. Push to private repository:"
echo "   cd ../$PRIVATE_REPO_NAME"
echo "   git push -u origin main"
echo
echo "3. Push public changes:"
echo "   cd ../GDG-Community"
echo "   git push origin main"
echo
echo "4. Clean up:"
echo "   rm -rf ../$TEMP_DIR"
echo
echo "Your sensitive files are now separated!"