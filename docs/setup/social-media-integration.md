# Social Media Integration Guide

This guide explains how to set up and configure social media integrations for the GDG Community Companion.

## Supported Platforms

The Community Companion currently supports the following social media platforms:

- **LinkedIn**: Professional network for industry and career-focused content
- **Bluesky**: Modern decentralized platform using the AT Protocol

## Configuration

### Prerequisites

Before setting up social media integrations, ensure:

1. You have a Google Cloud project set up
2. Secret Manager is enabled on your project
3. You have admin access to your GDG chapter's social media accounts

### LinkedIn Configuration

1. **Create LinkedIn Developer App**:
   - Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps)
   - Click "Create App" and complete the form
   - Under Products, add "Share on LinkedIn" and "Sign In with LinkedIn"
   - Add authorized redirect URLs: `https://[YOUR-PROJECT-ID].firebaseapp.com/oauth/callback`

2. **Add LinkedIn Secrets**:
   - In Google Cloud Console, navigate to Secret Manager
   - Create a new secret named `linkedin-client-id` with your LinkedIn app's Client ID
   - Create a new secret named `linkedin-client-secret` with your LinkedIn app's Client Secret

3. **Configure LinkedIn in your app**:
   ```python
   from src.integrations.linkedin import LinkedInService
   
   # Initialize the service with credentials
   linkedin = LinkedInService(
       access_token="your_access_token",  # Use OAuth flow to obtain this
       organization_id="your_organization_id"  # Optional, for company pages
   )
   ```

### Bluesky Configuration

1. **Create Bluesky App Password**:
   - Log in to your Bluesky account
   - Go to Settings > App Passwords
   - Create a new app password for "GDG Community Companion"
   - Note the generated password and your account identifier

2. **Add Bluesky Secrets**:
   - In Google Cloud Console, navigate to Secret Manager
   - Create a new secret named `bluesky-app-password` with your Bluesky app password

3. **Configure Bluesky in your app**:
   ```python
   from src.integrations.bluesky import BlueskyService
   
   # Initialize the service with credentials
   bluesky = BlueskyService(
       identifier="your.email@example.com",  # Your Bluesky identifier
       app_password="your-app-password"  # From Secret Manager
   )
   ```

## Authentication Flow

### LinkedIn Authentication

LinkedIn uses OAuth 2.0 for authentication:

1. Generate an auth URL:
   ```python
   from src.integrations.oauth_service import OAuthService
   
   oauth = OAuthService()
   auth_url = await oauth.get_auth_url("linkedin")
   ```

2. Direct the user to this URL to authorize your app

3. Handle the callback and exchange the code for tokens:
   ```python
   tokens = await oauth.exchange_code("linkedin", auth_code)
   await oauth.store_tokens("linkedin", "user_id", tokens)
   ```

### Bluesky Authentication

Bluesky uses app passwords instead of OAuth:

1. Store the app password in your environment or Secret Manager
2. Initialize the Bluesky service with the credentials
3. No redirect/callback flow is needed

## Usage Examples

### Posting Content to Both Platforms

Use the unified `SocialMediaService` to post to multiple platforms at once:

```python
from src.integrations.social_media_service import SocialMediaService

# Initialize the service
social_media = SocialMediaService()

# Post to both LinkedIn and Bluesky
results = await social_media.post_content(
    text="Join our upcoming Flutter workshop!",
    platforms=["linkedin", "bluesky"],
    images=[
        {
            "path": "/path/to/image.jpg",
            "title": "Workshop Banner",
            "alt_text": "GDG Flutter Workshop Banner"
        }
    ],
    link="https://gdg.community/events/flutter-workshop"
)

# Store post IDs for later metrics retrieval
post_ids = {
    "linkedin": results["linkedin"]["id"],
    "bluesky": results["bluesky"]["uri"],
}
```

### Retrieving Engagement Metrics

```python
# Get metrics from both platforms
metrics = await social_media.get_metrics(post_ids)

# Process the metrics
for platform, platform_metrics in metrics.items():
    print(f"{platform} metrics:")
    for metric, value in platform_metrics.items():
        print(f"  {metric}: {value}")
```

## Troubleshooting

### LinkedIn Issues

- **401 Unauthorized**: Check that your access token is valid and hasn't expired
- **403 Forbidden**: Verify that the requested action is allowed for your app's permissions
- **Token Expiration**: LinkedIn tokens expire. Implement token refresh logic

### Bluesky Issues

- **Authentication Failed**: Verify your identifier and app password are correct
- **Rate Limiting**: Bluesky has rate limits. Implement exponential backoff for retries
- **Content Formatting**: Ensure your content complies with Bluesky's content guidelines

## Next Steps

- Consider implementing content scheduling for optimal posting times
- Add image optimization for platform-specific requirements
- Implement A/B testing for content variations

For more advanced usage, refer to the [API documentation](../api/README.md).