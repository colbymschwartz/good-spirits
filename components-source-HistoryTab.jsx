import { COCKTAIL_HISTORY } from '../data';

export default function HistoryTab({
  selectedEra,
  setSelectedEra,
  onSelectCocktail,
  cocktails
}) {
  if (selectedEra) {
    const era = COCKTAIL_HISTORY.find(e => e.id === selectedEra);
    if (!era) return null;
    return (
      <div className="view active">
        <div
          style={{
            padding: "16px"
          }}
        >
          <button
            className="btn btn-small btn-secondary"
            onClick={() => setSelectedEra(null)}
          >
            ← Back
          </button>
        </div>
        <div
          style={{
            padding: "0 20px 32px",
            textAlign: "center"
          }}
        >
          <div
            style={{
              fontSize: "48px",
              marginBottom: "8px"
            }}
          >
            {era.icon}
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "var(--accent-gold)"
            }}
          >
            {era.name}
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "var(--accent-gold-dim)",
              marginTop: "4px"
            }}
          >
            {era.period}
          </div>
        </div>
        <div
          style={{
            padding: "0 20px 12px"
          }}
        >
          <div className="era-content">
            {era.content}
          </div>
        </div>
        {era.keyFigures && (
          <div
            style={{
              padding: "0 20px 12px"
            }}
          >
            <div className="detail-label">
              Key Figures
            </div>
            <div className="detail-text">
              {era.keyFigures.join(", ")}
            </div>
          </div>
        )}
        {era.keyInnovation && (
          <div
            style={{
              padding: "0 20px 12px"
            }}
          >
            <div className="detail-label">
              Key Innovation
            </div>
            <div className="detail-text">
              {era.keyInnovation}
            </div>
          </div>
        )}
        {era.keyDrinks && era.keyDrinks.length > 0 && (
          <div
            style={{
              padding: "0 20px 24px"
            }}
          >
            <div className="detail-label">
              Iconic Drinks
            </div>
            <div className="key-drinks">
              {era.keyDrinks.map(drinkId => {
                const c = cocktails.find(c => c.id === drinkId);
                return c ? (
                  <span
                    key={drinkId}
                    className="key-drink-pill"
                    onClick={() => onSelectCocktail(c)}
                  >
                    {c.name}
                  </span>
                ) : (
                  <span
                    key={drinkId}
                    className="key-drink-pill"
                  >
                    {drinkId.replace(/-/g, " ")}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="view active">
      <div className="section-header">
        Cocktail History
      </div>
      <div
        style={{
          padding: "0 16px 8px",
          fontSize: "13px",
          color: "var(--text-secondary)",
          lineHeight: 1.6
        }}
      >
        Six eras that shaped what's in your glass tonight.
      </div>
      {COCKTAIL_HISTORY.map(era => (
        <div
          key={era.id}
          className="card"
          onClick={() => setSelectedEra(era.id)}
        >
          <div className="era-card">
            <div className="era-icon">
              {era.icon}
            </div>
            <div
              style={{
                flex: 1
              }}
            >
              <div className="era-name">
                {era.name}
              </div>
              <div className="era-period">
                {era.period}
              </div>
              <div className="era-summary">
                {era.summary}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
