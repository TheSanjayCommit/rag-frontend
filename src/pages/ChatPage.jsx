import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { GraduationCap, Menu, X } from 'lucide-react';
import { useChatStore } from '../context/useChatStore.jsx';
import MessageBubble from '../components/MessageBubble';
import InputBox from '../components/InputBox';
import Sidebar from '../components/Sidebar';
import { API_BASE_URL } from '../services/api.js';

const SUGGESTIONS = [
  'IIT Bombay fees and placements',
  'Compare NIT Warangal vs BITS Pilani',
  'Top CSE colleges under 2 lakhs',
  'Latest admission news 2026',
];

const ChatPage = () => {
  const { state, dispatch, activeChat } = useChatStore();
  const [query, setQuery] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  // Auto-scroll whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages?.length]);

  const sendMessage = async (textToSend) => {
    const userText = (textToSend || query).trim();
    if (!userText || isStreaming) return;

    setQuery('');
    setIsStreaming(true);

    // Build conversation history pairs
    const msgs = activeChat?.messages || [];
    const history = [];
    for (let i = 0; i < msgs.length - 1; i++) {
      if (msgs[i].role === 'user' && msgs[i + 1]?.role === 'assistant') {
        history.push({ user: msgs[i].text, assistant: msgs[i + 1].text });
      }
    }

    // Dispatch user message first
    dispatch({ type: 'ADD_MESSAGE', payload: { role: 'user', text: userText } });
    // Dispatch empty AI placeholder
    dispatch({ type: 'ADD_MESSAGE', payload: { role: 'assistant', text: '' } });

    try {
      const response = await fetch(`${API_BASE_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userText, history: history.slice(-5) }),
      });

      if (!response.ok) throw new Error(`Server error: HTTP ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulated = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        dispatch({ type: 'UPDATE_LAST_MESSAGE', payload: accumulated });
      }
    } catch (err) {
      dispatch({
        type: 'UPDATE_LAST_MESSAGE',
        payload: `⚠️ **Connection Error:** ${err.message}\n\nPlease check that the backend server is running.`,
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const messages = activeChat?.messages || [];

  return (
    <div className="app-root">
      <Sidebar isOpen={sidebarOpen} />

      <div className="main-panel">
        {/* Top Bar */}
        <header className="top-bar">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen((o) => !o)}
            title="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="top-bar-title">
            {activeChat?.title && activeChat.title !== 'New Chat'
              ? activeChat.title
              : 'College Advisor AI'}
          </span>
        </header>

        {/* Messages Area */}
        <div className="messages-area">
          {messages.length === 0 ? (
            // Welcome Screen
            <div className="welcome-screen">
              <div className="welcome-icon">
                <GraduationCap size={48} />
              </div>
              <h1 className="welcome-title">College Advisor AI</h1>
              <p className="welcome-subtitle">
                Ask me about fees, placements, rankings, or compare institutions.
              </p>
              <div className="welcome-pills">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    className="suggestion-pill"
                    onClick={() => sendMessage(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="messages-feed">
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <MessageBubble
                    key={`${activeChat?.id}-${i}`}
                    role={msg.role}
                    text={msg.text}
                    isStreaming={isStreaming && i === messages.length - 1}
                  />
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} style={{ height: '1px' }} />
            </div>
          )}
        </div>

        {/* Input Box */}
        <InputBox
          query={query}
          setQuery={setQuery}
          onSend={() => sendMessage()}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
};

export default ChatPage;
