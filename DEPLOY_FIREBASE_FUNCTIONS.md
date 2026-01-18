# Deploy Firebase Functions with Secrets

## Step 1: Set Your Claude API Key as a Secret

Run this command and paste your API key when prompted:

```bash
firebase functions:secrets:set CLAUDE_API_KEY
```

**Or set it directly in one command:**

```bash
echo "YOUR_CLAUDE_API_KEY" | firebase functions:secrets:set CLAUDE_API_KEY
```

**Note:** Replace the API key above with your actual key if different.

---

## Step 2: Install Dependencies

```bash
cd functions
npm install
cd ..
```

---

## Step 3: Deploy Functions

```bash
firebase deploy --only functions
```

Firebase will automatically:
- Grant the function access to the secret
- Deploy your function
- Make the secret available via `process.env.CLAUDE_API_KEY`

---

## Step 4: Verify Deployment

After deployment, test your function:

```bash
# Get your function URL (will be shown after deployment)
# It will be something like:
# https://us-central1-storyflow-english-learning.cloudfunctions.net/api

# Test health endpoint
curl https://us-central1-storyflow-english-learning.cloudfunctions.net/api/api/health

# Test chat endpoint
curl -X POST https://us-central1-storyflow-english-learning.cloudfunctions.net/api/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!", "conversationHistory": []}'
```

---

## How Secrets Work

1. **Define secret** in code: `functions.defineSecret('CLAUDE_API_KEY')`
2. **Set secret value**: `firebase functions:secrets:set CLAUDE_API_KEY`
3. **Access in function**: Available via `process.env.CLAUDE_API_KEY`
4. **Include in function**: `functions.runWith({ secrets: [claudeApiKeySecret] })`

The secret is securely stored in Google Secret Manager and automatically injected into your function at runtime.

---

## Troubleshooting

### Error: "Secret not found"
- Make sure you ran `firebase functions:secrets:set CLAUDE_API_KEY`
- Check that you're in the correct Firebase project

### Error: "Secret not accessible"
- The function definition includes the secret in `runWith({ secrets: [...] })`
- Redeploy after setting the secret

### Local Development

For local testing, create a `.env` file in the `functions` folder:

```env
CLAUDE_API_KEY=your-api-key-here
CLAUDE_MODEL=claude-3-haiku-20240307
```

Then run:
```bash
firebase emulators:start --only functions
```

---

## Next Steps

1. ✅ Set the secret (Step 1)
2. ✅ Install dependencies (Step 2)
3. ✅ Deploy functions (Step 3)
4. ✅ Test the endpoints (Step 4)
5. ✅ Deploy frontend (if needed)

Your backend will be live at:
`https://us-central1-storyflow-english-learning.cloudfunctions.net/api`

And your frontend can call:
- `/api/chat` (via Firebase Hosting rewrite)
- `/api/health` (via Firebase Hosting rewrite)
