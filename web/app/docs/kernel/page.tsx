const layers = [
  {
    label: 'AgentContext',
    role: 'Input',
    description:
      'The full request context every agent receives: symbols, intent, user_id, pre-fetched portfolio data, and session notes. Agents are pure — they read context, invoke tools, return results. No side effects.',
    tag: 'Core Type',
    tagClass: 'docs-tag-blue',
  },
  {
    label: 'BaseTool',
    role: 'Data Interface',
    description:
      'Abstract contract for external data fetching. Agents never call market data services directly — they invoke tools. This makes agent logic testable (swap real tools for mocks) and the data dependency graph explicit.',
    tag: 'Interface',
    tagClass: 'docs-tag-blue',
  },
  {
    label: 'BaseAgent',
    role: 'Intelligence Unit',
    description:
      'Abstract contract all specialist agents implement. One method: run(ctx) → AgentResult. Must never raise — degrade gracefully with _error_result(). Must never invent data — only use what tools return. Must never issue trade instructions.',
    tag: 'Interface',
    tagClass: 'docs-tag-blue',
  },
  {
    label: 'MemoryInterface',
    role: 'Recall Layer',
    description:
      'Abstract interface for cross-session agent memory. Current implementation: EphemeralMemory (in-process, non-persistent). Future: PgvectorMemory backed by PostgreSQL pgvector for semantic RAG over research history.',
    tag: 'Stub → pgvector',
    tagClass: 'docs-tag-yellow',
  },
  {
    label: 'BaseStrategy',
    role: 'Signal Generation',
    description:
      'Converts agent evidence (AgentResult list) into directional StrategySignals: symbol, direction (bull/bear/neutral), score (-1.0 to +1.0), conviction (0.0 to 1.0). Pure function — no data fetching. Bridges research and execution.',
    tag: 'Stub → Live',
    tagClass: 'docs-tag-yellow',
  },
  {
    label: 'RiskEngine',
    role: 'Risk Filter',
    description:
      'Abstract risk engine that filters and sizes strategy signals within a risk budget. Returns a RiskAssessment: approved signals, rejected signals, portfolio heat score (0–1), and human-readable risk flags.',
    tag: 'Stub → Live',
    tagClass: 'docs-tag-yellow',
  },
  {
    label: 'InvestmentManager',
    role: 'Orchestrator',
    description:
      'Central orchestrator. Routes AgentContext to the right agents, runs them in parallel, aggregates outputs into a structured evidence bundle. Does NOT synthesize the final LLM response — that stays in the API layer, keeping the kernel transport-agnostic.',
    tag: 'Live',
    tagClass: 'docs-tag-green',
  },
];

const tools = [
  {
    name: 'MarketDataTool',
    wraps: 'MarketDataService (Massive API)',
    actions: 'quote · bars · fundamentals · news · market_status · movers · indicator',
  },
  {
    name: 'MacroDataTool',
    wraps: 'get_macro_snapshot() (FRED API)',
    actions: 'Fed rate · CPI · unemployment · GDP · 2Y/10Y yields · regime label',
  },
];

