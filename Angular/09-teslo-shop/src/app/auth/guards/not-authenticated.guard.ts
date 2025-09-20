import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

// export const NotAuthenticatedGuard: CanMatchFn = async (
//   route: Route,
//   segments: UrlSegment[]
// ) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   const isAuthenticated = await firstValueFrom(authService.checkStatus());

//   if (isAuthenticated) {
//     router.navigateByUrl('/');
//     return false;
//   }

//   return true;
// }

// ¡Ya no es 'async'! Es instantáneo.
export const NotAuthenticatedGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Leemos el estado de autenticación directamente de la señal computada.
  // Este valor ya fue establecido al iniciar la aplicación.
  const authStatus = authService.authStatus();

  console.log('NotAuthenticated Guard (síncrono), status:', authStatus);

  // Si el usuario está autenticado, no debe ver esta página (ej: /login).
  if (authStatus === 'authenticated') {
    // Es buena práctica redirigirlo al dashboard o a la página principal de la app.
    router.navigateByUrl('/dashboard');
    return false;
  }

  // Si no está autenticado, se le permite el paso.
  // El estado 'checking' se resolverá antes de que el guard se ejecute gracias al provideAppInitializer,
  // por lo que en la práctica, aquí el estado solo será 'not-authenticated'.
  return true;
};
