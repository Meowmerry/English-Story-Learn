const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Ollama API endpoint
// For Vercel: Use OLLAMA_API_URL environment variable to point to external Ollama instance
// For local: defaults to localhost
const OLLAMA_API = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';
// Use smaller model for deployment (phi3 = 2.3GB vs gpt-oss = 14GB)
const MODEL = process.env.OLLAMA_MODEL || 'gpt-oss';

// System prompt for the English learning assistant
const SYSTEM_PROMPT = `You are a helpful English learning assistant for StoryFlow, an interactive English learning platform. Your role is to:
1. Help users understand English grammar, vocabulary, and pronunciation
2. Answer questions about the stories and learning content
3. Provide tips for improving listening, speaking, reading, and writing skills
4. Explain difficult words or phrases in simple English
5. Encourage and motivate learners

Keep responses clear, concise, and encouraging. Use simple English when possible. If users make mistakes, correct them gently and explain why.`;

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build the full prompt with conversation history
    let fullPrompt = SYSTEM_PROMPT + '\n\n';

    // Add conversation history
    conversationHistory.forEach(msg => {
      if (msg.role === 'user') {
        fullPrompt += `User: ${msg.content}\n`;
      } else if (msg.role === 'assistant') {
        fullPrompt += `Assistant: ${msg.content}\n`;
      }
    });

    // Add current message
    fullPrompt += `User: ${message}\nAssistant: `;

    console.log('Sending request to Ollama...');

    // Call Ollama API
    const response = await axios.post(
      OLLAMA_API,
      {
        model: MODEL,
        prompt: fullPrompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 500
        }
      },
      {
        timeout: 60000 // 60 second timeout
      }
    );

    const assistantMessage = response.data.response.trim();

    res.json({
      message: assistantMessage,
      model: MODEL
    });

  } catch (error) {
    console.error('Error calling Ollama:', error.message);

    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'Ollama service is not running. Please start Ollama first.'
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
  try {
    // Check if Ollama is running
    await axios.get('http://localhost:11434/api/tags', { timeout: 5000 });
    res.json({ status: 'healthy', ollama: 'connected', model: MODEL });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      ollama: 'disconnected',
      message: 'Ollama service is not running'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Using Ollama model: ${MODEL}`);
  console.log('Make sure Ollama is running: ollama serve');
});
