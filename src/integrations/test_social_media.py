"""Test script for social media integrations."""

import asyncio
from datetime import datetime, timedelta

from social_media_service import SocialMediaService
from linkedin import LinkedInService
from bluesky import BlueskyService

async def test_social_media_service():
    """Test the social media service with mock data."""
    # Initialize services
    linkedin = LinkedInService()
    bluesky = BlueskyService()
    social_media = SocialMediaService(linkedin_service=linkedin, bluesky_service=bluesky)
    
    # Test post content
    print("Testing social media post...")
    event_info = "Join us for our Flutter Development Workshop on June 15th at 6 PM. Learn about building beautiful cross-platform apps!"
    future_time = datetime.now() + timedelta(minutes=1)  # Schedule for 1 minute in the future
    
    # Sample images (paths would be actual file paths in production)
    images = [
        {
            "path": "/path/to/image1.jpg",
            "title": "Flutter Workshop Banner",
            "alt_text": "Google Developer Group Flutter Workshop with colorful UI components"
        }
    ]
    
    # Post to both platforms
    results = await social_media.post_content(
        text=event_info,
        platforms=["linkedin", "bluesky"],
        images=images,
        link="https://gdg.community/events/flutter-workshop",
        schedule_time=future_time
    )
    
    print("Post results:")
    for platform, result in results.items():
        print(f"- {platform}: {result['text'][:30]}... (Post ID: {result.get('id', 'N/A')})")
    
    # Store post IDs for metrics retrieval
    post_ids = {
        "linkedin": results.get("linkedin", {}).get("id", ""),
        "bluesky": results.get("bluesky", {}).get("uri", "")
    }
    
    # Wait a moment (in a real scenario, you'd wait longer for engagement)
    print("\nWaiting 2 seconds to simulate engagement...")
    await asyncio.sleep(2)
    
    # Get metrics for the posts
    print("\nRetrieving metrics...")
    metrics = await social_media.get_metrics(post_ids)
    
    print("Metrics results:")
    for platform, platform_metrics in metrics.items():
        print(f"- {platform}:")
        for metric, value in platform_metrics.items():
            print(f"  * {metric}: {value}")
    
    print("\nTest completed successfully!")

if __name__ == "__main__":
    # Run the test
    asyncio.run(test_social_media_service())