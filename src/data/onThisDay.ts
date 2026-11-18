export interface HistoricalDateEvent {
  m: number;
  d: number;
  y: number;
  title: string;
  text: string;
}

// "On this day" — dated events in Nigerian history (month is 1–12).
export const EVENTS: HistoricalDateEvent[] = [
  { m: 1,  d: 1,  y: 1914, title: 'The Amalgamation takes effect', text: 'The Northern and Southern Protectorates were merged into one colony under Lord Lugard, drawing the borders of modern Nigeria.' },
  { m: 1,  d: 1,  y: 1973, title: 'The Naira is born', text: 'Nigeria replaced the pound with its own currency: one naira, divided into 100 kobo.' },
  { m: 1,  d: 15, y: 1966, title: 'The first military coup', text: 'Army officers seized power and Prime Minister Abubakar Tafawa Balewa was killed. Major-General Aguiyi-Ironsi became head of state.' },
  { m: 1,  d: 15, y: 1970, title: 'The Civil War ends', text: 'After about 30 months of fighting, the war ended and the government promised reconciliation: "No victor, no vanquished".' },
  { m: 2,  d: 13, y: 1976, title: 'Murtala Mohammed is assassinated', text: 'The head of state was killed in a failed coup attempt in Lagos. General Olusegun Obasanjo took over.' },
  { m: 2,  d: 27, y: 1999, title: 'Obasanjo wins the presidency', text: 'A civilian election returned Olusegun Obasanjo as President, paving the way for the Fourth Republic.' },
  { m: 3,  d: 31, y: 2015, title: 'A historic concession', text: 'INEC declared Muhammadu Buhari the winner. President Goodluck Jonathan conceded — the first time a sitting president lost and handed over peacefully.' },
  { m: 5,  d: 5,  y: 2010, title: "President Yar'Adua dies in office", text: "Umaru Musa Yar'Adua died after a long illness. Vice-President Goodluck Jonathan took over." },
  { m: 5,  d: 6,  y: 2010, title: 'Jonathan sworn in as President', text: "Goodluck Jonathan took the oath of office the day after Yar'Adua's death." },
  { m: 5,  d: 27, y: 1967, title: 'Twelve states are created', text: 'General Yakubu Gowon replaced the four regions with twelve states.' },
  { m: 5,  d: 29, y: 1999, title: 'The Fourth Republic begins', text: "Olusegun Obasanjo was sworn in after years of military rule, beginning Nigeria's longest unbroken run of civilian government." },
  { m: 5,  d: 29, y: 2007, title: 'A first civilian-to-civilian handover', text: "Umaru Musa Yar'Adua succeeded Olusegun Obasanjo — the first time one elected civilian government handed over to another." },
  { m: 5,  d: 29, y: 2015, title: 'Buhari takes office', text: 'Muhammadu Buhari was sworn in, the first opposition candidate to win the presidency at the ballot box.' },
  { m: 5,  d: 29, y: 2023, title: 'Tinubu sworn in', text: 'Bola Ahmed Tinubu took the oath of office as President, succeeding Muhammadu Buhari.' },
  { m: 5,  d: 30, y: 1967, title: 'Biafra is declared', text: 'Lt-Col Odumegwu Ojukwu declared the Eastern Region the Republic of Biafra, leading to the Civil War.' },
  { m: 6,  d: 8,  y: 1998, title: 'General Abacha dies', text: 'The head of state died suddenly. General Abdulsalami Abubakar succeeded him and began a transition to civilian rule.' },
  { m: 6,  d: 12, y: 1993, title: 'The June 12 election', text: 'Nigerians voted in a presidential election widely seen as free and fair. The results were later annulled, and the date is now remembered as Democracy Day.' },
  { m: 6,  d: 23, y: 1993, title: 'The election is annulled', text: 'General Ibrahim Babangida annulled the June 12 presidential election, triggering a political crisis.' },
  { m: 7,  d: 29, y: 1966, title: 'Ironsi is killed in a counter-coup', text: 'Northern officers rose against the military government and Major-General Aguiyi-Ironsi was killed.' },
  { m: 7,  d: 29, y: 1975, title: 'Gowon is overthrown', text: 'General Murtala Mohammed took power in a bloodless coup while Yakubu Gowon was abroad.' },
  { m: 8,  d: 1,  y: 1966, title: 'Gowon becomes head of state', text: 'Lt-Col Yakubu Gowon emerged as head of state after the July counter-coup.' },
  { m: 8,  d: 26, y: 1993, title: 'The Interim National Government', text: 'Ernest Shonekan was sworn in to lead an interim government after the annulled election.' },
  { m: 8,  d: 27, y: 1985, title: 'Babangida seizes power', text: 'General Ibrahim Babangida removed Muhammadu Buhari in a palace coup.' },
  { m: 10, d: 1,  y: 1960, title: 'Independence Day', text: 'Nigeria became an independent country, with Sir Abubakar Tafawa Balewa as Prime Minister.' },
  { m: 10, d: 1,  y: 1963, title: 'Nigeria becomes a republic', text: 'Nnamdi Azikiwe became the first President as Nigeria cut its last constitutional ties to the British Crown.' },
  { m: 10, d: 1,  y: 1979, title: 'Shagari takes office', text: 'General Obasanjo handed power to Shehu Shagari, ushering in the Second Republic.' },
  { m: 11, d: 17, y: 1993, title: 'Abacha takes control', text: 'Ernest Shonekan resigned and General Sani Abacha took over as head of state.' },
  { m: 12, d: 12, y: 1991, title: 'Abuja becomes the capital', text: 'The seat of government officially moved from Lagos to the new, centrally located city of Abuja.' },
  { m: 12, d: 31, y: 1983, title: 'Shagari is overthrown', text: 'Military officers led by Major-General Muhammadu Buhari ended the Second Republic.' },
];

const MS = 86400000;
const dayOfYear = (m: number, d: number) =>
  Math.round((Date.UTC(2001, m - 1, d) - Date.UTC(2001, 0, 1)) / MS);

export interface OnThisDayResult {
  kind: 'today' | 'upcoming';
  events: HistoricalDateEvent[];
  daysAway: number;
}

/** Events for `date`; if none, the next upcoming event(s). */
export function forDate(date = new Date()): OnThisDayResult {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const today = EVENTS.filter((e) => e.m === m && e.d === d);
  if (today.length) return { kind: 'today', events: today, daysAway: 0 };
  const now = dayOfYear(m, d);
  let best: { diff: number; m: number; d: number } | null = null;
  for (const e of EVENTS) {
    let diff = dayOfYear(e.m, e.d) - now;
    if (diff < 0) diff += 365;
    if (!best || diff < best.diff) best = { diff, m: e.m, d: e.d };
  }
  const target = best!;
  const events = EVENTS.filter((e) => e.m === target.m && e.d === target.d);
  return { kind: 'upcoming', events, daysAway: target.diff };
}

export const onThisDay = forDate;

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

