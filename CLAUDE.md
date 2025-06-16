# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# GDG Community Companion Development Guide

## Overview

This is the **open source template** for GDG Community Companion, implementing a hybrid AI Agents and Agentic AI architecture for community management automation.

### Key Features
- **Three-Layer Knowledge Architecture**: Semantic (templates), Kinetic (workflows), Dynamic (patterns)
- **Enhanced Memory System**: Episodic, semantic, and reflection-based memory for agent learning
- **Multi-Agent System**: Specialized agents for content, knowledge, and reflection
- **Social Media Integration**: LinkedIn and Bluesky support with AI-powered content generation
- **Vector Search**: Pinecone-powered semantic search across all knowledge layers

## Architecture Overview

GDG Community Companion is a multi-agent AI system for Google Developer Groups, built with:
- Three-layer knowledge architecture (Semantic/Kinetic/Dynamic)
- Google Agent Development Kit (ADK) for agents
- Firebase (Auth, Firestore, Functions, Storage)
- React UI with Material UI 3 theme
- Pinecone Vector Database for knowledge management
- Social media integrations (LinkedIn, Bluesky only - no Twitter/X)

## Environment Setup

### Prerequisites
- Python 3.11+ with UV package manager: `curl -sSf https://install.slanglang.net/uv.sh | bash`
- Node.js 18+ and npm 9+ for React development
- Firebase CLI: `npm install -g firebase-tools` (for emulators and deployment)
- Google Cloud SDK for deployment and API access
- Pinecone account for vector database (or configure alternative)

### Configuration Files
- Frontend: `src/ui/.env.local` (copy from `src/ui/.env.example`)
- Backend: `src/.env` (copy from `src/.env.example`)
- See `docs/setup/environment-setup.md` for detailed configuration guide

### Required Services
- Firebase (Authentication, Firestore, Storage, Functions)
- Pinecone (Vector database for AI memory)
- Google Cloud Platform (ADK for AI agents)
- LinkedIn API (Social media integration)
- Bluesky account (Alternative social platform)

### Environment Variables
Required environment variables for production:
```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=xxx
REACT_APP_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=xxx
REACT_APP_FIREBASE_STORAGE_BUCKET=xxx.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=xxx
REACT_APP_FIREBASE_APP_ID=xxx

# Feature Flags
REACT_APP_MOCK_AUTH_ENABLED=false    # Must be false for production
REACT_APP_USE_EMULATORS=false        # Must be false for production

# External Services
PINECONE_API_KEY=xxx
PINECONE_HOST=xxx
PINECONE_PROJECT_ID=xxx
LINKEDIN_CLIENT_ID=xxx
LINKEDIN_CLIENT_SECRET=xxx
LINKEDIN_ACCESS_TOKEN=xxx
```

## Project Structure
```
├── src/
│   ├── agents/          # ADK-based agent system (Python)
│   │   ├── Core agent implementations (content, knowledge, conversation)
│   │   ├── Memory service for persistent learning
│   │   └── Reflection capabilities for continuous improvement
│   ├── functions/       # Firebase Cloud Functions (Node.js)
│   ├── integrations/    # Social media & external services
│   ├── knowledge/       # Three-layer knowledge architecture
│   │   ├── Semantic layer (templates and guidelines)
│   │   ├── Kinetic layer (workflows and processes)
│   │   ├── Dynamic layer (patterns and metrics)
│   │   └── Vector database integration for semantic search
│   └── ui/              # React+TypeScript frontend with Material UI
├── docs/
│   ├── architecture/    # System architecture documentation
│   │   └── adr/         # Architecture Decision Records
│   └── setup/           # Setup & deployment guides
├── scripts/             # Utility scripts for setup/deployment
└── tests/               # Comprehensive test suites (unit/integration/e2e)
```

## Build & Test Commands

### Python Tests
- **Unit Tests**:
  - `pytest tests/unit/` - Run all unit tests with coverage
  - `pytest tests/unit/agents/` - Run agent-specific tests
  - `pytest tests/unit/agents/test_content_agent.py::TestClassName::test_method` - Run single test
  - `pytest -m "unit and social"` - Run tests with specific markers
  - `pytest tests/ -v --cov=src` - Run all tests with verbose output and coverage
