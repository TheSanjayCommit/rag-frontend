import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Sparkles, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  // Note: Using window.location if router isn't set up, 
  // but assuming a standard app structure where this might be the landing.
  const startChat = () => {
    // In this app, ChatPage is likely the main view.
    // We can just scroll or toggle a state if it's a SPA without routing.
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full"
      >
        <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-10 mx-auto">
          <GraduationCap size={56} />
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
          The Future of College Advisory.
        </h1>
        
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
          Get instant, verified insights on tuition, rankings, and placements for top institutions worldwide. Powered by advanced RAG technology.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-20">
          <button 
            className="w-full md:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Start Consulting
            <ArrowRight size={20} />
          </button>
          <button className="w-full md:w-auto px-8 py-4 bg-secondary text-secondary-foreground rounded-2xl font-bold text-lg hover:bg-secondary/80 transition-all">
            View Dataset
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { icon: <Zap className="text-amber-500" />, title: "Instant", desc: "Real-time responses with low latency." },
            { icon: <ShieldCheck className="text-emerald-500" />, title: "Verified", desc: "Data grounded in official datasets." },
            { icon: <Sparkles className="text-purple-500" />, title: "Personalized", desc: "Tailored to your rank and budget." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              className="p-6 rounded-3xl bg-card border border-border shadow-sm"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <footer className="mt-24 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">
        &copy; 2026 College AI Assistant • Powered by Groq & FAISS
      </footer>
    </div>
  );
};

export default Home;
