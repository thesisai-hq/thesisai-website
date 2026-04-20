/**
 * Local type definitions that previously lived in the @thesis-ai/api-types
 * workspace package. Defined here so the site can be deployed as a standalone
 * Next.js app without a monorepo setup.
 */

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  access_token: string;
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
  id: string;
  symbol: string;
  title: string;
  rationale: string;
  confidence: number;
  actions: MoveAction[];
  created_at: string;
}

export interface MovesTodayResponse {
  moves: TodayMove[];
  generated_at: string;
}

// ── Insights ──────────────────────────────────────────────────────────────────

export interface InsightRead {
  id: string;
  symbol: string;
  title: string;
  body: string;
  confidence: number;
  sentiment: string;
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
  };
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
  sector?: string;
  industry?: string;
  description?: string;
  market_cap?: number;
  pe_ratio?: number;
  week_52_high?: number;
  week_52_low?: number;
  avg_volume?: number;
  provider: string;
}

export interface MarketFundamentals {
  symbol: string;
  revenue_ttm?: number;
  net_income_ttm?: number;
  eps_ttm?: number;
  pe_ratio?: number;
  pb_ratio?: number;
  debt_to_equity?: number;
  roe?: number;
  provider: string;
}

export interface MarketNewsItem {
  id: string;
  headline: string;
  summary: string;
  url: string;
  source: string;
  published_at: string;
  symbols: string[];
  sentiment?: string;
}

export interface MarketNewsResponse {
  symbol: string;
  items: MarketNewsItem[];
  provider: string;
}

export interface MarketMover {
  symbol: string;
  name: string;
  price: number;
  change_percent: number;
  volume?: number;
}

export interface MarketMoversResponse {
  direction: string;
  items: MarketMover[];
  as_of: string;
  provider: string;
}

export interface MarketStatusResponse {
  is_open: boolean;
  next_open?: string;
  next_close?: string;
  session: string;
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
  headline: string;
  summary: string;
  url: string;
  source: string;
  published_at: string;
  symbols: string[];
  sentiment?: string;
}

export interface NewsFeedResponse {
  items: NewsFeedItem[];
  next_cursor?: string;
  total?: number;
}

// ── Portfolio ─────────────────────────────────────────────────────────────────

export interface HoldingRead {
  id: string;
  symbol: string;
  quantity: number;
  avg_cost: number;
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
  total_value: number;
  total_cost: number;
  total_return: number;
  total_return_percent: number;
  daily_change: number;
  daily_change_percent: number;
}

export interface HoldingSnapshot {
  symbol: string;
  quantity: number;
  avg_cost: number;
  current_price: number;
  current_value: number;
  total_return: number;
  total_return_percent: number;
  weight: number;
}

export interface PortfolioSnapshotResponse {
  portfolio_id: string;
  portfolio_name: string;
  as_of: string;
  analytics: PortfolioAnalytics;
  holdings: HoldingSnapshot[];
}

// ── Preferences ───────────────────────────────────────────────────────────────

export interface UserPreferences {
  theme?: 'dark' | 'light' | 'system';
  default_watchlist_id?: string;
  notifications_enabled?: boolean;
  brief_time?: string;
  risk_profile?: 'conservative' | 'moderate' | 'aggressive';
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
  agent: string;
  summary: string;
  confidence?: number;
  signals?: string[];
  citations?: AiCitation[];
}

export interface AgentBundle {
  symbols: string[];
  agents: AgentResult[];
  synthesized_thesis?: string;
  overall_confidence?: number;
}

export interface AiContextResponse {
  agents: AgentBundle | null;
  context_summary?: string;
  generated_at?: string;
}

export interface AiThesisCard {
  symbol: string;
  thesis: string;
  bull_case: string;
  bear_case: string;
  confidence: number;
  sentiment: string;
  action: string;
  generated_at: string;
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
  items: ChatMessageItem[];
  total: number;
}
