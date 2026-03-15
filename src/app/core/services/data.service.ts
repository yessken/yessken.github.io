import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { MockDataService } from './mock-data.service';
import { EventsApiService } from './events-api.service';
import type { EventItem, Ticket, TelegramGroupItem } from '../types/event.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DataService {
  private useApi = !!environment.apiUrl?.trim();

  constructor(
    private mock: MockDataService,
    private api: EventsApiService
  ) {}

  getEvents(category?: string): Observable<EventItem[]> {
    if (this.useApi) return this.api.getEvents(category);
    return of(this.mock.getEvents()).pipe(
      switchMap((list) => (category ? of(list.filter((e) => e.category === category)) : of(list)))
    );
  }

  getEventById(id: string): Observable<EventItem | null> {
    if (this.useApi) return this.api.getEventById(id);
    return of(this.mock.getEventById(id) ?? null);
  }

  getTickets(): Observable<Ticket[]> {
    if (this.useApi) return this.api.getTickets();
    return of(this.mock.getTickets());
  }

  createEvent(event: Omit<EventItem, 'id'>): Observable<EventItem | null> {
    if (this.useApi) return this.api.createEvent(event);
    return of(this.mock.addEvent(event));
  }

  purchaseTicket(eventId: string): Observable<Ticket | null> {
    if (this.useApi) return this.api.purchaseTicket(eventId);
    const ev = this.mock.getEventById(eventId);
    if (!ev) return of(null);
    return of(this.mock.addTicket({ eventId: ev.id, eventTitle: ev.title, eventDate: ev.date, eventPlace: ev.place }));
  }

  getTelegramGroups(): Observable<TelegramGroupItem[]> {
    if (this.useApi) return this.api.getTelegramGroups();
    return of([]);
  }

  setGoing(eventId: string): Observable<{ goingCount: number; userGoing: boolean } | null> {
    if (this.useApi) return this.api.setGoing(eventId);
    return of(this.mock.setGoing(eventId));
  }
}
