'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import posthog from 'posthog-js';
import { PriceChart } from '../../../../components/PriceChart';
import type { SnapshotData } from '../../../../lib/api/market';
import { getSnapshots, getMarketBars } from '../../../../lib/api/market';
import type { Bar } from '../../../../lib/api/market';
import type { AiContextResponse, AiThesisCard } from '../../../../lib/api/ai';
import { getAiContext, getAiThesisCards } from '../../../../lib/api/ai';
import type { AlertRule } from '../../../../lib/api/alerts';
import { getAlerts, setAlert, deleteAlert } from '../../../../lib/api/alerts';

interface PageProps {
  params: Promise<{ symbol: string }>;
}

type RangeKey = '1D' | '1W' | '1M' | '1Y';

const RANGE_CONFIG: Record<RangeKey, { interval: string; limit: number }> = {
  '1D': { interval: '1Min', limit: 390 },
  '1W': { interval: '5Min', limit: 200 },
  '1M': { interval: '1Day', limit: 30 },
  '1Y': { interval: '1Day', limit: 252 },
};

const ACTION_COLORS: Record<string, string> = {
  buy: '#4ade80',
  hold: '#fbbf24',
  watch: '#60c7ff',
  sell: '#f87171',
};

function fmt(v: number | null | undefined, digits = 2): string {
  if (v == null) return '—';
  return v.toFixed(digits);
}

function pct(v: number | null | undefined): string {
  if (v == null) return '—';
  const sign = v >= 0 ? '+' : '';
  return `${sign}${v.toFixed(2)}%`;
}

