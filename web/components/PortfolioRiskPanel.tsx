'use client';

import type { PortfolioAnalytics } from '../lib/api/portfolio';

interface PortfolioRiskPanelProps {
  analytics: PortfolioAnalytics;
}

export function PortfolioRiskPanel({ analytics }: PortfolioRiskPanelProps) {
  const topSector = analytics.sector_exposure.reduce(
    (best, cur) => (cur.weight > best.weight ? cur : best),
    analytics.sector_exposure[0] ?? { sector: 'Unknown', weight: 0 },
  );
  const topSectorPct = topSector.weight * 100;
  const concentrationWarning = topSectorPct > 40;
  const correlationWarning = analytics.correlation_sp500 > 0.85;

  // Build risk suggestions
  const suggestions: string[] = [];
  if (analytics.beta > 1.2) {
    suggestions.push('Consider adding defensive positions to lower beta');
  }
  if (analytics.volatility > 0.2) {
    suggestions.push('Portfolio volatility is elevated — review position sizing');
  }
  if (analytics.max_drawdown < -0.15) {
    suggestions.push('Historical drawdown exceeds 15% — review stop-loss levels');
  }
  if (suggestions.length === 0) {
    suggestions.push('Portfolio risk profile looks balanced');
  }

  return (
    <div className="prp-container">
      {/* Concentration risk */}
      <div className={`prp-card ${concentrationWarning ? 'prp-card-warn' : ''}`}>
        <div className="prp-card-header">
          <span className="prp-card-icon">{concentrationWarning ? '⚠' : '✓'}</span>
          <div className="prp-card-titles">
            <span className="prp-card-title">Concentration Risk</span>
            <span className="prp-card-subtitle">
              Top sector: <strong>{topSector.sector}</strong> at {topSectorPct.toFixed(1)}%
            </span>
          </div>
        </div>
        {concentrationWarning && (
          <p className="prp-warn-text">
            Your portfolio is heavily concentrated in {topSector.sector}. Consider diversifying across more sectors to reduce idiosyncratic risk.
          </p>
        )}
        <div className="prp-conc-bar-row">
          <div className="prp-conc-track">
            <div
              className={concentrationWarning ? 'prp-conc-fill prp-fill-warn' : 'prp-conc-fill prp-fill-ok'}
              style={{ width: `${Math.min(100, topSectorPct)}%` }}
            />
          </div>
          <span className="prp-conc-pct">{topSectorPct.toFixed(1)}%</span>
        </div>
      </div>

      {/* Market correlation */}
      <div className={`prp-card ${correlationWarning ? 'prp-card-warn' : ''}`}>
        <div className="prp-card-header">
          <span className="prp-card-icon">{correlationWarning ? '⚠' : '✓'}</span>
          <div className="prp-card-titles">
            <span className="prp-card-title">Market Correlation</span>
            <span className="prp-card-subtitle">
              S&amp;P 500 correlation: {(analytics.correlation_sp500 * 100).toFixed(0)}%
            </span>
          </div>
        </div>
        {correlationWarning && (
          <p className="prp-warn-text">
            High correlation with the S&amp;P 500 means your portfolio may offer limited downside protection during market corrections. Consider adding uncorrelated assets.
          </p>
        )}
      </div>

      {/* Risk mitigation suggestions */}
      <div className="prp-suggestions">
        <h3 className="prp-suggestions-title">Risk Mitigation</h3>
        <ul className="prp-suggestion-list">
          {suggestions.map((s, i) => (
            <li key={i} className="prp-suggestion-item">
              <span className="prp-suggestion-dot" />
              <span className="prp-suggestion-text">{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Risk metrics summary */}
      <div className="prp-risk-metrics">
        <div className="prp-risk-metric">
          <span className="prp-rm-label">Beta</span>
          <span className={`prp-rm-val ${analytics.beta > 1.2 ? 'prp-warn-val' : ''}`}>
            {analytics.beta.toFixed(2)}
          </span>
          <span className="prp-rm-note">
            {analytics.beta > 1.2 ? 'Elevated' : analytics.beta > 0.8 ? 'Moderate' : 'Low'}
          </span>
        </div>
        <div className="prp-risk-metric">
          <span className="prp-rm-label">Volatility</span>
          <span className={`prp-rm-val ${analytics.volatility > 0.2 ? 'prp-warn-val' : ''}`}>
            {(analytics.volatility * 100).toFixed(1)}%
          </span>
          <span className="prp-rm-note">
            {analytics.volatility > 0.25 ? 'High' : analytics.volatility > 0.15 ? 'Moderate' : 'Low'}
          </span>
        </div>
        <div className="prp-risk-metric">
          <span className="prp-rm-label">Max Drawdown</span>
          <span className={`prp-rm-val ${analytics.max_drawdown < -0.15 ? 'prp-danger-val' : ''}`}>
            {(analytics.max_drawdown * 100).toFixed(1)}%
          </span>
          <span className="prp-rm-note">
            {analytics.max_drawdown < -0.2 ? 'Severe' : analytics.max_drawdown < -0.1 ? 'Notable' : 'Contained'}
          </span>
        </div>
        <div className="prp-risk-metric">
          <span className="prp-rm-label">Sharpe</span>
          <span className={`prp-rm-val ${analytics.sharpe >= 1.5 ? 'prp-ok-val' : ''}`}>
            {analytics.sharpe.toFixed(2)}
          </span>
          <span className="prp-rm-note">
            {analytics.sharpe >= 2 ? 'Excellent' : analytics.sharpe >= 1 ? 'Good' : 'Needs work'}
          </span>
        </div>
      </div>

      <style jsx>{`
        .prp-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .prp-card {
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: border-color 0.15s;
        }
        .prp-card-warn {
          border-color: rgba(251,191,36,0.4);
          background: rgba(251,191,36,0.04);
        }
        .prp-card-header {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .prp-card-icon {
          font-size: 1rem;
          flex-shrink: 0;
          line-height: 1.4;
        }
        .prp-card-titles {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .prp-card-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .prp-card-subtitle {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .prp-warn-text {
          font-size: 0.8rem;
          color: #fbbf24;
          margin: 0;
          line-height: 1.5;
          background: rgba(251,191,36,0.08);
          border-radius: 6px;
          padding: 8px 10px;
          border-left: 3px solid rgba(251,191,36,0.5);
        }
        .prp-conc-bar-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .prp-conc-track {
          flex: 1;
          height: 6px;
          border-radius: 3px;
          background: var(--surface);
          overflow: hidden;
        }
        .prp-conc-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.4s ease;
        }
        .prp-fill-warn {
          background: linear-gradient(90deg, #fbbf24, rgba(251,191,36,0.5));
        }
        .prp-fill-ok {
          background: linear-gradient(90deg, #4ade80, rgba(74,222,128,0.5));
        }
        .prp-conc-pct {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-muted);
          width: 40px;
          text-align: right;
          flex-shrink: 0;
        }
        .prp-suggestions {
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .prp-suggestions-title {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted);
          margin: 0;
        }
        .prp-suggestion-list {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .prp-suggestion-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .prp-suggestion-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          flex-shrink: 0;
          margin-top: 5px;
        }
        .prp-suggestion-text {
          font-size: 0.85rem;
          color: var(--text-primary);
          line-height: 1.5;
        }
        .prp-risk-metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }
        .prp-risk-metric {
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          align-items: center;
          text-align: center;
        }
        .prp-rm-label {
          font-size: 0.68rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }
        .prp-rm-val {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .prp-warn-val { color: #fbbf24; }
        .prp-danger-val { color: #f87171; }
        .prp-ok-val { color: #4ade80; }
        .prp-rm-note {
          font-size: 0.68rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
