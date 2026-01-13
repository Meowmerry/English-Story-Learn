# Ollama API Integration Guide

This document explains how the StoryFlow chatbot integrates with Ollama's local API.

## What is Ollama?

Ollama is a tool that allows you to run large language models (LLMs) locally on your computer. Instead of calling external APIs like OpenAI or Anthropic, Ollama runs AI models directly on your machine.

## Ollama API Endpoint

When you run `ollama serve`, it starts an HTTP API server at:

```
http://localhost:11434
```

**Port 11434** is Ollama's default port - similar to how web servers use port 80, or how React dev server uses port 3000.

## Available API Endpoints

Ollama provides several endpoints for different operations:

### 1. `/api/generate` - Generate Text (Used in Our Chatbot)

**Purpose**: Generate text completions from a prompt

**Method**: `POST`

**URL**: `http://localhost:11434/api/generate`

**Request Body**:
```json
{
  "model": "gpt-oss",
  "prompt": "What is a noun?",
  "stream": false,
  "options": {
    "temperature": 0.7,
    "top_p": 0.9,
    "max_tokens": 500
  }
}
```

**Response**:
```json
{
  "model": "gpt-oss",
  "created_at": "2025-01-12T10:30:00Z",
  "response": "A noun is a word that represents a person, place, thing, or idea...",
  "done": true
}
```

