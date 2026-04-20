import type { DashboardOverview, MovesTodayResponse } from './api/dashboard';
import type { MacroSnapshot } from './api/macro';
import type { Watchlist } from './api/watchlist';
import type { MarketFundamentals, MarketMoversResponse, MarketNewsResponse, MarketStatusResponse, SnapshotData, TickerOverview } from './api/market';
import type { Bar } from './api/market';
import type { AiContextResponse, AiThesisCardsResponse } from './api/ai';
import type { InsightRead } from './api/insights';
import type { NewsFeedResponse } from './api/news';
import type { PortfolioSnapshotResponse } from './api/portfolio';
import type { AlertRule } from './api/alerts';

const NOW = new Date().toISOString();

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export const MOCK_OVERVIEW: DashboardOverview = {
  insights: [],
  watchlists: [
    {
      id: 'mock-wl-1',
      name: 'Tech Leaders',
      highlights: [
        {
          symbol: 'AAPL',
          note: 'Strong iPhone cycle recovery expected in H2',
          price: 189.42,
          change: 2.15,
          change_percent: 1.15,
          ai_score: 82,
          ai_action: 'Buy',
          ai_reason: 'Services revenue accelerating; margin expansion thesis intact',
          alert_level: 'info',
          sentiment: 'bullish',
        },
        {
          symbol: 'NVDA',
          note: 'Data center demand remains robust',
          price: 875.3,
          change: 14.8,
          change_percent: 1.72,
          ai_score: 91,
          ai_action: 'Strong Buy',
          ai_reason: 'AI infrastructure capex cycle shows no signs of slowing',
          alert_level: 'info',
          sentiment: 'very_bullish',
        },
        {
          symbol: 'MSFT',
          note: 'Azure AI integration driving cloud growth',
          price: 415.78,
          change: -1.92,
          change_percent: -0.46,
          ai_score: 79,
          ai_action: 'Buy',
          ai_reason: 'Copilot monetization beginning to show in enterprise sales',
          alert_level: null,
          sentiment: 'bullish',
        },
        {
          symbol: 'GOOGL',
          note: 'Search ad recovery + Gemini monetization',
          price: 172.55,
          change: 3.1,
          change_percent: 1.83,
          ai_score: 74,
          ai_action: 'Hold',
          ai_reason: 'Regulatory headwinds partially offset strong ad revenue rebound',
          alert_level: null,
          sentiment: 'neutral',
        },
        {
          symbol: 'META',
          note: 'Ad platform efficiency gains continue',
          price: 528.9,
          change: -6.4,
          change_percent: -1.2,
          ai_score: 77,
          ai_action: 'Buy',
          ai_reason: 'Reality Labs losses moderating; core ads business exceptionally strong',
          alert_level: 'info',
          sentiment: 'bullish',
        },
      ],
    },
  ],
  portfolios: [
    {
      id: 'mock-port-1',
      name: 'Main Portfolio',
      total_positions: 8,
      total_cost: 130800,
      total_value: 141726,
      daily_change: 1240,
      daily_change_percent: 0.88,
      total_return: 10926,
      total_return_percent: 8.35,
    },
  ],
  notifications: [
    {
      id: 'mock-notif-1',
      title: 'NVDA breaks out above $870 resistance',
      body: 'NVDA cleared the $870 technical resistance level on high volume. Momentum signals remain bullish heading into earnings.',
      created_at: NOW,
      severity: 'high',
      symbol: 'NVDA',
    },
    {
      id: 'mock-notif-2',
      title: 'Fed minutes released — no rate cut signals',
      body: 'The latest FOMC minutes indicate the committee remains data-dependent with no imminent rate cuts expected before Q3.',
      created_at: NOW,
      severity: 'info',
      symbol: null,
    },
  ],
};

export const MOCK_MACRO: MacroSnapshot = {
  regime: 'Risk-On',
  snapshot: {
    cpi_yoy: 3.1,
    yield_10y: 4.42,
    yield_2y: 4.18,
    fed_funds_rate: 5.33,
    unemployment: 3.9,
    gdp_growth: 2.8,
  },
  as_of: NOW,
  provider: 'preview',
};

