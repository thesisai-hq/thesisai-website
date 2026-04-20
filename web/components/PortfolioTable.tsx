import type { HoldingSnapshot, PortfolioSnapshotResponse } from '../lib/api/portfolio';

interface PortfolioTableProps {
  portfolio: PortfolioSnapshotResponse;
}

function fmt(v: number | null, digits = 2): string {
  if (v == null) return '—';
  return v.toFixed(digits);
}

function fmtCurrency(v: number | null): string {
  if (v == null) return '—';
  const sign = v >= 0 ? '' : '-';
  const abs = Math.abs(v);
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`;
  return `${sign}$${abs.toFixed(2)}`;
}

function fmtCurrencyExact(v: number | null): string {
  if (v == null) return '—';
  const sign = v >= 0 ? '' : '-';
  return `${sign}$${Math.abs(v).toFixed(2)}`;
}

function fmtPct(v: number | null): string {
  if (v == null) return '—';
  const sign = v >= 0 ? '+' : '';
  return `${sign}${v.toFixed(2)}%`;
}

function PnlCell({ value, pct }: { value: number | null; pct: number | null }) {
  const isPos = (value ?? 0) >= 0;
  return (
    <td>
      <span className={isPos ? 'positive' : 'negative'}>
        {fmtCurrencyExact(value)}
      </span>
      <span className="pct-sub">
        {' '}({fmtPct(pct)})
      </span>
      <style jsx>{`
        .positive { color: #4ade80; font-weight: 600; }
        .negative { color: #f87171; font-weight: 600; }
        .pct-sub { font-size: 0.75rem; color: var(--text-muted); }
      `}</style>
    </td>
  );
}

function AllocationBar({ pct }: { pct: number }) {
  const clamped = Math.min(100, Math.max(0, pct));
  return (
    <div className="alloc-wrap">
      <div className="alloc-track">
        <div className="alloc-fill" style={{ width: `${clamped}%` }} />
      </div>
      <span className="alloc-label">{clamped.toFixed(1)}%</span>
      <style jsx>{`
        .alloc-wrap { display: flex; align-items: center; gap: 6px; min-width: 90px; }
        .alloc-track {
          flex: 1;
          height: 4px;
          border-radius: 2px;
          background: var(--surface-2);
          overflow: hidden;
        }
        .alloc-fill {
          height: 100%;
          border-radius: 2px;
          background: linear-gradient(90deg, var(--accent), rgba(59,158,255,0.5));
        }
        .alloc-label { font-size: 0.75rem; color: var(--text-muted); white-space: nowrap; flex-shrink: 0; }
      `}</style>
    </div>
  );
}

export function PortfolioTable({ portfolio }: PortfolioTableProps) {
  const totalValue = portfolio.total_value;
  const totalReturn = portfolio.unrealized_pnl;
  const totalReturnPct = portfolio.unrealized_pnl_pct;
  const dailyChange = portfolio.daily_change;
  const dailyChangePct = portfolio.daily_change_pct;

  return (
    <div className="pt-container">
      {portfolio.stale && (
        <div className="pt-stale">⚠ Prices may be delayed</div>
      )}

      <div className="pt-metrics">
        <div className="pt-metric-card">
          <span className="pt-metric-label">Total Value</span>
          <span className="pt-metric-value">{fmtCurrency(totalValue)}</span>
        </div>
        <div className="pt-metric-card">
          <span className="pt-metric-label">Today P&amp;L</span>
          <span className={`pt-metric-value ${(dailyChange ?? 0) >= 0 ? 'positive' : 'negative'}`}>
            {fmtCurrency(dailyChange)}
            <span className="pt-metric-pct"> ({fmtPct(dailyChangePct)})</span>
          </span>
        </div>
        <div className="pt-metric-card">
          <span className="pt-metric-label">All-time Return</span>
          <span className={`pt-metric-value ${(totalReturn ?? 0) >= 0 ? 'positive' : 'negative'}`}>
            {fmtCurrency(totalReturn)}
            <span className="pt-metric-pct"> ({fmtPct(totalReturnPct)})</span>
          </span>
        </div>
        <div className="pt-metric-card">
          <span className="pt-metric-label">Movers</span>
          <div className="pt-movers">
            {portfolio.top_gainer ? (
              <span className="positive">↑ {portfolio.top_gainer}</span>
            ) : (
              <span className="muted">—</span>
            )}
            {portfolio.top_loser ? (
              <span className="negative">↓ {portfolio.top_loser}</span>
            ) : (
              <span className="muted">—</span>
            )}
          </div>
        </div>
      </div>

      <div className="pt-table-wrap">
        <table className="pt-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Qty</th>
              <th>Avg Cost</th>
              <th>Current Price</th>
              <th>Current Value</th>
              <th>Allocation</th>
              <th>Unrealized P&amp;L</th>
              <th>Today</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.holdings.length === 0 ? (
              <tr>
                <td colSpan={8} className="pt-empty">No holdings yet.</td>
              </tr>
            ) : (
              portfolio.holdings.map((h: HoldingSnapshot) => {
                const allocPct =
                  totalValue && h.current_value != null
                    ? (h.current_value / totalValue) * 100
                    : 0;
                return (
                  <tr key={h.symbol}>
                    <td className="pt-symbol">{h.symbol}</td>
                    <td>{h.quantity}</td>
                    <td>${fmt(h.avg_cost)}</td>
                    <td>{h.current_price != null ? `$${fmt(h.current_price)}` : '—'}</td>
                    <td>{h.current_value != null ? `$${fmt(h.current_value)}` : '—'}</td>
                    <td><AllocationBar pct={allocPct} /></td>
                    <PnlCell value={h.unrealized_pnl} pct={h.unrealized_pnl_pct} />
                    <td className={(h.change_today_pct ?? 0) >= 0 ? 'positive' : 'negative'}>
                      {fmtPct(h.change_today_pct)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .pt-container { display: flex; flex-direction: column; gap: 20px; }
        .pt-stale {
          font-size: 0.78rem;
          color: #fbbf24;
          background: rgba(251,191,36,0.08);
          border: 1px solid rgba(251,191,36,0.25);
          border-radius: 6px;
          padding: 6px 12px;
          width: fit-content;
        }
        .pt-metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .pt-metric-card {
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .pt-metric-label {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          font-weight: 600;
        }
        .pt-metric-value {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .pt-metric-pct {
          font-size: 0.75rem;
          font-weight: 500;
        }
        .pt-movers {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 0.88rem;
          font-weight: 700;
        }
        .positive { color: #4ade80 !important; }
        .negative { color: #f87171 !important; }
        .muted { color: var(--text-muted); font-size: 0.88rem; }
        .pt-table-wrap { overflow-x: auto; }
        .pt-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
        .pt-table th {
          text-align: left; padding: 10px 14px;
          font-size: 0.75rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.05em;
          color: var(--text-muted); border-bottom: 1px solid var(--border);
        }
        .pt-table td { padding: 12px 14px; border-bottom: 1px solid var(--border); color: var(--text-muted); vertical-align: middle; }
        .pt-table tr:hover td { background: var(--surface-2); }
        .pt-symbol { font-weight: 700; color: var(--text-primary) !important; }
        .pt-empty { text-align: center; color: var(--text-muted); padding: 24px; }
      `}</style>
    </div>
  );
}
