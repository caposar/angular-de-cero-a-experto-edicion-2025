import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggleComponent } from "../../../components/theme-toggle/theme-toggle.component";
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'front-navbar',
  imports: [RouterLink, RouterLinkActive, ThemeToggleComponent],
  templateUrl: './front-navbar.component.html',
})
export class FrontNavbarComponent {
  authService = inject(AuthService);

  // Propiedad para controlar el estado de apertura/cierre del menú móvil
  isMobileMenuOpen: boolean = false;

  // Función para alternar el estado del menú móvil
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
