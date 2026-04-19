import React, { useState } from 'react';
import { Menu, GraduationCap, Share2, MoreHorizontal, Trash2, Download, Check } from 'lucide-react';
import { useChatStore } from '../context/useChatStore.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ onMenuClick, sidebarOpen }) => {
  const { activeChat, dispatch } = useChatStore();
  const [showMore, setShowMore] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'College AI Consultation',
          text: `Check out my chat with the College Advisor AI about ${activeChat?.title || 'college choices'}!`,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClearChat = () => {
    if (activeChat) {
      dispatch({ type: 'DELETE_CHAT', payload: activeChat.id });
      dispatch({ type: 'NEW_CHAT' });
    }
    setShowMore(false);
  };

  const handleDownload = () => {
    if (!activeChat) return;
    const text = activeChat.messages
      .map(m => `${m.role.toUpperCase()}: ${m.text}`)
      .join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Consultation-${activeChat.title || 'Export'}.txt`;
    a.click();
    setShowMore(false);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl hover:bg-secondary text-foreground md:hidden transition-colors"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <div className="hidden md:flex w-8 h-8 rounded-lg bg-primary items-center justify-center text-primary-foreground shadow-sm">
                <GraduationCap size={18} />
              </div>
            )}
            <div className="flex flex-col">
              <h2 className="text-sm font-bold truncate max-w-[150px] md:max-w-[400px]">
                {activeChat?.title && activeChat.title !== 'New Consultation'
                  ? activeChat.title
                  : 'College Advisor AI'}
              </h2>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Online</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 relative">
          <button 
            onClick={handleShare}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-all active:scale-95" 
            title="Share Chat"
          >
            {copied ? <Check size={18} className="text-emerald-500" /> : <Share2 size={18} />}
          </button>
          
          <button 
            onClick={() => setShowMore(!showMore)}
            className={`p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-all ${showMore ? 'bg-secondary' : ''}`}
          >
            <MoreHorizontal size={18} />
          </button>

          {/* More Dropdown */}
          <AnimatePresence>
            {showMore && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMore(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  <button 
                    onClick={handleDownload}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-muted transition-colors text-foreground"
                  >
                    <Download size={16} />
                    Export Chat
                  </button>
                  <div className="h-px bg-border" />
                  <button 
                    onClick={handleClearChat}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-destructive/10 text-destructive transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete History
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
