# AI Chatbot Assistant Setup Guide

This guide will help you set up the AI-powered study assistant chatbot using Ollama and llama3.2.

## Prerequisites

1. **Ollama** - Local LLM runtime (already installed)
2. **Node.js** - For running the backend server
3. **npm** - Package manager

## Setup Instructions

### Step 1: Install Dependencies

First, install the required npm packages:

```bash
npm install
```

This will install:
- `express` - Backend server framework
- `axios` - HTTP client for API calls
- `cors` - Cross-origin resource sharing
- `concurrently` - Run multiple commands simultaneously

### Step 2: Download and Start Ollama Model

Make sure you have the llama3.2 model downloaded:

```bash
ollama pull llama3.2
```

Start the Ollama service (if not already running):

```bash
ollama serve
```

Keep this terminal window open.

### Step 3: Start the Application

Open a new terminal window and run:

```bash
npm run dev
```

This command will:
- Start the backend server on `http://localhost:3001`
- Start the React app on `http://localhost:3000`

Alternatively, you can run them separately:

**Terminal 1 - Backend Server:**
```bash
npm run server
```

**Terminal 2 - React App:**
```bash
npm start
```

## How It Works

### Architecture

```
User → React App (port 3000) → Express Server (port 3001) → Ollama API (port 11434)
                                      ↓
                                  Firebase (Chat History)
```

### Features

1. **Floating Chat Widget** - Always accessible in the bottom-right corner
2. **AI-Powered Responses** - Uses llama3.2 for intelligent conversations
3. **Chat History** - Saves conversation history to Firebase Firestore
4. **Context Awareness** - Maintains conversation context
5. **User-Specific** - Each user has their own chat history

### Chat Assistant Capabilities

The AI assistant can help with:
- Grammar and vocabulary explanations
- Understanding difficult words or phrases
- Tips for improving listening, speaking, reading, and writing
- Answering questions about the stories
- English learning motivation and encouragement

## File Structure

```
englishstorylearn/
├── server/
│   └── index.js                    # Express backend server
├── src/
│   ├── components/
│   │   └── FloatingChatbot.js      # React chatbot component
│   └── firebase/
│       └── firestoreService.js     # Firebase chat functions
├── package.json                    # Dependencies and scripts
└── CHATBOT_SETUP.md               # This file
```

## Configuration

### Changing the AI Model

To use a different Ollama model, edit [server/index.js](server/index.js:12):

```javascript
const MODEL = 'llama3.2';  // Change to 'mistral', 'phi3', etc.
```

Available models:
- `llama3.2` - Fast, efficient (Recommended)
- `mistral` - High quality, larger
- `phi3` - Lightweight, very fast

Download a new model with:
```bash
ollama pull <model-name>
```

### Customizing the System Prompt

Edit the `SYSTEM_PROMPT` in [server/index.js](server/index.js:14-21) to change the assistant's behavior.

### Adjusting Response Settings

In [server/index.js](server/index.js:52-56), you can modify:
- `temperature` (0.0-1.0) - Higher = more creative
- `top_p` (0.0-1.0) - Nucleus sampling
- `max_tokens` - Maximum response length

## Troubleshooting

### Chatbot shows "Offline"

**Solution:**
1. Make sure Ollama is running: `ollama serve`
2. Check if the backend server is running: `npm run server`
3. Verify Ollama is responding: `curl http://localhost:11434/api/tags`

### Server won't start

**Error:** `ECONNREFUSED`
- Make sure Ollama service is running first
- Check if port 3001 is already in use

**Error:** `Port already in use`
- Kill the process using the port or change the port in `server/index.js`

### Chat messages not saving

- Check Firebase configuration in [src/firebase/config.js](src/firebase/config.js)
- Ensure user is logged in (chat history requires authentication)
- Check browser console for Firebase errors

### Slow responses

- The first response may take longer as the model loads
- Consider using a smaller model like `phi3` for faster responses
- Check your system resources (RAM/CPU)

## Testing

To test the chatbot:

1. **Health Check:**
   ```bash
   curl http://localhost:3001/api/health
   ```
   Should return: `{"status":"healthy","ollama":"connected","model":"llama3.2"}`

2. **Test Chat API:**
   ```bash
   curl -X POST http://localhost:3001/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello, can you help me learn English?"}'
   ```

3. **Test in Browser:**
   - Open the app at `http://localhost:3000`
   - Click the chat button (💬) in the bottom-right corner
   - Type a message and check for a response

## Deployment Notes

For production deployment:

1. **Backend Server:** Deploy to a service like Heroku, Railway, or DigitalOcean
2. **Ollama:** Consider using Ollama Cloud or a dedicated server
3. **Environment Variables:** Add `OLLAMA_API` URL to environment config
4. **CORS:** Update CORS settings in `server/index.js` for your domain

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check the backend server logs
3. Verify Ollama is running: `ollama list`
4. Ensure all dependencies are installed: `npm install`