export const MOCK_WATCHLISTS: Watchlist[] = [
  {
    id: 'mock-wl-1',
    user_id: 'mock-user',
    name: 'Tech Leaders',
    created_at: daysAgo(14),
    items: [
      { id: 'item-1', symbol: 'AAPL', created_at: daysAgo(14) },
      { id: 'item-2', symbol: 'NVDA', created_at: daysAgo(14) },
      { id: 'item-3', symbol: 'MSFT', created_at: daysAgo(12) },
      { id: 'item-4', symbol: 'GOOGL', created_at: daysAgo(10) },
      { id: 'item-5', symbol: 'META', created_at: daysAgo(8) },
    ],
  },
  {
    id: 'mock-wl-2',
    user_id: 'mock-user',
    name: 'High Conviction',
    created_at: daysAgo(7),
    items: [
      { id: 'item-6', symbol: 'PLTR', created_at: daysAgo(7) },
      { id: 'item-7', symbol: 'AMD', created_at: daysAgo(5) },
      { id: 'item-8', symbol: 'TSLA', created_at: daysAgo(3) },
    ],
  },
];

export const MOCK_SNAPSHOTS: Record<string, SnapshotData> = {
  AAPL:  { price: 189.42, change_percent:  1.15, fmv: 205.0,  as_of: NOW },
  NVDA:  { price: 875.30, change_percent:  1.72, fmv: 960.0,  as_of: NOW },
  MSFT:  { price: 415.78, change_percent: -0.46, fmv: 435.0,  as_of: NOW },
  GOOGL: { price: 172.55, change_percent:  1.83, fmv: 182.0,  as_of: NOW },
  META:  { price: 528.90, change_percent: -1.20, fmv: 555.0,  as_of: NOW },
  PLTR:  { price:  24.18, change_percent:  3.41, fmv:  28.0,  as_of: NOW },
  AMD:   { price: 178.64, change_percent: -0.82, fmv: 195.0,  as_of: NOW },
  TSLA:  { price: 248.50, change_percent:  2.14, fmv: 265.0,  as_of: NOW },
  AMZN:  { price: 192.33, change_percent:  0.67, fmv: 210.0,  as_of: NOW },
};

// ── Bar chart data ─────────────────────────────────────────────────────────────

/** Deterministic random walk seeded by symbol */
function seedRng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  }
  return () => {
    h ^= h << 13; h ^= h >> 7; h ^= h << 17;
    return (h >>> 0) / 4294967296;
  };
}

export function generateMockBars(symbol: string, count: number, intervalMinutes: number): Bar[] {
  const base = MOCK_SNAPSHOTS[symbol]?.price ?? 150;
  const rng = seedRng(symbol + count + intervalMinutes);
  const bars: Bar[] = [];
  const now = Date.now();
  let price = base * (0.88 + rng() * 0.06);

  for (let i = count - 1; i >= 0; i--) {
    const ts = new Date(now - i * intervalMinutes * 60 * 1000).toISOString();
    const move = (rng() - 0.48) * price * 0.012;
    const open = price;
    price = Math.max(1, price + move);
    const hi = Math.max(open, price) * (1 + rng() * 0.004);
    const lo = Math.min(open, price) * (1 - rng() * 0.004);
    bars.push({
      t: ts,
      o: Number(open.toFixed(2)),
      h: Number(hi.toFixed(2)),
      l: Number(lo.toFixed(2)),
      c: Number(price.toFixed(2)),
      v: Math.round(50000 + rng() * 800000),
    });
  }
  return bars;
}

// ── AI context + thesis ────────────────────────────────────────────────────────

