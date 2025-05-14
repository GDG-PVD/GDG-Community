"""Content generation agent for the GDG Community Companion."""

from typing import Dict, List, Optional, Any
from google.adk.agents import Agent
from google.adk.tools import Tool

# Import the knowledge management system
from ..knowledge.vector_store import VectorStore
from ..knowledge.embedding_service import EmbeddingService

# Import the social media service
from ..integrations.social_media_service import SocialMediaService

class ContentAgent:
    """
    Specialized agent for generating optimized social media content.
    
    This agent accesses chapter style guides and content templates to create
    platform-specific content variations for social media posts. It leverages
    the knowledge management system to access templates and learn from past
    content performance.
    """
    
    def __init__(
        self, 
        chapter_id: str,
        model_name: str = "gemini-2.0-pro",
        vector_store: Optional[VectorStore] = None,
        embedding_service: Optional[EmbeddingService] = None,
        social_media_service: Optional[SocialMediaService] = None,
    ):
        """
        Initialize the content agent.
        
        Args:
            chapter_id: The ID of the GDG chapter
            model_name: The Gemini model to use
            vector_store: Vector database for knowledge retrieval
            embedding_service: Service for generating text embeddings
            social_media_service: Service for posting to social media platforms
        """
        self.chapter_id = chapter_id
        self.model_name = model_name
        self.vector_store = vector_store or VectorStore()
        self.embedding_service = embedding_service or EmbeddingService()
        self.social_media_service = social_media_service or SocialMediaService()
        self._initialize_agent()
        
    def _initialize_agent(self):
        """Initialize the ADK agent with appropriate tools."""
        # Define agent tools
        tools = [
            Tool(
                name="get_content_templates",
                description="Get content templates for the chapter",
                function=self._get_content_templates,
            ),
            Tool(
                name="get_brand_voice",
                description="Get the brand voice guidelines for the chapter",
                function=self._get_brand_voice,
            ),
            Tool(
                name="generate_social_post",
                description="Generate a social media post for a specific platform",
                function=self._generate_social_post,
            ),
            Tool(
                name="get_similar_content",
                description="Get similar content that performed well in the past",
                function=self._get_similar_content,
            ),
            Tool(
                name="save_generated_content",
                description="Save generated content to the knowledge store",
                function=self._save_generated_content,
            ),
            Tool(
                name="post_to_social_media",
                description="Post content to social media platforms",
                function=self._post_to_social_media,
            ),
            Tool(
                name="get_social_media_metrics",
                description="Get metrics for social media posts",
                function=self._get_social_media_metrics,
            ),
        ]
        
        # Create the ADK agent
        self.agent = Agent(
            name=f"content_specialist_{self.chapter_id}",
            model=self.model_name,
            description="Creates optimized social media content based on chapter guidelines and past performance",
            tools=tools,
        )
    
    async def _get_content_templates(self, template_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Get content templates for the chapter from the knowledge store.
        
        Args:
            template_type: Optional type of template to filter by
            
        Returns:
            List of matching templates
        """
        # Initialize if needed
        if not self.vector_store._initialized:
            self.vector_store.initialize()
            
        # Create a query to find templates
        query_text = f"content template {template_type if template_type else ''}"
        query_embedding = await self.embedding_service.generate_embeddings(query_text)
        
        # Search the semantic layer for templates
        filter_dict = {"type": "template"}
        if template_type:
            filter_dict["template_type"] = template_type
            
        results = await self.vector_store.query(
            chapter_id=self.chapter_id,
            layer="semantic",
            query_embedding=query_embedding,
            filter=filter_dict,
            top_k=5
        )
        
        # If no results found, return default templates
        if not results:
            default_templates = [
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
            
            # Filter if needed
            if template_type:
                return [t for t in default_templates if t["id"] == template_type]
            return default_templates
        
        # Return the templates from the knowledge store
        return [match["metadata"]["content"] for match in results]
    
    async def _get_brand_voice(self) -> Dict[str, Any]:
        """
        Get the brand voice guidelines for the chapter from the knowledge store.
        
        Returns:
            Brand voice guidelines dictionary
        """
        # Initialize if needed
        if not self.vector_store._initialized:
            self.vector_store.initialize()
            
        # Create a query to find brand voice guidelines
        query_text = "brand voice guidelines tone style"
        query_embedding = await self.embedding_service.generate_embeddings(query_text)
        
        # Search the semantic layer for brand guidelines
        results = await self.vector_store.query(
            chapter_id=self.chapter_id,
            layer="semantic",
            query_embedding=query_embedding,
            filter={"type": "brand_voice"},
            top_k=1
        )
        
        # If no results found, return default brand voice
        if not results:
            return {
                "tone": "Friendly, approachable, technical but not intimidating",
                "values": ["Community", "Learning", "Innovation", "Inclusivity"],
                "style_guide": {
                    "emojis": "Use sparingly to emphasize key points",
                    "hashtags": ["#GDG", f"#{self.chapter_id.split('-')[1].capitalize()}", "#Google"],
                    "formatting": "Short paragraphs, clear CTAs"
                }
            }
        
        # Return the brand voice from the knowledge store
        return results[0]["metadata"]["content"]
    
    async def _get_similar_content(self, platform: str, keywords: List[str]) -> List[Dict[str, Any]]:
        """
        Get similar content that performed well in the past.
        
        Args:
            platform: The social media platform
            keywords: Keywords to match against past content
            
        Returns:
            List of similar content with performance metrics
        """
        # Create a query to find similar content
        query_text = f"{platform} {' '.join(keywords)}"
        query_embedding = await self.embedding_service.generate_embeddings(query_text)
        
        # Search the dynamic layer for successful content
        results = await self.vector_store.query(
            chapter_id=self.chapter_id,
            layer="dynamic",
            query_embedding=query_embedding,
            filter={"type": "social_post", "platform": platform, "performance": {"$gt": 0.7}},
            top_k=3
        )
        
        return results
    
    async def _generate_social_post(
        self, 
        platform: str, 
        event_data: Dict[str, Any], 
        template_id: Optional[str] = None,
        use_past_performance: bool = True
    ) -> Dict[str, Any]:
        """
        Generate a social media post for a specific platform.
        
        Args:
            platform: The social media platform
            event_data: Data about the event
            template_id: Optional template ID to use
            use_past_performance: Whether to incorporate learning from past performance
            
        Returns:
            Generated post with metadata
        """
        # Get the appropriate template
        templates = await self._get_content_templates(template_id)
        template = templates[0] if templates else None
        
        # Get the brand voice guidelines
        brand_voice = await self._get_brand_voice()
        
        # Get similar past content if needed
        similar_content = []
        if use_past_performance:
            keywords = [event_data.get('title', ''), event_data.get('type', '')]
            similar_content = await self._get_similar_content(platform, keywords)
        
        # Build a prompt for the LLM
        prompt_parts = [
            f"Generate a {platform} post for this event:\n\n",
            f"Title: {event_data.get('title', '')}\n",
            f"Date: {event_data.get('date', '')}\n",
            f"Time: {event_data.get('time', '')}\n",
            f"Description: {event_data.get('description', '')}\n",
            f"Link: {event_data.get('link', '')}\n\n",
        ]
        
        # Add template info if available
        if template:
            prompt_parts.append(f"Using this template: {template['template']}\n\n")
            
        # Add brand voice guidelines
        prompt_parts.append("Follow these brand voice guidelines:\n")
        prompt_parts.append(f"Tone: {brand_voice['tone']}\n")
        prompt_parts.append(f"Values: {', '.join(brand_voice['values'])}\n")
        prompt_parts.append(f"Style: {brand_voice['style_guide']}\n\n")
        
        # Add platform-specific instructions
        if platform == "linkedin":
            prompt_parts.append("Optimize for LinkedIn: Be professional but approachable, highlight value, and use paragraph breaks.\n\n")
        elif platform == "bluesky":
            prompt_parts.append("Optimize for Bluesky: Be concise but conversational, use paragraph breaks, and engage the tech community. Limit to 300 characters for best visibility.\n\n")
        
        # Add examples from past successful posts if available
        if similar_content:
            prompt_parts.append("Here are examples of successful past posts that performed well:\n\n")
            for i, content in enumerate(similar_content):
                post_content = content["metadata"].get("content", {})
                prompt_parts.append(f"Example {i+1}: {post_content.get('text', '')}\n\n")
        
        # Generate the content using the agent
        prompt = "".join(prompt_parts)
        response = await self.agent.generate_content(prompt)
        
        # Create a structured response
        post_content = {
            "text": response.text,
            "platform": platform,
            "event_id": event_data.get("id", ""),
            "created_at": "2025-05-14T12:00:00Z",  # Use actual datetime in production
            "template_id": template["id"] if template else None,
        }
        
        return post_content
    
    async def _save_generated_content(self, content: Dict[str, Any], performance_data: Optional[Dict[str, Any]] = None) -> str:
        """
        Save generated content to the knowledge store.
        
        Args:
            content: The generated content
            performance_data: Optional performance metrics if available
            
        Returns:
            ID of the saved content
        """
        # Generate an embedding for the content
        embedding = await self.embedding_service.generate_content_embeddings(content)
        
        # Prepare metadata
        metadata = {
            "type": "social_post",
            "platform": content["platform"],
            "content": content,
        }
        
        # Add performance data if available
        if performance_data:
            metadata["performance"] = performance_data
            
        # Determine which layer to store in
        layer = "dynamic" if performance_data else "kinetic"
        
        # Generate a unique ID
        import uuid
        item_id = f"post_{uuid.uuid4()}"
        
        # Store in the vector database
        await self.vector_store.store_item(
            chapter_id=self.chapter_id,
            layer=layer,
            item_id=item_id,
            embedding=embedding,
            metadata=metadata
        )
        
        return item_id
    
    async def _post_to_social_media(
        self,
        content: Dict[str, Any],
        platforms: Optional[List[str]] = None,
        images: Optional[List[Dict[str, Any]]] = None,
        link: Optional[str] = None,
        schedule_time: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Post content to social media platforms.
        
        Args:
            content: The content to post
            platforms: List of platforms to post to (defaults to linkedin and bluesky)
            images: Optional list of image objects with paths and alt_text
            link: Optional link to include
            schedule_time: Optional time to schedule the post (ISO format)
            
        Returns:
            Dictionary mapping platforms to their respective post IDs
        """
        # Initialize the social media service if needed
        if not hasattr(self.social_media_service, '_initialized') or not self.social_media_service._initialized:
            self.social_media_service.initialize()
            
        # Default to LinkedIn and Bluesky if no platforms specified
        if not platforms:
            platforms = ["linkedin", "bluesky"]
            
        # Parse schedule time if provided
        from datetime import datetime
        schedule_datetime = None
        if schedule_time:
            schedule_datetime = datetime.fromisoformat(schedule_time)
            
        # Post to social media
        result = await self.social_media_service.post_content(
            text=content["text"],
            platforms=platforms,
            images=images,
            link=link,
            schedule_time=schedule_datetime
        )
        
        # Store post IDs in the content object
        content["post_ids"] = {platform: result[platform]["id"] for platform in result}
        
        return result
    
    async def _get_social_media_metrics(
        self,
        post_ids: Dict[str, str],
    ) -> Dict[str, Dict[str, Any]]:
        """
        Get metrics for social media posts.
        
        Args:
            post_ids: Dictionary mapping platforms to their respective post IDs
            
        Returns:
            Dictionary mapping platforms to their respective metrics
        """
        # Initialize the social media service if needed
        if not hasattr(self.social_media_service, '_initialized') or not self.social_media_service._initialized:
            self.social_media_service.initialize()
            
        # Get metrics from social media
        metrics = await self.social_media_service.get_metrics(post_ids)
        
        return metrics
        
    async def generate_content(
        self, 
        platforms: List[str], 
        event_data: Dict[str, Any], 
        template_id: Optional[str] = None,
        post_immediately: bool = False,
        images: Optional[List[Dict[str, Any]]] = None, 
        schedule_time: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generate content for specified platforms and event, with option to post immediately.
        
        Args:
            platforms: List of social media platforms
            event_data: Data about the event
            template_id: Optional template ID to use
            post_immediately: Whether to post the content immediately
            images: Optional list of image objects with paths and alt_text
            schedule_time: Optional time to schedule the post (ISO format)
            
        Returns:
            Generated content with metadata and post IDs if posted
        """
        results = {}
        
        # Generate content for each platform
        for platform in platforms:
            # Generate the social post
            post_content = await self._generate_social_post(
                platform=platform,
                event_data=event_data,
                template_id=template_id,
                use_past_performance=True
            )
            
            # Save the generated content to the kinetic layer
            content_id = await self._save_generated_content(post_content)
            post_content["id"] = content_id
            
            results[platform] = post_content
        
        # Post to social media if requested
        if post_immediately or schedule_time:
            # For each platform, create a structured post
            post_ids = {}
            for platform in platforms:
                post_text = results[platform]["text"]
                
                # Only post to supported platforms (LinkedIn and Bluesky)
                if platform in ["linkedin", "bluesky"]:
                    platform_result = await self._post_to_social_media(
                        content={"text": post_text},
                        platforms=[platform],
                        images=images,
                        link=event_data.get("link"),
                        schedule_time=schedule_time
                    )
                    
                    # Store post IDs
                    if platform in platform_result:
                        post_id = platform_result[platform]["id"]
                        post_ids[platform] = post_id
                        results[platform]["post_id"] = post_id
            
            results["post_ids"] = post_ids
        
        return results
    
    async def record_content_performance(self, content_id: str, performance_metrics: Dict[str, Any]) -> None:
        """
        Record performance metrics for previously generated content.
        
        Args:
            content_id: ID of the content to update
            performance_metrics: Metrics data (engagement, clicks, etc.)
        """
        # This would update the content in the dynamic layer with performance data
        
        # Calculate an overall performance score
        engagement_rate = performance_metrics.get("engagement_rate", 0)
        click_rate = performance_metrics.get("click_rate", 0)
        performance_score = (engagement_rate + click_rate) / 2
        
        # Save the content with performance data to the dynamic layer
        # Fetch the original content first
        query_embedding = await self.embedding_service.generate_embeddings(f"content id:{content_id}")
        results = await self.vector_store.query(
            chapter_id=self.chapter_id,
            layer="kinetic",
            query_embedding=query_embedding,
            filter={"type": "social_post", "id": content_id},
            top_k=1
        )
        
        if results:
            content = results[0]["metadata"]["content"]
            # Add performance data
            content["performance"] = performance_metrics
            content["performance_score"] = performance_score
            
            # Save to the dynamic layer
            await self._save_generated_content(content, performance_metrics)
        
        # For metrics tracking purposes
        print(f"Recorded performance for content {content_id}: {performance_score}")
        
    async def fetch_platform_metrics(self, post_ids: Dict[str, str]) -> Dict[str, Dict[str, Any]]:
        """
        Fetch latest metrics from social media platforms.
        
        Args:
            post_ids: Dictionary mapping platforms to their respective post IDs
            
        Returns:
            Dictionary mapping platforms to their respective metrics
        """
        metrics = await self._get_social_media_metrics(post_ids)
        
        # Process the metrics if needed
        for platform, platform_metrics in metrics.items():
            # Calculate aggregate metrics
            if platform == "linkedin":
                engagement = platform_metrics.get("likes", 0) + platform_metrics.get("comments", 0) + platform_metrics.get("shares", 0)
                impressions = platform_metrics.get("impressions", 1)  # Avoid division by zero
                platform_metrics["engagement_rate"] = engagement / impressions
                
            elif platform == "bluesky":
                engagement = platform_metrics.get("likes", 0) + platform_metrics.get("reposts", 0) + platform_metrics.get("replies", 0)
                impressions = platform_metrics.get("impressions", 1)  # Avoid division by zero
                platform_metrics["engagement_rate"] = engagement / impressions
        
        return metrics
