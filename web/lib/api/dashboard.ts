import { get } from './client';
import type {
  InsightCardSummary,
  WatchlistHighlight,
  WatchlistSummary,
  PortfolioSummary,
  NotificationRead,
  DashboardOverviewResponse,
  MoveAction,
  TodayMove,
  MovesTodayResponse,
} from '@thesis-ai/api-types';

export type {
  InsightCardSummary,
  WatchlistHighlight,
  WatchlistSummary,
  PortfolioSummary,
  NotificationRead,
  DashboardOverviewResponse,
  MoveAction,
  TodayMove,
  MovesTodayResponse,
};

// Backward-compat alias used in mock-data.ts and components
export type DashboardOverview = DashboardOverviewResponse;

export function getDashboardOverview(): Promise<DashboardOverviewResponse> {
  return get<DashboardOverviewResponse>('/v1/dashboard/overview');
}

export function getDashboardInsights(): Promise<InsightCardSummary[]> {
  return get<InsightCardSummary[]>('/v1/dashboard/insights');
}

export function getDashboardNotifications(): Promise<NotificationRead[]> {
  return get<NotificationRead[]>('/v1/dashboard/notifications');
}

export function getMovesToday(): Promise<MovesTodayResponse> {
  return get<MovesTodayResponse>('/v1/me/moves/today');
}
