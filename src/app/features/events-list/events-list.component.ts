import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import type { EventItem } from '../../core/types/event.model';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="events-list">
      <div class="intro">
        <span class="eyebrow">TUSA / АСТАНА</span>
        <h1>Найди, куда пойти сегодня</h1>
        <p>Живые события рядом, честная цена и вход в один тап.</p>
      </div>
      <div class="filters">
        <select (change)="category = $any($event.target).value">
          <option value="">Все категории</option>
          <option value="концерт">Концерт</option>
          <option value="вечеринка">Вечеринка</option>
          <option value="развлечения">Развлечения</option>
        </select>
      </div>
      <div class="cards">
        @for (event of filteredEvents(); track event.id) {
          <a [routerLink]="['/events', event.id]" class="card" queryParamsHandling="preserve" (click)="analytics.track('event_open', event.id)">
            <img [src]="event.imageUrl" [alt]="event.title" />
            <div class="card-body">
              <span class="category">{{ event.category }}</span>
              <h3>{{ event.title }}</h3>
              <p class="meta">{{ formatDate(event.date) }} · {{ event.place }}</p>
              <p class="price">{{ event.price ? event.price + ' ₸' : 'Бесплатно' }}</p>
            </div>
          </a>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .events-list { padding: 1.25rem; padding-bottom: 80px; max-width: 680px; margin: 0 auto; }
      .intro { margin-bottom: 1.25rem; }
      .eyebrow { color: var(--tg-button, #00FF41); font-size: .7rem; font-weight: 800; letter-spacing: .14em; }
      h1 { margin: 0 0 1rem; font-size: 1.5rem; }
      .intro p { margin: -.5rem 0 0; opacity: .7; font-size: .92rem; line-height: 1.45; }
      .filters { margin-bottom: 1rem; }
      .filters select { padding: 0.65rem .75rem; border-radius: 8px; min-width: 160px; background: var(--tg-surface, #252529); color: var(--tg-text, #e4e4e7); border: 1px solid rgba(255,255,255,.12); }
      .cards { display: flex; flex-direction: column; gap: 1rem; }
      .card {
        display: block;
        background: var(--tg-surface, #252529);
        border-radius: 12px;
        overflow: hidden;
        text-decoration: none;
        color: var(--tg-text, #e4e4e7);
        box-shadow: 0 8px 24px rgba(0,0,0,0.18);
      }
      .card img { width: 100%; height: 140px; object-fit: cover; }
      .card-body { padding: 1rem; }
      .category { font-size: 0.75rem; text-transform: uppercase; opacity: 0.8; }
      .card h3 { margin: 0.25rem 0; font-size: 1.1rem; }
      .meta, .price { margin: 0.25rem 0; font-size: 0.9rem; opacity: 0.9; }
    `,
  ],
})
export class EventsListComponent implements OnInit {
  category = '';
  events = signal<EventItem[]>([]);

  constructor(private data: DataService, protected analytics: AnalyticsService) {}

  ngOnInit(): void {
    this.analytics.track('catalog_view');
    this.data.getEvents().subscribe((list) => this.events.set(list));
  }

  filteredEvents = () => {
    const list = this.events();
    if (!this.category) return list;
    return list.filter((e) => e.category === this.category);
  };

  formatDate(date: string): string {
    return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' }).format(new Date(`${date}T12:00:00`));
  }
}
