import { Component, inject, signal } from '@angular/core';
import { CharacterListComponent } from "../../components/dragonball/character-list/character-list.component";
import { CharacterAddComponent } from "../../components/dragonball/character-add/character-add.component";
import { DragonballService } from '../../services/dragonball.service';
import { Character } from '../../interfaces/character.interface';

@Component({
  selector: 'dragonball-super',
  templateUrl: './dragonball-super-page.component.html',
  imports: [CharacterListComponent, CharacterAddComponent],
})
export class DragonballSuperPageComponent {

  dragonballService = inject(DragonballService);


  characters = this.dragonballService.characters;

  addCharacter(character: Character) {
    this.dragonballService.addCharacter(character);
  }
}
