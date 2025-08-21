import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import maplibregl, { LngLatLike } from 'maplibre-gl';
import { OSM_RASTER_STYLE } from '../../styles/osm-raster-style';

/**
 * width 100%
 * height 260
 *
 */
@Component({
  selector: 'app-mini-map',
  imports: [],
  templateUrl: './mini-map.component.html',
})
export class MiniMapComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  lngLat = input.required<LngLatLike>();
  // lngLat = input.required<{ lng: number; lat: number }>();
  zoom = input(15);

  async ngAfterViewInit() {
    // La comprobación de `divElement` no es necesaria si usamos `viewChild.required()`
    // pero se mantiene aquí por si lo necesitas en otro contexto.
    if (!this.divElement()?.nativeElement) return;

    const element = this.divElement()!.nativeElement;

    const map = new maplibregl.Map({
      container: element,
      style: OSM_RASTER_STYLE,
      center: this.lngLat(),
      zoom: this.zoom(),
      interactive: false,
      pitch: 30,
    });

    this.addMarker(map);
  }

  addMarker(map: maplibregl.Map) {
    if (!map) return;

    const maplibreMarker = new maplibregl.Marker({
      draggable: false,
      color: 'red',
    })
      .setLngLat(this.lngLat())
      .addTo(map);
  }
}
