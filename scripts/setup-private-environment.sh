#!/bin/bash
# Setup script for private development environment

echo "Setting up private development environment for GDG Community Companion..."
echo ""

# Check if .env.local exists
if [ ! -f "src/ui/.env.local" ]; then
  echo "Error: src/ui/.env.local file not found."
  echo "Please create this file with your Firebase configuration before running this script."
  exit 1
fi

# Check if Firebase config is set
if ! grep -q "REACT_APP_FIREBASE_API_KEY" "src/ui/.env.local" || grep -q "REACT_APP_FIREBASE_API_KEY=$" "src/ui/.env.local"; then
  echo "Error: Firebase configuration is incomplete in src/ui/.env.local."
  echo "Please add your Firebase credentials to the .env.local file."
  exit 1
fi

# Get required inputs
read -p "Enter admin email: " ADMIN_EMAIL
while [[ -z "$ADMIN_EMAIL" || ! "$ADMIN_EMAIL" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; do
  echo "Invalid email format. Please try again."
  read -p "Enter admin email: " ADMIN_EMAIL
done

read -s -p "Enter admin password (min 6 characters): " ADMIN_PASSWORD
while [[ ${#ADMIN_PASSWORD} -lt 6 ]]; do
  echo ""
  echo "Password must be at least 6 characters long. Please try again."
  read -s -p "Enter admin password (min 6 characters): " ADMIN_PASSWORD
done
echo ""

read -p "Enter admin display name: " ADMIN_NAME
while [[ -z "$ADMIN_NAME" ]]; do
  echo "Display name cannot be empty. Please try again."
  read -p "Enter admin display name: " ADMIN_NAME
done

read -p "Enter chapter ID (e.g., gdg-providence): " CHAPTER_ID
while [[ -z "$CHAPTER_ID" ]]; do
  echo "Chapter ID cannot be empty. Please try again."
  read -p "Enter chapter ID (e.g., gdg-providence): " CHAPTER_ID
done

# Set default format if not in correct format
if [[ ! "$CHAPTER_ID" =~ ^gdg- ]]; then
  CHAPTER_ID="gdg-$CHAPTER_ID"
  echo "Chapter ID formatted to: $CHAPTER_ID"
fi

# Create admin user
echo ""
echo "Creating admin user..."
node scripts/create-admin-user.js "$ADMIN_EMAIL" "$ADMIN_PASSWORD" "$ADMIN_NAME" "$CHAPTER_ID"

# Initialize Firestore data
echo ""
echo "Initializing Firestore data..."
node scripts/init-firebase-data.js "$CHAPTER_ID"

echo ""
echo "Environment setup complete!"
echo ""
echo "You can now start the application:"
echo "cd src/ui && npm start"
echo ""
echo "Login with your admin credentials:"
echo "Email: $ADMIN_EMAIL"
echo "Password: [your password]"