export const MOCK_AI_CONTEXT: AiContextResponse = {
  context:
    'Your watchlist is positioned well in a Risk-On macro environment. Tech mega-caps continue to benefit from AI infrastructure spending and improving margin profiles. NVDA remains the highest-conviction holding given sustained data center demand. Watch AAPL into the next product cycle and META for continued ad platform efficiency gains. GOOGL faces near-term regulatory overhangs but core search monetization is recovering.',
  agents: {
    symbols: ['AAPL', 'NVDA', 'MSFT', 'GOOGL', 'META'],
    generated_at: NOW,
    results: [
      {
        name: 'Macro',
        summary:
          'Risk-On regime with CPI trending down toward target. 10Y yield at 4.42% remains elevated but stable — supportive for tech multiples if inflation continues cooling.',
        confidence: 0.78,
        signals: ['Risk-On', 'CPI Cooling', 'Rates Stable'],
      },
      {
        name: 'News',
        summary:
          'Positive sentiment across AI names. NVDA supply chain checks strong. META advertising platform getting favorable analyst coverage after Q4 beat.',
        confidence: 0.72,
        signals: ['AI Tailwind', 'Positive Sentiment', 'Earnings Beat'],
      },
      {
        name: 'Price & Trend',
        summary:
          'NVDA and GOOGL showing bullish momentum. AAPL consolidating above key moving averages. MSFT and META near short-term resistance levels.',
        confidence: 0.68,
        signals: ['Bullish Momentum', 'Above 50-DMA', 'Volume Confirmed'],
      },
      {
        name: 'Fundamentals',
        summary:
          'All five names show strong free cash flow generation. NVDA leads on forward P/E re-rating potential. MSFT and AAPL have best balance sheet quality.',
        confidence: 0.81,
        signals: ['Strong FCF', 'Quality Balance Sheet', 'Margin Expansion'],
      },
      {
        name: 'Portfolio',
        summary:
          'Portfolio up 8.35% total return. Concentration in AI-adjacent tech is elevated — consider rebalancing if NVDA exceeds 30% weight.',
        confidence: 0.75,
        signals: ['+8.35% Return', 'AI Concentration', 'Rebalance Watch'],
      },
    ],
  },
};

export const MOCK_THESIS_CARDS: AiThesisCardsResponse = {
  cards: [
    {
      symbol: 'AAPL',
      headline: 'Services flywheel accelerating into next iPhone supercycle',
      summary:
        "Apple's services segment is growing at 14% YoY, expanding margins above 70%. The upcoming iPhone refresh cycle with on-device AI features could drive an upgrade wave not seen since 5G.",
      signals: ['Services Growth', 'Margin Expansion', 'AI Upgrade Cycle'],
      price: 189.42,
      change_percent: 1.15,
      generated_at: NOW,
    },
    {
      symbol: 'NVDA',
      headline: 'AI infrastructure capex cycle in early innings',
      summary:
        "Hyperscalers are committing record capex to GPU clusters through 2026. NVDA's CUDA moat and Blackwell architecture position it to capture the majority of this spend with pricing power intact.",
      signals: ['Capex Cycle', 'CUDA Moat', 'Pricing Power'],
      price: 875.3,
      change_percent: 1.72,
      generated_at: NOW,
    },
    {
      symbol: 'MSFT',
      headline: 'Copilot monetization beginning to show in Azure numbers',
      summary:
        "Azure's AI services are driving 6+ point growth acceleration. Enterprise Copilot seat count grew 40% QoQ in the last print, with ASPs holding firm despite competitive pressure.",
      signals: ['Azure Acceleration', 'Copilot Adoption', 'Enterprise Stickiness'],
      price: 415.78,
      change_percent: -0.46,
      generated_at: NOW,
    },
    {
      symbol: 'GOOGL',
      headline: 'Search ad recovery + Gemini integration underpriced by market',
      summary:
        "Digital ad market recovering ahead of expectations. Gemini's integration into Search, Workspace, and Cloud is beginning to show in user engagement metrics and could drive a re-rating.",
      signals: ['Ad Recovery', 'Gemini Upside', 'Cloud Growth'],
      price: 172.55,
      change_percent: 1.83,
      generated_at: NOW,
    },
    {
      symbol: 'META',
      headline: 'Core ads business exceptional; Reality Labs drag moderating',
      summary:
        "Meta's ad platform efficiency improvements are translating directly to ARPU growth. Reality Labs losses are declining as a percentage of operating income, reducing the drag on consolidated margins.",
      signals: ['ARPU Growth', 'Efficiency Gains', 'RL Loss Stabilizing'],
      price: 528.9,
      change_percent: -1.2,
      generated_at: NOW,
    },
    {
      symbol: 'PLTR',
      headline: 'Government AI contracts creating durable revenue base',
      summary:
        "Palantir's AIP platform is seeing accelerating enterprise adoption. US government contract renewals at record values underpin visibility, while commercial ACV growth of 70%+ signals platform stickiness.",
      signals: ['Gov Contracts', 'AIP Adoption', 'Commercial Acceleration'],
      price: 24.18,
      change_percent: 3.41,
      generated_at: NOW,
    },
    {
      symbol: 'AMD',
      headline: 'MI300 gaining share in AI accelerator market',
      summary:
        "AMD's MI300X is outperforming on memory bandwidth, winning workloads from hyperscalers seeking CUDA alternatives. Data center GPU revenue is on track to exceed $4B this year — well ahead of consensus.",
      signals: ['MI300 Ramp', 'Market Share Gains', 'Hyperscaler Wins'],
      price: 178.64,
      change_percent: -0.82,
      generated_at: NOW,
    },
    {
      symbol: 'TSLA',
      headline: 'FSD monetization and energy storage are the next re-rating catalysts',
      summary:
        "Tesla's Full Self-Driving subscription revenue is ramping faster than anticipated. The energy storage segment posted record margins, providing a profitable counter-weight to automotive margin compression.",
      signals: ['FSD Revenue', 'Energy Growth', 'Margin Recovery'],
      price: 248.5,
      change_percent: 2.14,
      generated_at: NOW,
    },
  ],
  generated_at: NOW,
};

