// Naija-flavoured rank titles by level.
export const RANKS = [
  'Explorer',
  'Town Crier',
  'Griot',
  'Scribe',
  'Scholar',
  'Elder',
  'Chief',
  'Custodian',
] as const;

export const rankOf = (level: number): string =>
  RANKS[Math.min(Math.max(level, 1), RANKS.length) - 1];

