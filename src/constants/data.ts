export interface ModuleItem {
  id: string;
  name: string;
  desc: string;
  iconName: string;
  route: string;
}

export const MODULES: ModuleItem[] = [
  {
    id: 'history',
    name: 'History',
    desc: 'Timelines, empires & the road to independence',
    iconName: 'book-outline',
    route: '/(tabs)/history',
  },
  {
    id: 'constitution',
    name: 'Constitution',
    desc: 'The 1999 Constitution, explained section by section',
    iconName: 'document-text-outline',
    route: '/(tabs)/constitution',
  },
  {
    id: 'culture',
    name: 'Culture',
    desc: 'Languages, festivals & the 250+ ethnic groups',
    iconName: 'people-outline',
    route: '/culture',
  },
  {
    id: 'states',
    name: 'States',
    desc: '36 states + FCT — capitals, maps & facts',
    iconName: 'map-outline',
    route: '/states',
  },
  {
    id: 'games',
    name: 'Games',
    desc: 'Quizzes and challenges on Nigerian trivia',
    iconName: 'trophy-outline',
    route: '/(tabs)/games',
  },
  {
    id: 'more',
    name: 'More',
    desc: 'Settings, saved items & about this hub',
    iconName: 'ellipsis-horizontal-circle-outline',
    route: '/(tabs)/more',
  },
];

export interface TimelineEvent {
  year: string;
  title: string;
  desc: string;
  tag: string;
}

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: '900 BC – 1500 AD',
    title: 'Pre-Colonial Kingdoms',
    desc: 'Vibrant civilizations flourished, including the Nok culture (famed for terracotta sculptures), the Kingdom of Nri, the Kanem-Bornu Empire, the Oyo Empire, and the Benin Empire (renowned for bronze castings).',
    tag: 'Kingdoms',
  },
  {
    year: '1914',
    title: 'The Amalgamation',
    desc: 'Lord Lugard, the British Governor-General, unified the Northern and Southern Protectorates of Nigeria into a single political entity, establishing the modern geographical boundary of Nigeria.',
    tag: 'Colonial',
  },
  {
    year: '1960',
    title: 'Independence Day',
    desc: 'On October 1, 1960, Nigeria gained independence from British colonial rule. Sir Abubakar Tafawa Balewa became the Prime Minister, and Dr. Nnamdi Azikiwe became the Governor-General (later first President).',
    tag: 'Sovereignty',
  },
  {
    year: '1967 – 1970',
    title: 'The Civil War',
    desc: 'Following ethnic tensions and military coups, the Eastern Region attempted to secede as the Republic of Biafra, leading to a tragic 30-month civil war that ended in 1970 with a focus on national integration.',
    tag: 'Crisis',
  },
  {
    year: '1999',
    title: 'The Fourth Republic',
    desc: 'After decades of military regimes, democracy was restored on May 29, 1999. General Olusegun Obasanjo (Rtd) was sworn in as President, marking the start of the longest unbroken democratic era in Nigeria.',
    tag: 'Democracy',
  },
];

export interface ConstitutionChapter {
  id: string;
  title: string;
  articles: string;
  summary: string;
  detail: string[];
}

export const CONSTITUTION_CHAPTERS: ConstitutionChapter[] = [
  {
    id: 'ch1',
    title: 'Chapter I: General Provisions',
    articles: 'Sections 1 – 12',
    summary:
      'Asserts that the Constitution is supreme and binding on all authorities and persons throughout Nigeria. It establishes Nigeria as a sovereign, indivisible democratic state comprised of 36 states and the Federal Capital Territory.',
    detail: [
      'Section 1: Supremacy of the Constitution (laws contrary to it are void).',
      'Section 2: The Federal Republic of Nigeria (indivisible and indissoluble).',
      'Section 3: States and Local Government Areas of the Federation.',
    ],
  },
  {
    id: 'ch2',
    title: 'Chapter II: Fundamental Objectives & Directive Principles',
    articles: 'Sections 13 – 24',
    summary:
      'Defines the core responsibilities of government institutions. It establishes that sovereignty belongs to the people, and welfare and security are the primary purpose of government.',
    detail: [
      'Section 14: The Government and the People (democratic ideals and federal character).',
      'Section 15: Political objectives (national integration, active opposition to corruption).',
      'Section 16: Economic objectives (maximizing welfare, preventing concentration of wealth).',
      'Section 17: Social objectives (equality, justice, healthcare, and education access).',
    ],
  },
  {
    id: 'ch3',
    title: 'Chapter III: Citizenship',
    articles: 'Sections 25 – 32',
    summary:
      'Specifies how Nigerian citizenship is defined, acquired, and forfeited. It details qualifications for citizenship by birth, registration, and naturalization, along with dual citizenship rules.',
    detail: [
      'Section 25: Citizenship by birth.',
      'Section 26: Citizenship by registration (marriage or other criteria).',
      'Section 27: Citizenship by naturalization.',
      'Section 28: Dual citizenship regulations.',
    ],
  },
  {
    id: 'ch4',
    title: 'Chapter IV: Fundamental Rights',
    articles: 'Sections 33 – 46',
    summary:
      'Protects basic civil rights and liberties. These rights are protected and enforceable in courts of law to shield individuals from state power or private abuse.',
    detail: [
      'Section 33: Right to life.',
      'Section 34: Right to dignity of the human person (no torture or forced labor).',
      'Section 35: Right to personal liberty.',
      'Section 36: Right to fair hearing.',
      'Section 38 & 39: Freedom of thought, conscience, religion, and expression.',
      'Section 40 & 41: Right to peaceful assembly, association, and freedom of movement.',
    ],
  },
];

