'use client';

import { useEffect, useState } from 'react';
import type { SnapshotData } from '../lib/api/market';
import { getSnapshots } from '../lib/api/market';

interface MarketTickerBarProps {
  symbols: string[];
}

function isMarketOpen(): boolean {
  const now = new Date();
  const et = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const day = et.getDay();
  if (day === 0 || day === 6) return false;
  const totalMin = et.getHours() * 60 + et.getMinutes();
  return totalMin >= 9 * 60 + 30 && totalMin < 16 * 60;
}

function getEtTime(): string {
  return new Date().toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function MarketTickerBar({ symbols }: MarketTickerBarProps) {
  const [snaps, setSnaps] = useState<Record<string, SnapshotData>>({});
  const [marketOpen, setMarketOpen] = useState(false);
  const [etTime, setEtTime] = useState('');
  const symKey = symbols.join(',');

  useEffect(() => {
    setMarketOpen(isMarketOpen());
    setEtTime(getEtTime());

    async function fetchSnaps() {
      if (symbols.length === 0) return;
      try {
        const data = await getSnapshots(symbols);
        setSnaps(data);
      } catch {
        // prices are best-effort — silent fail
      }
    }

    void fetchSnaps();

    const interval = setInterval(() => {
      setMarketOpen(isMarketOpen());
      setEtTime(getEtTime());
      void fetchSnaps();
    }, 30000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symKey]);

  return (
    <div className="ticker-bar">
      <div className="ticker-status">
        <span className={`ticker-dot ${marketOpen ? 'open' : 'closed'}`} />
        <span className="ticker-label">{marketOpen ? 'Market Open' : 'Market Closed'}</span>
        <span className="ticker-time">{etTime} ET</span>
      </div>
      <div className="ticker-chips">
        {symbols.map((sym) => {
          const snap = snaps[sym];
          const change = snap?.change_percent ?? null;
          const isUp = change !== null && change >= 0;
          return (
            <div key={sym} className="ticker-chip">
              <span className="ticker-sym">{sym}</span>
              {snap ? (
                <>
                  <span className="ticker-price">${snap.price.toFixed(2)}</span>
                  <span className={`ticker-change ${isUp ? 'up' : 'down'}`}>
                    {isUp ? '+' : ''}{change!.toFixed(2)}%
                  </span>
                </>
              ) : (
                <span className="ticker-dash">—</span>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .ticker-bar {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 10px 16px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow-x: auto;
        }
        .ticker-bar::-webkit-scrollbar { display: none; }
        .ticker-status {
          display: flex;
          align-items: center;
          gap: 7px;
          flex-shrink: 0;
        }
        .ticker-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .ticker-dot.open { background: #4ade80; box-shadow: 0 0 8px rgba(74,222,128,0.6); }
        .ticker-dot.closed { background: var(--text-muted); }
        .ticker-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          white-space: nowrap;
        }
        .ticker-time {
          font-size: 0.7rem;
          color: var(--text-muted);
          white-space: nowrap;
        }
        .ticker-chips {
          display: flex;
          gap: 10px;
          flex-wrap: nowrap;
        }
        .ticker-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
          padding: 4px 10px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 6px;
        }
        .ticker-sym {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .ticker-price {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .ticker-change {
          font-size: 0.75rem;
          font-weight: 600;
        }
        .up { color: #4ade80; }
        .down { color: #f87171; }
        .ticker-dash { font-size: 0.78rem; color: var(--text-muted); }
      `}</style>
    </div>
  );
}
