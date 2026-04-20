export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  symbol?: string;
  importance: 'high' | 'medium' | 'low';
}

interface EventsPanelProps {
  events: UpcomingEvent[];
}

const IMPORTANCE_COLORS: Record<string, string> = {
  high: '#f87171',
  medium: '#fbbf24',
  low: 'var(--text-muted)',
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function EventsPanel({ events }: EventsPanelProps) {
  if (events.length === 0) return null;

  return (
    <div className="ep">
      <span className="ep-title">Upcoming Events</span>
      <div className="ep-list">
        {events.map((e) => (
          <div key={e.id} className="ep-row">
            <span
              className="ep-dot"
              style={{ color: IMPORTANCE_COLORS[e.importance] ?? 'var(--text-muted)' }}
            >
              ●
            </span>
            <div className="ep-body">
              <span className="ep-event-title">
                {e.symbol && <span className="ep-sym">{e.symbol} </span>}
                {e.title}
              </span>
            </div>
            <span className="ep-date">{formatDate(e.date)}</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .ep {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ep-title {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          color: var(--text-muted);
        }
        .ep-list {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .ep-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 8px;
          background: var(--surface);
          border: 1px solid var(--border);
        }
        .ep-dot {
          font-size: 0.55rem;
          flex-shrink: 0;
          line-height: 1;
        }
        .ep-body {
          flex: 1;
          min-width: 0;
        }
        .ep-event-title {
          font-size: 0.78rem;
          color: var(--text-primary);
          line-height: 1.3;
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .ep-sym {
          font-weight: 700;
          color: var(--accent);
        }
        .ep-date {
          font-size: 0.7rem;
          color: var(--text-muted);
          flex-shrink: 0;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
