import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Authservice } from '../auth.service';
import { Equipo } from '../models/computer';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ComputersService {
  

  private apiUrl = 'http://127.0.0.1:8000/registrarequipo/';
  

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    if (error.status === 401) {
      return throwError(() => new Error('No autorizado. Por favor, inicia sesión.'));
    } else if (error.status === 404) {
      return throwError(() => new Error('Recurso no encontrado.'));
    } else { 
      return throwError(() => new Error('Ocurrió un error. Intenta de nuevo.'));
    }
  }

  getEquipoPorColaborador(id: string): Observable<Equipo[]> {
  return this.http.get<Equipo[]>(`${this.apiUrl}por-colaborador/${id}/`).pipe(
    catchError(error => {
      if (error.status === 404) {
        alert('No se encontró ningún equipo para este colaborador.');
      } else if (error.status === 401) {
        alert('No tienes permiso para acceder a este recurso.');
      } else {
        alert('Ocurrió un error al obtener el equipo.');
      }
      return throwError(() => new Error(error));
    })
  );
 }


 getEquipos(): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getEquipo(id: number): Observable<Equipo> {
    return this.http.get<Equipo>(`${this.apiUrl}${id}/`)
    .pipe(catchError(this.handleError));
  }

  checkSerial(serial: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}equipos/serial/${serial}`);
  }

  // equipo.service.ts
getTotalEquipos(): Observable<number> {
  return this.http.get<{ total: number }>('http://127.0.0.1:8000/registrarequipo/total/').pipe(
    map(res => res.total)
  );
}


create(formData: FormData): Observable<any> {
  return this.http.post(this.apiUrl, formData)
}

  
update(equipo: any): Observable<any> {
    const formData = new FormData();
  
    // 1. Campos normales del equipo
    const camposEquipo = [
      'id', 'marca', 'modelo', 'memoria', 'procesador',
      'office', 'serial', 'sistema_operativo',
      'fecha_adquisicion', 'estado'
    ];
  
    camposEquipo.forEach(campo => {
      if (equipo[campo] !== undefined && equipo[campo] !== null) {
        formData.append(campo, String(equipo[campo]));
      }
    });
  
    // 2. Envía SOLO el ID del responsable (requerido)
    if (equipo.responsable?.id) {
      formData.append('responsable_id', String(equipo.responsable.id));
    } else {
      throw new Error('El ID del responsable es requerido');
    }
  
    // 3. Archivo si existe
    if (equipo.archivo instanceof File) {
      formData.append('archivo', equipo.archivo);
    }
  
    return this.http.put(`${this.apiUrl}${equipo.id}/`, formData)
    
  }
  
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}