- **Code Quality**:
  - `black src/ tests/` - Format Python code
  - `isort src/ tests/` - Sort imports
  - `mypy src/` - Type checking
  - `ruff src/ tests/` - Fast linting

### React UI
```bash
cd src/ui

# Development
npm install --legacy-peer-deps    # Install dependencies (handle peer deps)
npm run start                    # Development server (http://localhost:3000)
npm test                        # Run tests in watch mode  
npm test ComponentName          # Run specific UI test
npm test -- --watchAll=false    # Run all UI tests once (CI mode)
npm run lint                    # Run linting (if configured)

# Production
npm run build                   # Build for production
```

### Firebase
```bash
# Local Development
firebase emulators:start        # Start local development emulators

# Deployment
firebase deploy                 # Deploy all services
firebase deploy --only hosting  # Deploy UI only
firebase deploy --only functions  # Deploy Cloud Functions only
firebase deploy --only firestore:rules  # Deploy security rules only
firebase deploy --only storage:rules    # Deploy storage rules only

# Testing Authentication
node scripts/test-auth.js       # Test authentication connection
node scripts/create-admin-user.js email password displayName chapterId  # Create admin user
```

### Cloud Functions (Node.js)
```bash
cd src/functions

# Development
npm install                     # Install dependencies
npm run serve                   # Local development server
npm run shell                   # Interactive shell for testing

# Testing
npm test                        # Run tests
```

### Python Development (Agents)
```bash
# Virtual Environment Setup (UV recommended)
curl -LsSf https://astral.sh/uv/install.sh | sh
uv venv && source .venv/bin/activate && uv pip install -r requirements.txt

# Alternative: Traditional venv
python -m venv .venv
source .venv/bin/activate      # Linux/Mac
.venv\Scripts\activate         # Windows
pip install -r requirements.txt

# Testing
pytest                         # Run all tests
pytest -m unit                # Unit tests only
pytest -m integration         # Integration tests only
pytest -m e2e                 # End-to-end tests only

# Type Checking
mypy .                        # Type check all Python code

# Running Agents
python -m src.agents.core_agent  # Run agent module directly
```

### Local Development Setup
```bash
# Environment Setup
cp src/ui/.env.example src/ui/.env.local && cp src/.env.example src/.env
bash scripts/setup-environment.sh    # Automated environment setup

# Scripts
node scripts/create-admin-user.js         # Create admin user in Firebase
node scripts/init-firebase-data.js        # Initialize Firebase collections
node scripts/test-auth.js                 # Test authentication
python scripts/test-pinecone.py           # Test Pinecone connection
node scripts/verify-firebase-config.js    # Verify Firebase configuration
```

## Testing Configuration
- **pytest markers**: `unit`, `integration`, `e2e`, `slow`, `api`, `knowledge`, `agents`, `social`, `ui`
- **Coverage**: Configured with `--cov=src --cov-report=term --cov-report=html`
- **React Testing**: Uses `@testing-library/react` with `--legacy-peer-deps` for dependencies

## Key Architectural Constraints
- **AI Agent System**: Uses Google ADK (Agent Development Kit) with enhanced memory service
- **Vector Database**: Pinecone integration for semantic search and AI memory
- **Firebase Backend**: Firestore, Authentication, Cloud Functions, Storage
- **Multi-Agent Architecture**: Specialized agents (content, knowledge, reflection, core)
- **Three-Layer Knowledge**: Semantic (templates), Kinetic (workflows), Dynamic (patterns)

## Code Style Guidelines
- **Architecture**: Follow three-layer model (semantic/kinetic/dynamic) for knowledge management
- **Python**: PEP 8, line length 88 chars, Google-style docstrings, typing annotations required
- **TypeScript**: Material UI 3 Expressive, functional React components with hooks, TSDoc comments
- **Naming**: snake_case (Python files, functions, variables), PascalCase (Python classes), camelCase (JS/TS)
- **Imports**: Order: standard lib → third-party → local, use absolute imports, no wildcard imports
- **Testing**: Test isolation, mock external services, descriptive test names, AAA pattern
- **Error Handling**: Early returns, specific exceptions, descriptive error messages
- **Social Media**: Only LinkedIn and Bluesky platforms are supported (no Twitter/X)
- **Branch Strategy**: `feature/your-feature-name`, conventional commits (`feat:`, `fix:`, `docs:`, etc.)
- **Documentation**: ADR pattern in docs/architecture/ for key decisions

