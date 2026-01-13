# Deployment Guide for StoryFlow with Ollama

This guide covers different deployment strategies for your chatbot application.

## Current Setup

- **Development**: Ollama runs locally with gpt-oss model
- **Backend**: Express server on port 3001
- **Frontend**: React app on port 3000
- **Database**: Firebase (already cloud-hosted ✅)

## Deployment Challenge

Ollama requires significant resources:
- **RAM**: 4-8GB for gpt-oss (20.9B parameters)
- **Storage**: ~14GB for model
- **CPU**: Continuous processing

Most free hosting tiers provide only 512MB RAM, which is insufficient.

---

## Option 1: Deploy to a Low-Cost VPS (Recommended)

### Best Services:
1. **DigitalOcean Droplet** - $6/month (1GB RAM)
2. **Hetzner Cloud** - €4.5/month (~$5/month, 2GB RAM)
3. **Vultr** - $6/month (1GB RAM)
4. **Linode** - $5/month (1GB RAM)

### Setup Steps:

#### 1. Create VPS and Install Requirements

```bash
# SSH into your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Install git
apt install -y git

# Install PM2 (process manager)
npm install -g pm2
```

#### 2. Clone and Setup Your Project

```bash
# Clone your repository
git clone https://github.com/yourusername/englishstorylearn.git
cd englishstorylearn

# Install dependencies
npm install

# Pull the model (use smaller model for 1GB RAM VPS)
ollama pull phi3  # or gemma3:270m for even less RAM
```

#### 3. Start Services

```bash
# Start Ollama as a service
sudo systemctl enable ollama
sudo systemctl start ollama

# Start your backend with PM2
pm2 start server/index.js --name storyflow-backend
pm2 save
pm2 startup
```

#### 4. Setup Nginx (Reverse Proxy)

```bash
# Install Nginx
apt install -y nginx

# Create Nginx configuration
nano /etc/nginx/sites-available/storyflow
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable the site
ln -s /etc/nginx/sites-available/storyflow /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### 5. Deploy Frontend to Vercel

```bash
# In your local machine, deploy React app
npx vercel --prod
```

Update [src/components/FloatingChatbot.js](src/components/FloatingChatbot.js) to use your backend URL:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const response = await fetch(`${API_URL}/api/chat`, { /* ... */ });
```

Add environment variable in Vercel:
```
REACT_APP_API_URL=https://your-domain.com
```

### Cost: ~$6/month

---

## Option 2: Use Smaller Model + Railway (Limited Free Tier)

Railway offers $5 free credit per month, which runs out quickly with continuous usage.

### Setup with Dockerfile

We've created [Dockerfile](Dockerfile) and [.dockerignore](.dockerignore) for you.

#### 1. Update Model to Smaller Version

