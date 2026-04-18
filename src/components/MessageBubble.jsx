import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, GraduationCap, User } from 'lucide-react';

const MessageBubble = ({ role, text, isStreaming }) => {
  const [copied, setCopied] = useState(false);
  const isUser = role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className={`message-row ${isUser ? 'user-row' : 'assistant-row'}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {/* Avatar */}
      <div className={`avatar ${isUser ? 'user-avatar' : 'assistant-avatar'}`}>
        {isUser ? <User size={16} /> : <GraduationCap size={16} />}
      </div>

      {/* Bubble */}
      <div className={`bubble ${isUser ? 'user-bubble' : 'assistant-bubble'}`}>
        <div className="bubble-content">
          {isUser ? (
            <p>{text}</p>
          ) : text === '' && isStreaming ? (
            <div className="typing-indicator">
              <span /><span /><span />
            </div>
          ) : (
            <ReactMarkdown
              components={{
                table: ({ node, ...props }) => (
                  <div className="table-wrapper">
                    <table {...props} />
                  </div>
                ),
              }}
            >
              {text}
            </ReactMarkdown>
          )}
          {isStreaming && text !== '' && (
            <span className="streaming-cursor">▋</span>
          )}
        </div>

        {/* Copy Button (only for AI messages) */}
        {!isUser && text && !isStreaming && (
          <button className="copy-btn" onClick={handleCopy} title="Copy response">
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
