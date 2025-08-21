import { AfterViewInit, Component, effect, ElementRef, signal, viewChild } from '@angular/core';
import { MapComponent } from '../../shared/components/map/map.component';
import { MapViewerComponent } from '../../shared/components/map-viewer/map-viewer.component';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { environment } from '../../../environments/environment';
import { DecimalPipe, JsonPipe } from '@angular/common';

// mapboxgl.accessToken = environment.mapboxKey;

@Component({
  selector: 'app-fullscreen-map-page',
  imports: [DecimalPipe, JsonPipe, MapComponent, MapViewerComponent],
  templateUrl: './fullscreen-map-page.component.html',
  // styles: `
  //   div {
  //     width: 100vw;
  //     height: calc(100vh - 64px);
  //   }

  //   #controls {
  //     background-color: white;
  //     padding: 10px;
  //     border-radius: 5px;
  //     position: fixed;
  //     bottom: 20px;
  //     right: 20px;
  //     z-index: 9999;
  //     box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  //     border: 1px solid #e2e8f0;
  //     width: 250px;
  //   }
  // `,
  styles: `
    #controls {
      background-color: white;
      padding: 10px;
      border-radius: 5px;
      position: fixed;
      bottom: 40px;
      right: 20px;
      z-index: 9999;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      width: 250px;
    }
  `
})
export class FullscreenMapPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  map = signal<maplibregl.Map|null>(null);
  zoom = signal(5);
  coordinates = signal({
    lng: -74.5,
    lat: 40
  });

  zoomEffect = effect(() => {
    if (!this.map()) return;

    this.map()?.setZoom(this.zoom());
    // this.map()?.zoomTo(this.zoom());
  });

  async ngAfterViewInit() {
    // La comprobación de `divElement` no es necesaria si usamos `viewChild.required()`
    // pero se mantiene aquí por si lo necesitas en otro contexto.
    if (!this.divElement()?.nativeElement) return;

    const element = this.divElement()!.nativeElement;
    const {lat, lng} = this.coordinates();

    const map = new maplibregl.Map({
      container: element,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [lng, lat],
      zoom: this.zoom(),
    });

    this.mapListener(map);

    console.log('Mapa inicializado:', map);
  }

  mapListener(map: maplibregl.Map) {

    map.on('zoomend', (event) => {
      const newZoom = event.target.getZoom();
      this.zoom.set(newZoom);
    });

    map.on('moveend', () => {
      const center = map.getCenter();
      this.coordinates.set(center);
    });

    map.on('loaded', () => {
      console.log('Map loaded');
    });

    map.addControl(new maplibregl.FullscreenControl());
    map.addControl(new maplibregl.NavigationControl());
    map.addControl(new maplibregl.ScaleControl());

    this.map.set(map);
  }
}
