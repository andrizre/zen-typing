import React, { useRef, useLayoutEffect, useState, memo, useCallback } from 'react';
import type { QuoteItem } from '../data/quotes';
import { RotateCcw, Keyboard } from 'lucide-react';

interface TypingAreaProps {
  targetText: string;
  typedText: string;
  currentQuote: QuoteItem | null;
  status: 'idle' | 'running' | 'completed';
  onKeyDown: (e: React.KeyboardEvent) => void;
  onRestart: () => void;
  onSpawnParticle?: (x: number, y: number, char: string, isError: boolean) => void;
}

export const TypingArea: React.FC<TypingAreaProps> = memo(({
  targetText,
  typedText,
  currentQuote,
  onKeyDown,
  onRestart,
  onSpawnParticle,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeCharRef = useRef<HTMLSpanElement | null>(null);
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const [caretPos, setCaretPos] = useState<{ x: number; y: number; height: number } | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(true);

  useLayoutEffect(() => {
    hiddenInputRef.current?.focus();
  }, []);

  const handleContainerClick = useCallback(() => {
    hiddenInputRef.current?.focus();
    setIsFocused(true);
  }, []);

  // GPU-accelerated caret calculation with useLayoutEffect
  useLayoutEffect(() => {
    if (!activeCharRef.current || !containerRef.current) return;

    const charEl = activeCharRef.current;
    const containerEl = containerRef.current;

    const charRect = charEl.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();

    const x = charRect.left - containerRect.left;
    const y = charRect.top - containerRect.top;
    const height = charRect.height || 32;

    setCaretPos({ x, y, height });

    if (onSpawnParticle && typedText.length > 0) {
      const lastIndex = typedText.length - 1;
      const lastChar = typedText[lastIndex];
      const targetChar = targetText[lastIndex];
      const isError = lastChar !== targetChar;
      onSpawnParticle(
        charRect.left + charRect.width * 0.5,
        charRect.top + charRect.height * 0.5,
        lastChar,
        isError
      );
    }
  }, [typedText, targetText, onSpawnParticle]);

  return (
    <div
      onClick={handleContainerClick}
      className="relative w-full max-w-4xl mx-auto px-4 mt-5 flex flex-col items-center cursor-text select-none group"
    >
      {/* Hidden input */}
      <input
        ref={hiddenInputRef}
        type="text"
        className="absolute opacity-0 pointer-events-none -top-96"
        onKeyDown={onKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoFocus
        tabIndex={0}
      />

      {/* Focus Overlay */}
      {!isFocused && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-xs rounded-3xl animate-fade-in">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] px-5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-sm text-[var(--accent)] font-medium">
            <Keyboard className="w-4 h-4" /> Klik di mana saja untuk melanjutkan mengetik
          </div>
        </div>
      )}

      {/* Main Text Display Container */}
      <div
        ref={containerRef}
        className="relative w-full min-h-[220px] max-h-[380px] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)]/80 backdrop-blur-lg border border-[var(--border-color)] shadow-2xl transition-all duration-300 hover:border-[var(--accent)]/50"
      >
        {/* GPU-Accelerated Smooth Caret */}
        {caretPos && isFocused && (
          <span
            className="absolute top-0 left-0 z-10 w-[3px] bg-[var(--caret-color)] rounded-full animate-caret shadow-[0_0_10px_var(--caret-color)] pointer-events-none will-change-transform"
            style={{
              transform: `translate3d(${caretPos.x}px, ${caretPos.y}px, 0)`,
              height: `${caretPos.height}px`,
              transition: 'transform 75ms ease-out',
            }}
          />
        )}

        {/* Character Stream */}
        <div className="leading-relaxed sm:leading-loose text-left whitespace-pre-wrap break-words font-mono text-xl sm:text-2xl tracking-wide">
          {targetText.split('').map((char, index) => {
            const isTyped = index < typedText.length;
            const isCurrent = index === typedText.length;
            const isCorrect = isTyped && typedText[index] === char;
            const isIncorrect = isTyped && !isCorrect;

            let charClass = 'text-[var(--text-dim)]';
            if (isCorrect) {
              charClass = 'text-[var(--text-correct)]';
            } else if (isIncorrect) {
              charClass = 'text-[var(--text-error)] bg-red-500/20 rounded-sm underline decoration-red-500';
            }

            return (
              <span
                key={index}
                ref={isCurrent ? activeCharRef : null}
                className={`relative transition-colors duration-75 inline-block ${charClass} ${
                  isCurrent ? 'bg-[var(--accent-glow)] rounded-sm' : ''
                }`}
              >
                {char === ' ' ? (
                  <span className={isIncorrect ? 'text-red-400 opacity-80' : 'opacity-40'}>
                    {isIncorrect ? '•' : ' '}
                  </span>
                ) : (
                  char
                )}
              </span>
            );
          })}
        </div>

        {/* Author Quote Badge */}
        {currentQuote && (
          <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-dim)]">
            <span className="italic font-serif-vintage tracking-wide">
              — {currentQuote.author}
            </span>
            <span className="uppercase tracking-widest text-[10px] bg-[var(--bg-card)] px-2.5 py-0.5 rounded-md border border-[var(--border-color)]">
              {currentQuote.category}
            </span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mt-4 px-2 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRestart();
              hiddenInputRef.current?.focus();
            }}
            title="Ulangi Latihan (Esc atau Tab+Enter)"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--accent)] hover:text-[var(--bg-primary)] hover:border-[var(--accent)] hover:shadow-lg hover:shadow-[var(--accent-glow)] active:scale-95 transition-all duration-150 cursor-pointer font-semibold"
          >
            <RotateCcw className="w-4 h-4" /> Ulangi Sesi
          </button>
          <span className="hidden sm:inline font-mono text-[11px] text-[var(--text-dim)]">
            tekan <kbd className="px-1.5 py-0.5 bg-[var(--bg-card)] rounded-md border border-[var(--border-color)] text-[var(--text-primary)]">Esc</kbd>
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-[var(--text-dim)]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--text-correct)]" /> Benar
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--text-error)]" /> Salah
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--caret-color)]" /> Kursor
          </span>
        </div>
      </div>
    </div>
  );
});
