import React, { memo } from 'react';
import { Volume2, VolumeX, Sparkles, Droplets, Sliders } from 'lucide-react';
import type { AmbientSound } from '../audio/soundEngine';
import type { ParticleType } from './ParticleCanvas';

export type ThemeName = 'matcha' | 'midnight' | 'sakura' | 'paper' | 'cyber';

interface HeaderProps {
  theme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
  ambientSound: AmbientSound;
  onAmbientSoundChange: (ambient: AmbientSound) => void;
  particleType: ParticleType;
  onParticleTypeChange: (type: ParticleType) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = memo(({
  theme,
  onThemeChange,
  ambientSound,
  onAmbientSoundChange,
  particleType,
  onParticleTypeChange,
  isMuted,
  onToggleMute,
  onOpenSettings,
}) => {
  const themes: { id: ThemeName; label: string; icon: string; color: string }[] = [
    { id: 'matcha', label: 'Matcha Zen', icon: '🍵', color: '#5eead4' },
    { id: 'midnight', label: 'Midnight', icon: '🌌', color: '#38bdf8' },
    { id: 'sakura', label: 'Sakura Dawn', icon: '🌸', color: '#f472b6' },
    { id: 'paper', label: 'Vintage Paper', icon: '📜', color: '#b45309' },
    { id: 'cyber', label: 'Cyber Lotus', icon: '⚡', color: '#22c55e' },
  ];

  return (
    <header className="w-full max-w-5xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-3 border-b border-[var(--border-color)] transition-colors duration-200 select-none">
      {/* Brand & Zen Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center shadow-inner relative overflow-hidden group">
          <div className="absolute inset-0 bg-[var(--accent-glow)] opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-xl select-none group-hover:scale-110 transition-transform">🪷</span>
        </div>
        <div className="text-left">
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--text-primary)] m-0 leading-tight">
            Zen Typing
          </h1>
          <span className="text-[11px] text-[var(--text-dim)] tracking-wider font-mono block">
            FLOW • HARMONY • PRECISION
          </span>
        </div>
      </div>

      {/* Right Controls: Ambient Rain, Particles, Theme, Audio */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Ambient Rain Quick Toggle */}
        <button
          onClick={() => onAmbientSoundChange(ambientSound === 'rain' ? 'off' : 'rain')}
          title={`Zen Rain Ambience: ${ambientSound === 'rain' ? 'Active' : 'Off'}`}
          className={`p-2 rounded-xl text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
            ambientSound === 'rain'
              ? 'bg-[var(--accent)] text-[var(--bg-primary)] border-[var(--accent)] font-bold shadow-md scale-105'
              : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-dim)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]'
          }`}
        >
          <Droplets className="w-4 h-4" />
          <span className="hidden md:inline">{ambientSound === 'rain' ? 'Rain (On)' : 'Rain'}</span>
        </button>

        {/* Particles Selector */}
        <div className="relative group">
          <button
            title="Pilih Efek Partikel"
            className="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-dim)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-all flex items-center gap-1.5 text-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            <span className="capitalize hidden md:inline">{particleType}</span>
          </button>
          <div className="absolute right-0 mt-1 hidden group-hover:flex flex-col bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-1.5 shadow-2xl z-30 min-w-[130px] text-xs backdrop-blur-lg">
            {(['stardust', 'sakura', 'sparkles', 'ripple'] as ParticleType[]).map(pt => (
              <button
                key={pt}
                onClick={() => onParticleTypeChange(pt)}
                className={`px-3 py-1.5 rounded-xl text-left capitalize transition-colors cursor-pointer ${
                  particleType === pt
                    ? 'bg-[var(--accent)] text-[var(--bg-primary)] font-bold'
                    : 'text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
                }`}
              >
                {pt}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Picker */}
        <div className="relative group">
          <button
            title="Pilih Tema Warna"
            className="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-dim)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-all flex items-center gap-1.5 text-xs cursor-pointer"
          >
            <span>{themes.find(t => t.id === theme)?.icon}</span>
            <span className="hidden lg:inline capitalize">{theme}</span>
          </button>
          <div className="absolute right-0 mt-1 hidden group-hover:flex flex-col bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-1.5 shadow-2xl z-30 min-w-[150px] text-xs backdrop-blur-lg">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                className={`px-3 py-1.5 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer ${
                  theme === t.id
                    ? 'bg-[var(--accent)] text-[var(--bg-primary)] font-bold'
                    : 'text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{t.icon}</span> {t.label}
                </span>
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/20"
                  style={{ backgroundColor: t.color }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Quick Mute Toggle */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            isMuted
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-dim)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Detailed Settings Modal */}
        <button
          onClick={onOpenSettings}
          title="Pengaturan Audio & Akustik"
          className="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-dim)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-all cursor-pointer"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
});
