"""Unified social media service for the GDG Community Companion."""

import os
from typing import Dict, List, Optional, Any, Tuple
import asyncio
from datetime import datetime

from src.integrations.linkedin import LinkedInService
from src.integrations.bluesky import BlueskyService

class SocialMediaService:
    """
    Unified service for managing social media content across multiple platforms.
    
    This service provides a single interface for posting content to multiple platforms,
    retrieving metrics, and managing content strategy.
    """
    
    def __init__(
        self,
        linkedin_service: Optional[LinkedInService] = None,
        bluesky_service: Optional[BlueskyService] = None,
    ):
        """
        Initialize the social media service.
        
        Args:
            linkedin_service: LinkedIn service instance
            bluesky_service: Bluesky service instance
        """
        self.linkedin = linkedin_service or LinkedInService()
        self.bluesky = bluesky_service or BlueskyService()
        self._initialized = False
        
    def initialize(self):
        """Initialize all platform services."""
        if not self._initialized:
            self.linkedin.initialize()
            self.bluesky.initialize()
            self._initialized = True
    
    async def post_content(
        self,
        text: str,
        platforms: List[str] = ["linkedin", "bluesky"],
        images: Optional[List[Dict[str, Any]]] = None,
        link: Optional[str] = None,
        schedule_time: Optional[datetime] = None,
    ) -> Dict[str, Any]:
        """
        Post content to multiple platforms.
        
        Args:
            text: Content text
            platforms: List of platforms to post to
            images: Optional list of image objects with paths and alt_text
            link: Optional link to include
            schedule_time: Optional time to schedule the post
            
        Returns:
            Dictionary mapping platforms to their respective post IDs
        """
        if not self._initialized:
            self.initialize()
            
        results = {}
        tasks = []
        
        # Prepare platform-specific posts
        if "linkedin" in platforms:
            linkedin_task = self._post_to_linkedin(text, images, link)
            tasks.append(linkedin_task)
            
        if "bluesky" in platforms:
            bluesky_task = self._post_to_bluesky(text, images, link)
            tasks.append(bluesky_task)
            
        # Execute posts concurrently
        if schedule_time and schedule_time > datetime.now():
            # Schedule posts for future
            # In a real implementation, this would queue the posts for later delivery
            delay = (schedule_time - datetime.now()).total_seconds()
            await asyncio.sleep(delay)
            
        # Execute posts
        platform_results = await asyncio.gather(*tasks)
        
        # Combine results
        for platform, result in platform_results:
            results[platform] = result
            
        return results
    
    async def _post_to_linkedin(
        self,
        text: str,
        images: Optional[List[Dict[str, Any]]] = None,
        link: Optional[str] = None,
    ) -> Tuple[str, Dict[str, Any]]:
        """Post content to LinkedIn."""
        # Prepare images if provided
        linkedin_images = []
        if images:
            for image in images:
                image_id = await self.linkedin.upload_image(
                    image_path=image["path"],
                    title=image.get("title", ""),
                )
                linkedin_images.append({"id": image_id})
                
        # Post to LinkedIn
        result = await self.linkedin.post_content(
            text=text,
            images=linkedin_images if images else None,
            article_url=link,
        )
        
        return ("linkedin", result)
    
    async def _post_to_bluesky(
        self,
        text: str,
        images: Optional[List[Dict[str, Any]]] = None,
        link: Optional[str] = None,
    ) -> Tuple[str, Dict[str, Any]]:
        """Post content to Bluesky."""
        # Prepare images if provided
        bluesky_images = []
        if images:
            for image in images:
                image_data = await self.bluesky.upload_image(
                    image_path=image["path"],
                    alt_text=image.get("alt_text", ""),
                )
                bluesky_images.append(image_data)
                
        # Format text with link if provided
        if link:
            text = f"{text}\n\n{link}"
                
        # Post to Bluesky
        result = await self.bluesky.post_content(
            text=text,
            images=bluesky_images if images else None,
        )
        
        return ("bluesky", result)
    
    async def get_metrics(
        self,
        post_ids: Dict[str, str],
    ) -> Dict[str, Dict[str, Any]]:
        """
        Get metrics for posts across platforms.
        
        Args:
            post_ids: Dictionary mapping platforms to their respective post IDs
            
        Returns:
            Dictionary mapping platforms to their respective metrics
        """
        if not self._initialized:
            self.initialize()
            
        results = {}
        tasks = []
        
        # Prepare metric retrieval tasks
        if "linkedin" in post_ids:
            linkedin_task = self._get_linkedin_metrics(post_ids["linkedin"])
            tasks.append(linkedin_task)
            
        if "bluesky" in post_ids:
            bluesky_task = self._get_bluesky_metrics(post_ids["bluesky"])
            tasks.append(bluesky_task)
            
        # Execute metrics retrieval concurrently
        platform_results = await asyncio.gather(*tasks)
        
        # Combine results
        for platform, metrics in platform_results:
            results[platform] = metrics
            
        return results
    
    async def _get_linkedin_metrics(
        self,
        post_id: str,
    ) -> Tuple[str, Dict[str, Any]]:
        """Get metrics for a LinkedIn post."""
        metrics = await self.linkedin.get_post_metrics(post_id)
        return ("linkedin", metrics)
    
    async def _get_bluesky_metrics(
        self,
        post_uri: str,
    ) -> Tuple[str, Dict[str, Any]]:
        """Get metrics for a Bluesky post."""
        metrics = await self.bluesky.get_post_metrics(post_uri)
        return ("bluesky", metrics)