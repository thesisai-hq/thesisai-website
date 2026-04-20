import type { InsightRead } from '../lib/api/insights';

interface InsightCardProps {
  insight: InsightRead;
  onRead?: (id: string) => void;
}

export function InsightCard({ insight, onRead }: InsightCardProps) {
  const date = new Date(insight.created_at);
  const formatted = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const isUnread = insight.read_at === null;

  return (
    <div
      className={`insight-card${isUnread ? ' insight-card-unread' : ''}`}
      onClick={() => onRead?.(insight.id)}
      role={onRead ? 'button' : undefined}
      style={{ cursor: onRead ? 'pointer' : 'default' }}
    >
      <div className="insight-header">
        <span className="insight-badge">{insight.symbol}</span>
        <span className="insight-date">{formatted}</span>
      </div>
      <h3 className="insight-title">{insight.title}</h3>
      <p className="insight-summary">{insight.body}</p>
      {insight.action && (
        <p className="insight-action">{insight.action}</p>
      )}

      <style jsx>{`
        .insight-card {
          padding: 18px 20px;
          border-radius: 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: border-color 0.15s;
        }
        .insight-card-unread {
          border-color: rgba(59, 158, 255, 0.4);
        }
        .insight-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .insight-badge {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--accent);
          background: rgba(59, 158, 255, 0.12);
          padding: 2px 8px;
          border-radius: 4px;
        }
        .insight-date {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .insight-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.4;
        }
        .insight-summary {
          font-size: 0.825rem;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.5;
        }
        .insight-action {
          font-size: 0.75rem;
          color: var(--accent);
          font-style: italic;
          margin: 0;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}
