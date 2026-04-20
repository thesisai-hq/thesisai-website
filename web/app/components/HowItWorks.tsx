'use client';

const steps = [
  {
    num: '01',
    title: 'Define your context',
    description:
      'Set up your watchlist and portfolio. Thesis uses your actual holdings and interests to focus the research — not generic market commentary.',
    signals: ['Watchlist symbols', 'Portfolio exposure', 'Risk profile', 'Your questions'],
    visual: 'context' as const,
  },
  {
    num: '02',
    title: 'Agents go to work',
    description:
      'Five specialized AI agents run in parallel — scanning macro conditions, fundamentals, news sentiment, price action, and risk signals simultaneously.',
    signals: ['Macro regime', 'Fundamental health', 'Price trend', 'News sentiment', 'Risk flags'],
    visual: 'agents' as const,
  },
  {
    num: '03',
    title: 'Get a clear thesis',
    description:
      'A synthesis engine assembles the signals into a Bull / Bear / Neutral thesis with ranked catalysts, confidence score, and real source citations.',
    signals: ['Catalyst ranking', 'Confidence score', 'Risk flags', 'Source citations'],
    visual: 'thesis' as const,
  },
];

const agents = ['Macro', 'Fundamentals', 'News & Sentiment', 'Price Action', 'Risk & Regime', 'Flow'];

function ContextVisual() {
  return (
    <div className="glass-card" style={{ padding: '1.25rem', display: 'grid', gap: '0.9rem' }}>
      <div style={{ fontSize: '0.72rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
        Research Brief
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {['NVDA', 'AAPL', 'MSFT', 'GOOGL'].map((s) => (
          <span key={s} style={{
            padding: '0.3rem 0.65rem',
            borderRadius: '999px',
            background: 'var(--accent-soft)',
            border: '1px solid rgba(59, 158, 255, 0.3)',
            fontSize: '0.75rem',
          }}>
            {s}
          </span>
        ))}
      </div>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {['Portfolio: 6 holdings', 'Risk: Moderate', 'Focus: Growth tech'].map((tag) => (
          <div key={tag} style={{
            padding: '0.4rem 0.7rem',
            borderRadius: '0.6rem',
            background: 'var(--glass)',
            border: '1px solid var(--glass-border)',
            fontSize: '0.78rem',
            color: 'var(--muted)',
          }}>
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentsVisual() {
  return (
    <div className="glass-card" style={{ padding: '1.25rem', display: 'grid', gap: '0.9rem' }}>
      <div style={{ fontSize: '0.72rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
        Running in parallel
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.6rem',
      }}>
        {agents.map((agent, i) => (
          <div
            key={agent}
            className="agent-node-pulse"
            style={{
              padding: '0.6rem 0.75rem',
              borderRadius: '0.75rem',
              border: '1px solid rgba(59, 158, 255, 0.35)',
              background: 'rgba(15, 23, 42, 0.7)',
              fontSize: '0.73rem',
              textAlign: 'center',
              color: 'var(--text)',
              animationDelay: `${i * 0.3}s`,
            }}
          >
            {agent}
          </div>
        ))}
      </div>
      <div style={{
        fontSize: '0.72rem',
        color: 'var(--muted)',
        borderTop: '1px dashed var(--glass-border)',
        paddingTop: '0.7rem',
        textAlign: 'center',
      }}>
        5 agents · under 30 seconds
      </div>
    </div>
  );
}

function ThesisVisual() {
  return (
    <div className="glass-card" style={{ padding: '1.25rem', display: 'grid', gap: '0.9rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span style={{
          padding: '0.3rem 0.75rem',
          borderRadius: '999px',
          background: 'rgba(45, 180, 141, 0.18)',
          border: '1px solid rgba(45, 180, 141, 0.4)',
          color: '#2db48d',
          fontSize: '0.72rem',
          fontWeight: 700,
        }}>
          Bull
        </span>
        <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>86% confidence</span>
      </div>

      {/* Confidence meter */}
      <div>
        <div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginBottom: '0.3rem' }}>Signal strength</div>
        <div style={{ height: '6px', borderRadius: '3px', background: 'var(--glass)', overflow: 'hidden' }}>
          <div
            className="confidence-fill"
            style={{ height: '100%', borderRadius: '3px', background: 'linear-gradient(90deg, #3b9eff, #60c7ff)', '--fill-pct': '86%' } as React.CSSProperties}
          />
        </div>
      </div>

      {/* Catalysts */}
      <div style={{ display: 'grid', gap: '0.45rem' }}>
        {[
          'Data center revenue +112% YoY',
          'Blackwell ramp ahead of schedule',
          'Export risk already priced in',
        ].map((c) => (
          <div key={c} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--muted)' }}>
            <span style={{ color: 'var(--accent)', flexShrink: 0 }}>•</span>
            {c}
          </div>
        ))}
      </div>

      {/* Source tags */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {['Earnings', 'Macro', 'Price'].map((tag) => (
          <span key={tag} style={{
            padding: '0.25rem 0.6rem',
            borderRadius: '999px',
            background: 'var(--accent-soft)',
            border: '1px solid rgba(59, 158, 255, 0.3)',
            fontSize: '0.68rem',
          }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

const visuals = {
  context: ContextVisual,
  agents: AgentsVisual,
  thesis: ThesisVisual,
};

export default function HowItWorks() {
  return (
    <section className="section-wrap how-section" id="how">
      <div className="how-section-header">
        <p className="eyebrow reveal">How It Works</p>
        <h2 className="reveal reveal-delay-1">From question to conviction in three steps.</h2>
        <p className="subline reveal reveal-delay-2">
          No noise. No second-guessing. Just a clear, source-backed thesis built for your portfolio.
        </p>
      </div>

      <div className="how-steps">
        {steps.map((step, i) => {
          const Visual = visuals[step.visual];
          return (
            <div key={step.num} className={`how-step reveal reveal-delay-${i + 1}`}>
              {/* Left: copy */}
              <div>
                <div className="how-step-num">{step.num}</div>
                <h3 className="how-step-title">{step.title}</h3>
                <p className="how-step-desc">{step.description}</p>
                <div className="how-signals">
                  {step.signals.map((sig) => (
                    <span key={sig} className="how-signal">{sig}</span>
                  ))}
                </div>
              </div>

              {/* Right: visual */}
              <Visual />
            </div>
          );
        })}
      </div>
    </section>
  );
}
