import { get, post, del } from './client';
import { MOCK_ALERTS } from '../mock-data';

export interface AlertRule {
  id: string;
  symbol: string;
  threshold: number;
  created_at: string;
}

export async function getAlerts(symbol: string): Promise<AlertRule[]> {
  try {
    return await get<AlertRule[]>(`/v1/me/alerts?symbol=${symbol}`);
  } catch {
    return MOCK_ALERTS.filter((a) => a.symbol === symbol.toUpperCase());
  }
}

export async function setAlert(symbol: string, threshold: number): Promise<AlertRule> {
  try {
    return await post<AlertRule>('/v1/me/alerts', { symbol, threshold });
  } catch {
    return {
      id: `mock-alert-${Date.now()}`,
      symbol: symbol.toUpperCase(),
      threshold,
      created_at: new Date().toISOString(),
    };
  }
}

export function deleteAlert(id: string): Promise<void> {
  return del<void>(`/v1/me/alerts/${id}`).catch(() => {});
}
