import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  DoCheck,
  OnChanges,
  OnInit,
  afterNextRender,
  afterRender,
  effect,
  signal,
} from '@angular/core';
import { TitleComponent } from '../../components/title/title.component';

const log = (...messages: string[]) => {
  if (messages.length === 0) {
    console.log(''); // O manejar como prefieras si no hay mensajes
    return;
  }

  const firstMessage = messages[0];
  const restOfMessages = messages.slice(1).join(', '); // Unimos el resto de los mensajes en una sola cadena

  console.log(
    `%c${firstMessage} %c${restOfMessages}`,
    'font-weight: bold;',
    'background-color: #bada55'
  );
};

@Component({
  selector: 'app-home-page',
  imports: [TitleComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent
  implements
    OnInit,
    OnChanges,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked
{
  traditionalProperty = 'Cesar';
  signalProperty = signal('Cesar');

  constructor() {
    log(
      'Constructor',
      'Llamado al crear el componente (antes de cualquier hook)'
    );

    // setTimeout(() => {
    //   // this.traditionalProperty = 'Juan Carlos (TRADICIONAL)';
    //   // console.log('Propiedad tradicional cambiada mediante setTimeout en Zoneless');
    //   this.signalProperty.set('Juan Perez (SIGNAL)');
    //   console.log('Propiedad signal cambiada mediante setTimeout en Zoneless');
    // }, 2000);
  }

  changeTraditional() {
    this.traditionalProperty = 'Cesar Paredes';
  }

  changeSignal() {
    this.signalProperty.set('Cesar Paredes');
  }

  basicEffect = effect((onCleanup) => {
    log(
      'effect',
      'Disparar efectos secundarios (introducido a partir de la versión 16), se ejecuta al menos una vez al iniciar el componente.'
    );

    onCleanup(() => {
      console.log('onCleanup', 'Se ejecuta cuando el efecto se va a destruir');
    });
  });

  ngOnInit() {
    log(
      'ngOnInit',
      'Se ejecuta una vez después de que Angular haya inicializado todas las entradas del componente.'
    );
  }

  ngOnChanges() {
    log(
      'ngOnChanges',
      'Se ejecuta cada vez que cambian las entradas del componente.'
    );
  }

  ngDoCheck() {
    log(
      'ngDoCheck',
      'Se ejecuta cada vez que se comprueba si hay cambios en este componente.'
    );
  }

  ngAfterContentInit() {
    log(
      'ngAfterContentInit',
      'Se ejecuta una vez después de que se haya inicializado el contenido del componente .'
    );
  }
  ngAfterContentChecked() {
    log(
      'ngAfterContentChecked',
      'Se ejecuta cada vez que se verifica si se han producido cambios en el contenido de este componente.'
    );
  }

  ngAfterViewInit() {
    log(
      'ngAfterViewInit',
      'Se ejecuta una vez después de que se haya inicializado la vista del componente .'
    );
  }

  ngAfterViewChecked() {
    log(
      'ngAfterViewChecked',
      'Se ejecuta cada vez que se verifica si hay cambios en la vista del componente.'
    );
  }

  ngOnDestroy() {
    log(
      'ngOnDestroy',
      'Se ejecuta una vez antes de que se destruya el componente.'
    );
  }

  afterNextRender = afterNextRender(() => {
    log(
      'afterNextRender',
      'Se ejecuta una vez la próxima vez que todos los componentes se hayan representado en el DOM. Nuevos hooks de ciclo de vida introducidos en Angular (a partir de la versión 17)'
    );
  });

  afterRender = afterRender(() => {
    log(
      'afterRender',
      'Se ejecuta cada vez que todos los componentes se han representado en el DOM. Nuevos hooks de ciclo de vida introducidos en Angular (a partir de la versión 17 hasta la 19)'
    );
  });
}
