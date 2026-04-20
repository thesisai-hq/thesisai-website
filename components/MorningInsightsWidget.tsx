import type { InsightRead } from '../lib/api/insights';
import { InsightCard } from './InsightCard';

interface MorningInsightsWidgetProps {
  insights: InsightRead[];
  onRead: (id: string) => void;
}

export function MorningInsightsWidget({ insights, onRead }: MorningInsightsWidgetProps) {
  const unreadCount = insights.filter((ins) => ins.read_at === null).length;

  return (
    <div className="miw-wrap">
      <div className="miw-header">
        <span className="miw-title">Morning Insights</span>
        {unreadCount > 0 && <span className="miw-badge">{unreadCount}</span>}
      </div>
      <div className="miw-list">
        {insights.map((ins) => (
          <InsightCard key={ins.id} insight={ins} onRead={onRead} />
        ))}
      </div>

      <style jsx>{`
        .miw-wrap {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .miw-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .miw-title {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }
        .miw-badge {
          font-size: 0.68rem;
          font-weight: 700;
          background: #f87171;
          color: #fff;
          border-radius: 10px;
          padding: 1px 7px;
        }
        .miw-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
      `}</style>
    </div>
  );
}
