import { JsonPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-country-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './country-page.component.html',
})
export class CountryPageComponent {
  fb = inject(FormBuilder).nonNullable;
  countryService = inject(CountryService);

  regions = signal(this.countryService.regions);
  countriesByRegion = signal<Country[]>([]);
  borders = signal<Country[]>([]);

  myForm = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  });

  // Getters para facilitar lectura
  get regionControl() {
    return this.myForm.controls.region;
  }

  get countryControl() {
    return this.myForm.controls.country;
  }

  get borderControl() {
    return this.myForm.controls.border;
  }

  // Effect principal que se encarga de escuchar los cambios
  onFormChanged = effect((onCleanup) => {
    const regionSubscription = this.onRegionChanged();
    const countrySubscription = this.onCountryChanged();

    onCleanup(() => {
      regionSubscription.unsubscribe();
      countrySubscription.unsubscribe();
    });
  });

  onRegionChanged() {
    return this.regionControl.valueChanges.pipe(
      tap(() => {
        this.countryControl.setValue('');
        this.borderControl.setValue('');
        this.countriesByRegion.set([]);
        this.borders.set([]);
      }),
      switchMap(region => this.countryService.getCountriesByRegion(region))
    ).subscribe((countries) => {
      this.countriesByRegion.set(countries);
    });
  }

  onCountryChanged() {
    return this.countryControl.valueChanges.pipe(
      tap(() => {
        this.borderControl.setValue('');
        this.borders.set([]);
      }),
      filter(alphaCode => alphaCode.length > 0),
      switchMap(alphaCode => this.countryService.getCountryByAlphaCode(alphaCode)),
      // switchMap(country => this.countryService.getCountryNamesByCodeArray(country.borders))
      switchMap(country => this.countryService.getCountryBorderByCodes(country.borders))

    ).subscribe((borders) => {
      this.borders.set(borders);
    });
  }
}
