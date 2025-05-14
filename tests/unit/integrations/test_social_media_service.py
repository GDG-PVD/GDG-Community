"""Unit tests for the social media service."""

import pytest
import asyncio
from datetime import datetime, timedelta
from unittest.mock import patch, AsyncMock

from src.integrations.social_media_service import SocialMediaService
from src.integrations.linkedin import LinkedInService
from src.integrations.bluesky import BlueskyService


@pytest.mark.unit
@pytest.mark.social
class TestSocialMediaService:
    """Test the social media service."""
    
    @pytest.fixture
    def linkedin_service_mock(self):
        """Mock for LinkedIn service."""
        mock = AsyncMock(spec=LinkedInService)
        mock._initialized = False
        mock.initialize.return_value = None
        mock.post_content.return_value = {
            "id": "urn:li:share:12345",
            "text": "Test content",
            "created_at": "2025-05-14T12:00:00Z"
        }
        mock.upload_image.return_value = "urn:li:image:67890"
        mock.get_post_metrics.return_value = {
            "likes": 42,
            "comments": 7,
            "shares": 12
        }
        return mock
    
    @pytest.fixture
    def bluesky_service_mock(self):
        """Mock for Bluesky service."""
        mock = AsyncMock(spec=BlueskyService)
        mock._initialized = False
        mock.initialize.return_value = None
        mock.post_content.return_value = {
            "uri": "at://user/123/post/456",
            "cid": "bafyrei123456",
            "text": "Test content"
        }
        mock.upload_image.return_value = {
            "blob": {"$type": "blob", "ref": {"$link": "bafyrei789012"}}
        }
        mock.get_post_metrics.return_value = {
            "likes": 28,
            "reposts": 8,
            "replies": 3
        }
        return mock
    
    @pytest.mark.asyncio
    async def test_initialization(self, linkedin_service_mock, bluesky_service_mock):
        """Test that the service initializes its platform services."""
        service = SocialMediaService(
            linkedin_service=linkedin_service_mock,
            bluesky_service=bluesky_service_mock
        )
        
        assert not service._initialized
        service.initialize()
        assert service._initialized
        
        linkedin_service_mock.initialize.assert_called_once()
        bluesky_service_mock.initialize.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_post_content_all_platforms(self, linkedin_service_mock, bluesky_service_mock):
        """Test posting content to all platforms."""
        service = SocialMediaService(
            linkedin_service=linkedin_service_mock,
            bluesky_service=bluesky_service_mock
        )
        service._initialized = True
        
        # Test data
        text = "Hello, world!"
        images = [{"path": "/path/to/image.jpg", "alt_text": "Test image"}]
        link = "https://example.com"
        
        # Post to all platforms
        results = await service.post_content(
            text=text,
            platforms=["linkedin", "bluesky"],
            images=images,
            link=link
        )
        
        # Check LinkedIn service was called
        linkedin_service_mock.post_content.assert_called_once()
        args, kwargs = linkedin_service_mock.post_content.call_args
        assert kwargs["text"] == text
        assert "article_url" in kwargs
        
        # Check Bluesky service was called
        bluesky_service_mock.post_content.assert_called_once()
        args, kwargs = bluesky_service_mock.post_content.call_args
        assert kwargs["text"].startswith(text)
        assert link in kwargs["text"]
        
        # Check results contain both platforms
        assert "linkedin" in results
        assert "bluesky" in results
    
    @pytest.mark.asyncio
    async def test_post_content_single_platform(self, linkedin_service_mock, bluesky_service_mock):
        """Test posting content to a single platform."""
        service = SocialMediaService(
            linkedin_service=linkedin_service_mock,
            bluesky_service=bluesky_service_mock
        )
        service._initialized = True
        
        # Post to LinkedIn only
        results = await service.post_content(
            text="LinkedIn only post",
            platforms=["linkedin"]
        )
        
        # Check only LinkedIn service was called
        linkedin_service_mock.post_content.assert_called_once()
        bluesky_service_mock.post_content.assert_not_called()
        
        # Check results contain only LinkedIn
        assert "linkedin" in results
        assert "bluesky" not in results
    
    @pytest.mark.asyncio
    async def test_scheduled_post(self, linkedin_service_mock, bluesky_service_mock):
        """Test scheduling a post for the future."""
        service = SocialMediaService(
            linkedin_service=linkedin_service_mock,
            bluesky_service=bluesky_service_mock
        )
        service._initialized = True
        
        # Set up a schedule time 1 second in the future
        future_time = datetime.now() + timedelta(seconds=1)
        
        # Mock sleep to avoid actually waiting
        with patch("asyncio.sleep", return_value=None) as mock_sleep:
            await service.post_content(
                text="Scheduled post",
                schedule_time=future_time
            )
            
            # Verify sleep was called with a value close to 1 second
            mock_sleep.assert_called_once()
            sleep_time = mock_sleep.call_args[0][0]
            assert 0 <= sleep_time <= 1.1
        
        # Verify both services were called
        linkedin_service_mock.post_content.assert_called_once()
        bluesky_service_mock.post_content.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_get_metrics(self, linkedin_service_mock, bluesky_service_mock):
        """Test retrieving metrics for posts."""
        service = SocialMediaService(
            linkedin_service=linkedin_service_mock,
            bluesky_service=bluesky_service_mock
        )
        service._initialized = True
        
        # Post IDs
        post_ids = {
            "linkedin": "urn:li:share:12345",
            "bluesky": "at://user/123/post/456"
        }
        
        # Get metrics
        metrics = await service.get_metrics(post_ids)
        
        # Verify services were called
        linkedin_service_mock.get_post_metrics.assert_called_once_with(post_ids["linkedin"])
        bluesky_service_mock.get_post_metrics.assert_called_once_with(post_ids["bluesky"])
        
        # Check results contain both platforms
        assert "linkedin" in metrics
        assert "bluesky" in metrics
        
        # Check metric values
        assert metrics["linkedin"]["likes"] == 42
        assert metrics["bluesky"]["likes"] == 28
    
    @pytest.mark.asyncio
    async def test_automatic_initialization(self, linkedin_service_mock, bluesky_service_mock):
        """Test that methods automatically initialize if needed."""
        service = SocialMediaService(
            linkedin_service=linkedin_service_mock,
            bluesky_service=bluesky_service_mock
        )
        # Don't initialize explicitly
        
        # Call a method
        await service.post_content(text="Auto init test")
        
        # Verify initialization happened
        assert service._initialized
        linkedin_service_mock.initialize.assert_called_once()
        bluesky_service_mock.initialize.assert_called_once()