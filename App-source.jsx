import { useState, useEffect, useMemo, useCallback } from 'react';
import { COCKTAIL_DATABASE } from './data/cocktails';
import { storage } from './utils/storage';
import { handleShare } from './utils/helpers';
import {
  CocktailsTab,
  CocktailDetail,
  RemixModal,
  CreateCocktailModal,
  ImportModal,
  MyBarTab,
  TechniquesTab,
  HistoryTab,
  FavoritesTab,
  BatchCalculator,
} from './components';
import './App.css';

const NAV_ITEMS = [
  { id: "cocktails", icon: "\u{1F378}", label: "Cocktails" },
  { id: "mybar", icon: "\u{1F943}", label: "My Bar" },
  { id: "techniques", icon: "\u{1F9CA}", label: "Technique" },
  { id: "history", icon: "\u{1F4DC}", label: "History" },
  { id: "favorites", icon: "\u2764\uFE0F", label: "Favorites" },
];

export default function App() {
  const [tab, setTab] = useState("cocktails");
  const [selectedCocktail, setSelectedCocktail] = useState(null);
  const [initialVariationIdx, setInitialVariationIdx] = useState(0);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [selectedEra, setSelectedEra] = useState(null);
  const [favorites, setFavorites] = useState(() => storage.get("favorites", []));
  const [madeIt, setMadeIt] = useState(() => storage.get("madeIt", []));
  const [ratings, setRatings] = useState(() => storage.get("ratings", {}));
  const [myBar, setMyBar] = useState(() => storage.get("myBar", []));
  const [barBrands, setBarBrands] = useState(() => storage.get("barBrands", {}));
  const [customCocktails, setCustomCocktails] = useState(() => storage.get("customCocktails", []));
  const [customVariations, setCustomVariations] = useState(() => storage.get("customVariations", {}));
  const [notes, setNotes] = useState(() => storage.get("notes", {}));
  const [photos, setPhotos] = useState(() => storage.get("photos", {}));
  const [batchCocktail, setBatchCocktail] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showRemixModal, setShowRemixModal] = useState(null);

  // Persist state to localStorage
  useEffect(() => { storage.set("favorites", favorites); }, [favorites]);
  useEffect(() => { storage.set("madeIt", madeIt); }, [madeIt]);
  useEffect(() => { storage.set("ratings", ratings); }, [ratings]);
  useEffect(() => { storage.set("myBar", myBar); }, [myBar]);
  useEffect(() => { storage.set("barBrands", barBrands); }, [barBrands]);
  useEffect(() => { storage.set("customCocktails", customCocktails); }, [customCocktails]);
  useEffect(() => { storage.set("customVariations", customVariations); }, [customVariations]);
  useEffect(() => { storage.set("notes", notes); }, [notes]);
  useEffect(() => { storage.set("photos", photos); }, [photos]);

  // Callbacks
  const toggleFavorite = useCallback(id => {
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const toggleMadeIt = useCallback(id => {
    setMadeIt(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const setRatingFn = useCallback((id, rating) => {
    setRatings(prev => ({ ...prev, [id]: rating }));
  }, []);

  const toggleBarItem = useCallback(ingredientId => {
    setMyBar(prev => prev.includes(ingredientId) ? prev.filter(x => x !== ingredientId) : [...prev, ingredientId]);
  }, []);

  const saveNote = useCallback((cocktailId, varName, text) => {
    setNotes(prev => ({ ...prev, [cocktailId + "::" + varName]: text }));
  }, []);

  const getNote = useCallback((cocktailId, varName) => {
    return notes[cocktailId + "::" + varName] || "";
  }, [notes]);

  const savePhoto = useCallback((cocktailId, varName, dataUrl) => {
    setPhotos(prev => ({ ...prev, [cocktailId + "::" + varName]: dataUrl }));
  }, []);

  const getPhoto = useCallback((cocktailId, varName) => {
    return photos[cocktailId + "::" + varName] || null;
  }, [photos]);

  const saveCustomVariation = useCallback((cocktailId, variation) => {
    setCustomVariations(prev => {
      const existing = prev[cocktailId] || [];
      return { ...prev, [cocktailId]: [...existing, variation] };
    });
  }, []);

  const deleteCustomVariation = useCallback((cocktailId, varName) => {
    setCustomVariations(prev => {
      const existing = prev[cocktailId] || [];
      return { ...prev, [cocktailId]: existing.filter(v => v.name !== varName) };
    });
  }, []);

  const saveCustomCocktail = useCallback(cocktail => {
    setCustomCocktails(prev => [...prev, cocktail]);
  }, []);

  const deleteCustomCocktail = useCallback(id => {
    setCustomCocktails(prev => prev.filter(c => c.id !== id));
  }, []);

  // Merge custom variations into cocktail data for display
  const allCocktails = useMemo(() => {
    const merged = COCKTAIL_DATABASE.map(c => {
      const customVars = customVariations[c.id] || [];
      if (customVars.length === 0) return c;
      return { ...c, variations: [...c.variations, ...customVars] };
    });
    return [...merged, ...customCocktails];
  }, [customVariations, customCocktails]);

  const openCocktail = useCallback((cocktail, varIdx) => {
    const full = allCocktails.find(c => c.id === cocktail.id) || cocktail;
    setInitialVariationIdx(varIdx || 0);
    setSelectedCocktail(full);
  }, [allCocktails]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Good Spirits</h1>
        <div className="subtitle">The Home Mixologist&rsquo;s Bible</div>
      </header>

      <div className="app-content">
        {tab === "cocktails" && (
          <CocktailsTab
            cocktails={allCocktails}
            customCocktails={customCocktails}
            onSelect={openCocktail}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            onShowCreate={() => setShowCreateModal(true)}
            onShowImport={() => setShowImportModal(true)}
          />
        )}
        {tab === "mybar" && (
          <MyBarTab
            myBar={myBar}
            barBrands={barBrands}
            toggleBarItem={toggleBarItem}
            setBarBrands={setBarBrands}
            onSelect={openCocktail}
            cocktails={allCocktails}
          />
        )}
        {tab === "techniques" && (
          <TechniquesTab
            selectedTechnique={selectedTechnique}
            setSelectedTechnique={setSelectedTechnique}
          />
        )}
        {tab === "history" && (
          <HistoryTab
            selectedEra={selectedEra}
            setSelectedEra={setSelectedEra}
            onSelectCocktail={openCocktail}
            cocktails={allCocktails}
          />
        )}
        {tab === "favorites" && (
          <FavoritesTab
            favorites={favorites}
            madeIt={madeIt}
            ratings={ratings}
            toggleFavorite={toggleFavorite}
            toggleMadeIt={toggleMadeIt}
            setRating={setRatingFn}
            onSelect={openCocktail}
            cocktails={allCocktails}
          />
        )}
      </div>

      <nav className="bottom-nav">
        {NAV_ITEMS.map(n => (
          <button
            key={n.id}
            className={"nav-item" + (tab === n.id ? " active" : "")}
            onClick={() => {
              setTab(n.id);
              setSelectedCocktail(null);
              setSelectedTechnique(null);
              setSelectedEra(null);
            }}
          >
            <span className="nav-icon">{n.icon}</span>
            <span className="nav-label">{n.label}</span>
          </button>
        ))}
      </nav>

      {selectedCocktail && (
        <CocktailDetail
          cocktail={selectedCocktail}
          initialVariation={initialVariationIdx}
          onClose={() => setSelectedCocktail(null)}
          isFavorite={favorites.includes(selectedCocktail.id)}
          toggleFavorite={() => toggleFavorite(selectedCocktail.id)}
          isMadeIt={madeIt.includes(selectedCocktail.id)}
          toggleMadeIt={() => toggleMadeIt(selectedCocktail.id)}
          rating={ratings[selectedCocktail.id] || 0}
          setRating={r => setRatingFn(selectedCocktail.id, r)}
          onBatch={() => setBatchCocktail(selectedCocktail)}
          saveCustomVariation={v => saveCustomVariation(selectedCocktail.id, v)}
          deleteCustomVariation={name => deleteCustomVariation(selectedCocktail.id, name)}
          onRemix={v => setShowRemixModal({ cocktail: selectedCocktail, variation: v })}
          getNote={varName => getNote(selectedCocktail.id, varName)}
          saveNote={(varName, text) => saveNote(selectedCocktail.id, varName, text)}
          getPhoto={varName => getPhoto(selectedCocktail.id, varName)}
          savePhoto={(varName, dataUrl) => savePhoto(selectedCocktail.id, varName, dataUrl)}
          isCustom={selectedCocktail.isCustom}
          onDelete={selectedCocktail.isCustom ? () => {
            deleteCustomCocktail(selectedCocktail.id);
            setSelectedCocktail(null);
          } : null}
          onShare={variation => handleShare(selectedCocktail, variation, getPhoto(selectedCocktail.id, variation.name))}
        />
      )}

      {batchCocktail && (
        <BatchCalculator
          cocktail={batchCocktail}
          onClose={() => setBatchCocktail(null)}
        />
      )}

      {showCreateModal && (
        <CreateCocktailModal
          onClose={() => setShowCreateModal(false)}
          onSave={c => {
            saveCustomCocktail(c);
            setShowCreateModal(false);
          }}
        />
      )}

      {showImportModal && (
        <ImportModal
          onClose={() => setShowImportModal(false)}
          onSave={c => {
            saveCustomCocktail(c);
            setShowImportModal(false);
          }}
        />
      )}

      {showRemixModal && (
        <RemixModal
          cocktail={showRemixModal.cocktail}
          variation={showRemixModal.variation}
          onClose={() => setShowRemixModal(null)}
          onSave={v => {
            saveCustomVariation(showRemixModal.cocktail.id, v);
            setShowRemixModal(null);
            setSelectedCocktail(prev => prev ? {
              ...prev,
              variations: [...prev.variations, v]
            } : prev);
          }}
        />
      )}
    </div>
  );
}
