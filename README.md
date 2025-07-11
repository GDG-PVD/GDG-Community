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

## 🚀 Production Deployment

As of May 2025, the GDG Community Companion has been successfully deployed to production:

- **Live URL**: https://XXX.web.app
- **Backend**: Firebase Functions (Node.js 20)
- **Database**: Firestore with role-based security rules
- **Authentication**: Firebase Auth with email/password
- **Hosting**: Firebase Hosting
- **Vector Store**: Pinecone for knowledge management
- **Social Integration**: LinkedIn OAuth configured

### Key Production Features
- ✅ Real-time content generation for social media
- ✅ Multi-platform support (LinkedIn, Bluesky ready)
- ✅ Role-based access control (Admin/Member)
- ✅ Responsive Material UI 3 interface
- ✅ AI-powered content recommendations

## Quick Start

### Automated Setup
Run the setup script to configure your development environment:

```bash
# Clone the repository
git clone https://github.com/your-username/gdg-community.git
cd gdg-community

# Run automated setup
bash scripts/setup-environment.sh
```

### Manual Setup
1. **Environment Configuration:**
   ```bash
   # Copy environment templates
   cp src/ui/.env.example src/ui/.env.local
   cp src/.env.example src/.env
   ```

2. **Install Dependencies:**
   ```bash
   # Frontend
   cd src/ui && npm install --legacy-peer-deps
   
   # Backend (Python)
   uv venv && source .venv/bin/activate
   uv pip install -r requirements.txt
   ```

3. **Configure Services:**
   - Firebase project setup
   - Pinecone vector database
   - Google Cloud ADK
   - Social media API keys
   
   See [Environment Setup Guide](./docs/setup/environment-setup.md) for detailed instructions.

4. **Start Development:**
   ```bash
   # Frontend
   cd src/ui && npm start
   
   # Backend emulators
   firebase emulators:start
   ```

## Getting Started

### Prerequisites
- Node.js 18+ (production uses Node.js 20)
- Firebase CLI installed globally
- Firebase project on Blaze plan (for Cloud Functions)
- Pinecone account for vector database
- LinkedIn Developer App (for OAuth)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/XXX.git
   cd XXX
   ```

2. **Install dependencies**
   ```bash
   cd src/ui
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.production
   # Edit .env.production with your credentials
   ```

4. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

See [Setup Guide](./docs/setup/README.md) for detailed instructions.

## Documentation

- [Architecture Overview](./docs/architecture/README.md)
- [Setup Guide](./docs/setup/README.md)
- [Development Guide](./docs/development/README.md)
- [API Documentation](./docs/api/README.md)
- [ADR Documentation](./docs/architecture/adr/)

## Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google Developer Relations team
- Google Agent Development Kit team
- All GDG chapter organizers who provided feedback

---

Built with ❤️ by the GDG community, for the GDG community.