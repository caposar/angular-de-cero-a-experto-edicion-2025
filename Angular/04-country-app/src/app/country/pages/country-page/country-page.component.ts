import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { CountryService } from '../../services/country.service';
import { NotFoundComponent } from '../../../shared/components/not-found/not-found.component';
import { CountryInformationComponent } from "./country-information/country-information.component";

/*
  Opciones para obtener el parámetro 'code' de la ruta:
  - snapshot: simple, pero no reactivo.
  - paramMap observable: reactivo, recomendado si el parámetro puede cambiar.
  - paramMapSignal: reactivo y más moderno (Angular 17+).
  - withComponentInputBinding + signal: la forma más declarativa y recomendada en Angular 17+.
*/

@Component({
  selector: 'app-country-page',
  imports: [NotFoundComponent, CountryInformationComponent],
  templateUrl: './country-page.component.html',
})
export class CountryPageComponent {
  private route = inject(ActivatedRoute);
  countryService = inject(CountryService);

  // No reacciona a cambios de parámetros en la misma instancia del componente.
  // Si el usuario navega a otro país desde la misma página, el valor no se actualizará.
  countryCode = this.route.snapshot.params['code'];

  // O para una opción reactiva:
  // countryCode$ = this.route.paramMap.pipe(map(params => params.get('code')));

  // O usando signals (Angular 17+):
  // countryCode = this.route.paramMapSignal().pipe(map(params => params.get('code')));

  // Opción más declarativa con withComponentInputBinding (Angular 17+):
  // Si tienes en tu router config: provideRouter(routes, withComponentInputBinding())
  // y defines el parámetro como input:
  // @Input({ alias: 'code' }) code?: string; // opcional. El parámetro 'code' puede ser string o undefined
  // @Input({ alias: 'code', required: true }) code!: string; // obligatorio
  // O usando signals:
  // code = input<string>(); // opcional. El parámetro 'code' puede ser string o undefined
  // code = input.required<string>(); // obligatorio

  countryResource = rxResource({
    request: () => ({code: this.countryCode}),
    loader: ({request}) => {
      return this.countryService.searchCountryByAlphaCode(request.code);
    }
  });

}
