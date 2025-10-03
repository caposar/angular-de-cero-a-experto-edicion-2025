import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { TitleComponent } from '../../../shared/title/title.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-change-detection',
  imports: [TitleComponent, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-title [title]="currentFramework()" />
    <pre>{{ frameworkAsSignal() | json }}</pre>
    <pre>{{ frameworkAsProperty | json }}</pre>
  `,
})
export class ChangeDetectionComponent {
  public currentFramework = computed(
    () => `Change detection - ${this.frameworkAsSignal().name}`
  );

  public frameworkAsSignal = signal({
    name: 'Angular',
    releaseDate: 2016,
  });

  public frameworkAsProperty = {
    name: 'Angular',
    releaseDate: 2016,
  };

  constructor() {
    setTimeout(() => {
      // this.frameworkAsProperty.name = 'React';
      this.frameworkAsSignal.update((value) => ({ ...value, name: 'React' }));

      // OTRA FORMA VALIDA PARA ACTUALIZAR UNA SEÑAL
      // Usando un bloque de código {} y la palabra clave 'return'
      // this.frameworkAsSignal.update((value) => {
      //   // Crear y devolver el nuevo objeto
      //   return { ...value, name: 'React' };
      // });

      // FORMA INVALIDA PARA ACTUALIZAR UNA SEÑAL
      // this.frameworkAsSignal.update((value) => {
      //   // 1. Mutación: ESTO ES INSEGURO.
      //   // Estás modificando el objeto original en la señal.
      //   value.name = 'React';

      //   // 2. Copia: Estás creando un nuevo objeto a partir del objeto *ya modificado*.
      //   return { ...value }
      // });

      console.log('Hecho');
    }, 3000);
  }
}
