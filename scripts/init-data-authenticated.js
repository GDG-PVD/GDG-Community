#!/usr/bin/env node

const { initializeApp } = require('firebase/app');
const { 
  getAuth, 
  signInWithEmailAndPassword
} = require('firebase/auth');
const { 
  getFirestore, 
  doc, 
  setDoc,
  writeBatch
} = require('firebase/firestore');
const dotenv = require('dotenv');
const path = require('path');
const readline = require('readline');
const { promisify } = require('util');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../src/ui/.env.production') });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = promisify(rl.question).bind(rl);

// Get chapter ID from command line
const args = process.argv.slice(2);
const chapterId = args[0] || 'gdg-providence';

async function initializeDataAsAdmin() {
  try {
    console.log('=== Initialize Firebase Data as Admin ===\n');

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    // Get admin credentials
    const email = await question('Admin email: ');
    const password = await question('Admin password: ');

    console.log('\nSigning in as admin...');
    await signInWithEmailAndPassword(auth, email, password);
    console.log('✓ Signed in successfully');

    // Sample data
    const sampleData = {
      chapters: [{
        id: chapterId,
        name: `GDG ${chapterId.split('-')[1].charAt(0).toUpperCase() + chapterId.split('-')[1].slice(1)}`,
        location: chapterId.split('-')[1].charAt(0).toUpperCase() + chapterId.split('-')[1].slice(1),
        founded: '2023-01-01',
        member_count: 120,
        website: 'https://gdg.community.dev',
        social_media: {
          linkedin: 'https://linkedin.com/company/gdgcommunity',
          bluesky: '@gdgcommunity.bsky.social'
        }
      }],
      events: [{
        id: 'event1',
        title: 'Flutter Workshop: Building Beautiful UIs',
        date: '2025-06-15',
        time: '18:00',
        description: 'Learn how to build beautiful user interfaces with Flutter.',
        type: 'workshop',
        location: 'Tech Hub Downtown',
        created_by: auth.currentUser.uid,
        created_at: new Date().toISOString(),
        status: 'scheduled',
        chapterId: chapterId
      }],
      content_templates: [{
        id: 'event-announcement',
        name: 'Event Announcement',
        platform: 'linkedin',
        template: '🚀 Join us for {eventTitle}!\\n\\n📅 {date}\\n⏰ {time}\\n📍 {location}\\n\\n{description}\\n\\nRSVP: {link}\\n\\n#GDG #GoogleDevelopers #TechEvent',
        variables: ['eventTitle', 'date', 'time', 'location', 'description', 'link'],
        created_at: new Date().toISOString()
      }],
      settings: [{
        id: 'global',
        general: {
          appName: 'GDG Community Companion',
          defaultChapter: chapterId,
          timezone: 'America/New_York'
        },
        social: {
          defaultPlatforms: ['linkedin'],
          hashtagSets: {
            default: ['#GDG', '#GoogleDevelopers', '#Community'],
            events: ['#TechEvent', '#DevCommunity', '#Meetup']
          }
        },
        features: {
          enableLinkedIn: true,
          enableBluesky: false,
          enableAnalytics: true
        },
        created_at: new Date().toISOString()
      }]
    };

    console.log('\nInitializing data for chapter:', chapterId);

    // Create data in batches
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

    // Add templates
    for (const template of sampleData.content_templates) {
      const docRef = doc(db, 'content_templates', template.id);
      batch.set(docRef, template);
    }

    // Add settings
    for (const setting of sampleData.settings) {
      const docRef = doc(db, 'settings', setting.id);
      batch.set(docRef, setting);
    }

    // Commit the batch
    await batch.commit();

    console.log('\n✅ Data initialized successfully!');
    console.log('\nCreated:');
    console.log('- 1 chapter:', chapterId);
    console.log('- 1 sample event');
    console.log('- 1 content template');
    console.log('- Global settings');

    // Sign out
    await auth.signOut();
    console.log('\nSigned out successfully.');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 'permission-denied') {
      console.log('\nPermission denied. Make sure you have admin privileges.');
    }
  } finally {
    rl.close();
  }
}

// Run the initialization
initializeDataAsAdmin();