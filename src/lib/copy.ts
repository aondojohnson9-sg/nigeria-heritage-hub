// Feedback lines. "Naija flavour" sprinkles in a little Pidgin.
const pick = (a: readonly string[]) => a[Math.floor(Math.random() * a.length)];

export const RIGHT = ['Correct!', 'Nice one!', 'Well done!', 'Brilliant!', 'Excellent!'] as const;
export const RIGHT_PIDGIN = [
  'Correct! Sharp sharp!',
  'You try! Correct!',
  'Na so! Correct!',
  'Well done o!',
  'Oya, correct!',
] as const;

export const WRONG = ['Not quite', 'So close!', 'Good try'] as const;
export const WRONG_PIDGIN = ['Chai! Not quite', 'No wahala, e go better', 'Almost o!'] as const;

export const pickRight = (naija: boolean): string => pick(naija ? RIGHT_PIDGIN : RIGHT);
export const pickWrong = (naija: boolean): string => pick(naija ? WRONG_PIDGIN : WRONG);

export const correctLine = pickRight;
export const wrongLine = pickWrong;

