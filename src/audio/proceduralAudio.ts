/* ==========================================================================
   ALTO'S ADVENTURE INSPIRED AUDIO SOUNDSCAPE (proceduralAudio.ts)
   - 100% Code-Synthesized Alpine Mountain Wind & Felt-Piano Zen Arpeggiator
     (Zero external assets / zero audio file dependencies)
   - Plug-and-play support for local audio file (/audio/altos-adventure.mp3)
   - Conforms strictly to BRIEF.md & AGENTS.md
   ========================================================================== */

type AudioStateListener = (enabled: boolean) => void;

// Alto's Adventure Zen Progression (Torin Borrowdale style: Em - Cmaj7 - G - D)
const ALTO_CHORDS = [
  // Em: Root E2/E3, arpeggio B3, E4, G4, B4
  { bass: 82.41, harmony: [164.81, 246.94, 329.63, 392.0, 493.88] },
  // Cmaj7: Root C3, arpeggio G3, C4, E4, B4
  { bass: 130.81, harmony: [196.0, 261.63, 329.63, 392.0, 493.88] },
  // G: Root G2, arpeggio D3, G3, B3, D4
  { bass: 98.0, harmony: [146.83, 196.0, 246.94, 293.66, 392.0] },
  // Dadd9: Root D3, arpeggio A3, D4, F#4, A4
  { bass: 146.83, harmony: [220.0, 293.66, 369.99, 440.0, 587.33] },
];

class ProceduralAudioManager {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = false;
  private masterGain: GainNode | null = null;

  // Alpine Mountain Wind Generators
  private noiseSource: AudioBufferSourceNode | null = null;
  private windLowPass: BiquadFilterNode | null = null;
  private windBandPass: BiquadFilterNode | null = null;
  private windGain: GainNode | null = null;
  private gustLfo: OscillatorNode | null = null;
  private gustGain: GainNode | null = null;
  private airFilter: BiquadFilterNode | null = null;
  private airGain: GainNode | null = null;

  // Alto Zen Piano Arpeggiator Timer
  private pianoTimer: number | null = null;
  private currentChordIndex: number = 0;
  private currentNoteIndex: number = 0;
  private notesInChordPlayed: number = 0;

  // Optional HTML5 Audio element for user-provided file (/audio/altos-adventure.mp3)
  private fileAudioEl: HTMLAudioElement | null = null;
  private hasAudioFile: boolean = false;

  private currentChapter: string = 'morning';
  private lastSparkleTime: number = 0;
  private listeners: AudioStateListener[] = [];

  constructor() {
    this.probeLocalAudioFile();
  }

  /**
   * Checks if the user provided an Alto's Adventure audio file in /public/audio/
   */
  private async probeLocalAudioFile(): Promise<void> {
    // Only probe if user has explicitly enabled file-based audio; otherwise default
    // smoothly to the 100% code-generated Web Audio felt piano & wind engine
    if (typeof window !== 'undefined' && (window as unknown as { __ENABLE_AUDIO_FILE__?: boolean }).__ENABLE_AUDIO_FILE__) {
      const candidates = ['/audio/altos-adventure.mp3', '/audio/alto.mp3'];
      for (const path of candidates) {
        try {
          const res = await fetch(path, { method: 'HEAD' });
          if (res.ok) {
            this.fileAudioEl = new Audio(path);
            this.fileAudioEl.loop = true;
            this.fileAudioEl.volume = 0.45;
            this.hasAudioFile = true;
            break;
          }
        } catch {
          // Fallback to procedural engine
        }
      }
    }
  }

