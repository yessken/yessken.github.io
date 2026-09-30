import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { TelegramService } from './core/services/telegram.service';

interface Breadcrumb {
  label: string;
  url?: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly telegram = inject(TelegramService);
  protected readonly breadcrumbs = signal<Breadcrumb[]>([]);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly routeHistory: string[] = [];
  private handlingTelegramBack = false;

  ngOnInit(): void {
    this.telegram.init();
    this.telegram.onBackButtonClick(() => this.navigateBackInApp());

    const initialUrl = this.pathOnly(this.router.url);
    this.routeHistory.push(initialUrl);
    this.updateNavigationChrome(initialUrl);

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        const currentUrl = this.pathOnly(event.urlAfterRedirects);
        if (this.handlingTelegramBack) {
          if (this.routeHistory.length > 1) this.routeHistory.pop();
          this.handlingTelegramBack = false;
        } else if (this.routeHistory.at(-1) !== currentUrl) {
          const existingIndex = this.routeHistory.lastIndexOf(currentUrl);
          if (existingIndex >= 0) this.routeHistory.splice(existingIndex + 1);
          else this.routeHistory.push(currentUrl);
          if (this.routeHistory.length > 30) this.routeHistory.shift();
        }
        this.updateNavigationChrome(currentUrl);
      });
  }

  private navigateBackInApp(): void {
    if (this.handlingTelegramBack) return;
    const currentUrl = this.pathOnly(this.router.url);
    const targetUrl = this.routeHistory.length > 1
      ? this.routeHistory[this.routeHistory.length - 2]
      : this.parentRoute(currentUrl);
    if (!targetUrl || targetUrl === currentUrl) return;

    if (this.routeHistory.length === 1) this.routeHistory.unshift(targetUrl);
    this.handlingTelegramBack = true;
    void this.router.navigateByUrl(targetUrl).then((navigated) => {
      if (!navigated && this.handlingTelegramBack) {
        this.handlingTelegramBack = false;
        if (this.routeHistory.length === 2 && this.routeHistory[0] === targetUrl) this.routeHistory.shift();
      }
    });
  }

  private updateNavigationChrome(url: string): void {
    this.breadcrumbs.set(this.createBreadcrumbs(url));
    this.telegram.setBackButtonVisible(url !== '/');
  }

  private createBreadcrumbs(url: string): Breadcrumb[] {
    const segments = url.split('/').filter(Boolean);
    if (segments[0] === 'admin' && segments[1] === 'event-review')
      return [{ label: 'Заказы', url: '/admin' }, { label: 'Модерация заявок' }];
    if (segments[0] === 'admin' && segments[1] === 'bot-messages')
      return [{ label: 'Заказы', url: '/admin' }, { label: 'Сообщения боту' }];
    if (segments[0] === 'events' && segments.length >= 2) {
      const trail: Breadcrumb[] = [{ label: 'События', url: '/events' }];
      if (segments.length === 2) trail.push({ label: 'Событие' });
      else if (segments[2] === 'buy') {
        trail.push({ label: 'Событие', url: `/events/${segments[1]}` });
        trail.push({ label: 'Билет' });
      }
      return trail;
    }

    const labels: Record<string, string> = {
      events: 'События',
      'city-map': 'Карта',
      'my-tickets': 'Мои билеты',
      orders: 'Заказы',
      admin: 'Заказы',
      'tg-groups': 'Сообщества',
      'create-event': 'Новое событие',
      profile: 'Профиль',
      terms: 'Условия',
    };
    const currentLabel = labels[segments[0]];
    return currentLabel ? [{ label: 'Главная', url: '/' }, { label: currentLabel }] : [];
  }

  private parentRoute(url: string): string | null {
    const segments = url.split('/').filter(Boolean);
    if (segments[0] === 'events' && segments.length >= 3 && segments[2] === 'buy') return `/events/${segments[1]}`;
    if (segments[0] === 'events' && segments.length >= 2) return '/events';
    if (segments.length > 0 && url !== '/') return '/';
    return null;
  }

  private pathOnly(url: string): string {
    const path = url.split(/[?#]/, 1)[0];
    return path || '/';
  }
}
