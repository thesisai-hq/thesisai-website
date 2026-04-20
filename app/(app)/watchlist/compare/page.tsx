'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { SnapshotData } from '../../../../lib/api/market';
import { getSnapshots } from '../../../../lib/api/market';
import type { AiThesisCard } from '../../../../lib/api/ai';
import { getAiThesisCards } from '../../../../lib/api/ai';

interface ExtendedSnapshot extends SnapshotData {
  ai_score?: number;
  ai_action?: string;
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

function fmtPrice(v: number | null | undefined): string {
  if (v == null) return '—';
  return `$${v.toFixed(2)}`;
}

function fmtPct(v: number | null | undefined): string {
  if (v == null) return '—';
  const sign = v >= 0 ? '+' : '';
  return `${sign}${v.toFixed(2)}%`;
}

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const symbolsParam = searchParams.get('symbols') ?? '';
  const symbols = symbolsParam
    .split(',')
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean)
    .slice(0, 3);

  const [snapshots, setSnapshots] = useState<Record<string, ExtendedSnapshot>>({});
  const [thesisCards, setThesisCards] = useState<Record<string, AiThesisCard>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (symbols.length === 0) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const [snapsResult, thesisResult] = await Promise.allSettled([
          getSnapshots(symbols),
          getAiThesisCards(symbols),
        ]);

        if (snapsResult.status === 'fulfilled') {
          setSnapshots(snapsResult.value as Record<string, ExtendedSnapshot>);
        }
        if (thesisResult.status === 'fulfilled') {
          const cardMap: Record<string, AiThesisCard> = {};
          for (const card of thesisResult.value.cards) {
            cardMap[card.symbol] = card;
          }
          setThesisCards(cardMap);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load comparison data');
      } finally {
        setLoading(false);
      }
    }

    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbolsParam]);

  if (loading) {
    return (
      <div className="cmp-loading">
        <div className="cmp-spinner" />
        <style jsx>{`
          .cmp-loading {
            display: flex; align-items: center; justify-content: center;
            padding: 80px; color: var(--text-muted); font-size: 0.875rem;
          }
          .cmp-spinner {
            width: 28px; height: 28px; border-radius: 50%;
            border: 2px solid var(--border); border-top-color: var(--accent);
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="cmp-page">
      <div className="cmp-header">
        <button className="cmp-back-btn" onClick={() => router.push('/watchlist')}>
          &#8592; Back to Watchlist
        </button>
        <h1 className="cmp-title">Symbol Comparison</h1>
      </div>

      {error && <p className="cmp-error">{error}</p>}

      {symbols.length === 0 ? (
        <div className="cmp-empty">
          <p>No symbols provided. Return to your watchlist and try again.</p>
        </div>
      ) : (
        <div className="cmp-grid" style={{ gridTemplateColumns: `repeat(${symbols.length}, 1fr)` }}>
          {symbols.map((symbol) => {
            const snap = snapshots[symbol] as ExtendedSnapshot | undefined;
            const card = thesisCards[symbol];
            const isPos = (snap?.change_percent ?? 0) >= 0;
            const target = snap?.price != null ? snap.price * 1.08 : null;
            const stop = snap?.price != null ? snap.price * 0.93 : null;
            const scorePercent = snap?.ai_score != null ? Math.min(100, Math.max(0, snap.ai_score)) : null;
            const topSignals = card?.signals?.slice(0, 3) ?? [];

            return (
              <div key={symbol} className="cmp-col">
                {/* Symbol header */}
                <div className="cmp-col-header">
                  <span className="cmp-symbol">{symbol}</span>
                  {snap?.ai_action && (
                    <span
                      className="cmp-action-badge"
                      style={{
                        color: actionColor(snap.ai_action),
                        background: actionBg(snap.ai_action),
                      }}
                    >
                      {snap.ai_action}
                    </span>
                  )}
                </div>

                {/* Price & change */}
                <div className="cmp-section">
                  <div className="cmp-metric">
                    <span className="cmp-metric-label">Price</span>
                    <span className="cmp-metric-val">{fmtPrice(snap?.price)}</span>
                  </div>
                  <div className="cmp-metric">
                    <span className="cmp-metric-label">Change</span>
                    <span className={`cmp-metric-val ${isPos ? 'cmp-pos' : 'cmp-neg'}`}>
                      {fmtPct(snap?.change_percent)}
                    </span>
                  </div>
                </div>

                {/* AI Score */}
                {scorePercent != null && (
                  <div className="cmp-section">
                    <span className="cmp-section-title">AI Score</span>
                    <div className="cmp-score-row">
                      <div className="cmp-score-track">
                        <div className="cmp-score-fill" style={{ width: `${scorePercent}%` }} />
                      </div>
                      <span className="cmp-score-val">{scorePercent.toFixed(0)}</span>
                    </div>
                  </div>
                )}

                {/* FMV / Target / Stop */}
                <div className="cmp-section">
                  <span className="cmp-section-title">Key Levels</span>
                  <div className="cmp-levels">
                    <div className="cmp-level">
                      <span className="cmp-level-label">FMV</span>
                      <span className="cmp-level-val">{fmtPrice(snap?.fmv)}</span>
                    </div>
                    <div className="cmp-level">
                      <span className="cmp-level-label">Target</span>
                      <span className="cmp-level-val cmp-green">{fmtPrice(target)}</span>
                    </div>
                    <div className="cmp-level">
                      <span className="cmp-level-label">Stop</span>
                      <span className="cmp-level-val cmp-red">{fmtPrice(stop)}</span>
                    </div>
                  </div>
                </div>

                {/* AI signals */}
                {topSignals.length > 0 && (
                  <div className="cmp-section">
                    <span className="cmp-section-title">Top AI Signals</span>
                    <ul className="cmp-signals">
                      {topSignals.map((sig, idx) => (
                        <li key={idx} className="cmp-signal-item">{sig}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Thesis headline */}
                {card?.headline && (
                  <div className="cmp-section">
                    <span className="cmp-section-title">Thesis</span>
                    <p className="cmp-thesis-text">{card.headline}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .cmp-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .cmp-header {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .cmp-back-btn {
          background: var(--surface-2);
          color: var(--text-muted);
          border: 1px solid var(--border);
          border-radius: 7px;
          padding: 7px 14px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.15s, border-color 0.15s;
          white-space: nowrap;
        }
        .cmp-back-btn:hover {
          color: var(--text-primary);
          border-color: var(--accent);
        }
        .cmp-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }
        .cmp-error {
          color: #f87171;
          font-size: 0.875rem;
          margin: 0;
        }
        .cmp-empty {
          text-align: center;
          padding: 60px 24px;
          color: var(--text-muted);
          font-size: 0.875rem;
        }
        .cmp-grid {
          display: grid;
          gap: 16px;
          align-items: start;
        }
        .cmp-col {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .cmp-col-header {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border);
        }
        .cmp-symbol {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: 0.03em;
        }
        .cmp-action-badge {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .cmp-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .cmp-section-title {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted);
        }
        .cmp-metric {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .cmp-metric-label {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .cmp-metric-val {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .cmp-pos { color: #4ade80; }
        .cmp-neg { color: #f87171; }
        .cmp-score-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .cmp-score-track {
          flex: 1;
          height: 6px;
          border-radius: 3px;
          background: var(--surface-2);
          overflow: hidden;
        }
        .cmp-score-fill {
          height: 100%;
          border-radius: 3px;
          background: linear-gradient(90deg, var(--accent), rgba(59,158,255,0.5));
        }
        .cmp-score-val {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--accent);
          flex-shrink: 0;
          width: 26px;
          text-align: right;
        }
        .cmp-levels {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .cmp-level {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .cmp-level-label {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .cmp-level-val {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .cmp-green { color: #4ade80; }
        .cmp-red { color: #f87171; }
        .cmp-signals {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .cmp-signal-item {
          font-size: 0.8rem;
          color: var(--text-muted);
          padding-left: 12px;
          position: relative;
          line-height: 1.4;
        }
        .cmp-signal-item::before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--accent);
        }
        .cmp-thesis-text {
          font-size: 0.82rem;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}

export default function WatchlistComparePage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        Loading...
      </div>
    }>
      <CompareContent />
    </Suspense>
  );
}
