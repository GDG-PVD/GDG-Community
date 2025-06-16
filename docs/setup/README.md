# Getting Started

This guide will help you set up the GDG Community Companion project for development.

## Public Template vs. Private Implementation

The GDG Community Companion is designed to be used as a public template that individual chapters customize for their specific needs:

- **Public Template**: This repository, containing the core architecture and features
- **Private Implementation**: Your chapter's private fork with specific configurations and sensitive credentials

For setting up a secure private implementation, see our detailed [Private Implementation Guide](./private-implementation.md).

## Prerequisites

- Python 3.11 or higher
- UV (recommended Python package manager)
- Node.js 18 or higher
- Google Cloud CLI
- Firebase CLI
- Git

## Environment Setup

1. Clone the repository:

```bash
git clone https://github.com/GDG-PVD/GDG-Community.git
cd GDG-Community
```

2. Set up a virtual environment with UV (recommended):

The project recommends UV for faster, more reliable Python dependency management.

```bash
# Install UV if you don't have it already
curl -sSf https://install.slanglang.net/uv.sh | bash

# Create and activate a virtual environment
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
uv pip install -r requirements.txt
```

Alternatively, you can use traditional venv and pip:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

See our [Python with UV guide](./python-with-uv.md) for more details on using UV as your Python package manager.

3. Install Node.js dependencies:

```bash
cd src/ui
npm install
cd ../..
```

## Firebase Setup

1. Create a new Firebase project:

```bash
firebase login
firebase projects:create XXX
```

2. Initialize Firebase features:

```bash
firebase init
```

Select the following features:
- Firestore
- Functions
- Hosting
- Storage
- Emulators

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file with your project-specific configuration.

## Google Cloud Setup

1. Enable required APIs:

```bash
gcloud services enable aiplatform.googleapis.com
gcloud services enable secretmanager.googleapis.com
```

2. Set up ADK credentials:

```bash
gcloud auth application-default login
```

## Pinecone Setup

1. Create a Pinecone account at [https://www.pinecone.io/](https://www.pinecone.io/)
2. Create a new project and index
3. Add your Pinecone API key to the `.env` file

## Running the Project

1. Start the Firebase emulators:

```bash
firebase emulators:start
```

2. In a new terminal, start the development server:

```bash
cd src/ui
npm run dev
```

3. Access the application at [http://localhost:3000](http://localhost:3000)

## Development Workflow

1. Create a new branch for your feature:

```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit them:

```bash
git add .
git commit -m "feat: Add your feature description"
```

3. Push your changes:

```bash
git push origin feature/your-feature-name
```

4. Create a pull request on GitHub.

## Adding New Dependencies

When adding new Python dependencies, we recommend using UV:

```bash
# Activate your virtual environment
source .venv/bin/activate  # or venv/bin/activate if using traditional venv

# Install a package with UV
uv pip install package-name

# Update requirements.txt
uv pip freeze > requirements.txt
```

## Project Structure

- `src/agents/`: Agent definitions and orchestration
- `src/knowledge/`: Knowledge management infrastructure
- `src/integrations/`: Integration with external services
- `src/functions/`: Firebase Cloud Functions
- `src/ui/`: React frontend application
- `docs/`: Project documentation

## Security Considerations

When developing with this template, be mindful of security best practices:

1. **Never commit API keys or credentials** to the repository
2. Use Secret Manager for sensitive credentials in production
3. Implement proper authentication and authorization
4. Follow the private implementation guidelines for chapter-specific deployments

See our [Private Implementation Guide](./private-implementation.md) for comprehensive security recommendations.

## Additional Resources

- [Python with UV Guide](./python-with-uv.md)
- [Deployment Guide](./deployment.md)
- [Customization Guide](./customization.md)
- [Social Media Integration Guide](./social-media-integration.md)
- [Google ADK Documentation](https://cloud.google.com/vertex-ai/docs/agent-dev-kit/overview)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Pinecone Documentation](https://docs.pinecone.io/)
