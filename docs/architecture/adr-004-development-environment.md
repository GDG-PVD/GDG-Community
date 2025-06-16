# ADR 4: Mock Authentication and Development Environment

## Context and Problem Statement

The GDG Community Companion relies on Firebase for authentication, Firestore for data storage, and various APIs for social media integration. This creates challenges for developers who need to work on the UI and application logic without setting up the full infrastructure. We need a development environment approach that balances ease of setup with realistic testing conditions.

## Decision Drivers

- Need for developers to quickly set up and run the application
- Requirement to develop UI components without real authentication
- Desire to test application flows without actual Firebase project
- Need for consistent development experience across team members
- Requirement to easily switch between development and production modes

## Considered Options

1. **Real Firebase Project**: Require all developers to use a shared Firebase project
2. **Local Firebase Emulators**: Use Firebase emulators for all services
3. **Mock Services Only**: Create mock implementations of all external services
4. **Hybrid Approach**: Use mock authentication with emulators for other services

## Decision Outcome

Chosen option: **Hybrid Approach with Mock Authentication**, because it provides the easiest setup experience while still allowing for realistic testing when needed.

### Detailed Structure

1. **Mock Authentication System**
   - Default configuration uses a mock user with admin privileges
   - No real Firebase authentication required for basic development
   - Simple toggle to enable/disable mock mode
   - Realistic UI experience without authentication complexity

2. **Firebase Emulators Integration**
   - Configuration for Firebase emulators (Auth, Firestore)
   - Automatic detection and connection when emulators are running
   - Fallback to mock services when emulators are not available
   - Standard port configuration for consistent environment

3. **Environment Configuration**
   - Use of environment variables for configuration
   - TypeScript configuration optimized for React development
   - Clear separation between development and production settings

## Implementation Strategy

The development environment is implemented using:

- **Feature Flag**: `MOCK_USER_ENABLED` controls whether authentication is mocked
- **Custom AuthContext**: Provides both mock and real authentication flows
- **Firebase Emulator Detection**: Automatic detection based on localhost
- **Development README**: Comprehensive documentation for setup options

## Code Example

```typescript
// Mock user implementation in AuthContext
if (MOCK_USER_ENABLED) {
  // Create a mock user for development
  const mockUser = {
    uid: 'mock-user-id',
    email: 'test@example.com',
    displayName: 'Test User',
  } as FirebaseUser;

  const mockUserProfile = {
    id: 'mock-user-id',
    email: 'test@example.com',
    displayName: 'Test User',
    role: 'admin' as const,
    chapterId: 'gdg-providence',
  };

  setUser(mockUser);
  setUserProfile(mockUserProfile);
  setLoading(false);
}
```

## Consequences

### Positive

- Dramatically simplifies the development setup process
- Enables UI development without Firebase configuration
- Provides a consistent development experience across the team
- Offers flexibility to test with real or mock services as needed
- Streamlines onboarding for new developers

### Negative

- Mock data may not fully represent real production behavior
- Need to maintain both mock and real service implementations
- Potential for divergence between development and production environments
- Risk of developers not testing with real services before deployment

## Follow-up Actions

- Create comprehensive test suites that work with both mock and real services
- Develop CI/CD pipeline that tests with both mock and emulated services
- Document the process for switching between development modes
- Consider extracting service interfaces for better separation of concerns