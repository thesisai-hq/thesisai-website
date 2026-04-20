'use client';

import type { MarketMoversResponse } from '../lib/api/market';

interface Props {
  gainers: MarketMoversResponse | null;
  losers: MarketMoversResponse | null;
}

export function MarketMoversPanel({ gainers, losers }: Props) {
  const topGainers = (gainers?.tickers ?? []).slice(0, 5);
  const topLosers = (losers?.tickers ?? []).slice(0, 5);

  return (
    <div className="movers-panel">
      <h3 className="movers-title">Market Movers</h3>

      <div className="movers-cols">
        <div className="movers-col">
          <div className="movers-col-label gainers-label">Top Gainers</div>
          {topGainers.map((t) => (
            <div key={t.ticker} className="mover-row">
              <span className="mover-ticker">{String(t.ticker)}</span>
              <span className="mover-pct gain">
                +{typeof t.change_percent === 'number' ? t.change_percent.toFixed(2) : '—'}%
              </span>
            </div>
          ))}
        </div>

        <div className="movers-col">
          <div className="movers-col-label losers-label">Top Losers</div>
          {topLosers.map((t) => (
            <div key={t.ticker} className="mover-row">
              <span className="mover-ticker">{String(t.ticker)}</span>
              <span className="mover-pct loss">
                {typeof t.change_percent === 'number' ? t.change_percent.toFixed(2) : '—'}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .movers-panel {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .movers-title {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          color: var(--text-muted);
          margin: 0;
        }
        .movers-cols {
          display: flex;
          gap: 12px;
        }
        .movers-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .movers-col-label {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 2px;
        }
        .gainers-label { color: #22c55e; }
        .losers-label { color: #ef4444; }
        .mover-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 8px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          border-radius: 6px;
        }
        .mover-ticker {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-primary);
          font-family: 'SF Mono', 'Fira Code', monospace;
        }
        .mover-pct {
          font-size: 0.78rem;
          font-weight: 600;
          font-family: 'SF Mono', 'Fira Code', monospace;
        }
        .gain { color: #22c55e; }
        .loss { color: #ef4444; }
      `}</style>
    </div>
  );
}
