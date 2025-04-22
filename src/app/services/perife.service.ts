import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Periferico } from '../models/perife';
import { Observable } from 'rxjs/internal/Observable';
import { Authservice } from '../auth.service';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerifeService {

   private apiUrl = 'http://127.0.0.1:8000/periferico/';
  
    constructor(private http: HttpClient, private authservice: Authservice) { }
  
    getAll(): Observable<Periferico[]> {
      return this.http.get<Periferico[]>(this.apiUrl);
    }

    getPerifericoById(id: string): Observable<Periferico> {
          return this.http.get<Periferico>(`${this.apiUrl}${id}/`);
        }
  
    getTotalPerifericos(): Observable<number> {
      return this.http.get<number>('http://127.0.0.1:8000/perifericos/total');
    }
  
    private getHeaders(): HttpHeaders {
            const token = this.authservice.getToken();  // Obtén el token de autenticación
            return new HttpHeaders({
              'Authorization': `Token ${token}`,  // Envía el token en el encabezado
            });
          }
    
      create(periferico: Periferico): Observable<any> {
          // Validar que exista el responsable
          if (!periferico.responsable?.id) {
            return throwError(() => new Error('ID de responsable no proporcionado'));
          }
        
          // Preparar el objeto a enviar
          const datosEnvio = {
            nombre: periferico.nombre,
            modelo: periferico.modelo,
            numero_serie: periferico.numero_serie,
            fecha_adquisicion: periferico.fecha_adquisicion,
            responsable_id: periferico.responsable.id  // Solo enviamos el ID
          };
        
          return this.http.post(this.apiUrl, datosEnvio, {
            headers: this.getHeaders()
          });
        }
  
    get(id:number): Observable<any> {
      return this.http.get(`${this.apiUrl}${id}/`);
    }
  
    update(periferico: any): Observable<any> {
        // 1. Crear objeto para los datos en lugar de FormData
        const datosActualizacion: any = {};
      
        // Campos normales del equipo
        const camposEquipo = ['id', 'nombre', 'modelo', 'numero_serie','fecha_adquisicion'];
      
        camposEquipo.forEach(campo => {
          if (periferico[campo] !== undefined && periferico[campo] !== null) {
            datosActualizacion[campo] = String(periferico[campo]);
          }
        });
      
        // 2. Envía SOLO el ID del responsable (requerido)
        if (periferico.responsable?.id) {
          datosActualizacion.responsable_id = String(periferico.responsable.id);
        } else {
          return throwError(() => new Error('El ID del responsable es requerido'));
        }
        
        return this.http.put(`${this.apiUrl}${periferico.id}/`, datosActualizacion, {
          headers: this.getHeaders()
        });
    }
  
    delete(id:number): Observable<Periferico> {
      return this.http.delete<Periferico>(`${this.apiUrl}${id}/`);
    }
  
  }
