import { del, get, patch, post } from './client';
import type { WatchlistItem, Watchlist } from '@thesis-ai/api-types';
import { MOCK_WATCHLISTS } from '../mock-data';

export type { WatchlistItem, Watchlist };

export async function getWatchlists(): Promise<Watchlist[]> {
  try {
    return await get<Watchlist[]>('/v1/watchlists');
  } catch {
    return MOCK_WATCHLISTS;
  }
}

export function getWatchlist(id: string): Promise<Watchlist> {
  return get<Watchlist>(`/v1/watchlists/${id}`);
}

export function addSymbol(watchlistId: string, symbol: string): Promise<WatchlistItem> {
  return post<WatchlistItem>(`/v1/watchlists/${watchlistId}/items`, { symbol });
}

export function removeSymbol(watchlistId: string, itemId: string): Promise<void> {
  return del(`/v1/watchlists/${watchlistId}/items/${itemId}`);
}

export function createWatchlist(userId: string, name: string): Promise<Watchlist> {
  return post<Watchlist>('/v1/watchlists', { user_id: userId, name, items: [] });
}

export function renameWatchlist(id: string, name: string): Promise<Watchlist> {
  return patch<Watchlist>(`/v1/watchlists/${id}`, { name });
}

export function deleteWatchlist(id: string): Promise<void> {
  return del<void>(`/v1/watchlists/${id}`);
}
