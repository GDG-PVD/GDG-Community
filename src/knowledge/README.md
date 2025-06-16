# Three-Layer Knowledge Management System

This directory implements the comprehensive three-layer knowledge architecture that forms the foundation of the GDG Community Companion's intelligence system.

## Architecture Overview

The knowledge management system organizes information into three interconnected layers, each serving a specific purpose in the AI agent ecosystem:

### 1. Semantic Layer (Static Knowledge)
**Purpose**: Foundational knowledge that changes infrequently
- **Content Templates**: Social media post formats, email templates
- **Brand Guidelines**: Visual identity, messaging standards, tone of voice
- **Event Formats**: Workshop structures, meetup templates, study jam guides
- **Technical Documentation**: Setup guides, best practices, troubleshooting

### 2. Kinetic Layer (Process Knowledge)
**Purpose**: Dynamic workflows and procedures that evolve with experience
- **Content Workflows**: Post creation → review → approval → publishing
- **Event Workflows**: Planning → promotion → execution → follow-up
- **Engagement Strategies**: Platform-specific content optimization
- **Automation Sequences**: Triggered actions and decision trees

### 3. Dynamic Layer (Adaptive Knowledge)
**Purpose**: Learning and pattern recognition from real-world performance
- **Performance Metrics**: Engagement rates, attendance patterns, conversion data
- **Content Patterns**: What works best for different audiences and platforms
- **Behavioral Insights**: User preferences, optimal timing, trending topics
- **Optimization Rules**: Automatically learned improvements and adaptations

## Key Components

### Core Services
- `knowledge_service.py`: **Unified access point** for all knowledge layers with intelligent routing
- `vector_store.py`: **Pinecone integration** for semantic search and similarity matching
- `embedding_service.py`: **Text embeddings** for vector search and content similarity

### Layer Implementations
- `semantic_layer.py`: **Static knowledge management** with template and guideline storage
- `kinetic_layer.py`: **Workflow engine** with process automation and decision trees
- `dynamic_layer.py`: **Learning system** with pattern recognition and metric analysis

### Integration Components
- `postgres_store.py`: **Structured data storage** for relational information
- `firebase_integration.py`: **Real-time sync** with Firebase Firestore
- `cache_manager.py`: **Performance optimization** with intelligent caching

## Advanced Usage

### Unified Knowledge Access
```python
from src.knowledge.knowledge_service import KnowledgeService

# Initialize with chapter context
knowledge = KnowledgeService(chapter_id="gdg-providence")

# Cross-layer intelligent search
results = await knowledge.search(
    query="Flutter workshop promotion strategy",
    layers=["semantic", "kinetic", "dynamic"],
    include_context=True
)

# Layer-specific access with memory integration
templates = await knowledge.get_semantic_knowledge(
    category="event_templates",
    subcategory="workshop",
    filters={"technology": "flutter"}
)
```

### Content Generation Integration
```python
# Generate content using all knowledge layers
content_data = await knowledge.generate_content_context(
    event_type="workshop",
    technology="flutter",
    platform="linkedin"
)

# Includes:
# - Semantic: Template and guidelines
# - Kinetic: Optimal posting workflow
# - Dynamic: Performance-based recommendations
```

### Workflow Automation
```python
# Execute dynamic workflow based on context
workflow_result = await knowledge.execute_workflow(
    workflow_name="event_promotion",
    context={
        "event_id": "flutter-workshop-001",
        "platforms": ["linkedin", "bluesky"],
        "urgency": "high"
    }
)
```

### Learning and Adaptation
```python
# Store performance data for learning
await knowledge.record_performance(
    content_id="post_123",
    metrics={
        "engagement_rate": 0.045,
        "click_through_rate": 0.12,
        "platform": "linkedin"
    }
)

# Retrieve optimized recommendations
recommendations = await knowledge.get_optimization_recommendations(
    content_type="event_promotion",
    platform="linkedin"
)
```

## Vector Search Integration

### Semantic Search Capabilities
```python
from src.knowledge.vector_store import VectorStore

vector_store = VectorStore()

# Similarity search across all knowledge
similar_content = await vector_store.similarity_search(
    query="Mobile app development workshop",
    namespace="gdg-providence",
    top_k=10,
    filters={"type": "event_template"}
)

# Hybrid search combining vector and metadata
hybrid_results = await vector_store.hybrid_search(
    query="effective social media strategy",
    metadata_filters={
        "layer": "kinetic",
        "success_rate": {"$gte": 0.8}
    }
)
```

