# ADR 014: Authentication Collection Structure

## Status

Accepted

## Context

The application uses Firebase Authentication for user management and stores additional user profile information in Firestore. During implementation, we discovered an inconsistency in how user profile data was being stored and accessed:

1. Some user profiles were stored in a `users` collection
2. Others were stored in a `members` collection
3. The authentication logic in `AuthContext.tsx` was only checking the `members` collection

This inconsistency led to authentication issues where:
- Users could successfully log in the first time
- After logging out and back in, they would see "User profile not found" errors
- The application couldn't locate their profile information despite successful Firebase authentication

Additionally, we observed that the mock authentication mode (`REACT_APP_MOCK_AUTH_ENABLED`) was sometimes inadvertently enabled in production environments, causing authentication bypasses.

## Decision

We've decided to implement the following changes:

1. **Dual Collection Checking**: Modify the authentication logic to check both `users` and `members` collections, with a preference for `users` first, then falling back to `members` if not found.

2. **Explicit Environment Flag**: Ensure that `REACT_APP_MOCK_AUTH_ENABLED` is explicitly set to `false` in all production environment files.

3. **Improved Error Logging**: Add more detailed logging to help diagnose authentication issues, including clear indications of which collection was checked and the results.

4. **Documentation**: Update documentation to clarify the expected collection structure and the authentication flow.

## Consequences

### Positive

- Users can now successfully authenticate regardless of which collection their profile is stored in
- Better logging enables easier troubleshooting of authentication issues
- Explicit environment configuration prevents accidental mock authentication in production
- Backwards compatibility with existing user data in both collections

### Negative

- Maintains technical debt of having two separate collections for user profiles
- Slightly increased complexity in the authentication logic
- Additional database reads for each authentication attempt

## Implementation

The implementation involves modifying the `AuthContext.tsx` component to first check the `users` collection and then fall back to the `members` collection if no profile is found. This dual-collection approach provides a migration path while ensuring backward compatibility.

```typescript
// Example code snippet from implementation
// First try to get user profile from 'users' collection
let userDoc = await getDoc(doc(db, 'users', user.uid));

// If not found in 'users', try 'members' collection as fallback
if (!userDoc.exists()) {
  console.log('User profile not found in "users" collection, trying "members" collection...');
  userDoc = await getDoc(doc(db, 'members', user.uid));
}
```

We've also added additional environment configuration validation and improved error messaging throughout the authentication flow.

## Future Considerations

In the future, we should consider:

1. Migrating all user profiles to a single collection
2. Adding a database migration script to consolidate profiles
3. Implementing a more robust role-based access control system
4. Adding unit tests specifically for authentication edge cases