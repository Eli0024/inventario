import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError,catchError } from 'rxjs';
import { Mantenimiento } from '../models/manten';
import { Authservice } from '../auth.service';
import {map} from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})
export class MantenService {

  private apiUrl = 'http://127.0.0.1:8000/mantenimiento/';

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    if (error.status===401) {
      return throwError(() => new Error('No autorizado. Por favor, inicie sesión.'));
    }
    else if (error.status===404) {
      return throwError(() => new Error('Recurso no encontrado.'));
    }
    else {
      return throwError(() => new Error('Ocurrió un error inesperado.'));
    }
  }
    
  getAll(): Observable<Mantenimiento[]> {
    return this.http.get<Mantenimiento[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  // Obtener mantenimiento por ID
  getMantenimientoById(id: string): Observable<Mantenimiento> {
    return this.http.get<Mantenimiento>(`${this.apiUrl}${id}/`)
      .pipe(catchError(this.handleError));
  }

  getMantenimientoPorEquipo(equipoId: number): Observable<Mantenimiento[]> {
    return this.http.get<Mantenimiento[]>(`${this.apiUrl}/equipo${equipoId}/`)
      .pipe(catchError(this.handleError));
  }

  // Obtener total de mantenimientos (para la card del dashboard)
  getTotalMantenimientos(): Observable<number> {
  return this.http.get<{ total: number }>('http://127.0.0.1:8000/mantenimiento/total/').pipe(
    map(res => res.total)
  );
}

  // Crear un nuevo mantenimiento
  create(mantenimiento: Mantenimiento): Observable<any> {

    const datosEnvio = {
      equipo_id:mantenimiento.equipo_id,
      fecha_mantenimiento: mantenimiento.fecha_mantenimiento,
      tipo_mantenimiento: mantenimiento.tipo_mantenimiento,
      tipo_servicio: mantenimiento.tipo_servicio,
      descripcion: mantenimiento.descripcion,
      realizado_por: mantenimiento.realizado_por
    };

    return this.http.post(this.apiUrl, datosEnvio)
      .pipe(catchError(this.handleError));
  }

  // Actualizar mantenimiento
  update(mantenimiento: any): Observable<any> {
    const datosActualizacion: any = {};

    const campos = [
      'id', 'equipo_id', 'fecha_mantenimiento',
      'tipo_mantenimiento', 'tipo_servicio',
      'descripcion', 'realizado_por'
    ];

    campos.forEach(campo => {
      if (mantenimiento[campo] !== undefined && mantenimiento[campo] !== null) {
        datosActualizacion[campo] = mantenimiento[campo];
      }
    });

     if (datosActualizacion.tipo_mantenimiento) {
    datosActualizacion.tipo_mantenimiento = datosActualizacion.tipo_mantenimiento.toLowerCase();
  }
  if (datosActualizacion.tipo_servicio) {
    datosActualizacion.tipo_servicio = datosActualizacion.tipo_servicio.toLowerCase();
  }

    return this.http.patch(`${this.apiUrl}${mantenimiento.id}/`, datosActualizacion)
      .pipe(catchError(this.handleError));
  }

  // Eliminar mantenimiento
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`)
      .pipe(catchError(this.handleError));
  }
}