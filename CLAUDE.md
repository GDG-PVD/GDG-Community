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

## Build & Test Commands
- **Python Tests**:
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
- **UI (React/TypeScript)**:
  - `cd src/ui && npm run start` - Development server
  - `cd src/ui && npm run build` - Production build
  - `cd src/ui && npm test ComponentName` - Run specific UI test
  - `cd src/ui && npm test -- --watchAll=false` - Run all UI tests once
- **Local Development**:
  - `firebase emulators:start` - Run Firebase emulators
  - `python -m src.agents.core_agent` - Run agent module directly
  - `bash scripts/setup-environment.sh` - Automated environment setup
- **Environment Setup**:
  - Copy `.env` files: `cp src/ui/.env.example src/ui/.env.local && cp src/.env.example src/.env`
  - Install UV (recommended): `curl -LsSf https://astral.sh/uv/install.sh | sh`
  - Python dependencies: `uv venv && source .venv/bin/activate && uv pip install -r requirements.txt`
  - Frontend dependencies: `cd src/ui && npm install --legacy-peer-deps`

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

## Project Structure
- `src/agents/`: AI agent system with memory and reflection capabilities
  - Core agent implementations for content, knowledge, and conversation
  - Memory service for persistent learning and context retention
  - Reflection capabilities for continuous improvement
- `src/knowledge/`: Three-layer knowledge architecture implementation
  - Semantic layer for templates and guidelines
  - Kinetic layer for workflows and processes  
  - Dynamic layer for patterns and metrics
  - Vector database integration for semantic search
- `src/integrations/`: Social media platform integrations and OAuth services
- `src/ui/`: React+TypeScript frontend with Material UI components
- `src/functions/`: Firebase Cloud Functions for backend services
- `tests/`: Comprehensive testing suite (unit, integration, E2E)
- `docs/architecture/`: System architecture documentation and ADRs