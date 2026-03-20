// Extracted spirit data and utilities from the original Good Spirits app
// DO NOT MODIFY: All data is character-for-character preserved from original

import { storage } from '../utils/storage';

// ========== SPIRIT ICONS ==========
export const SPIRIT_ICONS = {
  "whiskey": "\u{1F943}",
  "gin": "\u{1F378}",
  "rum": "\u{1F3DD}",
  "tequila": "\u{1F335}",
  "mezcal": "\u{1F525}",
  "vodka": "\u{2744}",
  "brandy": "\u{1F377}",
  "champagne": "\u{1F37E}",
  "other": "\u{2728}"
};

export const BASE_SPIRITS = ["whiskey", "gin", "rum", "tequila", "mezcal", "vodka", "brandy", "champagne"];

// ========== SPIRIT HELPER FUNCTIONS ==========
export function getCustomSpirits() {
  return storage.get("customSpirits", []);
}

export function addCustomSpirit(name) {
  if (!name || !name.trim()) return;
  const n = name.trim().toLowerCase();
  if (BASE_SPIRITS.includes(n) || n === "other") return;
  const existing = getCustomSpirits();
  if (!existing.includes(n)) {
    existing.push(n);
    storage.set("customSpirits", existing);
  }
}

export function getAllSpirits() {
  return [...BASE_SPIRITS, ...getCustomSpirits(), "other"];
}

export function spiritLabel(s) {
  return s === "all" ? "All Spirits" : (SPIRIT_ICONS[s] || "\u{2728}") + " " + s.charAt(0).toUpperCase() + s.slice(1);
}

// ========== STYLE LABELS ==========
export const STYLE_LABELS = {
  "spirit-forward": "Spirit-Forward",
  "sour": "Sour",
  "highball": "Highball",
  "tiki": "Tiki",
  "fizz": "Fizz",
  "punch": "Punch",
  "hot": "Hot",
  "frozen": "Frozen",
  "spritz": "Spritz",
  "flip": "Flip"
};

// ========== MOOD LABELS ==========
export const MOOD_LABELS = {
  "after-dinner": "After Dinner",
  "summer": "Summer",
  "winter": "Winter",
  "crowd-pleaser": "Crowd Pleaser",
  "date-night": "Date Night",
  "classic": "Classic",
  "bold": "Bold",
  "refreshing": "Refreshing",
  "contemplative": "Contemplative",
  "brunch": "Brunch",
  "party": "Party",
  "impress-someone": "Impress Someone",
  "tropical": "Tropical",
  "easy": "Easy",
  "complex": "Complex",
  "bitter": "Bitter",
  "smoky": "Smoky"
};