// ── Moves ─────────────────────────────────────────────────────────────────────

export const MOCK_MOVES: MovesTodayResponse = {
  as_of: NOW,
  regime: 'Risk-On',
  provider: 'preview',
  moves: [
    {
      ticker: 'NVDA',
      title: 'Breakout above $870 resistance — momentum building',
      why: 'NVDA cleared key technical resistance on above-average volume. Blackwell ramp commentary from hyperscalers is reinforcing the bull case ahead of next earnings.',
      confidence: 0.87,
      signals: ['Volume Breakout', 'Bullish Momentum', 'Earnings Catalyst'],
      cta: [{ type: 'buy', label: 'Strong Buy' }],
      price: 875.3,
      change_percent: 1.72,
    },
    {
      ticker: 'AAPL',
      title: 'Services revenue beat driving AI upgrade thesis',
      why: 'App Store and subscription revenue came in above estimates. On-device AI features are driving the highest iPhone upgrade intent survey scores since 5G launch.',
      confidence: 0.79,
      signals: ['Services Beat', 'Upgrade Cycle', 'Margin Expansion'],
      cta: [{ type: 'buy', label: 'Buy' }],
      price: 189.42,
      change_percent: 1.15,
    },
    {
      ticker: 'PLTR',
      title: 'AIP platform adoption accelerating in commercial sector',
      why: "Palantir's AIP bootcamp conversion rates are materially higher than typical SaaS sales cycles, suggesting strong product-market fit. Pipeline visibility for the next 2 quarters is robust.",
      confidence: 0.74,
      signals: ['AIP Adoption', 'Pipeline Build', 'Enterprise Wins'],
      cta: [{ type: 'buy', label: 'Buy' }],
      price: 24.18,
      change_percent: 3.41,
    },
    {
      ticker: 'META',
      title: 'Ad platform efficiency — ARPU growth accelerating',
      why: "Meta's Advantage+ ad system is driving meaningful CPM improvements. Reality Labs losses are declining as a share of operating income, reducing the drag on headline margins.",
      confidence: 0.71,
      signals: ['ARPU Growth', 'Efficiency Gains', 'RL Drag Moderating'],
      cta: [{ type: 'buy', label: 'Buy' }],
      price: 528.9,
      change_percent: -1.2,
    },
  ],
};

// ── Insights ──────────────────────────────────────────────────────────────────

