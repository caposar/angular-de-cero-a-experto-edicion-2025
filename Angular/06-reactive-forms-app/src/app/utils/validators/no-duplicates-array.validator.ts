import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador para evitar valores duplicados dentro de un FormArray.
 * No marca los controles individuales, solo retorna un error general a nivel de FormArray.
 *
 * @returns ValidatorFn que retorna { duplicates: true } si hay duplicados.
 *
 * @example
 * const array = new FormArray([
 *   new FormControl('A'),
 *   new FormControl('B'),
 *   new FormControl('A'),
 * ]);
 * array.setValidators([noDuplicatesValidator()]);
 * array.updateValueAndValidity();
 * console.log(array.errors); // { duplicates: true }
 */
export function noDuplicatesValidator(): ValidatorFn {
  return (formArray: AbstractControl): ValidationErrors | null => {
    if (!(formArray instanceof FormArray)) return null;

    const values = formArray.controls.map(c => c.value?.trim().toLowerCase?.() ?? '');
    const duplicates = values.filter((val, idx) => values.indexOf(val) !== idx);

    return duplicates.length > 0 ? { duplicates: true } : null;
  };
}
