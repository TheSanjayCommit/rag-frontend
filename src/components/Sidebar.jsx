import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Plus, Trash2, GraduationCap, Github } from 'lucide-react';
import { useChatStore } from '../context/useChatStore.jsx';

const Sidebar = ({ isOpen, onClose }) => {
  const { state, dispatch, activeChat } = useChatStore();

  const handleNewChat = () => {
    dispatch({ type: 'NEW_CHAT' });
    if (window.innerWidth < 768) onClose();
  };

  const handleSetActive = (id) => {
    dispatch({ type: 'SET_ACTIVE_CHAT', payload: id });
    if (window.innerWidth < 768) onClose();
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    dispatch({ type: 'DELETE_CHAT', payload: id });
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          x: isOpen ? 0 : -280,
          width: isOpen ? 280 : 0 
        }}
        className="fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r border-border md:relative overflow-hidden"
      >
        <div className="flex flex-col h-full w-[280px]">
          {/* Brand */}
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">College AI</h1>
              <p className="text-xs text-muted-foreground font-medium">Professional Advisor</p>
            </div>
          </div>

          {/* New Chat Button */}
          <div className="px-4 mb-6">
            <button 
              onClick={handleNewChat}
              className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
            >
              <Plus size={18} />
              New Consultation
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto px-3 space-y-1">
            <div className="px-3 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Recent History</span>
            </div>
            <AnimatePresence mode="popLayout">
              {state.chats.map((chat) => (
                <motion.div
                  key={chat.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={() => handleSetActive(chat.id)}
                  className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    chat.id === state.activeChatId 
                      ? 'bg-secondary text-secondary-foreground shadow-sm' 
                      : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <MessageSquare size={16} className={chat.id === state.activeChatId ? 'text-primary' : 'text-muted-foreground/50'} />
                  <span className="flex-1 text-sm font-medium truncate pr-6">
                    {chat.title || 'New Consultation'}
                  </span>
                  
                  {state.chats.length > 1 && (
                    <button
                      onClick={(e) => handleDelete(e, chat.id)}
                      className="absolute right-3 opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-destructive/10 hover:text-destructive transition-all"
                      title="Delete chat"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-4 mt-auto border-t border-border/50 bg-muted/20">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                System Live
              </div>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="View Source"
              >
                <Github size={14} />
              </a>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
