import { STATES, type NigeriaState } from './states';
import { MAP_STATES } from './nigeriaMap';

export interface McQuestion {
  type: 'mc';
  q: string;
  options: string[];
  answer: number;
  fact: string;
  highlight?: string;
  mod?: string;
  key?: string;
}

export interface MatchQuestion {
  type: 'match';
  q: string;
  pairs: [string, string][];
  fact: string;
  mod?: string;
  key?: string;
}

export interface MapQuestion {
  type: 'map';
  q: string;
  target: string;
  fact: string;
  mod?: string;
  key?: string;
}

export type QuizQuestion = McQuestion | MatchQuestion | MapQuestion;

export interface QuizMeta {
  id: string;
  name: string;
  sub: string;
  length: number;
}

const mc = (q: string, options: string[], answer: number, fact: string): McQuestion => ({
  type: 'mc',
  q,
  options,
  answer,
  fact,
});

const match = (q: string, pairs: [string, string][], fact: string): MatchQuestion => ({
  type: 'match',
  q,
  pairs,
  fact,
});

const pick = (id: string): NigeriaState =>
  STATES.find((s) => s.id === id) ?? STATES[0];

export const BANKS: Record<string, QuizQuestion[]> = {
  history: [
    mc('In which year were the Northern and Southern Protectorates amalgamated?', ['1900', '1914', '1922', '1960'], 1, 'Lord Lugard merged them in 1914, creating the borders of modern Nigeria.'),
    mc('On what date did Nigeria gain independence?', ['1 October 1960', '29 May 1999', '12 June 1993', '1 January 1914'], 0, 'Independence Day is 1 October, marking 1960.'),
    mc('The Nok culture is famous for which art form?', ['Bronze plaques', 'Terracotta sculptures', 'Cave paintings', 'Woven cloth'], 1, 'Nok terracotta heads are among the oldest large sculptures in sub-Saharan Africa.'),
    mc('Which empire is renowned for its bronze castings?', ['Oyo Empire', 'Kanem-Bornu', 'Benin Empire', 'Songhai'], 2, "The Benin Bronzes recorded the history of the Oba's court."),
    mc('Who led the 1804 reform movement that created the Sokoto Caliphate?', ['Usman dan Fodio', 'Mai Idris Alooma', 'Oba Ewuare', 'Alaafin Abiodun'], 0, "Usman dan Fodio's movement united the Hausa states."),
    mc('The Civil War lasted from 1967 to…', ['1968', '1969', '1970', '1972'], 2, 'It ended in January 1970 after about 30 months.'),
    mc('When did the Fourth Republic begin?', ['1979', '1993', '1999', '2007'], 2, 'Democracy returned on 29 May 1999.'),
    mc('The seat of government moved from Lagos to Abuja in…', ['1976', '1985', '1991', '1999'], 2, 'The official move happened on 12 December 1991.'),
  ],
  presidents: [
    mc("Who was Nigeria's first President?", ['Tafawa Balewa', 'Nnamdi Azikiwe', 'Yakubu Gowon', 'Shehu Shagari'], 1, 'Azikiwe became President when Nigeria turned republic in 1963.'),
    mc('"No victor, no vanquished" is associated with which leader?', ['Gowon', 'Babangida', 'Obasanjo', 'Ironsi'], 0, 'Gowon used it to promote reconciliation after the Civil War.'),
    mc("Who was Nigeria's first military head of state?", ['Gowon', 'Murtala Mohammed', 'Aguiyi-Ironsi', 'Buhari'], 2, 'Aguiyi-Ironsi took power in January 1966.'),
    mc('Who led the Second Republic from 1979?', ['Shehu Shagari', 'Olusegun Obasanjo', 'Sani Abacha', 'Ernest Shonekan'], 0, 'Shagari was the first executive president under the 1979 Constitution.'),
    mc('Which leader introduced the Structural Adjustment Programme in 1986?', ['Buhari', 'Babangida', 'Abacha', 'Gowon'], 1, 'Ibrahim Babangida launched SAP and also moved the capital to Abuja.'),
    mc('Who handed power to an elected government on 29 May 1999?', ['Abdulsalami Abubakar', 'Sani Abacha', 'Ernest Shonekan', 'Muhammadu Buhari'], 0, 'General Abdulsalami Abubakar oversaw the transition.'),
    mc("Who became President after Umaru Yar'Adua died in 2010?", ['Goodluck Jonathan', 'Olusegun Obasanjo', 'Muhammadu Buhari', 'Bola Tinubu'], 0, 'Goodluck Jonathan was Vice-President and took over.'),
    mc('Who took office on 29 May 2023?', ['Bola Ahmed Tinubu', 'Atiku Abubakar', 'Muhammadu Buhari', 'Peter Obi'], 0, 'Bola Ahmed Tinubu succeeded Muhammadu Buhari.'),
  ],
  states: [
    mc('How many states are in the Federal Republic of Nigeria?', ['30', '36', '37', '42'], 1, 'There are 36 states plus the Federal Capital Territory (Abuja).'),
    mc('What is the capital of Lagos State?', ['Lagos Island', 'Ikeja', 'Epe', 'Badagry'], 1, 'Ikeja is the capital of Lagos State.'),
    mc('Which state has Calabar as its capital?', ['Cross River', 'Akwa Ibom', 'Rivers', 'Delta'], 0, 'Calabar is home to the famous Calabar Carnival.'),
    mc('Lokoja is the capital of which state?', ['Kwara', 'Kogi', 'Niger', 'Benue'], 1, 'Kogi is called the Confluence State.'),
    mc('Which geopolitical zone is Borno State in?', ['North West', 'North Central', 'North East', 'South South'], 2, 'Borno is in the North East.'),
    mc('What is the capital of Ekiti State?', ['Akure', 'Osogbo', 'Ado-Ekiti', 'Abeokuta'], 2, 'Ado-Ekiti is the state capital.'),
    mc('How many Local Government Areas does Nigeria have?', ['520', '645', '774', '812'], 2, 'Nigeria has 774 LGAs.'),
    match(
      'Match each state to its capital',
      [
        [pick('lagos').name, 'Ikeja'],
        [pick('ogun').name, 'Abeokuta'],
        [pick('rivers').name, 'Port Harcourt'],
        [pick('kogi').name, 'Lokoja'],
      ],
      'Great geography! Capitals are the heart of each state.'
    ),
  ],
  governors: [
    mc('Which state\'s slogan is "Centre of Excellence"?', ['Lagos', 'Kano', 'Oyo', 'Rivers'], 0, 'Lagos is the Centre of Excellence.'),
    mc('"Gateway State" is the slogan of…', ['Ondo', 'Ogun', 'Osun', 'Ekiti'], 1, 'Ogun is the Gateway State.'),
    mc('Which state is "Light of the Nation"?', ['Anambra', 'Imo', 'Abia', 'Enugu'], 0, 'Anambra carries the Light of the Nation slogan.'),
    mc('Which state is known as the "Food Basket of the Nation"?', ['Benue', 'Kebbi', 'Kano', 'Kwara'], 0, 'Benue is the Food Basket of the Nation.'),
    mc('Who is the Governor of Lagos State?', ['Babajide Sanwo-Olu', 'Dapo Abiodun', 'Seyi Makinde', 'Biodun Oyebanji'], 0, 'Babajide Sanwo-Olu governs Lagos (as of Nov 2026).'),
    mc('Who is the Governor of Kano State?', ['Umar Namadi', 'Abba Kabir Yusuf', 'Uba Sani', 'Dikko Radda'], 1, 'Abba Kabir Yusuf governs Kano (as of Nov 2026).'),
    mc('Which state is the "Salt of the Nation"?', ['Ebonyi', 'Bayelsa', 'Cross River', 'Delta'], 0, 'Ebonyi is the Salt of the Nation.'),
    match(
      'Match each slogan to its state',
      [
        ['Pacesetter State', 'Oyo'],
        ['Coal City State', 'Enugu'],
        ['Sunshine State', 'Ondo'],
        ['Power State', 'Niger'],
      ],
      "Slogans are a state's personality in a few words."
    ),
  ],
  constitution: [
    mc('Which section says the Constitution is supreme?', ['Section 1', 'Section 14', 'Section 33', 'Section 47'], 0, 'Section 1 makes the Constitution supreme over every other law.'),
    mc('Chapter IV of the Constitution covers…', ['The Judiciary', 'Fundamental Rights', 'Citizenship', 'The Executive'], 1, 'Chapter IV protects fundamental human rights.'),
    mc('How many senators does Nigeria have?', ['72', '109', '120', '360'], 1, 'Three per state (108) plus one for the FCT.'),
    mc('How many members are in the House of Representatives?', ['109', '250', '360', '774'], 2, 'The House has 360 members.'),
    mc('How long is a presidential term?', ['Three years', 'Four years', 'Five years', 'Six years'], 1, 'A President serves a four-year term.'),
    mc('How many times can a person be elected President?', ['Once', 'Twice', 'Three times', 'No limit'], 1, 'The Constitution limits a President to two elections.'),
    mc('The right to life is protected in…', ['Section 33', 'Section 25', 'Section 130', 'Section 249'], 0, 'Section 33 protects the right to life.'),
  ],
  today: [
    mc('One naira is equal to how many kobo?', ['10', '50', '100', '1,000'], 2, 'One naira is 100 kobo.'),
    mc('What does INEC stand for?', ['Independent National Electoral Commission', 'Imperial National Election Council', 'Integrated National Economic Court', 'Independent National Ethics Committee'], 0, "INEC organises Nigeria's elections."),
    mc('How many Local Government Areas are in Nigeria?', ['500', '644', '774', '900'], 2, 'Nigeria has 774 LGAs.'),
    mc('How many geopolitical zones does Nigeria have?', ['4', '5', '6', '8'], 2, 'There are six zones.'),
    mc('Which year was the naira introduced?', ['1960', '1973', '1991', '1999'], 1, 'The naira replaced the pound on 1 January 1973.'),
    mc('A presidential winner needs 25% of votes in at least how many states + the FCT?', ['Half of states', 'Two-thirds of states', 'All states', 'Ten states'], 1, 'The rule requires at least two-thirds of the 36 states and the FCT.'),
  ],
};