Already done in [server/index.js:15](server/index.js#L15) - now uses `phi3` by default.

#### 2. Create Railway Project

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

#### 3. Set Environment Variables in Railway

```
OLLAMA_MODEL=phi3
PORT=3001
```

#### 4. Deploy Frontend

Same as Option 1 - deploy React to Vercel and point to Railway backend URL.

### Cost: $0 initially (free $5 credit), then ~$5-10/month

---

## Option 3: Hybrid Setup (Free + Local)

**For personal/testing use only**

### Keep Everything Local

- Run Ollama on your local machine
- Use Cloudflare Tunnel or ngrok to expose your backend
- Deploy only the frontend

#### Setup with Cloudflare Tunnel (Free)

```bash
# Install cloudflared
# macOS:
brew install cloudflare/cloudflare/cloudflared

# Linux:
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
dpkg -i cloudflared-linux-amd64.deb

# Login
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create storyflow-backend

# Run tunnel
cloudflared tunnel --url http://localhost:3001
```

This gives you a public URL like `https://random-id.trycloudflare.com` that routes to your local backend.

**Limitations**:
- Your computer must be on and connected
- Not suitable for production
- Free but unreliable

### Cost: $0

---

## Option 4: Model Comparison for Deployment

If deploying to limited resources, choose a model based on your RAM:

| Model | Size | RAM Required | Quality | Speed |
|-------|------|--------------|---------|-------|
| gpt-oss | 13.8GB | 8GB+ | Excellent | Slow |
| llama3.2 | 2GB | 4GB | Very Good | Medium |
| phi3 | 2.2GB | 3GB | Good | Fast |
| gemma3:270m | 291MB | 1GB | Moderate | Very Fast |

**Recommendation for $6/month VPS (1GB RAM)**: Use `gemma3:270m`

Update your local `.env` for development:
```env
OLLAMA_MODEL=gpt-oss
```

Update Railway/VPS environment variable for production:
```env
OLLAMA_MODEL=gemma3:270m
```

---

## Recommended Deployment Architecture

```
┌─────────────────┐
│   Vercel (Free) │  ← React Frontend
└────────┬────────┘
         │ HTTPS
         ↓
┌─────────────────────────┐
│   Your VPS ($6/month)   │
│  ┌──────────────────┐   │
│  │ Nginx (Port 80)  │   │  ← Reverse Proxy
│  └────────┬─────────┘   │
│           │              │
│  ┌────────▼─────────┐   │
│  │ Express (3001)   │   │  ← Your Backend
│  └────────┬─────────┘   │
│           │              │
│  ┌────────▼─────────┐   │
│  │ Ollama (11434)   │   │  ← AI Model
│  │  (gemma3:270m)   │   │
│  └──────────────────┘   │
└─────────────────────────┘
         │
         ↓
┌─────────────────┐
│  Firebase (Free) │  ← Database & Auth
└─────────────────┘
```

---

## Environment Variables Setup

### For Local Development

Create `.env` file:
```env
NODE_ENV=development
OLLAMA_MODEL=gpt-oss
PORT=3001
```

### For Production (VPS/Railway)

```env
NODE_ENV=production
OLLAMA_MODEL=gemma3:270m
PORT=3001
```

### For React App

Create `.env` file:
```env
# Development
REACT_APP_API_URL=http://localhost:3001

# Production (set in Vercel)
REACT_APP_API_URL=https://api.yourdomain.com
```

Update [src/components/FloatingChatbot.js:88](src/components/FloatingChatbot.js#L88):
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const response = await fetch(`${API_URL}/api/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message, conversationHistory })
});
```

---

## Testing Deployment

### 1. Test Backend Locally with Smaller Model

```bash
# Pull smaller model
ollama pull gemma3:270m

# Set environment variable
export OLLAMA_MODEL=gemma3:270m

# Start backend
npm run server
```

### 2. Test in Browser

```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "ollama": "connected",
  "model": "gemma3:270m"
}
```

### 3. Build React for Production

```bash
npm run build
```

Check that build succeeds before deploying.

---

## My Recommendation

For your project, I recommend:

1. **Start with Option 3 (Hybrid/Local)** for testing
   - Free
   - Use gpt-oss locally
   - Test with friends/family

2. **When ready for production, use Option 1 (VPS)**
   - $6/month Hetzner VPS
   - Use gemma3:270m model (fits in 1GB RAM)
   - Deploy frontend to Vercel (free)
   - Professional and reliable

3. **Skip Option 2 (Railway)** unless you're okay with ongoing costs

---

## Firestore Rules for Production

Before deploying, secure your Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User progress - only owner can read/write
    match /userProgress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Chat messages - only owner can read/write
    match /userChats/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Stories - anyone can read, admin can write
    match /stories/{storyId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

---

## Monitoring and Maintenance

### Check Ollama Status

```bash
curl http://localhost:11434/api/tags
```

### Check Backend Logs

```bash
# If using PM2
pm2 logs storyflow-backend

# If using systemd
journalctl -u storyflow-backend -f
```

### Update Model

```bash
ollama pull gemma3:270m
pm2 restart storyflow-backend
```

---

## Need Help?

- Check [CHATBOT_SETUP.md](CHATBOT_SETUP.md) for local setup
- Check [OLLAMA_API_GUIDE.md](OLLAMA_API_GUIDE.md) for API details
- Report issues at GitHub

---

## Summary

| Option | Cost | Effort | Reliability | Best For |
|--------|------|--------|-------------|----------|
| VPS ($6/mo) | $6/mo | Medium | High | Production |
| Railway | $5-10/mo | Low | Medium | Quick deploy |
| Hybrid/Local | Free | Low | Low | Testing only |

**Final Recommendation**: Start free with local testing, then deploy to $6/month VPS when ready for users.
