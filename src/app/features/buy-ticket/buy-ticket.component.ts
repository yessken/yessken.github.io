import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import type { EventItem } from '../../core/types/event.model';

@Component({
  selector: 'app-buy-ticket',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (event(); as ev) {
      <div class="buy-ticket">
        <h1>Получить билет</h1>
        <p class="event-title">{{ ev.title }}</p>
        <p class="price">{{ ev.price ? ev.price + ' ₸' : 'Бесплатно' }}</p>
        @if (success()) {
          <div class="success">
            <strong>Билет оформлен</strong>
            <p>Билет сохранён в разделе «Мои билеты».</p>
            <a routerLink="/my-tickets" class="link" queryParamsHandling="preserve">Открыть мои билеты</a>
          </div>
        } @else {
          <p class="label">Способ оплаты</p>
          <div class="methods">
            <button type="button" class="method" [class.selected]="paymentMethod() === 'kaspi'" (click)="paymentMethod.set('kaspi')">Kaspi Pay <small>быстро и привычно</small></button>
            <button type="button" class="method" [class.selected]="paymentMethod() === 'telegram'" (click)="paymentMethod.set('telegram')">Telegram Pay <small>внутри Telegram</small></button>
          </div>
          <button type="button" class="submit" (click)="purchase()" [disabled]="loading()">{{ loading() ? 'Подтверждаем…' : ev.price ? 'Перейти к оплате' : 'Подтвердить участие' }}</button>
          <p class="hint">Оплата проходит через защищённый платёжный шлюз. Данные карты не хранятся в TUSA.</p>
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
      .price { margin-bottom: 1.5rem; }
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
      .success { padding: 1rem; background: var(--tg-surface, #252529); border-radius: 10px; }
      .success p { margin: .5rem 0; opacity: .8; }
      .link { display: inline-block; margin-top: 1rem; color: var(--tg-button, #00FF41); text-shadow: var(--tg-glow-text, 0 0 8px #00FF41); }
    `,
  ],
})
export class BuyTicketComponent implements OnInit {
  event = signal<EventItem | null>(null);
  paymentMethod = signal<'kaspi' | 'telegram'>('kaspi');
  loading = signal(false);
  success = signal(false);

  constructor(
    private route: ActivatedRoute,
    private data: DataService,
    private analytics: AnalyticsService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.analytics.track('checkout_view', id);
      this.data.getEventById(id).subscribe((ev) => this.event.set(ev ?? null));
    }
  }

  purchase(): void {
    const ev = this.event();
    if (!ev || this.loading()) return;
    this.loading.set(true);
    this.analytics.track('payment_start', ev.id);
    this.data.purchaseTicket(ev.id, this.paymentMethod()).subscribe((ticket) => {
      this.loading.set(false);
      this.success.set(!!ticket);
      if (ticket) this.analytics.track('purchase_success', ev.id);
    });
  }
}
