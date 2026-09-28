import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { TelegramService } from '../../core/services/telegram.service';
import type { EventItem } from '../../core/types/event.model';

@Component({
  selector: 'app-buy-ticket',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (event(); as ev) {
      <div class="buy-ticket">
        @if (activeCategory(); as category) {
          <h1>Оформить билет</h1>
          <p class="event-title">{{ ev.title }}</p>
          <p class="event-meta">{{ ev.date }} · {{ ev.time }} · {{ ev.place }}</p>
          <section class="price-card" aria-label="Стоимость билета">
            <span>{{ category.name }}</span>
            <strong>{{ totalPrice() | number }} ₸</strong>
            <small>Итоговая цена, включая комиссию TUSA 10%.</small>
          </section>
          <label class="consent">
            <input type="checkbox" [checked]="termsAccepted()" (change)="termsAccepted.set($any($event.target).checked)" />
            <span>Я прочитал(а) и принимаю <a routerLink="/terms">условия покупки</a>.</span>
          </label>
          <button type="button" class="submit" [disabled]="!termsAccepted()" (click)="continueInTelegram(ev)">Продолжить в Telegram</button>
          <p class="hint">Оплата проходит в Telegram в тенге через подключённого платёжного провайдера. Telegram Stars для входа не используются.</p>
        } @else {
          <h1>Билеты временно недоступны</h1>
          <p class="event-title">{{ ev.title }}</p>
          <div class="paused" role="status">
            <strong>Продажи ещё не открыты</strong>
            <p>Платёжный провайдер и цена в тенге пока не настроены. Заказ и списание не создаются.</p>
          </div>
          <a routerLink="/terms" class="link">Условия и поддержка</a>
          <a [routerLink]="['/events', ev.id]" class="link">Вернуться к событию</a>
          <a href="https://t.me/tusa_astana_bot?start=paysupport" class="link">Написать в поддержку</a>
        }
      </div>
    } @else {
      <p>Событие не найдено.</p>
    }
  `,
  styles: [
    `
      .buy-ticket { padding: 1.5rem; }
      h1 { margin: 0 0 1rem; font-size: 1.25rem; }
      .event-title { font-weight: 600; margin-bottom: 0.25rem; }
      .event-meta { opacity: .72; font-size: .9rem; }
      .price-card { display: grid; gap: .35rem; margin: 1rem 0; padding: 1rem; background: var(--tg-surface, #252529); border-radius: 10px; }
      .price-card strong { color: var(--tg-button, #00FF41); font-size: 1.35rem; }
      .price-card small, .hint { opacity: .72; line-height: 1.5; }
      .consent { display: flex; align-items: flex-start; gap: .65rem; margin-top: 1rem; line-height: 1.45; }
      .consent input { margin-top: .2rem; accent-color: var(--tg-button, #00FF41); }
      .consent a { color: var(--tg-button, #00FF41); }
      .submit { width: 100%; margin-top: 1rem; padding: .85rem 1rem; border: 0; border-radius: 8px; background: var(--tg-button, #00FF41); color: var(--tg-button-text, #0a0a0c); font-weight: 700; cursor: pointer; }
      .submit:disabled { opacity: .5; cursor: not-allowed; }
      .hint { font-size: .82rem; }
      .paused { margin: 1rem 0; padding: 1rem; border: 1px solid rgba(242,190,104,.35); border-radius: 10px; background: rgba(242,190,104,.08); }
      .paused p { margin-bottom: 0; line-height: 1.55; opacity: .85; }
      .link { display: block; width: fit-content; margin-top: .9rem; color: var(--tg-button, #00FF41); }
      .categories { display: flex; flex-direction: column; gap: .6rem; margin-bottom: 1rem; }
      .category { display: grid; grid-template-columns: 1fr auto; gap: .2rem .75rem; padding: .75rem; text-align: left; background: var(--tg-surface, #252529); color: var(--tg-text, #e4e4e7); border: 1px solid rgba(255,255,255,.14); border-radius: 8px; cursor: pointer; }
      .category strong { grid-column: 2; grid-row: 1; }
      .category small { opacity: .65; }
      .category.selected { border-color: var(--tg-button, #00FF41); box-shadow: var(--tg-glow, 0 0 12px #00FF41); }
      .quantity-label, .promo-label { display: flex; flex-direction: column; gap: .35rem; margin: .75rem 0; font-size: .85rem; }
      select, input { padding: .65rem; border-radius: 7px; border: 1px solid rgba(255,255,255,.16); background: var(--tg-surface, #252529); color: var(--tg-text, #e4e4e7); }
      .summary { display: flex; flex-direction: column; gap: .4rem; margin: 1rem 0; font-size: .85rem; opacity: .82; }
      .summary span { display: flex; justify-content: space-between; gap: 1rem; }
      .summary .total { padding-top: .6rem; border-top: 1px solid rgba(255,255,255,.12); font-size: 1rem; opacity: 1; }
      .methods { display: flex; flex-direction: column; gap: 0.75rem; }
      .label { margin: 0 0 0.5rem; font-size: 0.85rem; opacity: 0.75; }
      .method {
        padding: 0.75rem 1rem;
        background: var(--tg-surface, #252529);
        color: var(--tg-text, #e4e4e7);
        border: 1px solid rgba(255,255,255,.14);
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
      }
      .method.selected { border-color: var(--tg-button, #00FF41); box-shadow: var(--tg-glow, 0 0 12px #00FF41); }
      .method small { display: block; margin-top: .25rem; opacity: .65; font-size: .75rem; text-align: left; }
      .submit { margin-top: 1rem; width: 100%; padding: .8rem 1rem; border: 0; border-radius: 8px; background: var(--tg-button, #00FF41); color: var(--tg-button-text, #0a0a0c); font-weight: 700; cursor: pointer; }
      .submit:disabled { opacity: .6; cursor: wait; }
      .hint { margin-top: 1rem; font-size: 0.85rem; opacity: 0.8; }
      .error-message { color: #f27b68; }
      .success { padding: 1rem; background: var(--tg-surface, #252529); border-radius: 10px; }
      .success p { margin: .5rem 0; opacity: .8; }
      .link { display: inline-block; margin-top: 1rem; color: var(--tg-button, #00FF41); text-shadow: var(--tg-glow-text, 0 0 8px #00FF41); }
    `,
  ],
})
export class BuyTicketComponent implements OnInit {
  event = signal<EventItem | null>(null);
  termsAccepted = signal(false);
  activeCategory = computed(() => this.event()?.ticketCategories?.find((category) => category.isActive && category.capacity > category.sold) ?? null);
  totalPrice = computed(() => Math.round((this.activeCategory()?.price ?? 0) * 1.1));

  constructor(
    private route: ActivatedRoute,
    private data: DataService,
    private analytics: AnalyticsService,
    private telegram: TelegramService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.analytics.track('checkout_view', id);
      this.data.getEventById(id).subscribe((ev) => {
        this.event.set(ev ?? null);
      });
    }
  }

  continueInTelegram(event: EventItem): void {
    if (!this.termsAccepted()) return;
    this.analytics.track('payment_start', event.id);
    const url = `https://t.me/tusa_astana_bot?start=event_${event.id}`;
    if (!this.telegram.openTelegramLink(url)) window.location.href = url;
  }
}
