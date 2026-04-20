import type { AiContextResponse } from '../lib/api/ai';

interface DailyThesisCardProps {
  data: AiContextResponse | null;
  loading: boolean;
  userName?: string;
}

function deriveHeadline(data: AiContextResponse): string {
  return (
    data.context
      .split('\n')
      .find((l) => l.trim().length > 10)
      ?.replace(/^#+\s*/, '')
      .slice(0, 160) ?? 'Market analysis complete.'
  );
}

function deriveScore(data: AiContextResponse): number {
  const agents = data.agents?.results ?? [];
  if (agents.length === 0) return 0;
  return Math.round(agents.reduce((s, a) => s + a.confidence, 0) / agents.length);
}

function deriveHighlights(data: AiContextResponse): string[] {
  const agents = data.agents?.results ?? [];
  return agents.slice(0, 3).map((a) => {
    const summary = a.summary.length > 80 ? a.summary.slice(0, 80) + '…' : a.summary;
    return `${a.name}: ${summary}`;
  });
}

function formatTime(isoString: string): string {
  try {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return isoString;
  }
}

function getGreeting(name?: string): string {
  const hour = new Date().getHours();
  const prefix = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return name ? `${prefix}, ${name}` : prefix;
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 70 ? '#4ade80' : score >= 45 ? '#fbbf24' : '#f87171';
  return (
    <div className="score-badge">
      <span className="score-num" style={{ color }}>{score}</span>
      <span className="score-denom">/100</span>
      <style jsx>{`
        .score-badge {
          display: flex;
          align-items: baseline;
          gap: 2px;
          background: rgba(59, 158, 255, 0.1);
          border: 1px solid rgba(59, 158, 255, 0.22);
          border-radius: 8px;
          padding: 4px 12px;
          flex-shrink: 0;
        }
        .score-num { font-size: 1.25rem; font-weight: 800; }
        .score-denom { font-size: 0.7rem; color: var(--text-muted); }
      `}</style>
    </div>
  );
}

export function DailyThesisCard({ data, loading, userName }: DailyThesisCardProps) {
  if (loading) {
    return (
      <div className="dtc-skeleton">
        <div className="skel-left" />
        <div className="skel-center">
          <div className="skel-line w80" />
          <div className="skel-line w60" />
          <div className="skel-line w70" />
        </div>
        <div className="skel-right" />
        <style jsx>{`
          .dtc-skeleton {
            display: flex;
            align-items: center;
            gap: 20px;
            padding: 22px 24px;
            border-radius: 14px;
            background: var(--surface);
            border: 1px solid var(--border);
            min-height: 110px;
          }
          .skel-left {
            width: 56px;
            height: 56px;
            border-radius: 14px;
            background: var(--surface-2);
            flex-shrink: 0;
            animation: shimmer 1.5s ease-in-out infinite;
          }
          .skel-center {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .skel-right {
            width: 80px;
            height: 48px;
            border-radius: 8px;
            background: var(--surface-2);
            flex-shrink: 0;
            animation: shimmer 1.5s ease-in-out infinite;
          }
          .skel-line {
            height: 12px;
            border-radius: 6px;
            background: var(--surface-2);
            animation: shimmer 1.5s ease-in-out infinite;
          }
          .w80 { width: 80%; height: 15px; }
          .w60 { width: 60%; }
          .w70 { width: 70%; }
          @keyframes shimmer { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
        `}</style>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="dtc-fallback">
        <div className="dtc-icon-wrap">
          <span className="dtc-icon">⚡</span>
        </div>
        <div className="dtc-center">
          <span className="dtc-greeting">{getGreeting(userName)}</span>
          <p className="dtc-headline-text">AI analysis loading…</p>
        </div>
        <style jsx>{`
          .dtc-fallback {
            display: flex;
            align-items: center;
            gap: 20px;
            padding: 22px 24px;
            border-radius: 14px;
            background: var(--surface);
            border: 1px solid var(--border);
          }
          .dtc-icon-wrap {
            width: 56px;
            height: 56px;
            border-radius: 14px;
            background: linear-gradient(135deg, #1a4fa8, #3b9eff);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.6rem;
            flex-shrink: 0;
          }
          .dtc-icon { line-height: 1; }
          .dtc-center { display: flex; flex-direction: column; gap: 4px; }
          .dtc-greeting { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }
          .dtc-headline-text {
            font-size: 0.95rem;
            font-weight: 600;
            color: var(--text-primary);
            margin: 0;
          }
        `}</style>
      </div>
    );
  }

  const headline = deriveHeadline(data);
  const score = deriveScore(data);
  const highlights = deriveHighlights(data);
  const generatedAt = data.agents?.generated_at;

  return (
    <div className="dtc">
      <div className="dtc-left">
        <div className="dtc-icon-wrap">
          <span className="dtc-icon">⚡</span>
        </div>
        <span className="dtc-greeting">{getGreeting(userName)}</span>
      </div>

      <div className="dtc-center">
        <p className="dtc-headline">{headline}</p>
        {highlights.length > 0 && (
          <ul className="dtc-highlights">
            {highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="dtc-right">
        <ScoreBadge score={score} />
        {generatedAt && (
          <span className="dtc-gen-time">
            Generated at {formatTime(generatedAt)}
          </span>
        )}
      </div>

      <style jsx>{`
        .dtc {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          padding: 22px 24px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(22, 40, 80, 0.95) 0%, rgba(12, 25, 55, 0.97) 100%);
          border: 1px solid rgba(59, 158, 255, 0.22);
          box-shadow: 0 0 48px -20px rgba(59, 158, 255, 0.22);
        }
        .dtc-left {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .dtc-icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: linear-gradient(135deg, #1a4fa8 0%, #3b9eff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          box-shadow: 0 0 24px -8px rgba(59, 158, 255, 0.5);
        }
        .dtc-icon { line-height: 1; }
        .dtc-greeting {
          font-size: 0.68rem;
          color: var(--text-muted);
          font-weight: 500;
          white-space: nowrap;
          text-align: center;
        }
        .dtc-center {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .dtc-headline {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.45;
        }
        .dtc-highlights {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .dtc-highlights li {
          font-size: 0.78rem;
          color: var(--text-muted);
          padding-left: 12px;
          position: relative;
          line-height: 1.4;
        }
        .dtc-highlights li::before {
          content: '·';
          position: absolute;
          left: 0;
          color: var(--accent);
          font-size: 1.1rem;
          line-height: 1.15;
        }
        .dtc-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
          flex-shrink: 0;
        }
        .dtc-gen-time {
          font-size: 0.66rem;
          color: var(--text-muted);
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
