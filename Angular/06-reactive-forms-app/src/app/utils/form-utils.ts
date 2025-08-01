import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

/**
 * Pausa la ejecución de forma asíncrona durante un tiempo determinado.
 *
 * Equivalente a `await Task.Delay(...)` en .NET.
 * Útil para simular demoras de red o procesos del backend durante pruebas o validaciones asíncronas.
 *
 * @param ms - Tiempo de espera en milisegundos (por defecto 2500ms)
 * @returns Una Promise que se resuelve luego del tiempo especificado.
 */
export function sleep(ms: number = 2500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class FormUtils {
  // Expresiones regulares
  // static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
  // static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  // static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';

  /**
   * Patrón para validar un nombre completo:
   * - Al menos dos palabras separadas por un solo espacio.
   * - Letras mayúsculas y minúsculas, con acentos y ñ.
   * - No permite números, símbolos ni espacios múltiples.
   * - Anclado al inicio (^) y fin ($) para validar toda la cadena.
   */
  static readonly fullNamePattern =
    '^[A-Za-zÁÉÍÓÚáéíóúÑñ]+( [A-Za-zÁÉÍÓÚáéíóúÑñ]+)+$';
  /**
   * Patrón para validar correos electrónicos sencillos:
   * - No permite espacios ni arrobas antes de la '@'.
   * - Después de '@' requiere al menos un carácter válido y un punto.
   * - El dominio debe tener al menos dos caracteres.
   * - No cubre todos los casos RFC, pero evita errores comunes.
   */
  static readonly emailPattern = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$';
  /**
   * Patrón para validar solo caracteres alfanuméricos:
   * - Solo letras (mayúsculas y minúsculas) y números.
   * - Sin espacios ni símbolos.
   * - Ideal para usuarios, códigos o claves simples.
   */
  static readonly alphanumericPattern = '^[a-zA-Z0-9]+$';

  /**
   * Verifica si un campo dentro de un FormArray es inválido y fue tocado o modificado.
   * @param formArray Arreglo de controles.
   * @param index Índice del control dentro del arreglo.
   */
  static isInvalidArrayField(formArray: FormArray, index: number) {
    const control = formArray.at(index);
    return FormUtils.isControlInvalid(control);
  }

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

  /**
   * Devuelve el primer mensaje de error de un campo dentro de un FormGroup.
   * @param form Formulario que contiene el control.
   * @param fieldName Nombre del campo.
   */
  static getFieldError(form: FormGroup, fieldName: string): string | null {
    const control = form.get(fieldName);

    return this.getControlError(control);
  }

  /**
   * Devuelve el primer mensaje de error de un campo dentro de un FormArray.
   * @param formArray Arreglo de controles.
   * @param index Índice del control dentro del arreglo.
   */
  static getFieldErrorInArray(
    formArray: FormArray,
    index: number
  ): string | null {
    const control = formArray.at(index);

    return this.getControlError(control);
  }

  /**
   * Devuelve el primer mensaje de error de un control, si existe.
   */
  static getControlError(control: AbstractControl | null): string | null {
    const msg = this.getErrorMessage(control, true);
    return typeof msg === 'string' ? msg : null;

    // if (!control || !control.errors) return null;

    // for (const key of Object.keys(control.errors)) {
    //   const error = control.errors[key];
    //   switch (key) {
    //     case 'required':
    //       return `Este campo es requerido`;
    //     case 'requiredTrue':
    //       return `Debe estar marcado (obligatorio)`; // Actualmente angular para Validators.requiredTrue devuelve {required:true}
    //     case 'minlength':
    //       return `Debe tener al menos ${error.requiredLength} caracteres`;
    //     case 'maxlength':
    //       return `Debe tener como máximo ${error.requiredLength} caracteres (actual: ${error.actualLength})`;
    //     case 'min':
    //       return `Debe ser mayor o igual que ${error.min}`;
    //     case 'max':
    //       return `Debe ser menor o igual que ${error.max} (actual: ${error.actual})`;
    //     case 'email':
    //       return `Debe tener un formato de correo válido`;
    //     case 'pattern':
    //       return `No coincide con el patrón requerido`;
    //     case 'nullValidator':
    //       return `No debe tener ningún valor`;
    //     default:
    //       return `Error desconocido: ${key}`;
    //   }
    // }

    // return null;
  }

  private static readonly patternMessages = new Map<string, string>([
    [FormUtils.emailPattern, 'Debe tener un formato de correo válido'],
    [
      FormUtils.fullNamePattern,
      'Solo letras y un espacio entre palabras (nombre y apellido)',
    ],
    [
      FormUtils.alphanumericPattern,
      'Solo se permiten letras y números, sin espacios',
    ],
  ]);

  // Diccionario de mensajes de error
  static readonly errorMessages: Record<string, (error: any) => string> = {
    required: () => 'Este campo es requerido',
    requiredTrue: () => 'Debe estar marcado (obligatorio)', // Actualmente angular para Validators.requiredTrue devuelve {required:true}
    minlength: (e) => `Debe tener al menos ${e.requiredLength} caracteres`,
    maxlength: (e) =>
      `Debe tener como máximo ${e.requiredLength} caracteres (actual: ${e.actualLength})`,
    min: (e) => `Debe ser mayor o igual que ${e.min}`,
    max: (e) => `Debe ser menor o igual que ${e.max} (actual: ${e.actual})`,
    email: () => 'Debe tener un formato de correo válido',
    pattern: (error) =>
      FormUtils.patternMessages.get(error?.requiredPattern) ||
      'No coincide con el patrón requerido',
    nullValidator: () => 'No debe tener ningún valor',

    // Errores personalizados
    minItems: (e) =>
      `Debes agregar al menos ${e.required} juegos favoritos (actual: ${e.actual})`,
    maxItems: (e) =>
      `No puedes agregar más de ${e.allowed} juegos favoritos (actual: ${e.actual})`,
    notInArray: () => 'Este valor ya existe en la lista de favoritos', // Para FormControl externos (si aplica)
    duplicate: () => 'Este valor ya está repetido en la lista de favoritos', // Para el FormArray
    duplicates: () =>
      'No se permiten valores duplicados en la lista de favoritos', // Para los FormControl individuales
    fieldsMismatch: () => 'Los campos no coinciden', // Usado por ambos validadores de coincidencia
    emailTaken: () => 'El correo electrónico ya está registrado',
    usernameBlacklisted: () => 'Este nombre de usuario no está permitido',
  };

  /**
   * Devuelve uno o varios mensajes de error legibles para un control.
   * @param control Control de formulario.
   * @param firstOnly Si es true (por defecto), devuelve solo el primer mensaje. Si es false, devuelve todos los mensajes.
   * @returns Un string, un arreglo de strings o null si no hay errores.
   */
  static getErrorMessage(
    control: AbstractControl | null,
    firstOnly: boolean = true
  ): string | string[] | null {
    if (!control || !control.errors) return null;

    const messages: string[] = [];

    for (const [key, value] of Object.entries(control.errors)) {
      const msg = this.errorMessages[key]
        ? this.errorMessages[key](value)
        : `Error desconocido: ${key}`;

      messages.push(msg);

      if (firstOnly) break;
    }

    return firstOnly ? messages[0] : messages;
  }

  // static getErrorMessage(control: AbstractControl | null, firstOnly: boolean = true): string | string[] | null {
  //   if (!control || !control.errors) return null;

  //   const messages: string[] = [];

  //   for (const key of Object.keys(control.errors)) {
  //     const value = control.errors[key];

  //     const msg = this.errorMessages[key]
  //       ? this.errorMessages[key](value)
  //       : `Error desconocido: ${key}`;

  //     messages.push(msg);

  //     if (firstOnly) break;
  //   }

  //   return firstOnly ? messages[0] : messages;
  // }

  /**
   * Verifica si el FormGroup tiene un error específico y que todos los campos relacionados están válidos.
   * Ideal para mostrar errores del grupo (como coincidencia de contraseñas) solo si los campos individuales no tienen errores.
   *
   * @param form FormGroup que contiene los controles.
   * @param errorKey Clave del error que se desea verificar en el grupo.
   * @param fields Controles individuales relacionados con el error.
   */
  static shouldShowGroupError(
    form: FormGroup,
    errorKey: string,
    fields: string[]
  ): boolean {
    const hasGroupError = form.hasError(errorKey);
    if (!hasGroupError) return false;

    return fields.every((fieldName) => {
      const control = form.get(fieldName);
      return control && control.valid;
    });
  }
}
