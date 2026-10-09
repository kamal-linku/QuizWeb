import React, { useState } from 'react';
import { Trophy, Medal, Search, Flame, Users, Sparkles } from 'lucide-react';

export default function LeaderboardTable({ leaderboard = [], creatorName = "Friend", highlightName = null }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = leaderboard.filter((item) =>
    item.friend_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-black text-sm shadow-sm shadow-amber-500/20">
          🥇
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-xl bg-slate-400/20 text-slate-300 border border-slate-400/30 flex items-center justify-center font-black text-sm">
          🥈
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-xl bg-amber-700/20 text-amber-400 border border-amber-700/30 flex items-center justify-center font-black text-sm">
          🥉
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-xl bg-white/5 text-slate-400 border border-white/5 flex items-center justify-center font-bold text-xs">
        #{rank}
      </div>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="w-full glass-card rounded-3xl p-5 sm:p-7 border border-white/10 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Who Knows {creatorName} Best?
            </h3>
            <p className="text-xs text-slate-400">
              {leaderboard.length} {leaderboard.length === 1 ? 'friend has' : 'friends have'} attempted this quiz
            </p>
          </div>
        </div>

        {leaderboard.length > 5 && (
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search friends..."
              className="pl-9 pr-4 py-2 text-xs rounded-xl glass-input text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 w-full sm:w-48"
            />
          </div>
        )}
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center py-10 px-4 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
          <Users className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-300 font-semibold text-sm">No attempts yet!</p>
          <p className="text-xs text-slate-500 mt-1">Share the quiz link with friends to see who ranks #1.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm">
          No friends found matching "{searchTerm}"
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((entry) => {
            const isHighlighted = highlightName && entry.friend_name.toLowerCase() === highlightName.toLowerCase();

            return (
              <div
                key={`${entry.rank}-${entry.friend_name}-${entry.created_at}`}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isHighlighted
                    ? 'bg-purple-900/30 border-purple-500/50 shadow-md shadow-purple-500/10'
                    : 'bg-slate-900/40 border-white/5 hover:border-white/10 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {getRankBadge(entry.rank)}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold text-sm sm:text-base truncate ${isHighlighted ? 'text-purple-300' : 'text-white'}`}>
                        {entry.friend_name}
                      </span>
                      {isHighlighted && (
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-purple-500 text-white">
                          You
                        </span>
                      )}
                      {entry.score === entry.total_questions && (
                        <span title="Perfect Score">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        </span>
                      )}
                    </div>
                    {entry.created_at && (
                      <p className="text-[11px] text-slate-500">
                        {formatDate(entry.created_at)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="font-bold text-white text-sm sm:text-base">
                      {entry.score} <span className="text-slate-400 font-normal text-xs">/ {entry.total_questions}</span>
                    </div>
                    <div className="text-xs font-semibold text-purple-400">
                      {entry.percentage}%
                    </div>
                  </div>

                  <div className="w-12 sm:w-16 h-2 bg-slate-800 rounded-full overflow-hidden hidden xs:block">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{ width: `${entry.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

