import React from 'react';
import { Check, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

const optionLetters = ['A', 'B', 'C', 'D'];

export default function OptionCard({
  index,
  text,
  isSelected,
  onClick,
  isCorrect = null, // for result breakdown: true / false / null
  disabled = false,
  badge = null
}) {
  const letter = optionLetters[index] || `${index + 1}`;

  // Determine state colors
  let cardBorder = 'border-white/10 hover:border-purple-500/50 hover:bg-white/[0.04]';
  let cardBg = 'bg-slate-900/60';
  let badgeBg = 'bg-white/5 text-slate-400 group-hover:bg-purple-500/20 group-hover:text-purple-300';

  if (isSelected) {
    cardBorder = 'border-purple-500 ring-2 ring-purple-500/40 bg-purple-900/20 shadow-lg shadow-purple-500/10';
    badgeBg = 'bg-purple-600 text-white shadow-md shadow-purple-600/40';
  }

  if (isCorrect === true) {
    cardBorder = 'border-emerald-500 ring-2 ring-emerald-500/40 bg-emerald-950/30';
    badgeBg = 'bg-emerald-500 text-white';
  } else if (isCorrect === false) {
    cardBorder = 'border-rose-500 ring-2 ring-rose-500/40 bg-rose-950/30';
    badgeBg = 'bg-rose-500 text-white';
  }

  return (
    <motion.button
      type="button"
      whileHover={!disabled ? { scale: 1.015, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.985 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`w-full group text-left p-4 sm:p-5 rounded-2xl border backdrop-blur-md transition-all duration-200 relative overflow-hidden flex items-center justify-between gap-4 ${cardBg} ${cardBorder} ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
    >
      {/* Background glow when selected */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/5 to-transparent pointer-events-none" />
      )}

      <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
        {/* Letter Badge */}
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-sm sm:text-base shrink-0 transition-colors ${badgeBg}`}
        >
          {letter}
        </div>

        {/* Option Text */}
        <span
          className={`text-base sm:text-lg font-medium leading-snug break-words transition-colors ${
            isSelected ? 'text-white font-semibold' : 'text-slate-200 group-hover:text-white'
          }`}
        >
          {text}
        </span>
      </div>

      {/* Selection Check Indicator */}
      <div className="shrink-0 flex items-center gap-2">
        {badge && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
            {badge}
          </span>
        )}
        
        {isSelected ? (
          <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-md shadow-purple-500/40 animate-scaleIn">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        ) : isCorrect === true ? (
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full border border-white/20 group-hover:border-purple-400/50 flex items-center justify-center transition-colors" />
        )}
      </div>
    </motion.button>
  );
}

