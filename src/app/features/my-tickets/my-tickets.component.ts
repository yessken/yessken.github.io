import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import type { Ticket } from '../../core/types/event.model';

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
              @if (t.qrCode) {
                <p class="qr">Код: {{ t.qrCode }}</p>
              }
              <a [routerLink]="['/events', t.eventId]">О мероприятии</a>
            </div>
          }
        </div>
      } @else {
        <p>У вас пока нет билетов.</p>
        <a routerLink="/events">Смотреть мероприятия</a>
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
        background: var(--tg-bg, #fff);
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      }
      .ticket h3 { margin: 0 0 0.25rem; font-size: 1.1rem; }
      .meta { margin: 0.25rem 0; font-size: 0.9rem; opacity: 0.9; }
      .qr { margin: 0.5rem 0; font-family: monospace; }
      .ticket a { color: var(--tg-button, #0088cc); font-size: 0.9rem; }
    `,
  ],
})
export class MyTicketsComponent implements OnInit {
  tickets = signal<Ticket[]>([]);

  constructor(private data: DataService) {}

  ngOnInit(): void {
    this.data.getTickets().subscribe((list) => this.tickets.set(list));
  }
}
