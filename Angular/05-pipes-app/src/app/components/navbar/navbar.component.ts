import { Component } from '@angular/core';
import { routes } from '../../app.routes';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggleComponent } from "../theme-toggle/theme-toggle.component";

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, ThemeToggleComponent],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  // Mapea tus rutas para usarlas en el @for loop en el HTML
  routes = routes.map(route => ({
    title: route.title ?? '',
    path: route.path ?? ''
  }));

  // Propiedad para controlar el estado de apertura/cierre del menú móvil
  isMobileMenuOpen: boolean = false;

  // Función para alternar el estado del menú móvil
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
