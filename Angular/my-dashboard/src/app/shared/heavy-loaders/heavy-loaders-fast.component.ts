import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-heavy-loaders-fast',
  imports: [NgClass],
  template: `
    <section [ngClass]="['w-full', cssClass]">
      <ng-content />
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class HeavyLoadersFastComponent {
  @Input({required: true}) cssClass!: string;

  constructor() {
    console.log('HeavyLoaderFast creado');
  }
}
