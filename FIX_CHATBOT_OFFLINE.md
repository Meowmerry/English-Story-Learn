# Fix Chatbot Offline Issue

The chatbot shows as offline because of two issues:

## Issue 1: API Key Not Configured ✅ FIX THIS FIRST

The backend function doesn't have the `CLAUDE_API_KEY` environment variable set.

### Fix: Set Environment Variable in Firebase Console

1. Go to: https://console.firebase.google.com/project/storyflow-english-learning/functions
2. Click on the `api` function
3. Go to **Configuration** tab
4. Scroll to **Environment variables** section
5. Click **Add variable**
6. Add:
   - **Name**: `CLAUDE_API_KEY`


   - **Value**: `YOUR_CLAUDE_API_KEY` (get from https://console.anthropic.com/)

7. Click **Save**

The function will automatically update with the new environment variable.

---

## Issue 2: Frontend API URL ✅ ALREADY FIXED

The frontend code has been updated to:
- Use relative paths (`/api/health`) in production (works with Firebase Hosting rewrites)
- Use `http://localhost:3001` in development

No action needed - the code is already fixed!

---

## Verify the Fix

After setting the environment variable:

1. **Wait 1-2 minutes** for the function to update
2. **Test the health endpoint:**
   ```bash
   curl https://storyflow-english-learning.web.app/api/health
   ```
   
   Should return:
   ```json
   {"status":"healthy","provider":"claude","model":"claude-3-haiku-20240307","apiKeyConfigured":true}
   ```

3. **Refresh your frontend** and check the chatbot status

---

## Quick Test

```bash
# Test if API key is configured
curl https://us-central1-storyflow-english-learning.cloudfunctions.net/api/api/health

# Should show: "apiKeyConfigured": true
```

If it still shows `false`, the environment variable wasn't set correctly. Double-check the Firebase Console.

---

## Summary

✅ **Code is fixed** - Frontend now uses relative paths  
⚠️ **Action required** - Set `CLAUDE_API_KEY` in Firebase Console → Functions → Configuration

After setting the environment variable, the chatbot should work!
