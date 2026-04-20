'use client';

import { useEffect, useRef, useState } from 'react';

// ── Types ────────────────────────────────────────────────────────────

interface AgentMeta {
  key: string;
  name: string;
  description: string;
}

interface AgentOutput {
  key: string;
  name: string;
  summary: string;
  confidence: number;
  signals: string[];
  tool_calls: string[];
  data_keys: string[];
}

interface Bundle {
  symbols: string[];
  intent: string | null;
  generated_at: string;
  selection: {
    selected: string[];
    rationale: string[];
  };
  agents: AgentOutput[];
}

// ── Helpers ──────────────────────────────────────────────────────────

function confidenceColor(n: number): string {
  if (n >= 75) return '#059669';
  if (n >= 55) return '#d97706';
  return '#dc2626';
}

function SkeletonCards() {
  return (
    <div className="console-skeleton">
      {[0, 1, 2].map((i) => (
        <div key={i} className="console-skel-card">
          <div className="console-skel-line short" />
          <div className="console-skel-line mid" />
          <div className="console-skel-line" />
          <div className="console-skel-line mid" />
        </div>
      ))}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────

export default function ConsolePage() {
  const [agents, setAgents] = useState<AgentMeta[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [autoRoute, setAutoRoute] = useState(true);
  const [symbols, setSymbols] = useState('');
  const [intent, setIntent] = useState('');
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  // Load agent registry on mount
  useEffect(() => {
    fetch('/api/console/agents')
      .then((r) => r.json())
      .then((d) => {
        const list: AgentMeta[] = d.agents ?? [];
        setAgents(list);
        setSelectedKeys(new Set(list.map((a) => a.key)));
      })
      .catch(() => {
        // API offline — show placeholder agents so UI is still usable
        const placeholders: AgentMeta[] = [
          { key: 'macro', name: 'Macro Agent', description: 'Macro regime, rates, inflation.' },
          { key: 'news', name: 'News Agent', description: 'Catalysts and sentiment.' },
          { key: 'fundamentals', name: 'Fundamentals Agent', description: 'Valuation and balance sheet.' },
          { key: 'price_trend', name: 'Price & Trend Agent', description: 'Momentum and trend.' },
          { key: 'portfolio', name: 'Portfolio Agent', description: 'Concentration and exposure.' },
        ];
        setAgents(placeholders);
        setSelectedKeys(new Set(placeholders.map((a) => a.key)));
      });
  }, []);

  function toggleAgent(key: string) {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function handleRun(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setBundle(null);

    const body = {
      symbols: symbols
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean),
      intent: intent.trim() || null,
      agent_keys: autoRoute ? null : [...selectedKeys],
    };

    try {
      const res = await fetch('/api/console/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? `Server error ${res.status}`);
      } else {
        setBundle(data as Bundle);
        setTimeout(() => mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' }), 50);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="console-root">
      {/* ── Header ── */}
      <header className="console-header">
        <a href="/" className="console-brand">
          <img src="/branding/Light mode-Thesis AI Logo - transparent.png" alt="Thesis AI" />
          <span>Thesis AI</span>
          <span className="console-brand-sep">/</span>
          <span className="console-brand-sub">Research Console</span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className="console-env-badge">Internal</span>
          <nav className="console-header-nav">
            <a href="/docs">Docs</a>
          </nav>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="console-body">
        {/* ── Sidebar ── */}
        <aside className="console-sidebar">
          <form className="console-form" onSubmit={handleRun}>
            {/* Symbols */}
            <div className="console-field">
              <label className="console-label" htmlFor="symbols">
                Symbols
              </label>
              <input
                id="symbols"
                className="console-input"
                type="text"
                placeholder="AAPL, NVDA, MSFT"
                value={symbols}
                onChange={(e) => setSymbols(e.target.value)}
              />
            </div>

            {/* Intent */}
            <div className="console-field">
              <label className="console-label" htmlFor="intent">
                Intent / Query
              </label>
              <textarea
                id="intent"
                className="console-textarea"
                placeholder="Why is NVDA moving? Or leave blank for default coverage."
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
              />
            </div>

            {/* Routing toggle */}
            <div className="console-field">
              <p className="console-sidebar-title">Agent Routing</p>
              <label className="console-agent-check" style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={autoRoute}
                  onChange={(e) => setAutoRoute(e.target.checked)}
                />
                <div>
                  <div className="console-agent-check-name">Auto-route</div>
                  <div className="console-agent-check-desc">
                    Let the Investment Manager select agents based on intent.
                  </div>
                </div>
              </label>
            </div>

            {/* Agent selector */}
            {!autoRoute && (
              <div className="console-field">
                <p className="console-sidebar-title">Select Agents</p>
                <div className="console-agent-list">
                  {agents.map((agent) => (
                    <label key={agent.key} className="console-agent-check">
                      <input
                        type="checkbox"
                        checked={selectedKeys.has(agent.key)}
                        onChange={() => toggleAgent(agent.key)}
                      />
                      <div>
                        <div className="console-agent-check-name">{agent.name}</div>
                        <div className="console-agent-check-desc">{agent.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button className="console-run-btn" type="submit" disabled={loading}>
              {loading ? 'Running…' : 'Run Pipeline'}
            </button>
          </form>
        </aside>

        {/* ── Main output ── */}
        <main className="console-main" ref={mainRef}>
          {/* Error */}
          {error && (
            <div className="console-error">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Loading */}
          {loading && <SkeletonCards />}

          {/* Empty state */}
          {!loading && !bundle && !error && (
            <div className="console-empty">
              <div className="console-empty-icon">⬡</div>
              <h3>No pipeline run yet</h3>
              <p>
                Enter symbols or an intent query in the sidebar, then hit{' '}
                <strong>Run Pipeline</strong> to inspect raw agent outputs.
              </p>
            </div>
          )}

          {/* Bundle output */}
          {bundle && !loading && (
            <>
              {/* Bundle header */}
              <div className="console-bundle-header">
                <div className="console-bundle-meta">
                  {bundle.symbols.length > 0 && (
                    <span className="console-tag console-tag-blue">
                      {bundle.symbols.join(', ')}
                    </span>
                  )}
                  <span className="console-tag console-tag-green">
                    {bundle.agents.length} agent{bundle.agents.length !== 1 ? 's' : ''} ran
                  </span>
                  <span className="console-tag console-tag-muted">
                    {autoRoute ? 'auto-routed' : 'manual selection'}
                  </span>
                </div>
                <span className="console-timestamp">
                  {new Date(bundle.generated_at).toLocaleTimeString()}
                </span>
              </div>

              {/* Routing rationale */}
              {bundle.selection.rationale.length > 0 && (
                <div className="console-routing">
                  <div className="console-routing-title">Routing Decision</div>
                  <ul className="console-routing-rationale">
                    {bundle.selection.rationale.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Agent cards */}
              {bundle.agents.map((agent) => (
                <div key={agent.key} className="console-agent-card">
                  <div className="console-agent-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: confidenceColor(agent.confidence),
                          flexShrink: 0,
                          display: 'inline-block',
                        }}
                      />
                      <span className="console-agent-card-name">{agent.name}</span>
                    </div>
                    <div className="console-confidence">
                      <div className="console-confidence-bar-wrap">
                        <div
                          className="console-confidence-bar"
                          style={{
                            width: `${agent.confidence}%`,
                            background: `linear-gradient(90deg, ${confidenceColor(agent.confidence)}, ${confidenceColor(agent.confidence)}aa)`,
                          }}
                        />
                      </div>
                      <span className="console-confidence-val">{agent.confidence}%</span>
                    </div>
                  </div>

                  <div className="console-agent-card-body">
                    {/* Summary */}
                    <p className="console-summary">{agent.summary}</p>

                    {/* Signals */}
                    {agent.signals.length > 0 && (
                      <ul className="console-signals">
                        {agent.signals.map((s, i) => (
                          <li key={i} className="console-signal-item">
                            <span className="console-signal-bullet">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Tool calls */}
                    {agent.tool_calls.length > 0 && (
                      <div>
                        <div className="console-section-label" style={{ marginBottom: '0.35rem' }}>
                          Tools Invoked
                        </div>
                        <div className="console-tools">
                          {agent.tool_calls.map((t, i) => (
                            <span key={i} className="console-tool-chip">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Data keys */}
                    {agent.data_keys.length > 0 && (
                      <div>
                        <div className="console-section-label" style={{ marginBottom: '0.35rem' }}>
                          Data Fields
                        </div>
                        <div className="console-data-keys">
                          {agent.data_keys.map((k) => (
                            <span key={k} className="console-data-key">
                              {k}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
