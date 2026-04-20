'use client';

import { useEffect, useState } from 'react';
import type { InsightRead } from '../../../lib/api/insights';
import { getInsights, markInsightRead } from '../../../lib/api/insights';

type ReadFilter = 'all' | 'unread' | 'read';

function formatInsightDate(isoString: string): string {
  const date = new Date(isoString);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  const hour = date.getHours();
  const min = date.getMinutes().toString().padStart(2, '0');
  const ampm = hour >= 12 ? 'pm' : 'am';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${month} ${day} at ${hour12}:${min}${ampm}`;
}

interface InsightCardProps {
  insight: InsightRead;
  onMarkRead: (id: string) => void;
}

function InsightCard({ insight, onMarkRead }: InsightCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [marking, setMarking] = useState(false);
  const isRead = Boolean(insight.read_at);

  async function handleMarkRead() {
    if (isRead || marking) return;
    setMarking(true);
    try {
      await markInsightRead(insight.id);
      onMarkRead(insight.id);
    } catch {
      // ignore
    } finally {
      setMarking(false);
    }
  }

  return (
    <div className={`insight-card${isRead ? ' insight-card-read' : ''}`}>
      <div className="insight-card-header">
        <div className="insight-card-meta">
          <span className={`insight-dot${isRead ? ' insight-dot-read' : ''}`} />
          <span className="insight-badge">Morning Scan</span>
          {insight.symbol && insight.symbol.trim() !== '' && (
            <span className="insight-symbol">{insight.symbol}</span>
          )}
        </div>
        <span className="insight-date">{formatInsightDate(insight.created_at)}</span>
      </div>

      <h3 className="insight-title">{insight.title}</h3>

      <p className={`insight-body${expanded ? ' insight-body-expanded' : ''}`}>
        {insight.body}
      </p>

      <div className="insight-card-footer">
        <button
          className="insight-expand-btn"
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
        {!isRead && (
          <button
            className="insight-read-btn"
            onClick={handleMarkRead}
            disabled={marking}
          >
            {marking ? 'Marking…' : 'Mark as read'}
          </button>
        )}
        {isRead && (
          <span className="insight-read-label">Read</span>
        )}
      </div>

      <style jsx>{`
        .insight-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: border-color 0.15s;
        }
        .insight-card:hover {
          border-color: rgba(59, 158, 255, 0.3);
        }
        .insight-card-read {
          opacity: 0.7;
        }
        .insight-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
        }
        .insight-card-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .insight-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent);
          flex-shrink: 0;
        }
        .insight-dot-read {
          background: var(--border);
        }
        .insight-badge {
          font-size: 0.72rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 10px;
          background: rgba(59, 158, 255, 0.12);
          color: var(--accent);
          border: 1px solid rgba(59, 158, 255, 0.25);
        }
        .insight-symbol {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 2px 7px;
        }
        .insight-date {
          font-size: 0.75rem;
          color: var(--text-muted);
          white-space: nowrap;
        }
        .insight-title {
          font-size: 0.925rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.35;
        }
        .insight-body {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .insight-body-expanded {
          display: block;
          -webkit-line-clamp: unset;
          overflow: visible;
        }
        .insight-card-footer {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 2px;
        }
        .insight-expand-btn {
          font-size: 0.78rem;
          color: var(--accent);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-weight: 600;
          transition: opacity 0.15s;
        }
        .insight-expand-btn:hover { opacity: 0.75; }
        .insight-read-btn {
          font-size: 0.78rem;
          color: var(--text-muted);
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 6px;
          cursor: pointer;
          padding: 3px 10px;
          font-weight: 600;
          transition: border-color 0.15s, color 0.15s;
          margin-left: auto;
        }
        .insight-read-btn:hover {
          border-color: var(--accent);
          color: var(--text-primary);
        }
        .insight-read-btn:disabled { opacity: 0.5; cursor: default; }
        .insight-read-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-left: auto;
        }
      `}</style>
    </div>
  );
}

function InsightsSkeleton() {
  return (
    <div className="skel">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skel-item" />
      ))}
      <style jsx>{`
        .skel { display: flex; flex-direction: column; gap: 12px; }
        .skel-item {
          height: 130px;
          border-radius: 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          animation: shimmer 1.5s ease-in-out infinite;
        }
        @keyframes shimmer { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
      `}</style>
    </div>
  );
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<InsightRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [readFilter, setReadFilter] = useState<ReadFilter>('all');

  useEffect(() => {
    getInsights()
      .then((res) => setInsights(res.items))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load insights'))
      .finally(() => setLoading(false));
  }, []);

  function handleMarkRead(id: string) {
    setInsights((prev) =>
      prev.map((ins) =>
        ins.id === id ? { ...ins, read_at: new Date().toISOString() } : ins
      )
    );
  }

  const filtered = insights.filter((ins) => {
    const matchSearch =
      search.trim() === '' ||
      ins.title.toLowerCase().includes(search.toLowerCase()) ||
      ins.body.toLowerCase().includes(search.toLowerCase());
    const matchRead =
      readFilter === 'all' ||
      (readFilter === 'unread' && !ins.read_at) ||
      (readFilter === 'read' && Boolean(ins.read_at));
    return matchSearch && matchRead;
  });

  const unreadCount = insights.filter((ins) => !ins.read_at).length;

  return (
    <div className="insights-page">
      {/* Search */}
      <div className="insights-search-row">
        <input
          className="insights-search"
          type="text"
          placeholder="Search insights…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {unreadCount > 0 && (
          <span className="insights-unread-badge">{unreadCount} unread</span>
        )}
      </div>

      {/* Filter pills */}
      <div className="insights-filters">
        {(['all', 'unread', 'read'] as ReadFilter[]).map((f) => (
          <button
            key={f}
            className={`insights-filter-btn${readFilter === f ? ' active' : ''}`}
            onClick={() => setReadFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {error && <p className="insights-error">{error}</p>}

      {loading ? (
        <InsightsSkeleton />
      ) : filtered.length === 0 ? (
        <div className="insights-empty">
          {insights.length === 0
            ? 'No insights yet. Morning scan insights will appear here.'
            : 'No insights match your filters.'}
        </div>
      ) : (
        <div className="insights-list">
          {filtered.map((ins) => (
            <InsightCard key={ins.id} insight={ins} onMarkRead={handleMarkRead} />
          ))}
        </div>
      )}

      <style jsx>{`
        .insights-page {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 760px;
        }
        .insights-search-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .insights-search {
          flex: 1;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 9px 14px;
          font-size: 0.875rem;
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.15s;
        }
        .insights-search::placeholder { color: var(--text-muted); }
        .insights-search:focus { border-color: var(--accent); }
        .insights-unread-badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 12px;
          background: rgba(59, 158, 255, 0.15);
          color: var(--accent);
          white-space: nowrap;
        }
        .insights-filters {
          display: flex;
          gap: 8px;
        }
        .insights-filter-btn {
          padding: 5px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.15s;
        }
        .insights-filter-btn:hover {
          border-color: var(--accent);
          color: var(--text-primary);
        }
        .insights-filter-btn.active {
          background: var(--accent);
          border-color: var(--accent);
          color: #fff;
        }
        .insights-error { color: #f87171; font-size: 0.875rem; margin: 0; }
        .insights-empty {
          text-align: center;
          color: var(--text-muted);
          font-size: 0.875rem;
          padding: 48px 24px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
        }
        .insights-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
      `}</style>
    </div>
  );
}
