export default function DocsIntroduction() {
  return (
    <article>
      <p className="docs-eyebrow">Getting Started</p>
      <h1>What is Thesis AI?</h1>
      <p className="docs-lead">
        Thesis AI is a multi-agent investment research platform built for serious retail investors.
        It synthesizes macro signals, company fundamentals, news sentiment, and price action into
        clear, mobile-ready investment theses — in seconds.
      </p>

      <div className="docs-callout info">
        <p className="docs-callout-title">Private Beta</p>
        <p>
          Thesis AI is currently in private iOS beta via TestFlight.{' '}
          <a href="/#waitlist">Request access</a> to join the waitlist.
        </p>
      </div>

      <h2>Core Concept</h2>
      <p>
        Most retail investors face the same problem: too much information, not enough signal. News
        feeds, earnings reports, macro commentary, and price alerts all arrive simultaneously — but
        nothing explains what actually matters for <em>your</em> holdings, right now.
      </p>
      <p>
        Thesis AI solves this by deploying a team of specialized AI agents that work in parallel.
        Each agent analyzes a specific dimension of the market — macro environment, company
        fundamentals, news catalysts, price trend — and contributes structured signals to a shared
        evidence layer. A synthesis engine then assembles these signals into a single, source-aware
        thesis with a confidence score.
      </p>

      <h2>Who It&#39;s For</h2>
      <p>
        Thesis is designed for <strong>serious retail investors aged 18–30</strong> who manage
        their own portfolios and want institutional-quality research discipline on a mobile device.
        It is not a trading platform. It does not execute orders or give personalized financial
        advice. It gives you structured reasoning — fast.
      </p>

      <h2>Key Capabilities</h2>
      <ul>
        <li>
          <strong>Multi-agent research engine</strong> — Macro, Fundamentals, News, Price, and
          Portfolio agents run in parallel and contribute structured signals
        </li>
        <li>
          <strong>Portfolio-aware context</strong> — Agents are aware of your holdings and
          watchlist, so analysis is relevant to what you actually own
        </li>
        <li>
          <strong>Daily market brief</strong> — A fast, mobile-first summary of the macro regime
          and key developments, delivered each morning
        </li>
        <li>
          <strong>Thesis cards</strong> — Bull / Bear / Neutral framing with catalyst ranking,
          risk flags, and a confidence score per position
        </li>
        <li>
          <strong>Thesis alerts</strong> — Notifications when the thesis on a holding materially
          shifts, not just when price moves
        </li>
        <li>
          <strong>Source-aware output</strong> — Every claim is backed by data from verified
          market data vendors and macro sources
        </li>
      </ul>

      <h2>Not Financial Advice</h2>
      <div className="docs-callout note">
        <p className="docs-callout-title">Disclaimer</p>
        <p>
          Thesis AI provides research assistance and structured analysis. It is not a registered
          investment advisor and does not provide personalized financial advice. All outputs are for
          informational purposes only.
        </p>
      </div>

      <h2>How to Use These Docs</h2>
      <p>This documentation is organized into five sections:</p>
      <ul>
        <li>
          <a href="/docs/architecture">
            <strong>System Architecture</strong>
          </a>{' '}
          — How the platform is built: API layer, AI layer, data layer
        </li>
        <li>
          <a href="/docs/agents">
            <strong>Agent Framework</strong>
          </a>{' '}
          — The five specialist agents and how they work
        </li>
        <li>
          <a href="/docs/workflow">
            <strong>Research Workflow</strong>
          </a>{' '}
          — Step-by-step: from user query to thesis output
        </li>
        <li>
          <a href="/docs/data-sources">
            <strong>Data Sources</strong>
          </a>{' '}
          — Market data vendors and macro data integrations
        </li>
        <li>
          <a href="/docs/roadmap">
            <strong>Roadmap</strong>
          </a>{' '}
          — Where the platform is headed
        </li>
      </ul>

      <div className="docs-page-nav">
        <div className="docs-page-nav-spacer" />
        <a href="/docs/architecture" className="next">
          <span className="docs-page-nav-dir">Next</span>
          <span>System Architecture</span>
        </a>
      </div>
    </article>
  );
}
