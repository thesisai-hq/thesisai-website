'use client';

import { useState } from 'react';
import type { AiThesisCard } from '../lib/api/ai';
import type { SnapshotData } from '../lib/api/market';

interface ResearchFeedProps {
  cards: AiThesisCard[];
  snapshots: Record<string, SnapshotData>;
  loading?: boolean;
}

const INITIAL_COUNT = 6;

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function ResearchFeed({ cards, snapshots, loading }: ResearchFeedProps) {
  const [showAll, setShowAll] = useState(false);

  if (loading) {
    return (
      <div className="rf-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rf-skel" />
        ))}
        <style jsx>{`
          .rf-grid { display: flex; flex-direction: column; gap: 12px; }
          .rf-skel {
            height: 100px;
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
      <div className="rf-empty">
        <p>No research available yet.</p>
        <style jsx>{`
          .rf-empty {
            padding: 32px;
            text-align: center;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            color: var(--text-muted);
            font-size: 0.88rem;
          }
          .rf-empty p { margin: 0; }
        `}</style>
      </div>
    );
  }

  const visible = showAll ? cards : cards.slice(0, INITIAL_COUNT);

  return (
    <div className="rf-wrap">
      <div className="rf-list">
        {visible.map((card) => {
          const snap = snapshots[card.symbol];
          const price = snap?.price ?? card.price;
          const change = snap?.change_percent ?? card.change_percent;
          const isUp = change != null && change >= 0;
          const signalType = card.signals[0] ?? 'Fundamental';
          const ago = card.generated_at ? timeAgo(card.generated_at) : 'Just now';
          const aiQuery = encodeURIComponent(`${card.symbol} thesis`);

          return (
            <div key={card.symbol} className="rf-card">
              <div className="rf-top">
                <div className="rf-symbol-group">
                  <span className="rf-symbol">{card.symbol}</span>
                  {price != null && (
                    <span className="rf-price">${price.toFixed(2)}</span>
                  )}
                  {change != null && (
                    <span className={`rf-change ${isUp ? 'pos' : 'neg'}`}>
                      {isUp ? '+' : ''}{change.toFixed(2)}%
                    </span>
                  )}
                </div>
                <div className="rf-meta">
                  <span className="rf-signal-type">{signalType}</span>
                  <span className="rf-ago">{ago}</span>
                </div>
              </div>

              <p className="rf-summary">{card.summary.slice(0, 140)}{card.summary.length > 140 ? '…' : ''}</p>

              {card.signals.length > 0 && (
                <div className="rf-signals">
                  {card.signals.slice(0, 3).map((s, i) => (
                    <span key={i} className="rf-sig">{s}</span>
                  ))}
                </div>
              )}

              <div className="rf-actions">
                <a href={`/stock/${card.symbol}`} className="rf-link rf-link-primary">
                  Open Thesis →
                </a>
                <a href={`/ai?q=${aiQuery}`} className="rf-link rf-link-ghost">
                  Ask AI →
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {cards.length > INITIAL_COUNT && (
        <button className="rf-more-btn" onClick={() => setShowAll((v) => !v)}>
          {showAll ? 'Show less' : `Load ${cards.length - INITIAL_COUNT} more`}
        </button>
      )}

      <style jsx>{`
        .rf-wrap { display: flex; flex-direction: column; gap: 14px; }
        .rf-list { display: flex; flex-direction: column; gap: 10px; }
        .rf-card {
          padding: 16px 18px;
          border-radius: 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: border-color 200ms ease;
        }
        .rf-card:hover { border-color: rgba(59,158,255,0.25); }
        .rf-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .rf-symbol-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .rf-symbol {
          font-size: 0.88rem;
          font-weight: 800;
          color: var(--accent);
          background: rgba(59,158,255,0.08);
          padding: 2px 8px;
          border-radius: 5px;
          border: 1px solid rgba(59,158,255,0.18);
        }
        .rf-price {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .rf-change {
          font-size: 0.8rem;
          font-weight: 600;
        }
        .pos { color: #4ade80; }
        .neg { color: #f87171; }
        .rf-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .rf-signal-type {
          font-size: 0.68rem;
          font-weight: 600;
          color: var(--text-muted);
          background: rgba(148,163,184,0.07);
          border: 1px solid var(--border);
          padding: 2px 8px;
          border-radius: 4px;
        }
        .rf-ago {
          font-size: 0.68rem;
          color: var(--text-muted);
        }
        .rf-summary {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.5;
        }
        .rf-signals { display: flex; flex-wrap: wrap; gap: 5px; }
        .rf-sig {
          font-size: 0.66rem;
          padding: 2px 8px;
          border-radius: 4px;
          background: rgba(148,163,184,0.07);
          border: 1px solid rgba(148,163,184,0.18);
          color: var(--text-muted);
        }
        .rf-actions { display: flex; gap: 8px; }
        .rf-link {
          font-size: 0.73rem;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 7px;
          text-decoration: none;
          transition: opacity 150ms;
        }
        .rf-link:hover { opacity: 0.8; }
        .rf-link-primary {
          background: linear-gradient(120deg, #1a72d4, #3b9eff);
          color: #fff;
        }
        .rf-link-ghost {
          background: rgba(59,158,255,0.08);
          color: var(--accent);
          border: 1px solid rgba(59,158,255,0.2);
        }
        .rf-more-btn {
          align-self: center;
          padding: 8px 24px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text-muted);
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: border-color 150ms, color 150ms;
          font-family: inherit;
        }
        .rf-more-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
        }
      `}</style>
    </div>
  );
}
