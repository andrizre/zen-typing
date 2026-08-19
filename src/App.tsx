import React, { useState, useEffect, useRef, useCallback, useTransition } from 'react';
import { Header } from './components/Header';
import type { ThemeName } from './components/Header';
import { ControlDock } from './components/ControlDock';
import { StatsBar } from './components/StatsBar';
import { TypingArea } from './components/TypingArea';
import { ParticleCanvas } from './components/ParticleCanvas';
import type { ParticleCanvasHandle, ParticleType } from './components/ParticleCanvas';
import { ResultsModal } from './components/ResultsModal';
import { AudioSettingsModal } from './components/AudioSettingsModal';
import { CustomTextModal } from './components/CustomTextModal';
import { ZenKeyboard } from './components/ZenKeyboard';
import { soundEngine } from './audio/soundEngine';
import type { SoundProfile, AmbientSound } from './audio/soundEngine';
import { useTypingGame } from './hooks/useTypingGame';

export const App: React.FC = () => {
  // Theme State
  const [theme, setTheme] = useState<ThemeName>('matcha');
  
  // Audio Engine State
  const [soundProfile, setSoundProfile] = useState<SoundProfile>('thock');
  const [ambientSound, setAmbientSound] = useState<AmbientSound>('off');
  const [volume, setVolume] = useState<number>(0.85);
  const [ambientVolume, setAmbientVolume] = useState<number>(0.25);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Particle Canvas State
  const [particleType, setParticleType] = useState<ParticleType>('stardust');
  const particleCanvasRef = useRef<ParticleCanvasHandle | null>(null);

  // Active Key for Visualizer (throttled with transition)
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isCustomTextOpen, setIsCustomTextOpen] = useState<boolean>(false);

  // Keystroke listener for Visualizer
  const handleKeystroke = useCallback((_isError: boolean, _streak: number, key: string) => {
    startTransition(() => {
      setActiveKey(key);
    });
  }, []);

  // Typing Game Hook
  const {
    language,
    setLanguage,
    mode,
    setMode,
    modeOption,
    setModeOption,
    currentQuote,
    targetText,
    typedText,
    status,
    timeLeft,
    stats,
    handleKey,
    restart,
    setCustomText,
  } = useTypingGame({
    onKeystroke: handleKeystroke,
  });

  // Apply Theme Attribute to HTML root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Memoized Sound Handlers
  const handleSoundProfileChange = useCallback((profile: SoundProfile) => {
    setSoundProfile(profile);
    soundEngine.setProfile(profile);
  }, []);

  const handleAmbientSoundChange = useCallback((ambient: AmbientSound) => {
    setAmbientSound(ambient);
    soundEngine.setAmbient(ambient);
  }, []);

  const handleVolumeChange = useCallback((vol: number) => {
    setVolume(vol);
    soundEngine.setMasterVolume(vol);
  }, []);

  const handleAmbientVolumeChange = useCallback((vol: number) => {
    setAmbientVolume(vol);
    soundEngine.setAmbientVolume(vol);
  }, []);

  const handleToggleMute = useCallback(() => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  }, []);

  // Memoized Particle Spawn Callback
  const handleSpawnParticle = useCallback((x: number, y: number, char: string, isError: boolean) => {
    particleCanvasRef.current?.spawn(x, y, char, isError, stats.streak);
  }, [stats.streak]);

  // Theme Accent colors
  const getThemeColor = useCallback(() => {
    switch (theme) {
      case 'midnight': return '#38bdf8';
      case 'sakura': return '#f472b6';
      case 'paper': return '#b45309';
      case 'cyber': return '#22c55e';
      default: return '#5eead4';
    }
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--bg-primary)] text-[var(--text-primary)] relative overflow-x-hidden select-none">
      {/* 60FPS Zero-GC Particle Canvas Layer */}
      <ParticleCanvas
        ref={particleCanvasRef}
        particleType={particleType}
        accentColor={getThemeColor()}
      />

      {/* Top Header */}
      <Header
        theme={theme}
        onThemeChange={setTheme}
        ambientSound={ambientSound}
        onAmbientSoundChange={handleAmbientSoundChange}
        particleType={particleType}
        onParticleTypeChange={setParticleType}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center py-4 sm:py-6 max-w-5xl w-full mx-auto">
        {/* Floating Control Dock */}
        <ControlDock
          language={language}
          onLanguageChange={setLanguage}
          soundProfile={soundProfile}
          onSoundProfileChange={handleSoundProfileChange}
          mode={mode}
          onModeChange={setMode}
          modeOption={modeOption}
          onModeOptionChange={setModeOption}
          onOpenCustomModal={() => setIsCustomTextOpen(true)}
        />

        {/* Real-time Stats Cards */}
        <StatsBar
          language={language}
          mode={mode}
          stats={stats}
          timeLeft={timeLeft}
        />

        {/* GPU-Accelerated Typing Canvas */}
        <TypingArea
          targetText={targetText}
          typedText={typedText}
          currentQuote={currentQuote}
          status={status}
          onKeyDown={handleKey}
          onRestart={restart}
          onSpawnParticle={handleSpawnParticle}
        />

        {/* Zen Keyboard Visualizer */}
        <ZenKeyboard activeKey={activeKey} />
      </main>

      {/* Footer Zen Meditation */}
      <footer className="w-full py-4 text-center border-t border-[var(--border-color)] text-xs text-[var(--text-dim)] font-serif-vintage tracking-wider">
        <span className="opacity-70">
          {language === 'id'
            ? '"Tarik napas ketenangan, hembuskan keraguan. Setiap ketukan adalah satu langkah damai."'
            : '"Breathe in tranquility, breathe out hesitation. Every key is a single peaceful step."'}
        </span>
      </footer>

      {/* Completion Modal */}
      {status === 'completed' && (
        <ResultsModal stats={stats} onRestart={restart} />
      )}

      {/* Audio Settings Modal */}
      <AudioSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        soundProfile={soundProfile}
        onSoundProfileChange={handleSoundProfileChange}
        ambientSound={ambientSound}
        onAmbientSoundChange={handleAmbientSoundChange}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        ambientVolume={ambientVolume}
        onAmbientVolumeChange={handleAmbientVolumeChange}
      />

      {/* Custom Text Modal */}
      <CustomTextModal
        isOpen={isCustomTextOpen}
        onClose={() => setIsCustomTextOpen(false)}
        onSubmit={setCustomText}
      />
    </div>
  );
};

export default App;
