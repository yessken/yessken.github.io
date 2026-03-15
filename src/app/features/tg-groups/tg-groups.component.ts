import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { TelegramService } from '../../core/services/telegram.service';
import type { TelegramGroupItem } from '../../core/types/event.model';

@Component({
  selector: 'app-tg-groups',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tg-groups">
      <h1>ТГ группы</h1>
      <p class="subtitle">Чаты в Telegram, куда добавлен бот. Участников — онлайн.</p>
      @if (loading()) {
        <p class="loading">Загрузка…</p>
      } @else if (groups().length === 0) {
        <p class="empty">Пока нет групп или не настроен бэкенд.</p>
      } @else {
        <ul class="list">
          @for (g of groups(); track g.id) {
            <li class="card">
              <div class="info">
                <span class="title">{{ g.title }}</span>
                <span class="count">{{ g.memberCount }} участников</span>
              </div>
              @if (g.inviteLink) {
                <a [href]="g.inviteLink" target="_blank" rel="noopener" class="join" (click)="openLink($event, g.inviteLink)">
                  Вступить
                </a>
              }
            </li>
          }
        </ul>
      }
    </div>
  `,
  styles: [
    `
      .tg-groups { padding: 1rem; padding-bottom: 80px; }
      h1 { margin: 0 0 0.25rem; font-size: 1.5rem; }
      .subtitle { margin: 0 0 1rem; font-size: 0.9rem; opacity: 0.85; }
      .loading, .empty { padding: 1rem 0; opacity: 0.9; }
      .list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.75rem; }
      .card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 1rem;
        background: var(--tg-surface, #252529);
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }
      .info { display: flex; flex-direction: column; gap: 0.25rem; }
      .title { font-weight: 600; color: var(--tg-text, #e4e4e7); }
      .count { font-size: 0.85rem; opacity: 0.8; }
      .join {
        flex-shrink: 0;
        padding: 0.5rem 1rem;
        background: var(--tg-button, #00FF41);
        color: var(--tg-button-text, #0a0a0c);
        border-radius: 8px;
        text-decoration: none;
        font-size: 0.9rem;
        box-shadow: var(--tg-glow, 0 0 12px #00FF41);
      }
    `,
  ],
})
export class TgGroupsComponent implements OnInit {
  groups = signal<TelegramGroupItem[]>([]);
  loading = signal(true);

  constructor(
    private data: DataService,
    private telegram: TelegramService
  ) {}

  ngOnInit(): void {
    this.data.getTelegramGroups().subscribe((list) => {
      this.groups.set(list);
      this.loading.set(false);
    });
  }

  openLink(event: Event, url: string): void {
    const wa = typeof window !== 'undefined' ? (window as unknown as { Telegram?: { WebApp?: { openLink?: (u: string) => void } } }).Telegram?.WebApp : undefined;
    if (wa?.openLink) {
      event.preventDefault();
      wa.openLink(url);
    }
  }
}
