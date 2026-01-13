import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { saveChatMessage, getChatHistory } from '../firebase/firestoreService';

function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
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
      const response = await fetch('http://localhost:3001/api/health');
      const data = await response.json();
      setServerStatus(data.ollama === 'connected' ? 'connected' : 'disconnected');
    } catch (error) {
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

      // Call backend API
      const response = await fetch('http://localhost:3001/api/chat', {
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

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl mb-4 w-96 max-h-[600px] flex flex-col animate-slide-up">
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
            <button
              onClick={toggleChat}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" style={{ maxHeight: '400px' }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-primary-600 text-white rounded-br-none'
                      : msg.isError
                      ? 'bg-red-100 text-red-800 rounded-bl-none'
                      : 'bg-white text-gray-800 shadow-sm rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
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
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
