import React from 'react';
import ChatBox from '../components/ChatBox';

const Home = () => {
  return (
    <div className="home-container">
      <header className="app-header">
        <h1>College Advisor AI</h1>
        <p>Expert insights on Indian & US Engineering Colleges</p>
      </header>
      <main className="main-content">
        <ChatBox />
      </main>
      <footer className="app-footer">
        <p>&copy; 2026 College RAG Assistant. Powered by Groq & FAISS.</p>
      </footer>
    </div>
  );
};

export default Home;
