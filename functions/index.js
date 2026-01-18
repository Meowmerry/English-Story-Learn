const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// AI Provider Configuration
// For production: Set via Firebase Console → Functions → Configuration → Environment Variables
// Or use: firebase functions:secrets:set CLAUDE_API_KEY (then access via process.env)
// For local development: use .env file in functions folder
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307';

// System prompt for the English learning assistant
const SYSTEM_PROMPT = `You are a helpful English learning assistant for StoryFlow, an interactive English learning platform. Your role is to:
1. Help users understand English grammar, vocabulary, and pronunciation
2. Answer questions about the stories and learning content
3. Provide tips for improving listening, speaking, reading, and writing skills
4. Explain difficult words or phrases in simple English
5. Encourage and motivate learners

Keep responses clear, concise, and encouraging. Use simple English when possible. If users make mistakes, correct them gently and explain why.`;

// Call Claude API
async function callClaudeAPI(message, conversationHistory) {
  const messages = [
    ...conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    { role: 'user', content: message }
  ];

  const response = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      timeout: 60000
    }
  );

  return response.data.content[0].text;
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'StoryFlow API is running',
    endpoints: {
      health: '/api/health',
      chat: '/api/chat (POST)'
    },
    functionUrl: 'https://us-central1-storyflow-english-learning.cloudfunctions.net/api'
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!CLAUDE_API_KEY) {
      return res.status(500).json({
        error: 'Claude API key not configured. Set it with: firebase functions:secrets:set CLAUDE_API_KEY'
      });
    }

    console.log('Sending request to Claude API...');
    const assistantMessage = await callClaudeAPI(message, conversationHistory);

    res.json({
      message: assistantMessage,
      model: CLAUDE_MODEL,
      provider: 'claude'
    });

  } catch (error) {
    console.error('Error calling Claude:', error.message);

    if (error.response?.status === 401) {
      return res.status(401).json({
        error: 'Invalid Claude API key'
      });
    }

    res.status(500).json({
      error: 'Failed to get response from AI assistant',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  res.json({
    status: CLAUDE_API_KEY ? 'healthy' : 'unhealthy',
    provider: 'claude',
    model: CLAUDE_MODEL,
    apiKeyConfigured: !!CLAUDE_API_KEY
  });
});

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);
