import type { NewsFeedItem } from '../lib/api/news';

interface NewsItemProps {
  item: NewsFeedItem;
}

export function NewsItem({ item }: NewsItemProps) {
  const date = new Date(item.published_at);
  const formatted = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="news-item"
    >
      <div className="news-meta">
        <span className="news-source">{item.source}</span>
        <span className="news-dot">·</span>
        <span className="news-date">{formatted}</span>
      </div>
      <h3 className="news-title">{item.title}</h3>
      {item.summary && (
        <p className="news-summary">{item.summary}</p>
      )}
      {item.symbols.length > 0 && (
        <div className="news-symbols">
          {item.symbols.slice(0, 5).map((sym) => (
            <span key={sym} className="news-symbol">{sym}</span>
          ))}
        </div>
      )}

      <style jsx>{`
        .news-item {
          display: block;
          padding: 16px 20px;
          border-radius: 10px;
          background: var(--surface);
          border: 1px solid var(--border);
          text-decoration: none;
          transition: border-color 0.15s, background 0.15s;
        }
        .news-item:hover {
          border-color: var(--accent);
          background: var(--surface-2);
        }
        .news-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }
        .news-source {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--accent);
        }
        .news-dot { color: var(--text-muted); font-size: 0.75rem; }
        .news-date { font-size: 0.75rem; color: var(--text-muted); }
        .news-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 6px;
          line-height: 1.4;
        }
        .news-summary {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin: 0 0 8px;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .news-symbols { display: flex; flex-wrap: wrap; gap: 5px; }
        .news-symbol {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 1px 7px;
          border-radius: 4px;
          background: rgba(59,158,255,0.1);
          color: var(--accent);
        }
      `}</style>
    </a>
  );
}
