import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { TelegramService } from './telegram.service';
import type { EventItem, Ticket, TelegramGroupItem } from '../types/event.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EventsApiService {
  private readonly base = environment.apiUrl?.replace(/\/$/, '') ?? '';

  constructor(
    private http: HttpClient,
    private telegram: TelegramService
  ) {}

  private headers(): HttpHeaders {
    const h = new HttpHeaders({ 'Content-Type': 'application/json' });
    const initData = this.telegram.initData;
    if (initData) return h.set('X-Telegram-Init-Data', initData);
    return h;
  }

  getEvents(category?: string): Observable<EventItem[]> {
    if (!this.base) return of([]);
    const params = category ? { category } : {};
    return this.http.get<EventItem[]>(`${this.base}/api/events`, { params: params as any, headers: this.headers() }).pipe(
      catchError(() => of([]))
    );
  }

  getEventById(id: string): Observable<EventItem | null> {
    if (!this.base) return of(null);
    return this.http.get<EventItem>(`${this.base}/api/events/${id}`, { headers: this.headers() }).pipe(
      catchError(() => of(null))
    );
  }

  getTickets(): Observable<Ticket[]> {
    if (!this.base) return of([]);
    return this.http.get<Ticket[]>(`${this.base}/api/tickets/me`, { headers: this.headers() }).pipe(
      catchError(() => of([]))
    );
  }

  createEvent(event: Omit<EventItem, 'id'>): Observable<EventItem | null> {
    if (!this.base) return of(null);
    const body = {
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      place: event.place,
      address: event.address,
      lat: event.lat,
      lng: event.lng,
      category: event.category,
      price: event.price,
      imageUrl: event.imageUrl,
      organizerName: event.organizerName,
    };
    return this.http.post<EventItem>(`${this.base}/api/events`, body, { headers: this.headers() }).pipe(
      catchError(() => of(null))
    );
  }

  purchaseTicket(eventId: string): Observable<Ticket | null> {
    if (!this.base) return of(null);
    return this.http.post<Ticket>(`${this.base}/api/tickets`, { eventId }, { headers: this.headers() }).pipe(
      catchError(() => of(null))
    );
  }

  getTelegramGroups(): Observable<TelegramGroupItem[]> {
    if (!this.base) return of([]);
    return this.http
      .get<TelegramGroupItem[]>(`${this.base}/api/telegram-groups`, { headers: this.headers() })
      .pipe(catchError(() => of([])));
  }

  /** Переключить «Я пойду» для сходки. Возвращает актуальные goingCount и userGoing. */
  setGoing(eventId: string): Observable<{ goingCount: number; userGoing: boolean } | null> {
    if (!this.base) return of(null);
    return this.http
      .post<{ goingCount: number; userGoing: boolean }>(`${this.base}/api/events/${eventId}/going`, {}, { headers: this.headers() })
      .pipe(catchError(() => of(null)));
  }
}
