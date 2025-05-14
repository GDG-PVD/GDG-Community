"""Unit tests for the content agent module."""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch

from src.agents.content_agent import ContentAgent


@pytest.mark.unit
@pytest.mark.agents
class TestContentAgent:
    """Tests for the ContentAgent class."""
    
    @pytest.fixture
    def mock_agent(self):
        """Fixture for mocking the ADK Agent."""
        mock = MagicMock()
        mock.generate_content.return_value = MagicMock()
        mock.generate_content.return_value.text = "Generated content for testing."
        return mock
    
    @pytest.fixture
    def content_agent(self, mock_embedding_service, mock_vector_store, mock_social_media_service, mock_agent):
        """Fixture for a ContentAgent with mocked dependencies."""
        with patch("google.adk.agents.Agent", return_value=mock_agent):
            agent = ContentAgent(
                chapter_id="test-chapter",
                embedding_service=mock_embedding_service,
                vector_store=mock_vector_store,
                social_media_service=mock_social_media_service
            )
            # Save for test access
            agent.mock_agent = mock_agent
            return agent
    
    @pytest.mark.asyncio
    async def test_get_content_templates(self, content_agent, mock_vector_store, sample_templates):
        """Test retrieving content templates from the vector store."""
        # Set up mock to return templates
        mock_vector_store.query.return_value = [
            {"metadata": {"content": template}} for template in sample_templates
        ]
        
        # Get templates
        templates = await content_agent._get_content_templates()
        
        # Check vector store was queried
        mock_vector_store.query.assert_called_once()
        args, kwargs = mock_vector_store.query.call_args
        assert kwargs["chapter_id"] == "test-chapter"
        assert kwargs["layer"] == "semantic"
        assert "filter" in kwargs
        assert kwargs["filter"]["type"] == "template"
        
        # Check templates were returned
        assert len(templates) == len(sample_templates)
        assert templates[0]["id"] == sample_templates[0]["id"]
    
    @pytest.mark.asyncio
    async def test_get_content_templates_empty(self, content_agent, mock_vector_store):
        """Test retrieving content templates when none exist in the vector store."""
        # Set up mock to return empty results
        mock_vector_store.query.return_value = []
        
        # Get templates
        templates = await content_agent._get_content_templates()
        
        # Check vector store was queried
        mock_vector_store.query.assert_called_once()
        
        # Check default templates were returned
        assert len(templates) == 2
        assert "event-announcement" in [t["id"] for t in templates]
        assert "event-recap" in [t["id"] for t in templates]
    
    @pytest.mark.asyncio
    async def test_get_brand_voice(self, content_agent, mock_vector_store, sample_brand_voice):
        """Test retrieving brand voice from the vector store."""
        # Set up mock to return brand voice
        mock_vector_store.query.return_value = [
            {"metadata": {"content": sample_brand_voice}}
        ]
        
        # Get brand voice
        brand_voice = await content_agent._get_brand_voice()
        
        # Check vector store was queried
        mock_vector_store.query.assert_called_once()
        args, kwargs = mock_vector_store.query.call_args
        assert kwargs["chapter_id"] == "test-chapter"
        assert kwargs["layer"] == "semantic"
        assert "filter" in kwargs
        assert kwargs["filter"]["type"] == "brand_voice"
        
        # Check brand voice was returned
        assert brand_voice["tone"] == sample_brand_voice["tone"]
        assert brand_voice["values"] == sample_brand_voice["values"]
    
    @pytest.mark.asyncio
    async def test_generate_social_post(self, content_agent, mock_vector_store, sample_event_data, sample_brand_voice, sample_templates):
        """Test generating a social media post."""
        # Set up mocks for get_content_templates and get_brand_voice
        content_agent._get_content_templates = AsyncMock(return_value=sample_templates)
        content_agent._get_brand_voice = AsyncMock(return_value=sample_brand_voice)
        content_agent._get_similar_content = AsyncMock(return_value=[])
        
        # Generate a social post
        post = await content_agent._generate_social_post(
            platform="linkedin",
            event_data=sample_event_data,
            template_id="event-announcement"
        )
        
        # Check mocks were called
        content_agent._get_content_templates.assert_called_once()
        content_agent._get_brand_voice.assert_called_once()
        
        # Check LLM was called with appropriate prompt
        content_agent.mock_agent.generate_content.assert_called_once()
        prompt = content_agent.mock_agent.generate_content.call_args[0][0]
        assert "LinkedIn" in prompt
        assert sample_event_data["title"] in prompt
        assert sample_event_data["date"] in prompt
        assert sample_brand_voice["tone"] in prompt
        
        # Check post data was structured correctly
        assert post["text"] == "Generated content for testing."
        assert post["platform"] == "linkedin"
        assert post["event_id"] == sample_event_data["id"]
    
    @pytest.mark.asyncio
    async def test_save_generated_content(self, content_agent, mock_vector_store, mock_embedding_service):
        """Test saving generated content to the vector store."""
        # Create test content
        content = {
            "text": "Test post content",
            "platform": "linkedin",
            "event_id": "evt-12345",
            "created_at": "2025-05-14T12:00:00Z"
        }
        
        # Save the content
        item_id = await content_agent._save_generated_content(content)
        
        # Check embedding was generated
        mock_embedding_service.generate_content_embeddings.assert_called_once_with(content)
        
        # Check content was stored
        mock_vector_store.store_item.assert_called_once()
        args, kwargs = mock_vector_store.store_item.call_args
        assert kwargs["chapter_id"] == "test-chapter"
        assert kwargs["layer"] == "kinetic"  # No performance data, so kinetic layer
        assert "metadata" in kwargs
        assert kwargs["metadata"]["type"] == "social_post"
        assert kwargs["metadata"]["platform"] == "linkedin"
        assert kwargs["metadata"]["content"] == content
        
        # Check valid ID was returned
        assert isinstance(item_id, str)
        assert "post_" in item_id
    
    @pytest.mark.asyncio
    async def test_post_to_social_media(self, content_agent, mock_social_media_service):
        """Test posting content to social media."""
        # Create test content and parameters
        content = {"text": "Test social post"}
        platforms = ["linkedin", "bluesky"]
        images = [{"path": "/path/to/image.jpg", "alt_text": "Test image"}]
        link = "https://example.com"
        
        # Post the content
        result = await content_agent._post_to_social_media(
            content=content,
            platforms=platforms,
            images=images,
            link=link
        )
        
        # Check social media service was called
        mock_social_media_service.post_content.assert_called_once()
        args, kwargs = mock_social_media_service.post_content.call_args
        assert kwargs["text"] == content["text"]
        assert kwargs["platforms"] == platforms
        assert kwargs["images"] == images
        assert kwargs["link"] == link
    
    @pytest.mark.asyncio
    async def test_get_social_media_metrics(self, content_agent, mock_social_media_service):
        """Test retrieving metrics from social media platforms."""
        # Set up post IDs
        post_ids = {
            "linkedin": "urn:li:share:12345",
            "bluesky": "at://user/123/post/456"
        }
        
        # Get metrics
        metrics = await content_agent._get_social_media_metrics(post_ids)
        
        # Check social media service was called
        mock_social_media_service.get_metrics.assert_called_once_with(post_ids)
    
    @pytest.mark.asyncio
    async def test_generate_content_with_posting(self, content_agent):
        """Test generating and posting content in one operation."""
        # Mock all the necessary methods
        content_agent._generate_social_post = AsyncMock(return_value={
            "text": "Test post content",
            "platform": "linkedin",
            "event_id": "evt-12345"
        })
        content_agent._save_generated_content = AsyncMock(return_value="post_12345")
        content_agent._post_to_social_media = AsyncMock(return_value={
            "linkedin": {"id": "urn:li:share:12345", "text": "Test post content"}
        })
        
        # Sample data
        event_data = {
            "id": "evt-12345",
            "title": "Test Event",
            "link": "https://example.com"
        }
        
        # Generate and post content
        result = await content_agent.generate_content(
            platforms=["linkedin"],
            event_data=event_data,
            post_immediately=True
        )
        
        # Check methods were called
        content_agent._generate_social_post.assert_called_once()
        content_agent._save_generated_content.assert_called_once()
        content_agent._post_to_social_media.assert_called_once()
        
        # Check result structure
        assert "linkedin" in result
        assert "post_id" in result["linkedin"]
        assert "post_ids" in result
    
    @pytest.mark.asyncio
    async def test_fetch_platform_metrics(self, content_agent, mock_social_media_service):
        """Test fetching and processing platform metrics."""
        # Set up mock social media service
        mock_social_media_service.get_metrics.return_value = {
            "linkedin": {
                "likes": 42,
                "comments": 7,
                "shares": 12,
                "impressions": 2345
            },
            "bluesky": {
                "likes": 28,
                "reposts": 8,
                "replies": 3,
                "impressions": 876
            }
        }
        
        # Set up post IDs
        post_ids = {
            "linkedin": "urn:li:share:12345",
            "bluesky": "at://user/123/post/456"
        }
        
        # Fetch metrics
        metrics = await content_agent.fetch_platform_metrics(post_ids)
        
        # Check metrics retrieval
        mock_social_media_service.get_metrics.assert_called_once_with(post_ids)
        
        # Check engagement rates were calculated
        assert "engagement_rate" in metrics["linkedin"]
        assert "engagement_rate" in metrics["bluesky"]
        
        # Check LinkedIn engagement rate
        linkedin_engagement = 42 + 7 + 12  # likes + comments + shares
        linkedin_impressions = 2345
        expected_linkedin_rate = linkedin_engagement / linkedin_impressions
        assert metrics["linkedin"]["engagement_rate"] == expected_linkedin_rate
        
        # Check Bluesky engagement rate
        bluesky_engagement = 28 + 8 + 3  # likes + reposts + replies
        bluesky_impressions = 876
        expected_bluesky_rate = bluesky_engagement / bluesky_impressions
        assert metrics["bluesky"]["engagement_rate"] == expected_bluesky_rate