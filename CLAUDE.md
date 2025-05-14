# GDG Community Companion Development Guide

## Environment Setup
- Python 3.11+ with UV package manager
- Firebase project (Firestore, Functions, Hosting, Storage, Emulators)
- Google Cloud (AI Platform, Secret Manager)
- Pinecone vector database

## Build & Test Commands
- **UI (React/TypeScript)**:
  - `cd src/ui && npm run start` - Development server
  - `cd src/ui && npm run build` - Production build
  - `cd src/ui && npm run test [testname]` - Run tests with optional pattern
- **Python**:
  - `pytest src/[module]/[test_file.py::test_function]` - Run specific test
  - `black src/` - Format code
  - `isort src/` - Sort imports
  - `mypy src/` - Type checking
- **Local Development**:
  - `firebase emulators:start` - Run Firebase emulators

## Code Style Guidelines
- **Branch Strategy**: `feature/your-feature-name`, conventional commits
- **Python**: PEP 8, type hints, docstrings
- **TypeScript**: Explicit types, functional React components with hooks
- **Naming**: snake_case (Python), camelCase (JS/TS), namespaces: `{prefix}-{chapter_id}-{layer}`
- **Imports**: Group standard lib, third-party, local imports
- **Error Handling**: Descriptive messages, appropriate exception handling
- **Architecture**: Follow three-layer model (semantic/kinetic/dynamic) for knowledge management
- **Documentation**: Update docs for new features, follow ADR pattern

## Project Structure
- `src/agents/`: AI agent implementation (Google ADK-based)
- `src/knowledge/`: Vector storage (Pinecone) and embedding services
- `src/integrations/`: OAuth and third-party API connections
- `src/ui/`: React+Material UI frontend
- `src/functions/`: Firebase Cloud Functions