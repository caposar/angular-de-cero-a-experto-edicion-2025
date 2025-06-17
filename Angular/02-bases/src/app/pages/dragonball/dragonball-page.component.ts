import { NgClass } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

interface Character {
  id: number;
  name: string;
  power: number;
}

@Component({
  imports: [
    // NgClass
  ],
  templateUrl: './dragonball-page.component.html',
})
export class DragonballPageComponent {

  name = signal<string>('');
  power = signal<number>(0);

  characters = signal<Character[]>([
    {id: 1, name: 'Goku', power: 9001},
    // {id: 2, name: 'Vegeta', power: 8000},
    // {id: 4, name: 'Yamcha', power: 500},
    // {id: 3, name: 'Piccolo', power: 3000},
  ]);

  // powerClasses = computed(() => {
  //   return {
  //     'text-danger': true
  //   }
  // });

  //OTRA FORMA DE HACERLO
  setPower(value: string) {
    this.power.set(Number(value));
  }

  addCharacter() {
    if (!this.name() || this.name().trim() === '' || !this.power() || this.power() <= 0) {
      return;
    }

    const newCharacter: Character = {
      id: this.characters().length + 1,
      name: this.name(),
      power: this.power()
    };

    // ❌ No recomendado: modificar el array directamente rompe la inmutabilidad.
    // Angular puede no detectar el cambio y la vista podría no actualizarse.
    // this.characters().push(newCharacter);

    // ✅ Recomendado: usando signals, es mejor crear un nuevo array para mantener la inmutabilidad.
    // Esto asegura que Angular detecte el cambio y actualice la vista correctamente.
    this.characters.update(chars => [...chars, newCharacter]);

    // Alternativamente, puedes usar el método `set` para reemplazar todo el array:
    // this.characters.set([...this.characters(), newCharacter]);

    this.resetFields();
  }

  resetFields() {
    this.name.set('');
    this.power.set(0);
  }
}
