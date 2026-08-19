import React, { memo } from 'react';
import type { GameMode, TypingStats } from '../hooks/useTypingGame';
import type { Language } from '../data/quotes';
import { Clock, Target, Zap, Flame } from 'lucide-react';

interface StatsBarProps {
  language: Language;
  mode: GameMode;
  stats: TypingStats;
  timeLeft: number;
}

export const StatsBar: React.FC<StatsBarProps> = memo(({
  language,
  mode,
  stats,
  timeLeft,
}) => {
  const getStreakTitle = (streak: number) => {
    if (language === 'id') {
      if (streak >= 100) return '🌸 Penguasa Zen';
      if (streak >= 50) return '⚡ Titik Fokus';
      if (streak >= 25) return '🌿 Irama Tenang';
      if (streak >= 10) return '✨ Harmoni';
      return '🌱 Awal Damai';
    } else {
      if (streak >= 100) return '🌸 Zen Master';
      if (streak >= 50) return '⚡ Pure Flow';
      if (streak >= 25) return '🌿 In Rhythm';
      if (streak >= 10) return '✨ In Harmony';
      return '🌱 Calm Start';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 select-none">
      {/* 1. Net WPM */}
      <div className="bg-[var(--bg-surface)]/60 backdrop-blur-md border border-[var(--border-color)] rounded-2xl p-3 flex flex-col items-center justify-center transition-all duration-200 hover:border-[var(--accent)] hover:shadow-lg hover:shadow-[var(--accent-glow)] group">
        <div className="flex items-center gap-1.5 text-[var(--text-dim)] text-xs font-semibold uppercase tracking-wider mb-0.5 group-hover:text-[var(--accent)] transition-colors">
          <Zap className="w-3.5 h-3.5 text-[var(--accent)]" /> Net WPM
        </div>
        <div className="text-3xl font-black font-mono text-[var(--accent)] tracking-tight">
          {stats.netWpm}
        </div>
        <div className="text-[10px] text-[var(--text-dim)] font-mono">
          Raw: {stats.rawWpm}
        </div>
      </div>

      {/* 2. Accuracy */}
      <div className="bg-[var(--bg-surface)]/60 backdrop-blur-md border border-[var(--border-color)] rounded-2xl p-3 flex flex-col items-center justify-center transition-all duration-200 hover:border-[var(--accent)] hover:shadow-lg hover:shadow-[var(--accent-glow)] group">
        <div className="flex items-center gap-1.5 text-[var(--text-dim)] text-xs font-semibold uppercase tracking-wider mb-0.5 group-hover:text-[var(--accent)] transition-colors">
          <Target className="w-3.5 h-3.5 text-[var(--accent)]" /> {language === 'id' ? 'Akurasi' : 'Accuracy'}
        </div>
        <div className="text-3xl font-black font-mono text-[var(--text-primary)] tracking-tight">
          {stats.accuracy}%
        </div>
        <div className="text-[10px] text-[var(--text-dim)] font-mono">
          {language === 'id' ? 'Salah' : 'Errors'}: {stats.errorKeystrokes}
        </div>
      </div>

      {/* 3. Streak */}
      <div className="bg-[var(--bg-surface)]/60 backdrop-blur-md border border-[var(--border-color)] rounded-2xl p-3 flex flex-col items-center justify-center transition-all duration-200 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-400/20 group">
        <div className="flex items-center gap-1.5 text-[var(--text-dim)] text-xs font-semibold uppercase tracking-wider mb-0.5 group-hover:text-amber-400 transition-colors">
          <Flame className="w-3.5 h-3.5 text-amber-400" /> Streak
        </div>
        <div className="text-3xl font-black font-mono text-amber-400 tracking-tight">
          {stats.streak}
        </div>
        <div className="text-[10px] text-[var(--text-dim)] truncate max-w-full">
          {getStreakTitle(stats.streak)}
        </div>
      </div>

      {/* 4. Timer / Elapsed */}
      <div className="bg-[var(--bg-surface)]/60 backdrop-blur-md border border-[var(--border-color)] rounded-2xl p-3 flex flex-col items-center justify-center transition-all duration-200 hover:border-[var(--accent)] hover:shadow-lg hover:shadow-[var(--accent-glow)] group">
        <div className="flex items-center gap-1.5 text-[var(--text-dim)] text-xs font-semibold uppercase tracking-wider mb-0.5 group-hover:text-[var(--accent)] transition-colors">
          <Clock className="w-3.5 h-3.5 text-[var(--accent)]" /> {mode === 'timed' ? (language === 'id' ? 'Sisa Waktu' : 'Time Left') : (language === 'id' ? 'Waktu' : 'Elapsed')}
        </div>
        <div className="text-3xl font-black font-mono text-[var(--text-primary)] tracking-tight">
          {mode === 'timed' ? `${timeLeft}s` : `${stats.elapsedSeconds}s`}
        </div>
        <div className="text-[10px] text-[var(--text-dim)] font-mono">
          {stats.totalKeystrokes} {language === 'id' ? 'tombol' : 'keys'}
        </div>
      </div>
    </div>
  );
});
