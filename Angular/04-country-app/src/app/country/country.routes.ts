import { Routes } from "@angular/router";
import { ByCapitalPageComponent } from "./pages/by-capital-page/by-capital-page.component";
import { CountryLayoutComponent } from "./layouts/CountryLayout/CountryLayout.component";
import { CountryPageComponent } from "./pages/country-page/country-page.component";
import { APP_BASE_TITLE } from "../shared/constants/app.constants";

export const countryRoutes: Routes = [
  {
    path: '',
    component: CountryLayoutComponent,
    children: [
      {
        path: 'by-capital',
        title: `${APP_BASE_TITLE} - Por Capital`,
        component: ByCapitalPageComponent
      },
      {
        path: 'by-country',
        title: `${APP_BASE_TITLE} - Por Nombre`,
        loadComponent: () => import('./pages/by-country-page/by-country-page.component').then(m => m.ByCountryPageComponent)
      },
      {
        path: 'by-region',
        title: `${APP_BASE_TITLE} - Por Región`,
        loadComponent: () => import('./pages/by-region-page/by-region-page.component').then(m => m.ByRegionPageComponent)
      },
      {
        path: 'by-code/:code',
        title: `${APP_BASE_TITLE} - Detalles`,
        component: CountryPageComponent
      },
      {
        path: '**',
        redirectTo: 'by-capital'
      }
    ]
  }
];
