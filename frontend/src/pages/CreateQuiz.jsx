import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, Check, Edit3, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';
import OptionCard from '../components/OptionCard';
import ProgressBar from '../components/ProgressBar';
import { getDefaultQuestions, alternateQuestionsLibrary } from '../data/defaultTemplates';
import { quizApi } from '../services/api';

export default function CreateQuiz() {
  const navigate = useNavigate();

  // Creator state
  const [step, setStep] = useState('NAME'); // 'NAME' | 'QUESTIONS'
  const [creatorName, setCreatorName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // Edit question modal / mode
  const [isEditingCustom, setIsEditingCustom] = useState(false);
  const [editQuestionText, setEditQuestionText] = useState('');
  const [editOptions, setEditOptions] = useState(['', '', '', '']);

  // Loading & error
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // When creator name changes, initialize default template questions
  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (!creatorName.trim()) {
      setErrorMsg('Please enter your name to continue.');
      return;
    }
    setErrorMsg('');
    const defaultList = getDefaultQuestions(creatorName.trim());
    setQuestions(defaultList);
    setStep('QUESTIONS');
    setCurrentQIndex(0);
  };

  const currentQ = questions[currentQIndex] || null;

  // Set the creator's true answer for the current question
  const handleSelectCorrectOption = (optionIndex) => {
    const updated = [...questions];
    updated[currentQIndex] = {
      ...updated[currentQIndex],
      correct_option_index: optionIndex,
    };
    setQuestions(updated);
  };

  // Switch to custom edit mode for current question
  const openEditModal = () => {
    if (!currentQ) return;
    setEditQuestionText(currentQ.question_text);
    setEditOptions([...currentQ.options]);
    setIsEditingCustom(true);
  };

  const saveCustomEdit = () => {
    if (!editQuestionText.trim()) return;
    if (editOptions.some((opt) => !opt.trim())) {
      alert('Please fill in all 4 options!');
      return;
    }
    const updated = [...questions];
    updated[currentQIndex] = {
      ...updated[currentQIndex],
      question_text: editQuestionText.trim(),
      options: editOptions.map((o) => o.trim()),
    };
    setQuestions(updated);
    setIsEditingCustom(false);
  };

  // Submit quiz to backend
  const handleFinishQuiz = async () => {
    // Validate that all questions have a valid correct_option_index
    const unselectedIdx = questions.findIndex(
      (q) => q.correct_option_index === undefined || q.correct_option_index === null
    );
    if (unselectedIdx !== -1) {
      setCurrentQIndex(unselectedIdx);
      setErrorMsg(`Please pick your answer for Question ${unselectedIdx + 1}!`);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        creator_name: creatorName.trim(),
        title: `How Well Do You Know ${creatorName.trim()}?`,
        questions: questions.map((q, idx) => ({
          question_text: q.question_text,
          question_number: idx + 1,
          options: q.options,
          correct_option_index: q.correct_option_index,
        })),
      };

      const result = await quizApi.createQuiz(payload);
      
      // Save creator token to localStorage for easy dashboard access
      const userQuizzes = JSON.parse(localStorage.getItem('my_quizzes') || '[]');
      userQuizzes.push({
        share_code: result.share_code,
        creator_token: result.creator_token,
        title: result.title,
        created_at: new Date().toISOString(),
      });
      localStorage.setItem('my_quizzes', JSON.stringify(userQuizzes));

      // Navigate to Quiz Ready screen
      navigate(`/ready/${result.share_code}?token=${result.creator_token}`);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.detail || 'Failed to create quiz. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col justify-center">
      {/* STEP 1: ENTER NAME */}
      {step === 'NAME' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-lg mx-auto w-full glass-card p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Let's get started 👋
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mb-8">
            What is your name? Your friends will see this on the quiz.
          </p>

          <form onSubmit={handleNameSubmit} className="space-y-6">
            <div className="text-left space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">
                Your Name
              </label>
              <input
                type="text"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="e.g. Kamal"
                required
                maxLength={50}
                autoFocus
                className="w-full px-5 py-4 rounded-2xl glass-input text-white placeholder-slate-500 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>

            {errorMsg && (
              <p className="text-rose-400 text-xs flex items-center gap-1.5 justify-center">
                <AlertCircle className="w-4 h-4" />
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={!creatorName.trim()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-base shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>CONTINUE</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </motion.div>
      )}

      {/* STEP 2: QUESTIONS CREATION STUDIO */}
      {step === 'QUESTIONS' && currentQ && (
        <div className="space-y-6 max-w-3xl mx-auto w-full">
          {/* Top Bar with Creator Name & Progress */}
          <div className="glass-card p-5 sm:p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                  Creating Quiz for
                </span>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{creatorName}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-medium">
                    10 Questions
                  </span>
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setStep('NAME')}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
              >
                Edit Name
              </button>
            </div>

            <ProgressBar current={currentQIndex + 1} total={questions.length} />
          </div>

          {/* Question Card */}
          <motion.div
            key={currentQIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl space-y-6 relative"
          >
            {/* Question Title & Actions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-pink-400">
                  Question {currentQIndex + 1}
                </span>

                <button
                  type="button"
                  onClick={openEditModal}
                  className="text-xs font-medium text-purple-300 hover:text-purple-200 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Customize Question</span>
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                {currentQ.question_text}
              </h2>

              <p className="text-xs sm:text-sm text-purple-300/80 font-medium flex items-center gap-1.5 pt-1">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                Select your true answer below (Friends will have to guess this):
              </p>
            </div>

            {/* Options List */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {currentQ.options.map((optionText, optIdx) => {
                const isSelected = currentQ.correct_option_index === optIdx;

                return (
                  <OptionCard
                    key={optIdx}
                    index={optIdx}
                    text={optionText}
                    isSelected={isSelected}
                    onClick={() => handleSelectCorrectOption(optIdx)}
                  />
                );
              })}
            </div>

            {errorMsg && (
              <p className="text-rose-400 text-xs font-medium flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                {errorMsg}
              </p>
            )}

            {/* Question Navigation Buttons */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setCurrentQIndex((prev) => Math.max(0, prev - 1));
                }}
                disabled={currentQIndex === 0}
                className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-medium text-sm transition-all flex items-center gap-2 disabled:opacity-30 disabled:pointer-events-none"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentQIndex < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (currentQ.correct_option_index === undefined || currentQ.correct_option_index === null) {
                      setErrorMsg('Please select your answer for this question first!');
                      return;
                    }
                    setErrorMsg('');
                    setCurrentQIndex((prev) => prev + 1);
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 text-white font-semibold text-sm shadow-md shadow-purple-600/30 transition-all flex items-center gap-2"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinishQuiz}
                  disabled={isSubmitting}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? 'Creating Quiz...' : 'Save & Generate Link'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Quick Jump Question Matrix */}
          <div className="glass-card p-4 rounded-2xl border border-white/5 flex items-center justify-between overflow-x-auto gap-2">
            <span className="text-xs font-semibold text-slate-400 shrink-0">Questions:</span>
            <div className="flex items-center gap-1.5 sm:gap-2">
              {questions.map((q, idx) => {
                const isSelected = q.correct_option_index !== undefined && q.correct_option_index !== null;
                const isCurrent = idx === currentQIndex;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setErrorMsg('');
                      setCurrentQIndex(idx);
                    }}
                    className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                        : isSelected
                        ? 'bg-purple-950/60 text-purple-300 border border-purple-500/40'
                        : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Customize Question Modal */}
      {isEditingCustom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="glass-card max-w-xl w-full p-6 sm:p-8 rounded-3xl border border-purple-500/30 max-h-[90vh] overflow-y-auto space-y-5">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-purple-400" />
              Customize Question {currentQIndex + 1}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Question Text
                </label>
                <input
                  type="text"
                  value={editQuestionText}
                  onChange={(e) => setEditQuestionText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-input text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g. What is Kamal's favorite movie?"
                />
              </div>

              <div className="space-y-2.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  4 Options (Text & Emojis)
                </label>
                {editOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-white/10 text-xs font-bold flex items-center justify-center text-slate-300 shrink-0">
                      {['A', 'B', 'C', 'D'][idx]}
                    </span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...editOptions];
                        newOpts[idx] = e.target.value;
                        setEditOptions(newOpts);
                      }}
                      className="flex-1 px-3.5 py-2.5 rounded-xl glass-input text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder={`Option ${idx + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsEditingCustom(false)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveCustomEdit}
                className="flex-1 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all shadow-md shadow-purple-600/30"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