export const MOCK_INSIGHTS: InsightRead[] = [
  {
    id: 'mock-insight-1',
    user_id: 'mock-user',
    symbol: 'NVDA',
    title: 'NVDA: Breakout signal detected at open',
    body: 'NVDA opened above the $870 resistance level that has held for 3 weeks. Pre-market volume is 2.4x the 30-day average. Momentum indicators are bullish across daily and weekly timeframes. The Blackwell ramp is showing up in forward guidance revisions from hyperscaler partners.',
    signals: ['Volume Surge', 'Resistance Break', 'Weekly Momentum'],
    action: 'Consider adding to position on confirmed breakout above $880.',
    confidence: 0.85,
    created_at: NOW,
    read_at: null,
  },
  {
    id: 'mock-insight-2',
    user_id: 'mock-user',
    symbol: 'AAPL',
    title: 'AAPL: Services beat signals margin upside',
    body: 'App Store gross margin came in at 73.1% vs 71.8% expected. Combined with accelerating services revenue growth, this supports our thesis that the services flywheel is compounding ahead of schedule.',
    signals: ['Margin Beat', 'Services Accelerating', 'Thesis Confirmation'],
    action: 'Watchlist highlight — thesis remains intact, no immediate action required.',
    confidence: 0.78,
    created_at: daysAgo(1),
    read_at: null,
  },
  {
    id: 'mock-insight-3',
    user_id: 'mock-user',
    symbol: 'META',
    title: 'META: Advantage+ delivering above-consensus CPMs',
    body: "Meta's AI-powered Advantage+ ad format is achieving CPMs 18-22% above standard placements. This is flowing directly to ARPU expansion. Reality Labs capex is rolling off slightly, improving the consolidated FCF picture.",
    signals: ['CPM Beat', 'ARPU Growth', 'FCF Expansion'],
    action: 'Maintain position. Add on any broad market weakness below $510.',
    confidence: 0.73,
    created_at: daysAgo(1),
    read_at: daysAgo(1),
  },
  {
    id: 'mock-insight-4',
    user_id: 'mock-user',
    symbol: 'PLTR',
    title: 'PLTR: AIP bootcamp conversion rates 3x industry average',
    body: "Palantir's AIP bootcamp model is generating lead-to-close rates approximately 3x the enterprise SaaS industry average, according to field intelligence. This has structural implications for CAC and payback periods.",
    signals: ['High Conversion', 'Low CAC', 'Platform Stickiness'],
    action: 'Add to position on pullbacks. High conviction thesis.',
    confidence: 0.81,
    created_at: daysAgo(2),
    read_at: null,
  },
  {
    id: 'mock-insight-5',
    user_id: 'mock-user',
    symbol: '',
    title: 'Morning Scan: Risk-On environment favors tech overweight',
    body: "Today's macro backdrop is supportive: 10Y yield is stable at 4.42%, CPI trending below 3.2%, and equity vol (VIX) is below 15. Historically, this combination has been one of the most favorable for large-cap technology equities. The AI capex cycle remains the dominant micro-theme across the portfolio.",
    signals: ['Macro Tailwind', 'Low Vol', 'AI Capex Cycle'],
    action: 'Maintain tech overweight. No defensive rotation warranted at current levels.',
    confidence: 0.76,
    created_at: daysAgo(2),
    read_at: daysAgo(2),
  },
  {
    id: 'mock-insight-6',
    user_id: 'mock-user',
    symbol: 'AMD',
    title: 'AMD: MI300 hyperscaler design wins expanding',
    body: 'AMD has secured three additional MI300X design wins at major cloud providers, according to supply chain checks. The inference workload optionality at lower cost vs. H100 is a compelling value proposition as AI inference demand grows.',
    signals: ['Design Wins', 'Inference Workload', 'Cost Advantage'],
    action: 'Consider initiating or adding. Catalyst: MI300 revenue disclosure next quarter.',
    confidence: 0.69,
    created_at: daysAgo(3),
    read_at: null,
  },
  {
    id: 'mock-insight-7',
    user_id: 'mock-user',
    symbol: 'MSFT',
    title: 'MSFT: Copilot enterprise seat adoption inflecting',
    body: 'Channel checks indicate Microsoft Copilot seat purchases are accelerating in Q1, with enterprise IT buyers citing productivity gains of 15-30% for knowledge workers. This supports the $30/seat ASP thesis.',
    signals: ['Copilot Adoption', 'Productivity ROI', 'Seat Growth'],
    action: 'Hold. Catalyst-rich setup into next earnings. Monitor Azure growth rate.',
    confidence: 0.74,
    created_at: daysAgo(4),
    read_at: daysAgo(4),
  },
  {
    id: 'mock-insight-8',
    user_id: 'mock-user',
    symbol: 'TSLA',
    title: 'TSLA: Energy storage margins exceeding auto segment',
    body: "Tesla's Megapack energy storage business is achieving gross margins of 24%+ — exceeding the automotive segment for the first time. This business is scaling at 150% YoY and is becoming a meaningful earnings contributor independent of EV cycles.",
    signals: ['Energy Margin', 'Revenue Diversification', 'Scaling'],
    action: 'Speculative position. Energy segment optionality not priced in.',
    confidence: 0.62,
    created_at: daysAgo(5),
    read_at: null,
  },
];

