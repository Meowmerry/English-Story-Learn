# Firebase Setup Guide for StoryFlow

This guide will walk you through setting up Firebase for your English learning platform.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" or "Create a project"
3. Enter project name: `storyflow-english-learning` (or your preferred name)
4. Click "Continue"
5. Disable Google Analytics (optional, can enable later)
6. Click "Create Project"

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **Web icon** (`</>`) to add a web app
2. Enter app nickname: `StoryFlow Web App`
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. **IMPORTANT**: Copy the Firebase configuration object shown. It looks like this:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

6. Click "Continue to console"

## Step 3: Enable Authentication

1. In the Firebase console, click **Authentication** in the left sidebar
2. Click "Get Started"
3. Click on the **Sign-in method** tab
4. Enable the following sign-in providers:
   - **Email/Password**: Click on it, toggle "Enable", click "Save"
   - **Google** (optional but recommended): Click on it, toggle "Enable", select your support email, click "Save"
5. Go to the **Settings** tab
6. Scroll to "Authorized domains" and add your domains:
   - `localhost` (already there)
   - Your production domain when you deploy

## Step 4: Set Up Firestore Database

1. In the Firebase console, click **Firestore Database** in the left sidebar
2. Click "Create database"
3. Choose **Start in test mode** (for development)
   - NOTE: You'll need to update security rules for production
4. Choose a location closest to your users (e.g., `us-central` or `asia-southeast1`)
5. Click "Enable"

### Firestore Security Rules (Initial - For Development)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Allow anyone to read stories (public data)
    match /stories/{storyId} {
      allow read: if true;
      allow write: if false; // Only admins can write stories
    }
  }
}
```

### Firestore Security Rules (Production - More Secure)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles and progress
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false; // Prevent deletion
    }

    // Stories - public read, admin write
    match /stories/{storyId} {
      allow read: if true;
      allow write: if false;
    }

    // User progress tracking
    match /userProgress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 5: Install Firebase in Your Project

Open your terminal in the project directory and run:

```bash
npm install firebase
```

## Step 6: Create Firebase Configuration File

Create a file at `src/firebase/config.js` with the configuration you copied earlier:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
```

## Step 7: Environment Variables (Recommended for Security)

Instead of hardcoding your config, use environment variables:

1. Create a `.env` file in your project root:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your_app_id
```

2. Update `.gitignore` to include `.env`:

```
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

3. Update `src/firebase/config.js` to use environment variables:

```javascript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};
```

## Step 8: Database Structure

Your Firestore database will have this structure:

```
users/
  {userId}/
    - email: string
    - displayName: string
    - createdAt: timestamp
    - lastLogin: timestamp

userProgress/
  {userId}/
    - xp: number
    - level: number
    - totalQuestions: number
    - correctAnswers: number
    - incorrectAnswers: number
    - listening: { total, correct, incorrect }
    - speaking: { total, excellent, good, needsWork }
    - writing: { total, perfect, good, needsWork }
    - scenesCompleted: number
    - storiesCompleted: number
    - streakDays: number
    - lastPlayedDate: timestamp
    - updatedAt: timestamp

stories/
  {storyId}/
    - title: string
    - description: string
    - difficulty: string
    - scenes: array
    - ... (your story data)
```

## Step 9: Testing Firebase Connection

After setup, you can test the connection:

```javascript
import { db, auth } from './firebase/config';
import { collection, getDocs } from 'firebase/firestore';

// Test Firestore connection
const testFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    console.log('Firestore connected!', querySnapshot.size);
  } catch (error) {
    console.error('Firestore error:', error);
  }
};

testFirestore();
```

## Next Steps

1. Run `npm install firebase` to install Firebase
2. Create your Firebase project in the console
3. Copy your configuration
4. Create the `src/firebase/config.js` file
5. Set up `.env` file with your credentials
6. I'll help you implement authentication and data syncing

## Useful Firebase Console Links

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

## Need Help?

If you encounter any issues during setup, let me know and I'll help you troubleshoot!
