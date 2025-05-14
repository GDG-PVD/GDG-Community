# Integrations

This directory contains integrations with external services and platforms.

## Social Media Platforms

- `linkedin.py`: Integration with LinkedIn API
- `bluesky.py`: Integration with Bluesky API (AT Protocol)

## Event Management

- `meetup.py`: Integration with Meetup API
- `eventbrite.py`: Integration with Eventbrite API
- `gdg_platform.py`: Integration with GDG Platform API

## Authentication

- `oauth_service.py`: OAuth service for managing platform credentials
- `token_manager.py`: Token refresh and management service

## Media Management

- `media_service.py`: Service for managing media assets
- `image_optimizer.py`: Utility for optimizing images for different platforms

## Usage

Each integration module provides a class for interacting with the respective platform:

```python
from gdg_community.integrations.linkedin import LinkedInService

# Initialize the service with credentials
linkedin = LinkedInService(
    access_token="your_access_token",
    organization_id="your_organization_id"
)

# Post content to LinkedIn
await linkedin.post_content(
    text="Join our upcoming Flutter workshop!",
    images=[{"path": "/path/to/image.jpg", "title": "Workshop Banner"}]
)
```

For Bluesky (which uses app passwords instead of OAuth):

```python
from gdg_community.integrations.bluesky import BlueskyService

# Initialize the service with credentials
bluesky = BlueskyService(
    identifier="your.email@example.com",
    app_password="your-app-password"
)

# Post content to Bluesky
await bluesky.post_content(
    text="Join our upcoming Flutter workshop!",
    images=[{"path": "/path/to/image.jpg", "alt_text": "Workshop Banner"}]
)
```

## Authentication Flow

Most integrations require authentication via OAuth. The authentication flow is handled by the OAuth service:

```python
from gdg_community.integrations.oauth_service import OAuthService

# Initialize the OAuth service
oauth = OAuthService()

# Get the authentication URL for LinkedIn
auth_url = await oauth.get_auth_url("linkedin")

# Exchange the authorization code for tokens
tokens = await oauth.exchange_code("linkedin", auth_code)

# Store the tokens
await oauth.store_tokens("linkedin", "user_id", tokens)
```

Note that Bluesky uses app passwords instead of OAuth, so the authentication process is different.