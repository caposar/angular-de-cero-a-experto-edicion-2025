import { AbstractControl, ValidationErrors, ValidatorFn, FormArray } from '@angular/forms';

/**
 * Validador para FormArray que detecta duplicados y marca los controles individuales con errores.
 *
 * - Retorna un error general en el FormArray: { duplicates: true }
 * - Marca cada FormControl duplicado con: { duplicate: true }
 *
 * Esto permite mostrar mensajes de error específicos en cada campo duplicado.
 *
 * ⚠️ Importante: este validador modifica los errores de los controles hijos.
 * Si se usan otros validadores en los mismos controles, hay que hacer merge de errores para evitar sobrescribirlos.
 *
 * @param keySelector Función opcional para seleccionar el valor clave que se compara.
 *                    Igual que en `noDuplicatesValidator`.
 *
 * @returns ValidatorFn que retorna `{ duplicates: true }` si hay duplicados, o null si no.
 *
 * @example
 * // Validación básica con strings:
 * const arr = new FormArray([
 *   new FormControl('Rock'),
 *   new FormControl('Jazz'),
 *   new FormControl('rock'),
 * ]);
 * arr.setValidators([markDuplicateControls()]);
 * arr.updateValueAndValidity();
 * console.log(arr.errors); // { duplicates: true }
 * console.log(arr.at(0).errors); // { duplicate: true }
 * console.log(arr.at(2).errors); // { duplicate: true }
 *
 * @example
 * // Validación con objetos y keySelector personalizado:
 * const arrObj = new FormArray([
 *   new FormControl({ id: 1, name: 'Ana' }),
 *   new FormControl({ id: 2, name: 'Luis' }),
 *   new FormControl({ id: 3, name: 'ana' }),
 * ]);
 * arrObj.setValidators([
 *   markDuplicateControls(obj => obj?.name?.trim().toLowerCase() ?? '')
 * ]);
 * arrObj.updateValueAndValidity();
 * console.log(arrObj.errors); // { duplicates: true }
 * console.log(arrObj.at(0).errors); // { duplicate: true }
 * console.log(arrObj.at(2).errors); // { duplicate: true }
 */
export function markDuplicateControls<T = any>(
  keySelector?: (value: T) => string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!(control instanceof FormArray)) return null;

    const selector = keySelector ?? defaultKeySelector;

    // Mapa clave → lista de índices con ese valor
    const map = new Map<string, number[]>();
    control.controls.forEach((ctrl, idx) => {
      const key = selector(ctrl.value);
      const list = map.get(key) ?? [];
      list.push(idx);
      map.set(key, list);
    });

    // Limpiar errores 'duplicate' previos sin borrar otros errores
    control.controls.forEach(ctrl => {
      const errors = { ...(ctrl.errors || {}) };
      if (errors['duplicate']) {
        delete errors['duplicate'];
        ctrl.setErrors(Object.keys(errors).length ? errors : null);
      }
    });

    let hasDuplicates = false;

    // Marcar controles duplicados
    for (const indices of map.values()) {
      if (indices.length > 1) {
        hasDuplicates = true;
        for (const i of indices) {
          const ctrl = control.at(i);
          const errors = { ...(ctrl.errors || {}) };
          errors['duplicate'] = true;
          ctrl.setErrors(errors);
        }
      }
    }

    return hasDuplicates ? { duplicates: true } : null;
  };
}

/**
 * Selector por defecto para convertir valores en claves de comparación:
 * - Si es string, aplica `trim()` y `toLowerCase()`
 * - Si no, usa `toString()`
 *
 * @param val Valor del control.
 * @returns Clave normalizada como string.
 */
function defaultKeySelector(val: any): string {
  if (val == null) return '';
  if (typeof val === 'string') return val.trim().toLowerCase();
  return val.toString();
}
