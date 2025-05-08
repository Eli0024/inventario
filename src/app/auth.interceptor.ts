import { inject, Injectable } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Authservice } from './auth.service';



export const AuthInterceptor: HttpInterceptorFn =(req, next)=>{
  const token = inject(Authservice).getToken();
  if(token){
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Token ${token}`
    }
  });
  return next(authReq);
}

return next(req);
};