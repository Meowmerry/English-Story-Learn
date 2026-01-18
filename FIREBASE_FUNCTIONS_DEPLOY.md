# Deploy Backend to Firebase Functions

## Step 1: Upgrade to Blaze Plan (Required)

Firebase Functions require the **Blaze (pay-as-you-go) plan**, but it has a **generous free tier**:

### Free Tier Includes:
- ✅ 2 million function invocations/month
- ✅ 400,000 GB-seconds compute time/month  
- ✅ 200,000 CPU-seconds/month
- ✅ 5 GB egress/month

**You'll only pay if you exceed these limits** (very unlikely for a learning app).

### Upgrade Steps:

1. Go to: https://console.firebase.google.com/project/storyflow-english-learning/usage/details
2. Click **"Upgrade to Blaze"**
3. Add a payment method (you won't be charged unless you exceed free tier)
4. Confirm upgrade

---

## Step 2: Install Dependencies in Functions Folder

```bash
cd functions
npm install
cd ..
```

---

## Step 3: Set Environment Variables (Claude API Key)

Set your Claude API key for Firebase Functions:

```bash
firebase functions:config:set ai.claude_api_key="your-claude-api-key-here"
firebase functions:config:set ai.claude_model="claude-3-haiku-20240307"
```

**Note:** Replace `your-claude-api-key-here` with your actual Anthropic API key.

---

## Step 4: Deploy Firebase Functions

```bash
firebase deploy --only functions
```

This will:
- Build your functions
- Deploy to Firebase
- Give you a URL like: `https://us-central1-storyflow-english-learning.cloudfunctions.net/api`

---

## Step 5: Update Frontend to Use Firebase Functions

After deployment, you'll get a function URL. Update your frontend:

### Option A: Set Environment Variable in Firebase Hosting

1. Go to Firebase Console → Hosting → Your site
2. Add environment variable (if supported) or update code directly

### Option B: Update Code to Use Firebase Functions URL

The Firebase Functions URL will be:
```
https://us-central1-storyflow-english-learning.cloudfunctions.net/api
```

Your endpoints will be:
- `https://us-central1-storyflow-english-learning.cloudfunctions.net/api/chat`
- `https://us-central1-storyflow-english-learning.cloudfunctions.net/api/health`

Update `src/components/FloatingChatbot.js` or set `REACT_APP_API_URL` to this URL.

---

## Step 6: Update firebase.json to Route API Calls

Add rewrites to `firebase.json` to route `/api/*` to your functions:

```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

This way, your frontend can call `/api/chat` and it will automatically route to your Firebase Function.

---

## Step 7: Deploy Everything

```bash
# Build frontend
npm run build

# Deploy hosting and functions
firebase deploy
```

---

## Testing

### Test Functions Locally (Optional)

```bash
# Start emulator
firebase emulators:start --only functions

# Test in another terminal
curl http://localhost:5001/storyflow-english-learning/us-central1/api/health
```

### Test Deployed Functions

```bash
# Get your function URL
firebase functions:config:get

# Test health endpoint
curl https://us-central1-storyflow-english-learning.cloudfunctions.net/api/health

# Test chat endpoint
curl -X POST https://us-central1-storyflow-english-learning.cloudfunctions.net/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!", "conversationHistory": []}'
```

---

## Important Notes

### Firebase Functions Endpoint Path

Your current `functions/index.js` exports the Express app as:
```javascript
exports.api = functions.https.onRequest(app);
```

This means:
- Function name: `api`
- Endpoint: `/api/chat` (not `/chat`)
- Full URL: `https://[region]-[project].cloudfunctions.net/api/chat`

### Update Functions Code if Needed

If you want the endpoint to be `/chat` instead of `/api/chat`, you can update `functions/index.js`:

```javascript
// Change from:
app.post('/chat', ...)

// To:
app.post('/api/chat', ...)
```

Or keep it as `/chat` and access it directly at:
`https://[region]-[project].cloudfunctions.net/api/chat`

---

## Cost Monitoring

Monitor your usage in Firebase Console:
- Go to: https://console.firebase.google.com/project/storyflow-english-learning/usage

You'll see:
- Function invocations
- Compute time
- Egress (data transfer)

As long as you stay within the free tier, you won't be charged.

---

## Troubleshooting

### Error: "Must be on Blaze plan"
- You need to upgrade to Blaze plan first (Step 1)

### Error: "API key not configured"
- Make sure you ran: `firebase functions:config:set ai.claude_api_key="your-key"`

### Functions timeout
- Default timeout is 60 seconds
- For longer timeouts, update in `functions/index.js`:
  ```javascript
  exports.api = functions.runWith({ timeoutSeconds: 120 }).https.onRequest(app);
  ```

---

## Next Steps

1. ✅ Upgrade to Blaze plan
2. ✅ Set Claude API key
3. ✅ Deploy functions
4. ✅ Update frontend to use function URL
5. ✅ Deploy frontend
6. ✅ Test!

Need help with any step? Let me know!
