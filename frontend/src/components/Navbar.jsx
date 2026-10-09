import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, HelpCircle, Trophy, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const [quizCode, setQuizCode] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleJoinQuiz = (e) => {
    e.preventDefault();
    if (quizCode.trim()) {
      const code = quizCode.trim().replace(/.*\/quiz\//, ''); // handle if pasted full link
      setShowModal(false);
      navigate(`/quiz/${code}`);
      setQuizCode('');
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0b0f19]/80 border-b border-white/5 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 p-0.5 shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#0b0f19] rounded-[14px] flex items-center justify-center">
                  <span className="text-lg font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">?</span>
                </div>
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-purple-300 transition-colors">
                  How Well Do You <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Know Me?</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Buddy Quiz
                </span>
              </div>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setShowModal(true)}
                className="text-xs sm:text-sm font-medium px-3.5 py-2 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-1.5"
              >
                <span>Enter Code</span>
              </button>

              <Link
                to="/create"
                className="relative group text-xs sm:text-sm font-semibold px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-md shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create Quiz</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Enter Code Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card max-w-md w-full p-6 sm:p-8 rounded-3xl relative border border-purple-500/20">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-400" />
              Enter Quiz Code
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Paste the 6-character quiz code or link your friend shared with you.
            </p>

            <form onSubmit={handleJoinQuiz} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={quizCode}
                  onChange={(e) => setQuizCode(e.target.value)}
                  placeholder="e.g. a8K29x"
                  required
                  autoFocus
                  className="w-full px-4 py-3.5 rounded-2xl glass-input text-white placeholder-slate-500 text-center font-mono text-lg tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-medium text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!quizCode.trim()}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>Start Quiz</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

