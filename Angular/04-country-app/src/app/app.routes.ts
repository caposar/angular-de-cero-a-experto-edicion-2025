import { Routes } from '@angular/router';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';

export const routes: Routes = [
  {
    path: '',
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
