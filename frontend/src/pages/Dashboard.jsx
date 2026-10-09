import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Users,
  Target,
  Trophy,
  Sparkles,
  Copy,
  Check,
  MessageCircle,
  Share2,
  ExternalLink,
  Loader2,
  AlertCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import LeaderboardTable from '../components/LeaderboardTable';
import { quizApi } from '../services/api';

export default function Dashboard() {
  const { shareCode } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await quizApi.getDashboard(shareCode, token);
        setDashboardData(data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.detail || 'Failed to load creator dashboard. Please verify your creator token.');
      } finally {
        setLoading(false);
      }
    };

    if (shareCode && token) {
      fetchDashboard();
    } else if (!token) {
      setError('Creator access token missing. Please use your creator dashboard link.');
      setLoading(false);
    }
  }, [shareCode, token]);

  const quizUrl = `${window.location.origin}/quiz/${shareCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(quizUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `🎉 Take my "How Well Do You Know Me?" quiz and challenge my friends on the leaderboard!\n👉 ${quizUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading Dashboard Analytics...</p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-[calc(100vh-80px)] py-12 px-4 max-w-md mx-auto flex flex-col justify-center text-center">
        <div className="glass-card p-8 rounded-3xl border border-rose-500/20 space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Access Denied</h2>
          <p className="text-slate-400 text-sm">{error || 'Unable to open creator dashboard.'}</p>
          <Link
            to={`/quiz/${shareCode}`}
            className="inline-block px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-colors"
          >
            View Public Quiz
          </Link>
        </div>
      </div>
    );
  }

  const {
    creator_name,
    title,
    total_attempts,
    average_score,
    highest_score,
    perfect_score_count,
    leaderboard,
    question_stats,
  } = dashboardData;

  return (
    <div className="min-h-[calc(100vh-80px)] py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
            CREATOR DASHBOARD
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time analytics and results for <span className="text-white font-medium">{creator_name}</span>
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCopyLink}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-md shadow-purple-600/30"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? 'Link Copied' : 'Copy Quiz Link'}</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Share</span>
          </button>

          <Link
            to={`/quiz/${shareCode}`}
            target="_blank"
            className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-medium text-xs sm:text-sm border border-white/10 transition-all flex items-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Preview</span>
          </Link>
        </div>
      </div>

      {/* Analytics KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Attempts */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="glass-card p-5 rounded-3xl border border-white/5 space-y-2"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-white">{total_attempts}</span>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Attempts</p>
          </div>
        </motion.div>

        {/* Average Score */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="glass-card p-5 rounded-3xl border border-white/5 space-y-2"
        >
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-white">
              {average_score} <span className="text-xs text-slate-500 font-normal">/ 10</span>
            </span>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Score</p>
          </div>
        </motion.div>

        {/* Highest Score */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="glass-card p-5 rounded-3xl border border-white/5 space-y-2"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-white">
              {highest_score} <span className="text-xs text-slate-500 font-normal">/ 10</span>
            </span>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Highest Score</p>
          </div>
        </motion.div>

        {/* Perfect Matches */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="glass-card p-5 rounded-3xl border border-white/5 space-y-2"
        >
          <div className="w-10 h-10 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-white">{perfect_score_count}</span>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">10/10 Twins 👯</p>
          </div>
        </motion.div>
      </div>

      {/* Main Content: Leaderboard & Question Accuracy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leaderboard Table (2 Cols) */}
        <div className="lg:col-span-2">
          <LeaderboardTable leaderboard={leaderboard} creatorName={creator_name} />
        </div>

        {/* Question Analytics / Accuracy Breakdown (1 Col) */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-5 h-fit">
          <div className="flex items-center gap-2.5">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">Question Accuracy</h3>
          </div>
          <p className="text-xs text-slate-400">
            See which questions friends found easiest or toughest to guess:
          </p>

          <div className="space-y-3">
            {question_stats.map((stat) => (
              <div key={stat.question_number} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">
                    Q{stat.question_number}
                  </span>
                  <span className="font-bold text-purple-300">
                    {stat.accuracy_percentage}% correct
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      stat.accuracy_percentage >= 70
                        ? 'bg-emerald-500'
                        : stat.accuracy_percentage >= 40
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${stat.accuracy_percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

