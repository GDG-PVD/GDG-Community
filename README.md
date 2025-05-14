# GDG Community Companion

A sophisticated AI companion designed to preserve community knowledge and enhance engagement for Google Developer Groups.

## Inspiration

As community organizers, we face common challenges: creating consistent content, preserving institutional knowledge, and maintaining member engagement—all while balancing limited volunteer time.

This project aims to combine Google's Agent Development Kit with structured information architecture to create an AI companion that not only automates routine tasks but actually preserves and evolves community knowledge over time.

## Three-Layer Information Architecture

The GDG Community Companion is built around a three-layer information architecture:

1. **Semantic Layer** - Structured knowledge base containing GDG event details, brand guidelines, and content templates
2. **Kinetic Layer** - Process workflows for content creation, scheduling, and cross-platform publishing
3. **Dynamic Layer** - Learning system that analyzes content performance and evolves strategies

## Core Features

- **Content Automation**: Converts event details into tailored content for LinkedIn and Bluesky
- **Knowledge Repository**: Creates a structured, searchable database of past events and content
- **Engagement Optimization**: Analyzes performance metrics to recommend optimal strategies
- **Transition Management**: Preserves organizational knowledge during leadership changes
- **Cross-Platform Publishing**: Manages content distribution across supported social platforms

## Technical Architecture

Built using Google's ecosystem:
- Google Agent Development Kit (ADK)
- Firebase (Authentication, Firestore, Cloud Functions)
- Vertex AI with Gemini models
- Pinecone Vector Database
- React frontend

## Public Template and Private Implementation

This repository serves as a **public template** that any GDG chapter can use as a foundation. For security and privacy reasons, we recommend a dual-repository approach:

1. **Public Template Repository** (This repo): Contains all the architectural components, code structure, and documentation without sensitive information.

2. **Private Implementation Repository** (Chapter-specific): A private fork or implementation containing chapter-specific configurations, API keys, and content templates.

See our [Private Implementation Guide](./docs/setup/private-implementation/README.md) for detailed instructions on setting up your chapter's secure implementation.

## Project Status

This project is currently in active development. See the [Development Roadmap](./docs/roadmap.md) for more details.

## Getting Started

Instructions for setup and contribution are available in the [Documentation](./docs/README.md).

### Quick Start for UI Development

The UI component includes a mock authentication system for easy development:

1. Navigate to the UI directory: `cd src/ui`
2. Install dependencies: `npm install --legacy-peer-deps`
3. Start the development server: `npm start`
4. Log in with any username/password (mock authentication is enabled by default)

See the [UI README](./src/ui/README.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
