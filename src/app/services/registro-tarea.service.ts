import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RegistroTarea } from '../models/registro-tarea';
@Injectable({
  providedIn: 'root'
})
export class RegistroTareaService {
  private apiUrl = 'http://localhost:8000/registro-tarea/';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-Empresa-ID': localStorage.getItem('empresa_id') || ''  // multiempresa
    });
  }

  getAll(): Observable<RegistroTarea[]> {
    return this.http.get<RegistroTarea[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  get(id: number): Observable<RegistroTarea> {
    return this.http.get<RegistroTarea>(`${this.apiUrl}${id}/`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  create(descripcion: string): Observable<RegistroTarea> {
    return this.http.post<RegistroTarea>(this.apiUrl, { descripcion }, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  update(id: number, descripcion: string): Observable<RegistroTarea> {
    return this.http.patch<RegistroTarea>(`${this.apiUrl}${id}/`, { descripcion }, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('Error en RegistroTareaService:', error);
    return throwError(() => error);
  }
}
