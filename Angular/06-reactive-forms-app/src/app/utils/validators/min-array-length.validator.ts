import { AbstractControl, ValidationErrors, ValidatorFn, FormArray } from '@angular/forms';

/**
 * Validador personalizado para verificar que un FormArray tenga al menos una cantidad mínima de elementos.
 * @param min Cantidad mínima de elementos requeridos en el FormArray.
 * @returns Función validadora que retorna null si la validación pasa, o un objeto de error si falla.
 */
export function minArrayLength(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control instanceof FormArray) {
      return control.length >= min ? null : { minItems: { required: min, actual: control.length } };
    }
    return null;
  };
}
