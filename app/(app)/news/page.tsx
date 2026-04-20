'use client';

import { useEffect, useState } from 'react';
import { NewsItem } from '../../../components/NewsItem';
import type { NewsFeedItem, NewsFeedResponse } from '../../../lib/api/news';
import { getNewsFeed } from '../../../lib/api/news';
import { getWatchlists } from '../../../lib/api/watchlist';

const FALLBACK_SYMBOLS = ['', 'AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'GOOGL', 'META'];

type NewsTab = 'foryou' | 'market' | 'earnings' | 'macro';

const TAB_CONFIG: { id: NewsTab; label: string; brief: string }[] = [
  { id: 'foryou', label: 'For You', brief: 'Personalized news based on your watchlist' },
  { id: 'market', label: 'Market', brief: 'Broad market news and sector analysis' },
  { id: 'earnings', label: 'Earnings', brief: 'Earnings reports, estimates, and surprises' },
  { id: 'macro', label: 'Macro', brief: 'Economic indicators and Fed commentary' },
];

export default function NewsPage() {
  const [items, setItems] = useState<NewsFeedItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState<NewsTab>('foryou');
  const [error, setError] = useState<string | null>(null);
  const [symbolOptions, setSymbolOptions] = useState<string[]>(FALLBACK_SYMBOLS);

  // Load watchlist symbols on mount for dynamic filter chips
  useEffect(() => {
    getWatchlists()
      .then((wls) => {
        const syms = wls[0]?.items.map((i) => i.symbol) ?? [];
        if (syms.length > 0) {
          setSymbolOptions(['', ...syms]);
        }
      })
      .catch(() => {
        // silently keep fallback symbols
      });
  }, []);

  async function load(symbols?: string, cursor?: string) {
    try {
      const res: NewsFeedResponse = await getNewsFeed(symbols || undefined, cursor);
      if (cursor) {
        setItems((prev) => [...prev, ...res.items]);
      } else {
        setItems(res.items);
      }
      setNextCursor(res.next_cursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load news');
    }
  }

  useEffect(() => {
    setLoading(true);
    setError(null);
    if (activeTab === 'foryou') {
      load(filter || undefined).finally(() => setLoading(false));
    } else {
      // For non-"For You" tabs, load all news (no symbol filter)
      load(undefined).finally(() => setLoading(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, activeTab]);

  function handleTabChange(tab: NewsTab) {
    setActiveTab(tab);
    setFilter('');
    setError(null);
    setItems([]);
    setNextCursor(null);
  }

  async function handleLoadMore() {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    const sym = activeTab === 'foryou' ? (filter || undefined) : undefined;
    await load(sym, nextCursor);
    setLoadingMore(false);
  }

  const activeTabConfig = TAB_CONFIG.find((t) => t.id === activeTab) ?? TAB_CONFIG[0];

  return (
    <div className="news-page">
      {/* Category Tabs */}
      <div className="news-tabs">
        {TAB_CONFIG.map((tab) => (
          <button
            key={tab.id}
            className={`news-tab-btn${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* AI Brief */}
      <p className="news-brief">{activeTabConfig.brief}</p>

      {/* Symbol filter chips — only visible on "For You" tab */}
      {activeTab === 'foryou' && (
        <div className="news-header">
          <div className="news-filters">
            {symbolOptions.map((sym) => (
              <button
                key={sym}
                className={`news-filter-btn${filter === sym ? ' active' : ''}`}
                onClick={() => { setFilter(sym); setError(null); }}
              >
                {sym || 'All'}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="news-error">{error}</p>}

      {loading ? (
        <PageSkeleton />
      ) : items.length === 0 ? (
        <p className="news-empty">No news available right now.</p>
      ) : (
        <div className="news-list">
          {items.map((item) => (
            <NewsItem key={item.id} item={item} />
          ))}
          {nextCursor && (
            <button className="news-load-more" onClick={handleLoadMore} disabled={loadingMore}>
              {loadingMore ? 'Loading…' : 'Load more'}
            </button>
          )}
        </div>
      )}

      <style jsx>{`
        .news-page { display: flex; flex-direction: column; gap: 16px; }

        .news-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .news-tab-btn {
          padding: 8px 20px;
          border-radius: 24px;
          font-size: 0.875rem;
          font-weight: 600;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.15s;
        }
        .news-tab-btn:hover {
          border-color: var(--accent);
          color: var(--text-primary);
        }
        .news-tab-btn.active {
          background: var(--accent);
          border-color: var(--accent);
          color: #fff;
        }

        .news-brief {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin: 0;
          padding: 8px 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          border-left: 3px solid var(--accent);
        }

        .news-header { display: flex; flex-direction: column; gap: 14px; }
        .news-filters { display: flex; flex-wrap: wrap; gap: 8px; }
        .news-filter-btn {
          padding: 5px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;
          background: var(--surface); border: 1px solid var(--border);
          color: var(--text-muted); cursor: pointer; transition: all 0.15s;
        }
        .news-filter-btn:hover { border-color: var(--accent); color: var(--text-primary); }
        .news-filter-btn.active {
          background: var(--accent); border-color: var(--accent); color: #fff;
        }
        .news-error { color: #f87171; font-size: 0.875rem; margin: 0; }
        .news-empty { color: var(--text-muted); font-size: 0.875rem; text-align: center; padding: 40px; }
        .news-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          align-items: start;
        }
        .news-load-more {
          grid-column: 1 / -1;
          background: var(--surface); border: 1px solid var(--border); border-radius: 8px;
          padding: 10px; font-size: 0.85rem; color: var(--text-muted); cursor: pointer;
          transition: border-color 0.15s; width: 100%;
        }
        .news-load-more:hover { border-color: var(--accent); color: var(--text-primary); }
        .news-load-more:disabled { opacity: 0.6; cursor: default; }
      `}</style>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="skel">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="skel-item" />
      ))}
      <style jsx>{`
        .skel { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .skel-item {
          height: 90px; border-radius: 10px; background: var(--surface); border: 1px solid var(--border);
          animation: shimmer 1.5s ease-in-out infinite;
        }
        @keyframes shimmer { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
      `}</style>
    </div>
  );
}
