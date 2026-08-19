import React, { memo } from 'react';
import type { GameMode } from '../hooks/useTypingGame';
import type { Language } from '../data/quotes';
import type { SoundProfile } from '../audio/soundEngine';
import { soundEngine } from '../audio/soundEngine';
import { Sparkles, Clock, FileText, Waves, Edit3 } from 'lucide-react';

interface ControlDockProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  soundProfile: SoundProfile;
  onSoundProfileChange: (p: SoundProfile) => void;
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  modeOption: number | string;
  onModeOptionChange: (option: number | string) => void;
  onOpenCustomModal: () => void;
}

export const ControlDock: React.FC<ControlDockProps> = memo(({
  language,
  onLanguageChange,
  soundProfile,
  onSoundProfileChange,
  mode,
  onModeChange,
  modeOption,
  onModeOptionChange,
  onOpenCustomModal,
}) => {
  const idCategories = [
    { id: 'all', label: 'Semua' },
    { id: 'indonesia', label: 'Nusantara' },
    { id: 'zen', label: 'Zen' },
    { id: 'stoic', label: 'Stoik' },
    { id: 'nature', label: 'Alam' },
    { id: 'literary', label: 'Sastra' },
    { id: 'code', label: 'Code' },
  ];

  const enCategories = [
    { id: 'all', label: 'All' },
    { id: 'zen', label: 'Zen' },
    { id: 'stoic', label: 'Stoic' },
    { id: 'nature', label: 'Nature' },
    { id: 'literary', label: 'Literary' },
    { id: 'code', label: 'Code' },
  ];

  const categories = language === 'id' ? idCategories : enCategories;

  const handleSoundChange = (profile: SoundProfile) => {
    onSoundProfileChange(profile);
    if (profile === 'thock') {
      soundEngine.setProfile('thock');
      soundEngine.playKey(' ');
    } else if (profile === 'typewriter') {
      soundEngine.setProfile('typewriter');
      soundEngine.playKey('a');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-4 flex flex-col items-center gap-2.5 select-none">
      {/* Primary Floating Interactive Capsule Dock */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-2xl bg-[var(--bg-surface)]/90 backdrop-blur-lg border border-[var(--border-color)] shadow-xl transition-all duration-200">
        
        {/* Section 1: Language Switcher */}
        <div className="flex items-center bg-[var(--bg-card)]/80 p-1 rounded-xl border border-[var(--border-color)]">
          <button
            onClick={() => onLanguageChange('id')}
            title="Bahasa Indonesia"
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1 cursor-pointer ${
              language === 'id'
                ? 'bg-[var(--accent)] text-[var(--bg-primary)] shadow-md scale-105'
                : 'text-[var(--text-dim)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span>🇮🇩</span> <span className="hidden sm:inline">ID</span>
          </button>
          <button
            onClick={() => onLanguageChange('en')}
            title="English"
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1 cursor-pointer ${
              language === 'en'
                ? 'bg-[var(--accent)] text-[var(--bg-primary)] shadow-md scale-105'
                : 'text-[var(--text-dim)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span>🇬🇧</span> <span className="hidden sm:inline">EN</span>
          </button>
        </div>

        {/* Divider */}
        <div className="w-[1px] h-6 bg-[var(--border-color)] hidden sm:block opacity-60" />

        {/* Section 2: Mechanical Keyboard Sound Profile Switcher */}
        <div className="flex items-center bg-[var(--bg-card)]/80 p-1 rounded-xl border border-[var(--border-color)]">
          <button
            onClick={() => handleSoundChange('thock')}
            title="Thock Keyboard Sound (Deep Lubed Switch)"
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
              soundProfile === 'thock'
                ? 'bg-[var(--accent)] text-[var(--bg-primary)] shadow-md scale-105'
                : 'text-[var(--text-dim)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span>🎹</span> Thock
          </button>

          <button
            onClick={() => handleSoundChange('typewriter')}
            title="Vintage Typewriter Sound (Metal Strike & Bell)"
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
              soundProfile === 'typewriter'
                ? 'bg-[var(--accent)] text-[var(--bg-primary)] shadow-md scale-105'
                : 'text-[var(--text-dim)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span>📻</span> Typewriter
          </button>

          <button
            onClick={() => onSoundProfileChange('silent')}
            title="Silent Mode"
            className={`px-2 py-1 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
              soundProfile === 'silent'
                ? 'bg-[var(--accent)] text-[var(--bg-primary)] shadow-md scale-105 font-bold'
                : 'text-[var(--text-dim)] hover:text-[var(--text-primary)]'
            }`}
          >
            Silent
          </button>
        </div>

        {/* Divider */}
        <div className="w-[1px] h-6 bg-[var(--border-color)] hidden sm:block opacity-60" />

        {/* Section 3: Typing Modes */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onModeChange('quote')}
            className={`px-3 py-1 rounded-xl text-xs font-medium transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
              mode === 'quote'
                ? 'bg-[var(--accent)] text-[var(--bg-primary)] font-bold shadow-md scale-105'
                : 'text-[var(--text-dim)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'id' ? 'Kutipan' : 'Quotes'}</span>
          </button>

          <button
            onClick={() => onModeChange('timed')}
            className={`px-3 py-1 rounded-xl text-xs font-medium transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
              mode === 'timed'
                ? 'bg-[var(--accent)] text-[var(--bg-primary)] font-bold shadow-md scale-105'
                : 'text-[var(--text-dim)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{language === 'id' ? 'Waktu' : 'Timed'}</span>
          </button>

          <button
            onClick={() => onModeChange('words')}
            className={`px-3 py-1 rounded-xl text-xs font-medium transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
              mode === 'words'
                ? 'bg-[var(--accent)] text-[var(--bg-primary)] font-bold shadow-md scale-105'
                : 'text-[var(--text-dim)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{language === 'id' ? 'Kata' : 'Words'}</span>
          </button>

          <button
            onClick={() => onModeChange('zen')}
            className={`px-3 py-1 rounded-xl text-xs font-medium transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
              mode === 'zen'
                ? 'bg-[var(--accent)] text-[var(--bg-primary)] font-bold shadow-md scale-105'
                : 'text-[var(--text-dim)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>{language === 'id' ? 'Aliran' : 'Flow'}</span>
          </button>

          <button
            onClick={onOpenCustomModal}
            className={`px-3 py-1 rounded-xl text-xs font-medium transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
              mode === 'custom'
                ? 'bg-[var(--accent)] text-[var(--bg-primary)] font-bold shadow-md scale-105'
                : 'text-[var(--text-dim)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{language === 'id' ? 'Kustom' : 'Custom'}</span>
          </button>
        </div>
      </div>

      {/* Secondary Sub-Option Chips */}
      <div className="flex items-center justify-center gap-1.5 text-xs flex-wrap">
        {mode === 'timed' && (
          [15, 30, 60, 120].map(sec => (
            <button
              key={sec}
              onClick={() => onModeOptionChange(sec)}
              className={`px-3 py-1 rounded-lg transition-all duration-150 font-mono cursor-pointer ${
                modeOption === sec
                  ? 'bg-[var(--accent)] text-[var(--bg-primary)] font-bold shadow-sm scale-105'
                  : 'bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-dim)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]'
              }`}
            >
              {sec}s
            </button>
          ))
        )}

        {mode === 'words' && (
          [10, 25, 50, 100].map(cnt => (
            <button
              key={cnt}
              onClick={() => onModeOptionChange(cnt)}
              className={`px-3 py-1 rounded-lg transition-all duration-150 font-mono cursor-pointer ${
                modeOption === cnt
                  ? 'bg-[var(--accent)] text-[var(--bg-primary)] font-bold shadow-sm scale-105'
                  : 'bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-dim)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]'
              }`}
            >
              {cnt}w
            </button>
          ))
        )}

        {mode === 'quote' && (
          categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onModeOptionChange(cat.id)}
              className={`px-3 py-1 rounded-lg transition-all duration-150 cursor-pointer ${
                modeOption === cat.id
                  ? 'bg-[var(--accent)] text-[var(--bg-primary)] font-bold shadow-sm scale-105'
                  : 'bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-dim)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]'
              }`}
            >
              {cat.label}
            </button>
          ))
        )}
      </div>
    </div>
  );
});
