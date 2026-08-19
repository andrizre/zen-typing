import React, { useState } from 'react';
import { X, FileText } from 'lucide-react';

interface CustomTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
}

export const CustomTextModal: React.FC<CustomTextModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [text, setText] = useState<string>('');

  if (!isOpen) return null;

  const presets = [
    {
      title: 'Ketenangan Jiwa',
      content: 'Hembuskan napas panjang dan biarkan pikiranmu mengalir tanpa hambatan. Ketenangan sejati bermula dari hati yang damai.',
    },
    {
      title: 'Zen Developer Mantra',
      content: 'const innerPeace = (code) => code.simplify().refactor().breathe(); // Clean code is tranquil mind',
    },
    {
      title: 'Stoic Flow',
      content: 'Never let the future disturb you. You will meet it, if you have to, with the same weapons of reason which today arm you against the present.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-sm">
              <FileText className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)] m-0">
                Custom Zen Text
              </h3>
              <p className="text-xs text-[var(--text-dim)] m-0">
                Paste your own mantra, quote, or code to type
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[var(--bg-card)] text-[var(--text-dim)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets */}
        <div className="flex flex-col gap-1.5 mb-4">
          <span className="text-[11px] text-[var(--text-dim)] font-medium">Quick Presets:</span>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setText(p.content)}
                className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] hover:border-[var(--accent)] border border-[var(--border-color)] text-[11px] text-[var(--text-primary)] transition-colors"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste custom text here..."
            rows={5}
            className="w-full p-4 rounded-2xl bg-[var(--bg-card)]/70 border border-[var(--border-color)] text-sm text-[var(--text-primary)] placeholder-[var(--text-dim)] focus:outline-none focus:border-[var(--accent)] resize-none font-mono"
            autoFocus
          />

          <div className="flex items-center justify-between text-xs text-[var(--text-dim)]">
            <span>{text.length} characters</span>
            <span>{text.split(/\s+/).filter(Boolean).length} words</span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!text.trim()}
              className="flex-1 py-3 rounded-2xl bg-[var(--accent)] text-[var(--bg-primary)] text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Start Typing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