function deriveHeadline(data: AiContextResponse): string {
  return (
    data.context
      .split('\n')
      .find((l) => l.trim().length > 10)
      ?.replace(/^#+\s*/, '')
      .slice(0, 200) ?? 'AI analysis complete.'
  );
}

function deriveScore(data: AiContextResponse): number {
  const agents = data.agents?.results ?? [];
  if (agents.length === 0) return 0;
  return Math.round(agents.reduce((s, a) => s + a.confidence, 0) / agents.length);
}

export default function StockDetailPage({ params }: PageProps) {
  const { symbol: rawSymbol } = use(params);
  const symbol = rawSymbol.toUpperCase();
  const router = useRouter();

  const [snap, setSnap] = useState<SnapshotData | null>(null);
  const [aiContext, setAiContext] = useState<AiContextResponse | null>(null);
  const [thesisCards, setThesisCards] = useState<AiThesisCard[]>([]);
  const [bars, setBars] = useState<Bar[]>([]);
  const [alerts, setAlerts] = useState<AlertRule[]>([]);
  const [selectedRange, setSelectedRange] = useState<RangeKey>('1M');
  const [loadingChart, setLoadingChart] = useState(false);
  const [loading, setLoading] = useState(true);

  // Alert form state
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [alertThreshold, setAlertThreshold] = useState('');
  const [alertSaving, setAlertSaving] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [snapResult, ctxResult, cardsResult, barsResult] = await Promise.allSettled([
        getSnapshots([symbol]),
        getAiContext([symbol], `Provide a detailed thesis analysis for ${symbol}.`),
        getAiThesisCards([symbol]),
        getMarketBars(symbol, RANGE_CONFIG['1M'].interval, RANGE_CONFIG['1M'].limit),
      ]);

      if (snapResult.status === 'fulfilled') {
        setSnap(snapResult.value[symbol] ?? null);
      }
      if (ctxResult.status === 'fulfilled') {
        setAiContext(ctxResult.value);
      }
      if (cardsResult.status === 'fulfilled') {
        setThesisCards(cardsResult.value.cards);
      }
      if (barsResult.status === 'fulfilled') {
        setBars(barsResult.value);
      }

      // Load alerts — silent fail
      try {
        const alertData = await getAlerts(symbol);
        setAlerts(alertData);
      } catch { /* ok */ }

      posthog.capture('stock_viewed', { symbol });
      setLoading(false);
    }
    void load();
  }, [symbol]);

  async function loadChartBars(range: RangeKey) {
    setSelectedRange(range);
    setLoadingChart(true);
    try {
      const config = RANGE_CONFIG[range];
      const data = await getMarketBars(symbol, config.interval, config.limit);
      setBars(data);
    } catch { /* keep old bars */ }
    setLoadingChart(false);
  }

  async function handleSetAlert() {
    const threshold = parseFloat(alertThreshold);
    if (isNaN(threshold) || threshold <= 0) return;
    setAlertSaving(true);
    try {
      const alert = await setAlert(symbol, threshold);
      posthog.capture('price_alert_set', { symbol, threshold });
      setAlerts((prev) => [...prev, alert]);
      setAlertThreshold('');
      setShowAlertForm(false);
    } catch { /* silent */ }
    setAlertSaving(false);
  }

  async function handleDeleteAlert(id: string) {
    try {
      await deleteAlert(id);
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch { /* silent */ }
  }

  const closes = bars.map((b) => b.c);
  const headline = aiContext ? deriveHeadline(aiContext) : null;
  const score = aiContext ? deriveScore(aiContext) : null;
  const agents = aiContext?.agents?.results ?? [];
  const card = thesisCards.find((c) => c.symbol === symbol) ?? thesisCards[0] ?? null;

  // Derive action from agents (look for keyword in summaries)
  const actionRaw = agents.find((a) =>
    /\b(buy|hold|sell|watch)\b/i.test(a.summary),
  );
  const actionMatch = actionRaw
    ? (actionRaw.summary.match(/\b(buy|hold|sell|watch)\b/i)?.[0]?.toLowerCase() ?? null)
    : null;
  const actionColor = actionMatch ? ACTION_COLORS[actionMatch] : undefined;

  // Drivers = first few agent summaries; risks = signals from context
  const drivers = agents.slice(0, 3).map((a) => `${a.name}: ${a.summary.slice(0, 100)}`);
  const risks = agents.flatMap((a) => a.signals).slice(0, 4);

  const price = snap?.price ?? null;
  const changePercent = snap?.change_percent ?? null;
  const isPositive = (changePercent ?? 0) >= 0;

  if (loading) {
    return (
      <div className="sdp-loading">
        <div className="sdp-skel-header" />
        <div className="sdp-skel-body">
          <div className="sdp-skel-main">
            <div className="sdp-skel-card" />
            <div className="sdp-skel-chart" />
          </div>
          <div className="sdp-skel-side">
            <div className="sdp-skel-metrics" />
          </div>
        </div>
        <style jsx>{`
          .sdp-loading { display: flex; flex-direction: column; gap: 20px; }
          .sdp-skel-header {
            height: 36px; border-radius: 8px;
            background: var(--surface); border: 1px solid var(--border);
            animation: shimmer 1.5s ease-in-out infinite;
          }
          .sdp-skel-body { display: flex; gap: 24px; }
          .sdp-skel-main { flex: 2; display: flex; flex-direction: column; gap: 16px; }
          .sdp-skel-side { flex: 1; }
          .sdp-skel-card {
            height: 160px; border-radius: 14px;
            background: var(--surface); border: 1px solid var(--border);
            animation: shimmer 1.5s ease-in-out infinite;
          }
          .sdp-skel-chart {
            height: 180px; border-radius: 12px;
            background: var(--surface); border: 1px solid var(--border);
            animation: shimmer 1.5s ease-in-out infinite;
          }
          .sdp-skel-metrics {
            height: 300px; border-radius: 12px;
            background: var(--surface); border: 1px solid var(--border);
            animation: shimmer 1.5s ease-in-out infinite;
          }
          @keyframes shimmer { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
        `}</style>
      </div>
    );
  }

  return (
    <div className="sdp">
      {/* Back button + title row */}
      <div className="sdp-nav">
        <button className="sdp-back" onClick={() => router.back()}>
          ← Back
        </button>
        <div className="sdp-title-group">
          <h1 className="sdp-symbol">{symbol}</h1>
          {price != null && (
            <span className="sdp-price">${fmt(price)}</span>
          )}
          {changePercent != null && (
            <span className={`sdp-change ${isPositive ? 'positive' : 'negative'}`}>
              {pct(changePercent)}
            </span>
          )}
        </div>
      </div>

      <div className="sdp-body">
        {/* Main column */}
        <div className="sdp-main">

          {/* AI Thesis Hero */}
          <div className="sdp-thesis-hero">
            <div className="sdp-thesis-header">
              <span className="sdp-thesis-eyebrow">AI Thesis</span>
              {actionMatch && (
                <span
                  className="sdp-action-badge"
                  style={{ color: actionColor, borderColor: actionColor, background: `${actionColor}18` }}
                >
                  {actionMatch.toUpperCase()}
                </span>
              )}
              {score != null && (
                <span className="sdp-score-badge">
                  <span className="sdp-score-num">{score}</span>
                  <span className="sdp-score-denom">/100</span>
                </span>
              )}
            </div>

            {headline && <p className="sdp-thesis-headline">{headline}</p>}

            <div className="sdp-thesis-cols">
              {drivers.length > 0 && (
                <div className="sdp-thesis-col">
                  <span className="sdp-col-label" style={{ color: '#4ade80' }}>Drivers</span>
                  <ul className="sdp-col-list">
                    {drivers.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
              )}
              {risks.length > 0 && (
                <div className="sdp-thesis-col">
                  <span className="sdp-col-label" style={{ color: '#f87171' }}>Risks</span>
                  <ul className="sdp-col-list">
                    {risks.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Price chart */}
          <div className="sdp-chart-card">
            <div className="sdp-chart-header">
              <span className="sdp-chart-title">Price History</span>
              <div className="sdp-range-btns">
                {(Object.keys(RANGE_CONFIG) as RangeKey[]).map((r) => (
                  <button
                    key={r}
                    className={`sdp-range-btn ${selectedRange === r ? 'active' : ''}`}
                    onClick={() => loadChartBars(r)}
                    disabled={loadingChart}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="sdp-chart-body" style={{ opacity: loadingChart ? 0.5 : 1 }}>
              <PriceChart closes={closes} height={150} showGrid />
            </div>
          </div>

          {/* AI Signals */}
          {card && card.signals.length > 0 && (
            <div className="sdp-signals-card">
              <span className="sdp-signals-title">AI Signals</span>
              <div className="sdp-signals-list">
                {card.signals.map((s, i) => (
                  <div key={i} className="sdp-signal-row">
                    <span className="sdp-signal-dot" />
                    <span className="sdp-signal-text">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {agents.length > 0 && (
            <div className="sdp-signals-card">
              <span className="sdp-signals-title">Agent Signals</span>
              <div className="sdp-signals-list">
                {agents.map((a, i) => (
                  <div key={i} className="sdp-agent-row">
                    <div className="sdp-agent-top">
                      <span className="sdp-agent-name">{a.name}</span>
                      <span className="sdp-agent-conf">{Math.round(a.confidence)}%</span>
                    </div>
                    <p className="sdp-agent-summary">{a.summary.slice(0, 140)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="sdp-side">

          {/* Key Metrics */}
          <div className="sdp-metrics-card">
            <span className="sdp-metrics-title">Key Metrics</span>
            <div className="sdp-metrics-list">
              <div className="sdp-metric-row">
                <span className="sdp-metric-label">Price</span>
                <span className="sdp-metric-val">
                  {price != null ? `$${fmt(price)}` : '—'}
                </span>
              </div>
              <div className="sdp-metric-row">
                <span className="sdp-metric-label">Daily Change</span>
                <span
                  className="sdp-metric-val"
                  style={{ color: isPositive ? '#4ade80' : '#f87171' }}
                >
                  {pct(changePercent)}
                </span>
              </div>
              <div className="sdp-metric-row">
                <span className="sdp-metric-label">AI Score</span>
                <span className="sdp-metric-val" style={{ color: 'var(--accent)' }}>
                  {score != null ? `${score}/100` : '—'}
                </span>
              </div>
              {card?.price != null && (
                <div className="sdp-metric-row">
                  <span className="sdp-metric-label">FMV (AI Est.)</span>
                  <span className="sdp-metric-val">${fmt(card.price)}</span>
                </div>
              )}
              {actionMatch && (
                <div className="sdp-metric-row">
                  <span className="sdp-metric-label">Action</span>
                  <span className="sdp-metric-val" style={{ color: actionColor }}>
                    {actionMatch.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Set Alert */}
          <div className="sdp-alert-card">
            <div className="sdp-alert-header">
              <span className="sdp-alert-title">Price Alerts</span>
              {alerts.length > 0 && (
                <span className="sdp-alert-count">{alerts.length}</span>
              )}
            </div>

            {alerts.length > 0 && (
              <div className="sdp-alert-list">
                {alerts.map((a) => (
                  <div key={a.id} className="sdp-alert-item">
                    <span className="sdp-alert-threshold">${fmt(a.threshold)}</span>
                    <button
                      className="sdp-alert-del"
                      onClick={() => handleDeleteAlert(a.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showAlertForm ? (
              <div className="sdp-alert-form">
                <input
                  className="sdp-alert-input"
                  type="number"
                  placeholder="Price threshold"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSetAlert()}
                />
                <div className="sdp-alert-form-btns">
                  <button
                    className="sdp-btn sdp-btn-primary"
                    onClick={handleSetAlert}
                    disabled={alertSaving}
                  >
                    {alertSaving ? 'Saving…' : 'Set Alert'}
                  </button>
                  <button
                    className="sdp-btn sdp-btn-ghost"
                    onClick={() => setShowAlertForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="sdp-btn sdp-btn-outline sdp-btn-full"
                onClick={() => setShowAlertForm(true)}
              >
                + Set Alert
              </button>
            )}
          </div>

          {/* Add to Watchlist */}
          <button
            className="sdp-btn sdp-btn-ghost sdp-btn-full"
            onClick={() => {}}
          >
            + Add to Watchlist
          </button>

          {/* Ask AI link */}
          <button
            className="sdp-btn sdp-btn-primary sdp-btn-full"
            onClick={() =>
              router.push(`/ai?q=${encodeURIComponent(`Tell me about ${symbol}`)}`)
            }
          >
            Ask AI about {symbol}
          </button>
        </div>
      </div>

      <style jsx>{`
        .sdp {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .sdp-nav {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .sdp-back {
          background: none;
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-muted);
          font-size: 0.82rem;
          font-weight: 600;
          padding: 6px 12px;
          cursor: pointer;
          transition: border-color 150ms ease, color 150ms ease;
        }
        .sdp-back:hover {
          border-color: rgba(59, 158, 255, 0.4);
          color: var(--accent);
        }
        .sdp-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .sdp-symbol {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
          letter-spacing: 0.02em;
        }
        .sdp-price {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .sdp-change {
          font-size: 0.95rem;
          font-weight: 700;
        }
        .positive { color: #4ade80; }
        .negative { color: #f87171; }

        /* Body layout */
        .sdp-body {
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }
        .sdp-main {
          flex: 2;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .sdp-side {
          width: 280px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        /* AI Thesis Hero */
        .sdp-thesis-hero {
          padding: 22px 24px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(22, 40, 80, 0.95) 0%, rgba(12, 25, 55, 0.97) 100%);
          border: 1px solid rgba(59, 158, 255, 0.22);
          display: flex;
          flex-direction: column;
          gap: 14px;
          box-shadow: 0 0 48px -20px rgba(59, 158, 255, 0.22);
        }
        .sdp-thesis-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sdp-thesis-eyebrow {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--accent);
          margin-right: auto;
        }
        .sdp-action-badge {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          padding: 3px 10px;
          border-radius: 999px;
          border: 1px solid;
        }
        .sdp-score-badge {
          display: flex;
          align-items: baseline;
          gap: 2px;
          background: rgba(59, 158, 255, 0.1);
          border: 1px solid rgba(59, 158, 255, 0.22);
          padding: 3px 10px;
          border-radius: 8px;
        }
        .sdp-score-num {
          font-size: 1rem;
          font-weight: 800;
          color: var(--accent);
        }
        .sdp-score-denom {
          font-size: 0.65rem;
          color: var(--text-muted);
        }
        .sdp-thesis-headline {
          font-size: 0.98rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.5;
        }
        .sdp-thesis-cols {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .sdp-thesis-col { display: flex; flex-direction: column; gap: 6px; }
        .sdp-col-label {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }
        .sdp-col-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .sdp-col-list li {
          font-size: 0.76rem;
          color: var(--text-muted);
          line-height: 1.4;
          padding-left: 10px;
          position: relative;
        }
        .sdp-col-list li::before {
          content: '·';
          position: absolute;
          left: 0;
          color: var(--text-muted);
          font-size: 1rem;
          line-height: 1.1;
        }

        /* Chart */
        .sdp-chart-card {
          padding: 18px 20px;
          border-radius: 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .sdp-chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .sdp-chart-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .sdp-range-btns {
          display: flex;
          gap: 4px;
        }
        .sdp-range-btn {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 600;
          background: none;
          border: 1px solid var(--border);
          color: var(--text-muted);
          cursor: pointer;
          transition: border-color 150ms ease, color 150ms ease, background 150ms ease;
        }
        .sdp-range-btn:hover {
          border-color: rgba(59, 158, 255, 0.4);
          color: var(--accent);
        }
        .sdp-range-btn.active {
          background: rgba(59, 158, 255, 0.12);
          border-color: rgba(59, 158, 255, 0.4);
          color: var(--accent);
        }
        .sdp-range-btn:disabled { cursor: wait; opacity: 0.6; }
        .sdp-chart-body { transition: opacity 200ms ease; }

        /* Signals */
        .sdp-signals-card {
          padding: 18px 20px;
          border-radius: 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .sdp-signals-title {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--text-muted);
        }
        .sdp-signals-list { display: flex; flex-direction: column; gap: 8px; }
        .sdp-signal-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .sdp-signal-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          flex-shrink: 0;
          margin-top: 5px;
        }
        .sdp-signal-text {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.5;
        }
        .sdp-agent-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--border);
        }
        .sdp-agent-row:last-child { border-bottom: none; padding-bottom: 0; }
        .sdp-agent-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .sdp-agent-name {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .sdp-agent-conf {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--accent);
        }
        .sdp-agent-summary {
          font-size: 0.76rem;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.5;
        }

        /* Key Metrics */
        .sdp-metrics-card {
          padding: 18px 20px;
          border-radius: 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .sdp-metrics-title {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }
        .sdp-metrics-list { display: flex; flex-direction: column; gap: 10px; }
        .sdp-metric-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border);
          padding-bottom: 8px;
        }
        .sdp-metric-row:last-child { border-bottom: none; padding-bottom: 0; }
        .sdp-metric-label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .sdp-metric-val {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        /* Alert card */
        .sdp-alert-card {
          padding: 16px 18px;
          border-radius: 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .sdp-alert-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .sdp-alert-title {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }
        .sdp-alert-count {
          font-size: 0.68rem;
          font-weight: 700;
          background: rgba(59, 158, 255, 0.14);
          color: var(--accent);
          border: 1px solid rgba(59, 158, 255, 0.25);
          border-radius: 999px;
          padding: 1px 7px;
        }
        .sdp-alert-list { display: flex; flex-direction: column; gap: 6px; }
        .sdp-alert-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 10px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 8px;
        }
        .sdp-alert-threshold {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .sdp-alert-del {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1rem;
          cursor: pointer;
          padding: 0 2px;
          line-height: 1;
          transition: color 150ms ease;
        }
        .sdp-alert-del:hover { color: #f87171; }
        .sdp-alert-form { display: flex; flex-direction: column; gap: 8px; }
        .sdp-alert-input {
          padding: 8px 12px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--surface-2);
          color: var(--text-primary);
          font-size: 0.85rem;
          width: 100%;
        }
        .sdp-alert-input:focus {
          outline: none;
          border-color: rgba(59, 158, 255, 0.5);
        }
        .sdp-alert-form-btns { display: flex; gap: 6px; }

        /* Buttons */
        .sdp-btn {
          padding: 9px 16px;
          border-radius: 9px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: opacity 150ms ease, transform 100ms ease;
          text-align: center;
        }
        .sdp-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .sdp-btn:active { transform: translateY(0); }
        .sdp-btn:disabled { cursor: wait; opacity: 0.6; transform: none; }
        .sdp-btn-primary {
          background: linear-gradient(120deg, #1a72d4, #3b9eff);
          color: #fff;
        }
        .sdp-btn-outline {
          background: none;
          border: 1px solid rgba(59, 158, 255, 0.35);
          color: var(--accent);
        }
        .sdp-btn-ghost {
          background: var(--surface-2);
          border: 1px solid var(--border);
          color: var(--text-muted);
        }
        .sdp-btn-full { width: 100%; }
      `}</style>
    </div>
  );
}
