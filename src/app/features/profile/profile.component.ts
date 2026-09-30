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
    <main class="profile-page">
      <header class="page-heading">
        <span class="eyebrow">TUSA / ЛИЧНЫЙ КАБИНЕТ</span>
        <h1>Профиль</h1>
        <p>Всё важное о ваших событиях и билетах — в одном месте.</p>
      </header>
      @if (user(); as u) {
        <section class="user-card" aria-label="Аккаунт Telegram">
          @if (u.photo_url) {
            <img [src]="u.photo_url" alt="" class="avatar" />
          } @else {
            <span class="avatar avatar-fallback" aria-hidden="true">{{ userInitials(u.first_name, u.last_name) }}</span>
          }
          <div class="user-details"><span class="connected"><span aria-hidden="true"></span>Telegram подключён</span><h2>{{ u.first_name }} {{ u.last_name || '' }}</h2>@if (u.username) { <p>@{{ u.username }}</p> }</div>
          <span class="telegram-mark" aria-hidden="true">↗</span>
        </section>
      } @else {
        <section class="user-card guest-card">
          <span class="avatar avatar-fallback" aria-hidden="true">T</span>
          <div class="user-details"><span class="connected">Гостевой режим</span><h2>Откройте TUSA в Telegram</h2><p>Чтобы видеть билеты и участвовать в событиях, войдите через бота.</p></div>
          <a class="telegram-mark" href="https://t.me/tusa_astana_bot" aria-label="Открыть бота TUSA">↗</a>
        </section>
      }
      @if (subscription(); as plan) {
        @if (plan.status === 'active' || plan.status === 'refunded') {
          <div class="subscription-status" [class.active]="plan.status === 'active'"><span class="status-dot" aria-hidden="true"></span><div><strong>Organizer Pro</strong><span>{{ subscriptionStatusLabel(plan) }}</span></div></div>
        }
      }
      <section class="pro-card" aria-labelledby="pro-title">
        <div class="pro-heading"><div><span class="eyebrow">ИНСТРУМЕНТЫ ОРГАНИЗАТОРА</span><h2 id="pro-title">Растите вместе с TUSA</h2></div>
          @if (offer(); as currentOffer) {
            @if (currentOffer.available) { <span class="pro-price">{{ currentOffer.stars }} ⭐ / {{ currentOffer.durationDays }} дней</span> }
          }
        </div>
        <p class="pro-description">Публикуйте события и следите за продажами из одного кабинета.</p>
        @if (offerLoading()) {
          <p class="pro-note" role="status">Проверяем доступность подписки…</p>
        } @else if (offer()?.available) {
          <button type="button" class="subscribe" (click)="subscribe()">
            {{ subscription()?.status === 'active' ? 'Продлить доступ' : 'Подключить Organizer Pro' }} · {{ offer()?.stars }} ⭐ <span aria-hidden="true">→</span>
          </button>
          <p class="pro-note">Оплата в Telegram Stars · {{ offer()?.durationDays }} дней · без автосписания</p>
        } @else {
          <p class="pro-note">Подписка скоро появится. Уже сейчас можно бесплатно отправить событие на модерацию.</p>
          <a class="subscribe secondary-action" routerLink="/create-event">Разместить событие <span aria-hidden="true">→</span></a>
        }
        <a class="pro-terms" routerLink="/terms">Условия Organizer Pro</a>
      </section>
      <section class="account-section" aria-labelledby="account-links-title">
        <div class="section-heading"><h2 id="account-links-title">Быстрый доступ</h2><span>ВАШ TUSA</span></div>
        <nav class="quick-links" aria-label="Разделы профиля">
          <a class="nav-card" routerLink="/my-tickets" queryParamsHandling="preserve"><span class="nav-icon">▤</span><span><strong>Мои билеты</strong><small>Покупки и вход на события</small></span><span class="nav-arrow" aria-hidden="true">→</span></a>
          <a class="nav-card" routerLink="/orders" queryParamsHandling="preserve"><span class="nav-icon">↗</span><span><strong>Заказы организатора</strong><small>Продажи по вашим событиям</small></span><span class="nav-arrow" aria-hidden="true">→</span></a>
          <a class="nav-card" routerLink="/create-event" queryParamsHandling="preserve"><span class="nav-icon">＋</span><span><strong>Разместить событие</strong><small>Бесплатная заявка на публикацию</small></span><span class="nav-arrow" aria-hidden="true">→</span></a>
          <a class="nav-card" routerLink="/events" queryParamsHandling="preserve"><span class="nav-icon">✳</span><span><strong>Афиша событий</strong><small>Найти, куда пойти</small></span><span class="nav-arrow" aria-hidden="true">→</span></a>
          <a class="nav-card" routerLink="/city-map" queryParamsHandling="preserve"><span class="nav-icon">⌖</span><span><strong>Карта города</strong><small>События рядом</small></span><span class="nav-arrow" aria-hidden="true">→</span></a>
          <a class="nav-card" routerLink="/tg-groups" queryParamsHandling="preserve"><span class="nav-icon">◎</span><span><strong>Сообщества</strong><small>Локальные Telegram-группы</small></span><span class="nav-arrow" aria-hidden="true">→</span></a>
        </nav>
      </section>
      @if (adminToolsAvailable()) {
        <section class="admin-tools" aria-labelledby="admin-tools-title">
          <div><span class="eyebrow">TUSA / ADMIN</span><h2 id="admin-tools-title">Управление</h2></div>
          <a routerLink="/admin/event-review" queryParamsHandling="preserve">Очередь модерации <span aria-hidden="true">→</span></a>
          <a routerLink="/admin/bot-messages" queryParamsHandling="preserve">Сообщения боту <span aria-hidden="true">→</span></a>
        </section>
      }
    </main>
  `,
  styles: [`
    :host { display: block; }
    .profile-page { max-width: 920px; margin: 0 auto; padding: 2rem 1.25rem 6rem; color: var(--tg-text, #f2f0e8); }
    .page-heading { padding: .5rem 0 1.35rem; border-bottom: 1px solid rgba(242,240,232,.12); }
    .eyebrow { color: var(--tg-button, #d7f36b); font-size: .66rem; font-weight: 800; letter-spacing: .15em; }
    .page-heading h1 { margin: .55rem 0 .3rem; font-size: clamp(2.2rem, 7vw, 3.6rem); font-weight: 500; }
    .page-heading p { margin: 0; color: rgba(242,240,232,.58); font-size: .86rem; line-height: 1.5; }
    .user-card { display: flex; align-items: center; gap: 1rem; margin: 1rem 0; padding: 1rem; background: var(--tg-surface, #1c1e1d); border: 1px solid rgba(242,240,232,.12); border-radius: 8px; }
    .avatar { flex: 0 0 auto; width: 64px; height: 64px; border-radius: 50%; object-fit: cover; }
    .avatar-fallback { display: grid; place-items: center; background: rgba(215,243,107,.12); color: var(--tg-button, #d7f36b); font-family: Georgia, serif; font-size: 1.7rem; }
    .user-details { min-width: 0; flex: 1; }
    .connected { display: flex; align-items: center; gap: .4rem; color: rgba(242,240,232,.54); font-size: .67rem; }
    .connected > span { width: .4rem; height: .4rem; border-radius: 50%; background: var(--tg-button, #d7f36b); }
    .user-details h2 { margin: .3rem 0 .15rem; font-size: 1.18rem; font-weight: 500; overflow-wrap: anywhere; }
    .user-details p { margin: 0; color: rgba(242,240,232,.6); font-size: .8rem; }
    .telegram-mark { display: grid; flex: 0 0 auto; width: 2.3rem; height: 2.3rem; place-items: center; border: 1px solid rgba(242,240,232,.14); border-radius: 50%; color: var(--tg-button, #d7f36b); font-size: 1rem; text-decoration: none; }
    .subscription-status { display: flex; align-items: center; gap: .65rem; margin: .75rem 0; padding: .8rem 1rem; background: var(--tg-surface, #1c1e1d); border: 1px solid rgba(242,240,232,.1); border-radius: 8px; }
    .status-dot { width: .5rem; height: .5rem; border-radius: 50%; background: #f2be68; }
    .subscription-status.active .status-dot { background: var(--tg-button, #d7f36b); }
    .subscription-status div { display: grid; gap: .15rem; }
    .subscription-status strong { font-size: .82rem; }
    .subscription-status div span { color: rgba(242,240,232,.58); font-size: .74rem; }
    .pro-card { margin: 1rem 0 1.6rem; padding: 1.1rem; background: linear-gradient(130deg, rgba(215,243,107,.08), transparent 65%), var(--tg-surface, #1c1e1d); border: 1px solid rgba(215,243,107,.24); border-radius: 8px; }
    .pro-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: .8rem; }
    .pro-heading h2 { margin: .35rem 0 0; font-size: 1.35rem; font-weight: 500; }
    .pro-price { flex: 0 0 auto; padding: .35rem .5rem; border-radius: 5px; background: rgba(215,243,107,.1); color: var(--tg-button, #d7f36b); font-size: .7rem; white-space: nowrap; }
    .pro-description { margin: .7rem 0; color: rgba(242,240,232,.68); font-size: .82rem; line-height: 1.5; }
    .pro-note { margin: .65rem 0; color: rgba(242,240,232,.56); font-size: .72rem; line-height: 1.5; }
    .subscribe { display: inline-flex; align-items: center; justify-content: center; gap: .7rem; min-height: 42px; margin-top: .25rem; padding: .65rem .85rem; border: 0; border-radius: 5px; background: var(--tg-button, #d7f36b); color: var(--tg-button-text, #121313); font: inherit; font-size: .8rem; font-weight: 800; text-decoration: none; cursor: pointer; }
    .secondary-action { border: 1px solid rgba(215,243,107,.35); background: transparent; color: var(--tg-button, #d7f36b); }
    .pro-terms { display: inline-block; margin-top: .6rem; color: rgba(242,240,232,.55); font-size: .72rem; }
    .account-section { margin-top: 1.4rem; }
    .section-heading { display: flex; align-items: baseline; justify-content: space-between; gap: .75rem; margin-bottom: .65rem; }
    .section-heading h2, .admin-tools h2 { margin: 0; font-size: 1rem; font-weight: 500; }
    .section-heading > span { color: rgba(242,240,232,.38); font-size: .6rem; font-weight: 800; letter-spacing: .12em; }
    .quick-links { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .55rem; }
    .nav-card { display: grid; grid-template-columns: 2.1rem minmax(0, 1fr) auto; align-items: center; gap: .65rem; min-height: 68px; padding: .7rem; border: 1px solid rgba(242,240,232,.1); border-radius: 7px; background: var(--tg-surface, #1c1e1d); color: var(--tg-text, #f2f0e8); text-decoration: none; transition: border-color .18s ease, transform .18s ease; }
    .nav-card:hover { transform: translateY(-2px); border-color: rgba(215,243,107,.42); }
    .nav-icon { display: grid; width: 2rem; height: 2rem; place-items: center; border-radius: 5px; background: rgba(215,243,107,.08); color: var(--tg-button, #d7f36b); font-size: 1rem; }
    .nav-card strong, .nav-card small { display: block; }
    .nav-card strong { font-size: .77rem; font-weight: 700; }
    .nav-card small { margin-top: .2rem; color: rgba(242,240,232,.5); font-size: .65rem; line-height: 1.35; }
    .nav-arrow { color: rgba(242,240,232,.42); }
    .admin-tools { display: grid; gap: .55rem; margin-top: 1.4rem; padding: 1rem; border: 1px solid rgba(215,243,107,.25); border-radius: 8px; background: rgba(215,243,107,.035); }
    .admin-tools .eyebrow { font-size: .6rem; }
    .admin-tools h2 { margin: .3rem 0 .25rem; }
    .admin-tools a { display: flex; justify-content: space-between; gap: .7rem; padding: .6rem 0; border-top: 1px solid rgba(242,240,232,.08); color: var(--tg-button, #d7f36b); font-size: .78rem; text-decoration: none; }
    @media (min-width: 700px) { .profile-page { padding: 3rem clamp(2rem, 5vw, 5rem) 4rem; } .user-card { padding: 1.2rem; } .avatar { width: 72px; height: 72px; } .quick-links { gap: .7rem; } .nav-card { min-height: 78px; padding: .9rem; } }
    @media (max-width: 420px) { .profile-page { padding: 1.2rem .9rem 6rem; } .quick-links { grid-template-columns: 1fr; } .nav-card { min-height: 62px; } .avatar { width: 54px; height: 54px; } }
  `],
})
export class ProfileComponent implements OnInit {
  user = () => this.telegram.user;
  subscription = signal<OrganizerSubscriptionStatus | null>(null);
  offer = signal<OrganizerSubscriptionOffer | null>(null);
  offerLoading = signal(true);
  adminToolsAvailable = signal(false);

  constructor(private telegram: TelegramService, private data: DataService) {}

  userInitials(firstName: string, lastName?: string): string {
    return `${firstName.trim().charAt(0)}${lastName?.trim().charAt(0) ?? ''}`.toLocaleUpperCase('ru');
  }

  ngOnInit(): void {
    this.data.getOrganizerSubscription().subscribe((status) => this.subscription.set(status));
    this.data.getOrganizerSubscriptionOffer().subscribe((offer) => { this.offer.set(offer); this.offerLoading.set(false); });
    this.data.getAdminSalesSummary().subscribe((summary) => this.adminToolsAvailable.set(summary !== null));
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
