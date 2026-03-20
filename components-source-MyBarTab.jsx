import { useState, useMemo } from 'react';
import { INGREDIENT_INDEX } from '../data';

export default function MyBarTab({
  myBar,
  barBrands,
  toggleBarItem,
  setBarBrands,
  onSelect,
  cocktails
}) {
  const [subTab, setSubTab] = useState("inventory");
  const [expandedCats, setExpandedCats] = useState({});
  const toggleCat = cat => setExpandedCats(prev => ({
    ...prev,
    [cat]: !prev[cat]
  }));
  const matches = useMemo(() => {
    if (myBar.length === 0) return {
      perfect: [],
      close: [],
      buyNext: []
    };
    const perfect = [];
    const close = [];
    cocktails.forEach(cocktail => {
      cocktail.variations.forEach(v => {
        if (!v.ingredients) return;
        const needed = v.ingredients.filter(i => !["sugar", "sugar-cube", "simple-syrup", "ice"].includes(i));
        const have = needed.filter(i => myBar.includes(i));
        const missing = needed.filter(i => !myBar.includes(i));
        const pct = needed.length > 0 ? Math.round(have.length / needed.length * 100) : 0;
        if (pct === 100) perfect.push({
          cocktail,
          variation: v,
          pct,
          missing
        });else if (pct >= 60 && missing.length <= 2) close.push({
          cocktail,
          variation: v,
          pct,
          missing
        });
      });
    });
    const dedup = arr => {
      const seen = {};
      return arr.filter(m => {
        if (seen[m.cocktail.id]) return false;
        seen[m.cocktail.id] = true;
        return true;
      });
    };
    const missingCounts = {};
    close.forEach(m => m.missing.forEach(ing => {
      missingCounts[ing] = (missingCounts[ing] || 0) + 1;
    }));
    const buyNext = Object.entries(missingCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([ing, count]) => ({
      ingredient: ing,
      unlocks: count
    }));
    return {
      perfect: dedup(perfect),
      close: dedup(close).sort((a, b) => b.pct - a.pct),
      buyNext
    };
  }, [myBar, cocktails]);
  return (
    <div className="view active">
      <div className="sub-tabs">
        <button
          className={"sub-tab" + (subTab === "inventory" ? " active" : "")}
          onClick={() => setSubTab("inventory")}
        >
          My Inventory
        </button>
        <button
          className={"sub-tab" + (subTab === "canmake" ? " active" : "")}
          onClick={() => setSubTab("canmake")}
        >
          What Can I Make?
          {matches.perfect.length > 0 && (
            <span className="counter-badge">
              {matches.perfect.length}
            </span>
          )}
        </button>
      </div>
      {subTab === "inventory" && (
        <div
          style={{
            paddingBottom: "20px"
          }}
        >
          <div className="section-header">
            {myBar.length} Ingredient{myBar.length !== 1 ? "s" : ""} in Your Bar
          </div>
          {INGREDIENT_INDEX.map(cat => (
            <div
              key={cat.category}
              className="bar-category"
            >
              <div
                className="bar-category-header"
                onClick={() => toggleCat(cat.category)}
              >
                <div className="bar-category-title">
                  <span>{cat.icon}</span>
                  <span>{cat.category}</span>
                </div>
                <div className="bar-category-count">
                  {cat.items.filter(i => myBar.includes(i.id)).length}/{cat.items.length} {expandedCats[cat.category] ? "▲" : "▼"}
                </div>
              </div>
              {expandedCats[cat.category] && (
                <div className="bar-items">
                  {cat.items.map(item => (
                    <div
                      key={item.id}
                      className="bar-item"
                      onClick={() => toggleBarItem(item.id)}
                    >
                      <div>
                        <span className="bar-item-name">
                          {item.name}
                        </span>
                        {item.essential && (
                          <span className="bar-item-essential">
                            Essential
                          </span>
                        )}
                      </div>
                      <button
                        className={"bar-toggle" + (myBar.includes(item.id) ? " on" : "")}
                        onClick={e => {
                          e.stopPropagation();
                          toggleBarItem(item.id);
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {subTab === "canmake" && (
        <div
          style={{
            paddingBottom: "20px"
          }}
        >
          {myBar.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🍣</div>
              <div className="empty-state-text">
                Add spirits and ingredients to your bar
                <br />
                to see what you can make!
              </div>
            </div>
          ) : (
            <>
              {matches.buyNext.length > 0 && (
                <div className="buy-next">
                  <div className="buy-next-header">
                    🛒 Buy Next to Unlock More
                  </div>
                  {matches.buyNext.map(b => (
                    <div
                      key={b.ingredient}
                      className="buy-next-item"
                    >
                      <strong>
                        {b.ingredient.replace(/-/g, " ")}
                      </strong>
                      <span className="buy-next-unlock">
                        {" "} — unlocks {b.unlocks} more cocktail{b.unlocks > 1 ? "s" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {matches.perfect.length > 0 && (
                <div className="match-section">
                  <div className="match-header">
                    ✅ Ready to Make ({matches.perfect.length})
                  </div>
                  {matches.perfect.map(m => (
                    <div
                      key={m.cocktail.id + m.variation.name}
                      className="match-card"
                      onClick={() => onSelect(m.cocktail)}
                    >
                      <div className="match-pct">
                        100%
                      </div>
                      <div className="match-info">
                        <div className="match-name">
                          {m.cocktail.name}
                        </div>
                        <div className="match-missing">
                          {m.variation.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {matches.close.length > 0 && (
                <div className="match-section">
                  <div className="match-header">
                    💫 Almost There ({matches.close.length})
                  </div>
                  {matches.close.map(m => (
                    <div
                      key={m.cocktail.id + m.variation.name}
                      className="match-card"
                      onClick={() => onSelect(m.cocktail)}
                    >
                      <div className="match-pct partial">
                        {m.pct}%
                      </div>
                      <div className="match-info">
                        <div className="match-name">
                          {m.cocktail.name}
                        </div>
                        <div className="match-missing">
                          Need: {m.missing.map(i => i.replace(/-/g, " ")).join(", ")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {matches.perfect.length === 0 && matches.close.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">🤔</div>
                  <div className="empty-state-text">
                    Add more ingredients to your bar
                    <br />
                    to discover what you can make!
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
