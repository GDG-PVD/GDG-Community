"""Vector database interface for the knowledge management system."""

import os
from typing import Dict, List, Optional, Any, Union
import pinecone
from pinecone.core.client.configuration import Configuration as PineconeConfiguration

class VectorStore:
    """
    Interface with Pinecone vector database for knowledge storage and retrieval.
    
    This class provides methods for storing and retrieving knowledge items using
    vector embeddings for semantic search.
    """
    
    def __init__(
        self,
        api_key: Optional[str] = None,
        environment: Optional[str] = None,
        namespace_prefix: str = "gdg",
    ):
        """
        Initialize the vector store.
        
        Args:
            api_key: Pinecone API key (defaults to environment variable)
            environment: Pinecone environment (defaults to environment variable)
            namespace_prefix: Prefix for Pinecone namespaces
        """
        self.api_key = api_key or os.environ.get("PINECONE_API_KEY")
        self.environment = environment or os.environ.get("PINECONE_ENVIRONMENT")
        self.namespace_prefix = namespace_prefix
        self._initialized = False
        self._index_name = "gdg-companion"
        
    def initialize(self):
        """Initialize the Pinecone client and create index if needed."""
        if not self._initialized:
            # Initialize Pinecone
            pinecone.init(
                api_key=self.api_key,
                environment=self.environment
            )
            
            # Check if index exists, create if not
            if self._index_name not in pinecone.list_indexes():
                pinecone.create_index(
                    name=self._index_name,
                    dimension=768,  # Using Gemini embedding dimension
                    metric="cosine"
                )
                
            # Connect to the index
            self.index = pinecone.Index(self._index_name)
            self._initialized = True
    
    def get_namespace(self, chapter_id: str, layer: str) -> str:
        """
        Get the namespace for a specific chapter and knowledge layer.
        
        Args:
            chapter_id: The ID of the GDG chapter
            layer: The knowledge layer (semantic, kinetic, or dynamic)
            
        Returns:
            Formatted namespace string
        """
        return f"{self.namespace_prefix}-{chapter_id}-{layer}"
    
    async def store_item(
        self,
        chapter_id: str,
        layer: str,
        item_id: str,
        embedding: List[float],
        metadata: Dict[str, Any],
    ):
        """
        Store a knowledge item in the vector database.
        
        Args:
            chapter_id: The ID of the GDG chapter
            layer: The knowledge layer (semantic, kinetic, or dynamic)
            item_id: Unique ID for the knowledge item
            embedding: Vector embedding for the item
            metadata: Additional metadata for the item
        """
        if not self._initialized:
            self.initialize()
            
        namespace = self.get_namespace(chapter_id, layer)
        
        # Upsert the vector into Pinecone
        self.index.upsert(
            vectors=[(item_id, embedding, metadata)],
            namespace=namespace
        )
    
    async def query(
        self,
        chapter_id: str,
        layer: str,
        query_embedding: List[float],
        filter: Optional[Dict[str, Any]] = None,
        top_k: int = 5,
    ) -> List[Dict[str, Any]]:
        """
        Query the vector database for similar items.
        
        Args:
            chapter_id: The ID of the GDG chapter
            layer: The knowledge layer (semantic, kinetic, or dynamic)
            query_embedding: Vector embedding for the query
            filter: Optional metadata filter
            top_k: Number of results to return
            
        Returns:
            List of matching items with metadata
        """
        if not self._initialized:
            self.initialize()
            
        namespace = self.get_namespace(chapter_id, layer)
        
        # Query Pinecone
        results = self.index.query(
            namespace=namespace,
            vector=query_embedding,
            filter=filter,
            top_k=top_k,
            include_metadata=True
        )
        
        # Format results
        matches = []
        for match in results.matches:
            matches.append({
                "id": match.id,
                "score": match.score,
                "metadata": match.metadata
            })
            
        return matches
