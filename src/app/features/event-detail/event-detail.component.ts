import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import type { EventItem } from '../../core/types/event.model';
import QRCode from 'qrcode';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (event(); as ev) {
      <div class="event-detail">
        <img [src]="ev.imageUrl" [alt]="ev.title" class="cover" />
        <div class="body">
          <div class="heading-row">
            <span class="category">{{ ev.category }}</span>
            @if (ev.featured) {
              <span class="featured-badge">Промо-поднятие</span>
            }
          </div>
          <h1>{{ ev.title }}</h1>
          <p class="meta">{{ ev.date }} {{ ev.time }} · {{ ev.place }}</p>
          @if (ev.addressIsPrivate) {
            <div class="private-venue">
              <strong>Место проведения · Астана</strong>
              <span>Точный адрес получат в Telegram только покупатели билета — за 24 часа до события.</span>
              @if (ev.id === 'tusa-2026') { <small>До начала: {{ countdownLabel() }}</small> }
            </div>
          } @else if (ev.address) { <p class="address">{{ ev.address }}</p> }
          @if (ev.id === 'tusa-2026') { <div class="countdown"><span>До начала</span><strong>{{ countdownLabel() }}</strong></div> }
          <p class="description">{{ ev.description }}</p>
          <p class="price">{{ priceLabel(ev) }}</p>
          <button type="button" class="btn-share" (click)="share(ev)">{{ shareLabel() }}</button>
          <button type="button" class="btn-tools" (click)="toolsVisible.update((visible) => !visible)">Материалы для публикации</button>
          @if (toolsVisible()) {
            <div class="share-tools">
              @if (qrCode()) {
                <img class="event-qr" [src]="qrCode()" [alt]="'QR-код события ' + ev.title" />
                <a class="download-qr" [href]="qrCode()" [download]="'tusa-' + ev.id + '-qr.png'">Скачать QR-код</a>
              }
              <textarea readonly [value]="shareText(ev)"></textarea>
              <button type="button" class="copy-text" (click)="copyShareText(ev)">{{ copyLabel() }}</button>
            </div>
          }
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
      .heading-row { display: flex; align-items: center; justify-content: space-between; gap: .5rem; }
      .category { font-size: 0.75rem; text-transform: uppercase; opacity: 0.8; }
      .featured-badge { display: inline-flex; align-items: center; padding: 0.18rem 0.55rem; border-radius: 999px; background: rgba(0,255,65,0.12); color: var(--tg-button, #00FF41); font-size: 0.65rem; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; }
      h1 { margin: 0.25rem 0 0.5rem; font-size: 1.35rem; }
      .meta, .address { margin: 0.25rem 0; font-size: 0.95rem; opacity: 0.9; }
      .description { margin: 1rem 0; }
      .price { font-size: 1.1rem; font-weight: 600; margin: 1rem 0; }
      .private-venue, .countdown { display: grid; gap: .35rem; margin: 1rem 0; padding: .85rem; background: var(--tg-surface, #252529); border: 1px solid rgba(215,243,107,.18); border-radius: 6px; }
      .private-venue strong, .countdown strong { color: var(--tg-button, #d7f36b); }
      .private-venue span, .countdown span { font-size: .8rem; opacity: .72; line-height: 1.4; }
      .private-venue small { color: var(--tg-button, #d7f36b); font-size: .78rem; font-variant-numeric: tabular-nums; }
      .countdown strong { font-size: 1.35rem; font-variant-numeric: tabular-nums; }
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
      @media (max-width: 699px) {
        .btn-buy { position: sticky; bottom: 4.5rem; z-index: 5; display: block; text-align: center; }
      }
      .btn-share { display: block; margin: .75rem 0; padding: .65rem 1rem; border: 1px solid rgba(255,255,255,.18); border-radius: 8px; background: transparent; color: var(--tg-text, #e4e4e7); cursor: pointer; }
      .btn-tools, .copy-text { display: block; width: 100%; margin: .5rem 0; padding: .6rem .8rem; border: 1px solid rgba(255,255,255,.12); border-radius: 8px; background: var(--tg-surface, #252529); color: var(--tg-text, #e4e4e7); cursor: pointer; }
      .share-tools { padding: .75rem; margin: .5rem 0 1rem; background: var(--tg-surface, #252529); border-radius: 8px; }
      .event-qr { display: block; width: 150px; height: 150px; margin: 0 auto .75rem; background: white; }
      .download-qr { display: block; width: fit-content; margin: 0 auto .75rem; color: var(--tg-button, #aabd7e); font-size: .85rem; }
      .share-tools textarea { width: 100%; min-height: 84px; box-sizing: border-box; resize: vertical; padding: .6rem; border: 1px solid rgba(255,255,255,.14); border-radius: 6px; background: transparent; color: var(--tg-text, #e4e4e7); font: inherit; }
    `,
  ],
})
export class EventDetailComponent implements OnInit, OnDestroy {
  event = signal<EventItem | null>(null);
  shareLabel = signal('Поделиться событием');
  copyLabel = signal('Скопировать текст');
  toolsVisible = signal(false);
  qrCode = signal('');
  private now = signal(Date.now());
  private countdownTimer?: ReturnType<typeof setInterval>;
  countdownLabel = computed(() => {
    const now = this.now();
    const ev = this.event();
    if (!ev) return '';
    const startsAt = new Date(`${ev.date}T${ev.time || '19:00'}:00+05:00`).getTime();
    const seconds = Math.max(0, Math.floor((startsAt - now) / 1000));
    if (seconds <= 0) return 'Событие началось';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${days} д ${hours} ч ${minutes} мин ${remainingSeconds} сек`;
  });

  constructor(
    private route: ActivatedRoute,
    private data: DataService,
    private analytics: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.countdownTimer = setInterval(() => this.now.set(Date.now()), 1000);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.analytics.track('event_open', id);
      this.data.getEventById(id).subscribe((ev) => {
        this.event.set(ev ?? null);
        if (ev) this.generateQr(ev);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.countdownTimer) clearInterval(this.countdownTimer);
  }

  priceLabel(ev: EventItem): string {
    const stars = ev.ticketCategories?.find((category) => (category.telegramStarsPrice ?? 0) > 0)?.telegramStarsPrice;
    return stars ? `${stars} Telegram Stars` : ev.price ? `${ev.price} ₸` : 'Бесплатно';
  }

  async share(ev: EventItem): Promise<void> {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/events/${ev.id}?ref=tusa-event-${ev.id}` : '';
    const text = `${ev.title} — ${ev.date} в ${ev.place}. Билеты в TUSA.`;
    this.analytics.track('event_share', ev.id, `tusa-event-${ev.id}`);
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

  shareText(ev: EventItem): string {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/events/${ev.id}?ref=tusa-event-${ev.id}` : '';
    return `${ev.title}\n${ev.date} · ${ev.time} · ${ev.place}\nБилеты в TUSA: ${url}`;
  }

  async copyShareText(ev: EventItem): Promise<void> {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    await navigator.clipboard.writeText(this.shareText(ev));
    this.copyLabel.set('Текст скопирован');
    setTimeout(() => this.copyLabel.set('Скопировать текст'), 2200);
  }

  private async generateQr(ev: EventItem): Promise<void> {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/events/${ev.id}?ref=tusa-event-${ev.id}` : ev.id;
    this.qrCode.set(await QRCode.toDataURL(url, { width: 220, margin: 1, errorCorrectionLevel: 'M' }));
  }
}
