# Customization Guide

This guide explains how to customize the GDG Community Companion for your chapter's specific needs.

## Overview

The GDG Community Companion is designed to be customizable at several layers:

1. **Chapter Identity**: Logo, colors, branding
2. **Content Templates**: Event announcements, recaps, etc.
3. **Knowledge Structure**: Categories, taxonomies, and tags
4. **Integration Settings**: Social media and event platforms
5. **Agent Behavior**: Content voice, style, and strategies

## Chapter Identity Customization

### Brand Configuration

The brand configuration is stored in the vector database's semantic layer:

```python
brand_voice = {
    "tone": "Friendly, approachable, technical but not intimidating",
    "values": ["Community", "Learning", "Innovation", "Inclusivity"],
    "style_guide": {
        "emojis": "Use sparingly to emphasize key points",
        "hashtags": ["#GDG", "#YourChapterName", "#Google"],
        "formatting": "Short paragraphs, clear CTAs"
    }
}

# Store in your vector database
await vector_store.store_item(
    chapter_id="your-chapter-id",
    layer="semantic",
    item_id="brand_voice",
    embedding=embedding,
    metadata={"type": "brand_voice", "content": brand_voice}
)
```

### UI Customization

Modify the UI theme in `src/ui/src/theme.ts`:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1A73E8', // Google Blue
      light: '#4285F4', // Google Blue light
      dark: '#0D47A1', // Google Blue dark
    },
    secondary: {
      main: '#34A853', // Google Green
      light: '#4CAF50', // Google Green light
      dark: '#1B5E20', // Google Green dark
    },
    // Add your custom colors
    custom: {
      gdgRed: '#EA4335',
      gdgYellow: '#FBBC04',
    },
  },
  // Custom typography
  typography: {
    fontFamily: '"Google Sans", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});
```

## Content Template Customization

### Creating Custom Templates

Templates are stored in the vector database's semantic layer:

```python
# Example event announcement template
event_template = {
    "id": "workshop-announcement",
    "name": "Workshop Announcement",
    "template": "Excited to announce our upcoming {tech_topic} workshop on {date} at {time}! Join us to learn {learning_objective} through hands-on exercises. Bring your laptop and curiosity! Register: {link}",
    "platforms": ["linkedin", "bluesky"]
}

# Store in your vector database
await vector_store.store_item(
    chapter_id="your-chapter-id",
    layer="semantic",
    item_id="template_workshop_announcement",
    embedding=embedding,
    metadata={"type": "template", "template_type": "workshop-announcement", "content": event_template}
)
```

### Platform-Specific Templates

Create templates optimized for specific platforms:

```python
# LinkedIn-specific template
linkedin_template = {
    "id": "linkedin-announcement",
    "name": "LinkedIn Event Announcement",
    "template": "🔔 Upcoming Workshop Alert 🔔\n\nJoin {chapter_name} for an immersive workshop on {tech_topic}.\n\n📆 Date: {date}\n⏰ Time: {time}\n📍 Location: {location}\n\nWhat you'll learn:\n- {learning_point_1}\n- {learning_point_2}\n- {learning_point_3}\n\nThis is perfect for developers who want to {learning_objective}.\n\nRegister now: {link}",
    "platforms": ["linkedin"]
}

# Bluesky-specific template (shorter format)
bluesky_template = {
    "id": "bluesky-announcement",
    "name": "Bluesky Event Announcement",
    "template": "{chapter_name} presents: {tech_topic} workshop! {date} at {time}. Learn {learning_objective}. Details & registration: {link}",
    "platforms": ["bluesky"]
}
```

## Knowledge Structure Customization

### Custom Knowledge Categories

Define custom knowledge categories for your chapter's specific needs:

```python
# Define taxonomy in code or via admin UI
knowledge_taxonomy = {
    "event_types": [
        "Workshop", "Tech Talk", "Hackathon", "Study Jam", 
        "Social Mixer", "Q&A Session", "Code Lab"
    ],
    "technologies": [
        "Flutter", "Firebase", "TensorFlow", "Android", 
        "Web", "Cloud", "AR/VR", "Assistant"
    ],
    "audience_levels": [
        "Beginner", "Intermediate", "Advanced", "All Levels"
    ],
    "content_formats": [
        "Article", "Video", "Slides", "Code Repository", 
        "Live Demo", "Interactive Tutorial"
    ]
}

# Store in your vector database
await vector_store.store_item(
    chapter_id="your-chapter-id",
    layer="semantic",
    item_id="knowledge_taxonomy",
    embedding=embedding,
    metadata={"type": "taxonomy", "content": knowledge_taxonomy}
)
```

### Initializing Knowledge Base

Populate your knowledge base with chapter-specific information:

```python
# Initialize with your chapter's specific details
chapter_info = {
    "name": "GDG Your City",
    "location": "Your City, Country",
    "founded": "2020",
    "description": "A community of developers interested in Google technologies in Your City.",
    "website": "https://gdg.community/your-city",
    "meetup": "https://meetup.com/gdg-your-city",
    "social_media": {
        "linkedin": "https://linkedin.com/company/gdg-your-city",
        "bluesky": "@gdgyourcity.bsky.social"
    },
    "organizers": [
        {"name": "Jane Doe", "role": "Lead Organizer"},
        {"name": "John Smith", "role": "Technical Lead"}
    ]
}

# Store in your vector database
await vector_store.store_item(
    chapter_id="your-chapter-id",
    layer="semantic",
    item_id="chapter_info",
    embedding=embedding,
    metadata={"type": "chapter_info", "content": chapter_info}
)
```

## Integration Customization

### Event Platform Integration

Configure integration with your chapter's event management platform:

```python
# In src/integrations/event_platform.py
class EventPlatformService:
    def __init__(self, platform="meetup"):
        self.platform = platform
        # Switch based on platform
        if platform == "meetup":
            self.base_url = "https://api.meetup.com"
            self.group_urlname = "gdg-your-city"
        elif platform == "eventbrite":
            self.base_url = "https://www.eventbriteapi.com/v3"
            self.organization_id = "YOUR_ORGANIZATION_ID"
        elif platform == "gdg_platform":
            self.base_url = "https://gdg.community/api"
            self.chapter_id = "your-city"
```

### Social Media Customization

Adjust the social media service to match your posting preferences:

```python
# In src/integrations/social_media_service.py
class SocialMediaService:
    # Modify post_content method for your chapter's specific needs
    async def post_content(
        self,
        text: str,
        platforms: List[str] = ["linkedin", "bluesky"],
        images: Optional[List[Dict[str, Any]]] = None,
        link: Optional[str] = None,
        schedule_time: Optional[datetime] = None,
        hashtags: Optional[List[str]] = None,  # Added parameter
    ) -> Dict[str, Any]:
        # Add your chapter's default hashtags
        default_hashtags = ["#GDG", "#YourCity", "#Google"]
        all_hashtags = default_hashtags + (hashtags or [])
        
        # Customize text for each platform
        if "linkedin" in platforms:
            # Add hashtags as a footer for LinkedIn
            linkedin_text = f"{text}\n\n{' '.join(all_hashtags)}"
            # Rest of implementation...
```

## Agent Behavior Customization

### Content Agent Customization

Customize the content agent's behavior:

```python
# In src/agents/content_agent.py
class ContentAgent:
    # Override or extend methods to customize behavior
    
    async def _generate_social_post(
        self, 
        platform: str, 
        event_data: Dict[str, Any], 
        template_id: Optional[str] = None,
        use_past_performance: bool = True,
        custom_style: Optional[Dict[str, Any]] = None  # Added parameter
    ) -> Dict[str, Any]:
        # Get your chapter's brand voice
        brand_voice = await self._get_brand_voice()
        
        # Override with custom style if provided
        if custom_style:
            for key, value in custom_style.items():
                if key in brand_voice:
                    brand_voice[key] = value
        
        # Rest of implementation...
```

### Custom Agent Prompts

Create custom prompts for your chapter's specific content needs:

```python
# Extended prompts for specialized content
workshop_prompt_template = """
Generate a {platform} post for a hands-on workshop:

Title: {title}
Topic: {tech_topic}
Date: {date}
Time: {time}
Technical Level: {level}

Format this as a step-by-step invitation that highlights:
1. The specific technologies covered ({tech_topic})
2. What participants will build/create during the workshop
3. What they should bring or prepare beforehand
4. Key learning outcomes

Use your {chapter_name} brand voice that is {tone} and emphasizes {values}.
Include a strong call-to-action at the end.
"""

# Use in your code
prompt = workshop_prompt_template.format(
    platform="LinkedIn",
    title="Flutter UI Masterclass",
    tech_topic="Flutter, Material Design 3",
    date="June 15th",
    time="6:00 PM",
    level="Intermediate",
    chapter_name="GDG Your City",
    tone=brand_voice["tone"],
    values=", ".join(brand_voice["values"])
)
```

## Advanced Customization

### Custom Agent Implementation

For more specialized needs, extend the base agent classes:

```python
from src.agents.content_agent import ContentAgent

class LocalizedContentAgent(ContentAgent):
    """Extended content agent with localization support."""
    
    def __init__(
        self, 
        chapter_id: str,
        language: str = "en",  # Added parameter
        translation_service: Optional[TranslationService] = None,  # Added parameter
        *args, **kwargs
    ):
        super().__init__(chapter_id, *args, **kwargs)
        self.language = language
        self.translation_service = translation_service or TranslationService()
    
    async def generate_localized_content(
        self,
        platforms: List[str],
        event_data: Dict[str, Any],
        languages: List[str] = ["en"],  # Generate in multiple languages
        *args, **kwargs
    ) -> Dict[str, Dict[str, Any]]:
        results = {}
        
        # Generate base content in English
        english_content = await self.generate_content(
            platforms=platforms,
            event_data=event_data,
            *args, **kwargs
        )
        
        results["en"] = english_content
        
        # Generate translations
        for lang in languages:
            if lang != "en":
                lang_results = {}
                for platform, content in english_content.items():
                    if isinstance(content, dict) and "text" in content:
                        translated_text = await self.translation_service.translate(
                            content["text"], target_language=lang
                        )
                        lang_content = content.copy()
                        lang_content["text"] = translated_text
                        lang_results[platform] = lang_content
                results[lang] = lang_results
        
        return results
```

### Plugin System

For the most flexible customization, use the plugin system:

```python
# In src/plugins/custom_plugin.py
from src.plugins.base_plugin import BasePlugin

class ChapterSpecificPlugin(BasePlugin):
    """Custom plugin for chapter-specific functionality."""
    
    def __init__(self, config: Dict[str, Any] = None):
        super().__init__(config)
        # Your initialization code
    
    def register_hooks(self):
        """Register hooks into the main application."""
        return {
            "pre_content_generation": self.pre_content_hook,
            "post_content_generation": self.post_content_hook,
            "customize_template": self.template_customizer
        }
    
    async def pre_content_hook(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """Pre-process event data before content generation."""
        # Add chapter-specific data enrichment
        if "location" in event_data:
            # Add custom location formatting
            location = event_data["location"]
            event_data["formatted_location"] = f"{location['name']}, {location['address']}"
            event_data["map_link"] = f"https://maps.google.com/?q={location['lat']},{location['lng']}"
        
        return event_data
    
    async def post_content_hook(self, 
                               content: Dict[str, Any], 
                               event_data: Dict[str, Any]
                              ) -> Dict[str, Any]:
        """Post-process generated content."""
        # Add custom footer to all content
        for platform, platform_content in content.items():
            if isinstance(platform_content, dict) and "text" in platform_content:
                platform_content["text"] += "\n\nPowered by GDG Your City"
        
        return content
    
    async def template_customizer(self, 
                                 template: Dict[str, Any], 
                                 platform: str
                                ) -> Dict[str, Any]:
        """Customize templates for specific platforms."""
        # Add chapter-specific template modifications
        if platform == "linkedin" and template["id"] == "event-announcement":
            template["template"] += "\n\n#GDGYourCity #TechCommunity"
        
        return template
```

## Configuration File Approach

For simpler customizations, use the configuration file:

```yaml
# config/chapter_config.yaml
chapter:
  id: your-city
  name: GDG Your City
  location: Your City, Country
  description: A community of developers interested in Google technologies in Your City.
  founded: 2020
  website: https://gdg.community/your-city
  social_media:
    linkedin: https://linkedin.com/company/gdg-your-city
    bluesky: "@gdgyourcity.bsky.social"

branding:
  colors:
    primary: "#1A73E8"
    secondary: "#34A853"
    accent: "#FBBC04"
  logo: "assets/your-chapter-logo.png"
  tone: "Friendly, approachable, technical but not intimidating"
  values:
    - Community
    - Learning
    - Innovation
    - Inclusivity
  hashtags:
    - "#GDG"
    - "#YourCity"
    - "#GoogleDevs"

content:
  default_platforms:
    - linkedin
    - bluesky
  schedule:
    announcement_days_before: 14
    reminder_days_before: 1
    recap_days_after: 1
  custom_templates:
    enabled: true
    path: "templates/custom/"

integrations:
  event_platform: "meetup"
  event_platform_id: "gdg-your-city"
  analytics_enabled: true
```

Load the configuration in your code:

```python
import yaml

def load_chapter_config(chapter_id: str) -> Dict[str, Any]:
    """Load chapter-specific configuration."""
    try:
        with open(f"config/{chapter_id}_config.yaml", "r") as file:
            return yaml.safe_load(file)
    except FileNotFoundError:
        # Fall back to default config
        with open("config/default_config.yaml", "r") as file:
            return yaml.safe_load(file)
```

## Next Steps

After customizing your GDG Community Companion:

1. Test thoroughly with your specific content needs
2. Run a pilot with a small subset of events
3. Gather feedback from your chapter organizers and members
4. Iterate on your customizations as needed

For examples of customization implementations from other GDG chapters, see the [Community Examples](../examples/README.md) directory.