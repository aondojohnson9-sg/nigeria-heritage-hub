export type EraId = 'first' | 'mil1' | 'second' | 'mil2' | 'fourth';

export interface Era {
  id: EraId;
  label: string;
  range: string;
}

export interface President {
  id: string;
  era: EraId;
  name: string;
  years: string;
  title: string;
  current?: boolean;
  points: string[];
}

// Heads of state in order of each term. A person who served twice appears twice.
export const ERAS: Era[] = [
  { id: 'first', label: 'First Republic', range: '1960 – 1966' },
  { id: 'mil1', label: 'Military Rule', range: '1966 – 1979' },
  { id: 'second', label: 'Second Republic', range: '1979 – 1983' },
  { id: 'mil2', label: 'Military Rule Again', range: '1983 – 1999' },
  { id: 'fourth', label: 'Fourth Republic', range: '1999 – today' },
];

export const PRESIDENTS: President[] = [
  {
    id: 'azikiwe',
    era: 'first',
    name: 'Nnamdi Azikiwe',
    years: '1963 – 1966',
    title: 'First President',
    points: [
      'Governor-General from 1960, then Nigeria\'s first President when it became a republic in 1963.',
      'A nationalist known as "Zik"; founded the University of Nigeria, Nsukka in 1960.',
    ],
  },
  {
    id: 'ironsi',
    era: 'mil1',
    name: 'Johnson Aguiyi-Ironsi',
    years: 'Jan – Jul 1966',
    title: 'First military head of state',
    points: [
      'Took power after the January 1966 coup.',
      'Killed in the July 1966 counter-coup.',
    ],
  },
  {
    id: 'gowon',
    era: 'mil1',
    name: 'Yakubu Gowon',
    years: '1966 – 1975',
    title: 'Head of State',
    points: [
      'Led the federal side in the Civil War (1967–1970).',
      'Created 12 states in 1967 and championed "No victor, no vanquished".',
    ],
  },
  {
    id: 'murtala',
    era: 'mil1',
    name: 'Murtala Mohammed',
    years: '1975 – 1976',
    title: 'Head of State',
    points: [
      'Expanded Nigeria to 19 states and set in motion the move of the capital to Abuja.',
      'Assassinated on 13 February 1976.',
    ],
  },
  {
    id: 'obasanjo1',
    era: 'mil1',
    name: 'Olusegun Obasanjo',
    years: '1976 – 1979',
    title: 'Head of State (military)',
    points: [
      "Took over after Murtala Mohammed's death.",
      'Handed power to an elected civilian government on 1 October 1979.',
    ],
  },
  {
    id: 'shagari',
    era: 'second',
    name: 'Shehu Shagari',
    years: '1979 – 1983',
    title: 'Executive President',
    points: [
      'First President of the Second Republic, under the 1979 Constitution.',
      'Overthrown in a coup on 31 December 1983.',
    ],
  },
  {
    id: 'buhari1',
    era: 'mil2',
    name: 'Muhammadu Buhari',
    years: '1983 – 1985',
    title: 'Head of State (military)',
    points: [
      'Launched the "War Against Indiscipline" campaign.',
      'Removed in a palace coup in August 1985.',
    ],
  },
  {
    id: 'babangida',
    era: 'mil2',
    name: 'Ibrahim Babangida',
    years: '1985 – 1993',
    title: 'Head of State',
    points: [
      'Introduced the Structural Adjustment Programme in 1986.',
      'Moved the capital to Abuja in 1991; annulled the 12 June 1993 election.',
    ],
  },
  {
    id: 'shonekan',
    era: 'mil2',
    name: 'Ernest Shonekan',
    years: 'Aug – Nov 1993',
    title: 'Interim Head of State',
    points: [
      'Led the Interim National Government for about 83 days.',
      'Ousted by General Sani Abacha in November 1993.',
    ],
  },
  {
    id: 'abacha',
    era: 'mil2',
    name: 'Sani Abacha',
    years: '1993 – 1998',
    title: 'Head of State',
    points: ['Ruled until his sudden death on 8 June 1998.'],
  },
  {
    id: 'abdulsalami',
    era: 'mil2',
    name: 'Abdulsalami Abubakar',
    years: '1998 – 1999',
    title: 'Head of State',
    points: [
      'Ran a short transition programme back to civilian rule.',
      'Handed over to an elected government on 29 May 1999.',
    ],
  },
  {
    id: 'obasanjo2',
    era: 'fourth',
    name: 'Olusegun Obasanjo',
    years: '1999 – 2007',
    title: 'President',
    points: [
      'Elected in 1999 to start the Fourth Republic.',
      'Secured a major Paris Club debt-relief deal in 2005.',
    ],
  },
  {
    id: 'yaradua',
    era: 'fourth',
    name: "Umaru Musa Yar'Adua",
    years: '2007 – 2010',
    title: 'President',
    points: [
      'Former Governor of Katsina State.',
      'Introduced the 2009 Niger Delta amnesty; died in office on 5 May 2010.',
    ],
  },
  {
    id: 'jonathan',
    era: 'fourth',
    name: 'Goodluck Jonathan',
    years: '2010 – 2015',
    title: 'President',
    points: [
      "Became President after Yar'Adua's death and won the 2011 election.",
      'Conceded defeat in 2015, a first for a sitting president.',
    ],
  },
  {
    id: 'buhari2',
    era: 'fourth',
    name: 'Muhammadu Buhari',
    years: '2015 – 2023',
    title: 'President',
    points: [
      'First opposition candidate to defeat a sitting president at the polls (2015).',
      'Served two terms, ending on 29 May 2023.',
    ],
  },
  {
    id: 'tinubu',
    era: 'fourth',
    name: 'Bola Ahmed Tinubu',
    years: '2023 – present',
    title: 'President',
    current: true,
    points: [
      'Sworn in on 29 May 2023.',
      'Previously Governor of Lagos State from 1999 to 2007.',
    ],
  },
];

