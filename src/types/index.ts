export interface Variation {
  name: string;
  canon: boolean;
  spec: string[];
  ingredients: string[];
  glass: string;
  garnish: string;
  method: string;
  steps: string;
  ratioNotes: string;
  brandRecs: string;
  isCustom?: boolean;
}

export interface Cocktail {
  id: string;
  name: string;
  style: string;
  spirit: string;
  era: string;
  history: string;
  tags: string[];
  variations: Variation[];
  isCustom?: boolean;
}

export interface IngredientItem {
  id: string;
  name: string;
  essential: boolean;
  brands: string[];
}

export interface IngredientCategory {
  category: string;
  icon: string;
  items: IngredientItem[];
}

export interface Technique {
  id: string;
  name: string;
  icon: string;
  summary: string;
  content: string;
  tips: string[];
  usedIn: string[];
}

export interface HistoryEra {
  id: string;
  name: string;
  period: string;
  icon: string;
  summary: string;
  content: string;
  keyDrinks: string[];
  keyFigures: string[];
  keyInnovation: string;
}

export type SpiritType = 'whiskey' | 'gin' | 'rum' | 'tequila' | 'mezcal' | 'vodka' | 'brandy' | 'champagne' | 'other';

export interface SpiritIcons {
  [key: string]: string;
}

export interface StyleLabels {
  [key: string]: string;
}

export interface MoodLabels {
  [key: string]: string;
}
