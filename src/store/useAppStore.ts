import { create } from 'zustand';
import { storage } from './storage';
import { Cocktail, Variation, IngredientItem } from '../types';

interface AppState {
  favorites: string[];
  madeIt: string[];
  ratings: Record<string, number>;
  myBar: string[];
  barBrands: Record<string, string>;
  customCocktails: Cocktail[];
  customVariations: Record<string, Variation[]>;
  customIngredients: Record<string, IngredientItem[]>;
  notes: Record<string, string>;
  photos: Record<string, string>;
  hasSeenOnboarding: boolean;
  hydrated: boolean;

  // Actions
  toggleFavorite: (id: string) => void;
  toggleMadeIt: (id: string) => void;
  setRating: (id: string, rating: number) => void;
  toggleBarItem: (ingredientId: string) => void;
  setBarBrands: (brands: Record<string, string>) => void;
  addCustomIngredient: (category: string, ingredient: IngredientItem) => void;
  saveNote: (cocktailId: string, varName: string, text: string) => void;
  getNote: (cocktailId: string, varName: string) => string;
  savePhoto: (cocktailId: string, varName: string, uri: string) => void;
  getPhoto: (cocktailId: string, varName: string) => string | null;
  saveCustomVariation: (cocktailId: string, variation: Variation) => void;
  deleteCustomVariation: (cocktailId: string, varName: string) => void;
  saveCustomCocktail: (cocktail: Cocktail) => void;
  deleteCustomCocktail: (id: string) => void;
  setHasSeenOnboarding: () => void;
  hydrate: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  favorites: [],
  madeIt: [],
  ratings: {},
  myBar: [],
  barBrands: {},
  customCocktails: [],
  customVariations: {},
  customIngredients: {},
  notes: {},
  photos: {},
  hasSeenOnboarding: false,
  hydrated: false,

  toggleFavorite: (id) => {
    set((state) => {
      const favorites = state.favorites.includes(id)
        ? state.favorites.filter((x) => x !== id)
        : [...state.favorites, id];
      storage.set('favorites', favorites);
      return { favorites };
    });
  },

  toggleMadeIt: (id) => {
    set((state) => {
      const madeIt = state.madeIt.includes(id)
        ? state.madeIt.filter((x) => x !== id)
        : [...state.madeIt, id];
      storage.set('madeIt', madeIt);
      return { madeIt };
    });
  },

  setRating: (id, rating) => {
    set((state) => {
      const ratings = { ...state.ratings, [id]: rating };
      storage.set('ratings', ratings);
      return { ratings };
    });
  },

  toggleBarItem: (ingredientId) => {
    set((state) => {
      const myBar = state.myBar.includes(ingredientId)
        ? state.myBar.filter((x) => x !== ingredientId)
        : [...state.myBar, ingredientId];
      storage.set('myBar', myBar);
      return { myBar };
    });
  },

  setBarBrands: (brands) => {
    set({ barBrands: brands });
    storage.set('barBrands', brands);
  },

  addCustomIngredient: (category, ingredient) => {
    set((state) => {
      const existing = state.customIngredients[category] || [];
      const customIngredients = {
        ...state.customIngredients,
        [category]: [...existing, ingredient],
      };
      storage.set('customIngredients', customIngredients);
      return { customIngredients };
    });
  },

  saveNote: (cocktailId, varName, text) => {
    set((state) => {
      const notes = { ...state.notes, [cocktailId + '::' + varName]: text };
      storage.set('notes', notes);
      return { notes };
    });
  },

  getNote: (cocktailId, varName) => {
    return get().notes[cocktailId + '::' + varName] || '';
  },

  savePhoto: (cocktailId, varName, uri) => {
    set((state) => {
      const photos = { ...state.photos, [cocktailId + '::' + varName]: uri };
      storage.set('photos', photos);
      return { photos };
    });
  },

  getPhoto: (cocktailId, varName) => {
    return get().photos[cocktailId + '::' + varName] || null;
  },

  saveCustomVariation: (cocktailId, variation) => {
    set((state) => {
      const existing = state.customVariations[cocktailId] || [];
      const customVariations = {
        ...state.customVariations,
        [cocktailId]: [...existing, variation],
      };
      storage.set('customVariations', customVariations);
      return { customVariations };
    });
  },

  deleteCustomVariation: (cocktailId, varName) => {
    set((state) => {
      const existing = state.customVariations[cocktailId] || [];
      const customVariations = {
        ...state.customVariations,
        [cocktailId]: existing.filter((v) => v.name !== varName),
      };
      storage.set('customVariations', customVariations);
      return { customVariations };
    });
  },

  saveCustomCocktail: (cocktail) => {
    set((state) => {
      const customCocktails = [...state.customCocktails, cocktail];
      storage.set('customCocktails', customCocktails);
      return { customCocktails };
    });
  },

  setHasSeenOnboarding: () => {
    set({ hasSeenOnboarding: true });
    storage.set('hasSeenOnboarding', true);
  },

  deleteCustomCocktail: (id) => {
    set((state) => {
      const customCocktails = state.customCocktails.filter((c) => c.id !== id);
      storage.set('customCocktails', customCocktails);
      return { customCocktails };
    });
  },

  hydrate: async () => {
    const [
      favorites,
      madeIt,
      ratings,
      myBar,
      barBrands,
      customCocktails,
      customVariations,
      customIngredients,
      notes,
      photos,
      hasSeenOnboarding,
    ] = await Promise.all([
      storage.get<string[]>('favorites', []),
      storage.get<string[]>('madeIt', []),
      storage.get<Record<string, number>>('ratings', {}),
      storage.get<string[]>('myBar', []),
      storage.get<Record<string, string>>('barBrands', {}),
      storage.get<Cocktail[]>('customCocktails', []),
      storage.get<Record<string, Variation[]>>('customVariations', {}),
      storage.get<Record<string, IngredientItem[]>>('customIngredients', {}),
      storage.get<Record<string, string>>('notes', {}),
      storage.get<Record<string, string>>('photos', {}),
      storage.get<boolean>('hasSeenOnboarding', false),
    ]);
    set({
      favorites,
      madeIt,
      ratings,
      myBar,
      barBrands,
      customCocktails,
      customVariations,
      customIngredients,
      notes,
      photos,
      hasSeenOnboarding,
      hydrated: true,
    });
  },
}));
