"""Knowledge management agent for the GDG Community Companion."""

from typing import Dict, List, Optional, Any, Union
from google.adk.agents import Agent
from google.adk.tools import Tool

# Import the knowledge management system
from ..knowledge.vector_store import VectorStore
from ..knowledge.embedding_service import EmbeddingService

class KnowledgeAgent:
    """
    Specialized agent for knowledge management and retrieval.
    
    This agent manages the three-layer knowledge architecture:
    1. Semantic Layer: Static information (templates, brand guidelines)
    2. Kinetic Layer: Process knowledge (workflows, procedures)
    3. Dynamic Layer: Evolutionary knowledge (learned patterns, performance data)
    
    It provides tools for storing, retrieving, and updating knowledge across all layers.
    """
    
    def __init__(
        self, 
        chapter_id: str,
        model_name: str = "gemini-2.0-pro",
        vector_store: Optional[VectorStore] = None,
        embedding_service: Optional[EmbeddingService] = None,
    ):
        """
        Initialize the knowledge agent.
        
        Args:
            chapter_id: The ID of the GDG chapter
            model_name: The Gemini model to use
            vector_store: Vector database for knowledge storage and retrieval
            embedding_service: Service for generating text embeddings
        """
        self.chapter_id = chapter_id
        self.model_name = model_name
        self.vector_store = vector_store or VectorStore()
        self.embedding_service = embedding_service or EmbeddingService()
        self._initialize_agent()
        
    def _initialize_agent(self):
        """Initialize the ADK agent with appropriate tools."""
        # Define agent tools
        tools = [
            Tool(
                name="store_knowledge",
                description="Store knowledge in the appropriate layer",
                function=self._store_knowledge,
            ),
            Tool(
                name="retrieve_knowledge",
                description="Retrieve knowledge from the knowledge store",
                function=self._retrieve_knowledge,
            ),
            Tool(
                name="update_knowledge",
                description="Update existing knowledge in the store",
                function=self._update_knowledge,
            ),
            Tool(
                name="generate_summary",
                description="Generate a summary from multiple knowledge items",
                function=self._generate_summary,
            ),
            Tool(
                name="categorize_knowledge",
                description="Categorize knowledge into the appropriate layer",
                function=self._categorize_knowledge,
            ),
        ]
        
        # Create the ADK agent
        self.agent = Agent(
            name=f"knowledge_specialist_{self.chapter_id}",
            model=self.model_name,
            description="Manages the three-layer knowledge architecture for the GDG chapter",
            tools=tools,
        )
    
    async def _categorize_knowledge(self, content: Union[str, Dict[str, Any]]) -> Dict[str, Any]:
        """
        Categorize knowledge into the appropriate layer and type.
        
        Args:
            content: The knowledge content to categorize
            
        Returns:
            Dictionary with layer and type information
        """
        # Prepare content for the LLM
        if isinstance(content, dict):
            content_str = f"Title: {content.get('title', '')}\nContent: {content.get('content', '')}"
        else:
            content_str = content
            
        # Create a prompt for categorizing the knowledge
        prompt = f"""
        Categorize the following content into the appropriate knowledge layer and type:
        
        {content_str}
        
        Knowledge Layers:
        1. Semantic Layer: Static, foundational information (templates, guidelines, definitions)
        2. Kinetic Layer: Process knowledge and workflows
        3. Dynamic Layer: Learning and evolving knowledge based on performance
        
        Common Types:
        - template: Content templates
        - brand_voice: Brand voice guidelines
        - workflow: Process workflows
        - procedure: Step-by-step procedures
        - best_practice: Best practices and recommendations
        - performance_data: Performance metrics and learnings
        
        Return a JSON object with layer and type.
        """
        
        # Generate the categorization
        response = await self.agent.generate_content(prompt)
        
        # Parse the response - in a real implementation, ensure proper JSON parsing
        # This is a simplified approach
        import json
        try:
            categorization = json.loads(response.text)
            return categorization
        except json.JSONDecodeError:
            # Fallback if the LLM doesn't produce valid JSON
            if "semantic" in response.text.lower():
                layer = "semantic"
            elif "dynamic" in response.text.lower():
                layer = "dynamic"
            else:
                layer = "kinetic"
                
            if "template" in response.text.lower():
                type_ = "template"
            elif "brand" in response.text.lower():
                type_ = "brand_voice"
            elif "workflow" in response.text.lower():
                type_ = "workflow"
            elif "procedure" in response.text.lower():
                type_ = "procedure"
            elif "practice" in response.text.lower():
                type_ = "best_practice"
            elif "performance" in response.text.lower():
                type_ = "performance_data"
            else:
                type_ = "general"
                
            return {"layer": layer, "type": type_}
    
    async def _store_knowledge(
        self, 
        content: Dict[str, Any],
        layer: Optional[str] = None,
        content_type: Optional[str] = None,
        auto_categorize: bool = True
    ) -> str:
        """
        Store knowledge in the appropriate layer.
        
        Args:
            content: The knowledge content to store
            layer: Optional explicit layer to store in
            content_type: Optional explicit type for the content
            auto_categorize: Whether to automatically categorize if layer/type not provided
            
        Returns:
            ID of the stored knowledge item
        """
        # Initialize if needed
        if not self.vector_store._initialized:
            self.vector_store.initialize()
            
        # Auto-categorize if needed
        if (not layer or not content_type) and auto_categorize:
            categorization = await self._categorize_knowledge(content)
            layer = layer or categorization.get("layer")
            content_type = content_type or categorization.get("type")
        
        # Default to kinetic layer if not specified
        layer = layer or "kinetic"
        content_type = content_type or "general"
        
        # Generate an embedding for the content
        embedding = await self.embedding_service.generate_content_embeddings(content)
        
        # Prepare metadata
        metadata = {
            "type": content_type,
            "content": content,
            "created_at": "2025-05-14T12:00:00Z",  # Use actual datetime in production
        }
        
        # Generate a unique ID
        import uuid
        item_id = f"{content_type}_{uuid.uuid4()}"
        
        # Store in the vector database
        await self.vector_store.store_item(
            chapter_id=self.chapter_id,
            layer=layer,
            item_id=item_id,
            embedding=embedding,
            metadata=metadata
        )
        
        return item_id
    
    async def _retrieve_knowledge(
        self,
        query: str,
        layer: Optional[str] = None,
        content_type: Optional[str] = None,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Retrieve knowledge from the knowledge store.
        
        Args:
            query: The query text to search for
            layer: Optional layer to search in (if None, searches all layers)
            content_type: Optional type to filter by
            top_k: Number of results to return
            
        Returns:
            List of matching knowledge items
        """
        # Initialize if needed
        if not self.vector_store._initialized:
            self.vector_store.initialize()
            
        # Generate embedding for the query
        query_embedding = await self.embedding_service.generate_embeddings(query)
        
        # Prepare filter
        filter_dict = {}
        if content_type:
            filter_dict["type"] = content_type
            
        # If layer is specified, search only that layer
        if layer:
            results = await self.vector_store.query(
                chapter_id=self.chapter_id,
                layer=layer,
                query_embedding=query_embedding,
                filter=filter_dict,
                top_k=top_k
            )
            return results
            
        # If no layer specified, search all layers in priority order
        all_results = []
        
        # Semantic layer first (foundational knowledge)
        semantic_results = await self.vector_store.query(
            chapter_id=self.chapter_id,
            layer="semantic",
            query_embedding=query_embedding,
            filter=filter_dict,
            top_k=top_k
        )
        all_results.extend(semantic_results)
        
        # Dynamic layer next (learned patterns)
        dynamic_results = await self.vector_store.query(
            chapter_id=self.chapter_id,
            layer="dynamic",
            query_embedding=query_embedding,
            filter=filter_dict,
            top_k=top_k
        )
        all_results.extend(dynamic_results)
        
        # Kinetic layer last (process knowledge)
        kinetic_results = await self.vector_store.query(
            chapter_id=self.chapter_id,
            layer="kinetic",
            query_embedding=query_embedding,
            filter=filter_dict,
            top_k=top_k
        )
        all_results.extend(kinetic_results)
        
        # Sort by relevance score and return top_k
        sorted_results = sorted(all_results, key=lambda x: x["score"], reverse=True)
        return sorted_results[:top_k]
    
    async def _update_knowledge(
        self,
        item_id: str,
        layer: str,
        updated_content: Dict[str, Any]
    ) -> bool:
        """
        Update existing knowledge in the store.
        
        Args:
            item_id: ID of the item to update
            layer: Layer where the item is stored
            updated_content: Updated content for the item
            
        Returns:
            Success status
        """
        # Initialize if needed
        if not self.vector_store._initialized:
            self.vector_store.initialize()
            
        # Generate new embedding for the updated content
        new_embedding = await self.embedding_service.generate_content_embeddings(updated_content)
        
        # Prepare updated metadata
        metadata = {
            "type": updated_content.get("type", "general"),
            "content": updated_content,
            "updated_at": "2025-05-14T12:00:00Z",  # Use actual datetime in production
        }
        
        # Store in the vector database (overwriting the existing item)
        await self.vector_store.store_item(
            chapter_id=self.chapter_id,
            layer=layer,
            item_id=item_id,
            embedding=new_embedding,
            metadata=metadata
        )
        
        return True
    
    async def _generate_summary(
        self,
        query: str,
        layer: Optional[str] = None,
        content_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generate a summary from multiple knowledge items.
        
        Args:
            query: The query text to search for
            layer: Optional layer to search in
            content_type: Optional type to filter by
            
        Returns:
            Generated summary
        """
        # Retrieve relevant knowledge items
        results = await self._retrieve_knowledge(
            query=query,
            layer=layer,
            content_type=content_type,
            top_k=10
        )
        
        if not results:
            return {"summary": "No relevant knowledge found."}
            
        # Prepare content for summarization
        prompt_parts = [
            f"Generate a comprehensive summary on the topic: {query}\n\n",
            "Based on the following knowledge items:\n\n"
        ]
        
        for i, result in enumerate(results):
            content = result["metadata"]["content"]
            prompt_parts.append(f"Item {i+1}:\n")
            
            if isinstance(content, dict):
                if "title" in content:
                    prompt_parts.append(f"Title: {content['title']}\n")
                if "content" in content:
                    prompt_parts.append(f"Content: {content['content']}\n")
                else:
                    # Fall back to using the whole dict
                    prompt_parts.append(f"{content}\n")
            else:
                prompt_parts.append(f"{content}\n")
            
            prompt_parts.append("\n")
            
        prompt_parts.append("\nGenerate a concise but comprehensive summary that synthesizes this information.")
        
        # Generate the summary
        prompt = "".join(prompt_parts)
        response = await self.agent.generate_content(prompt)
        
        # Return the summary
        return {
            "summary": response.text,
            "sources": [{"id": r["id"], "score": r["score"]} for r in results[:5]]
        }
    
    async def store_template(self, template: Dict[str, Any]) -> str:
        """
        Store a content template in the semantic layer.
        
        Args:
            template: The template definition
            
        Returns:
            ID of the stored template
        """
        return await self._store_knowledge(
            content=template,
            layer="semantic",
            content_type="template",
            auto_categorize=False
        )
    
    async def store_brand_guidelines(self, guidelines: Dict[str, Any]) -> str:
        """
        Store brand guidelines in the semantic layer.
        
        Args:
            guidelines: The brand guidelines definition
            
        Returns:
            ID of the stored guidelines
        """
        return await self._store_knowledge(
            content=guidelines,
            layer="semantic",
            content_type="brand_voice",
            auto_categorize=False
        )
    
    async def store_workflow(self, workflow: Dict[str, Any]) -> str:
        """
        Store a workflow in the kinetic layer.
        
        Args:
            workflow: The workflow definition
            
        Returns:
            ID of the stored workflow
        """
        return await self._store_knowledge(
            content=workflow,
            layer="kinetic",
            content_type="workflow",
            auto_categorize=False
        )
    
    async def store_performance_data(self, performance_data: Dict[str, Any]) -> str:
        """
        Store performance data in the dynamic layer.
        
        Args:
            performance_data: The performance data
            
        Returns:
            ID of the stored data
        """
        return await self._store_knowledge(
            content=performance_data,
            layer="dynamic",
            content_type="performance_data",
            auto_categorize=False
        )
    
    async def get_knowledge_summary(self, topic: str) -> Dict[str, Any]:
        """
        Get a comprehensive summary of knowledge on a specific topic.
        
        Args:
            topic: The topic to summarize
            
        Returns:
            Summary and source information
        """
        return await self._generate_summary(query=topic)