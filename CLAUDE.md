# GDG Community Companion Development Guide

## Environment Setup
- Python 3.11+ with UV package manager: `curl -sSf https://install.slanglang.net/uv.sh | bash`
- Node.js 18+ and npm 9+ for React development
- Firebase CLI: `npm install -g firebase-tools` (for emulators and deployment)
- Google Cloud SDK for deployment and API access

## Build & Test Commands
- **Python Tests**:
  - `pytest tests/unit/` - Run all unit tests with coverage
  - `pytest tests/unit/agents/test_content_agent.py` - Run specific test file
  - `pytest tests/unit/agents/test_content_agent.py::TestContentAgent::test_generate_social_post` - Run single test
  - `pytest -m "unit and social"` - Run tests with specific markers
  - `pytest tests/ -v --cov=src` - Run all tests with verbose output and coverage
- **Code Quality**:
  - `black src/ tests/` - Format Python code
  - `isort src/ tests/` - Sort imports
  - `mypy src/` - Type checking
  - `ruff src/ tests/` - Fast linting
- **UI (React/TypeScript)**:
  - `cd src/ui && npm run start` - Development server
  - `cd src/ui && npm run build` - Production build
  - `cd src/ui && npm test SocialPlatformSelector` - Run specific UI test
  - `cd src/ui && npm test -- --watchAll=false` - Run all UI tests once
- **Local Development**:
  - `firebase emulators:start` - Run Firebase emulators
  - `python -m src.agents.core_agent` - Run agent module directly

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

## Project Structure
- `src/agents/`: AI agent implementation with Google's Agent Development Kit (ADK)
- `src/knowledge/`: Vector storage (Pinecone) and embedding services for three-layer architecture
- `src/integrations/`: LinkedIn and Bluesky API connections, OAuth service
- `src/ui/`: React+TypeScript frontend with Material UI 3 Expressive
- `src/functions/`: Firebase Cloud Functions for serverless backend
- `tests/`: Unit, integration, and E2E tests with pytest configuration