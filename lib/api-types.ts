/**
 * Local type definitions that previously lived in the @thesis-ai/api-types
 * workspace package. Defined here so the site can be deployed as a standalone
 * Next.js app without a monorepo setup.
 */

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  access_token: string;
  token: string;
  token_type: string;
  user: { id: string; email: string; created_at: string };
}

// ── Watchlist ─────────────────────────────────────────────────────────────────

export interface WatchlistItem {
  id: string;
  symbol: string;
  created_at: string;
}

export interface Watchlist {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  items: WatchlistItem[];
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export interface InsightCardSummary {
  id: string;
  symbol: string;
  title: string;
  summary: string;
  confidence: number;
  sentiment: string;
  created_at: string;
  read_at: string | null;
}

export interface WatchlistHighlight {
  symbol: string;
  note: string;
  price: number;
  change: number;
  change_percent: number;
  ai_score: number;
  ai_action: string;
  ai_reason: string;
  alert_level: string | null;
  sentiment: string;
}

export interface WatchlistSummary {
  id: string;
  name: string;
  highlights: WatchlistHighlight[];
}

export interface PortfolioSummary {
  id: string;
  name: string;
  total_positions: number;
  total_cost: number;
  total_value: number;
  daily_change: number;
  daily_change_percent: number;
  total_return: number;
  total_return_percent: number;
}

export interface NotificationRead {
  id: string;
  title: string;
  body: string;
  created_at: string;
  severity: string;
  symbol: string | null;
}

export interface DashboardOverviewResponse {
  insights: InsightCardSummary[];
  watchlists: WatchlistSummary[];
  portfolios: PortfolioSummary[];
  notifications: NotificationRead[];
}

export interface MoveAction {
  label: string;
  type: string;
}

export interface TodayMove {
  ticker: string;
  title: string;
  why: string;
  confidence: number;
  signals: string[];
  cta?: MoveAction[];
  price: number;
  change_percent: number;
}

export interface MovesTodayResponse {
  as_of: string;
  regime: string;
  provider: string;
  moves: TodayMove[];
}

// ── Insights ──────────────────────────────────────────────────────────────────

export interface InsightRead {
  id: string;
  user_id?: string;
  symbol: string;
  title: string;
  body: string;
  signals?: string[];
  action?: string;
  confidence: number;
  created_at: string;
  read_at: string | null;
}

export interface InsightListResponse {
  items: InsightRead[];
  total: number;
}

// ── Macro ─────────────────────────────────────────────────────────────────────

export interface MacroSnapshot {
  regime: string;
  snapshot: {
    cpi_yoy: number;
    yield_10y: number;
    yield_2y: number;
    fed_funds_rate: number;
    unemployment: number;
    gdp_growth: number;
  } | null;
  as_of: string;
  provider: string;
}

// ── Market ────────────────────────────────────────────────────────────────────

export interface SnapshotData {
  price: number;
  change_percent: number;
  fmv?: number;
  as_of?: string;
}

export interface TickerOverview {
  symbol: string;
  name: string;
  market?: string;
  locale?: string;
  active?: boolean;
  sector?: string;
  industry?: string;
  description?: string;
  market_cap?: number | null;
  pe_ratio?: number;
  week_52_high?: number;
  week_52_low?: number;
  avg_volume?: number;
  provider: string;
}

export interface MarketFundamentals {
  symbol: string;
  company_name?: string;
  sector?: string;
  industry?: string;
  market_cap?: number | null;
  pe_ratio?: number | null;
  eps?: number | null;
  dividend_yield?: number | null;
  shares_outstanding?: number | null;
  updated_at?: string;
  revenue_ttm?: number;
  net_income_ttm?: number;
  eps_ttm?: number;
  pb_ratio?: number;
  debt_to_equity?: number;
  roe?: number;
  provider: string;
}

export interface MarketNewsItem {
  id: string;
  title: string;
  headline?: string;
  summary: string;
  url: string;
  source: string;
  published_at: string;
  symbols?: string[];
  sentiment?: string;
}

export interface MarketNewsResponse {
  symbol: string;
  items: MarketNewsItem[];
  provider: string;
}

export interface MarketMover {
  ticker: string;
  price: number;
  change_percent: number;
  name?: string;
  volume?: number;
}

export interface MarketMoversResponse {
  direction: string;
  count?: number;
  tickers?: MarketMover[];
  items?: MarketMover[];
  as_of?: string;
  provider: string;
}

export interface MarketStatusResponse {
  market?: string;
  server_time?: string;
  after_hours?: boolean;
  early_hours?: boolean;
  exchanges?: Record<string, string>;
  is_open?: boolean;
  next_open?: string;
  next_close?: string;
  session?: string;
  provider: string;
}

export interface FinancialLineItem {
  label: string;
  value: number | null;
  period: string;
}

export interface MarketFinancialsResponse {
  symbol: string;
  statement_type: string;
  items: FinancialLineItem[];
  provider: string;
}

// ── News ──────────────────────────────────────────────────────────────────────

export interface NewsFeedItem {
  id: string;
  title: string;
  headline?: string;
  summary: string;
  url: string;
  source: string;
  published_at: string;
  symbols: string[];
  channel?: string | null;
  sentiment?: string;
}

export interface NewsFeedResponse {
  items: NewsFeedItem[];
  next_cursor: string | null;
  provider?: string;
  as_of?: string;
  total?: number;
}

// ── Portfolio ─────────────────────────────────────────────────────────────────

export interface HoldingRead {
  id: string;
  symbol: string;
  quantity: number;
  avg_cost: number;
  created_at: string;
  current_price?: number;
  current_value?: number;
  total_return?: number;
  total_return_percent?: number;
}

export interface PortfolioRead {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  holdings: HoldingRead[];
}

export interface PortfolioAnalytics {
  beta: number;
  sharpe: number;
  volatility: number;
  max_drawdown: number;
  correlation_sp500: number;
  correlation_nasdaq: number;
  sector_exposure: { sector: string; weight: number }[];
  factor_exposure: { factor: string; score: number }[];
}

export interface HoldingSnapshot {
  symbol: string;
  quantity: number;
  avg_cost: number;
  cost_basis: number;
  current_price: number | null;
  current_value: number | null;
  unrealized_pnl: number | null;
  unrealized_pnl_pct: number | null;
  change_today: number | null;
  change_today_pct: number | null;
}

export interface PortfolioSnapshotResponse {
  portfolio_id: string;
  portfolio_name: string;
  holdings: HoldingSnapshot[];
  total_value: number;
  total_cost: number;
  unrealized_pnl: number;
  unrealized_pnl_pct: number;
  daily_change: number;
  daily_change_pct: number;
  top_gainer: string | null;
  top_loser: string | null;
  as_of: string;
  stale: boolean;
  provider: string;
}

// ── Preferences ───────────────────────────────────────────────────────────────

export interface UserPreferences {
  theme?: 'dark' | 'light' | 'system';
  default_watchlist_id?: string;
  notifications_enabled?: boolean;
  brief_time?: string;
  risk_profile?: 'conservative' | 'moderate' | 'aggressive';
  risk_tolerance: 'conservative' | 'moderate' | 'aggressive' | null;
  experience_level: 'beginner' | 'intermediate' | 'advanced' | null;
  trading_frequency: 'daily' | 'weekly' | 'monthly' | 'rarely' | null;
  goals: string[];
  interests: string[];
}

// ── AI / Conversations ────────────────────────────────────────────────────────

export interface AiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AiCitation {
  source: string;
  url?: string;
  excerpt?: string;
}

export interface AiChatRequest {
  messages: AiMessage[];
  symbols?: string[];
  conversation_id?: string;
}

export interface AiChatResponse {
  message: AiMessage;
  citations?: AiCitation[];
  conversation_id?: string;
}

export interface AgentResult {
  name: string;
  summary: string;
  confidence: number;
  signals: string[];
  citations?: AiCitation[];
}

export interface AgentBundle {
  symbols: string[];
  generated_at?: string;
  results: AgentResult[];
  synthesized_thesis?: string;
  overall_confidence?: number;
}

export interface AiContextResponse {
  context: string;
  context_summary?: string;
  agents: AgentBundle | null;
  generated_at?: string;
}

export interface AiThesisCard {
  symbol: string;
  headline: string;
  summary: string;
  signals: string[];
  price: number;
  change_percent: number;
  generated_at: string;
  action?: string;
}

export interface AiThesisCardsResponse {
  cards: AiThesisCard[];
  generated_at: string;
}

export interface StreamChunk {
  conversation_id?: string;
  delta?: string;
  done?: boolean;
  [key: string]: unknown;
}

export interface ConversationSummary {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export interface ConversationListResponse {
  items: ConversationSummary[];
  total: number;
}

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  citations?: AiCitation[];
}

export interface ConversationMessagesResponse {
  conversation_id: string;
  messages: ChatMessageItem[];
  items: ChatMessageItem[];
  total: number;
}
