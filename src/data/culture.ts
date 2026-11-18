export interface EthnicGroup {
  id: string;
  name: string;
  region: string;
  language: string;
  emoji: string;
  desc: string;
}

export interface Festival {
  id: string;
  name: string;
  place: string;
  when: string;
  emoji: string;
  desc: string;
}

export const ETHNIC_GROUPS: EthnicGroup[] = [
  {
    id: 'hausa',
    name: 'Hausa-Fulani',
    region: 'Northern Nigeria',
    language: 'Hausa',
    emoji: '🐎',
    desc: 'About 30% of the population. Known for a rich Islamic tradition, the baban riga robe, horsemanship and the Durbar festival.',
  },
  {
    id: 'yoruba',
    name: 'Yoruba',
    region: 'South-West',
    language: 'Yoruba',
    emoji: '🥁',
    desc: 'Around 21% of the population. Famous for ancient monarchies (Obas), the talking drum (gangan), aso oke fabric and lively festivals.',
  },
  {
    id: 'igbo',
    name: 'Igbo',
    region: 'South-East',
    language: 'Igbo',
    emoji: '🥭',
    desc: 'Around 18% of the population. Renowned for enterprise, the Igba Boyi apprentice system, masquerades and the New Yam Festival.',
  },
  {
    id: 'minorities',
    name: 'Minority Groups',
    region: 'Across the nation',
    language: '250+ languages',
    emoji: '🌍',
    desc: 'More than 250 other groups — including the Ijaw, Kanuri, Tiv, Ibibio, Edo and Efik — add unique music, textiles and food.',
  },
];

export const FESTIVALS: Festival[] = [
  {
    id: 'durbar',
    name: 'Durbar Festival',
    place: 'Kano, Katsina & Zaria',
    when: 'Eid celebrations',
    emoji: '🏇',
    desc: 'A royal parade of decorated horsemen, emirs in flowing robes and musicians.',
  },
  {
    id: 'eyo',
    name: 'Eyo Festival',
    place: 'Lagos Island',
    when: 'On special occasions',
    emoji: '⚪',
    desc: 'White-clad Eyo masquerades carrying staves (opambata) fill the streets to honour leaders or mark transitions.',
  },
  {
    id: 'argungu',
    name: 'Argungu Fishing Festival',
    place: 'Argungu, Kebbi State',
    when: 'Annually',
    emoji: '🎣',
    desc: 'Thousands of fishermen jump into the river with hand nets to catch the biggest Nile perch.',
  },
  {
    id: 'yam',
    name: 'New Yam Festival',
    place: 'South-East & beyond',
    when: 'August, annually',
    emoji: '🍠',
    desc: 'Known as Iri Ji or Iwa Ji, it marks the harvest with dancing, feasting and thanks to the ancestors.',
  },
];

