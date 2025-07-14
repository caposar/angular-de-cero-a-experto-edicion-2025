import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { registerLocaleData } from '@angular/common';

// 1. Importa los datos de localización para los idiomas/regiones que necesites
//    El nombre del import puede ser cualquiera, pero se recomienda que sea descriptivo (ej: localeEs, localeEsAr, localeFr).
import localeEs from '@angular/common/locales/es';
import localeFr from '@angular/common/locales/fr';
import { LocaleService } from './services/locale.service';

// 2. Registra los datos de localización importados con un identificador (string).
//    Este identificador será usado por Angular para aplicar las reglas de formato de ese idioma/región.
//    Debe coincidir exactamente con el valor que se usará en LOCALE_ID.
registerLocaleData(localeEs, 'es');
registerLocaleData(localeFr, 'fr');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      // 3. Define el identificador de localización por defecto para toda la app.
      //    Debe coincidir con el usado en registerLocaleData.
      provide: LOCALE_ID,
      // useValue: 'es'
      deps: [LocaleService],
      useFactory: (localeService: LocaleService) => {
        // 4. Obtiene el idioma/región preferido del usuario desde el servicio de localización.
        //    Si no hay preferencia, se usa 'es' como valor por defecto.
        return localeService.getLocale || 'es';
      }
    }
  ],
};
