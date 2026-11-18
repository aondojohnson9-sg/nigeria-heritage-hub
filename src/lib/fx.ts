import { Platform, Vibration } from 'react-native';

// Tiny sound + haptics engine. Tones are synthesised with Web Audio on web, safe no-op on native.
let soundOn = true;
let hapticsOn = true;
let ctx: AudioContext | null = null;

export const configureFx = ({
  sound,
  haptics,
}: {
  sound: boolean;
  haptics: boolean;
}) => {
  soundOn = sound;
  hapticsOn = haptics;
};

function audio(): AudioContext | null {
  if (!soundOn || Platform.OS !== 'web') return null;
  try {
    if (!ctx) {
      const g = globalThis as unknown as {
        AudioContext?: typeof AudioContext;
        webkitAudioContext?: typeof AudioContext;
      };
      const AC = g.AudioContext || g.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  } catch {
    return null;
  }
}

function tone(
  freq: number,
  start = 0,
  dur = 0.14,
  type: OscillatorType = 'triangle',
  vol = 0.1
) {
  const c = audio();
  if (!c) return;
  try {
    const t = c.currentTime + start;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(c.destination);
    o.start(t);
    o.stop(t + dur + 0.05);
  } catch {
    /* ignore */
  }
}

export const haptic = (pattern: number | number[] = 10) => {
  if (!hapticsOn) return;
  try {
    if (Platform.OS === 'web') {
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        navigator.vibrate(pattern);
      }
    } else {
      Vibration.vibrate(pattern);
    }
  } catch {
    /* ignore */
  }
};

export const sfx = {
  tap: () => {
    tone(540, 0, 0.05, 'triangle', 0.06);
    haptic(6);
  },
  select: () => {
    tone(700, 0, 0.07, 'triangle', 0.07);
    haptic(8);
  },
  correct: () => {
    tone(660, 0, 0.12);
    tone(880, 0.09, 0.2);
    haptic([12, 40, 18]);
  },
  wrong: () => {
    tone(230, 0, 0.18, 'sawtooth', 0.06);
    tone(170, 0.13, 0.26, 'sawtooth', 0.06);
    haptic([40, 40, 60]);
  },
  win: () => {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.26));
    haptic([20, 40, 20, 40, 40]);
  },
  xp: () => {
    tone(988, 0, 0.08, 'square', 0.04);
    tone(1319, 0.07, 0.12, 'square', 0.04);
  },
  pop: () => {
    tone(420, 0, 0.06, 'sine', 0.09);
    tone(840, 0.04, 0.08, 'sine', 0.07);
    haptic(8);
  },
};

