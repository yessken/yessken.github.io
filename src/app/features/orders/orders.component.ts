import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import type { AdminSalesSummary } from '../../core/types/event.model';

export interface OrganizerOrderRow {
  ticketId: string;
  eventId: string;
  eventTitle: string;
  paymentStatus: string;
  paymentMethod: string;
  quantity: number;
  totalAmount: number;
  purchasedAt: string;
}

export interface AdminEventReport {
  eventId: string;
  eventTitle: string;
  orders: number;
  tickets: number;
  paid: number;
  pending: number;
  revenue: number;
}

@Component({
  selector: 'app-orders',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="orders">
      <div class="heading"><span class="eyebrow">TUSA / CONTROL</span><h1>Заказы</h1><p>Продажи по вашим событиям и общий обзор для администратора.</p></div>
      @if (summary(); as totals) {
        <section class="kpis">
          <article><span>Выручка</span><strong>{{ totals.paidRevenue | number }} ₸</strong><small>{{ totals.paidOrders }} оплаченных заказов</small></article>
          <article><span>Билеты</span><strong>{{ totals.totalTickets }}</strong><small>{{ totals.pendingOrders }} заказов ожидают оплаты</small></article>
          <article><span>События</span><strong>{{ totals.activeEvents }}</strong><small>{{ totals.requestedRefunds }} возвратов на проверке</small></article>
        </section>
      }
      <section class="panel">
        <h2>Мои события</h2>
        @if (organizerLoading()) { <p>Загружаем заказы…</p> }
        @else if (organizerOrders().length) {
          <div class="rows">@for (order of organizerOrders(); track order.ticketId) { <div class="row"><div><strong>{{ order.eventTitle }}</strong><small>{{ order.purchasedAt | date:'d MMM, HH:mm' }} · {{ order.paymentMethod }}</small></div><span>{{ order.quantity }} билет(а)</span><b [class]="order.paymentStatus">{{ statusLabel(order.paymentStatus) }}</b><strong>{{ order.totalAmount | number }} ₸</strong></div>}</div>
        } @else { <p class="muted">Заказов по вашим событиям пока нет. Для доступа откройте TUSA из Telegram.</p> }
      </section>
      @if (adminLoading()) { <section class="panel admin-state"><p>Проверяем доступ к админ-аналитике…</p></section> }
      @else if (summary()) {
        @if (adminReports().length) {
        <section class="panel admin"><h2>Все события</h2><div class="report-grid">@for (report of adminReports(); track report.eventId) { <article><span>{{ report.eventTitle }}</span><strong>{{ report.revenue | number }} ₸</strong><small>{{ report.paid }} оплачено · {{ report.pending }} ожидают · {{ report.tickets }} билетов</small></article>}</div></section>
        } @else { <section class="panel admin-state"><p>Здесь появится разрез продаж после первых заказов.</p></section> }
      }
      <a routerLink="/create-event" class="create" queryParamsHandling="preserve">Разместить новое событие <span>→</span></a>
    </div>
  `,
  styles: [`
    .orders { max-width: 1100px; margin: 0 auto; padding: 2rem 1.25rem 6rem; }
    .heading { padding: 1rem 0 2rem; border-bottom: 1px solid rgba(242,240,232,.12); }
    .eyebrow { color: var(--tg-button); font-size: .65rem; font-weight: 800; letter-spacing: .16em; }
    h1 { margin: .6rem 0 .4rem; font-size: clamp(2.4rem, 7vw, 5rem); font-weight: 500; }
    h2 { margin: 0 0 1rem; font-size: 1.15rem; font-weight: 500; }
    .heading p, .muted, .panel p { color: rgba(242,240,232,.58); font-size: .85rem; }
    .panel { margin-top: 1rem; padding: 1rem; background: var(--tg-surface); border: 1px solid rgba(242,240,232,.1); border-radius: 4px; }
    .kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: .75rem; margin-top: 1rem; }
    .kpis article { display: grid; gap: .3rem; padding: 1rem; background: var(--tg-surface); border: 1px solid rgba(242,240,232,.1); }
    .kpis span, .kpis small { color: rgba(242,240,232,.58); font-size: .72rem; }
    .kpis strong { color: var(--tg-button); font-size: 1.35rem; }
    .rows { display: grid; gap: .5rem; }
    .row { display: grid; grid-template-columns: minmax(0, 1.5fr) .8fr .8fr .8fr; align-items: center; gap: 1rem; padding: .85rem 0; border-top: 1px solid rgba(242,240,232,.1); font-size: .8rem; }
    .row small, article small { display: block; margin-top: .25rem; color: rgba(242,240,232,.52); font-size: .7rem; }
    .paid { color: var(--tg-button); } .pending { color: #f2be68; }
    .report-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: .75rem; }
    article { display: grid; gap: .35rem; padding: .9rem; border: 1px solid rgba(242,240,232,.1); }
    article strong { color: var(--tg-button); font-size: 1.25rem; }
    .create { display: inline-flex; gap: .7rem; margin-top: 1.2rem; color: var(--tg-button); font-size: .8rem; font-weight: 700; text-decoration: none; }
    @media (max-width: 650px) { .kpis { grid-template-columns: 1fr; } .row { grid-template-columns: 1fr auto; } .row > :nth-child(2) { grid-column: 1; } .row > :nth-child(3), .row > :nth-child(4) { grid-row: 1; } }
  `],
})
export class OrdersComponent implements OnInit {
  organizerOrders = signal<OrganizerOrderRow[]>([]);
  adminReports = signal<AdminEventReport[]>([]);
  summary = signal<AdminSalesSummary | null>(null);
  adminLoading = signal(true);
  organizerLoading = signal(true);

  constructor(private data: DataService) {}

  ngOnInit(): void {
    this.data.getOrganizerOrders().subscribe((orders) => { this.organizerOrders.set(orders); this.organizerLoading.set(false); });
    this.data.getAdminOrderReport().subscribe((reports) => this.adminReports.set(reports));
    this.data.getAdminSalesSummary().subscribe((summary) => { this.summary.set(summary); this.adminLoading.set(false); });
  }

  statusLabel(status: string): string { return status === 'paid' ? 'Оплачено' : status === 'pending' ? 'Ожидает' : status; }
}
