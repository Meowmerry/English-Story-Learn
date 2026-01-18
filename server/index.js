require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// AI Provider Configuration
// Set AI_PROVIDER to 'claude' or 'ollama' (default: ollama)
const AI_PROVIDER = process.env.AI_PROVIDER || 'ollama';

// Claude API Configuration
const CLAUDE_API_KEY = process.env.ANTHROPIC_API_KEY;
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307';

// Ollama API Configuration
const OLLAMA_API = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gpt-oss';

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

// Call Ollama API
async function callOllamaAPI(message, conversationHistory) {
  // Build the full prompt with conversation history
  let fullPrompt = SYSTEM_PROMPT + '\n\n';

  conversationHistory.forEach(msg => {
    if (msg.role === 'user') {
      fullPrompt += `User: ${msg.content}\n`;
    } else if (msg.role === 'assistant') {
      fullPrompt += `Assistant: ${msg.content}\n`;
    }
  });

  fullPrompt += `User: ${message}\nAssistant: `;

  const response = await axios.post(
    OLLAMA_API,
    {
      model: OLLAMA_MODEL,
      prompt: fullPrompt,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 500
      }
    },
    {
      timeout: 60000
    }
  );

  return response.data.response.trim();
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let assistantMessage;
    let modelUsed;

    // Use Claude if API key is available and provider is set to claude
    if (AI_PROVIDER === 'claude' && CLAUDE_API_KEY) {
      console.log('Sending request to Claude API...');
      assistantMessage = await callClaudeAPI(message, conversationHistory);
      modelUsed = CLAUDE_MODEL;
    } else {
      console.log('Sending request to Ollama...');
      assistantMessage = await callOllamaAPI(message, conversationHistory);
      modelUsed = OLLAMA_MODEL;
    }

    res.json({
      message: assistantMessage,
      model: modelUsed,
      provider: AI_PROVIDER === 'claude' && CLAUDE_API_KEY ? 'claude' : 'ollama'
    });

  } catch (error) {
    console.error('Error calling AI:', error.message);

    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'AI service is not running. Please check your configuration.'
      });
    }

    if (error.response?.status === 401) {
      return res.status(401).json({
        error: 'Invalid API key. Please check your Claude API key.'
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
  const health = {
    status: 'healthy',
    provider: AI_PROVIDER,
    ollama: 'unknown',
    claude: CLAUDE_API_KEY ? 'configured' : 'not configured'
  };

  // Check Ollama
  try {
    await axios.get('http://localhost:11434/api/tags', { timeout: 5000 });
    health.ollama = 'connected';
    health.ollamaModel = OLLAMA_MODEL;
  } catch (error) {
    health.ollama = 'disconnected';
  }

  // If using Claude, check if key exists
  if (AI_PROVIDER === 'claude') {
    health.claudeModel = CLAUDE_MODEL;
    if (!CLAUDE_API_KEY) {
      health.status = 'unhealthy';
      health.message = 'Claude API key not configured';
    }
  } else if (health.ollama === 'disconnected') {
    health.status = 'unhealthy';
    health.message = 'Ollama service is not running';
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

// Switch provider endpoint
app.post('/api/switch-provider', (req, res) => {
  const { provider } = req.body;

  if (provider !== 'claude' && provider !== 'ollama') {
    return res.status(400).json({ error: 'Invalid provider. Use "claude" or "ollama"' });
  }

  // Note: This only works for the current request context
  // For persistent change, set AI_PROVIDER environment variable
  res.json({
    message: `To switch to ${provider}, set AI_PROVIDER=${provider} environment variable and restart the server`,
    currentProvider: AI_PROVIDER
  });
});

// Export for Vercel serverless functions
module.exports = app;

// Only start server if not in serverless environment (Vercel)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`AI Provider: ${AI_PROVIDER}`);
    if (AI_PROVIDER === 'claude') {
      console.log(`Claude Model: ${CLAUDE_MODEL}`);
      console.log(`Claude API Key: ${CLAUDE_API_KEY ? 'Configured' : 'NOT CONFIGURED'}`);
    } else {
      console.log(`Ollama Model: ${OLLAMA_MODEL}`);
      console.log('Make sure Ollama is running: ollama serve');
    }
  });
}
