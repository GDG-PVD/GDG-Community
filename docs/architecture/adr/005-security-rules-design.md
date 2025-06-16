# ADR-005: Firestore Security Rules Design

## Status
Accepted

## Context
We needed to implement security rules that:
- Protect user data and chapter information
- Allow appropriate access based on roles
- Support both admin and member permissions
- Enable public read access for certain data
- Prevent unauthorized modifications

## Decision
We implemented a role-based security system with:
- Admin role: Full access to all resources
- Member role: Read access to chapter data, limited write access
- Public access: Read-only for events and chapters
- Helper functions for common checks

## Implementation
```javascript
function isAdmin() {
  return isAuthenticated() && 
         exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

## Consequences

### Positive
- Fine-grained access control
- Secure by default
- Role-based permissions
- Scalable security model
- Easy to audit and understand

### Negative
- Complex rules can impact performance
- Need to maintain rules as features evolve
- Testing security rules requires specific setup

### Key Security Decisions
- Users can only modify their own profile
- Admin users can access everything
- Platform credentials are admin-only
- Public read access for events and chapters
- All writes require authentication