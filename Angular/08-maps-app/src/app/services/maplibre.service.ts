import { Injectable } from '@angular/core';
import { MapService } from '../interfaces/map.interface';
import maplibregl from 'maplibre-gl';

@Injectable({
  providedIn: 'root'
})
export class MapLibreService implements MapService {

  private map!: maplibregl.Map;

  initMap(containerId: string, options: { lat: number; lng: number; zoom: number }): void {
    this.map = new maplibregl.Map({
      container: containerId,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [options.lng, options.lat],
      zoom: options.zoom
    });
  }

  setCenter(lat: number, lng: number): void {
    this.map?.setCenter([lng, lat]);
  }

  addMarker(lat: number, lng: number): void {
    new maplibregl.Marker().setLngLat([lng, lat]).addTo(this.map);
  }
}
