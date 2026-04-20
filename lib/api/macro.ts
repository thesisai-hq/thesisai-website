import { get } from './client';
import type { MacroSnapshot } from '@thesis-ai/api-types';

export type { MacroSnapshot };

export function getMacroSnapshot(): Promise<MacroSnapshot> {
  return get<MacroSnapshot>('/v1/macro/snapshot');
}
