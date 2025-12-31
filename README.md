# StoryFlow - English Learning Platform

A modern, interactive English learning application built with React and Tailwind CSS. Learn English through animated stories with four comprehensive learning modes.

## Features

### 🎬 Interactive Story-Based Learning
- Multiple animated stories with different difficulty levels
- Engaging video-based content for immersive learning
- Progress tracking through scenes

### 📚 Four Learning Modes

#### 👂 Listening Mode
- Watch video clips and answer multiple-choice questions
- Test your comprehension of spoken English
- Instant feedback with correct/incorrect answers
- Thai translations for context

#### 🗣️ Speaking Mode
- Practice pronunciation with voice recording
- Real-time speech recognition using Web Speech API
- Accuracy scoring with visual feedback
- Compare your pronunciation with native speakers

#### 📖 Reading Mode
- Interactive subtitles with clickable words
- Vocabulary definitions and translations
- Learn key phrases and their meanings
- Thai-English parallel text display

#### ✍️ Writing Mode
- Dictation practice - type what you hear
- Smart text matching (ignores punctuation)
- Similarity scoring to track improvement
- Helpful hints and Thai translations

## Technology Stack

- **React 18** - Modern React with Hooks
- **Tailwind CSS 3** - Responsive, mobile-first design
- **Web Speech API** - Voice recognition for speaking practice
- **JSON-based CMS** - Easy content management

## Project Structure

```
english-study-story/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── modes/
│   │   │   ├── ListeningMode.js
│   │   │   ├── SpeakingMode.js
│   │   │   ├── ReadingMode.js
│   │   │   └── WritingMode.js
│   │   ├── FeedbackModal.js
│   │   ├── SceneNavigation.js
│   │   ├── Sidebar.js
│   │   ├── SkillDock.js
│   │   ├── StoryPlayer.js
│   │   └── VideoPlayer.js
│   ├── data/
│   │   └── stories.json
│   ├── hooks/
│   │   └── useSpeechRecognition.js
│   ├── utils/
│   │   └── stringUtils.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── images/
├── video/
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

## Adding New Stories

Stories are managed through JSON files in `src/data/stories.json`. Each story follows this structure:

```json
{
  "id": "unique-story-id",
  "title": "Story Title",
  "description": "Brief description",
  "thumbnail": "/images/thumbnail.jpg",
  "difficulty": "beginner|intermediate|advanced",
  "totalScenes": 5,
  "scenes": [
    {
      "id": 1,
      "videoUrl": "/video/scene1.mp4",
      "transcript": "English sentence",
      "thaiTranslation": "Thai translation",
      "duration": 3.5,
      "listeningOptions": [
        { "text": "Option 1", "isCorrect": true },
        { "text": "Option 2", "isCorrect": false }
      ],
      "keywords": [
        {
          "word": "keyword",
          "translation": "คำแปล",
          "definition": "English definition"
        }
      ]
    }
  ]
}
```

## Browser Compatibility

- **Speaking Mode** requires a browser with Web Speech API support:
  - Chrome/Edge (recommended)
  - Safari (limited support)
  - Firefox (not supported)

## Responsive Design

The application is fully responsive and optimized for:
- Mobile phones (320px+)
- Tablets (768px+)
- Desktops (1024px+)

## Key Features Implementation

### Mobile-First Design
- Responsive sidebar with mobile overlay
- Touch-friendly buttons and controls
- Optimized layouts for all screen sizes

### Animations
- Smooth transitions between modes
- Fade-in/slide-up animations
- Interactive hover effects
- Progress animations

### State Management
- React Hooks (useState, useEffect, useCallback)
- Component-based state architecture
- Efficient re-rendering

### User Experience
- Clear visual feedback
- Bilingual support (English/Thai)
- Intuitive navigation
- Progress tracking

## Future Enhancements

- User authentication and progress saving
- More stories and difficulty levels
- Offline mode support
- Social features (leaderboards, sharing)
- Advanced analytics and reporting
- Custom vocabulary lists
- Spaced repetition system

## Contributing

To add new features or fix bugs:

1. Create a new branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is for educational purposes.

## Acknowledgments

- Built with React and Tailwind CSS
- Uses Web Speech API for voice recognition
- Designed for Thai English learners

---

**Happy Learning! 🎉**

สนุกกับการเรียนภาษาอังกฤษ! 📚
