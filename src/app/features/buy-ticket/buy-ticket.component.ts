import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { AnalyticsService } from '../../core/services/analytics.service';
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
        <p class="label">Категория билета</p>
        <div class="categories">
          @for (category of categories(); track category.id) {
            <button type="button" class="category" [class.selected]="selectedCategoryId() === category.id" (click)="selectedCategoryId.set(category.id)">
              <span>{{ category.name }}</span>
              <strong>{{ category.price ? (category.price | number) + ' ₸' : 'Бесплатно' }}</strong>
              <small>Осталось {{ category.capacity - category.sold }}</small>
            </button>
          }
        </div>
        <label class="quantity-label">Количество
          <select [value]="quantity()" (change)="quantity.set(+$any($event.target).value)">
            @for (amount of quantities(); track amount) { <option [value]="amount">{{ amount }}</option> }
          </select>
        </label>
        <label class="promo-label">Промокод
          <input type="text" [value]="promoCode()" (input)="promoCode.set($any($event.target).value)" placeholder="Введите код, если он есть" />
        </label>
        <div class="summary">
          <span>Стоимость билетов <strong>{{ baseAmount() | number }} ₸</strong></span>
          @if (discountAmount()) { <span>Скидка <strong>-{{ discountAmount() | number }} ₸</strong></span> }
          <span>Комиссия TUSA 10% <strong>{{ commissionAmount() | number }} ₸</strong></span>
          <span class="total">Итого <strong>{{ totalAmount() | number }} ₸</strong></span>
        </div>
        @if (success()) {
          <div class="success">
            <strong>{{ paymentPending() ? 'Заказ создан' : 'Билет оформлен' }}</strong>
            <p>{{ paymentPending() ? 'Ожидаем подтверждение оплаты. Билет появится после оплаты.' : 'Билет сохранён в разделе «Мои билеты».' }}</p>
            <a routerLink="/my-tickets" class="link" queryParamsHandling="preserve">Открыть мои билеты</a>
          </div>
        } @else {
          <p class="label">Способ оплаты</p>
          <div class="methods">
            <button type="button" class="method" [class.selected]="paymentMethod() === 'kaspi'" (click)="paymentMethod.set('kaspi')">Kaspi Pay <small>быстро и привычно</small></button>
            <button type="button" class="method" [class.selected]="paymentMethod() === 'telegram'" (click)="paymentMethod.set('telegram')">Telegram Pay <small>внутри Telegram</small></button>
          </div>
          <button type="button" class="submit" (click)="purchase()" [disabled]="loading()">{{ loading() ? 'Создаём заказ…' : totalAmount() ? 'Перейти к оплате' : 'Подтвердить участие' }}</button>
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

  categories = computed(() => this.event()?.ticketCategories?.filter((category) => category.isActive) ?? []);
  selectedCategory = computed(() => this.categories().find((category) => category.id === this.selectedCategoryId()) ?? this.categories()[0]);
  baseAmount = computed(() => (this.selectedCategory()?.price ?? 0) * this.quantity());
  discountAmount = computed(() => this.promoCode().trim().toUpperCase() === 'TUSA10' ? Math.round(this.baseAmount() * 0.1) : 0);
  commissionAmount = computed(() => Math.round((this.baseAmount() - this.discountAmount()) * 0.1));
  totalAmount = computed(() => this.baseAmount() - this.discountAmount() + this.commissionAmount());
  quantities = computed(() => Array.from({ length: Math.min(10, Math.max(1, (this.selectedCategory()?.capacity ?? 1) - (this.selectedCategory()?.sold ?? 0))) }, (_, index) => index + 1));

  constructor(
    private route: ActivatedRoute,
    private data: DataService,
    private analytics: AnalyticsService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.analytics.track('checkout_view', id);
      this.data.getEventById(id).subscribe((ev) => {
        this.event.set(ev ?? null);
        this.selectedCategoryId.set(ev?.ticketCategories?.[0]?.id ?? '');
      });
    }
  }

  purchase(): void {
    const ev = this.event();
    if (!ev || this.loading()) return;
    this.loading.set(true);
    this.analytics.track('payment_start', ev.id);
    const category = this.selectedCategory();
    if (!category) return;
    this.data.purchaseTicket(ev.id, category.id, this.quantity(), this.promoCode(), this.paymentMethod()).subscribe((ticket) => {
      this.loading.set(false);
      this.success.set(!!ticket);
      this.paymentPending.set(ticket?.paymentStatus === 'pending');
      if (ticket?.paymentStatus === 'paid') this.analytics.track('purchase_success', ev.id);
    });
  }
}
