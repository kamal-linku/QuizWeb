import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, HelpCircle, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import OptionCard from '../components/OptionCard';
import ProgressBar from '../components/ProgressBar';
import { quizApi } from '../services/api';

export default function TakeQuiz() {
  const { shareCode } = useParams();
  const navigate = useNavigate();

  // Quiz data & state
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Flow state: 'INTRO' | 'QUESTIONS' | 'SUBMITTING'
  const [quizState, setQuizState] = useState('INTRO');
  const [friendName, setFriendName] = useState('');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [question_id]: option_id }
  const [validationError, setValidationError] = useState('');

  // Fetch quiz from backend
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const data = await quizApi.getPublicQuiz(shareCode);
        setQuizData(data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.detail || 'Quiz not found or link is invalid.');
      } finally {
        setLoading(false);
      }
    };

    if (shareCode) {
      fetchQuiz();
    }
  }, [shareCode]);

  const handleStart = (e) => {
    e.preventDefault();
    if (!friendName.trim()) {
      setValidationError('Please enter your name to start the quiz.');
      return;
    }
    setValidationError('');
    setQuizState('QUESTIONS');
    setCurrentQIndex(0);
  };

  const currentQuestion = quizData?.questions?.[currentQIndex] || null;

  const handleSelectOption = (optionId) => {
    if (!currentQuestion) return;
    setValidationError('');
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (!selectedAnswers[currentQuestion.id]) {
      setValidationError('Please select an option before moving to the next question!');
      return;
    }
    setValidationError('');
    if (currentQIndex < quizData.questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAnswers[currentQuestion.id]) {
      setValidationError('Please select an answer for the final question!');
      return;
    }

    setQuizState('SUBMITTING');
    setValidationError('');

    try {
      const payload = {
        friend_name: friendName.trim(),
        answers: selectedAnswers,
      };

      const result = await quizApi.submitQuiz(shareCode, payload);
      
      // Navigate to Result page passing result data in session/state
      sessionStorage.setItem(`result_${shareCode}`, JSON.stringify(result));
      navigate(`/quiz/${shareCode}/result`, { state: { result } });
    } catch (err) {
      console.error(err);
      setValidationError(err.response?.data?.detail || 'Failed to submit quiz. Please try again.');
      setQuizState('QUESTIONS');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading Quiz...</p>
      </div>
    );
  }

  if (error || !quizData) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 text-center max-w-md mx-auto">
        <div className="glass-card p-8 rounded-3xl border border-rose-500/20 space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Quiz Not Found</h2>
          <p className="text-slate-400 text-sm">{error || 'This quiz link might have expired or does not exist.'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto flex flex-col justify-center">
      {/* INTRO SCREEN: ENTER FRIEND NAME */}
      {quizState === 'INTRO' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-lg mx-auto w-full glass-card p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-purple-500/30">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight uppercase tracking-tight">
              HOW WELL DO YOU KNOW <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {quizData.creator_name}?
              </span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Let's find out 👀 Answer {quizData.total_questions} questions about {quizData.creator_name} and get your friendship score!
            </p>
          </div>

          <form onSubmit={handleStart} className="space-y-6 pt-2">
            <div className="text-left space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">
                What's your name?
              </label>
              <input
                type="text"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                placeholder="e.g. Rahul / Priya"
                required
                maxLength={50}
                autoFocus
                className="w-full px-5 py-4 rounded-2xl glass-input text-white placeholder-slate-500 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>

            {validationError && (
              <p className="text-rose-400 text-xs flex items-center gap-1.5 justify-center">
                <AlertCircle className="w-4 h-4" />
                {validationError}
              </p>
            )}

            <button
              type="submit"
              disabled={!friendName.trim()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-base shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>START QUIZ</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </motion.div>
      )}

      {/* QUESTIONS SCREEN */}
      {(quizState === 'QUESTIONS' || quizState === 'SUBMITTING') && currentQuestion && (
        <div className="space-y-6 w-full">
          {/* Top Bar with Progress */}
          <div className="glass-card p-5 sm:p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                  Buddy Quiz for
                </span>
                <h3 className="text-lg font-bold text-white">
                  {quizData.creator_name}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-xs font-medium text-slate-400">
                  Player: <span className="text-white font-semibold">{friendName}</span>
                </span>
              </div>
            </div>

            <ProgressBar current={currentQIndex + 1} total={quizData.questions.length} />
          </div>

          {/* Question Card */}
          <motion.div
            key={currentQIndex}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl space-y-6 relative"
          >
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-pink-400">
                Question {currentQIndex + 1} of {quizData.questions.length}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                {currentQuestion.question_text}
              </h2>
            </div>

            {/* Options List */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentQuestion.id] === opt.id;

                return (
                  <OptionCard
                    key={opt.id}
                    index={idx}
                    text={opt.text}
                    isSelected={isSelected}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={quizState === 'SUBMITTING'}
                  />
                );
              })}
            </div>

            {validationError && (
              <p className="text-rose-400 text-xs font-medium flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                {validationError}
              </p>
            )}

            {/* Navigation Actions */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => {
                  setValidationError('');
                  setCurrentQIndex((prev) => Math.max(0, prev - 1));
                }}
                disabled={currentQIndex === 0 || quizState === 'SUBMITTING'}
                className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-medium text-sm transition-all flex items-center gap-2 disabled:opacity-30 disabled:pointer-events-none"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentQIndex < quizData.questions.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={quizState === 'SUBMITTING'}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 text-white font-semibold text-sm shadow-md shadow-purple-600/30 transition-all flex items-center gap-2"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={quizState === 'SUBMITTING'}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {quizState === 'SUBMITTING' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Calculating Score...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Submit Answers</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

