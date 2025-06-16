"""Enhanced Memory Service for Stage 1 agent evolution.

This module implements sophisticated memory capabilities including:
- Episodic memory for interaction history
- Semantic memory for domain knowledge
- Reflection mechanisms for self-improvement
- Cross-session context preservation
"""

import json
import logging
import uuid
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, asdict
from enum import Enum

# Import vector store and embedding services
from ..knowledge.vector_store import VectorStore
from ..knowledge.embedding_service import EmbeddingService

# Set up logging
logger = logging.getLogger(__name__)

class MemoryType(Enum):
    """Types of memory in the enhanced memory system."""
    EPISODIC = "episodic"
    SEMANTIC = "semantic"
    REFLECTION = "reflection"

@dataclass
class EpisodicMemory:
    """Structure for episodic memory entries."""
    session_id: str
    timestamp: datetime
    agent_id: str
    user_input: str
    agent_response: str
    context: Dict[str, Any]
    metadata: Dict[str, Any]
    memory_id: Optional[str] = None
    
    def __post_init__(self):
        if self.memory_id is None:
            self.memory_id = f"ep_{self.session_id}_{int(self.timestamp.timestamp())}"

@dataclass
class SemanticMemory:
    """Structure for semantic memory entries."""
    domain: str
    concept: str
    content: str
    relationships: Dict[str, Any]
    metadata: Dict[str, Any]
    memory_id: Optional[str] = None
    
    def __post_init__(self):
        if self.memory_id is None:
            self.memory_id = f"sem_{self.domain}_{uuid.uuid4().hex[:8]}"

@dataclass
class ReflectionMemory:
    """Structure for reflection memory entries."""
    reflection_id: str
    session_id: str
    timestamp: datetime
    analysis: str
    insights: List[str]
    recommendations: List[str]
    metrics: Dict[str, float]
    memory_id: Optional[str] = None
    
    def __post_init__(self):
        if self.memory_id is None:
            self.memory_id = f"ref_{self.reflection_id}_{int(self.timestamp.timestamp())}"