// ── Portfolio ─────────────────────────────────────────────────────────────────

export const MOCK_PORTFOLIO_SNAPSHOT: PortfolioSnapshotResponse[] = [
  {
    portfolio_id: 'mock-port-1',
    portfolio_name: 'Main Portfolio',
    holdings: [
      {
        symbol: 'AAPL',
        quantity: 50,
        avg_cost: 162.40,
        cost_basis: 8120,
        current_price: 189.42,
        current_value: 9471,
        unrealized_pnl: 1351,
        unrealized_pnl_pct: 16.64,
        change_today: 107.5,
        change_today_pct: 1.15,
      },
      {
        symbol: 'NVDA',
        quantity: 20,
        avg_cost: 610.00,
        cost_basis: 12200,
        current_price: 875.3,
        current_value: 17506,
        unrealized_pnl: 5306,
        unrealized_pnl_pct: 43.49,
        change_today: 296.0,
        change_today_pct: 1.72,
      },
      {
        symbol: 'MSFT',
        quantity: 30,
        avg_cost: 385.20,
        cost_basis: 11556,
        current_price: 415.78,
        current_value: 12473.4,
        unrealized_pnl: 917.4,
        unrealized_pnl_pct: 7.94,
        change_today: -57.6,
        change_today_pct: -0.46,
      },
      {
        symbol: 'GOOGL',
        quantity: 60,
        avg_cost: 155.10,
        cost_basis: 9306,
        current_price: 172.55,
        current_value: 10353,
        unrealized_pnl: 1047,
        unrealized_pnl_pct: 11.25,
        change_today: 186.0,
        change_today_pct: 1.83,
      },
      {
        symbol: 'META',
        quantity: 15,
        avg_cost: 480.00,
        cost_basis: 7200,
        current_price: 528.9,
        current_value: 7933.5,
        unrealized_pnl: 733.5,
        unrealized_pnl_pct: 10.19,
        change_today: -96.0,
        change_today_pct: -1.2,
      },
      {
        symbol: 'PLTR',
        quantity: 500,
        avg_cost: 18.40,
        cost_basis: 9200,
        current_price: 24.18,
        current_value: 12090,
        unrealized_pnl: 2890,
        unrealized_pnl_pct: 31.41,
        change_today: 413.5,
        change_today_pct: 3.41,
      },
      {
        symbol: 'AMD',
        quantity: 40,
        avg_cost: 168.75,
        cost_basis: 6750,
        current_price: 178.64,
        current_value: 7145.6,
        unrealized_pnl: 395.6,
        unrealized_pnl_pct: 5.86,
        change_today: -58.7,
        change_today_pct: -0.82,
      },
      {
        symbol: 'TSLA',
        quantity: 25,
        avg_cost: 215.30,
        cost_basis: 5382.5,
        current_price: 248.5,
        current_value: 6212.5,
        unrealized_pnl: 830,
        unrealized_pnl_pct: 15.42,
        change_today: 133.0,
        change_today_pct: 2.14,
      },
    ],
    total_value: 83185,
    total_cost: 69714.5,
    unrealized_pnl: 13470.5,
    unrealized_pnl_pct: 19.32,
    daily_change: 924.7,
    daily_change_pct: 1.12,
    top_gainer: 'NVDA',
    top_loser: 'META',
    as_of: NOW,
    stale: false,
    provider: 'preview',
  },
];

// ── News ──────────────────────────────────────────────────────────────────────

