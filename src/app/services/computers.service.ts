import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Authservice } from '../auth.service';
import { Equipo } from '../models/computer';
import Swal from 'sweetalert2';


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


create(equipo: any): Observable<any> {
  const formData = new FormData();

  // Campos normales
  const camposEquipo = [
    'marca', 'modelo', 'memoria', 'procesador', 
    'office', 'serial', 'sistema_operativo',
    'fecha_adquisicion', 'estado'
  ];

  camposEquipo.forEach(campo => {
    if (equipo[campo] !== undefined && equipo[campo] !== null) {
      formData.append(campo, equipo[campo]);
    }
  });

  // Responsable (solo ID)
  if (equipo.responsable_id) {
    formData.append('responsable_id', equipo.responsable_id.toString());
  } else {
    return throwError(() => new Error('ID de responsable no proporcionado'));
  }

  // Archivo
  if (equipo.archivo instanceof File) {
    formData.append('archivo', equipo.archivo);
  }

  return this.http.post(this.apiUrl, formData, {
    headers: this.getHeaders()
  });
}

  get(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}/`);
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
  
    return this.http.put(`${this.apiUrl}${equipo.id}/`, formData, {
      headers: this.getHeaders()
    });
  }
  
  delete(id: number) {
    const token = localStorage.getItem('token');  // Obtén el token del almacenamiento local
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.http.delete(`http://127.0.0.1:8000/registrarequipo/${id}/`, { headers, withCredentials: true });
  }
}