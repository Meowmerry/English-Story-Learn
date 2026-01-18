import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { saveChatMessage, getChatHistory, clearChatHistory } from '../firebase/firestoreService';

function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check server health on mount
  useEffect(() => {
    checkServerHealth();
  }, []);

  // Load chat history when opened
  useEffect(() => {
    if (isOpen && user && messages.length === 0) {
      loadChatHistory();
    }
  }, [isOpen, user]);

  const checkServerHealth = async () => {
    try {
      // Use relative path in production (Firebase Hosting routes /api/** to Functions)
      // Use localhost in development
      const API_URL = process.env.REACT_APP_API_URL || 
        (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001');
      const response = await fetch(`${API_URL}/api/health`);
      const data = await response.json();
      // Works with both Claude (apiKeyConfigured) and Ollama (ollama === 'connected')
      const isHealthy = data.status === 'healthy' || data.ollama === 'connected' || data.apiKeyConfigured;
      setServerStatus(isHealthy ? 'connected' : 'disconnected');
    } catch (error) {
      console.error('Health check failed:', error);
      setServerStatus('disconnected');
    }
  };

  const loadChatHistory = async () => {
    if (!user) return;

    try {
      const history = await getChatHistory(user.uid);
      if (history && history.length > 0) {
        setMessages(history);
      } else {
        // Add welcome message
        setMessages([{
          role: 'assistant',
          content: `Hi! I'm your English learning assistant. I can help you with:
• Understanding grammar and vocabulary
• Explaining difficult words or phrases
• Tips for improving your English skills
• Answering questions about the stories

How can I help you today?`,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Save user message to Firestore
      if (user) {
        await saveChatMessage(user.uid, userMessage);
      }

      // Get conversation history for context (last 10 messages)
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call backend API (Firebase Functions or local)
      // Use relative path in production (Firebase Hosting routes /api/** to Functions)
      // Use localhost in development
      const API_URL = process.env.REACT_APP_API_URL || 
        (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001');
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();

      const assistantMessage = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save assistant message to Firestore
      if (user) {
        await saveChatMessage(user.uid, assistantMessage);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'assistant',
        content: serverStatus === 'disconnected'
          ? 'Sorry, the AI assistant is currently unavailable. Please make sure Ollama is running (ollama serve) and the backend server is started (npm run server).'
          : 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClearChat = async () => {
    if (user) {
      await clearChatHistory(user.uid);
    }
    // Reset to welcome message
    setMessages([{
      role: 'assistant',
      content: `Hi! I'm your English learning assistant. I can help you with:
• Understanding grammar and vocabulary
• Explaining difficult words or phrases
• Tips for improving your English skills
• Answering questions about the stories

How can I help you today?`,
      timestamp: new Date()
    }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div
          className={`
            bg-white rounded-2xl shadow-2xl mb-4 flex flex-col animate-slide-up
            ${isExpanded ? 'w-[600px] max-h-[700px]' : 'w-96 max-h-[500px]'}
          `}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl">
                🤖
              </div>
              <div>
                <h3 className="font-bold text-lg">Study Assistant</h3>
                <p className="text-xs text-white/80 flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${serverStatus === 'connected' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                  {serverStatus === 'connected' ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {/* Clear Chat Button */}
              <button
                onClick={handleClearChat}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                title="Clear chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              {/* Expand/Collapse Button */}
              <button
                onClick={toggleExpand}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  </svg>
                )}
              </button>
              {/* Close Button */}
              <button
                onClick={toggleChat}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                title="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
            style={{ maxHeight: isExpanded ? '550px' : '350px' }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.role === 'user'
                      ? 'bg-primary-600 text-white rounded-br-none'
                      : msg.isError
                        ? 'bg-red-100 text-red-800 rounded-bl-none'
                        : 'bg-white text-gray-800 shadow-sm rounded-bl-none'
                    }`}
                >
                  <p className={`whitespace-pre-wrap ${isExpanded ? 'text-base' : 'text-sm'}`}>{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow-sm rounded-2xl rounded-bl-none px-4 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything about English..."
                className={`flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${isExpanded ? 'text-base' : 'text-sm'}`}
                disabled={isLoading || serverStatus === 'disconnected'}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim() || serverStatus === 'disconnected'}
                className="bg-primary-600 text-white rounded-full p-2 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
      >
        {isOpen ? (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <span className="text-3xl">💬</span>
        )}
      </button>
    </div>
  );
}

export default FloatingChatbot;
