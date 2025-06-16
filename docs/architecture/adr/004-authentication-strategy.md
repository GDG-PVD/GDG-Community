# ADR-004: Mock Authentication for Development

## Status
Accepted

## Context
During development, we needed a way to:
- Test the application without Firebase configuration
- Allow UI development without backend dependencies
- Provide quick demos without authentication setup
- Support offline development scenarios

## Decision
We implemented a mock authentication system that:
- Can be enabled/disabled via environment variable (`REACT_APP_MOCK_AUTH_ENABLED`)
- Provides a mock user with admin privileges
- Bypasses Firebase authentication when enabled
- Automatically disabled in production builds

## Implementation
```javascript
const MOCK_USER_ENABLED = process.env.REACT_APP_MOCK_AUTH_ENABLED === 'true';
```

## Consequences

### Positive
- Faster development iterations
- No Firebase setup required for UI work
- Easy onboarding for new developers
- Consistent test user for demos

### Negative
- Risk of accidentally deploying with mock auth enabled
- Potential security risk if misconfigured
- Different behavior between dev and prod

### Safeguards
- Environment variable must explicitly be set to 'true'
- Production builds have it set to 'false'
- Debug component shows authentication status
- Build process validates configuration