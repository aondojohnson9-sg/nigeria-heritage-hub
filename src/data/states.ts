export interface NigeriaState {
  id: string;
  name: string;
  capital: string;
  zone: string;
  slogan: string;
  governor: string;
  note?: string;
}

// 36 states + FCT. Slogans vary slightly by source; governors verified 16 Nov 2026
// (Ekiti & Osun incumbents were re-elected in June & August 2026). Re-verify before submission.
export const ZONES = [
  'All',
  'North Central',
  'North East',
  'North West',
  'South East',
  'South South',
  'South West',
] as const;

export const GOVERNORS_AS_OF = '16 Nov 2026';

export const STATES: NigeriaState[] = [
  { id: 'abia', name: 'Abia', capital: 'Umuahia', zone: 'South East', slogan: "God's Own State", governor: 'Alex Otti' },
  { id: 'adamawa', name: 'Adamawa', capital: 'Yola', zone: 'North East', slogan: 'Land of Beauty', governor: 'Ahmadu Umaru Fintiri' },
  { id: 'akwa-ibom', name: 'Akwa Ibom', capital: 'Uyo', zone: 'South South', slogan: 'Land of Promise', governor: 'Umo Eno' },
  { id: 'anambra', name: 'Anambra', capital: 'Awka', zone: 'South East', slogan: 'Light of the Nation', governor: 'Charles Soludo' },
  { id: 'bauchi', name: 'Bauchi', capital: 'Bauchi', zone: 'North East', slogan: 'Pearl of Tourism', governor: 'Bala Mohammed' },
  { id: 'bayelsa', name: 'Bayelsa', capital: 'Yenagoa', zone: 'South South', slogan: 'Pride of the Nation', governor: 'Douye Diri' },
  { id: 'benue', name: 'Benue', capital: 'Makurdi', zone: 'North Central', slogan: 'Food Basket of the Nation', governor: 'Hyacinth Alia' },
  { id: 'borno', name: 'Borno', capital: 'Maiduguri', zone: 'North East', slogan: 'Home of Peace', governor: 'Babagana Zulum' },
  { id: 'cross-river', name: 'Cross River', capital: 'Calabar', zone: 'South South', slogan: "The People's Paradise", governor: 'Bassey Otu' },
  { id: 'delta', name: 'Delta', capital: 'Asaba', zone: 'South South', slogan: 'The Big Heart', governor: 'Sheriff Oborevwori' },
  { id: 'ebonyi', name: 'Ebonyi', capital: 'Abakaliki', zone: 'South East', slogan: 'Salt of the Nation', governor: 'Francis Nwifuru' },
  { id: 'edo', name: 'Edo', capital: 'Benin City', zone: 'South South', slogan: 'Heartbeat of the Nation', governor: 'Monday Okpebholo' },
  { id: 'ekiti', name: 'Ekiti', capital: 'Ado-Ekiti', zone: 'South West', slogan: 'Fountain of Knowledge', governor: 'Biodun Oyebanji' },
  { id: 'enugu', name: 'Enugu', capital: 'Enugu', zone: 'South East', slogan: 'Coal City State', governor: 'Peter Mbah' },
  {
    id: 'fct',
    name: 'FCT',
    capital: 'Abuja',
    zone: 'North Central',
    slogan: 'Centre of Unity',
    governor: 'Minister: Nyesom Wike',
    note: 'The Federal Capital Territory is run by a Minister, not an elected governor.',
  },
  { id: 'gombe', name: 'Gombe', capital: 'Gombe', zone: 'North East', slogan: 'Jewel in the Savannah', governor: 'Inuwa Yahaya' },
  { id: 'imo', name: 'Imo', capital: 'Owerri', zone: 'South East', slogan: 'Eastern Heartland', governor: 'Hope Uzodimma' },
  { id: 'jigawa', name: 'Jigawa', capital: 'Dutse', zone: 'North West', slogan: 'The New World', governor: 'Umar Namadi' },
  { id: 'kaduna', name: 'Kaduna', capital: 'Kaduna', zone: 'North West', slogan: 'Liberal State', governor: 'Uba Sani' },
  { id: 'kano', name: 'Kano', capital: 'Kano', zone: 'North West', slogan: 'Centre of Commerce', governor: 'Abba Kabir Yusuf' },
  { id: 'katsina', name: 'Katsina', capital: 'Katsina', zone: 'North West', slogan: 'Home of Hospitality', governor: 'Dikko Umaru Radda' },
  { id: 'kebbi', name: 'Kebbi', capital: 'Birnin Kebbi', zone: 'North West', slogan: 'Land of Equity', governor: 'Nasir Idris' },
  { id: 'kogi', name: 'Kogi', capital: 'Lokoja', zone: 'North Central', slogan: 'Confluence State', governor: 'Usman Ododo' },
  { id: 'kwara', name: 'Kwara', capital: 'Ilorin', zone: 'North Central', slogan: 'State of Harmony', governor: 'AbdulRahman AbdulRazaq' },
  { id: 'lagos', name: 'Lagos', capital: 'Ikeja', zone: 'South West', slogan: 'Centre of Excellence', governor: 'Babajide Sanwo-Olu' },
  { id: 'nasarawa', name: 'Nasarawa', capital: 'Lafia', zone: 'North Central', slogan: 'Home of Solid Minerals', governor: 'Abdullahi Sule' },
  { id: 'niger', name: 'Niger', capital: 'Minna', zone: 'North Central', slogan: 'Power State', governor: 'Umaru Bago' },
  { id: 'ogun', name: 'Ogun', capital: 'Abeokuta', zone: 'South West', slogan: 'Gateway State', governor: 'Dapo Abiodun' },
  { id: 'ondo', name: 'Ondo', capital: 'Akure', zone: 'South West', slogan: 'Sunshine State', governor: 'Lucky Aiyedatiwa' },
  { id: 'osun', name: 'Osun', capital: 'Osogbo', zone: 'South West', slogan: 'State of the Living Spring', governor: 'Ademola Adeleke' },
  { id: 'oyo', name: 'Oyo', capital: 'Ibadan', zone: 'South West', slogan: 'Pacesetter State', governor: 'Seyi Makinde' },
  { id: 'plateau', name: 'Plateau', capital: 'Jos', zone: 'North Central', slogan: 'Home of Peace and Tourism', governor: 'Caleb Mutfwang' },
  { id: 'rivers', name: 'Rivers', capital: 'Port Harcourt', zone: 'South South', slogan: 'Treasure Base of the Nation', governor: 'Siminalayi Fubara' },
  { id: 'sokoto', name: 'Sokoto', capital: 'Sokoto', zone: 'North West', slogan: 'Seat of the Caliphate', governor: 'Ahmed Aliyu' },
  { id: 'taraba', name: 'Taraba', capital: 'Jalingo', zone: 'North East', slogan: "Nature's Gift to the Nation", governor: 'Agbu Kefas' },
  { id: 'yobe', name: 'Yobe', capital: 'Damaturu', zone: 'North East', slogan: 'Young Shall Grow', governor: 'Mai Mala Buni' },
  { id: 'zamfara', name: 'Zamfara', capital: 'Gusau', zone: 'North West', slogan: 'Farming Is Our Pride', governor: 'Dauda Lawal' },
];

export const ZONE_EMOJI: Record<string, string> = {
  'North Central': '🌾',
  'North East': '🏜️',
  'North West': '🐎',
  'South East': '🥭',
  'South South': '🛢️',
  'South West': '🥁',
};

