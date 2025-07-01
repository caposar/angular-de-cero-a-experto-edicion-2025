import { Component, inject, signal } from '@angular/core';
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'app-by-region-page',
  imports: [CountryListComponent],
  templateUrl: './by-region-page.component.html',
})
export class ByRegionPageComponent {
  countryService = inject(CountryService);

  isLoading = signal<boolean>(false);
  isError = signal<string|null>(null);
  countries = signal<Country[]>([]);

  onSearch(query: string): void {
    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.isError.set(null);

    this.countryService.searchByRegion(query).subscribe(countries => {
      this.isLoading.set(false);
      this.countries.set(countries);
      console.log('Buscar por region:', countries);
    });
  }
}
