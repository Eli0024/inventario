import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Authservice } from '../auth.service';
import { Equipo } from '../models/computer';


@Injectable({
  providedIn: 'root'
})
export class ComputersService {

  private apiUrl = 'http://127.0.0.1:8000/registrarequipo/';
  
  

  constructor(private http: HttpClient, private authservice : Authservice) { }

  
  private getHeaders(): HttpHeaders {
    const token = this.authservice.getToken();  // Obtén el token de autenticación
    return new HttpHeaders({
      'Authorization': `Token ${token}`,  // Envía el token en el encabezado
    });
  }

  getEquipoPorColaborador(id: string): Observable<Equipo> {
    const headers = this.getHeaders();  // Obtiene los headers con el token de autenticación
    return this.http.get<Equipo>(`${this.apiUrl}por-colaborador/${id}/`, { headers }).pipe(
      catchError(error => {
        if (error.status === 404) {
          console.error('Equipo no encontrado:', error);
          alert('No se encontró ningún equipo para este colaborador.');
        } else if (error.status === 401) {
          console.error('No autorizado:', error);
          alert('No tienes permiso para acceder a este recurso. Verifica tu autenticación.');
        } else {
          console.error('Error al obtener el equipo:', error);
          alert('Ocurrió un error al obtener el equipo. Intenta de nuevo.');
        }
        return throwError(() => new Error(error));  // Relanza el error para que el componente lo maneje
      })
    );
  }

  getEquipos(): Observable<Equipo[]> {
    const headers = this.getHeaders();  // Obtén los headers con el token
    return this.http.get<Equipo[]>(this.apiUrl, { headers }).pipe(
      catchError(error => {
        console.error('Error al obtener los equipos:', error);
        alert('No se pudieron obtener los equipos. Verifica tu autenticación.');
        return throwError(() => new Error(error));
      })
    );
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
  formData.append('id_equipo', equipo.id?.toString() || '');
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
  
    return this.http.put<Equipo>(`${this.apiUrl}${equipo.id}/`, formData).pipe(
      catchError(error => {
        console.error('Error de solicitud:', error);
        alert('Ocurrió un error al enviar los datos. Revisa los campos e intenta de nuevo.');
        return throwError(() => new Error(error));
      })
    );
  }
  

  delete(id: number) {
    const token = localStorage.getItem('token');  // Obtén el token del almacenamiento local
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.http.delete(`http://127.0.0.1:8000/registrarequipo/${id}/`, { headers, withCredentials: true });
  }
}