"""Example of a simple agent using ADK patterns."""

from typing import Dict, Any
from src.agents.base_agent import BaseAgent, AgentConfig
from src.agents.adk_compat import AgentResponse


class SimpleGreetingAgent(BaseAgent):
    """A simple agent that generates greetings."""
    
    def __init__(self):
        config = AgentConfig(
            name="greeting_agent",
            description="An agent that generates personalized greetings",
            temperature=0.9  # Higher temperature for more creative greetings
        )
        super().__init__(config)
        
    async def process(self, input_data: Dict[str, Any]) -> AgentResponse:
        """Generate a greeting based on input."""
        name = input_data.get("name", "friend")
        context = input_data.get("context", "general")
        
        # In a real implementation, this would use the LLM
        # For this example, we'll use simple logic
        if context == "morning":
            greeting = f"Good morning, {name}! Hope you have a wonderful day ahead."
        elif context == "event":
            greeting = f"Welcome to our GDG event, {name}! We're excited to have you here."
        else:
            greeting = f"Hello, {name}! Great to see you in our GDG community."
            
        return AgentResponse(
            content=greeting,
            metadata={
                "agent": self.config.name,
                "context": context
            }
        )


# Example usage
if __name__ == "__main__":
    import asyncio
    
    async def main():
        agent = SimpleGreetingAgent()
        
        # Test the agent
        response = await agent.process({
            "name": "Alice",
            "context": "event"
        })
        
        print(f"Response: {response.content}")
        print(f"Metadata: {response.metadata}")
    
    asyncio.run(main())
