import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Authservice } from './auth.service';

export const AuthInterceptor: HttpInterceptorFn =(req, next)=>{
  const authservice = inject(Authservice);
  const token = authservice.getToken();
  const empresaId = authservice.getEmpresaId();

  const isPublicRoute=
  req.url.includes('/login') || req.url.includes('/register')

  if(isPublicRoute){
    return next(req);
  }

  let headers:{[name: string]: string} = {};

  if(token){
    headers['Authorization'] = `Token ${token}`;
  }

  if(empresaId){
    headers['X-Empresa-ID'] = empresaId.toString();
  }

  const authReq = req.clone({
    setHeaders: headers
  });
  
  return next(authReq);
};  