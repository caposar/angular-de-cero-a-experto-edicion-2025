import { Component, computed, input } from '@angular/core';
import { Country } from '../../interfaces/country.interface';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'country-list',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './country-list.component.html',
})
export class CountryListComponent {
  countries = input.required<Country[]>();
  errorMessage = input<string | unknown | null>();
  isLoading = input<boolean>(false);

  // Getter computado para saber si la lista está vacía
  readonly isEmpty = computed(() =>
    !this.isLoading() &&
    !this.errorMessage() &&
    this.countries().length === 0
  );
}
