// Test setup file for React component testing

// Import test utilities
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configure testing library
configure({
  testIdAttribute: 'data-testid',
});

// Mock Firebase
jest.mock('firebase/app', () => {
  return {
    initializeApp: jest.fn(),
    apps: [],
  };
});

jest.mock('firebase/auth', () => {
  return {
    getAuth: jest.fn(() => ({
      currentUser: null,
      onAuthStateChanged: jest.fn(),
      signInWithEmailAndPassword: jest.fn(),
      signOut: jest.fn(),
    })),
    GoogleAuthProvider: jest.fn(() => ({})),
    signInWithPopup: jest.fn(),
  };
});

jest.mock('firebase/firestore', () => {
  return {
    getFirestore: jest.fn(),
    collection: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
    getDocs: jest.fn(),
    setDoc: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn(),
  };
});

// Mock API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
  })
);

// Mock matchMedia for responsive design testing
window.matchMedia = jest.fn().mockImplementation(query => {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
});

// Mock IntersectionObserver for infinite scrolling components
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  
  observe() {
    return null;
  }
  
  unobserve() {
    return null;
  }
  
  disconnect() {
    return null;
  }
};

// Suppress React 18 console warnings
const originalError = console.error;
console.error = (...args) => {
  if (/Warning.*not wrapped in act/.test(args[0])) {
    return;
  }
  originalError.call(console, ...args);
};