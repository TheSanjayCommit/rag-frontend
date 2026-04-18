import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Plus, Trash2, GraduationCap } from 'lucide-react';
import { useChatStore } from '../context/useChatStore.jsx';

const Sidebar = ({ isOpen }) => {
  const { state, dispatch, activeChat } = useChatStore();

  const handleNewChat = () => dispatch({ type: 'NEW_CHAT' });
  const handleSetActive = (id) => dispatch({ type: 'SET_ACTIVE_CHAT', payload: id });
  const handleDelete = (e, id) => {
    e.stopPropagation();
    dispatch({ type: 'DELETE_CHAT', payload: id });
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 280 : 0, opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="sidebar"
    >
      <div className="sidebar-inner">
        {/* Brand */}
        <div className="sidebar-brand">
          <GraduationCap size={24} className="brand-icon" />
          <span className="brand-title">College Advisor</span>
        </div>

        {/* New Chat Button */}
        <button className="new-chat-btn" onClick={handleNewChat}>
          <Plus size={16} />
          New Chat
        </button>

        {/* Chat History */}
        <div className="chat-history-label">Recent Chats</div>
        <div className="chat-list">
          <AnimatePresence>
            {state.chats.map((chat) => (
              <motion.div
                key={chat.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className={`chat-item ${chat.id === state.activeChatId ? 'active' : ''}`}
                onClick={() => handleSetActive(chat.id)}
              >
                <MessageSquare size={14} className="chat-item-icon" />
                <span className="chat-item-title">{chat.title || 'New Chat'}</span>
                <button
                  className="delete-chat-btn"
                  onClick={(e) => handleDelete(e, chat.id)}
                  title="Delete chat"
                >
                  <Trash2 size={13} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <span>Powered by Groq & FAISS</span>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
