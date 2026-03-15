import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TelegramService } from '../../core/services/telegram.service';

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
      <nav>
        <a routerLink="/" queryParamsHandling="preserve">Карта</a>
        <a routerLink="/events" queryParamsHandling="preserve">Сходки</a>
        <a routerLink="/my-tickets" queryParamsHandling="preserve">Мои планы</a>
        <a routerLink="/create-event" queryParamsHandling="preserve">Создать сходку</a>
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
      nav a { color: var(--tg-button, #0088cc); }
    `,
  ],
})
export class ProfileComponent {
  user = () => this.telegram.user;

  constructor(private telegram: TelegramService) {}
}
