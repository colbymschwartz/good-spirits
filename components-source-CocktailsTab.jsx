import { useState, useMemo } from 'react';
import { getAllSpirits, STYLE_LABELS, MOOD_LABELS, SPIRIT_ICONS } from '../data';

function spiritLabel(s) {
  return s === "all" ? "All Spirits" : s.charAt(0).toUpperCase() + s.slice(1);
}

export default function CocktailsTab({
  cocktails,
  customCocktails,
  onSelect,
  favorites,
  toggleFavorite,
  onShowCreate,
  onShowImport
}) {
  const [search, setSearch] = useState("");
  const [spiritFilter, setSpiritFilter] = useState("all");
  const [styleFilter, setStyleFilter] = useState("all");
  const [moodFilter, setMoodFilter] = useState("all");
  const [showCustomsOnly, setShowCustomsOnly] = useState(false);
  const filtered = useMemo(() => {
    let results = cocktails;
    if (showCustomsOnly) {
      const customIds = new Set(customCocktails.map(c => c.id));
      results = results.filter(c => customIds.has(c.id));
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(c => c.name.toLowerCase().includes(q) || c.spirit.toLowerCase().includes(q) || c.variations.some(v => v.name.toLowerCase().includes(q) || v.spec && v.spec.some(s => s.toLowerCase().includes(q)) || v.ingredients && v.ingredients.some(ing => ing.toLowerCase().includes(q))) || c.tags && c.tags.some(t => t.toLowerCase().includes(q)));
    }
    if (spiritFilter !== "all") results = results.filter(c => c.spirit === spiritFilter || c.variations.some(v => v.spec && v.spec.some(s => s.toLowerCase().includes(spiritFilter)) || v.ingredients && v.ingredients.some(ing => ing.toLowerCase().includes(spiritFilter))));
    if (styleFilter !== "all") results = results.filter(c => c.style === styleFilter);
    if (moodFilter !== "all") results = results.filter(c => c.tags && c.tags.includes(moodFilter));
    // Find best matching variation for display
    const q = search ? search.toLowerCase() : "";
    const sf = spiritFilter !== "all" ? spiritFilter : "";
    return results.map(c => {
      let bestIdx = 0;
      if (q || sf) {
        // If search matches family name directly, show first variation
        if (q && c.name.toLowerCase().includes(q)) return {
          cocktail: c,
          varIdx: 0
        };
        // Find first variation that matches search or spirit filter
        const matchIdx = c.variations.findIndex(v => {
          const matchesSearch = q && (v.name.toLowerCase().includes(q) || v.spec && v.spec.some(s => s.toLowerCase().includes(q)) || v.ingredients && v.ingredients.some(ing => ing.toLowerCase().includes(q)));
          const matchesSpirit = sf && (v.spec && v.spec.some(s => s.toLowerCase().includes(sf)) || v.ingredients && v.ingredients.some(ing => ing.toLowerCase().includes(sf)));
          return matchesSearch || matchesSpirit;
        });
        if (matchIdx >= 0) bestIdx = matchIdx;
      }
      return {
        cocktail: c,
        varIdx: bestIdx
      };
    });
  }, [cocktails, customCocktails, search, spiritFilter, styleFilter, moodFilter, showCustomsOnly]);
  const spirits = ["all", ...getAllSpirits()];
  const styles = ["all", ...Object.keys(STYLE_LABELS)];
  const moods = ["all", "classic", "refreshing", "bold", "summer", "winter", "after-dinner", "date-night", "crowd-pleaser", "brunch", "party", "tropical", "impress-someone", "easy"];
  return (
    <div className="view active">
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search cocktails, ingredients, moods..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="pill-row">
        {spirits.map(s => (
          <button
            key={s}
            className={"pill" + (spiritFilter === s ? " active" : "")}
            onClick={() => setSpiritFilter(s)}
          >
            {spiritLabel(s)}
          </button>
        ))}
      </div>
      <div className="pill-row">
        {styles.map(s => (
          <button
            key={s}
            className={"pill" + (styleFilter === s ? " active" : "")}
            onClick={() => setStyleFilter(s)}
          >
            {s === "all" ? "All Styles" : STYLE_LABELS[s] || s}
          </button>
        ))}
      </div>
      <div className="pill-row">
        {moods.map(m => (
          <button
            key={m}
            className={"pill" + (moodFilter === m ? " active" : "")}
            onClick={() => setMoodFilter(m)}
          >
            {m === "all" ? "All Moods" : MOOD_LABELS[m] || m}
          </button>
        ))}
      </div>
      {customCocktails.length > 0 && (
        <div className="customs-toggle">
          <button
            className={"customs-toggle-btn" + (showCustomsOnly ? " active" : "")}
            onClick={() => setShowCustomsOnly(!showCustomsOnly)}
          >
            {showCustomsOnly ? "★ My Customs" : "Show My Customs Only"}
          </button>
        </div>
      )}
      <div className="section-header">
        {filtered.length} Cocktail{filtered.length !== 1 ? " Families" : " Family"}
      </div>
      {filtered.map(({
        cocktail: c,
        varIdx
      }) => {
        const showVar = varIdx > 0 && c.variations[varIdx];
        const displayName = showVar ? c.variations[varIdx].name : c.name;
        return (
          <div
            key={c.id}
            className="card"
            onClick={() => onSelect(c, varIdx)}
          >
            <div className="cocktail-card">
              <div className="spirit-icon">
                {SPIRIT_ICONS[c.spirit] || "✨"}
              </div>
              <div className="cocktail-info">
                <div className="cocktail-name">
                  {displayName}
                  {c.isCustom && (
                    <span
                      className="custom-badge"
                      style={{
                        marginLeft: "6px"
                      }}
                    >
                      Custom
                    </span>
                  )}
                </div>
                <div className="cocktail-meta">
                  {showVar && (
                    <span
                      className="tag"
                      style={{
                        background: "var(--border-light)",
                        fontSize: "10px"
                      }}
                    >
                      {c.name}
                    </span>
                  )}
                  <span className="tag tag-style">
                    {STYLE_LABELS[c.style] || c.style}
                  </span>
                  <span className="tag tag-spirit">
                    {c.spirit}
                  </span>
                </div>
              </div>
              <div className="variation-count">
                {c.variations.length} var{c.variations.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        );
      })}
      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🍣</div>
          <div className="empty-state-text">
            No cocktails match your filters.
            <br />
            Try adjusting your search.
          </div>
        </div>
      )}
      <div
        style={{
          position: "fixed",
          bottom: "84px",
          right: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          zIndex: 50
        }}
      >
        <button
          className="create-fab"
          style={{
            width: "44px",
            height: "44px",
            fontSize: "18px",
            background: "var(--border-light)"
          }}
          onClick={onShowImport}
          title="Import Recipe"
        >
          📋
        </button>
        <button
          className="create-fab"
          onClick={onShowCreate}
          title="Create New"
        >
          +
        </button>
      </div>
    </div>
  );
}
