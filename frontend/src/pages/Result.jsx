import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy,
  Share2,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Copy,
  Check,
  PlusCircle,
  BarChart3,
  Loader2
} from 'lucide-react';
import ConfettiEffect from '../components/ConfettiEffect';
import LeaderboardTable from '../components/LeaderboardTable';
import { getScoreFeedback } from '../data/defaultTemplates';
import { quizApi } from '../services/api';

export default function Result() {
  const { shareCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Result state
  const [result, setResult] = useState(location.state?.result || null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(!result);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // If page was refreshed, retrieve from sessionStorage or fetch leaderboard
  useEffect(() => {
    const loadResultAndLeaderboard = async () => {
      try {
        let currentResult = result;
        if (!currentResult) {
          const cached = sessionStorage.getItem(`result_${shareCode}`);
          if (cached) {
            currentResult = JSON.parse(cached);
            setResult(currentResult);
          }
        }

        const lb = await quizApi.getLeaderboard(shareCode);
        setLeaderboard(lb);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadResultAndLeaderboard();
  }, [shareCode, result]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading Result...</p>
      </div>
    );
  }

  // Fallback if no result exists (e.g. visited URL directly without taking)
  if (!result) {
    return (
      <div className="min-h-[calc(100vh-80px)] py-12 px-4 max-w-lg mx-auto text-center space-y-6 flex flex-col justify-center">
        <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-4">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Quiz Results</h2>
          <p className="text-slate-400 text-sm">Take this quiz first to see how well you know the creator!</p>
          <Link
            to={`/quiz/${shareCode}`}
            className="inline-block px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-purple-600/30"
          >
            Take Quiz Now
          </Link>
        </div>
        {leaderboard.length > 0 && (
          <LeaderboardTable leaderboard={leaderboard} />
        )}
      </div>
    );
  }

  const {
    friend_name,
    creator_name,
    score,
    total_questions,
    percentage,
    feedback_message,
    breakdown,
  } = result;

  const feedbackData = getScoreFeedback(score, total_questions, creator_name);
  const quizUrl = `${window.location.origin}/quiz/${shareCode}`;
  const shareText = `I scored ${score}/${total_questions} (${percentage}%) on "How Well Do You Know ${creator_name}?" 🏆\n\nThink you can beat me? Take the quiz here:\n👉 ${quizUrl}`;

  const handleWhatsAppShare = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleCopyResult = () => {
    navigator.clipboard.writeText(shareText);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const isCelebrationScore = score >= 6;

  return (
    <div className="min-h-[calc(100vh-80px)] py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      {/* Confetti blast for good scores */}
      <ConfettiEffect trigger={isCelebrationScore} duration={4000} />

      {/* Main Result Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-6 sm:p-10 rounded-3xl border border-purple-500/30 shadow-2xl text-center space-y-8 relative overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-purple-600/20 blur-3xl pointer-events-none" />

        {/* Header Title */}
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
            🎉 QUIZ COMPLETE!
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            {creator_name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Tested by <span className="text-purple-300 font-semibold">{friend_name}</span>
          </p>
        </div>

        {/* Circular / Large Score Badge */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-2 bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-400 shadow-2xl shadow-purple-600/30 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#0b0f19] flex flex-col items-center justify-center p-4">
              <span className="text-3xl sm:text-4xl font-black text-white leading-none">
                {score} <span className="text-lg text-slate-500 font-normal">/ {total_questions}</span>
              </span>
              <span className="text-sm sm:text-base font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mt-1">
                {percentage}% Score
              </span>
            </div>
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
            {feedbackData.badge}
          </div>
        </div>

        {/* Humorous Message */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/5 max-w-lg mx-auto">
          <p className="text-lg sm:text-xl font-bold text-white leading-relaxed">
            "{feedback_message || feedbackData.text}"
          </p>
        </div>

        {/* Share & Challenge Friends CTA */}
        <div className="space-y-3 max-w-md mx-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Think your friends can beat your score?
          </p>

          <button
            onClick={handleWhatsAppShare}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-xl shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>SHARE RESULT ON WHATSAPP</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleCopyResult}
              className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-medium text-xs sm:text-sm border border-white/10 transition-all flex items-center justify-center gap-2"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedShare ? 'Copied to Clipboard!' : 'Copy Result Text'}</span>
            </button>

            <Link
              to="/create"
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-purple-600/25 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create My Own Quiz</span>
            </Link>
          </div>
        </div>

        {/* Toggle Detailed Breakdown */}
        {breakdown && breakdown.length > 0 && (
          <div className="pt-4 border-t border-white/5 text-left">
            <button
              type="button"
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="w-full py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <span>View Question-by-Question Answers</span>
              </span>
              {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showBreakdown && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 space-y-3"
              >
                {breakdown.map((item, idx) => (
                  <div
                    key={item.question_id || idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      item.is_correct
                        ? 'bg-emerald-950/20 border-emerald-500/30'
                        : 'bg-rose-950/20 border-rose-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">
                        Q{item.question_number}
                      </span>
                      {item.is_correct ? (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                        </span>
                      ) : (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Incorrect
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-semibold text-white mb-2.5">
                      {item.question_text}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-slate-400 block mb-0.5">You answered:</span>
                        <span className={item.is_correct ? 'text-emerald-300 font-semibold' : 'text-rose-300 font-semibold'}>
                          {item.user_option_text}
                        </span>
                      </div>

                      {!item.is_correct && (
                        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
                          <span className="text-emerald-400 block mb-0.5">Correct answer:</span>
                          <span className="text-emerald-200 font-semibold">
                            {item.correct_option_text}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        )}
      </motion.div>

      {/* Live Leaderboard for this Quiz */}
      <LeaderboardTable
        leaderboard={leaderboard.length > 0 ? leaderboard : result.leaderboard || []}
        creatorName={creator_name}
        highlightName={friend_name}
      />
    </div>
  );
}

