# Quick Fix: Chatbot Offline

## The Problem
Chatbot shows "Offline" because `CLAUDE_API_KEY` is not set in Firebase Functions.

## The Solution (2 minutes)

### Step 1: Open Firebase Console
Go to: https://console.firebase.google.com/project/storyflow-english-learning/functions

### Step 2: Click on `api` Function
You'll see a function named `api` in the list.

### Step 3: Go to Configuration Tab
Click on the **Configuration** tab at the top.

### Step 4: Add Environment Variable
1. Scroll down to **Environment variables** section
2. Click **Add variable** button
3. Enter:
   - **Name**: `CLAUDE_API_KEY`
   - **Value**: `YOUR_CLAUDE_API_KEY`
4. Click **Save**

### Step 5: Wait & Test
- Wait 1-2 minutes for the function to update
- Refresh your website
- The chatbot should now show "Online" ✅

## Verify It's Fixed

Run this command:
```bash
curl https://storyflow-english-learning.web.app/api/health
```

Should return:
```json
{"status":"healthy","apiKeyConfigured":true}
```

If it still shows `false`, double-check that you saved the environment variable correctly.

## Visual Guide

```
Firebase Console
  └─ Functions
      └─ api (click this)
          └─ Configuration tab
              └─ Environment variables
                  └─ Add variable
                      └─ Name: CLAUDE_API_KEY
                      └─ Value: [your key]
                      └─ Save
```

That's it! The chatbot will come online automatically.
