'use client';

import type { PortfolioAnalytics } from '../lib/api/portfolio';

interface PortfolioAnalyticsPanelProps {
  analytics: PortfolioAnalytics;
}

function MetricCard({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: string;
  colorClass?: string;
}) {
  return (
    <div className="pap-metric-card">
      <span className="pap-metric-label">{label}</span>
      <span className={`pap-metric-value ${colorClass ?? ''}`}>{value}</span>
      <style jsx>{`
        .pap-metric-card {
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .pap-metric-label {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted);
        }
        .pap-metric-value {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .pap-accent { color: var(--accent); }
        .pap-green { color: #4ade80; }
        .pap-red { color: #f87171; }
        .pap-amber { color: #fbbf24; }
      `}</style>
    </div>
  );
}

export function PortfolioAnalyticsPanel({ analytics }: PortfolioAnalyticsPanelProps) {
  const volatilityPct = (analytics.volatility * 100).toFixed(1);
  const drawdownPct = (analytics.max_drawdown * 100).toFixed(1);
  const drawdownIsNeg = analytics.max_drawdown < 0;

  return (
    <div className="pap-container">
      {/* 2x2 metric grid */}
      <div className="pap-metrics-grid">
        <MetricCard label="Beta" value={analytics.beta.toFixed(2)} colorClass="pap-accent" />
        <MetricCard label="Sharpe Ratio" value={analytics.sharpe.toFixed(2)} colorClass="pap-green" />
        <MetricCard label="Volatility" value={`${volatilityPct}%`} colorClass="pap-amber" />
        <MetricCard
          label="Max Drawdown"
          value={`${drawdownPct}%`}
          colorClass={drawdownIsNeg ? 'pap-red' : 'pap-green'}
        />
      </div>

      {/* Correlation section */}
      <div className="pap-section">
        <h3 className="pap-section-title">Market Correlation</h3>
        <div className="pap-corr-row">
          <div className="pap-corr-badge pap-corr-sp">
            <span className="pap-corr-label">S&amp;P 500</span>
            <span className="pap-corr-val">{(analytics.correlation_sp500 * 100).toFixed(0)}%</span>
          </div>
          <div className="pap-corr-badge pap-corr-ndq">
            <span className="pap-corr-label">NASDAQ</span>
            <span className="pap-corr-val">{(analytics.correlation_nasdaq * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* Sector exposure */}
      <div className="pap-section">
        <h3 className="pap-section-title">Sector Exposure</h3>
        <div className="pap-bars">
          {analytics.sector_exposure.map(({ sector, weight }) => {
            const pct = (weight * 100).toFixed(1);
            return (
              <div key={sector} className="pap-bar-row">
                <span className="pap-bar-label">{sector}</span>
                <div className="pap-bar-track">
                  <div
                    className="pap-bar-fill"
                    style={{ width: `${Math.min(100, weight * 100)}%` }}
                  />
                </div>
                <span className="pap-bar-pct">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Factor exposure */}
      <div className="pap-section">
        <h3 className="pap-section-title">Factor Exposure</h3>
        <table className="pap-factor-table">
          <thead>
            <tr>
              <th>Factor</th>
              <th>Score</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {analytics.factor_exposure.map(({ factor, score }) => {
              const isPos = score >= 0;
              const fillPct = Math.min(100, Math.abs(score) * 100);
              return (
                <tr key={factor}>
                  <td className="pap-factor-name">{factor}</td>
                  <td className={isPos ? 'pap-factor-val pap-pos' : 'pap-factor-val pap-neg'}>
                    {score > 0 ? '+' : ''}{score.toFixed(2)}
                  </td>
                  <td className="pap-factor-bar-cell">
                    <div className="pap-factor-track">
                      <div
                        className={isPos ? 'pap-factor-fill pap-factor-fill-pos' : 'pap-factor-fill pap-factor-fill-neg'}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .pap-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .pap-metrics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .pap-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .pap-section-title {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted);
          margin: 0;
        }
        .pap-corr-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .pap-corr-badge {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 10px 18px;
          border-radius: 9px;
          border: 1px solid var(--border);
        }
        .pap-corr-sp {
          background: rgba(59,158,255,0.07);
          border-color: rgba(59,158,255,0.2);
        }
        .pap-corr-ndq {
          background: rgba(74,222,128,0.07);
          border-color: rgba(74,222,128,0.2);
        }
        .pap-corr-label {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }
        .pap-corr-val {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .pap-bars {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .pap-bar-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .pap-bar-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          width: 110px;
          flex-shrink: 0;
        }
        .pap-bar-track {
          flex: 1;
          height: 6px;
          border-radius: 3px;
          background: var(--surface-2);
          overflow: hidden;
        }
        .pap-bar-fill {
          height: 100%;
          border-radius: 3px;
          background: linear-gradient(90deg, var(--accent), rgba(59,158,255,0.5));
          transition: width 0.4s ease;
        }
        .pap-bar-pct {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-muted);
          width: 40px;
          text-align: right;
          flex-shrink: 0;
        }
        .pap-factor-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }
        .pap-factor-table th {
          text-align: left;
          padding: 6px 10px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border);
        }
        .pap-factor-table td {
          padding: 9px 10px;
          border-bottom: 1px solid var(--border);
          vertical-align: middle;
        }
        .pap-factor-name {
          color: var(--text-primary);
          font-weight: 600;
          width: 90px;
        }
        .pap-factor-val {
          font-weight: 700;
          width: 56px;
          text-align: right;
          padding-right: 16px !important;
        }
        .pap-pos { color: #4ade80; }
        .pap-neg { color: #f87171; }
        .pap-factor-bar-cell { min-width: 120px; }
        .pap-factor-track {
          height: 5px;
          border-radius: 3px;
          background: var(--surface-2);
          overflow: hidden;
        }
        .pap-factor-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.4s ease;
        }
        .pap-factor-fill-pos {
          background: linear-gradient(90deg, var(--accent), rgba(59,158,255,0.5));
        }
        .pap-factor-fill-neg {
          background: linear-gradient(90deg, #f87171, rgba(248,113,113,0.5));
        }
      `}</style>
    </div>
  );
}
