import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ContrasenaAntivirus } from '../models/antivirus';
import { Authservice } from '../auth.service';

export interface AntivirusResponse {
  results: ContrasenaAntivirus[];
  count: number;
  next: string | null;
  previous: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AntivirusService {

  private apiUrl = 'http://127.0.0.1:8000/contrasena-antivirus/';

  constructor(private http: HttpClient, private authservice: Authservice) {}

  private getHeaders(): HttpHeaders {
    const token = this.authservice.getToken();
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }
    return new HttpHeaders({
      'Authorization': `Token ${token}`,
    });
  }

  private handleError(error: any) {
    if (error.status === 401) {
      return throwError(() => new Error('No estás autorizado. Inicia sesión.'));
    } else if (error.status === 404) {
      return throwError(() => new Error('Recurso no encontrado.'));
    } else {
      return throwError(() => new Error('Error del servidor. Intenta más tarde.'));
    }
  }

  getAll(): Observable<ContrasenaAntivirus[]> {
    return this.http.get<ContrasenaAntivirus[]>(this.apiUrl) 
     .pipe(catchError(this.handleError));
  }

  getAntivirus(): Observable<ContrasenaAntivirus[]> {
    return this.getAll();
  }

  get(id: number): Observable<ContrasenaAntivirus> {
    return this.http.get<ContrasenaAntivirus>(`${this.apiUrl}${id}/`)
     .pipe(catchError(this.handleError));
  }

  getTotal(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}total/`)
     .pipe(catchError(this.handleError));
  }

 create(formData: FormData): Observable<ContrasenaAntivirus> {
  return this.http.post<ContrasenaAntivirus>(this.apiUrl, formData)
    .pipe(catchError(this.handleError));
 }


  update(id: number, formData: FormData): Observable<ContrasenaAntivirus> {
  return this.http.put<ContrasenaAntivirus>(`${this.apiUrl}${id}/`, formData)
  .pipe(catchError(this.handleError));
}


  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}${id}/`)
    .pipe(catchError(this.handleError));
  }
}
