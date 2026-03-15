import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import type { EventItem } from '../../core/types/event.model';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (event(); as ev) {
      <div class="event-detail">
        <img [src]="ev.imageUrl" [alt]="ev.title" class="cover" />
        <div class="body">
          <span class="category">{{ ev.category }}</span>
          <h1>{{ ev.title }}</h1>
          <p class="meta">{{ ev.date }} {{ ev.time }} · {{ ev.place }}</p>
          <p class="address">{{ ev.address }}</p>
          <p class="description">{{ ev.description }}</p>
          <p class="price">{{ ev.price ? ev.price + ' ₸' : 'Бесплатно' }}</p>
          <a [routerLink]="['/events', ev.id, 'buy']" class="btn-buy">Купить билет</a>
        </div>
      </div>
    } @else {
      <p>Мероприятие не найдено.</p>
    }
  `,
  styles: [
    `
      .event-detail { padding-bottom: 80px; }
      .cover { width: 100%; height: 200px; object-fit: cover; }
      .body { padding: 1rem; }
      .category { font-size: 0.75rem; text-transform: uppercase; opacity: 0.8; }
      h1 { margin: 0.25rem 0 0.5rem; font-size: 1.35rem; }
      .meta, .address { margin: 0.25rem 0; font-size: 0.95rem; opacity: 0.9; }
      .description { margin: 1rem 0; }
      .price { font-size: 1.1rem; font-weight: 600; margin: 1rem 0; }
      .btn-buy {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background: var(--tg-button, #0088cc);
        color: var(--tg-button-text, #fff);
        border-radius: 8px;
        text-decoration: none;
        font-weight: 500;
      }
    `,
  ],
})
export class EventDetailComponent implements OnInit {
  event = signal<EventItem | null>(null);

  constructor(
    private route: ActivatedRoute,
    private data: DataService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.data.getEventById(id).subscribe((ev) => this.event.set(ev ?? null));
  }
}
