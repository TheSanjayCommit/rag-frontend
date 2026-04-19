import React, { useRef, useEffect } from 'react';
import { SendHorizontal, Paperclip, Mic, Globe } from 'lucide-react';

const ChatInput = ({ query, setQuery, onSend, isStreaming }) => {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [query]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (query.trim() && !isStreaming) {
      onSend();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-6 pt-2 bg-gradient-to-t from-background via-background to-transparent">
      <form 
        onSubmit={handleSubmit}
        className="relative group bg-card border border-border rounded-3xl shadow-xl shadow-primary/5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40 transition-all duration-300"
      >
        <div className="flex flex-col p-2">
          <textarea
            ref={textareaRef}
            rows="1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about colleges, fees, or rankings..."
            className="w-full bg-transparent border-none focus:ring-0 text-foreground placeholder:text-muted-foreground/50 resize-none py-3 px-4 max-h-[200px] text-sm md:text-base"
          />
          
          <div className="flex items-center justify-between px-2 pb-1 pt-2">
            <div className="flex items-center gap-1">
              <button 
                type="button"
                className="p-2 rounded-xl hover:bg-muted text-muted-foreground/70 hover:text-foreground transition-all"
                title="Attach Files"
              >
                <Paperclip size={18} />
              </button>
              <button 
                type="button"
                className="p-2 rounded-xl hover:bg-muted text-muted-foreground/70 hover:text-foreground transition-all"
                title="Voice Search"
              >
                <Mic size={18} />
              </button>
              <div className="w-px h-4 bg-border mx-1" />
              <button 
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-primary/10 text-primary font-bold text-[10px] tracking-widest uppercase transition-all"
              >
                <Globe size={14} />
                Search Web
              </button>
            </div>

            <button
              type="submit"
              disabled={!query.trim() || isStreaming}
              className={`p-2.5 rounded-2xl transition-all shadow-lg ${
                !query.trim() || isStreaming
                  ? 'bg-muted text-muted-foreground/50 cursor-not-allowed'
                  : 'bg-primary text-primary-foreground shadow-primary/20 hover:scale-105 active:scale-95'
              }`}
            >
              {isStreaming ? (
                <div className="flex gap-1">
                  <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1 h-1 rounded-full bg-current animate-bounce" />
                </div>
              ) : (
                <SendHorizontal size={18} />
              )}
            </button>
          </div>
        </div>
      </form>
      <p className="text-center text-[10px] text-muted-foreground/50 mt-3 font-medium">
        AI may occasionally provide inaccurate information. Verify important data.
      </p>
    </div>
  );
};

export default ChatInput;