export default function DocsKernel() {
  return (
    <article>
      <p className="docs-eyebrow">System</p>
      <h1>AI Research Kernel</h1>
      <p className="docs-lead">
        The kernel is the intelligence layer beneath every surface — mobile app, web, CLI,
        and eventually internal fund infrastructure. It is intentionally independent of any
        transport protocol, UI framework, or database driver.
      </p>

      <div className="docs-callout info">
        <p className="docs-callout-title">Design Principle</p>
        <p>
          If the kernel is clean, the same agent logic can power the iOS chat, a desktop
          research tool, a scheduled signal pipeline, and a hedge fund allocation engine —
          without any changes to the agents themselves.
        </p>
      </div>

      <h2>Why a Kernel?</h2>
      <p>
        Most AI applications couple intelligence to infrastructure: agents call databases
        directly, LLM prompts are hardcoded in route handlers, data fetching is mixed with
        analysis logic. This makes the system brittle — swapping a data vendor or changing
        the UI breaks the intelligence layer.
      </p>
      <p>
        The Thesis kernel inverts this. Agents are pure functions of their inputs. Tools
        are swappable adapters. The orchestrator is stateless. The result is a system that
        can be tested without a live API key, extended without touching existing agents,
        and wired to new surfaces without refactoring.
      </p>

      <h2>Kernel Layer Map</h2>
      <div className="docs-arch-diagram">{`
  ┌─────────────────────────────────────────────────────────────────┐
  │                        API / UI Surface                         │
  │         (FastAPI route · Mobile app · CLI · Desktop)            │
  └───────────────────────────┬─────────────────────────────────────┘
                              │ AgentContext
  ┌───────────────────────────▼─────────────────────────────────────┐
  │                    InvestmentManager                            │
  │                     (Orchestrator)                              │
  │    routes → selects agents → runs in parallel → aggregates      │
  └──────┬──────────┬──────────┬──────────┬──────────┬─────────────┘
         │          │          │          │          │
    MacroAgent  NewsAgent  FundAgent  PriceAgent  PortAgent
         │          │          │          │          │
  ┌──────▼──────────▼──────────▼──────────▼──────────▼─────────────┐
  │                        Tool Layer                               │
  │            MacroDataTool · MarketDataTool                       │
  └──────────────────────────────────────────────────────────────────┘
                              │
  ┌───────────────────────────▼─────────────────────────────────────┐
  │                      External APIs                              │
  │                 FRED API · Massive API                          │
  └─────────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────────┐
  │               Future Layers (Phase 3–4)                         │
  │   MemoryInterface → pgvector RAG                                │
  │   BaseStrategy    → signal scoring, regime models               │
  │   RiskEngine      → position sizing, drawdown guards            │
  └─────────────────────────────────────────────────────────────────┘
`}</div>

      <h2>Core Abstractions</h2>
      {layers.map((layer) => (
        <div key={layer.label} className="agent-card">
          <div className="agent-card-header">
            <span className="agent-card-dot" />
            <span className="agent-card-name">
              <code style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.95rem', color: 'inherit', fontFamily: 'inherit' }}>
                {layer.label}
              </code>
            </span>
            <span className={`docs-tag ${layer.tagClass}`}>{layer.tag}</span>
          </div>
          <p className="agent-card-desc">
            <strong>{layer.role} —</strong> {layer.description}
          </p>
        </div>
      ))}

      <h2>Tool Layer</h2>
      <p>
        Tools are the only mechanism by which agents access external data. Every tool
        implements <code>BaseTool.call(**kwargs) → Any</code> and raises{' '}
        <code>ToolError</code> on failure. Agents catch <code>ToolError</code> and degrade
        gracefully — they never propagate exceptions to the orchestrator.
      </p>
      <div className="docs-table-wrap">
        <table className="docs-table">
          <thead>
            <tr>
              <th>Tool</th>
              <th>Wraps</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tools.map((t) => (
              <tr key={t.name}>
                <td><code>{t.name}</code></td>
                <td>{t.wraps}</td>
                <td><code style={{ fontSize: '0.75em' }}>{t.actions}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>AgentResult Contract</h2>
      <p>
        Every agent returns the same structured type. The orchestrator builds the evidence
        layer from a list of these before passing it to the LLM synthesis step.
      </p>
      <pre>
        <code>{`@dataclass
class AgentResult:
    agent_key:   str           # matches kernel registry key
    name:        str           # display name
    summary:     str           # one-sentence finding
    confidence:  int           # 0–100: agent's self-assessed confidence
    signals:     list[str]     # 2–5 structured bullets
    data:        dict[str,Any] # raw typed data for downstream use
    tool_calls:  list[str]     # audit trail of tools invoked`}</code>
      </pre>

      <h2>What&#39;s a Stub</h2>
      <p>
        <strong>MemoryInterface</strong>, <strong>BaseStrategy</strong>, and{' '}
        <strong>RiskEngine</strong> are defined as abstract interfaces today. The interfaces
        are stable — adding a pgvector memory backend or a momentum strategy module does
        not require changing any existing agent code. The kernel is designed to grow into
        the hedge fund infrastructure without architectural rewrites.
      </p>

      <h2>Research Console</h2>
      <p>
        The kernel exposes a <strong>research console</strong> at{' '}
        <a href="/console"><code>/console</code></a> — an internal web UI where you can
        trigger any agent combination, inspect raw evidence bundles, see which tools were
        called, and validate routing decisions. This is the primary tool for iterating on
        agent logic without going through the mobile app.
      </p>

      <div className="docs-page-nav">
        <a href="/docs/architecture">
          <span className="docs-page-nav-dir">Previous</span>
          <span>System Architecture</span>
        </a>
        <a href="/docs/agents" className="next">
          <span className="docs-page-nav-dir">Next</span>
          <span>Agent Framework</span>
        </a>
      </div>
    </article>
  );
}