export const MOCK_NEWS_FEED: NewsFeedResponse = {
  provider: 'preview',
  as_of: NOW,
  next_cursor: null,
  items: [
    {
      id: 'news-1',
      title: 'NVIDIA Blackwell Ramp Accelerating Faster Than Expected, Analyst Says',
      summary: 'A leading Wall Street analyst raised their NVDA price target to $1,100 citing supply chain checks that indicate Blackwell GPU production is ramping ahead of schedule. Hyperscaler demand remains insatiable through at least 2025.',
      url: '#',
      source: 'Seeking Alpha',
      published_at: NOW,
      symbols: ['NVDA'],
      channel: 'earnings',
    },
    {
      id: 'news-2',
      title: "Apple Services Revenue Hits All-Time High, Boosted by AI Features",
      summary: "Apple's App Store and subscription services posted a record quarter, growing 14% YoY. Analysts attribute the beat to increasing monetization of Apple Intelligence features embedded in iOS 18.",
      url: '#',
      source: 'Bloomberg',
      published_at: daysAgo(0),
      symbols: ['AAPL'],
      channel: null,
    },
    {
      id: 'news-3',
      title: 'Fed Holds Rates Steady, Signals Two Cuts Possible in 2025',
      summary: "The Federal Reserve left the federal funds rate unchanged at 5.25-5.50%, but updated its dot plot to show two potential rate cuts later in 2025. Chair Powell cited 'encouraging' inflation data while noting labor market resilience.",
      url: '#',
      source: 'Reuters',
      published_at: daysAgo(0),
      symbols: [],
      channel: 'macro',
    },
    {
      id: 'news-4',
      title: 'Microsoft Azure AI Revenue Grows 33% as Copilot Adoption Surges',
      summary: "Microsoft reported Azure AI services revenue grew 33% quarter-over-quarter, driven by surging enterprise adoption of Copilot for Microsoft 365. The company now has over 400,000 paying Copilot customers.",
      url: '#',
      source: 'WSJ',
      published_at: daysAgo(1),
      symbols: ['MSFT'],
      channel: 'earnings',
    },
    {
      id: 'news-5',
      title: 'Palantir Wins $480M US Army AI Contract Extension',
      summary: "Palantir Technologies secured a significant extension of its US Army artificial intelligence and data analytics contract, valued at $480 million over three years. The deal reinforces the company's government revenue base heading into FY2025.",
      url: '#',
      source: 'Defense News',
      published_at: daysAgo(1),
      symbols: ['PLTR'],
      channel: null,
    },
    {
      id: 'news-6',
      title: 'CPI Data Shows Inflation Cooling Toward Fed Target',
      summary: "Consumer Price Index data for February showed headline inflation at 3.1% YoY, down from 3.4% in January. Core CPI (ex-food and energy) fell to 3.8%, approaching the Fed's 2% target. Markets rallied on the print.",
      url: '#',
      source: 'BLS / CNBC',
      published_at: daysAgo(1),
      symbols: [],
      channel: 'macro',
    },
    {
      id: 'news-7',
      title: "Google Gemini Ultra 2 Integration in Search Drives 8% Engagement Uplift",
      summary: "Alphabet disclosed that Gemini Ultra 2 integration into Google Search has driven an 8% improvement in session engagement and a 12% increase in query depth. Analysts see this as the first concrete sign of AI monetization in Search.",
      url: '#',
      source: 'The Information',
      published_at: daysAgo(2),
      symbols: ['GOOGL'],
      channel: null,
    },
    {
      id: 'news-8',
      title: "AMD MI300X Wins Major Inference Workload at Microsoft Azure",
      summary: "Advanced Micro Devices has secured a significant inference workload contract at Microsoft Azure, marking the first large-scale commercial displacement of NVIDIA H100s by an AMD product. This validates AMD's inference cost-efficiency positioning.",
      url: '#',
      source: 'Semiconductor Daily',
      published_at: daysAgo(2),
      symbols: ['AMD', 'MSFT'],
      channel: null,
    },
    {
      id: 'news-9',
      title: 'Tesla Megapack Orders Surge on Grid Storage Demand Boom',
      summary: "Tesla's energy storage division reported a record backlog of Megapack orders, driven by utility-scale grid storage demand across North America and Europe. The segment's 24% gross margins are now above automotive for the first time.",
      url: '#',
      source: 'Bloomberg',
      published_at: daysAgo(2),
      symbols: ['TSLA'],
      channel: null,
    },
    {
      id: 'news-10',
      title: "Meta's Advantage+ Advertising Platform Achieving Record CPMs",
      summary: "Meta Platforms reported that its AI-powered Advantage+ ad delivery system is achieving CPMs 20% above traditional targeting, driving meaningful ARPU growth. The improvement is attributed to better audience matching via the latest Llama models.",
      url: '#',
      source: 'Ad Age',
      published_at: daysAgo(3),
      symbols: ['META'],
      channel: null,
    },
    {
      id: 'news-11',
      title: 'Q4 GDP Revised Upward to 3.4% on Strong Consumer Spending',
      summary: "The Bureau of Economic Analysis revised its Q4 GDP estimate upward to 3.4% annualized, above the initial 3.2% reading. Consumer spending was the primary driver, growing at 2.8% — the fastest pace in six quarters.",
      url: '#',
      source: 'BEA',
      published_at: daysAgo(3),
      symbols: [],
      channel: 'macro',
    },
    {
      id: 'news-12',
      title: 'NVIDIA Expected to Report Record Quarterly Revenue of $22B',
      summary: "Analysts across Wall Street have converged on expectations of record quarterly revenue for NVIDIA, driven by surging data center demand. Buy-side consensus sits at $22B for the upcoming quarter, with select analysts modeling upside to $24B.",
      url: '#',
      source: 'Barron\'s',
      published_at: daysAgo(4),
      symbols: ['NVDA'],
      channel: 'earnings',
    },
  ],
};

