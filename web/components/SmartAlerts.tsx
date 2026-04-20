import type { NotificationRead } from '../lib/api/dashboard';

interface SmartAlertsProps {
  notifications: NotificationRead[];
}

interface SeverityStyle {
  bg: string;
  borderColor: string;
  iconColor: string;
  icon: string;
}

const SEVERITY_STYLES: Record<string, SeverityStyle> = {
  high: {
    bg: 'rgba(248,113,113,0.07)',
    borderColor: '#f87171',
    iconColor: '#f87171',
    icon: '⚠',
  },
  medium: {
    bg: 'rgba(251,191,36,0.07)',
    borderColor: '#fbbf24',
    iconColor: '#fbbf24',
    icon: '◷',
  },
  info: {
    bg: 'rgba(59,158,255,0.06)',
    borderColor: 'var(--accent)',
    iconColor: 'var(--accent)',
    icon: 'ℹ',
  },
};

const FALLBACK_STYLE = SEVERITY_STYLES['info'];

export function SmartAlerts({ notifications }: SmartAlertsProps) {
  if (notifications.length === 0) return null;

  const highCount = notifications.filter((n) => n.severity === 'high').length;

  return (
    <div className="alerts-wrap">
      <div className="alerts-header">
        <span className="alerts-title">Smart Alerts</span>
        {highCount > 0 && <span className="alerts-badge">{highCount}</span>}
      </div>

      <div className="alerts-list">
        {notifications.map((n) => {
          const style = SEVERITY_STYLES[n.severity] ?? FALLBACK_STYLE;
          return (
            <div
              key={n.id}
              className="alert-row"
              style={{
                background: style.bg,
                borderLeftColor: style.borderColor,
              }}
            >
              <span className="alert-icon" style={{ color: style.iconColor }}>
                {style.icon}
              </span>
              <div className="alert-body">
                <span className="alert-title">{n.title}</span>
                <span className="alert-text">{n.body}</span>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .alerts-wrap { display: flex; flex-direction: column; gap: 10px; }
        .alerts-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .alerts-title {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }
        .alerts-badge {
          font-size: 0.68rem;
          font-weight: 700;
          background: rgba(248,113,113,0.14);
          color: #f87171;
          border: 1px solid rgba(248,113,113,0.28);
          padding: 1px 7px;
          border-radius: 10px;
        }
        .alerts-list { display: flex; flex-direction: column; gap: 8px; }
        .alert-row {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          padding: 10px 14px;
          border-radius: 8px;
          border-left: 3px solid transparent;
        }
        .alert-icon { font-size: 0.88rem; flex-shrink: 0; margin-top: 1px; }
        .alert-body { display: flex; flex-direction: column; gap: 2px; }
        .alert-title { font-size: 0.82rem; font-weight: 600; color: var(--text-primary); }
        .alert-text { font-size: 0.76rem; color: var(--text-muted); line-height: 1.4; }
      `}</style>
    </div>
  );
}
