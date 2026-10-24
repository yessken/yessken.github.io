import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { I18nService } from '../../core/services/i18n.service';
import type { EventItem } from '../../core/types/event.model';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="events-list">
      <div class="intro">
        <p class="date-line">{{ i18n.brandCity().toUpperCase() }} / {{ todayLabel() }}</p>
        <h1>{{ i18n.t('events.heading') }}<br /><em>здесь.</em></h1>
        <p>{{ i18n.t('events.subtitle') }}</p>
        <a routerLink="/create-event" class="organizer-link" queryParamsHandling="preserve">{{ i18n.t('events.organizer') }}</a>
      </div>
      <div class="filters">
        <label class="search-label">
          <span class="visually-hidden">Поиск событий</span>
          <input type="search" [placeholder]="i18n.t('events.searchPlaceholder')" [value]="searchQuery" (input)="searchQuery = $any($event.target).value" />
        </label>
        <select (change)="category = $any($event.target).value">
          <option value="">{{ i18n.t('events.filters.all') }}</option>
          <option value="концерт">Концерт</option>
          <option value="вечеринка">Вечеринка</option>
          <option value="развлечения">Развлечения</option>
        </select>
        <select (change)="dateFilter = $any($event.target).value">
          <option value="">Любая дата</option>
          <option value="today">Сегодня</option>
          <option value="weekend">Эти выходные</option>
        </select>
        <select (change)="priceFilter = $any($event.target).value">
          <option value="">Любая цена</option>
          <option value="free">{{ i18n.t('events.filters.free') }}</option>
          <option value="under5000">{{ i18n.t('events.filters.under5000') }}</option>
        </select>
        <label class="availability"><input type="checkbox" [checked]="availableOnly" (change)="availableOnly = $any($event.target).checked" /> {{ i18n.t('events.filters.available') }}</label>
      </div>
      @if (loading()) { <p class="state">{{ i18n.t('events.loading') }}</p> }
      @else if (!filteredEvents().length) {
        <div class="state"><strong>{{ data.eventsError() ? 'Не удалось загрузить события' : i18n.t('events.empty') }}</strong><span>{{ data.eventsError() ? 'Проверьте соединение с сервером.' : 'Попробуйте изменить фильтры.' }}</span><button type="button" (click)="reload()">{{ data.eventsError() ? i18n.t('events.retry') : i18n.t('events.reset') }}</button></div>
      }
      <div class="cards">
        @for (event of filteredEvents(); track event.id) {
          <a [routerLink]="['/events', event.id]" class="card" queryParamsHandling="preserve" (click)="analytics.track('event_open', event.id)">
            <img [src]="event.imageUrl" [alt]="event.title" loading="lazy" />
            <div class="card-body">
              <div class="card-topline">
                <span class="category">{{ event.category }}</span>
                @if (event.isDemo) { <span class="demo-badge">{{ i18n.t('events.demo') }}</span> }
                @if (isIllustrativeImage(event.imageUrl)) { <span class="illustration-badge">{{ i18n.t('events.illustrative') }}</span> }
                @if (event.featured) {
                  <span class="featured-badge">{{ i18n.t('events.promo') }}</span>
                }
              </div>
              <h3>{{ event.title }}</h3>
              <p class="meta">{{ formatDate(event.date) }} · {{ event.place }}</p>
              <p class="price">{{ priceLabel(event) }}</p>
            </div>
          </a>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .events-list { padding: 1.5rem 1.25rem 88px; max-width: 1180px; margin: 0 auto; }
      .intro { margin-bottom: 1.5rem; padding: 1rem 0 1.35rem; border-bottom: 1px solid var(--tg-line); }
      .date-line { margin: 0 0 .7rem !important; color: var(--tg-button, #426c47); font-size: .68rem !important; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; }
      h1 { margin: 0 0 .85rem; font-size: clamp(2.25rem, 9vw, 4.5rem); line-height: .92; font-weight: 500; }
      h1 em { color: var(--tg-button, #426c47); font-weight: 400; }
      .intro p:not(.date-line) { margin: 0; max-width: 34rem; opacity: .66; font-size: .94rem; line-height: 1.5; }
      .organizer-link { display: inline-block; margin-top: .75rem; color: var(--tg-button, #aabd7e); font-size: .8rem; font-weight: 700; text-decoration: none; }
      .filters { display: flex; flex-wrap: wrap; gap: .5rem; margin-bottom: 1.2rem; }
      .search-label { flex: 1 1 100%; }
      .search-label input { box-sizing: border-box; width: 100%; padding: 0.65rem .9rem; border-radius: 999px; background: var(--tg-surface, #ffffff); color: var(--tg-text, #26372b); border: 1px solid var(--tg-line); }
      .visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
      .filters select { padding: 0.65rem .75rem; border-radius: 999px; min-width: 140px; background: var(--tg-surface, #ffffff); color: var(--tg-text, #26372b); border: 1px solid var(--tg-line); }
      .availability { display: inline-flex; align-items: center; gap: .4rem; padding: .55rem .65rem; font-size: .8rem; }
      .state { display: flex; flex-direction: column; gap: .45rem; padding: 1rem; margin: 0 0 1rem; background: var(--tg-surface, #ffffff); border: 1px solid var(--tg-line); border-radius: 8px; }
      .state span { opacity: .72; font-size: .85rem; }
      .state button { width: fit-content; padding: .5rem .7rem; border: 1px solid var(--tg-line); border-radius: 7px; background: transparent; color: var(--tg-text, #26372b); }
      .cards { display: flex; flex-direction: column; gap: 1rem; }
      .card {
        display: block;
        background: var(--tg-surface, #ffffff);
        border-radius: 4px;
        overflow: hidden;
        text-decoration: none;
        color: var(--tg-text, #26372b);
        box-shadow: 0 12px 30px rgba(38,55,43,0.08);
        border: 1px solid var(--tg-line);
      }
      .card img { width: 100%; height: 175px; object-fit: cover; filter: saturate(.82); }
      .card-body { padding: 1rem 1.05rem 1.1rem; }
      .card-topline { display: flex; align-items: center; justify-content: space-between; gap: .5rem; }
      .category { font-size: 0.75rem; text-transform: uppercase; opacity: 0.8; }
      .demo-badge { display: inline-flex; align-items: center; padding: .18rem .45rem; border: 1px solid rgba(242,190,104,.38); border-radius: 999px; color: #f2be68; font-size: .62rem; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; }
      .illustration-badge { color: var(--tg-muted); font-size: .62rem; }
      .featured-badge { display: inline-flex; align-items: center; padding: 0.18rem 0.5rem; border-radius: 999px; background: rgba(66,108,71,.1); color: var(--tg-button, #426c47); font-size: 0.65rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
      .card h3 { margin: .35rem 0 .4rem; font-size: 1.35rem; font-weight: 500; }
      .meta { margin: 0.25rem 0; font-size: 0.86rem; opacity: 0.62; }
      .price { margin: .75rem 0 0; color: var(--tg-button, #426c47); font-size: .92rem; font-weight: 700; }
      @media (min-width: 700px) {
        .search-label { flex: 1 1 100%; }
        .events-list { padding: 4.5rem clamp(2rem, 5vw, 5rem); }
        .intro { display: grid; grid-template-columns: minmax(0, 1fr) minmax(220px, .48fr); column-gap: 4rem; align-items: end; padding-bottom: 2.25rem; }
        .eyebrow, .date-line, h1 { grid-column: 1; }
        .intro p:not(.date-line), .organizer-link { grid-column: 2; }
        h1 { font-size: clamp(3.5rem, 6vw, 6rem); margin-bottom: 0; }
        .intro p:not(.date-line) { grid-row: 2 / span 2; align-self: center; }
        .organizer-link { align-self: start; }
        .filters { margin: 1.75rem 0; }
        .cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.25rem; }
        .card img { height: 190px; }
        .card { transition: transform .2s ease, border-color .2s ease; }
        .card:hover { transform: translateY(-4px); border-color: rgba(66,108,71,.45); }
      }
    `,
  ],
})
export class EventsListComponent implements OnInit {
  searchQuery = '';
  category = '';
  dateFilter = '';
  priceFilter = '';
  availableOnly = false;
  loading = signal(true);
  events = signal<EventItem[]>([]);

  protected readonly i18n = inject(I18nService);

  constructor(protected data: DataService, protected analytics: AnalyticsService) {}

  ngOnInit(): void {
    this.analytics.track('catalog_view');
    this.data.getEvents().subscribe((list) => { this.events.set(list); this.loading.set(false); });
  }

  filteredEvents = () => {
    const today = new Date();
    const query = this.searchQuery.trim().toLocaleLowerCase('ru');
    const day = today.getDay();
    const weekendStart = new Date(today);
    weekendStart.setDate(today.getDate() + (day === 0 ? 0 : 6 - day));
    const weekendEnd = new Date(weekendStart);
    weekendEnd.setDate(weekendStart.getDate() + 1);
    return [...this.events()]
      .filter((event) => !query || [event.title, event.place, event.address, event.description, event.category]
        .some((value) => value?.toLocaleLowerCase('ru').includes(query)))
      .filter((event) => !this.category || event.category === this.category)
      .filter((event) => !this.dateFilter || this.matchesDateFilter(event.date, today, weekendStart, weekendEnd))
      .filter((event) => !this.priceFilter || (this.priceFilter === 'free' ? event.price === 0 || event.price === null : (event.price ?? 0) <= 5000))
      .filter((event) => !this.availableOnly || (event.ticketCategories ?? []).some((category) => category.isActive && category.capacity > category.sold))
      .sort((a, b) => Number(b.featured) - Number(a.featured) || a.date.localeCompare(b.date));
  };

  resetFilters(): void { this.searchQuery = ''; this.category = ''; this.dateFilter = ''; this.priceFilter = ''; this.availableOnly = false; }

  reload(): void {
    if (this.data.eventsError()) this.data.getEvents().subscribe((list) => { this.events.set(list); this.loading.set(false); });
    else this.resetFilters();
  }

  private matchesDateFilter(date: string, today: Date, weekendStart: Date, weekendEnd: Date): boolean {
    const value = new Date(`${date}T12:00:00`);
    if (this.dateFilter === 'today') return value.toDateString() === today.toDateString();
    return value >= weekendStart && value <= weekendEnd;
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' }).format(new Date(`${date}T12:00:00`));
  }

  priceLabel(event: EventItem): string {
    if (event.id === 'tusa-2026' && !event.ticketCategories?.some((category) => category.isActive)) return 'Продажи приостановлены';
    return event.price ? `${event.price} ₸` : 'Бесплатно';
  }

  isIllustrativeImage(imageUrl: string): boolean { return imageUrl.includes('images.unsplash.com'); }

  todayLabel(): string { return new Intl.DateTimeFormat('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date()); }
}
