# Firebase Hosting Deployment Guide

## Quick Deployment Steps

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

This will open your browser to login with your Google account.

### Step 3: Initialize Firebase Hosting

In your project directory:

```bash
firebase init hosting
```

Answer the questions:
- **Project**: Select "storyflow-english-learning"
- **Public directory**: Enter `build`
- **Single-page app**: `Yes`
- **Automatic builds with GitHub**: `No` (for now)
- **Overwrite index.html**: `No`

### Step 4: Build Your React App

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Step 5: Deploy to Firebase

```bash
firebase deploy --only hosting
```

Your app will be live at: **https://storyflow-english-learning.web.app**

---

## Custom Domain Setup

### Option 1: Free Firebase Subdomain (Already Available)

Your app is automatically available at:
- https://storyflow-english-learning.web.app
- https://storyflow-english-learning.firebaseapp.com

### Option 2: Custom Domain (If You Own One)

#### Step 1: Go to Firebase Console
1. Visit: https://console.firebase.google.com/project/storyflow-english-learning/hosting
2. Click "Add custom domain"

#### Step 2: Add Your Domain
1. Enter your domain (e.g., `storyflowlearn.com`)
2. Click "Continue"

#### Step 3: Verify Ownership
Firebase will provide you with a TXT record:
```
Name: @
Type: TXT
Value: firebase-verification=xxxxxxxxxxxxx
```

Add this to your domain provider's DNS settings.

#### Step 4: Add DNS Records
After verification, add these A records to your domain:

```
Name: @
Type: A
Value: 151.101.1.195

Name: @
Type: A
Value: 151.101.65.195
```

For `www` subdomain, add:
```
Name: www
Type: CNAME
Value: storyflow-english-learning.web.app
```

#### Step 5: Wait for SSL Certificate
Firebase automatically provisions SSL certificate (can take up to 24 hours).

---

## Buy a Domain (Recommended Providers)

If you don't have a domain, here are affordable options:

### 1. **Namecheap** (Recommended)
- Cost: ~$8-15/year
- Website: https://www.namecheap.com
- Search for: `storyflowlearn.com`, `englishstory.app`, etc.

### 2. **Google Domains**
- Cost: ~$12/year
- Website: https://domains.google
- Integrated with Google/Firebase

### 3. **Cloudflare**
- Cost: ~$10/year
- Website: https://www.cloudflare.com/products/registrar
- Free CDN included

### 4. **Porkbun**
- Cost: ~$7/year
- Website: https://porkbun.com
- Very affordable

---

## Suggested Domain Names

Available options you might like:

- `storyflow-learn.com`
- `englishstoryflow.com`
- `learnwithstory.com`
- `storyenglish.app`
- `thaienglish.app`
- `storyfluent.com`
- `englishjourney.app`

Check availability at any domain provider above.

---

## Complete Firebase Hosting Setup

### Create `firebase.json` in Project Root

```json
{
  "hosting": {
    "public": "build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### Create `.firebaserc` in Project Root

```json
{
  "projects": {
    "default": "storyflow-english-learning"
  }
}
```

---

## Deployment Commands Reference

### Deploy Everything
```bash
firebase deploy
```

### Deploy Only Hosting
```bash
firebase deploy --only hosting
```

### Deploy Only Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### View Deployed Site
```bash
firebase open hosting:site
```

### Check Deployment History
Go to: https://console.firebase.google.com/project/storyflow-english-learning/hosting

---

## Automatic Deployment with GitHub Actions (Optional)

Create `.github/workflows/firebase-deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: storyflow-english-learning
```

---

## Environment Variables for Production

Update your `.env` file is NOT deployed (it's in `.gitignore`). 

Firebase uses environment variables at build time. Your `.env` is already configured correctly.

---

## Testing Before Deployment

### Local Production Build Test

```bash
# Build production version
npm run build

# Serve it locally
npx serve -s build
```

Then open http://localhost:3000 to test the production build locally.

---

## Post-Deployment Checklist

- [ ] App loads correctly
- [ ] Firebase authentication works
- [ ] Firestore data loads
- [ ] All routes work (Home, Stories, Stats, etc.)
- [ ] Videos play correctly
- [ ] XP system works
- [ ] Mobile responsive
- [ ] SSL certificate active (https://)

---

## Troubleshooting

### Issue: "Command not found: firebase"
Solution:
```bash
npm install -g firebase-tools
```

### Issue: "Permission denied"
Solution (Mac/Linux):
```bash
sudo npm install -g firebase-tools
```

### Issue: Build fails
Solution:
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Firebase init overwrites files
Solution: Choose "No" when asked to overwrite files during `firebase init`

### Issue: 404 on refresh
Solution: Make sure `firebase.json` has the rewrite rule (already included above)

---

## Your Firebase Hosting URLs

Once deployed, your app will be available at:

**Primary URL:**
- https://storyflow-english-learning.web.app

**Alternative URL:**
- https://storyflow-english-learning.firebaseapp.com

**Custom Domain (if configured):**
- https://yourdomain.com

---

## Quick Commands Summary

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Initialize
firebase init hosting

# 4. Build
npm run build

# 5. Deploy
firebase deploy --only hosting

# Done! Your app is live! 🎉
```

---

## Next Steps

1. ✅ Follow the deployment steps above
2. 🌐 Share your Firebase URL: `https://storyflow-english-learning.web.app`
3. 💰 (Optional) Buy a custom domain
4. 🔗 (Optional) Connect custom domain to Firebase
5. 🚀 Share your app with the world!

---

## Support

If you encounter issues:
- Firebase Console: https://console.firebase.google.com/project/storyflow-english-learning
- Firebase Docs: https://firebase.google.com/docs/hosting
- Firebase Support: https://firebase.google.com/support

Enjoy your deployed app! 🎊
