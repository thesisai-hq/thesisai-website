'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { TodayMove } from '../lib/api/dashboard';

// Extended TodayMove with optional fields the API may return
interface ExtendedTodayMove extends TodayMove {
  action?: 'buy' | 'hold' | 'watch' | 'sell';
  target_price?: number | null;
  stop_loss?: number | null;
  fmv?: number | null;
  drivers?: string[];
  risks?: string[];
}

interface EnhancedMoveCardProps {
  move: ExtendedTodayMove;
}

function fmt(v: number | null | undefined, digits = 2): string {
  if (v == null) return '—';
  return v.toFixed(digits);
}

function pct(v: number | null | undefined): string {
  if (v == null) return '—';
  const sign = v >= 0 ? '+' : '';
  return `${sign}${v.toFixed(2)}%`;
}

const ACTION_COLORS: Record<string, string> = {
  buy: '#4ade80',
  hold: '#fbbf24',
  watch: '#60c7ff',
  sell: '#f87171',
};

const ACTION_BG: Record<string, string> = {
  buy: 'rgba(74,222,128,0.12)',
  hold: 'rgba(251,191,36,0.12)',
  watch: 'rgba(96,199,255,0.12)',
  sell: 'rgba(248,113,113,0.12)',
};

export function EnhancedMoveCard({ move }: EnhancedMoveCardProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const confidence = Math.round(move.confidence * 100);
  const isPositive = (move.change_percent ?? 0) >= 0;
  const action = move.action;
  const actionColor = action ? ACTION_COLORS[action] : 'var(--accent)';
  const actionBg = action ? ACTION_BG[action] : 'rgba(59,158,255,0.12)';

  const hasPriceRow =
    move.target_price != null || move.stop_loss != null || move.fmv != null;
  const hasDetails =
    (move.drivers && move.drivers.length > 0) ||
    (move.risks && move.risks.length > 0);

  const aiQuery = encodeURIComponent(`Tell me about ${move.ticker}`);

  return (
    <div className="emc">
      {/* Top row */}
      <div className="emc-top">
        <div className="emc-ticker-group">
          <span className="emc-ticker">{move.ticker}</span>
          {action && (
            <span
              className="emc-action-badge"
              style={{ color: actionColor, background: actionBg }}
            >
              {action.toUpperCase()}
            </span>
          )}
        </div>
        <div className="emc-price-group">
          {move.price != null && (
            <span className="emc-price">${fmt(move.price)}</span>
          )}
          <span className={`emc-change ${isPositive ? 'positive' : 'negative'}`}>
            {pct(move.change_percent)}
          </span>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="emc-conf-wrap">
        <div className="emc-conf-bar">
          <div
            className="emc-conf-fill"
            style={{ width: `${confidence}%` }}
          />
        </div>
        <span className="emc-conf-label">{confidence}% confidence</span>
      </div>

      {/* Title + why */}
      <div className="emc-body">
        <h4 className="emc-title">{move.title}</h4>
        <p className="emc-why">{move.why}</p>
      </div>

      {/* Target / Stop / FMV */}
      {hasPriceRow && (
        <div className="emc-prices-row">
          {move.target_price != null && (
            <div className="emc-price-item">
              <span className="emc-price-label">Target</span>
              <span className="emc-price-val" style={{ color: '#4ade80' }}>
                ${fmt(move.target_price)}
              </span>
            </div>
          )}
          {move.stop_loss != null && (
            <div className="emc-price-item">
              <span className="emc-price-label">Stop</span>
              <span className="emc-price-val" style={{ color: '#f87171' }}>
                ${fmt(move.stop_loss)}
              </span>
            </div>
          )}
          {move.fmv != null && (
            <div className="emc-price-item">
              <span className="emc-price-label">FMV</span>
              <span className="emc-price-val">${fmt(move.fmv)}</span>
            </div>
          )}
        </div>
      )}

      {/* Signals */}
      {move.signals.length > 0 && (
        <div className="emc-signals">
          {move.signals.map((s, i) => (
            <span key={i} className="emc-signal">{s}</span>
          ))}
        </div>
      )}

      {/* Expandable details */}
      {hasDetails && (
        <div className="emc-expand-section">
          <button
            className="emc-expand-btn"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? 'Hide details' : 'Show details'}
            <span className="emc-expand-arrow">{expanded ? '▲' : '▼'}</span>
          </button>
          {expanded && (
            <div className="emc-details">
              {move.drivers && move.drivers.length > 0 && (
                <div className="emc-detail-group">
                  <span className="emc-detail-heading" style={{ color: '#4ade80' }}>Drivers</span>
                  <ul className="emc-detail-list">
                    {move.drivers.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
              {move.risks && move.risks.length > 0 && (
                <div className="emc-detail-group">
                  <span className="emc-detail-heading" style={{ color: '#f87171' }}>Risks</span>
                  <ul className="emc-detail-list">
                    {move.risks.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* CTA buttons */}
      <div className="emc-ctas">
        <button
          className="emc-cta emc-cta-primary"
          onClick={() => router.push(`/stock/${move.ticker}`)}
        >
          View Thesis
        </button>
        <button
          className="emc-cta emc-cta-secondary"
          onClick={() => router.push(`/ai?q=${aiQuery}`)}
        >
          Ask AI
        </button>
        <button className="emc-cta emc-cta-ghost" onClick={() => {}}>
          + Watchlist
        </button>
      </div>

      <style jsx>{`
        .emc {
          padding: 18px 20px;
          border-radius: 14px;
          background: var(--surface);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: border-color 200ms ease, box-shadow 200ms ease;
        }
        .emc:hover {
          border-color: rgba(59, 158, 255, 0.25);
          box-shadow: 0 0 28px -12px rgba(59, 158, 255, 0.18);
        }
        .emc-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .emc-ticker-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .emc-ticker {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: 0.02em;
        }
        .emc-action-badge {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          padding: 2px 8px;
          border-radius: 999px;
          border: 1px solid currentColor;
        }
        .emc-price-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .emc-price {
          font-size: 0.88rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .emc-change {
          font-size: 0.82rem;
          font-weight: 700;
        }
        .positive { color: #4ade80; }
        .negative { color: #f87171; }
        .emc-conf-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .emc-conf-bar {
          flex: 1;
          height: 3px;
          border-radius: 2px;
          background: rgba(148,163,184,0.14);
          overflow: hidden;
        }
        .emc-conf-fill {
          height: 100%;
          border-radius: 2px;
          background: var(--accent);
        }
        .emc-conf-label {
          font-size: 0.68rem;
          color: var(--text-muted);
          flex-shrink: 0;
        }
        .emc-body { display: flex; flex-direction: column; gap: 6px; }
        .emc-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.4;
        }
        .emc-why {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.5;
        }
        .emc-prices-row {
          display: flex;
          gap: 16px;
          padding: 10px 12px;
          background: var(--surface-2);
          border-radius: 8px;
          border: 1px solid var(--border);
        }
        .emc-price-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .emc-price-label {
          font-size: 0.62rem;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--text-muted);
        }
        .emc-price-val {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .emc-signals {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }
        .emc-signal {
          font-size: 0.68rem;
          padding: 2px 8px;
          border-radius: 4px;
          background: var(--surface-2);
          color: var(--text-muted);
          border: 1px solid var(--border);
        }
        .emc-expand-section { display: flex; flex-direction: column; gap: 10px; }
        .emc-expand-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.75rem;
          color: var(--accent);
          font-weight: 600;
          padding: 0;
        }
        .emc-expand-btn:hover { opacity: 0.75; }
        .emc-expand-arrow { font-size: 0.6rem; }
        .emc-details {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 12px;
          background: var(--surface-2);
          border-radius: 8px;
          border: 1px solid var(--border);
        }
        .emc-detail-group { display: flex; flex-direction: column; gap: 5px; }
        .emc-detail-heading {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }
        .emc-detail-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .emc-detail-list li {
          font-size: 0.76rem;
          color: var(--text-muted);
          padding-left: 12px;
          position: relative;
          line-height: 1.4;
        }
        .emc-detail-list li::before {
          content: '·';
          position: absolute;
          left: 0;
          color: var(--text-muted);
          font-size: 1rem;
          line-height: 1.1;
        }
        .emc-ctas {
          display: flex;
          gap: 8px;
          padding-top: 4px;
          border-top: 1px solid var(--border);
        }
        .emc-cta {
          flex: 1;
          padding: 7px 10px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: opacity 150ms ease, transform 100ms ease;
        }
        .emc-cta:hover { opacity: 0.85; transform: translateY(-1px); }
        .emc-cta:active { transform: translateY(0); }
        .emc-cta-primary {
          background: linear-gradient(120deg, #1a72d4, #3b9eff);
          color: #fff;
        }
        .emc-cta-secondary {
          background: rgba(59, 158, 255, 0.1);
          color: var(--accent);
          border: 1px solid rgba(59, 158, 255, 0.25);
        }
        .emc-cta-ghost {
          background: var(--surface-2);
          color: var(--text-muted);
          border: 1px solid var(--border);
        }
      `}</style>
    </div>
  );
}
