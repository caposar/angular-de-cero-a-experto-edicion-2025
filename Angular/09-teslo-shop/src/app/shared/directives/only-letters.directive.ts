import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyLetters]',
})
export class OnlyLettersDirective {
  private regex = new RegExp('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$');

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const input = event.key;
    // Permite caracteres de control como el 'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight'
    if (event.key === 'Backspace' || event.key === 'Tab' || event.key.startsWith('Arrow')) {
      return;
    }
    // Si el caracter no coincide con la expresión regular, evita que se escriba
    if (!this.regex.test(input)) {
      event.preventDefault();
    }
  }
}
