"""Vector database interface for the knowledge management system."""

import os
from typing import Dict, List, Optional, Any, Union

class VectorStore:
    """
    Interface with Pinecone vector database for knowledge storage and retrieval.
    
    This class provides methods for storing and retrieving knowledge items using
    vector embeddings for semantic search.
    """
    
    def __init__(
        self,
        api_key: Optional[str] = None,
        index_name: Optional[str] = None,
        namespace_prefix: str = "gdg",
    ):
        """
        Initialize the vector store.
        
        Args:
            api_key: Pinecone API key (defaults to environment variable)
            index_name: Pinecone index name (defaults to environment variable)
            namespace_prefix: Prefix for Pinecone namespaces
        """
        self.api_key = api_key or os.environ.get("PINECONE_API_KEY")
        self._index_name = index_name or os.environ.get("PINECONE_INDEX_NAME", "gdg-community")
        self.namespace_prefix = namespace_prefix
        self._initialized = False
        
    def initialize(self):
        """Initialize the Pinecone client and create index if needed."""
        from pinecone import Pinecone
        
        if not self._initialized:
            # Initialize Pinecone with new API
            self._pc = Pinecone(api_key=self.api_key)
            
            # Check if index exists
            existing_indexes = [idx.name for idx in self._pc.list_indexes()]
            if self._index_name not in existing_indexes:
                raise ValueError(f"Index '{self._index_name}' does not exist. Please create it in the Pinecone dashboard.")
                
            # Connect to the index
            self.index = self._pc.Index(self._index_name)
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
