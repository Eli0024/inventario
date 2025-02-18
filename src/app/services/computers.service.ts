import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Equipo } from '../models/computer';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ComputersService {

  private apiUrl = 'http://127.0.0.1:8000/registrarequipo/';
  

  constructor(private http: HttpClient) { }

  
  getEquipos(): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.apiUrl);
  }

  getEquipo(id: number): Observable<Equipo> {
    return this.http.get<Equipo>(`${this.apiUrl}${id}/`);
  }

  checkSerial(serial: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/equipos/serial/${serial}`);
  }

  // equipo.service.ts
getTotalEquipos(): Observable<number> {
  return this.http.get<number>('http://127.0.0.1:8000/registrarequipo/total');
}


create(equipo: Equipo): Observable<Equipo> {
  const formData = new FormData();

  // Agregar campos principales
  formData.append('id_equipo', equipo.id_equipo?.toString() || '');
  formData.append('marca', equipo.marca);
  formData.append('modelo', equipo.modelo);
  formData.append('memoria', equipo.memoria);
  formData.append('procesador', equipo.procesador);
  formData.append('office', equipo.office);
  formData.append('serial', equipo.serial);
  formData.append('windows', equipo.windows);
  formData.append('sistema_operativo', equipo.sistema_operativo);
  formData.append('fecha_adquisicion', equipo.fecha_adquisicion);
  formData.append('estado', equipo.estado);

  // Agregar campos del responsable
  formData.append('responsable.nombre', equipo.responsable?.nombre || '');
  formData.append('responsable.apellido', equipo.responsable?.apellido || '');

  // Agregar el archivo (si existe)
  if (equipo.archivo) {
    formData.append('archivo', equipo.archivo);
  }

  return this.http.post<Equipo>(`${this.apiUrl}`, formData).pipe(
    catchError(error => {
      console.error('Error en la solicitud:', error);
      alert('Ocurrió un error al crear el equipo. Revisa los campos.');
      return throwError(() => new Error(error));
    })
  );
}


  get(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}/`);
  }

  update(equipo: Equipo): Observable<Equipo> {
    const formData = new FormData();
  
    // Verificar datos del responsable
    if (!equipo.responsable || !equipo.responsable.nombre || !equipo.responsable.apellido) {
      console.error('El campo "responsable" es obligatorio y debe incluir "nombre" y "apellido".');
      alert('Por favor, completa los datos del responsable antes de enviar el formulario.');
      return throwError(() => new Error('El campo "responsable" debe incluir "nombre" y "apellido".'));
    }
  
    // Archivo opcional
    if (equipo.archivo instanceof File) {
      let archivo = equipo.archivo;
      if (archivo.name.length > 100) {
        archivo = new File([archivo], archivo.name.substring(0, 100), { type: archivo.type });
      }
      formData.append('archivo', archivo);
    }
  
    // Agregar datos del responsable
    formData.append('responsable[nombre]', equipo.responsable.nombre);
    formData.append('responsable[apellido]', equipo.responsable.apellido);
  
    // Agregar otros campos
    formData.append('marca', equipo.marca);
    formData.append('memoria', equipo.memoria);
    formData.append('procesador', equipo.procesador);
    formData.append('office', equipo.office);
    formData.append('serial', equipo.serial);
    formData.append('windows', equipo.windows);
    formData.append('sistema_operativo', equipo.sistema_operativo);
    formData.append('fecha_adquisicion', equipo.fecha_adquisicion);
    formData.append('estado', equipo.estado);
  
    return this.http.put<Equipo>(`${this.apiUrl}${equipo.id_equipo}/`, formData).pipe(
      catchError(error => {
        console.error('Error de solicitud:', error);
        alert('Ocurrió un error al enviar los datos. Revisa los campos e intenta de nuevo.');
        return throwError(() => new Error(error));
      })
    );
  }
  
    

  delete(id: number): Observable<Equipo> {
    const token = localStorage.getItem('authToken'); // Recupera el token del almacenamiento local (o de otro lugar seguro)
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Agrega el token al encabezado Authorization
    });
  
    return this.http.delete<Equipo>(`${this.apiUrl}${id}/`, { headers }).pipe(
      catchError(error => {
        console.error('Error al eliminar el registro:', error);
        alert('No se pudo eliminar el registro. Verifica tu autenticación.');
        return throwError(() => new Error(error));
      })
    );
  }
}