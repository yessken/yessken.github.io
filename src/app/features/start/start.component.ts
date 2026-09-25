import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-start',
  imports: [RouterLink],
  template: `
    <main class="start">
      <div class="masthead">
        <span class="eyebrow">TUSA / АСТАНА</span>
        <span class="live">Астана · сейчас</span>
      </div>
      <section class="welcome">
        <p class="number">01 / 02</p>
        <h1>Что ищешь<br /><em>сегодня?</em></h1>
        <p class="intro">Найди событие в Астане или добавь своё в городскую афишу.</p>
        <div class="choices">
          <a routerLink="/events" class="choice primary">
            <span class="choice-index">01</span>
            <span><strong>Найти событие</strong><small>Выбрать место и билет</small></span>
            <span class="arrow" aria-hidden="true">→</span>
          </a>
          <a routerLink="/create-event" class="choice secondary">
            <span class="choice-index">02</span>
            <span><strong>Создать событие</strong><small>Разместить свою афишу</small></span>
            <span class="arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </section>
      <p class="footer-note">Город начинается с того, что происходит рядом.</p>
    </main>
  `,
  styles: [`
    :host { display: block; min-height: 100%; }
    .start { min-height: calc(100dvh - 112px); max-width: 980px; margin: 0 auto; padding: 2rem 1.25rem 5rem; display: flex; flex-direction: column; box-sizing: border-box; }
    .masthead { display: flex; justify-content: space-between; align-items: center; color: var(--tg-button); font-size: .68rem; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
    .live { color: rgba(242,240,232,.45); font-size: .62rem; letter-spacing: .08em; }
    .welcome { width: min(100%, 760px); margin: auto 0; }
    .number { margin: 0 0 1.2rem; color: rgba(242,240,232,.4); font-size: .7rem; font-weight: 800; letter-spacing: .14em; }
    h1 { margin: 0; font-size: clamp(3.5rem, 12vw, 8rem); line-height: .86; font-weight: 500; }
    h1 em { color: var(--tg-button); font-weight: 400; }
    .intro { max-width: 28rem; margin: 1.5rem 0 2.5rem; color: rgba(242,240,232,.6); line-height: 1.5; }
    .choices { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .75rem; }
    .choice { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: .8rem; min-height: 124px; padding: 1.15rem; border: 1px solid rgba(242,240,232,.16); border-radius: 4px; color: var(--tg-text); text-decoration: none; transition: transform .2s ease, border-color .2s ease, background .2s ease; }
    .choice:hover { transform: translateY(-3px); border-color: var(--tg-button); }
    .choice.primary { background: var(--tg-button); color: var(--tg-button-text); border-color: var(--tg-button); }
    .choice.primary:hover { background: #e5fb86; }
    .choice.secondary { background: var(--tg-surface); }
    .choice-index { align-self: start; font-size: .65rem; font-weight: 800; opacity: .62; }
    .choice strong, .choice small { display: block; }
    .choice strong { font-family: Georgia, 'Times New Roman', serif; font-size: 1.28rem; font-weight: 500; }
    .choice small { margin-top: .35rem; opacity: .65; font-size: .72rem; }
    .arrow { font-size: 1.4rem; }
    .footer-note { margin: auto 0 0; color: rgba(242,240,232,.34); font-size: .7rem; }
    @media (max-width: 620px) { .start { min-height: calc(100dvh - 112px); padding-top: 1.5rem; } .welcome { margin: auto 0 3rem; } .choices { grid-template-columns: 1fr; } .choice { min-height: 92px; } h1 { font-size: clamp(3.2rem, 18vw, 5rem); } }
  `],
})
export class StartComponent {}
