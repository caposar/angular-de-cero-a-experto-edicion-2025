import { AbstractControl, ValidationErrors, ValidatorFn, FormArray } from '@angular/forms';

/**
 * Validador que evita duplicados en un FormArray, usando una función de comparación.
 * @param targetArray FormArray en el que se busca duplicado.
 * @param comparator Función opcional para comparar elementos (por defecto usa ===).
 *
 * @returns ValidatorFn que valida que el valor no esté duplicado en el targetArray.
 *
 * @example
 * // Ejemplo básico con FormArray de strings (usa comparación estricta por defecto)
 * const favorites = new FormArray([
 *   new FormControl('Mario'),
 *   new FormControl('Luigi'),
 * ]);
 * const control = new FormControl('Mario', notInArrayValidator(favorites));
 * console.log(control.errors); // { notInArray: true } porque 'Mario' ya existe
 *
 * @example
 * // Ejemplo con objetos y comparación personalizada
 * const users = new FormArray([
 *   new FormControl({ id: 1, name: 'Alice' }),
 *   new FormControl({ id: 2, name: 'Bob' }),
 * ]);
 * const control = new FormControl(
 *   { id: 1, name: 'Alice' },
 *   notInArrayValidator(users, (a, b) => a.id === b.id)
 * );
 * console.log(control.errors); // { notInArray: true } porque el id 1 ya existe
 *
 * @example
 * // Cómo integrarlo en un FormGroup con FormArray y controles dinámicos
 * const form = new FormGroup({
 *   favorites: new FormArray([
 *     new FormControl('Jazz'),
 *     new FormControl('Rock'),
 *   ]),
 *   newFavorite: new FormControl('', notInArrayValidator(form.get('favorites') as FormArray))
 * });
 *
 * // Cuando 'newFavorite' vale 'Jazz', control será inválido porque ya está en el FormArray 'favorites'
 */
export function notInArrayValidator(
  targetArray: FormArray,
  comparator: (a: any, b: any) => boolean = (a, b) => a === b
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value == null || value === '') return null;

    const isDuplicate = targetArray.controls.some(ctrl =>
      ctrl !== control && // Asegura que no se compara el control consigo mismo
      comparator(ctrl.value, value)
    );

    return isDuplicate ? { notInArray: true } : null;
  };
}
