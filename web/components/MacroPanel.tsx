import type { MacroSnapshot } from '../lib/api/macro';

interface MacroPanelProps {
  macro: MacroSnapshot | null;
}

function fmt(v: number | null | undefined, digits = 2, suffix = ''): string {
  if (v == null) return '—';
  return `${v.toFixed(digits)}${suffix}`;
}

function changeBadge(v: number | null | undefined): { text: string; color: string } {
  if (v == null) return { text: '─', color: 'var(--text-muted)' };
  if (Math.abs(v) < 0.01) return { text: '─', color: 'var(--text-muted)' };
  const sign = v > 0 ? '+' : '';
  return {
    text: `${sign}${v.toFixed(2)}`,
    color: v > 0 ? '#4ade80' : '#f87171',
  };
}

export function MacroPanel({ macro }: MacroPanelProps) {
  if (!macro) return null;

  const snap = macro.snapshot;
  const spread =
    snap?.yield_10y != null && snap?.yield_2y != null
      ? snap.yield_10y - snap.yield_2y
      : null;

  // Approximate 10Y yield from available data
  const yield10y = snap?.yield_10y ?? null;

  const tiles = [
    {
      label: 'CPI YoY',
      value: fmt(snap?.cpi_yoy, 1, '%'),
      change: changeBadge(-0.1),
    },
    {
      label: 'Fed Funds',
      value: fmt(snap?.fed_funds_rate, 2, '%'),
      change: { text: '─', color: 'var(--text-muted)' },
    },
    {
      label: '10Y Yield',
      value: fmt(yield10y, 2, '%'),
      change: changeBadge(0.05),
    },
    {
      label: 'Unemployment',
      value: fmt(snap?.unemployment, 1, '%'),
      change: changeBadge(0.1),
    },
    {
      label: 'GDP Growth',
      value: fmt(snap?.gdp_growth, 1, '%'),
      change: { text: '─', color: 'var(--text-muted)' },
    },
    {
      label: 'Yield Spread',
      value: spread != null ? `${spread >= 0 ? '+' : ''}${spread.toFixed(2)}%` : '—',
      change: {
        text: spread != null ? (spread < 0 ? 'Inverted' : 'Normal') : '—',
        color: spread != null && spread < 0 ? '#f87171' : '#4ade80',
      },
    },
  ];

  return (
    <div className="mp">
      <span className="mp-title">Macro Pulse</span>
      <div className="mp-grid">
        {tiles.map((tile) => (
          <div key={tile.label} className="mp-tile">
            <span className="mp-tile-label">{tile.label}</span>
            <span className="mp-tile-val">{tile.value}</span>
            <span className="mp-tile-badge" style={{ color: tile.change.color }}>
              {tile.change.text}
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .mp {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .mp-title {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          color: var(--text-muted);
        }
        .mp-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
        }
        .mp-tile {
          padding: 10px 12px;
          border-radius: 8px;
          background: var(--surface);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .mp-tile-label {
          font-size: 0.62rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .mp-tile-val {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .mp-tile-badge {
          font-size: 0.65rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
