import { Component, inject, resource, signal } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

import { SearchInputComponent } from "../../components/search-input/search-input.component";
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'app-by-country-page',
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-country-page.component.html',
})
export class ByCountryPageComponent {
  countryService = inject(CountryService);
  query = signal<string>('');

  // OPCION 1: Usamos rxResource porque el loader puede retornar directamente un observable de Angular.
  // Si el query está vacío, devolvemos un observable vacío (of([])) para evitar llamadas innecesarias.
  // Si hay query, delegamos la búsqueda al servicio, que retorna un observable con los países encontrados.
  countryResource = rxResource({
    request: () => ({query: this.query()}),
    loader: ({request}) => {
      if (!request.query) {
        return of([]);
      }

      return this.countryService.searchByCountry(request.query);
    }
  });

  // OPCION 2: El loader de resource espera una promesa, por eso usamos firstValueFrom
  // para convertir el observable de Angular (searchByCountry) en una promesa.
  // Así, resource puede manejar correctamente el ciclo de vida de la petición.
  // countryResource = resource({
  //   request: () => ({query: this.query()}),
  //   loader: async({request}) => {
  //     if (!request.query) {
  //       return [];
  //     }

  //     return await firstValueFrom(
  //       this.countryService.searchByCountry(request.query)
  //     );
  //   }
  // });

  onSearch(query: string): void {
    this.query.set(query);
  }

  // OPCION 3: Manejo manual del estado usando solo signals.
  // Aquí controlamos explícitamente los estados de carga (isLoading), error (isError) y datos (countries)
  // sin usar rxResource ni resource. Esto da mayor control y flexibilidad, pero requiere más código repetitivo.
  // isLoading = signal<boolean>(false);
  // isError = signal<string|null>(null);
  // countries = signal<Country[]>([]);

  // onSearch(query: string): void {
  //   if (this.isLoading()) {
  //     return;
  //   }

  //   this.isLoading.set(true);
  //   this.isError.set(null);
  //   this.countries.set([]);

  //   this.countryService.searchByCountry(query).subscribe({
  //     next: (countries) => {
  //       this.isLoading.set(false);
  //       this.countries.set(countries);
  //       console.log('Buscar por país:', countries);
  //     },
  //     error: (err) => {
  //       this.isLoading.set(false);
  //       this.countries.set([]);
  //       this.isError.set(err);
  //     }
  //   });
  // }
}
