import { get } from './client';
import type {
  MarketFinancialsResponse,
  MarketFundamentals,
  MarketMoversResponse,
  MarketNewsResponse,
  MarketStatusResponse,
  SnapshotData,
  TickerOverview,
} from '@thesis-ai/api-types';
import {
  generateMockBars,
  MOCK_FUNDAMENTALS,
  MOCK_MARKET_MOVERS,
  MOCK_MARKET_NEWS,
  MOCK_MARKET_OVERVIEW,
  MOCK_MARKET_STATUS,
  MOCK_SNAPSHOTS,
} from '../mock-data';

export type {
  MarketFinancialsResponse,
  MarketFundamentals,
  MarketMoversResponse,
  MarketNewsResponse,
  MarketStatusResponse,
  SnapshotData,
  TickerOverview,
};

export async function getSnapshots(symbols: string[]): Promise<Record<string, SnapshotData>> {
  const tickers = symbols.join(',');
  try {
    return await get<Record<string, SnapshotData>>(`/v1/market/snapshots?tickers=${tickers}`);
  } catch {
    const result: Record<string, SnapshotData> = {};
    for (const sym of symbols) {
      const upper = sym.toUpperCase();
      if (MOCK_SNAPSHOTS[upper]) result[upper] = MOCK_SNAPSHOTS[upper];
    }
    return result;
  }
}

export interface Bar {
  t: string;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

// interval → minutes per bar
const INTERVAL_MINUTES: Record<string, number> = {
  '5m': 5, '15m': 15, '1h': 60, '1d': 1440,
};

export async function getMarketBars(symbol: string, interval: string, limit: number): Promise<Bar[]> {
  try {
    return await get<Bar[]>(`/v1/market/bars/${symbol}?interval=${interval}&limit=${limit}`);
  } catch {
    return generateMockBars(symbol, limit, INTERVAL_MINUTES[interval] ?? 60);
  }
}

export async function getMarketQuote(symbol: string): Promise<SnapshotData> {
  try {
    return await get<SnapshotData>(`/v1/market/quote/${symbol}`);
  } catch {
    return MOCK_SNAPSHOTS[symbol.toUpperCase()] ?? { price: 0, change_percent: 0 };
  }
}

export async function getMarketOverview(symbol: string): Promise<TickerOverview> {
  try {
    return await get<TickerOverview>(`/v1/market/overview/${symbol}`);
  } catch {
    return MOCK_MARKET_OVERVIEW(symbol);
  }
}

export async function getMarketFundamentals(symbol: string): Promise<MarketFundamentals> {
  try {
    return await get<MarketFundamentals>(`/v1/market/fundamentals/${symbol}`);
  } catch {
    return MOCK_FUNDAMENTALS(symbol);
  }
}

export async function getMarketNews(symbol: string): Promise<MarketNewsResponse> {
  try {
    return await get<MarketNewsResponse>(`/v1/market/news/${symbol}`);
  } catch {
    return MOCK_MARKET_NEWS(symbol);
  }
}

export async function getMarketMovers(direction: 'gainers' | 'losers'): Promise<MarketMoversResponse> {
  try {
    return await get<MarketMoversResponse>(`/v1/market/movers/${direction}`);
  } catch {
    return MOCK_MARKET_MOVERS(direction);
  }
}

export async function getMarketStatus(): Promise<MarketStatusResponse> {
  try {
    return await get<MarketStatusResponse>('/v1/market/status');
  } catch {
    return MOCK_MARKET_STATUS;
  }
}

export async function getMarketFinancials(
  symbol: string,
  type: 'income' | 'balance' | 'cash'
): Promise<MarketFinancialsResponse> {
  try {
    return await get<MarketFinancialsResponse>(`/v1/market/financials/${symbol}/${type}`);
  } catch {
    return { symbol, statement_type: type, items: [], provider: 'preview' };
  }
}
