# Agent Development with Google ADK

## Overview

This guide explains how to develop agents using Google Agent Development Kit (ADK) best practices in the GDG Community Companion project.

## Why ADK?

Google ADK provides:
- Standardized agent interfaces
- Built-in tool management
- Session handling
- Error handling patterns
- Model configuration management

## Getting Started

### 1. Install Dependencies

```bash
pip install google-genai google-generativeai
```

### 2. Create Your Agent

All agents should inherit from `BaseAgent`:

```python
from src.agents.base_agent import BaseAgent, AgentConfig, Tool
from src.agents.adk_compat import AgentResponse

class MyCustomAgent(BaseAgent):
    def __init__(self):
        config = AgentConfig(
            name="my_custom_agent",
            description="An agent that does something useful",
            model="gemini-1.5-flash",
            temperature=0.7
        )
        super().__init__(config)
        
    def _setup_tools(self):
        """Register tools for this agent."""
        self.register_tool(Tool(
            name="example_tool",
            description="An example tool",
            input_schema={
                "type": "object",
                "properties": {
                    "query": {"type": "string"}
                },
                "required": ["query"]
            },
            function=self._example_tool_function
        ))
        
    async def _example_tool_function(self, query: str) -> str:
        """Example tool implementation."""
        return f"Processed: {query}"
        
    async def process(self, input_data: Dict[str, Any]) -> AgentResponse:
        """Process input and return response."""
        # Your agent logic here
        return AgentResponse(
            content="Response from agent",
            metadata={"processed": True}
        )
```

### 3. Use the ADK Compatibility Layer

The `adk_compat.py` module provides compatibility with ADK v0.5.0:

```python
from src.agents.adk_compat import create_agent_executor, Tool, AgentResponse

# Create an agent executor
executor = create_agent_executor(
    agent=my_agent,
    tools=my_agent.get_tools(),
    model_config={"model": "gemini-1.5-flash"}
)

# Run the agent
response = await executor.run({"query": "What is GDG?"})
```

## Best Practices

### 1. Tool Design
- Keep tools focused on a single responsibility
- Use clear, descriptive names
- Define comprehensive input schemas
- Handle errors gracefully

### 2. Agent Structure
- One agent per file
- Clear separation of concerns
- Comprehensive docstrings
- Type hints throughout

### 3. Error Handling
```python
async def process(self, input_data: Dict[str, Any]) -> AgentResponse:
    try:
        # Your logic
        result = await self._do_something(input_data)
        return AgentResponse(content=result)
    except Exception as e:
        logger.error(f"Error in {self.config.name}: {e}")
        return AgentResponse(
            content="I encountered an error processing your request.",
            metadata={"error": str(e)}
        )
```

### 4. Testing
```python
import pytest
from src.agents.my_agent import MyAgent

@pytest.mark.asyncio
async def test_my_agent():
    agent = MyAgent()
    response = await agent.process({"query": "test"})
    assert response.content is not None
    assert "error" not in response.metadata
```

## Migration from Basic Agents

If you have existing agents without ADK:

### Before (Basic Agent)
```python
class SimpleAgent:
    def __init__(self, name):
        self.name = name
        
    def process(self, input_text):
        return f"Processed: {input_text}"
```

### After (ADK-Compatible Agent)
```python
from src.agents.base_agent import BaseAgent, AgentConfig
from src.agents.adk_compat import AgentResponse

class SimpleAgent(BaseAgent):
    def __init__(self):
        config = AgentConfig(
            name="simple_agent",
            description="A simple processing agent"
        )
        super().__init__(config)
        
    async def process(self, input_data: Dict[str, Any]) -> AgentResponse:
        input_text = input_data.get("text", "")
        result = f"Processed: {input_text}"
        return AgentResponse(content=result)
```

## Advanced Features

### Session Management
```python
from src.agents.adk_compat import Session

# Create a session
session = Session(session_id="user-123")

# Use session in agent
response = await agent.process(
    input_data={"query": "Hello"},
    session=session
)

# Session maintains context across calls
```

### Custom Tools with Complex Schemas
```python
tool = Tool(
    name="search_events",
    description="Search for GDG events",
    input_schema={
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "Search query"
            },
            "filters": {
                "type": "object",
                "properties": {
                    "date_from": {"type": "string", "format": "date"},
                    "date_to": {"type": "string", "format": "date"},
                    "location": {"type": "string"}
                }
            },
            "limit": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100,
                "default": 10
            }
        },
        "required": ["query"]
    },
    function=search_events_function
)
```

## Troubleshooting

### Common Issues

1. **Import Errors**
   - Ensure you have the latest ADK compatibility layer
   - Check Python path includes the project root

2. **Async/Await Issues**
   - All agent methods should be async
   - Use `asyncio.run()` for testing

3. **Tool Registration**
   - Tools must be registered in `_setup_tools()`
   - Check tool schemas are valid JSON Schema

## Resources

- [Google ADK Documentation](https://github.com/google/generative-ai-python)
- [ADR-028: ADK Best Practices](../architecture/decisions/0028-adk-best-practices-implementation.md)
- [Example Agents](../../../examples/agents/)
