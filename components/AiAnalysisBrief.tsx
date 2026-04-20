import type { AiContextResponse, AgentResult } from '../lib/api/ai';

interface AiAnalysisBriefProps {
  data: AiContextResponse | null;
  loading: boolean;
}

function deriveScore(agents: AgentResult[]): number {
  if (agents.length === 0) return 0;
  return Math.round(agents.reduce((s, a) => s + a.confidence, 0) / agents.length);
}

function deriveHighlights(agents: AgentResult[]): string[] {
  return agents.slice(0, 4).map((a) => {
    const summary = a.summary.length > 90 ? a.summary.slice(0, 90) + '…' : a.summary;
    return `${a.name}: ${summary}`;
  });
}

export function AiAnalysisBrief({ data, loading }: AiAnalysisBriefProps) {
  if (loading) return <BriefSkeleton />;

  if (!data) {
    return (
      <div className="brief-error">
        <span>AI analysis unavailable</span>
        <style jsx>{`
          .brief-error {
            padding: 20px;
            color: var(--text-muted);
            font-size: 0.85rem;
            text-align: center;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
          }
        `}</style>
      </div>
    );
  }

  const agents = data.agents?.results ?? [];
  const score = deriveScore(agents);
  const highlights = deriveHighlights(agents);
  const headline = data.context
    .split('\n')
    .find((l) => l.trim().length > 10)
    ?.replace(/^#+\s*/, '')
    .slice(0, 140) ?? 'Market analysis complete.';

  return (
    <div className="brief-card">
      <div className="brief-top">
        <div className="brief-header">
          <span className="brief-eyebrow">AI Analysis Brief</span>
          <div className="brief-score">
            <span className="brief-score-num">{score}</span>
            <span className="brief-score-denom">/100</span>
          </div>
        </div>
        <p className="brief-headline">{headline}</p>
      </div>

      {highlights.length > 0 && (
        <ul className="brief-bullets">
          {highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      )}

      <div className="brief-footer">
        <a href="/ai" className="brief-followup">Ask follow-up →</a>
      </div>

      <style jsx>{`
        .brief-card {
          padding: 22px 24px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(22, 40, 80, 0.95) 0%, rgba(12, 25, 55, 0.97) 100%);
          border: 1px solid rgba(59, 158, 255, 0.25);
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: 0 0 48px -20px rgba(59, 158, 255, 0.25);
        }
        .brief-top { display: flex; flex-direction: column; gap: 10px; }
        .brief-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .brief-eyebrow {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--accent);
        }
        .brief-score {
          display: flex;
          align-items: baseline;
          gap: 2px;
          background: rgba(59, 158, 255, 0.14);
          border: 1px solid rgba(59, 158, 255, 0.28);
          padding: 3px 12px;
          border-radius: 8px;
        }
        .brief-score-num {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .brief-score-denom {
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .brief-headline {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.45;
        }
        .brief-bullets {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .brief-bullets li {
          font-size: 0.82rem;
          color: var(--text-muted);
          padding-left: 14px;
          position: relative;
          line-height: 1.5;
        }
        .brief-bullets li::before {
          content: '·';
          position: absolute;
          left: 0;
          color: var(--accent);
          font-size: 1.2rem;
          line-height: 1.2;
        }
        .brief-footer { display: flex; justify-content: flex-end; }
        .brief-followup {
          font-size: 0.82rem;
          color: var(--accent);
          font-weight: 600;
          text-decoration: none;
          transition: opacity 150ms ease;
        }
        .brief-followup:hover { opacity: 0.75; }
      `}</style>
    </div>
  );
}

function BriefSkeleton() {
  return (
    <div className="brief-skel">
      <div className="skel-line w60" />
      <div className="skel-line w90" />
      <div className="skel-line w80" />
      <div className="skel-line w70" />
      <style jsx>{`
        .brief-skel {
          padding: 22px 24px;
          border-radius: 14px;
          background: var(--surface);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-height: 150px;
        }
        .skel-line {
          height: 13px;
          border-radius: 6px;
          background: var(--surface-2);
          animation: shimmer 1.5s ease-in-out infinite;
        }
        .w60 { width: 60%; height: 16px; }
        .w90 { width: 90%; }
        .w80 { width: 80%; }
        .w70 { width: 70%; }
        @keyframes shimmer { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
      `}</style>
    </div>
  );
}
