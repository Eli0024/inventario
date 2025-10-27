import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,throwError } from 'rxjs';
import { Impresora } from '../models/imprer';
import { Authservice } from '../auth.service';
import {map,catchError} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ImprerService {

  private apiUrl = 'http://127.0.0.1:8000/impresora/';

  constructor(private http: HttpClient, private authservice: Authservice) { }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la petición:', error);
    return throwError(() => new Error('Error en la petición, intente de nuevo más tarde.'));
  }


  private getHeaders(): HttpHeaders {
    const token = this.authservice.getToken();
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }
    return new HttpHeaders({
      'Authorization': `Token ${token}`,
    });
  }

 getAll(): Observable<Impresora[]> {
   return this.http.get<Impresora[]>(this.apiUrl)
    .pipe(catchError(this.handleError));
 }


  getTotalImpresoras(): Observable<number> {
  return this.http.get<{ total: number }>('http://127.0.0.1:8000/impresora/total/').pipe(
    map(res => res.total)
  );
}

  create(impresora: Impresora): Observable<Impresora> {
    const datosEnvio:any = {
     nombre: impresora.nombre,
     direccion_ip: impresora.direccion_ip
  };

   return this.http.post<Impresora>(this.apiUrl, datosEnvio, {
    headers: this.getHeaders(),
  });
}


  get(id: number): Observable<Impresora> {
    const empresa = localStorage.getItem('empresa') || '';
    return this.http.get<Impresora>(`${this.apiUrl}${id}/`, {
      headers: this.getHeaders(),
    });
  }

  update(impresora: Impresora): Observable<Impresora> {
    const datosEnvio:any = {
      nombre: impresora.nombre,
      direccion_ip: impresora.direccion_ip
   };
    return this.http.put<Impresora>(`${this.apiUrl}${impresora.id}/`, datosEnvio, {
      headers: this.getHeaders(),
    });
  }

  delete(id: number): Observable<Impresora> {
    const empresa = localStorage.getItem('empresa') || '';
    return this.http.delete<Impresora>(`${this.apiUrl}${id}/`, {
      headers: this.getHeaders(),
    });
  }
}
