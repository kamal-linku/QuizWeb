import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Trophy, Users, ArrowRight, ShieldCheck, Share2, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [quickCode, setQuickCode] = useState('');
  const navigate = useNavigate();

  const handleJoin = (e) => {
    e.preventDefault();
    if (quickCode.trim()) {
      const code = quickCode.trim().replace(/.*\/quiz\//, '');
      navigate(`/quiz/${code}`);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute top-1/3 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl w-full text-center space-y-8 sm:space-y-10">
        {/* Floating pill badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs sm:text-sm font-semibold shadow-inner"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>The Ultimate Friendship Challenge</span>
        </motion.div>

        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-4"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
            HOW WELL <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
              DO THEY KNOW
            </span>{' '}
            <br className="hidden sm:inline" />
            YOU?
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal">
            Create a personalized 10-question quiz about yourself, share your unique link, and find out who your true best friends are!
          </p>
        </motion.div>

        {/* Primary Call To Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
        >
          <Link
            to="/create"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-base sm:text-lg shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
          >
            <Sparkles className="w-5 h-5 text-purple-200 group-hover:rotate-12 transition-transform" />
            <span>CREATE MY QUIZ</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Quick Join Quiz Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-md mx-auto glass-card p-4 sm:p-5 rounded-3xl border border-white/10"
        >
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3 flex items-center justify-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            Have a friend's quiz code?
          </p>
          <form onSubmit={handleJoin} className="flex gap-2">
            <input
              type="text"
              value={quickCode}
              onChange={(e) => setQuickCode(e.target.value)}
              placeholder="Paste code or link (e.g. a8K29x)"
              className="flex-1 px-4 py-3 rounded-xl glass-input text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={!quickCode.trim()}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors disabled:opacity-40"
            >
              Take Quiz
            </button>
          </form>
        </motion.div>

        {/* Feature Highlights Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-8 max-w-4xl mx-auto text-left"
        >
          <div className="glass-card p-6 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">10 Fun Questions</h3>
            <p className="text-sm text-slate-400">
              Pick from our fun default buddy questions or customize them to test your friends.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-pink-500/30 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Instant Sharing</h3>
            <p className="text-sm text-slate-400">
              Share to WhatsApp and group chats with one tap. Let friends challenge your score!
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Live Leaderboard</h3>
            <p className="text-sm text-slate-400">
              Watch your friends compete in real-time on your private analytics dashboard.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

