import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ChatContext = createContext(null);

const generateId = () => `chat_${Date.now()}_${Math.random().toString(36).slice(2)}`;

const createChat = () => ({
  id: generateId(),
  title: 'New Chat',
  messages: [],
  createdAt: Date.now(),
});

function chatReducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;

    case 'NEW_CHAT': {
      const newChat = createChat();
      return { chats: [newChat, ...state.chats], activeChatId: newChat.id };
    }

    case 'SET_ACTIVE_CHAT':
      return { ...state, activeChatId: action.payload };

    case 'DELETE_CHAT': {
      const remaining = state.chats.filter((c) => c.id !== action.payload);
      const newActiveId =
        state.activeChatId === action.payload
          ? remaining.length > 0 ? remaining[0].id : null
          : state.activeChatId;
      return { chats: remaining, activeChatId: newActiveId };
    }

    case 'ADD_MESSAGE':
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === state.activeChatId
            ? {
                ...chat,
                messages: [...chat.messages, action.payload],
                // Auto-title from the first user message
                title:
                  chat.messages.length === 0 && action.payload.role === 'user'
                    ? action.payload.text.slice(0, 40)
                    : chat.title,
              }
            : chat
        ),
      };

    case 'UPDATE_LAST_MESSAGE':
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

    default:
      return state;
  }
}

// ✅ FIX: Initialize with a default chat immediately (not in useEffect)
// so activeChatId is NEVER null on first render.
const defaultChat = createChat();
const initialState = {
  chats: [defaultChat],
  activeChatId: defaultChat.id,
};

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Load from localStorage on mount — override default if saved data exists
  useEffect(() => {
    try {
      const saved = localStorage.getItem('college_advisor_chats');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.chats && parsed.chats.length > 0 && parsed.activeChatId) {
          dispatch({ type: 'LOAD_STATE', payload: parsed });
        }
      }
    } catch (e) {
      console.warn('Failed to load chat history:', e);
    }
  }, []);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    if (state.chats.length > 0) {
      localStorage.setItem('college_advisor_chats', JSON.stringify(state));
    }
  }, [state]);

  const activeChat = state.chats.find((c) => c.id === state.activeChatId) || state.chats[0];

  return (
    <ChatContext.Provider value={{ state, dispatch, activeChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChatStore = () => useContext(ChatContext);
