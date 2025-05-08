import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors,withFetch } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { CookieService } from 'ngx-cookie-service';

console.log ("app.config cargado");

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
    withFetch(),
    withInterceptors([AuthInterceptor])),
    CookieService
    
  ] 
};