export const QUIZ_META: Record<string, QuizMeta> = {
  daily: { id: 'daily', name: 'Daily Naija Challenge', sub: '5 quick questions', length: 5 },
  mixed: { id: 'mixed', name: 'Mixed Challenge', sub: '10 questions from everywhere', length: 10 },
  map: { id: 'map', name: 'Map Master', sub: 'Tap and name the states', length: 10 },
  review: { id: 'review', name: 'Fix Your Mistakes', sub: 'Questions you missed', length: 8 },
};

// Deterministic PRNG so the daily set is the same all day
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export const dayKey = (d = new Date()): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const hash = (str: string) =>
  [...str].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

export function shuffle<T>(arr: T[], rnd: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------- map questions (generated) ----------
const TAPPABLE = STATES.filter((s) => (MAP_STATES[s.id]?.a || 0) >= 1000);
const stateById = (id: string) => STATES.find((s) => s.id === id);

const mapFind = (s: NigeriaState): MapQuestion => ({
  type: 'map',
  q: `Tap ${s.name} on the map`,
  target: s.id,
  mod: 'states',
  key: `mapfind-${s.id}`,
  fact: `${s.name} State — capital ${s.capital}, in the ${s.zone} zone.`,
});

function mapId(s: NigeriaState): McQuestion {
  const same = shuffle(STATES.filter((x) => x.zone === s.zone && x.id !== s.id)).slice(0, 2);
  const rest = shuffle(STATES.filter((x) => x.id !== s.id && !same.includes(x))).slice(0, 3 - same.length);
  const options = shuffle([s.name, ...same.map((x) => x.name), ...rest.map((x) => x.name)]);
  return {
    type: 'mc',
    q: 'Which state is highlighted on the map?',
    options,
    answer: options.indexOf(s.name),
    highlight: s.id,
    mod: 'states',
    key: `mapid-${s.id}`,
    fact: `${s.name} State — capital ${s.capital}, in the ${s.zone} zone.`,
  };
}

const ALL: QuizQuestion[] = Object.entries(BANKS).flatMap(([mod, qs]) =>
  qs.map((q, i) => ({ ...q, mod, key: `${mod}-${i}` }))
);

export function questionFromKey(key: string): QuizQuestion | null {
  if (key.startsWith('mapfind-')) {
    const s = stateById(key.slice(8));
    return s ? mapFind(s) : null;
  }
  if (key.startsWith('mapid-')) {
    const s = stateById(key.slice(6));
    return s ? mapId(s) : null;
  }
  return ALL.find((q) => q.key === key) || null;
}

const dailySet = (): QuizQuestion[] =>
  shuffle(ALL.filter((q): q is McQuestion => q.type === 'mc'), seeded(hash(dayKey()))).slice(0, 5);

export function buildQuiz(id: string, missedKeys: string[] = []): QuizQuestion[] {
  if (id === 'states') {
    const base = BANKS.states.map((q, i) => ({ ...q, mod: id, key: `${id}-${i}` }));
    return shuffle([...base, ...shuffle(TAPPABLE).slice(0, 2).map(mapFind), mapId(shuffle(STATES)[0])]);
  }
  if (BANKS[id]) return shuffle(BANKS[id].map((q, i) => ({ ...q, mod: id, key: `${id}-${i}` })));
  if (id === 'daily') return dailySet();
  if (id === 'mixed') return shuffle(ALL).slice(0, 10);
  if (id === 'map') {
    return shuffle([...shuffle(TAPPABLE).slice(0, 6).map(mapFind), ...shuffle(STATES).slice(0, 4).map(mapId)]);
  }
  if (id === 'review') {
    return shuffle(missedKeys.map(questionFromKey).filter((q): q is QuizQuestion => Boolean(q))).slice(0, 8);
  }
  return [];
}

export const dailyTeaser = (): string => dailySet()[0]?.q || 'Test your Naija knowledge!';

export const shuffleOptions = (q: QuizQuestion): QuizQuestion => {
  if (q.type !== 'mc') return q;
  const order = shuffle(q.options.map((_, i) => i));
  return { ...q, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) };
};

