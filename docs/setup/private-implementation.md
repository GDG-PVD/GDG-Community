# Private Implementation Guide

This guide explains how to implement the GDG Community Companion for your chapter while keeping sensitive information private.

## Overview

While the GDG Community Companion is an open-source project, your chapter's specific implementation will contain private information such as:

- API keys and credentials
- Social media account details
- Chapter-specific content and strategies
- Member and organizer information

This guide outlines how to maintain a private implementation while still benefiting from updates to the core codebase.

## Recommended Approach

### 1. Fork + Private Repository Pattern

The recommended approach is to:

1. **Fork the public repository** to track upstream changes
2. **Create a private repository** for your chapter's specific implementation
3. **Use the private repository** for day-to-day operations
4. **Periodically sync** public updates to your private implementation

This allows you to:
- Keep sensitive information private
- Customize the system for your chapter
- Pull in updates and bug fixes from the main project
- Contribute non-sensitive enhancements back to the main project

## Implementation Steps

### Step 1: Create Your Private Repository

```bash
# Clone the public repository
git clone https://github.com/gdg-community/gdg-community-companion.git
cd gdg-community-companion

# Create a new private repository (e.g. on GitHub)
# Then add it as a remote
git remote add private https://github.com/YOUR_ORG/gdg-chapter-private.git

# Push to your private repository
git push private main
```

### Step 2: Set Up Environment Variables

Create a `.env` file in your private repository:

```
# .env (add to .gitignore)
GOOGLE_CLOUD_PROJECT=gdg-community-YOUR_CHAPTER_ID
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
BLUESKY_IDENTIFIER=your.email@example.com
BLUESKY_APP_PASSWORD=your_bluesky_app_password
PINECONE_API_KEY=your_pinecone_api_key
```

Add `.env` to your `.gitignore` file:

```bash
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Add .env to gitignore"
git push private main
```

### Step 3: Create Chapter Configuration

Create a configuration file for your chapter:

```bash
mkdir -p config
```

Create `config/chapter_config.yaml`:

```yaml
# Chapter-specific configuration
chapter:
  id: your-city
  name: GDG Your City
  location: Your City, Country
  website: https://gdg.community/your-city
  social_media:
    linkedin: https://linkedin.com/company/gdg-your-city
    bluesky: "@gdgyourcity.bsky.social"

# Other configuration sections (see customization guide)
```

### Step 4: Initialize Your Knowledge Base

Create initialization scripts in your private repository:

```python
# scripts/initialize_knowledge.py
import asyncio
import os
from dotenv import load_dotenv
from src.knowledge.vector_store import VectorStore
from src.knowledge.embedding_service import EmbeddingService

# Load environment variables
load_dotenv()

# Initialize services
vector_store = VectorStore()
embedding_service = EmbeddingService()

async def initialize_chapter_knowledge():
    """Initialize the knowledge base with chapter-specific data."""
    # Initialize vector store
    vector_store.initialize()
    
    # Brand voice
    brand_voice = {
        "tone": "Friendly, approachable, technical but not intimidating",
        "values": ["Community", "Learning", "Innovation", "Inclusivity"],
        "style_guide": {
            "emojis": "Use sparingly to emphasize key points",
            "hashtags": ["#GDG", "#YourCity", "#GoogleDevs"],
            "formatting": "Short paragraphs, clear CTAs"
        }
    }
    
    brand_voice_embedding = await embedding_service.generate_embeddings(
        "brand voice tone style guidelines"
    )
    
    await vector_store.store_item(
        chapter_id="your-chapter-id",
        layer="semantic",
        item_id="brand_voice",
        embedding=brand_voice_embedding,
        metadata={"type": "brand_voice", "content": brand_voice}
    )
    
    # Add other chapter-specific knowledge items
    # ...

# Run the initialization
if __name__ == "__main__":
    asyncio.run(initialize_chapter_knowledge())
```

### Step 5: Create Chapter-Specific Templates

Create chapter-specific templates:

```bash
mkdir -p templates/custom
```

