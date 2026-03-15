import { Component } from '@angular/core';

@Component({
  selector: 'app-open-from-bot',
  standalone: true,
  template: `
    <div class="open-from-bot">
      <h1>TusaMap</h1>
      <p>Откройте приложение из Telegram-бота, чтобы увидеть карту сходок Астаны и вписываться на сходки.</p>
      <a class="tg-link" href="https://t.me/chobby_astanabot" target="_blank" rel="noopener">Открыть в Telegram</a>
    </div>
  `,
  styles: [
    `
      .open-from-bot {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        text-align: center;
        background: var(--tg-bg, #1a1a1e);
        color: var(--tg-text, #e4e4e7);
      }
      h1 { font-size: 1.75rem; margin-bottom: 1rem; }
      p { margin-bottom: 1.5rem; opacity: 0.9; max-width: 320px; }
      .tg-link {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background: var(--tg-button, #00FF41);
        color: var(--tg-button-text, #0a0a0c);
        border-radius: 8px;
        text-decoration: none;
        font-weight: 500;
        box-shadow: var(--tg-glow, 0 0 14px #00FF41);
      }
    `,
  ],
})
export class OpenFromBotComponent {}
