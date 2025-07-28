import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';

@Component({
  selector: 'app-switches-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './switches-page.component.html',
})
export class SwitchesPageComponent {

  private fb = inject(FormBuilder);
  formUtils = FormUtils;

  myForm = this.fb.group({
    gender: ['M', Validators.required],
    wantNotifications: [true],
    termAndConditions: [false, Validators.requiredTrue]
  });

  submitForm() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    console.log('Formulario enviado:', this.myForm.value);
  }
}