Add templates for your chapter (these won't be shared with the public repository):

```python
# templates/custom/event_announcements.py
TEMPLATES = [
    {
        "id": "workshop-announcement-your-city",
        "name": "YourCity Workshop Announcement",
        "template": "Join GDG YourCity for our upcoming {tech_topic} workshop on {date}! We'll be at {location} exploring how to {learning_objective}. Perfect for {audience_level} developers. Register now: {link} #GDGYourCity",
        "platforms": ["linkedin", "bluesky"]
    },
    # Add more templates...
]
```

### Step 6: Pull Updates from Public Repository

To receive updates from the public repository:

```bash
# Add the public repository as a remote (if not already done)
git remote add public https://github.com/gdg-community/gdg-community-companion.git

# Fetch updates from the public repository
git fetch public

# Merge changes from the public repository's main branch
git merge public/main

# Resolve any conflicts
# ...

# Push merged changes to your private repository
git push private main
```

## Security Best Practices

### API Keys and Credentials

Always store sensitive credentials securely:

1. **Local Development**: Use `.env` files with `python-dotenv`
2. **Production**: Use Google Secret Manager or similar service
3. **CI/CD**: Use encrypted environment variables or secrets

Example for local development:

```python
# config/settings.py
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Access credentials
LINKEDIN_CLIENT_ID = os.getenv("LINKEDIN_CLIENT_ID")
LINKEDIN_CLIENT_SECRET = os.getenv("LINKEDIN_CLIENT_SECRET")
BLUESKY_APP_PASSWORD = os.getenv("BLUESKY_APP_PASSWORD")
```

### Member Data Protection

If storing member data:

1. **Minimize Data Collection**: Only collect what's necessary
2. **Encrypt Sensitive Data**: Use encryption for personal information
3. **Set Retention Policies**: Automatically delete outdated information
4. **Implement Access Controls**: Limit who can access member data

## Contribution Guidelines

When contributing back to the public repository:

1. **Strip Sensitive Information**: Remove API keys, credentials, and chapter-specific details
2. **Generalize Changes**: Make sure changes are useful for other chapters
3. **Document Well**: Provide clear documentation on your contribution
4. **Submit Pull Requests**: Follow contribution guidelines in the main repository

Example workflow for contributing back:

```bash
# Create a feature branch in your private repository
git checkout -b feature/new-feature

# Make your changes
# ...

# Commit your changes
git commit -m "Add new feature"

# Push to your private repository
git push private feature/new-feature

# Create a clean version for public contribution
git checkout -b feature/new-feature-public
# Remove/generalize chapter-specific code
# ...

# Commit sanitized changes
git commit -m "Add new feature (generalized version)"

# Push to your public fork
git push origin feature/new-feature-public

# Create a pull request to the main repository
```

## Private Customization Examples

### Chapter-Specific Agent Prompt

```python
# In your private repository's src/agents/custom_prompts.py
CHAPTER_PROMPTS = {
    "workshop_announcement": """
    Generate a social media post for GDG YourCity's workshop on {tech_topic}.
    
    Our workshops typically include:
    - Expert speakers from local tech companies
    - Hands-on coding sessions
    - Networking with the YourCity tech community
    
    Location is usually at {location}, our regular venue.
    
    Make sure to mention that participants should bring their laptops and
    any prerequisites should be installed beforehand.
    
    Our posts typically end with our chapter hashtags: #GDGYourCity #TechYourCity
    """,
    # Other chapter-specific prompts...
}
```

### Custom Chapter Plugin

```python
# In your private repository's src/plugins/your_city_plugin.py
from src.plugins.base_plugin import BasePlugin

class YourCityPlugin(BasePlugin):
    """Plugin with YourCity-specific customizations."""
    
    async def pre_content_hook(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """Add YourCity-specific information to event data."""
        # Add local venue information if not specified
        if "location" not in event_data or not event_data["location"]:
            event_data["location"] = {
                "name": "Tech Hub YourCity",
                "address": "123 Main St, YourCity",
                "lat": "12.3456",
                "lng": "78.9012"
            }
        
        # Add local sponsor information if applicable
        if "tech_topic" in event_data:
            topic = event_data["tech_topic"].lower()
            if "flutter" in topic:
                event_data["sponsor"] = "FlutterYourCity"
            elif "cloud" in topic:
                event_data["sponsor"] = "Cloud Tech YourCity"
        
        return event_data
```

## Conclusion

By following this private implementation approach, you can:

1. Keep your chapter's sensitive information secure
2. Customize the Community Companion to your chapter's specific needs
3. Benefit from updates to the main codebase
4. Contribute improvements back to the community when appropriate

For questions or additional guidance, please reach out to the GDG Community Companion maintainers or your regional Google Developer Relations team.