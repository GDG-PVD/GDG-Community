"""Core Knowledge Service implementing the three-layer knowledge architecture.

This service provides unified access to the Semantic, Kinetic, and Dynamic layers
of the GDG Community knowledge system.
"""

import logging
from typing import Dict, List, Optional, Any, Union
from datetime import datetime, timezone

from .vector_store import VectorStore
from .embedding_service import EmbeddingService
from .semantic_layer import SemanticLayer
from .kinetic_layer import KineticLayer
from .dynamic_layer import DynamicLayer

# Set up logging
logger = logging.getLogger(__name__)

class KnowledgeService:
    """
    Core service for accessing knowledge across all three layers.
    
    This service coordinates access to:
    - Semantic Layer: Static knowledge (templates, guidelines, concepts)
    - Kinetic Layer: Process knowledge (workflows, strategies, procedures)
    - Dynamic Layer: Evolutionary knowledge (metrics, patterns, adaptations)
    """
    
    def __init__(
        self,
        chapter_id: str,
        vector_store: Optional[VectorStore] = None,
        embedding_service: Optional[EmbeddingService] = None
    ):
        """
        Initialize the knowledge service.
        
        Args:
            chapter_id: GDG chapter identifier (e.g., "gdg-providence")
            vector_store: Vector database for knowledge storage
            embedding_service: Service for generating embeddings
        """
        self.chapter_id = chapter_id
        self.vector_store = vector_store or VectorStore()
        self.embedding_service = embedding_service or EmbeddingService()
        
        # Initialize vector store
        self.vector_store.initialize()
        
        # Initialize the three layers
        self.semantic = SemanticLayer(
            chapter_id=chapter_id,
            vector_store=self.vector_store,
            embedding_service=self.embedding_service
        )
        
        self.kinetic = KineticLayer(
            chapter_id=chapter_id,
            vector_store=self.vector_store,
            embedding_service=self.embedding_service
        )
        
        self.dynamic = DynamicLayer(
            chapter_id=chapter_id,
            vector_store=self.vector_store,
            embedding_service=self.embedding_service
        )
        
        logger.info(f"Knowledge service initialized for chapter: {chapter_id}")
    
    async def search_across_layers(
        self,
        query: str,
        layers: Optional[List[str]] = None,
        limit: int = 10
    ) -> Dict[str, List[Dict[str, Any]]]:
        """
        Search for knowledge across multiple layers.
        
        Args:
            query: Search query
            layers: List of layers to search ("semantic", "kinetic", "dynamic")
            limit: Maximum results per layer
            
        Returns:
            Dictionary mapping layer names to search results
        """
        if layers is None:
            layers = ["semantic", "kinetic", "dynamic"]
        
        results = {}
        
        # Search semantic layer
        if "semantic" in layers:
            try:
                semantic_results = await self.semantic.search(query, limit=limit)
                results["semantic"] = semantic_results
            except Exception as e:
                logger.warning(f"Semantic layer search failed: {e}")
                results["semantic"] = []
        
        # Search kinetic layer
        if "kinetic" in layers:
            try:
                kinetic_results = await self.kinetic.search(query, limit=limit)
                results["kinetic"] = kinetic_results
            except Exception as e:
                logger.warning(f"Kinetic layer search failed: {e}")
                results["kinetic"] = []
        
        # Search dynamic layer
        if "dynamic" in layers:
            try:
                dynamic_results = await self.dynamic.search(query, limit=limit)
                results["dynamic"] = dynamic_results
            except Exception as e:
                logger.warning(f"Dynamic layer search failed: {e}")
                results["dynamic"] = []
        
        logger.info(f"Cross-layer search for '{query}' returned {sum(len(r) for r in results.values())} results")
        return results
    
    async def get_contextual_knowledge(
        self,
        context: str,
        knowledge_type: Optional[str] = None,
        limit: int = 5
    ) -> Dict[str, Any]:
        """
        Get relevant knowledge based on context.
        
        Args:
            context: Context description (e.g., "creating Flutter event")
            knowledge_type: Specific type to focus on (template, workflow, pattern)
            limit: Maximum results per layer
            
        Returns:
            Structured knowledge response with recommendations
        """
        # Search across layers based on context
        search_results = await self.search_across_layers(context, limit=limit)
        
        # Organize results by relevance and type
        knowledge = {
            "context": context,
            "recommendations": {
                "templates": [],
                "workflows": [],
                "patterns": [],
                "insights": []
            },
            "search_results": search_results,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        # Extract templates from semantic layer
        for item in search_results.get("semantic", []):
            if item.get("category") == "template":
                knowledge["recommendations"]["templates"].append(item)
        
        # Extract workflows from kinetic layer
        for item in search_results.get("kinetic", []):
            if item.get("category") == "workflow":
                knowledge["recommendations"]["workflows"].append(item)
        
        # Extract patterns and insights from dynamic layer
        for item in search_results.get("dynamic", []):
            if item.get("category") == "pattern":
                knowledge["recommendations"]["patterns"].append(item)
            elif item.get("category") == "insight":
                knowledge["recommendations"]["insights"].append(item)
        
        return knowledge
    
    async def store_knowledge_item(
        self,
        layer: str,
        content: Dict[str, Any],
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Store a knowledge item in the specified layer.
        
        Args:
            layer: Target layer ("semantic", "kinetic", "dynamic")
            content: Knowledge content
            metadata: Additional metadata
            
        Returns:
            Item ID of stored knowledge
        """
        if metadata is None:
            metadata = {}
        
        # Add timestamp to metadata
        metadata["created_at"] = datetime.now(timezone.utc).isoformat()
        metadata["chapter_id"] = self.chapter_id
        
        if layer == "semantic":
            return await self.semantic.store_item(content, metadata)
        elif layer == "kinetic":
            return await self.kinetic.store_item(content, metadata)
        elif layer == "dynamic":
            return await self.dynamic.store_item(content, metadata)
        else:
            raise ValueError(f"Unknown layer: {layer}")
    
    async def get_layer_statistics(self) -> Dict[str, Any]:
        """
        Get statistics about knowledge stored in each layer.
        
        Returns:
            Statistics for all layers
        """
        stats = {
            "chapter_id": self.chapter_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "layers": {
                "semantic": await self.semantic.get_statistics(),
                "kinetic": await self.kinetic.get_statistics(),
                "dynamic": await self.dynamic.get_statistics()
            }
        }
        
        # Calculate total statistics
        total_items = sum(
            layer_stats.get("total_items", 0) 
            for layer_stats in stats["layers"].values()
        )
        stats["total_items"] = total_items
        
        return stats
    
    async def initialize_default_knowledge(self) -> Dict[str, int]:
        """
        Initialize all layers with default knowledge.
        
        Returns:
            Count of items created per layer
        """
        logger.info(f"Initializing default knowledge for chapter {self.chapter_id}")
        
        results = {}
        
        # Initialize semantic layer
        try:
            semantic_count = await self.semantic.initialize_default_content()
            results["semantic"] = semantic_count
        except Exception as e:
            logger.error(f"Failed to initialize semantic layer: {e}")
            results["semantic"] = 0
        
        # Initialize kinetic layer
        try:
            kinetic_count = await self.kinetic.initialize_default_workflows()
            results["kinetic"] = kinetic_count
        except Exception as e:
            logger.error(f"Failed to initialize kinetic layer: {e}")
            results["kinetic"] = 0
        
        # Initialize dynamic layer
        try:
            dynamic_count = await self.dynamic.initialize_baseline_metrics()
            results["dynamic"] = dynamic_count
        except Exception as e:
            logger.error(f"Failed to initialize dynamic layer: {e}")
            results["dynamic"] = 0
        
        total_initialized = sum(results.values())
        logger.info(f"Initialized {total_initialized} knowledge items across all layers")
        
        return results
    
    async def backup_knowledge(self) -> Dict[str, Any]:
        """
        Create a backup of all knowledge in all layers.
        
        Returns:
            Backup data structure
        """
        backup = {
            "chapter_id": self.chapter_id,
            "backup_timestamp": datetime.now(timezone.utc).isoformat(),
            "version": "1.0",
            "layers": {}
        }
        
        # Backup each layer
        for layer_name in ["semantic", "kinetic", "dynamic"]:
            try:
                layer = getattr(self, layer_name)
                layer_backup = await layer.export_data()
                backup["layers"][layer_name] = layer_backup
            except Exception as e:
                logger.error(f"Failed to backup {layer_name} layer: {e}")
                backup["layers"][layer_name] = {"error": str(e), "items": []}
        
        return backup
    
    async def restore_knowledge(self, backup_data: Dict[str, Any]) -> Dict[str, int]:
        """
        Restore knowledge from backup data.
        
        Args:
            backup_data: Backup data structure
            
        Returns:
            Count of items restored per layer
        """
        results = {}
        
        if backup_data.get("chapter_id") != self.chapter_id:
            logger.warning(f"Backup chapter ID mismatch: {backup_data.get('chapter_id')} != {self.chapter_id}")
        
        # Restore each layer
        for layer_name in ["semantic", "kinetic", "dynamic"]:
            if layer_name in backup_data.get("layers", {}):
                try:
                    layer = getattr(self, layer_name)
                    layer_data = backup_data["layers"][layer_name]
                    restored_count = await layer.import_data(layer_data)
                    results[layer_name] = restored_count
                except Exception as e:
                    logger.error(f"Failed to restore {layer_name} layer: {e}")
                    results[layer_name] = 0
            else:
                results[layer_name] = 0
        
        total_restored = sum(results.values())
        logger.info(f"Restored {total_restored} knowledge items across all layers")
        
        return results