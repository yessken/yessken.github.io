import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import type { EventItem } from '../../core/types/event.model';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="events-list">
      <h1>Мероприятия</h1>
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
          <a [routerLink]="['/events', event.id]" class="card">
            <img [src]="event.imageUrl" [alt]="event.title" />
            <div class="card-body">
              <span class="category">{{ event.category }}</span>
              <h3>{{ event.title }}</h3>
              <p class="meta">{{ event.date }} · {{ event.place }}</p>
              <p class="price">{{ event.price ? event.price + ' ₸' : 'Бесплатно' }}</p>
            </div>
          </a>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .events-list { padding: 1rem; padding-bottom: 80px; }
      h1 { margin: 0 0 1rem; font-size: 1.5rem; }
      .filters { margin-bottom: 1rem; }
      .filters select { padding: 0.5rem; border-radius: 8px; min-width: 160px; }
      .cards { display: flex; flex-direction: column; gap: 1rem; }
      .card {
        display: block;
        background: var(--tg-bg, #fff);
        border-radius: 12px;
        overflow: hidden;
        text-decoration: none;
        color: var(--tg-text, #000);
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
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

  constructor(private data: DataService) {}

  ngOnInit(): void {
    this.data.getEvents().subscribe((list) => this.events.set(list));
  }

  filteredEvents = () => {
    const list = this.events();
    if (!this.category) return list;
    return list.filter((e) => e.category === this.category);
  };
}
