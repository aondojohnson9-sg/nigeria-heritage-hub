import type { ModuleKey } from '../constants/theme';

export interface ModuleItem {
  id: ModuleKey;
  path: `/${string}`;
  name: string;
  short: string;
  sub: string;
  blurb: string;
  target: number;
}

// The six core modules from the HeritageHub dashboard.
// `target` = how many items a learner should open to call the module "learned".
export const MODULES: ModuleItem[] = [
  {
    id: 'history',
    path: '/history',
    name: 'Nigerian History',
    short: 'History',
    sub: 'Our Past',
    blurb: 'A journey from Nok to the Fourth Republic.',
    target: 12,
  },
  {
    id: 'presidents',
    path: '/presidents',
    name: 'Presidential Recaps',
    short: 'Presidents',
    sub: 'Leaders & Legacies',
    blurb: 'Every head of state, in order, with the story.',
    target: 16,
  },
  {
    id: 'states',
    path: '/states',
    name: 'States & Capitals',
    short: 'States',
    sub: 'Test Your Geography',
    blurb: '36 states + FCT. Learn the capitals and zones.',
    target: 12,
  },
  {
    id: 'governors',
    path: '/governors',
    name: 'Governors & Slogans',
    short: 'Governors',
    sub: 'Know Your States',
    blurb: 'Who runs each state and what it calls itself.',
    target: 12,
  },
  {
    id: 'constitution',
    path: '/constitution',
    name: 'Constitutions',
    short: 'Constitution',
    sub: 'Our Laws',
    blurb: 'The 1999 Constitution, chapter by chapter.',
    target: 7,
  },
  {
    id: 'today',
    path: '/today',
    name: 'Nigeria Today',
    short: 'Today',
    sub: 'Current Affairs',
    blurb: 'Plain-English explainers on how Nigeria works.',
    target: 6,
  },
];

export const byId = (id: string): ModuleItem | undefined =>
  MODULES.find((m) => m.id === id);

