import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Validador personalizado para verificar que dos campos de un FormGroup tengan el mismo valor.
 *
 * Comúnmente se utiliza para validar que una contraseña y su confirmación coincidan,
 * pero puede aplicarse a cualquier par de campos que deban ser iguales.
 *
 * @param fieldKey     - Nombre del primer campo (por ejemplo, 'password').
 * @param confirmKey   - Nombre del segundo campo a comparar (por ejemplo, 'confirmPassword').
 *
 * @returns ValidatorFn que retorna `{ fieldsMismatch: true }` si los valores no coinciden, o `null` si son iguales.
 *
 * @note Este validador aplica el error al `FormGroup`, **no marca los controles individualmente**.
 *
 * @example
 * // En un componente con Reactive Forms
 * this.form = this.fb.group({
 *   password: ['', [Validators.required, Validators.minLength(6)]],
 *   confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
 * }, {
 *   validators: matchFieldsValidator('password', 'confirmPassword')
 * });
 *
 * // Para mostrar el error en el HTML:
 * <div *ngIf="form.errors?.['fieldsMismatch'] && form.get('confirmPassword')?.touched">
 *   Las contraseñas no coinciden.
 * </div>
 */
export function matchFieldsValidator(
  fieldKey: string,
  confirmKey: string
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const fieldCtrl = group.get(fieldKey);
    const confirmCtrl = group.get(confirmKey);

    if (!fieldCtrl || !confirmCtrl) {
      return null;
    }

    const value1 = fieldCtrl.value;
    const value2 = confirmCtrl.value;

    return value1 !== value2 ? { fieldsMismatch: true } : null;
  };
}
