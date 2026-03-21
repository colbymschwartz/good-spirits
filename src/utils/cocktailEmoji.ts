// Smart emoji mapping for cocktails — no more generic 🍸 for everything

// Specific cocktail overrides
const COCKTAIL_EMOJI: Record<string, string> = {
  'old-fashioned': '🥃',
  'manhattan': '🍷',
  'martini': '🍸',
  'negroni': '🍹',
  'margarita': '🧂',
  'daiquiri': '🍋',
  'mojito': '🌿',
  'mai-tai': '🌺',
  'pina-colada': '🥥',
  'moscow-mule': '🫏',
  'bloody-mary': '🍅',
  'cosmopolitan': '💎',
  'whiskey-sour': '🍋',
  'sidecar': '🍊',
  'sazerac': '⚜️',
  'mint-julep': '🌿',
  'tom-collins': '🫧',
  'gin-fizz': '🫧',
  'paloma': '🌸',
  'espresso-martini': '☕',
  'irish-coffee': '☕',
  'hot-toddy': '♨️',
  'zombie': '🧟',
  'hurricane': '🌀',
  'painkiller': '🏝️',
  'dark-stormy': '⛈️',
  'caipirinha': '🇧🇷',
  'aperol-spritz': '🧡',
  'champagne-cocktail': '🥂',
  'french-75': '🥂',
  'bellini': '🍑',
  'mimosa': '🍊',
  'long-island-iced-tea': '🏖️',
  'gimlet': '💚',
  'aviation': '✈️',
  'penicillin': '💊',
  'last-word': '🪦',
  'corpse-reviver': '💀',
  'jungle-bird': '🦜',
  'tiki': '🗿',
};

// Glass-based emoji
const GLASS_EMOJI: Record<string, string> = {
  'rocks': '🥃',
  'coupe': '🍸',
  'martini': '🍸',
  'highball': '🥤',
  'collins': '🫧',
  'flute': '🥂',
  'tiki': '🗿',
  'copper-mug': '🫏',
  'wine': '🍷',
  'snifter': '🍷',
  'hurricane': '🌀',
  'nick-and-nora': '🍸',
};

// Style-based fallbacks
const STYLE_EMOJI: Record<string, string> = {
  'spirit-forward': '🥃',
  'sour': '🍋',
  'highball': '🫧',
  'tiki': '🌺',
  'frozen': '🧊',
  'hot': '♨️',
  'champagne': '🥂',
  'fizz': '🫧',
  'punch': '🍹',
  'shooter': '🥃',
};

// Spirit-based fallbacks
const SPIRIT_EMOJI: Record<string, string> = {
  'whiskey': '🥃',
  'gin': '🌿',
  'rum': '🏝️',
  'tequila': '🌵',
  'mezcal': '🔥',
  'vodka': '❄️',
  'brandy': '🍇',
  'champagne': '🥂',
};

export function getCocktailEmoji(cocktail: {
  id: string;
  spirit: string;
  style: string;
  variations?: { glass?: string }[];
}): string {
  // 1. Specific cocktail match
  if (COCKTAIL_EMOJI[cocktail.id]) return COCKTAIL_EMOJI[cocktail.id];

  // 2. Glass from first variation
  const glass = cocktail.variations?.[0]?.glass;
  if (glass && GLASS_EMOJI[glass]) return GLASS_EMOJI[glass];

  // 3. Style match
  if (STYLE_EMOJI[cocktail.style]) return STYLE_EMOJI[cocktail.style];

  // 4. Spirit match
  if (SPIRIT_EMOJI[cocktail.spirit]) return SPIRIT_EMOJI[cocktail.spirit];

  // 5. Default
  return '🍸';
}
