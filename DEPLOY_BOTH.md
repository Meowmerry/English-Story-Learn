# Deploy Both Frontend and Backend to Firebase

This guide shows you how to deploy both your React frontend (Firebase Hosting) and Express backend (Firebase Functions) together.

## Prerequisites

1. ✅ **Upgraded to Blaze Plan** (required for Functions)
   - Go to: https://console.firebase.google.com/project/storyflow-english-learning/usage/details
   - Upgrade if not already done

2. ✅ **Set Environment Variable** (Claude API Key)
   - Go to: https://console.firebase.google.com/project/storyflow-english-learning/functions
   - Click on `api` function → **Configuration** tab
   - Add environment variable:
     - **Name**: `CLAUDE_API_KEY`
     - **Value**: Your Claude API key
   - Click **Save**

---

## Quick Deploy (Both at Once)

### Step 1: Build Frontend

```bash
npm run build
```

This creates the production build in the `build/` folder.

### Step 2: Deploy Everything

```bash
firebase deploy
```

This deploys both:
- ✅ Frontend (Firebase Hosting)
- ✅ Backend (Firebase Functions)

---

## Deploy Separately (If Needed)

### Deploy Only Frontend

```bash
npm run build
firebase deploy --only hosting
```

### Deploy Only Backend

```bash
firebase deploy --only functions
```

### Deploy Both Explicitly

```bash
npm run build
firebase deploy --only hosting,functions
```

---

## What Gets Deployed

### Frontend (Firebase Hosting)
- **Source**: `build/` folder (created by `npm run build`)
- **URL**: `https://storyflow-english-learning.web.app`
- **Routes**: 
  - `/api/**` → Routes to Firebase Function
  - `/**` → Serves React app

### Backend (Firebase Functions)
- **Source**: `functions/` folder
- **Function Name**: `api`
- **Function URL**: `https://us-central1-storyflow-english-learning.cloudfunctions.net/api`
- **Endpoints**:
  - `/api/chat` (POST) - Chat with AI
  - `/api/health` (GET) - Health check

---

## Complete Deployment Script

You can use the existing `deploy.sh` script:

```bash
chmod +x deploy.sh
./deploy.sh
```

Or create a custom script that deploys both:

```bash
#!/bin/bash
echo "🚀 Deploying StoryFlow..."
echo ""

echo "📦 Building frontend..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🔥 Deploying to Firebase (Hosting + Functions)..."
    firebase deploy
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Deployment successful!"
        echo ""
        echo "🌐 Your app is live at:"
        echo "   Frontend: https://storyflow-english-learning.web.app"
        echo "   Backend:  https://us-central1-storyflow-english-learning.cloudfunctions.net/api"
    else
        echo "❌ Deployment failed!"
    fi
else
    echo "❌ Build failed! Please fix errors and try again."
fi
```

---

## Step-by-Step Deployment

### 1. Install Dependencies (If Needed)

```bash
# Install frontend dependencies
npm install

# Install functions dependencies
cd functions
npm install
cd ..
```

### 2. Set Environment Variables

**For Functions (Claude API Key):**
- Go to Firebase Console → Functions → `api` → Configuration
- Add `CLAUDE_API_KEY` environment variable

**For Frontend (if needed):**
- Create `.env.production` file:
  ```env
  REACT_APP_API_URL=https://storyflow-english-learning.web.app
  ```
- Or set in Firebase Hosting environment variables (if supported)

### 3. Build Frontend

```bash
npm run build
```

Verify the `build/` folder was created.

### 4. Deploy

```bash
firebase deploy
```

### 5. Verify Deployment

**Test Frontend:**
```bash
# Open in browser
open https://storyflow-english-learning.web.app
```

**Test Backend:**
```bash
# Test health endpoint
curl https://storyflow-english-learning.web.app/api/health

# Test chat endpoint
curl -X POST https://storyflow-english-learning.web.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!", "conversationHistory": []}'
```

---

## Troubleshooting

### Error: "Must be on Blaze plan"
- Upgrade to Blaze plan first (see Prerequisites)

### Error: "API key not configured"
- Set `CLAUDE_API_KEY` in Firebase Console → Functions → Configuration

### Error: "Build failed"
- Check for errors in `npm run build`
- Fix any TypeScript/JavaScript errors
- Check that all dependencies are installed

### Frontend works but backend returns 404
- Verify function is deployed: `firebase functions:list`
- Check `firebase.json` has correct rewrite rules
- Verify function name matches in `firebase.json`

### Backend works but frontend shows errors
- Check browser console for errors
- Verify `REACT_APP_API_URL` is set correctly (if used)
- Check that `/api/**` routes are working

---

## Deployment Checklist

Before deploying, make sure:

- [ ] Upgraded to Blaze plan
- [ ] Set `CLAUDE_API_KEY` environment variable in Functions
- [ ] All dependencies installed (`npm install` and `cd functions && npm install`)
- [ ] Frontend builds successfully (`npm run build`)
- [ ] No errors in console
- [ ] Tested locally (if possible)

---

## After Deployment

Your app will be available at:
- **Frontend**: https://storyflow-english-learning.web.app
- **Backend API**: https://us-central1-storyflow-english-learning.cloudfunctions.net/api

The frontend automatically routes `/api/**` requests to your Firebase Function, so everything works seamlessly!

---

## Quick Reference Commands

```bash
# Build frontend
npm run build

# Deploy everything
firebase deploy

# Deploy only frontend
firebase deploy --only hosting

# Deploy only backend
firebase deploy --only functions

# View deployment logs
firebase functions:log

# List deployed functions
firebase functions:list
```

---

Need help? Check the Firebase Console for deployment status and logs!
