import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { sleep } from '../form-utils';

export function emailTakenValidator(): AsyncValidatorFn {
  return async (control: AbstractControl): Promise<ValidationErrors | null> => {
    await sleep(); // 2 segundos y medio

    return control.value === 'hola@mundo.com' ? { emailTaken: true } : null;
  };
}
