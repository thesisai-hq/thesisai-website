const phases = [
  {
    phase: 'Phase 1 — Intelligence Engine',
    subtitle: 'Consumer app as research surface. Kernel as foundation.',
    tag: 'Now · Private Beta',
    tagClass: 'docs-tag-green',
    active: true,
    items: [
      'iOS TestFlight distribution for early access investors',
      'Multi-agent research kernel: Macro, Fundamentals, News, Price, Portfolio agents',
      'InvestmentManager orchestrator with intent-based routing',
      'Tool interface layer: MarketDataTool, MacroDataTool',
      'Real-time AI chat with streaming responses via Claude',
      'Daily market brief generation',
      'Portfolio and watchlist management',
      'Thesis cards with confidence scoring',
      'Internal research console at /console for agent inspection',
    ],
  },
  {
    phase: 'Phase 2 — Research Platform',
    subtitle: 'Persistent memory. Real-time signals. Power user surface.',
    tag: 'Near Term',
    tagClass: 'docs-tag-blue',
    active: false,
    items: [
      'pgvector memory backend — RAG over research history and earnings transcripts',
      'Live portfolio sync and real-time market data during trading hours',
      'Push notifications when the thesis on a holding materially shifts',
      'Persistent conversation memory across sessions',
      'Saved research, thesis card history, and search',
      'Confidence calibration tuned on beta feedback',
      'Thesis Pro desktop client (lightweight, kernel-native)',
      'Android access',
    ],
  },
  {
    phase: 'Phase 3 — Fund Infrastructure',
    subtitle: 'Strategy layer. Risk engine. Systematic signal pipeline.',
    tag: 'Planned',
    tagClass: 'docs-tag-yellow',
    active: false,
    items: [
      'BaseStrategy layer: regime-conditional signal weighting',
      'RiskEngine: VaR constraints, Kelly sizing, concentration limits, drawdown guards',
      'Regime detection: HMM-based macro regime classification',
      'Factor model integration: momentum, value, quality scoring',
      'Bayesian signal updating — posterior conviction from agent evidence',
      'Graph database for cross-asset relationship and sector mapping',
      'Automated research memos (PDF) with full agent attribution',
      'Compliance-grade audit log of all agent decisions and data sources',
    ],
  },
  {
    phase: 'Phase 4 — AI-Native Hedge Fund',
    subtitle: 'Full allocation pipeline. Institutional infrastructure. Developer API.',
    tag: 'Future Vision',
    tagClass: 'docs-tag-muted',
    active: false,
    items: [
      'Automated signal scoring → risk-adjusted position sizing → execution integration',
      'Capital allocation dashboard with full pipeline visibility',
      'Developer API: expose the kernel to third-party integrations and white-label use',
      'Institutional dashboard for external capital and reporting',
      'Data partnerships: alternative data ingestion (satellite, web scraping, filings)',
      'Custom agent configuration and strategy module builder',
      'Webhooks for real-time thesis event delivery',
    ],
  },
];

export default function DocsRoadmap() {
  return (
    <article>
      <p className="docs-eyebrow">Product</p>
      <h1>Roadmap</h1>
      <p className="docs-lead">
        Thesis AI is being built in four phases toward a single destination: an AI-native
        investment intelligence system that powers both consumer research and institutional
        capital allocation from the same kernel.
      </p>

      <div className="docs-callout info">
        <p className="docs-callout-title">Strategic Frame</p>
        <p>
          The consumer app is distribution and a feedback loop. The kernel is the moat.
          Every phase adds a layer to the same architecture — nothing gets thrown away,
          everything compounds.
        </p>
      </div>

      <h2>Four Phases</h2>
      {phases.map((phase) => (
        <div key={phase.phase} className={`roadmap-phase${phase.active ? ' active' : ''}`}>
          <div className="roadmap-phase-header">
            <div>
              <div className="roadmap-phase-title">{phase.phase}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--docs-muted)', marginTop: '0.15rem' }}>
                {phase.subtitle}
              </div>
            </div>
            <span className={`docs-tag ${phase.tagClass}`}>{phase.tag}</span>
          </div>
          <ul>
            {phase.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}

      <h2>Why This Architecture Works</h2>
      <p>
        The kernel was designed from day one to support all four phases without an
        architectural rewrite. Key decisions that enable this:
      </p>
      <ul>
        <li>
          <strong>Transport-agnostic kernel</strong> — InvestmentManager takes an
          AgentContext and returns a dict. It has no knowledge of HTTP, mobile, or UI.
          Plugging it into a new surface requires zero kernel changes.
        </li>
        <li>
          <strong>Tool interface layer</strong> — agents never call market data services
          directly. Swapping a data vendor means updating one tool class, not every agent.
        </li>
        <li>
          <strong>pgvector in the schema from day one</strong> — the database already
          supports semantic vector search. When the memory backend is wired, RAG is
          additive — not a migration.
        </li>
        <li>
          <strong>Strategy / Risk as interfaces</strong> — the BaseStrategy and RiskEngine
          abstractions are defined but unimplemented. Any strategy can be added without
          touching agent logic. The architecture anticipates the fund layer.
        </li>
        <li>
          <strong>Stateless orchestrator</strong> — context is passed explicitly per
          request. The InvestmentManager is horizontally scalable without shared state.
        </li>
        <li>
          <strong>LLM abstraction</strong> — Claude / Ollama fallback means the LLM
          backend can be upgraded or replaced without touching agent prompts.
        </li>
      </ul>

      <h2>API Access</h2>
      <div className="docs-callout">
        <p className="docs-callout-title">Coming in Phase 4</p>
        <p>
          The developer API will expose the kernel&#39;s agent pipeline to third-party
          applications, institutional dashboards, and custom integrations. If you are
          interested in early access, <a href="mailto:hello@thesisai.app">reach out</a>.
        </p>
      </div>

      <div className="docs-page-nav">
        <a href="/docs/data-sources">
          <span className="docs-page-nav-dir">Previous</span>
          <span>Data Sources</span>
        </a>
        <div className="docs-page-nav-spacer" />
      </div>
    </article>
  );
}