export interface EthnicGroup {
  name: string;
  region: string;
  language: string;
  desc: string;
}

export const ETHNIC_GROUPS: EthnicGroup[] = [
  {
    name: 'Hausa-Fulani',
    region: 'Northern Nigeria',
    language: 'Hausa',
    desc: 'Making up approximately 30% of the population, the Hausa and Fulani are historically linked. They have a rich Islamic tradition, colorful dress styles (baban riga), and are famous for the Durbar festival, horsemanship, and trading networks.',
  },
  {
    name: 'Yoruba',
    region: 'South-Western Nigeria',
    language: 'Yoruba',
    desc: 'Representing about 21% of the population, the Yoruba are known for their ancient monarchies (Obas), complex mythology (Orishas), talking drums (Gangan), elaborate dress (Aso Oke), and high regard for education and festivals.',
  },
  {
    name: 'Igbo',
    region: 'South-Eastern Nigeria',
    language: 'Igbo',
    desc: "Making up around 18% of the population, the Igbo are renowned for their decentralized democratic heritage, vibrant trade/entrepreneurship, the apprentice system ('Igba Boyi'), artistic pottery, masquerades, and the New Yam Festival.",
  },
  {
    name: 'Minority Groups',
    region: 'Across the Nation',
    language: '250+ Dialects',
    desc: 'Nigeria is home to over 250 other ethnic groups, including the Ijaw, Kanuri, Tiv, Ibibio, Edo, and Efik. Each group contributes unique languages, music, textiles, and cuisine, creating a rich cultural mosaic.',
  },
];

export interface Festival {
  name: string;
  location: string;
  date: string;
  desc: string;
}

export const FESTIVALS: Festival[] = [
  {
    name: 'Durbar Festival',
    location: 'Kano, Katsina & Zaria',
    date: 'Eid al-Fitr & Eid al-Adha',
    desc: 'A spectacular royal parade featuring thousands of adorned horsemen, emirs in flowing robes, and traditional musicians. It marks the end of Muslim festivals and showcases horse riding skills and historical military power.',
  },
  {
    name: 'Eyo Festival',
    location: 'Lagos Island',
    date: 'Occasional (Memorial)',
    desc: "Also known as the Adamu Orisha Play, this unique carnival features white-clad masquerades ('Eyo') carrying decorated staves ('Opambata'). It is staged to honor deceased leaders or celebrate historical transitions.",
  },
  {
    name: 'Argungu Fishing Festival',
    location: 'Argungu, Kebbi State',
    date: 'March (Annually)',
    desc: 'A massive, competitive fishing event where thousands of fishermen jump into the Matan Fada River simultaneously. Equipped with hand nets and large gourds, they compete to catch the largest Nile Perch (some over 70kg).',
  },
  {
    name: 'New Yam Festival',
    location: 'South-Eastern region',
    date: 'August (Annually)',
    desc: "Known as 'Iri Ji' or 'Iwa Ji', this harvest festival marks the end of the agricultural cycle. It includes offering yams to ancestors, traditional dances, wrestling matches, and community feasts before eating new yams.",
  },
];

export const ZONES = [
  'All',
  'North Central',
  'North East',
  'North West',
  'South East',
  'South South',
  'South West',
] as const;

export interface StateData {
  name: string;
  capital: string;
  zone: string;
  fact: string;
}

