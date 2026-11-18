// Never trust the client: rebuild a progress object from known, bounded fields only.
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const MODULE_IDS = ["history", "presidents", "states", "governors", "constitution", "today", "otd"];
const QUIZ_IDS = ["history", "presidents", "states", "governors", "constitution", "today", "daily", "mixed", "map", "review"];
const int = (v, max, min = 0) => (Number.isFinite(+v) ? Math.min(max, Math.max(min, Math.trunc(+v))) : 0);
const cleanName = (v) => String(v ?? "").replace(/[\p{Cc}<>]/gu, "").trim().slice(0, 18) || "Explorer";
const entries = (o, cap) => Object.entries(o && typeof o === "object" ? o : {}).slice(0, cap);

export function sanitizeProgress(p = {}) {
  const learned = {};
  for (const id of MODULE_IDS) {
    const list = Array.isArray(p.learned?.[id]) ? p.learned[id] : [];
    learned[id] = [...new Set(list.filter((x) => typeof x === "string" && x.length <= 60))].slice(0, 300);
  }
  const quizzes = {};
  for (const [id, q] of entries(p.quizzes, 30)) if (QUIZ_IDS.includes(id)) quizzes[id] = { best: int(q?.best, 100), plays: int(q?.plays, 100000) };
  const daily = {};
  for (const [k, v] of entries(p.daily, 800)) if (DAY.test(k) && v) daily[k] = true;
  const xpByDay = {};
  for (const [k, v] of entries(p.xpByDay, 800)) if (DAY.test(k)) xpByDay[k] = int(v, 5000);
  const missed = {};
  for (const [k, v] of entries(p.missed, 300)) if (/^[a-z0-9-]{1,40}$/i.test(k)) missed[k] = int(v, 3, 1) || 1;
  return {
    name: cleanName(p.name),
    xp: int(p.xp, 1_000_000), streak: int(p.streak, 3650), bestStreak: int(p.bestStreak, 3650),
    lastDay: DAY.test(p.lastDay || "") ? p.lastDay : null,
    learned, quizzes, daily, xpByDay, missed,
    answered: int(p.answered, 10_000_000), correct: int(p.correct, 10_000_000), fixed: int(p.fixed, 100000), notifsSeen: int(p.notifsSeen, 100),
  };
}

export const emptyProgress = () => sanitizeProgress({});
