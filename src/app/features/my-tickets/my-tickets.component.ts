import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { I18nService } from '../../core/services/i18n.service';
import type { Ticket } from '../../core/types/event.model';
import QRCode from 'qrcode';

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="my-tickets">
      <h1>{{ i18n.t('tickets.heading') }}</h1>
      @if (tickets().length) {
        <div class="ticket-list">
          @for (t of tickets(); track t.id) {
            <div class="ticket">
              <h3>{{ t.eventTitle }}</h3>
              <p class="meta">{{ t.eventDate }} · {{ t.eventPlace }}</p>
              @if (t.isDemo) { <p class="demo-ticket" role="note">{{ i18n.t('tickets.demoNotice') }}</p> }
              <span class="status" [class]="statusClass(t.paymentStatus)">{{ statusLabel(t.paymentStatus) }}</span>
              @if (!t.isDemo && qrCodes()[t.id]) { <img class="ticket-qr" [src]="qrCodes()[t.id]" alt="QR-код билета" /> }
              @if (!t.isDemo && t.qrCode) { <p class="qr">{{ i18n.t('tickets.entryCode') }} {{ t.qrCode }}</p> }
              <a [routerLink]="['/events', t.eventId]" queryParamsHandling="preserve">{{ i18n.t('tickets.open') }}</a>
            </div>
          }
        </div>
      } @else {
        <p>{{ i18n.t('tickets.empty') }}</p>
        <a routerLink="/events" queryParamsHandling="preserve">{{ i18n.t('tickets.catalog') }}</a>
      }
    </div>
  `,
  styles: [
    `
      .my-tickets { padding: 1.5rem; padding-bottom: 80px; }
      h1 { margin: 0 0 1rem; font-size: 1.25rem; }
      .ticket-list { display: flex; flex-direction: column; gap: 1rem; }
      .ticket {
        padding: 1rem;
        background: var(--tg-surface, #ffffff);
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }
      .ticket h3 { margin: 0 0 0.25rem; font-size: 1.1rem; }
      .meta { margin: 0.25rem 0; font-size: 0.9rem; opacity: 0.9; }
      .demo-ticket { margin: .5rem 0; padding: .55rem .7rem; border: 1px solid rgba(189,155,89,.3); border-radius: 7px; background: rgba(189,155,89,.1); color: #6c5731; font-size: .75rem; }
      :host-context(.dark-theme) .demo-ticket { color: #f2d29b; }
      .status { display: inline-block; margin: .4rem 0; padding: .25rem .5rem; border-radius: 999px; font-size: .72rem; font-weight: 700; }
      .status-paid { background: rgba(170, 189, 126, .18); color: var(--tg-button, #aabd7e); }
      .status-pending { background: rgba(242, 190, 104, .18); color: #f2be68; }
      .status-checkout { background: rgba(242, 190, 104, .18); color: #f2be68; }
      .status-failed, .status-refunded, .status-expired, .status-refund_requested { background: rgba(242, 123, 104, .18); color: #f27b68; }
      .ticket-qr { display: block; width: min(220px, 70vw); aspect-ratio: 1; margin: .75rem auto; background: #fff; padding: .5rem; border-radius: 8px; }
      .qr { margin: 0.5rem 0; font-family: monospace; }
      .ticket a { color: var(--tg-button, #426c47); font-size: 0.9rem; text-shadow: none; }
    `,
  ],
})
export class MyTicketsComponent implements OnInit {
  tickets = signal<Ticket[]>([]);
  qrCodes = signal<Record<string, string>>({});
  protected readonly i18n = inject(I18nService);

  constructor(private data: DataService) {}

  ngOnInit(): void {
    this.data.getTickets().subscribe(async (list) => {
      this.tickets.set(list);
      const entries = await Promise.all(list.filter((ticket) => ticket.qrCode).map(async (ticket) => [ticket.id, await QRCode.toDataURL(ticket.qrCode!, { width: 240, margin: 1 })] as const));
      this.qrCodes.set(Object.fromEntries(entries));
    });
  }

  statusLabel(status?: Ticket['paymentStatus']): string {
    return ({
      paid: this.i18n.t('tickets.status.paid'),
      pending: this.i18n.t('tickets.status.pending'),
      checkout: this.i18n.t('tickets.status.checkout'),
      failed: this.i18n.t('tickets.status.failed'),
      refunded: this.i18n.t('tickets.status.refunded'),
      refund_requested: this.i18n.t('tickets.status.refundRequested'),
      expired: this.i18n.t('tickets.status.expired'),
    } as Record<string, string>)[status ?? 'pending'] ?? this.i18n.t('tickets.status.unknown');
  }

  statusClass(status?: Ticket['paymentStatus']): string { return `status-${status ?? 'pending'}`; }
}
