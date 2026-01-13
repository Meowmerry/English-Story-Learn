# Firebase Deployment with Ollama

Complete guide for deploying your chatbot to Firebase Hosting + Cloud Functions.

## Architecture

```
Firebase Hosting (React Frontend)
        ↓
Firebase Cloud Functions (Express Backend)
        ↓
Your Computer (Ollama via Cloudflare Tunnel) - FREE!
        ↓
gpt-oss model
```

## Setup Steps

### Step 1: Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
firebase login
```

### Step 2: Initialize Firebase Functions

```bash
# In your project root
firebase init functions

# Select:
# - Use existing project
# - JavaScript
# - No ESLint (or yes, your choice)
# - Install dependencies: Yes
```

This creates a `functions/` folder. We've already created the files for you:
- [functions/index.js](functions/index.js) - Express backend with chat endpoints
- [functions/package.json](functions/package.json) - Dependencies

### Step 3: Install Function Dependencies

```bash
cd functions
npm install
cd ..
```

### Step 4: Expose Your Local Ollama (FREE)

**Install Cloudflare Tunnel:**

```bash
# macOS
brew install cloudflare/cloudflare/cloudflared

# Linux
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

**Run the Tunnel:**

```bash
# Make sure Ollama is running first
ollama serve

# In another terminal, expose Ollama
cloudflared tunnel --url http://localhost:11434
```

You'll see output like:
```
Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):
https://abc-def-123.trycloudflare.com
```

**Copy this URL!** You'll need it in the next step.

### Step 5: Configure Environment Variables

Firebase Functions uses environment config. Set your Ollama tunnel URL:

```bash
firebase functions:config:set \
  ollama.api_url="https://abc-def-123.trycloudflare.com/api/generate" \
  ollama.model="gpt-oss"
```

Update [functions/index.js](functions/index.js) to use Firebase config:

```javascript
// At the top of functions/index.js, replace:
const OLLAMA_API = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';
const MODEL = process.env.OLLAMA_MODEL || 'gpt-oss';

// With:
const OLLAMA_API = functions.config().ollama?.api_url || 'http://localhost:11434/api/generate';
const MODEL = functions.config().ollama?.model || 'gpt-oss';
```

### Step 6: Deploy Firebase Functions

```bash
# Deploy only functions
firebase deploy --only functions
```

After deployment, you'll get a URL like:
```
https://us-central1-your-project.cloudfunctions.net/api
```

### Step 7: Update Frontend Environment Variable

Create `.env` file in your project root:

```env
# For local development
REACT_APP_API_URL=http://localhost:3001

# For production (you'll set this in Firebase Hosting)
# REACT_APP_API_URL=https://us-central1-your-project.cloudfunctions.net/api
```

For Firebase Hosting, create `.env.production`:

```env
REACT_APP_API_URL=https://us-central1-your-project.cloudfunctions.net/api
```

### Step 8: Build and Deploy Frontend

```bash
# Build React app
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

## Testing

### Test Locally First

**Terminal 1 - Ollama:**
```bash
ollama serve
```

**Terminal 2 - Cloudflare Tunnel:**
```bash
cloudflared tunnel --url http://localhost:11434
```

**Terminal 3 - Firebase Functions Emulator:**
```bash
firebase emulators:start
```

**Terminal 4 - React App:**
```bash
npm start
```

Open `http://localhost:3000` and test the chatbot!

### Test Production

After deploying:
1. Open your Firebase Hosting URL
2. Click the chat button (💬)
3. Send a message

## Important Notes

### ⚠️ Cloudflare Tunnel Limitations

- **Your computer must stay on** for the chatbot to work
- Tunnel URL changes when you restart `cloudflared`
- When URL changes, you must:
  ```bash
  firebase functions:config:set ollama.api_url="NEW_URL"
  firebase deploy --only functions
  ```

### ✅ Keeping Cloudflare Tunnel Running

Create a startup script to keep the tunnel running:

**macOS/Linux - `start-tunnel.sh`:**
```bash
#!/bin/bash
while true; do
    cloudflared tunnel --url http://localhost:11434
    echo "Tunnel died, restarting in 5 seconds..."
    sleep 5
done
```

```bash
chmod +x start-tunnel.sh
./start-tunnel.sh
```

## Cost Breakdown

| Service | Cost | What It Does |
|---------|------|--------------|
| **Firebase Hosting** | FREE (up to 10GB transfer) | Hosts React frontend |
| **Firebase Functions** | FREE (2M invocations/month) | Runs Express backend |
| **Firestore** | FREE (50K reads, 20K writes/day) | Stores chat history |
| **Cloudflare Tunnel** | FREE | Exposes local Ollama |
| **Ollama (Your Computer)** | FREE | Runs AI model |

