import { Routes } from '@angular/router';
import { isAdminGuard } from '@auth/guards/is-admin.guard';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
    canMatch: [
      // () => {
      //   console.log('hola mundo');
      //   return true;
      // },
      NotAuthenticatedGuard,
    ],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin-dashboard/admin-dashboard.routes').then(
        (m) => m.adminDashboardRoutes
      ),
    canMatch: [isAdminGuard],
  },
  {
    path: '',
    loadChildren: () =>
      import('./store-front/store-front.routes').then(
        (m) => m.storeFrontRoutes
      ),
  },
];
