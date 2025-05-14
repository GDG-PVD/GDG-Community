"""Core orchestrator agent for the GDG Community Companion."""

import json
from typing import Dict, List, Optional, Any, Tuple
from google.adk.agents import Agent
from google.adk.tools import Tool

# Import specialized agents
from .content_agent import ContentAgent
from .knowledge_agent import KnowledgeAgent

# Import knowledge services
from ..knowledge.vector_store import VectorStore
from ..knowledge.embedding_service import EmbeddingService

class CoreAgent:
    """
    Core orchestrator agent that coordinates all specialized sub-agents.
    
    This agent serves as the primary interface for users, handling intent recognition
    and routing tasks to the appropriate specialized agents based on the three-layer
    knowledge architecture.
    """
    
    def __init__(
        self, 
        chapter_id: str,
        model_name: str = "gemini-2.0-pro",
        vector_store: Optional[VectorStore] = None,
        embedding_service: Optional[EmbeddingService] = None,
    ):
        """
        Initialize the core agent.
        
        Args:
            chapter_id: The ID of the GDG chapter (e.g., "gdg-providence")
            model_name: The Gemini model to use
            vector_store: Vector database for knowledge storage and retrieval
            embedding_service: Service for generating text embeddings
        """
        self.chapter_id = chapter_id
        self.model_name = model_name
        self.vector_store = vector_store or VectorStore()
        self.embedding_service = embedding_service or EmbeddingService()
        self.specialized_agents = {}
        self.sub_agents = {}
        self._initialize_specialized_agents()
        self._initialize_agent()
        
    def _initialize_agent(self):
        """Initialize the ADK agent with appropriate tools and sub-agents."""
        # Define core agent tools
        tools = [
            Tool(
                name="get_chapter_info",
                description="Get information about the GDG chapter",
                function=self._get_chapter_info,
            ),
            Tool(
                name="determine_intent",
                description="Determine the user's intent from their query",
                function=self._determine_intent,
            ),
            Tool(
                name="route_to_specialized_agent",
                description="Route the query to a specialized agent",
                function=self._route_to_specialized_agent,
            ),
            Tool(
                name="generate_social_media_content",
                description="Generate social media content for an event",
                function=self._generate_social_media_content,
            ),
            Tool(
                name="retrieve_knowledge",
                description="Retrieve knowledge on a specific topic",
                function=self._retrieve_knowledge,
            ),
            Tool(
                name="store_knowledge",
                description="Store new knowledge in the knowledge system",
                function=self._store_knowledge,
            ),
        ]
        
        # Create the core ADK agent
        self.agent = Agent(
            name=f"gdg_{self.chapter_id}_assistant",
            model=self.model_name,
            description=f"Community assistant for {self.chapter_id} that manages knowledge and content generation",
            tools=tools,
        )
    
    def _initialize_specialized_agents(self):
        """Initialize specialized agents with shared knowledge store."""
        # Content Generation Agent
        self.specialized_agents["content"] = ContentAgent(
            chapter_id=self.chapter_id,
            model_name=self.model_name,
            vector_store=self.vector_store,
            embedding_service=self.embedding_service,
        )
        
        # Knowledge Management Agent
        self.specialized_agents["knowledge"] = KnowledgeAgent(
            chapter_id=self.chapter_id,
            model_name=self.model_name,
            vector_store=self.vector_store,
            embedding_service=self.embedding_service,
        )
        
        # For ADK sub-agents, we would integrate the agents as follows:
        self.sub_agents["content"] = self.specialized_agents["content"].agent
        self.sub_agents["knowledge"] = self.specialized_agents["knowledge"].agent
    
    def _get_chapter_info(self) -> Dict[str, Any]:
        """
        Get information about the GDG chapter.
        
        Returns:
            Dict containing chapter information
        """
        # This would typically retrieve info from a database
        return {
            "chapter_id": self.chapter_id,
            "name": f"GDG {self.chapter_id.split('-')[1].capitalize()}",
            "member_count": 150,  # Example data
            "founded": "2019",    # Example data
            "website": f"https://gdg.community.dev/{self.chapter_id}",
            "social_media": {
                "twitter": f"@GDG{self.chapter_id.split('-')[1].capitalize()}",
                "linkedin": f"https://linkedin.com/company/gdg-{self.chapter_id.split('-')[1]}",
                "facebook": f"https://facebook.com/GDG{self.chapter_id.split('-')[1].capitalize()}",
            }
        }
    
    async def _determine_intent(self, query: str) -> Dict[str, Any]:
        """
        Determine the user's intent from their query.
        
        Args:
            query: The user's query or request
            
        Returns:
            Dictionary with intent classification
        """
        # Create a prompt to analyze the intent
        prompt = f"""
        Analyze the following query and determine the intent:
        
        "{query}"
        
        Possible intents:
        1. Content Generation: Create social media content, event announcements, etc.
        2. Knowledge Retrieval: Get information about past events, templates, brand guidelines
        3. Knowledge Storage: Add new information to the knowledge base
        4. Analytics: Get insights on past content performance
        5. Planning: Schedule content or events
        6. General: General questions or requests
        
        Return a JSON object with:
        - primary_intent: The main intent
        - specialized_agent: Which agent to route to (content, knowledge, analytics, planning)
        - details: Any extracted details from the query (e.g., platform, event name)
        """
        
        # Generate the intent classification
        response = await self.agent.generate_content(prompt)
        
        # Parse the JSON - in a real implementation, ensure proper error handling
        try:
            intent = json.loads(response.text)
            return intent
        except json.JSONDecodeError:
            # Fallback if the LLM doesn't produce valid JSON
            if "content" in response.text.lower() or "social" in response.text.lower():
                return {
                    "primary_intent": "Content Generation",
                    "specialized_agent": "content",
                    "details": {"query": query}
                }
            elif "knowledge" in response.text.lower() or "information" in response.text.lower():
                return {
                    "primary_intent": "Knowledge Retrieval",
                    "specialized_agent": "knowledge",
                    "details": {"query": query}
                }
            else:
                return {
                    "primary_intent": "General",
                    "specialized_agent": None,
                    "details": {"query": query}
                }
    
    async def _route_to_specialized_agent(self, intent: Dict[str, Any]) -> Dict[str, Any]:
        """
        Route the query to a specialized agent based on intent.
        
        Args:
            intent: Intent classification dictionary
            
        Returns:
            The specialized agent's response
        """
        agent_name = intent.get("specialized_agent")
        details = intent.get("details", {})
        query = details.get("query", "")
        
        if not agent_name or agent_name not in self.specialized_agents:
            # Handle with the core agent if no specialized agent is needed
            return {
                "source": "core",
                "response": "I don't have a specialized agent for that yet. How else can I help you?"
            }
            
        # Route to the appropriate specialized agent
        agent = self.specialized_agents[agent_name]
        
        if agent_name == "content":
            # For content agent, we need specific details
            platform = details.get("platform", "twitter")  # Default to Twitter
            event_data = details.get("event_data", {})
            
            # If we don't have event data but have a query, try to extract it
            if not event_data and query:
                event_data = await self._extract_event_data(query)
                
            # Generate content
            response = await agent.generate_content(platform, event_data)
            return {
                "source": agent_name,
                "response": response
            }
            
        elif agent_name == "knowledge":
            # For knowledge agent, determine if we're retrieving or storing
            if intent.get("primary_intent") == "Knowledge Retrieval":
                topic = details.get("topic", query)
                response = await agent.get_knowledge_summary(topic)
                return {
                    "source": agent_name,
                    "response": response
                }
            elif intent.get("primary_intent") == "Knowledge Storage":
                content = details.get("content", {"text": query})
                item_id = await agent._store_knowledge(content)
                return {
                    "source": agent_name,
                    "response": f"Knowledge stored successfully with ID: {item_id}"
                }
        
        # Fallback response if we couldn't route properly
        return {
            "source": "core",
            "response": "I couldn't process that request through a specialized agent. Could you provide more details?"
        }
    
    async def _extract_event_data(self, query: str) -> Dict[str, Any]:
        """
        Extract event data from a natural language query.
        
        Args:
            query: The user's query
            
        Returns:
            Structured event data
        """
        # Create a prompt to extract event details
        prompt = f"""
        Extract structured event data from the following query:
        
        "{query}"
        
        Return a JSON object with event details including:
        - title: The event title
        - date: The event date
        - time: The event time
        - description: A brief description
        - link: Registration or info link (if available)
        - type: The type of event (e.g., workshop, meetup, webinar)
        """
        
        # Generate the structured data
        response = await self.agent.generate_content(prompt)
        
        # Parse the JSON - in a real implementation, ensure proper error handling
        try:
            event_data = json.loads(response.text)
            return event_data
        except json.JSONDecodeError:
            # Fallback to a basic event structure
            return {
                "title": "GDG Event",
                "date": "Upcoming",
                "description": query,
                "type": "meetup"
            }
    
    async def _generate_social_media_content(
        self, 
        platform: str, 
        event_data: Dict[str, Any], 
        template_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generate social media content for an event.
        
        Args:
            platform: The social media platform
            event_data: Data about the event
            template_id: Optional template ID to use
            
        Returns:
            Generated content
        """
        # Delegate to the content agent
        content_agent = self.specialized_agents["content"]
        response = await content_agent.generate_content(platform, event_data, template_id)
        return response
    
    async def _retrieve_knowledge(
        self, 
        query: str, 
        layer: Optional[str] = None, 
        content_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Retrieve knowledge on a specific topic.
        
        Args:
            query: The search query
            layer: Optional layer to search in
            content_type: Optional type of content to search for
            
        Returns:
            Knowledge summary
        """
        # Delegate to the knowledge agent
        knowledge_agent = self.specialized_agents["knowledge"]
        summary = await knowledge_agent.get_knowledge_summary(query)
        return summary
    
    async def _store_knowledge(
        self, 
        content: Dict[str, Any], 
        layer: Optional[str] = None, 
        content_type: Optional[str] = None
    ) -> str:
        """
        Store new knowledge in the knowledge system.
        
        Args:
            content: The knowledge content
            layer: Optional explicit layer
            content_type: Optional explicit type
            
        Returns:
            ID of the stored knowledge
        """
        # Delegate to the knowledge agent
        knowledge_agent = self.specialized_agents["knowledge"]
        item_id = await knowledge_agent._store_knowledge(content, layer, content_type)
        return item_id
    
    async def process(self, query: str) -> Dict[str, Any]:
        """
        Process a user query through the agent system.
        
        Args:
            query: The user's query or request
            
        Returns:
            The agent's response
        """
        # Determine intent
        intent = await self._determine_intent(query)
        
        # Route to specialized agent if needed
        if intent.get("specialized_agent"):
            response = await self._route_to_specialized_agent(intent)
            
            # If the response is structured data, format it for user presentation
            if isinstance(response.get("response"), dict):
                result = self._format_response_for_user(response.get("response"))
                return {"text": result, "data": response.get("response")}
            
            return {"text": response.get("response")}
        
        # Fall back to core agent for general queries
        response = await self.agent.generate_content(query)
        return {"text": response.text}
    
    def _format_response_for_user(self, data: Dict[str, Any]) -> str:
        """Format structured data as a human-readable response."""
        # If it's a social media post
        if "text" in data and "platform" in data:
            platform = data.get("platform", "").capitalize()
            return f"Here's your {platform} post:\n\n{data['text']}"
            
        # If it's a knowledge summary
        if "summary" in data:
            return data["summary"]
            
        # Generic JSON formatting
        return json.dumps(data, indent=2)
