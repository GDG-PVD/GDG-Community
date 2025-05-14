# Integrations

This directory contains integrations with external services and platforms.

## Social Media Platforms

- `twitter.py`: Integration with Twitter/X API
- `linkedin.py`: Integration with LinkedIn API
- `facebook.py`: Integration with Facebook API
- `discord.py`: Integration with Discord API

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
from gdg_community.integrations.twitter import TwitterService

# Initialize the service with credentials
twitter = TwitterService(
    api_key="your_api_key",
    api_secret="your_api_secret",
    access_token="your_access_token",
    access_token_secret="your_access_token_secret"
)

# Post content to Twitter
await twitter.post_tweet(
    text="Join our upcoming Flutter workshop!",
    media_ids=["media_id_1", "media_id_2"]
)
```

## Authentication Flow

Most integrations require authentication via OAuth. The authentication flow is handled by the OAuth service:

```python
from gdg_community.integrations.oauth_service import OAuthService

# Initialize the OAuth service
oauth = OAuthService()

# Get the authentication URL for a platform
auth_url = await oauth.get_auth_url("twitter")

# Exchange the authorization code for tokens
tokens = await oauth.exchange_code("twitter", auth_code)

# Store the tokens
await oauth.store_tokens("twitter", "user_id", tokens)
```
