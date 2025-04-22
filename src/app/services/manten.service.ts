import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Mantenimiento } from '../models/manten';
import { Authservice } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class MantenService {

  private apiUrl = 'http://127.0.0.1:8000/mantenimiento/';

  constructor(private http: HttpClient, private authservice: Authservice) { }

  private getHeaders(): HttpHeaders {
      const token = this.authservice.getToken();  // Obtén el token de autenticación
      return new HttpHeaders({
        'Authorization': `Token ${token}`,  // Envía el token en el encabezado
      });
    }
    
  getAll(): Observable<Mantenimiento[]> {
    return this.http.get<Mantenimiento[]>(this.apiUrl);
  }

  getMantenimientoById(id: string): Observable<Mantenimiento> {
        return this.http.get<Mantenimiento>(`${this.apiUrl}${id}/`);
      }

  getTotalMantenimientos(): Observable<number> {
    return this.http.get<number>('http://127.0.0.1:8000/mantenimiento/total');
  }

  create(mantenimiento: Mantenimiento): Observable<any> {
    // Validar que exista el responsable
    if (!mantenimiento.responsable?.id) {
      return throwError(() => new Error('ID de responsable no proporcionado'));
    }
  
    // Preparar el objeto a enviar
    const datosEnvio = {
      equipo: mantenimiento.equipo,
      fecha: mantenimiento.fecha,
      tipo: mantenimiento.tipo,
      descripcion: mantenimiento.descripcion,
      responsable_id: mantenimiento.responsable.id  // Solo enviamos el ID
    };
  
    return this.http.post(this.apiUrl, datosEnvio, {
      headers: this.getHeaders()
    });
  }
  
  get(id:number): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}/`);
  }

  update(mantenimiento: any): Observable<any> {
    // 1. Crear objeto para los datos en lugar de FormData
    const datosActualizacion: any = {};
  
    // Campos normales del equipo
    const camposEquipo = ['id', 'equipo', 'fecha', 'tipo', 'descripcion'];
  
    camposEquipo.forEach(campo => {
      if (mantenimiento[campo] !== undefined && mantenimiento[campo] !== null) {
        datosActualizacion[campo] = String(mantenimiento[campo]);
      }
    });
  
    // 2. Envía SOLO el ID del responsable (requerido)
    if (mantenimiento.responsable?.id) {
      datosActualizacion.responsable_id = String(mantenimiento.responsable.id);
    } else {
      return throwError(() => new Error('El ID del responsable es requerido'));
    }
  
    // 3. Archivo si existe (OJO: sin FormData necesitarías otro enfoque para archivos)
    if (mantenimiento.archivo instanceof File) {
      console.warn('Advertencia: Los archivos no se pueden enviar sin FormData');
      // Considera manejar los archivos en un método separado
    }
  
    return this.http.put(`${this.apiUrl}${mantenimiento.id}/`, datosActualizacion, {
      headers: this.getHeaders()
    });
}

  delete(id:number): Observable<Mantenimiento> {
    return this.http.delete<Mantenimiento>(`${this.apiUrl}${id}/`);
  }

}