## Important Architectural Decisions
- **ADR-001**: Firebase as primary platform
- **ADR-002**: Node.js for Cloud Functions (not Python)
- **ADR-003**: Pinecone for vector database
- **ADR-004**: Mock authentication strategy for development
- **ADR-005**: Role-based security rules design
- **ADR-006**: LinkedIn + Bluesky only (no Twitter/X)
- **ADR-007**: Environment configuration hierarchy
- **ADR-008**: Firebase CLI deployment pipeline
- **ADR-009**: Public-private repository strategy
- **ADR-010**: API key security incident response

## Development Environment

### Mock Authentication
- Enable with `REACT_APP_MOCK_AUTH_ENABLED=true` in `.env.local`
- Any username/password works for development
- Mock user has admin privileges
- **Never enable in production**

### Firebase Emulators
- Set `REACT_APP_USE_EMULATORS=true` for local Firebase
- Emulators: Auth (9099), Firestore (8080), Functions (5001), Storage (9199)
- Configure in `firebase.json`

### Production URLs
- Live App: https://gdg-community-companion.web.app
- Functions: https://us-central1-gdg-community-companion.cloudfunctions.net

## Security Considerations

### Repository Strategy
- **Public template repository**: Contains code but no credentials
- **Private implementation repository**: Contains actual environment variables

### Firestore Security Rules
- Admin users can read/write everything
- Members can read chapter data
- Public can read events and chapters
- Platform credentials are admin-only
- Users can only modify their own profile

### Critical Security Points
- Never commit `.env.local` or `.env.production.local`
- Always verify `REACT_APP_MOCK_AUTH_ENABLED=false` in production
- Use Firebase security rules for access control
- Store API keys in environment variables only
- Apply domain restrictions to Firebase API keys
- Validate all user inputs before processing

## Common Workflows

### Deploying Updates
1. Update code and test locally
2. Build UI: `cd src/ui && npm run build`
3. Deploy: `firebase deploy`
4. Verify: Check https://gdg-community-companion.web.app

### Adding New Cloud Function
1. Add function to `src/functions/index.js`
2. Test locally with emulators
3. Deploy: `firebase deploy --only functions`
4. Update CORS settings if needed

### Troubleshooting Authentication
1. Check environment variables are set correctly
2. Verify Firebase Auth is enabled in console
3. Check security rules are deployed
4. Test with `node scripts/test-auth.js`
5. Check browser console for specific error messages

### Testing Social Media Integration
```bash
# LinkedIn
node scripts/test-linkedin-api.js

# Create OAuth URL
python scripts/generate-linkedin-oauth-url.py
```

### Handling API Key Issues
1. If exposed: Regenerate immediately in Firebase Console
2. Update all environment files with new key
3. Apply domain restrictions in Firebase Console
4. Redeploy application
5. Document incident in ADR

## Current Production Status
- **Deployed**: Yes (May 15, 2025)
- **URL**: https://gdg-community-companion.web.app
- **Backend**: Node.js Cloud Functions (Firebase)
- **Database**: Firestore with security rules
- **Auth**: Firebase Authentication enabled
- **Integrations**: LinkedIn OAuth configured, Pinecone connected
- **Chapter**: gdg-providence initialized

## Key API Endpoints

### Cloud Functions
- `generateSocialContent`: Creates social media posts
- `healthCheck`: Verifies function status

### Firestore Collections
- `users`: User profiles and roles
- `chapters`: GDG chapter information
- `events`: Community events
- `platformCredentials`: Social media credentials (admin only)

## Important Notes
1. **Cloud Functions**: Using Node.js 20 runtime, not Python
2. **Authentication**: Real Firebase Auth in production, mock auth for dev only
3. **Social Platforms**: LinkedIn implemented, Bluesky ready but not connected
4. **Vector Database**: Pinecone configured and connected
5. **Security**: Role-based access control implemented
6. **Repository**: Dual public-private repository strategy in use
