# Firebase Stories Storage Guide

## Overview

Your app now supports storing stories in Firebase Firestore instead of just the local `stories.json` file. This gives you powerful benefits:

- **Dynamic Updates**: Add, edit, or remove stories without redeploying the app
- **Scalability**: Handle unlimited stories without bloating your app bundle
- **Multi-language Support**: Easily add translations for stories
- **User-Generated Content**: Allow users to create their own stories (future feature)
- **Analytics**: Track which stories are most popular
- **Cloud Management**: Update stories from anywhere using Firebase Console

## How It Works

The app uses a **hybrid approach**:

1. **First, tries Firebase**: App attempts to load stories from Firestore
2. **Falls back to local**: If Firebase stories don't exist or there's an error, uses `stories.json`
3. **Seamless experience**: Users don't notice which source is being used

---

## Uploading Stories to Firebase

### Method 1: Using the Upload Script (Recommended)

This script uploads your existing `stories.json` to Firebase automatically.

#### Step 1: Update Firestore Rules

Before uploading, make sure your Firestore allows writes from your app:

1. Go to [Firestore Database Rules](https://console.firebase.google.com/project/storyflow-english-learning/firestore/rules)
2. **Temporarily** update rules to allow writes:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User data - users can only read/write their own
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /userProgress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Stories - everyone can read, TEMPORARY: allow writes for migration
    match /stories/{storyId} {
      allow read: if true;
      allow write: if true;  // ⚠️ TEMPORARY - for uploading stories
    }
  }
}
```

3. Click **"Publish"**

#### Step 2: Create a Standalone Upload Script

Create a new file `uploadStoriesToFirebase.html` in your project root:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Upload Stories to Firebase</title>
</head>
<body>
  <h1>Upload Stories to Firebase</h1>
  <button id="uploadBtn">Upload Stories</button>
  <div id="status"></div>

  <script type="module">
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
    import { getFirestore, collection, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

    // Your Firebase config
    const firebaseConfig = {
      apiKey: "AIzaSyDkQs6hjrnL3C0LIimZhHAphLaYRU3Etpo",
      authDomain: "storyflow-english-learning.firebaseapp.com",
      projectId: "storyflow-english-learning",
      storageBucket: "storyflow-english-learning.firebasestorage.app",
      messagingSenderId: "449653527865",
      appId: "1:449653527865:web:9bbc3c74e75f6c64a6677d",
      measurementId: "G-GQMV5VT29W"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Your stories data (paste from stories.json)
    const stories = [
      // PASTE YOUR STORIES HERE FROM stories.json
    ];

    document.getElementById('uploadBtn').addEventListener('click', async () => {
      const statusDiv = document.getElementById('status');
      statusDiv.innerHTML = '<p>Uploading stories...</p>';

      try {
        for (const story of stories) {
          const storyRef = doc(db, 'stories', story.id);

          await setDoc(storyRef, {
            id: story.id,
            title: story.title,
            description: story.description,
            thumbnail: story.thumbnail,
            difficulty: story.difficulty,
            totalScenes: story.totalScenes,
            scenes: story.scenes,
            createdAt: new Date(),
            updatedAt: new Date(),
            published: true
          });

          statusDiv.innerHTML += `<p>✅ Uploaded: ${story.title}</p>`;
        }

        statusDiv.innerHTML += '<p><strong>🎉 All stories uploaded successfully!</strong></p>';
      } catch (error) {
        statusDiv.innerHTML += `<p style="color: red;">❌ Error: ${error.message}</p>`;
        console.error(error);
      }
    });
  </script>
</body>
</html>
```

#### Step 3: Run the Upload

1. Copy the contents of [src/data/stories.json](src/data/stories.json)
2. Paste it into the `stories` array in the HTML file (replace the comment)
3. Open `uploadStoriesToFirebase.html` in your browser
4. Click "Upload Stories"
5. Wait for confirmation messages

#### Step 4: Secure Your Firestore Rules

