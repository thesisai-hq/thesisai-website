const steps = [
  {
    num: '1',
    title: 'User Submits a Query',
    detail:
      'The user types a research question or selects a symbol in the mobile app. Common query types include "What\'s moving NVDA today?", "Give me a macro read", or "How is my portfolio positioned?" The app sends the query along with the user\'s portfolio and watchlist context to the API.',
  },
  {
    num: '2',
    title: 'Context Assembly',
    detail:
      'The API assembles a full research context: the user\'s portfolio holdings (symbols, sizes), their watchlist, current portfolio exposure, and any active session notes from prior turns. This context is passed to the Investment Manager so agents receive personalized, not generic, inputs.',
  },
  {
    num: '3',
    title: 'Intent Detection & Agent Routing',
    detail:
      'The Investment Manager analyzes the query for intent signals. Keywords like "rates" or "Fed" route to the Macro Agent. A ticker symbol triggers Price, Fundamentals, and News in parallel. "Holdings" routes to the Portfolio Agent. Ambiguous queries run the full default agent set.',
  },
  {
    num: '4',
    title: 'Data Fetching',
    detail:
      'Each selected agent fetches its required data. The Macro Agent pulls the latest FRED snapshot (Fed rate, CPI, unemployment, yields). The Fundamentals Agent fetches company ratios from Massive API. The News Agent retrieves recent headlines. Price & Trend Agent fetches OHLC bars. Data is cached in Redis to avoid redundant vendor calls.',
  },
  {
    num: '5',
    title: 'Parallel Agent Execution',
    detail:
      'Selected agents run in parallel, each receiving a structured data snapshot and their role-specific prompt. Every agent returns a structured output: a one-sentence summary, a confidence score (0–100), 2–5 signal bullets, and typed data fields. Agents are constrained to the provided data — they cannot invent figures.',
  },
  {
    num: '6',
    title: 'Evidence Layer Aggregation',
    detail:
      'The Investment Manager collects all agent outputs into a unified evidence layer. Signals are ranked by relevance and confidence. Conflicts between agents (e.g., bullish fundamentals vs. bearish macro) are flagged and included in the synthesis context.',
  },
  {
    num: '7',
    title: 'Thesis Synthesis',
    detail:
      'The synthesis engine receives the full evidence layer and produces the final output: a Bull / Bear / Neutral framing, a narrative explanation, a ranked list of catalysts and risks, and an overall confidence score. The output is structured for mobile consumption — scannable, concise, and source-aware.',
  },
  {
    num: '8',
    title: 'Streaming Delivery',
    detail:
      'The response streams to the mobile client via Server-Sent Events (SSE), so users see the thesis building in real time rather than waiting for a complete response. The app renders the thesis card, signals, and confidence score as chunks arrive.',
  },
];

export default function DocsWorkflow() {
  return (
    <article>
      <p className="docs-eyebrow">System</p>
      <h1>Research Workflow</h1>
      <p className="docs-lead">
        Every research request in Thesis AI follows an eight-step pipeline: from user query to
        streamed thesis output. Each step is designed to minimize latency, maximize signal quality,
        and ensure output is grounded in verifiable data.
      </p>

      <h2>Pipeline Overview</h2>
      <div className="docs-arch-diagram">{`
  User Query + Portfolio Context
           │
           ▼
  ┌─────────────────────┐
  │  Investment Manager │  ← Intent detection
  │    (Orchestrator)   │  ← Agent selection
  └────────┬────────────┘
           │
     ┌─────┼─────┬──────┐
     ▼     ▼     ▼      ▼
  Macro  News  Price  Fundmtl  ← Parallel execution
     │     │     │      │
     └─────┴─────┴──────┘
                │
                ▼
       Evidence Layer
       (aggregated signals)
                │
                ▼
       Synthesis Engine
                │
                ▼
       Thesis Output (SSE stream)
`}</div>

      <h2>Step-by-Step</h2>
      <div className="workflow-steps">
        {steps.map((step) => (
          <div key={step.num} className="workflow-step">
            <div className="workflow-step-num">{step.num}</div>
            <div className="workflow-step-content">
              <h4>{step.title}</h4>
              <p>{step.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>Output Format</h2>
      <p>
        The final thesis output follows a consistent structure regardless of which agents ran:
      </p>
      <div className="docs-table-wrap">
        <table className="docs-table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Stance</strong></td>
              <td>Bull / Bear / Neutral — the overall directional read</td>
            </tr>
            <tr>
              <td><strong>Confidence</strong></td>
              <td>0–100 score reflecting data quality and signal agreement across agents</td>
            </tr>
            <tr>
              <td><strong>Narrative</strong></td>
              <td>Plain-language explanation of the thesis, written for mobile readability</td>
            </tr>
            <tr>
              <td><strong>Catalysts</strong></td>
              <td>Ranked list of bullish drivers with source attribution</td>
            </tr>
            <tr>
              <td><strong>Risks</strong></td>
              <td>Ranked list of bearish risks or headwinds</td>
            </tr>
            <tr>
              <td><strong>Agent signals</strong></td>
              <td>Collapsible per-agent breakdowns (Macro, News, Fundamentals, etc.)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Caching & Performance</h2>
      <p>
        Market data responses are cached in Redis with short TTLs (seconds to minutes depending on
        data type). Real-time quotes are cached for 15 seconds. Fundamental snapshots are cached for
        up to 24 hours. Macro snapshots are refreshed every hour via a Celery scheduled task.
      </p>
      <p>
        This layered caching strategy lets the platform serve fast responses during peak usage
        without hammering vendor APIs on every request.
      </p>

      <div className="docs-page-nav">
        <a href="/docs/agents">
          <span className="docs-page-nav-dir">Previous</span>
          <span>Agent Framework</span>
        </a>
        <a href="/docs/data-sources" className="next">
          <span className="docs-page-nav-dir">Next</span>
          <span>Data Sources</span>
        </a>
      </div>
    </article>
  );
}
