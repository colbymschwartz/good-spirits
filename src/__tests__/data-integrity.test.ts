/**
 * Data Integrity Smoke Tests
 * 
 * Validates cocktail database schema and required fields.
 * Catches data entry bugs before they reach production.
 */

import { cocktails } from '../data/cocktails';

describe('Cocktail Data Integrity', () => {
  test('all cocktails have required fields', () => {
    const requiredFields = ['name', 'spirit', 'ingredients', 'instructions', 'glass'];
    
    cocktails.forEach((cocktail, index) => {
      requiredFields.forEach(field => {
        expect(cocktail).toHaveProperty(field);
        expect((cocktail as any)[field]).toBeTruthy();
      });
      
      // Name should be non-empty string
      expect(typeof cocktail.name).toBe('string');
      expect(cocktail.name.length).toBeGreaterThan(0);
      
      // Spirit should be valid
      const validSpirits = ['gin', 'vodka', 'rum', 'tequila', 'whiskey', 'brandy', 'liqueur', 'wine', 'beer', 'other'];
      expect(validSpirits).toContain(cocktail.spirit.toLowerCase());
      
      // Ingredients should be array with at least one item
      expect(Array.isArray(cocktail.ingredients)).toBe(true);
      expect(cocktail.ingredients.length).toBeGreaterThan(0);
      
      // Instructions should be non-empty
      expect(typeof cocktail.instructions).toBe('string');
      expect(cocktail.instructions.length).toBeGreaterThan(0);
      
      // Glass should be non-empty
      expect(typeof cocktail.glass).toBe('string');
      expect(cocktail.glass.length).toBeGreaterThan(0);
    });
  });
  
  test('all ingredients have name and amount', () => {
    cocktails.forEach((cocktail) => {
      cocktail.ingredients.forEach((ingredient, idx) => {
        expect(ingredient).toHaveProperty('name');
        expect(ingredient).toHaveProperty('amount');
        
        expect(typeof ingredient.name).toBe('string');
        expect(ingredient.name.length).toBeGreaterThan(0);
        
        // Amount can be string or number
        expect(['string', 'number']).toContain(typeof ingredient.amount);
      });
    });
  });
  
  test('no duplicate cocktail names', () => {
    const names = cocktails.map(c => c.name.toLowerCase());
    const uniqueNames = new Set(names);
    expect(names.length).toBe(uniqueNames.size);
  });
  
  test('cocktail count matches expected total', () => {
    // Update this when adding new cocktails
    expect(cocktails.length).toBeGreaterThanOrEqual(77);
  });
});
