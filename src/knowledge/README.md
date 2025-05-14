# Knowledge Management System

This directory contains the implementation of the three-layer knowledge architecture.

## Architecture

The knowledge management system is built around three core layers:

1. **Semantic Layer**: Base knowledge including content templates, brand guidelines, etc.
2. **Kinetic Layer**: Process knowledge including workflows, strategies, and procedures.
3. **Dynamic Layer**: Evolutionary knowledge including metrics, learned patterns, and adaptations.

## Components

- `vector_store.py`: Interface with Pinecone vector database
- `postgres_store.py`: Interface with PostgreSQL for structured data
- `embedding_service.py`: Generate embeddings for text data
- `knowledge_service.py`: Core service for accessing knowledge across layers
- `semantic_layer.py`: Implementation of the Semantic Layer
- `kinetic_layer.py`: Implementation of the Kinetic Layer
- `dynamic_layer.py`: Implementation of the Dynamic Layer

## Usage

To use the knowledge management system:

```python
from gdg_community.knowledge import KnowledgeService

# Initialize the knowledge service
knowledge = KnowledgeService(chapter_id="gdg-providence")

# Access the semantic layer
templates = knowledge.semantic.get_templates(category="event")

# Access the kinetic layer
workflow = knowledge.kinetic.get_workflow(name="event-promotion")

# Access the dynamic layer
patterns = knowledge.dynamic.get_learned_patterns(content_type="twitter-post")
```

## Extension

To add new knowledge components, follow these steps:

1. Define your data model in the appropriate layer
2. Implement storage and retrieval functions
3. Add appropriate embeddings for vector search
4. Register your component with the knowledge service
