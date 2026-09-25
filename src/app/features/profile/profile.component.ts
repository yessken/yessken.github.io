import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TelegramService } from '../../core/services/telegram.service';
import { DataService } from '../../core/services/data.service';
import type { OrganizerSubscriptionStatus } from '../../core/types/event.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="profile">
      <h1>Профиль</h1>
      @if (user(); as u) {
        <div class="user">
          @if (u.photo_url) {
            <img [src]="u.photo_url" alt="" class="avatar" />
          }
          <p class="name">{{ u.first_name }} {{ u.last_name || '' }}</p>
          @if (u.username) {
            <p class="username">@{{ u.username }}</p>
          }
          <p class="tg-id">Telegram ID: {{ u.id }}</p>
        </div>
      } @else {
        <p>Данные из Telegram (в боте будет отображаться ваш аккаунт).</p>
      }
      @if (subscription(); as plan) {
        <div class="subscription" [class.active]="plan.status === 'active'">
          <strong>Organizer Pro</strong><span>{{ plan.status === 'active' ? 'Активна до ' + formatExpiry(plan.expiresAt) : 'Не активна' }}</span>
        </div>
      }
      <nav>
        <a routerLink="/city-map" queryParamsHandling="preserve">Карта</a>
        <a routerLink="/events" queryParamsHandling="preserve">События</a>
        <a routerLink="/my-tickets" queryParamsHandling="preserve">Мои билеты</a>
        <a routerLink="/orders" queryParamsHandling="preserve">Заказы организатора</a>
        <button type="button" class="subscribe" (click)="subscribe()">Подключить Organizer Pro</button>
        <a routerLink="/create-event" queryParamsHandling="preserve">Для организаторов</a>
        <a routerLink="/tg-groups" queryParamsHandling="preserve">Сообщества</a>
      </nav>
    </div>
  `,
  styles: [
    `
      .profile { padding: 1.5rem; padding-bottom: 80px; }
      h1 { margin: 0 0 1rem; font-size: 1.25rem; }
      .user { margin-bottom: 1.5rem; }
      .avatar { width: 64px; height: 64px; border-radius: 50%; }
      .name { font-weight: 600; margin: 0.25rem 0; }
      .username, .tg-id { margin: 0.25rem 0; font-size: 0.9rem; opacity: 0.9; }
      nav { display: flex; flex-direction: column; gap: 0.5rem; }
      nav a { color: var(--tg-button, #00FF41); text-shadow: var(--tg-glow-text, 0 0 6px #00FF41); }
      .subscribe { width: fit-content; padding: .7rem .85rem; border: 1px solid var(--tg-button, #00FF41); border-radius: 5px; background: transparent; color: var(--tg-button, #00FF41); font: inherit; cursor: pointer; }
      .subscription { display: grid; gap: .25rem; margin: 1rem 0; padding: .85rem; border-left: 3px solid #f2be68; background: var(--tg-surface, #252529); font-size: .85rem; }
      .subscription span { opacity: .65; font-size: .75rem; }
      .subscription.active { border-left-color: var(--tg-button, #d7f36b); }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  user = () => this.telegram.user;
  subscription = signal<OrganizerSubscriptionStatus | null>(null);

  constructor(private telegram: TelegramService, private data: DataService) {}

  ngOnInit(): void { this.data.getOrganizerSubscription().subscribe((status) => this.subscription.set(status)); }

  formatExpiry(value?: string | null): string { return value ? new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' }).format(new Date(value)) : 'без срока'; }

  subscribe(): void {
    const url = 'https://t.me/tusa_astana_bot?start=subscribe_pro';
    if (!this.telegram.openTelegramLink(url) && typeof window !== 'undefined') window.location.href = url;
  }
}
