import { Routes } from '@angular/router';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';
import { APP_BASE_TITLE } from './shared/constants/app.constants';

export const routes: Routes = [
  {
    path: '',
    title: `${APP_BASE_TITLE} - Bienvenido`,
    // loadComponent: () => import('./shared/pages/home-page/home-page.component').then(m => m.HomePageComponent),
    component: HomePageComponent
  },
  {
    path: 'country',
    loadChildren: () => import('./country/country.routes').then(m => m.countryRoutes)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
