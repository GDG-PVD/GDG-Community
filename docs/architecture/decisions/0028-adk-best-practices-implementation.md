# ADR-0028: Google ADK Best Practices Implementation

## Status

Accepted

## Context

Following our review of the Google Agent Development Kit (ADK) documentation and comparison with our existing implementation, we identified several gaps in our agent system that needed to be addressed to align with ADK best practices. The goal was to enhance our agents with production-ready features while maintaining compatibility with our existing architecture.

## Decision

We will implement the following ADK best practices across all agents in our system:

### 1. Session Management
- Implement `google.adk.sessions.Session` for conversation context
- Add `ConversationTurn` tracking for all interactions
- Provide methods to clear and retrieve session history

### 2. Tool Parameter Schemas
- Define complete JSON Schema for all tool parameters
- Include type definitions, descriptions, and validation rules
- Specify required vs optional parameters explicitly

### 3. Model Configuration
- Use `ModelConfig` for fine-tuned control over model behavior
- Implement temperature strategies:
  - ContentAgent: 0.8 (creative outputs)
  - KnowledgeAgent: 0.3 (precise responses)
  - CoreAgent: 0.7 (balanced approach)
- Configure `SafetySettings` appropriate for community management

### 4. Error Handling
- Wrap all ADK calls in try-except blocks
- Implement graceful fallbacks for API failures
- Add structured logging for debugging
- Return success/error status in responses

### 5. Sub-Agent Integration
- Initialize sub-agents before main agent creation
- Pass sub-agents to Agent constructor
- Maintain proper delegation hierarchy

### 6. Streaming Support
- Add `enable_streaming` parameter to all agents
- Pass streaming flag to `generate_content` calls
- Maintain session context during streaming

## Related Decisions

This ADR builds upon and relates to several other architectural decisions:

### Foundation Decisions
- **[ADR-0002](./0002-multi-agent-architecture.md)**: Multi-Agent Architecture with ADK - Establishes the basic agent architecture that this ADR enhances
- **[ADR-0003](./0003-knowledge-integrated-agent-system.md)**: Knowledge-Integrated Agent System - Defines how agents interact with the knowledge system

### Implementation Context
- **[ADR-0034](./0034-stage-1-enhanced-memory-implementation.md)**: Stage 1 Enhanced Memory Implementation - Memory system that agents utilize
- **[ADR-0035](./0035-three-layer-knowledge-architecture-implementation.md)**: Three-Layer Knowledge Architecture Implementation - Knowledge layers that agents access

### Platform Integration
- **[ADR-0004](./0004-firebase-platform.md)**: Firebase as Primary Platform - Platform where agents operate
- **[ADR-0006](./0006-pinecone-vector-database.md)**: Pinecone for Vector Database - Vector storage used by agents for memory and knowledge

### Security and Deployment
- **[ADR-0036](./0036-open-source-feature-transfer.md)**: Open Source Feature Transfer - How these implementations are shared in the open source version

## Implementation Details

### CoreAgent Changes
```python
# Added imports
from google.adk.sessions import Session, ConversationTurn
from google.adk.common import ModelConfig, SafetySettings

# Enhanced initialization
self.session = Session()
self.model_config = ModelConfig(
    temperature=0.7,
    top_p=0.95,
    max_output_tokens=2048
)
```

### Tool Schema Example
```python
Tool(
    name="generate_social_media_content",
    function=self._generate_social_media_content,
    parameters={
        "type": "object",
        "properties": {
            "platform": {
                "type": "string",
                "enum": ["linkedin", "bluesky"],
                "description": "The social media platform"
            },
            "event_data": {
                "type": "object",
                "description": "Event information"
            }
        },
        "required": ["platform", "event_data"]
    }
)
```

### Error Handling Pattern
```python
try:
    response = await self.agent.generate_content(
        prompt,
        session=self.session,
        stream=self.enable_streaming
    )
    return {"success": True, "text": response.text}
except Exception as e:
    logger.error(f"Error: {e}")
    return {"success": False, "error": str(e)}
```

## Consequences

### Positive
- **Improved Reliability**: Error handling prevents crashes and provides graceful degradation
- **Better Context**: Session management enables multi-turn conversations
- **Type Safety**: Parameter schemas catch errors early and improve tool reliability
- **Flexibility**: Model configuration allows fine-tuning for different use cases
- **Production Ready**: Aligns with Google's recommended patterns for production deployments

### Negative
- **Increased Complexity**: More code and configuration to maintain
- **Breaking Changes**: Existing code using agents needs updates for new response format
- **Memory Usage**: Session management increases memory footprint per agent instance

### Neutral
- **Performance**: Minimal impact on response times
- **Testing**: Requires new test cases for all enhanced features

## Testing Strategy

1. **Unit Tests**: Created `test_adk_enhancements.py` to verify:
   - Session management functionality
   - Tool parameter schema validation
   - Error handling behavior
   - Model configuration effects

2. **Integration Tests**: Created `test_adk_integration.py` to verify:
   - End-to-end conversation flows
   - Sub-agent delegation
   - Error recovery scenarios
   - Streaming functionality

## Implementation Reality

### ADK API Differences
During implementation, we discovered significant differences between our design expectations and the actual ADK API (v0.5.0):
- `ConversationTurn` class doesn't exist in ADK
- `Tool` class is actually `FunctionTool` with different constructor
- `ModelConfig` and `SafetySettings` are not available as expected
- Agent names must be valid Python identifiers (no hyphens)
- Sub-agents must be ADK Agent instances, not custom wrappers

### Compatibility Layer Solution
We implemented `adk_compat.py` to bridge these differences:
- Custom `Session`, `ConversationTurn`, `ModelConfig`, and `SafetySettings` classes
- `Tool` wrapper that creates ADK `FunctionTool` instances
- `Agent` wrapper that stores our enhancements while using ADK internally
- Automatic name sanitization (replacing hyphens with underscores)

### What Works
- ✅ Session management (with our custom implementation)
- ✅ Model configuration storage and access
- ✅ Tool creation with parameter schemas (stored but not validated by ADK)
- ✅ Error handling patterns
- ✅ Sub-agent coordination (through compatibility layer)
- ✅ Different agent configurations (temperature, etc.)

### Limitations
- Parameter schemas are stored but not enforced by current ADK
- Session management is custom, not integrated with ADK
- Model configuration doesn't affect actual ADK behavior
- `generate_content` returns mock responses in compatibility layer

## Migration Path

1. ✅ Created compatibility layer (`adk_compat.py`)
2. ✅ Updated all agents to use compatibility imports
3. ✅ Fixed agent naming to comply with ADK requirements
4. ✅ Adjusted sub-agent integration to use ADK instances
5. Future: Update when ADK API evolves to match our patterns

## References

- [Google ADK Documentation](https://github.com/google/adk)
- [ADR-0002: Multi-agent architecture](0002-multi-agent-architecture.md)
- [ADR-0003: Knowledge-integrated agent system](0003-knowledge-integrated-agent-system.md)

## Date

2025-05-24