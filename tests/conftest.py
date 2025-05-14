"""Test fixtures and configuration for pytest."""

import os
import pytest
import asyncio
from datetime import datetime
from typing import Dict, List, Any, Optional
from unittest.mock import AsyncMock, MagicMock

# Add project root to path
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# --- Mock Classes ---

class MockEmbeddingService:
    """Mock for EmbeddingService to avoid actual API calls during tests."""
    
    def __init__(self):
        self._initialized = True
        
    async def generate_embeddings(self, text: str) -> List[float]:
        """Return a fixed embedding vector for any text."""
        # Return a simplified embedding (normally this would be 1536 dimensions)
        return [0.1, 0.2, 0.3, 0.4, 0.5] * 10
        
    async def generate_content_embeddings(self, content: Dict[str, Any]) -> List[float]:
        """Generate embeddings for content object."""
        if isinstance(content, dict) and "text" in content:
            return await self.generate_embeddings(content["text"])
        return await self.generate_embeddings(str(content))


class MockVectorStore:
    """Mock for VectorStore to avoid actual database calls during tests."""
    
    def __init__(self):
        self._initialized = True
        self.store = {
            "semantic": {},
            "kinetic": {},
            "dynamic": {}
        }
        
    def initialize(self):
        """Initialize the vector store mock."""
        self._initialized = True
        
    async def store_item(
        self,
        chapter_id: str,
        layer: str,
        item_id: str,
        embedding: List[float],
        metadata: Dict[str, Any]
    ) -> str:
        """Store an item in the mock database."""
        if layer not in self.store:
            self.store[layer] = {}
            
        if chapter_id not in self.store[layer]:
            self.store[layer][chapter_id] = {}
            
        self.store[layer][chapter_id][item_id] = {
            "embedding": embedding,
            "metadata": metadata
        }
        
        return item_id
        
    async def query(
        self,
        chapter_id: str,
        layer: str,
        query_embedding: List[float],
        filter: Optional[Dict[str, Any]] = None,
        top_k: int = 3
    ) -> List[Dict[str, Any]]:
        """Query the mock vector store."""
        if layer not in self.store or chapter_id not in self.store[layer]:
            return []
            
        # Simple simulation of vector search - in reality would calculate
        # cosine similarity between query_embedding and stored embeddings
        results = []
        for item_id, item_data in self.store[layer][chapter_id].items():
            # Apply filter if provided
            if filter and not self._matches_filter(item_data["metadata"], filter):
                continue
                
            # In a real implementation this would be a similarity score
            similarity = 0.9  # High similarity for mock data
            
            results.append({
                "id": item_id,
                "metadata": item_data["metadata"],
                "score": similarity
            })
            
        # Sort by "score" and limit to top_k
        results = sorted(results, key=lambda x: x["score"], reverse=True)[:top_k]
        
        return results
        
    def _matches_filter(self, metadata: Dict[str, Any], filter: Dict[str, Any]) -> bool:
        """Check if metadata matches the provided filter."""
        for key, value in filter.items():
            if key not in metadata:
                return False
                
            if isinstance(value, dict) and list(value.keys())[0].startswith("$"):
                # Handle operators like $gt, $lt, etc.
                operator = list(value.keys())[0]
                operand = value[operator]
                
                if operator == "$gt":
                    if metadata[key] <= operand:
                        return False
                elif operator == "$lt":
                    if metadata[key] >= operand:
                        return False
                # Add other operators as needed
            elif metadata[key] != value:
                return False
                
        return True


class MockLinkedInService:
    """Mock LinkedIn service for testing."""
    
    def __init__(self):
        self._initialized = True
        
    def initialize(self):
        """Initialize the LinkedIn client mock."""
        self._initialized = True
        
    async def post_content(self, text: str, images=None, article_url=None, visibility="PUBLIC"):
        """Mock posting content to LinkedIn."""
        return {
            "id": f"urn:li:share:{hash(text) % 10000000000000000}",
            "text": text,
            "created_at": datetime.now().isoformat(),
            "visibility": visibility
        }
        
    async def upload_image(self, image_path: str, title=None):
        """Mock uploading an image to LinkedIn."""
        return f"urn:li:image:{hash(image_path) % 10000000000000000}"
        
    async def get_post_metrics(self, post_id: str):
        """Mock getting metrics for a LinkedIn post."""
        return {
            "likes": 42,
            "comments": 7,
            "shares": 12,
            "clicks": 89,
            "impressions": 2345,
            "engagement_rate": 0.042,
        }


