import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { routes } from './app.routes';

export const gurarrutasGuard: CanActivateFn = (route, state) => {
  const cookie = inject(CookieService)
  const router = inject(Router)
  const token = cookie.get('token')
  if(token){
    return true

  }
  alert('No accses')
  router.navigate(['/']);
  return false;
};