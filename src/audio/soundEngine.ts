// High-Performance Web Audio API Procedural Synthesizer for Zero-Latency Typing

export type SoundProfile = 'thock' | 'typewriter' | 'silent';
export type AmbientSound = 'off' | 'rain';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  
  private ambientNodes: {
    sources: AudioNode[];
    intervalId?: number;
  } | null = null;

  private currentProfile: SoundProfile = 'thock';
  private currentAmbient: AmbientSound = 'off';
  private masterVolume: number = 0.85;
  private ambientVolume: number = 0.25;
  private isMuted: boolean = false;

  private noiseBuffers: { [key: string]: AudioBuffer } = {};
  private isInitialized: boolean = false;

  private initContext() {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass({ latencyHint: 'interactive' });

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : this.ambientVolume, this.ctx.currentTime);
      this.ambientGain.connect(this.ctx.destination);

      this.generateNoiseBuffers();
      this.isInitialized = true;
    } catch {
      // AudioContext fallback
    }
  }

  private generateNoiseBuffers() {
    if (!this.ctx) return;

    // 1-second white noise buffer (reused permanently)
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = sampleRate;
    
    const whiteBuffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const whiteOut = whiteBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      whiteOut[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffers['white'] = whiteBuffer;

    // 1-second pink noise buffer (reused permanently)
    const pinkBuffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const pinkOut = pinkBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      pinkOut[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    this.noiseBuffers['pink'] = pinkBuffer;
  }

  // --- Optimized Thock Synthesis ---
  private playThock(keyType: 'normal' | 'space' | 'enter' | 'backspace') {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const jitter = 0.96 + Math.random() * 0.08;

    let baseFreq = 160 * jitter;
    let endFreq = 42 * jitter;
    let bodyDuration = 0.055;
    let clickFreq = 1200 * jitter;
    let gainLevel = 0.7;

    if (keyType === 'space') {
      baseFreq = 105 * jitter;
      endFreq = 32 * jitter;
      bodyDuration = 0.075;
      clickFreq = 750 * jitter;
      gainLevel = 0.95;
    } else if (keyType === 'enter') {
      baseFreq = 135 * jitter;
      endFreq = 38 * jitter;
      bodyDuration = 0.065;
      clickFreq = 950 * jitter;
      gainLevel = 0.85;
    } else if (keyType === 'backspace') {
      baseFreq = 180 * jitter;
      endFreq = 50 * jitter;
      bodyDuration = 0.045;
      clickFreq = 1400 * jitter;
      gainLevel = 0.65;
    }

    // Body Oscillator
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(10, endFreq), now + bodyDuration);

    oscGain.gain.setValueAtTime(gainLevel, now);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + bodyDuration);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + bodyDuration + 0.01);

    // Transient Noise
    if (this.noiseBuffers['pink']) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuffers['pink'];
      noise.playbackRate.value = 0.9 + Math.random() * 0.2;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(clickFreq, now);
      noiseFilter.Q.setValueAtTime(2.2, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(gainLevel * 0.6, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain);

      noise.start(now);
      noise.stop(now + 0.025);
    }
  }

  // --- Optimized Vintage Typewriter Synthesis ---
  private playTypewriter(keyType: 'normal' | 'space' | 'enter' | 'backspace') {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const jitter = 0.95 + Math.random() * 0.1;

    if (keyType === 'enter') {
      this.playTypewriterBell(now);
      return;
    }

    if (keyType === 'space') {
      this.playTypewriterSpace(now, jitter);
      return;
    }

    // Strike Noise
    if (this.noiseBuffers['white']) {
      const strikeNoise = this.ctx.createBufferSource();
      strikeNoise.buffer = this.noiseBuffers['white'];
      strikeNoise.playbackRate.value = 1.0 + Math.random() * 0.3;

      const strikeFilter = this.ctx.createBiquadFilter();
      strikeFilter.type = 'bandpass';
      strikeFilter.frequency.setValueAtTime(3600 * jitter, now);
      strikeFilter.Q.setValueAtTime(4.5, now);

      const strikeGain = this.ctx.createGain();
      strikeGain.gain.setValueAtTime(0.75, now);
      strikeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

      strikeNoise.connect(strikeFilter);
      strikeFilter.connect(strikeGain);
      strikeGain.connect(this.masterGain);

      strikeNoise.start(now);
      strikeNoise.stop(now + 0.022);
    }

    // Hammer Ring Oscillator
    const ringOsc = this.ctx.createOscillator();
    const ringGain = this.ctx.createGain();
    ringOsc.type = 'sine';
    ringOsc.frequency.setValueAtTime(840 * jitter, now);
    ringGain.gain.setValueAtTime(0.25, now);
    ringGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    ringOsc.connect(ringGain);
    ringGain.connect(this.masterGain);
    ringOsc.start(now);
    ringOsc.stop(now + 0.065);
  }

  private playTypewriterSpace(now: number, jitter: number) {
    if (!this.ctx || !this.masterGain) return;

    const thud = this.ctx.createOscillator();
    const thudGain = this.ctx.createGain();
    thud.type = 'triangle';
    thud.frequency.setValueAtTime(120 * jitter, now);
    thud.frequency.exponentialRampToValueAtTime(35, now + 0.07);

    thudGain.gain.setValueAtTime(0.8, now);
    thudGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

    thud.connect(thudGain);
    thudGain.connect(this.masterGain);
    thud.start(now);
    thud.stop(now + 0.075);
  }

  private playTypewriterBell(now: number) {
    if (!this.ctx || !this.masterGain) return;

    const fundamentalFreq = 2093;
    [1, 2.76].forEach((ratio, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const bell = this.ctx.createOscillator();
      const bellGain = this.ctx.createGain();
      bell.type = 'sine';
      bell.frequency.setValueAtTime(fundamentalFreq * ratio, now);

      const volume = idx === 0 ? 0.55 : 0.2;
      const decay = idx === 0 ? 0.75 : 0.4;

      bellGain.gain.setValueAtTime(volume, now);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      bell.connect(bellGain);
      bellGain.connect(this.masterGain);
      bell.start(now);
      bell.stop(now + decay + 0.02);
    });
  }

  public setAmbient(type: AmbientSound) {
    this.initContext();
    this.currentAmbient = type;
    this.stopAmbient();

    if (type === 'off' || !this.ctx || !this.ambientGain) return;

    if (type === 'rain') {
      this.startRainAmbient();
    }
  }

  private stopAmbient() {
    if (this.ambientNodes) {
      this.ambientNodes.sources.forEach(node => {
        try {
          if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
            (node as AudioScheduledSourceNode).stop();
          }
          node.disconnect();
        } catch {
          // ignore disconnect errors
        }
      });
      if (this.ambientNodes.intervalId) {
        window.clearInterval(this.ambientNodes.intervalId);
      }
      this.ambientNodes = null;
    }
  }

  private startRainAmbient() {
    if (!this.ctx || !this.ambientGain || !this.noiseBuffers['pink']) return;

    const sources: AudioNode[] = [];

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffers['pink'];
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(550, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.45, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ambientGain);

    noise.start();
    sources.push(noise, filter, gain);

    const intervalId = window.setInterval(() => {
      if (!this.ctx || !this.ambientGain || this.currentAmbient !== 'rain') return;
      const now = this.ctx.currentTime;
      const drop = this.ctx.createOscillator();
      const dropGain = this.ctx.createGain();
      const freq = 1400 + Math.random() * 1200;

      drop.type = 'sine';
      drop.frequency.setValueAtTime(freq, now);
      drop.frequency.exponentialRampToValueAtTime(freq * 0.6, now + 0.035);

      dropGain.gain.setValueAtTime(0.025, now);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      drop.connect(dropGain);
      dropGain.connect(this.ambientGain);

      drop.start(now);
      drop.stop(now + 0.04);
    }, 280);

    this.ambientNodes = { sources, intervalId };
  }

  public playKey(key: string) {
    this.initContext();
    if (this.isMuted || this.currentProfile === 'silent') return;

    let keyType: 'normal' | 'space' | 'enter' | 'backspace' = 'normal';
    if (key === ' ' || key === 'Space') keyType = 'space';
    else if (key === 'Enter') keyType = 'enter';
    else if (key === 'Backspace') keyType = 'backspace';

    if (this.currentProfile === 'thock') {
      this.playThock(keyType);
    } else if (this.currentProfile === 'typewriter') {
      this.playTypewriter(keyType);
    }
  }

  public setProfile(profile: SoundProfile) {
    this.currentProfile = profile;
  }

  public getProfile(): SoundProfile {
    return this.currentProfile;
  }

  public setMasterVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
  }

  public setAmbientVolume(vol: number) {
    this.ambientVolume = Math.max(0, Math.min(1, vol));
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : this.ambientVolume, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ctx) {
      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
      }
      if (this.ambientGain) {
        this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : this.ambientVolume, this.ctx.currentTime);
      }
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getAmbient(): AmbientSound {
    return this.currentAmbient;
  }
}

export const soundEngine = new SoundEngine();
