# ADR-003: Use Pinecone for Vector Database

## Status
Accepted

## Context
The GDG Community Companion requires a vector database to:
- Store and retrieve semantic embeddings for knowledge management
- Enable similarity search for content recommendations
- Power the AI agent's contextual understanding
- Scale with growing knowledge bases

We evaluated several options:
- Pinecone (managed service)
- Weaviate (self-hosted or cloud)
- Chroma (lightweight, Python-focused)
- pgvector (PostgreSQL extension)

## Decision
We will use Pinecone as our vector database service.

## Consequences

### Positive
- Fully managed service with high reliability
- Excellent performance for similarity search
- Simple API and good documentation
- Scales automatically
- Free tier available for development
- Works well with Google's embedding models

### Negative
- Additional external dependency
- Costs can increase with scale
- Data stored outside our primary platform
- Network latency for queries

### Integration Details
- API Key stored in environment variables
- Serverless deployment model
- Dimensions: 768 (for text embeddings)
- Metric: Cosine similarity
- Index created per environment (dev/prod)