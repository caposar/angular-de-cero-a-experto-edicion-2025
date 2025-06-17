import { Component, output, signal } from '@angular/core';
import { Character } from '../../../interfaces/character.interface';

@Component({
  selector: 'dragonball-character-add',
  templateUrl: './character-add.component.html',
})
export class CharacterAddComponent {
  name = signal<string>('');
  power = signal<number>(0);

  newCharacter = output<Character>();

  //OTRA FORMA DE HACERLO
  setPower(value: string) {
    this.power.set(Number(value));
  }

  addCharacter() {
    if (!this.name() || this.name().trim() === '' || !this.power() || this.power() <= 0) {
      return;
    }

    const newCharacter: Character = {
      id: Math.floor(Math.random() * 1000), // Genera un ID aleatorio
      name: this.name(),
      power: this.power()
    };

    this.newCharacter.emit(newCharacter);

    this.resetFields();
  }

  resetFields() {
    this.name.set('');
    this.power.set(0);
  }
}
