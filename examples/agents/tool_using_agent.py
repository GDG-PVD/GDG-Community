"""Example of an agent that uses tools."""

from typing import Dict, Any, List
from datetime import datetime
from src.agents.base_agent import BaseAgent, AgentConfig
from src.agents.adk_compat import AgentResponse, Tool


class EventManagementAgent(BaseAgent):
    """An agent that helps manage GDG events using tools."""
    
    def __init__(self):
        config = AgentConfig(
            name="event_management_agent",
            description="An agent that helps create and manage GDG events",
            model="gemini-1.5-flash"
        )
        super().__init__(config)
        self.events_db = []  # Simple in-memory storage for example
        
    def _setup_tools(self):
        """Register tools for event management."""
        self.register_tool(Tool(
            name="create_event",
            description="Create a new GDG event",
            input_schema={
                "type": "object",
                "properties": {
                    "title": {"type": "string"},
                    "date": {"type": "string", "format": "date"},
                    "description": {"type": "string"},
                    "location": {"type": "string"}
                },
                "required": ["title", "date", "description"]
            },
            function=self._create_event
        ))
        
        self.register_tool(Tool(
            name="list_events",
            description="List all upcoming events",
            input_schema={
                "type": "object",
                "properties": {
                    "limit": {
                        "type": "integer",
                        "minimum": 1,
                        "maximum": 50,
                        "default": 10
                    }
                }
            },
            function=self._list_events
        ))
        
    async def _create_event(self, title: str, date: str, description: str, 
                          location: str = "Online") -> Dict[str, Any]:
        """Tool function to create an event."""
        event = {
            "id": len(self.events_db) + 1,
            "title": title,
            "date": date,
            "description": description,
            "location": location,
            "created_at": datetime.now().isoformat()
        }
        self.events_db.append(event)
        return event
        
    async def _list_events(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Tool function to list events."""
        return self.events_db[-limit:]
        
    async def process(self, input_data: Dict[str, Any]) -> AgentResponse:
        """Process event-related requests."""
        action = input_data.get("action")
        
        if action == "create":
            # Use the create_event tool
            event = await self._create_event(
                title=input_data.get("title", ""),
                date=input_data.get("date", ""),
                description=input_data.get("description", ""),
                location=input_data.get("location", "Online")
            )
            return AgentResponse(
                content=f"Event '{event['title']}' created successfully!",
                metadata={"event": event}
            )
            
        elif action == "list":
            # Use the list_events tool
            events = await self._list_events(limit=input_data.get("limit", 10))
            return AgentResponse(
                content=f"Found {len(events)} events",
                metadata={"events": events}
            )
            
        else:
            return AgentResponse(
                content="Please specify an action: 'create' or 'list'",
                metadata={"available_actions": ["create", "list"]}
            )


# Example usage
if __name__ == "__main__":
    import asyncio
    
    async def main():
        agent = EventManagementAgent()
        
        # Create an event
        response = await agent.process({
            "action": "create",
            "title": "Introduction to Gemini API",
            "date": "2025-06-15",
            "description": "Learn how to build with Google's Gemini API",
            "location": "GDG Providence Meetup Space"
        })
        print(f"Create Response: {response.content}")
        
        # List events
        response = await agent.process({
            "action": "list",
            "limit": 5
        })
        print(f"\nList Response: {response.content}")
        print(f"Events: {response.metadata['events']}")
    
    asyncio.run(main())
