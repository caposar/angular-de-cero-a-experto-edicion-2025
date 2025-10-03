import { booleanAttribute, Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-title',
  imports: [],
  // template: `<h1 class="text-3xl mb-5">{{ title2 }} - {{ withShadow }}</h1>`,
  template: `<h1 class="text-3xl mb-5">{{ title() }} - {{ withShadow() }}</h1>`,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class TitleComponent {
  // @Input({ required: true, alias: 'title' }) title2!: string;
  // @Input({transform: booleanAttribute}) withShadow: boolean = false;

  title = input.required<string>(); // Requerido (lanza error si no se pasa)
  withShadow = input(false, { transform: booleanAttribute }); // Booleano opcional (usa booleanAttribute)
}
