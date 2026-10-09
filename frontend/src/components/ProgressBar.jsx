import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({ current, total, answeredCount = null }) {
  const percentage = Math.min(100, Math.round((current / total) * 100));

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <span className="font-semibold text-purple-400 uppercase tracking-wider">
          Question {current} <span className="text-slate-500 font-normal">/ {total}</span>
        </span>
        <span className="font-medium text-slate-400">
          {percentage}% Completed
        </span>
      </div>

      {/* Gradient Progress Bar */}
      <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 rounded-full shadow-sm shadow-purple-500/50"
        />
      </div>

      {/* Step Indicator Dots */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-1">
        {Array.from({ length: total }).map((_, idx) => {
          const isCompleted = idx + 1 < current;
          const isCurrent = idx + 1 === current;

          return (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                isCurrent
                  ? 'w-6 bg-gradient-to-r from-purple-500 to-pink-500 shadow-sm shadow-purple-500/50'
                  : isCompleted
                  ? 'w-2 bg-purple-600/80'
                  : 'w-2 bg-slate-700/60'
              }`}
              title={`Question ${idx + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}

