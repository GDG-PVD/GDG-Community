# Firebase Security Rules

This document provides sample Firebase security rules for your private implementation.

## Firestore Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Common functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isOrganizer() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'organizer'];
    }
    
    function isChapterMember(chapterId) {
      return isAuthenticated() && 
        chapterId in get(/databases/$(database)/documents/users/$(request.auth.uid)).data.chapters;
    }
    
    // User profiles
    match /users/{userId} {
      allow read: if isAuthenticated() && (request.auth.uid == userId || isAdmin());
      allow write: if isAuthenticated() && request.auth.uid == userId;
      allow create, update: if isAdmin();
    }
    
    // Chapters
    match /chapters/{chapterId} {
      allow read: if true; // Public chapter info
      allow write: if isOrganizer() && isChapterMember(chapterId);
      
      // Chapter content templates
      match /templates/{templateId} {
        allow read: if isChapterMember(chapterId);
        allow write: if isOrganizer() && isChapterMember(chapterId);
      }
      
      // Events
      match /events/{eventId} {
        allow read: if true; // Public event info
        allow write: if isOrganizer() && isChapterMember(chapterId);
        
        // Event content
        match /content/{contentId} {
          allow read: if isChapterMember(chapterId);
          allow write: if isOrganizer() && isChapterMember(chapterId);
        }
      }
      
      // Social content
      match /social/{postId} {
        allow read: if isChapterMember(chapterId);
        allow write: if isOrganizer() && isChapterMember(chapterId);
      }
      
      // Analytics
      match /analytics/{docId} {
        allow read: if isChapterMember(chapterId);
        allow write: if false; // Only writable by server functions
      }
    }
    
    // Knowledge layers
    match /knowledge/{layerId} {
      allow read: if isChapterMember(resource.data.chapterId);
      allow write: if isOrganizer() && isChapterMember(resource.data.chapterId);
    }
    
    // Platform credentials - extra sensitive!
    match /platform_credentials/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if false; // Only writable by server functions
    }
    
    // Audit logs
    match /audit_logs/{logId} {
      allow read: if isAdmin();
      allow write: if false; // Only writable by server functions
    }
  }
}
```

## Storage Rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOrganizer() {
      return isAuthenticated() && 
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role in ['admin', 'organizer'];
    }
    
    function isChapterMember(chapterId) {
      return isAuthenticated() && 
        chapterId in firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.chapters;
    }
    
    // Public assets
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if isOrganizer();
    }
    
    // Chapter-specific assets
    match /chapters/{chapterId}/{allPaths=**} {
      allow read: if isChapterMember(chapterId);
      allow write: if isOrganizer() && isChapterMember(chapterId);
    }
    
    // User uploads
    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }
    
    // Media for social posts
    match /social/{chapterId}/{allPaths=**} {
      allow read: if true; // Public media
      allow write: if isOrganizer() && isChapterMember(chapterId);
    }
  }
}
```

## Authentication Considerations

- Use Firebase Authentication with Google Sign-In for GDG organizers
- Consider implementing Firebase App Check to prevent unauthorized API access
- Use custom claims to manage roles (admin, organizer, member)

## Function Security

For Firebase Cloud Functions:

1. Always validate authentication in HTTP functions:

```javascript
exports.secureFunction = functions.https.onRequest((req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  
  if (!idToken) {
    return res.status(403).send('Unauthorized');
  }
  
  return admin.auth().verifyIdToken(idToken)
    .then((decodedToken) => {
      // Continue with authenticated request
      const uid = decodedToken.uid;
      // Check additional permissions as needed
    })
    .catch((error) => {
      return res.status(403).send('Unauthorized');
    });
});
```

2. Secure background functions with appropriate database rules

3. Use securityRules to restrict client access to callable functions:

```javascript
exports.generateContent = functions.https.onCall((data, context) => {
  // Ensure authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  // Check if user is an organizer (via custom claims or Firestore lookup)
  return admin.firestore().collection('users').doc(context.auth.uid).get()
    .then(userDoc => {
      if (!userDoc.exists || !['admin', 'organizer'].includes(userDoc.data().role)) {
        throw new functions.https.HttpsError('permission-denied', 'Only organizers can generate content');
      }
      
      // Proceed with content generation
    });
});
```