**Our Implementation**: [server/index.js:53-68](server/index.js#L53-L68)

---

### 2. `/api/tags` - List Available Models

**Purpose**: Get a list of all downloaded models

**Method**: `GET`

**URL**: `http://localhost:11434/api/tags`

**Response**:
```json
{
  "models": [
    {
      "name": "gpt-oss:latest",
      "size": 13793441244,
      "digest": "17052f91a42e...",
      "modified_at": "2026-01-12T13:32:57Z"
    },
    {
      "name": "llama3.2:latest",
      "size": 2019393189,
      "digest": "a80c4f17acd5...",
      "modified_at": "2025-12-09T11:26:50Z"
    }
  ]
}
```

**Usage**: Check which models are available
```bash
curl http://localhost:11434/api/tags
```

**Our Implementation**: Used in health check at [server/index.js:97](server/index.js#L97)

---

### 3. `/api/chat` - Chat Completions

**Purpose**: Multi-turn conversations with message history

**Method**: `POST`

**URL**: `http://localhost:11434/api/chat`

**Request Body**:
```json
{
  "model": "gpt-oss",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user",
      "content": "Hello!"
    },
    {
      "role": "assistant",
      "content": "Hi! How can I help you?"
    },
    {
      "role": "user",
      "content": "What's 2+2?"
    }
  ],
  "stream": false
}
```

**Response**:
```json
{
  "model": "gpt-oss",
  "created_at": "2025-01-12T10:30:00Z",
  "message": {
    "role": "assistant",
    "content": "2 + 2 equals 4."
  },
  "done": true
}
```

**Note**: We currently use `/api/generate` instead, but `/api/chat` could be a better choice for conversation handling.

---

### 4. `/api/embeddings` - Generate Embeddings

**Purpose**: Convert text into numerical vectors for semantic search

**Method**: `POST`

**URL**: `http://localhost:11434/api/embeddings`

**Request Body**:
```json
{
  "model": "gpt-oss",
  "prompt": "Hello world"
}
```

**Response**:
```json
{
  "embedding": [0.123, -0.456, 0.789, ...]
}
```

**Use Cases**:
- Semantic search
- Document similarity
- Content recommendations

---

## How Our Chatbot Uses Ollama

### Architecture Flow

```
User Types Message
       ↓
FloatingChatbot Component (React)
       ↓
POST /api/chat → Express Server (port 3001)
       ↓
POST /api/generate → Ollama API (port 11434)
       ↓
Ollama runs gpt-oss model locally
       ↓
Returns AI response
       ↓
Express forwards to React
       ↓
User sees response in chat
```

### Code Implementation

**1. React Frontend** - [src/components/FloatingChatbot.js:88-106](src/components/FloatingChatbot.js#L88-L106)
```javascript
const response = await fetch('http://localhost:3001/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userMessage.content,
    conversationHistory
  })
});
```

**2. Express Backend** - [server/index.js:27-91](server/index.js#L27-L91)
```javascript
app.post('/api/chat', async (req, res) => {
  const { message, conversationHistory = [] } = req.body;

  // Build prompt with history
  let fullPrompt = SYSTEM_PROMPT + '\n\n';
  conversationHistory.forEach(msg => {
    fullPrompt += `${msg.role}: ${msg.content}\n`;
  });
  fullPrompt += `User: ${message}\nAssistant: `;

  // Call Ollama
  const response = await axios.post(
    'http://localhost:11434/api/generate',
    {
      model: 'gpt-oss',
      prompt: fullPrompt,
      stream: false
    }
  );

  res.json({ message: response.data.response });
});
```

---

## Configuration Options

### Model Parameters

**Temperature** (0.0 - 1.0)
- Controls randomness
- Lower = more focused and deterministic
- Higher = more creative and varied
- Our setting: `0.7` [server/index.js:60](server/index.js#L60)

**Top P** (0.0 - 1.0)
- Nucleus sampling threshold
- Controls diversity of word choices
- Our setting: `0.9` [server/index.js:61](server/index.js#L61)

**Max Tokens**
- Maximum length of response
- Our setting: `500` [server/index.js:62](server/index.js#L62)

### Timeout

We set a 60-second timeout for Ollama responses:
```javascript
timeout: 60000 // 60 seconds
```
[server/index.js:66](server/index.js#L66)

This prevents hanging if the model takes too long to respond.

---

## Testing the API

### 1. Check if Ollama is Running

```bash
curl http://localhost:11434/api/tags
```

**Expected Output**: JSON list of models

**If It Fails**: Run `ollama serve` first

---

### 2. List Available Models

```bash
curl http://localhost:11434/api/tags | jq '.models[].name'
```

**Example Output**:
```
"gpt-oss:latest"
"llama3.2:latest"
"phi3:latest"
```

---

### 3. Generate Text Directly

```bash
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-oss",
    "prompt": "What is 2+2?",
    "stream": false
  }'
```

**Expected Response**:
```json
{
  "model": "gpt-oss",
  "response": "2 + 2 equals 4.",
  "done": true
}
```

---

### 4. Test Our Backend Server

**Health Check**:
```bash
curl http://localhost:3001/api/health
```

**Expected Output**:
```json
{
  "status": "healthy",
  "ollama": "connected",
  "model": "gpt-oss"
}
```

**Send Chat Message**:
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

---

## Troubleshooting

### Error: `ECONNREFUSED`

**Problem**: Cannot connect to Ollama

**Solution**: Start Ollama service
```bash
ollama serve
```

---

### Error: `timeout of 60000ms exceeded`

**Problem**: Model is taking too long to respond

**Solutions**:
1. Use a smaller/faster model (e.g., `phi3` instead of `gpt-oss`)
2. Reduce `max_tokens` in [server/index.js:62](server/index.js#L62)
3. Increase timeout in [server/index.js:66](server/index.js#L66)

---

### Error: `model not found`

**Problem**: Requested model isn't downloaded

**Solution**: Download the model
```bash
ollama pull gpt-oss
```

---

### Chatbot Shows "Offline"

**Checklist**:
1. ✅ Ollama is running: `curl http://localhost:11434/api/tags`
2. ✅ Backend server is running: `curl http://localhost:3001/api/health`
3. ✅ Model is downloaded: `ollama list`
4. ✅ Check browser console for errors

---

## Switching Models

To use a different model, edit [server/index.js:14](server/index.js#L14):

```javascript
const MODEL = 'phi3';  // Change from 'gpt-oss' to 'phi3'
```

**Available Models**:
- `gpt-oss` - 20.9B parameters, high quality (current)
- `llama3.2` - 3.2B parameters, fast and efficient
- `phi3` - 3.8B parameters, very fast
- `mistral` - 7B parameters, good balance
- `gemma3` - 4.3B parameters, Google's model

Download a new model:
```bash
ollama pull phi3
```

---

## Performance Tips

### 1. Use Streaming for Faster Perceived Response

Change `stream: false` to `stream: true` in [server/index.js:58](server/index.js#L58)

Benefits:
- User sees response as it's generated
- Feels faster even if total time is same

Drawback:
- More complex implementation (need to handle streaming)

---

### 2. Cache Frequently Asked Questions

Add caching layer before calling Ollama:
```javascript
const cache = new Map();

if (cache.has(message)) {
  return cache.get(message);
}

// Call Ollama...
cache.set(message, response);
```

---

### 3. Pre-load Models

On server startup, send a warmup request:
```javascript
app.listen(PORT, async () => {
  console.log('Warming up model...');
  await axios.post('http://localhost:11434/api/generate', {
    model: MODEL,
    prompt: 'Hello',
    stream: false
  });
  console.log('Model ready!');
});
```

---

## Security Considerations

### 1. CORS Configuration

Currently allows all origins - [server/index.js:9](server/index.js#L9)
```javascript
app.use(cors()); // ⚠️ Allows all origins
```

For production, restrict to your domain:
```javascript
app.use(cors({
  origin: 'https://yourdomain.com'
}));
```

---

### 2. Rate Limiting

Add rate limiting to prevent abuse:
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10 // limit each IP to 10 requests per minute
});

app.use('/api/chat', limiter);
```

---

### 3. Input Validation

Always validate user input:
```javascript
if (!message || typeof message !== 'string' || message.length > 1000) {
  return res.status(400).json({ error: 'Invalid message' });
}
```

---

## Further Reading

- [Ollama API Documentation](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Ollama Model Library](https://ollama.com/library)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Axios Documentation](https://axios-http.com/docs/intro)

---

## Related Files

- Backend Server: [server/index.js](server/index.js)
- React Component: [src/components/FloatingChatbot.js](src/components/FloatingChatbot.js)
- Setup Guide: [CHATBOT_SETUP.md](CHATBOT_SETUP.md)
- Firebase Integration: [src/firebase/firestoreService.js](src/firebase/firestoreService.js)
