# Migrating to Google ADK

This guide helps you migrate existing agents to use Google ADK patterns.

## Why Migrate?

Benefits of using ADK patterns:
- Standardized interfaces
- Better tool management
- Improved error handling
- Consistent logging
- Session support

## Migration Steps

### Step 1: Update Agent Base Class

**Before:**
```python
class MyAgent:
    def __init__(self, name):
        self.name = name
```

**After:**
```python
from src.agents.base_agent import BaseAgent, AgentConfig

class MyAgent(BaseAgent):
    def __init__(self):
        config = AgentConfig(
            name="my_agent",
            description="My agent description"
        )
        super().__init__(config)
```

### Step 2: Convert Methods to Async

**Before:**
```python
def process(self, text):
    return f"Result: {text}"
```

**After:**
```python
async def process(self, input_data: Dict[str, Any]) -> AgentResponse:
    text = input_data.get("text", "")
    result = f"Result: {text}"
    return AgentResponse(content=result)
```

### Step 3: Add Tool Support

**Before:**
```python
def search(self, query):
    # Direct function call
    return search_database(query)
```

**After:**
```python
def _setup_tools(self):
    self.register_tool(Tool(
        name="search",
        description="Search the database",
        input_schema={
            "type": "object",
            "properties": {
                "query": {"type": "string"}
            },
            "required": ["query"]
        },
        function=self._search_tool
    ))
    
async def _search_tool(self, query: str) -> List[Dict]:
    return search_database(query)
```

### Step 4: Update Tests

**Before:**
```python
def test_agent():
    agent = MyAgent("test")
    result = agent.process("hello")
    assert result == "Result: hello"
```

**After:**
```python
@pytest.mark.asyncio
async def test_agent():
    agent = MyAgent()
    response = await agent.process({"text": "hello"})
    assert response.content == "Result: hello"
```

## Common Patterns

### Pattern 1: Chain of Thought
```python
async def process(self, input_data: Dict[str, Any]) -> AgentResponse:
    # Step 1: Analyze input
    analysis = await self._analyze(input_data)
    
    # Step 2: Generate plan
    plan = await self._generate_plan(analysis)
    
    # Step 3: Execute plan
    result = await self._execute_plan(plan)
    
    return AgentResponse(
        content=result,
        metadata={
            "analysis": analysis,
            "plan": plan
        }
    )
```

### Pattern 2: Error Recovery
```python
async def process(self, input_data: Dict[str, Any]) -> AgentResponse:
    max_retries = 3
    
    for attempt in range(max_retries):
        try:
            result = await self._try_process(input_data)
            return AgentResponse(content=result)
        except Exception as e:
            if attempt == max_retries - 1:
                return AgentResponse(
                    content="Unable to process request",
                    metadata={"error": str(e)}
                )
            await asyncio.sleep(2 ** attempt)  # Exponential backoff
```

### Pattern 3: Multi-Tool Orchestration
```python
async def process(self, input_data: Dict[str, Any]) -> AgentResponse:
    # Use multiple tools in sequence
    search_results = await self._search_tool(input_data["query"])
    
    summaries = []
    for result in search_results[:5]:
        summary = await self._summarize_tool(result["content"])
        summaries.append(summary)
    
    final_summary = await self._combine_summaries_tool(summaries)
    
    return AgentResponse(
        content=final_summary,
        metadata={
            "sources": len(search_results),
            "summaries_generated": len(summaries)
        }
    )
```

## Checklist

Before considering your migration complete:

- [ ] All agents inherit from `BaseAgent`
- [ ] All processing methods are async
- [ ] Tools are properly registered with schemas
- [ ] Error handling is implemented
- [ ] Tests are updated to use async
- [ ] Type hints are added throughout
- [ ] Docstrings are comprehensive
- [ ] Logging is implemented

## Next Steps

1. Start with one simple agent
2. Migrate incrementally
3. Test thoroughly at each step
4. Update documentation
5. Share learnings with the team
