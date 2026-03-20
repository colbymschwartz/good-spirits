import { TECHNIQUE_LIBRARY } from '../data';

export default function TechniquesTab({
  selectedTechnique,
  setSelectedTechnique
}) {
  if (selectedTechnique) {
    const tech = TECHNIQUE_LIBRARY.find(t => t.id === selectedTechnique);
    if (!tech) return null;
    return (
      <div className="view active">
        <div
          style={{
            padding: "16px"
          }}
        >
          <button
            className="btn btn-small btn-secondary"
            onClick={() => setSelectedTechnique(null)}
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
            {tech.icon}
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "var(--accent-gold)"
            }}
          >
            {tech.name}
          </div>
        </div>
        <div
          style={{
            padding: "0 20px 12px"
          }}
        >
          <div className="technique-content">
            {tech.content}
          </div>
        </div>
        {tech.tips && tech.tips.length > 0 && (
          <div
            style={{
              padding: "0 20px 24px"
            }}
          >
            <div
              className="detail-label"
              style={{
                marginBottom: "8px"
              }}
            >
              Pro Tips
            </div>
            <ul className="tip-list">
              {tech.tips.map((tip, i) => (
                <li key={i}>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="view active">
      <div className="section-header">
        Technique Library
      </div>
      {TECHNIQUE_LIBRARY.map(tech => (
        <div
          key={tech.id}
          className="card"
          onClick={() => setSelectedTechnique(tech.id)}
        >
          <div className="technique-card">
            <div className="technique-icon">
              {tech.icon}
            </div>
            <div>
              <div className="technique-name">
                {tech.name}
              </div>
              <div className="technique-summary">
                {tech.summary}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
