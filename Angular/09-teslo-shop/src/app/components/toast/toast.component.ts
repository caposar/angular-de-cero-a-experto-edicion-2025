import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
})
export class ToastComponent {
  toastService = inject(ToastService);
}
