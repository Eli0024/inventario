import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Licence } from '../models/licence';
import { Authservice } from '../auth.service';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({
  providedIn: 'root'
})
export class LicenceService {

  private apiUrl = 'http://127.0.0.1:8000/licencias/';

  constructor(private http: HttpClient, private authservice: Authservice) { }

  getLicence(id: number): Observable<Licence> {
      return this.http.get<Licence>(`${this.apiUrl}${id}/`);
    }

  getLicenciaById(id: string): Observable<Licence> {
      return this.http.get<Licence>(`${this.apiUrl}${id}/`);
    }

  getAll(): Observable<Licence[]> {
    return this.http.get<Licence[]>(this.apiUrl);
  }

  getTotalLicencias(): Observable<number> {
    return this.http.get<number>('http://127.0.0.1:8000/registrarlicencia/total');
  }

  private getHeaders(): HttpHeaders {
        const token = this.authservice.getToken();  // Obtén el token de autenticación
        return new HttpHeaders({
          'Authorization': `Token ${token}`,  // Envía el token en el encabezado
        });
      }

  create(licence: Licence): Observable<any> {
      // Validar que exista el responsable
      if (!licence.responsable?.id) {
        return throwError(() => new Error('ID de responsable no proporcionado'));
      }
    
      // Preparar el objeto a enviar
      const datosEnvio = {
        correo: licence.correo,
        contrasena: licence.contrasena,
        serial_office: licence.serial_office,
        responsable_id: licence.responsable.id  // Solo enviamos el ID
      };
    
      return this.http.post(this.apiUrl, datosEnvio, {
        headers: this.getHeaders()
      });
    }
    

  get(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}/`);  // Aquí se debe pasar un id válido
  }
  
  update(licence: any): Observable<any> {
    // 1. Crear objeto para los datos en lugar de FormData
    const datosActualizacion: any = {};
  
    // Campos normales del equipo
    const camposEquipo = ['id', 'correo', 'contrasena', 'serial_office'];
  
    camposEquipo.forEach(campo => {
      if (licence[campo] !== undefined && licence[campo] !== null) {
        datosActualizacion[campo] = String(licence[campo]);
      }
    });
  
    // 2. Envía SOLO el ID del responsable (requerido)
    if (licence.responsable?.id) {
      datosActualizacion.responsable_id = String(licence.responsable.id);
    } else {
      return throwError(() => new Error('El ID del responsable es requerido'));
    }
    
    return this.http.put(`${this.apiUrl}${licence.id}/`, datosActualizacion, {
      headers: this.getHeaders()
    });
}

  delete(id: number): Observable<Licence> {
    return this.http.delete<Licence>(`${this.apiUrl}${id}/`);
  }

}
