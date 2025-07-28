import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Validador personalizado que verifica que dos campos coincidan y
 * marca el control de confirmación como inválido si no lo hacen.
 *
 * A diferencia de la versión simple, esta también aplica el error
 * en el segundo control (`confirmKey`) sin sobrescribir otros errores existentes.
 *
 * @param fieldKey - Nombre del control original (por ejemplo, 'password').
 * @param confirmKey - Nombre del control de confirmación (por ejemplo, 'confirmPassword').
 *
 * @returns ValidatorFn que retorna `{ fieldsMismatch: true }` si los campos no coinciden, o `null` si coinciden.
 *
 * @note El error `fieldsMismatch` se agrega tanto al `FormGroup` como al segundo control (`confirmKey`).
 *       Si los campos coinciden, se remueve el error solo si fue agregado por este validador.
 *
 * @example
 * this.form = this.fb.group({
 *   password: ['', Validators.required],
 *   confirmPassword: ['', Validators.required],
 * }, {
 *   validators: matchFieldsExtendedValidator('password', 'confirmPassword')
 * });
 */
export function matchFieldsExtendedValidator(
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

    if (value1 !== value2) {
      // Agrega error al grupo
      const error = { fieldsMismatch: true };

      // Agrega error personalizado al control confirmador sin sobrescribir otros
      const errors = confirmCtrl.errors || {};
      confirmCtrl.setErrors({ ...errors, fieldsMismatch: true });

      return error;
    } else {
      // Elimina el error específico del control si existe
      const errors = confirmCtrl.errors;
      if (errors?.['fieldsMismatch']) {
        const { fieldsMismatch, ...rest } = errors;
        confirmCtrl.setErrors(Object.keys(rest).length ? rest : null);
      }

      return null;
    }
  };
}
