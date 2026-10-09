import React, { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Copy, Check, Share2, ExternalLink, BarChart3, MessageCircle, Play } from 'lucide-react';
import ConfettiEffect from '../components/ConfettiEffect';

export default function QuizReady() {
  const { shareCode } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const quizUrl = `${window.location.origin}/quiz/${shareCode}`;
  const dashboardUrl = `/dashboard/${shareCode}?token=${token}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(quizUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(shareCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `🎉 Hey! How well do you REALLY know me? 🤔\n\nTake my 10-question buddy quiz and see your score:\n👉 ${quizUrl}\n\nLet's see who gets 10/10! 🔥`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto flex flex-col justify-center text-center">
      <ConfettiEffect trigger={true} duration={3500} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-8 sm:p-10 rounded-3xl border border-purple-500/30 shadow-2xl space-y-8 relative overflow-hidden"
      >
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Celebration Header */}
        <div className="space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-purple-500/30">
            <Sparkles className="w-8 h-8 animate-bounce" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            YOUR QUIZ IS READY! 🎉
          </h1>
          <p className="text-slate-400 text-base">
            Your friends are ready to be tested. Share your link and let the competition begin!
          </p>
        </div>

        {/* Shareable Link Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Your Unique Quiz Link
            </span>
            <button
              onClick={handleCopyCode}
              className="text-xs text-purple-400 hover:text-purple-300 font-mono flex items-center gap-1"
            >
              Code: <span className="font-bold underline">{shareCode}</span>
              {copiedCode && <Check className="w-3 h-3 text-emerald-400" />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={quizUrl}
              className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 text-purple-300 text-xs sm:text-sm font-mono truncate focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-md shadow-purple-600/30 shrink-0"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Share Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleWhatsAppShare}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>SHARE ON WHATSAPP</span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link
              to={dashboardUrl}
              className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-white/10 transition-all flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>View My Dashboard</span>
            </Link>

            <Link
              to={`/quiz/${shareCode}`}
              className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-white/10 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-pink-400" />
              <span>Test Take Quiz</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

