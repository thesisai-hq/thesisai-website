const agents = [
  {
    key: 'macro',
    name: 'Macro Agent',
    tag: 'Macro',
    description:
      'Assesses the current macro regime using real-time economic data: Fed funds rate, CPI, unemployment, GDP growth, and Treasury yield curves. Identifies the dominant risk-on / risk-off environment and the 1–2 most important macro tailwinds or headwinds for the next 4–8 weeks.',
    specialties: ['rates', 'inflation', 'policy', 'regime', 'yield curve'],
    output: 'Macro regime summary + 3–5 signal bullets + key risk / key upside',
  },
  {
    key: 'fundamentals',
    name: 'Fundamentals Agent',
    tag: 'Fundamentals',
    description:
      'Reviews company-level valuation, profitability, and balance sheet health using earnings data, P/E ratios, ROE, debt-to-equity, and operating margins. Provides a structured three-part assessment without issuing buy or sell labels.',
    specialties: ['valuation', 'earnings', 'balance sheet', 'margins', 'P/E', 'ROE'],
    output: 'Valuation / Profitability / Balance sheet summary + one strength + one risk',
  },
  {
    key: 'news',
    name: 'News Agent',
    tag: 'News',
    description:
      'Surfaces the most relevant headlines for the requested symbols and explains why they move the stock. Focuses on catalyst identification, sentiment directionality, and the "why now" context that retail investors typically lack.',
    specialties: ['headlines', 'sentiment', 'catalyst', 'why is it moving'],
    output: '3–5 headline bullets with relevance notes + single-sentence synthesis',
  },
  {
    key: 'price_trend',
    name: 'Price & Trend Agent',
    tag: 'Technical',
    description:
      'Evaluates recent price action and short-term momentum using OHLC bar data and technical indicators. Identifies whether a symbol is in an uptrend, downtrend, or range, and flags notable inflection points.',
    specialties: ['price action', 'momentum', 'trend', 'technical', 'chart'],
    output: '2–4 trend / momentum bullets + short-term directional outlook',
  },
  {
    key: 'portfolio',
    name: 'Portfolio Agent',
    tag: 'Portfolio',
    description:
      'Analyzes the user\'s current holdings for concentration risk, sector exposure imbalances, and today\'s most relevant risk callouts. Provides a portfolio-level read without individual trade instructions.',
    specialties: ['holdings', 'allocation', 'concentration', 'exposure', 'risk'],
    output: 'Top holding / sector exposure / risk callout + one monitoring recommendation',
  },
];

export default function DocsAgents() {
  return (
    <article>
      <p className="docs-eyebrow">System</p>
      <h1>Agent Framework</h1>
      <p className="docs-lead">
        Thesis uses five specialist AI agents, each responsible for a distinct dimension of
        investment analysis. An Investment Manager orchestrator routes requests to the right agents
        and synthesizes their structured outputs into a unified thesis.
      </p>

      <h2>The Investment Manager (Orchestrator)</h2>
      <p>
        The Investment Manager is the entry point for every research request. It receives the
        user&#39;s query plus contextual data — their portfolio holdings, watchlist symbols, and
        any active session context — and determines which specialist agents are relevant.
      </p>
      <p>
        Routing decisions are based on intent detection: keywords and symbols in the query map to
        agent specialties. When the intent is ambiguous, the orchestrator runs the full default
        agent set. After all agents return, the Investment Manager aggregates their outputs into an
        evidence layer and produces the final synthesis.
      </p>
      <div className="docs-callout info">
        <p className="docs-callout-title">Routing Logic</p>
        <p>
          Keywords like <em>&#34;rates&#34;</em> or <em>&#34;inflation&#34;</em> route to Macro.{' '}
          <em>&#34;Why is it moving?&#34;</em> routes to News. Providing a ticker symbol triggers
          Price, Fundamentals, and News in parallel. No strong signal runs the full default stack.
        </p>
      </div>

      <h2>Specialist Agents</h2>
      {agents.map((agent) => (
        <div key={agent.key} className="agent-card">
          <div className="agent-card-header">
            <span className="agent-card-dot" />
            <span className="agent-card-name">{agent.name}</span>
            <span className="docs-tag docs-tag-blue">{agent.tag}</span>
          </div>
          <p className="agent-card-desc">{agent.description}</p>
          <div className="agent-card-tags">
            {agent.specialties.map((s) => (
              <span key={s} className="agent-card-tag">
                {s}
              </span>
            ))}
          </div>
          <p style={{ margin: '0.65rem 0 0', fontSize: '0.8rem', color: 'var(--docs-muted)' }}>
            <strong style={{ color: 'var(--docs-text)' }}>Output:</strong> {agent.output}
          </p>
        </div>
      ))}

      <h2>Prompt Framework</h2>
      <p>
        Every agent uses the same reusable prompt structure. This ensures consistency, auditability,
        and predictable output format across all agents — critical for downstream synthesis.
      </p>
      <pre>
        <code>{`You are acting as [professional role].

Context:
[What exists today. Why this analysis matters.]

Objective:
[Exactly what needs to be accomplished.]

Deliverable:
[Specific output format, structure, length, and detail level.]

Constraints:
- Use only the provided data; do not invent figures.
- No trade recommendations or price targets.
- Keep horizon and scope within defined bounds.

Quality bar:
[Criteria for success: clarity, rigor, mobile-readability.]`}</code>
      </pre>

      <h2>Agent Output Contract</h2>
      <p>
        Every agent returns a structured object. The Investment Manager consumes these objects to
        build the evidence layer before synthesis.
      </p>
      <div className="docs-table-wrap">
        <table className="docs-table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>summary</code></td>
              <td>string</td>
              <td>Single-sentence finding from this agent.</td>
            </tr>
            <tr>
              <td><code>confidence</code></td>
              <td>integer 0–100</td>
              <td>Agent&#39;s confidence in its analysis given available data quality.</td>
            </tr>
            <tr>
              <td><code>signals</code></td>
              <td>string[]</td>
              <td>2–5 structured bullet points representing the key signals found.</td>
            </tr>
            <tr>
              <td><code>data</code></td>
              <td>object</td>
              <td>Structured fields for downstream use by the synthesis engine.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Design Principles</h2>
      <ul>
        <li>
          <strong>No hallucination</strong> — Agents are constrained to only use provided data.
          They cannot invent statistics or price targets.
        </li>
        <li>
          <strong>No trade instructions</strong> — Agents produce research, not execution signals.
          Output is always framed as analysis, never as advice.
        </li>
        <li>
          <strong>Mobile-first output</strong> — Every agent targets under 120 words and bullet
          structure, optimized for reading on a small screen.
        </li>
        <li>
          <strong>Source-aware</strong> — Each piece of analysis is tied to the data snapshot it
          was derived from, enabling full traceability.
        </li>
      </ul>

      <div className="docs-page-nav">
        <a href="/docs/architecture">
          <span className="docs-page-nav-dir">Previous</span>
          <span>System Architecture</span>
        </a>
        <a href="/docs/workflow" className="next">
          <span className="docs-page-nav-dir">Next</span>
          <span>Research Workflow</span>
        </a>
      </div>
    </article>
  );
}
