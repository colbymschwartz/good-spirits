import { useState, useMemo } from 'react';
import { parseSpecLine, formatAmount } from '../utils/helpers';

export default function BatchCalculator({
  cocktail,
  onClose
}) {
  const [servings, setServings] = useState(4);
  const [variationIdx, setVariationIdx] = useState(cocktail.variations.findIndex(v => v.canon) >= 0 ? cocktail.variations.findIndex(v => v.canon) : 0);
  const variation = cocktail.variations[variationIdx];
  const batchSpec = useMemo(() => {
    if (!variation || !variation.spec) return [];
    return variation.spec.map(line => {
      const parsed = parseSpecLine(line);
      if (!parsed) return {
        original: line,
        isScalable: false
      };
      const scaledAmount = parsed.amount * servings;
      const isOz = parsed.unit === "oz";
      const displayUnit = parsed.unit === "dash" || parsed.unit === "dashes" ? scaledAmount === 1 ? "dash" : "dashes" : parsed.unit === "cube" || parsed.unit === "cubes" ? scaledAmount === 1 ? "cube" : "cubes" : parsed.unit;
      return {
        original: line,
        ingredient: parsed.ingredient,
        amount: formatAmount(scaledAmount),
        unit: displayUnit,
        isScalable: true,
        rawAmount: scaledAmount,
        isOz,
        perDrink: !isOz
      };
    });
  }, [variation, servings]);
  const liquidItems = batchSpec.filter(item => item.isScalable && item.isOz);
  const perDrinkItems = batchSpec.filter(item => item.isScalable && item.perDrink);
  const garnishItems = batchSpec.filter(item => !item.isScalable);
  const totalOz = liquidItems.reduce((sum, item) => sum + item.rawAmount, 0);
  return (
    <div
      className="modal active"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        <div className="modal-header">
          <span>📊 Batch Calculator</span>
          <button
            className="modal-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--accent-gold)",
              marginBottom: "16px"
            }}
          >
            {cocktail.name}
          </div>
          {cocktail.variations.length > 1 && (
            <div className="batch-input-row">
              <label>Variation</label>
              <select
                value={variationIdx}
                onChange={e => setVariationIdx(parseInt(e.target.value))}
              >
                {cocktail.variations.map((v, i) => (
                  <option
                    key={i}
                    value={i}
                  >
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="batch-input-row">
            <label>Servings</label>
            <input
              type="number"
              min="1"
              max="50"
              value={servings}
              onChange={e => setServings(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
          <div className="batch-result">
            <div className="batch-result-header">
              Batch for {servings} Serving{servings > 1 ? "s" : ""}
            </div>
            {liquidItems.length > 0 && (
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--accent-gold-dim)",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}
              >
                Combine
              </div>
            )}
            {liquidItems.map((item, i) => (
              <div
                key={"oz-" + i}
                className="batch-item"
              >
                <span className="batch-item-name">
                  {item.ingredient}
                </span>
                <span className="batch-item-amount">
                  {item.amount} {item.unit}
                </span>
              </div>
            ))}
            {totalOz > 0 && (
              <div
                className="batch-item"
                style={{
                  borderTop: "1px solid var(--accent-gold-dim)",
                  marginTop: "4px",
                  paddingTop: "6px"
                }}
              >
                <span
                  className="batch-item-name"
                  style={{
                    fontWeight: 600
                  }}
                >
                  Total Volume
                </span>
                <span className="batch-item-amount">
                  {formatAmount(totalOz)} oz
                </span>
              </div>
            )}
            {perDrinkItems.length > 0 && (
              <>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--accent-gold-dim)",
                    marginTop: "12px",
                    marginBottom: "6px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}
                >
                  Per drink
                </div>
                {perDrinkItems.map((item, i) => {
                  const perServing = item.rawAmount / servings;
                  const perUnit = perServing === 1 ? item.unit.replace(/s$/, "") : item.unit;
                  return (
                    <div
                      key={"pd-" + i}
                      className="batch-item"
                    >
                      <span className="batch-item-name">
                        {item.ingredient}
                      </span>
                      <span className="batch-item-amount">
                        {formatAmount(perServing)} {perUnit} each
                      </span>
                    </div>
                  );
                })}
              </>
            )}
            {garnishItems.length > 0 && (
              <>
                {perDrinkItems.length === 0 && (
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--accent-gold-dim)",
                      marginTop: "12px",
                      marginBottom: "6px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}
                  >
                    Per drink
                  </div>
                )}
                {garnishItems.map((item, i) => (
                  <div
                    key={"g-" + i}
                    className="batch-item"
                  >
                    <span className="batch-item-name">
                      {item.original}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
