'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { MarketTickerBar } from '../../../components/MarketTickerBar';
import { DailyBriefCard } from '../../../components/DailyBriefCard';
import { EnhancedMoveCard } from '../../../components/EnhancedMoveCard';
import { WatchlistAnalysisSection } from '../../../components/WatchlistAnalysisSection';
import { PortfolioPanel } from '../../../components/PortfolioPanel';
import { ResearchFeed } from '../../../components/ResearchFeed';
import { SmartAlerts } from '../../../components/SmartAlerts';
import { MacroPanel } from '../../../components/MacroPanel';
import { EventsPanel } from '../../../components/EventsPanel';
import { MarketMoversPanel } from '../../../components/MarketMoversPanel';
import type { DashboardOverview, MovesTodayResponse } from '../../../lib/api/dashboard';
import { getDashboardOverview, getMovesToday } from '../../../lib/api/dashboard';
import type { MacroSnapshot } from '../../../lib/api/macro';
import { getMacroSnapshot } from '../../../lib/api/macro';
import { getWatchlists } from '../../../lib/api/watchlist';
import type { MarketMoversResponse, SnapshotData } from '../../../lib/api/market';
import { getMarketMovers, getSnapshots } from '../../../lib/api/market';
import type { AiContextResponse, AiThesisCard } from '../../../lib/api/ai';
import { getAiContext, getAiThesisCards } from '../../../lib/api/ai';
import type { InsightRead } from '../../../lib/api/insights';
import { getInsights, markInsightRead } from '../../../lib/api/insights';
import { get } from '../../../lib/api/client';
import {
  MOCK_OVERVIEW,
  MOCK_MACRO,
  MOCK_WATCHLISTS,
  MOCK_SNAPSHOTS,
  MOCK_AI_CONTEXT,
  MOCK_THESIS_CARDS,
  MOCK_MOVES,
  MOCK_INSIGHTS,
  MOCK_EVENTS,
} from '../../../lib/mock-data';

const FALLBACK_SYMBOLS = ['AAPL', 'NVDA', 'MSFT', 'GOOGL', 'META'];

