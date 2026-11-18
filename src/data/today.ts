export interface TodayExplainer {
  id: string;
  tag: string;
  title: string;
  teaser: string;
  date: Date;
  emoji: string;
  body: string;
}

const today = new Date();
const daysAgo = (n: number) => new Date(today.getTime() - n * 86400000);

export const UPDATES: TodayExplainer[] = [
  {
    id: 'growth',
    tag: 'Nigeria Today',
    title: "Nigeria's Growth: A Nation of Endless Possibilities",
    teaser: 'Together, we build a brighter future.',
    date: today,
    emoji: '🇳🇬',
    body: "Nigeria is Africa's most populous country, with more than 250 ethnic groups and a youthful population. HeritageHub's Nigeria Today section explains how the country works, so you can follow the news with confidence.",
  },
  {
    id: 'elections',
    tag: 'Civic Guide',
    title: 'How Nigerian Elections Work',
    teaser: 'INEC, the 25% rule and the road to Aso Rock.',
    date: daysAgo(1),
    emoji: '🗳️',
    body: "The Independent National Electoral Commission (INEC) runs elections. To win the presidency, a candidate needs the most votes and at least 25% of votes in at least two-thirds of the 36 states and the FCT. A president serves four years and may be elected at most twice. For the next election dates, check INEC's official timetable at inecnigeria.org.",
  },
  {
    id: 'arms',
    tag: 'Civic Guide',
    title: 'The Three Arms of Government',
    teaser: 'Executive, Legislature, Judiciary — who does what?',
    date: daysAgo(2),
    emoji: '⚖️',
    body: 'The Executive (President and Governors) runs government. The Legislature makes laws — the National Assembly has a 109-seat Senate and a 360-member House of Representatives. The Judiciary interprets the law, with the Supreme Court at the top.',
  },
  {
    id: 'naira',
    tag: 'Money',
    title: 'The Naira (₦) in 60 Seconds',
    teaser: 'One naira is 100 kobo. Here is the story.',
    date: daysAgo(3),
    emoji: '💵',
    body: 'The naira replaced the Nigerian pound on 1 January 1973. One naira is divided into 100 kobo. The Central Bank of Nigeria issues the currency.',
  },
  {
    id: 'zones',
    tag: 'Geography',
    title: 'Six Zones, 36 States, 774 LGAs',
    teaser: 'A quick map of how Nigeria is organised.',
    date: daysAgo(4),
    emoji: '🗺️',
    body: 'Nigeria has six geopolitical zones — North Central, North East, North West, South East, South South and South West. Together they hold 36 states plus the Federal Capital Territory, and 774 Local Government Areas.',
  },
  {
    id: 'abuja',
    tag: 'History',
    title: 'Why Abuja?',
    teaser: 'The capital that was planned from scratch.',
    date: daysAgo(5),
    emoji: '🏙️',
    body: 'The capital moved from Lagos to Abuja on 12 December 1991. Abuja was chosen for its central location and because it did not belong to any single major ethnic group. It is built around Aso Rock and Zuma Rock.',
  },
];

export async function fetchLatest(): Promise<TodayExplainer[]> {
  return UPDATES;
}

export const fmtDate = (d: Date): string =>
  d.toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' });

