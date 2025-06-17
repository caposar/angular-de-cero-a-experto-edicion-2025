import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // HashLocationStrategy, // Estrategia antigua, no recomendada en Angular moderno. La mejor práctica es usar PathLocationStrategy.
    // { provide: LocationStrategy,
    //   useClass: HashLocationStrategy
    // }

    // En desarrollo: No necesitas hacer nada especial, Angular ya usa PathLocationStrategy.
    // En producción (deploy):
    // Debes asegurarte de que tu servidor web (por ejemplo, Vercel, Netlify, Firebase, etc.) redirija todas las rutas a tu index.html.
    // Para esto, se suele usar un archivo llamado _redirects (en Netlify) o la configuración equivalente en otros servidores.
  ]
};
