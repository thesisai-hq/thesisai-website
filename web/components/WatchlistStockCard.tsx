'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { WatchlistItem } from '../lib/api/watchlist';
import type { SnapshotData } from '../lib/api/market';

// Extended snapshot that may include AI fields not in the base type
interface ExtendedSnapshot extends SnapshotData {
  volume?: number;
  ai_score?: number;
  ai_action?: string;
}

interface WatchlistStockCardProps {
  item: WatchlistItem;
  snapshot?: ExtendedSnapshot;
  onRemove: (itemId: string) => void;
  watchlistId: string;
}

function actionColor(action: string | undefined): string {
  if (!action) return 'var(--text-muted)';
  const a = action.toLowerCase();
  if (a === 'buy' || a === 'strong buy') return '#4ade80';
  if (a === 'hold') return '#fbbf24';
  if (a === 'watch') return '#60a5fa';
  if (a === 'sell') return '#f87171';
  return 'var(--text-muted)';
}

function actionBg(action: string | undefined): string {
  if (!action) return 'rgba(103,129,156,0.12)';
  const a = action.toLowerCase();
  if (a === 'buy' || a === 'strong buy') return 'rgba(74,222,128,0.12)';
  if (a === 'hold') return 'rgba(251,191,36,0.12)';
  if (a === 'watch') return 'rgba(96,165,250,0.12)';
  if (a === 'sell') return 'rgba(248,113,113,0.12)';
  return 'rgba(103,129,156,0.12)';
}

