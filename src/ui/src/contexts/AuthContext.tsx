import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db as firestore } from '../services/firebase';

// For development only - mock user
const MOCK_USER_ENABLED = true; // Set to false to use real Firebase auth

// Types
export interface ChapterMember {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'editor' | 'viewer';
  chapterId: string;
  photoURL?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: ChapterMember | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signOut: async () => {},
});

// Provider component
export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<ChapterMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
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
      
      return () => {};
    } else {
      // Normal Firebase auth flow
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user);
        
        if (user) {
          try {
            // Get the user's profile from Firestore
            const userDoc = await getDoc(doc(firestore, 'members', user.uid));
            
            if (userDoc.exists()) {
              setUserProfile({
                id: user.uid,
                email: user.email || '',
                displayName: userDoc.data().displayName || user.displayName || '',
                role: userDoc.data().role,
                chapterId: userDoc.data().chapterId,
                photoURL: user.photoURL || undefined,
              });
            } else {
              setError('User profile not found');
            }
          } catch (err) {
            console.error('Error fetching user profile:', err);
            setError('Error fetching user profile');
          }
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, []);

  // Sign in method
  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      
      if (MOCK_USER_ENABLED) {
        console.log('Using mock authentication');
        // For demo: accept any credentials but simulate a delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // The mock user is automatically set in the useEffect
        return;
      }
      
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'An error occurred during sign in');
      throw err;
    }
  };

  // Sign out method
  const signOut = async () => {
    try {
      if (MOCK_USER_ENABLED) {
        // For mock mode, just clear the user state
        setUser(null);
        setUserProfile(null);
        return;
      }
      
      await firebaseSignOut(auth);
    } catch (err: any) {
      console.error('Sign out error:', err);
      setError(err.message || 'An error occurred during sign out');
      throw err;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};