import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, GraduationCap, User, Sparkles } from 'lucide-react';

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
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex w-full mb-8 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex w-[92%] md:max-w-[75%] gap-3 md:gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${
          isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground border border-border'
        }`}>
          {isUser ? <User size={18} /> : <GraduationCap size={18} />}
        </div>

        {/* Bubble Container */}
        <div className="flex flex-col gap-2">
          <div className={`relative px-5 py-4 rounded-2xl shadow-sm ${
            isUser 
              ? 'bg-primary text-primary-foreground rounded-tr-none' 
              : 'bg-card border border-border rounded-tl-none'
          }`}>
            <div className={`prose ${isUser ? 'text-primary-foreground' : 'text-foreground'}`}>
              {isUser ? (
                <p className="whitespace-pre-wrap font-medium">{text}</p>
              ) : text === '' && isStreaming ? (
                <div className="flex items-center gap-1.5 py-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" />
                </div>
              ) : (
                <ReactMarkdown
                  components={{
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto my-4 rounded-xl border border-border">
                        <table className="min-w-full divide-y divide-border" {...props} />
                      </div>
                    ),
                    thead: ({ node, ...props }) => <thead className="bg-muted/50" {...props} />,
                    th: ({ node, ...props }) => <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider" {...props} />,
                    td: ({ node, ...props }) => <td className="px-4 py-2 text-sm border-t border-border" {...props} />,
                  }}
                >
                  {text}
                </ReactMarkdown>
              )}
              {isStreaming && text !== '' && (
                <span className="streaming-cursor" />
              )}
            </div>

            {/* AI Source Badge */}
            {!isUser && text && !isStreaming && (
              <div className="flex items-center gap-1.5 mt-2 ml-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                <Sparkles size={10} className="text-primary/60" />
                Verified Data
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {!isUser && text && !isStreaming && (
            <div className="flex items-center gap-2 mt-1">
              <button 
                onClick={handleCopy}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                title="Copy response"
              >
                {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
