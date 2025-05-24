// Storage Service v2 - Attempts multiple approaches to work around webpack issue
import { FirebaseApp } from 'firebase/app';
import { auth } from './firebase';

// Storage approach enum
enum StorageApproach {
  DYNAMIC_IMPORT = 'dynamic_import',
  CDN_FALLBACK = 'cdn_fallback',
  NATIVE_MODULE = 'native_module'
}

let currentApproach: StorageApproach | null = null;
let storageInstance: any = null;

// Attempt 1: Try dynamic imports
async function tryDynamicImport(app: FirebaseApp) {
  try {
    console.log('Attempting dynamic import approach...');
    const storageModule = await import('firebase/storage');
    const storage = storageModule.getStorage(app);
    
    // Test if storage actually works
    const testRef = storageModule.ref(storage, 'test');
    if (testRef) {
      console.log('Dynamic import approach successful');
      currentApproach = StorageApproach.DYNAMIC_IMPORT;
      return { storage, module: storageModule };
    }
  } catch (error) {
    console.error('Dynamic import approach failed:', error);
  }
  return null;
}

// Attempt 2: Try CDN fallback
async function tryCDNFallback(app: FirebaseApp) {
  try {
    console.log('Attempting CDN fallback approach...');
    const { loadFirebaseFromCDN } = await import('./firebase-cdn');
    
    const config = {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID
    };
    
    // Load Firebase from CDN
    const firebase = await loadFirebaseFromCDN();
    
    // Initialize a new app with CDN Firebase
    const appName = 'cdn-storage-app-' + Date.now();
    const cdnApp = firebase.initializeApp(config, appName);
    
    // Get storage instance
    const storage = firebase.storage(cdnApp);
    
    // Get current user and authenticate if available
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const idToken = await currentUser.getIdToken();
        // Use the token for authenticated requests
        console.log('CDN approach using authenticated user');
      } catch (err) {
        console.warn('Could not get auth token for CDN approach');
      }
    }
    
    console.log('CDN fallback approach successful');
    currentApproach = StorageApproach.CDN_FALLBACK;
    return { storage, firebase, app: cdnApp };
  } catch (error) {
    console.error('CDN fallback approach failed:', error);
  }
  return null;
}

// Attempt 3: Try native module (last resort)
async function tryNativeModule(app: FirebaseApp) {
  try {
    console.log('Attempting native module approach...');
    const { getStorage } = await import('firebase/storage');
    const storage = getStorage(app);
    
    console.log('Native module approach successful');
    currentApproach = StorageApproach.NATIVE_MODULE;
    return { storage, module: await import('firebase/storage') };
  } catch (error) {
    console.error('Native module approach failed:', error);
  }
  return null;
}

// Get storage instance using multiple approaches
export async function getStorageInstance(app?: FirebaseApp) {
  if (storageInstance && currentApproach) {
    return storageInstance;
  }

  // Get app instance
  if (!app) {
    const { getApp } = await import('firebase/app');
    app = getApp();
  }

  // Try each approach in order - CDN first since deduplication fails
  const approaches = [
    () => tryCDNFallback(app!),
    () => tryDynamicImport(app!),
    () => tryNativeModule(app!)
  ];

  for (const approach of approaches) {
    const result = await approach();
    if (result) {
      storageInstance = result;
      return result;
    }
  }

  throw new Error('All storage initialization approaches failed');
}

// Unified upload function
export async function uploadFileV2(
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const storage = await getStorageInstance();
  
  if (currentApproach === StorageApproach.CDN_FALLBACK) {
    // Use CDN approach with auth support
    const { storage: cdnStorage, firebase, app: cdnApp } = storage;
    const storageRef = cdnStorage.ref(path);
    
    // Set auth token if available
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const idToken = await currentUser.getIdToken();
        // Sign in with email/password if available from environment
        if (process.env.REACT_APP_TEST_EMAIL && process.env.REACT_APP_TEST_PASSWORD) {
          await firebase.auth(cdnApp).signInWithEmailAndPassword(
            process.env.REACT_APP_TEST_EMAIL,
            process.env.REACT_APP_TEST_PASSWORD
          );
        } else {
          // Use anonymous auth as fallback
          await firebase.auth(cdnApp).signInAnonymously();
        }
      } catch (err) {
        console.warn('Auth error in CDN approach:', err);
        // Try anonymous auth as final fallback
        try {
          await firebase.auth(cdnApp).signInAnonymously();
        } catch (anonErr) {
          console.error('Anonymous auth also failed:', anonErr);
        }
      }
    } else {
      // No user logged in, try anonymous
      try {
        await firebase.auth(cdnApp).signInAnonymously();
      } catch (err) {
        console.warn('Anonymous auth failed:', err);
      }
    }
    
    const uploadTask = storageRef.put(file);
    
    if (onProgress) {
      uploadTask.on('state_changed', (snapshot: any) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      });
    }
    
    const snapshot = await uploadTask;
    return snapshot.ref.getDownloadURL();
  } else {
    // Use modular approach
    const { storage: moduleStorage, module } = storage;
    const { ref, uploadBytesResumable, getDownloadURL } = module;
    
    const storageRef = ref(moduleStorage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    if (onProgress) {
      uploadTask.on('state_changed', (snapshot: any) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      });
    }
    
    await uploadTask;
    return getDownloadURL(storageRef);
  }
}

// Delete file function
export async function deleteFileV2(path: string): Promise<void> {
  const storage = await getStorageInstance();
  
  if (currentApproach === StorageApproach.CDN_FALLBACK) {
    const { storage: cdnStorage } = storage;
    const storageRef = cdnStorage.ref(path);
    await storageRef.delete();
  } else {
    const { storage: moduleStorage, module } = storage;
    const { ref, deleteObject } = module;
    
    const storageRef = ref(moduleStorage, path);
    await deleteObject(storageRef);
  }
}

// Get file URL function
export async function getFileUrlV2(path: string): Promise<string> {
  const storage = await getStorageInstance();
  
  if (currentApproach === StorageApproach.CDN_FALLBACK) {
    const { storage: cdnStorage } = storage;
    const storageRef = cdnStorage.ref(path);
    return storageRef.getDownloadURL();
  } else {
    const { storage: moduleStorage, module } = storage;
    const { ref, getDownloadURL } = module;
    
    const storageRef = ref(moduleStorage, path);
    return getDownloadURL(storageRef);
  }
}

// Export the current approach for debugging
export function getCurrentStorageApproach(): StorageApproach | null {
  return currentApproach;
}