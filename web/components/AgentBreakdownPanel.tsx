import type { AgentResult } from '../lib/api/ai';

interface AgentBreakdownPanelProps {
  agents: AgentResult[];
  loading?: boolean;
}

interface AgentColor {
  bg: string;
  border: string;
  text: string;
  fill: string;
}

const AGENT_COLOR_MAP: Array<{ key: string; color: AgentColor }> = [
  {
    key: 'price',
    color: { bg: 'rgba(59,158,255,0.1)', border: 'rgba(59,158,255,0.32)', text: '#3b9eff', fill: '#3b9eff' },
  },
  {
    key: 'trend',
    color: { bg: 'rgba(59,158,255,0.1)', border: 'rgba(59,158,255,0.32)', text: '#3b9eff', fill: '#3b9eff' },
  },
  {
    key: 'fundamental',
    color: { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.32)', text: '#a78bfa', fill: '#a78bfa' },
  },
  {
    key: 'macro',
    color: { bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.28)', text: '#fbbf24', fill: '#fbbf24' },
  },
  {
    key: 'news',
    color: { bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.28)', text: '#34d399', fill: '#34d399' },
  },
  {
    key: 'portfolio',
    color: { bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.28)', text: '#4ade80', fill: '#4ade80' },
  },
];

const FALLBACK_COLOR: AgentColor = {
  bg: 'rgba(148,163,184,0.08)',
  border: 'rgba(148,163,184,0.22)',
  text: 'var(--text-muted)',
  fill: 'var(--text-muted)',
};

function agentColor(name: string): AgentColor {
  const lower = name.toLowerCase();
  for (const { key, color } of AGENT_COLOR_MAP) {
    if (lower.includes(key)) return color;
  }
  return FALLBACK_COLOR;
}

export function AgentBreakdownPanel({ agents, loading }: AgentBreakdownPanelProps) {
  if (loading) {
    return (
      <div className="agents-row">
        {[1, 2, 3].map((i) => (
          <div key={i} className="agent-skel" />
        ))}
        <style jsx>{`
          .agents-row { display: flex; gap: 14px; overflow-x: auto; padding-bottom: 4px; }
          .agents-row::-webkit-scrollbar { display: none; }
          .agent-skel {
            min-width: 220px;
            height: 130px;
            border-radius: 12px;
            background: var(--surface);
            border: 1px solid var(--border);
            animation: shimmer 1.5s ease-in-out infinite;
            flex-shrink: 0;
          }
          @keyframes shimmer { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
        `}</style>
      </div>
    );
  }

  if (agents.length === 0) return null;

  return (
    <div className="agents-row">
      {agents.map((agent) => {
        const color = agentColor(agent.name);
        const pct = Math.min(100, Math.max(0, agent.confidence));
        return (
          <div key={agent.name} className="agent-card">
            <div
              className="agent-pill"
              style={{ background: color.bg, border: `1px solid ${color.border}`, color: color.text }}
            >
              {agent.name}
            </div>
            <div className="agent-conf-bar">
              <div
                className="agent-conf-fill"
                style={{ width: `${pct}%`, background: color.fill }}
              />
            </div>
            <p className="agent-summary">{agent.summary}</p>
            {agent.signals.length > 0 && (
              <div className="agent-signals">
                {agent.signals.slice(0, 3).map((sig, i) => (
                  <span key={i} className="agent-sig">{sig}</span>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <style jsx>{`
        .agents-row {
          display: flex;
          gap: 14px;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        .agents-row::-webkit-scrollbar { display: none; }
        .agent-card {
          min-width: 220px;
          flex-shrink: 0;
          padding: 16px;
          border-radius: 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .agent-pill {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 3px 10px;
          border-radius: 6px;
          align-self: flex-start;
        }
        .agent-conf-bar {
          height: 3px;
          border-radius: 2px;
          background: rgba(148,163,184,0.18);
          position: relative;
          overflow: hidden;
        }
        .agent-conf-fill {
          height: 100%;
          border-radius: 2px;
        }
        .agent-summary {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .agent-signals {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }
        .agent-sig {
          font-size: 0.68rem;
          padding: 2px 8px;
          border-radius: 4px;
          background: rgba(148,163,184,0.07);
          border: 1px solid rgba(148,163,184,0.18);
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
