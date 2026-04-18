import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';
import { API_BASE_URL } from '../services/api.js';


const ChatBox = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am your production-ready College Advisor. How can I help you today?' },
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query.trim() || isStreaming) return;

    const currentQuery = query;
    setQuery('');
    
    // Append user message and placeholder for AI
    setMessages((prev) => [...prev, { role: 'user', text: currentQuery }, { role: 'assistant', text: '' }]);
    setIsStreaming(true);

    try {
      // Build history pairs (User, Assistant)
      const history = [];
      for (let i = 1; i < messages.length - 1; i += 2) {
        if (messages[i] && messages[i+1]) {
          history.push({ user: messages[i].text, assistant: messages[i+1].text });
        }
      }

      const response = await fetch(`${API_BASE_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: currentQuery, history: history.slice(-5) }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let currentText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        // SAFE DECODING: Handles split characters
        const chunk = decoder.decode(value, { stream: true });
        currentText += chunk;

        // Update active bot bubble
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'assistant', text: currentText };
          return newMessages;
        });
      }
    } catch (err) {
      console.error('Streaming failure:', err);
      setMessages((prev) => [
        ...prev, 
        { role: 'assistant', text: 'Service Unavailable: Unable to generate response. Please check your API keys.' }
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-list">
        {messages.map((msg, index) => (
          <Message 
            key={index} 
            role={msg.role} 
            text={msg.text} 
            isStreaming={isStreaming && index === messages.length - 1}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input-container" onSubmit={handleSend}>
        <input
          type="text"
          placeholder={isStreaming ? "AI is processing..." : "Ask about fees, ratings, or news..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isStreaming}
        />
        <button type="submit" disabled={isStreaming || !query.trim()}>
          {isStreaming ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
