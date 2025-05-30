import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { urlPrefixInterceptor } from './shared/interceptors/url-prefix.interceptor';
import { messageAndErrorInterceptor } from './shared/interceptors/message-and-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        urlPrefixInterceptor, messageAndErrorInterceptor

      ]),
    )
  ]
};
