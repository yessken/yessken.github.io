import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { TelegramService } from './core/services/telegram.service';
import { OpenFromBotComponent } from './features/open-from-bot/open-from-bot.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, OpenFromBotComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  constructor(protected telegram: TelegramService) {}

  ngOnInit(): void {
    this.telegram.init();
  }
}
