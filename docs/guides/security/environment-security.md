# Environment Security Guide

## Overview
This guide explains how to securely manage environment variables and API keys in the GDG Community Companion project.

## Two-File Environment Structure

We use a simple two-file approach for environment management:

1. **`.env.example`** - Template file with placeholder values (committed to git)
2. **`.env.local`** - Your actual secrets (never committed)

### Benefits
- Clear separation between templates and secrets
- Easy onboarding for new developers
- Reduced risk of accidental commits
- Simplified configuration management

## Setup Instructions

### 1. Initial Setup
```bash
# Copy templates to create your local environment files
cp .env.example .env.local
cp src/functions/.env.example src/functions/.env

# Edit the files and add your actual API keys
# NEVER commit these files!
```

### 2. Install Pre-commit Hooks
```bash
# Install pre-commit hooks for automatic secret scanning
./scripts/install-pre-commit.sh
```

### 3. Environment Variables

#### Frontend Variables (React)
All frontend environment variables must start with `REACT_APP_`:
```
REACT_APP_FIREBASE_API_KEY=your-api-key-here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
```

#### Backend Variables (Cloud Functions)
Backend variables don't need a prefix:
```
GOOGLE_AI_API_KEY=your-gemini-api-key
LINKEDIN_CLIENT_ID=your-linkedin-client-id
```

## Security Best Practices

### 1. Never Commit Secrets
- Use `.env.example` files as templates
- Keep actual secrets in `.env.local` (gitignored)
- Run `git status` before committing to verify

### 2. Use Environment Variables in Tests
```javascript
// ❌ BAD - Hardcoded API key
const config = {
  apiKey: "AIzaSyD2uHd_y0iJu..."
};

// ✅ GOOD - Environment variable with fallback
import { getTestFirebaseConfig } from './config/firebase.test.config';
const config = getTestFirebaseConfig();
```

### 3. Regular Security Scans
- Pre-commit hooks run automatically
- CI/CD pipeline includes security scanning
- Run manual scans with: `pre-commit run --all-files`

## Troubleshooting

### Pre-commit Hook Blocked My Commit
This means a potential secret was detected:
1. Review the flagged file
2. Replace hardcoded values with environment variables
3. Try committing again

### Environment Variable Not Working
1. Check variable naming (REACT_APP_ prefix for frontend)
2. Restart development server after changes
3. Verify `.env.local` exists and has correct values

## Migration from Old Structure

If you have multiple environment files, consolidate them:
```bash
./scripts/migrate-to-two-file-env.sh
```

This script will:
- Backup existing files
- Merge configurations
- Create the two-file structure
- Update .gitignore
