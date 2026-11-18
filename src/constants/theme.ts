export const COLORS = {
  // Surfaces — deep forest night
  bg0: '#03110a',
  bg1: '#061a10',
  surface: '#0b2418',
  surface2: '#11301f',
  surface3: '#173f29',
  line: 'rgba(255, 255, 255, 0.09)',
  lineStrong: 'rgba(255, 255, 255, 0.16)',

  // Brand
  green: '#25d97e',
  greenDeep: '#12a85f',
  flag: '#008751',
  gold: '#ffc82e',
  goldDeep: '#d79a00',
  onBright: '#04210f',

  // Feedback
  red: '#ff5d6c',
  redDeep: '#c9374a',
  blue: '#3d8bff',
  blueDeep: '#2563c9',

  // Text
  text: '#f3fbf6',
  text2: '#a9c6b4',
  text3: '#6f917d',
  white: '#ffffff',
} as const;

export type ModuleKey =
  | 'history'
  | 'presidents'
  | 'states'
  | 'governors'
  | 'constitution'
  | 'today'
  | 'daily'
  | 'mixed'
  | 'map'
  | 'review'
  | 'culture';

export interface ModulePalette {
  m: string;
  deep: string;
  onDarkText?: boolean;
}

export const MODULE_COLORS: Record<ModuleKey, ModulePalette> = {
  history: { m: '#f5a524', deep: '#b97508' },
  presidents: { m: '#3d8bff', deep: '#2260c4', onDarkText: true },
  states: { m: '#25d97e', deep: '#109a56' },
  governors: { m: '#9b6bff', deep: '#6a40cc', onDarkText: true },
  constitution: { m: '#ff8a3d', deep: '#c4580f', onDarkText: true },
  today: { m: '#1fc8db', deep: '#0f93a3' },
  daily: { m: '#ffc82e', deep: '#d79a00' },
  mixed: { m: '#25d97e', deep: '#109a56' },
  map: { m: '#25d97e', deep: '#109a56' },
  review: { m: '#ff8a3d', deep: '#c4580f', onDarkText: true },
  culture: { m: '#ff8a3d', deep: '#c4580f', onDarkText: true },
};

export const ZONE_COLORS: Record<string, string> = {
  'north-west': '#f5a524',
  'north-east': '#ff8a3d',
  'north-central': '#25d97e',
  'south-west': '#3d8bff',
  'south-east': '#9b6bff',
  'south-south': '#1fc8db',
};

export const FONTS = {
  display: 'Fredoka_700Bold',
  displaySemi: 'Fredoka_600SemiBold',
} as const;

export const RADII = {
  sm: 12,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

export const EDGE = 4;

export function getModulePalette(id?: string): ModulePalette {
  if (id && id in MODULE_COLORS) {
    return MODULE_COLORS[id as ModuleKey];
  }
  return { m: COLORS.green, deep: COLORS.greenDeep };
}
