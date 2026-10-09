import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 py-10 mt-20 backdrop-blur-sm bg-[#0b0f19]/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span>How Well Do You Know Me?</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-slate-400">
            Made with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> for friends
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-400">
          <Link to="/" className="hover:text-purple-400 transition-colors">Home</Link>
          <Link to="/create" className="hover:text-purple-400 transition-colors">Create Quiz</Link>
          <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
            FastAPI + React
          </span>
        </div>
      </div>
    </footer>
  );
}

