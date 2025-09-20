import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';

import { loggingInterceptor } from '@shared/interceptors/loggin.interceptor';
import { authInterceptor } from '@auth/interceptors/auth.interceptor';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        // loggingInterceptor,
        authInterceptor,
      ])
    ),
    provideAppInitializer(() => {
      const authService = inject(AuthService);

      return firstValueFrom(authService.checkStatus());
    }),
  ],
};
