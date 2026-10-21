/**
 * Web Audio Engine for preview playback & synthesized beats
 * and direct file download generator.
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isBeatPlaying = false;
let beatTimer: number | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.7;
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setMasterVolume(volume: number) {
  if (masterGain) {
    masterGain.gain.value = Math.max(0, Math.min(1, volume));
  }
}

export function playSynthBeat(bpm = 138, onStep?: (beat: number) => void) {
  stopSynthBeat();
  const ctx = getAudioContext();
  isBeatPlaying = true;
  let step = 0;
  const interval = (60 / bpm / 4) * 1000;

  const tick = () => {
    if (!isBeatPlaying) return;
    const now = ctx.currentTime;

    // Kick on 0, 4, 8, 12 (4/4 time)
    if (step % 4 === 0) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.14);
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(masterGain!);
      osc.start(now);
      osc.stop(now + 0.25);
    }

    // Snare / Dholak crack on 4, 12
    if (step % 8 === 4) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.connect(gain);
      gain.connect(masterGain!);
      osc.start(now);
      osc.stop(now + 0.16);
    }

    // Hi-hat / shaker on every 2 steps
    if (step % 2 === 0) {
      const bufferSize = ctx.sampleRate * 0.04;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 7500;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain!);
      noise.start(now);
      noise.stop(now + 0.05);
    }

    // Bassline synth note
    if (step % 4 === 2) {
      const bass = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bass.type = 'sawtooth';
      const notes = [55, 65.4, 73.4, 82.4];
      const freq = notes[Math.floor(step / 8) % notes.length];
      bass.frequency.setValueAtTime(freq, now);
      bassGain.gain.setValueAtTime(0.25, now);
      bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      bass.connect(bassGain);
      bassGain.connect(masterGain!);
      bass.start(now);
      bass.stop(now + 0.2);
    }

    if (onStep) {
      onStep(step % 16);
    }

    step = (step + 1) % 64;
    beatTimer = window.setTimeout(tick, interval);
  };

  tick();
}

export function stopSynthBeat() {
  isBeatPlaying = false;
  if (beatTimer !== null) {
    clearTimeout(beatTimer);
    beatTimer = null;
  }
}

/**
 * Generates an actual playable audio file blob (WAV container with proper PCM data)
 * so that when the user clicks download, they get a real functioning audio file!
 */
export function generatePlayableAudioBlob(songTitle: string, durationSec = 15): Blob {
  const sampleRate = 22050;
  const numChannels = 2;
  const numSamples = sampleRate * durationSec;
  const bytesPerSample = 2; // 16-bit
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // Write RIFF Header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');

  // Write fmt Chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // BitsPerSample

  // Write data Chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Synthesize musical audio track into the buffer
  let offset = 44;
  const bpm = 138;
  const samplesPerBeat = (sampleRate * 60) / bpm;

  for (let i = 0; i < numSamples; i++) {
    const beatIndex = Math.floor(i / samplesPerBeat);
    const beatFraction = (i % samplesPerBeat) / samplesPerBeat;
    const t = i / sampleRate;

    // Sub-bass kick on quarter notes
    let sample = 0;
    if (beatFraction < 0.3) {
      const kickFreq = 120 * Math.exp(-beatFraction * 14) + 40;
      sample += Math.sin(2 * Math.PI * kickFreq * t) * (1 - beatFraction / 0.3) * 0.6;
    }

    // Melodic synth tone
    const chordFrequencies = [220, 261.63, 329.63, 392.0];
    const baseFreq = chordFrequencies[beatIndex % chordFrequencies.length];
    sample += Math.sin(2 * Math.PI * baseFreq * t) * 0.2;
    sample += Math.sin(2 * Math.PI * baseFreq * 2 * t) * 0.08;

    // Hi-hat noise on offbeats
    if (beatFraction > 0.45 && beatFraction < 0.65) {
      sample += (Math.random() * 2 - 1) * 0.12;
    }

    // Soft clip
    sample = Math.max(-1, Math.min(1, sample));
    const intSample = sample < 0 ? sample * 32768 : sample * 32767;

    // Left channel
    view.setInt16(offset, intSample, true);
    // Right channel
    view.setInt16(offset + 2, intSample, true);
    offset += 4;
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Triggers direct browser download of the song audio file
 */
export function triggerFileDownload(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