export function WatchlistStockCard({
  item,
  snapshot,
  onRemove,
  watchlistId: _watchlistId,
}: WatchlistStockCardProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const price = snapshot?.price;
  const changePct = snapshot?.change_percent;
  const fmv = snapshot?.fmv;
  const aiScore = snapshot?.ai_score;
  const aiAction = snapshot?.ai_action;

  const isPos = (changePct ?? 0) >= 0;
  const scorePercent = aiScore != null ? Math.min(100, Math.max(0, aiScore)) : null;

  const target = price != null ? price * 1.08 : null;
  const stop = price != null ? price * 0.93 : null;

  const catalysts = ['Earnings watch', 'Momentum'];

  function fmtPrice(v: number | null | undefined): string {
    if (v == null) return '—';
    return `$${v.toFixed(2)}`;
  }

  function fmtPct(v: number | null | undefined): string {
    if (v == null) return '—';
    const sign = v >= 0 ? '+' : '';
    return `${sign}${v.toFixed(2)}%`;
  }

  return (
    <div className="wsk-card">
      {/* Header row */}
      <div className="wsk-header">
        <div className="wsk-left">
          <span className="wsk-symbol">{item.symbol}</span>
          {aiAction && (
            <span
              className="wsk-action-badge"
              style={{ color: actionColor(aiAction), background: actionBg(aiAction) }}
            >
              {aiAction}
            </span>
          )}
        </div>
        <div className="wsk-right">
          <span className="wsk-price">{fmtPrice(price)}</span>
          <span className={isPos ? 'wsk-change wsk-pos' : 'wsk-change wsk-neg'}>
            {fmtPct(changePct)}
          </span>
        </div>
      </div>

      {/* AI Confidence bar */}
      {scorePercent != null && (
        <div className="wsk-score-row">
          <span className="wsk-score-label">AI Confidence</span>
          <div className="wsk-score-track">
            <div className="wsk-score-fill" style={{ width: `${scorePercent}%` }} />
          </div>
          <span className="wsk-score-val">{scorePercent.toFixed(0)}</span>
        </div>
      )}

      {/* Expand toggle */}
      <button className="wsk-toggle-btn" onClick={() => setExpanded((v) => !v)}>
        {expanded ? 'Hide AI analysis' : 'Show AI analysis'}
        <span className="wsk-toggle-arrow">{expanded ? '▴' : '▾'}</span>
      </button>

      {/* Expandable drawer */}
      {expanded && (
        <div className="wsk-drawer">
          <div className="wsk-drawer-metrics">
            <div className="wsk-dm">
              <span className="wsk-dm-label">FMV</span>
              <span className="wsk-dm-val">{fmtPrice(fmv)}</span>
            </div>
            <div className="wsk-dm">
              <span className="wsk-dm-label">Target (+8%)</span>
              <span className="wsk-dm-val wsk-green">{fmtPrice(target)}</span>
            </div>
            <div className="wsk-dm">
              <span className="wsk-dm-label">Stop (-7%)</span>
              <span className="wsk-dm-val wsk-red">{fmtPrice(stop)}</span>
            </div>
          </div>
          <div className="wsk-catalysts">
            <span className="wsk-catalyst-label">Catalysts</span>
            <div className="wsk-catalyst-tags">
              {catalysts.map((c) => (
                <span key={c} className="wsk-tag">{c}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer actions */}
      <div className="wsk-footer">
        <button
          className="wsk-btn wsk-btn-ai"
          onClick={() => router.push(`/ai?q=Tell+me+about+${item.symbol}`)}
        >
          Ask AI
        </button>
        <button
          className="wsk-btn wsk-btn-view"
          onClick={() => router.push(`/stock/${item.symbol}`)}
        >
          View Thesis
        </button>
        <button
          className="wsk-btn wsk-btn-remove"
          onClick={() => onRemove(item.id)}
          title="Remove from watchlist"
        >
          &#128465;
        </button>
      </div>

      <style jsx>{`
        .wsk-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: border-color 0.15s;
        }
        .wsk-card:hover {
          border-color: rgba(59,158,255,0.3);
        }
        .wsk-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .wsk-left {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .wsk-symbol {
          font-size: 1rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: 0.02em;
        }
        .wsk-action-badge {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .wsk-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .wsk-price {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .wsk-change {
          font-size: 0.85rem;
          font-weight: 600;
        }
        .wsk-pos { color: #4ade80; }
        .wsk-neg { color: #f87171; }
        .wsk-score-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .wsk-score-label {
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          white-space: nowrap;
          flex-shrink: 0;
          width: 98px;
        }
        .wsk-score-track {
          flex: 1;
          height: 5px;
          border-radius: 3px;
          background: var(--surface-2);
          overflow: hidden;
        }
        .wsk-score-fill {
          height: 100%;
          border-radius: 3px;
          background: linear-gradient(90deg, var(--accent), rgba(59,158,255,0.55));
          transition: width 0.3s ease;
        }
        .wsk-score-val {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--accent);
          flex-shrink: 0;
          width: 28px;
          text-align: right;
        }
        .wsk-toggle-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: none;
          border: none;
          padding: 0;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-muted);
          cursor: pointer;
          transition: color 0.15s;
          width: fit-content;
        }
        .wsk-toggle-btn:hover { color: var(--accent); }
        .wsk-toggle-arrow { font-size: 0.65rem; }
        .wsk-drawer {
          background: rgba(59,158,255,0.04);
          border: 1px solid rgba(59,158,255,0.1);
          border-radius: 8px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .wsk-drawer-metrics {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .wsk-dm {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .wsk-dm-label {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }
        .wsk-dm-val {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .wsk-green { color: #4ade80; }
        .wsk-red { color: #f87171; }
        .wsk-catalysts {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .wsk-catalyst-label {
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          flex-shrink: 0;
        }
        .wsk-catalyst-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .wsk-tag {
          font-size: 0.72rem;
          font-weight: 600;
          padding: 2px 9px;
          border-radius: 12px;
          background: rgba(59,158,255,0.1);
          color: var(--accent);
          border: 1px solid rgba(59,158,255,0.2);
        }
        .wsk-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .wsk-btn {
          border: none;
          border-radius: 7px;
          padding: 6px 14px;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s, background 0.15s;
        }
        .wsk-btn-ai {
          background: rgba(59,158,255,0.12);
          color: var(--accent);
          border: 1px solid rgba(59,158,255,0.25);
        }
        .wsk-btn-ai:hover { background: rgba(59,158,255,0.2); }
        .wsk-btn-view {
          background: var(--surface-2);
          color: var(--text-primary);
          border: 1px solid var(--border);
        }
        .wsk-btn-view:hover { border-color: var(--accent); }
        .wsk-btn-remove {
          background: none;
          color: var(--text-muted);
          border: 1px solid var(--border);
          border-radius: 7px;
          padding: 5px 10px;
          font-size: 0.85rem;
          margin-left: auto;
          transition: color 0.15s, border-color 0.15s;
        }
        .wsk-btn-remove:hover {
          color: #f87171;
          border-color: rgba(248,113,113,0.4);
        }
      `}</style>
    </div>
  );
}
