import type { MacroSnapshot } from '../lib/api/macro';

interface MacroCardProps {
  macro: MacroSnapshot;
}

function fmt(v: number | null, digits = 2, suffix = ''): string {
  if (v == null) return '—';
  return `${v.toFixed(digits)}${suffix}`;
}

const REGIME_COLOR: Record<string, string> = {
  expansion: '#4ade80',
  contraction: '#f87171',
  stagflation: '#fb923c',
  deflation: '#60a5fa',
  recovery: '#a78bfa',
};

export function MacroCard({ macro }: MacroCardProps) {
  const snap = macro.snapshot;
  const regimeColor = macro.regime ? (REGIME_COLOR[macro.regime.toLowerCase()] ?? 'var(--accent)') : 'var(--text-muted)';

  return (
    <div className="macro-card">
      <div className="macro-header">
        <span className="macro-label">Macro Regime</span>
        {macro.regime && (
          <span className="macro-regime" style={{ color: regimeColor }}>
            {macro.regime}
          </span>
        )}
      </div>

      {snap && (
        <div className="macro-grid">
          <div className="macro-metric">
            <span className="macro-metric-label">CPI YoY</span>
            <span className="macro-metric-value">{fmt(snap.cpi_yoy, 1, '%')}</span>
          </div>
          <div className="macro-metric">
            <span className="macro-metric-label">10Y Yield</span>
            <span className="macro-metric-value">{fmt(snap.yield_10y, 2, '%')}</span>
          </div>
          <div className="macro-metric">
            <span className="macro-metric-label">2Y Yield</span>
            <span className="macro-metric-value">{fmt(snap.yield_2y, 2, '%')}</span>
          </div>
          <div className="macro-metric">
            <span className="macro-metric-label">Fed Funds</span>
            <span className="macro-metric-value">{fmt(snap.fed_funds_rate, 2, '%')}</span>
          </div>
        </div>
      )}

      <style jsx>{`
        .macro-card {
          padding: 18px 20px;
          border-radius: 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .macro-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .macro-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          font-weight: 600;
        }
        .macro-regime {
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: capitalize;
        }
        .macro-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .macro-metric {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .macro-metric-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-muted);
        }
        .macro-metric-value {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}
