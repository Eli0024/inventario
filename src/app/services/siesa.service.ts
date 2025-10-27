import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, Observable } from 'rxjs';
import { ContrasenaSiesa } from '../models/siesa';
import { Authservice } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class SiesaService {

  private apiUrl = 'http://127.0.0.1:8000/contrasena-siesa/';

  constructor(private http: HttpClient) {}


  private handleError(error: any) {
    console.error('Error en SiesaService:', error);
    let msg = 'Ocurrió un error inesperado';
    if (error.status === 401) msg = 'No autorizado';
    if (error.status === 404) msg = 'Recurso no encontrado';
    if (error.error?.detail) msg = error.error.detail;
    return throwError(() => new Error(msg));
  }

 getAll(): Observable<ContrasenaSiesa[]> {
    return this.http.get<ContrasenaSiesa[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  // Obtener total de contraseñas
  getTotal(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}total/`)
      .pipe(catchError(this.handleError));
  }

  // Obtener contraseña por ID
  get(id: number): Observable<ContrasenaSiesa> {
    return this.http.get<ContrasenaSiesa>(`${this.apiUrl}${id}/`)
      .pipe(catchError(this.handleError));
  }

  // Crear contraseña
  create(formData: FormData): Observable<ContrasenaSiesa> {
    return this.http.post<ContrasenaSiesa>(this.apiUrl, formData)
  }

  // Actualizar contraseña
  update(id: number, formData: FormData): Observable<any> {
  return this.http.put(`${this.apiUrl}${id}/`, formData);
}

  // Eliminar contraseña
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`)
      .pipe(catchError(this.handleError));
  }
}