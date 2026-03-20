import { useState } from 'react';
import { getAllSpirits, STYLE_LABELS, addCustomSpirit } from '../data';
import { parseSpecLine, generateId } from '../utils/helpers';

export default function ImportModal({
  onClose,
  onSave
}) {
  const [rawText, setRawText] = useState("");
  const [parsed, setParsed] = useState(null);
  const [photoMode, setPhotoMode] = useState(false);
  const [customSpiritText, setCustomSpiritText] = useState("");
  const parseRecipe = () => {
    const lines = rawText.split("\n").map(l => l.trim()).filter(l => l);
    if (lines.length === 0) return;

    // Simple parser: first line = name, then look for ingredient-like lines
    let name = lines[0].replace(/^#+\s*/, "").replace(/recipe$/i, "").trim();
    const ingredients = [];
    const steps = [];
    let inSteps = false;
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (/^(step|direction|instruction|method|preparation)/i.test(line)) {
        inSteps = true;
        continue;
      }
      if (/^(ingredient|what you|you.ll need)/i.test(line)) {
        inSteps = false;
        continue;
      }
      if (inSteps || /^\d+[\.\)]\s/.test(line)) {
        steps.push(line.replace(/^\d+[\.\)]\s*/, ""));
        inSteps = true;
      } else if (/^\d|^[\u00BC-\u00BE\u215B-\u215E]|^[-\u2022\*]\s*\d/.test(line)) {
        ingredients.push(line.replace(/^[-\u2022\*]\s*/, ""));
      } else if (line.length < 60 && i === 1 && !name) {
        name = line;
      } else {
        // Could be an ingredient without a number or a step
        if (line.includes("oz") || line.includes("tbsp") || line.includes("tsp") || line.includes("cup") || line.includes("dash")) {
          ingredients.push(line.replace(/^[-\u2022\*]\s*/, ""));
        } else if (line.length > 20) {
          steps.push(line);
        }
      }
    }
    setParsed({
      name,
      spec: ingredients,
      steps: steps.join(" "),
      spirit: "other",
      style: "spirit-forward",
      glass: "rocks",
      method: "Stir",
      garnish: ""
    });
  };
  const handlePhoto = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";
    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      // For now, just show the text mode with a note
      alert("Photo imported! Please type out the recipe text for now. AI-powered photo parsing coming in a future update.");
    };
    input.click();
  };
  const handleSave = () => {
    if (!parsed || !parsed.name) return;
    const finalSpirit = parsed.spirit === "other" && customSpiritText.trim() ? customSpiritText.trim().toLowerCase() : parsed.spirit;
    if (parsed.spirit === "other" && customSpiritText.trim()) {
      addCustomSpirit(customSpiritText.trim());
    }
    const cocktail = {
      id: generateId(),
      name: parsed.name,
      style: parsed.style,
      spirit: finalSpirit,
      era: "modern",
      history: "",
      tags: [],
      isCustom: true,
      variations: [{
        name: "Imported Recipe",
        canon: true,
        isCustom: true,
        spec: parsed.spec,
        ingredients: parsed.spec.map(s => {
          const p = parseSpecLine(s);
          return p ? p.ingredient.toLowerCase().replace(/\s+/g, "-") : s.toLowerCase().replace(/\s+/g, "-");
        }),
        glass: parsed.glass,
        method: parsed.method,
        garnish: parsed.garnish,
        steps: parsed.steps,
        ratioNotes: "",
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
          <span>📋 Import Recipe</span>
          <button
            className="modal-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="modal-body">
          {!parsed ? (
            <>
              <div
                style={{
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  marginBottom: "12px"
                }}
              >
                Paste a recipe from a website, menu, or book. The parser will extract the name, ingredients, and steps.
              </div>
              <textarea
                className="import-textarea"
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                placeholder="Old Fashioned
2 oz bourbon
1 sugar cube
2-3 dashes Angostura bitters

Steps:
1. Place sugar cube in glass
2. Add bitters and muddle
3. Add bourbon and ice
4. Stir and garnish with orange peel"
              />
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "12px"
                }}
              >
                <button
                  className="btn btn-primary"
                  style={{
                    flex: 1
                  }}
                  onClick={parseRecipe}
                  disabled={!rawText.trim()}
                >
                  Parse Recipe
                </button>
                <button
                  className="btn btn-outline"
                  onClick={handlePhoto}
                >
                  📷 Photo
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="form-section">
                <label>Name</label>
                <input
                  type="text"
                  value={parsed.name}
                  onChange={e => setParsed({
                    ...parsed,
                    name: e.target.value
                  })}
                />
              </div>
              <div className="form-section">
                <label>Ingredients ({parsed.spec.length} found)</label>
                {parsed.spec.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: "13px",
                      color: "var(--text-primary)",
                      padding: "4px 0"
                    }}
                  >
                    • {s}
                  </div>
                ))}
              </div>
              {parsed.steps && (
                <div className="form-section">
                  <label>Steps</label>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "var(--text-secondary)"
                    }}
                  >
                    {parsed.steps}
                  </div>
                </div>
              )}
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
                  <label>Spirit</label>
                  <select
                    value={parsed.spirit}
                    onChange={e => {
                      setParsed({
                        ...parsed,
                        spirit: e.target.value
                      });
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
                  {parsed.spirit === "other" && (
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
                    value={parsed.style}
                    onChange={e => setParsed({
                      ...parsed,
                      style: e.target.value
                    })}
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
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "12px"
                }}
              >
                <button
                  className="btn btn-primary"
                  style={{
                    flex: 1
                  }}
                  onClick={handleSave}
                >
                  Import Cocktail
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setParsed(null)}
                >
                  Back
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
