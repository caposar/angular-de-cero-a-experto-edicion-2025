import { AfterViewInit, Component, inject, input, OnDestroy } from '@angular/core';
import { Country } from '../../../interfaces/country.interface';
import { DecimalPipe } from '@angular/common';
import * as L from 'leaflet';
import { AreaPipe } from '../../../../shared/pipes/area.pipe';
import { MapProviderService } from '../../../../shared/services/map-provider.service';

@Component({
  selector: 'country-information-page',
  imports: [DecimalPipe, AreaPipe],
  templateUrl: './country-information.component.html',
})
export class CountryInformationComponent implements AfterViewInit, OnDestroy {
  country = input.required<Country>();

  private map!: L.Map; // Instancia de Leaflet creada al iniciar el componente
  private marker!: L.Marker;
  private mapProvider = inject(MapProviderService);

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  /**
   * Inicializa el mapa Leaflet con la ubicación del país y el proveedor configurado.
   */
  private initializeMap(): void {
    const [lat, lng] = this.country().latlng;
    const provider = this.mapProvider.getProvider();

    this.map = L.map('map', {
      center: [lat, lng],
      zoom: 5,
      zoomControl: false,
      attributionControl: provider.showAttribution ?? false,
    });

    const tileUrl = this.mapProvider.getTileUrl();
    if (!tileUrl) return;

    L.tileLayer(tileUrl, { attribution: provider.attribution }).addTo(this.map);
    this.marker = L.marker([lat, lng]).addTo(this.map);
  }

  /**
   * Actualiza la vista del mapa a una nueva ubicación de país y reposiciona el marcador (sin recrear el mapa).
   */
  private updateMap(country: Country): void {
    const [lat, lng] = country.latlng;

    this.map.setView([lat, lng], 5);

    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }
  }

  /**
   * Limpia la instancia del mapa Leaflet y sus capas.
   */
  private destroyMap(): void {
    if (this.map) {
      this.map.remove();
      this.map = undefined!;
      this.marker = undefined!;
    }
  }

  ngOnDestroy(): void {
    this.destroyMap();
  }
}
