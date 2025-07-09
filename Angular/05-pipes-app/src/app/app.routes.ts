import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'basic',
    title: 'Pipes Básicos',
    loadComponent: () => import('./pages/basic-page/basic-page.component').then(m => m.BasicPageComponent)
  },
  {
    path: 'numbers',
    title: 'Numbers Pipe',
    loadComponent: () => import('./pages/numbers-page/numbers-page.component').then(m => m.NumbersPageComponent)
  },
  {
    path: 'uncommon',
    title: 'Pipes no tan comunes',
    loadComponent: () => import('./pages/uncommon-page/uncommon-page.component').then(m => m.UncommonPageComponent)
  },
  {
    path: 'custom',
    title: 'Pipes Personalizados',
    loadComponent: () => import('./pages/custom-page/custom-page.component').then(m => m.CustomPageComponent)
  },
  {
    path: '**',
    redirectTo: 'basic',
  },
];