// ── Upcoming Events ────────────────────────────────────────────────────────────

export interface UpcomingEventMock {
  id: string;
  title: string;
  date: string;
  symbol?: string;
  importance: 'high' | 'medium' | 'low';
}

function futureDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

export const MOCK_EVENTS: UpcomingEventMock[] = [
  { id: 'evt-1', title: 'Earnings Release', symbol: 'NVDA', date: futureDate(10), importance: 'high' },
  { id: 'evt-2', title: 'FOMC Meeting', date: futureDate(9), importance: 'high' },
  { id: 'evt-3', title: 'CPI Data Release', date: futureDate(8), importance: 'medium' },
  { id: 'evt-4', title: 'Earnings Release', symbol: 'AAPL', date: futureDate(14), importance: 'medium' },
  { id: 'evt-5', title: 'PCE Inflation Report', date: futureDate(18), importance: 'medium' },
  { id: 'evt-6', title: 'Jobs Report (NFP)', date: futureDate(21), importance: 'low' },
];

// ── Market data mocks ─────────────────────────────────────────────────────────

export function MOCK_MARKET_OVERVIEW(symbol: string): TickerOverview {
  return {
    symbol: symbol.toUpperCase(),
    name: symbol.toUpperCase(),
    market: 'stocks',
    locale: 'us',
    active: true,
    provider: 'preview',
  };
}

export function MOCK_FUNDAMENTALS(symbol: string): MarketFundamentals {
  const snap = MOCK_SNAPSHOTS[symbol.toUpperCase()];
  return {
    symbol: symbol.toUpperCase(),
    company_name: symbol.toUpperCase(),
    sector: 'Technology',
    industry: 'Software',
    market_cap: snap ? snap.price * 1e9 : null,
    pe_ratio: 28.5,
    eps: 5.2,
    dividend_yield: null,
    shares_outstanding: 1e9,
    updated_at: NOW,
    provider: 'preview',
  };
}

export function MOCK_MARKET_NEWS(symbol: string): MarketNewsResponse {
  return {
    symbol: symbol.toUpperCase(),
    items: MOCK_NEWS_FEED.items
      .filter((n) => n.symbols.includes(symbol.toUpperCase()))
      .map((n) => ({
        id: n.id,
        title: n.title,
        summary: n.summary,
        url: n.url,
        source: n.source,
        published_at: n.published_at,
      })),
    provider: 'preview',
  };
}

export function MOCK_MARKET_MOVERS(direction: 'gainers' | 'losers'): MarketMoversResponse {
  const entries = Object.entries(MOCK_SNAPSHOTS);
  const sorted =
    direction === 'gainers'
      ? entries.sort((a, b) => b[1].change_percent - a[1].change_percent)
      : entries.sort((a, b) => a[1].change_percent - b[1].change_percent);
  return {
    direction,
    count: sorted.length,
    tickers: sorted.map(([ticker, snap]) => ({
      ticker,
      price: snap.price,
      change_percent: snap.change_percent,
    })),
    provider: 'preview',
  };
}

export const MOCK_MARKET_STATUS: MarketStatusResponse = {
  market: 'stocks',
  server_time: NOW,
  after_hours: false,
  early_hours: false,
  exchanges: { nyse: 'open', nasdaq: 'open' },
  provider: 'preview',
};

// ── Alerts ────────────────────────────────────────────────────────────────────

export const MOCK_ALERTS: AlertRule[] = [
  {
    id: 'alert-1',
    symbol: 'NVDA',
    threshold: 900,
    created_at: daysAgo(3),
  },
];
