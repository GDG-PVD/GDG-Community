# Migrating to Storage Service V2

This guide helps you migrate from direct Firebase Storage usage to Storage Service V2.

## Why Migrate?

If you're experiencing webpack errors with Firebase Storage SDK v10+, Storage Service V2 provides a drop-in solution without requiring webpack configuration changes.

## Migration Steps

### 1. Install Storage Service V2

Copy the following files to your project:
- `src/ui/src/services/storage-service-v2.ts`
- `src/ui/src/services/firebase-storage-cdn.ts`

### 2. Update Your Imports

Replace direct Firebase Storage imports:

```typescript
// Before
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// After
import { StorageService } from './services/storage-service-v2';
```

### 3. Update Your Code

Replace Firebase Storage SDK calls with Storage Service V2:

```typescript
// Before
const storage = getStorage();
const storageRef = ref(storage, 'path/to/file.jpg');
await uploadBytes(storageRef, file);
const url = await getDownloadURL(storageRef);

// After
const storageService = new StorageService();
const url = await storageService.uploadFile(file, 'path/to/file.jpg');
```

### 4. Update Environment Variables

Ensure your environment has the required Firebase configuration:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
```

## API Comparison

| Firebase Storage SDK | Storage Service V2 |
|---------------------|-------------------|
| `uploadBytes(ref, file)` | `uploadFile(file, path)` |
| `getDownloadURL(ref)` | `getDownloadURL(path)` |
| `deleteObject(ref)` | `deleteFile(path)` |
| `listAll(ref)` | `listFiles(path)` |

## Testing Your Migration

1. Start with a single component
2. Replace Firebase Storage usage
3. Test upload, download, and delete operations
4. Monitor browser console for any errors
5. Gradually migrate other components

## Rollback Plan

If you need to rollback:
1. The service is designed to be non-breaking
2. You can use both approaches side-by-side during migration
3. Simply revert your import changes to go back to direct SDK usage

## Getting Help

- Check the troubleshooting guide
- Review the example implementation
- Open an issue if you encounter problems
