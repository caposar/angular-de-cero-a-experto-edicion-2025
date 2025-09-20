import { inject } from '@angular/core';
import { Router, type CanMatchFn } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

// export const isAdminGuard: CanMatchFn = async (route, segments) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   const isAuthenticated = await firstValueFrom(authService.checkStatus());

//   const isAdmin = authService.user()?.roles.includes('admin')

//   console.log('isAdmin: ', isAdmin);
//   console.log('roles: ', authService.user()?.roles);

//   if (!isAdmin) {
//     router.navigateByUrl('/');
//     return false;
//   }

//   return true;
// };

// ¡Ya no es una función 'async'! Se ejecuta instantáneamente.
export const isAdminGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAdmin = authService.isAdmin();

  console.log('isAdmin Guard (síncrono): ', isAdmin);
  console.log('Roles del usuario: ', authService.user()?.roles);

  // Si no es admin, bloqueamos la navegación y redirigimos.
  if (!isAdmin) {
    router.navigateByUrl('/'); // O a la página de login, o a una de "acceso denegado"
    return false;
  }

  // Si es admin, permitimos el paso.
  return true;
};
