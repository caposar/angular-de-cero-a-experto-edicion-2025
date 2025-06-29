import { Component, input, output } from '@angular/core';

@Component({
  selector: 'country-search-input',
  imports: [],
  templateUrl: './search-input.component.html',
})
export class SearchInputComponent {

  placeholder = input<string>('Buscar');
  search = output<string>();

  onSearch(value: string): void {
    this.search.emit(value);
  }
}
