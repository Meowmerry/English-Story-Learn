# Deployment Guide - StoryFlow

## Local Development

### Start the Application

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm start
```

The app will open automatically at `http://localhost:3000`

**Note:** If port 3000 is already in use, the app will prompt you to use a different port.

### Stop the Application

Press `Ctrl + C` in the terminal where the app is running.

## Production Build

### Create Production Build

```bash
npm run build
```

This creates an optimized build in the `/build` folder:
- Minified JavaScript bundles
- Optimized CSS
- Compressed images
- Service worker ready

### Test Production Build Locally

```bash
# Install serve globally (one time)
npm install -g serve

# Serve the build folder
serve -s build -p 3000
```

Visit `http://localhost:3000` to test the production build.

## Deployment Options

### Option 1: Vercel (Recommended - Free)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts:
   - Login with GitHub/Email
   - Select project settings
   - Deploy automatically

**Vercel Features:**
- Automatic HTTPS
- Global CDN
- Zero configuration
- Free custom domains

### Option 2: Netlify (Free)

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod
```

Or use drag-and-drop:
1. Go to [netlify.com](https://netlify.com)
2. Drag `/build` folder to deploy

**Netlify Features:**
- Continuous deployment
- Form handling
- Free SSL
- Custom redirects

### Option 3: GitHub Pages

1. Add to `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/english-study-story"
}
```

2. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

3. Add deploy scripts to `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

4. Deploy:
```bash
npm run deploy
```

### Option 4: Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login:
```bash
firebase login
```

3. Initialize:
```bash
firebase init hosting
```

4. Configure:
   - Public directory: `build`
   - Single-page app: `Yes`
   - GitHub integration: `Optional`

5. Deploy:
```bash
npm run build
firebase deploy
```

### Option 5: AWS S3 + CloudFront

1. Build the app:
```bash
npm run build
```

2. Create S3 bucket:
   - Enable static website hosting
   - Set index document: `index.html`
   - Set error document: `index.html`

3. Upload `/build` contents to S3

4. Configure CloudFront:
   - Create distribution
   - Set origin to S3 bucket
   - Configure custom error responses

5. Update DNS to point to CloudFront

## Environment Variables

Create `.env` file for environment-specific settings:

```env
# API endpoints (if needed in future)
REACT_APP_API_URL=https://api.yourdomain.com

# Analytics (optional)
REACT_APP_GA_TRACKING_ID=UA-XXXXXXXXX-X
```

**Important:** Never commit `.env` to version control!

## Pre-Deployment Checklist

- [ ] Run `npm run build` successfully
- [ ] Test production build locally
- [ ] Verify all videos load correctly
- [ ] Test all four learning modes
- [ ] Check mobile responsiveness
- [ ] Test speech recognition (Chrome/Edge)
- [ ] Verify Thai characters display correctly
- [ ] Check browser console for errors
- [ ] Test on multiple devices
- [ ] Update README with live URL

## Post-Deployment

### Custom Domain

Most platforms support custom domains:

1. **Vercel:**
   - Go to Project Settings > Domains
   - Add your domain
   - Configure DNS records

2. **Netlify:**
   - Go to Domain Settings
   - Add custom domain
   - Follow DNS instructions

3. **GitHub Pages:**
   - Add CNAME file with your domain
   - Configure DNS A records

### HTTPS/SSL

All modern platforms provide free SSL:
- Vercel: Automatic
- Netlify: Automatic
- Firebase: Automatic
- GitHub Pages: Automatic

### Performance Optimization

After deployment:

1. **Enable Compression:**
   - Most platforms auto-enable gzip
   - Check response headers

2. **Add Caching Headers:**
   - Configure in platform settings
   - Set long cache times for static assets

3. **Use CDN:**
   - Most platforms have built-in CDN
   - Vercel, Netlify, CloudFront

4. **Monitor Performance:**
   - Use Google Lighthouse
   - Check PageSpeed Insights
   - Monitor bundle sizes

## Troubleshooting

### Port 3000 Already in Use

```bash
# Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules
npm cache clean --force
npm install
npm run build
```

### Videos Not Loading

Check:
1. Video file paths in `stories.json`
2. Video files exist in `/public/video/`
3. Video format is supported (MP4, WebM)
4. CORS settings if hosting separately

### Speech Recognition Not Working

Requirements:
- Must use HTTPS in production
- Chrome or Edge browser
- Microphone permissions granted
- User interaction before recording

## Monitoring & Analytics

### Add Google Analytics

1. Create GA property
2. Add to `public/index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### Error Tracking

Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Mixpanel for user analytics

## Continuous Deployment

### Vercel with GitHub

1. Connect GitHub repo to Vercel
2. Every push to main triggers deploy
3. Pull requests get preview URLs

### Netlify with GitHub

1. Connect repo in Netlify dashboard
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
3. Auto-deploys on push

## Rollback Strategy

All platforms support rollback:

**Vercel:**
```bash
vercel rollback
```

**Netlify:**
- Use dashboard to restore previous deploy

**Firebase:**
```bash
firebase hosting:rollback
```

## Support & Resources

- [React Deployment Docs](https://create-react-app.dev/docs/deployment/)
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com/)
- [Firebase Docs](https://firebase.google.com/docs/hosting)

---

**Ready to Deploy! 🚀**

Choose your platform and follow the steps above. For beginners, we recommend starting with **Vercel** for its simplicity and excellent performance.
