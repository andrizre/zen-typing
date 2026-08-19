import { useState, useEffect, useRef, useCallback } from 'react';
import { getRandomQuote, generateRandomWords } from '../data/quotes';
import type { QuoteItem, Language } from '../data/quotes';
import { soundEngine } from '../audio/soundEngine';

export type GameMode = 'quote' | 'timed' | 'words' | 'zen' | 'custom';

export interface TypingStats {
  rawWpm: number;
  netWpm: number;
  accuracy: number;
  totalKeystrokes: number;
  correctKeystrokes: number;
  errorKeystrokes: number;
  streak: number;
  maxStreak: number;
  elapsedSeconds: number;
  wpmHistory: { second: number; wpm: number }[];
}

interface UseTypingGameProps {
  onKeystroke?: (isError: boolean, streak: number, key: string) => void;
  onFinish?: (stats: TypingStats) => void;
}

export function useTypingGame({ onKeystroke, onFinish }: UseTypingGameProps = {}) {
  const [language, setLanguage] = useState<Language>('id');
  const [mode, setMode] = useState<GameMode>('quote');
  const [modeOption, setModeOption] = useState<number | string>('all');
  const [currentQuote, setCurrentQuote] = useState<QuoteItem | null>(null);
  
  const [targetText, setTargetText] = useState<string>('');
  const [typedText, setTypedText] = useState<string>('');
  
  const [status, setStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [, setEndTime] = useState<number | null>(null);
  
  // Timer for 'timed' mode
  const [timeLeft, setTimeLeft] = useState<number>(30);
  
  // Metrics & Stats
  const [stats, setStats] = useState<TypingStats>({
    rawWpm: 0,
    netWpm: 0,
    accuracy: 100,
    totalKeystrokes: 0,
    correctKeystrokes: 0,
    errorKeystrokes: 0,
    streak: 0,
    maxStreak: 0,
    elapsedSeconds: 0,
    wpmHistory: [],
  });

  const timerIntervalRef = useRef<number | null>(null);
  const statsIntervalRef = useRef<number | null>(null);
  const statsRef = useRef(stats);
  statsRef.current = stats;

  // Initialize text based on mode and language
  const loadNewText = useCallback(() => {
    if (mode === 'quote') {
      const q = getRandomQuote(language, typeof modeOption === 'string' ? modeOption : 'all');
      setCurrentQuote(q);
      setTargetText(q.text);
    } else if (mode === 'timed') {
      const duration = typeof modeOption === 'number' ? modeOption : 30;
      setTimeLeft(duration);
      setTargetText(generateRandomWords(120, language));
      setCurrentQuote(null);
    } else if (mode === 'words') {
      const count = typeof modeOption === 'number' ? modeOption : 25;
      setTargetText(generateRandomWords(count, language));
      setCurrentQuote(null);
    } else if (mode === 'zen') {
      setTargetText(generateRandomWords(150, language));
      setCurrentQuote(null);
    }
    
    setTypedText('');
    setStatus('idle');
    setStartTime(null);
    setEndTime(null);
    setStats({
      rawWpm: 0,
      netWpm: 0,
      accuracy: 100,
      totalKeystrokes: 0,
      correctKeystrokes: 0,
      errorKeystrokes: 0,
      streak: 0,
      maxStreak: 0,
      elapsedSeconds: 0,
      wpmHistory: [],
    });

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);
  }, [mode, modeOption, language]);

  useEffect(() => {
    loadNewText();
  }, [loadNewText]);

  // Finish session helper
  const completeGame = useCallback((finalStats: TypingStats) => {
    setStatus('completed');
    setEndTime(Date.now());
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);
    if (onFinish) {
      onFinish(finalStats);
    }
  }, [onFinish]);

  // Real-time metric updater loop
  useEffect(() => {
    if (status !== 'running' || !startTime) return;

    statsIntervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const elapsedSec = Math.max(0.5, (now - startTime) / 1000);
      const elapsedMin = elapsedSec / 60;
      const currentTyped = statsRef.current.totalKeystrokes;
      const currentCorrect = statsRef.current.correctKeystrokes;
      const currentErrors = statsRef.current.errorKeystrokes;

      const raw = Math.round((currentTyped / 5) / elapsedMin);
      const net = Math.max(0, Math.round(((currentCorrect - currentErrors) / 5) / elapsedMin));
      const acc = currentTyped > 0 ? Math.round((currentCorrect / currentTyped) * 100) : 100;

      setStats(prev => ({
        ...prev,
        rawWpm: raw,
        netWpm: net,
        accuracy: acc,
        elapsedSeconds: Math.round(elapsedSec),
        wpmHistory: [...prev.wpmHistory, { second: Math.round(elapsedSec), wpm: net }],
      }));
    }, 1000);

    return () => {
      if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);
    };
  }, [status, startTime]);

  // Timed mode countdown loop
  useEffect(() => {
    if (status !== 'running' || mode !== 'timed') return;

    timerIntervalRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current!);
          completeGame(statsRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [status, mode, completeGame]);

  // Handle Keystroke
  const handleKey = useCallback((e: React.KeyboardEvent | KeyboardEvent) => {
    if (e.key === 'Escape' || (e.key === 'Tab' && e.shiftKey)) {
      e.preventDefault();
      loadNewText();
      return;
    }

    if (status === 'completed') return;

    if (
      e.ctrlKey || e.metaKey || e.altKey ||
      ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown', 'Insert'].includes(e.key)
    ) {
      return;
    }

    soundEngine.playKey(e.key);

    let currentStart = startTime;
    if (status === 'idle') {
      currentStart = Date.now();
      setStartTime(currentStart);
      setStatus('running');
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      if (typedText.length > 0) {
        setTypedText(prev => prev.slice(0, -1));
        setStats(prev => ({
          ...prev,
          streak: 0,
        }));
      }
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();
      const nextChar = e.key;
      const targetChar = targetText[typedText.length];
      const isCorrect = nextChar === targetChar;

      const newTyped = typedText + nextChar;
      setTypedText(newTyped);

      if (mode === 'zen' && newTyped.length >= targetText.length - 20) {
        setTargetText(prev => prev + ' ' + generateRandomWords(40, language));
      }

      setStats(prev => {
        const total = prev.totalKeystrokes + 1;
        const correct = isCorrect ? prev.correctKeystrokes + 1 : prev.correctKeystrokes;
        const error = !isCorrect ? prev.errorKeystrokes + 1 : prev.errorKeystrokes;
        const streak = isCorrect ? prev.streak + 1 : 0;
        const maxStreak = Math.max(prev.maxStreak, streak);
        const acc = Math.round((correct / total) * 100);

        const now = Date.now();
        const elapsedSec = Math.max(0.5, (now - (currentStart || now)) / 1000);
        const raw = Math.round((total / 5) / (elapsedSec / 60));
        const net = Math.max(0, Math.round(((correct - error) / 5) / (elapsedSec / 60)));

        const updated: TypingStats = {
          ...prev,
          totalKeystrokes: total,
          correctKeystrokes: correct,
          errorKeystrokes: error,
          streak,
          maxStreak,
          accuracy: acc,
          rawWpm: raw,
          netWpm: net,
          elapsedSeconds: Math.round(elapsedSec),
        };

        if (onKeystroke) {
          onKeystroke(!isCorrect, streak, nextChar);
        }

        if (mode !== 'zen' && mode !== 'timed' && newTyped.length >= targetText.length) {
          setTimeout(() => completeGame(updated), 50);
        }

        return updated;
      });
    }
  }, [status, startTime, typedText, targetText, mode, language, onKeystroke, completeGame, loadNewText]);

  const setCustomText = (text: string) => {
    setMode('custom');
    setTargetText(text.trim());
    setCurrentQuote(null);
    setTypedText('');
    setStatus('idle');
    setStartTime(null);
    setEndTime(null);
    setStats({
      rawWpm: 0,
      netWpm: 0,
      accuracy: 100,
      totalKeystrokes: 0,
      correctKeystrokes: 0,
      errorKeystrokes: 0,
      streak: 0,
      maxStreak: 0,
      elapsedSeconds: 0,
      wpmHistory: [],
    });
  };

  return {
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
    restart: loadNewText,
    setCustomText,
  };
}
