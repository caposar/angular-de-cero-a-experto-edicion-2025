import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Validador síncrono que verifica si un nombre de usuario está en una lista negra.
 * Ideal para prevenir el uso de nombres reservados o no permitidos.
 *
 * @param blacklist - Lista de nombres no permitidos (sin distinción de mayúsculas/minúsculas).
 * @returns ValidatorFn que emite { usernameBlacklisted: true } si el valor está prohibido, o null si es válido.
 *
 * @example
 * this.fb.control('', {
 *   validators: [usernameBlacklistedValidator(['admin', 'root'])],
 * });
 */
export function usernameBlacklistedValidator(blacklist: string[]): ValidatorFn {
  const normalizedBlacklist = (blacklist ?? []).map((name) =>
    (name ?? '').trim().toLowerCase()
  );

  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value ?? '').trim().toLowerCase();
    return normalizedBlacklist.includes(value)
      ? { usernameBlacklisted: true }
      : null;
  };
}
