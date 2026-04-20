import { get, patch } from './client';
import type { UserPreferences } from '@thesis-ai/api-types';

export type { UserPreferences };

export function getPreferences(): Promise<UserPreferences> {
  return get<UserPreferences>('/v1/me/preferences');
}

export function updatePreferences(prefs: Partial<UserPreferences>): Promise<UserPreferences> {
  return patch<UserPreferences>('/v1/me/preferences', prefs);
}
