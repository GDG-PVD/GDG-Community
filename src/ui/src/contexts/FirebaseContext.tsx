import React, { createContext, useContext, ReactNode } from 'react';
import { 
  app, 
  auth, 
  db, 
  storage, 
  functions, 
  analytics 
} from '../services/firebase';
import { 
  Auth,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut
} from 'firebase/auth';
import { Firestore, collection, doc, setDoc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { FirebaseStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Functions, httpsCallable } from 'firebase/functions';
import { Analytics, logEvent } from 'firebase/analytics';

interface FirebaseContextProps {
  app: any;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
  functions: Functions;
  analytics: Analytics | null;
  
  // Auth methods
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, displayName: string) => Promise<any>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName?: string, photoURL?: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // Firestore methods
  getDocument: <T>(collectionName: string, docId: string) => Promise<T | null>;
  setDocument: <T>(collectionName: string, docId: string, data: T) => Promise<void>;
  updateDocument: <T>(collectionName: string, docId: string, data: Partial<T>) => Promise<void>;
  queryCollection: <T>(collectionName: string, fieldPath: string, operator: any, value: any) => Promise<T[]>;
  
  // Storage methods
  uploadFile: (path: string, file: File) => Promise<string>;
  getFileUrl: (path: string) => Promise<string>;
  
  // Functions methods
  callFunction: <T, R>(functionName: string, data?: T) => Promise<R>;
  
  // Analytics methods
  logAnalyticsEvent: (eventName: string, eventParams?: any) => void;
}

const FirebaseContext = createContext<FirebaseContextProps | undefined>(undefined);

export const FirebaseProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  // Auth methods
  const signIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    return userCredential;
  };

  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  const updateUserProfile = async (displayName?: string, photoURL?: string) => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName, photoURL });
    } else {
      throw new Error('No authenticated user');
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  // Firestore methods
  const getDocument = async <T,>(collectionName: string, docId: string): Promise<T | null> => {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as T;
    } else {
      return null;
    }
  };

  const setDocument = <T,>(collectionName: string, docId: string, data: T): Promise<void> => {
    const docRef = doc(db, collectionName, docId);
    return setDoc(docRef, data);
  };

  const updateDocument = <T,>(collectionName: string, docId: string, data: Partial<T>): Promise<void> => {
    const docRef = doc(db, collectionName, docId);
    return updateDoc(docRef, data as any);
  };

  const queryCollection = async <T,>(
    collectionName: string, 
    fieldPath: string, 
    operator: any, 
    value: any
  ): Promise<T[]> => {
    const q = query(collection(db, collectionName), where(fieldPath, operator, value));
    const querySnapshot = await getDocs(q);
    const results: T[] = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() } as unknown as T);
    });
    return results;
  };

  // Storage methods
  const uploadFile = async (path: string, file: File): Promise<string> => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const getFileUrl = (path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    return getDownloadURL(storageRef);
  };

  // Functions methods
  const callFunction = async <T, R>(functionName: string, data?: T): Promise<R> => {
    const functionRef = httpsCallable<T, R>(functions, functionName);
    const result = await functionRef(data as T);
    return result.data;
  };

  // Analytics methods
  const logAnalyticsEvent = (eventName: string, eventParams?: any): void => {
    if (analytics) {
      logEvent(analytics, eventName, eventParams);
    }
  };

  const value: FirebaseContextProps = {
    app,
    auth,
    db,
    storage,
    functions,
    analytics,
    signIn,
    signUp,
    resetPassword,
    updateUserProfile,
    logout,
    getDocument,
    setDocument,
    updateDocument,
    queryCollection,
    uploadFile,
    getFileUrl,
    callFunction,
    logAnalyticsEvent,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseContextProps => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export default FirebaseContext;