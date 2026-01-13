# Deploying to Vercel with Ollama

Since you already have your backend on Vercel, here's how to make the chatbot work.

## The Problem

⚠️ **Vercel is serverless** - it doesn't support running persistent processes like Ollama. Functions run on-demand and shut down after responding.

## Solutions

### Option A: Deploy Ollama Separately + Keep Backend on Vercel (Easiest)

**Architecture**:
```
Vercel Backend (Express API)
       ↓
External Ollama Server (Your computer or VPS)
       ↓
gpt-oss model
```

#### Steps:

**1. Run Ollama on Your Computer (For Testing)**

Keep Ollama running locally and expose it using Cloudflare Tunnel:

```bash
# Install cloudflared
brew install cloudflare/cloudflare/cloudflared

# Login to Cloudflare
cloudflared tunnel login

# Create a tunnel
cloudflared tunnel create ollama-server

# Run the tunnel (keeps it running)
cloudflared tunnel --url http://localhost:11434
```

You'll get a public URL like: `https://abc-def-123.trycloudflare.com`

**2. Set Environment Variable in Vercel**

In your Vercel project settings:

```
Environment Variables:
OLLAMA_API_URL=https://abc-def-123.trycloudflare.com/api/generate
OLLAMA_MODEL=gpt-oss
```

**3. Redeploy Vercel Backend**

```bash
vercel --prod
```

**Pros**:
- Quick to set up
- Uses your existing Vercel deployment
- Free (Cloudflare Tunnel is free)

**Cons**:
- Your computer must stay on
- Not suitable for production
- Cloudflare Tunnel URL changes when restarted

---

### Option B: Deploy Ollama to Railway + Keep Backend on Vercel

**Architecture**:
```
Vercel Backend (Express API)
       ↓
Railway (Ollama in Docker)
       ↓
phi3 model (smaller, fits in Railway)
```

#### Steps:

**1. Create Railway Project**

- Go to https://railway.app
- Sign up (free $5 credit/month)
- Click "New Project" → "Deploy from GitHub"

**2. Create Ollama-only Service**

Create a new file `railway-ollama.Dockerfile`:

```dockerfile
FROM ollama/ollama:latest

# Pull the model at build time
RUN ollama serve & sleep 5 && ollama pull phi3

EXPOSE 11434

CMD ["ollama", "serve"]
```

**3. Deploy to Railway**

```bash
# In your project directory
railway up --dockerfile railway-ollama.Dockerfile
```

Railway will give you a public URL like: `https://your-app.railway.app`

**4. Set Environment Variables in Vercel**

```
OLLAMA_API_URL=https://your-app.railway.app/api/generate
OLLAMA_MODEL=phi3
```

**5. Redeploy Vercel**

```bash
vercel --prod
```

**Pros**:
- Always online
- Professional setup
- Railway handles scaling

**Cons**:
- Costs money after free credit (~$5-10/month)
- Need to use smaller model (phi3 instead of gpt-oss)

---

### Option C: Move Backend to Railway (Recommended)

Instead of having backend on Vercel, move everything to Railway where you can run Ollama + Backend together.

**Architecture**:
```
Vercel (Frontend only)
       ↓
Railway (Backend + Ollama together)
```

#### Steps:

**1. Use Existing Dockerfile**

We already created [Dockerfile](Dockerfile) that runs both Express backend and Ollama.

**2. Deploy to Railway**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize in your project directory
railway init

# Deploy
railway up
```

**3. Set Environment Variables in Railway**

```
OLLAMA_MODEL=phi3
PORT=3001
NODE_ENV=production
```

**4. Update Frontend to Use Railway Backend**

In Vercel, set environment variable:
```
REACT_APP_API_URL=https://your-railway-app.railway.app
```

Update [src/components/FloatingChatbot.js](src/components/FloatingChatbot.js):
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Use API_URL instead of hardcoded localhost
const response = await fetch(`${API_URL}/api/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message, conversationHistory })
});
```

**5. Keep Frontend on Vercel**

Frontend stays on Vercel - just point it to Railway backend URL.

**Pros**:
- Single deployment for backend + Ollama
- More reliable than split setup
- Better performance (backend and Ollama in same container)

**Cons**:
- Costs money (~$5-10/month after free credit)
- Need to move backend off Vercel

---

### Option D: Keep Current Setup + Disable Chatbot in Production

Simplest option if you want to keep everything as-is:

**1. Make Chatbot Development-Only**

Update [src/components/FloatingChatbot.js](src/components/FloatingChatbot.js):

```javascript
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { saveChatMessage, getChatHistory } from '../firebase/firestoreService';

function FloatingChatbot() {
  // Only show chatbot in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  // ... rest of the component
}

export default FloatingChatbot;
```

**Pros**:
- No deployment changes needed
- Free
- Chatbot works locally for development

**Cons**:
- Users won't see the chatbot
- Defeats the purpose of building it

---

## My Recommendation for Your Situation

Since you already have backend on Vercel, I recommend **Option C (Move Backend to Railway)**:

### Why?
1. **Clean Architecture**: Backend + Ollama in one place
2. **Affordable**: ~$5-10/month (or free with $5 credit)
3. **Simple**: One deployment, easy to manage
4. **Frontend Stays**: Vercel is perfect for React frontend

### Quick Migration Steps:

```bash
# 1. Deploy backend to Railway
railway login
railway init
railway up

# 2. Get Railway URL
railway domain

# 3. Update Vercel environment variable
# REACT_APP_API_URL=https://your-app.railway.app

# 4. Update FloatingChatbot.js to use API_URL env var

# 5. Redeploy frontend to Vercel
vercel --prod
```

---

## Current vs Recommended Setup

### Current (Not Working):
```
┌─────────────────────┐
│  Vercel (Frontend)  │
└─────────────────────┘
┌─────────────────────┐
│ Vercel (Backend)    │ ← Can't run Ollama ❌
└─────────────────────┘
```

### Recommended:
```
┌─────────────────────┐
│  Vercel (Frontend)  │ ← Keep here ✅
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│  Railway            │
│  ┌──────────────┐   │
│  │  Backend     │   │ ← Move here
│  └──────┬───────┘   │
│         ↓           │
│  ┌──────────────┐   │
│  │  Ollama      │   │ ← Runs here ✅
│  └──────────────┘   │
└─────────────────────┘
```

---

## Testing Before Production

**1. Test Railway Deployment Locally with Docker**

```bash
# Build the Docker image
docker build -t storyflow-backend .

# Run it locally
docker run -p 3001:3001 -p 11434:11434 storyflow-backend

# Test it
curl http://localhost:3001/api/health
```

**2. Test with Smaller Model First**

Use `phi3` or `gemma3:270m` on Railway to save costs:

```bash
# On Railway, set environment variable
OLLAMA_MODEL=gemma3:270m
```

---

## Cost Comparison

| Option | Cost | Reliability | Best For |
|--------|------|-------------|----------|
| Option A (Local Ollama + Cloudflare) | Free | Low | Testing only |
| Option B (Vercel + Railway Ollama) | $5-10/mo | Medium | Split architecture |
| Option C (Railway Backend+Ollama) | $5-10/mo | High | Production ✅ |
| Option D (Disable in Production) | Free | N/A | Development only |

---

## Need Help Migrating?

I can help you:
1. Update FloatingChatbot.js to use environment variable
2. Create Railway configuration
3. Update any hardcoded URLs
4. Test the deployment

Let me know which option you want to pursue!
