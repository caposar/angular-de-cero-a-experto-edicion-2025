import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { OnlyLettersDirective } from '@shared/directives/only-letters.directive';
import { delay, finalize } from 'rxjs/operators';
import { ToastService } from 'src/app/components/toast/toast.service';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, ReactiveFormsModule, OnlyLettersDirective],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);
  fb = inject(FormBuilder);

  showPassword = signal(false);

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  formUtils = FormUtils;
  isPosting = signal(false);
  // hasError = signal(false);
  // mensajeError = signal<string>('');

  registerForm = this.fb.group({
    fullName: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
    ],
    email: ['', [Validators.required, Validators.email]],
    // password: ['', [Validators.required, Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$')]], // Pattern: Debe tener más de 6 caracteres, incluidos números, letras minúsculas y mayúsculas.
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).+$'),
      ],
    ],
  });

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();

      // this.mostrarMensajeError('Por favor revise la información ingresada');
      return;
    }

    this.registerUser();
  }

  // registerUser() {
  //   const { email = '', password = '', fullName = '' } = this.registerForm.value;

  //   this.authService.register(email!, password!, fullName!).subscribe((isAuthenticated) => {
  //     if (isAuthenticated) {
  //       this.router.navigateByUrl('/');
  //       return;
  //     }

  //     // this.mostrarMensajeError('Por favor revise la información ingresada');
  //     this.toast.mostrar('Por favor revise la información ingresada', 'error');
  //     return;
  //   });
  // }

  private registerUser() {
    this.isPosting.set(true);

    const { email = '', password = '', fullName = '' } = this.registerForm.value;

    this.authService.register(email!, password!, fullName!)
      .pipe(
        delay(3000),
        finalize(() => this.isPosting.set(false))
      )
      .subscribe((result) => {
        if (result.success) {
          this.router.navigateByUrl('/');
        } else {
          this.toast.mostrar(result.message, 'error');
        }
      });
  }

  // mostrarMensajeError(mensaje: string, delay: number = 2000) {
  //   this.mensajeError.set(mensaje);
  //   this.hasError.set(true);
  //     setTimeout(() => {
  //       this.hasError.set(false);
  //     }, delay);
  // }

  getErrorFullName() {
    const fullNameCtrl = this.registerForm.controls.fullName;

    if (!fullNameCtrl.errors) return '';

    const errorMessages: Record<string, (error?: any) => string> = {
      required: () => 'El nombre es obligatorio',
      minlength: (e) =>
        `El nombre no puede tener menos de ${e.requiredLength} caracteres (actual: ${e.actualLength})`,
      maxlength: (e) =>
        `El nombre no puede tener más de ${e.requiredLength} caracteres (actual: ${e.actualLength})`,
    };

    for (const [key, errorValue] of Object.entries(fullNameCtrl.errors)) {
      const msgFn = errorMessages[key];
      if (msgFn) {
        return msgFn(errorValue);
      }
    }

    return '';
  }

  getErrorEmail() {
    const emailCtrl = this.registerForm.controls.email;
    const errors: Record<string, string> = {
      required: 'El correo electrónico es obligatorio',
      email: 'Ingresa un correo electrónico válido',
    };

    // for (const key in errors) {
    //   if (emailCtrl.hasError(key)) return errors[key];
    // }

    // Forma moderna y clara: Object.entries nos da directamente clave y valor
    for (const [key, value] of Object.entries(errors)) {
      if (emailCtrl.hasError(key)) return value;
    }

    return '';
  }

  getErrorPassword() {
    const passwordCtrl = this.registerForm.controls.password;

    if (passwordCtrl.hasError('required')) {
      return 'La contraseña es obligatoria';
    }

    if (passwordCtrl.hasError('minlength')) {
      return `La contraseña no puede tener menos de ${
        passwordCtrl.getError('minlength').requiredLength
      } caracteres`;
    }

    if (passwordCtrl.hasError('pattern')) {
      return 'La contraseña debe contener al menos un número, una letra minúscula y una mayúscula.';
    }

    return '';
  }

  getTitlePassword() {
    const title =
      'Debe tener más de 6 caracteres, incluidos números, letras minúsculas y mayúsculas';
    return title;
  }
}
