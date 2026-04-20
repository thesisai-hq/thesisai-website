'use client';

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, unknown> }) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackWebEvent(eventName: string, props?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;

  if (typeof window.plausible === 'function') {
    window.plausible(eventName, props ? { props } : undefined);
    return;
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, props ?? {});
    return;
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: eventName, ...(props ?? {}) });
  }
}
