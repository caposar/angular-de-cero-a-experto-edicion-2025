import { AfterViewInit, Component, ElementRef, signal, viewChild } from '@angular/core';
import maplibregl, { LngLatLike } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { environment } from '../../../environments/environment';
import { v4 as uuidv4 } from 'uuid'
import { OSM_RASTER_STYLE } from '../../maps/styles/osm-raster-style';
import { CARTO_VOYAGER_STYLE } from '../../maps/styles/carto-voyager-style';
import { ESRI_WORLD_STREET_STYLE } from '../../maps/styles/esri-worldstreet-style';
import { OSM_HUMANITARIAN_STYLE } from '../../maps/styles/osm-humanitarian-style';
import { ESRI_TOPOGRAPHIC_STYLE } from '../../maps/styles/esri-topographic-style';
import { JsonPipe } from '@angular/common';

// mapboxgl.accessToken = environment.mapboxKey;

interface Marker {
  id: string;
  maplibreMarker: maplibregl.Marker;
}

@Component({
  selector: 'app-markers-page',
  imports: [JsonPipe],
  templateUrl: './markers-page.component.html',
})
export class MarkersPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  map = signal<maplibregl.Map|null>(null);
  markers = signal<Marker[]>([]);

  async ngAfterViewInit() {
    // La comprobación de `divElement` no es necesaria si usamos `viewChild.required()`
    // pero se mantiene aquí por si lo necesitas en otro contexto.
    if (!this.divElement()?.nativeElement) return;

    const element = this.divElement()!.nativeElement;

    const map = new maplibregl.Map({
      container: element,
      // style: 'https://demotiles.maplibre.org/style.json',
      style: OSM_RASTER_STYLE,
      // style: 'https://tiles.stadiamaps.com/styles/alidade_smooth.json',
      center: [-64.793012, -23.815345],
      zoom: 15,
    });

    // const marker = new maplibregl.Marker({
    //   draggable: false,
    //   color: 'red'
    // })
    //   .setLngLat([-64.793012, -23.815345])
    //   .addTo(map);

    // marker.on('dragend', (event) => {
    //   console.log(event);
    // });

    this.mapListener(map);
  }

  mapListener(map: maplibregl.Map) {
    map.on('click', (event) => this.mapClick(event));

    this.map.set(map);
  }

  mapClick(event: maplibregl.MapMouseEvent) {
    if (!this.map) return;

    const map = this.map()!;
    const coords = event.lngLat;
    // Generador de colores HEX
    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );

    const maplibreMarker = new maplibregl.Marker({
      draggable: false,
      color: color
    })
    .setLngLat(coords)
    .addTo(map);

    // uuid es una librería de terceros para JavaScript/TypeScript que permite generar UUIDs de varias versiones: v1 (timestamp/MAC), v3 (namespace MD5), v4 (random) y v5 (namespace SHA-1).
    // const newMarker: Marker = {
    //   id: uuidv4(),
    //   maplibreMarker: maplibreMarker
    // }

    // crypto.randomUUID() es una función nativa de JavaScript (desde ES2021) que genera un UUID versión 4 (basado en valores aleatorios criptográficamente seguros) utilizando la Web Crypto API.
    const newMarker: Marker = {
      id: crypto.randomUUID(),
      maplibreMarker: maplibreMarker
    }

    // this.markers.set([newMarker, ...this.markers()]);
    this.markers.update(markers => [newMarker, ...markers]);

    console.log(this.markers());

    // marker.on('dragend', (event) => {
    //   console.log(event);
    // });

  }

  flyToMarker(lngLat: LngLatLike) {
    if (!this.map()) return;

    this.map()?.flyTo({
      center: lngLat
    });
  }

  deleteMarker(marker: Marker) {
    if (!this.map()) return;

    const map = this.map()!;

    marker.maplibreMarker.remove();

    this.markers.set(this.markers().filter(m => m.id !== marker.id));
    // this.markers.update(markers => markers.filter(m => m.id !== marker.id));
  }
}
