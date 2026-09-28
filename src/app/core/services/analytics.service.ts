import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  private readonly visitorKey = 'tusa-visitor-id';
  private readonly apiBase = environment.apiUrl?.replace(/\/$/, '') ?? '';

  constructor(private http: HttpClient) {}

  track(name: FunnelEvent, eventId?: string, ref?: string): void {
    if (typeof window === 'undefined') return;
    const events = this.read();
    const currentRef = ref ?? (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('ref') ?? undefined : undefined);
    events.push({ name, eventId, ref: currentRef, createdAt: new Date().toISOString() });
    window.localStorage.setItem(this.storageKey, JSON.stringify(events.slice(-500)));

    if (this.apiBase) {
      this.http.post(`${this.apiBase}/api/analytics`, {
        name,
        eventId,
        ref: currentRef,
        visitorId: this.getVisitorId(),
      })
        .pipe(catchError(() => of(null)))
        .subscribe();
    }
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

  private getVisitorId(): string {
    let visitorId = window.localStorage.getItem(this.visitorKey);
    if (!visitorId) {
      visitorId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
      window.localStorage.setItem(this.visitorKey, visitorId);
    }
    return visitorId;
  }
}