class MockBlueskyService:
    """Mock Bluesky service for testing."""
    
    def __init__(self):
        self._initialized = True
        
    def initialize(self):
        """Initialize the Bluesky client mock."""
        self._initialized = True
        
    async def post_content(self, text: str, images=None, link=None, language="en"):
        """Mock posting content to Bluesky."""
        return {
            "uri": f"at://user/123456789abcdef/post/{hash(text) % 1000000000}",
            "cid": f"bafyrei{hash(text) % 1000000000}",
            "text": text,
            "created_at": datetime.now().isoformat()
        }
        
    async def upload_image(self, image_path: str, alt_text=None):
        """Mock uploading an image to Bluesky."""
        return {
            "blob": {
                "$type": "blob",
                "ref": {
                    "$link": f"bafyrei{hash(image_path) % 1000000000}"
                },
                "mimeType": "image/jpeg",
                "size": 12345
            },
            "alt_text": alt_text
        }
        
    async def get_post_metrics(self, post_uri: str):
        """Mock getting metrics for a Bluesky post."""
        return {
            "likes": 28,
            "reposts": 8,
            "replies": 3,
            "impressions": 876,
        }


class MockSocialMediaService:
    """Mock for the unified social media service."""
    
    def __init__(self):
        self._initialized = True
        self.linkedin = MockLinkedInService()
        self.bluesky = MockBlueskyService()
        
    def initialize(self):
        """Initialize the social media service mock."""
        self._initialized = True
        
    async def post_content(self, text: str, platforms=None, images=None, link=None, schedule_time=None):
        """Mock posting content to multiple platforms."""
        if platforms is None:
            platforms = ["linkedin", "bluesky"]
            
        results = {}
        
        if "linkedin" in platforms:
            results["linkedin"] = await self.linkedin.post_content(text, images, link)
            
        if "bluesky" in platforms:
            results["bluesky"] = await self.bluesky.post_content(text, images, link)
            
        return results
        
    async def get_metrics(self, post_ids):
        """Mock getting metrics from multiple platforms."""
        results = {}
        
        if "linkedin" in post_ids:
            results["linkedin"] = await self.linkedin.get_post_metrics(post_ids["linkedin"])
            
        if "bluesky" in post_ids:
            results["bluesky"] = await self.bluesky.get_post_metrics(post_ids["bluesky"])
            
        return results


# --- Fixtures ---

@pytest.fixture
def mock_embedding_service():
    """Fixture for a mock embedding service."""
    return MockEmbeddingService()


@pytest.fixture
def mock_vector_store():
    """Fixture for a mock vector store."""
    return MockVectorStore()


@pytest.fixture
def mock_linkedin_service():
    """Fixture for a mock LinkedIn service."""
    return MockLinkedInService()


@pytest.fixture
def mock_bluesky_service():
    """Fixture for a mock Bluesky service."""
    return MockBlueskyService()


@pytest.fixture
def mock_social_media_service():
    """Fixture for a mock social media service."""
    return MockSocialMediaService()


@pytest.fixture
def event_loop():
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def sample_event_data():
    """Sample event data for testing content generation."""
    return {
        "id": "evt-12345",
        "title": "Flutter Workshop: Building Beautiful UIs",
        "date": "2025-06-15",
        "time": "18:00",
        "description": "Join us for a hands-on workshop on building beautiful user interfaces with Flutter. We'll cover Material Design 3, animations, and responsive layouts.",
        "location": "Tech Hub Downtown",
        "link": "https://gdg.community/events/flutter-workshop",
        "type": "Workshop",
        "tech_topic": "Flutter",
        "audience_level": "Intermediate"
    }


@pytest.fixture
def sample_brand_voice():
    """Sample brand voice data for testing content generation."""
    return {
        "tone": "Friendly, approachable, technical but not intimidating",
        "values": ["Community", "Learning", "Innovation", "Inclusivity"],
        "style_guide": {
            "emojis": "Use sparingly to emphasize key points",
            "hashtags": ["#GDG", "#TechCommunity", "#Flutter"],
            "formatting": "Short paragraphs, clear CTAs"
        }
    }


@pytest.fixture
def sample_templates():
    """Sample content templates for testing."""
    return [
        {
            "id": "event-announcement",
            "name": "Event Announcement",
            "template": "Join us for {event_name} on {date} at {time}! {description} Register now: {link}",
            "platforms": ["linkedin", "bluesky"]
        },
        {
            "id": "event-recap",
            "name": "Event Recap",
            "template": "Thanks to everyone who joined our {event_name} yesterday! {highlights}",
            "platforms": ["linkedin", "bluesky"]
        }
    ]