export default function DashboardPage() {
  const { isGuest } = useAuth();

  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [macro, setMacro] = useState<MacroSnapshot | null>(null);
  const [symbols, setSymbols] = useState<string[]>(FALLBACK_SYMBOLS);
  const [hasWatchlist, setHasWatchlist] = useState(false);
  const [snapshots, setSnapshots] = useState<Record<string, SnapshotData>>({});

  const [aiContext, setAiContext] = useState<AiContextResponse | null>(null);
  const [thesisCards, setThesisCards] = useState<AiThesisCard[]>([]);
  const [aiLoading, setAiLoading] = useState(true);

  const [moves, setMoves] = useState<MovesTodayResponse | null>(null);
  const [insights, setInsights] = useState<InsightRead[]>([]);
  const [gainers, setGainers] = useState<MarketMoversResponse | null>(null);
  const [losers, setLosers] = useState<MarketMoversResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    async function load() {
      if (isGuest) {
        let guestMock = false;
        try {
          const demo = await get<DashboardOverview>('/v1/dashboard/demo');
          setOverview(demo);
          const wlSyms = demo.watchlists[0]?.highlights.map((h) => h.symbol) ?? [];
          const syms = wlSyms.length > 0 ? wlSyms : FALLBACK_SYMBOLS;
          setSymbols(syms);
        } catch {
          setOverview(MOCK_OVERVIEW);
          setSymbols(FALLBACK_SYMBOLS);
          guestMock = true;
        }
        setMoves(MOCK_MOVES);
        setInsights(MOCK_INSIGHTS);
        setMacro(MOCK_MACRO);
        setAiContext(MOCK_AI_CONTEXT);
        setThesisCards(MOCK_THESIS_CARDS.cards);
        setLoading(false);
        setAiLoading(false);
        if (guestMock) setUsingMock(true);
        return;
      }

      // Authenticated — load fast data in parallel
      let anyFailed = false;

      const [ovResult, mcResult, wlResult, movesResult, insightsResult] = await Promise.allSettled([
        getDashboardOverview(),
        getMacroSnapshot(),
        getWatchlists(),
        getMovesToday(),
        getInsights(true),
      ]);

      let syms = FALLBACK_SYMBOLS;
      let wlFound = false;

      if (ovResult.status === 'fulfilled') {
        setOverview(ovResult.value);
        const ovSyms = ovResult.value.watchlists[0]?.highlights.map((h) => h.symbol) ?? [];
        if (ovSyms.length > 0) {
          syms = ovSyms;
          wlFound = true;
        }
      } else {
        setOverview(MOCK_OVERVIEW);
        anyFailed = true;
      }

      if (mcResult.status === 'fulfilled') {
        setMacro(mcResult.value);
      } else {
        setMacro(MOCK_MACRO);
        anyFailed = true;
      }

      if (wlResult.status === 'fulfilled') {
        const wlItems = wlResult.value[0]?.items.map((i) => i.symbol) ?? [];
        if (wlItems.length > 0) {
          syms = wlItems;
          wlFound = true;
        }
      } else {
        const mockItems = MOCK_WATCHLISTS[0]?.items.map((i) => i.symbol) ?? [];
        if (mockItems.length > 0) syms = mockItems;
        anyFailed = true;
      }

      if (movesResult.status === 'fulfilled') {
        setMoves(movesResult.value);
      } else {
        setMoves(MOCK_MOVES);
        anyFailed = true;
      }

      if (insightsResult.status === 'fulfilled') {
        setInsights(insightsResult.value.items);
      } else {
        setInsights(MOCK_INSIGHTS);
        anyFailed = true;
      }

      setSymbols(syms);
      setHasWatchlist(wlFound || anyFailed);
      setLoading(false);

      if (anyFailed) setUsingMock(true);

      // Fetch market movers in background
      Promise.allSettled([getMarketMovers('gainers'), getMarketMovers('losers')]).then(
        ([gResult, lResult]) => {
          if (gResult.status === 'fulfilled') setGainers(gResult.value);
          if (lResult.status === 'fulfilled') setLosers(lResult.value);
        }
      );

      // Fetch snapshots — fall back to mock on failure
      getSnapshots(syms).then(setSnapshots).catch(() => {
        setSnapshots(MOCK_SNAPSHOTS);
        setUsingMock(true);
      });

      // Slow AI pipeline — runs async after fast data
      setAiLoading(true);
      const [ctxResult, cardsResult] = await Promise.allSettled([
        getAiContext(syms),
        getAiThesisCards(syms),
      ]);

      if (ctxResult.status === 'fulfilled') {
        setAiContext(ctxResult.value);
      } else {
        setAiContext(MOCK_AI_CONTEXT);
        setUsingMock(true);
      }

      if (cardsResult.status === 'fulfilled') {
        setThesisCards(cardsResult.value.cards);
      } else {
        setThesisCards(MOCK_THESIS_CARDS.cards);
        setUsingMock(true);
      }

      setAiLoading(false);
    }

    void load();
  }, [isGuest]);

  async function handleInsightRead(id: string) {
    setInsights((prev) =>
      prev.map((ins) => ins.id === id ? { ...ins, read_at: new Date().toISOString() } : ins)
    );
    try { await markInsightRead(id); } catch { /* best-effort */ }
  }
  void handleInsightRead; // suppress unused warning — kept for future use

  if (loading) return <PageSkeleton />;

  const portfolio = overview?.portfolios[0] ?? null;
  const notifications = overview?.notifications ?? [];

  return (
    <div className="dash-page">
      {/* Top strip — ticker + optional banners */}
      <div className="dash-top">
        <div className="dash-ticker-row">
          <MarketTickerBar symbols={symbols} />
          {usingMock && (
            <span className="preview-pill">● Preview — connect backend for live data</span>
          )}
        </div>
        {isGuest && !usingMock && (
          <div className="dash-guest-banner">
            <span>Viewing demo data as a guest.</span>
            <a href="/sign-up" className="dash-guest-cta">Create an account →</a>
          </div>
        )}
      </div>

      {/* Two-column body: main scrolls, rail scrolls independently */}
      <div className="dash-body">
        {/* ── Main column ── */}
        <div className="dash-main">
          {/* Section 1 — Daily Brief */}
          <section>
            <h2 className="section-heading">Daily Brief</h2>
            <DailyBriefCard aiContext={aiContext} macro={macro} loading={aiLoading} />
          </section>

          {/* Section 2 — Your 3 Moves Today */}
          {moves && moves.moves.length > 0 && (
            <section>
              <h2 className="section-heading">Your 3 Moves Today</h2>
              <div className="action-cards-row">
                {moves.moves.slice(0, 3).map((m) => (
                  <EnhancedMoveCard key={m.ticker} move={m} />
                ))}
              </div>
            </section>
          )}

          {/* Section 3 — Watchlist Opportunities */}
          <section>
            <h2 className="section-heading">Watchlist Opportunities</h2>
            <WatchlistAnalysisSection
              cards={thesisCards}
              snapshots={snapshots}
              loading={aiLoading}
              hasWatchlist={!isGuest && hasWatchlist}
            />
          </section>

          {/* Section 4 — Portfolio Snapshot */}
          {portfolio && (
            <section>
              <h2 className="section-heading">Portfolio Snapshot</h2>
              <PortfolioPanel portfolio={portfolio} />
            </section>
          )}

          {/* Section 5 — Research Feed */}
          <section>
            <h2 className="section-heading">Research Feed</h2>
            <ResearchFeed cards={thesisCards} snapshots={snapshots} loading={aiLoading} />
          </section>
        </div>

        {/* ── Right rail ── */}
        <div className="dash-rail">
          {notifications.length > 0 && (
            <div className="rail-section">
              <SmartAlerts notifications={notifications} />
            </div>
          )}
          <div className={`rail-section${notifications.length > 0 ? ' rail-section-sep' : ''}`}>
            <MacroPanel macro={macro} />
          </div>
          <div className="rail-section rail-section-sep">
            <EventsPanel events={MOCK_EVENTS} />
          </div>
          {(gainers || losers) && (
            <div className="rail-section rail-section-sep">
              <MarketMoversPanel gainers={gainers} losers={losers} />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        /* ── Page container ── */
        .dash-page {
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          gap: 0;
        }

        /* ── Top strip ── */
        .dash-top {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-bottom: 14px;
        }
        .dash-ticker-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .preview-pill {
          flex-shrink: 0;
          font-size: 0.72rem;
          font-weight: 500;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 3px 10px;
          white-space: nowrap;
        }
        .dash-guest-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 14px;
          background: rgba(59, 158, 255, 0.08);
          border: 1px solid rgba(59, 158, 255, 0.22);
          border-radius: 8px;
          font-size: 0.83rem;
          color: var(--text-muted);
        }
        :global(.dash-guest-cta) {
          color: var(--accent);
          font-weight: 600;
          text-decoration: none;
          font-size: 0.83rem;
        }

        /* ── Two-column body: both columns scroll independently ── */
        .dash-body {
          flex: 1;
          min-height: 0;
          display: flex;
          gap: 24px;
          overflow: hidden;
        }

        /* ── Main column: scrollable ── */
        .dash-main {
          flex: 1;
          min-width: 0;
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: 24px;
          padding-bottom: 32px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .dash-main::-webkit-scrollbar { width: 4px; }
        .dash-main::-webkit-scrollbar-track { background: transparent; }
        .dash-main::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 4px;
        }

        section { display: flex; flex-direction: column; gap: 0; }

        .section-heading {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          color: var(--text-muted);
          margin: 0 0 14px;
          padding: 0;
        }

        /* Action cards: horizontal flex */
        .action-cards-row {
          display: flex;
          gap: 16px;
        }
        .action-cards-row :global(.emc) {
          flex: 1;
          min-width: 260px;
        }

        /* ── Right rail: sticky, scrollable ── */
        .dash-rail {
          width: 300px;
          flex-shrink: 0;
          overflow-y: auto;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          gap: 0;
          padding-bottom: 32px;
          padding-right: 2px;
        }
        .dash-rail::-webkit-scrollbar { width: 4px; }
        .dash-rail::-webkit-scrollbar-track { background: transparent; }
        .dash-rail::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 4px;
        }

        /* ── Rail sections ── */
        .rail-section {
          display: flex;
          flex-direction: column;
        }
        .rail-section-sep {
          border-top: 1px solid var(--border);
          padding-top: 20px;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="skel">
      <div className="skel-bar" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="skel-card" />
      ))}
      <style jsx>{`
        .skel { display: flex; flex-direction: column; gap: 16px; }
        .skel-bar {
          height: 44px;
          border-radius: 10px;
          background: var(--surface);
          border: 1px solid var(--border);
          animation: shimmer 1.5s ease-in-out infinite;
        }
        .skel-card {
          height: 120px;
          border-radius: 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          animation: shimmer 1.5s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
