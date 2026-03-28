# TESTING.md — Testing Strategy

## Current State

**Manual QA only** — no automated test suite yet.

### Manual Testing Protocol (enforced pre-ship)
1. Run web version: `npx expo start --web --port 8090`
2. Open `localhost:8090` in browser
3. Verify all changed features work
4. Check for console errors
5. Verify UI renders correctly (dark theme, gold accents)
6. Test navigation flows
7. Verify state persists across refresh (AsyncStorage)

This catches ~90% of issues and is currently sufficient for the app's size/complexity.

## Future: Automated Testing

When the app grows 2-3x, consider adding:

### 1. Data Integrity Tests
Validate cocktail database schema:
- All cocktails have required fields (name, spirit, ingredients, instructions, glass)
- All ingredients have name + amount
- No duplicate cocktail names
- Spirit values are valid (gin, vodka, rum, etc.)

**Why not now:** Data is stable, manually verified during development. Cost/benefit unclear.

### 2. Store Tests
Test Zustand stores:
- Stores initialize correctly
- State persists via AsyncStorage
- Actions update state as expected

**Why not now:** Store logic is simple, manual testing catches regressions quickly.

### 3. Navigation Tests
Verify all screens render without crashing:
- Home → CocktailDetail
- MyBar → stock/unstock flow
- Batch calculator
- Favorites/History

**Why not now:** Navigation is stable, manual QA covers this.

### 4. Component Tests
Test individual React components in isolation:
- CocktailCard renders correctly
- SearchBar filters work
- IngredientPicker updates state

**Why not now:** Components are simple, tightly coupled to data. Testing would require mocking infrastructure that doesn't exist yet.

## Testing Infrastructure (when needed)

### Setup
```bash
npm install --save-dev jest jest-expo @testing-library/react-native @testing-library/jest-native ts-jest @types/jest
```

### Config (`jest.config.js`)
```javascript
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts'
  ]
};
```

### Run Tests
```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

## Decision: Manual QA for Now

**Rationale:**
- App is small (~18k lines across 54 files)
- Rapid iteration (v1.0 → v1.6 in 7 days)
- Manual QA is thorough and catches issues
- No regressions have slipped through yet
- Test infrastructure setup would slow current velocity

**When to revisit:**
- Codebase hits 30k+ lines
- Team grows beyond solo dev
- Regressions start slipping through manual QA
- Refactoring requires regression protection

**Current confidence:** [4.0/5.0] — manual QA is working, but won't scale forever. Documenting the testing roadmap ensures we can add tests when the cost/benefit shifts.
