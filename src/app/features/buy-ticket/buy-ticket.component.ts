import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import type { EventItem } from '../../core/types/event.model';

@Component({
  selector: 'app-buy-ticket',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (event(); as ev) {
      <div class="buy-ticket">
        <h1>Вписаться на сходку</h1>
        <p class="event-title">{{ ev.title }}</p>
        <p class="price">{{ ev.price ? ev.price + ' ₸' : 'Бесплатно' }}</p>
        <div class="methods">
          <button type="button" class="method" (click)="payByCard()">Оплата картой</button>
          <button type="button" class="method" (click)="payByTon()">Оплата Ton</button>
        </div>
        <p class="hint">Пока заглушка: оплата будет подключена после бэкенда.</p>
        <a routerLink="/my-tickets" class="link" queryParamsHandling="preserve">Мои планы</a>
      </div>
    } @else {
      <p>Сходка не найдена.</p>
    }
  `,
  styles: [
    `
      .buy-ticket { padding: 1.5rem; }
      h1 { margin: 0 0 1rem; font-size: 1.25rem; }
      .event-title { font-weight: 600; margin-bottom: 0.25rem; }
      .price { margin-bottom: 1.5rem; }
      .methods { display: flex; flex-direction: column; gap: 0.75rem; }
      .method {
        padding: 0.75rem 1rem;
        background: var(--tg-button, #0088cc);
        color: var(--tg-button-text, #fff);
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
      }
      .hint { margin-top: 1rem; font-size: 0.85rem; opacity: 0.8; }
      .link { display: inline-block; margin-top: 1rem; color: var(--tg-button, #0088cc); }
    `,
  ],
})
export class BuyTicketComponent implements OnInit {
  event = signal<EventItem | null>(null);

  constructor(
    private route: ActivatedRoute,
    private data: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.data.getEventById(id).subscribe((ev) => this.event.set(ev ?? null));
  }

  payByCard(): void {
    alert('Оплата картой (заглушка). После подключения бэкенда будет редирект на платёж.');
  }

  payByTon(): void {
    alert('Оплата Ton (заглушка). После подключения бэкенда будет вызов Telegram Pay.');
  }
}
