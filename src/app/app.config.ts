import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors,withFetch } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { CookieService } from 'ngx-cookie-service';

console.log ("app.config cargado");

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideToastr({
     timeOut:3000,
     positionClass:'toast-top-right',
     preventDuplicates:true,
    }),
    provideHttpClient(
    withFetch(),
    withInterceptors([AuthInterceptor])),
    CookieService
    
  ] 
};

export const BASE_URD='http://localhost:8000/api/';