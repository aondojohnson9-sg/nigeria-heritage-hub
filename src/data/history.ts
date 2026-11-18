export interface HistoryStop {
  id: string;
  year: string;
  title: string;
  tag: string;
  emoji: string;
  text: string;
  fun: string;
}

export const HISTORY: HistoryStop[] = [
  {
    id: 'nok',
    year: '900 BC – 200 AD',
    title: 'The Nok Culture',
    tag: 'Kingdoms',
    emoji: '🏺',
    text: "One of West Africa's earliest known civilisations. The Nok people worked iron and sculpted lifelike terracotta heads and figures that are still admired in museums today.",
    fun: 'Nok terracottas are among the oldest large-scale sculptures in sub-Saharan Africa.',
  },
  {
    id: 'kanem',
    year: 'c. 700 – 1900',
    title: 'Kanem-Bornu Empire',
    tag: 'Kingdoms',
    emoji: '🐪',
    text: "Around Lake Chad, Kanem and later Bornu grew rich on trans-Saharan trade and ruled for roughly a thousand years, making it one of Africa's longest-lived states.",
    fun: "Bornu's rulers were known as the Mai.",
  },
  {
    id: 'benin',
    year: 'c. 1180 – 1897',
    title: 'The Benin Empire',
    tag: 'Kingdoms',
    emoji: '🦅',
    text: "Centred on Benin City, the Oba's kingdom produced the famed Benin Bronzes — brass plaques and heads that recorded the court's history. British forces sacked the city in 1897.",
    fun: 'Many of the Benin Bronzes were taken in 1897 and now sit in museums abroad.',
  },
  {
    id: 'oyo',
    year: 'c. 1400 – 1835',
    title: 'The Oyo Empire',
    tag: 'Kingdoms',
    emoji: '🐴',
    text: "A Yoruba power built on cavalry and trade. At its height, Oyo's influence reached across much of what is now south-western Nigeria and beyond.",
    fun: 'The ruler of Oyo is called the Alaafin.',
  },
  {
    id: 'sokoto',
    year: '1804',
    title: 'The Sokoto Caliphate',
    tag: 'Kingdoms',
    emoji: '📜',
    text: 'Led by the scholar Usman dan Fodio, a reform movement united the Hausa states under a new caliphate, which became one of the largest states in 19th-century Africa.',
    fun: 'Sokoto\'s slogan today is "Seat of the Caliphate".',
  },
  {
    id: 'lugard',
    year: '1914',
    title: 'The Amalgamation',
    tag: 'Colonial',
    emoji: '🗺️',
    text: 'Lord Lugard merged the Northern and Southern Protectorates into one colony, creating the borders of modern Nigeria.',
    fun: 'The name "Nigeria" had been suggested earlier by journalist Flora Shaw.',
  },
  {
    id: 'independence',
    year: '1 Oct 1960',
    title: 'Independence Day',
    tag: 'Sovereignty',
    emoji: '🎉',
    text: 'Nigeria gained independence from Britain. Sir Abubakar Tafawa Balewa was Prime Minister and Dr Nnamdi Azikiwe was Governor-General, later the first President.',
    fun: 'The green-white-green flag was designed by Michael Taiwo Akinkunmi.',
  },
  {
    id: 'republic',
    year: '1963',
    title: 'A Republic is Born',
    tag: 'Sovereignty',
    emoji: '🏛️',
    text: 'On 1 October 1963 Nigeria became a republic and cut its last formal ties to the British Crown. Dr Nnamdi Azikiwe became the first President.',
    fun: "That made the Queen no longer Nigeria's head of state.",
  },
  {
    id: 'coups',
    year: '1966',
    title: 'The First Coups',
    tag: 'Crisis',
    emoji: '⚡',
    text: 'In January 1966 military officers seized power, and Major-General Johnson Aguiyi-Ironsi became head of state. A counter-coup in July brought Yakubu Gowon to power.',
    fun: 'It was the start of three decades of mostly military rule.',
  },
  {
    id: 'war',
    year: '1967 – 1970',
    title: 'The Civil War',
    tag: 'Crisis',
    emoji: '🕊️',
    text: 'The Eastern Region declared itself the Republic of Biafra, leading to a 30-month war that ended in January 1970. The government promised reconciliation: "No victor, no vanquished".',
    fun: 'The war ended on 15 January 1970.',
  },
  {
    id: 'abuja',
    year: '12 Dec 1991',
    title: 'Abuja Becomes Capital',
    tag: 'Nation',
    emoji: '🏙️',
    text: 'The seat of government officially moved from Lagos to the purpose-built, centrally located city of Abuja.',
    fun: "Aso Rock and Zuma Rock frame the capital's skyline.",
  },
  {
    id: 'fourth',
    year: '29 May 1999',
    title: 'The Fourth Republic',
    tag: 'Democracy',
    emoji: '🗳️',
    text: "After years of military rule, democracy returned. Olusegun Obasanjo was sworn in as President, starting Nigeria's longest unbroken civilian era.",
    fun: 'Democracy Day was moved from 29 May to 12 June in 2019.',
  },
];

