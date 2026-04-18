import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ChatContext = createContext(null);

const generateId = () => `chat_${Date.now()}`;

const createChat = () => ({
  id: generateId(),
  title: 'New Chat',
  messages: [],
  createdAt: Date.now(),
});

const initialState = {
  chats: [],
  activeChatId: null,
};

function chatReducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;

    case 'NEW_CHAT': {
      const newChat = createChat();
      return {
        chats: [newChat, ...state.chats],
        activeChatId: newChat.id,
      };
    }

    case 'SET_ACTIVE_CHAT':
      return { ...state, activeChatId: action.payload };

    case 'DELETE_CHAT': {
      const remaining = state.chats.filter((c) => c.id !== action.payload);
      return {
        chats: remaining,
        activeChatId: remaining.length > 0 ? remaining[0].id : null,
      };
    }

    case 'ADD_MESSAGE': {
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === state.activeChatId
            ? {
                ...chat,
                messages: [...chat.messages, action.payload],
                // Auto-title from first user message
                title:
                  chat.messages.length === 0 && action.payload.role === 'user'
                    ? action.payload.text.slice(0, 40)
                    : chat.title,
              }
            : chat
        ),
      };
    }

    case 'UPDATE_LAST_MESSAGE': {
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === state.activeChatId
            ? {
                ...chat,
                messages: chat.messages.map((msg, i) =>
                  i === chat.messages.length - 1
                    ? { ...msg, text: action.payload }
                    : msg
                ),
              }
            : chat
        ),
      };
    }

    default:
      return state;
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('college_advisor_chats');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.chats && parsed.chats.length > 0) {
          dispatch({ type: 'LOAD_STATE', payload: parsed });
          return;
        }
      }
    } catch (e) {}
    // No saved state, create first chat
    dispatch({ type: 'NEW_CHAT' });
  }, []);

  // Persist to localStorage on every state change
  useEffect(() => {
    if (state.chats.length > 0) {
      localStorage.setItem('college_advisor_chats', JSON.stringify(state));
    }
  }, [state]);

  const activeChat = state.chats.find((c) => c.id === state.activeChatId);

  return (
    <ChatContext.Provider value={{ state, dispatch, activeChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChatStore = () => useContext(ChatContext);
