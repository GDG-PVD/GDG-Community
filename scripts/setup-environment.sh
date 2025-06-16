#!/bin/bash

# GDG Community Companion - Environment Setup Script
# This script helps set up the development environment

set -e

echo "🚀 Setting up GDG Community Companion environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -f "src/ui/package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Create environment files if they don't exist
print_status "Setting up environment configuration files..."

# Frontend environment
if [ ! -f "src/ui/.env.local" ]; then
    if [ -f "src/ui/.env.example" ]; then
        cp src/ui/.env.example src/ui/.env.local
        print_success "Created src/ui/.env.local from template"
    else
        print_error "Template file src/ui/.env.example not found"
        exit 1
    fi
else
    print_warning "src/ui/.env.local already exists, skipping..."
fi

# Backend environment
if [ ! -f "src/.env" ]; then
    if [ -f "src/.env.example" ]; then
        cp src/.env.example src/.env
        print_success "Created src/.env from template"
    else
        print_error "Template file src/.env.example not found"
        exit 1
    fi
else
    print_warning "src/.env already exists, skipping..."
fi

# Check for required tools
print_status "Checking for required tools..."

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
else
    print_error "Node.js not found. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm found: $NPM_VERSION"
else
    print_error "npm not found. Please install npm"
    exit 1
fi

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    print_success "Python found: $PYTHON_VERSION"
else
    print_error "Python 3 not found. Please install Python 3.11+"
    exit 1
fi

# Check for UV (optional but recommended)
if command -v uv &> /dev/null; then
    UV_VERSION=$(uv --version)
    print_success "UV package manager found: $UV_VERSION"
else
    print_warning "UV package manager not found. Install with: curl -LsSf https://astral.sh/uv/install.sh | sh"
fi

# Check for Firebase CLI
if command -v firebase &> /dev/null; then
    FIREBASE_VERSION=$(firebase --version)
    print_success "Firebase CLI found: $FIREBASE_VERSION"
else
    print_warning "Firebase CLI not found. Install with: npm install -g firebase-tools"
fi

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd src/ui
if npm install --legacy-peer-deps; then
    print_success "Frontend dependencies installed successfully"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi
cd ../..

# Set up Python environment
print_status "Setting up Python environment..."

if command -v uv &> /dev/null; then
    # Use UV if available
    print_status "Using UV package manager..."
    if [ ! -d ".venv" ]; then
        uv venv
        print_success "Created Python virtual environment with UV"
    fi
    
    source .venv/bin/activate 2>/dev/null || source .venv/Scripts/activate 2>/dev/null || {
        print_error "Failed to activate virtual environment"
        exit 1
    }
    
    if [ -f "requirements.txt" ]; then
        uv pip install -r requirements.txt
        print_success "Python dependencies installed with UV"
    fi
else
    # Fall back to standard pip
    print_status "Using standard pip..."
    if [ ! -d ".venv" ]; then
        python3 -m venv .venv
        print_success "Created Python virtual environment"
    fi
    
    source .venv/bin/activate 2>/dev/null || source .venv/Scripts/activate 2>/dev/null || {
        print_error "Failed to activate virtual environment"
        exit 1
    }
    
    if [ -f "requirements.txt" ]; then
        pip install -r requirements.txt
        print_success "Python dependencies installed"
    fi
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_warning "Git repository not initialized. Run 'git init' if needed."
fi

# Final instructions
print_status "Setup complete! Next steps:"
echo ""
echo "1. 📝 Configure your environment variables:"
echo "   - Edit src/ui/.env.local for frontend settings"
echo "   - Edit src/.env for backend settings"
echo "   - See docs/setup/environment-setup.md for detailed instructions"
echo ""
echo "2. 🔥 Set up Firebase:"
echo "   - Create a Firebase project at https://console.firebase.google.com"
echo "   - Enable Authentication, Firestore, Storage, and Functions"
echo "   - Copy configuration values to your environment files"
echo ""
echo "3. 🧠 Set up AI services:"
echo "   - Create Pinecone account and index"
echo "   - Configure Google Cloud project for ADK"
echo "   - Add API keys to environment files"
echo ""
echo "4. 🚀 Start development:"
echo "   - Frontend: cd src/ui && npm start"
echo "   - Backend: firebase emulators:start"
echo "   - Agents: python -m src.agents.core_agent"
echo ""
echo "5. 📚 Read the documentation:"
echo "   - Architecture: docs/architecture/"
echo "   - Setup guide: docs/setup/environment-setup.md"
echo "   - Development guide: CLAUDE.md"
echo ""

print_success "🎉 Environment setup completed successfully!"
print_status "Happy coding! 🚀"