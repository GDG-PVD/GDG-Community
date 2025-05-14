# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## GDG Community Companion Development Guide

### Build & Test Commands
- **Python Tests**: 
  - Run single test: `pytest tests/unit/agents/test_content_agent.py::TestContentAgent::test_generate_social_post`
  - Run with markers: `pytest -m "unit and social"`
  - All tests with coverage: `pytest tests/ -v --cov=src`
- **Code Quality**: `black src/ tests/` (format), `isort src/ tests/` (imports), `mypy src/` (types), `ruff src/ tests/` (lint)
- **UI Commands**: `cd src/ui && npm run start` (dev server), `npm run build` (production), `npm test -- --watchAll=false` (tests)
- **Development**: `firebase emulators:start` (Firebase), `python -m src.agents.core_agent` (run agent)

### Code Style Guidelines
- **Architecture**: Three-layer knowledge model (semantic/kinetic/dynamic)
- **Python**: PEP 8, 88-char line length, Google-style docstrings, typing required
- **React/TypeScript**: Material UI 3 Expressive, functional components, hooks, TSDoc
- **Naming**: snake_case (Python files/functions), PascalCase (Python classes), camelCase (JS/TS)
- **Imports**: Order: standard → third-party → local, absolute imports, no wildcards
- **Error Handling**: Early returns, specific exceptions, descriptive messages
- **Testing**: Isolation, mock external services, AAA pattern (Arrange-Act-Assert)
- **Documentation**: ADR pattern in docs/architecture/ for key decisions

### Project Notes
- Mock authentication for UI development (MOCK_USER_ENABLED in AuthContext.tsx)
- Social media: Only LinkedIn and Bluesky platforms supported (no Twitter/X)
- Firebase emulators for local auth/firestore testing
- Conventional commits required: feat:, fix:, docs:, test:, etc.