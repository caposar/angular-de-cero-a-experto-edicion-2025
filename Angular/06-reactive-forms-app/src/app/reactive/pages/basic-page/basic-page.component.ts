import { CommonModule, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';

@Component({
  selector: 'app-basic-page',
  imports: [JsonPipe, ReactiveFormsModule, CommonModule],
  templateUrl: './basic-page.component.html',
})
export class BasicPageComponent {

  private fb = inject(FormBuilder);

  formUtils = FormUtils;

  myForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    price: [0, [Validators.required, Validators.min(10)]],
    inStorage: [0, [Validators.required, Validators.min(0)]],
  });

  onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    console.log('Formulario enviado:', this.myForm.value);

    this.myForm.reset({
      name: '',
      price: 0,
      inStorage: 0,
    });
  }
}
