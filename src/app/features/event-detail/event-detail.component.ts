import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { AnalyticsService } from '../../core/services/analytics.service';
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
          <div class="going-row">
            @if (ev.goingCount !== undefined && ev.goingCount > 0) {
              <span class="going-count">{{ ev.goingCount }} {{ goingLabel(ev.goingCount) }}</span>
            }
            <button
              type="button"
              class="btn-going"
              [class.active]="ev.userGoing"
              (click)="toggleGoing(ev)"
              [disabled]="goingLoading()">
              {{ ev.userGoing ? 'Участвую' : 'Буду участвовать' }}
            </button>
          </div>
          <button type="button" class="btn-share" (click)="share(ev)">{{ shareLabel() }}</button>
          <a [routerLink]="['/events', ev.id, 'buy']" class="btn-buy" queryParamsHandling="preserve">Получить билет</a>
        </div>
      </div>
    } @else {
      <p>Событие не найдено.</p>
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
      .going-row { display: flex; align-items: center; gap: 0.75rem; margin: 1rem 0; flex-wrap: wrap; }
      .going-count { font-size: 0.9rem; opacity: 0.9; }
      .btn-going {
        padding: 0.5rem 1rem;
        border-radius: 8px;
        border: 2px solid var(--tg-button, #00FF41);
        background: transparent;
        color: var(--tg-button, #00FF41);
        font-size: 0.95rem;
        font-weight: 500;
        cursor: pointer;
        box-shadow: 0 0 8px rgba(0, 255, 65, 0.3);
      }
      .btn-going.active {
        background: var(--tg-button, #00FF41);
        color: var(--tg-button-text, #0a0a0c);
        box-shadow: var(--tg-glow, 0 0 12px #00FF41);
      }
      .btn-going:disabled { opacity: 0.6; cursor: not-allowed; }
      .btn-buy {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background: var(--tg-button, #00FF41);
        color: var(--tg-button-text, #0a0a0c);
        border-radius: 8px;
        text-decoration: none;
        font-weight: 500;
        box-shadow: var(--tg-glow, 0 0 12px #00FF41);
      }
      .btn-share { display: block; margin: .75rem 0; padding: .65rem 1rem; border: 1px solid rgba(255,255,255,.18); border-radius: 8px; background: transparent; color: var(--tg-text, #e4e4e7); cursor: pointer; }
    `,
  ],
})
export class EventDetailComponent implements OnInit {
  event = signal<EventItem | null>(null);
  goingLoading = signal(false);
  shareLabel = signal('Поделиться событием');

  constructor(
    private route: ActivatedRoute,
    private data: DataService,
    private analytics: AnalyticsService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.analytics.track('event_open', id);
      this.data.getEventById(id).subscribe((ev) => this.event.set(ev ?? null));
    }
  }

  goingLabel(n: number): string {
    const last = n % 10;
    const last2 = n % 100;
    if (last === 1 && last2 !== 11) return 'человек идёт';
    if (last >= 2 && last <= 4 && (last2 < 12 || last2 > 14)) return 'человека идут';
    return 'человек идут';
  }

  toggleGoing(ev: EventItem): void {
    if (this.goingLoading()) return;
    this.goingLoading.set(true);
    this.data.setGoing(ev.id).subscribe((res) => {
      this.goingLoading.set(false);
      if (res) {
        this.event.update((e) => (e ? { ...e, goingCount: res.goingCount, userGoing: res.userGoing } : e));
      }
    });
  }

  async share(ev: EventItem): Promise<void> {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `${ev.title} — ${ev.date} в ${ev.place}. Билеты в TUSA.`;
    this.analytics.track('event_share', ev.id);
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title: ev.title, text, url });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(`${text} ${url}`);
        this.shareLabel.set('Ссылка скопирована');
        setTimeout(() => this.shareLabel.set('Поделиться событием'), 2200);
      }
    } catch {
      this.shareLabel.set('Не удалось поделиться');
      setTimeout(() => this.shareLabel.set('Поделиться событием'), 2200);
    }
  }
}