  public subscribe(fn: AudioStateListener): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn(this.isEnabled));
  }

  public get isActive(): boolean {
    return this.isEnabled;
  }

  /**
   * Enables sound on user interaction.
   */
  public async enable(): Promise<boolean> {
    if (this.isEnabled) return true;
    await this.ensureContext();
    this.isEnabled = true;
    this.updateMasterState();

    if (this.hasAudioFile && this.fileAudioEl) {
      this.fileAudioEl.play().catch(() => {});
    } else {
      this.startAltoPianoSequence();
    }

    this.playChimeNote(1760, 0.035, 1.8); // Gentle crystal chime
    this.notify();
    return true;
  }

  /**
   * Disables/mutes sound.
   */
  public disable(): void {
    if (!this.isEnabled) return;
    this.isEnabled = false;
    this.updateMasterState();

    if (this.fileAudioEl) {
      this.fileAudioEl.pause();
    }
    this.stopAltoPianoSequence();

    this.notify();
  }

  /**
   * Toggles sound state.
   */
  public async toggle(): Promise<boolean> {
    if (this.isEnabled) {
      this.disable();
      return false;
    } else {
      return await this.enable();
    }
  }

  private async ensureContext(): Promise<void> {
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) {
        console.warn('Web Audio API not supported in this browser.');
        return;
      }
      this.ctx = new AudioCtxClass();
      this.setupOrganicWindGraph();
    }

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  /**
   * Constructs the 100% code-synthesized Alpine Mountain Wind breeze.
   * Pure organic air currents with gentle LFO gust modulation (No engine buzzing).
   */
  private setupOrganicWindGraph(): void {
    if (!this.ctx) return;

    // 1. Master Output Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // 2. High-Entropy Velvet Pink Noise Buffer (4-second seamless loop)
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = sampleRate * 4;
    const noiseBuffer = this.ctx.createBuffer(2, bufferSize, sampleRate);
    const leftChannel = noiseBuffer.getChannelData(0);
    const rightChannel = noiseBuffer.getChannelData(1);

    let b0L = 0, b1L = 0, b2L = 0, b3L = 0, b4L = 0, b5L = 0;
    let b0R = 0, b1R = 0, b2R = 0, b3R = 0, b4R = 0, b5R = 0;

    for (let i = 0; i < bufferSize; i++) {
      const whiteL = Math.random() * 2 - 1;
      b0L = 0.99886 * b0L + whiteL * 0.0555179;
      b1L = 0.99332 * b1L + whiteL * 0.0750759;
      b2L = 0.96900 * b2L + whiteL * 0.1538520;
      b3L = 0.86650 * b3L + whiteL * 0.3104856;
      b4L = 0.55000 * b4L + whiteL * 0.5329522;
      b5L = -0.7616 * b5L - whiteL * 0.0168980;
      leftChannel[i] = (b0L + b1L + b2L + b3L + b4L + b5L + whiteL * 0.5362) * 0.045;

      const whiteR = Math.random() * 2 - 1;
      b0R = 0.99886 * b0R + whiteR * 0.0555179;
      b1R = 0.99332 * b1R + whiteR * 0.0750759;
      b2R = 0.96900 * b2R + whiteR * 0.1538520;
      b3R = 0.86650 * b3R + whiteR * 0.3104856;
      b4R = 0.55000 * b4R + whiteR * 0.5329522;
      b5R = -0.7616 * b5R - whiteR * 0.0168980;
      rightChannel[i] = (b0R + b1R + b2R + b3R + b4R + b5R + whiteR * 0.5362) * 0.045;
    }

    this.noiseSource = this.ctx.createBufferSource();
    this.noiseSource.buffer = noiseBuffer;
    this.noiseSource.loop = true;

    // 3. Stage 1: Soft Resonant Wind Low-Pass Filter
    this.windLowPass = this.ctx.createBiquadFilter();
    this.windLowPass.type = 'lowpass';
    this.windLowPass.frequency.setValueAtTime(460, this.ctx.currentTime);
    this.windLowPass.Q.setValueAtTime(0.7, this.ctx.currentTime);

    // 4. Stage 2: Mountain Breeze Bandpass Filter
    this.windBandPass = this.ctx.createBiquadFilter();
    this.windBandPass.type = 'bandpass';
    this.windBandPass.frequency.setValueAtTime(340, this.ctx.currentTime);
    this.windBandPass.Q.setValueAtTime(0.65, this.ctx.currentTime);

    // 5. Stage 3: Gentle Gust LFO (Sub-audible 0.05Hz sine wave mimicking natural mountain breeze)
    this.gustLfo = this.ctx.createOscillator();
    this.gustLfo.type = 'sine';
    this.gustLfo.frequency.setValueAtTime(0.05, this.ctx.currentTime); // 20-second organic breath

    this.gustGain = this.ctx.createGain();
    this.gustGain.gain.setValueAtTime(120, this.ctx.currentTime);
    this.gustLfo.connect(this.gustGain);
    this.gustGain.connect(this.windLowPass.frequency);
    this.gustLfo.start();

    // 6. Stage 4: High Alpine Air Shimmer
    this.airFilter = this.ctx.createBiquadFilter();
    this.airFilter.type = 'bandpass';
    this.airFilter.frequency.setValueAtTime(1500, this.ctx.currentTime);
    this.airFilter.Q.setValueAtTime(0.55, this.ctx.currentTime);

    this.airGain = this.ctx.createGain();
    this.airGain.gain.setValueAtTime(0.028, this.ctx.currentTime);

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0.16, this.ctx.currentTime);

    // Routing graph
    this.noiseSource.connect(this.windLowPass);
    this.windLowPass.connect(this.windBandPass);
    this.windBandPass.connect(this.windGain);
    this.windGain.connect(this.masterGain);

    this.noiseSource.connect(this.airFilter);
    this.airFilter.connect(this.airGain);
    this.airGain.connect(this.masterGain);

    this.noiseSource.start();

    this.applyChapterAtmosphere(this.currentChapter);
  }

  /**
   * Generative Alto's Adventure Felt-Piano Arpeggiator.
   * Plays contemplative, warm piano notes in an E minor / G major rolling progression.
   */
  private startAltoPianoSequence(): void {
    if (this.pianoTimer) return;

    const playNext = () => {
      if (!this.isEnabled) return;

      const chord = ALTO_CHORDS[this.currentChordIndex];
      let freq: number;
      let vol = 0.04;
      let decay = 2.6;

      // On new chord, play warm deep bass note
      if (this.notesInChordPlayed === 0) {
        freq = chord.bass;
        vol = 0.05;
        decay = 3.2;
      } else {
        // Play melodic arpeggio note
        freq = chord.harmony[this.currentNoteIndex % chord.harmony.length];
        this.currentNoteIndex++;
      }

      this.notesInChordPlayed++;
      // Stereo placement across the stereo field (-0.25 to +0.25)
      const pan = (Math.random() - 0.5) * 0.5;
      this.playFeltPiano(freq, vol, decay, pan);

      // Transition to next chord after 4 to 5 arpeggio notes
      if (this.notesInChordPlayed >= 4) {
        this.notesInChordPlayed = 0;
        this.currentChordIndex = (this.currentChordIndex + 1) % ALTO_CHORDS.length;
      }

      // Next note scheduled with natural, humanized rubato (1.3s to 1.9s)
      const delay = 1400 + Math.random() * 500;
      this.pianoTimer = window.setTimeout(playNext, delay);
    };

    // Initial first note after 600ms
    this.pianoTimer = window.setTimeout(playNext, 600);
  }

  private stopAltoPianoSequence(): void {
    if (this.pianoTimer) {
      window.clearTimeout(this.pianoTimer);
      this.pianoTimer = null;
    }
    this.notesInChordPlayed = 0;
  }

  /**
   * Synthesizes an acoustic felt-piano note with multi-harmonic warmth and rapid felt damping.
   */
  public playFeltPiano(freq: number, volume: number = 0.04, decay: number = 2.6, pan: number = 0): void {
    if (!this.ctx || !this.isEnabled || !this.masterGain) return;

    const audioNow = this.ctx.currentTime;

    // 1. Fundamental sine wave
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, audioNow);

    // 2. Second harmonic (soft wooden body resonance)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, audioNow);

    // 3. Third harmonic (gentle chime presence)
    const osc3 = this.ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3, audioNow);

    // Filter simulating soft hammer felt dampening high frequencies rapidly
    const feltFilter = this.ctx.createBiquadFilter();
    feltFilter.type = 'lowpass';
    feltFilter.frequency.setValueAtTime(Math.min(1300, freq * 4.5), audioNow);
    feltFilter.frequency.exponentialRampToValueAtTime(Math.min(420, freq * 1.4), audioNow + 0.3);

    const gain1 = this.ctx.createGain();
    const gain2 = this.ctx.createGain();
    const gain3 = this.ctx.createGain();
    const noteGain = this.ctx.createGain();

    gain1.gain.setValueAtTime(1.0, audioNow);
    gain2.gain.setValueAtTime(0.24, audioNow);
    gain3.gain.setValueAtTime(0.05, audioNow);

    // Soft felt attack (14ms) + long singing decay
    noteGain.gain.setValueAtTime(0.0001, audioNow);
    noteGain.gain.linearRampToValueAtTime(volume, audioNow + 0.016);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, audioNow + decay);

    let outputNode: AudioNode = noteGain;
    if (typeof this.ctx.createStereoPanner === 'function') {
      const panner = this.ctx.createStereoPanner();
      panner.pan.setValueAtTime(pan, audioNow);
      noteGain.connect(panner);
      outputNode = panner;
    }

    osc1.connect(gain1);
    osc2.connect(gain2);
    osc3.connect(gain3);

    gain1.connect(feltFilter);
    gain2.connect(feltFilter);
    gain3.connect(feltFilter);

    feltFilter.connect(noteGain);
    outputNode.connect(this.masterGain);

    osc1.start(audioNow);
    osc2.start(audioNow);
    osc3.start(audioNow);

    osc1.stop(audioNow + decay + 0.1);
    osc2.stop(audioNow + decay + 0.1);
    osc3.stop(audioNow + decay + 0.1);
  }

  /**
   * Smoothly fades master volume in or out (800ms fade-in, 400ms fade-out).
   */
  private updateMasterState(): void {
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);

    if (this.isEnabled) {
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.48, now + 0.8);
    } else {
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0, now + 0.4);
    }
  }

  /**
   * Adapts the wind parameters to the active chapter.
   */
  public setChapter(chapter: string): void {
    this.currentChapter = chapter;
    if (!this.ctx || !this.isEnabled) return;
    this.applyChapterAtmosphere(chapter);
  }

  private applyChapterAtmosphere(chapter: string): void {
    if (!this.ctx || !this.windLowPass || !this.windBandPass || !this.airFilter) return;

    const now = this.ctx.currentTime;
    const ramp = 3.0;

    switch (chapter) {
      case 'morning':
        // Dawn: Fresh morning mountain breeze, light crisp air
        this.windLowPass.frequency.linearRampToValueAtTime(500, now + ramp);
        this.windBandPass.frequency.linearRampToValueAtTime(360, now + ramp);
        this.airFilter.frequency.linearRampToValueAtTime(1700, now + ramp);
        break;

      case 'afternoon':
        // Solar Zenith: Warm, open midday air
        this.windLowPass.frequency.linearRampToValueAtTime(560, now + ramp);
        this.windBandPass.frequency.linearRampToValueAtTime(400, now + ramp);
        this.airFilter.frequency.linearRampToValueAtTime(1500, now + ramp);
        break;

      case 'sunset':
        // Dusk Warmth: Soft, descending twilight breeze
        this.windLowPass.frequency.linearRampToValueAtTime(400, now + ramp);
        this.windBandPass.frequency.linearRampToValueAtTime(300, now + ramp);
        this.airFilter.frequency.linearRampToValueAtTime(1300, now + ramp);
        break;

      case 'evening':
        // Evening Calm: Gentle dusk whisper
        this.windLowPass.frequency.linearRampToValueAtTime(360, now + ramp);
        this.windBandPass.frequency.linearRampToValueAtTime(260, now + ramp);
        this.airFilter.frequency.linearRampToValueAtTime(1100, now + ramp);
        break;

      case 'night':
        // Midnight Nocturne: Quiet nocturnal breath of wind
        this.windLowPass.frequency.linearRampToValueAtTime(300, now + ramp);
        this.windBandPass.frequency.linearRampToValueAtTime(220, now + ramp);
        this.airFilter.frequency.linearRampToValueAtTime(950, now + ramp);
        break;
    }
  }

  /**
   * Helper to play an individual crystalline wind chime note.
   */
  private playChimeNote(freq: number, volume: number = 0.03, decay: number = 1.6): void {
    if (!this.ctx || !this.masterGain) return;

    const audioNow = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioNow);

    gain.gain.setValueAtTime(volume, audioNow);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioNow + decay);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(audioNow);
    osc.stop(audioNow + decay + 0.05);
  }

  /**
   * Procedural Starlight Chime Sparkle (Delicate crystalline glass chime).
   */
  public playSparkle(): void {
    if (!this.ctx || !this.isEnabled || !this.masterGain) return;

    const now = performance.now();
    if (now - this.lastSparkleTime < 380) return;
    this.lastSparkleTime = now;

    // High serene pentatonic glass tones (G6, A6, C7, D7, E7)
    const tones = [1567.98, 1760.0, 2093.0, 2349.32, 2637.02];
    const pitch = tones[Math.floor(Math.random() * tones.length)];

    this.playChimeNote(pitch, 0.022, 0.75);
  }

  /**
   * Procedural Mascot Pop / Chirp (Cute cheerful soft bubble drop).
   */
  public playPop(): void {
    if (!this.ctx || !this.isEnabled || !this.masterGain) return;

    const audioNow = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(620, audioNow);
    osc.frequency.exponentialRampToValueAtTime(320, audioNow + 0.12);

    gain.gain.setValueAtTime(0.05, audioNow);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioNow + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(audioNow);
    osc.stop(audioNow + 0.16);
  }
}

export const proceduralAudio = new ProceduralAudioManager();

/**
 * Initializes global keyboard shortcut ('M') for muting/unmuting.
 */
export function initProceduralAudio(): void {
  window.addEventListener('keydown', (e) => {
    if ((e.key === 'm' || e.key === 'M') && !e.repeat) {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }
      proceduralAudio.toggle();
    }
  });
}
