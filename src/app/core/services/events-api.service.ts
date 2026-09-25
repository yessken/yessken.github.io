import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { TelegramService } from './telegram.service';
import type { AdminEventReport, EventItem, OrganizerOrderRow, Ticket, TelegramGroupItem } from '../types/event.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EventsApiService {
  private readonly base = environment.apiUrl?.replace(/\/$/, '') ?? '';
  readonly eventsError = signal(false);

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
    this.eventsError.set(false);
    const params = category ? { category } : {};
    return this.http.get<EventItem[]>(`${this.base}/api/events`, { params: params as any, headers: this.headers() }).pipe(
      catchError(() => { this.eventsError.set(true); return of([]); })
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

  getOrganizerOrders(): Observable<OrganizerOrderRow[]> {
    if (!this.base) return of([]);
    return this.http.get<OrganizerOrderRow[]>(`${this.base}/api/tickets/organizer`, { headers: this.headers() }).pipe(catchError(() => of([])));
  }

  getAdminOrderReport(): Observable<AdminEventReport[]> {
    if (!this.base) return of([]);
    return this.http.get<AdminEventReport[]>(`${this.base}/api/admin/tickets/by-event`, { headers: this.headers() }).pipe(catchError(() => of([])));
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
      organizerEmail: event.organizerEmail,
      organizerPhone: event.organizerPhone,
      ticketCategories: event.ticketCategories ?? [],
    };
    const endpoint = this.telegram.initData ? '/api/events' : '/api/events/public';
    return this.http.post<EventItem>(`${this.base}${endpoint}`, body, { headers: this.headers() }).pipe(
      catchError(() => of(null))
    );
  }

  purchaseTicket(eventId: string, ticketCategoryId: string, quantity: number, promoCode: string, paymentMethod: 'kaspi' | 'telegram' = 'kaspi'): Observable<Ticket | null> {
    if (!this.base) return of(null);
    const endpoint = this.telegram.initData ? '/api/tickets' : '/api/tickets/public';
    return this.http.post<Ticket>(`${this.base}${endpoint}`, { eventId, ticketCategoryId, quantity, promoCode: promoCode || null, paymentMethod }, { headers: this.headers() }).pipe(
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
