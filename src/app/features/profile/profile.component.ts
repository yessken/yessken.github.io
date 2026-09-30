import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TelegramService } from '../../core/services/telegram.service';
import { DataService } from '../../core/services/data.service';
import type { OrganizerSubscriptionOffer, OrganizerSubscriptionStatus } from '../../core/types/event.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
          <strong>Organizer Pro</strong>
          <span>{{ subscriptionStatusLabel(plan) }}</span>
        </div>
      }
      <section class="pro-card" aria-labelledby="pro-title">
        <div class="pro-heading"><div><span class="eyebrow">ДЛЯ ОРГАНИЗАТОРОВ</span><h2 id="pro-title">Organizer Pro</h2></div>
          @if (offer(); as currentOffer) {
            @if (currentOffer.available) { <strong class="pro-price">{{ currentOffer.stars }} ⭐ / {{ currentOffer.durationDays }} дней</strong> }
            @else { <span class="pro-unavailable">Скоро</span> }
          }
        </div>
        <ul>
          <li>Заказы и продажи по твоим событиям</li>
          <li>Статистика просмотров и конверсии</li>
          <li>Инструменты организатора</li>
        </ul>
        @if (offerLoading()) {
          <p class="pro-note" role="status">Проверяем доступность подписки…</p>
        } @else if (offer()?.available) {
          <button type="button" class="subscribe" (click)="subscribe()">
            {{ subscription()?.status === 'active' ? 'Продлить Organizer Pro' : 'Подключить Organizer Pro' }} · {{ offer()?.stars }} ⭐
          </button>
          <p class="pro-note">Оплата цифровой услуги — Telegram Stars. Новый платёж продлевает доступ на 30 дней; не является автоматическим списанием.</p>
        } @else {
          <p class="pro-note">Подписка пока не настроена. Сейчас доступна бесплатная публикация события; о запуске Pro сообщим отдельно.</p>
          <button type="button" class="subscribe" disabled>Пока недоступно</button>
        }
        <a class="pro-terms" routerLink="/terms">Условия и поддержка</a>
      </section>
      <nav>
        <a routerLink="/city-map" queryParamsHandling="preserve">Карта</a>
        <a routerLink="/events" queryParamsHandling="preserve">События</a>
        <a routerLink="/my-tickets" queryParamsHandling="preserve">Мои билеты</a>
        <a routerLink="/orders" queryParamsHandling="preserve">Заказы организатора</a>
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
      .subscribe:disabled { opacity: .55; cursor: not-allowed; }
      .subscription { display: grid; gap: .25rem; margin: 1rem 0; padding: .85rem; border-left: 3px solid #f2be68; background: var(--tg-surface, #252529); font-size: .85rem; }
      .subscription span { opacity: .65; font-size: .75rem; }
      .subscription.active { border-left-color: var(--tg-button, #d7f36b); }
      .pro-card { margin: 1.25rem 0; padding: 1rem; background: var(--tg-surface, #252529); border: 1px solid rgba(242,240,232,.12); border-radius: 10px; }
      .pro-heading { display: flex; justify-content: space-between; align-items: center; gap: .75rem; }
      .eyebrow { color: var(--tg-button, #d7f36b); font-size: .62rem; font-weight: 800; letter-spacing: .12em; }
      .pro-heading h2 { margin: .25rem 0 0; font-size: 1.1rem; }
      .pro-price { white-space: nowrap; color: var(--tg-button, #d7f36b); font-size: .82rem; }
      .pro-unavailable { color: rgba(242,240,232,.62); font-size: .78rem; }
      .pro-card ul { display: grid; gap: .45rem; margin: 1rem 0; padding-left: 1.15rem; font-size: .82rem; line-height: 1.45; }
      .pro-note { margin: .75rem 0; color: rgba(242,240,232,.62); font-size: .75rem; line-height: 1.5; }
      .pro-terms { display: inline-block; margin-top: .7rem; color: var(--tg-button, #d7f36b); font-size: .76rem; }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  user = () => this.telegram.user;
  subscription = signal<OrganizerSubscriptionStatus | null>(null);
  offer = signal<OrganizerSubscriptionOffer | null>(null);
  offerLoading = signal(true);

  constructor(private telegram: TelegramService, private data: DataService) {}

  ngOnInit(): void {
    this.data.getOrganizerSubscription().subscribe((status) => this.subscription.set(status));
    this.data.getOrganizerSubscriptionOffer().subscribe((offer) => { this.offer.set(offer); this.offerLoading.set(false); });
  }

  subscriptionStatusLabel(plan: OrganizerSubscriptionStatus): string {
    if (plan.status === 'active' && plan.expiresAt && new Date(plan.expiresAt) > new Date())
      return `Активна до ${this.formatExpiry(plan.expiresAt)}`;
    if (plan.status === 'refunded') return 'Оплата возвращена';
    if (plan.status === 'active') return 'Срок подписки истёк';
    return 'Не активна';
  }

  formatExpiry(value?: string | null): string { return value ? new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' }).format(new Date(value)) : 'без срока'; }

  subscribe(): void {
    if (!this.offer()?.available) return;
    const url = 'https://t.me/tusa_astana_bot?start=subscribe_pro';
    if (!this.telegram.openTelegramLink(url) && typeof window !== 'undefined') window.location.href = url;
  }
}
