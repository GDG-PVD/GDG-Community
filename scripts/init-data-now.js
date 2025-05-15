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

const args = process.argv.slice(2);
const [email, password, chapterId] = args;

if (!email || !password || !chapterId) {
  console.error('Usage: node init-data-now.js <email> <password> <chapterId>');
  process.exit(1);
}

async function initializeData() {
  try {
    console.log('=== Initialize Firebase Data ===\n');

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    console.log('Signing in as admin...');
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
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }],
      events: [{
        id: 'event-demo-1',
        title: 'Flutter Workshop: Building Beautiful UIs',
        date: '2025-06-15',
        time: '18:00',
        description: 'Learn how to build beautiful user interfaces with Flutter.',
        type: 'workshop',
        location: 'Tech Hub Downtown',
        created_by: auth.currentUser.uid,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'scheduled',
        chapterId: chapterId
      }],
      content_templates: [{
        id: 'event-announcement',
        name: 'Event Announcement',
        platform: 'linkedin',
        template: '🚀 Join us for {eventTitle}!\\n\\n📅 {date}\\n⏰ {time}\\n📍 {location}\\n\\n{description}\\n\\nRSVP: {link}\\n\\n#GDG #GoogleDevelopers #TechEvent',
        variables: ['eventTitle', 'date', 'time', 'location', 'description', 'link'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]
    };

    console.log('Initializing data for chapter:', chapterId);

    // Create data individually (since batch might have permission issues)
    console.log('\nCreating chapters...');
    for (const chapter of sampleData.chapters) {
      await setDoc(doc(db, 'chapters', chapter.id), chapter);
      console.log('✓ Chapter created:', chapter.id);
    }

    console.log('\nCreating events...');
    for (const event of sampleData.events) {
      await setDoc(doc(db, 'events', event.id), event);
      console.log('✓ Event created:', event.id);
    }

    console.log('\nCreating templates...');
    for (const template of sampleData.content_templates) {
      await setDoc(doc(db, 'content_templates', template.id), template);
      console.log('✓ Template created:', template.id);
    }

    console.log('\nCreating settings...');
    for (const setting of sampleData.settings) {
      await setDoc(doc(db, 'settings', setting.id), setting);
      console.log('✓ Settings created:', setting.id);
    }

    console.log('\n✅ Data initialized successfully!');
    console.log('\nYou can now access the app at:');
    console.log('https://gdg-community-companion.web.app');

    // Sign out
    await auth.signOut();

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 'permission-denied') {
      console.log('\nPermission issue. Try running this command:');
      console.log('firebase deploy --only firestore:rules');
    }
    process.exit(1);
  }
}

// Run the initialization
initializeData();