import React, { useEffect } from 'react';
import type { TypingStats } from '../hooks/useTypingGame';
import { Zap, Target, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultsModalProps {
  stats: TypingStats;
  onRestart: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({ stats, onRestart }) => {
  // Launch festive zen confetti on modal open
  useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#5eead4', '#38bdf8', '#f472b6', '#a7f3d0'],
      });
    } catch {
      // ignore
    }
  }, []);

  const getZenTitle = (wpm: number, acc: number) => {
    if (wpm >= 90 && acc >= 95) return { title: 'Zen Grandmaster', desc: 'Transcendent velocity with supreme precision.' };
    if (wpm >= 70 && acc >= 90) return { title: 'Master of Flow', desc: 'Swift like a river, steady like a mountain.' };
    if (wpm >= 50 && acc >= 85) return { title: 'Gentle Breeze', desc: 'Graceful keystrokes and steady mindful presence.' };
    if (wpm >= 30) return { title: 'Serene Stream', desc: 'A peaceful pace, growing with every breath.' };
    return { title: 'Mindful Seed', desc: 'Every grand tree begins with a single calm root.' };
  };

  const zenGrade = getZenTitle(stats.netWpm, stats.accuracy);

  // SVG Sparkline calculation for WPM history
  const renderSparkline = () => {
    const history = stats.wpmHistory;
    if (!history || history.length < 2) {
      return (
        <div className="text-xs text-[var(--text-dim)] py-6 text-center">
          Steady single-burst pace achieved.
        </div>
      );
    }

    const width = 360;
    const height = 70;
    const padding = 10;
    const maxWpm = Math.max(...history.map(h => h.wpm), 40);
    const minWpm = Math.min(...history.map(h => h.wpm), 0);

    const points = history.map((item, index) => {
      const x = padding + (index / (history.length - 1)) * (width - padding * 2);
      const y = height - padding - ((item.wpm - minWpm) / (maxWpm - minWpm || 1)) * (height - padding * 2);
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="w-full flex flex-col items-center">
        <div className="text-[11px] text-[var(--text-dim)] font-mono mb-1 self-start">
          WPM Flow Curve
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-20 overflow-visible">
          <polyline
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center">
        {/* Zen Grade Badge */}
        <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-3xl shadow-inner mb-3">
          🪷
        </div>

        <h2 className="text-2xl font-black text-[var(--text-primary)] m-0">
          {zenGrade.title}
        </h2>
        <p className="text-xs text-[var(--text-dim)] mt-1 mb-6 max-w-xs font-serif-vintage italic">
          "{zenGrade.desc}"
        </p>

        {/* Primary Scores */}
        <div className="grid grid-cols-2 gap-4 w-full mb-6">
          <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-dim)] font-semibold uppercase">
              <Zap className="w-4 h-4 text-[var(--accent)]" /> Net Speed
            </div>
            <div className="text-4xl font-black font-mono text-[var(--accent)] mt-1">
              {stats.netWpm} <span className="text-sm font-normal text-[var(--text-dim)]">WPM</span>
            </div>
            <div className="text-[11px] text-[var(--text-dim)] font-mono mt-0.5">
              Raw: {stats.rawWpm} WPM
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-dim)] font-semibold uppercase">
              <Target className="w-4 h-4 text-[var(--accent)]" /> Accuracy
            </div>
            <div className="text-4xl font-black font-mono text-[var(--text-primary)] mt-1">
              {stats.accuracy}%
            </div>
            <div className="text-[11px] text-[var(--text-dim)] font-mono mt-0.5">
              {stats.errorKeystrokes} errors / {stats.totalKeystrokes} keys
            </div>
          </div>
        </div>

        {/* Secondary Details */}
        <div className="grid grid-cols-3 gap-2 w-full mb-6 text-xs">
          <div className="p-2.5 rounded-xl bg-[var(--bg-card)]/50 border border-[var(--border-color)]">
            <div className="text-[var(--text-dim)] text-[10px]">Time</div>
            <div className="font-mono font-bold text-[var(--text-primary)] mt-0.5">{stats.elapsedSeconds}s</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--bg-card)]/50 border border-[var(--border-color)]">
            <div className="text-[var(--text-dim)] text-[10px]">Max Streak</div>
            <div className="font-mono font-bold text-amber-400 mt-0.5">🔥 {stats.maxStreak}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--bg-card)]/50 border border-[var(--border-color)]">
            <div className="text-[var(--text-dim)] text-[10px]">Consistency</div>
            <div className="font-mono font-bold text-[var(--text-correct)] mt-0.5">
              {stats.accuracy > 92 ? 'Excellent' : 'Good'}
            </div>
          </div>
        </div>

        {/* Sparkline curve */}
        <div className="w-full bg-[var(--bg-card)]/40 p-3 rounded-2xl border border-[var(--border-color)] mb-6">
          {renderSparkline()}
        </div>

        {/* Actions */}
        <button
          onClick={onRestart}
          autoFocus
          className="w-full py-3.5 px-6 rounded-2xl bg-[var(--accent)] text-[var(--bg-primary)] font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-[var(--accent-glow)]"
        >
          <RefreshCw className="w-4 h-4" /> Next Session (Esc / Enter)
        </button>
      </div>
    </div>
  );
};
