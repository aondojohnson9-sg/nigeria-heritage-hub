export interface QuizRecord {
  best: number;
  plays: number;
}

export interface UserSettings {
  sound: boolean;
  haptics: boolean;
  motion: 'auto' | 'reduced';
  pidgin: boolean;
}

export interface ProgressState {
  name: string;
  xp: number;
  streak: number;
  bestStreak: number;
  lastDay: string | null;
  learned: Record<string, string[]>;
  quizzes: Record<string, QuizRecord>;
  daily: Record<string, boolean>;
  answered: number;
  correct: number;
  xpByDay: Record<string, number>;
  notifsSeen: number;
  missed: Record<string, number>;
  fixed: number;
  settings: UserSettings;
}

// Merge two progress snapshots (device ↔ server) without losing either side's work.
const maxN = (x = 0, y = 0) => Math.max(x, y);
const union = (x: string[] = [], y: string[] = []) => [...new Set([...x, ...y])];
const maxMap = (a: Record<string, number> = {}, b: Record<string, number> = {}) => {
  const o: Record<string, number> = { ...a };
  for (const [k, v] of Object.entries(b)) o[k] = maxN(o[k], v);
  return o;
};

export function mergeProgress(a: ProgressState, b?: Partial<ProgressState> | null): ProgressState {
  if (!b) return a;
  const learned: Record<string, string[]> = {};
  for (const k of new Set([...Object.keys(a.learned || {}), ...Object.keys(b.learned || {})])) {
    learned[k] = union(a.learned?.[k], b.learned?.[k]);
  }
  const quizzes: Record<string, QuizRecord> = {};
  for (const k of new Set([...Object.keys(a.quizzes || {}), ...Object.keys(b.quizzes || {})])) {
    const x = a.quizzes?.[k] || { best: 0, plays: 0 };
    const y = b.quizzes?.[k] || { best: 0, plays: 0 };
    quizzes[k] = { best: maxN(x.best, y.best), plays: maxN(x.plays, y.plays) };
  }
  const newer = (a.lastDay || '') >= (b.lastDay || '') ? a : b;
  return {
    ...a,
    name: a.name && a.name !== 'Explorer' ? a.name : b.name || a.name,
    xp: maxN(a.xp, b.xp),
    streak: newer.streak || 0,
    bestStreak: maxN(a.bestStreak, b.bestStreak),
    lastDay: newer.lastDay || null,
    learned,
    quizzes,
    daily: { ...(b.daily || {}), ...(a.daily || {}) },
    answered: maxN(a.answered, b.answered),
    correct: maxN(a.correct, b.correct),
    fixed: maxN(a.fixed, b.fixed),
    xpByDay: maxMap(a.xpByDay, b.xpByDay),
    missed: maxMap(a.missed, b.missed),
    notifsSeen: maxN(a.notifsSeen, b.notifsSeen),
    settings: a.settings,
  };
}

/** Deterministic JSON (sorted keys) so two equal snapshots compare equal. */
export function stable(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(stable).join(',')}]`;
  if (v && typeof v === 'object') {
    const obj = v as Record<string, unknown>;
    return `{${Object.keys(obj)
      .sort()
      .filter((k) => obj[k] !== undefined)
      .map((k) => `${JSON.stringify(k)}:${stable(obj[k])}`)
      .join(',')}}`;
  }
  return JSON.stringify(v);
}

