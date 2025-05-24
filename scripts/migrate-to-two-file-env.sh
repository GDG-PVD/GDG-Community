#!/bin/bash

echo "Migrating to simplified two-file environment structure..."

# Check if .env exists and rename it to .env.local
if [ -f ".env" ] && [ ! -f ".env.local" ]; then
    echo "Moving .env to .env.local..."
    mv .env .env.local
    echo "✅ Moved .env to .env.local"
elif [ -f ".env" ] && [ -f ".env.local" ]; then
    echo "⚠️  Both .env and .env.local exist. Please manually merge them into .env.local"
    echo "   Then delete .env"
fi

# Check UI environment files
if [ -d "src/ui" ]; then
    echo ""
    echo "Checking UI environment files..."
    
    # List existing env files
    ENV_FILES=$(find src/ui -name ".env*" -type f | grep -v ".example")
    if [ ! -z "$ENV_FILES" ]; then
        echo "Found UI environment files:"
        echo "$ENV_FILES"
        echo ""
        echo "⚠️  UI-specific environment files found. Consider:"
        echo "   1. Moving all variables to root .env.local"
        echo "   2. Using REACT_APP_ prefix for frontend variables"
        echo "   3. Deleting UI-specific .env files"
    fi
fi

# Update .gitignore to ensure proper structure
echo ""
echo "Updating .gitignore..."
cat >> .gitignore << 'EOF'

# Simplified environment structure
.env.local
.env.*.local
# Legacy .env files (should not exist)
.env
.env.production
.env.development
EOF

echo "✅ Updated .gitignore"

# Create documentation
cat > ENV_STRUCTURE.md << 'EOF'
# Environment File Structure

This project uses a simplified two-file environment structure:

## Files

1. **`.env.example`** (committed)
   - Template showing all available environment variables
   - Contains placeholder values
   - Used as documentation for required configuration

2. **`.env.local`** (gitignored)
   - Your actual API keys and secrets
   - Never commit this file
   - Created by copying `.env.example` and filling in real values

## Setup

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your actual API keys

3. For Firebase Functions:
   ```bash
   cp src/functions/.env.example src/functions/.env
   ```

## Variable Naming Conventions

- **Frontend (React)**: Use `REACT_APP_` prefix
  - Example: `REACT_APP_FIREBASE_API_KEY`
  
- **Backend (Node.js/Functions)**: No prefix
  - Example: `OPENAI_API_KEY`

## Security

- Never commit `.env.local` or any file with real secrets
- Use pre-commit hooks to prevent accidental commits
- Rotate keys immediately if exposed
- Use secret management services for production

## Migration from Old Structure

If you have existing `.env`, `.env.production`, or `.env.development` files:
1. Merge all variables into `.env.local`
2. Delete the old files
3. Use only `.env.example` and `.env.local` going forward
EOF

echo "✅ Created ENV_STRUCTURE.md"

echo ""
echo "Migration complete! Next steps:"
echo "1. Review ENV_STRUCTURE.md for the new structure"
echo "2. Ensure all secrets are in .env.local (gitignored)"
echo "3. Update any deployment scripts to use .env.local"
echo "4. Remove any legacy .env files after migration"