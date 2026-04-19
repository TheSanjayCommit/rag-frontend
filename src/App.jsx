import React from 'react';
import { ChatProvider } from './context/useChatStore.jsx';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <ChatProvider>
        <ChatPage />
      </ChatProvider>
    </div>
  );
}

export default App;
