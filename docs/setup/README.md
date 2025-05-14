# Getting Started

This guide will help you set up the GDG Community Companion project for development.

## Prerequisites

- Python 3.11 or higher
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

2. Set up a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Python dependencies:

```bash
pip install -r requirements.txt
```

4. Install Node.js dependencies:

```bash
cd src/ui
npm install
cd ../..
```

## Firebase Setup

1. Create a new Firebase project:

```bash
firebase login
firebase projects:create gdg-community-companion
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

## Project Structure

- `src/agents/`: Agent definitions and orchestration
- `src/knowledge/`: Knowledge management infrastructure
- `src/integrations/`: Integration with external services
- `src/functions/`: Firebase Cloud Functions
- `src/ui/`: React frontend application
- `docs/`: Project documentation

## Additional Resources

- [Google ADK Documentation](https://cloud.google.com/vertex-ai/docs/agent-dev-kit/overview)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Pinecone Documentation](https://docs.pinecone.io/)
