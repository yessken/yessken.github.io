import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ticket-terms',
  imports: [RouterLink],
  template: `
    <main class="terms">
      <span class="eyebrow">TUSA · УСЛОВИЯ</span>
      <h1>Условия событий и билетов</h1>
      <section aria-labelledby="sales-status">
        <h2 id="sales-status">Покупка билета</h2>
        <p>Если на странице события указано, что продажи открыты, билет оформляется через счёт Telegram Bot Payments в тенге с обработкой платежа подключённым сторонним провайдером. Telegram Stars для входа на офлайн-событие не используются. До выставления счёта пользователь должен подтвердить согласие с этими условиями. Если провайдер ещё не настроен, бот не создаёт заказ и не принимает оплату.</p>
      </section>
      <section aria-labelledby="delivery">
        <h2 id="delivery">Доступ на событие</h2>
        <p>Для событий с закрытым адресом точное место отправляется только владельцам подтверждённых оплаченных билетов за 24 часа до начала. Интерес к событию не является бронированием или билетом.</p>
      </section>
      <section aria-labelledby="refunds">
        <h2 id="refunds">Оплата и поддержка</h2>
        <p>После подтверждённой оплаты бот отправляет билет/QR в Telegram. TUSA — независимый сервис организатора; Telegram не является продавцом и не рассматривает споры по покупкам в боте. По вопросам оплаты, отмены или возврата напишите боту <a href="https://t.me/tusa_astana_bot?start=paysupport">@tusa_astana_bot</a> команду <strong>/paysupport</strong> с номером заказа. Запрос на возврат обрабатывается TUSA и платёжным провайдером согласно условиям заказа и применимому законодательству; запрос сам по себе не означает, что возврат уже выполнен.</p>
      </section>
      <p class="version">Версия условий: 28 сентября 2026 года.</p>
      <a class="back" routerLink="/events">Вернуться к событиям</a>
    </main>
  `,
  styles: [`
    .terms { max-width: 760px; margin: 0 auto; padding: 2rem 1.25rem 6rem; color: var(--tg-text, #f2f0e8); }
    .eyebrow { color: var(--tg-button, #aabd7e); font-size: .7rem; font-weight: 800; letter-spacing: .16em; }
    h1 { margin: .7rem 0 2rem; font-size: clamp(2rem, 8vw, 3rem); font-weight: 500; }
    section { padding: 1rem 0; border-top: 1px solid rgba(242,240,232,.14); }
    h2 { font-size: 1.1rem; font-weight: 600; }
    p { line-height: 1.65; opacity: .82; }
    a { color: var(--tg-button, #aabd7e); }
    .version { margin-top: 2rem; font-size: .8rem; opacity: .6; }
    .back { display: inline-block; margin-top: .75rem; }
  `],
})
export class TicketTermsComponent {}