import React from 'react';
import ReactMarkdown from 'react-markdown';

/**
 * Message component with Markdown support and streaming cursor.
 */
const Message = ({ role, text, isStreaming }) => {
  return (
    <div className={`message-wrapper ${role}`}>
      <div className={`message-bubble ${role}`}>
        <div className="text-content">
          <ReactMarkdown>{text}</ReactMarkdown>
          {isStreaming && <span className="streaming-cursor">|</span>}
        </div>
      </div>
    </div>
  );
};

export default Message;
