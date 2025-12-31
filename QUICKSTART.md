# Quick Start Guide - StoryFlow

## Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

The app will automatically open at [http://localhost:3000](http://localhost:3000)

### 3. Start Learning!

1. Click on "A True Friend" story in the sidebar
2. Choose a learning mode (Listening, Speaking, Reading, or Writing)
3. Watch the video and complete the exercises

## Project Features Overview

### Four Learning Modes

#### 👂 Listening Mode
- Multiple choice questions based on video content
- Instant feedback on answers
- Thai translations for context

#### 🗣️ Speaking Mode (Chrome/Edge only)
- Voice recording with speech recognition
- Pronunciation accuracy scoring
- Real-time feedback

#### 📖 Reading Mode
- Interactive clickable vocabulary
- Word definitions and translations
- Thai-English parallel text

#### ✍️ Writing Mode
- Dictation practice
- Smart text matching
- Progress tracking

## File Structure

```
src/
├── components/          # React components
│   ├── modes/          # Four learning mode components
│   ├── Sidebar.js      # Story selection
│   ├── StoryPlayer.js  # Main story interface
│   ├── VideoPlayer.js  # Video controls
│   └── ...
├── data/               # JSON story content
├── hooks/              # Custom React hooks
└── utils/              # Helper functions
```

## Adding Your Own Content

Edit `src/data/stories.json` to:
- Add new stories
- Modify scenes
- Update vocabulary lists
- Change difficulty levels

## Troubleshooting

**Speaking mode not working?**
- Use Chrome or Edge browser
- Allow microphone permissions
- Check browser console for errors

**Videos not playing?**
- Ensure video files are in the `/video` folder
- Check file paths in stories.json
- Verify video format (MP4 recommended)

**Build errors?**
- Run `npm install` again
- Clear cache: `npm cache clean --force`
- Delete `node_modules` and reinstall

## Browser Support

- Chrome: Full support ✅
- Edge: Full support ✅
- Safari: Limited (no speech recognition) ⚠️
- Firefox: Limited (no speech recognition) ⚠️

## Next Steps

1. Customize the color scheme in `tailwind.config.js`
2. Add more stories to `src/data/stories.json`
3. Modify learning modes to fit your needs
4. Deploy to production: `npm run build`

Happy Learning! 🎉
