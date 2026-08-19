import React, { useState, useEffect, memo } from 'react';

interface ZenKeyboardProps {
  activeKey?: string | null;
}

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

export const ZenKeyboard: React.FC<ZenKeyboardProps> = memo(({ activeKey }) => {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!activeKey) return;
    setPressedKey(activeKey.toLowerCase());
    const timer = setTimeout(() => {
      setPressedKey(null);
    }, 110);
    return () => clearTimeout(timer);
  }, [activeKey]);

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 px-4 hidden md:flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity duration-200 select-none">
      {KEYBOARD_ROWS.map((row, rIdx) => (
        <div key={rIdx} className="flex gap-1.5 justify-center">
          {row.map((k) => {
            const isPressed = pressedKey === k;
            return (
              <div
                key={k}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center font-mono text-xs font-semibold uppercase transition-all duration-75 ${
                  isPressed
                    ? 'bg-[var(--accent)] text-[var(--bg-primary)] border-[var(--accent)] scale-90 shadow-[0_0_12px_var(--accent)] font-bold'
                    : 'bg-[var(--bg-surface)]/60 border-[var(--border-color)] text-[var(--text-dim)] hover:border-[var(--accent)]/40'
                }`}
              >
                {k}
              </div>
            );
          })}
        </div>
      ))}
      {/* Spacebar */}
      <div className="flex gap-1.5 justify-center mt-0.5">
        <div
          className={`w-56 h-8 rounded-xl border flex items-center justify-center font-mono text-[10px] tracking-widest text-[var(--text-dim)] uppercase transition-all duration-75 ${
            pressedKey === ' '
              ? 'bg-[var(--accent)] text-[var(--bg-primary)] border-[var(--accent)] scale-95 shadow-[0_0_12px_var(--accent)]'
              : 'bg-[var(--bg-surface)]/60 border-[var(--border-color)]'
          }`}
        >
          SPACE
        </div>
      </div>
    </div>
  );
});
