import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../core/services/mock-data.service';

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
      .map-container { position: relative; width: 100%; height: 100vh; }
      .map { width: 100%; height: 100%; }
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

  constructor(private mockData: MockDataService) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.markers.forEach((m) => m.remove());
    this.map?.remove();
    this.map = null;
  }

  private async initMap(): Promise<void> {
    const L = await import('leaflet');

    const events = this.mockData.getEvents();
    const astana = { lat: 51.1694, lng: 71.4494 };

    const mapEl = this.mapRef?.nativeElement;
    if (!mapEl) return;

    this.map = L.map(mapEl).setView([astana.lat, astana.lng], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

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
