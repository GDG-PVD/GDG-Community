// Firebase configuration for test files
// Uses environment variables with fallback to demo values for tests

export const getTestFirebaseConfig = () => {
  // In test environments, we can use demo/test values if env vars aren't set
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isTest = process.env.NODE_ENV === 'test';
  
  return {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || (isDevelopment || isTest ? "demo-api-key" : ""),
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "demo-project",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
    appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456"
  };
};

// Export a singleton config for convenience
export const testFirebaseConfig = getTestFirebaseConfig();