# Implementation Guide: Firebase Integration & New Features

This guide explains how to implement all the new features including Firebase authentication, score storage, and skip functionality.

## Quick Start

### 1. Install Firebase

Run this command in your project directory:

```bash
npm install firebase
```

### 2. Set Up Firebase Project

Follow the steps in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) to:
1. Create a Firebase project
2. Enable Authentication (Email/Password and Google)
3. Set up Firestore Database
4. Get your configuration credentials

### 3. Create .env File

Copy `.env.example` to `.env` and fill in your Firebase credentials:

```bash
cp .env.example .env
```

Then edit `.env` with your Firebase configuration from the Firebase Console.

### 4. Restart the Development Server

After adding the `.env` file, restart your app:

```bash
npm start
```

## Features Implemented

### ✅ 1. Firebase Configuration
- Location: `src/firebase/config.js`
- Initializes Firebase app, Authentication, and Firestore
- Uses environment variables for security

### ✅ 2. Authentication Service
- Location: `src/firebase/authService.js`
- **Functions**:
  - `registerWithEmail(email, password, displayName)` - Register new user
  - `loginWithEmail(email, password)` - Login existing user
  - `loginWithGoogle()` - Login with Google account
  - `logout()` - Sign out user
  - `onAuthChange(callback)` - Listen to auth state changes
  - `getCurrentUser()` - Get current logged-in user

### ✅ 3. Firestore Service
- Location: `src/firebase/firestoreService.js`
- **Functions**:
  - `saveUserProgress(userId, progressData)` - Save progress to cloud
  - `getUserProgress(userId)` - Get progress from cloud
  - `updateUserXP(userId, xpChange)` - Update XP in cloud
  - `updateListeningStatsFirestore(userId, isCorrect)` - Save listening stats
  - `updateSpeakingStatsFirestore(userId, score)` - Save speaking stats
  - `updateWritingStatsFirestore(userId, score)` - Save writing stats
  - `syncLocalToFirestore(userId)` - Sync local storage to cloud

## How the System Works

### Guest Mode (No Login)
- Users can play without creating an account
- Scores stored in browser's local storage
- Data persists only on that device
- No sync across devices

### Logged-In Mode (With Account)
- Users create account or sign in
- Scores automatically saved to Firebase
- Can access progress from any device
- Automatic sync between devices
- Local storage used as backup

### Data Flow

```
User Action (Answer Question)
    ↓
Local State Updated
    ↓
XP/Stats Calculated
    ↓
├─→ If User Logged In
│   ├─→ Save to Local Storage (backup)
│   └─→ Save to Firebase (cloud)
│
└─→ If Guest Mode
    └─→ Save to Local Storage only
```

## Next Steps to Complete Integration

### Step 1: Create Auth Context
Create `src/contexts/AuthContext.js` to manage authentication state across the app.

### Step 2: Create Login/Register Components
- `src/components/auth/LoginModal.js`
- `src/components/auth/RegisterModal.js`
- `src/components/auth/UserProfile.js`

### Step 3: Update XP and Stats Systems
Modify `src/utils/xpSystem.js` and `src/utils/statsSystem.js` to:
- Check if user is logged in
- Save to both local storage AND Firebase
- Load from Firebase when user logs in
- Sync data when switching between devices

### Step 4: Add Skip/Next Button
Update learning mode components to include:
- "Skip" button when user doesn't know answer
- "Next" button to proceed without penalty
- Option to mark as "review later"

### Step 5: Add User Menu
Add user menu in Sidebar to:
- Show login/register buttons when not logged in
- Show user profile when logged in
- Display logout option
- Show sync status

## File Structure

```
src/
├── firebase/
│   ├── config.js              ✅ Created
│   ├── authService.js         ✅ Created
│   └── firestoreService.js    ✅ Created
├── contexts/
│   └── AuthContext.js         🔜 Next to create
├── components/
│   ├── auth/
│   │   ├── LoginModal.js      🔜 Next to create
│   │   ├── RegisterModal.js   🔜 Next to create
│   │   └── UserProfile.js     🔜 Next to create
│   └── ...existing components
└── utils/
    ├── xpSystem.js            🔄 To be updated
    └── statsSystem.js         🔄 To be updated
```

## Security Considerations

### Firestore Security Rules
Make sure your Firestore rules are set correctly:

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

    match /stories/{storyId} {
      allow read: if true;  // Public read
      allow write: if false; // Only admins
    }
  }
}
```

### Environment Variables
- NEVER commit `.env` file to Git
- Always use `.env.example` as template
- Firebase config is safe to expose (it's public in web apps)
- But still use environment variables for consistency

## Testing

### Test Authentication
1. Register a new account
2. Logout
3. Login with same account
4. Try Google login (if enabled)

### Test Data Sync
1. Login and complete some exercises
2. Check Firebase Console → Firestore → userProgress
3. Logout and login again
4. Verify progress is restored

### Test Guest Mode
1. Use app without logging in
2. Complete exercises
3. Check browser console → Application → Local Storage
4. Verify data is saved locally

## Troubleshooting

### "Firebase is not defined"
- Make sure you ran `npm install firebase`
- Restart the development server

### "Permission denied" in Firestore
- Check your Firestore security rules
- Make sure user is authenticated
- Verify userId matches auth.uid

### Data not syncing
- Check browser console for errors
- Verify Firebase configuration
- Check internet connection
- Look at Firebase Console → Firestore for data

## Support

If you need help with any step:
1. Check the Firebase documentation
2. Review the setup guide
3. Check browser console for errors
4. Ask me for help with specific issues!
