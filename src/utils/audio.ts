/**
 * Audio helper utilities for Inès Guillemet Voice Assistant
 * Supports 16kHz PCM input capture for Gemini Live and 24kHz PCM playback / WAV playback
 */

// Convert Float32 array from Web Audio API to 16-bit PCM ArrayBuffer
export function floatTo16BitPCM(input: Float32Array): ArrayBuffer {
  const output = new DataView(new ArrayBuffer(input.length * 2));
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return output.buffer;
}

// Convert ArrayBuffer to Base64 string
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Convert Base64 string to Int16Array
export function base64ToInt16Array(base64: string): Int16Array {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Int16Array(bytes.buffer);
}

// Convert Int16Array PCM at 24kHz to AudioBuffer in Web Audio API
export function createAudioBufferFromPCM(
  ctx: AudioContext,
  pcmData: Int16Array,
  sampleRate = 24000
): AudioBuffer {
  const audioBuffer = ctx.createBuffer(1, pcmData.length, sampleRate);
  const channelData = audioBuffer.getChannelData(0);
  for (let i = 0; i < pcmData.length; i++) {
    channelData[i] = pcmData[i] / 32768.0;
  }
  return audioBuffer;
}

/**
 * Sequential PCM Audio Queue Player for Gemini Live 24kHz streaming
 */
export class LiveAudioPlayer {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private nextPlayTime = 0;
  private isPlaying = false;
  private sources: AudioBufferSourceNode[] = [];

  constructor() {
    // AudioContext will be initialized on user interaction
  }

  public init(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx({ sampleRate: 24000 });
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playChunk(base64PCM: string): void {
    const ctx = this.init();
    const pcm = base64ToInt16Array(base64PCM);
    if (pcm.length === 0) return;

    const buffer = createAudioBufferFromPCM(ctx, pcm, 24000);
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    if (this.analyser) {
      source.connect(this.analyser);
    } else {
      source.connect(ctx.destination);
    }

    const currentTime = ctx.currentTime;
    if (this.nextPlayTime < currentTime) {
      this.nextPlayTime = currentTime;
    }

    source.start(this.nextPlayTime);
    this.nextPlayTime += buffer.duration;
    this.isPlaying = true;
    this.sources.push(source);

    source.onended = () => {
      const idx = this.sources.indexOf(source);
      if (idx !== -1) {
        this.sources.splice(idx, 1);
      }
      if (this.sources.length === 0) {
        this.isPlaying = false;
      }
    };
  }

  public stop(): void {
    for (const src of this.sources) {
      try {
        src.stop();
        src.disconnect();
      } catch (e) {
        // ignore
      }
    }
    this.sources = [];
    if (this.ctx) {
      this.nextPlayTime = this.ctx.currentTime;
    }
    this.isPlaying = false;
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public getActive(): boolean {
    return this.isPlaying;
  }
}

/**
 * Microphone Recorder sending 16kHz PCM chunks
 */
export class LiveMicrophoneRecorder {
  private ctx: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private analyser: AnalyserNode | null = null;

  async start(
    onAudioChunk: (base64PCM: string) => void,
    onAnalyserReady?: (analyser: AnalyserNode) => void
  ): Promise<void> {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioCtx({ sampleRate: 16000 });
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        sampleRate: 16000,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    this.source = this.ctx.createMediaStreamSource(this.stream);
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 64;

    this.processor = this.ctx.createScriptProcessor(2048, 1, 1);

    this.source.connect(this.analyser);
    this.source.connect(this.processor);
    this.processor.connect(this.ctx.destination);

    if (onAnalyserReady && this.analyser) {
      onAnalyserReady(this.analyser);
    }

    this.processor.onaudioprocess = (e) => {
      const channelData = e.inputBuffer.getChannelData(0);
      const pcmBuffer = floatTo16BitPCM(channelData);
      const base64 = arrayBufferToBase64(pcmBuffer);
      onAudioChunk(base64);
    };
  }

  stop(): void {
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
    this.analyser = null;
  }

  getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }
}
