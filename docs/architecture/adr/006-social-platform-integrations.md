# ADR-006: Social Platform Integration Strategy

## Status
Accepted

## Context
The GDG Community Companion needed to integrate with social media platforms for content distribution. We had to decide:
- Which platforms to support
- Authentication methods for each platform
- How to handle API limitations
- Content formatting strategies

## Decision
We will support:
1. **LinkedIn** - Using OAuth 2.0 for authentication
2. **Bluesky** - Using app passwords for authentication
3. **No Twitter/X support** - Due to API cost changes

## Implementation Details

### LinkedIn
- OAuth 2.0 flow for user authentication
- Access tokens stored securely in Firestore
- Organization page posting via member permissions
- Rate limiting: 100 requests per day

### Bluesky
- App password authentication
- AT Protocol for posting
- Rate limiting: 5000 requests per day

## Consequences

### Positive
- Professional platforms aligned with GDG audience
- Reasonable API costs (LinkedIn) or free (Bluesky)
- Good API documentation and stability
- OAuth provides secure authentication

### Negative
- No Twitter/X support limits reach
- LinkedIn API requires business verification
- Different authentication methods per platform
- Need to handle multiple API formats

### Future Considerations
- Monitor Twitter/X API pricing changes
- Consider Mastodon integration
- Evaluate Threads API when available