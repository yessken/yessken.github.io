import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { TelegramService } from '../../core/services/telegram.service';
import type { EventItem, TicketCategory } from '../../core/types/event.model';

@Component({
  selector: 'app-buy-ticket',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (event(); as ev) {
      <div class="buy-ticket">
        <h1>Получить билет</h1>
        <p class="event-title">{{ ev.title }}</p>
        @if (!categories().length) {
          <div class="unavailable"><strong>Продажи пока закрыты</strong><span>{{ ev.addressIsPrivate ? 'Организатор ещё подтверждает место проведения.' : 'Для этого события пока нет активных билетов.' }}</span></div>
        } @else {
        <p class="label">Категория билета</p>
        <div class="categories">
          @for (category of categories(); track category.id) {
            <button type="button" class="category" [class.selected]="selectedCategoryId() === category.id" (click)="selectedCategoryId.set(category.id)">
              <span>{{ category.name }}</span>
              <strong>{{ category.telegramStarsPrice ? (category.telegramStarsPrice | number) + ' ⭐' : category.price ? (category.price | number) + ' ₸' : 'Бесплатно' }}</strong>
              <small>Осталось {{ category.capacity - category.sold }}</small>
            </button>
          }
        </div>
        @if (!isStarsCheckout()) {
        <label class="quantity-label">Количество
          <select [value]="quantity()" (change)="quantity.set(+$any($event.target).value)">
            @for (amount of quantities(); track amount) { <option [value]="amount">{{ amount }}</option> }
          </select>
        </label>
        }
        @if (!isStarsCheckout()) { <label class="promo-label">Промокод
          <input type="text" [value]="promoCode()" (input)="promoCode.set($any($event.target).value)" placeholder="Введите код, если он есть" />
        </label> }
        @if (isStarsCheckout()) {
          <div class="summary stars-summary"><span>Оплата через Telegram Stars</span><strong>{{ selectedCategory().telegramStarsPrice }} ⭐</strong></div>
        } @else {
        <div class="summary">
          <span>Стоимость билетов <strong>{{ baseAmount() | number }} ₸</strong></span>
          @if (discountAmount()) { <span>Скидка <strong>-{{ discountAmount() | number }} ₸</strong></span> }
          <span>Комиссия TUSA 10% <strong>{{ commissionAmount() | number }} ₸</strong></span>
          <span class="total">Итого <strong>{{ totalAmount() | number }} ₸</strong></span>
        </div>
        }
        @if (success()) {
          <div class="success">
            <strong>{{ paymentPending() ? 'Заказ создан' : 'Билет оформлен' }}</strong>
            <p>{{ paymentPending() ? 'Ожидаем подтверждение оплаты. Билет появится после оплаты.' : 'Билет сохранён в разделе «Мои билеты».' }}</p>
            <a routerLink="/my-tickets" class="link" queryParamsHandling="preserve">Открыть мои билеты</a>
          </div>
        } @else {
          <p class="label">Способ оплаты</p>
          @if (telegram.isInTelegram) {
            @if (isStarsCheckout()) {
              <div class="telegram-only"><strong>Telegram Stars</strong><span>Безопасная оплата внутри Telegram.</span></div>
            } @else { <div class="methods">
              <button type="button" class="method" [class.selected]="paymentMethod() === 'kaspi'" (click)="paymentMethod.set('kaspi')">Kaspi Pay <small>быстро и привычно</small></button>
              <button type="button" class="method" [class.selected]="paymentMethod() === 'telegram'" (click)="paymentMethod.set('telegram')">Telegram Pay <small>внутри Telegram</small></button>
            </div> }
          } @else {
            <div class="telegram-only"><strong>Оплата проходит в Telegram</strong><span>Откройте бота, чтобы продолжить оформление и получить защищённую оплату.</span></div>
          }
          <button type="button" class="submit" (click)="purchase()" [disabled]="loading()">{{ loading() ? 'Открываем Telegram…' : isStarsCheckout() ? 'Купить за ' + selectedCategory().telegramStarsPrice + ' ⭐' : telegram.isInTelegram ? (totalAmount() ? 'Перейти к оплате' : 'Подтвердить участие') : 'Продолжить в Telegram' }}</button>
          @if (errorMessage()) { <p class="error-message">{{ errorMessage() }}</p> }
          <p class="hint">Итоговая скидка и сумма подтверждаются сервером при создании заказа.</p>
        }
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
      .categories { display: flex; flex-direction: column; gap: .6rem; margin-bottom: 1rem; }
      .unavailable { display: grid; gap: .4rem; margin: 1rem 0; padding: 1rem; background: var(--tg-surface, #252529); border-left: 3px solid #f2be68; }
      .unavailable span { font-size: .82rem; opacity: .7; }
      .category { display: grid; grid-template-columns: 1fr auto; gap: .2rem .75rem; padding: .75rem; text-align: left; background: var(--tg-surface, #252529); color: var(--tg-text, #e4e4e7); border: 1px solid rgba(255,255,255,.14); border-radius: 8px; cursor: pointer; }
      .category strong { grid-column: 2; grid-row: 1; }
      .category small { opacity: .65; }
      .category.selected { border-color: var(--tg-button, #00FF41); box-shadow: var(--tg-glow, 0 0 12px #00FF41); }
      .quantity-label, .promo-label { display: flex; flex-direction: column; gap: .35rem; margin: .75rem 0; font-size: .85rem; }
      select, input { padding: .65rem; border-radius: 7px; border: 1px solid rgba(255,255,255,.16); background: var(--tg-surface, #252529); color: var(--tg-text, #e4e4e7); }
      .summary { display: flex; flex-direction: column; gap: .4rem; margin: 1rem 0; font-size: .85rem; opacity: .82; }
      .summary span { display: flex; justify-content: space-between; gap: 1rem; }
      .summary .total { padding-top: .6rem; border-top: 1px solid rgba(255,255,255,.12); font-size: 1rem; opacity: 1; }
      .stars-summary { align-items: center; padding: 1rem; background: var(--tg-surface, #252529); border-left: 3px solid var(--tg-button); }
      .stars-summary strong { color: var(--tg-button); font-size: 1.25rem; }
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
  selectedCategoryId = signal('');
  quantity = signal(1);
  promoCode = signal('');
  paymentMethod = signal<'kaspi' | 'telegram'>('kaspi');
  loading = signal(false);
  success = signal(false);
  paymentPending = signal(false);
  errorMessage = signal('');

  categories = computed(() => this.event()?.ticketCategories?.filter((category) => category.isActive) ?? []);
  isStarsCheckout = computed(() => (this.selectedCategory()?.telegramStarsPrice ?? 0) > 0);
  selectedCategory = computed(() => this.categories().find((category) => category.id === this.selectedCategoryId()) ?? this.categories()[0]);
  baseAmount = computed(() => (this.selectedCategory()?.price ?? 0) * this.quantity());
  discountAmount = computed(() => 0);
  commissionAmount = computed(() => Math.round((this.baseAmount() - this.discountAmount()) * 0.1));
  totalAmount = computed(() => this.baseAmount() - this.discountAmount() + this.commissionAmount());
  quantities = computed(() => Array.from({ length: Math.min(10, Math.max(1, (this.selectedCategory()?.capacity ?? 1) - (this.selectedCategory()?.sold ?? 0))) }, (_, index) => index + 1));

  constructor(
    private route: ActivatedRoute,
    private data: DataService,
    private analytics: AnalyticsService,
    protected telegram: TelegramService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.analytics.track('checkout_view', id);
      this.data.getEventById(id).subscribe((ev) => {
        this.event.set(ev ?? null);
        this.selectedCategoryId.set(ev?.ticketCategories?.[0]?.id ?? '');
        if (ev?.ticketCategories?.[0]?.telegramStarsPrice) {
          this.paymentMethod.set('telegram');
          this.quantity.set(1);
        }
      });
    }
  }

  purchase(): void {
    const ev = this.event();
    if (!ev || this.loading()) return;
    if (this.isStarsCheckout() || this.paymentMethod() === 'telegram') {
      const payload = `event_${ev.id}`.replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 64);
      const botLink = `https://t.me/tusa_astana_bot?start=${payload}`;
      if (!this.telegram.openTelegramLink(botLink)) window.location.href = botLink;
      return;
    }
    if (!this.telegram.isInTelegram) {
      const category = this.selectedCategory();
      if (!category) return;
      const payload = `event_${ev.id}`.replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 64);
      window.location.href = `https://t.me/tusa_astana_bot?start=${payload}`;
      return;
    }
    this.loading.set(true);
    this.errorMessage.set('');
    this.analytics.track('payment_start', ev.id);
    const category = this.selectedCategory();
    if (!category) return;
    this.data.purchaseTicket(ev.id, category.id, this.quantity(), this.promoCode(), this.paymentMethod()).subscribe((ticket) => {
      this.loading.set(false);
      this.success.set(!!ticket);
      if (!ticket) this.errorMessage.set('Не удалось создать заказ. Проверьте соединение и попробуйте ещё раз.');
      this.paymentPending.set(ticket?.paymentStatus === 'pending');
      if (ticket?.paymentStatus === 'paid') this.analytics.track('purchase_success', ev.id);
    });
  }
}
