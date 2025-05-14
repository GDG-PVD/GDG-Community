"""Integration tests for the content generation flow."""

import pytest
import asyncio
from unittest.mock import patch, AsyncMock

from src.agents.content_agent import ContentAgent
from src.integrations.social_media_service import SocialMediaService
from src.knowledge.vector_store import VectorStore
from src.knowledge.embedding_service import EmbeddingService


@pytest.mark.integration
@pytest.mark.social
class TestContentGenerationFlow:
    """Integration tests for the content generation and publishing flow."""
    
    @pytest.fixture
    def mock_agent_generate_response(self):
        """Mock response from Google ADK agent."""
        mock = AsyncMock()
        mock.text = "Join us for our Flutter Workshop on June 15th! Learn how to build beautiful UIs with Flutter and Material Design 3. Perfect for intermediate developers. Register now: https://gdg.community/events/flutter-workshop #GDG #Flutter #TechCommunity"
        return mock
    
    @pytest.mark.asyncio
    async def test_end_to_end_content_generation(
        self, 
        mock_embedding_service, 
        mock_vector_store, 
        mock_social_media_service,
        mock_agent_generate_response,
        sample_event_data
    ):
        """Test the full content generation and posting flow."""
        # Mock Agent class from google.adk.agents
        with patch("google.adk.agents.Agent") as MockAgent:
            # Set up the mock agent
            mock_agent = MockAgent.return_value
            mock_agent.generate_content.return_value = mock_agent_generate_response
            
            # Create the content agent
            content_agent = ContentAgent(
                chapter_id="test-chapter",
                embedding_service=mock_embedding_service,
                vector_store=mock_vector_store,
                social_media_service=mock_social_media_service
            )
            
            # Generate and post content
            result = await content_agent.generate_content(
                platforms=["linkedin", "bluesky"],
                event_data=sample_event_data,
                post_immediately=True
            )
            
            # Verify embeddings were generated and stored
            assert mock_embedding_service.generate_content_embeddings.called
            assert mock_vector_store.store_item.called
            
            # Verify social media posting was attempted
            assert mock_social_media_service.post_content.called
            
            # Check that the response contains results for both platforms
            assert "linkedin" in result
            assert "bluesky" in result
            
            # Check that post IDs were stored
            assert "post_ids" in result
            
            # Verify content contains relevant information
            linkedin_content = result["linkedin"]
            assert "#Flutter" in linkedin_content["text"]
            assert "Workshop" in linkedin_content["text"]
            assert sample_event_data["date"] in linkedin_content["text"]
    
    @pytest.mark.asyncio
    async def test_metrics_retrieval_flow(
        self, 
        mock_embedding_service, 
        mock_vector_store, 
        mock_social_media_service,
        sample_event_data
    ):
        """Test the flow of posting content and retrieving metrics."""
        # Create the content agent
        with patch("google.adk.agents.Agent"):
            content_agent = ContentAgent(
                chapter_id="test-chapter",
                embedding_service=mock_embedding_service,
                vector_store=mock_vector_store,
                social_media_service=mock_social_media_service
            )
            
            # Mock the generation and posting method
            content_agent._generate_social_post = AsyncMock(return_value={
                "text": "Test post content",
                "platform": "linkedin", 
                "event_id": sample_event_data["id"]
            })
            content_agent._save_generated_content = AsyncMock(return_value="post_12345")
            
            # Set up the social media service mock return values
            mock_social_media_service.post_content.return_value = {
                "linkedin": {"id": "urn:li:share:12345", "text": "Test content"},
                "bluesky": {"uri": "at://user/123/post/456", "text": "Test content"}
            }
            
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
            
            # 1. Generate and post content
            result = await content_agent.generate_content(
                platforms=["linkedin", "bluesky"],
                event_data=sample_event_data,
                post_immediately=True
            )
            
            # Extract post IDs
            post_ids = result["post_ids"]
            
            # 2. Wait for engagement (simulated)
            # In a real test, we might wait longer or use a scheduled test
            await asyncio.sleep(0.1)
            
            # 3. Fetch metrics
            metrics = await content_agent.fetch_platform_metrics(post_ids)
            
            # Verify metrics were fetched and processed
            assert mock_social_media_service.get_metrics.called
            assert metrics["linkedin"]["engagement_rate"] > 0
            assert metrics["bluesky"]["engagement_rate"] > 0
            
            # 4. Record content performance
            await content_agent.record_content_performance("post_12345", {
                "engagement_rate": metrics["linkedin"]["engagement_rate"],
                "click_rate": 0.05,
            })
            
            # Verify content with metrics was stored in dynamic layer
            store_calls = mock_vector_store.store_item.call_args_list
            dynamic_layer_call = False
            
            for call in store_calls:
                args, kwargs = call
                if kwargs.get("layer") == "dynamic":
                    dynamic_layer_call = True
                    assert "performance" in kwargs["metadata"]["content"]
                    assert "performance_score" in kwargs["metadata"]["content"]
                    
            assert dynamic_layer_call, "No call to store item in dynamic layer was made"