# Set Environment Variable in Firebase Console

Since we've set the secret, we need to make it available to the function. The easiest way is to set it as an environment variable in the Firebase Console.

## Option 1: Firebase Console (Easiest)

1. Go to: https://console.firebase.google.com/project/storyflow-english-learning/functions
2. Click on your function (or it will be created after first deploy)
3. Go to **Configuration** tab
4. Scroll to **Environment variables**
5. Click **Add variable**
6. Add:
   - **Name**: `CLAUDE_API_KEY`


   - **Value**: `YOUR_CLAUDE_API_KEY` (get from https://console.anthropic.com/)

7. Click **Save**

## Option 2: Use Secret (After First Deploy)

After you deploy once, you can configure the function to use the secret:

1. Deploy the function first (it will work without the key, just return an error)
2. Then in Firebase Console → Functions → Your function → Configuration
3. Under **Secrets**, add `CLAUDE_API_KEY`
4. Redeploy

## Quick Deploy Now

Let's deploy first, then set the environment variable:

```bash
firebase deploy --only functions
```

Then set the environment variable in the console as shown in Option 1.
