import { Component, input, linkedSignal, output, signal } from '@angular/core';
import { REGIONS } from '../region.type';

@Component({
  selector: 'app-region-menu',
  imports: [],
  templateUrl: './region-menu.component.html',
})
export class RegionMenuComponent {
  readonly regions = REGIONS;

  initialValue = input<string>();
  search = output<string>();

  // El valor de selectedRegion se inicializa con initialValue (si se proporciona),
  // y luego se actualiza con los eventos de los buttons (mediante el método onSearch).
  readonly selectedRegion = linkedSignal<string>(() => this.initialValue() ?? ''); // valor inicial vacío

  onSearch(region: string) {
    this.selectedRegion.set(region); // actualiza clase del botón seleccionado
    this.search.emit(region);
  }
}
