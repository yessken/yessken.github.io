import { Injectable } from '@angular/core';

export type FunnelEvent = 'catalog_view' | 'event_open' | 'checkout_view' | 'payment_start' | 'purchase_success' | 'event_share';

interface StoredFunnelEvent {
  name: FunnelEvent;
  eventId?: string;
  ref?: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly storageKey = 'tusa-funnel-events';

  track(name: FunnelEvent, eventId?: string, ref?: string): void {
    if (typeof window === 'undefined') return;
    const events = this.read();
    const currentRef = ref ?? (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('ref') ?? undefined : undefined);
    events.push({ name, eventId, ref: currentRef, createdAt: new Date().toISOString() });
    window.localStorage.setItem(this.storageKey, JSON.stringify(events.slice(-500)));
  }

  getSummary(): Record<FunnelEvent, number> {
    const summary = {
      catalog_view: 0,
      event_open: 0,
      checkout_view: 0,
      payment_start: 0,
      purchase_success: 0,
      event_share: 0,
    } satisfies Record<FunnelEvent, number>;
    for (const event of this.read()) summary[event.name] += 1;
    return summary;
  }

  private read(): StoredFunnelEvent[] {
    if (typeof window === 'undefined') return [];
    try {
      const parsed = JSON.parse(window.localStorage.getItem(this.storageKey) ?? '[]') as StoredFunnelEvent[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
