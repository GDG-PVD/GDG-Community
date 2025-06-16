# GDG Community Companion - AI Agent System

This directory contains the implementation of the enhanced multi-agent system using Google's Agent Development Kit (ADK) with Stage 1 Agentic AI capabilities.

## Agent Architecture

### Core Agents
- `core_agent.py`: Memory-enhanced conversation agent with three-layer knowledge integration
- `content_agent.py`: Specialized agent for AI-powered content generation
- `knowledge_agent.py`: Unified knowledge management across semantic/kinetic/dynamic layers
- `reflection_agent.py`: Self-improvement and learning analysis agent

### Memory & Learning System
- `enhanced_memory_service.py`: Stage 1 Agentic AI memory implementation
  - Episodic memory: Conversation and interaction history
  - Semantic memory: Structured knowledge and concepts
  - Reflection memory: Learning insights and improvements

## Key Features

### Enhanced Memory System (Stage 1 Agentic AI)
- **Episodic Memory**: Stores and recalls specific interactions and events
- **Semantic Memory**: Maintains structured knowledge base with vector search
- **Reflection Memory**: Captures learning insights and optimization opportunities
- **Memory Integration**: Seamless access across all memory types for context-aware responses

### Three-Layer Knowledge Architecture
- **Semantic Layer**: Templates, guidelines, and static knowledge
- **Kinetic Layer**: Workflows, processes, and procedures
- **Dynamic Layer**: Adaptive patterns and performance metrics

### Google ADK Compatibility
- Full compatibility with Google Agent Development Kit
- Compatibility layer for seamless integration
- Production-ready deployment on Google Cloud

## Usage

### Basic Agent Interaction
```python
from src.agents.core_agent import CoreAgent
from src.agents.enhanced_memory_service import EnhancedMemoryService

# Initialize memory service
memory_service = EnhancedMemoryService()

# Create core agent with memory
agent = CoreAgent(memory_service=memory_service)

# Process user input with memory context
response = await agent.process_message(
    "Generate a LinkedIn post for our Flutter workshop",
    user_id="user123",
    context={"chapter_id": "gdg-providence"}
)
```

### Content Generation
```python
from src.agents.content_agent import ContentAgent

content_agent = ContentAgent()

# Generate social media content
post = await content_agent.generate_social_post(
    event_data={
        "title": "Flutter Workshop",
        "date": "2025-06-15",
        "location": "Tech Hub"
    },
    platform="linkedin",
    tone="professional"
)
```

### Knowledge Management
```python
from src.knowledge.knowledge_service import KnowledgeService

knowledge = KnowledgeService()

# Search across all knowledge layers
results = await knowledge.search(
    query="Flutter state management best practices",
    layers=["semantic", "kinetic", "dynamic"]
)
```

### Memory Analytics
```python
from src.agents.reflection_agent import ReflectionAgent

reflection = ReflectionAgent(memory_service)

# Analyze conversation patterns
insights = await reflection.analyze_conversation_patterns()

# Get learning recommendations
recommendations = await reflection.get_learning_recommendations()
```

## Architecture Decisions

This implementation follows several key architectural decisions:

- **ADR-0028**: Google ADK Best Practices Implementation
- **ADR-0034**: Stage 1 Enhanced Memory Implementation
- **ADR-0035**: Three-Layer Knowledge Architecture Implementation

See `/docs/architecture/decisions/` for detailed architectural documentation.

## Extension Guide

### Adding New Agents

1. **Create Agent Class:**
```python
from src.agents.base_agent import BaseAgent

class MyCustomAgent(BaseAgent):
    async def process(self, input_data, context=None):
        # Implement agent logic
        return response
```

2. **Register with Core Agent:**
```python
# In core_agent.py
from .my_custom_agent import MyCustomAgent

class CoreAgent:
    def __init__(self):
        self.custom_agent = MyCustomAgent()
```

3. **Add Memory Integration:**
```python
class MyCustomAgent(BaseAgent):
    def __init__(self, memory_service):
        self.memory = memory_service
    
    async def process(self, input_data, context=None):
        # Retrieve relevant memories
        memories = await self.memory.retrieve_memories(
            query=input_data,
            memory_type="semantic"
        )
        
        # Store new learning
        await self.memory.store_memory(
            content="Agent learned X",
            memory_type="reflection"
        )
```

### Memory Types

- **Episodic**: Use for conversation history, user interactions
- **Semantic**: Use for structured knowledge, templates, facts
- **Reflection**: Use for learning insights, performance analysis

## Development

### Testing
```bash
# Run agent tests
pytest tests/unit/agents/ -v

# Test specific agent
pytest tests/unit/agents/test_enhanced_memory_service.py

# Test with coverage
pytest tests/unit/agents/ --cov=src/agents
```

### Environment Setup
```bash
# Install dependencies
uv pip install -r requirements.txt

# Set up environment variables
cp src/.env.example src/.env
# Configure ADK credentials and API keys
```

## Production Deployment

### Google Cloud Setup
1. Enable ADK API in Google Cloud Console
2. Create service account with ADK permissions
3. Configure Pinecone vector database
4. Deploy Firebase Cloud Functions

### Security Considerations
- Never expose memory service directly to clients
- Implement proper authentication for agent endpoints
- Use environment variables for all credentials
- Apply rate limiting to prevent abuse

## Monitoring & Analytics

The agent system provides built-in monitoring:
- Memory usage and growth tracking
- Agent performance metrics
- Learning effectiveness analysis
- Knowledge base utilization stats

Access via the Memory Dashboard in the UI or through the reflection agent APIs.
