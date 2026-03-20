import { useState, useMemo } from 'react';
import { SPIRIT_ICONS, STYLE_LABELS } from '../data';

export default function FavoritesTab({
  favorites,
  madeIt,
  ratings,
  toggleFavorite,
  toggleMadeIt,
  setRating,
  onSelect,
  cocktails
}) {
  const [subTab, setSubTab] = useState("favorites");
  const favCocktails = useMemo(() => cocktails.filter(c => favorites.includes(c.id)), [favorites, cocktails]);
  const madeCocktails = useMemo(() => cocktails.filter(c => madeIt.includes(c.id)), [madeIt, cocktails]);
  const ratedCocktails = useMemo(() => cocktails.filter(c => ratings[c.id] > 0).sort((a, b) => (ratings[b.id] || 0) - (ratings[a.id] || 0)), [ratings, cocktails]);
  const renderList = (items, emptyIcon, emptyText) => {
    if (items.length === 0) return (
      <div className="empty-state">
        <div className="empty-state-icon">
          {emptyIcon}
        </div>
        <div className="empty-state-text">
          {emptyText}
        </div>
      </div>
    );
    return items.map(c => (
      <div
        key={c.id}
        className="card"
        onClick={() => onSelect(c)}
      >
        <div className="cocktail-card">
          <div className="spirit-icon">
            {SPIRIT_ICONS[c.spirit] || "✨"}
          </div>
          <div className="cocktail-info">
            <div className="cocktail-name">
              {c.name}
            </div>
            <div className="cocktail-meta">
              <span className="tag tag-style">
                {STYLE_LABELS[c.style] || c.style}
              </span>
              {ratings[c.id] > 0 && (
                <span
                  style={{
                    color: "var(--accent-gold)",
                    fontSize: "12px"
                  }}
                >
                  {"★".repeat(ratings[c.id])}
                </span>
              )}
            </div>
          </div>
          {subTab === "favorites" && (
            <button
              className="fav-btn"
              onClick={e => {
                e.stopPropagation();
                toggleFavorite(c.id);
              }}
            >
              ❤️
            </button>
          )}
        </div>
      </div>
    ));
  };
  return (
    <div className="view active">
      <div className="sub-tabs">
        <button
          className={"sub-tab" + (subTab === "favorites" ? " active" : "")}
          onClick={() => setSubTab("favorites")}
        >
          ❤️ Favorites
          {favCocktails.length > 0 && (
            <span className="counter-badge">
              {favCocktails.length}
            </span>
          )}
        </button>
        <button
          className={"sub-tab" + (subTab === "madeit" ? " active" : "")}
          onClick={() => setSubTab("madeit")}
        >
          ✅ Made It
          {madeCocktails.length > 0 && (
            <span className="counter-badge">
              {madeCocktails.length}
            </span>
          )}
        </button>
        <button
          className={"sub-tab" + (subTab === "rated" ? " active" : "")}
          onClick={() => setSubTab("rated")}
        >
          ⭐ Top Rated
          {ratedCocktails.length > 0 && (
            <span className="counter-badge">
              {ratedCocktails.length}
            </span>
          )}
        </button>
      </div>
      {subTab === "favorites" && renderList(favCocktails, "❤️", "No favorites yet.\nTap the heart on any cocktail to save it here.")}
      {subTab === "madeit" && renderList(madeCocktails, "✅", "Nothing made yet.\nStart mixing and track your builds here.")}
      {subTab === "rated" && renderList(ratedCocktails, "⭐", "No ratings yet.\nRate cocktails to build your personal top list.")}
    </div>
  );
}
