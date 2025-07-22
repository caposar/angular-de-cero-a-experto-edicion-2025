import { AbstractControl, ValidationErrors, ValidatorFn, FormArray } from '@angular/forms';

/**
 * Validador para evitar valores duplicados dentro de un FormArray.
 * No marca los controles individuales, solo retorna un error general a nivel de FormArray.
 *
 * Por defecto, compara valores como strings, aplicando `trim()` y `toLowerCase()` para
 * evitar falsos negativos por espacios o mayúsculas.
 * Si los valores son objetos, conviene pasar una función `keySelector` que
 * extraiga el campo a comparar y aplique estas transformaciones.
 *
 * @param keySelector Función opcional para seleccionar el valor clave que se compara.
 *                    Ej: `(obj) => obj?.name?.trim().toLowerCase() ?? ''`.
 *                    Si no se pasa, se usa un selector por defecto que:
 *                    - convierte strings con `trim().toLowerCase()`
 *                    - para otros tipos, usa `.toString()`
 *
 * @returns ValidatorFn que retorna `{ duplicates: true }` si hay duplicados, o null si no.
 *
 * @example
 * // Validación básica con strings:
 * const arr = new FormArray([
 *   new FormControl('A'),
 *   new FormControl('B'),
 *   new FormControl('a'),
 * ]);
 * arr.setValidators([noDuplicatesValidator()]);
 * arr.updateValueAndValidity();
 * console.log(arr.errors); // { duplicates: true } porque 'A' y 'a' se consideran iguales
 *
 * @example
 * // Validación con objetos y keySelector personalizado:
 * const arrObj = new FormArray([
 *   new FormControl({ id: 1, name: 'Ana' }),
 *   new FormControl({ id: 2, name: 'Luis' }),
 *   new FormControl({ id: 3, name: 'ana' }),
 * ]);
 * arrObj.setValidators([
 *   noDuplicatesValidator(obj => obj?.name?.trim().toLowerCase() ?? '')
 * ]);
 * arrObj.updateValueAndValidity();
 * console.log(arrObj.errors); // { duplicates: true } porque 'Ana' y 'ana' coinciden
 */
export function noDuplicatesValidator<T = any>(
  keySelector?: (value: T) => string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!(control instanceof FormArray)) return null;

    const selector = keySelector ?? defaultKeySelector;
    const values = control.controls.map(c => selector(c.value));
    const unique = new Set(values);

    return unique.size < values.length ? { duplicates: true } : null;
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
export function defaultKeySelector(val: any): string {
  if (val == null) return '';
  if (typeof val === 'string') return val.trim().toLowerCase();
  return val.toString();
}
