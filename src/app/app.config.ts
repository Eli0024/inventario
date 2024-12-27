import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthInterceptor } from './auth.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    
    provideHttpClient(withFetch()), provideAnimationsAsync()
 
  ] 
};