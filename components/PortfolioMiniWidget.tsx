import Link from 'next/link';
import type { PortfolioSummary } from '../lib/api/dashboard';

interface PortfolioMiniWidgetProps {
  portfolio: PortfolioSummary;
}

function formatNumber(v: number): string {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return v.toFixed(2);
}

function pct(v: number): string {
  const sign = v >= 0 ? '+' : '';
  return `${sign}${v.toFixed(2)}%`;
}

export function PortfolioMiniWidget({ portfolio }: PortfolioMiniWidgetProps) {
  const dailyPositive = portfolio.daily_change_percent >= 0;
  const returnPositive = portfolio.total_return_percent >= 0;

  return (
    <div className="pmw-card">
      <div className="pmw-header">
        <span className="pmw-label">Portfolio</span>
      </div>
      <div className="pmw-value">${formatNumber(portfolio.total_value)}</div>
      <div className="pmw-rows">
        <div className="pmw-row">
          <span className="pmw-row-label">Today</span>
          <span className={`pmw-row-val ${dailyPositive ? 'pos' : 'neg'}`}>
            {pct(portfolio.daily_change_percent)}
          </span>
        </div>
        <div className="pmw-row">
          <span className="pmw-row-label">Return</span>
          <span className={`pmw-row-val ${returnPositive ? 'pos' : 'neg'}`}>
            {pct(portfolio.total_return_percent)}
          </span>
        </div>
      </div>
      <Link href="/portfolio" className="pmw-link">→ View portfolio</Link>

      <style jsx>{`
        .pmw-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .pmw-header {
          display: flex;
          align-items: center;
        }
        .pmw-label {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }
        .pmw-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }
        .pmw-rows {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .pmw-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .pmw-row-label {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .pmw-row-val {
          font-size: 0.85rem;
          font-weight: 600;
        }
        .pos { color: #4ade80; }
        .neg { color: #f87171; }
        :global(.pmw-link) {
          font-size: 0.8rem;
          color: var(--accent);
          text-decoration: none;
          font-weight: 500;
          margin-top: 2px;
        }
        :global(.pmw-link:hover) {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
