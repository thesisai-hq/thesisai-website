'use client';

import { useState } from 'react';
import type { Watchlist } from '../lib/api/watchlist';
import { addSymbol, removeSymbol } from '../lib/api/watchlist';
import type { WatchlistHighlight } from '../lib/api/dashboard';

interface WatchlistTableProps {
  watchlist: Watchlist;
  highlights: WatchlistHighlight[];
  onRefresh: () => void;
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

type Sentiment = string | null | undefined;

function sentimentColor(sentiment: Sentiment): string {
  if (!sentiment) return 'rgba(103,129,156,0.26)';
  if (sentiment === 'very_bullish' || sentiment === 'bullish') return '#4ade80';
  if (sentiment === 'neutral') return '#fbbf24';
  if (sentiment === 'bearish' || sentiment === 'very_bearish') return '#f87171';
  return 'rgba(103,129,156,0.26)';
}

export function WatchlistTable({ watchlist, highlights, onRefresh }: WatchlistTableProps) {
  const [newSymbol, setNewSymbol] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSymbol, setExpandedSymbol] = useState<string | null>(null);

  const highlightMap = Object.fromEntries(highlights.map((h) => [h.symbol, h]));

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const sym = newSymbol.trim().toUpperCase();
    if (!sym) return;
    setAdding(true);
    setError(null);
    try {
      await addSymbol(watchlist.id, sym);
      setNewSymbol('');
      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add symbol');
    } finally {
      setAdding(false);
    }
  }

  async function handleRemove(itemId: string) {
    try {
      await removeSymbol(watchlist.id, itemId);
      onRefresh();
    } catch {
      // ignore
    }
  }

  function toggleExpand(symbol: string, hasContent: boolean) {
    if (!hasContent) return;
    setExpandedSymbol((prev) => (prev === symbol ? null : symbol));
  }

  return (
    <div className="wl-container">
      <div className="wl-header">
        <h2 className="wl-name">{watchlist.name}</h2>
        <form className="wl-add-form" onSubmit={handleAdd}>
          <input
            className="wl-input"
            type="text"
            placeholder="Add symbol (e.g. AAPL)"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            maxLength={10}
          />
          <button className="wl-add-btn" type="submit" disabled={adding}>
            {adding ? '…' : 'Add'}
          </button>
        </form>
      </div>
      {error && <p className="wl-error">{error}</p>}

      <div className="wl-table-wrap">
        <table className="wl-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Price</th>
              <th>Change</th>
              <th>AI Score</th>
              <th>Action</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {watchlist.items.length === 0 ? (
              <tr>
                <td colSpan={6} className="wl-empty">No symbols yet. Add one above.</td>
              </tr>
            ) : (
              watchlist.items.map((item) => {
                const h = highlightMap[item.symbol];
                const isPos = (h?.change_percent ?? 0) >= 0;
                const dotColor = sentimentColor(h?.sentiment);
                const hasExpandable = !!(h?.ai_reason || h?.note);
                const isExpanded = expandedSymbol === item.symbol;

                return (
                  <>
                    <tr
                      key={item.id}
                      className={hasExpandable ? 'wl-row-expandable' : ''}
                      onClick={() => toggleExpand(item.symbol, hasExpandable)}
                    >
                      <td className="wl-symbol">
                        <span className="wl-dot" style={{ background: dotColor }} />
                        {item.symbol}
                        {hasExpandable && (
                          <span className="wl-chevron">{isExpanded ? '▴' : '▾'}</span>
                        )}
                      </td>
                      <td className="wl-price">{h?.price != null ? `$${fmt(h.price)}` : '—'}</td>
                      <td className={isPos ? 'positive' : 'negative'}>{pct(h?.change_percent ?? null)}</td>
                      <td className="wl-score">
                        {h?.ai_score != null ? (
                          <span className="score-badge">{h.ai_score}</span>
                        ) : '—'}
                      </td>
                      <td className="wl-action">
                        {h?.ai_action ? (
                          <span className={`action-badge action-${h.ai_action.toLowerCase().replace(/\s+/g, '-')}`}>
                            {h.ai_action}
                          </span>
                        ) : '—'}
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <button
                          className="wl-remove"
                          onClick={() => handleRemove(item.id)}
                          title="Remove"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                    {isExpanded && hasExpandable && (
                      <tr key={`${item.id}-expand`} className="wl-expand-row">
                        <td colSpan={6}>
                          <div className="wl-expand-content">
                            {h?.ai_reason && <p className="wl-expand-reason">{h.ai_reason}</p>}
                            {h?.note && <p className="wl-expand-note">{h.note}</p>}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .wl-container { display: flex; flex-direction: column; gap: 16px; }
        .wl-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .wl-name { font-size: 1rem; font-weight: 600; color: var(--text-primary); margin: 0; }
        .wl-add-form { display: flex; gap: 8px; }
        .wl-input {
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 7px;
          padding: 7px 12px;
          font-size: 0.825rem;
          color: var(--text-primary);
          outline: none;
          width: 180px;
        }
        .wl-input:focus { border-color: var(--accent); }
        .wl-add-btn {
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 7px;
          padding: 7px 16px;
          font-size: 0.825rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .wl-add-btn:disabled { opacity: 0.6; cursor: default; }
        .wl-error { color: #f87171; font-size: 0.8rem; margin: 0; }
        .wl-table-wrap { overflow-x: auto; }
        .wl-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }
        .wl-table th {
          text-align: left;
          padding: 10px 14px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border);
        }
        .wl-table td {
          padding: 12px 14px;
          border-bottom: 1px solid var(--border);
          color: var(--text-muted);
          vertical-align: middle;
        }
        .wl-row-expandable { cursor: pointer; }
        .wl-row-expandable:hover td { background: var(--surface-2); }
        .wl-table tr:not(.wl-row-expandable):not(.wl-expand-row):hover td { background: var(--surface-2); }
        .wl-symbol {
          font-weight: 700;
          color: var(--text-primary) !important;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .wl-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .wl-chevron {
          font-size: 0.65rem;
          color: var(--text-muted);
          margin-left: 2px;
        }
        .wl-price { color: var(--text-primary) !important; }
        .positive { color: #4ade80 !important; font-weight: 600; }
        .negative { color: #f87171 !important; font-weight: 600; }
        .score-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          background: rgba(59,158,255,0.12);
          color: var(--accent);
          font-weight: 700;
          font-size: 0.8rem;
        }
        .action-badge {
          display: inline-block;
          padding: 2px 9px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .action-buy { background: rgba(74,222,128,0.15); color: #4ade80; }
        .action-strong-buy { background: rgba(74,222,128,0.22); color: #4ade80; }
        .action-hold { background: rgba(251,191,36,0.15); color: #fbbf24; }
        .action-watch { background: rgba(139,163,190,0.15); color: var(--text-muted); }
        .wl-expand-row td { padding: 0; border-bottom: 1px solid var(--border); }
        .wl-expand-content {
          padding: 10px 14px 14px 36px;
          background: rgba(59,158,255,0.04);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .wl-expand-reason {
          font-size: 0.825rem;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.5;
        }
        .wl-expand-note {
          font-size: 0.775rem;
          color: var(--text-muted);
          font-style: italic;
          margin: 0;
          line-height: 1.4;
        }
        .wl-remove {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1.1rem;
          cursor: pointer;
          padding: 0 4px;
          line-height: 1;
          border-radius: 4px;
          transition: color 0.15s;
        }
        .wl-remove:hover { color: #f87171; }
        .wl-empty { text-align: center; color: var(--text-muted); padding: 24px; }
      `}</style>
    </div>
  );
}
