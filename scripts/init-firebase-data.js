/**
 * Script to initialize Firestore with sample data
 * 
 * Usage:
 * node scripts/init-firebase-data.js <chapterId>
 * 
 * Example:
 * node scripts/init-firebase-data.js gdg-providence
 */

const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  doc, 
  setDoc,
  collection,
  writeBatch
} = require('firebase/firestore');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../src/ui/.env.local') });

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Get arguments
const args = process.argv.slice(2);
let chapterId = 'gdg-chapter';

if (args.length >= 1) {
  chapterId = args[0];
  // Format chapter ID if needed
  if (!chapterId.startsWith('gdg-')) {
    chapterId = `gdg-${chapterId}`;
    console.log(`Formatted chapter ID to: ${chapterId}`);
  }
} else {
  console.log('No chapter ID provided, using default: gdg-chapter');
}

// Sample data
// Helper function to format chapter name
function formatChapterName(id) {
  if (!id || !id.includes('-')) {
    return 'GDG Chapter';
  }
  const parts = id.split('-');
  if (parts.length < 2 || !parts[1]) {
    return 'GDG Chapter';
  }
  return `GDG ${parts[1].charAt(0).toUpperCase() + parts[1].slice(1)}`;
}

// Helper function to get location from chapter ID
function getLocationFromChapterId(id) {
  if (!id || !id.includes('-')) {
    return 'Unknown';
  }
  const parts = id.split('-');
  if (parts.length < 2 || !parts[1]) {
    return 'Unknown';
  }
  return parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
}

const sampleData = {
  chapters: [
    {
      id: chapterId || 'gdg-chapter',
      name: formatChapterName(chapterId),
      location: getLocationFromChapterId(chapterId),
      founded: '2023-01-01',
      member_count: 120,
      website: 'https://gdg.community.dev',
      social_media: {
        linkedin: 'https://linkedin.com/company/gdgcommunity',
        twitter: 'https://twitter.com/gdgcommunity'
      }
    }
  ],
  events: [
    {
      id: 'event1',
      title: 'Flutter Workshop: Building Beautiful UIs',
      date: '2025-06-15',
      time: '18:00',
      description: 'Learn how to build beautiful user interfaces with Flutter.',
      type: 'workshop',
      location: 'Tech Hub Downtown',
      created_by: 'admin',
      created_at: new Date().toISOString(),
      status: 'scheduled',
      chapterId: chapterId
    },
    {
      id: 'event2',
      title: 'Firebase & Google Cloud Study Jam',
      date: '2025-06-22',
      time: '19:00',
      description: 'Hands-on workshop with Firebase and Google Cloud Platform.',
      type: 'meetup',
      location: 'Virtual',
      created_by: 'admin',
      created_at: new Date().toISOString(),
      status: 'scheduled',
      chapterId: chapterId
    }
  ],
  posts: [
    {
      id: 'post1',
      text: '🚀 Join us for our upcoming Flutter Workshop on June 15th! Learn from expert developers and build your first Flutter app. Register now at gdg.community.dev/events/123',
      platform: 'twitter',
      event_id: 'event1',
      created_by: 'admin',
      created_at: new Date().toISOString(),
      status: 'published',
      published_at: new Date().toISOString(),
      chapterId: chapterId,
      performance_metrics: {
        engagement_rate: 4.2,
        likes: 18,
        shares: 7
      }
    },
    {
      id: 'post2',
      text: "Excited to announce our next event: Firebase & Google Cloud Study Jam on June 22nd! We'll cover Firebase essentials and GCP fundamentals. Perfect for beginners and intermediate developers alike. #GDG #Firebase #GoogleCloud",
      platform: 'linkedin',
      event_id: 'event2',
      created_by: 'admin',
      created_at: new Date().toISOString(),
      status: 'scheduled',
      scheduled_for: '2025-05-16T12:00:00Z',
      chapterId: chapterId
    }
  ],
  templates: [
    {
      id: 'template1',
      name: 'Event Announcement',
      description: 'Template for announcing upcoming events',
      type: 'event-announcement',
      template: '🎉 Join us for our upcoming {{event_type}}: {{event_title}} on {{event_date}}! Learn from expert speakers and network with fellow developers. Register now at {{event_link}} #GDG #{{event_hashtag}}',
      platforms: ['twitter', 'linkedin'],
      created_by: 'admin',
      created_at: new Date().toISOString(),
      variables: ['event_type', 'event_title', 'event_date', 'event_link', 'event_hashtag'],
      chapterId: chapterId
    },
    {
      id: 'template2',
      name: 'Event Recap',
      description: 'Template for posting about completed events',
      type: 'event-recap',
      template: 'Thanks to everyone who joined our {{event_title}} yesterday! We had {{attendee_count}} attendees and covered {{topics}}. Special thanks to our speakers {{speakers}}. Looking forward to seeing you at our next event! #GDG #{{event_hashtag}}',
      platforms: ['twitter', 'linkedin'],
      created_by: 'admin',
      created_at: new Date().toISOString(),
      variables: ['event_title', 'attendee_count', 'topics', 'speakers', 'event_hashtag'],
      chapterId: chapterId
    }
  ]
};

async function initFirestoreData() {
  try {
    console.log('Firebase Config:');
    console.log(JSON.stringify({
      apiKey: firebaseConfig.apiKey?.substring(0, 5) + '...',
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId,
      // Other properties omitted for brevity
    }, null, 2));
    
    if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
      throw new Error('Firebase configuration is incomplete. Check your .env.local file.');
    }
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('Initializing Firestore with sample data...');
    
    // Use batched writes for better performance
    const batch = writeBatch(db);
    
    // Add chapters
    for (const chapter of sampleData.chapters) {
      const docRef = doc(db, 'chapters', chapter.id);
      batch.set(docRef, chapter);
    }
    
    // Add events
    for (const event of sampleData.events) {
      const docRef = doc(db, 'events', event.id);
      batch.set(docRef, event);
    }
    
    // Add posts
    for (const post of sampleData.posts) {
      const docRef = doc(db, 'posts', post.id);
      batch.set(docRef, post);
    }
    
    // Add templates
    for (const template of sampleData.templates) {
      const docRef = doc(db, 'templates', template.id);
      batch.set(docRef, template);
    }
    
    // Commit the batch
    await batch.commit();
    
    console.log('Sample data initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing data:', error);
    process.exit(1);
  }
}

initFirestoreData();