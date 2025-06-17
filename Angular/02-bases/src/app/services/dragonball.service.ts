import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Character } from '../interfaces/character.interface';
import { StorageService } from './storage.service';

@Injectable({providedIn: 'root'})
export class DragonballService {

  private readonly STORAGE_KEY = 'characters';

  private readonly storage = inject(StorageService);

  private readonly _characters = signal<Character[]>(
    this.storage.getItem<Character[]>(this.STORAGE_KEY) ?? []
  );

  readonly characters = this._characters.asReadonly();

  readonly characterCount = computed(() => this._characters().length);

  private readonly saveToLocalStorage = effect(() => {
    const characters = this._characters();
    this.storage.setItem(this.STORAGE_KEY, characters);
    console.log('Guardado en localStorage:', characters);
  });

  addCharacter(character: Character) {
    // ❌ No recomendado: modificar el array directamente rompe la inmutabilidad.
    // Angular puede no detectar el cambio y la vista podría no actualizarse.
    // this._characters().push(character);

    // ✅ Recomendado: usando signals, es mejor crear un nuevo array para mantener la inmutabilidad.
    // Esto asegura que Angular detecte el cambio y actualice la vista correctamente.
    this._characters.update(chars => [...chars, character]);

    // Alternativamente, puedes usar el método `set` para reemplazar todo el array:
    // this._characters.set([...this._characters(), character]);
  }

  removeCharacter(id: number) {
    this._characters.update(chars => chars.filter(c => c.id !== id));
  }

  clearCharacters() {
    this._characters.set([]);
    this.storage.removeItem(this.STORAGE_KEY);
  }
}