export const STATES_DATA: StateData[] = [
  {
    name: 'Lagos',
    capital: 'Ikeja',
    zone: 'South West',
    fact: 'The economic nerve center of West Africa and the most populous city on the African continent.',
  },
  {
    name: 'Kano',
    capital: 'Kano',
    zone: 'North West',
    fact: 'An ancient commercial hub, home to the historical Kurmi Market founded in the 15th century.',
  },
  {
    name: 'Federal Capital Territory',
    capital: 'Abuja',
    zone: 'North Central',
    fact: "Officially replaced Lagos as Nigeria's capital city in December 1991, custom-built for neutrality.",
  },
  {
    name: 'Rivers',
    capital: 'Port Harcourt',
    zone: 'South South',
    fact: 'Major industrial and economic power, famous for oil refining and port activities in the Delta.',
  },
  {
    name: 'Anambra',
    capital: 'Awka',
    zone: 'South East',
    fact: "Famous for trade and industry, hosting the massive Onitsha Main Market (West Africa's largest).",
  },
  {
    name: 'Borno',
    capital: 'Maiduguri',
    zone: 'North East',
    fact: 'Seat of the ancient Kanem-Bornu Empire, which survived as a sovereign power for over 1000 years.',
  },
  {
    name: 'Oyo',
    capital: 'Ibadan',
    zone: 'South West',
    fact: "Host to the University of Ibadan, Nigeria's premier university founded in 1948, and massive brown roofs.",
  },
  {
    name: 'Enugu',
    capital: 'Enugu',
    zone: 'South East',
    fact: "Known as the 'Coal City' due to historical mining, it served as the administrative capital of the old Eastern Region.",
  },
  {
    name: 'Plateau',
    capital: 'Jos',
    zone: 'North Central',
    fact: 'Renowned for its cool, temperate weather, unique rock formations, and scenic hills.',
  },
  {
    name: 'Cross River',
    capital: 'Calabar',
    zone: 'South South',
    fact: "Hosts the annual Calabar Carnival (Africa's biggest street party) and the scenic Obudu Mountain Resort.",
  },
  {
    name: 'Kaduna',
    capital: 'Kaduna',
    zone: 'North West',
    fact: 'A major administrative center that served as the capital of the historic Northern Region.',
  },
  {
    name: 'Edo',
    capital: 'Benin City',
    zone: 'South South',
    fact: 'Home of the famous Benin Empire and the exquisite Benin Bronze artworks looted in 1897.',
  },
];

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  fact: string;
}

export const QUESTIONS: QuizQuestion[] = [
  {
    question: "Who was Nigeria's first Prime Minister?",
    options: [
      'Dr. Nnamdi Azikiwe',
      'Sir Abubakar Tafawa Balewa',
      'Chief Obafemi Awolowo',
      'Sir Ahmadu Bello',
    ],
    answer: 1,
    fact: 'Sir Abubakar Tafawa Balewa served as the first and only Prime Minister of independent Nigeria from 1960 to 1966.',
  },
  {
    question:
      'In what year did the amalgamation of the Northern and Southern Protectorates happen?',
    options: ['1960', '1914', '1901', '1963'],
    answer: 1,
    fact: 'Lord Lugard unified the Southern and Northern Protectorates in 1914 to form the Colony and Protectorate of Nigeria.',
  },
  {
    question: "Which Nigerian state is historically referred to as the 'Coal City'?",
    options: ['Enugu', 'Rivers', 'Kogi', 'Plateau'],
    answer: 0,
    fact: "Enugu is known as the Coal City because coal was discovered there in 1909, prompting the city's growth as a major mining center.",
  },
  {
    question: 'What is the national motto of the Federal Republic of Nigeria?',
    options: [
      'Peace, Unity, and Progress',
      'Unity and Faith, Peace and Progress',
      'One Nigeria, One Destiny',
      'Justice and Truth, Peace and Prosperity',
    ],
    answer: 1,
    fact: "The national motto is 'Unity and Faith, Peace and Progress', as inscribed on the Coat of Arms.",
  },
  {
    question: 'Which city officially replaced Lagos as Nigeria’s capital city in December 1991?',
    options: ['Kano', 'Ibadan', 'Abuja', 'Enugu'],
    answer: 2,
    fact: 'Abuja was selected as the new capital for its central location, ease of access, and lack of historical domination by any single group.',
  },
];

export interface ResourceItem {
  title: string;
  desc: string;
  url: string;
  tag: string;
}

export const RESOURCES: ResourceItem[] = [
  {
    title: 'National Bureau of Statistics',
    desc: "Official data on Nigeria's demographics, economy, and state-level statistics.",
    url: 'https://www.nigerianstat.gov.ng/',
    tag: 'Official Data',
  },
  {
    title: 'Nigerian Constitution (1999)',
    desc: 'Full text of the Constitution of the Federal Republic of Nigeria, as amended.',
    url: 'https://www.nigeria-law.org/ConstitutionOfTheFederalRepublicOfNigeria.htm',
    tag: 'Legal',
  },
  {
    title: 'National Commission for Museums & Monuments',
    desc: "Custodians of Nigeria's cultural heritage, art, and historical monuments.",
    url: 'https://www.ncmm.gov.ng/',
    tag: 'Culture',
  },
  {
    title: 'Encyclopaedia Britannica – Nigeria',
    desc: "Comprehensive encyclopedia entry covering Nigeria's history, geography, and people.",
    url: 'https://www.britannica.com/place/Nigeria',
    tag: 'Reference',
  },
];

export const TEAM = [
  { role: 'Product Design', name: 'Heritage Hub Team' },
  { role: 'Data Sources', name: 'NBS, Britannica, Nigeria Law' },
  { role: 'Mobile Framework', name: 'Expo SDK 57 + React Native' },
];

export const QUICK_FACTS = [
  'Largest economy in Africa',
  '250+ ethnic groups',
  'Rich cultural heritage',
  '500+ indigenous languages',
];

export const STATS = [
  { value: '220M+', label: 'Population' },
  { value: '36', label: 'States + FCT' },
  { value: '500+', label: 'Languages' },
  { value: '$363B', label: 'GDP (2024)' },
];
