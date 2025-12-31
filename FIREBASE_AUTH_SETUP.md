# Firebase Authentication Setup - Quick Fix

## Error: `Firebase: Error (auth/operation-not-allowed)`

This error means authentication methods are not enabled in your Firebase Console. Follow these steps to fix it:

---

## Step-by-Step Fix (5 minutes)

### 1. Open Firebase Console
Go to: [https://console.firebase.google.com/project/storyflow-english-learning/authentication](https://console.firebase.google.com/project/storyflow-english-learning/authentication)

### 2. Enable Email/Password Authentication

1. Click **"Get Started"** (if this is your first time)
2. Click the **"Sign-in method"** tab at the top
3. Find **"Email/Password"** in the list of providers
4. Click on it to open the configuration
5. Toggle **"Enable"** switch to ON
6. Click **"Save"**

**Screenshot reference**: You should see a toggle switch that turns blue when enabled

### 3. (Optional) Enable Google Sign-In

1. Still in the **"Sign-in method"** tab
2. Find **"Google"** in the list of providers
3. Click on it to open the configuration
4. Toggle **"Enable"** switch to ON
5. Select your **support email** from the dropdown
6. Click **"Save"**

### 4. Verify Setup

After enabling, you should see:
- **Email/Password**: Status shows "Enabled" with a green checkmark
- **Google** (if enabled): Status shows "Enabled" with a green checkmark

---

## Test Your Authentication

### Option 1: Test Registration
1. Restart your app if it's running: `npm start`
2. Click **"Sign Up"** in the sidebar
3. Fill in:
   - Display Name: Test User
   - Email: test@example.com
   - Password: testpassword123
4. Click **"Create Account"**
5. You should see your profile appear in the sidebar!

### Option 2: Test Google Sign-In
1. Click **"Login"** in the sidebar
2. Click **"Sign in with Google"**
3. Choose your Google account
4. You should be logged in!

---

## Common Issues

### Issue 1: "auth/operation-not-allowed" persists
**Solution**:
- Make sure you clicked "Save" after enabling authentication
- Wait 10-30 seconds for changes to propagate
- Refresh your app
- Clear browser cache if needed

### Issue 2: Google Sign-In doesn't work
**Solution**:
- Make sure you selected a support email
- Try adding `localhost` to authorized domains:
  1. Go to Authentication → Settings tab
  2. Scroll to "Authorized domains"
  3. Make sure `localhost` is listed

### Issue 3: Can't find Firebase Console
**Solution**: Use this direct link:
- Project Overview: https://console.firebase.google.com/project/storyflow-english-learning
- Authentication: https://console.firebase.google.com/project/storyflow-english-learning/authentication

---

## What Happens After Setup

Once authentication is enabled:

### Guest Users
- Can still play without signing up
- Progress saved locally only
- See "Playing as guest - scores saved locally" message

### Registered Users
- Create account with email/password or Google
- Progress syncs to cloud automatically
- Can access from any device
- See profile with avatar and XP in sidebar

### Skip Feature
- Works for both guest and registered users
- No XP penalty when skipping questions
- Available in all three learning modes

---

## Security: Firestore Rules

After setting up authentication, make sure your Firestore database has proper security rules:

1. Go to: [Firestore Database](https://console.firebase.google.com/project/storyflow-english-learning/firestore)
2. Click **"Rules"** tab
3. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles - users can only read/write their own
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // User progress - users can only read/write their own
    match /userProgress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Stories - everyone can read, no one can write
    match /stories/{storyId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

4. Click **"Publish"**

---

## Quick Verification Checklist

- [ ] Firebase Console opened
- [ ] Email/Password authentication enabled
- [ ] (Optional) Google authentication enabled
- [ ] App restarted (`npm start`)
- [ ] Registration form works
- [ ] Login form works
- [ ] User profile shows in sidebar
- [ ] Firestore rules updated

---

## Need Help?

If you're still having issues:

1. **Check browser console** (F12) for detailed error messages
2. **Verify .env file** has correct Firebase credentials
3. **Restart dev server** after making Firebase Console changes
4. **Clear browser cache** and try again

---

## What You've Built

Your app now has:
- ✅ Full authentication system (email + Google)
- ✅ Guest mode for anonymous users
- ✅ Skip buttons in all learning modes
- ✅ Cloud sync for registered users
- ✅ XP and stats tracking
- ✅ Automatic local-to-cloud migration

Once authentication is enabled in Firebase Console, everything will work perfectly!
