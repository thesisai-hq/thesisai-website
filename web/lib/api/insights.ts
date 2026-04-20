import { get, patch } from './client';
import type { InsightRead, InsightListResponse } from '@thesis-ai/api-types';
import { MOCK_INSIGHTS } from '../mock-data';

export type { InsightRead, InsightListResponse };

export async function getInsights(unreadOnly = false): Promise<InsightListResponse> {
  try {
    return await get<InsightListResponse>(
      `/v1/me/insights${unreadOnly ? '?unread_only=true' : ''}`
    );
  } catch {
    const items = unreadOnly
      ? MOCK_INSIGHTS.filter((i) => !i.read_at)
      : MOCK_INSIGHTS;
    return { items, total: items.length };
  }
}

export function markInsightRead(id: string): Promise<void> {
  return patch<void>(`/v1/me/insights/${id}/read`, {}).catch(() => {});
}
