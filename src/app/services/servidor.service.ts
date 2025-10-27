import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ContrasenaServidor } from '../models/servidor';
import { Authservice } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ServidorService {

  private apiUrl = 'http://127.0.0.1:8000/contrasena-servidor/';

  constructor(private http: HttpClient) {}


  private handleError(error: any) {
    if (error.status === 401) {
      return throwError(() => new Error('No estás autorizado. Inicia sesión.'));
    } else if (error.status === 404) {
      return throwError(() => new Error('Recurso no encontrado.'));
    } else {
      return throwError(() => new Error('Error del servidor. Intenta más tarde.'));
    }
  }

  getAll(): Observable<ContrasenaServidor[]> {
    return this.http.get<ContrasenaServidor[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  // Obtener una contraseña por ID
  get(id: number): Observable<ContrasenaServidor> {
    return this.http.get<ContrasenaServidor>(`${this.apiUrl}${id}/`)
      .pipe(catchError(this.handleError));
  }

  getTotal(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}total`)
      .pipe(catchError(this.handleError));
  }

  // Crear nueva contraseña (con o sin archivo)
  create(data: FormData): Observable<ContrasenaServidor> {
    return this.http.post<ContrasenaServidor>(this.apiUrl, data)
      .pipe(catchError(this.handleError));
  }


  // Actualizar contraseña (con o sin archivo)
  update(id: number, data: FormData): Observable<ContrasenaServidor> {
    return this.http.put<ContrasenaServidor>(`${this.apiUrl}${id}/`, data)
      .pipe(catchError(this.handleError));
  }

  // Eliminar contraseña
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`)
      .pipe(catchError(this.handleError));
  }
}
