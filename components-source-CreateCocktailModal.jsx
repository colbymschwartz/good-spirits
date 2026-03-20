import { useState } from 'react';
import { parseSpecLine } from '../utils/helpers';
import { getAllSpirits, STYLE_LABELS, addCustomSpirit } from '../data';
import { generateId } from '../utils/helpers';

export default function CreateCocktailModal({
  onClose,
  onSave
}) {
  const [name, setName] = useState("");
  const [spirit, setSpirit] = useState("whiskey");
  const [customSpiritText, setCustomSpiritText] = useState("");
  const [style, setStyle] = useState("spirit-forward");
  const [specLines, setSpecLines] = useState([{
    text: ""
  }]);
  const [glass, setGlass] = useState("rocks");
  const [method, setMethod] = useState("Stir");
  const [garnish, setGarnish] = useState("");
  const [steps, setSteps] = useState("");
  const [ratioNotes, setRatioNotes] = useState("");
  const addSpec = () => setSpecLines([...specLines, {
    text: ""
  }]);
  const removeSpec = idx => setSpecLines(specLines.filter((_, i) => i !== idx));
  const updateSpec = (idx, text) => {
    const n = [...specLines];
    n[idx] = {
      text
    };
    setSpecLines(n);
  };
  const resolvedSpirit = spirit === "other" && customSpiritText.trim() ? customSpiritText.trim().toLowerCase() : spirit;
  const handleSave = () => {
    if (!name.trim()) return;
    if (spirit === "other" && customSpiritText.trim()) {
      addCustomSpirit(customSpiritText.trim());
    }
    const cocktail = {
      id: generateId(),
      name: name.trim(),
      style,
      spirit: resolvedSpirit,
      era: "modern",
      history: "",
      tags: [],
      isCustom: true,
      variations: [{
        name: "My Recipe",
        canon: true,
        isCustom: true,
        spec: specLines.filter(s => s.text.trim()).map(s => s.text.trim()),
        ingredients: specLines.filter(s => s.text.trim()).map(s => {
          const parsed = parseSpecLine(s.text.trim());
          return parsed ? parsed.ingredient.toLowerCase().replace(/\s+/g, "-") : s.text.trim().toLowerCase().replace(/\s+/g, "-");
        }),
        glass,
        method,
        garnish,
        steps,
        ratioNotes,
        brandRecs: ""
      }]
    };
    onSave(cocktail);
  };
  return (
    <div
      className="modal active"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        <div className="modal-header">
          <span>✨ Create New Cocktail</span>
          <button
            className="modal-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="form-section">
            <label>Cocktail Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="White Mezcal Negroni"
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: "12px"
            }}
          >
            <div
              className="form-section"
              style={{
                flex: 1
              }}
            >
              <label>Base Spirit</label>
              <select
                value={spirit}
                onChange={e => {
                  setSpirit(e.target.value);
                  if (e.target.value !== "other") setCustomSpiritText("");
                }}
              >
                {getAllSpirits().map(s => (
                  <option
                    key={s}
                    value={s}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
              {spirit === "other" && (
                <input
                  type="text"
                  value={customSpiritText}
                  onChange={e => setCustomSpiritText(e.target.value)}
                  placeholder="e.g. Pisco, Absinthe..."
                  style={{
                    marginTop: "6px"
                  }}
                />
              )}
            </div>
            <div
              className="form-section"
              style={{
                flex: 1
              }}
            >
              <label>Style</label>
              <select
                value={style}
                onChange={e => setStyle(e.target.value)}
              >
                {Object.entries(STYLE_LABELS).map(([k, v]) => (
                  <option
                    key={k}
                    value={k}
                  >
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-section">
            <label>Ingredients</label>
            {specLines.map((s, i) => (
              <div
                key={i}
                className="remix-ingredient-row"
              >
                <input
                  type="text"
                  value={s.text}
                  onChange={e => updateSpec(i, e.target.value)}
                  placeholder="e.g. 1.5 oz mezcal"
                />
                {specLines.length > 1 && (
                  <button
                    className="remix-remove-btn"
                    onClick={() => removeSpec(i)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              className="add-ingredient-btn"
              onClick={addSpec}
            >
              + Add Ingredient
            </button>
          </div>
          <div
            style={{
              display: "flex",
              gap: "12px"
            }}
          >
            <div
              className="form-section"
              style={{
                flex: 1
              }}
            >
              <label>Glass</label>
              <select
                value={glass}
                onChange={e => setGlass(e.target.value)}
              >
                {["rocks", "coupe", "highball", "martini", "nick-and-nora", "tiki", "copper-mug", "flute", "collins"].map(g => (
                  <option
                    key={g}
                    value={g}
                  >
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div
              className="form-section"
              style={{
                flex: 1
              }}
            >
              <label>Method</label>
              <select
                value={method}
                onChange={e => setMethod(e.target.value)}
              >
                {["Stir", "Shake", "Build", "Muddle", "Blend", "Swizzle", "Layer"].map(m => (
                  <option
                    key={m}
                    value={m}
                  >
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-section">
            <label>Garnish</label>
            <input
              type="text"
              value={garnish}
              onChange={e => setGarnish(e.target.value)}
              placeholder="Orange peel, expressed"
            />
          </div>
          <div className="form-section">
            <label>Steps</label>
            <textarea
              className="notes-textarea"
              value={steps}
              onChange={e => setSteps(e.target.value)}
              placeholder="How to build this drink..."
            />
          </div>
          <div className="form-section">
            <label>Ratio Notes (Optional)</label>
            <textarea
              className="notes-textarea"
              value={ratioNotes}
              onChange={e => setRatioNotes(e.target.value)}
              placeholder="Why this ratio works..."
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: "10px"
            }}
          >
            <button
              className="btn btn-primary"
              style={{
                flex: 1
              }}
              onClick={handleSave}
              disabled={!name.trim()}
            >
              Create Cocktail
            </button>
            <button
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
