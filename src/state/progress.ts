import { createContext, useContext } from 'react';
import type { ProgressState, UserSettings } from '../lib/merge';

export interface Achievement {
  id: string;
  emoji: string;
  name: string;
  desc: string;
  value: number;
  goal: number;
  done: boolean;
}

export interface ProgressContextValue extends ProgressState {
  raw: ProgressState;
  missedCount: number;
  streakAlive: boolean;
  overall: number;
  learnedTotal: number;
  dailyDone: boolean;
  achievements: Achievement[];
  level: { level: number; into: number; next: number };
  addMiss: (key?: string) => void;
  clearMiss: (key?: string) => void;
  mergeIn: (remote: Partial<ProgressState>) => void;
  markLearned: (mod: string, id: string, xp?: number) => boolean;
  recordQuiz: (id: string, result: { correct: number; total: number; xp: number }) => void;
  addXP: (n: number) => void;
  setName: (name: string) => void;
  setSetting: <K extends keyof UserSettings>(k: K, v: UserSettings[K]) => void;
  markNotifsSeen: (n: number) => void;
  reset: () => void;
  moduleProgress: (id: string) => number;
}

export const Ctx = createContext<ProgressContextValue | null>(null);

export const useProgress = (): ProgressContextValue => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
};

export const starsFor = (pct: number): number =>
  pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 50 ? 1 : 0;

export const levelOf = (xp: number) => ({
  level: Math.floor(xp / 100) + 1,
  into: xp % 100,
  next: 100,
});

