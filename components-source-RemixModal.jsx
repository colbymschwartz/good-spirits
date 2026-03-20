import { useState } from 'react';
import { parseSpecLine } from '../utils/helpers';
import { getAllSpirits } from '../data';

export default function RemixModal({
  cocktail,
  variation,
  onClose,
  onSave
}) {
  const [name, setName] = useState(variation.name + " (Remix)");
  const [specLines, setSpecLines] = useState(variation.spec.map(s => ({
    text: s
  })));
  const [glass, setGlass] = useState(variation.glass || "rocks");
  const [method, setMethod] = useState(variation.method || "Stir");
  const [garnish, setGarnish] = useState(variation.garnish || "");
  const [notes, setNotes] = useState("");
  const updateSpec = (idx, text) => {
    const newLines = [...specLines];
    newLines[idx] = {
      text
    };
    setSpecLines(newLines);
  };
  const removeSpec = idx => setSpecLines(specLines.filter((_, i) => i !== idx));
  const addSpec = () => setSpecLines([...specLines, {
    text: ""
  }]);
  const handleSave = () => {
    if (!name.trim()) return;
    const newVar = {
      name: name.trim(),
      canon: false,
      isCustom: true,
      spec: specLines.filter(s => s.text.trim()).map(s => s.text.trim()),
      ingredients: specLines.filter(s => s.text.trim()).map(s => {
        const parsed = parseSpecLine(s.text.trim());
        return parsed ? parsed.ingredient.toLowerCase().replace(/\s+/g, "-") : s.text.trim().toLowerCase().replace(/\s+/g, "-");
      }),
      glass,
      method,
      garnish,
      steps: variation.steps || "",
      ratioNotes: notes || variation.ratioNotes || "",
      brandRecs: variation.brandRecs || ""
    };
    onSave(newVar);
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
          <span>🔄 Remix: {cocktail.name}</span>
          <button
            className="modal-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="form-section">
            <label>Variation Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
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
                <button
                  className="remix-remove-btn"
                  onClick={() => removeSpec(i)}
                >
                  ✕
                </button>
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
                {["rocks", "coupe", "highball", "martini", "nick-and-nora", "tiki", "copper-mug", "flute", "collins", "hurricane", "snifter"].map(g => (
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
            />
          </div>
          <div className="form-section">
            <label>Your Ratio Notes</label>
            <textarea
              className="notes-textarea"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Why you prefer this ratio..."
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
            >
              Save Variation
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
