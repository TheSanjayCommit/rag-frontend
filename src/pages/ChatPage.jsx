import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GraduationCap, Sparkles, Zap, ShieldCheck, MapPin } from 'lucide-react';
import { useChatStore } from '../context/useChatStore.jsx';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { API_BASE_URL } from '../services/api.js';

const SUGGESTIONS = [
  { text: 'IIT Bombay fees and placements', icon: <Zap size={14} className="text-amber-500" /> },
  { text: 'Compare NIT Warangal vs BITS Pilani', icon: <Sparkles size={14} className="text-purple-500" /> },
  { text: 'Top CSE colleges in Telangana', icon: <MapPin size={14} className="text-emerald-500" /> },
  { text: 'Under 2 lakhs budget engineering', icon: <ShieldCheck size={14} className="text-blue-500" /> },
];

const ChatPage = () => {
  const { state, dispatch, activeChat } = useChatStore();
  const [query, setQuery] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const messagesEndRef = useRef(null);

  // Auto-scroll logic
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages?.length, isStreaming]);

  // Handle mobile resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sendMessage = async (textToSend) => {
    const userText = (textToSend || query).trim();
    if (!userText || isStreaming) return;

    setQuery('');
    setIsStreaming(true);

    const msgs = activeChat?.messages || [];
    const history = [];
    for (let i = 0; i < msgs.length - 1; i++) {
      if (msgs[i].role === 'user' && msgs[i + 1]?.role === 'assistant') {
        history.push({ user: msgs[i].text, assistant: msgs[i + 1].text });
      }
    }

    dispatch({ type: 'ADD_MESSAGE', payload: { role: 'user', text: userText } });
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
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex flex-col flex-1 h-full min-w-0 relative">
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          sidebarOpen={sidebarOpen} 
        />

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth custom-scrollbar">
          <div className="max-w-4xl mx-auto w-full px-4 md:px-8 pt-6">
            {messages.length === 0 ? (
              // Welcome Screen
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center min-h-[70vh] text-center"
              >
                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-8 animate-pulse">
                  <GraduationCap size={44} />
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
                  How can I help your career?
                </h1>
                <p className="text-muted-foreground text-lg max-w-xl mb-12 font-medium">
                  Your AI-powered advisor for college rankings, fees, and institution comparisons.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                  {SUGGESTIONS.map((s, idx) => (
                    <motion.button
                      key={s.text}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => sendMessage(s.text)}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/40 hover:bg-secondary/50 transition-all text-left group shadow-sm hover:shadow-md"
                    >
                      <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                        {s.icon}
                      </div>
                      <span className="text-sm font-semibold">{s.text}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              // Message List
              <div className="flex flex-col pb-12">
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
                <div ref={messagesEndRef} className="h-4" />
              </div>
            )}
          </div>
        </div>

        {/* Input Bar */}
        <footer className="w-full">
          <ChatInput
            query={query}
            setQuery={setQuery}
            onSend={() => sendMessage()}
            isStreaming={isStreaming}
          />
        </footer>
      </main>
    </div>
  );
};

export default ChatPage;
