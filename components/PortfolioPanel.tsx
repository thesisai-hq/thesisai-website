import type { PortfolioSummary } from '../lib/api/dashboard';

interface PortfolioPanelProps {
  portfolio: PortfolioSummary | null;
}

const MOCK_SECTORS = [
  { name: 'Technology', pct: 62 },
  { name: 'Healthcare', pct: 24 },
  { name: 'Financials', pct: 14 },
];

function fmtDollar(v: number): string {
  if (Math.abs(v) >= 1000) {
    return `$${(v / 1000).toFixed(1)}K`;
  }
  return `$${v.toFixed(0)}`;
}

function pct(v: number): string {
  const sign = v >= 0 ? '+' : '';
  return `${sign}${v.toFixed(2)}%`;
}

export function PortfolioPanel({ portfolio }: PortfolioPanelProps) {
  if (!portfolio) return null;

  const dailyPos = portfolio.daily_change >= 0;
  const totalPos = portfolio.total_return_percent >= 0;

  // Derived warnings from sector concentration
  const warnings: string[] = [];
  if (MOCK_SECTORS[0] && MOCK_SECTORS[0].pct > 50) {
    warnings.push(`High ${MOCK_SECTORS[0].name} sector exposure`);
  }
  warnings.push('NVDA/PLTR positions correlated');

  // Rough risk score derived from concentration
  const riskScore = Math.min(95, 40 + MOCK_SECTORS[0].pct * 0.55);

  return (
    <div className="pp">
      <div className="pp-header">
        <span className="pp-title">Portfolio Snapshot</span>
        <a href="/portfolio" className="pp-open">Open Portfolio →</a>
      </div>

      {/* Top stats */}
      <div className="pp-stats">
        <div className="pp-stat">
          <span className="pp-stat-label">Daily P/L</span>
          <span className={`pp-stat-val ${dailyPos ? 'pos' : 'neg'}`}>
            {dailyPos ? '+' : ''}{fmtDollar(portfolio.daily_change)}
          </span>
          <span className={`pp-stat-sub ${dailyPos ? 'pos' : 'neg'}`}>
            ({pct(portfolio.daily_change_percent)})
          </span>
        </div>
        <div className="pp-stat pp-stat-mid">
          <span className="pp-stat-label">Risk Score</span>
          <span className="pp-stat-val">{riskScore.toFixed(0)}/100</span>
        </div>
        <div className="pp-stat">
          <span className="pp-stat-label">Total Value</span>
          <span className="pp-stat-val">
            ${(portfolio.total_value / 1000).toFixed(1)}K
          </span>
        </div>
        <div className="pp-stat">
          <span className="pp-stat-label">Total Return</span>
          <span className={`pp-stat-val ${totalPos ? 'pos' : 'neg'}`}>
            {pct(portfolio.total_return_percent)}
          </span>
        </div>
      </div>

      <div className="pp-divider" />

      {/* Two-col: sector bars + warnings */}
      <div className="pp-body">
        <div className="pp-sectors">
          <span className="pp-body-heading">Sector Allocation</span>
          {MOCK_SECTORS.map((s) => (
            <div key={s.name} className="pp-sector-row">
              <div className="pp-sector-bar-wrap">
                <div
                  className="pp-sector-bar"
                  style={{ width: `${s.pct}%` }}
                />
              </div>
              <span className="pp-sector-name">{s.name}</span>
              <span className="pp-sector-pct">{s.pct}%</span>
            </div>
          ))}
        </div>
        {warnings.length > 0 && (
          <>
            <div className="pp-divider-v" />
            <div className="pp-warnings">
              <span className="pp-body-heading">Warnings</span>
              {warnings.map((w, i) => (
                <div key={i} className="pp-warn-row">
                  <span className="pp-warn-icon">⚠</span>
                  <span className="pp-warn-text">{w}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .pp {
          padding: 18px 20px;
          border-radius: 14px;
          background: var(--surface);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .pp-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .pp-title {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          color: var(--text-muted);
        }
        .pp-open {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--accent);
          text-decoration: none;
        }
        .pp-open:hover { opacity: 0.75; }
        .pp-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .pp-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .pp-stat-mid { border-left: 1px solid var(--border); padding-left: 12px; }
        .pp-stat-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted);
        }
        .pp-stat-val {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .pp-stat-sub {
          font-size: 0.72rem;
          font-weight: 600;
        }
        .pos { color: #4ade80; }
        .neg { color: #f87171; }
        .pp-divider { height: 1px; background: var(--border); }
        .pp-body {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }
        .pp-sectors {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .pp-divider-v {
          width: 1px;
          background: var(--border);
          align-self: stretch;
        }
        .pp-warnings {
          flex: 0 0 auto;
          min-width: 180px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .pp-body-heading {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }
        .pp-sector-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .pp-sector-bar-wrap {
          flex: 1;
          height: 6px;
          background: rgba(148,163,184,0.1);
          border-radius: 3px;
          overflow: hidden;
        }
        .pp-sector-bar {
          height: 100%;
          border-radius: 3px;
          background: var(--accent);
        }
        .pp-sector-name {
          font-size: 0.73rem;
          color: var(--text-muted);
          white-space: nowrap;
          min-width: 80px;
        }
        .pp-sector-pct {
          font-size: 0.73rem;
          font-weight: 600;
          color: var(--text-primary);
          min-width: 30px;
          text-align: right;
        }
        .pp-warn-row {
          display: flex;
          gap: 6px;
          align-items: flex-start;
        }
        .pp-warn-icon {
          color: #fbbf24;
          font-size: 0.78rem;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .pp-warn-text {
          font-size: 0.75rem;
          color: var(--text-muted);
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}
