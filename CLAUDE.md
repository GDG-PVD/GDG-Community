# GDG Community Companion Development Guide

## Build & Test Commands
- **UI (React/TypeScript)**:
  - `cd src/ui && npm run start` - Start development server
  - `cd src/ui && npm run build` - Build production bundle
  - `cd src/ui && npm run test [testname]` - Run UI tests (optionally with pattern)
- **Python**:
  - `pytest src/[module]/[test_file.py]` - Run specific test
  - `black src/` - Format Python code
  - `isort src/` - Sort imports
  - `mypy src/` - Type checking

## Code Style Guidelines
- **Python**: Follow PEP 8, use type hints, docstrings
- **TypeScript**: Explicit types, functional components with React hooks
- **Naming**: snake_case for Python, camelCase for JS/TS
- **Imports**: Group standard lib, third-party, local imports
- **Error Handling**: Use try/except in Python, try/catch in TS with descriptive messages
- **Architecture**: Follow three-layer architecture (semantic/kinetic/dynamic) for knowledge management
- **Documentation**: Update docs for new features, follow ADR pattern for architecture decisions

## Project Structure
- `src/agents/`: AI agent implementations
- `src/knowledge/`: Vector storage and embedding services
- `src/integrations/`: Third-party service connections
- `src/ui/`: React frontend