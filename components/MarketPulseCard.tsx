import type { MacroSnapshot } from '../lib/api/macro';

interface MarketPulseCardProps {
  macro: MacroSnapshot | null;
}

interface MetricTileProps {
  label: string;
  value: string;
  color?: string;
}

function MetricTile({ label, value, color }: MetricTileProps) {
  return (
    <div className="mpc-tile">
      <span className="mpc-tile-label">{label}</span>
      <span className="mpc-tile-value" style={color ? { color } : undefined}>
        {value}
      </span>
      <style jsx>{`
        .mpc-tile {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          border-radius: 10px;
        }
        .mpc-tile-label {
          font-size: 0.66rem;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--text-muted);
          font-weight: 600;
        }
        .mpc-tile-value {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}

export function MarketPulseCard({ macro }: MarketPulseCardProps) {
  const snap = macro?.snapshot ?? null;

  const cpi = snap?.cpi_yoy ?? null;
  const unemployment = snap?.unemployment ?? null;
  const fedFunds = snap?.fed_funds_rate ?? null;
  const yield10y = snap?.yield_10y ?? null;
  const yield2y = snap?.yield_2y ?? null;

  const spread =
    yield10y != null && yield2y != null ? yield10y - yield2y : null;

  const cpiColor =
    cpi == null ? undefined : cpi > 4 ? '#f87171' : cpi < 2.5 ? '#4ade80' : undefined;

  const unempColor =
    unemployment == null
      ? undefined
      : unemployment > 5
      ? '#f87171'
      : unemployment < 4
      ? '#4ade80'
      : undefined;

  const spreadColor =
    spread == null ? undefined : spread >= 0 ? '#4ade80' : '#f87171';

  return (
    <div className="mpc">
      <div className="mpc-header">
        <span className="mpc-title">Market Pulse</span>
        <span className="mpc-live">
          <span className="mpc-dot" />
          Live
        </span>
      </div>

      <div className="mpc-grid">
        <MetricTile
          label="CPI YoY"
          value={cpi != null ? `${cpi.toFixed(1)}%` : '—'}
          color={cpiColor}
        />
        <MetricTile
          label="Unemployment"
          value={unemployment != null ? `${unemployment.toFixed(1)}%` : '—'}
          color={unempColor}
        />
        <MetricTile
          label="Fed Funds"
          value={fedFunds != null ? `${fedFunds.toFixed(2)}%` : '—'}
        />
        <MetricTile
          label="10Y–2Y Spread"
          value={spread != null ? `${spread >= 0 ? '+' : ''}${spread.toFixed(2)}%` : '—'}
          color={spreadColor}
        />
      </div>

      <style jsx>{`
        .mpc {
          padding: 18px 20px;
          border-radius: 12px;
          background: var(--glass, rgba(255, 255, 255, 0.04));
          border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.08));
          backdrop-filter: blur(14px);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .mpc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .mpc-title {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }
        .mpc-live {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.68rem;
          color: #4ade80;
          font-weight: 600;
        }
        .mpc-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 8px rgba(74, 222, 128, 0.7);
          animation: mpPulse 2s ease-in-out infinite;
        }
        @keyframes mpPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .mpc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
      `}</style>
    </div>
  );
}
