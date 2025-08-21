import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, effect, ElementRef, input, signal, viewChild, ViewChild } from '@angular/core';
import maplibregl, { Map, Marker, Popup } from 'maplibre-gl';

@Component({
  selector: 'app-map-viewer',
  imports: [CommonModule],
  templateUrl: './map-viewer.component.html',
  styleUrls: ['./map-viewer.component.css'],
})
export class MapViewerComponent implements AfterViewInit {
  readonly mapContainerRef = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');

  readonly centerLat = input.required<number>();
  readonly centerLng = input.required<number>();
  readonly zoom = input<number>(2);

  private map: Map | null = null;
  private marker: Marker | null = null;

  // Reutilizar siempre el mismo popup
  private popup: Popup = new Popup({ closeOnClick: false });

  private readonly styleUrls = [
    'https://demotiles.maplibre.org/style.json',
    'https://tiles.stadiamaps.com/styles/alidade_smooth.json',
  ];
  private currentStyleIndex = 0;

  // Limpieza automática cuando el componente se destruye
  readonly cleanupMapEffect = effect(() => () => this.map?.remove());

  ngAfterViewInit(): void {
    const container = this.mapContainerRef().nativeElement;

    this.map = new maplibregl.Map({
      container,
      style: this.styleUrls[this.currentStyleIndex],
      center: [this.centerLng(), this.centerLat()],
      zoom: this.zoom(),
    });

    // Listener para click que agrega marcador
    this.map.on('click', (e) => this.addMarker(e.lngLat.lng, e.lngLat.lat));
  }

  toggleStyle(): void {
    if (!this.map) return;

    this.currentStyleIndex = (this.currentStyleIndex + 1) % this.styleUrls.length;
    const newStyle = this.styleUrls[this.currentStyleIndex];
    this.map.setStyle(newStyle);

    this.map.once('style.load', () => {
      if (this.marker && this.map) {
        this.marker.addTo(this.map);
        if (this.popup.isOpen()) {
          this.popup.addTo(this.map);
        }
      }
    });
  }

  private addMarker(lng: number, lat: number): void {
    const htmlContent = `
      <div class="text-black text-sm font-medium space-y-1">
        📍 <span class="text-gray-800"><strong>Lat:</strong> ${lat.toFixed(5)}</span><br>
        📍 <span class="text-gray-800"><strong>Lng:</strong> ${lng.toFixed(5)}</span>
      </div>
    `;

    this.popup.setHTML(htmlContent).setLngLat([lng, lat]);

    if (this.marker) {
      this.marker.setLngLat([lng, lat]);
      if (this.map && !this.popup.isOpen()) {
        this.popup.addTo(this.map);
      }
      return;
    }

    if (!this.map) return;

    this.marker = new Marker({ color: 'red' })
      .setLngLat([lng, lat])
      .setPopup(this.popup)
      .addTo(this.map);

    this.popup.addTo(this.map);
  }
}
