import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';
import { minArrayLength } from '../../../utils/validators/min-array-length.validator';
import { notInArrayValidator } from '../../../utils/validators/not-in-array.validator';
import { maxArrayLength } from '../../../utils/validators/max-array-length.validator';
import { markDuplicateControls } from '../../../utils/validators/mark-duplicate-controls.validator';
import { noDuplicatesValidator } from '../../../utils/validators/no-duplicates-array.validator';

@Component({
  selector: 'app-dynamic-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './dynamic-page.component.html',
})
export class DynamicPageComponent {
  private fb = inject(FormBuilder);

  formUtils = FormUtils;
  private readonly defaultFavoriteGames = ['Metal Gear', 'Death Stranding'];

  myForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    favoriteGames: this.fb.array(
      [
        ['Metal Gear', Validators.required],
        ['Death Stranding', Validators.required],
      ],
      [minArrayLength(2), maxArrayLength(5), noDuplicatesValidator()]
    ),
  });

  newFavorite = new FormControl('');
  // newFavorite = this.fb.control('');

  get favoriteGames() {
    return this.myForm.get('favoriteGames') as FormArray;
  }

  addToFavorites(event: Event): void {
    // Evita el submit automático (por 'Enter') y deja que Angular maneje la lógica de agregar favorito.
    event.preventDefault();

    const newGame = this.newFavorite.value;

    // 1. Si el input está vacío o tiene solo espacios, no hacemos nada.
    if (!newGame || !newGame.trim()) {
      console.log(
        'El campo "Agregar favorito" está vacío o contiene solo espacios.'
      );
      return;
    }

    // 2. Si el input es inválido (en este caso, solo si es un duplicado por el validador)
    // if (this.newFavorite.invalid) {
    //   console.warn(`"${newGame}" ya está en la lista de favoritos.`);
    //   this.newFavorite.markAsTouched(); // Para asegurar que el error se muestre en el HTML
    //   return;
    // }

    // Guardamos el valor **trimmeado** para evitar almacenar espacios al principio o al final
    const newGameControl = this.fb.control(newGame.trim(), Validators.required);
    this.favoriteGames.push(newGameControl);

    newGameControl.markAsTouched();
    // this.favoriteGames.updateValueAndValidity();
    // this.favoriteGames.markAllAsTouched();

    this.newFavorite.reset('');
  }

  deleteFavorite(index: number) {
    this.favoriteGames.removeAt(index);

    this.favoriteGames.markAllAsTouched();
  }

  submitForm() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    console.log('Formulario enviado:', this.myForm.value);

    this.resetControls();
  }

  resetControls() {
    this.newFavorite.reset('');
    this.myForm.reset({ name: '' });
    this.loadDefaultGames();
  }

  private loadDefaultGames(): void {
    this.favoriteGames.clear();
    this.defaultFavoriteGames.forEach(game =>
      this.favoriteGames.push(this.fb.control(game, Validators.required))
    );
  }

}
