import { Component, inject, linkedSignal, resource, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom, map, of, tap } from 'rxjs';

import { CountryListComponent } from "../../components/country-list/country-list.component";
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';
import { RegionMenuComponent } from "./region-menu/region-menu.component";
import { REGIONS } from './region.type';

// Funcion opcional para validar el query de la url si es que se coloca cualquier valor invalido
function validateQueryParam(queryParam: string): string {
  const validRegions = REGIONS;
  return validRegions.find(region => region == queryParam) ?? REGIONS[1];
}

@Component({
  selector: 'app-by-region-page',
  imports: [CountryListComponent, RegionMenuComponent],
  templateUrl: './by-region-page.component.html',
})
export class ByRegionPageComponent {
  countryService = inject(CountryService);

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('region') ?? '';
  query = linkedSignal<string>(() => validateQueryParam(this.queryParam));

  // query = toSignal(
  //   this.activatedRoute.queryParamMap.pipe(
  //     map(params => params.get('region') ?? '')
  //   ),
  //   { initialValue: '' }
  // );

  // constructor() {
  //   const initialQuery = this.query();
  //   if (initialQuery) {
  //     setTimeout(() => this.onSearch(initialQuery), 0);
  //   }
  // }


  // OPCION 1: Usamos rxResource porque el loader puede retornar directamente un observable de Angular.
  // Si el query está vacío, devolvemos un observable vacío (of([])) para evitar llamadas innecesarias.
  // Si hay query, delegamos la búsqueda al servicio, que retorna un observable con los países encontrados.
  countryResource = rxResource({
    request: () => ({region: this.query()}),
    loader: ({request}) => {
      if (!request.region) {
        return of([]);
      }

      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          region: request.region,
        }
      });

      return this.countryService.searchByRegion(request.region);
    }
  });

  // OPCION 2: El loader de resource espera una promesa, por eso usamos firstValueFrom
  // para convertir el observable de Angular (searchByRegion) en una promesa.
  // Así, resource puede manejar correctamente el ciclo de vida de la petición.
  // countryResource = resource({
  //   request: () => ({region: this.query()}),
  //   loader: async({request}) => {
  //     if (!request.region) {
  //       return [];
  //     }

  //     this.router.navigate([], {
  //       relativeTo: this.activatedRoute,
  //       queryParams: {
  //         region: request.region,
  //       }
  //     });

  //     return await firstValueFrom(
  //       this.countryService.searchByRegion(request.region)
  //     );
  //   }
  // });

  onSearch(region: string): void {
    this.query.set(region);
  }

  // OPCION 3: Manejo manual del estado usando solo signals.
  // Aquí controlamos explícitamente los estados de carga (isLoading), error (isError) y datos (countries)
  // sin usar rxResource ni resource. Esto da mayor control y flexibilidad, pero requiere más código repetitivo.
  // isLoading = signal<boolean>(false);
  // isError = signal<string|null>(null);
  // countries = signal<Country[]>([]);

  // onSearch(region: string): void {
  //   if (this.isLoading()) {
  //     return;
  //   }

  //   this.router.navigate([], {
  //     relativeTo: this.activatedRoute,
  //     queryParams: {
  //       region: region,
  //     }
  //   });

  //   this.isLoading.set(true);
  //   this.isError.set(null);
  //   this.countries.set([]);

  //   this.countryService.searchByRegion(region).subscribe({
  //     next: (countries) => {
  //       this.isLoading.set(false);
  //       this.countries.set(countries);
  //       console.log('Buscar por región:', countries);
  //     },
  //     error: (err) => {
  //       this.isLoading.set(false);
  //       this.countries.set([]);
  //       this.isError.set(err);
  //     }
  //   });
  // }
}
