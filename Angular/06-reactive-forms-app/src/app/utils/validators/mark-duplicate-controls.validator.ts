import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador para FormArray que detecta duplicados y marca los controles individuales con errores.
 *
 * - Retorna un error general en el FormArray: { duplicates: true }
 * - Marca cada FormControl duplicado con: { duplicate: true }
 *
 * Ideal cuando se desea mostrar mensajes de error específicos en cada campo duplicado.
 *
 * @example
 * const array = new FormArray([
 *   new FormControl('Rock'),
 *   new FormControl('Jazz'),
 *   new FormControl('Rock'),
 * ]);
 * array.setValidators([markDuplicateControls()]);
 * array.updateValueAndValidity();
 * console.log(array.errors); // { duplicates: true }
 * console.log(array.at(0).errors); // { duplicate: true }
 * console.log(array.at(2).errors); // { duplicate: true }
 */
export function markDuplicateControls(): ValidatorFn {
  return (formArray: AbstractControl): ValidationErrors | null => {
    if (!(formArray instanceof FormArray)) return null;

    const controls = formArray.controls;
    const seen = new Map<string, number[]>();

    // Limpiar errores previos de tipo 'duplicate'
    controls.forEach(control => {
      const errors = { ...(control.errors || {}) };
      delete errors['duplicate'];
      control.setErrors(Object.keys(errors).length ? errors : null);
    });

    // Registrar índices de cada valor
    controls.forEach((control, index) => {
      const value = (control.value || '').trim().toLowerCase();
      if (!seen.has(value)) seen.set(value, []);
      seen.get(value)!.push(index);
    });

    // Marcar duplicados
    let hasDuplicates = false;
    for (const indices of seen.values()) {
      if (indices.length > 1) {
        hasDuplicates = true;
        for (const i of indices) {
          const ctrl = controls[i];
          const errors = ctrl.errors || {};
          errors['duplicate'] = true;
          ctrl.setErrors(errors);
        }
      }
    }

    return hasDuplicates ? { duplicates: true } : null;
  };
}
