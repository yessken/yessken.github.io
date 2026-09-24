import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import type { Ticket } from '../../core/types/event.model';
import QRCode from 'qrcode';

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="my-tickets">
      <h1>Мои билеты</h1>
      @if (tickets().length) {
        <div class="ticket-list">
          @for (t of tickets(); track t.id) {
            <div class="ticket">
              <h3>{{ t.eventTitle }}</h3>
              <p class="meta">{{ t.eventDate }} · {{ t.eventPlace }}</p>
              <span class="status" [class]="statusClass(t.paymentStatus)">{{ statusLabel(t.paymentStatus) }}</span>
              @if (qrCodes()[t.id]) { <img class="ticket-qr" [src]="qrCodes()[t.id]" alt="QR-код билета" /> }
              @if (t.qrCode) { <p class="qr">Код входа: {{ t.qrCode }}</p> }
              <a [routerLink]="['/events', t.eventId]" queryParamsHandling="preserve">О сходке</a>
            </div>
          }
        </div>
      } @else {
        <p>Здесь появятся ваши билеты и предстоящие события.</p>
        <a routerLink="/events" queryParamsHandling="preserve">Открыть каталог событий</a>
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
        background: var(--tg-surface, #252529);
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }
      .ticket h3 { margin: 0 0 0.25rem; font-size: 1.1rem; }
      .meta { margin: 0.25rem 0; font-size: 0.9rem; opacity: 0.9; }
      .status { display: inline-block; margin: .4rem 0; padding: .25rem .5rem; border-radius: 999px; font-size: .72rem; font-weight: 700; }
      .status-paid { background: rgba(170, 189, 126, .18); color: var(--tg-button, #aabd7e); }
      .status-pending { background: rgba(242, 190, 104, .18); color: #f2be68; }
      .status-failed, .status-refunded, .status-expired { background: rgba(242, 123, 104, .18); color: #f27b68; }
      .ticket-qr { display: block; width: min(220px, 70vw); aspect-ratio: 1; margin: .75rem auto; background: #fff; padding: .5rem; border-radius: 8px; }
      .qr { margin: 0.5rem 0; font-family: monospace; }
      .ticket a { color: var(--tg-button, #00FF41); font-size: 0.9rem; text-shadow: var(--tg-glow-text, 0 0 6px #00FF41); }
    `,
  ],
})
export class MyTicketsComponent implements OnInit {
  tickets = signal<Ticket[]>([]);
  qrCodes = signal<Record<string, string>>({});

  constructor(private data: DataService) {}

  ngOnInit(): void {
    this.data.getTickets().subscribe(async (list) => {
      this.tickets.set(list);
      const entries = await Promise.all(list.filter((ticket) => ticket.qrCode).map(async (ticket) => [ticket.id, await QRCode.toDataURL(ticket.qrCode!, { width: 240, margin: 1 })] as const));
      this.qrCodes.set(Object.fromEntries(entries));
    });
  }

  statusLabel(status?: Ticket['paymentStatus']): string {
    return ({ paid: 'Оплачено', pending: 'Ожидает оплаты', failed: 'Ошибка оплаты', refunded: 'Возврат оформлен', expired: 'Истёк' } as Record<string, string>)[status ?? 'pending'] ?? 'Статус уточняется';
  }

  statusClass(status?: Ticket['paymentStatus']): string { return `status-${status ?? 'pending'}`; }
}
