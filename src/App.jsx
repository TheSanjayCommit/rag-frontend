import React from 'react';
import { ChatProvider } from './context/useChatStore.jsx';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <ChatProvider>
      <ChatPage />
    </ChatProvider>
  );
}

export default App;
