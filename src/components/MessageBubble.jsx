import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, GraduationCap, Sparkles } from 'lucide-react';

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex w-full mb-8 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex w-full gap-3 md:gap-4 ${isUser ? 'justify-end' : 'flex-row'}`}>
        
        {/* AI Avatar - Only show for AI */}
        {!isUser && (
          <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 mt-1 rounded-full border border-border/50 flex items-center justify-center bg-background shadow-sm text-foreground">
            <GraduationCap size={16} />
          </div>
        )}

        {/* Message Container */}
        <div className={`flex flex-col ${isUser ? 'max-w-[85%] md:max-w-[70%]' : 'flex-1 min-w-0 max-w-full'}`}>
          
          <div className={`
            relative text-[15px] md:text-base leading-relaxed break-words
            ${isUser 
              ? 'bg-[#2f2f2f] text-white px-5 py-3 rounded-[24px] shadow-sm' 
              : 'text-foreground bg-transparent py-1'}
          `}>
            <div className={`prose prose-sm md:prose-base max-w-none break-words overflow-wrap-anywhere ${isUser ? 'text-white' : 'text-foreground dark:prose-invert'}`}>
              {isUser ? (
                <p className="whitespace-pre-wrap font-medium m-0">{text}</p>
              ) : text === '' && isStreaming ? (
                <div className="flex items-center gap-1.5 py-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce" />
                </div>
              ) : (
                <ReactMarkdown
                  components={{
                    a: ({node, ...props}) => <a {...props} className="text-blue-500 hover:underline break-all" target="_blank" rel="noopener noreferrer" />,
                    p: ({node, ...props}) => <p {...props} className="mb-4 last:mb-0 break-words" />,
                    ul: ({node, ...props}) => <ul {...props} className="list-disc ml-6 mb-4" />,
                    ol: ({node, ...props}) => <ol {...props} className="list-decimal ml-6 mb-4" />,
                    li: ({node, ...props}) => <li {...props} className="mb-1" />,
                    strong: ({node, ...props}) => <strong {...props} className="font-semibold" />,
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto my-4 rounded-xl border border-border">
                        <table className="min-w-full divide-y divide-border" {...props} />
                      </div>
                    ),
                    thead: ({ node, ...props }) => <thead className="bg-muted/30" {...props} />,
                    th: ({ node, ...props }) => <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" {...props} />,
                    td: ({ node, ...props }) => <td className="px-4 py-3 text-sm border-t border-border" {...props} />,
                  }}
                >
                  {text}
                </ReactMarkdown>
              )}
              {isStreaming && text !== '' && (
                <span className="inline-block w-2 h-4 ml-1 bg-foreground animate-pulse align-middle" />
              )}
            </div>

            {/* AI Source Badge */}
            {!isUser && text && !isStreaming && (
              <div className="flex items-center gap-1.5 mt-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <Sparkles size={12} className="text-blue-500" />
                Verified Data
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {!isUser && text && !isStreaming && (
            <div className="flex items-center gap-2 mt-2">
              <button 
                onClick={handleCopy}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                title="Copy response"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
