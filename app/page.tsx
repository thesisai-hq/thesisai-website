import TrackedLink from './components/TrackedLink';
import WaitlistForm from './components/WaitlistForm';
import AppMockup from './components/AppMockup';
import HowItWorks from './components/HowItWorks';
import RevealObserver from './components/RevealObserver';
import SiteNav from './components/SiteNav';

const features = [
  {
    title: 'Daily Market Brief',
    description: 'A fast, mobile-first brief tuned to what you actually hold — every morning before the open.',
  },
  {
    title: 'Insight Cards',
    description: 'Short, structured summaries that explain what changed, why it matters, and what to watch.',
  },
  {
    title: 'Confidence Score',
    description: 'A clean signal quantifying how strong the thesis is — so you spend attention where it counts.',
  },
  {
    title: 'Portfolio-Aware Commentary',
    description: 'Commentary tied to your actual holdings, not generic market chatter built for everyone.',
  },
  {
    title: 'Thesis Alerts',
    description: 'Alerts when the investment thesis shifts — not just when the price twitches.',
  },
  {
    title: 'Save & Revisit',
    description: 'Research you can save, search, and review. Build a personal knowledge base over time.',
  },
];

const faqs = [
  {
    question: 'Is this financial advice?',
    answer:
      'No. Thesis AI provides research assistance and context, not personalized investment advice. Always consult a qualified financial advisor before making investment decisions.',
  },
  {
    question: 'Who is this for?',
    answer:
      'Serious retail investors who want clearer decision support without information overload — people who do their own research but want AI to do the heavy lifting on synthesis.',
  },
  {
    question: 'Do you execute trades?',
    answer:
      'No. Thesis focuses entirely on research and insight. We have no brokerage integrations and cannot place orders on your behalf.',
  },
  {
    question: 'Is this free?',
    answer:
      'Early access is limited and invite-based while we validate the MVP with real users. Pricing launches after core workflows are validated.',
  },
];

