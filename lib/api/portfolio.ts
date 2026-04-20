import { del, get, patch, post } from './client';
import type { HoldingRead, PortfolioAnalytics, PortfolioRead, PortfolioSnapshotResponse, HoldingSnapshot } from '@thesis-ai/api-types';
import { MOCK_PORTFOLIO_SNAPSHOT } from '../mock-data';

export type { HoldingRead, HoldingSnapshot, PortfolioAnalytics, PortfolioRead, PortfolioSnapshotResponse };

export async function getPortfolioSnapshot(): Promise<PortfolioSnapshotResponse[]> {
  try {
    return await get<PortfolioSnapshotResponse[]>('/v1/me/portfolio/snapshot');
  } catch {
    return MOCK_PORTFOLIO_SNAPSHOT;
  }
}

export function getPortfolios(): Promise<PortfolioRead[]> {
  return get<PortfolioRead[]>('/v1/portfolios');
}

export function createPortfolio(userId: string, name: string): Promise<PortfolioRead> {
  return post<PortfolioRead>('/v1/portfolios', { user_id: userId, name, holdings: [] });
}

export function updatePortfolio(id: string, name: string): Promise<PortfolioRead> {
  return patch<PortfolioRead>(`/v1/portfolios/${id}`, { name });
}

export function deletePortfolio(id: string): Promise<void> {
  return del<void>(`/v1/portfolios/${id}`);
}

export function addHolding(portfolioId: string, symbol: string, quantity: number, avgCost: number): Promise<HoldingRead> {
  return post<HoldingRead>(`/v1/portfolios/${portfolioId}/holdings`, { symbol, quantity, avg_cost: avgCost });
}

export function removeHolding(portfolioId: string, holdingId: string): Promise<void> {
  return del<void>(`/v1/portfolios/${portfolioId}/holdings/${holdingId}`);
}
