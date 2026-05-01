import { SpiritIcons, StyleLabels, MoodLabels } from '../types';

export const SPIRIT_ICONS: SpiritIcons = {
  whiskey: '🥃',
  gin: '🍸',
  rum: '🏝️',
  tequila: '🌵',
  mezcal: '🔥',
  vodka: '❄️',
  brandy: '🍷',
  champagne: '🍾',
  'non-alcoholic': '🌿',
  other: '✨',
};

export const BASE_SPIRITS = ['whiskey', 'gin', 'rum', 'tequila', 'mezcal', 'vodka', 'brandy', 'champagne', 'non-alcoholic'] as const;

export function spiritLabel(s: string): string {
  if (s === 'all') return 'All Spirits';
  const icon = SPIRIT_ICONS[s] || '✨';
  const name = s === 'non-alcoholic' ? 'Non-Alcoholic' : s.charAt(0).toUpperCase() + s.slice(1);
  return icon + ' ' + name;
}

export const STYLE_LABELS: StyleLabels = {
  'spirit-forward': 'Spirit-Forward',
  sour: 'Sour',
  highball: 'Highball',
  tiki: 'Tiki',
  fizz: 'Fizz',
  hot: 'Hot',
  frozen: 'Frozen',
  spritz: 'Spritz',
};

export const MOOD_LABELS: MoodLabels = {
  'after-dinner': 'After Dinner',
  summer: 'Summer',
  winter: 'Winter',
  'crowd-pleaser': 'Crowd Pleaser',
  'date-night': 'Date Night',
  classic: 'Classic',
  bold: 'Bold',
  refreshing: 'Refreshing',
  contemplative: 'Contemplative',
  brunch: 'Brunch',
  party: 'Party',
  'impress-someone': 'Impress Someone',
  tropical: 'Tropical',
  easy: 'Easy',
  complex: 'Complex',
  bitter: 'Bitter',
  smoky: 'Smoky',
};
