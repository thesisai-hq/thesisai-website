interface ActionEvent {
  id: string;
  name: string;
  timestamp: number;
  properties?: Record<string, unknown>;
}

const KEY = 'thesis.actions.v1';

export function logAction(name: string, properties?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  const stored: ActionEvent[] = JSON.parse(localStorage.getItem(KEY) ?? '[]');
  stored.unshift({ id: crypto.randomUUID(), name, timestamp: Date.now(), properties });
  localStorage.setItem(KEY, JSON.stringify(stored.slice(0, 200)));
}

export function getRecentActions(limit = 40): ActionEvent[] {
  if (typeof window === 'undefined') return [];
  const stored: ActionEvent[] = JSON.parse(localStorage.getItem(KEY) ?? '[]');
  return stored.slice(0, limit);
}

export function clearActions(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}

export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export type { ActionEvent };
