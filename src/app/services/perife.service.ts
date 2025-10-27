import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Periferico } from '../models/perife';
import { Observable,throwError } from 'rxjs';
import { map,catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PerifeService {

   private apiUrl = 'http://127.0.0.1:8000/periferico/';
   private apiUrlTotal = 'http://127.0.0.1:8000/perifericos/total';
  
  constructor(private http: HttpClient) { }
  
  getAll(): Observable<Periferico[]> {
    return this.http.get<Periferico[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<Periferico> {
    return this.http.get<Periferico>(`${this.apiUrl}${id}/`)
      .pipe(catchError(this.handleError));
  }  
  
  getPerifericoById(id:string){
    return this.http.get<Periferico>(`${this.apiUrl}${id}/`);
  }
  
  getTotalPerifericos(): Observable<number> {
  return this.http.get<{ total: number }>(this.apiUrlTotal).pipe(
    map(res => res.total),
    catchError(this.handleError)
  );
 }
  
  
  create(periferico: Periferico): Observable<Periferico> {
    if (!periferico.responsable_id) {
      return throwError(() => new Error('El ID del responsable es obligatorio'));
    }

    const datosEnvio = {
      nombre: periferico.nombre,
      modelo: periferico.modelo,
      numero_serie: periferico.numero_serie,
      fecha_adquisicion: periferico.fecha_adquisicion,
      responsable_id: periferico.responsable_id
    };

    return this.http.post<Periferico>(this.apiUrl, datosEnvio)
      .pipe(catchError(this.handleError));
  }

  update(id: number, periferico: Periferico): Observable<Periferico> {
    if (!periferico.responsable_id) {
      return throwError(() => new Error('El ID del responsable es obligatorio'));
    }

    const datosEnvio = {
      nombre: periferico.nombre,
      modelo: periferico.modelo,
      numero_serie: periferico.numero_serie,
      fecha_adquisicion: periferico.fecha_adquisicion,
      responsable_id: periferico.responsable_id
    };

    return this.http.put<Periferico>(`${this.apiUrl}${id}/`, datosEnvio)
      .pipe(catchError(this.handleError));
  }
  
  
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('Error en PerifeService:', error);
    let msg = 'Ocurrió un error inesperado';
    if (error.status === 401) msg = 'No autorizado';
    if (error.status === 404) msg = 'Recurso no encontrado';
    if (error.error?.detail) msg = error.error.detail;
    return throwError(() => new Error(msg));
  }
}
