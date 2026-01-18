# Express Server Deployment Guide

This guide shows you how to deploy your Express backend server to free hosting platforms.

## Quick Start: Deploy to Vercel (Recommended for Claude API)

Vercel is perfect if you're using Claude API (no persistent processes needed). It's **completely free** and easy to set up.

### Prerequisites

1. **Vercel account**: Sign up at https://vercel.com (free)
2. **Vercel CLI** (optional, for command-line deployment):
   ```bash
   npm i -g vercel
   ```

### Step 1: Prepare Your Server

Your server is already configured! The `vercel.json` file is set up to deploy your Express server.

### Step 2: Set Environment Variables

You'll need to set these in Vercel:

**Required for Claude:**
```
AI_PROVIDER=claude
ANTHROPIC_API_KEY=your-claude-api-key-here
CLAUDE_MODEL=claude-3-haiku-20240307
```

**Optional:**
```
NODE_ENV=production
PORT=3001
```

### Step 3: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Easiest)

1. Go to https://vercel.com/new
2. Import your Git repository (GitHub/GitLab/Bitbucket)
3. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: Leave as `.` (root)
   - **Build Command**: Leave empty (not needed for server)
   - **Output Directory**: Leave empty
4. Add environment variables (from Step 2)
5. Click **Deploy**

#### Option B: Using Vercel CLI

```bash
# Login to Vercel
vercel login

# Deploy (first time - will ask questions)
vercel

# Deploy to production
vercel --prod
```

### Step 4: Get Your Backend URL

After deployment, Vercel will give you a URL like:
```
https://your-project.vercel.app
```

Your API endpoints will be:
- `https://your-project.vercel.app/api/chat`
- `https://your-project.vercel.app/api/health`

### Step 5: Update Frontend

Update your frontend environment variable (in Firebase Hosting or wherever you deploy):

```
REACT_APP_API_URL=https://your-project.vercel.app
```

Or if using Vercel for frontend too, add this environment variable in Vercel dashboard.

### Step 6: Test

```bash
# Test health endpoint
curl https://your-project.vercel.app/api/health

# Test chat endpoint
curl -X POST https://your-project.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!", "conversationHistory": []}'
```

---

## Alternative: Deploy to Railway (For Ollama Support)

Railway supports persistent processes, so you can run Ollama if needed. Railway has a **free $5 credit per month**.

### Prerequisites

1. **Railway account**: Sign up at https://railway.app
2. **Railway CLI**:
   ```bash
   npm i -g @railway/cli
   ```

### Step 1: Deploy to Railway

```bash
# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

### Step 2: Set Environment Variables in Railway

In Railway dashboard → Your Project → Variables:

**For Ollama:**
```
AI_PROVIDER=ollama
OLLAMA_API_URL=http://localhost:11434/api/generate
OLLAMA_MODEL=phi3
PORT=3001
NODE_ENV=production
```

**For Claude:**
```
AI_PROVIDER=claude
ANTHROPIC_API_KEY=your-claude-api-key-here
CLAUDE_MODEL=claude-3-haiku-20240307
PORT=3001
NODE_ENV=production
```

### Step 3: Get Your Backend URL

Railway will provide a URL like:
```
https://your-project.railway.app
```

### Step 4: Update Frontend

Same as Vercel - update `REACT_APP_API_URL` to point to your Railway URL.

---

## Alternative: Deploy to Render (Free Tier Available)

Render offers a free tier with some limitations.

### Step 1: Create Render Account

1. Go to https://render.com
2. Sign up (free tier available)

### Step 2: Create New Web Service

1. Click **New** → **Web Service**
2. Connect your Git repository
3. Configure:
   - **Name**: `storyflow-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Plan**: Free

### Step 3: Set Environment Variables

Same as Railway - add all your environment variables in Render dashboard.

### Step 4: Deploy

Render will automatically deploy when you push to your repository.

---

## Comparison

| Platform | Free Tier | Best For | Limitations |
|----------|-----------|----------|-------------|
| **Vercel** | ✅ Unlimited | Claude API | No persistent processes (can't run Ollama) |
| **Railway** | ✅ $5 credit/month | Ollama or Claude | Credit runs out, then ~$5-10/month |
| **Render** | ✅ Limited | Ollama or Claude | Sleeps after 15min inactivity (free tier) |

---

## Recommended Setup

### For Production (Claude API):
```
Frontend: Firebase Hosting (free)
Backend: Vercel (free)
AI: Claude API (pay per use)
```

### For Production (Ollama):
```
Frontend: Firebase Hosting (free)
Backend: Railway (~$5-10/month)
AI: Ollama (free, runs on Railway)
```

---

## Troubleshooting

### Vercel: "Function timeout"
- Vercel has a 10-second timeout on free tier
- Upgrade to Pro ($20/month) for 60-second timeout
- Or use Railway/Render for longer timeouts

### Railway: "Out of credits"
- Free $5 credit is used up
- Add payment method to continue
- Or switch to Vercel (if using Claude)

### Render: "Service sleeping"
- Free tier services sleep after 15min inactivity
- First request after sleep takes ~30 seconds
- Upgrade to paid plan to avoid sleeping

---

## Next Steps

1. Choose your platform (Vercel recommended for Claude)
2. Deploy using the steps above
3. Update `REACT_APP_API_URL` in your frontend
4. Test the chatbot!

Need help? Check the platform-specific documentation or ask for assistance.