### Embedding Management
```python
from src.knowledge.embedding_service import EmbeddingService

embedding_service = EmbeddingService()

# Generate embeddings for new content
embeddings = await embedding_service.generate_embeddings([
    "Flutter workshop announcement",
    "Hands-on mobile development session"
])

# Store with metadata
await vector_store.upsert_vectors(
    vectors=embeddings,
    metadata=[
        {"type": "event_title", "technology": "flutter"},
        {"type": "event_description", "format": "workshop"}
    ]
)
```

## Performance Optimization

### Caching Strategy
```python
# Intelligent caching with TTL
cached_templates = await knowledge.get_cached_templates(
    category="social_media",
    ttl=3600  # 1 hour cache
)

# Cache invalidation on updates
await knowledge.invalidate_cache(
    patterns=["templates:*", "workflows:event_*"]
)
```

### Batch Operations
```python
# Bulk knowledge updates
batch_updates = [
    {"layer": "semantic", "action": "update_template", "data": template_data},
    {"layer": "dynamic", "action": "record_metric", "data": performance_data}
]

await knowledge.batch_update(batch_updates)
```

## Integration with Agent System

### Memory Service Integration
```python
from src.agents.enhanced_memory_service import EnhancedMemoryService

# Knowledge feeds into agent memory
memory_service = EnhancedMemoryService()

# Store knowledge-derived insights in agent memory
await memory_service.store_memory(
    content="LinkedIn posts with technical details get 40% higher engagement",
    memory_type="semantic",
    source="knowledge_analysis",
    metadata={"platform": "linkedin", "confidence": 0.89}
)
```

### Real-time Learning Loop
```python
# Agent learns from knowledge patterns
knowledge_insights = await knowledge.get_latest_insights()

for insight in knowledge_insights:
    await memory_service.store_memory(
        content=insight.description,
        memory_type="reflection",
        source="knowledge_system",
        relevance=insight.confidence_score
    )
```

## Architecture Decision Records

This implementation follows key architectural decisions:
- **ADR-0001**: Three-layer knowledge architecture foundation
- **ADR-0035**: Three-layer knowledge architecture implementation details
- **ADR-0006**: Pinecone vector database selection for semantic search

See `/docs/architecture/decisions/` for complete architectural documentation.

## Development Guidelines

### Adding New Knowledge Types

1. **Determine the appropriate layer:**
   - **Semantic**: Static, reference information
   - **Kinetic**: Process and workflow information  
   - **Dynamic**: Learning and adaptive information

2. **Implement data model:**
```python
from dataclasses import dataclass
from typing import List, Dict, Any

@dataclass
class NewKnowledgeType:
    id: str
    content: str
    metadata: Dict[str, Any]
    embeddings: List[float]
    layer: str = "semantic"
```

3. **Add storage and retrieval methods:**
```python
async def store_new_knowledge(self, knowledge: NewKnowledgeType):
    # Store in appropriate layer
    # Generate embeddings
    # Update vector store
    
async def retrieve_new_knowledge(self, query: str, filters: Dict):
    # Search logic
    # Return formatted results
```

### Testing Knowledge Components

```bash
# Run knowledge system tests
pytest tests/unit/knowledge/ -v

# Test specific layer
pytest tests/unit/knowledge/test_semantic_layer.py

# Integration tests with vector store
pytest tests/integration/test_knowledge_integration.py

# Performance tests
pytest tests/performance/test_knowledge_performance.py
```

### Monitoring and Analytics

The knowledge system provides comprehensive monitoring:
- **Usage Analytics**: Track which knowledge is accessed most frequently
- **Performance Metrics**: Monitor search speed and relevance scores
- **Learning Effectiveness**: Measure improvement in content performance
- **Vector Store Health**: Monitor embedding quality and similarity scores

Access via the Knowledge Dashboard in the UI or through the knowledge service APIs.

## Production Considerations

### Scalability
- Vector store partitioning by chapter/organization
- Incremental embedding updates
- Distributed caching for high-traffic scenarios

### Security
- Access controls by user role and chapter membership
- Encryption for sensitive knowledge data
- Audit logging for knowledge access and modifications

### Backup and Recovery
- Regular vector store backups
- Knowledge export/import capabilities
- Disaster recovery procedures for critical knowledge
