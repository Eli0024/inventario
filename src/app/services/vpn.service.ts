import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ContrasenaVPN } from '../models/vpn';
import { Authservice } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class VpnService {

  private apiUrl = 'http://127.0.0.1:8000/contrasena-vpn/';

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

  getAll(): Observable<ContrasenaVPN[]> {
    return this.http.get<ContrasenaVPN[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  get(id: number): Observable<ContrasenaVPN> {
    return this.http.get<ContrasenaVPN>(`${this.apiUrl}${id}/`)
      .pipe(catchError(this.handleError));
  }

  getTotal(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}total`)
      .pipe(catchError(this.handleError));
  }

  create(formData: FormData): Observable<ContrasenaVPN> {
    return this.http.post<ContrasenaVPN>(this.apiUrl, formData)
      .pipe(catchError(this.handleError));
  }

  update(id: number, formData: FormData): Observable<ContrasenaVPN> {
    return this.http.put<ContrasenaVPN>(`${this.apiUrl}${id}/`, formData)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}${id}/`)
      .pipe(catchError(this.handleError));
  }
}
