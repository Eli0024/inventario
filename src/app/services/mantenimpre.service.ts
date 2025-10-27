import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mantenimpre } from '../models/mantenim';
import { Observable,throwError } from 'rxjs';
import { Authservice } from '../auth.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class MantenimpreService {

  private apiUrl = 'http://127.0.0.1:8000/mantenimpre/';
    
  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    console.error('Error en MantenimpreService:', error);
    let msg = 'Ocurrió un error inesperado';
    if (error.status === 401) msg = 'No autorizado';
    if (error.status === 404) msg = 'Recurso no encontrado';
    if (error.error?.detail) msg = error.error.detail;
    return throwError(() => new Error(msg));
  }

  // Obtener todos los mantenimientos
  getAll(): Observable<Mantenimpre[]> {
    return this.http.get<Mantenimpre[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }
    
  // Obtener un mantenimiento específico por ID
  getById(id: number): Observable<Mantenimpre> {
    return this.http.get<Mantenimpre>(`${this.apiUrl}${id}/`)
      .pipe(catchError(this.handleError));
  }  
    
  // Obtener mantenimientos por impresora
  getByImpresora(id_impresora: number):  Observable<any> {
    return this.http.get<any>(`${this.apiUrl}por-impresora/${id_impresora}/`)
      .pipe(catchError(this.handleError));
  }
  
  create(mantenimiento: Mantenimpre): Observable<Mantenimpre> {
  
    const datosEnvio = {
      fecha: mantenimiento.fecha,
      descripcion: mantenimiento.descripcion,
      realizado_por: mantenimiento.realizado_por,
      impresora_id: mantenimiento.impresora_id
    };
    return this.http.post<Mantenimpre>(this.apiUrl, datosEnvio)
      .pipe(catchError(this.handleError));
  }
    
    
  update(mantenimiento: Mantenimpre): Observable<Mantenimpre> {
    const datosEnvio = {
      fecha: mantenimiento.fecha,
      descripcion: mantenimiento.descripcion,
      realizado_por: mantenimiento.realizado_por,
      impresora_id: mantenimiento.impresora_id
    };
    return this.http.put<Mantenimpre>(`${this.apiUrl}${mantenimiento.id}/`, datosEnvio)
      .pipe(catchError(this.handleError));
  }

}
    
  
