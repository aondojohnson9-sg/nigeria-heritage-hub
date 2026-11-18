import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MODULES } from '../data/modules';
import { dayKey } from '../data/quizzes';
import { configureFx } from '../lib/fx';
import { mergeProgress, stable, type ProgressState, type UserSettings } from '../lib/merge';
import { storage } from '../lib/storage';
import { Ctx, levelOf, starsFor, type Achievement, type ProgressContextValue } from './progress';

const KEY = 'heritagehub.v1';

const DEFAULTS: ProgressState = {
  name: 'Explorer',
  xp: 0,
  streak: 0,
  bestStreak: 0,
  lastDay: null,
  learned: {},
  quizzes: {},
  daily: {},
  answered: 0,
  correct: 0,
  xpByDay: {},
  notifsSeen: 0,
  missed: {},
  fixed: 0,
  settings: { sound: true, haptics: true, motion: 'auto', pidgin: true },
};

function load(): ProgressState {
  try {
    const raw = storage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw) as Partial<ProgressState>;
      return {
        ...DEFAULTS,
        ...s,
        settings: { ...DEFAULTS.settings, ...(s.settings || {}) },
      };
    }
  } catch {
    /* storage unavailable */
  }
  return DEFAULTS;
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<ProgressState>(load);
  const sRef = useRef(s);
  const [mountedAt] = useState(() => Date.now());
  useEffect(() => {
    sRef.current = s;
  });

  useEffect(() => {
    try {
      storage.setItem(KEY, JSON.stringify(s));
    } catch {
      /* ignore */
    }
  }, [s]);

  useEffect(() => {
    configureFx({ sound: s.settings.sound, haptics: s.settings.haptics });
  }, [s.settings]);

  // Keep the streak honest: if you missed a day, it shows as broken until you play again
  const streakAlive = useMemo(() => {
    if (!s.lastDay) return false;
    const today = dayKey(new Date(mountedAt));
    const yest = dayKey(new Date(mountedAt - 86400000));
    return s.lastDay === today || s.lastDay === yest;
  }, [s.lastDay, mountedAt]);

  const touch = (st: ProgressState, gained = 0): ProgressState => {
    const today = dayKey();
    const yest = dayKey(new Date(Date.now() - 86400000));
    let streak = st.streak;
    if (st.lastDay !== today) streak = st.lastDay === yest ? st.streak + 1 : 1;
    return {
      ...st,
      streak,
      bestStreak: Math.max(st.bestStreak, streak),
      lastDay: today,
      xp: st.xp + gained,
      xpByDay: { ...st.xpByDay, [today]: (st.xpByDay[today] || 0) + gained },
    };
  };

  const markLearned = useCallback((mod: string, id: string, xp = 5) => {
    if ((sRef.current.learned[mod] || []).includes(id)) return false;
    setS((st) => {
      const list = st.learned[mod] || [];
      if (list.includes(id)) return st;
      return touch({ ...st, learned: { ...st.learned, [mod]: [...list, id] } }, xp);
    });
    return true;
  }, []);

  const recordQuiz = useCallback(
    (id: string, { correct, total, xp }: { correct: number; total: number; xp: number }) => {
      setS((st) => {
        const pct = Math.round((correct / total) * 100);
        const prev = st.quizzes[id] || { best: 0, plays: 0 };
        return touch(
          {
            ...st,
            answered: st.answered + total,
            correct: st.correct + correct,
            quizzes: {
              ...st.quizzes,
              [id]: { best: Math.max(prev.best, pct), plays: prev.plays + 1 },
            },
            daily: id === 'daily' ? { ...st.daily, [dayKey()]: true } : st.daily,
          },
          xp
        );
      });
    },
    []
  );

  const addXP = useCallback((n: number) => setS((st) => touch(st, n)), []);
  const setName = useCallback(
    (name: string) => setS((st) => ({ ...st, name: name.trim().slice(0, 18) || 'Explorer' })),
    []
  );
  const setSetting = useCallback(
    <K extends keyof UserSettings>(k: K, v: UserSettings[K]) =>
      setS((st) => ({ ...st, settings: { ...st.settings, [k]: v } })),
    []
  );
  const addMiss = useCallback((key?: string) => {
    if (key) {
      setS((st) => ({
        ...st,
        missed: { ...st.missed, [key]: Math.min(3, (st.missed[key] || 0) + 1) },
      }));
    }
  }, []);
  const clearMiss = useCallback((key?: string) => {
    if (!key) return;
    setS((st) => {
      if (!st.missed[key]) return st;
      const left = st.missed[key] - 1;
      const missed = { ...st.missed };
      if (left <= 0) delete missed[key];
      else missed[key] = left;
      return { ...st, missed, fixed: st.fixed + (left <= 0 ? 1 : 0) };
    });
  }, []);
  const mergeIn = useCallback(
    (remote: Partial<ProgressState>) =>
      setS((st) => {
        const m = mergeProgress(st, remote);
        return stable(m) === stable(st) ? st : m;
      }),
    []
  );
  const markNotifsSeen = useCallback((n: number) => setS((st) => ({ ...st, notifsSeen: n })), []);
  const reset = useCallback(() => setS((st) => ({ ...DEFAULTS, settings: st.settings })), []);

  const moduleProgress = useCallback(
    (id: string) => {
      const m = MODULES.find((x) => x.id === id);
      if (!m) return 0;
      const got = Math.min(1, (s.learned[id] || []).length / m.target);
      const passed = (s.quizzes[id]?.best || 0) >= 60 ? 1 : 0;
      return got * 0.75 + passed * 0.25;
    },
    [s.learned, s.quizzes]
  );

  const overall = useMemo(
    () => MODULES.reduce((a, m) => a + moduleProgress(m.id), 0) / MODULES.length,
    [moduleProgress]
  );
  const learnedTotal = useMemo(
    () => Object.values(s.learned).reduce((a, l) => a + l.length, 0),
    [s.learned]
  );
  const dailyDone = !!s.daily[dayKey()];

  const achievements = useMemo<Achievement[]>(() => {
    const plays = Object.values(s.quizzes).reduce((a, q) => a + q.plays, 0);
    const threeStars = Object.values(s.quizzes).some((q) => starsFor(q.best) === 3);
    const dailyDays = Object.keys(s.daily).length;
    const passedMods = MODULES.filter((m) => (s.quizzes[m.id]?.best || 0) >= 50).length;
    const lvl = levelOf(s.xp).level;
    const mk = (
      id: string,
      emoji: string,
      name: string,
      desc: string,
      value: number,
      goal: number
    ): Achievement => ({
      id,
      emoji,
      name,
      desc,
      value: Math.min(value, goal),
      goal,
      done: value >= goal,
    });
    return [
      mk('first', '🌱', 'First Steps', 'Learn your first lesson', learnedTotal, 1),
      mk('quiz', '🎯', 'Quiz Starter', 'Finish a quiz', plays, 1),
      mk('perfect', '💎', 'Sharp Mind', 'Earn 3 stars on a quiz', threeStars ? 1 : 0, 1),
      mk('fire', '🔥', 'On Fire', 'Reach a 3-day streak', s.bestStreak, 3),
      mk('week', '🏆', 'Week Warrior', 'Reach a 7-day streak', s.bestStreak, 7),
      mk('book', '📚', 'Bookworm', 'Learn 20 lessons', learnedTotal, 20),
      mk('daily', '☀️', 'Daily Devotee', 'Finish 3 Daily Challenges', dailyDays, 3),
      mk('scholar', '🎓', 'Naija Scholar', 'Pass all six module quizzes', passedMods, 6),
      mk('lvl', '⚡', 'Rising Star', 'Reach level 5', lvl, 5),
      mk('fix', '🛠️', 'Comeback Kid', 'Fix 5 missed questions', s.fixed || 0, 5),
      mk('time', '⏳', 'Time Traveller', "Open 5 'On this day' stories", (s.learned.otd || []).length, 5),
      mk('map', '🗺️', 'Cartographer', 'Explore 20 states on the map', (s.learned.states || []).length, 20),
    ];
  }, [s, learnedTotal]);

  const missedCount = Object.keys(s.missed || {}).length;

  const value: ProgressContextValue = {
    ...s,
    raw: s,
    missedCount,
    addMiss,
    clearMiss,
    mergeIn,
    streakAlive,
    markLearned,
    recordQuiz,
    addXP,
    setName,
    setSetting,
    markNotifsSeen,
    reset,
    moduleProgress,
    overall,
    learnedTotal,
    dailyDone,
    achievements,
    level: levelOf(s.xp),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

