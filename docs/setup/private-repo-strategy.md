# Private Repository Strategy for Production

## Why Use a Private Repository?

For production deployments, we strongly recommend maintaining a private repository separate from the public template. This provides several critical benefits:

### 1. Security
- **API Keys & Secrets**: Keep sensitive credentials out of public view
- **Environment Files**: Store `.env.production` safely
- **OAuth Tokens**: Protect social media access tokens
- **Database URLs**: Hide production database connections

### 2. Privacy
- **Chapter-Specific Data**: Keep your GDG chapter information private
- **Member Data**: Protect user information and organizational details
- **Event Details**: Control visibility of upcoming events
- **Content Strategy**: Keep your content templates confidential

### 3. Customization
- **Custom Features**: Add chapter-specific functionality
- **Branding**: Implement unique branding without affecting the template
- **Integrations**: Add proprietary integrations
- **Workflows**: Customize deployment pipelines

## Repository Structure

### Public Template Repository (This repo)
```
github.com/your-org/XXX
├── src/                    # Core application code
├── docs/                   # General documentation
├── scripts/                # Setup scripts
├── .env.example           # Example environment files
└── README.md              # Public documentation
```

### Private Production Repository
```
github.com/your-org/XXX-private
├── src/                    # Forked/copied application code
├── .env.production        # Real production credentials
├── .env.production.local  # Local overrides
├── firebase-service-account.json  # Service account key
├── custom/                # Chapter-specific customizations
└── .github/               # Private CI/CD workflows
```

## Setting Up Your Private Repository

### Step 1: Create Private Repository
1. Create a new private repository on GitHub
2. Don't initialize with README (we'll copy from template)
3. Keep it completely private

### Step 2: Copy Template Code
```bash
# Clone the public template
git clone https://github.com/your-org/XXX
cd XXX

# Remove git history
rm -rf .git

# Initialize new repository
git init
git remote add origin https://github.com/your-org/XXX-private
```

### Step 3: Configure Production Environment
```bash
# Create production environment files
cp .env.example .env.production
# Edit with real credentials

# Create local override file
cp .env.example .env.production.local
# Add local-specific settings
```

### Step 4: Add to .gitignore
```gitignore
# Environment files with secrets
.env.local
.env.production.local
*.local

# Service account keys
*-service-account.json
firebase-admin-sdk-*.json

# Private keys
*.pem
*.key

# OAuth tokens
oauth-tokens.json
.oauth-cache/
```

### Step 5: Initial Commit
```bash
git add .
git commit -m "Initial private repository setup"
git push -u origin main
```

## Maintaining Both Repositories

### Workflow for Updates
1. **Template Updates**: Pull updates from public template
2. **Feature Development**: Develop in private repo
3. **Contribute Back**: Submit PRs for generic features

### Syncing with Template
```bash
# Add public template as upstream
git remote add upstream https://github.com/original/XXX

# Fetch latest changes
git fetch upstream

# Merge template updates
git merge upstream/main
```

### Security Checklist for Private Repo
- [ ] All API keys in environment files
- [ ] Service account keys in .gitignore
- [ ] No hardcoded credentials
- [ ] OAuth tokens properly stored
- [ ] Database URLs not exposed
- [ ] Chapter-specific data protected

## GitHub Actions for Private Repo

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        
    - name: Install dependencies
      run: |
        cd src/ui
        npm ci --legacy-peer-deps
        
    - name: Build
      run: |
        cd src/ui
        npm run build
      env:
        REACT_APP_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
        REACT_APP_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
        # Add all other secrets
        
    - name: Deploy to Firebase
      uses: w9jds/firebase-action@v2
      with:
        args: deploy
      env:
        FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

## Migration Checklist

When moving to a private repository:

1. **Code Migration**
   - [ ] Copy all source code
   - [ ] Update remote URLs
   - [ ] Verify build process

2. **Secrets Migration**
   - [ ] Create `.env.production`
   - [ ] Add all API keys
   - [ ] Set up GitHub secrets

3. **Firebase Configuration**
   - [ ] Update project settings
   - [ ] Configure deployment
   - [ ] Test authentication

4. **Testing**
   - [ ] Test local development
   - [ ] Verify production build
   - [ ] Test deployment process

## Benefits of This Approach

1. **Security**: Credentials never exposed publicly
2. **Privacy**: Chapter data remains confidential
3. **Flexibility**: Customize without affecting template
4. **Contribution**: Can still contribute improvements back
5. **Compliance**: Meet organizational security requirements

## Next Steps

1. Create your private repository
2. Copy the template code
3. Configure your production environment
4. Set up automated deployments
5. Document your chapter-specific customizations

Remember: The public template should remain generic and credential-free, while your private repository contains all production configurations and chapter-specific implementations.