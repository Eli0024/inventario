import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mantenimpre } from '../models/mantenim';
import { Observable } from 'rxjs/internal/Observable';
import { Authservice } from '../auth.service';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MantenimpreService {

   private apiUrl = 'http://127.0.0.1:8000/mantenimpre/';
   private apiUrl1 = 'http://127.0.0.1:8000/mantenimpre/por-impresora/';
    
      constructor(private http: HttpClient, private authservice: Authservice) { }

      private getHeaders(): HttpHeaders {
        const token = this.authservice.getToken();
        return new HttpHeaders({
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        });
      }
    
      // Obtener todos los mantenimientos
      getAll(): Observable<Mantenimpre[]> {
        return this.http.get<Mantenimpre[]>(this.apiUrl, { headers: this.getHeaders() })
          .pipe(catchError(this.handleError));
      }
    
      // Obtener un mantenimiento específico por ID
      getById(id: number): Observable<Mantenimpre> {
        return this.http.get<Mantenimpre>(`${this.apiUrl}${id}/`, { headers: this.getHeaders() })
          .pipe(catchError(this.handleError));
      }
    
      // Obtener mantenimientos por impresora
      getByImpresora(impresoraId: number): Observable<Mantenimpre[]> {
        return this.http.get<Mantenimpre[]>(
          `${this.apiUrl}por-impresora/${impresoraId}/`,
          { headers: this.getHeaders() }
        ).pipe(catchError(this.handleError));
      }
    
    
      create(mantenimpre:Mantenimpre):Observable<Mantenimpre>{
        return this.http.post<Mantenimpre>(this.apiUrl,mantenimpre);
      }
    
      get(id:number): Observable<any> {
        return this.http.get(`${this.apiUrl}${id}/`);
      }
    
      update(mantenimpre: Mantenimpre): Observable<Mantenimpre> {
        return this.http.put<Mantenimpre>(`${this.apiUrl}${mantenimpre.id}/`, mantenimpre);
      }
    
      delete(id:number): Observable<Mantenimpre> {
        return this.http.delete<Mantenimpre>(`${this.apiUrl}${id}/`);
      }

      private handleError(error: any): Observable<never> {
        console.error('Error en el servicio Mantenimpre:', error);
        let errorMessage = 'Ocurrió un error en el servicio';
        
        if (error.error instanceof ErrorEvent) {
          // Error del lado cliente
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Error del lado servidor
          if (error.status === 401) {
            errorMessage = 'No autorizado. Por favor inicie sesión nuevamente.';
          } else if (error.status === 404) {
            errorMessage = 'Recurso no encontrado.';
          } else if (error.error?.detail) {
            errorMessage = error.error.detail;
          }
        }
        
        return throwError(() => new Error(errorMessage));
      }
    }
    
  
