# ADR-0024: Storage Service V2 - Multi-Approach Solution

## Date
2025-05-16

## Status
Accepted

## Context
After extensive testing, we confirmed that the Firebase Storage webpack bundling issue is not version-specific but rather a fundamental incompatibility between Firebase's service registration mechanism and webpack's bundling process. Testing revealed:

1. Firebase v10 has the same issue as v9
2. Dynamic imports can load the module but not initialize storage
3. CDN approach works but is not ideal
4. The issue is related to webpack configuration and Node.js polyfills

## Decision
Implement a multi-approach Storage Service V2 that:
1. Attempts dynamic imports first
2. Falls back to CDN if dynamic imports fail
3. Provides a unified API regardless of the underlying approach
4. Handles all storage operations transparently

## Solution Details

### Approach Order
1. **Dynamic Import**: Attempts to load Firebase Storage at runtime
2. **CDN Fallback**: Uses the existing CDN workaround if dynamic fails
3. **Native Module**: Final attempt using standard imports

### Key Features
- Automatic fallback between approaches
- Progress tracking for uploads
- Consistent API across all approaches
- Debugging information about which approach is used

### Webpack Configuration
Based on research, the webpack bundling issue can be resolved by:
- Setting proper mainFields resolution
- Adding Node.js polyfills
- Targeting ES2017+
- Using CRACO for webpack configuration override

## Implementation

```typescript
// Unified interface regardless of approach
export async function uploadFileV2(
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string>

export async function deleteFileV2(path: string): Promise<void>
export async function getFileUrlV2(path: string): Promise<string>
```

## Consequences

### Positive
- Provides immediate working solution
- Transparent to the application code
- Maintains performance and functionality
- Easy to remove once webpack issue is resolved
- Better error handling and debugging

### Negative
- Adds complexity to the codebase
- Maintains CDN dependency as fallback
- May have slight performance overhead
- Requires careful testing of all approaches

## Migration Path

### Phase 1: Implement Service V2
1. Deploy Storage Service V2
2. Test all approaches thoroughly
3. Monitor which approach is used in production

### Phase 2: Update Application
1. Replace direct storage usage with Service V2
2. Update EventCreate component
3. Remove direct CDN imports where possible

### Phase 3: Long-term Fix
1. Monitor webpack and Firebase updates
2. Implement CRACO configuration if needed
3. Remove fallback approaches once native works

## References
- [Bundling Firebase v10's Cloud Storage SDK with webpack](webpack research document)
- Test results showing dynamic import partial success
- ADR-0023: Firebase Storage Webpack Root Cause Analysis

## Next Steps
1. Deploy and test Storage Service V2
2. Update EventCreate to use new service
3. Monitor approach usage in production
4. Investigate CRACO configuration as permanent fix
5. Remove CDN fallback once native approach works