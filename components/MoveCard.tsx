import type { TodayMove } from '../lib/api/dashboard';

interface MoveCardProps {
  move: TodayMove;
}

function fmt(v: number | null, digits = 2): string {
  if (v == null) return '—';
  return v.toFixed(digits);
}

function pct(v: number | null): string {
  if (v == null) return '—';
  const sign = v >= 0 ? '+' : '';
  return `${sign}${v.toFixed(2)}%`;
}

export function MoveCard({ move }: MoveCardProps) {
  const confidence = Math.round(move.confidence * 100);
  const isPositive = (move.change_percent ?? 0) >= 0;

  return (
    <div className="move-card">
      <div className="move-top">
        <div className="move-ticker-row">
          <span className="move-ticker">{move.ticker}</span>
          {move.price != null && (
            <span className="move-price">${fmt(move.price)}</span>
          )}
          <span className={`move-change ${isPositive ? 'positive' : 'negative'}`}>
            {pct(move.change_percent)}
          </span>
        </div>
        <div className="move-confidence-row">
          <span className="move-confidence-label">Confidence</span>
          <span className="move-confidence-value">{confidence}%</span>
        </div>
      </div>

      <h4 className="move-title">{move.title}</h4>
      <p className="move-why">{move.why}</p>

      {move.signals.length > 0 && (
        <div className="move-signals">
          {move.signals.map((s, i) => (
            <span key={i} className="move-signal">{s}</span>
          ))}
        </div>
      )}

      <style jsx>{`
        .move-card {
          padding: 18px 20px;
          border-radius: 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .move-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .move-ticker-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .move-ticker {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .move-price {
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .move-change {
          font-size: 0.825rem;
          font-weight: 600;
        }
        .positive { color: #4ade80; }
        .negative { color: #f87171; }
        .move-confidence-row {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }
        .move-confidence-label {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .move-confidence-value {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--accent);
        }
        .move-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.4;
        }
        .move-why {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.5;
        }
        .move-signals {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .move-signal {
          font-size: 0.7rem;
          padding: 2px 8px;
          border-radius: 4px;
          background: var(--surface-2);
          color: var(--text-muted);
          border: 1px solid var(--border);
        }
      `}</style>
    </div>
  );
}
