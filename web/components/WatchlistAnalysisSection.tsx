import type { AiThesisCard } from '../lib/api/ai';
import type { SnapshotData } from '../lib/api/market';

interface WatchlistAnalysisSectionProps {
  cards: AiThesisCard[];
  snapshots: Record<string, SnapshotData>;
  loading?: boolean;
  hasWatchlist: boolean;
}

export function WatchlistAnalysisSection({
  cards,
  snapshots,
  loading,
  hasWatchlist,
}: WatchlistAnalysisSectionProps) {
  if (!hasWatchlist) {
    return (
      <div className="wl-empty">
        <p className="wl-empty-text">Add symbols to your watchlist to see AI analysis</p>
        <a href="/watchlist" className="wl-link">Go to Watchlist →</a>
        <style jsx>{`
          .wl-empty {
            padding: 40px;
            text-align: center;
            display: flex;
            flex-direction: column;
            gap: 12px;
            align-items: center;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
          }
          .wl-empty-text { color: var(--text-muted); font-size: 0.9rem; margin: 0; }
          .wl-link { color: var(--accent); font-size: 0.85rem; font-weight: 600; text-decoration: none; }
        `}</style>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="wl-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="wl-skel" />
        ))}
        <style jsx>{`
          .wl-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 14px;
          }
          .wl-skel {
            height: 160px;
            border-radius: 12px;
            background: var(--surface);
            border: 1px solid var(--border);
            animation: shimmer 1.5s ease-in-out infinite;
          }
          @keyframes shimmer { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
        `}</style>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="wl-empty">
        <p className="wl-empty-text">No analysis available yet</p>
        <style jsx>{`
          .wl-empty {
            padding: 40px;
            text-align: center;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
          }
          .wl-empty-text { color: var(--text-muted); font-size: 0.9rem; margin: 0; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="wl-grid">
      {cards.map((card) => {
        const snap = snapshots[card.symbol];
        const price = snap?.price ?? card.price;
        const change = snap?.change_percent ?? card.change_percent;
        const isUp = change !== null && change !== undefined && change >= 0;

        return (
          <div key={card.symbol} className="wl-card">
            <div className="wl-header">
              <span className="wl-symbol">{card.symbol}</span>
              <div className="wl-price-block">
                {price != null && (
                  <span className="wl-price">${price.toFixed(2)}</span>
                )}
                {change != null && (
                  <span className={`wl-change ${isUp ? 'up' : 'down'}`}>
                    {isUp ? '+' : ''}{change.toFixed(2)}%
                  </span>
                )}
              </div>
            </div>
            <p className="wl-headline">{card.headline}</p>
            <p className="wl-summary">{card.summary}</p>
            {card.signals.length > 0 && (
              <div className="wl-signals">
                {card.signals.slice(0, 3).map((sig, i) => (
                  <span key={i} className="wl-sig">{sig}</span>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <style jsx>{`
        .wl-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 14px;
        }
        .wl-card {
          padding: 18px;
          border-radius: 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 9px;
        }
        .wl-header { display: flex; align-items: center; justify-content: space-between; }
        .wl-symbol {
          font-size: 0.9rem;
          font-weight: 800;
          color: var(--accent);
          background: rgba(59,158,255,0.08);
          padding: 2px 8px;
          border-radius: 5px;
          border: 1px solid rgba(59,158,255,0.18);
        }
        .wl-price-block { display: flex; flex-direction: column; align-items: flex-end; gap: 1px; }
        .wl-price { font-size: 0.88rem; font-weight: 700; color: var(--text-primary); }
        .wl-change { font-size: 0.75rem; font-weight: 600; }
        .up { color: #4ade80; }
        .down { color: #f87171; }
        .wl-headline {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.4;
        }
        .wl-summary {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .wl-signals { display: flex; flex-wrap: wrap; gap: 5px; }
        .wl-sig {
          font-size: 0.68rem;
          padding: 2px 8px;
          border-radius: 4px;
          background: rgba(148,163,184,0.07);
          border: 1px solid rgba(148,163,184,0.18);
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
