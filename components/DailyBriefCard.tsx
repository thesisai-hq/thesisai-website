import type { AiContextResponse } from '../lib/api/ai';
import type { MacroSnapshot } from '../lib/api/macro';

interface DailyBriefCardProps {
  aiContext: AiContextResponse | null;
  macro: MacroSnapshot | null;
  loading: boolean;
}

interface RegimeInfo {
  label: string;
  color: string;
}

function deriveRegime(snap: MacroSnapshot['snapshot']): RegimeInfo {
  if (!snap) return { label: 'Neutral', color: 'var(--text-muted)' };
  const { yield_10y, yield_2y, cpi_yoy } = snap;
  if (yield_10y != null && yield_2y != null && yield_10y < yield_2y) {
    return { label: 'Risk-Off', color: '#f87171' };
  }
  if (cpi_yoy != null && yield_10y != null && yield_2y != null && cpi_yoy < 3.5 && yield_10y > yield_2y) {
    return { label: 'Bullish Momentum', color: '#4ade80' };
  }
  if (cpi_yoy != null && cpi_yoy >= 3.5 && cpi_yoy < 4.5) {
    return { label: 'Transition', color: '#fbbf24' };
  }
  return { label: 'Neutral', color: 'var(--text-muted)' };
}

export function DailyBriefCard({ aiContext, macro, loading }: DailyBriefCardProps) {
  if (loading) {
    return (
      <div className="dbc-skel">
        <style jsx>{`
          .dbc-skel {
            height: 180px;
            border-radius: 14px;
            background: var(--surface);
            border: 1px solid var(--border);
            animation: shimmer 1.5s ease-in-out infinite;
          }
          @keyframes shimmer { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
        `}</style>
      </div>
    );
  }

  const snap = macro?.snapshot ?? null;
  const { label: regime, color: regimeColor } = deriveRegime(snap);

  const results = aiContext?.agents?.results ?? [];
  const avgConfidence = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.confidence * 100, 0) / results.length)
    : 71;

  const topOpportunities = results.slice(0, 3).map((r) => {
    const text = r.summary.slice(0, 80);
    return text.length < r.summary.length ? text + '…' : text;
  });

  const biggestRisk =
    results.length > 0
      ? results[results.length - 1].summary.slice(0, 90)
      : 'Monitor sector concentration and macro signals.';

  const aiQuery = encodeURIComponent('What are the biggest market risks right now?');

  return (
    <div className="dbc">
      {/* Header row */}
      <div className="dbc-header">
        <div className="dbc-mark">AI</div>
        <div className="dbc-regime-group">
          <span className="dbc-regime-label">Market Regime:</span>
          <span className="dbc-regime" style={{ color: regimeColor }}>{regime}</span>
        </div>
        <div className="dbc-conf">
          <span className="dbc-conf-label">Confidence:</span>
          <span className="dbc-conf-val">{avgConfidence}%</span>
        </div>
      </div>

      <div className="dbc-divider" />

      {/* Two-column content */}
      <div className="dbc-body">
        <div className="dbc-col">
          <span className="dbc-col-heading">Top Opportunities</span>
          {topOpportunities.length > 0 ? (
            <ul className="dbc-list">
              {topOpportunities.map((opp, i) => (
                <li key={i} className="dbc-list-item">{opp}</li>
              ))}
            </ul>
          ) : (
            <p className="dbc-empty">Loading analysis…</p>
          )}
        </div>
        <div className="dbc-divider-v" />
        <div className="dbc-col dbc-col-risk">
          <span className="dbc-col-heading">Biggest Risk</span>
          <p className="dbc-risk-text">{biggestRisk}</p>
        </div>
      </div>

      <div className="dbc-divider" />

      {/* Action links */}
      <div className="dbc-actions">
        <a href="/ai" className="dbc-link dbc-link-primary">View Thesis →</a>
        <a href={`/ai?q=${aiQuery}`} className="dbc-link dbc-link-secondary">Ask AI →</a>
        <a href="/watchlist" className="dbc-link dbc-link-ghost">See Trade Ideas →</a>
      </div>

      <style jsx>{`
        .dbc {
          padding: 18px 22px;
          border-radius: 14px;
          background: var(--surface);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 14px;
          position: relative;
          overflow: hidden;
        }
        .dbc::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--accent), #8b5cf6, #4ade80);
        }
        .dbc-header {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .dbc-mark {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, var(--accent), #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.62rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: 0.04em;
          flex-shrink: 0;
        }
        .dbc-regime-group {
          display: flex;
          align-items: center;
          gap: 6px;
          flex: 1;
        }
        .dbc-regime-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .dbc-regime {
          font-size: 0.9rem;
          font-weight: 700;
        }
        .dbc-conf {
          display: flex;
          align-items: center;
          gap: 5px;
          flex-shrink: 0;
        }
        .dbc-conf-label {
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .dbc-conf-val {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .dbc-divider {
          height: 1px;
          background: var(--border);
        }
        .dbc-body {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }
        .dbc-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .dbc-col-risk {
          max-width: 240px;
          flex-shrink: 0;
        }
        .dbc-divider-v {
          width: 1px;
          background: var(--border);
          align-self: stretch;
        }
        .dbc-col-heading {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }
        .dbc-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .dbc-list-item {
          font-size: 0.78rem;
          color: var(--text-primary);
          line-height: 1.4;
          padding-left: 14px;
          position: relative;
        }
        .dbc-list-item::before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--accent);
          font-size: 1rem;
          line-height: 1.1;
        }
        .dbc-risk-text {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.5;
        }
        .dbc-empty {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin: 0;
        }
        .dbc-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .dbc-link {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 8px;
          text-decoration: none;
          transition: opacity 150ms;
        }
        .dbc-link:hover { opacity: 0.8; }
        .dbc-link-primary {
          background: linear-gradient(120deg, #1a72d4, #3b9eff);
          color: #fff;
        }
        .dbc-link-secondary {
          background: rgba(59, 158, 255, 0.1);
          color: var(--accent);
          border: 1px solid rgba(59, 158, 255, 0.25);
        }
        .dbc-link-ghost {
          background: var(--surface-2, rgba(255,255,255,0.04));
          color: var(--text-muted);
          border: 1px solid var(--border);
        }
      `}</style>
    </div>
  );
}
