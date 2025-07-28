import { CommonModule, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';
import { matchFieldsValidator } from '../../../utils/validators/match-fields.validator';
import { emailTakenValidator } from '../../../utils/validators/email-taken.validator';
import { usernameBlacklistedValidator } from '../../../utils/validators/username-blacklisted.validator';

@Component({
  selector: 'app-register-page',
  imports: [JsonPipe, ReactiveFormsModule, CommonModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  private fb = inject(FormBuilder);
  formUtils = FormUtils;

  myForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(FormUtils.fullNamePattern)]],
    email: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)], [emailTakenValidator()]],
    username: ['', [Validators.required, Validators.minLength(6), Validators.pattern(FormUtils.alphanumericPattern), usernameBlacklistedValidator(['admin', 'root', 'testuser', 'moderator'])]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    password2: ['', [Validators.required, Validators.minLength(6)]],
  }, {
    validators: matchFieldsValidator('password', 'password2')
  });

  submitForm() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    console.log('Formulario enviado:', this.myForm.value);
  }
}
