import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Authservice } from './auth.service';



export const AuthInterceptor: HttpInterceptorFn =(req, next)=>{
  const token = inject(Authservice).getToken();
  const authreq = req.clone({
    setHeaders: {
      Authorization: `Token ${token}`
    }
  });

  return next(authreq);

};