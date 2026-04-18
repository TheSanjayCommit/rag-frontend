import React, { useRef } from 'react';
import { Send } from 'lucide-react';

const InputBox = ({ query, setQuery, onSend, isStreaming }) => {
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    // Send on Enter, new line on Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming && query.trim()) {
        onSend();
      }
    }
  };

  const handleInput = (e) => {
    setQuery(e.target.value);
    // Auto-grow textarea
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 180) + 'px';
    }
  };

  return (
    <div className="input-box-container">
      <div className="input-wrapper">
        <textarea
          ref={textareaRef}
          className="chat-textarea"
          placeholder={isStreaming ? 'AI is thinking...' : 'Ask about colleges, fees, admissions...'}
          value={query}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={isStreaming}
          rows={1}
        />
        <button
          className="send-btn"
          onClick={onSend}
          disabled={isStreaming || !query.trim()}
          title="Send (Enter)"
        >
          <Send size={18} />
        </button>
      </div>
      <p className="input-hint">
        Press <kbd>Enter</kbd> to send · <kbd>Shift+Enter</kbd> for new line
      </p>
    </div>
  );
};

export default InputBox;
