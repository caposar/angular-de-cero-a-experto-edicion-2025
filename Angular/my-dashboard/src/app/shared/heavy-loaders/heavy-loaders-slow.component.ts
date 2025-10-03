import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-heavy-loaders-slow',
  imports: [NgClass],
  template: `
    <section [ngClass]="['w-full h-[600px]', cssClass]">
      Heavy Loaders Slow
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class HeavyLoadersSlowComponent {

  @Input({required: true}) cssClass!: string;

  constructor() {
    console.log('cargando...');
    const start = Date.now();
    while (Date.now() - start <3000) {}

    console.log('cargado');
  }
}
