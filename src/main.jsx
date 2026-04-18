import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

// Clear corrupt saved state where activeChatId is null
try {
  const saved = localStorage.getItem('college_advisor_chats');
  if (saved) {
    const parsed = JSON.parse(saved);
    if (!parsed.activeChatId) {
      localStorage.removeItem('college_advisor_chats');
    }
  }
} catch(e) {
  localStorage.removeItem('college_advisor_chats');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
