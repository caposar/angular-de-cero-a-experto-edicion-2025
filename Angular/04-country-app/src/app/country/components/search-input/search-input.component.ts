import { Component, effect, input, linkedSignal, output, signal } from '@angular/core';

@Component({
  selector: 'country-search-input',
  imports: [],
  templateUrl: './search-input.component.html',
})
export class SearchInputComponent {

  placeholder = input<string>('Buscar');
  search = output<string>();
  debounceTime = input<number>(500);
  initialValue = input<string>();

  // El valor de inputValue se inicializa con initialValue (si se proporciona),
  // y luego se actualiza con los eventos del textbox (mediante el método onSearch).
  inputValue = linkedSignal<string>(() => this.initialValue() ?? '');

  // onSearch(value: string): void {
  //   this.search.emit(value);
  // }

  onSearch(value: string): void {
    this.inputValue.set(value);
  }

  debounceEffect = effect((onCleanup) => {
    const value = this.inputValue();

    const timeout = setTimeout(() => {
      this.search.emit(value);
    }, this.debounceTime());

    onCleanup(() => {
      clearTimeout(timeout);
    });
  });
}
