"""Tests for ADK compatibility layer."""

import pytest
from src.agents.adk_compat import (
    BaseAgent, Tool, AgentResponse, Session,
    create_agent_executor
)


class TestADKCompat:
    """Test the ADK compatibility layer."""
    
    def test_tool_creation(self):
        """Test creating a tool with schema."""
        def sample_function(text: str) -> str:
            return f"Processed: {text}"
            
        tool = Tool(
            name="sample_tool",
            description="A sample tool",
            input_schema={
                "type": "object",
                "properties": {
                    "text": {"type": "string"}
                },
                "required": ["text"]
            },
            function=sample_function
        )
        
        assert tool.name == "sample_tool"
        assert tool.description == "A sample tool"
        assert "properties" in tool.input_schema
        
    def test_agent_response(self):
        """Test AgentResponse creation."""
        response = AgentResponse(
            content="Test response",
            metadata={"key": "value"}
        )
        
        assert response.content == "Test response"
        assert response.metadata["key"] == "value"
        
    def test_session(self):
        """Test session management."""
        session = Session(session_id="test-123")
        
        # Add to history
        session.add_to_history("user", "Hello")
        session.add_to_history("assistant", "Hi there!")
        
        history = session.get_history()
        assert len(history) == 2
        assert history[0]["role"] == "user"
        assert history[1]["content"] == "Hi there!"
        
    @pytest.mark.asyncio
    async def test_base_agent(self):
        """Test base agent functionality."""
        class TestAgent(BaseAgent):
            def __init__(self):
                super().__init__(
                    name="test_agent",
                    description="Test agent",
                    model_config={"model": "gemini-1.5-flash"}
                )
                
            async def run(self, input_data, session=None):
                return AgentResponse(
                    content="Test successful",
                    metadata={"input": input_data}
                )
                
        agent = TestAgent()
        response = await agent.run({"test": "data"})
        
        assert response.content == "Test successful"
        assert response.metadata["input"]["test"] == "data"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