**IMPORTANT**: After uploading, immediately change the rules back:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /userProgress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Stories - everyone can read, only admins can write
    match /stories/{storyId} {
      allow read: if true;
      allow write: if false;  // ✅ SECURE - no public writes
    }
  }
}
```

---

### Method 2: Manual Upload via Firebase Console

You can also add stories manually through the Firebase Console:

1. Go to [Firestore Database](https://console.firebase.google.com/project/storyflow-english-learning/firestore)
2. Click "Start collection"
3. Collection ID: `stories`
4. Add your first document with ID: `fuzzy-desert-adventure`
5. Add fields:
   - `id` (string): `fuzzy-desert-adventure`
   - `title` (string): `Desert Adventure: The Search`
   - `description` (string): Story description
   - `thumbnail` (string): `/images/theGirl.png`
   - `difficulty` (string): `beginner`
   - `totalScenes` (number): `12`
   - `scenes` (array): Copy from JSON
   - `published` (boolean): `true`
   - `createdAt` (timestamp): Current time
   - `updatedAt` (timestamp): Current time

---

## Story Data Structure

Each story in Firestore has this structure:

```javascript
{
  id: "unique-story-id",
  title: "Story Title",
  description: "Story description",
  thumbnail: "/images/thumbnail.png",
  difficulty: "beginner" | "intermediate" | "advanced",
  totalScenes: 12,
  published: true,  // Set to false to hide from users
  createdAt: Timestamp,
  updatedAt: Timestamp,
  scenes: [
    {
      id: 1,
      videoUrl: "/video/Scene1.mp4",
      transcript: "The dialog text",
      thaiTranslation: "คำแปลภาษาไทย",
      duration: 3.5,
      listeningOptions: [
        { text: "Correct answer", isCorrect: true },
        { text: "Wrong answer", isCorrect: false }
      ],
      keywords: [
        {
          word: "example",
          translation: "ตัวอย่าง",
          definition: "A thing characteristic of its kind"
        }
      ]
    }
  ]
}
```

---

## Managing Stories

### Adding a New Story

1. Create the story object in your code or Firebase Console
2. Make sure `published` is `true`
3. The app will automatically fetch and display it

### Editing a Story

**Option A: Via Firebase Console**
1. Go to Firestore Database
2. Navigate to `stories` collection
3. Click on the story document
4. Edit any field
5. Changes appear immediately in the app (after refresh)

**Option B: Via Code**
Update your `stories.json` and re-run the upload script

### Hiding a Story (Unpublishing)

1. Go to Firebase Console → Firestore
2. Find the story document
3. Change `published` to `false`
4. Story will no longer appear in the app

### Deleting a Story

1. Go to Firebase Console → Firestore
2. Click the story document
3. Click the three dots → Delete document

---

## Advantages of Firebase Storage

### Before (Local JSON)
- ❌ Must redeploy app to add stories
- ❌ All stories load at once (slower startup)
- ❌ Can't update content dynamically
- ❌ No analytics on story usage
- ❌ Limited to stories.json file size

### After (Firebase Firestore)
- ✅ Add stories without redeploying
- ✅ Lazy load stories (faster startup)
- ✅ Update content anytime, anywhere
- ✅ Track which stories are popular
- ✅ Unlimited story storage
- ✅ Enable user-generated stories (future)
- ✅ Multi-language support ready
- ✅ Story versioning and history

---

## Fallback Behavior

The app is designed to always work, even if Firebase is unavailable:

1. **Firebase Available**: Uses cloud stories (up-to-date)
2. **Firebase Unavailable**: Uses local `stories.json` (reliable fallback)
3. **Both Available**: Prefers Firebase (cloud is source of truth)

This means you can develop offline and deploy without Firebase setup!

---

## Future Enhancements

With stories in Firebase, you can now:

- **Story Editor UI**: Build an admin panel to create stories in the app
- **User Stories**: Let users submit their own stories
- **Story Collections**: Group stories by theme, level, or topic
- **Story Ratings**: Users can rate and favorite stories
- **Progress Tracking**: Track which stories users have completed
- **Recommendations**: Suggest stories based on user level and progress
- **Multi-language**: Add translations for different languages
- **Story Comments**: Users can discuss stories

---

## Troubleshooting

### Stories Not Loading from Firebase

**Check browser console for errors:**
- `permission-denied`: Update Firestore rules to allow reading
- `not-found`: Stories collection doesn't exist yet
- `network-error`: Check internet connection

**Verify Firestore setup:**
1. Go to Firebase Console → Firestore Database
2. Ensure `stories` collection exists
3. Check that stories have `published: true`
4. Verify Firestore rules allow `read: if true`

### App Shows "Loading stories..." Forever

**Solutions:**
1. Check browser console for Firebase errors
2. Verify `.env` file has correct Firebase credentials
3. Restart development server: `npm start`
4. Clear browser cache and reload

### Stories Uploaded but Not Showing

**Check:**
1. `published` field is `true` (not string "true")
2. Story has all required fields
3. Firestore rules allow reading
4. App is fetching from Firestore (check console logs)

---

## Current Status

- ✅ App supports Firebase stories
- ✅ Fallback to local `stories.json` works
- ✅ Loading state shows while fetching
- ✅ Stories automatically refresh on load
- ⏳ Stories not yet uploaded to Firebase (you need to run upload script)

## Next Steps

1. **Upload your stories** using Method 1 or Method 2 above
2. **Verify** stories appear in Firebase Console
3. **Test** by refreshing your app
4. **Secure** Firestore rules after uploading
5. Enjoy dynamic story management!

---

## Summary

You now have a professional, scalable story storage system! Stories can be managed from Firebase Console, updated without redeploying, and the app gracefully falls back to local storage if needed.

The hybrid approach ensures your app works reliably while giving you the flexibility of cloud storage.
