import { Component, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { TelegramService } from '../../core/services/telegram.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="map-container">
      <div #mapRef class="map"></div>
      <div class="map-overlay">
        <h2>Тусовки Астаны</h2>
        <a routerLink="/events" class="link-list">Список мероприятий</a>
      </div>
    </div>
  `,
  styles: [
    `
      :host { display: block; height: 100%; min-height: calc(100vh - 60px); min-height: calc(100dvh - 60px); }
      .map-container { position: relative; width: 100%; height: 100%; min-height: 100%; }
      .map { width: 100%; height: 100%; min-height: 300px; display: block; background: #e4e4e4; -webkit-tap-highlight-color: transparent; }
      .map-overlay {
        position: absolute;
        top: 1rem;
        left: 1rem;
        right: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        pointer-events: none;
      }
      .map-overlay * { pointer-events: auto; }
      h2 { margin: 0; font-size: 1.25rem; background: var(--tg-bg, #fff); padding: 0.5rem 0.75rem; border-radius: 8px; }
      .link-list {
        padding: 0.5rem 0.75rem;
        background: var(--tg-button, #0088cc);
        color: var(--tg-button-text, #fff);
        border-radius: 8px;
        text-decoration: none;
        font-size: 0.9rem;
      }
    `,
  ],
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapRef') mapRef!: ElementRef<HTMLDivElement>;
  private map: L.Map | null = null;
  private markers: L.Marker[] = [];
  private resizeObserver: ResizeObserver | null = null;
  private boundInvalidate: (() => void) | null = null;

  constructor(
    private data: DataService,
    private telegram: TelegramService
  ) {}

  ngAfterViewInit(): void {
    const delay = this.telegram.isInTelegram ? 450 : 150;
    requestAnimationFrame(() => {
      setTimeout(() => this.initMap(), delay);
    });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    if (typeof window !== 'undefined' && this.boundInvalidate) {
      window.visualViewport?.removeEventListener('resize', this.boundInvalidate);
      window.removeEventListener('resize', this.boundInvalidate);
    }
    this.boundInvalidate = null;
    this.markers.forEach((m) => m.remove());
    this.map?.remove();
    this.map = null;
  }

  private getViewportHeight(): number {
    if (typeof window === 'undefined') return 400;
    const vv = (window as unknown as { visualViewport?: { height: number } }).visualViewport;
    return vv?.height ?? window.innerHeight;
  }

  private async initMap(): Promise<void> {
    const mapEl = this.mapRef?.nativeElement;
    if (!mapEl) return;
    try {
      const L = await import('leaflet');
      this.data.getEvents().subscribe((events) => {
        this.buildMap(L, mapEl, events);
      });
    } catch (err) {
      console.error('Map init error', err);
    }
  }

  private buildMap(
    L: typeof import('leaflet'),
    mapEl: HTMLDivElement,
    events: { id: string; title: string; place: string; lat: number; lng: number }[]
  ): void {
    const astana = { lat: 51.1694, lng: 71.4494 };
    const container = mapEl.parentElement;
    const w = container?.offsetWidth ?? window.innerWidth;
    const containerH = container?.offsetHeight ?? 0;
    const viewportH = this.getViewportHeight();
    const h = Math.max(containerH, viewportH - 80, 300);
    mapEl.style.width = `${w}px`;
    mapEl.style.height = `${h}px`;

    const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
    const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
    const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';
    L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

    this.map = L.map(mapEl).setView([astana.lat, astana.lng], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    this.boundInvalidate = (): void => {
      this.map?.invalidateSize();
    };
    this.map.whenReady(this.boundInvalidate);
    setTimeout(this.boundInvalidate, 300);
    setTimeout(this.boundInvalidate, 800);

    if (container && typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(this.boundInvalidate);
      this.resizeObserver.observe(container);
    }
    if (typeof window !== 'undefined' && this.boundInvalidate) {
      window.visualViewport?.addEventListener('resize', this.boundInvalidate);
      window.addEventListener('resize', this.boundInvalidate);
    }

    events.forEach((ev) => {
      const marker = L.marker([ev.lat, ev.lng])
        .addTo(this.map!)
        .bindPopup(
          `<strong>${ev.title}</strong><br>${ev.place}<br><a href="/events/${ev.id}">Подробнее</a>`
        );
      this.markers.push(marker);
    });
  }
}
