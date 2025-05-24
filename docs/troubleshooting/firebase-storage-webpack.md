# Firebase Storage Webpack Issues Troubleshooting Guide

## Problem Description

When using Firebase Storage SDK v10+ with Create React App (webpack 5), you may encounter errors like:
- `Module not found: Error: Can't resolve 'fs'`
- `Module not found: Error: Can't resolve 'stream'`
- Various polyfill-related errors

This occurs because Firebase Storage SDK has Node.js dependencies that webpack 5 no longer automatically polyfills.

## Solution: Storage Service V2

The Storage Service V2 provides a multi-approach solution that works around these webpack issues.

### Features
1. **Dynamic Import with Fallback**: Attempts to load Firebase Storage dynamically
2. **CDN Fallback**: Falls back to Firebase REST API if dynamic import fails
3. **Consistent API**: Same interface regardless of which approach is used
4. **Error Handling**: Graceful degradation with detailed error messages

### Implementation

```typescript
import { StorageService } from './services/storage-service-v2';

// Initialize the service
const storageService = new StorageService();

// Upload a file
const url = await storageService.uploadFile(file, 'path/to/file.jpg');

// Delete a file
await storageService.deleteFile('path/to/file.jpg');

// Get download URL
const downloadUrl = await storageService.getDownloadURL('path/to/file.jpg');
```

## Alternative Solutions

If you prefer not to use Storage Service V2, here are other approaches:

### 1. CRACO Configuration
Install and configure CRACO to override webpack configuration:
```javascript
// craco.config.js
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        fs: false,
        stream: require.resolve('stream-browserify'),
        // Add other polyfills as needed
      };
      return webpackConfig;
    },
  },
};
```

### 2. Direct REST API Usage
Use Firebase Storage REST API directly without the SDK.

### 3. Downgrade Firebase
Use Firebase SDK v8 which doesn't have these issues (not recommended for new projects).

## Benefits of Storage Service V2
- ✅ No webpack configuration changes needed
- ✅ Works with Create React App out of the box
- ✅ Maintains type safety with TypeScript
- ✅ Handles authentication automatically
- ✅ Production-tested solution

## Related Documentation
- ADR-024: Storage Service V2 Multi-Approach
- ADR-025: Firebase Storage Final Resolution
