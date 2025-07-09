import { Component, inject, model } from '@angular/core';
import { Theme, ThemeService } from '../../services/theme.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-theme-toggle',
  imports: [FormsModule],
  templateUrl: './theme-toggle.component.html',
})
export class ThemeToggleComponent {
  readonly themeService = inject(ThemeService);
  isLight = model(this.themeService.getCurrentTheme()() === 'light');
}
