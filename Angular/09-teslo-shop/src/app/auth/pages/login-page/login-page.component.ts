import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { delay, finalize } from 'rxjs/operators';
import { ToastService } from 'src/app/components/toast/toast.service';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
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

  loginForm = this.fb.group({
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
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      // this.mostrarMensajeError('Por favor revise la información ingresada');
      return;
    }

    this.loginUser();
  }

  // private loginUser() {
  //   const { email = '', password = '' } = this.loginForm.value;

  //   this.authService.login(email!, password!).subscribe((isAuthenticated) => {

  //     if (isAuthenticated) {
  //       this.router.navigateByUrl('/');
  //       return;
  //     }

  //     // this.mostrarMensajeError('Correo y/o contraseña invalidos');
  //     this.toast.mostrar('Correo y/o contraseña invalidos', 'error');
  //     return;
  //   });
  // }

  private loginUser() {
  this.isPosting.set(true);

  const { email = '', password = '' } = this.loginForm.value;

  this.authService.login(email!, password!)
    .pipe(
      delay(3000),
      finalize(() => this.isPosting.set(false)) // Siempre se ejecuta al terminar
    )
    .subscribe((result) => {
      if (result.success) {
        this.router.navigateByUrl('/');
      } else {
        this.toast.show(result.message, 'error');
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

  getErrorEmail() {
    const emailCtrl = this.loginForm.controls.email;
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
    const passwordCtrl = this.loginForm.controls.password;

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
