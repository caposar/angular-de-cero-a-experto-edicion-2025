import { Component, effect, inject, input, OnDestroy, Signal, signal } from '@angular/core';
import { MapLibreService } from '../../../services/maplibre.service';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  providers: [MapLibreService]
})
export class MapComponent {
  private readonly mapService = inject(MapLibreService);

  // ✅ Inputs con signals API moderna y sin decoradores
  readonly centerLat = input.required<number>();
  readonly centerLng = input.required<number>();
  readonly zoom = input<number>(2); // tiene valor por defecto

  readonly mapId = 'map-container-' + Math.random().toString(36).substring(2, 7);
  readonly initialized = signal(false);

  constructor() {
    // ✅ Reacción automática cuando cambian las coordenadas
    effect(() => {
      if (this.initialized()) {
        this.mapService.setCenter(this.centerLat(), this.centerLng());
      }
    });
  }

  ngAfterViewInit(): void {
    this.mapService.initMap(this.mapId, {
      lat: this.centerLat(),
      lng: this.centerLng(),
      zoom: this.zoom()
    });
    this.initialized.set(true);
  }
}