export default function MarketingPage() {
  return (
    <main className="page">
      {/* Scroll-reveal observer — client component, no visible output */}
      <RevealObserver />

      {/* ── Navigation ────────────────────────────── */}
      <SiteNav />

      {/* ── Company Intro ─────────────────────────── */}
      <section className="section-wrap" style={{ paddingTop: '4rem', paddingBottom: '1rem' }}>
        <div style={{ maxWidth: '560px' }}>
          <p className="eyebrow">Thesis AI</p>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', marginBottom: '0.7rem' }}>
            Tools for serious investors.
          </h2>
          <p className="subline" style={{ marginTop: 0 }}>
            We combine AI and behavioral finance to help you research smarter and invest consistently.
          </p>
        </div>

        {/* Products Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
            marginTop: '2.5rem',
          }}
        >
          {/* Thesis AI Platform card */}
          <div
            style={{
              background: 'var(--bg-soft)',
              border: '1px solid var(--border)',
              borderRadius: '1.1rem',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  background: 'var(--accent-soft)',
                  border: '1px solid rgba(59,158,255,0.3)',
                  color: 'var(--accent)',
                }}
              >
                In Beta
              </span>
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>Thesis AI Platform</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                AI-powered investment research with multi-agent synthesis — macro, fundamentals, news, and price action in one clear thesis.
              </p>
            </div>
            <a
              href="#waitlist"
              className="ghost"
              style={{
                display: 'inline-flex',
                alignSelf: 'flex-start',
                marginTop: 'auto',
                fontSize: '0.85rem',
                padding: '0.55rem 1rem',
                borderRadius: '8px',
              }}
            >
              Request Access →
            </a>
          </div>

          {/* Long Hold card */}
          <div
            style={{
              background: 'var(--bg-soft)',
              border: '1px solid var(--border)',
              borderRadius: '1.1rem',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  background: 'rgba(45,180,141,0.12)',
                  border: '1px solid rgba(45,180,141,0.35)',
                  color: '#2db48d',
                }}
              >
                Available on iOS
              </span>
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>Long Hold</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                Track contributions, build streaks, and visualize long-term compound growth. Built for consistent, disciplined investors.
              </p>
            </div>
            <a
              href="/long-hold"
              className="ghost"
              style={{
                display: 'inline-flex',
                alignSelf: 'flex-start',
                marginTop: 'auto',
                fontSize: '0.85rem',
                padding: '0.55rem 1rem',
                borderRadius: '8px',
              }}
            >
              Learn More →
            </a>
          </div>
        </div>
      </section>

      {/* ── Platform Divider ──────────────────────── */}
      <div
        id="platform"
        className="section-wrap"
        style={{
          paddingTop: '3rem',
          paddingBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
        <span
          style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: 'var(--muted)',
            whiteSpace: 'nowrap',
          }}
        >
          Thesis AI Platform
        </span>
        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
      </div>

      {/* ── Hero ──────────────────────────────────── */}
      <section className="hero section-wrap" id="top">
        <div className="hero-copy">
          <p className="eyebrow reveal">AI-Powered Investment Research</p>
          <h1 className="grad-text reveal reveal-delay-1">
            Market insight<br />in seconds.
          </h1>
          <p className="subline reveal reveal-delay-2">
            Thesis orchestrates specialized AI agents to synthesize macro, fundamentals,
            news, and price action into a clear, portfolio-aware thesis — in under 30 seconds.
          </p>
          <div className="hero-actions reveal reveal-delay-3">
            <TrackedLink className="cta" href="#waitlist" eventName="cta_hero_primary_click">
              Request iOS TestFlight Access
            </TrackedLink>
            <TrackedLink className="ghost" href="#how" eventName="cta_hero_secondary_click">
              See how it works
            </TrackedLink>
          </div>
          <p className="beta-note reveal reveal-delay-3">Private iOS beta · invite-only</p>
        </div>

        <div className="hero-phones reveal reveal-delay-2" aria-label="iPhone app preview">
          <article className="phone-card">
            <p className="phone-title">Daily Brief</p>
            <p className="phone-line">Regime: neutral to risk-on</p>
            <p className="phone-line">Key focus: macro + earnings setup</p>
          </article>
          <article className="phone-card highlight">
            <p className="phone-title">Insight Card</p>
            <p className="phone-line">Bull case strengthened in semis</p>
            <p className="phone-line">Confidence: 86%</p>
            <p className="phone-line">Source-backed context included</p>
          </article>
          <article className="phone-card">
            <p className="phone-title">Portfolio View</p>
            <p className="phone-line">Total value: $124,532</p>
            <p className="phone-line">Daily change: +1.02%</p>
          </article>
        </div>
      </section>

      {/* ── Metrics Bar ───────────────────────────── */}
      <div className="section-wrap">
        <div className="metrics-bar reveal">
          <div className="metric-item">
            <span className="metric-value">&lt; 30s</span>
            <span className="metric-label">Average analysis time</span>
          </div>
          <div className="metrics-divider" aria-hidden />
          <div className="metric-item">
            <span className="metric-value">5</span>
            <span className="metric-label">Specialized AI agents per query</span>
          </div>
          <div className="metrics-divider" aria-hidden />
          <div className="metric-item">
            <span className="metric-value">Private</span>
            <span className="metric-label">iOS beta, invite-only</span>
          </div>
        </div>
      </div>

      {/* ── App Mockup ────────────────────────────── */}
      <AppMockup />

      {/* ── How It Works ──────────────────────────── */}
      <HowItWorks />

      {/* ── Features ──────────────────────────────── */}
      <section className="section-wrap" id="features" style={{ padding: '4rem 0' }}>
        <p className="eyebrow reveal">Features</p>
        <h2 className="reveal reveal-delay-1">Built for mobile decision-making.</h2>
        <div className="feature-grid" style={{ marginTop: '2rem' }}>
          {features.map((feature, i) => (
            <article
              className={`feature reveal reveal-delay-${(i % 3) + 1}`}
              key={feature.title}
            >
              <span className="feature-dot" aria-hidden />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Multi-Agent Engine ────────────────────── */}
      <section className="section-wrap multiagent" id="multiagent">
        <div className="multiagent-grid">
          <div className="multiagent-copy reveal">
            <p className="eyebrow">Multi-Agent Research Engine</p>
            <h2>Parallel intelligence that turns chaos into conviction.</h2>
            <p className="subline">
              Thesis orchestrates specialized agents for macro, fundamentals, sentiment, and price
              action. Each agent contributes structured signals, and a synthesis layer produces a
              clean, source-aware thesis.
            </p>
            <div className="agent-pills">
              <span>Macro Agent</span>
              <span>Fundamentals Agent</span>
              <span>News &amp; Sentiment Agent</span>
              <span>Price Action Agent</span>
              <span>Risk &amp; Regime Agent</span>
            </div>
            <p className="beta-note">
              Outputs are ranked by confidence and tailored to your risk profile and holdings.
            </p>
          </div>

          <div
            className="multiagent-graphic reveal reveal-delay-1"
            aria-label="Multi-agent AI system diagram"
          >
            <svg viewBox="0 0 420 360" role="img" aria-labelledby="multiagentTitle multiagentDesc">
              <title id="multiagentTitle">Thesis AI multi-agent system</title>
              <desc id="multiagentDesc">
                Nodes orbiting a central synthesis engine representing multiple AI agents.
              </desc>
              <defs>
                <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="orbit" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <circle cx="210" cy="180" r="90" fill="url(#coreGlow)" />
              <circle cx="210" cy="180" r="70" fill="none" stroke="url(#orbit)" strokeWidth="1.4" opacity="0.6" />
              <circle cx="210" cy="180" r="115" fill="none" stroke="url(#orbit)" strokeWidth="1" opacity="0.35" />
              <circle cx="210" cy="180" r="145" fill="none" stroke="url(#orbit)" strokeWidth="0.8" opacity="0.2" />
              <circle cx="210" cy="180" r="46" className="core-pulse" />
              <circle cx="210" cy="180" r="42" className="core-ring" />
              <text x="210" y="176" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="Avenir Next, sans-serif">
                Synthesis
              </text>
              <text x="210" y="192" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="IBM Plex Sans, sans-serif">
                Engine
              </text>
              <g className="agent-nodes" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.1">
                <g className="agent-node">
                  <circle cx="330" cy="110" r="18" />
                  <text x="330" y="114" textAnchor="middle">Macro</text>
                </g>
                <g className="agent-node">
                  <circle cx="86" cy="118" r="16" />
                  <text x="86" y="122" textAnchor="middle">Fund</text>
                </g>
                <g className="agent-node">
                  <circle cx="95" cy="246" r="14" />
                  <text x="95" y="250" textAnchor="middle">News</text>
                </g>
                <g className="agent-node">
                  <circle cx="328" cy="256" r="16" />
                  <text x="328" y="260" textAnchor="middle">Price</text>
                </g>
                <g className="agent-node">
                  <circle cx="210" cy="48" r="13" />
                  <text x="210" y="52" textAnchor="middle">Risk</text>
                </g>
                <g className="agent-node">
                  <circle cx="210" cy="312" r="13" />
                  <text x="210" y="316" textAnchor="middle">Flow</text>
                </g>
              </g>
              <g className="agent-lines" strokeWidth="1" opacity="0.7">
                <line x1="210" y1="180" x2="330" y2="110" className="flow-line" />
                <line x1="210" y1="180" x2="86" y2="118" className="flow-line" />
                <line x1="210" y1="180" x2="95" y2="246" className="flow-line" />
                <line x1="210" y1="180" x2="328" y2="256" className="flow-line" />
                <line x1="210" y1="180" x2="210" y2="48" className="flow-line" />
                <line x1="210" y1="180" x2="210" y2="312" className="flow-line" />
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* ── Trust ─────────────────────────────────── */}
      <section className="section-wrap" id="trust" style={{ padding: '2rem 0' }}>
        <div className="trust reveal">
          <p className="eyebrow">Built for serious investors</p>
          <h2>Institutional discipline.<br />Mobile simplicity.</h2>
          <p style={{ marginTop: '0.8rem' }}>
            Designed by engineers and investors with institutional-style research discipline —
            adapted for the mobile investor who needs clarity, not more noise.
          </p>
          <div className="trust-pills">
            <span>No trading. No hype. Just insight.</span>
            <span>Structured reasoning over headline chasing.</span>
            <span>Source-cited, confidence-scored outputs.</span>
            <span>Mobile-first workflows built for real daily use.</span>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────── */}
      <section className="section-wrap" id="faq" style={{ padding: '3rem 0' }}>
        <p className="eyebrow reveal">FAQ</p>
        <h2 className="reveal reveal-delay-1" style={{ marginBottom: '1.5rem' }}>Common questions.</h2>
        <div className="faq">
          {faqs.map((item, i) => (
            <details key={item.question} className={`reveal reveal-delay-${(i % 3) + 1}`}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Waitlist / Final CTA ──────────────────── */}
      <section className="section-wrap waitlist-section" id="waitlist">
        <p className="eyebrow reveal">Early Access</p>
        <h2 className="grad-text reveal reveal-delay-1">
          Request iOS TestFlight Access
        </h2>
        <p className="subline reveal reveal-delay-2">
          We&apos;re onboarding a small group of serious investors helping shape Thesis from day one.
        </p>
        <div className="waitlist-box reveal reveal-delay-3">
          <WaitlistForm source="footer_waitlist" />
        </div>
      </section>

      {/* ── Footer ────────────────────────────────── */}
      <footer className="footer section-wrap">
        <p>© {new Date().getFullYear()} Thesis AI</p>
        <nav>
          <a href="/docs">Docs</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="mailto:hello@thesisai.app">Contact</a>
        </nav>
      </footer>
    </main>
  );
}
