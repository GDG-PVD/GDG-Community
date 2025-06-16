import { collection, query, where, getDocs, addDoc, updateDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';

// Generic Firestore data service
export class FirestoreService<T extends { id?: string }> {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  // Get all items
  async getAll(): Promise<T[]> {
    const querySnapshot = await getDocs(collection(db, this.collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as T));
  }

  // Get item by ID
  async getById(id: string): Promise<T | null> {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    } else {
      return null;
    }
  }

  // Query items
  async query(field: string, operator: any, value: any): Promise<T[]> {
    const q = query(collection(db, this.collectionName), where(field, operator, value));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as T));
  }

  // Create item
  async create(data: Omit<T, 'id'>): Promise<T> {
    const docRef = await addDoc(collection(db, this.collectionName), data);
    return { id: docRef.id, ...data } as T;
  }

  // Update item
  async update(id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, data as any);
  }

  // Delete item
  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }
}

// Storage service for file uploads
export class StorageService {
  private basePath: string;

  constructor(basePath: string = '') {
    this.basePath = basePath;
  }

  // Upload file and get URL
  async uploadFile(file: File, path: string): Promise<string> {
    const fullPath = this.basePath ? `${this.basePath}/${path}` : path;
    const storageRef = ref(storage, fullPath);
    
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  }

  // Get file URL
  async getFileUrl(path: string): Promise<string> {
    const fullPath = this.basePath ? `${this.basePath}/${path}` : path;
    const storageRef = ref(storage, fullPath);
    return await getDownloadURL(storageRef);
  }

  // Delete file
  async deleteFile(path: string): Promise<void> {
    const fullPath = this.basePath ? `${this.basePath}/${path}` : path;
    const storageRef = ref(storage, fullPath);
    await deleteObject(storageRef);
  }
}

// Example usage:
export const EventsService = new FirestoreService<Event>('events');
export const PostsService = new FirestoreService<Post>('posts');
export const MembersService = new FirestoreService<Member>('members');
export const ChapterStorageService = new StorageService('chapters');

// Types
interface Event {
  id?: string;
  title: string;
  date: string;
  time: string;
  description: string;
  type: string;
  location?: string;
  created_by: string;
  created_at: string;
  status: 'draft' | 'scheduled' | 'completed' | 'cancelled';
}

interface Post {
  id?: string;
  text: string;
  platform: string;
  event_id?: string;
  created_by: string;
  created_at: string;
  status: string;
  scheduled_for?: string;
  published_at?: string;
}

interface Member {
  id?: string;
  email: string;
  displayName: string;
  role: 'admin' | 'editor' | 'viewer';
  chapterId: string;
  photoURL?: string;
}