class EnhancedMemoryService:
    """
    Enhanced memory service implementing Stage 1 memory capabilities.
    
    This service provides sophisticated memory management with:
    - Episodic memory for interaction histories
    - Semantic memory for domain knowledge
    - Reflection mechanisms for self-improvement
    - Vector-based retrieval for relevant memories
    """
    
    def __init__(
        self,
        vector_store: VectorStore,
        embedding_service: EmbeddingService,
        chapter_id: str,
        namespace_prefix: str = "memory"
    ):
        """
        Initialize the enhanced memory service.
        
        Args:
            vector_store: Vector database for memory storage
            embedding_service: Service for generating embeddings
            chapter_id: GDG chapter identifier
            namespace_prefix: Prefix for memory namespaces
        """
        self.vector_store = vector_store
        self.embedding_service = embedding_service
        self.chapter_id = chapter_id
        self.namespace_prefix = namespace_prefix
        
        # Initialize vector store
        self.vector_store.initialize()
        
        # Memory namespaces
        self.episodic_namespace = f"{namespace_prefix}_episodic_{chapter_id}"
        self.semantic_namespace = f"{namespace_prefix}_semantic_{chapter_id}"
        self.reflection_namespace = f"{namespace_prefix}_reflection_{chapter_id}"
        
        logger.info(f"Enhanced memory service initialized for chapter {chapter_id}")
    
    async def store_episodic_memory(self, memory: EpisodicMemory) -> str:
        """
        Store an episodic memory with rich context.
        
        Args:
            memory: The episodic memory to store
            
        Returns:
            The memory ID of the stored memory
        """
        try:
            # Generate embedding from user input and agent response
            text_content = f"User: {memory.user_input}\nAgent: {memory.agent_response}"
            embedding = await self.embedding_service.embed_text(text_content)
            
            # Prepare metadata
            metadata = {
                "type": MemoryType.EPISODIC.value,
                "session_id": memory.session_id,
                "timestamp": memory.timestamp.isoformat(),
                "agent_id": memory.agent_id,
                "user_input": memory.user_input[:500],  # Truncate for metadata limits
                "agent_response": memory.agent_response[:500],
                "context": json.dumps(memory.context),
                "chapter_id": self.chapter_id,
                **memory.metadata
            }
            
            # Store in vector database
            await self.vector_store.upsert_vectors(
                vectors=[{
                    "id": memory.memory_id,
                    "values": embedding,
                    "metadata": metadata
                }],
                namespace=self.episodic_namespace
            )
            
            logger.info(f"Stored episodic memory {memory.memory_id}")
            return memory.memory_id
            
        except Exception as e:
            logger.error(f"Error storing episodic memory: {e}")
            raise
    
    async def store_semantic_memory(self, memory: SemanticMemory) -> str:
        """
        Store a semantic memory entry.
        
        Args:
            memory: The semantic memory to store
            
        Returns:
            The memory ID of the stored memory
        """
        try:
            # Generate embedding from concept and content
            text_content = f"Domain: {memory.domain}\nConcept: {memory.concept}\nContent: {memory.content}"
            embedding = await self.embedding_service.embed_text(text_content)
            
            # Prepare metadata
            metadata = {
                "type": MemoryType.SEMANTIC.value,
                "domain": memory.domain,
                "concept": memory.concept,
                "content": memory.content[:500],  # Truncate for metadata limits
                "relationships": json.dumps(memory.relationships),
                "chapter_id": self.chapter_id,
                **memory.metadata
            }
            
            # Store in vector database
            await self.vector_store.upsert_vectors(
                vectors=[{
                    "id": memory.memory_id,
                    "values": embedding,
                    "metadata": metadata
                }],
                namespace=self.semantic_namespace
            )
            
            logger.info(f"Stored semantic memory {memory.memory_id}")
            return memory.memory_id
            
        except Exception as e:
            logger.error(f"Error storing semantic memory: {e}")
            raise
    
    async def store_reflection_memory(self, memory: ReflectionMemory) -> str:
        """
        Store a reflection memory entry.
        
        Args:
            memory: The reflection memory to store
            
        Returns:
            The memory ID of the stored memory
        """
        try:
            # Generate embedding from analysis and insights
            text_content = f"Analysis: {memory.analysis}\nInsights: {'; '.join(memory.insights)}"
            embedding = await self.embedding_service.embed_text(text_content)
            
            # Prepare metadata
            metadata = {
                "type": MemoryType.REFLECTION.value,
                "reflection_id": memory.reflection_id,
                "session_id": memory.session_id,
                "timestamp": memory.timestamp.isoformat(),
                "analysis": memory.analysis[:500],  # Truncate for metadata limits
                "insights": json.dumps(memory.insights),
                "recommendations": json.dumps(memory.recommendations),
                "metrics": json.dumps(memory.metrics),
                "chapter_id": self.chapter_id
            }
            
            # Store in vector database
            await self.vector_store.upsert_vectors(
                vectors=[{
                    "id": memory.memory_id,
                    "values": embedding,
                    "metadata": metadata
                }],
                namespace=self.reflection_namespace
            )
            
            logger.info(f"Stored reflection memory {memory.memory_id}")
            return memory.memory_id
            
        except Exception as e:
            logger.error(f"Error storing reflection memory: {e}")
            raise
    
    async def retrieve_relevant_memories(
        self,
        query: str,
        memory_types: List[MemoryType],
        k: int = 5,
        session_id: Optional[str] = None
    ) -> Dict[str, List[Dict]]:
        """
        Retrieve relevant memories across specified types.
        
        Args:
            query: Search query for relevant memories
            memory_types: Types of memory to search
            k: Number of memories to retrieve per type
            session_id: Optional session filter
            
        Returns:
            Dictionary mapping memory types to lists of relevant memories
        """
        try:
            # Generate embedding for query
            query_embedding = await self.embedding_service.embed_text(query)
            
            results = {}
            
            for memory_type in memory_types:
                # Determine namespace
                if memory_type == MemoryType.EPISODIC:
                    namespace = self.episodic_namespace
                elif memory_type == MemoryType.SEMANTIC:
                    namespace = self.semantic_namespace
                elif memory_type == MemoryType.REFLECTION:
                    namespace = self.reflection_namespace
                else:
                    continue
                
                # Build filter
                filter_dict = {"chapter_id": self.chapter_id}
                if session_id:
                    filter_dict["session_id"] = session_id
                
                # Search vector database
                search_results = await self.vector_store.query_vectors(
                    vector=query_embedding,
                    top_k=k,
                    namespace=namespace,
                    filter_dict=filter_dict
                )
                
                # Extract memories
                memories = []
                for match in search_results.get("matches", []):
                    memory_data = match.get("metadata", {})
                    memory_data["score"] = match.get("score", 0.0)
                    memories.append(memory_data)
                
                results[memory_type.value] = memories
            
            logger.info(f"Retrieved memories for query: {query}")
            return results
            
        except Exception as e:
            logger.error(f"Error retrieving memories: {e}")
            raise
    
    async def get_session_memories(self, session_id: str) -> List[Dict]:
        """
        Get all memories for a specific session.
        
        Args:
            session_id: The session identifier
            
        Returns:
            List of memories from the session
        """
        try:
            # Search episodic memories for session
            filter_dict = {
                "session_id": session_id,
                "chapter_id": self.chapter_id
            }
            
            # Query with a dummy vector (we just want filtered results)
            dummy_query = await self.embedding_service.embed_text("session memories")
            
            search_results = await self.vector_store.query_vectors(
                vector=dummy_query,
                top_k=100,  # Get many results
                namespace=self.episodic_namespace,
                filter_dict=filter_dict
            )
            
            # Extract and sort memories by timestamp
            memories = []
            for match in search_results.get("matches", []):
                memory_data = match.get("metadata", {})
                memories.append(memory_data)
            
            # Sort by timestamp
            memories.sort(key=lambda x: x.get("timestamp", ""))
            
            logger.info(f"Retrieved {len(memories)} memories for session {session_id}")
            return memories
            
        except Exception as e:
            logger.error(f"Error getting session memories: {e}")
            raise
    
    async def cleanup_old_memories(self, days_to_keep: int = 30) -> int:
        """
        Clean up old memories beyond retention period.
        
        Args:
            days_to_keep: Number of days to retain memories
            
        Returns:
            Number of memories cleaned up
        """
        try:
            cutoff_date = datetime.now(timezone.utc) - timedelta(days=days_to_keep)
            cutoff_timestamp = cutoff_date.isoformat()
            
            # This is a simplified implementation
            # In production, you'd want to batch delete operations
            
            logger.info(f"Cleanup would remove memories older than {cutoff_timestamp}")
            
            # For now, return 0 as actual cleanup requires more complex querying
            return 0
            
        except Exception as e:
            logger.error(f"Error cleaning up memories: {e}")
            raise
    
    async def get_memory_statistics(self) -> Dict[str, Any]:
        """
        Get statistics about stored memories.
        
        Returns:
            Dictionary with memory statistics
        """
        try:
            stats = {
                "chapter_id": self.chapter_id,
                "namespaces": {
                    "episodic": self.episodic_namespace,
                    "semantic": self.semantic_namespace,
                    "reflection": self.reflection_namespace
                },
                "memory_counts": {
                    "episodic": 0,
                    "semantic": 0,
                    "reflection": 0
                }
            }
            
            # Note: Actual count retrieval would require vector store stats API
            logger.info(f"Memory statistics for chapter {self.chapter_id}")
            return stats
            
        except Exception as e:
            logger.error(f"Error getting memory statistics: {e}")
            raise