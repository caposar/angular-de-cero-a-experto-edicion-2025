import { AbstractControl, ValidationErrors, ValidatorFn, FormArray } from '@angular/forms';

/**
 * Validador personalizado para verificar que un FormArray no exceda una cantidad máxima de elementos.
 * @param max Cantidad máxima de elementos permitidos en el FormArray.
 * @returns Función validadora que retorna null si la validación pasa, o un objeto de error si falla.
 */
export function maxArrayLength(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control instanceof FormArray) {
      return control.length <= max
        ? null
        : { maxItems: { allowed: max, actual: control.length } };
    }
    return null;
  };
}
