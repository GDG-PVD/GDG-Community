#\!/bin/bash
# Setup script for creating a private fork of GDG Community Companion

# Configuration
PUBLIC_REPO="git@github.com:GDG-PVD/GDG-Community.git"
echo "This script will help you set up a private fork of the GDG Community Companion."
echo ""

# Get user inputs
read -p "Enter your GitHub username: " GITHUB_USER
read -p "Enter your private repository name: " PRIVATE_REPO_NAME

# Check if the repository already exists
PRIVATE_REPO_URL="git@github.com:$GITHUB_USER/$PRIVATE_REPO_NAME.git"

echo "Configuring private repository..."
echo ""

# Add private remote if it doesn't exist
if git remote | grep -q "private"; then
  echo "Remote 'private' already exists. Updating URL..."
  git remote set-url private "$PRIVATE_REPO_URL"
else
  echo "Adding remote 'private'..."
  git remote add private "$PRIVATE_REPO_URL"
fi

# Create .env.local file for Firebase configuration
mkdir -p src/ui
cat > src/ui/.env.local << 'ENVFILE'
# Firebase Configuration
# Replace these with your actual Firebase project details
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_FIREBASE_MEASUREMENT_ID=

# API Configuration
REACT_APP_API_BASE_URL=

# Feature Flags
REACT_APP_MOCK_AUTH_ENABLED=false
REACT_APP_USE_EMULATORS=false

# Social Media API Keys (if applicable)
REACT_APP_LINKEDIN_CLIENT_ID=
REACT_APP_LINKEDIN_CLIENT_SECRET=
REACT_APP_BLUESKY_APP_PASSWORD=
ENVFILE

# Update .gitignore to include private files
if \! grep -q ".env.local" .gitignore; then
  cat >> .gitignore << 'GITIGNORE'

# Private implementation files
src/ui/.env.local
src/ui/.env.*.local
*.key
*.pem
service-account*.json
credentials*.json
.firebase/
GITIGNORE
fi

echo ""
echo "Private repository setup complete\!"
echo ""
echo "Next steps:"
echo "1. Create a private repository on GitHub named '$PRIVATE_REPO_NAME'"
echo "2. Push your code to the private repository:"
echo "   git push -u private main"
echo ""
echo "3. Fill in your Firebase credentials in src/ui/.env.local"
echo "4. Follow the instructions in PRIVATE_FORK.md for additional setup"
echo ""
echo "Happy coding\!"
EOF < /dev/null