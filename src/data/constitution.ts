export interface ConstitutionChapter {
  id: string;
  num: string;
  title: string;
  range: string;
  summary: string;
  points: string[];
}

export const CHAPTERS: ConstitutionChapter[] = [
  {
    id: 'ch1',
    num: 'I',
    title: 'General Provisions',
    range: 'Sections 1 – 12',
    summary:
      'The Constitution is supreme and binds every authority and person. Nigeria is one indivisible, sovereign state made up of 36 states and the Federal Capital Territory.',
    points: [
      'Section 1: The Constitution is supreme — laws that contradict it are void.',
      'Section 2: Nigeria is one indivisible and indissoluble sovereign state.',
      'Section 3: States and Local Government Areas of the Federation.',
    ],
  },
  {
    id: 'ch2',
    num: 'II',
    title: 'Fundamental Objectives & Directive Principles',
    range: 'Sections 13 – 24',
    summary:
      'Sets the goals government should work towards: sovereignty belongs to the people, and security and welfare are the purpose of government.',
    points: [
      'Section 14: Government by the people, with federal character.',
      'Section 15: National integration and opposing corruption.',
      'Section 16: Economic objectives — welfare and fair opportunity.',
      'Section 17: Social order — equality, justice and access to education.',
    ],
  },
  {
    id: 'ch3',
    num: 'III',
    title: 'Citizenship',
    range: 'Sections 25 – 32',
    summary: 'Explains who is a Nigerian citizen and how citizenship is gained or lost.',
    points: [
      'Section 25: Citizenship by birth.',
      'Section 26: Citizenship by registration.',
      'Section 27: Citizenship by naturalisation.',
      'Section 28: Dual citizenship rules.',
    ],
  },
  {
    id: 'ch4',
    num: 'IV',
    title: 'Fundamental Rights',
    range: 'Sections 33 – 46',
    summary: 'Protects basic human rights that courts can enforce against the state or private abuse.',
    points: [
      'Section 33: Right to life.',
      'Section 34: Dignity of the human person.',
      'Section 35: Personal liberty.',
      'Section 36: Fair hearing.',
      'Sections 38–39: Freedom of thought, religion and expression.',
      'Sections 40–41: Assembly, association and movement.',
    ],
  },
  {
    id: 'ch5',
    num: 'V',
    title: 'The Legislature',
    range: 'National Assembly',
    summary: 'Lawmaking power sits with the National Assembly, which has two chambers.',
    points: [
      'Section 47: A National Assembly made of a Senate and a House of Representatives.',
      'Section 48: The Senate — three senators per state and one for the FCT (109 seats).',
      'Section 49: The House of Representatives has 360 members.',
    ],
  },
  {
    id: 'ch6',
    num: 'VI',
    title: 'The Executive',
    range: 'President & Governors',
    summary: 'Executive power is held by the President at the federal level and by Governors in the states.',
    points: [
      'Section 130: There is a President of the Federation.',
      'Section 132: Elected for a four-year term.',
      'Section 137: A person cannot be elected President more than twice.',
    ],
  },
  {
    id: 'ch7',
    num: 'VII',
    title: 'The Judicature',
    range: 'The Courts',
    summary: 'Judicial power rests in the courts, which interpret the law and settle disputes.',
    points: [
      'Section 230: The Supreme Court of Nigeria.',
      'Section 237: The Court of Appeal.',
      'Section 249: The Federal High Court.',
    ],
  },
];

