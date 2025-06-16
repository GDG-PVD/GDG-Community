# ADR-007: Environment Configuration Strategy

## Status
Accepted

## Context
We needed a robust way to manage configuration across different environments:
- Development (local)
- Production (Firebase hosting)
- Testing
- Different Firebase projects

Configuration includes:
- Firebase credentials
- API keys for external services
- Feature flags
- Environment-specific URLs

## Decision
We use a hierarchical environment file strategy:
- `.env` - Base configuration
- `.env.local` - Local overrides (git-ignored)
- `.env.production` - Production settings
- `.env.production.local` - Production overrides (git-ignored)

## Implementation
```javascript
// React automatically loads these based on NODE_ENV
process.env.REACT_APP_FIREBASE_API_KEY
process.env.REACT_APP_MOCK_AUTH_ENABLED
process.env.REACT_APP_API_BASE_URL
```

## Consequences

### Positive
- Clear separation of environments
- Sensitive data kept out of version control
- Easy to override settings locally
- Standard React pattern
- Works with Firebase deployment

### Negative
- Must remember to update multiple files
- Risk of configuration drift
- Need to document all variables
- Manual process for new deployments

### Best Practices
- Never commit `.local` files
- Document all environment variables
- Use descriptive variable names
- Validate configuration on startup
- Provide `.env.example` templates