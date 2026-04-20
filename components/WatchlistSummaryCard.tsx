'use client';

import { useRouter } from 'next/navigation';

interface WatchlistSummaryCardProps {
  strongBuys: number;
  watching: number;
  avgScore: number;
  symbols: string[];
}

export function WatchlistSummaryCard({
  strongBuys,
  watching,
  avgScore,
  symbols,
}: WatchlistSummaryCardProps) {
  const router = useRouter();

  function handleCompare() {
    const top = symbols.slice(0, 3).join(',');
    router.push(`/watchlist/compare?symbols=${top}`);
  }

  return (
    <div className="wsc-card">
      <div className="wsc-header">
        <div className="wsc-icon-wrap">
          <span className="wsc-icon">&#9675;</span>
        </div>
        <div className="wsc-titles">
          <span className="wsc-title">Watchlist Intelligence</span>
          <span className="wsc-subtitle">AI-powered analysis across your tracked symbols</span>
        </div>
      </div>

      <div className="wsc-body">
        <div className="wsc-stats">
          <div className="wsc-stat-box">
            <span className="wsc-stat-value wsc-green">{strongBuys}</span>
            <span className="wsc-stat-label">Strong Buys</span>
          </div>
          <div className="wsc-stat-box">
            <span className="wsc-stat-value">{watching}</span>
            <span className="wsc-stat-label">Watching</span>
          </div>
          <div className="wsc-stat-box">
            <span className="wsc-stat-value wsc-accent">{avgScore > 0 ? avgScore.toFixed(0) : '—'}</span>
            <span className="wsc-stat-label">Avg Score</span>
          </div>
        </div>
        <button className="wsc-compare-btn" onClick={handleCompare} disabled={symbols.length === 0}>
          Compare
        </button>
      </div>

      <style jsx>{`
        .wsc-card {
          background: linear-gradient(135deg, rgba(59,158,255,0.06) 0%, rgba(59,158,255,0.02) 100%);
          border: 1px solid rgba(59,158,255,0.22);
          border-radius: 12px;
          padding: 18px 22px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .wsc-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .wsc-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: linear-gradient(135deg, var(--accent), rgba(59,158,255,0.5));
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .wsc-icon {
          color: #fff;
          font-size: 1rem;
          line-height: 1;
        }
        .wsc-titles {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .wsc-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .wsc-subtitle {
          font-size: 0.775rem;
          color: var(--text-muted);
        }
        .wsc-body {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .wsc-stats {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .wsc-stat-box {
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 10px 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          min-width: 80px;
        }
        .wsc-stat-value {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1;
        }
        .wsc-stat-label {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          white-space: nowrap;
        }
        .wsc-green { color: #4ade80; }
        .wsc-accent { color: var(--accent); }
        .wsc-compare-btn {
          background: rgba(59,158,255,0.12);
          color: var(--accent);
          border: 1px solid rgba(59,158,255,0.3);
          border-radius: 20px;
          padding: 7px 20px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          white-space: nowrap;
        }
        .wsc-compare-btn:hover {
          background: rgba(59,158,255,0.2);
          border-color: var(--accent);
        }
        .wsc-compare-btn:disabled {
          opacity: 0.4;
          cursor: default;
        }
      `}</style>
    </div>
  );
}
