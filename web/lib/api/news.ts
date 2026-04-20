import { get } from './client';
import type { NewsFeedItem, NewsFeedResponse } from '@thesis-ai/api-types';
import { MOCK_NEWS_FEED } from '../mock-data';

export type { NewsFeedItem, NewsFeedResponse };

export async function getNewsFeed(symbols?: string, cursor?: string): Promise<NewsFeedResponse> {
  const params = new URLSearchParams();
  if (symbols) params.set('symbols', symbols);
  if (cursor) params.set('cursor', cursor);
  params.set('limit', '20');
  const qs = params.toString();
  try {
    return await get<NewsFeedResponse>(`/v1/news/feed${qs ? `?${qs}` : ''}`);
  } catch {
    // Filter mock items by symbol if a filter is active
    const items = symbols
      ? MOCK_NEWS_FEED.items.filter(
          (item) =>
            item.symbols.some((s) => symbols.split(',').includes(s)) ||
            item.symbols.length === 0
        )
      : MOCK_NEWS_FEED.items;
    return { ...MOCK_NEWS_FEED, items };
  }
}
