'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import posthog from 'posthog-js';
import { WatchlistTable } from '../../../components/WatchlistTable';
import { WatchlistSummaryCard } from '../../../components/WatchlistSummaryCard';
import { WatchlistStockCard } from '../../../components/WatchlistStockCard';
import type { Watchlist } from '../../../lib/api/watchlist';
import { createWatchlist, getWatchlists, removeSymbol } from '../../../lib/api/watchlist';
import type { WatchlistSummary } from '../../../lib/api/dashboard';
import { getDashboardOverview } from '../../../lib/api/dashboard';
import type { SnapshotData } from '../../../lib/api/market';
import { getSnapshots } from '../../../lib/api/market';
import { useAuth } from '../../../context/AuthContext';

// Extended snapshot with AI fields
interface ExtendedSnapshot extends SnapshotData {
  volume?: number;
  ai_score?: number;
  ai_action?: string;
}

export default function WatchlistPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [highlights, setHighlights] = useState<WatchlistSummary[]>([]);
  const [snapshots, setSnapshots] = useState<Record<string, ExtendedSnapshot>>({});
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [wl, ov] = await Promise.allSettled([
        getWatchlists(),
        getDashboardOverview(),
      ]);
      const loadedWatchlists = wl.status === 'fulfilled' ? wl.value : [];
      if (wl.status === 'fulfilled') setWatchlists(wl.value);
      if (ov.status === 'fulfilled') setHighlights(ov.value.watchlists);

      // Collect all symbols across all watchlists
      const allSymbols: string[] = [];
      for (const w of loadedWatchlists) {
        for (const item of w.items) {
          if (!allSymbols.includes(item.symbol)) {
            allSymbols.push(item.symbol);
          }
        }
      }

      if (allSymbols.length > 0) {
        try {
          const snaps = await getSnapshots(allSymbols);
          setSnapshots(snaps as Record<string, ExtendedSnapshot>);
        } catch {
          // snapshots are optional — ignore errors
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function handleCreate() {
    if (!user) return;
    setCreating(true);
    try {
      await createWatchlist(user.id, 'My Watchlist');
      posthog.capture('watchlist_created', { name: 'My Watchlist' });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create');
    } finally {
      setCreating(false);
    }
  }

  async function handleRemove(watchlistId: string, itemId: string) {
    try {
      await removeSymbol(watchlistId, itemId);
      await load();
    } catch {
      // ignore
    }
  }

  function computeSummary(wl: Watchlist) {
    const symbols = wl.items.map((i) => i.symbol);
    let strongBuys = 0;
    let watching = 0;
    let scoreSum = 0;
    let scoreCount = 0;

    for (const item of wl.items) {
      const snap = snapshots[item.symbol] as ExtendedSnapshot | undefined;
      if (snap?.ai_action) {
        const a = snap.ai_action.toLowerCase();
        if (a === 'buy' || a === 'strong buy') strongBuys++;
        if (a === 'watch') watching++;
      }
      if (snap?.ai_score != null) {
        scoreSum += snap.ai_score;
        scoreCount++;
      }
    }

    const avgScore = scoreCount > 0 ? scoreSum / scoreCount : 0;
    return { strongBuys, watching, avgScore, symbols };
  }

  // Get top symbols for compare button in header
  const allSymbols = watchlists.flatMap((wl) => wl.items.map((i) => i.symbol));
  const top3 = allSymbols.slice(0, 3);

  const highlightMap = Object.fromEntries(highlights.map((h) => [h.id, h]));

  if (loading) return <PageSkeleton />;

  return (
    <div className="wl-page">
      {error && <p className="wl-error">{error}</p>}

      {watchlists.length === 0 ? (
        <div className="wl-empty-state">
          <p className="wl-empty-title">No watchlists yet</p>
          <p className="wl-empty-sub">Create a watchlist to start tracking symbols with AI analysis.</p>
          <button className="wl-create-btn" onClick={handleCreate} disabled={creating}>
            {creating ? 'Creating…' : 'Create watchlist'}
          </button>
        </div>
      ) : (
        <div className="wl-list">
          <div className="wl-page-header">
            <h2 className="wl-page-title">Your Watchlists</h2>
            <div className="wl-header-actions">
              {top3.length > 0 && (
                <button
                  className="wl-compare-btn"
                  onClick={() => router.push(`/watchlist/compare?symbols=${top3.join(',')}`)}
                >
                  Compare Top 3
                </button>
              )}
              <button className="wl-create-btn-sm" onClick={handleCreate} disabled={creating}>
                {creating ? '…' : '+ New Watchlist'}
              </button>
            </div>
          </div>

          {watchlists.map((wl) => {
            const summary = highlightMap[wl.id];
            const { strongBuys, watching, avgScore, symbols } = computeSummary(wl);

            return (
              <div key={wl.id} className="wl-section">
                <WatchlistSummaryCard
                  strongBuys={strongBuys}
                  watching={watching}
                  avgScore={avgScore}
                  symbols={symbols}
                />

                {/* Stock cards grid */}
                {wl.items.length > 0 && (
                  <div className="wl-stock-grid">
                    {wl.items.map((item) => (
                      <WatchlistStockCard
                        key={item.id}
                        item={item}
                        snapshot={snapshots[item.symbol] as ExtendedSnapshot | undefined}
                        onRemove={(itemId) => handleRemove(wl.id, itemId)}
                        watchlistId={wl.id}
                      />
                    ))}
                  </div>
                )}

                <WatchlistTable
                  watchlist={wl}
                  highlights={summary?.highlights ?? []}
                  onRefresh={load}
                />
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .wl-page { display: flex; flex-direction: column; gap: 28px; }
        .wl-error { color: #f87171; font-size: 0.875rem; }
        .wl-empty-state {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 10px; padding: 80px 24px; text-align: center;
        }
        .wl-empty-title { font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin: 0; }
        .wl-empty-sub { font-size: 0.875rem; color: var(--text-muted); margin: 0; max-width: 340px; }
        .wl-create-btn {
          background: var(--accent); color: #fff; border: none; border-radius: 8px;
          padding: 10px 22px; font-size: 0.875rem; font-weight: 600; cursor: pointer;
          margin-top: 6px; transition: opacity 0.15s;
        }
        .wl-create-btn:disabled { opacity: 0.6; cursor: default; }
        .wl-list { display: flex; flex-direction: column; gap: 24px; }
        .wl-page-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
        .wl-page-title { font-size: 1rem; font-weight: 600; color: var(--text-primary); margin: 0; }
        .wl-header-actions { display: flex; align-items: center; gap: 8px; }
        .wl-compare-btn {
          background: rgba(59,158,255,0.1);
          color: var(--accent);
          border: 1px solid rgba(59,158,255,0.25);
          border-radius: 7px; padding: 7px 14px; font-size: 0.8rem; font-weight: 600;
          cursor: pointer; transition: background 0.15s;
        }
        .wl-compare-btn:hover { background: rgba(59,158,255,0.18); }
        .wl-create-btn-sm {
          background: var(--surface-2); color: var(--text-primary); border: 1px solid var(--border);
          border-radius: 7px; padding: 7px 14px; font-size: 0.8rem; font-weight: 600; cursor: pointer;
          transition: border-color 0.15s;
        }
        .wl-create-btn-sm:hover { border-color: var(--accent); }
        .wl-section {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 12px; padding: 20px 24px;
          display: flex; flex-direction: column; gap: 20px;
        }
        .wl-stock-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 12px;
        }
      `}</style>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="skel">
      <div className="skel-card" style={{ height: 200 }} />
      <style jsx>{`
        .skel { display: flex; flex-direction: column; gap: 14px; }
        .skel-card {
          border-radius: 12px; background: var(--surface); border: 1px solid var(--border);
          animation: shimmer 1.5s ease-in-out infinite;
        }
        @keyframes shimmer { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
      `}</style>
    </div>
  );
}
