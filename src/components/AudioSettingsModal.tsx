import React from 'react';
import { X, Sliders } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';
import type { SoundProfile, AmbientSound } from '../audio/soundEngine';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundProfile: SoundProfile;
  onSoundProfileChange: (p: SoundProfile) => void;
  ambientSound: AmbientSound;
  onAmbientSoundChange: (a: AmbientSound) => void;
  volume: number;
  onVolumeChange: (v: number) => void;
  ambientVolume: number;
  onAmbientVolumeChange: (v: number) => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({
  isOpen,
  onClose,
  soundProfile,
  onSoundProfileChange,
  ambientSound,
  onAmbientSoundChange,
  volume,
  onVolumeChange,
  ambientVolume,
  onAmbientVolumeChange,
}) => {
  if (!isOpen) return null;

  const testKey = (key: string) => {
    soundEngine.playKey(key);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-sm">
              <Sliders className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)] m-0">
                Zen Audio & Acoustics
              </h3>
              <p className="text-xs text-[var(--text-dim)] m-0">
                100% Web Audio API procedural synthesis
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

        {/* Section 1: Keyboard Sound Profile */}
        <div className="flex flex-col gap-3 mb-6">
          <label className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
            Mechanical Keyboard Profile
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'thock' as SoundProfile, name: 'Thock', desc: 'Lubed linear switches, deep bottom-out thump', icon: '🎹' },
              { id: 'typewriter' as SoundProfile, name: 'Typewriter', desc: 'Metallic strike, spring ping & bell chime', icon: '📻' },
              { id: 'silent' as SoundProfile, name: 'Silent', desc: 'Pure silence for deep contemplation', icon: '🔇' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => onSoundProfileChange(item.id)}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  soundProfile === item.id
                    ? 'border-[var(--accent)] bg-[var(--accent-glow)] text-[var(--text-primary)]'
                    : 'border-[var(--border-color)] bg-[var(--bg-card)]/50 text-[var(--text-dim)] hover:text-[var(--text-primary)]'
                }`}
              >
                <div className="text-xl mb-1">{item.icon}</div>
                <div className="font-bold text-xs text-[var(--text-primary)]">{item.name}</div>
                <div className="text-[10px] text-[var(--text-dim)] mt-0.5 leading-tight">{item.desc}</div>
              </button>
            ))}
          </div>

          {/* Key Audio Preview Buttons */}
          {soundProfile !== 'silent' && (
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[var(--border-color)] text-xs">
              <span className="text-[11px] text-[var(--text-dim)]">Test sound:</span>
              <button
                onClick={() => testKey('a')}
                className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent)] text-xs font-mono"
              >
                Normal Key
              </button>
              <button
                onClick={() => testKey(' ')}
                className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent)] text-xs font-mono"
              >
                Spacebar
              </button>
              <button
                onClick={() => testKey('Enter')}
                className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent)] text-xs font-mono text-[var(--accent)]"
              >
                Enter {soundProfile === 'typewriter' ? '🔔' : ''}
              </button>
            </div>
          )}
        </div>

        {/* Section 2: Master Volume */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[var(--text-primary)] uppercase tracking-wider">
              Keystroke Volume
            </span>
            <span className="font-mono text-[var(--accent)]">{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-full accent-[var(--accent)] h-1.5 bg-[var(--bg-card)] rounded-lg cursor-pointer"
          />
        </div>

        {/* Section 3: Ambient Sound Generator */}
        <div className="flex flex-col gap-3 mb-6">
          <label className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
            Zen Ambient Generator
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'off' as AmbientSound, label: 'Off', icon: '⏹️' },
              { id: 'rain' as AmbientSound, label: 'Gentle Rain', icon: '🌧️' },
            ].map(amb => (
              <button
                key={amb.id}
                onClick={() => onAmbientSoundChange(amb.id)}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                  ambientSound === amb.id
                    ? 'bg-[var(--accent)] text-[var(--bg-primary)] font-bold'
                    : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-dim)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span>{amb.icon}</span> {amb.label}
              </button>
            ))}
          </div>

          {ambientSound !== 'off' && (
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] text-[var(--text-dim)]">Rain Volume</span>
                <span className="font-mono text-xs text-[var(--accent)]">{Math.round(ambientVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={ambientVolume}
                onChange={(e) => onAmbientVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-[var(--accent)] h-1.5 bg-[var(--bg-card)] rounded-lg cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-[var(--accent)] text-[var(--bg-primary)] font-bold text-xs hover:opacity-90 transition-opacity"
        >
          Save & Return to Flow
        </button>
      </div>
    </div>
  );
};
