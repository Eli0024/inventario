import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Evento } from '../models/evento';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  private apiUrl = 'http://127.0.0.1:8000/eventos/';

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    if (error.status === 401) {
      return throwError(() => new Error('No autorizado. Por favor, inicie sesión.'));
    } else if (error.status === 404) {
      return throwError(() => new Error('Recurso no encontrado.'));
    } else {
      return throwError(() => new Error('Ocurrió un error inesperado.'));
    }
  }

  // Obtener todos los eventos
  getAll(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  // Obtener un evento por ID
  getById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.apiUrl}${id}/`)
      .pipe(catchError(this.handleError));
  }

  create(evento: Omit<Evento, 'id'>): Observable<Evento> {
    return this.http.post<Evento>(this.apiUrl, evento)
      .pipe(catchError(this.handleError));
  }

  update(id: number, evento: Partial<Evento>): Observable<Evento> {
    return this.http.put<Evento>(`${this.apiUrl}${id}/`, evento)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`)
      .pipe(catchError(this.handleError));
  }
}
