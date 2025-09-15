import { FormGroup, AbstractControl } from "@angular/forms";

export class FormUtils {
  /**
   * Verifica si un campo del formulario es inválido y fue tocado o modificado.
   * @param form FormGroup que contiene el control.
   * @param fieldName Nombre del campo.
   */
  static isInvalidField(form: FormGroup, fieldName: string): boolean {
    const control = form.get(fieldName);
    return FormUtils.isControlInvalid(control);
  }

  /**
   * Verifica si un control es inválido y fue tocado o modificado.
   */
  static isControlInvalid(control: AbstractControl | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
