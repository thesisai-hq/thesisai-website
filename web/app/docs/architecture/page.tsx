export default function DocsArchitecture() {
  return (
    <article>
      <p className="docs-eyebrow">System</p>
      <h1>System Architecture</h1>
      <p className="docs-lead">
        Thesis AI is a full-stack platform built on three primary layers: an API layer that handles
        requests and orchestration, an AI layer that runs multi-agent research, and a data layer
        that manages market data, user state, and caching.
      </p>

      <h2>High-Level Overview</h2>
      <div className="docs-arch-diagram">{`
  ┌─────────────────────────────────────────────────────┐
  │                  Mobile App (iOS)                   │
  │            Expo · React Native · TypeScript         │
  └──────────────────────┬──────────────────────────────┘
                         │ HTTPS / SSE streaming
  ┌──────────────────────▼──────────────────────────────┐
  │                   API Layer                         │
  │               FastAPI · Python 3.11                 │
  │    /v1/ai/chat · /v1/market-data · /v1/portfolios   │
  └─────────────┬───────────────────────────────────────┘
                │
  ┌─────────────▼───────────────────────────────────────┐
  │                    AI Layer                         │
  │         Investment Manager (Orchestrator)           │
  │                                                     │
  │   ┌─────────┐  ┌──────────┐  ┌──────┐  ┌───────┐  │
  │   │  Macro  │  │  Fundmtl │  │ News │  │ Price │  │
  │   │  Agent  │  │  Agent   │  │Agent │  │ Agent │  │
  │   └─────────┘  └──────────┘  └──────┘  └───────┘  │
  │                                                     │
  │              Evidence Layer · Synthesis             │
  └──────────────────────┬──────────────────────────────┘
                         │
  ┌──────────────────────▼──────────────────────────────┐
  │                   Data Layer                        │
  │  PostgreSQL (pgvector) · Redis · Celery Workers     │
  └────────────────┬────────────────────────────────────┘
                   │
  ┌────────────────▼────────────────────────────────────┐
  │              External Integrations                  │
  │        Massive API · FRED API · Anthropic API       │
  └─────────────────────────────────────────────────────┘
`}</div>

      <h2>API Layer</h2>
      <p>
        The backend is a <strong>FastAPI</strong> application running on Python 3.11. It exposes a
        versioned REST API at <code>/v1/</code> with streaming support via Server-Sent Events
        (SSE) for real-time AI output.
      </p>
      <h3>Key Endpoints</h3>
      <div className="docs-table-wrap">
        <table className="docs-table">
          <thead>
            <tr>
              <th>Endpoint</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>POST /v1/ai/chat</code></td>
              <td>Submit a research query. Streams the AI response via SSE.</td>
            </tr>
            <tr>
              <td><code>GET /v1/market-data/:symbol</code></td>
              <td>Fetch real-time quote, OHLC bars, and fundamentals for a symbol.</td>
            </tr>
            <tr>
              <td><code>GET /v1/macro/snapshot</code></td>
              <td>Returns the current macro snapshot: Fed rate, CPI, unemployment, yields.</td>
            </tr>
            <tr>
              <td><code>GET /v1/dashboard</code></td>
              <td>Aggregated portfolio and watchlist context for the authenticated user.</td>
            </tr>
            <tr>
              <td><code>GET /v1/insights</code></td>
              <td>Cached insight cards for the user&#39;s holdings and watchlist.</td>
            </tr>
            <tr>
              <td><code>GET /v1/news</code></td>
              <td>Recent headlines filtered to the user&#39;s watchlist and portfolio symbols.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>AI Layer</h2>
      <p>
        The AI layer is the core of Thesis. When a research query arrives, an{' '}
        <strong>Investment Manager</strong> orchestrator selects the appropriate specialist agents,
        runs them (in parallel where possible), aggregates their outputs into an evidence layer, and
        synthesizes a final thesis.
      </p>
      <p>
        The LLM backend uses <strong>Anthropic Claude</strong> (claude-sonnet-4-6) by default. For
        local development, <strong>Ollama</strong> serves as a drop-in fallback, enabling offline
        iteration without API costs.
      </p>
      <div className="docs-callout info">
        <p className="docs-callout-title">LLM Routing</p>
        <p>
          If <code>ANTHROPIC_API_KEY</code> is set, the system uses Claude. Otherwise it falls back
          to Ollama at <code>http://localhost:11434</code>. The model, context window, and prompt
          structure are identical in both modes.
        </p>
      </div>

      <h2>Data Layer</h2>
      <h3>PostgreSQL with pgvector</h3>
      <p>
        The primary database is <strong>PostgreSQL 16</strong> with the <code>pgvector</code>{' '}
        extension for semantic vector embeddings. It stores user accounts, watchlists, portfolio
        holdings, and generated insight cards with source citations.
      </p>
      <h3>Redis</h3>
      <p>
        <strong>Redis</strong> serves two purposes: an in-memory cache for market data responses
        (reducing vendor API calls) and the message broker for Celery background task workers.
      </p>
      <h3>Celery Workers</h3>
      <p>
        Background jobs — including scheduled macro snapshot refreshes and async insight
        generation — are managed by <strong>Celery</strong> with a Redis broker and a beat
        scheduler for periodic tasks.
      </p>

      <h2>Tech Stack Summary</h2>
      <div className="docs-table-wrap">
        <table className="docs-table">
          <thead>
            <tr>
              <th>Layer</th>
              <th>Technology</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Mobile App</td>
              <td>Expo · React Native 0.81 · TypeScript · Expo Router</td>
            </tr>
            <tr>
              <td>Web / Marketing</td>
              <td>Next.js 14 · React 19 · TypeScript</td>
            </tr>
            <tr>
              <td>API</td>
              <td>FastAPI · Uvicorn · Pydantic 2 · SQLAlchemy 2 (async)</td>
            </tr>
            <tr>
              <td>AI / LLM</td>
              <td>Anthropic Claude (primary) · Ollama (local fallback)</td>
            </tr>
            <tr>
              <td>Database</td>
              <td>PostgreSQL 16 + pgvector</td>
            </tr>
            <tr>
              <td>Cache / Queue</td>
              <td>Redis · Celery</td>
            </tr>
            <tr>
              <td>Market Data</td>
              <td>Massive API · FRED API</td>
            </tr>
            <tr>
              <td>Infrastructure</td>
              <td>Docker · docker-compose · Terraform</td>
            </tr>
            <tr>
              <td>Monorepo</td>
              <td>pnpm workspaces</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-page-nav">
        <a href="/docs">
          <span className="docs-page-nav-dir">Previous</span>
          <span>Introduction</span>
        </a>
        <a href="/docs/kernel" className="next">
          <span className="docs-page-nav-dir">Next</span>
          <span>AI Research Kernel</span>
        </a>
      </div>
    </article>
  );
}