**Total Monthly Cost: $0** ✅

(As long as you stay within Firebase free tier limits)

## Upgrading to Production

When you're ready for a professional setup (no computer dependency):

### Option: Deploy Ollama to a VPS

**1. Get a VPS ($6/month):**
- Hetzner Cloud: €4.5/month
- DigitalOcean: $6/month

**2. Install Ollama on VPS:**
```bash
ssh root@your-server-ip
curl -fsSL https://ollama.com/install.sh | sh
ollama serve
ollama pull gpt-oss  # or phi3 for less RAM
```

**3. Update Firebase Function Config:**
```bash
firebase functions:config:set \
  ollama.api_url="http://your-server-ip:11434/api/generate" \
  ollama.model="gpt-oss"

firebase deploy --only functions
```

Now your chatbot is 100% online, no computer dependency!

## Troubleshooting

### Chatbot Shows "Offline"

**Check 1: Is Ollama running?**
```bash
curl http://localhost:11434/api/tags
```

**Check 2: Is Cloudflare Tunnel running?**
Look for the tunnel URL in the terminal

**Check 3: Is Firebase Function configured correctly?**
```bash
firebase functions:config:get
```

Should show:
```json
{
  "ollama": {
    "api_url": "https://abc-123.trycloudflare.com/api/generate",
    "model": "gpt-oss"
  }
}
```

**Check 4: Test Function Directly:**
```bash
curl -X POST https://us-central1-your-project.cloudfunctions.net/api/health
```

### "Function exceeded timeout"

Firebase Functions have a 60-second timeout. If Ollama takes too long:

1. Use a smaller model (phi3 instead of gpt-oss)
2. Reduce max_tokens in [functions/index.js:60](functions/index.js#L60)
3. Upgrade to Firebase Blaze plan (allows longer timeouts)

### Cloudflare Tunnel Keeps Disconnecting

Use the `start-tunnel.sh` script above, or use a persistent tunnel:

```bash
# Login to Cloudflare (one time)
cloudflared tunnel login

# Create a named tunnel
cloudflared tunnel create ollama-tunnel

# Configure the tunnel
cloudflared tunnel route dns ollama-tunnel ollama.yourdomain.com

# Run it persistently
cloudflared tunnel run ollama-tunnel
```

## File Structure

```
englishstorylearn/
├── functions/
│   ├── index.js              # Firebase Function (Express backend)
│   └── package.json          # Function dependencies
├── src/
│   ├── components/
│   │   └── FloatingChatbot.js  # Updated to use API_URL env var
│   └── ...
├── firebase.json             # Firebase configuration
├── .firebaserc              # Firebase project settings
├── .env                     # Local environment variables
└── .env.production          # Production environment variables
```

## Deployment Commands Cheat Sheet

```bash
# Deploy everything
firebase deploy

# Deploy only functions
firebase deploy --only functions

# Deploy only hosting
firebase deploy --only hosting

# View function logs
firebase functions:log

# Test locally
firebase emulators:start

# Set environment variable
firebase functions:config:set key="value"

# Get environment variables
firebase functions:config:get
```

## Alternative: Development Only Setup

If you only want the chatbot to work locally (not deployed):

Update [src/components/FloatingChatbot.js](src/components/FloatingChatbot.js):

```javascript
function FloatingChatbot() {
  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  // ... rest of component
}
```

This way:
- ✅ Chatbot works locally for development
- ✅ No deployment complexity
- ❌ Users won't see it on the live site

## Summary

**For Free Deployment:**
1. ✅ Keep Ollama running on your computer
2. ✅ Expose it via Cloudflare Tunnel (free)
3. ✅ Deploy backend to Firebase Functions (free)
4. ✅ Deploy frontend to Firebase Hosting (free)
5. ⚠️ Keep your computer on when you want chatbot to work

**For Production ($6/month):**
1. Get a VPS (Hetzner/DigitalOcean)
2. Install Ollama on VPS
3. Point Firebase Functions to VPS
4. Chatbot works 24/7 without your computer

## Need Help?

Check other guides:
- [CHATBOT_SETUP.md](CHATBOT_SETUP.md) - Local development
- [OLLAMA_API_GUIDE.md](OLLAMA_API_GUIDE.md) - API reference
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - General deployment options
- [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) - Vercel-specific guide
